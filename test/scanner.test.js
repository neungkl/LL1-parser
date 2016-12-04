import parser from "../src/grammar/parser.js";
import parsingTable from "../src/LL1/parsingTable.js";
import scanner from "../src/scanner/scanner.js";

console.log(scanner);

var pre = require('./LL1.test.js');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;

const grammarToParsingTable = (grammar) => {
  return parsingTable(parser.contextToRuleData(grammar));
};

const formatLog = (log) => {
  return log.split('\n').map(x => x.trim()).filter(x => x.length);
}

describe('Scanner', () => {

  it('Test Case #1 (Simple Plus)', () => {
    let grammar = `
      S -> F | ( S + S )
      F -> a
    `;
    let str = '( ( a + a ) + a )';
    let expectLog = `
    Rule : S -> ( S + S )
    Map Token : (
    Rule : S -> ( S + S )
    Map Token : (
    Rule : S -> F
    Rule : F -> a
    Map Token : a
    Map Token : +
    Rule : S -> F
    Rule : F -> a
    Map Token : a
    Map Token : )
    Map Token : +
    Rule : S -> F
    Rule : F -> a
    Map Token : a
    Map Token : )
    Map Token : $
    `;
    let result = scanner(str, grammarToParsingTable(grammar));
    expect({
      status: 'PASS',
      log: formatLog(expectLog),
      parsingTree: [{
        "S": ["(", {
          "S": ["(", {
            "S": [{
              "F": ["a"]
            }]
          }, "+", {
            "S": [{
              "F": ["a"]
            }]
          }, ")"]
        }, "+", {
          "S": [{
            "F": ["a"]
          }]
        }, ")"]
      }, "$"]
    }).to.deep.equal(result);
  });

  it('Test Case #2 (cccdcccccd)', () => {
    let grammar = `
      S  -> C C'
      C' -> C C' | LAMBDA
      C  -> c C  | d
    `;
    let str = 'ccdcccccdcccdcccccdcdcd'.split('').join(' ');
    let expectLog = `
    Rule : S -> C C'
    Rule : C -> c C
    Map Token : c
    Rule : C -> c C
    Map Token : c
    Rule : C -> d
    Map Token : d
    Rule : C' -> C C'
    Rule : C -> c C
    Map Token : c
    Rule : C -> c C
    Map Token : c
    Rule : C -> c C
    Map Token : c
    Rule : C -> c C
    Map Token : c
    Rule : C -> c C
    Map Token : c
    Rule : C -> d
    Map Token : d
    Rule : C' -> C C'
    Rule : C -> c C
    Map Token : c
    Rule : C -> c C
    Map Token : c
    Rule : C -> c C
    Map Token : c
    Rule : C -> d
    Map Token : d
    Rule : C' -> C C'
    Rule : C -> c C
    Map Token : c
    Rule : C -> c C
    Map Token : c
    Rule : C -> c C
    Map Token : c
    Rule : C -> c C
    Map Token : c
    Rule : C -> c C
    Map Token : c
    Rule : C -> d
    Map Token : d
    Rule : C' -> C C'
    Rule : C -> c C
    Map Token : c
    Rule : C -> d
    Map Token : d
    Rule : C' -> C C'
    Rule : C -> c C
    Map Token : c
    Rule : C -> d
    Map Token : d
    Rule : C' -> LAMBDA
    Map Token : λ
    Map Token : $
    `;
    let result = scanner(str, grammarToParsingTable(grammar));
    expect({
      status: 'PASS',
      log: formatLog(expectLog),
      parsingTree: [{
        "S": [{
          "C": ["c", {
            "C": ["c", {
              "C": ["d"]
            }]
          }]
        }, {
          "C'": [{
            "C": ["c", {
              "C": ["c", {
                "C": ["c", {
                  "C": ["c", {
                    "C": ["c", {
                      "C": ["d"]
                    }]
                  }]
                }]
              }]
            }]
          }, {
            "C'": [{
              "C": ["c", {
                "C": ["c", {
                  "C": ["c", {
                    "C": ["d"]
                  }]
                }]
              }]
            }, {
              "C'": [{
                "C": ["c", {
                  "C": ["c", {
                    "C": ["c", {
                      "C": ["c", {
                        "C": ["c", {
                          "C": ["d"]
                        }]
                      }]
                    }]
                  }]
                }]
              }, {
                "C'": [{
                  "C": ["c", {
                    "C": ["d"]
                  }]
                }, {
                  "C'": [{
                    "C": ["c", {
                      "C": ["d"]
                    }]
                  }, {
                    "C'": []
                  }]
                }]
              }]
            }]
          }]
        }]
      }, "$"]
    }).to.deep.equal(result);
  });

});
