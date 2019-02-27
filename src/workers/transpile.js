import {readFileSync, writeFileSync} from 'fs';
import {join} from 'path';

import terser from "terser";
import {transformSync} from "@babel/core";
import swc from "@swc/core";

// SWC IS NOT STABLE!

const useSWC = false;

const useTerserPass = true;

const compileBabel = (code) => (
  transformSync(code, {
    babelrc: false,
    presets: [
      [
        '@babel/preset-env', {
        targets: {
          "ie": 11
        }
      }]],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-syntax-dynamic-import',
    ]
  }).code
);

const compileSWC = async (code) => (
  (await swc.transform(code, {
    "jsc": {
      "parser": {
        "syntax": "ecmascript",
        "classProperty": true,
      },
      "target": "es5",
      // "transform": {
      //   "optimizer": undefined
      // }
    }
  })).code
)


export const compile = async (dist, file, target) => {
  const code = readFileSync(join(dist, file)).toString();
  if (target === 'esm') {
    // it's already transpiled
    return code;
  }
  try {
    const es5code = useSWC
      ? compileSWC(code)
      : compileBabel(code);

    if(useTerserPass) {
      const minCode = terser.minify(es5code, {
        mangle: false,
        keep_fnames: true,
        keep_classnames: true,
      }).code;

      return minCode || es5code;
    }

    return es5code;
  } catch (e) {
    console.error('while processing', dist, file);
    console.error(e);
    throw e;
  }
};

export const compileAndWrite = async (dist, file, target, fileOut, prepend) => {
  const code = await compile(dist, file, target);

  writeFileSync(
    fileOut,
    `var devolutionBundle = '${target}';\n${prepend}\n${code}`
  );
};
