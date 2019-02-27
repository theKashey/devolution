import fs from 'fs';
import util from 'util';
import path from 'path';
import child_process from 'child_process';
import Worker from 'jest-worker';

import builtIns from '@babel/preset-env/data/built-ins';

import {composePolyfill} from "./workers/composePolyfill";

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
  console.log('** done in ', Date.now() - timeIn);
}

export const scan = async (dist, out, mainBundlePattern = 'never', bundledPolyfills = false, targets = defaultTargets) => {

  const mainBundleReg = new RegExp(mainBundlePattern);

  const allFiles = await util.promisify(fs.readdir)(dist);
  const jsFiles = allFiles.filter(file => path.extname(file) === '.js');
  const otherFiles = allFiles.filter(file => (
    !jsFiles.includes(file) &&
    !fs.lstatSync(path.join(dist, file)).isDirectory()
  ));

  const mainBundle = jsFiles.find(name => name === mainBundlePattern) || jsFiles.find(name => name.match(mainBundleReg));

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

  await inTime(async () => {
    console.log('scanning files', {dist, out, mainBundle, bundledPolyfills});
    const worker = new Worker(require.resolve('./workers/detect'));

    const polyfillsLeft = x => basePolyfills.indexOf(x) < 0;

    if (mainBundle && mainBundle !== '.') {
      basePolyfills = polyfills[mainBundle] = await worker.extractPolyfills(dist, mainBundle);
      console.log('-', mainBundle, '+', basePolyfills.length);
    }

    await Promise.all(
      jsFiles.map(async file => {
        if (file !== mainBundle) {
          polyfills[file] = (await worker.extractPolyfills(dist, file)).filter(polyfillsLeft);
          console.log('- scan -', file, '+', polyfills[file].length);
        }
      })
    );
    worker.end();
  });

  await inTime(async () => {
    console.log('generating polyfills');
    const worker = new Worker(require.resolve('./workers/composePolyfill'));

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

            writePromises.push((async () => {
              polyCache[`${target}-${key}`] = await worker.composePolyfill(fileIn);
            })());
          });
      });

    console.log('composing polyfills...');
    await Promise.all(writePromises);
    worker.end();
  });

  await inTime(async () => {
    console.log('creating target bundles');
    const worker = new Worker(require.resolve('./workers/transpile'));

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
            const code = await worker.compileAndWrite(
              dist, file, target,
              fileOut, polyCache[`${target}-${file}`]
            );
            console.log('- compile -', file);
          }))
      });

    console.log('devoluting bundles...');
    await Promise.all(writePromises);
    worker.end();
  });

  await inTime(async () => {
    console.log('symlinking', otherFiles.length, 'files');

    if (otherFiles.length) {
      Object
        .keys(targets)
        .forEach(target => {
          try {
            child_process.execSync(
              otherFiles
                .map(file => `ln -s ${path.join(dist, file)} ${path.join(outDir, target, file)}`)
                .join(' && ')
            )
          } catch(e){
            // nope
          }
        })
    }
  });
};