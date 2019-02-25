import {transform} from '@babel/core'
import {join} from 'path'
import {readdirSync, statSync, readFileSync} from 'fs'
import {expect} from 'chai';

const FIXTURE_PATH = join(__dirname, '__fixtures__/babel');

const testFolders = readdirSync(FIXTURE_PATH).filter(file =>
  statSync(join(FIXTURE_PATH, file)).isDirectory(),
);

const testPlugin = {
  node: (code) => {
    const fills = [];
    const result = transform(code, {
      presets: [
        [
          '@babel/preset-env', {
          targets: {
            esmodules: false
          },
          //useBuiltIns: "usage",
        }]],
      plugins: [require('../src/detector.js').default(fills)],
    });

    console.log(fills);

    return result.code
  },
};


describe('babel', () => {
  testFolders.forEach(folderName => {
    const actual = readFileSync(
      join(FIXTURE_PATH, folderName, 'actual.js'),
      'utf8',
    )
    const expected = readFileSync(
      join(FIXTURE_PATH, folderName, 'expected.js'),
      'utf8',
    )

    it(`works with ${folderName}`, () => {
      const result = testPlugin[folderName](actual)
      expect(result.trim()).to.be.equal(expected.trim())
    })
  })
})