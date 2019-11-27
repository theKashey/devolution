import {readFileSync, writeFileSync} from 'fs';
import {join} from 'path';

import terser from "terser";

const compileBabel = (code, targets, plugins) => {
  const {transformSync} = require("@babel/core");
  return transformSync(code, {
    babelrc: false,
    presets: [
      [
        '@babel/preset-env', {
        targets,
      }]],
    plugins,
  }).code;
};

const compileSWC = async (code, minify) => {
  const {transform} = require("@swc/core");

  return (await transform(code, {
    "minify": minify,
    "module": {
      "type": "commonjs",
      "strict": false,
      "strictMode": false,
    },
    "jsc": {
      "parser": {
        "syntax": "ecmascript",
        "classProperty": true
      },
      "target": "es5",
      "transform": {
        "optimizer": undefined
      }
    }
  })).code;
};

export const compile = async (dist, file, target, {targets, plugins, useSWC, useTerser}) => {
  const code = readFileSync(join(dist, file)).toString();
  try {
    const transformedCode = await (
      target === 'esm'
        ? code
        : ((useSWC && target === "es5")
          ? compileSWC(code, useTerser)
          : compileBabel(code, targets, plugins)
        )
    );

    if (useTerser) {
      const {code, error} = terser.minify(transformedCode, {
        mangle: false,
        keep_fnames: true,
        keep_classnames: true,

        // modern target
        ecma: target === "es5"? 5 : 8,
        safari10: true
      });

      if (error) {
        console.error('terser[', file, ':', error);
      }

      return code || `/* with terser error: ${error}*/\n${transformedCode}`;
    }

    return transformedCode;
  } catch (e) {
    console.error('while processing', dist, file);
    console.error(e);
    throw e;
  }
};

export const compileAndWrite = async (dist, file, target, fileOut, prepend, options) => {
  const code = await compile(dist, file, target, options);

  writeFileSync(
    fileOut,
    `var devolutionBundle = '${target}';\n${prepend}\n${code}`
  );
};
