function has(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function getType(target) {
  return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}

function isNamespaced(path) {
  if (!path.node) return false;
  const binding = path.scope.getBinding(path.node.name);
  if (!binding) return false;
  return binding.path.isImportNamespaceSpecifier();
}

function resolveKey(path, computed) {
  const {node, parent, scope} = path;
  if (path.isStringLiteral()) return node.value;
  const {name} = node;
  const isIdentifier = path.isIdentifier();
  if (isIdentifier && !(computed || parent.computed)) return name;
  if (!isIdentifier || scope.getBindingIdentifier(name)) {
    const {value} = path.evaluate();
    if (typeof value === "string") return value;
  }
}

function resolveSource(path) {
  const {node, scope} = path;
  let builtIn, instanceType;
  if (node) {
    builtIn = node.name;
    if (!path.isIdentifier() || scope.getBindingIdentifier(builtIn)) {
      const {deopt, value} = path.evaluate();
      if (value !== undefined) {
        instanceType = getType(value);
      } else if (deopt && deopt.isIdentifier()) {
        builtIn = deopt.node.name;
      }
    }
  }
  return {builtIn, instanceType, isNamespaced: isNamespaced(path)};
}

// https://raw.githubusercontent.com/babel/babel/master/packages/babel-preset-env/src/polyfills/corejs3/usage-plugin.js

export default (polyfills, flags, definitions) => function ({types: t}) {
  const {
    BuiltIns,
    StaticProperties,
    InstanceProperties,
    PromiseDependencies,
    CommonIterators,
    PossibleGlobalObjects,
    CommonInstanceDependencies,
  } = definitions;

  const addAndRemovePolyfillImports = {
    // require('core-js')
    // Program: {
    //   exit(path) {
    //     const filtered = intersection(polyfills, this.polyfillsSet, available);
    //     const reversed = Array.from(filtered).reverse();
    //
    //     for (const module of reversed) {
    //       // Program:exit could be called multiple times.
    //       // Avoid injecting the polyfills twice.
    //       if (!this.injectedPolyfills.has(module)) {
    //         createImport(path, module);
    //       }
    //     }
    //
    //     filtered.forEach(module => this.injectedPolyfills.add(module));
    //   },
    // },

    // import('something').then(...)
    Import() {
      this.addUnsupported(PromiseDependencies);
    },

    Function({node}) {
      // (async function () { }).finally(...)
      if (node.async) {
        this.addUnsupported(PromiseDependencies);
      }
    },

    // for-of, [a, b] = c
    "ForOfStatement|ArrayPattern"() {
      this.addUnsupported(CommonIterators);
    },

    // [...spread]
    SpreadElement({parentPath}) {
      if (!parentPath.isObjectExpression()) {
        this.addUnsupported(CommonIterators);
      }
    },

    // yield*
    YieldExpression({node}) {
      if (node.delegate) {
        this.addUnsupported(CommonIterators);
      }
    },

    // Symbol(), new Promise
    ReferencedIdentifier({node: {name}, scope}) {
      if (scope.getBindingIdentifier(name)) return;

      this.addBuiltInDependencies(name);
    },

    MemberExpression(path) {
      const source = resolveSource(path.get("object"));
      const key = resolveKey(path.get("property"));

      // Object.entries
      // [1, 2, 3].entries
      this.addPropertyDependencies(source, key);
    },

    ObjectPattern(path) {
      const {parentPath, parent, key} = path;
      let source;

      // const { keys, values } = Object
      if (parentPath.isVariableDeclarator()) {
        source = resolveSource(parentPath.get("init"));
        // ({ keys, values } = Object)
      } else if (parentPath.isAssignmentExpression()) {
        source = resolveSource(parentPath.get("right"));
        // !function ({ keys, values }) {...} (Object)
        // resolution does not work after properties transform :-(
      } else if (parentPath.isFunctionExpression()) {
        const grand = parentPath.parentPath;
        if (grand.isCallExpression() || grand.isNewExpression()) {
          if (grand.node.callee === parent) {
            source = resolveSource(grand.get("arguments")[key]);
          }
        }
      }

      for (const property of path.get("properties")) {
        if (property.isObjectProperty()) {
          const key = resolveKey(property.get("key"));
          // const { keys, values } = Object
          // const { keys, values } = [1, 2, 3]
          this.addPropertyDependencies(source, key);
        }
      }
    },

    BinaryExpression(path) {
      if (path.node.operator !== "in") return;

      const source = resolveSource(path.get("right"));
      const key = resolveKey(path.get("left"), true);

      // 'entries' in Object
      // 'entries' in [1, 2, 3]
      this.addPropertyDependencies(source, key);
    },
  };

  return {
    name: "use-built-ins-devo",
    pre() {
      this.polyfillsSet = new Set();

      this.addUnsupported = function (builtIn) {
        const modules = Array.isArray(builtIn) ? builtIn : [builtIn];
        for (const module of modules) {
          this.polyfillsSet.add(module);
        }
      };

      this.addBuiltInDependencies = function (builtIn) {
        if (has(BuiltIns, builtIn)) {
          const BuiltInDependencies = BuiltIns[builtIn];
          this.addUnsupported(BuiltInDependencies);
        }
      };

      this.addPropertyDependencies = function (source = {}, key) {
        const {builtIn, instanceType, isNamespaced} = source;
        if (isNamespaced) return;
        if (PossibleGlobalObjects.includes(builtIn)) {
          this.addBuiltInDependencies(key);
        } else if (has(StaticProperties, builtIn)) {
          const BuiltInProperties = StaticProperties[builtIn];
          if (has(BuiltInProperties, key)) {
            const StaticPropertyDependencies = BuiltInProperties[key];
            return this.addUnsupported(StaticPropertyDependencies);
          }
        }
        if (!has(InstanceProperties, key)) return;
        let InstancePropertyDependencies = InstanceProperties[key];
        if (instanceType) {
          InstancePropertyDependencies = InstancePropertyDependencies.filter(
            m => m.includes(instanceType) || CommonInstanceDependencies.includes(m),
          );
        }
        this.addUnsupported(InstancePropertyDependencies);
      };
    },
    post() {
      for (let i of this.polyfillsSet) {
        polyfills.push(i);
      }
    },
    visitor: addAndRemovePolyfillImports,
  };
}