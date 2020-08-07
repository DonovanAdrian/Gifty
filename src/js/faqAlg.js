var userArr = [];
var supportArr = [];

var areYouStillThereBool = false;

var logoutReminder = 300;
var logoutLimit = 900;

var offline;
var giftList;
var offlineSpan;
var offlineModal;
var emailBtn;
var user;
var inviteNote;
var noteModal;
var noteInfoField;
var noteTitleField;
var noteSpan;
var modal;


function getCurrentUser(){
  try {
    user = JSON.parse(sessionStorage.validUser);
    console.log("User: " + user.userName + " logged in");
    if (user.invites == undefined) {
      console.log("Invites Not Found");
    } else if (user.invites != undefined) {
      if (user.invites.length > 0) {
        inviteNote.style.background = "#ff3923";
      }
    }
    userArr = JSON.parse(sessionStorage.userArr);
  } catch (err) {
    console.log(err.toString());
    window.location.href = "index.html";
  }
}

window.onload = function instantiate() {

  emailBtn = document.getElementById('emailBtn');
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById("closeOffline");
  inviteNote = document.getElementById('inviteNote');
  noteModal = document.getElementById('notificationModal');
  noteTitleField = document.getElementById('notificationTitle');
  noteInfoField = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  modal = document.getElementById('myModal');
  getCurrentUser();

  const config = JSON.parse(sessionStorage.config);

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
      '&body=Hey Gifty Support, %0D%0A%0D%0A%0D%0A%0D%0A Sincerely, ' + user.userName);
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
    firebase.database().ref("users/" + user.uid + "/support/" + supportCount).push();
    firebase.database().ref("users/" + user.uid + "/support/" + supportCount).set({
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

  loginTimer(); //if action, then reset timer

  function loginTimer(){
    var loginNum = 0;
    console.log("Login Timer Started");
    setInterval(function(){ //900 15 mins, 600 10 mins
      document.onmousemove = resetTimer;
      document.onkeypress = resetTimer;
      document.onload = resetTimer;
      document.onmousemove = resetTimer;
      document.onmousedown = resetTimer; // touchscreen presses
      document.ontouchstart = resetTimer;
      document.onclick = resetTimer;     // touchpad clicks
      document.onscroll = resetTimer;    // scrolling with arrow keys
      document.onkeypress = resetTimer;
      loginNum = loginNum + 1;
      if (loginNum >= logoutLimit){//default 900
        console.log("User Timed Out");
        signOut();
      } else if (loginNum > logoutReminder){//default 600
        console.log("User Inactive");
        areYouStillThereNote(loginNum);
        areYouStillThereBool = true;
      }
      function resetTimer() {
        if (areYouStillThereBool)
          console.log("User Active");
        ohThereYouAre();
        loginNum = 0;
      }
    }, 1000);
  }

  function areYouStillThereNote(timeElapsed){
    var timeRemaining = logoutLimit - timeElapsed;
    var timeMins = Math.floor(timeRemaining/60);
    var timeSecs = timeRemaining%60;

    if (timeSecs < 10) {
      timeSecs = ("0" + timeSecs).slice(-2);
    }

    modal.style.display = "none";
    noteInfoField.innerHTML = "You have been inactive for 5 minutes, you will be logged out in " + timeMins
      + ":" + timeSecs + "!";
    noteTitleField.innerHTML = "Are You Still There?";
    noteModal.style.display = "block";

    //close on close
    noteSpan.onclick = function() {
      noteModal.style.display = "none";
      areYouStillThereBool = false;
    };
  }

  function ohThereYouAre(){
    noteInfoField.innerHTML = "Welcome back, " + user.name;
    noteTitleField.innerHTML = "Oh, There You Are!";

    var nowJ = 0;
    var j = setInterval(function(){
      nowJ = nowJ + 1000;
      if(nowJ >= 3000){
        noteModal.style.display = "none";
        areYouStillThereBool = false;
        clearInterval(j);
      }
    }, 1000);

    //close on click
    window.onclick = function(event) {
      if (event.target == noteModal) {
        noteModal.style.display = "none";
        areYouStillThereBool = false;
      }
    };
  }

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
          settingsNote.style.background = "#00c606";
        } else {
          alternator--;
          document.getElementById("settingsNote").innerHTML = "FAQ";
          settingsNote.style.background = "#00ad05";
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
  sessionStorage.setItem("validUser", JSON.stringify(user));
  sessionStorage.setItem("userArr", JSON.stringify(userArr));
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
