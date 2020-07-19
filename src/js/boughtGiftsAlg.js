var listeningFirebaseRefs = [];
var inviteArr = [];
var userUserNames = [];
var userBoughtGifts = [];
var userBoughtGiftsUsers = [];

var areYouStillThereBool = false;

var currentModalOpen = "";

var onlineInt = 0;
var giftCounter = 0;
var logoutReminder = 300;
var logoutLimit = 900;
var moderationSet = -1;

var giftCreationDate;
var giftList;
var giftListHTML;
var offline;
var backBtn;
var offlineSpan;
var offlineModal;
var user;
var modal;
var noteModal;
var noteInfoField;
var noteTitleField;
var noteSpan;
var listNote;
var inviteNote;
var offlineTimer;
var userBase;
var userInvites;



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
    userBoughtGifts = JSON.parse(sessionStorage.userBoughtGifts);
    userBoughtGiftsUsers = JSON.parse(sessionStorage.userBoughtGiftsUsers);
  } catch (err) {
    window.location.href = "index.html";
  }
}

window.onload = function instantiate() {

  giftCreationDate = document.getElementById('giftCreationDate');
  giftList = document.getElementById('giftListContainer');
  giftListHTML = document.getElementById('giftListContainer').innerHTML;
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  noteSpan = document.getElementById('closeNotification');
  backBtn = document.getElementById('backBtn');
  listNote = document.getElementById('listNote');
  inviteNote = document.getElementById('inviteNote');
  noteModal = document.getElementById('notificationModal');
  noteTitleField = document.getElementById('notificationTitle');
  noteInfoField = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  modal = document.getElementById('giftModal');
  getCurrentUser();

  for(var i = 0; i < userArr.length; i++){
    userUserNames.push(userArr[i].userName);
  }

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
    currentModalOpen = "";
    console.log("Closed modal");
    offlineModal.style.display = "none";
    location.reload();
  });

  window.addEventListener("offline", function() {
    var now = 0;
    offlineTimer = setInterval(function(){
      now = now + 1000;
      if(now >= 5000){
        try{
          document.getElementById("TestGift").innerHTML = "Loading Failed, Please Connect To Internet";
        } catch(err){
          if(giftCounter == 0) {
            console.log("Loading Element Missing, Creating A New One");
            var liItem = document.createElement("LI");
            liItem.id = "TestGift";
            liItem.className = "gift";
            var textNode = document.createTextNode("Loading Failed, Please Connect To Internet");
            liItem.appendChild(textNode);
            giftList.insertBefore(liItem, document.getElementById("giftListContainer").childNodes[0]);
          }
        }
        offlineModal.style.display = "block";
        currentModalOpen = "offlineModal";
        console.log("Modal Open: " + currentModalOpen);
        clearInterval(offlineTimer);
      }
    }, 1000);
  });

  //close offlineModal on close
  offlineSpan.onclick = function() {
    currentModalOpen = "";
    console.log("Closed modal");
    offlineModal.style.display = "none";
  };

  //close offlineModal on click
  window.onclick = function(event) {
    if (event.target == offlineModal) {
      currentModalOpen = "";
      console.log("Closed modal");
      offlineModal.style.display = "none";
    }
  };

  //initialize back button
  backBtn.innerHTML = "Back To Home";
  backBtn.onclick = function() {
    sessionStorage.setItem("validUser", JSON.stringify(user));
    sessionStorage.setItem("userArr", JSON.stringify(userArr));
    window.location.href = "home.html";
  };

  initializeGifts();

  databaseQuery();

  loginTimer();

  homeButton();

  function initializeGifts(){
    if(userBoughtGifts.length == userBoughtGiftsUsers.length) {
      for (var i = 0; i < userBoughtGifts.length; i++) {
        createGiftElement(userBoughtGifts[i], userBoughtGiftsUsers[i]);
      }
    } else {
      alert("There has been a critical error, redirecting back home...");
      sessionStorage.setItem("validUser", JSON.stringify(user));
      sessionStorage.setItem("userArr", JSON.stringify(userArr));
      window.location.href = "home.html";
    }
  }

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
    currentModalOpen = "noteModal";
    console.log("Modal Open: " + currentModalOpen);

    //close on close
    noteSpan.onclick = function() {
      currentModalOpen = "";
      console.log("Closed modal");
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
        currentModalOpen = "";
        console.log("Closed modal");
        noteModal.style.display = "none";
        areYouStillThereBool = false;
        clearInterval(j);
      }
    }, 1000);

    //close on click
    window.onclick = function(event) {
      if (event.target == noteModal) {
        currentModalOpen = "";
        console.log("Closed modal");
        noteModal.style.display = "none";
        areYouStillThereBool = false;
      }
    };
  }

  function homeButton(){
    var nowConfirm = 0;
    var alternator = 0;
    console.log("Home Button Feature Active");
    setInterval(function(){
      nowConfirm = nowConfirm + 1000;
      if(nowConfirm >= 3000){
        nowConfirm = 0;
        if(alternator == 0) {
          alternator++;
          document.getElementById("homeNote").innerHTML = "Home";
          document.getElementById("homeNote").style.background = "#00c606";
        } else {
          alternator--;
          document.getElementById("homeNote").innerHTML = "Bought";
          document.getElementById("homeNote").style.background = "#00ad05";
        }
      }
    }, 1000);
  }

  function databaseQuery() {

    userBase = firebase.database().ref("users/" + user.uid);
    userInvites = firebase.database().ref("users/" + user.uid + "/invites");

    var fetchData = function (postRef) {
      postRef.on('child_added', function (data) {

        onlineInt = 1;
        if(data.key == "name"){
          user.name = data.val();
        } else if (data.key == "pin"){
          user.pin = data.val();
        } else if (data.key == "encodeStr"){
          user.encodeStr = data.val();
        } else if (data.key == "userName"){
          user.userName = data.val();
        } else if (data.key == "ban"){
          user.ban = data.val();
        } else if (data.key == "firstLogin"){
          user.firstLogin = data.val();
        } else if (data.key == "moderatorInt"){
          user.moderatorInt = data.val();
        } else if (data.key == "organize"){
          user.organize = data.val();
        } else if (data.key == "strike"){
          user.strike = data.val();
        } else if (data.key == "theme"){
          user.theme = data.val();
        } else if (data.key == "uid"){
          user.uid = data.val();
        } else if (data.key == "warn"){
          user.warn = data.val();
        } else if (data.key == "giftList"){
          user.giftList = data.val();
        } else if (data.key == "support"){
          user.support = data.val();
        } else if (data.key == "invites"){
          user.invites = data.val();
        } else if (data.key == "friends"){
          user.friends = data.val();
        } else if (data.key == "shareCode"){
          user.shareCode = data.val();
        } else {
          console.log("Unknown Key..." + data.key);
        }
      });
      postRef.on('child_changed', function (data) {
        if(data.key == "name"){
          user.name = data.val();
        } else if (data.key == "pin"){
          user.pin = data.val();
        } else if (data.key == "encodeStr"){
          user.encodeStr = data.val();
        } else if (data.key == "userName"){
          user.userName = data.val();
        } else if (data.key == "ban"){
          user.ban = data.val();
        } else if (data.key == "firstLogin"){
          user.firstLogin = data.val();
        } else if (data.key == "moderatorInt"){
          user.moderatorInt = data.val();
        } else if (data.key == "organize"){
          user.organize = data.val();
        } else if (data.key == "strike"){
          user.strike = data.val();
        } else if (data.key == "theme"){
          user.theme = data.val();
        } else if (data.key == "uid"){
          user.uid = data.val();
        } else if (data.key == "warn"){
          user.warn = data.val();
        } else if (data.key == "giftList"){
          user.giftList = data.val();
        } else if (data.key == "support"){
          user.support = data.val();
        } else if (data.key == "invites"){
          user.invites = data.val();
        } else if (data.key == "friends"){
          user.friends = data.val();
        } else if (data.key == "shareCode"){
          user.shareCode = data.val();
        } else {
          console.log("Unknown Key..." + data.key);
        }
      });
      postRef.on('child_removed', function (data) {
        if(data.key == "name"){
          user.name = "";
        } else if (data.key == "pin"){
          user.pin = "";
        } else if (data.key == "encodeStr"){
          user.encodeStr = "";
        } else if (data.key == "userName"){
          user.userName = "";
        } else if (data.key == "uid"){
          user.uid = "";
        } else if (data.key == "giftList"){
          user.giftList = [];
        } else if (data.key == "support"){
          user.support = [];
        } else if (data.key == "invites"){
          user.invites = [];
        } else if (data.key == "friends"){
          user.friends = [];
        } else if (data.key == "shareCode"){
          user.shareCode = "";
        } else {
          console.log("Unknown Key..." + data.key);
        }
      });
    };

    var fetchInvites = function (postRef) {
      postRef.on('child_added', function (data) {
        inviteArr.push(data.val());

        inviteNote.style.background = "#ff3923";
      });

      postRef.on('child_changed', function (data) {
        console.log(inviteArr);
        inviteArr[data.key] = data.val();
        console.log(inviteArr);
      });

      postRef.on('child_removed', function (data) {
        console.log(inviteArr);
        inviteArr.splice(data.key, 1);
        console.log(inviteArr);

        if (inviteArr.length == 0) {
          console.log("Invite List Removed");
          inviteNote.style.background = "#008222";
        }
      });
    };

    fetchData(userBase);
    fetchInvites(userInvites);

    listeningFirebaseRefs.push(userBase);
    listeningFirebaseRefs.push(userInvites);
  }

  function createGiftElement(giftData, giftOwner){
    var giftDescription = giftData.description;
    var giftLink = giftData.link;
    var giftTitle = giftData.title + " - for " + giftOwner;
    var giftWhere = giftData.where;
    var giftUid = giftData.uid;
    var giftDate = giftData.creationDate;

    console.log("Creating " + giftUid);
    try{
      document.getElementById("TestGift").remove();
    } catch (err) {}

    var liItem = document.createElement("LI");
    liItem.id = "gift" + giftUid;
    liItem.className = "gift";
    liItem.onclick = function (){
      var spanGift = document.getElementsByClassName("close")[0];
      var descField = document.getElementById('giftDescription');
      var titleField = document.getElementById('giftTitle');
      var whereField = document.getElementById('giftWhere');
      var linkField = document.getElementById('giftLink');

      noteTitleField = document.getElementById('notificationTitle');
      noteInfoField = document.getElementById('notificationInfo');

      if (giftLink != ""){
        linkField.innerHTML = "Click me to go to the webpage!";
        linkField.onclick = function() {
          var newGiftLink = "http://";
          if(giftLink.includes("https://")){
            giftLink = giftLink.slice(8, giftLink.length);
          } else if (giftLink.includes("http://")){
            giftLink = giftLink.slice(7, giftLink.length);
          }
          newGiftLink += giftLink;
          window.open(newGiftLink, "_blank");
        };
      } else {
        linkField.innerHTML = "There was no link provided";
        linkField.onclick = function() {
        };
      }
      if(giftDescription != "") {
        descField.innerHTML = "Description: " + giftDescription;
      } else {
        descField.innerHTML = "There was no description provided";
      }
      titleField.innerHTML = giftTitle;
      if(giftWhere != "") {
        whereField.innerHTML = "This can be found at: " + giftWhere;
      } else {
        whereField.innerHTML = "There was no location provided";
      }
      if(giftDate != undefined) {
        if (giftDate != "") {
          giftCreationDate.innerHTML = "Created on: " + giftDate;
        } else {
          giftCreationDate.innerHTML = "Creation date not available";
        }
      } else {
        giftCreationDate.innerHTML = "Creation date not available";
      }

      //show modal
      modal.style.display = "block";
      currentModalOpen = giftUid;
      console.log("Modal Open: " + currentModalOpen);

      //close on close
      spanGift.onclick = function() {
        currentModalOpen = "";
        console.log("Closed modal");
        modal.style.display = "none";
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == modal) {
          currentModalOpen = "";
          console.log("Closed modal");
          modal.style.display = "none";
        }
      }
    };
    var textNode = document.createTextNode(giftTitle);
    liItem.appendChild(textNode);

    giftList.insertBefore(liItem, document.getElementById("giftListContainer").childNodes[0]);
    clearInterval(offlineTimer);
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
