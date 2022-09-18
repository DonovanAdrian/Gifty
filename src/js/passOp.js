/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let encodeStore = ["0", "1", "2", "3"];
let encodeNameBool = false;
let userArrPassOp = [];

function injectUserArr(userArrInput){
  userArrPassOp = userArrInput;
}

function checkEncodeName(newEncodeName, input){
  let encodeString;
  let encodeKey;
  let encodeName;
  encodeNameBool = true;

  if (userArrPassOp.length != 0)
    for(let i = 0; i < userArrPassOp.length; i++){
      encodeString = userArrPassOp[i].encodeStr;
      encodeKey = input.split(":");
      encodeName = encodeKey[0];
      if (encodeName == newEncodeName) {
        encodeNameBool = false;
        break;
      }
    }
}

function whatIsOp(rChar){
  switch (rChar){
    case "A":
    case "B":
    case "G":
      rChar = 0;
      break;
    case "L":
    case "Q":
      rChar = 1;
      break;
    case "E":
    case "H":
      rChar = 0;
      break;
    case "C":
    case "M":
    case "R":
      rChar = 1;
      break;
    case "I":
    case "N":
    case "S":
      rChar = 0;
      break;
    case "D":
    case "J":
      rChar = 1;
      break;
    case "O":
    case "F":
    case "K":
      rChar = 0;
      break;
    case "P":
    case "T":
      rChar = 1;
      break;
    case "U":
      rChar = 0;
      break;
    case "1":
    case "3":
    case "5":
    case "7":
    case "9":
      rChar = 0;
      break;
    case "2":
    case "4":
    case "6":
    case "8":
      rChar = 1;
      break;
    default:
      rChar = 1;
      break;
  }
  return rChar;
}

function getRandomAlphabet(){
  let alphabet = "123456789ABCDEFGHIJKLMNPQRSTUVWXYZ";
  let selector = Math.floor((Math.random() * alphabet.length));
  return alphabet.charAt(selector);
}

function getRandomNumber(){
  let alphabet = "123456789";
  let selector = Math.floor((Math.random() * alphabet.length));
  return alphabet.charAt(selector);
}

function getRandomMax(){
  let alphabet = "1234";
  let selector = Math.floor((Math.random() * alphabet.length));
  return alphabet.charAt(selector);
}

function getRandomLetter(){
  let alphabet = "ABCDEFGHIJKLMNPQRSTU";
  let selector = Math.floor((Math.random() * alphabet.length));
  return alphabet.charAt(selector);
}

function getRandomSep(){
  let alphabet = "VWX";
  let selector = Math.floor((Math.random() * alphabet.length));
  return alphabet.charAt(selector);
}

function getRandomBool(){
  let alphabet = "01";
  let selector = Math.floor((Math.random() * alphabet.length));
  return alphabet.charAt(selector);
}

function isAlph(rChar){
  switch (rChar){
    case "A":
    case "B":
    case "C":
    case "D":
    case "E":
    case "F":
    case "G":
    case "H":
    case "I":
    case "J":
    case "K":
    case "L":
    case "M":
    case "N":
    case "O":
    case "P":
    case "Q":
    case "R":
    case "S":
    case "T":
    case "U":
    case "V":
    case "W":
    case "X":
    case "Y":
    case "Z":
      return true;
    default:
      return false;
  }
}

function getNameGenNum(){
  let num = getRandomNumber();
  switch(num) {
    case "0":
      num = 6;
      break;
    case "1":
      num = 7;
      break;
    case "2":
      num = 8;
      break;
    case "3":
      num = 9;
      break;
    case "4":
      num = 10;
      break;
    case "5":
      num = 11;
      break;
    case "6":
      num = 12;
      break;
    case "7":
      num = 13;
      break;
    case "8":
      num = 14;
      break;
    case "9":
      num = 15;
      break;
    default:
      num = 5;
      break;
  }
  return num;
}

