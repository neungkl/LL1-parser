import parserImport  from "./grammar/parser.js";
import firstSet from "./LL1/firstSet.js";
import followSet from "./LL1/followSet.js";
import parsingTable from "./LL1/parsingTable.js";
import scannerImport from "./scanner/scanner.js";
import util from "./util.js";

window.func = {
  parseToRule: parserImport.contextToRuleData,
  firstSet: firstSet,
  followSet: followSet,
  parsingTable: parsingTable,
  scanner: scannerImport,
  getTerminateSymbol: util.getTerminateSymbol,
  getNonTerminateSymbol: util.getNonTerminateSymbol,
  lambda: util.lambda
};
