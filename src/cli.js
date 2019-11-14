import {resolve} from 'path'
import {scan} from './index';
import {ensureRCExists} from "./rc";

if (!process.argv || !process.argv[3]) {
  console.log('usage: devolution source target ');
  console.log('example: devolution dist dist');
  ensureRCExists();
} else {
  Promise.resolve(
    scan(resolve(process.argv[2]), resolve(process.argv[3]))
  )
    .then(code => {
      if (!code) {
        process.exit(-1);
      }
    })
    .catch(err => {
      console.error(err);
      process.exit(-1)
    })
}