function generateDigitSetter(){
  let rNum;
  let rChar;
  let rBool;
  let rSep;
  let tempStr = "";
  let max = getRandomMax();
  let iterate = 0;

  for(let i = 0; i < 4; i++) {
    rNum = 0;
    rChar = "";
    rSep = "";
    rBool = 0;
    rNum = getRandomNumber();
    rChar = getRandomLetter();

    while(rBool == 0){
      rBool = getRandomBool();
      if(rBool == 1 && iterate <= max)
        rNum = rNum + getRandomNumber();
      if(iterate > max)
        break;
      iterate++;
    }

    if(rBool == 1)
      switch (rChar){
        case "A":
          rChar = 1;
          break;
        case "B":
        case "G":
        case "L":
        case "Q":
          rChar = 2;
          break;
        case "E":
          rChar = 3;
          break;
        case "C":
        case "H":
        case "M":
        case "R":
          rChar = 4;
          break;
        case "I":
          rChar = 5;
          break;
        case "D":
        case "J":
        case "N":
        case "S":
          rChar = 6;
          break;
        case "O":
          rChar = 7;
          break;
        case "F":
        case "K":
        case "P":
        case "T":
          rChar = 8;
          break;
        case "U":
          rChar = 9;
          break;
        default:
          rChar = 5;
          break;
      }

    if(i != 3)
      rSep = getRandomSep();

    encodeStore[i] = rChar + rNum;
    tempStr = tempStr + rChar + rNum + rSep;
  }
  return tempStr;
}

function encode(input) {
  let nameGenNum = getNameGenNum();
  let encodeStr = "";
  let encodeName = "";
  let encodeEnd = "";
  let rSep = "";
  let a = 0;
  let operator = "";
  let operand1 = "";
  let operand2 = "";
  let operandResult = 0;

  encodeStr = encodeStr + generateDigitSetter();
  encodeStr = encodeStr + ":";
  while (encodeNameBool == false) {
    for (let i = 0; i < nameGenNum; i++) {
      encodeName = encodeName + getRandomAlphabet();
    }

    nameGenNum = getNameGenNum();
    checkEncodeName(encodeName, input);
  }

  encodeNameBool = false;
  encodeStr = encodeStr + encodeName;
  encodeStr = encodeStr + ":";
  for(let i = 0; i < input.length; i++, a++){
    rSep = "";
    if(a > 3) {
      a = 0;
    }
    operator = whatIsOp(encodeStore[a].charAt(0));
    operand1 = encodeStore[a].slice(1, encodeStore[a].length);
    if (operator == "0") {
      operand1 = parseInt(operand1);
      operand2 = parseInt(input.charAt(i));
      operandResult = operand1 * operand2;
    } else {
      operand1 = parseInt(operand1);
      operand2 = parseInt(input.charAt(i));
      operandResult = operand1 + operand2;
    }
    if(i < input.length-1) {
      rSep = getRandomLetter();
    }
    encodeEnd = encodeEnd + operandResult + rSep;
  }
  encodeStr = encodeStr + encodeEnd;

  return encodeStr;
}

function decode(input){
  let encodeString = input.split(":");
  let encodeKey = encodeString[0];
  let encodePass = encodeString[2];
  let encodeKeyNew = [];
  let encodePassNew = [];
  let incr = 0;
  let from = 0;
  let examineChar;
  let a = 0;
  let operator = "";
  let operand1 = "";
  let operand2 = "";
  let operandResult = 0;
  let passwordResult = "";

  for(let i = 0; i <= encodeKey.length; i++) {
    examineChar = encodeKey.charAt(i);
    if(examineChar == "X" || examineChar == "W" || examineChar == "V" || examineChar == ""){
      encodeKeyNew[incr] = encodeKey.slice(from, i);
      from = i + 1;
      incr++;
    }
  }
  from = 0;
  incr=0;
  for(let i = 0; i <= encodePass.length; i++) {
    examineChar = encodePass.charAt(i);
    if(isAlph(examineChar) || examineChar == ""){
      encodePassNew[incr] = encodePass.slice(from, i);
      from = i + 1;
      incr++;
    }
  }
  for(let i = 0; i < encodePassNew.length; i++, a++){
    if(a > 3) {
      a = 0;
    }
    operator = whatIsOp(encodeKeyNew[a].charAt(0));
    operand1 = encodeKeyNew[a].slice(1, encodeKeyNew[a].length);

    if (operator == "0") {
      operand1 = parseInt(operand1);
      operand2 = parseInt(encodePassNew[i]);
      operandResult = operand2 / operand1;
    } else {
      operand1 = parseInt(operand1);
      operand2 = parseInt(encodePassNew[i]);
      operandResult = operand2 - operand1;
    }
    passwordResult = passwordResult + operandResult;
  }
  return passwordResult;
}
