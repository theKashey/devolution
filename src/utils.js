import fs from "fs";
import path from "path";

/**
 * checks if target is below rule
 * @param ruleName
 * @param rule minimal passable value
 * @param target current value
 * @returns {*}
 */
export const isBelow = (ruleName, rule, target) => (
  rule && Object
    .keys(target)
    .some(x => (
        !rule[x] || +rule[x] > +target[x]
      )
    )
);

export const fileSize = file => fs.statSync(file).size;

export const getSize = (location, files) => (
  files.reduce((acc, name) => acc + fs.statSync(path.join(location, name)).size, 0)
);

export const inTime = async cb => {
  const timeIn = Date.now();
  await cb();
  console.info('\n');
  console.info('   --- step finished in ', Math.round(100 * (Date.now() - timeIn) / 1000) / 100, 's');
  console.info('\n');
};