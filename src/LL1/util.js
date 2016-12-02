/* @flow */
/* jshint ignore:start */

type RuleData = {first: string, map: string[][]};

const getNonTerminateSymbol = (ruleList: RuleData[]): string[] => {
  return ruleList.map((rule: RuleData) => rule.first);
}

const getTerminateSymbol = (ruleList: RuleData[]): string[] => {
  let symbolSet: string[] = [];
  for(let i=0; i<ruleList.length; i++) {
    let subset: string[] = ruleList[i].map.reduce(
      (x, y) => x.concat(y),
      []
    );

    symbolSet = symbolSet.concat(subset);
  }

  let nonTerminateSet: string[] = getNonTerminateSymbol(ruleList);

  symbolSet = symbolSet.filter(function(symbol: string): boolean {
    return nonTerminateSet.indexOf(symbol) === -1;
  });

  // Unique symbol
  symbolSet = symbolSet.filter((v, i, a) => a.indexOf(v) === i)

  return symbolSet;
}

module.exports = {
  getNonTerminateSymbol: getNonTerminateSymbol,
  getTerminateSymbol: getTerminateSymbol
}