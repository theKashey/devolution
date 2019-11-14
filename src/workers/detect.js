import {readFileSync} from 'fs';
import {join} from 'path';

import {transformSync} from "@babel/core";

import createDetector from '../plugins/detectPolyfills';

export const extractPolyfills = (dist, file, plugins) => {
  const fills = [];
  const flags = {
    usesRegenerator: false
  };
  const code = readFileSync(join(dist, file)).toString();
  transformSync(code, {
    babelrc: false,
    plugins: [
      createDetector(fills, flags),
      ...Array.from(plugins),
    ],
  });

  if (flags.usesRegenerator) {
    fills.push('@regenerator');
  }

  return fills;
};