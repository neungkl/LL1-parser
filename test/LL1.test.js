import util from "../src/LL1/util.js";
import firstSet from "../src/LL1/firstSet.js";
import parser from "../src/grammar/parser.js";

var pre = require('./grammar.test.js');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;

const cleanMap = (data) => {
  for(let key in data) {
    data[key] = data[key].sort();
  }
  return data;
};

describe('LL1', () => {

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
  });


  describe('First Set', () => {

    it('Test Case #1', () => {
      let ans = parser.contextToRuleData(`
        S -> id | V assign E
        V -> id
        E -> V | num
      `);
      ans = cleanMap(firstSet(ans));
      expect({
        'S': ['id'],
        'E': ['id', 'num'],
        'V': ['id']
      }).to.deep.equal(ans);
    });
    it('Test Case #2', () => {
      let ans = parser.contextToRuleData(`
        A -> B | C | cat D
        B -> V and H
        V -> dog | H bird
        H -> fish | bird
      `);
      ans = cleanMap(firstSet(ans));
      expect({
        'A': ['C', 'bird', 'cat', 'dog', 'fish'],
        'B': ['bird', 'dog', 'fish'],
        'V': ['bird', 'dog', 'fish'],
        'H': ['bird', 'fish']
      }).to.deep.equal(ans);
    });
    it('Infinite Loop', () => {
      let ans = parser.contextToRuleData(`
        A -> B
        B -> C
        C -> A
      `);
      expect(firstSet.bind(firstSet, ans)).to.throw('Infinite Loop');
    });

  });

});