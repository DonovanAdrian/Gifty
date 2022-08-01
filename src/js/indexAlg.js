/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let indexElements = [];
let listeningFirebaseRefs = [];
let userArr = [];

let config = {};

let userLimit = 100;
let loginTry = 0;
let showLoginAlert = 0;
let loginThreshold = 3;

let loginDisabledMsg = "";
let newGiftyMessage = "Please create a new user before trying to log into Gifty! Click on the text below the login " +
  "button and fill out the form to make a user account.";

let loginBool = false;
let allowLogin = true;

let user;
let loginInitial;
let userInitial;
let limitsInitial;
let username;
let pin;
let loginInfo;
let offlineSpan;
let offlineModal;
let validUser;
let loginBtn;
let signUpFld;
let colorShifter;



function fetchConfigFile(){
  let oFrame = document.getElementById("frmFile");
  let strRawContents = oFrame.contentWindow.document.body.childNodes[0].innerHTML;
  let configFileInput = strRawContents.split("\n");

  let configInitializeInt = 0;
  let isComment;
  let apiKeyString = "";
  let authDomainString = "";
  let databaseURLString = "";
  let projectIdString = "";
  let storageBucketString = "";
  let messagingSenderIdString = "";
  let appIdString = "";
  let measurementIdString = "";

  while (strRawContents.indexOf("\r") >= 0)
    strRawContents = strRawContents.replace("\r", "");

  for (var i = 0; i < configFileInput.length; i++) {
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
      console.log("WARNING: Missing measurementId. This variable is optional. Disregard if this is intentional.");

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
    colorShifter = setInterval(function(){
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
  limitsInitial = firebase.database().ref("limits/");

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

        let fetchLimits = function (postRef) {
          postRef.on('child_added', function (data) {
            if (data.key == "userLimit") {
              userLimit = data.val();
              checkSignUpLite();
            }
          });

          postRef.on('child_changed', function (data) {
            if (data.key == "userLimit") {
              userLimit = data.val();
              checkSignUp();
            }
          });

          postRef.on('child_removed', function (data) {
            if (data.key == "userLimit") {
              userLimit = 50;
              checkSignUp();
            }
          });
        };

        fetchLimits(limitsInitial);

        listeningFirebaseRefs.push(limitsInitial);
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

        firebase.database().ref("limits/").update({
          giftLimit: 50,
          userLimit: 100
        });
      }
    });
  };

  fetchLogin(loginInitial);

  listeningFirebaseRefs.push(loginInitial);
}

