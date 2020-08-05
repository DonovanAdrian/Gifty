var listeningFirebaseRefs = [];
var userArr = [];

var configObj = {};

var loginBool = false;
var reload = false;

var userInitial;
var username;
var pin;
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
          configObj = {
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

          sessionStorage.setItem("config", JSON.stringify(configObj));
          initializeDatabase();
        }
      }
    }
  });
}

window.onload = function instantiate() {

  username = document.getElementById("username");
  pin = document.getElementById("pin");
  offlineModal = document.getElementById("offlineModal");
  offlineSpan = document.getElementById("closeOffline");
  loginBtn = document.getElementById("loginBtn");
  signUpFld = document.getElementById("signUpFld");

  window.addEventListener("online", function(){
    offlineModal.style.display = "none";
    location.reload();
  });

  window.addEventListener("offline", function() {
    var now = 0;
    var g = setInterval(function(){
      now = now + 1000;
      if(now >= 5000){
        offlineModal.style.display = "block";
        clearInterval(g);
      }
    }, 1000);
  });

  //close offlineModal on close
  offlineSpan.onclick = function() {
    offlineModal.style.display = "none";
  };

  //close offlineModal on click
  window.onclick = function(event) {
    if (event.target == offlineModal) {
      offlineModal.style.display = "none";
    }
  };

  fetchConfigFile();
};

function initializeDatabase(){

  console.log("Initializing Database");

  firebase.initializeApp(configObj);
  firebase.analytics();

  firebase.auth().signInAnonymously().catch(function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
  });

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
    } else {
      // User is signed out.
    }
  });

  console.log("Database Successfully Initialized!");
  databaseQuery();
  loginBtn.onclick = function(){
    login();
  }
  signUpFld.onclick = function(){
    signUp();
  }
}

function databaseQuery() {

  console.log("Fetching Users From Database");
  userInitial = firebase.database().ref("users/");

  var fetchPosts = function (postRef) {
    postRef.on('child_added', function (data) {
      userArr.push(data.val());
    });

    postRef.on('child_changed', function (data) {
      var i = findUIDItemInArr(data.key, userArr);
      if(userArr[i] != data.val() && i != -1){
        //console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
        userArr[i] = data;
      }
    });

    postRef.on('child_removed', function (data) {
      var i = findUIDItemInArr(data.key, userArr);
      if(userArr[i] != data.val() && i != -1){
        //console.log("Removing " + userArr[i].userName + " / " + data.val().userName);
        userArr.splice(i, 1);
      }
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
        } else {

        }
      } catch (err) {
        if(userArr[i].pin == pin.value){
          loginBool = true;
          validUserInt = i;
          break;
        } else {

        }
      }
    }
  }
  if (loginBool === true){
    document.getElementById("loginInfo").innerHTML = "User " + userArr[validUserInt].userName + " Authenticated";
    validUser = userArr[validUserInt];
    sessionStorage.setItem("validUser", JSON.stringify(validUser));
    sessionStorage.setItem("userArr", JSON.stringify(userArr));
    window.location.href = "home.html";
  } else if (loginBool === false) {
    document.getElementById("loginInfo").innerHTML = "Username or Password Incorrect";
  }
}

function signUp(){
  window.location.href = "userAddUpdate.html";
}
