<div align="center">
  <h1>DEvolution 🦖</h1>
  <br/>
  <img src="./assets/devo-logo.jpg" alt="devolution" width="409" align="center">
  <br/>
  <br/>
  de-evolution gun, as seen in Mario Bros, to help you ship modern, and de-modernized bundles. 
  <br/>
  <br/>
    <a href="https://www.npmjs.com/package/devolution">
      <img src="https://img.shields.io/npm/v/devolution.svg?style=flat-square" />
    </a>

</div>


## Why?
- ship more modern, more compact and more fast code to 85+% of your customers
- do not worry about transpiling node_modules - use as modern code as you can everywhere
- don't be bound to the bundler

- uses [swc](https://github.com/swc-project/swc) to be a blazing 🔥 fast!
- uses [jest-worker](https://github.com/facebook/jest/tree/master/packages/jest-worker) to consume all your CPU cores
- uses [terser](https://github.com/terser-js/terser) without mangling to compress the result 

### TWO bundles to rule the world

- One for "esm"(modern) browsers, which you may load using `type=module`
- Another for an "old"(legacy) browser, which you may load using `nomodule`

## Usage
### 1. Compile your code to the `modern` target and call it a "baseline".
1. Prefer [preset-modules](https://github.com/babel/preset-modules)
```json
{
  "presets": [
    "@babel/preset-modules"
  ]
}  
```
2. However, feel free to use [preset-env with esmodules](https://babeljs.io/docs/en/babel-preset-env#targetsesmodules) 
```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "esmodules": true
      },          
      "useBuiltIns": "usage"
    }]
  ]
}  
```
> `useBuiltIns` are optional

### 2. Fire devolution to produce de-modernized bundles
```bash
// all the nessesary polyfills would be bundled
yarn devolution ./dist ./dist index.js

// if use have used `useBuiltIns: usage`, thus "esm" polyfills are already inside and could be skipped
yarn devolution ./dist ./dist index.js true
```
It will produce `esm` and `ie11` target by applying `Babel` one more time
to the already created bundle; then prepending required polyfills.

### 3  (Only webpack) setup `public-path`, somewhere close to the script start
```js
__webpack_public_path__ = devolutionBundle + '/';
```
> `Parcel` will configure public path automatically.

Then `devolution` will symlink resources to "sub-bundles" 

### 4. Ship the right script to the browser
> Please dont use code like this
```html
<script type="module" src="esm/index.js"></script>
<script type="text/javascript" src="ie11/index.js" nomodule></script>
```
It does not work well for the really "old" browsers - __IE11 will download both bundles__, but execute only the right one.
This syntax would made things even worse for the legacy browsers.

Use feature detection to pick the right bundle:
```js
  var script = document.createElement('script');
  var prefix = (!('noModule' in check)) ? "/ie11" : "/esm"; 
  script.src = prefix + "/index.js"; // or main? you better know
  document.head.appendChild(script);
```
This "prefix" is all you need.

See [Optimising JS Delivery](https://dev.to/thekashey/optimising-js-delivery-4h6l) for details


### 5. Done!

A few minutes to setup, a few seconds to build

##### Why two separate folders?
In the most articles, you might find online, ES5 and ES6 bundles are generated independently,
and ES5 uses `.js` extension, while ES6 uses `.mjs`.

That requires two real bundling steps as long as "hashes" of files and "chunk names", bundles inside `runtime-chunk` would be different.
That's why we generate two folders - to be able just to use prefix, to enable switching between bundles just using
`__webpack_public_path__` or parcel script location autodetection.

##### Drawbacks

- __!!__ doesn't play well with script _prefetching_ - you have to manually specify to prefetch `esm` version,
not the "original" one.
- may duplicate polyfills across the chunks. Don't worry much

### API
You may file devolution manually
```js
import {devolute} from 'devolution';

await devolute(sourceDist, destDist, mainBundle, polyfillsAreBundled)

// for example

await devolute(
  'dist', // the default webpack output
  'dist', // the same directory could be used as well
  'index.js', // the main bundle (polyfills "base")
  true, // yes - some polyfills (assumed esm) are bundled already,
```

##### Targets for "esm"
 - edge: "16+",
 - firefox: "60+",
 - chrome: "61+",
 - safari: "10.1+",
(2017+)

##### Targets for "ie11"
 - ie: "11-"
 
That's is the oldest living browser, and can be used as a base line.  


# License
MIT