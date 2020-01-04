import {isBelow} from "../src/utils";
import {esmBaseline} from "../src/data/esmBaseline";

describe("utils", () => {
  describe("isBelow", () => {
    it("X below Y", () => {
      expect(isBelow('any', {ie: 11}, {chrome: 70})).toBe(true);
    });

    it("ie11 above ie9", () => {
      expect(isBelow('any', {ie: 9}, {ie: 11})).toBe(false);
    });

    it("chrome 70 above chrome 60", () => {
      expect(isBelow('any', {chrome: 60, ie: 9}, {chrome: 70})).toBe(false);
    });

    it("however, two conditions changes it", () => {
      expect(isBelow('any', {chrome: 60, ie: 10}, {chrome: 70, ie: 9})).toBe(true);
    });

    it('esm baseline is above ie11', () => {
      expect(isBelow('any', esmBaseline, {ie: 11})).toBe(true);
    });
  });
});