var listeningFirebaseRefs = [];
var giftArr = [];

var giftPresent = true;
var areYouStillThereBool = false;

var giftUID = -1;
var logoutReminder = 300;
var logoutLimit = 900;

var offline;
var giftList;
var giftStorage;
var offlineSpan;
var offlineModal;
var user;
var descField;
var titleField;
var whereField;
var linkField;
var spanUpdate;
var currentGift;
var userGifts;
var noteModal;
var noteInfoField;
var noteTitleField;
var noteSpan;


function getCurrentUser(){
  user = JSON.parse(sessionStorage.validUser);
  if(user == null || user == undefined){
    window.location.href = "index.html";
  } else {
    console.log("User: " + user.userName + " logged in");
    giftStorage = JSON.parse(sessionStorage.giftStorage);
    if (giftStorage == null || giftStorage == undefined || giftStorage == "") {
      giftPresent = false;
    } else {
      console.log("Gift: " + giftStorage + " found");
    }
    if(user.invites == undefined) {
      console.log("Invites Not Found");
    } else if (user.invites != undefined) {
      if (user.invites.length > 0) {
        inviteNote.style.background = "#ff3923";
      }
    }
    userArr = JSON.parse(sessionStorage.userArr);
  }
}

//Instantiates all data upon loading the webpage
window.onload = function instantiate() {

  giftList = document.getElementById("giftListContainer");
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById("closeOffline");
  descField = document.getElementById('giftDescriptionInp');
  titleField = document.getElementById('giftTitleInp');
  whereField = document.getElementById('giftWhereInp');
  linkField = document.getElementById('giftLinkInp');
  spanUpdate = document.getElementById('updateGift');
  noteModal = document.getElementById('notificationModal');
  noteTitleField = document.getElementById('notificationTitle');
  noteInfoField = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
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


  window.addEventListener("online", function(){
    console.log("Online mode activated, clearing offline notification");
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

  if(giftPresent) {
    spanUpdate.innerHTML = "Update Gift";
    spanUpdate.onclick = function() {
      updateGiftToDB();
    }
  } else {
    spanUpdate.innerHTML = "Add New Gift";
    spanUpdate.onclick = function() {
      addGiftToDB();
    }
  }

  databaseQuery();

  initializeData();

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

  function databaseQuery() {

    userGifts = firebase.database().ref("users/" + user.uid + "/giftList/");

    var fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        giftArr.push(data);

        if(data.val().uid == giftStorage){
          giftUID = data.key;
        }
      });

      postRef.on('child_changed', function (data) {
        console.log(giftArr);
        giftArr[data.key] = data;
        console.log(giftArr);

        if(data.val().uid == giftStorage){
          currentGift.buyer = data.buyer;
          currentGift.received = data.received;
        }
      });

      postRef.on('child_removed', function (data) {
        console.log(giftArr);
        giftArr.splice(data.key, 1);
        console.log(giftArr);
      });

    };

    fetchData(userGifts);

    listeningFirebaseRefs.push(userGifts);
  }

  function initializeData() {
    if(giftPresent) {
      getGift();

      titleField.value = currentGift.title;
      if (currentGift.link == "")
        linkField.placeholder = "No Link Was Provided";
      else
        linkField.value = currentGift.link;
      if (currentGift.where == "")
        whereField.placeholder = "No Location Was Provided";
      else
        whereField.value = currentGift.where;
      if (currentGift.description == "")
        descField.placeholder = "No Description Was Provided";
      else
        descField.value = currentGift.description;
    }
  }

  function getGift() {
    for (var i = 0; i < user.giftList.length; i++){
      if(user.giftList[i].uid == giftStorage){
        currentGift = user.giftList[i];
        break;
      }
    }
  }

  function updateGiftToDB(){
    if(titleField.value === "")
      alert("It looks like you left the title blank. Make sure you add a title so other people know what to get " +
        "you!");
    else {
      if(giftUID != -1) {
        firebase.database().ref("users/" + user.uid + "/giftList/" + giftUID).update({
          title: titleField.value,
          link: linkField.value,
          where: whereField.value,
          received: currentGift.received,
          uid: giftStorage,
          buyer: currentGift.buyer,
          description: descField.value
        });

        sessionStorage.setItem("validUser", JSON.stringify(user));
        window.location.href = "home.html";
      } else {
        console.log(giftUID);
      }
    }
  }

  function addGiftToDB(){
    var uid = giftArr.length;

    if(titleField.value === "")
      alert("It looks like you left the title blank. Make sure you add a title so other people know what to get " +
        "you!");
    else {
      var newUid = firebase.database().ref("users/" + user.uid + "/giftList/" + uid).push();
      newUid = newUid.toString();
      newUid = newUid.substr(77, 96);
      firebase.database().ref("users/" + user.uid + "/giftList/" + uid).set({
        title: titleField.value,
        link: linkField.value,
        where: whereField.value,
        received: 0,
        uid: newUid,
        buyer: "",
        description: descField.value
      });

      sessionStorage.setItem("validUser", JSON.stringify(user));
      window.location.href = "home.html";
    }
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
