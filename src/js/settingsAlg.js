var userArr = [];

var editBtn;
var faqBtn;
var modBtn;
var offlineTimer;
var offlineSpan;
var offlineModal;
var user;

function getCurrentUser(){
  user = sessionStorage.getItem("validUser");
  if(user == null || user == undefined){
    window.location.href = "index.html";
  } else {
    console.log("User: " + user.key + " logged in");
    if (user.invites.length != 0) {
      inviteNote.style.background = "#ff3923";
    } else if (user.moderatorInt == 1) {
      modBtn.style.display = "block";
      modBtn.onclick = function () {
        navigation(6);
      }
    }
  }
}

window.onload = function instantiate() {

  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById("closeOffline");
  editBtn = document.getElementById("edit");
  faqBtn = document.getElementById("faq");
  modBtn = document.getElementById("mod");
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
