// devolution 🦎 -> 🦖

/**
 what about shipping the BEST for the bleeding edge browsers?
 (requires SSR or feature detection for proper shipping)
 */
const USE_MODERN = false;

module.exports = Promise.resolve({ // could be async
  /**
   * files to add could be RegExp or array
   */
  match: /\.js$/,

  /**
   * these chunks expected to always be loaded, for example this could be your entry point(s)
   */
  rootBundles: null,

  /**
   * are polyfills included in the baseline bundle? If yes no polyfills which "might be" required for esmodules target would be added
   */
  includesPolyfills: false,

  /**
   https://github.com/swc-project/swc
   roughly TWICE faster than babel, used only for es5 target.
   however, it produces a bit different code. PLEASE CHECK THE RESULT!
   When to use: when babel is to slow, or failing our of memory
   **/
  useSWC: false,
  /**
   * the result bundle might be "prettied", so some light minification might be needed
   */
  useTerser: true,
  /**
   * apply minification for the baseline bundle
   */
  useTerserForBaseline: false,

  /**
   controls syntax and polyfill level
   `esm` and `es5` are reserved keywords - `esm` means "no transformation required", and `es5` means - target is `es5`
   the values inside are used to determine required polyfills
   **/
  targets: {
    /**
     * ESM controls ONLY polyfills. No code transformation to be made!
     */
    esm: USE_MODERN
      ? {
        "chrome": "70", // if baseline bundle used preset-modern use some "big" target, but ship only for this "big" target!
      }
      : {
        // if baseline bundle used preset-env+esmodules
        "edge": "16",
        "firefox": "60",
        "chrome": "61",
        "safari": "10.1",
      },

    // es6: { something between IE5 and bleeding edge? }

    /**
     * the legacy target (you might need only it)
     * it is roughtly "just ES5". Target (ie11) controls polyfills
     */
    es5: {
      "ie": "11",
    },
  },

  /**
   * plugins for the scan(detect polyfills) pass
   */
  babelScan: [
    '@babel/plugin-syntax-object-rest-spread',
    '@babel/plugin-syntax-class-properties',
    '@babel/plugin-syntax-dynamic-import',
  ],

  /**
   *  plugins for transformation pass
   */
  babelTransform: [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
  ],

  /**
   * Some polyfills might be "manually" bundles. Let's us know which...
   */
  ignorePolyfills: [
    // put a list of polyfills to ignore, they would be considered as already added
  ]
});