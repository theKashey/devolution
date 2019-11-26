import terser from "terser";

import {rollup} from 'rollup';
import rollupReplace from 'rollup-plugin-replace';
import rollupCommonjs from 'rollup-plugin-commonjs';
import rollupNodeResolve from 'rollup-plugin-node-resolve';

export const composePolyfillRollup = (fileIn) => (
  new Promise(async resolve => {
    try {
      const bundle = await rollup({
        input: fileIn,

        plugins: [
          rollupReplace({
            'process.env.NODE_ENV': JSON.stringify('production')
          }),

          rollupNodeResolve({
            main: true
          }),

          rollupCommonjs({
            include: 'node_modules/**',
            extensions: ['.js'],
            ignoreGlobal: false,  // Default: false
            sourceMap: false,  // Default: true
          })
        ]
      });
      const {output} = await bundle.generate({
        format: 'iife'
      });
      resolve(terser.minify(output[0].code).code);
    } catch (e) {
      console.error(e);
      resolve({error: e.message});
    }
  })
);

export const composePolyfill = (fileIn) => composePolyfillRollup(fileIn);
