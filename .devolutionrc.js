// devolution 🦎 -> 🦖

/**
 what about shipping the BEST for the bleeding edge browsers?
 (requires SSR or feature detection for proper shipping)
 */
const USE_MODERN = false;

module.exports = Promise.resolve({ // could be async
  /**
   * core-js version. Version 3 is more modern, while version 2 is more common
   * this __must__ be synchoronized with corejs version visible to babel, and installed by you
   * (if not installed, then it's v2)
   */
  corejs: "3",
  /**
   * include proposals polyfills, core-js 3 only
   */
  proposals: false,

  /**
   * if set to `false` it would SYMLINK files, effective keeping only one version for files
   * not managed by devolution (read - non-js).
   * If set to `true` - all files would be copied.
   */
  copyFiles: false,

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
   * IT'S BETTER TO INCLUDE THEM
   * to prevent duplication among chunks
   * (keep in mind - polyfills landed in the main bundle will not be duplicated)
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
        // this controls polyfills for ESM bundle
        // you might be surprised how many of them might be bundled
        // core-js 3 : see https://github.com/zloirock/core-js/blob/master/packages/core-js-compat/src/data.js
        // core-js 2 : see https://github.com/theKashey/devolution/blob/master/src/data/corejs2/built-ins.js

        // if baseline bundle used preset-env+esmodules - https://github.com/babel/babel/blob/master/packages/babel-preset-env/data/built-in-modules.json
        "edge": "16",
        "firefox": "60",
        "chrome": "61",
        "safari": "10.1",
      },

    // es6: { something between IE5 and bleeding edge? }

    /**
     * the legacy target (you might need only it)
     * it is roughly "just ES5". Target (ie11) controls polyfills
     */
    es5: {
      // list the lowest browser here, it would not affect the "language", only polyfills
      "ie": "11", // do not support IE9, and IE10
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

  // some files might be excluded from polyfilling
  dontPolyfill: [
    /manifest/, // dont polyfill webpack manifest
  ],

  // TODO: inject some target specific polyfills to the "main bundle"
  // addPolyfills: {
  //   esm: {
  //     // probably none?
  //   },
  //   es5: {
  //     // which? what about a few "ignored" ones?
  //   }
  // },
  /**
   * Some polyfills might be "manually" bundled, or you just might dont need them - automatic detection is not perfect.
   * Let's us know which...
   */
  ignorePolyfills: [
    // put a list of polyfills to ignore, they would be considered as already added

    // WeakMap is defacto supported my IE11, but not listed compact table and would be included in any case
    "es6.weak-map",

    // almost any library has a failback for Symbol support
    'es6.symbol',
    'es7.symbol.async-iterator',

    // and almost no library uses extra RegExp features
    'es6.regexp.flags',
  ]
});