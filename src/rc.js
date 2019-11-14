import {existsSync, writeFileSync, readFileSync} from 'fs';
import {join} from 'path';

const cwd = () => process.cwd();
const DEVOLUTION_RC = '.devolutionrc.js';

const rcFileName = () => join(cwd(), DEVOLUTION_RC);

export const ensureRCExists = () => {
  const rc = rcFileName();
  if (!existsSync(rc)) {
    writeFileSync(rc, readFileSync(join(__dirname, '..', DEVOLUTION_RC)));
  }
};

export const getRC = () => {
  ensureRCExists();
  return require(rcFileName());
};