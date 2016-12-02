import grammar from "./grammar.js"

var lineSplit = (word: string) => {
  return word
    .split('\n')
    .map((line: string) => line.trim())
    .filter((line: string) => line.length);
}

module.exports = {
  lineSplit: lineSplit
};