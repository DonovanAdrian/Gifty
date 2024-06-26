/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let indexElements = [];
let loginColorArrA = ["#ff3b44", "#a10000"];
let loginColorArrB = ["#ff626a", "#c90000"];

let userLimit = 100;
let loginTry = 0;
let showLoginAlert = 0;
let loginThreshold = 3;
let loginInfoColor = 0;
let delayLogin = 0;
let defaultSupplementNavLimit = 0;
let defaultAuthNavLimit = 4000;

let lastLoginStatus = "";
let loginDisabledMsg = "";
let newGiftyMessage = "Please create a new user before trying to log into Gifty! Click on the text below the login " +
    "button and fill out the form to make a user account.";

let loginReady = false;
let loginBool = false;
let banOverride = false;
let allowLogin = true;
let displayUserText = false;
let initializedDatabaseCheck = false;
let initializedDatabaseCheckAlt = false;

let config;
let signUpTimerInterval;
let loginTextInterval;
let username;
let pin;
let loginInfo;
let validUser;
let loginBtn;
let signUpFld;



function fetchConfigFile(){
  let oFrame = document.getElementById("frmFile");
  let strRawContents;
  let configFileInput;
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
  try {
    strRawContents = oFrame.contentWindow.document.body.childNodes[0].innerHTML;
    configFileInput = strRawContents.split("\n");
  } catch (err) {
    deployNotificationModal(false, "Initialization Error!", "There was an error " +
        "loading the webpage, please try refreshing the page and contacting an administrator!",
        4);
    return;
  }

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
        apiKeyString = apiKeyString.replace(/"/g, "");
        apiKeyString = apiKeyString.replace(/,/g, "");
        apiKeyString = apiKeyString.replace(/ /g, "");
      } else if (configFileInput[i].includes("authDomain:")){
        configInitializeInt++;
        authDomainString = configFileInput[i].substr(11, configFileInput[i].length);
        authDomainString = authDomainString.replace(/"/g, "");
        authDomainString = authDomainString.replace(/,/g, "");
        authDomainString = authDomainString.replace(/ /g, "");
      } else if (configFileInput[i].includes("databaseURL:")){
        configInitializeInt++;
        databaseURLString = configFileInput[i].substr(12, configFileInput[i].length);
        databaseURLString = databaseURLString.replace(/"/g, "");
        databaseURLString = databaseURLString.replace(/,/g, "");
        databaseURLString = databaseURLString.replace(/ /g, "");
      } else if (configFileInput[i].includes("projectId:")){
        configInitializeInt++;
        projectIdString = configFileInput[i].substr(10, configFileInput[i].length);
        projectIdString = projectIdString.replace(/"/g, "");
        projectIdString = projectIdString.replace(/,/g, "");
        projectIdString = projectIdString.replace(/ /g, "");
      } else if (configFileInput[i].includes("storageBucket:")){
        configInitializeInt++;
        storageBucketString = configFileInput[i].substr(14, configFileInput[i].length);
        storageBucketString = storageBucketString.replace(/"/g, "");
        storageBucketString = storageBucketString.replace(/,/g, "");
        storageBucketString = storageBucketString.replace(/ /g, "");
      } else if (configFileInput[i].includes("messagingSenderId:")){
        configInitializeInt++;
        messagingSenderIdString = configFileInput[i].substr(18, configFileInput[i].length);
        messagingSenderIdString = messagingSenderIdString.replace(/"/g, "");
        messagingSenderIdString = messagingSenderIdString.replace(/,/g, "");
        messagingSenderIdString = messagingSenderIdString.replace(/ /g, "");
      } else if (configFileInput[i].includes("appId:")){
        configInitializeInt++;
        appIdString = configFileInput[i].substr(6, configFileInput[i].length);
        appIdString = appIdString.replace(/"/g, "");
        appIdString = appIdString.replace(/,/g, "");
        appIdString = appIdString.replace(/ /g, "");
      } else if (configFileInput[i].includes("measurementId:")){
        configInitializeInt++;
        measurementIdString = configFileInput[i].substr(14, configFileInput[i].length);
        measurementIdString = measurementIdString.replace(/"/g, "");
        measurementIdString = measurementIdString.replace(/,/g, "");
        measurementIdString = measurementIdString.replace(/ /g, "");
      }
    }
  }

  if(configInitializeInt == 8){
    if (apiKeyString == "" || authDomainString == "" || databaseURLString == "" || projectIdString == "" ||
        storageBucketString == "" || messagingSenderIdString == "" || appIdString == "" || measurementIdString == "") {
      deployNotificationModal(false, "Initialization Error!", "Config not properly " +
          "initialized! Please contact an administrator!", 4);
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
      deployNotificationModal(false, "Initialization Error!", "Config not properly " +
          "initialized! Please contact an administrator!", 4);
    } else {
      logOutput("WARNING: Missing measurementId. This variable is optional. Disregard if this is intentional.", true);

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
  try {
    failedNavNum = 1;
    pageName = "Index";
    username = document.getElementById("username");
    pin = document.getElementById("pin");
    loginBtn = document.getElementById("loginBtn");
    loginInfo = document.getElementById("loginInfo");
    signUpFld = document.getElementById("signUpFld");

    loginBtn.innerHTML = "Please Wait...";
    lastLoginStatus = "Please Wait...";
    initializeSignUpTextInterval();
    try {
      config = JSON.parse(sessionStorage.config);
    } catch (err) {
    }
    if (config == undefined) {
      sessionStorage.clear();
      initializeSupplementalElements();
      fetchConfigFile();
    } else {
      sessionStorage.clear();
      sessionStorage.setItem("config", JSON.stringify(config));
      initializeSupplementalElements();
      commonInitialization();
      loginQuery();
    }

    indexElements = [username, pin, loginBtn, loginInfo, signUpFld, offlineModal, offlineSpan, notificationModal,
      notificationTitle, notificationInfo, noteSpan];
    verifyElementIntegrity(indexElements);

    backgroundAlternatorLimit = 15000;
    backgroundAlternator();
  } catch (err) {
    sendCriticalInitializationError(err);
  }
};

function loginQuery() {
  loginInitial = firebase.database().ref("login/");
  limitsInitial = firebase.database().ref("limits/");

  let fetchLogin = function (postRef) {
    postRef.once("value").then(function(snapshot) {
      if(snapshot.exists() || initializedDatabaseCheck) {
        clearInterval(commonLoadingTimer);
        clearInterval(offlineTimer);
        postRef.on("child_added", function (data) {
          if(data.key == "allowLogin") {
            if (data.val()) {
              loginReady = true;
            } else {
              allowLogin = false;
              loginReady = false;
              initializeLoginBtns();
            }
            sessionStorage.setItem("allowLogin", JSON.stringify(allowLogin));
          } else if (data.key == "loginDisabledMsg")
            loginDisabledMsg = data.val();
        });

        postRef.on("child_changed", function (data) {
          if(data.key == "allowLogin") {
            if (data.val()) {
              loginReady = true;
            } else {
              allowLogin = false;
              loginReady = false;
              initializeLoginBtns();
            }
            sessionStorage.setItem("allowLogin", JSON.stringify(allowLogin));
          } else if (data.key == "loginDisabledMsg")
            loginDisabledMsg = data.val();
        });

        initializeLoginBtnPlatform();

        let fetchLimits = function (postRef) {
          postRef.on("child_added", function (data) {
            if (data.key == "userLimit") {
              userLimit = data.val();
              initializeLoginBtns();
            }
          });

          postRef.on("child_changed", function (data) {
            if (data.key == "userLimit") {
              userLimit = data.val();
              initializeLoginBtns();
            }
          });

          postRef.on("child_removed", function (data) {
            if (data.key == "userLimit") {
              userLimit = 50;
              initializeLoginBtns();
            }
          });
        };

        fetchLimits(limitsInitial);

        listeningFirebaseRefs.push(limitsInitial);
      } else {
        clearInterval(commonLoadingTimer);
        clearInterval(offlineTimer);
        firebase.database().ref("login/").update({
          allowLogin: true,
          loginDisabledMsg: "Gifty is currently down for maintenance. Please wait for a moderator to finish " +
              "maintenance before logging in. Thank you for your patience!"
        });
        loginReady = true;
        sessionStorage.setItem("allowLogin", JSON.stringify(allowLogin));

        firebase.database().ref("limits/").update({
          giftLimit: 50,
          userLimit: 100,
          listLimit: 0,
          giftURLLimit: ""
        });
        userLimit = 50;
        initializeLoginBtns();
        initializedDatabaseCheck = true;
        fetchLogin(loginInitial);
      }
    });
  };

  fetchLogin(loginInitial);

  listeningFirebaseRefs.push(loginInitial);
}

function initializeLoginBtnPlatform() {
  userInitial = firebase.database().ref("users/");

  databaseQuery();
  username.addEventListener("keypress", function(event){
    if (event.key === "Enter") {
      login();
    }
  });
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
  let fetchPosts = function (postRef) {
    postRef.once("value").then(function(snapshot) {
      if (snapshot.exists() || initializedDatabaseCheckAlt) {
        postRef.on("child_added", function (data) {
          if (findUIDItemInArr(data.key, userArr) == -1)
            userArr.push(data.val());

          initializeLoginBtns();
        });

        postRef.on("child_changed", function (data) {
          let i = findUIDItemInArr(data.key, userArr);
          if (i != -1) {
            userArr[i] = data.val();
          }

          initializeLoginBtns();
        });

        postRef.on("child_removed", function (data) {
          let i = findUIDItemInArr(data.key, userArr);
          if (i != -1) {
            userArr.splice(i, 1);
          }
        });
      } else {
        signUpFld.innerHTML = "Click Here To Create A New User!";
        signUpFld.onclick = function () {
          signUp(true);
        };
        loginBtn.innerHTML = "Create A New User First!";
        lastLoginStatus = "Create A New User First!";
        allowLogin = false;
        loginDisabledMsg = newGiftyMessage;
        initializedDatabaseCheckAlt = true;
        fetchPosts(userInitial);
      }
    });
  };

  fetchPosts(userInitial);

  listeningFirebaseRefs.push(userInitial);
}

function login() {
  let validUserInt = 0;
  let initializedTransition = 0;
  let queuedNavigationCall = 0;

  validUserInt = authenticate();
  if (loginBool) {
    loginBtn.onclick = function(){};
    let today = new Date();
    let UTCmm = today.getUTCMinutes();
    let UTChh = today.getUTCHours();
    let dd = today.getUTCDate();
    let mm = today.getUTCMonth()+1;
    let yy = today.getUTCFullYear();
    let loginDate = mm + "/" + dd + "/" + yy + " " + UTChh + ":" + UTCmm;

    loginInfo.style.color = "#fff";
    if (userArr[validUserInt].firstLogin == 1) {
      if (checkLastLoginForReview(userArr[validUserInt])) {
        loginInfo.innerHTML = loginTextRandomizer(true) + userArr[validUserInt].name + "!";
      } else if (userArr[validUserInt].warn == 0) {
        loginInfo.innerHTML = loginTextRandomizer(false) + userArr[validUserInt].name + "!";
      } else {
        loginInfo.innerHTML = "You have a pending WARNING, please check your notifications!";
      }
      userArr[validUserInt].lastLogin = loginDate;
      firebase.database().ref("users/" + userArr[validUserInt].uid).update({
        lastLogin: loginDate
      });

      updateUserScore(userArr[validUserInt], loginIncrementScore);
    } else {
      loginInfo.innerHTML = "Welcome to Gifty, " + userArr[validUserInt].name + "!";
      sessionStorage.setItem("lastLoginReviewValid", JSON.stringify(false));
      userArr[validUserInt].firstLogin = 1;
      userArr[validUserInt].lastLogin = loginDate;
      firebase.database().ref("users/" + userArr[validUserInt].uid).update({
        firstLogin: 1,
        lastLogin: loginDate
      });

      updateUserScore(userArr[validUserInt], firstLoginIncrementScore);
    }

    if (delayLogin == 1) {
      defaultSupplementNavLimit = 4;
      defaultAuthNavLimit = 8;
    } else if (delayLogin == 2) {
      defaultSupplementNavLimit = 8;
      defaultAuthNavLimit = 12;
    } else {
      defaultSupplementNavLimit = 0;
      defaultAuthNavLimit = 2;
    }

    document.body.className = "B";
    validUser = userArr[validUserInt];
    sessionStorage.setItem("validUser", JSON.stringify(validUser));
    sessionStorage.setItem("userArr", JSON.stringify(userArr));

    let timer = 0;
    setInterval(function(){
      timer = timer + 1;
      if (timer >= defaultSupplementNavLimit && initializedTransition == 0){
        initializedTransition++;
        document.getElementById("fadeOutLogin").className = "fadeOutItemA";
        document.getElementById("fadeOutIcon").className = "fadeOutItemB";
      }
      if(timer >= defaultAuthNavLimit && queuedNavigationCall == 0){
        queuedNavigationCall++;
        navigation(2, true);//Home
      }
    }, 500);
  } else if (!loginBool && !banOverride) {
    if (loginTry < loginThreshold) {
      loginTry++;
      login();
    } else {
      if (allowLogin) {
        setLoginInfoTextAndTimer("Username or Password Incorrect");
      } else {
        if (showLoginAlert == 0) {
          showLoginAlert++;
          deployNotificationModal(false, "Login Disabled!", loginDisabledMsg, 4);
        }
      }
      if (username.value != "" && pin.value != "")
        if (allowLogin)
          updateMaintenanceLog("index", "Invalid Login Attempt: \"" + username.value.toLowerCase() + "\"");
        else
          updateMaintenanceLog("index", "Invalid Login Attempt During Maintenance Period: \"" + username.value.toLowerCase() + "\"");
      loginTry = 0;
      showLoginAlert = 0;
    }
  }
  banOverride = false;
}

function authenticate() {
  let validAuthUserInt = 0;

  for(let i = 0; i < userArr.length; i++){
    if(userArr[i].userName.toLowerCase() == username.value.toLowerCase()){
      try {
        if(decode(userArr[i].encodeStr) == pin.value){
          if(allowLogin) {
            if (userArr[i].ban == 0) {
              loginBool = true;
              validAuthUserInt = i;
              break;
            } else {
              banOverride = true;
              setLoginInfoTextAndTimer("Login Error Occurred... Please Contact A Moderator!");
              updateMaintenanceLog("index", "Banned user \"" + userArr[i].userName + "\" attempted to log in!");
              return;
            }
          } else {
            if(userArr[i].moderatorInt == 1) {
              loginBool = true;
              validAuthUserInt = i;
              break;
            } else {
              if (showLoginAlert == 0) {
                showLoginAlert++;
                deployNotificationModal(false, "Login Disabled!", loginDisabledMsg,
                    4);
              }
            }
          }
        }
      } catch (err) {
        logOutput("The following error occurred:", true);
        logOutput(err, true, true);
        setLoginInfoTextAndTimer("Login Error Occurred. Please Contact A Moderator!");
        updateMaintenanceLog("index", "Login Error Occurred: \"" + username.value.toLowerCase() + "\" - " + err);
      }
    }
  }

  return validAuthUserInt;
}

function initializeLoginBtns(){
  let validUserTempInt = 0;

  if (displayUserText) {
    if (loginReady) {
      loginBtn.innerHTML = "Log In";
      lastLoginStatus = "Log In";
      username.focus();
      allowLogin = true;

      if (userArr.length >= userLimit) {
        signUpFld.innerHTML = "Gifty Database Full! Existing Users Can Still Log In Above!";
        signUpFld.onclick = function () {
          validUserTempInt = authenticate();
          if (loginBool === true && userArr[validUserTempInt].moderatorInt == 1) {
            signUp(true);
          } else {
            signUp();
          }
        };
      } else {
        signUpFld.innerHTML = "Don't have an account? Click here!";
        signUpFld.onclick = function () {
          signUp();
        };
      }
    } else {
      loginBtn.innerHTML = "Log In Disabled";
      lastLoginStatus = "Log In Disabled";

      signUpFld.innerHTML = "User Creation Disabled...";
      signUpFld.onclick = function () {
        validUserTempInt = authenticate();
        if (loginBool === true && userArr[validUserTempInt].moderatorInt == 1) {
          signUp(true);
        } else {
          signUp();
        }
      };
    }
  }
}

function initializeSignUpTextInterval() {
  let signUpTimerNum = 0;
  let signUpTimerThreshold = 100;
  let userArrIntervalThreshold = 25;
  let pastUserArrSize = 0;
  let pastInterval = 0;

  signUpTimerInterval = setInterval(function(){
    if (userArr.length > 0) {
      signUpTimerNum = signUpTimerNum + 1;
      if (signUpTimerNum >= signUpTimerThreshold) {
        displayUserText = true;
        initializeLoginBtns();
        clearInterval(signUpTimerInterval);
      } else {
        if (userArr.length > pastUserArrSize) {
          pastUserArrSize = userArr.length;
          setUserArrMetric(signUpTimerNum);
          signUpTimerNum = 0;
        } else {
          checkUserArrMetric();
        }
      }
    }
  }, 10);

  function checkUserArrMetric() {
    if ((pastInterval + userArrIntervalThreshold) < signUpTimerThreshold)
      if (signUpTimerNum > (pastInterval + userArrIntervalThreshold)) {
        displayUserText = true;
        initializeLoginBtns();
        clearInterval(signUpTimerInterval);
      }
  }

  function setUserArrMetric(userArrMetric) {
    pastInterval = userArrMetric;
  }
}

function setLoginInfoTextAndTimer (loginInfoStrInput) {
  let loginTimerNum = 0;
  let loginTimerThreshold = 6;
  let loginInfoTextColorArr;
  clearInterval(loginTextInterval);
  loginInfo.innerHTML = loginInfoStrInput;

  if (loginInfoColor == 0) {
    loginInfoColor = 1;
    loginInfoTextColorArr = loginColorArrA;
  } else {
    loginInfoColor = 0;
    loginInfoTextColorArr = loginColorArrB;
  }
  loginInfo.style.color = loginInfoTextColorArr[1];

  loginTextInterval = setInterval(function(){
    loginTimerNum = loginTimerNum + 1;
    if (loginTimerNum > (loginTimerThreshold / 2)) {
      loginInfo.style.color = loginInfoTextColorArr[0];
    } else if (loginTimerNum > (loginTimerThreshold / 3)) {
      loginInfo.style.color = loginInfoTextColorArr[1];
    } else {
      loginInfo.style.color = loginInfoTextColorArr[0];
    }
    if (loginTimerNum >= loginTimerThreshold) {
      loginInfo.innerHTML = "&nbsp";
      clearInterval(loginTextInterval);
    }
  }, 1000);
}

function signUp(override){
  if (override == undefined)
    override = false;

  if ((allowLogin || loginDisabledMsg.includes(newGiftyMessage)) || override) {
    signUpFld.onclick = function(){};
    sessionStorage.setItem("userArr", JSON.stringify(userArr));
    sessionStorage.setItem("userCreationOverride", JSON.stringify(override));
    navigation(13, false);//UserAddUpdate
  } else if (userArr.length >= userLimit) {
    deployNotificationModal(false, "Gifty Database Full!", "Unfortunately this " +
        "Gifty Database is full, so no more users can be created. Please contact the owner to obtain access.",
        6);
  } else {
    deployNotificationModal(false, "User Creation Disabled!", "Since the login is " +
        "disabled, no additional users can be created. Please wait until a moderator has enabled login functionality.",
        6);
  }
}

function checkLastLoginForReview(user) {
  let userLastLogin;
  let lastLoginReviewValid = false;
  let currentDate = new Date();
  let tempLogin = "";
  let lastLoginDate;

  if (user.lastLogin == undefined) {
    userLastLogin = currentDate;
  } else {
    userLastLogin = user.lastLogin;
  }

  for (let i = 0; i < userLastLogin.length; i++) {
    if (userLastLogin[i] != " ") {
      tempLogin = tempLogin + userLastLogin[i];
    } else {
      break;
    }
  }

  lastLoginDate = tempLogin.split("/");
  let finalLastLoginDate = new Date(lastLoginDate[2], lastLoginDate[0] - 1, lastLoginDate[1]);
  if (finalLastLoginDate < addReviewDays(currentDate, -15)) {
    lastLoginReviewValid = true;
  }
  sessionStorage.setItem("lastLoginReviewValid", JSON.stringify(lastLoginReviewValid));
  return lastLoginReviewValid;
}

function loginTextRandomizer(inactiveUser) {
  let selection;
  let selector;
  let inactiveResponses = ["It's Been A While, ", "I Missed You, ", "Long Time No See, ", "I Haven't Seen You In Ages, ",
    "How Long Has It Been, ", "You're Alive, ", "So The Prodigal Son Returns, ", "Well Look What The Cat Dragged In, ",
    "Well If It Isn't "];
  let activeResponses = ["Hey, ", "Good To See You, ", "Welcome Back, ", "Greetings, ", "Access Granted, ", "Hello, ",
    "Great To See You, ", "How Have You Been, ", "Hola, ", "Guten Tag, ", "Bonjour, ", "Hej, ", "Howdy, ", "Aloha, ",
    "Yo Yo Yo, ", "What's Kickin' Chicken, ", "Hey There, ", "Why Hello There, ", "'Ello, ", "Heeeeeeeeeeeeeey, ",
    "I've Been Trying To Reach You About Your Extended Warranty, ", "Ciao, ", "Que Pasa, ", "It's You, ",
    "How You Doin', ", "Yo, ", "Whaddup, ", "You're Looking Great Today, ", "Have A Fantastic Day, "];

  if (inactiveUser) {
    selector = Math.floor((Math.random() * inactiveResponses.length));
    selection = inactiveResponses[selector];
  } else {
    selector = Math.floor((Math.random() * activeResponses.length));
    selection = activeResponses[selector];
  }

  if (selection.length > 30)
    delayLogin = 2;
  else if (selection.length > 20)
    delayLogin = 1;

  return selection;
}
