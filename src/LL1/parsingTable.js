/* @flow */
/* jshint ignore:start */

import util from "./util.js";
import firstSetGenerator from "./firstSet.js";
import followSetGenerator from "./followSet.js";

type RuleDataList = {
  first: string,
  map: string[][]
}[];

type SingleRuleType = {
  first: string,
  imply: string[]
};

type ParsingTableData = {
  rule: SingleRuleType[],
  table: any[][]
};

type Map = {
  [key: string]: string[]
};

const lambda = util.lambda;

const ruleSplitter = (ruleList: RuleDataList): SingleRuleType[] => {
  let result: SingleRuleType[] = [];

  for (let i = 0; i < ruleList.length; i++) {
    for (let j = 0; j < ruleList[i].map.length; j++) {
      result.push({
        first: ruleList[i].first,
        imply: ruleList[i].map[j]
      });
    }
  }

  return result;
};

const parsingTableGenerator = (ruleList: RuleDataList, firstSet: ? Map, followSet : ? Map): ParsingTableData => {
  firstSet = firstSet || firstSetGenerator(ruleList);
  followSet = followSet || followSetGenerator(ruleList);

  let termSet = util.removeLambda(util.getTerminateSymbol(ruleList));
  let nonTermSet = util.getNonTerminateSymbol(ruleList);

  /*
   * For splitting A -> B | C | D to
   * A -> B
   * A -> C
   * A -> D
   */
  let ruleSplit: SingleRuleType[] = ruleSplitter(ruleList);

  let row = nonTermSet.length;
  let col = termSet.length;

  let table: any[][] = [];

  let ruleCount = ruleSplit.length;

  const setTable = (nameRow: string, nameCol: string, val: number) => {
    let r, c;
    r = c = 0;
    for (; r <= row; r++) {
      if (nameRow === table[r][0]) break;
    }
    for (; c <= col + 1; c++) {
      if (nameCol === table[0][c]) break;
    }
    if (r <= row && c <= col + 1) table[r][c] = val;
    else {
      if(nameCol == util.lambda) return ;
      console.log(table);
      console.log(nameRow, nameCol, val, r, c);
      throw "Impossible";
    }
  };

  // Init table
  for (let i = 0; i <= row; i++) {
    table[i] = [];
    for (let j = 0; j <= col + 1; j++) {
      if (i == 0 && j > 0) {
        if (j == col + 1) table[i][j] = '$';
        else table[i][j] = termSet[j - 1];
      } else if (j == 0 && i > 0) {
        table[i][j] = nonTermSet[i - 1];
      } else {
        if (i == 0 && j == 0) table[i][j] = 0;
        // Put parsing error number
        else table[i][j] = ruleCount + 2;
      }
    }
  }

  // Init table with Pop Error number
  for (let i = 0; i < ruleCount; i++) {
    let X = followSet[ruleSplit[i].first];
    for (let j = 0; j < X.length; j++) {
      // Putting pop error number to table
      setTable(ruleSplit[i].first, X[j], ruleCount + 1);
    }
  }

  // Real putting order number to table
  for (let i = 0; i < ruleCount; i++) {
    let X;
    if (ruleSplit[i].imply[0] === lambda) {
      X = followSet[ruleSplit[i].first];
    } else {
      X = ruleSplit[i].imply[0];
      if (util.inArray(X, termSet)) {
        X = [X];
      } else {
        X = firstSet[ruleSplit[i].imply[0]];
      }
    }
    for (let j = 0; j < X.length; j++) {
      setTable(ruleSplit[i].first, X[j], i + 1);
    }
  }

  ruleSplit.unshift({
    first: '',
    imply: []
  });

  return {
    rule: ruleSplit,
    table: table
  };
};

module.exports = parsingTableGenerator;
