var encodeStore = ["0", "1", "2", "3"];
var encodeNameBool = true;
var userArr = [];

function injectUserArr(userArr){
  this.userArr = userArr;
}

function checkEncodeName(newEncodeName){
  var encodeString;
  var encodeKey;
  var encodeName;
  encodeNameBool = true;

  for(var i = 0; i < userArr.length; i++){
    encodeString = userArr[i].encodeStr;
    encodeKey = input.split(":");
    encodeName = encodeKey[0];
    if (encodeName == newEncodeName) {
      encodeNameBool = false;
      break;
    }
  }
}

function whatIsInt(rChar){
  switch (rChar){
    case "A":
      rChar = 1;//multiply
      break;
    case "B":
    case "G":
    case "L":
    case "Q":
      rChar = 2;//add
      break;
    case "E":
      rChar = 3;//multiply
      break;
    case "C":
    case "H":
    case "M":
    case "R":
      rChar = 4;//add
      break;
    case "I":
      rChar = 5;//multiply
      break;
    case "D":
    case "J":
    case "N":
    case "S":
      rChar = 6;//add
      break;
    case "O":
      rChar = 7;//multiply
      break;
    case "F":
    case "K":
    case "P":
    case "T":
      rChar = 8;//add
      break;
    case "U":
      rChar = 9;//multiply
      break;
  }
  return rChar;
}

function IntToChar(rChar){
  switch (rChar){
    case 1:
      rChar = "1";//multiply
      break;
    case 2:
      rChar = "2";//add
      break;
    case 3:
      rChar = "3";//multiply
      break;
    case 4:
      rChar = "4";//add
      break;
    case 5:
      rChar = "5";//multiply
      break;
    case 6:
      rChar = "6";//add
      break;
    case 7:
      rChar = "7";//multiply
      break;
    case 8:
      rChar = "8";//add
      break;
    case 9:
      rChar = "9";//multiply
      break;
  }
  return rChar;
}


function whatIsOp(rChar){
  switch (rChar){
    case "A":
    case "B":
    case "G":
      rChar = 0;//multiply
      break;
    case "L":
    case "Q":
      rChar = 1;//add
      break;
    case "E":
    case "H":
      rChar = 0;//multiply
      break;
    case "C":
    case "M":
    case "R":
      rChar = 1;//add
      break;
    case "I":
    case "N":
    case "S":
      rChar = 0;//multiply
      break;
    case "D":
    case "J":
      rChar = 1;//add
      break;
    case "O":
    case "F":
    case "K":
      rChar = 0;//multiply
      break;
    case "P":
    case "T":
      rChar = 1;//add
      break;
    case "U":
      rChar = 0;//multiply
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
      rChar = 1;//add
      break;
  }
  return rChar;
}

function getRandomAlphabet(){
  var alphabet = "123456789ABCDEFGHIJKLMNPQRSTUVWXYZ";
  var selector = Math.floor((Math.random() * alphabet.length));
  var charSelect = alphabet.charAt(selector);
  return charSelect;
}

function getRandomNumber(){
  var alphabet = "123456789";
  var selector = Math.floor((Math.random() * alphabet.length));
  var charSelect = alphabet.charAt(selector);
  return charSelect;
}

function getRandomMax(){
  var alphabet = "1234";
  var selector = Math.floor((Math.random() * alphabet.length));
  var charSelect = alphabet.charAt(selector);
  return charSelect;
}

function getRandomLetter(){
  var alphabet = "ABCDEFGHIJKLMNPQRSTU";
  var selector = Math.floor((Math.random() * alphabet.length));
  var charSelect = alphabet.charAt(selector);
  return charSelect;
}

function getRandomSep(){
  var alphabet = "VWX";
  var selector = Math.floor((Math.random() * alphabet.length));
  var charSelect = alphabet.charAt(selector);
  return charSelect;
}

function getRandomBool(){
  var alphabet = "01";
  var selector = Math.floor((Math.random() * alphabet.length));
  var charSelect = alphabet.charAt(selector);
  return charSelect;
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
  var num = getRandomNumber();
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
  var rNum;
  var rChar;
  var rBool;
  var rSep;
  var tempStr = "";
  var max = getRandomMax();
  var iterate = 0;

  for(var i = 0; i < 4; i++) {
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

    if(rBool == 1)//set number
    switch (rChar){
      case "A":
        rChar = 1;//multiply
        break;
      case "B":
      case "G":
      case "L":
      case "Q":
        rChar = 2;//add
        break;
      case "E":
        rChar = 3;//multiply
        break;
      case "C":
      case "H":
      case "M":
      case "R":
        rChar = 4;//add
        break;
      case "I":
        rChar = 5;//multiply
        break;
      case "D":
      case "J":
      case "N":
      case "S":
        rChar = 6;//add
        break;
      case "O":
        rChar = 7;//multiply
        break;
      case "F":
      case "K":
      case "P":
      case "T":
        rChar = 8;//add
        break;
      case "U":
        rChar = 9;//multiply
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
  var nameGenNum = getNameGenNum();
  var encodeStr = "";
  var encodeName = "";
  var encodeEnd = "";
  var rSep = "";
  var a = 0;
  var operator = "";
  var operand1 = "";
  var operand2 = "";
  var operandResult = 0;

  encodeStr = encodeStr + generateDigitSetter();
  encodeStr = encodeStr + ":";
  while (encodeNameBool == false) {
    for (var i = 0; i < nameGenNum; i++) {
      encodeName = encodeName + getRandomAlphabet();
    }
    nameGenNum = getNameGenNum();
    checkEncodeName(encodeName);
  }
  encodeNameBool = false;
  encodeStr = encodeStr + encodeName;
  encodeStr = encodeStr + ":";
  for(var i = 0; i < input.length; i++, a++){
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
      operand2 = parseInt(input.charAt(i))
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
  var encodeString = input.split(":");
  var encodeKey = encodeString[0];
  var encodePass = encodeString[2];
  var encodeKeyNew = [];
  var encodePassNew = [];
  var incr = 0;
  var from = 0;
  var examineChar;
  var a = 0;
  var operator = "";
  var operand1 = "";
  var operand2 = "";
  var operandResult = 0;
  var passwordResult = "";

  for(var i = 0; i <= encodeKey.length; i++) {
    examineChar = encodeKey.charAt(i);
    if(examineChar == "X" || examineChar == "W" || examineChar == "V" || examineChar == ""){
      encodeKeyNew[incr] = encodeKey.slice(from, i);
      from = i + 1;
      incr++;
    }
  }
  from = 0;
  incr=0;
  for(var i = 0; i <= encodePass.length; i++) {
    examineChar = encodePass.charAt(i);
    if(isAlph(examineChar) || examineChar == ""){
      encodePassNew[incr] = encodePass.slice(from, i);
      from = i + 1;
      incr++;
    }
  }
  for(var i = 0; i < encodePassNew.length; i++, a++){
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
