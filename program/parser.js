const parserHelper = require('./parser-helper.js');
const parserTable = parserHelper['table'];
const pushMap = parserHelper['pushMap'];
const rule = parserHelper['rule'];
const fs = require('fs');
const path = require('path');

const scanNumber = parserHelper['scanNumber'];
const wordList = parserTable[0];

const nonReserveWord = ["FUNC_NAME", "VARIABLE", "VALUE"];
var mapVariableWord = [];

function strcmp(a, b) {
  if(nonReserveWord.indexOf(a) !== -1 || nonReserveWord.indexOf(b) !== -1) return true;
  if(a == parseInt(a) && b === "NUMBER") return true;
  return a == b;
}

function findWord(word) {
  for(let i=1; i<wordList.length; i++) {
    if(word === wordList[i]) return i;
  }
  for(let i=0; i<mapVariableWord.length; i++) {
    if(word === mapVariableWord[i].word) {
      return findWord(mapVariableWord[i].map);
    }
  }
  if(word == parseInt(word)) {
    return findWord("NUMBER");
  }
  return -1;
}

function parse(data) {

  let dataIndex = 0;
  let state = [];

  let isError = false;

  console.log("Begin Parse...");

  state.push(1);
  while(!isError && dataIndex < data.length) {

    //console.log(state);

    let curState = state.pop();
    if(curState < 0) {
      curState = -curState;
      if(strcmp(data[dataIndex], wordList[curState]) !== true) {
        console.log("Parse Error 0x1 (Word Not Match) :", data[dataIndex], wordList[curState]);
        isError = true;
        break;
      }
      if(nonReserveWord.indexOf(wordList[curState]) !== -1) {
        mapVariableWord.push({
          word: data[dataIndex],
          map: wordList[curState]
        });
      }
      console.log("Map Word :", data[dataIndex], wordList[curState]);
      dataIndex++;
    } else {

      let wordIndex = findWord(data[dataIndex]);
      if(wordIndex == -1 && nonReserveWord.indexOf(wordList[curState]) !== -1) {
        wordIndex = findWord(wordList[curState]);
      }

      //console.log("--->", curState, wordIndex, data[dataIndex], wordList[curState], nonReserveWord.indexOf(wordList[curState]));

      if(wordIndex == -1) {
        console.log("Parse Error 0x2 (Forbidden Word) :", data[dataIndex]);
        isError = true;
        break;
      }

      let ruleNo = parserTable[curState + 1][wordIndex];

      if(ruleNo == scanNumber + 1) {
        console.log("Parse Error 0x3 (Pop Error) :", data[dataIndex]);
        isError = true;
        break;
      } else if(ruleNo == scanNumber + 2) {
        console.log("Parse Error 0x4 (Scan Error) :", data[dataIndex]);
        isError = true;
        break;
      }

      if(typeof pushMap[ruleNo] === "undefined") {
        //isError = true;
      } else {
        console.log("Apply Rule", ruleNo, ":", rule[ruleNo]);

        for(let i=0; i<pushMap[ruleNo].length; i++) {
          state.push(pushMap[ruleNo][i]);
        }
      }
    }
  }

  if(!isError) {
    console.log("Parse Complete...");
  }
}

fs.readFile(path.join(__dirname, '../main.verbal'), 'utf8', (err, data) => {
  if (err) throw err;
  data = data
    .split('\n')
    .map(function(x) {
      return x.split(' ').filter(function(x) {
        return x.length != 0
      })
    })
    .reduce(function(a, b) {
      return a.concat(b)
    }, [])
    .map(function(x) {
      return x.trim();
    });

  parse(data);

});
