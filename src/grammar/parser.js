/* @flow */
/* jshint ignore:start */

import grammar from "./grammar.js"

type RuleData = {
  first: string,
  map: string[][]
};

const lineSplit = (context: string): string[][] => {
  return context
    .split('\n')
    .map((line: string) => line.trim())
    .filter((line: string) => line.length)
    .map((line: string) => {
      return line
        .split(' ')
        .map((word: string) => word.trim())
        .filter((word: string) => word.length)
    });
}

const validGrammar = (ruleWord: string[][]): boolean => {
  for (let i = 0; i < ruleWord.length; i++) {
    for (let j = 0; j < ruleWord[i].length; j++) {
      if (j == 1) {
        if (ruleWord[i][j] !== '->') return false;
      } else {
        if (ruleWord[i][j] === '->') return false;
      }
    }
  }
  return true;
}

const ruleParsing = (ruleWord: string[][]): RuleData[] => {
  let ruleData: RuleData[] = [];
  for (let i = 0; i < ruleWord.length; i++) {
    let first = ruleWord[i][0];
    ruleWord[i].shift();
    ruleWord[i].shift();

    let map = ruleWord[i]
      .join(' ')
      .split('|')
      .map((eachMap: string) => {
        return eachMap.split(' ').filter((word: string) => word.length)
      })
      .filter((eachMap: string[]) => eachMap.length > 0);

    ruleData.push({
      first: first,
      map: map
    })
  }

  return ruleData;
}

const contextToRuleData = (context: string): RuleData[] => {
  let contextObj: string[][] = lineSplit(context);
  if(!validGrammar(contextObj)) {
    throw "Wrong Format";
  }
  return ruleParsing(contextObj);
}


module.exports = {
  lineSplit: lineSplit,
  validGrammar: validGrammar,
  ruleParsing: ruleParsing,
  contextToRuleData: contextToRuleData
};