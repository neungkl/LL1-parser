import util from "../src/util.js";
import parser from "../src/grammar/parser.js";

var pre = require('./grammar.test.js');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;

describe('Util', () => {
  describe('Non-Terminate Symbol', () => {
    it('A -> B | C, C -> D', () => {
      let ans = parser.contextToRuleData(`
        A -> B | C
        C -> D
      `);
      ans = util.getNonTerminateSymbol(ans);
      expect(['A', 'C']).to.deep.equal(ans);
    });
    it('A -> B, B -> C, C -> D', () => {
      let ans = parser.contextToRuleData(`
        A -> B
        B -> C
        C -> D
      `);
      ans = util.getNonTerminateSymbol(ans);
      expect(['A', 'B', 'C']).to.deep.equal(ans);
    });
  });

  describe('Terminate Symbol', () => {
    it('A -> B | C, C -> D', () => {
      let ans = parser.contextToRuleData(`
        A -> B | C
        C -> D
      `);
      ans = util.getTerminateSymbol(ans);
      expect(['B', 'D']).to.deep.equal(ans);
    });
    it('A -> B, B -> C, C -> D', () => {
      let ans = parser.contextToRuleData(`
        A -> B
        B -> C
        C -> D
      `);
      ans = util.getTerminateSymbol(ans);
      expect(['D']).to.deep.equal(ans);
    });
    it('A -> B | C | D, B -> CAT | DOG, D -> CAT | C', () => {
      let ans = parser.contextToRuleData(`
        A -> B | C | D
        B -> CAT | DOG
        D -> CAT | C
      `);
      ans = util.getTerminateSymbol(ans).sort();
      expect(['C', 'CAT', 'DOG']).to.deep.equal(ans);
    });
    it('A -> B | C | D | E, B -> C | D | E | F, C -> D | E | F | G', () => {
      let ans = parser.contextToRuleData(`
        A -> B | C | D | E
        B -> C | D | E | F
        C -> D | E | F | G
      `);
      ans = util.getTerminateSymbol(ans).sort();
      expect(['D', 'E', 'F', 'G']).to.deep.equal(ans);
    });


  });

  describe('Array Merge', () => {
    it('[1,2,3], [4,5]', () => {
      expect([1, 2, 3, 4, 5]).to.deep.equal(
        util.arrayMerge([1, 2, 3], [4, 5])
      );
    });
    it('[1,2,3], [1,2,4]', () => {
      expect([1, 2, 3, 4]).to.deep.equal(
        util.arrayMerge([1, 2, 3], [1, 2, 4])
      );
    });
    it('[3,2,1],[]', () => {
      expect([3, 2, 1]).to.deep.equal(
        util.arrayMerge([3, 2, 1], [])
      );
    });
  });

  describe('Array Diff', () => {
    it('[1,2,3], [3,1,2]', () => {
      expect(false).to.equal(
        util.arrayDiff([1, 2, 3], [3, 1, 2])
      );
    });
    it('[1,2,3,4], [1,2,4]', () => {
      expect(true).to.equal(
        util.arrayDiff([1, 2, 3, 4], [1, 2, 4])
      );
    });
    it('[3,2,1],[1,2,5]', () => {
      expect(true).to.equal(
        util.arrayDiff([3, 2, 1], [1, 2, 5])
      );
    });
  });
});
