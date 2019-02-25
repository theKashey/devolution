import {definitions} from "@babel/preset-env/lib/built-in-definitions";

const logUsagePolyfills = () => {
};

function has(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function getType(target) {
  if (Array.isArray(target)) return "array";
  return typeof target;
}

export default (polyfills) => function ({types: t}) {
  function addImport(
    path,
    builtIn,
    builtIns,
  ) {
    if (builtIn && !builtIns.has(builtIn)) {
      builtIns.add(builtIn);
      polyfills.push(builtIn);
    }
  }

  function addUnsupported(
    path,
    builtIn,
    builtIns,
  ) {
    if (Array.isArray(builtIn)) {
      for (const i of builtIn) {
        addImport(path, i, builtIns);
      }
    } else {
      addImport(path, builtIn, builtIns);
    }
  }

  const addAndRemovePolyfillImports = {
    // Symbol()
    // new Promise
    ReferencedIdentifier(path, state) {
      const {node, parent, scope} = path;

      if (t.isMemberExpression(parent)) return;
      if (!has(definitions.builtins, node.name)) return;
      if (scope.getBindingIdentifier(node.name)) return;

      const builtIn = definitions.builtins[node.name];
      addUnsupported(path, builtIn, this.builtIns);
    },

    // arr[Symbol.iterator]()
    CallExpression(path) {
      // we can't compile this
      if (path.node.arguments.length) return;

      const callee = path.node.callee;
      if (!t.isMemberExpression(callee)) return;
      if (!callee.computed) return;
      if (!path.get("callee.property").matchesPattern("Symbol.iterator")) {
        return;
      }

      addImport(path, "web.dom.iterable", this.builtIns);
    },

    // Symbol.iterator in arr
    BinaryExpression(path) {
      if (path.node.operator !== "in") return;
      if (!path.get("left").matchesPattern("Symbol.iterator")) return;

      addImport(path, "web.dom.iterable", this.builtIns);
    },

    // yield*
    YieldExpression(path) {
      if (!path.node.delegate) return;

      addImport(path, "web.dom.iterable", this.builtIns);
    },

    // Array.from
    MemberExpression: {
      enter(path, state) {
        if (!path.isReferenced()) return;

        const {node} = path;
        const obj = node.object;
        const prop = node.property;

        if (!t.isReferenced(obj, node)) return;
        let instanceType;
        let evaluatedPropType = obj.name;
        let propName = prop.name;
        if (node.computed) {
          if (t.isStringLiteral(prop)) {
            propName = prop.value;
          } else {
            const res = path.get("property").evaluate();
            if (res.confident && res.value) {
              propName = res.value;
            }
          }
        }
        if (path.scope.getBindingIdentifier(obj.name)) {
          const result = path.get("object").evaluate();
          if (result.value) {
            instanceType = getType(result.value);
          } else if (result.deopt && result.deopt.isIdentifier()) {
            evaluatedPropType = result.deopt.node.name;
          }
        }
        if (has(definitions.staticMethods, evaluatedPropType)) {
          const staticMethods = definitions.staticMethods[evaluatedPropType];
          if (has(staticMethods, propName)) {
            const builtIn = staticMethods[propName];
            addUnsupported(path, builtIn, this.builtIns);
            // if (obj.name === "Array" && prop.name === "from") {
            //   addImport(
            //     path,
            //     "@babel/polyfill/lib/core-js/modules/web.dom.iterable",
            //     this.builtIns,
            //   );
            // }
          }
        }

        if (has(definitions.instanceMethods, propName)) {
          //warnOnInstanceMethod(state, getObjectString(node));
          let builtIn = definitions.instanceMethods[propName];
          if (instanceType) {
            builtIn = builtIn.filter(item => item.includes(instanceType));
          }
          addUnsupported(path, builtIn, this.builtIns);
        }
      },

      // Symbol.match
      exit(path, state) {
        if (!path.isReferenced()) return;

        const {node} = path;
        const obj = node.object;

        if (!has(definitions.builtins, obj.name)) return;
        if (path.scope.getBindingIdentifier(obj.name)) return;

        const builtIn = definitions.builtins[obj.name];
        addUnsupported(path, builtIn, this.builtIns);
      },
    },

    // var { repeat, startsWith } = String
    VariableDeclarator(path, state) {
      if (!path.isReferenced()) return;

      const {node} = path;
      const obj = node.init;

      if (!t.isObjectPattern(node.id)) return;
      if (!t.isReferenced(obj, node)) return;

      // doesn't reference the global
      if (obj && path.scope.getBindingIdentifier(obj.name)) return;

      for (let prop of node.id.properties) {
        prop = prop.key;
        if (
          !node.computed &&
          t.isIdentifier(prop) &&
          has(definitions.instanceMethods, prop.name)
        ) {
          // warnOnInstanceMethod(
          //   state,
          //   `${path.parentPath.node.kind} { ${prop.name} } = ${obj.name}`,
          // );

          const builtIn = definitions.instanceMethods[prop.name];
          addUnsupported(path, builtIn, this.builtIns);
        }
      }
    },

    Function(path, state) {
      if (!this.usesRegenerator && (path.node.generator || path.node.async)) {
        this.usesRegenerator = true;
        addUnsupported("regenerator-runtime");
      }
    },
  };

  return {
    name: "use-built-ins",
    pre() {
      this.builtIns = new Set();
      this.usesRegenerator = false;
    },
    post() {
      const {debug, onDebug} = this.opts;

      if (debug) {
        logUsagePolyfills(this.builtIns, this.file.opts.filename, onDebug);
      }
    },
    visitor: addAndRemovePolyfillImports,
  };
}