/* @flow */
/* jshint ignore:start */

import util from "../util.js";

type SingleRuleType = {
  first: string,
  imply: string[]
};

type ParsingTableData = {
  rule: SingleRuleType[],
  table: any[][]
};

const scan = (message: string, parsingTableRaw: ParsingTableData): mixed => {

  let messageToken: string[] = message.split(' ').filter(x => x.length);

  let ruleSet: SingleRuleType[] = parsingTableRaw.rule;
  let parsingTable: any[][] = parsingTableRaw.table;

  let termSet: any[] = parsingTable[0];
  let nonTermSet: any[] = [];

  let status: string = 'PASS';

  for(let i=0; i<parsingTable.length; i++) {
    nonTermSet.push(parsingTable[i][0]);
  }

  for(let i=0; i<parsingTable.length; i++) {
    for(let j=0; j<parsingTable[i].length; j++) {
      if(Array.isArray(parsingTable[i][j])) {
        return {
          status: 'NOT_LL1'
        };
      }
    }
  }

  ///////////////////
  // Begin Parsing //
  ///////////////////

  type State = {
    symbol: string,
    stack: any
  };

  let parsingTree = [];

  let log: string[] = [];
  let Q: State[] = [];
  let tokenPos = 0;

  const addLog = (str) => {
    // console.log(str);
    log.push(str);
  }

  Q.push({
    symbol: '$',
    stack: []
  });
  Q.push({
    symbol: ruleSet[1].first,
    stack: []
  });

  messageToken.push('$');

  let t = 100000;

  while(Q.length > 0 && t-- >= 0) {

    let curState: State = Q.pop();
    let curStack = curState.stack;
    let symbol: string = curState.symbol;
    let token: string = messageToken[tokenPos];

    let S = parsingTree;
    for(let i=0; i<curStack.length; i++) {
      S = S[curStack[i]];
    }

    if(symbol === util.lambda) {
      addLog('Map Token : λ');
      continue;
    }

    if(util.inArray(symbol, termSet)) {
      if(token !== symbol) {
        if(symbol === '$') {
          status = 'TOKEN_EXCEED';
        } else {
          status = 'TOKEN_NOT_MATCH';
        }
        break;
      }
      S.push(token);
      addLog('Map Token : ' + token);
      tokenPos++;
      continue;
    }

    let tokenCol: number = 1;
    let symbolRow: number = 1;

    for(; tokenCol<termSet.length; tokenCol++) {
      if(token === termSet[tokenCol]) break;
    }
    if(tokenCol === termSet.length) {
      status = 'TOKEN_NOT_MATCH_TERMINATE';
      break;
    }

    for(; symbolRow<nonTermSet.length; symbolRow++) {
      if(nonTermSet[symbolRow] === symbol) break;
    }

    let nextRuleNo: number = parsingTable[symbolRow][tokenCol];

    if(nextRuleNo === ruleSet.length) {
      status = 'POP_ERROR';
      break;
    } else if(nextRuleNo === ruleSet.length + 1) {
      status = 'SCAN_ERROR';
      break;
    }

    //console.log(nextRuleNo, ruleSet);
    let nextRule: SingleRuleType = ruleSet[nextRuleNo];

    addLog('Rule : ' + nextRule.first + ' -> ' +  nextRule.imply.join(' '));

    let curTree = {};
    curTree[symbol] = [];

    for(let term = nextRule.imply.length - 1; term >= 0; term--) {
      Q.push({
        symbol: nextRule.imply[term],
        stack: curStack.concat([S.length, symbol])
      });
    }

    S.push(curTree);
  }

  if(t == 0) {
    status = 'STACK_OVERFLOW';
  }

  return {
    status: status,
    log: log,
    parsingTree: parsingTree
  };
};

module.exports = scan;
