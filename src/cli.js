import {resolve} from 'path'
import {scan} from './index';

if (!process.argv || !process.argv[3]) {
  console.log('usage: devolution source target [main.js]');
  console.log('example: devolution dist dist index.js');
} else {
  scan(resolve(process.argv[2]), resolve(process.argv[3]), process.argv[4]);
}