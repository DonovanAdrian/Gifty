/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

var indexElements = [];
var listeningFirebaseRefs = [];
var userArr = [];

var config = {};

var loginBool = false;

var userInitial;
var username;
var pin;
var loginInfo;
var offlineSpan;
var offlineModal;
var validUser;
var loginBtn;
var signUpFld;



function fetchConfigFile(){
  console.log("Fetching Config");
  var file = "txt/config.txt";

  $.ajax({
    url: file,
    success: function(data){
      var configInitializeInt = 0;
      var configFileInput = data.split('\n');
      var isComment;
      var apiKeyString = "";
      var authDomainString = "";
      var databaseURLString = "";
      var projectIdString = "";
      var storageBucketString = "";
      var messagingSenderIdString = "";
      var appIdString = "";
      var measurementIdString = "";

      for(var i = 0; i < configFileInput.length; i++){
        isComment = false;
        if (configFileInput[i].charAt(0) == "#" || configFileInput[i].charAt(0) == "") {
          isComment = true;
        }
        if (!isComment) {
          if (configFileInput[i].includes("apiKey:")){
            configInitializeInt++;
            apiKeyString = configFileInput[i].substr(7, configFileInput[i].length);
            apiKeyString = apiKeyString.replace(/"/g, '');
            apiKeyString = apiKeyString.replace(/,/g, '');
            apiKeyString = apiKeyString.replace(/ /g, '');
          } else if (configFileInput[i].includes("authDomain:")){
            configInitializeInt++;
            authDomainString = configFileInput[i].substr(11, configFileInput[i].length);
            authDomainString = authDomainString.replace(/"/g, '');
            authDomainString = authDomainString.replace(/,/g, '');
            authDomainString = authDomainString.replace(/ /g, '');
          } else if (configFileInput[i].includes("databaseURL:")){
            configInitializeInt++;
            databaseURLString = configFileInput[i].substr(12, configFileInput[i].length);
            databaseURLString = databaseURLString.replace(/"/g, '');
            databaseURLString = databaseURLString.replace(/,/g, '');
            databaseURLString = databaseURLString.replace(/ /g, '');
          } else if (configFileInput[i].includes("projectId:")){
            configInitializeInt++;
            projectIdString = configFileInput[i].substr(10, configFileInput[i].length);
            projectIdString = projectIdString.replace(/"/g, '');
            projectIdString = projectIdString.replace(/,/g, '');
            projectIdString = projectIdString.replace(/ /g, '');
          } else if (configFileInput[i].includes("storageBucket:")){
            configInitializeInt++;
            storageBucketString = configFileInput[i].substr(14, configFileInput[i].length);
            storageBucketString = storageBucketString.replace(/"/g, '');
            storageBucketString = storageBucketString.replace(/,/g, '');
            storageBucketString = storageBucketString.replace(/ /g, '');
          } else if (configFileInput[i].includes("messagingSenderId:")){
            configInitializeInt++;
            messagingSenderIdString = configFileInput[i].substr(18, configFileInput[i].length);
            messagingSenderIdString = messagingSenderIdString.replace(/"/g, '');
            messagingSenderIdString = messagingSenderIdString.replace(/,/g, '');
            messagingSenderIdString = messagingSenderIdString.replace(/ /g, '');
          } else if (configFileInput[i].includes("appId:")){
            configInitializeInt++;
            appIdString = configFileInput[i].substr(6, configFileInput[i].length);
            appIdString = appIdString.replace(/"/g, '');
            appIdString = appIdString.replace(/,/g, '');
            appIdString = appIdString.replace(/ /g, '');
          } else if (configFileInput[i].includes("measurementId:")){
            configInitializeInt++;
            measurementIdString = configFileInput[i].substr(14, configFileInput[i].length);
            measurementIdString = measurementIdString.replace(/"/g, '');
            measurementIdString = measurementIdString.replace(/,/g, '');
            measurementIdString = measurementIdString.replace(/ /g, '');
          } else {
            //console.log("Unknown Config String, Please Advise:");
            //console.log(configFileInput[i]);
          }
        } else {
          //console.log("Comment Found!");
        }
      }

      if(configInitializeInt == 8){
        if (apiKeyString == "" || authDomainString == "" || databaseURLString == "" || projectIdString == "" ||
        storageBucketString == "" || messagingSenderIdString == "" || appIdString == "" || measurementIdString == "") {
          alert("Config not properly initialized! Please contact an administrator!");
          console.log("Config Not Initialized! Are You Using The Default Config File?");
        } else {
          config = {
            apiKey: apiKeyString,
            authDomain: authDomainString,
            databaseURL: databaseURLString,
            projectId: projectIdString,
            storageBucket: storageBucketString,
            messagingSenderId: messagingSenderIdString,
            appId: appIdString,
            measurementId: measurementIdString
          };
          console.log("Config Successfully Initialized!");

          sessionStorage.setItem("config", JSON.stringify(config));
          commonInitialization();
          databaseQuery();
          loginBtn.innerHTML = "Log In";
          loginBtn.onclick = function(){
            login();
          };
          signUpFld.onclick = function(){
            signUp();
          };
        }
      }
    }
  });
}

window.onload = function instantiate() {

  username = document.getElementById("username");
  pin = document.getElementById("pin");
  loginBtn = document.getElementById('loginBtn');
  loginInfo = document.getElementById('loginInfo');
  signUpFld = document.getElementById("signUpFld");
  offlineModal = document.getElementById("offlineModal");
  offlineSpan = document.getElementById("closeOffline");
  indexElements = [username, pin, loginBtn, loginInfo, signUpFld, offlineModal, offlineSpan];
  verifyElementIntegrity(indexElements);

  loginBtn.innerHTML = "Please Wait...";
  fetchConfigFile();
  backgroundAlternator();

  function backgroundAlternator(){
    var nowBackground = 0;
    var alternator = 0;
    console.log("Background Alternator Feature Active");
    setInterval(function(){
      nowBackground = nowBackground + 1000;
      if(nowBackground >= 15000){
        nowBackground = 0;
        if(alternator == 0) {
          alternator++;
          document.body.style.background = "#0041a3";
        } else if (alternator == 1){
          alternator++;
          document.body.style.background = "#008222";
        } else if (alternator == 2){
          alternator++;
          document.body.style.background = "#0b8781";
        } else if (alternator == 3){
          alternator++;
          document.body.style.background = "#700b87";
        } else {
          alternator = 0;
          document.body.style.background = "#870b0b";
        }
      }
    }, 1000);
  }
};

function databaseQuery() {

  console.log("Fetching Data From Database");
  userInitial = firebase.database().ref("users/");

  var fetchPosts = function (postRef) {
    postRef.on('child_added', function (data) {
      userArr.push(data.val());
    });

    postRef.on('child_changed', function (data) {
      var i = findUIDItemInArr(data.key, userArr);
      if(userArr[i] != data.val() && i != -1){
        //console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
        userArr[i] = data.val();
      }
    });

    postRef.on('child_removed', function (data) {
      var i = findUIDItemInArr(data.key, userArr);
      userArr.splice(i, 1);
    });
  };

  fetchPosts(userInitial);

  listeningFirebaseRefs.push(userInitial);
}

function findUIDItemInArr(item, userArray){
  for(var i = 0; i < userArray.length; i++){
    if(userArray[i].uid == item){
      console.log("Found item: " + item);
      return i;
    }
  }
  return -1;
}

function login() {
  var validUserInt = 0;

  for(var i = 0; i < userArr.length; i++){
    if(userArr[i].userName.toLowerCase() == username.value.toLowerCase()){
      try {
        if(decode(userArr[i].encodeStr) == pin.value){
          loginBool = true;
          validUserInt = i;
          break;
        }
      } catch (err) {
        if(userArr[i].pin == pin.value){
          loginBool = true;
          validUserInt = i;
          break;
        }
      }
    }
  }
  if (loginBool === true){
    loginInfo.innerHTML = "User " + userArr[validUserInt].userName + " Authenticated";
    validUser = userArr[validUserInt];
    sessionStorage.setItem("validUser", JSON.stringify(validUser));
    sessionStorage.setItem("userArr", JSON.stringify(userArr));
    window.location.href = "home.html";
  } else if (loginBool === false) {
    loginInfo.innerHTML = "Username or Password Incorrect";
    updateMaintenanceLog("index", "Invalid Login: " + username.value.toLowerCase() + " " + pin.value.toString());
  }
}

function updateMaintenanceLog(locationData, detailsData) {
  var today = new Date();
  var UTChh = today.getUTCHours();
  var UTCmm = today.getUTCMinutes();
  var UTCss = today.getUTCSeconds();
  var dd = today.getUTCDate();
  var mm = today.getMonth()+1;
  var yy = today.getFullYear();
  var timeData = mm + "/" + dd + "/" + yy + " " + UTChh + ":" + UTCmm + ":" + UTCss;
  var newUid = firebase.database().ref("maintenance").push();
  newUid = newUid.toString();
  newUid = newUid.substr(51, 70);

  firebase.database().ref("maintenance/" + newUid).set({
    uid: newUid,
    location: locationData,
    details: detailsData,
    time: timeData
  });
}

function signUp(){
  window.location.href = "userAddUpdate.html";
}
