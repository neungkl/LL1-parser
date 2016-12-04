/* @flow */
/* jshint ignore:start */

type RuleData = {
  first: string,
  map: string[][]
};

const lambda = 'LAMBDA';

const getNonTerminateSymbol = (ruleList: RuleData[]): string[] => {
  return ruleList.map((rule: RuleData) => rule.first);
};

const getTerminateSymbol = (ruleList: RuleData[]): string[] => {
  let symbolSet: string[] = [];
  for (let i = 0; i < ruleList.length; i++) {
    let subset: string[] = ruleList[i].map.reduce(
      (x, y) => x.concat(y), []
    );

    symbolSet = symbolSet.concat(subset);
  }

  let nonTerminateSet: string[] = getNonTerminateSymbol(ruleList);

  symbolSet = symbolSet.filter(function (symbol: string): boolean {
    return nonTerminateSet.indexOf(symbol) === -1;
  });

  // Unique symbol
  symbolSet = symbolSet.filter((v, i, s) => s.indexOf(v) === i)

  return symbolSet;
};

const arrayMerge = (a: any[], b: any[]): any[] => {
  return a.concat(b).filter((v, i, s) => s.indexOf(v) === i);
};

const arrayDiff = (a: any[], b: any[]): boolean => {
  if(a.length !== b.length) return true;
  a = a.sort();
  b = b.sort();
  for(let i=0; i<a.length; i++) {
    if(a[i] !== b[i]) return true;
  }
  return false;
};

const inArray = (a: any, b: any[]) => {
  return b.indexOf(a) !== -1;
}

const removeLambda = (map: string[]): string[] => {
  return map.filter((each: string) => each !== lambda);
}

module.exports = {
  getNonTerminateSymbol: getNonTerminateSymbol,
  getTerminateSymbol: getTerminateSymbol,
  arrayMerge: arrayMerge,
  arrayDiff: arrayDiff,
  inArray: inArray,
  removeLambda: removeLambda,
  lambda: lambda
}
