import util from "../src/util.js";
import firstSet from "../src/LL1/firstSet.js";
import followSet from "../src/LL1/followSet.js";
import parsingTable from "../src/LL1/parsingTable.js"
import parser from "../src/grammar/parser.js";

var pre = require('./grammar.test.js');
var pre = require('./util.test.js');
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
        'H': ['$', 'bird']
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
        'F': ['$', ')', '*', '+']
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

  describe('Parsing Table', () => {
    it('Test Case #1', () => {
      let ans = parser.contextToRuleData(`
        S -> id | V assign E
        V -> id
        E -> V | num
      `);
      let correct = {
        rule: [{
          first: '',
          imply: []
        }, {
          first: 'S',
          imply: ['id']
        }, {
          first: 'S',
          imply: ['V', 'assign', 'E']
        }, {
          first: 'V',
          imply: ['id']
        }, {
          first: 'E',
          imply: ['V']
        }, {
          first: 'E',
          imply: ['num']
        }],
        table: [
          [0, "id", "assign", "num", "$"],
          ['S', 2, 7, 7, 6],
          ['V', 3, 6, 7, 6],
          ['E', 4, 7, 5, 6]
        ]
      }
      ans = parsingTable(ans);
      expect(ans).to.deep.equal(correct);
    });
    it('Test Case #2', () => {
      let ans = parser.contextToRuleData(`
        A -> B | C D | D
        B -> b
        C -> c | LAMBDA
        D -> d | LAMBDA
      `);
      let correct = {
        rule: [{
          first: '',
          imply: []
        }, {
          first: 'A',
          imply: ['B']
        }, {
          first: 'A',
          imply: ['C', 'D']
        }, {
          first: 'A',
          imply: ['D']
        }, {
          first: 'B',
          imply: ['b']
        }, {
          first: 'C',
          imply: ['c']
        }, {
          first: 'C',
          imply: ['LAMBDA']
        }, {
          first: 'D',
          imply: ['d']
        }, {
          first: 'D',
          imply: ['LAMBDA']
        }],
        table: [
          [0, "b", "c", "d", "$"],
          ['A', 1, 2, 3, 9],
          ['B', 4, 10, 10, 9],
          ['C', 10, 5, 6, 6],
          ['D', 10, 10, 7, 8]
        ]
      }
      ans = parsingTable(ans);
      expect(ans).to.deep.equal(correct);
    });
    it('Test Case #3', () => {
      let ans = parser.contextToRuleData(`
        exp -> term exp'
        exp' -> addop term exp' | LAMBDA
        addop -> + | -
        term -> factor term'
        term' -> mulop factor term' | LAMBDA
        mulop -> *
        factor -> ( exp ) | num
      `);
      let correct = {
        rule: [{
          first: '',
          imply: []
        }, {
          first: 'exp',
          imply: ['term', 'exp\'']
        }, {
          first: 'exp\'',
          imply: ['addop', 'term', 'exp\'']
        }, {
          first: 'exp\'',
          imply: ['LAMBDA']
        }, {
          first: 'addop',
          imply: ['+']
        }, {
          first: 'addop',
          imply: ['-']
        }, {
          first: 'term',
          imply: ['factor', 'term\'']
        }, {
          first: 'term\'',
          imply: ['mulop', 'factor', 'term\'']
        }, {
          first: 'term\'',
          imply: ['LAMBDA']
        }, {
          first: 'mulop',
          imply: ['*']
        }, {
          first: 'factor',
          imply: ['(', 'exp', ')']
        }, {
          first: 'factor',
          imply: ['num']
        }],
        table: [
          [0, "+", "-", "*", "(", ")", "num", "$"],
          ['exp', 13, 13, 13, 1, 12, 1, 12],
          ['exp\'', 2, 2, 13, 13, 3, 13, 3],
          ['addop', 4, 5, 13, 12, 13, 12, 13],
          ['term', 12, 12, 13, 6, 12, 6, 12],
          ['term\'', 8, 8, 7, 13, 8, 13, 8],
          ['mulop', 13, 13, 9, 12, 13, 12, 13],
          ['factor', 12, 12, 12, 10, 12, 11, 12]
        ]
      }
      ans = parsingTable(ans);
      expect(ans).to.deep.equal(correct);
    });
    it('Test Case #4', () => {
      let ans = parser.contextToRuleData(`
        E -> T E'
        E' -> + T E' | LAMBDA
        T -> F T'
        T' -> * F T' | LAMBDA
        F -> ( E ) | id
      `);
      let correct = {
        rule: [{
          first: '',
          imply: []
        }, {
          first: 'E',
          imply: ['T', 'E\'']
        }, {
          first: 'E\'',
          imply: ['+', 'T', 'E\'']
        }, {
          first: 'E\'',
          imply: ['LAMBDA']
        }, {
          first: 'T',
          imply: ['F', 'T\'']
        }, {
          first: 'T\'',
          imply: ['*', 'F', 'T\'']
        }, {
          first: 'T\'',
          imply: ['LAMBDA']
        }, {
          first: 'F',
          imply: ['(', 'E', ')']
        }, {
          first: 'F',
          imply: ['id']
        }],
        table: [
          [0, "+", "*", "(", ")", "id", "$"],
          ['E', 10, 10, 1, 9, 1, 9],
          ['E\'', 2, 10, 10, 3, 10, 3],
          ['T', 9, 10, 4, 9, 4, 9],
          ['T\'', 6, 5, 10, 6, 10, 6],
          ['F', 9, 9, 7, 9, 8, 9]
        ]
      }
      ans = parsingTable(ans);
      expect(ans).to.deep.equal(correct);
    });
  });

});
