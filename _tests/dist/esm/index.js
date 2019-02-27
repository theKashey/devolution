var devolutionBundle = 'esm';!function(){return function r(n,e,t){function o(i,f){if(!e[i]){if(!n[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=e[i]={exports:{}};n[i][0].call(p.exports,function(r){return o(n[i][1][r]||r)},p,p.exports,r,n,e,t)}return e[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}}()({1:[function(r,n,e){},{}]},{},[1]);import fs from 'fs';
import util from 'util';
import path from 'path';
import child_process from 'child_process';
import browserify from 'browserify';
import terser from 'terser';

import {transformSync} from "@babel/core";
import swc from "@swc/core";
import builtIns from '@babel/preset-env/data/built-ins';
import createDetector from './detector';

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
};


const extractPolyfills = (dist, file) => {
  const fills = [];
  const flags = {
    usesRegenerator: false
  };
  const code = fs.readFileSync(path.join(dist, file)).toString();
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

const compile = async (dist, file, target, targets) => {
  const code = fs.readFileSync(path.join(dist, file)).toString();
  if (target === 'esm') {
    // it's already transpiled
    return code;
  }
  return (await swc.transform(code, {
    "jsc": {
      "parser": {
        "syntax": "ecmascript",
        "classProperty": true,
      },
      "target": "es5"
    }
  })).code;
};

const isBelow = (ruleName, rule, target) => (
  rule && Object
    .keys(target)
    .some(x => (
        !rule[x] || +rule[x] > +target[x]
      )
    )
);

const inTime = async cb => {
  const timeIn = Date.now();
  await cb();
  console.log('done in ', Date.now() - timeIn);
}

export const scan = async (dist, out, mainBundle, bundledPolyfills = true, targets = defaultTargets) => {
  const allFiles = await util.promisify(fs.readdir)(dist);
  const jsFiles = allFiles.filter(file => path.extname(file) === '.js');
  const otherFiles = allFiles.filter(file => (
    !jsFiles.includes(file) &&
    !fs.lstatSync(path.join(dist, file)).isDirectory()
  ));

  const polyfills = {};
  let basePolyfills = [];
  const polyCache = {};

  const polyfillDir = path.resolve(path.join(out, '_polyfills'));
  const outDir = path.resolve(out);

  if (!fs.existsSync(out)) {
    fs.mkdirSync(out);
  }

  if (!fs.existsSync(polyfillDir)) {
    fs.mkdirSync(polyfillDir);
  }

  await inTime(() => {
    console.log('scanning files', {dist, out, mainBundle});


    const polyfillsLeft = x => basePolyfills.indexOf(x) >= 0;

    if (mainBundle && mainBundle !== '.') {
      console.log('-', mainBundle);
      basePolyfills = polyfills[mainBundle] = extractPolyfills(dist, mainBundle);
    }

    jsFiles.forEach(file => {
      if (file !== mainBundle) {
        console.log('-', file);
        polyfills[file] = extractPolyfills(dist, file).filter(polyfillsLeft)
      }
    });
  });

  await inTime(async () => {
    console.log('generating polyfills');

    const writePromises = [];
    Object
      .keys(targets)
      .forEach(target => {
        Object
          .keys(polyfills)
          .forEach(key => {
            const list = polyfills[key]
              .filter(
                rule => (
                  // would not be included in a base image
                  !(bundledPolyfills && isBelow(rule, builtIns[rule], defaultTargets['esm'])) &&
                  // and required by a target
                  isBelow(rule, builtIns[rule], targets[target])
                )
              );

            console.log(`- ${target}: ${key}: required ${list.length} polyfills`);

            const chunkPolyfills = list.map(x => `require('core-js/modules/${x}')`);

            if (polyfills[key].indexOf('@regenerator') >= 0 && target === 'ie11') {
              chunkPolyfills.push("require('regenerator-runtime')");
            }

            const fileIn = path.join(polyfillDir, `${target}-${key}.mjs`);
            fs.writeFileSync(fileIn, chunkPolyfills.join('\n'));

            writePromises.push(new Promise(resolve =>
              browserify(fileIn).bundle((err, buf) => {
                polyCache[`${target}-${key}`] = terser.minify(buf.toString()).code;
                resolve();
              })
            ));
          });
      });

    console.log('composing polyfills...');
    await Promise.all(writePromises);
  });

  await inTime(async () => {
    console.log('creating target bundles');

    const writePromises = [];

    Object
      .keys(targets)
      .forEach(target => {
        const bundleDir = path.join(outDir, target);
        if (!fs.existsSync(bundleDir)) {
          fs.mkdirSync(bundleDir);
        }
        writePromises.push(...Object
          .keys(polyfills)
          .map(async file => {
            const fileOut = path.join(bundleDir, file);
            const code = await compile(dist, file, target, targets[target])
            fs.writeFileSync(fileOut,
              `var devolutionBundle = '${target}';` +
              polyCache[`${target}-${file}`] +
              code
            )
          }))
      });

    console.log('devoluting bundles...');
    await Promise.all(writePromises);
  });

  await inTime(async () => {
    console.log('symlinking', otherFiles.length, 'files');

    if (otherFiles.length) {
      Object
        .keys(targets)
        .forEach(target => {
          child_process.execSync(
            otherFiles
              .map(file => `ln -s ${path.join(dist, file)} ${path.join(outDir, target, file)}`)
              .join(' && ')
          )
        })
    }
  });
};