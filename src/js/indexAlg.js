var listeningFirebaseRefs = [];
var userArr = [];

var loginBool = false;
var reload = false;

var userInitial;
var username;
var pin;
var offlineSpan;
var offlineModal;
var validUser;


//Instantiates all data upon loading the webpage
window.onload = function instantiate() {

  username = document.getElementById("username");
  pin = document.getElementById("pin");

  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById("closeOffline");

  const config = {
    //Oops! This is gone!
  };
  firebase.initializeApp(config);
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

  databaseQuery();

  function databaseQuery() {

    userInitial = firebase.database().ref("users/");

    var fetchPosts = function (postRef) {
      postRef.on('child_added', function (data) {
        userArr.push(data.val());
      });

      postRef.on('child_changed', function (data) {
        var i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() || i != -1){
          console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
          userArr[i] = data;
        }
      });

      postRef.on('child_removed', function (data) {
        var i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() || i != -1){
          console.log("Removing " + userArr[i].userName + " / " + data.val().userName);
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
};


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
