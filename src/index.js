import fs from 'fs';
import util from 'util';
import path from 'path';
import child_process from 'child_process';
import Worker from 'jest-worker';
import chalk from 'chalk';
import {table, createStream} from 'table';

import builtIns from '@babel/preset-env/data/built-ins';

import {getRC} from "./rc";

const isBelow = (ruleName, rule, target) => (
  rule && Object
    .keys(target)
    .some(x => (
        !rule[x] || +rule[x] > +target[x]
      )
    )
);

const fileSize = file => fs.statSync(file).size;

const getSize = (location, files) => (
  files.reduce((acc, name) => acc + fs.statSync(path.join(location, name)).size, 0)
);

const inTime = async cb => {
  const timeIn = Date.now();
  await cb();
  console.info('\n');
  console.info('   --- step finished in ', Math.round(100 * (Date.now() - timeIn) / 1000) / 100, 's');
  console.info('\n');
};

export const scan = async (dist, out, _options = getRC()) => {
  console.log(chalk.bold.underline.green("devolution"), "🦎 -> 🦖");

  const options = await _options;

  const targets = options.targets;

  const mainBundleReg = new RegExp(options.rootBundles);

  const firstTarget = targets[Object.keys(targets)[0]];

  // find all required files

  const allFiles = Array.isArray(options.files) ? options.files : await util.promisify(fs.readdir)(dist);
  const jsFiles = allFiles.filter(file => file.match(options.match));

  if (!jsFiles.length) {
    console.log(chalk.bold.underline.ref("no files to process"));
    return false;
  }

  const otherFiles = allFiles.filter(file => (
    !jsFiles.includes(file) &&
    !fs.lstatSync(path.join(dist, file)).isDirectory()
  ));

  const mainBundle = jsFiles.find(name => name === mainBundleReg || name.match(mainBundleReg));

  // prepare polyfill target

  const polyfills = {};
  let basePolyfills = [];
  const polyCache = {};

  const devolutionRoot = path.resolve(path.join(out, '.devolution'));
  const polyfillDir = path.resolve(path.join(devolutionRoot, '.polyfills'));
  const outDir = path.resolve(out);

  if (!fs.existsSync(out)) {
    fs.mkdirSync(out);
  }

  if (!fs.existsSync(devolutionRoot)) {
    fs.mkdirSync(devolutionRoot);
  }

  if (!fs.existsSync(polyfillDir)) {
    fs.mkdirSync(polyfillDir);
  }

  console.log({dist, out, mainBundle, bundledPolyfills: options.includesPolyfills});

  console.log(" -> 🦎 -> ", chalk.bold.underline.green("scanning files"));
  console.group();
  await inTime(async () => {

    const tableStream = createStream({
      columnDefault: {
        width: 50
      },
      columns: {
        0: {
          width: 70,
        },
        1: {
          alignment: 'right'
        }
      },
      columnCount: 2
    });
    tableStream.write(['file', 'polyfills found']);

    const worker = new Worker(require.resolve('./workers/detect'));

    const polyfillsLeft = x => basePolyfills.indexOf(x) < 0;

    const report = {};

    if (mainBundle && mainBundle !== '.') {
      basePolyfills = polyfills[mainBundle] = await worker.extractPolyfills(dist, mainBundle, options.babelScan);
      tableStream.write([mainBundle, basePolyfills.length]);

    }

    await Promise.all(
      jsFiles.map(async file => {
        if (file !== mainBundle) {
          polyfills[file] = (await worker.extractPolyfills(dist, file, options.babelScan)).filter(polyfillsLeft);
          tableStream.write([file, polyfills[file].length]);
        }
      })
    );
    worker.end();
  });
  console.groupEnd();

  const targetPolyfills = {};
  console.log(" -> 🦎 -> 🥚", chalk.bold.underline.green("composing polyfills"));
  console.group();

  await inTime(async () => {
    const worker = new Worker(require.resolve('./workers/composePolyfill'));

    const tableStream = createStream({
      columnDefault: {
        width: 50
      },
      columns: {
        0: {
          width: 6
        },
        1: {
          width: 40
        },
        2: {
          width: 15,
          wrapWord: true,
          alignment: 'right'
        },
        3: {
          width: 6,
          alignment: 'right'
        },
        4: {
          width: 50,
          wrapWord: true,
        }
      },
      columnCount: 5
    });
    tableStream.write(['target', 'file', 'missing polyfills', 'size', 'names']);

    const writePromises = [];
    Object
      .keys(targets)
      .forEach(target => {
        targetPolyfills[target] = [];
        Object
          .keys(polyfills)
          .forEach(key => {
            const list = polyfills[key]
              .filter(
                rule => (
                  // would not be included in a base image
                  !(options.includesPolyfills && isBelow(rule, builtIns[rule], firstTarget)) &&
                  // not ignored in config
                  !options.ignorePolyfills.includes(rule) &&
                  // and required for the target
                  isBelow(rule, builtIns[rule], targets[target])
                )
              );

            list.forEach(p => {
              if (!targetPolyfills[target].includes(p)) {
                targetPolyfills[target].push(p)
              }
            });

            const chunkPolyfills = list.map(x => `require('core-js/modules/${x}')`);

            if (polyfills[key].indexOf('@regenerator') >= 0 && target === 'ie11') {
              chunkPolyfills.push("require('regenerator-runtime')");
            }

            const fileIn = path.join(polyfillDir, `${target}-${key}.mjs`);
            fs.writeFileSync(fileIn, chunkPolyfills.join('\n'));

            writePromises.push((async () => {
              polyCache[`${target}-${key}`] = await worker.composePolyfill(fileIn);

              tableStream.write([target, key, list.length ? list.length : '-', fileSize(fileIn), list]);
            })());
          });
      });

    await Promise.all(writePromises);
    worker.end();
  });
  console.groupEnd();

  console.log(" -> 🦎 -> 🦖", chalk.bold.underline.green("devoluting targets..."));
  console.group();
  await inTime(async () => {
    const worker = new Worker(require.resolve('./workers/transpile'));

    const writePromises = [];
    const tableStream = createStream({
      columnDefault: {
        width: 50
      },
      columns: {
        0: {
          width: 6,
        },
        1: {
          width: 70,
        },
        2: {
          width: 10,
          alignment: 'right'
        },
        4: {
          width: 10
        }
      },
      columnCount: 4
    });
    tableStream.write(['target', 'file', 'time, ms', 'terser']);

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
            const now = Date.now();
            const useTerser = target === 'esm' ? options.useTerserForBaseline : options.useTerser;
            const code = await worker.compileAndWrite(
              dist, file, target,
              fileOut, polyCache[`${target}-${file}`],
              {
                targets: targets[target],
                plugins: options.babelTransform,
                useSWC: options.useSWC,
                useTerser: useTerser,
              }
            );
            tableStream.write([target, file, Date.now() - now, useTerser]);
          }))
      });

    await Promise.all(writePromises);
    worker.end();
  });
  console.groupEnd();

  console.group();
  await inTime(async () => {
    console.log(" -> 🥚 -> 🥚", chalk.bold.underline.green("linking...."), otherFiles.length, 'files');

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
          } catch (e) {
            // nope
          }
        })
    }
  });
  console.groupEnd();

  {
    console.log(" -> 🦖", chalk.bold.underline.green("you have been de-evoluted"));
    console.group();
    const base = getSize(dist, jsFiles);

    const report = [
      ['target', 'size', 'delta', 'polyfills', 'added']
    ];
    report.push(['base', base, 0, basePolyfills.length, '']);
    Object
      .keys(targets)
      .forEach(target => {
        const size = getSize(path.join(outDir, target), jsFiles);
        report.push([
          target,
          size,
          size - base,
          targetPolyfills[target].length,
          targetPolyfills[target].join(',')
        ]);
      });
    console.log(table(report, {
      columns: {
        1: {
          alignment: 'right'
        },
        2: {
          alignment: 'right'
        },
        3: {
          alignment: 'right'
        },
        4: {
          width: 50,
          wrapWord: true,
        }
      }
    }));

    console.groupEnd();
  }

  return true;
};