// devolution 🦎 -> 🦖

const USE_MODERN = false;

module.exports = Promise.resolve({ // could be async

  match: /\.js$/, // files to add could be RegExp or array
  rootBundles: null, // polyfills found in the root bundles would be excluded from other files

  includesPolyfills: false, // are polyfills included in the baseline bundle, or we should add them?

  useSWC: false, // https://github.com/swc-project/swc faster than babel, used only for es5 target
  useTerser: true, // the result bundle might be "prettied"
  useTerserForBaseline: false, // apply minification for the baseline bundle

  // controls syntax and polyfill level
  // `esm` and `es5` are reserved keywords - `esm` means "no transformation required", and `es5` means - target is `es5`
  // the values inside are used to determine required polyfills
  targets: {
    esm: USE_MODERN
      ? {
        "chrome": "80", // // if baseline bundle used preset-modern use some "big" target
      }
      : {
        // if baseline bundle used preset-env+esmodules
        "edge": "16",
        "firefox": "60",
        "chrome": "61",
        "safari": "10.1",
      },

    // the legacy target (you might need only it)
    es5: {
      "ie": "11",
    },
  },

  // plugins for the scan(detect polyfills) pass
  babelScan: [
    '@babel/plugin-syntax-object-rest-spread',
    '@babel/plugin-syntax-class-properties',
    '@babel/plugin-syntax-dynamic-import',
  ],

  // plugins for transformation pass
  babelTransform: [
    '@babel/plugin-plugin-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
  ],

  ignorePolyfills: [
    // put a list of polyfills to ignore, they would be considered as already added
  ]
});