var userArr = [];

var areYouStillThereBool = false;

var logoutReminder = 300;
var logoutLimit = 900;

var editBtn;
var faqBtn;
var modBtn;
var offlineTimer;
var offlineSpan;
var offlineModal;
var inviteNote;
var user;
var noteModal;
var noteInfoField;
var noteTitleField;
var noteSpan;
var modal;

function getCurrentUser(){
  try {
    user = JSON.parse(sessionStorage.validUser);
    if (user == null || user == undefined) {
      window.location.href = "index.html";
    } else {
      console.log("User: " + user.userName + " logged in");
      if (user.invites == undefined) {
        console.log("Invites Not Found");
      } else if (user.invites != undefined) {
        if (user.invites.length > 0) {
          inviteNote.style.background = "#ff3923";
        }
      }
      if (user.moderatorInt == 1) {
        modBtn.style.display = "block";
        modBtn.onclick = function () {
          navigation(6);
        }
      }
      userArr = JSON.parse(sessionStorage.userArr);
    }
  } catch (err) {
    window.location.href = "index.html";
  }
}

window.onload = function instantiate() {

  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById("closeOffline");
  inviteNote = document.getElementById('inviteNote');
  editBtn = document.getElementById("edit");
  faqBtn = document.getElementById("faq");
  modBtn = document.getElementById("mod");
  noteModal = document.getElementById('notificationModal');
  noteTitleField = document.getElementById('notificationTitle');
  noteInfoField = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  modal = document.getElementById('myModal');
  getCurrentUser();

  editBtn.onclick = function (){
    navigation(4);
  };

  faqBtn.onclick = function (){
    navigation(5);
  };


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

  window.addEventListener("offline", function() {
    var now = 0;
    offlineTimer = setInterval(function(){
      now = now + 1000;
      if(now >= 5000) {
        offlineModal.style.display = "block";
        clearInterval(offlineTimer);
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
        signOut();
      } else if (loginNum > logoutReminder){//default 600
        areYouStillThereNote(loginNum);
        areYouStillThereBool = true;
      }
      function resetTimer() {
        if (areYouStillThereBool)
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
    case 4:
      //edit user page
      window.location.href = "userAddUpdate.html";
      break;
    case 5:
      window.location.href = "faq.html";
      break;
    case 6:
      window.location.href = "moderation.html";
      break;
    default:
      break;
  }
}
