import browserify from "browserify";
import terser from "terser";

export const composePolyfill = (fileIn) => (
  new Promise(resolve => (
    browserify(fileIn).bundle((err, buf) => (
      resolve(
        err
          ? {error: err.message || err}
          : terser.minify(buf.toString()).code
      )
    ))
  ))
);