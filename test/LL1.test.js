import util from "../src/LL1/util.js";
import parser from "../src/grammar/parser.js";

var pre = require('./grammar.test.js');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;

describe('LL1 Util', () => {

  describe('Non-Terminate Symbol', () => {
    it('A -> B | C, C -> D', () => {
      let ans = parser.contextToRuleData(`
        A -> B | C
        C -> D
      `);
      ans = util.getNonTerminateSymbol(ans);
      expect(['A','C']).to.deep.equal(ans);
    });
    it('A -> B, B -> C, C -> D', () => {
      let ans = parser.contextToRuleData(`
        A -> B
        B -> C
        C -> D
      `);
      ans = util.getNonTerminateSymbol(ans);
      expect(['A','B','C']).to.deep.equal(ans);
    });
  });

  describe('Terminate Symbol', () => {
    it('A -> B | C, C -> D', () => {
      let ans = parser.contextToRuleData(`
        A -> B | C
        C -> D
      `);
      ans = util.getTerminateSymbol(ans);
      expect(['B','D']).to.deep.equal(ans);
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
      expect(['C','CAT','DOG']).to.deep.equal(ans);
    });
    it('A -> B | C | D | E, B -> C | D | E | F, C -> D | E | F | G', () => {
      let ans = parser.contextToRuleData(`
        A -> B | C | D | E
        B -> C | D | E | F
        C -> D | E | F | G
      `);
      ans = util.getTerminateSymbol(ans).sort();
      expect(['D','E','F','G']).to.deep.equal(ans);
    });
  });

});