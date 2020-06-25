var userArr = [];
var supportArr = [];

var giftTitle = "";
var giftUid = "";
var giftDescription = "";
var giftLink = "";
var giftWhere = "";

var offline;
var giftList;
var offlineSpan;
var offlineModal;
var emailBtn;
var user;
var userName;
var load;


function getCurrentUser(){
  user = sessionStorage.getItem("validUser");
  if(user == null || user == undefined){
    window.location.href = "index.html";
  } else {
    console.log("User: " + user + " logged in");
    if (user.invites.length != 0) {
      inviteNote.style.background = "#ff3923";
    }
  }
}

window.onload = function instantiate() {

  emailBtn = document.getElementById('emailBtn');
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById("closeOffline");
  getCurrentUser();

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


  window.addEventListener("online", function () {
    offlineModal.style.display = "none";
    location.reload();
  });

  window.addEventListener("offline", function () {
    var now = 0;
    offlineTimer = setInterval(function(){
      now = now + 1000;
      if(now >= 5000){
        offlineModal.style.display = "block";
        clearInterval(offlineTimer);
      }
    }, 1000);
  });

  offlineSpan.onclick = function () {
    console.log("Offline modal closed: Closed manually");
    offlineModal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == offlineModal) {
      console.log("Offline modal closed: Outside of modal");
      offlineModal.style.display = "none";
    }
  };

  emailBtn.onclick = function () {
    var supportStr = genSupport();
    window.open('mailto:gifty.application@gmail.com?subject=Gifty Support #' + supportStr +
      '&body=Hey Gifty Support, %0D%0A%0D%0A%0D%0A%0D%0A Sincerely, ' + userName);
  };

  function genSupport() {
    var supportCode = "";
    for(var i = 0; i < 16; i++){
      supportCode = supportCode + randomizer();
    }
    addSupportToDB(supportCode);
    return supportCode;
  }

  function addSupportToDB(supportCode) {
    var supportCount = 0;
    try{
      supportCount = supportArr.length;
    } catch (err) {

    }
    console.log(supportCode);
    console.log(supportCount);
    firebase.database().ref("users/" + user + "/support/" + supportCount).push();
    firebase.database().ref("users/" + user + "/support/" + supportCount).set({
      supportCount: supportCount,
      supportString: supportCode
    });
  }

  function randomizer() {
    var alphabet = "123456789ABCDEFGHIJKLMNPQRSTUVWXYZ";
    var selector = Math.floor((Math.random() * alphabet.length));
    var charSelect = alphabet.charAt(selector);
    return charSelect;
  }

  settingsFAQButton();

  function settingsFAQButton(){
    var nowConfirm = 0;
    var alternator = 0;
    console.log("Settings Button Feature Active");
    setInterval(function(){
      nowConfirm = nowConfirm + 1000;
      if(nowConfirm >= 3000){
        nowConfirm = 0;
        if(alternator == 0) {
          alternator++;
          document.getElementById("settingsNote").innerHTML = "Settings";
          inviteNote.style.background = "#00c606";
        } else {
          alternator--;
          document.getElementById("settingsNote").innerHTML = "FAQ";
          inviteNote.style.background = "#00ad05";
        }
      }
    }, 1000);
  }
};

function signOut(){
  sessionStorage.clear();
  window.location.href = "index.html";
}

function navigation(nav){
  sessionStorage.setItem("validUser", user);
  switch(nav){
    case 0:
      window.location.href = "home.html";
      break;
    case 1:
      window.location.href = "lists.html";
      break;
    case 2:
      window.location.href = "invites.html";
      break;
    case 3:
      window.location.href = "settings.html";
      break;
    default:
      break;
  }
}
