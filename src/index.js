import fs from 'fs';
import util from 'util';
import path from 'path';
import browserify from 'browserify';

import {transform} from "@babel/core";
import builtIns from '@babel/preset-env/data/built-ins';
import presets from '@babel/preset-env/data/built-in-modules'
import createDetector from './detector';

const esmModule = presets['es6.module'];

const defaultTargets = {
  esm: {
    "edge": "16",
    "firefox": "60",
    "chrome": "61",
    "safari": "10.1",
  },
  ie11: {
    "ie": "11",
  },
}

const process = (dist, file) => {
  const fills = [];
  const code = fs.readFileSync(path.join(dist, file)).toString();
  transform(code, {
    presets: [
      [
        '@babel/preset-env', {
        targets: {
          esmodules: false
        }
      }]],
    plugins: [createDetector(fills)],
  });

  return fills;
};

const compile = (dist, file, targets) => {
  const code = fs.readFileSync(path.join(dist, file)).toString();
  return transform(code, {
    presets: [
      [
        '@babel/preset-env', {
        targets
      }]]
  }).code;
};

const isBelow = (ruleName, rule, target) => (
  rule && Object
    .keys(target)
    .some(x => (
        !rule[x] || +rule[x] > +target[x]
      )
    )
);

const scan = async (dist, out, mainbundle, targets = defaultTargets) => {
  const files = (await util.promisify(fs.readdir)(dist))
    .filter(file => path.extname(file) === '.js');

  console.log('scanning files');

  const polyfills = {
    [mainbundle]: mainbundle ? process(dist, mainbundle) : [],
  };

  files.forEach(file => {
    if (file !== mainbundle) {
      polyfills[file] = process(dist, file).filter(x => polyfills[mainbundle].indexOf(x) >= 0)
    }
  });

  console.log('generating polyfills');

  const polyfillDir = path.resolve(path.join(out, '_polyfills'));
  const outDir = path.resolve(out);

  if (!fs.existsSync(polyfillDir)) {
    fs.mkdirSync(polyfillDir);
  }

  const writePromises = [];
  const polyCache = {};
  Object
    .keys(targets)
    .forEach(target => {
      Object
        .keys(polyfills)
        .forEach(key => {
          const list = polyfills[key]
            .filter(
              rule => isBelow(rule, builtIns[rule], targets[target])
            );

          console.log(`- ${target}: ${key}: required ${list.length} polyfills`);

          const fileIn = path.join(polyfillDir, `${target}-${key}.mjs`);
          const fileOut = path.join(polyfillDir, `${target}-${key}.js`);
          fs.writeFileSync(fileIn, list.map(x => `require('core-js/modules/${x}')`).join('\n'));

          writePromises.push(new Promise(resolve =>
            browserify(fileIn).bundle((err, buf) => {
              polyCache[`${target}-${key}`] = buf.toString();
              resolve();
            })
          ));
        });
    });

  console.log('....');
  await Promise.all(writePromises);

  console.log('creating target bundles');

  Object
    .keys(targets)
    .forEach(target => {
      fs.mkdirSync(path.join(outDir, target));
      Object
        .keys(polyfills)
        .forEach(file => {
          const fileOut = path.join(outDir, target, file);
          console.log('-', fileOut);
          fs.writeFileSync(fileOut,
            `var __splittedBundle = '${target}';` +
            polyCache[`${target}-${file}`] +
            compile(dist, file, targets[target])
          )
        });
    });

};


scan(__dirname, path.join(__dirname, '../dist'), 'index.js');