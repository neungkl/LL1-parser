import util from "../src/LL1/util.js";
import firstSet from "../src/LL1/firstSet.js";
import followSet from "../src/LL1/followSet.js";
import parser from "../src/grammar/parser.js";

var pre = require('./grammar.test.js');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;

const cleanMap = (data) => {
  for (let key in data) {
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

    describe('Array Merge', () => {
      it('[1,2,3], [4,5]', () => {
        expect([1,2,3,4,5]).to.deep.equal(
          util.arrayMerge([1,2,3],[4,5])
        );
      });
      it('[1,2,3], [1,2,4]', () => {
        expect([1,2,3,4]).to.deep.equal(
          util.arrayMerge([1,2,3],[1,2,4])
        );
      });
      it('[3,2,1],[]', () => {
        expect([3,2,1]).to.deep.equal(
          util.arrayMerge([3,2,1],[])
        );
      });
    });

    describe('Array Diff', () => {
      it('[1,2,3], [3,1,2]', () => {
        expect(false).to.equal(
          util.arrayDiff([1,2,3], [3,1,2])
        );
      });
      it('[1,2,3,4], [1,2,4]', () => {
        expect(true).to.equal(
          util.arrayDiff([1,2,3,4],[1,2,4])
        );
      });
      it('[3,2,1],[1,2,5]', () => {
        expect(true).to.equal(
          util.arrayDiff([3,2,1],[1,2,5])
        );
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
    it('Test Case #3', () => {
      let ans = parser.contextToRuleData(`
        Goal -> A
        A -> ( A ) | Two
        Two -> a
        Two -> b
      `);
      ans = cleanMap(firstSet(ans));
      expect({
        'A': ['(', 'a', 'b'],
        'Two': ['a', 'b'],
        'Goal': ['(', 'a', 'b']
      }).to.deep.equal(ans);
    });
    it('Test Case #4', () => {
      let ans = parser.contextToRuleData(`
        exp -> term exp'
        exp' -> addop term exp' | LAMBDA
        addop -> + | -
        term -> factor term'
        term' -> mulop factor term' | LAMBDA
        mulop -> *
        factor -> ( exp ) | num
      `);
      ans = cleanMap(firstSet(ans));
      expect({
        'exp': ['(', 'num'],
        'exp\'': ['+', '-', 'LAMBDA'],
        'addop': ['+', '-'],
        'term': ['(', 'num'],
        'term\'': ['*', 'LAMBDA'],
        'mulop': ['*'],
        'factor': ['(', 'num']
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

  describe('Follow Set', () => {

    it('Test Case #1', () => {
      let ans = parser.contextToRuleData(`
        S -> id | V assign E
        V -> id
        E -> V | num
      `);
      ans = cleanMap(followSet(ans));
      expect({
        'S': ['$'],
        'V': ['$', 'assign'],
        'E': ['$']
      }).to.deep.equal(ans);
    });
    it('Test Case #2', () => {
      let ans = parser.contextToRuleData(`
        A -> B | C | cat D
        B -> V and H
        V -> dog | H bird
        H -> fish | bird
      `);
      ans = cleanMap(followSet(ans));
      expect({
        'A': ['$'],
        'B': ['$'],
        'V': ['and'],
        'H': ['$','bird']
      }).to.deep.equal(ans);
    });
    it('Test Case #3', () => {
      let ans = parser.contextToRuleData(`
        Goal -> A
        A -> ( A ) | Two
        Two -> a
        Two -> b
      `);
      ans = cleanMap(followSet(ans));
      expect({
        'A': ['$', ')'],
        'Two': ['$', ')'],
        'Goal': ['$']
      }).to.deep.equal(ans);
    });
    it('Test Case #4', () => {
      let ans = parser.contextToRuleData(`
        exp -> term exp'
        exp' -> addop term exp' | LAMBDA
        addop -> + | -
        term -> factor term'
        term' -> mulop factor term' | LAMBDA
        mulop -> *
        factor -> ( exp ) | num
      `);
      ans = cleanMap(followSet(ans));
      expect({
        'exp': ['$', ')'],
        'exp\'': ['$', ')'],
        'addop': ['(', 'num'],
        'term': ['$', ')', '+', '-'],
        'term\'': ['$', ')', '+', '-'],
        'mulop': ['(', 'num'],
        'factor': ['$', ')', '*', '+', '-']
      }).to.deep.equal(ans);
    });
    it('Test Case #5', () => {
      let ans = parser.contextToRuleData(`
        E -> T E'
        E' -> + T E'
        E' -> LAMBDA
        T -> F T'
        T' -> * F T'
        T' -> LAMBDA
        F -> ( E )
        F -> id
      `);
      ans = cleanMap(followSet(ans));
      expect({
        'E': ['$', ')'],
        'E\'': ['$', ')'],
        'T': ['$', ')', '+'],
        'T\'': ['$', ')', '+'],
        'F': ['$', ')', '*', '+']
      }).to.deep.equal(ans);
    });
    it('Test Case #6', () => {
      let ans = parser.contextToRuleData(`
        E -> T E'
        E' -> + T E' | LAMBDA
        T -> F T'
        T' -> * F T' | LAMBDA
        F -> ( E ) | id
      `);
      ans = cleanMap(followSet(ans));
      expect({
        'E': ['$', ')'],
        'E\'': ['$', ')'],
        'T': ['$', ')', '+'],
        'T\'': ['$', ')', '+'],
        'F': ['$',')','*','+']
      }).to.deep.equal(ans);
    });
    it('Infinite Loop', function(done) {
      let ans = parser.contextToRuleData(`
        A -> B
        B -> C
        C -> A
      `);
      expect(followSet.bind(followSet, ans)).to.throw('Infinite Loop');
      done();
    });

  });

});