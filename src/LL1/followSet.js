/* @flow */
/* jshint ignore:start */

import util from "./util.js";
import firstSetParse from "./firstSet.js";

type RuleDataList = {
  first: string,
  map: string[][]
}[];

type Map = {
  [key: string]: string[]
};

const lambda = util.lambda;

const removeLambda = util.removeLambda;

const followSetGenerator = (rule: RuleDataList, firstSet: ?Map): Map => {

  let follow: Map = {};
  const termSet: string[] = util.getTerminateSymbol(rule);
  firstSet = firstSet || firstSetParse(rule);

  for(let i=0; i<rule.length; i++) {
    follow[rule[i].first] = (i == 0 ? ['$'] : []);
  }

  let change: boolean = true;
  let merge: string[] = [];

  while(change) {
    change = false;
    for(let ruleNo=0; ruleNo<rule.length; ruleNo++) {
      for(let cases=0; cases<rule[ruleNo].map.length; cases++) {
        let production = rule[ruleNo].map[cases];

        let N: number = production.length;
        let A: string = rule[ruleNo].first;

        for(let i=N-1; i>=0; i--) {

          // Not in Terminate Set
          let B: string = production[i];
          if(!util.inArray(B, termSet)) {
            if(i+1 >= N) {

              // If there is a production A → a B, then everything in FOLLOW(A) is in FOLLOW(B)
              merge = util.arrayMerge(follow[B], follow[A]);
              if(util.arrayDiff(merge, follow[B])) {
                follow[B] = merge;
                change = true;
              }
            } else {

              // If there is a production A → a B C
              let C: string = production[i+1];

              if(util.inArray(C, termSet)) {
                // If C is Terminate Set, then add C to FOLLOW(B)
                merge = util.arrayMerge(follow[B], [C]);
                if(util.arrayDiff(merge, follow[B])) {
                  follow[B] = merge;
                  change = true;
                }
              }
              else {
                // If C in Non-Terminate set, then add First(C) - {LAMBDA} to FOLLOW(B)
                merge = util.arrayMerge(follow[B], removeLambda(firstSet[C]));
                if(util.arrayDiff(merge, follow[B])) {
                  follow[B] = merge;
                  change = true;
                }

                // If First(C) contain LAMBDA, then add Follow(C) to to FOLLOW(B)
                if(util.inArray(lambda, firstSet[C])) {
                  merge = util.arrayMerge(follow[B], follow[C]);
                  if(util.arrayDiff(merge, follow[B])) {
                    follow[B] = merge;
                    change = true;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return follow;
}

module.exports = followSetGenerator;
