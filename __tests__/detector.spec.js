import {transform} from '@babel/core'
import {join} from 'path'
import {readdirSync, statSync, readFileSync} from 'fs'

import corejs2 from '../src/data/corejs2';
import corejs3 from '../src/data/corejs3';

const FIXTURE_PATH = join(__dirname, '__fixtures__/babel');

const testFolders = readdirSync(FIXTURE_PATH).filter(file =>
  statSync(join(FIXTURE_PATH, file)).isDirectory(),
);

const testPlugin = (code, definitions) => {
  const polyfills = [];
  const flags = {
    usesRegenerator: false
  };
  transform(code, {
    plugins: [
      require('../src/plugins/detectPolyfills').default(polyfills, flags, definitions)
    ],
  });

  return {
    polyfills,
    flags,
  };
};


describe('babel', () => {

  testFolders.forEach(folderName => {
    const actual = readFileSync(
      join(FIXTURE_PATH, folderName, 'actual.js'),
      'utf8',
    );
    const expected = readFileSync(
      join(FIXTURE_PATH, folderName, 'expected.json'),
      'utf8',
    );

    it(`works with ${folderName}`, () => {
      const result = JSON.stringify({
        2: testPlugin(actual, corejs2.definitions),
        3: testPlugin(actual, corejs3.definitions),
      }, null, 2);
      expect(result).toEqual(expected);
    })
  })
});