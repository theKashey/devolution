import {readFileSync} from 'fs';
import {join} from 'path';

import {transformSync} from "@babel/core";

import createDetector from '../plugins/detectPolyfills';

export const extractPolyfills = (dist, file) => {
  const fills = [];
  const flags = {
    usesRegenerator: false
  };
  const code = readFileSync(join(dist, file)).toString();
  transformSync(code, {
    babelrc: false,
    plugins: [
      createDetector(fills, flags),
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-syntax-dynamic-import',
    ],
  });

  if (flags.usesRegenerator) {
    fills.push('@regenerator');
  }

  return fills;
};