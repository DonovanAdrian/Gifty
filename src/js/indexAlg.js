/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let indexElements = [];
let listeningFirebaseRefs = [];
let userArr = [];

let config = {};

let loginDisabledMsg = "";
let newGiftyMessage = "Please create a new user before trying to log into Gifty! Click on the text below the login " +
    "button and fill out the form to make a user account.";

let loginBool = false;
let allowLogin = true;

let loginInitial;
let userInitial;
let username;
let pin;
let loginInfo;
let offlineSpan;
let offlineModal;
let validUser;
let loginBtn;
let signUpFld;



function fetchConfigFile(){
  let file = "txt/config.txt";

  $.ajax({
    url: file,
    success: function(data){
      let configInitializeInt = 0;
      let configFileInput = data.split('\n');
      let isComment;
      let apiKeyString = "";
      let authDomainString = "";
      let databaseURLString = "";
      let projectIdString = "";
      let storageBucketString = "";
      let messagingSenderIdString = "";
      let appIdString = "";
      let measurementIdString = "";

      for(let i = 0; i < configFileInput.length; i++){
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
          }
        }
      }

      if(configInitializeInt == 8){
        if (apiKeyString == "" || authDomainString == "" || databaseURLString == "" || projectIdString == "" ||
            storageBucketString == "" || messagingSenderIdString == "" || appIdString == "" || measurementIdString == "") {
          alert("Config not properly initialized! Please contact an administrator!");
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

          sessionStorage.setItem("config", JSON.stringify(config));
          commonInitialization();
          loginQuery();
        }
      } else {
        if (configInitializeInt == 7 && (apiKeyString == "" || authDomainString == "" || databaseURLString == "" || projectIdString == "" ||
            storageBucketString == "" || messagingSenderIdString == "" || appIdString == "")) {
          alert("Config not properly initialized! Please contact an administrator!");
        } else {
          console.log("WARNING: Missing measurementId. This variable is optional. Disregard if this is on purpose.");

          config = {
            apiKey: apiKeyString,
            authDomain: authDomainString,
            databaseURL: databaseURLString,
            projectId: projectIdString,
            storageBucket: storageBucketString,
            messagingSenderId: messagingSenderIdString,
            appId: appIdString,
          };

          sessionStorage.setItem("config", JSON.stringify(config));
          commonInitialization();
          loginQuery();
        }
      }
    }
  });
}

window.onload = function instantiate() {

  pageName = "Index";
  username = document.getElementById('username');
  pin = document.getElementById('pin');
  loginBtn = document.getElementById('loginBtn');
  loginInfo = document.getElementById('loginInfo');
  signUpFld = document.getElementById('signUpFld');
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  indexElements = [username, pin, loginBtn, loginInfo, signUpFld, offlineModal, offlineSpan];
  verifyElementIntegrity(indexElements);

  loginBtn.innerHTML = "Please Wait...";
  fetchConfigFile();
  backgroundAlternator();

  function backgroundAlternator(){
    let nowBackground = 0;
    let alternator = 0;
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

function loginQuery() {
  loginInitial = firebase.database().ref("login/");

  let fetchLogin = function (postRef) {
    postRef.once("value").then(function(snapshot) {
      if(snapshot.exists()) {
        postRef.on('child_added', function (data) {
          if(data.key == "allowLogin") {
            if (data.val()) {
              loginBtn.innerHTML = "Log In";
              allowLogin = true;
            } else {
              loginBtn.innerHTML = "Log In Disabled";
              allowLogin = false;
            }
            sessionStorage.setItem("allowLogin", JSON.stringify(allowLogin));
          } else if (data.key == "loginDisabledMsg")
            loginDisabledMsg = data.val();
        });

        postRef.on('child_changed', function (data) {
          if(data.key == "allowLogin") {
            if (data.val()) {
              loginBtn.innerHTML = "Log In";
              allowLogin = true;
            } else {
              loginBtn.innerHTML = "Log In Disabled";
              allowLogin = false;
            }
            sessionStorage.setItem("allowLogin", JSON.stringify(allowLogin));
          } else if (data.key == "loginDisabledMsg")
            loginDisabledMsg = data.val();
        });

        initializeLoginBtns();
      } else {
        firebase.database().ref("login/").update({
          allowLogin: true,
          loginDisabledMsg: "Gifty is currently down for maintenance. Please wait for a moderator to finish " +
              "maintenance before logging in. Thank you for your patience!"
        });
        loginBtn.innerHTML = "Log In";
        allowLogin = true;
        sessionStorage.setItem("allowLogin", JSON.stringify(allowLogin));

        initializeLoginBtns();
      }
    });
  };

  fetchLogin(loginInitial);

  listeningFirebaseRefs.push(loginInitial);
}

function initializeLoginBtns() {
  databaseQuery();
  loginBtn.onclick = function(){
    login();
  };
  signUpFld.onclick = function(){
    signUp();
  };
}

function databaseQuery() {
  userInitial = firebase.database().ref("users/");

  let fetchPosts = function (postRef) {
    postRef.once("value").then(function(snapshot) {
      if (snapshot.exists()) {
        postRef.on('child_added', function (data) {
          if (!userArr.includes(data.val()))
            userArr.push(data.val());
        });

        postRef.on('child_changed', function (data) {
          let i = findUIDItemInArr(data.key, userArr);
          if (userArr[i] != data.val() && i != -1) {
            userArr[i] = data.val();
          }
        });

        postRef.on('child_removed', function (data) {
          let i = findUIDItemInArr(data.key, userArr);
          userArr.splice(i, 1);
        });
      } else {
        loginBtn.innerHTML = "Create A New User First!";
        allowLogin = false;
        loginDisabledMsg = newGiftyMessage;
      }
    });
  };

  fetchPosts(userInitial);

  listeningFirebaseRefs.push(userInitial);
}

function login() {
  let validUserInt = 0;
  let showLoginAlert = 0;

  for(let i = 0; i < userArr.length; i++){
    if(userArr[i].userName.toLowerCase() == username.value.toLowerCase()){
      try {
        if(decode(userArr[i].encodeStr) == pin.value){
          if(allowLogin) {
            loginBool = true;
            validUserInt = i;
            break;
          } else {
            if(userArr[i].moderatorInt == 1) {
              loginBool = true;
              validUserInt = i;
              break;
            } else {
              showLoginAlert++;
              alert(loginDisabledMsg);
            }
          }
        }
      } catch (err) {
        console.log("The following error occurred:");
        console.log(err);
        loginInfo.innerHTML = "Login Error Occurred. Please Contact A Moderator!";
        updateMaintenanceLog("index", "Login Error: " + username.value.toLowerCase() + " " + pin.value.toString());
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
    if (allowLogin)
      loginInfo.innerHTML = "Username or Password Incorrect";
    else {
      if(showLoginAlert == 0)
        alert(loginDisabledMsg);
    }
    if (username.value != "" && pin.value != "")
      updateMaintenanceLog("index", "Invalid Login: " + username.value.toLowerCase() + " " + pin.value.toString());
  }
}

function signUp(){
  if(allowLogin || loginDisabledMsg.includes(newGiftyMessage))
    window.location.href = "userAddUpdate.html";
  else
    alert(loginDisabledMsg);
}
