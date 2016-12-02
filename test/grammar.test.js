import parser from "../src/grammar/parser.js";

var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;

describe('Grammar Parser', () => {

  describe('Line Splitter', () => {
    it('line splitter (1)', () => {
      expect(parser.lineSplit("\na\n\nb\nc")).to.deep.equal([
        ['a'],
        ['b'],
        ['c']
      ]);
    });
    it('line splitter (2)', () => {
      expect(parser.lineSplit("a\n\n\n\nb\nc")).to.deep.equal([
        ['a'],
        ['b'],
        ['c']
      ]);
    });
    it('line splitter (3)', () => {
      expect(parser.lineSplit("a\n   \nb\nc")).to.deep.equal([
        ['a'],
        ['b'],
        ['c']
      ]);
    });

    it('line splitter : Multiple word (1)', () => {
      expect(parser.lineSplit("\na b c\n\nd\ne")).to.deep.equal([
        ['a', 'b', 'c'],
        ['d'],
        ['e']
      ]);
    });
    it('line splitter : Multiple word (2)', () => {
      expect(parser.lineSplit("  a  b c\n\nd\ne   f ")).to.deep.equal([
        ['a', 'b', 'c'],
        ['d'],
        ['e', 'f']
      ]);
    });
  });

  describe('Valid Grammar', () => {
    it('a -> b, c -> d, e -> f', () => {
      let grammar = [
        ['a', '->', 'b'],
        ['c', '->', 'd'],
        ['e', '->', 'f']
      ];
      assert.equal(true, parser.validGrammar(grammar));
    });
    it('-> a b', () => {
      let grammar = [
        ['->', 'a', 'b']
      ];
      assert.equal(false, parser.validGrammar(grammar));
    });
    it('e f ->', () => {
      let grammar = [
        ['e', 'f', '->']
      ];
      assert.equal(false, parser.validGrammar(grammar));
    });
    it('a b -> c, c -> d, e -> f', () => {
      let grammar = [
        ['a', 'b', '->', 'c'],
        ['c', '->', 'd'],
        ['e', '->', 'f']
      ];
      assert.equal(false, parser.validGrammar(grammar));
    });
  });

  describe('Rule Parsing', () => {
    it('a -> b, c -> d, e -> f', () => {
      let grammar = [
        ['a', '->', 'b'],
        ['c', '->', 'd'],
        ['e', '->', 'f']
      ];
      expect(parser.ruleParsing(grammar))
        .to.deep
        .equal([
          {first: 'a', map:[['b']]},
          {first: 'c', map:[['d']]},
          {first: 'e', map:[['f']]}
        ]);
    });
    it('a -> b c d e, c -> d f, e -> f g', () => {
      let grammar = [
        ['a', '->', 'b','c','d','e'],
        ['c', '->', 'd','f'],
        ['e', '->', 'f','g']
      ];
      expect(parser.ruleParsing(grammar))
        .to.deep
        .equal([
          {first: 'a', map:[['b','c','d','e']]},
          {first: 'c', map:[['d','f']]},
          {first: 'e', map:[['f','g']]}
        ]);
    });
    it('a -> b c d e | k | j, c -> d f | | h, e -> f g | t a | b c', () => {
      let grammar = [
        ['a', '->', 'b','c','d','e','|','k','|','j'],
        ['c', '->', 'd','f','|','|','h'],
        ['e', '->', 'f','g','|','t','a','|','b','c']
      ];
      expect(parser.ruleParsing(grammar))
        .to.deep
        .equal([
          {first: 'a', map:[['b','c','d','e'],['k'],['j']]},
          {first: 'c', map:[['d','f'],['h']]},
          {first: 'e', map:[['f','g'],['t','a'],['b','c']]}
        ]);
    });
  });

});