import grammarTokenize from "../src/grammar/grammarTokenize.js"

var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;

describe('Grammar', () => {

  ///////////////
  // TOKENIZER //
  ///////////////

  describe('Tokenizer', () => {
    it('line splitter (1)', () => {
      expect(grammarTokenize.lineSplit("\na\n\nb\nc")).to.deep.equal(['a','b','c']);
    });
    it('line splitter (2)', () => {
      expect(grammarTokenize.lineSplit("a\n\n\n\nb\nc")).to.deep.equal(['a','b','c']);
    });
    it('line splitter (3)', () => {
      expect(grammarTokenize.lineSplit("a\n   \nb\nc")).to.deep.equal(['a','b','c']);
    });
  });
});