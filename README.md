<div align="center">
  <h1>🦎 -> DEvolution -> 🦖</h1>
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
- well, it's just faster than a `multi-compiler mode` and 100% customizable

- 🚀 fast - uses [swc](https://github.com/swc-project/swc) to be a blazing 🔥 fast!
- 📱 multi threaded - uses [jest-worker](https://github.com/facebook/jest/tree/master/packages/jest-worker) to consume all your CPU cores
- 🗜 compact - uses [terser](https://github.com/terser-js/terser) without mangling to re-compress the result 

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
> `useBuiltIns` are optional, and plays well with `includesPolyfills` option in `.devolutionrc`

3. [sucrase](https://github.com/alangpierce/sucrase) is an option
`sucrase` is much faster than babel(and swc), however is able to produce only "modern" code.
However, this is what we need.
If your code is not using babel plugins, and non-yet-supported by the browsers code - feel free to use it.

### 2. Fire devolution to produce de-modernized bundles
> the first run would create `.devolutionrc.js`, which could be used to tune some details
```bash
// all the nessesary polyfills would be bundled
yarn devolution dist dist
```
It will convert all files in `dist` into `esm` and `es5` targets in the same `dist`

### 3  (Only webpack) setup `public-path`, somewhere close to the script start
```js
__webpack_public_path__ = devolutionBundle + '/'; // devolutionBundle is a predefined variable
```
> `Parcel` will configure public path automatically.


#### Symlink
Then `devolution` will symlink resources to "sub-bundles" 

### 4. Ship the right script to the browser
Please __dont use__ code like this
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

### 4, again. SSR this time
However, it's much better to use Server Side logic to pick the right bundle - you might control
which bundle should be shipped in which case.

But default - use the same `browsers` as they are listed in `.devolutionrc.js` `targets` for `esm`,
however - you might "raise the bar", shipping modern code only to `Chrome 80+`,
or introduce __more than two__ bundles - the "language" in the top ones could be the same, but polyfills set would be different. 

```js
import UA from 'browserslist-useragent'

export const isModernBrowser = (userAgent) => {
  return UA.matchesUA(userAgent, {
    _allowHigherVersions: true,
    browsers: [
      "Chrome >= 61",
      "Safari >= 10.1",
      "iOS >= 11.3",
      "Firefox >= 60",
      "Edge >= 16"
    ]
  })
}

function renderApp(req, res) {
  const userAgent = req.headers['user-agent'];

  const bundleMode = isModernBrowser(userAgent) ? 'esm' : 'es5';
  // send the right scripts
}
```

See [Optimising JS Delivery](https://dev.to/thekashey/optimising-js-delivery-4h6l) for details

### 5. Done!

A few minutes to setup, a few seconds to build


## Tuning
See `.devolutionrc.js`, it contains all information you might look for

## FAQ

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

##### (default) Targets for "esm"
 - edge: "16+",
 - firefox: "60+",
 - chrome: "61+",
 - safari: "10.1+",
(2017+)

##### (default) Targets for "ie5"
 - ie: "11-"
 
That's is the oldest living browser, and can be used as a base line.  

#### SWC
SWC is much faster than babel, however not as stable and might produce broken code.
Controlled by `useSWC`, disabled by default

#### Terser
There are two options, which control minification - `useTerser` and `useTerserForBaseline`.
You __have__ to enable `useTerser` if you enable `useSWC` as long as it produces non minified code.

### API
You may file devolution manually
```js
import {devolute} from 'devolution';

devolute(sourceDist, destDist, options)

// for example

devolute(
  'dist', // the default webpack output
  'dist', // the same directory could be used as well
  require('.devolutionrc')     
)
```

# License
MIT