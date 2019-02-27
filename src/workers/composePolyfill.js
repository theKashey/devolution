import browserify from "browserify";
import terser from "terser";

export const composePolyfill = (fileIn) => (
  new Promise(resolve => (
    browserify(fileIn).bundle((err, buf) => (
      resolve(terser.minify(buf.toString()).code)
    ))
  ))
);