function initializeLoginBtns() {
  databaseQuery();
  pin.addEventListener("keypress", function(event){
    if (event.key === "Enter") {
      login();
    }
  });
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

          checkSignUp();
        });

        postRef.on('child_changed', function (data) {
          let i = findUIDItemInArr(data.key, userArr);
          if (userArr[i] != data.val() && i != -1) {
            userArr[i] = data.val();
          }

          checkSignUpLite();
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

  for(let i = 0; i < userArr.length; i++){
    if(userArr[i].userName.toLowerCase() == username.value.toLowerCase()){
      try {
        if(decode(userArr[i].encodeStr) == pin.value){
          if(allowLogin) {
            if (userArr[i].ban == 0) {
              loginBool = true;
              validUserInt = i;
              break;
            } else {
              loginInfo.innerHTML = "Login Error Occurred... Please Contact A Moderator!";
              updateMaintenanceLog("index", "Banned user " + userArr[i].userName + " attempted to log in!");
              return;
            }
          } else {
            if(userArr[i].moderatorInt == 1) {
              loginBool = true;
              validUserInt = i;
              break;
            } else {
              if (showLoginAlert == 0) {
                showLoginAlert++;
                alert(loginDisabledMsg);
              }
            }
          }
        }
      } catch (err) {
        console.log("The following error occurred:");
        console.log(err);
        loginInfo.innerHTML = "Login Error Occurred. Please Contact A Moderator!";
        updateMaintenanceLog("index", "Login Error: " + username.value.toLowerCase() + " " + pin.value.toString() + " - " + err);
      }
    }
  }
  if (loginBool === true){
    let today = new Date();
    let UTCmm = today.getUTCMinutes();
    let UTChh = today.getUTCHours();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yy = today.getFullYear();
    let loginDate = mm + "/" + dd + "/" + yy + " " + UTChh + ":" + UTCmm;
    let currentUserScore;

    if (userArr[validUserInt].userScore != null) {
      currentUserScore = userArr[validUserInt].userScore + 5;
    } else {
      currentUserScore = 10;
    }

    loginInfo.style.color = "#fff";
    if (userArr[validUserInt].firstLogin == 1) {
      if (userArr[validUserInt].warn == 0) {
        loginInfo.innerHTML = "Welcome Back, " + userArr[validUserInt].name + "!";
      } else {
        loginInfo.innerHTML = "You have a pending WARNING, please check your notifications!";
      }
      userArr[validUserInt].lastLogin = loginDate;
      userArr[validUserInt].userScore = currentUserScore;
      firebase.database().ref("users/" + userArr[validUserInt].uid).update({
        lastLogin: loginDate,
        userScore: currentUserScore
      });
    } else {
      loginInfo.innerHTML = "Welcome to Gifty, " + userArr[validUserInt].name + "!";
      userArr[validUserInt].firstLogin = 1;
      userArr[validUserInt].lastLogin = loginDate;
      userArr[validUserInt].userScore = currentUserScore;
      firebase.database().ref("users/" + userArr[validUserInt].uid).update({
        firstLogin: 1,
        lastLogin: loginDate,
        userScore: currentUserScore
      });
    }

    document.body.className = "B";

    clearInterval(colorShifter);
    document.getElementById("fadeOutLogin").className = "fadeOutItemA";
    document.getElementById("fadeOutIcon").className = "fadeOutItemB";
    validUser = userArr[validUserInt];
    sessionStorage.setItem("validUser", JSON.stringify(validUser));
    sessionStorage.setItem("userArr", JSON.stringify(userArr));

    let timer = 0;
    setInterval(function(){
      timer = timer + 1000;
      if(timer >= 2000){
        navigation(2, true);
      }
    }, 1000);
  } else if (loginBool === false) {
    if (loginTry < loginThreshold) {
      loginTry++;
      login();
    } else {
      if (allowLogin)
        loginInfo.innerHTML = "Username or Password Incorrect";
      else {
        if (showLoginAlert == 0) {
          showLoginAlert++;
          alert(loginDisabledMsg);
        }
      }
      if (username.value != "" && pin.value != "")
        updateMaintenanceLog("index", "Invalid Login: " + username.value.toLowerCase() + " " + pin.value.toString());
      loginTry = 0;
      showLoginAlert = 0;
    }
  }
}

function checkSignUpLite(){
  if (userArr.length < userLimit) {
    signUpFld.innerHTML = "Don't have an account? Click here!";
    signUpFld.onclick = function(){
      signUp();
    };
  }
}

function checkSignUp(){
  if (userArr.length >= userLimit) {
    signUpFld.innerHTML = "Gifty Database Full! Existing Users Can Still Log In Above!";
    signUpFld.onclick = function(){
      alert("Unfortunately this Gifty Database is full, so no more users can be created." +
        " Please contact the owner to obtain access.");
    };
  } else {
    signUpFld.innerHTML = "Don't have an account? Click here!";
    signUpFld.onclick = function(){
      signUp();
    };
  }
}

function signUp(){
  if(allowLogin || loginDisabledMsg.includes(newGiftyMessage)) {
    sessionStorage.setItem("userArr", JSON.stringify(userArr));
    window.location.href = "userAddUpdate.html";
  } else {
    alert(loginDisabledMsg);
  }
}
