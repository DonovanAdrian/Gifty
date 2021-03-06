/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let areYouStillThereBool = false;
let areYouStillThereInit = false;

let currentModalOpen = "";

let logoutReminder = 300;
let logoutLimit = 900;
let consoleOutput = false;

let currentModalOpenObj = null;

let userChecker;
let dataListChecker;
let verifiedElements;



function verifyElementIntegrity(arr){
  verifiedElements = [];

  try {
    if (arr.length < 1)
      if(consoleOutput)
        console.log("Element List Empty!");
  } catch (err) {
    if(consoleOutput)
      console.log("Element List Empty!");
    arr = [];
  }

  if(consoleOutput)
    console.log("Checking " + arr.length + " Elements...");

  for(let i = 0; i < arr.length; i++){
    try {
      if (arr[i].innerHTML == undefined)
        if(consoleOutput)
          console.log("WARNING: " + i + " UNDEFINED!");
        else if (arr[i].innerHTML == null)
          if(consoleOutput)
            console.log("WARNING: " + i + " NULL!");
          else
            verifiedElements.push(arr[i]);
    } catch (err) {
      if(consoleOutput)
        console.log("ERROR: Element " + i + " " + err.toString());
    }
  }

  if(consoleOutput)
    console.log("Verified " + verifiedElements.length + " Elements!");
}

function instantiateCommon(){
  try {
    userChecker = JSON.parse(sessionStorage.validUser);
    if(userChecker.moderatorInt == 1)
      consoleOutput = true;
  } catch (err) {
    //console.log("No User Logged In...");
  }
  dataListChecker = document.getElementById('dataListContainer');
}

function commonInitialization(){
  const config = JSON.parse(sessionStorage.config);
  instantiateCommon();

  firebase.initializeApp(config);
  firebase.analytics();

  firebase.auth().signInAnonymously().catch(function (error) {
    let errorCode = error.code;
    let errorMessage = error.message;
  });

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      let isAnonymous = user.isAnonymous;
      let uid = user.uid;
    } else {
      // User is signed out.
    }
  });

  window.addEventListener("online", function(){
    closeModal(offlineModal);
    location.reload();
  });

  window.addEventListener("offline", function() {
    let now = 0;
    offlineTimer = setInterval(function(){
      now = now + 1000;
      if(now >= 5000){
        if(dataListChecker.innerHTML != null)
          try{
            document.getElementById('testGift').innerHTML = "Loading Failed, Please Connect To Internet";
          } catch(err){
            if(dataCounter == 0) {
              if(consoleOutput)
                console.log("Loading Element Missing, Creating A New One");
              let liItem = document.createElement("LI");
              liItem.id = "testGift";
              liItem.className = "gift";
              let textNode = document.createTextNode("Loading Failed, Please Connect To Internet");
              liItem.appendChild(textNode);
              dataListContainer.insertBefore(liItem, dataListChecker.childNodes[0]);
            }
          }
        try{
          closeModal(currentModalOpen);
        } catch (err) {}
        openModal(offlineModal, "offlineModal");
        clearInterval(offlineTimer);
      }
    }, 1000);
  });

  //close offlineModal on close
  offlineSpan.onclick = function() {
    closeModal(offlineModal);
  };

  //close offlineModal on click
  window.onclick = function(event) {
    if (event.target == offlineModal) {
      closeModal(offlineModal);
    }
  };

  if (userChecker != null)
    loginTimer();
}


function loginTimer(){
  let loginNum = 0;
  if (user.moderatorInt == 1)
    logoutLimit = 1800;
  if(consoleOutput)
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
      if(consoleOutput)
        console.log("User Timed Out");
      signOut();
    } else if (loginNum > logoutReminder){//default 600
      if(consoleOutput)
        console.log("User Inactive");
      areYouStillThereNote(loginNum);
      areYouStillThereBool = true;
    }
    function resetTimer() {
      if (areYouStillThereBool) {
        if(consoleOutput)
          console.log("User Active");
        ohThereYouAre();
      }
      loginNum = 0;
    }
  }, 1000);
}

function areYouStillThereNote(timeElapsed){
  let timeRemaining = logoutLimit - timeElapsed;
  let timeMins = Math.floor(timeRemaining/60);
  let timeSecs = timeRemaining%60;

  if (timeSecs < 10) {
    timeSecs = ("0" + timeSecs).slice(-2);
  }

  if(!areYouStillThereInit) {
    closeModal(currentModalOpenObj);
    openModal(notificationModal, "noteModal");
    areYouStillThereInit = true;
  }
  notificationInfo.innerHTML = "You have been inactive for 5 minutes, you will be logged out in " + timeMins
      + ":" + timeSecs + "!";
  notificationTitle.innerHTML = "Are You Still There?";

  //close on close
  noteSpan.onclick = function() {
    closeModal(notificationModal);
    areYouStillThereBool = false;
    areYouStillThereInit = false;
  };
}

function ohThereYouAre(){
  notificationInfo.innerHTML = "Welcome back, " + user.name;
  notificationTitle.innerHTML = "Oh, There You Are!";

  let nowJ = 0;
  let j = setInterval(function(){
    nowJ = nowJ + 1000;
    if(nowJ >= 3000){
      closeModal(notificationModal);
      areYouStillThereBool = false;
      areYouStillThereInit = false;
      clearInterval(j);
    }
  }, 1000);

  //close on click
  window.onclick = function(event) {
    if (event.target == notificationModal) {
      closeModal(notificationModal);
      areYouStillThereBool = false;
      areYouStillThereInit = false;
    }
  };
}

function signOut(){
  sessionStorage.clear();
  window.location.href = "index.html";
}

function newNavigation(navNum) {
  sessionStorage.setItem("validUser", JSON.stringify(user));
  sessionStorage.setItem("userArr", JSON.stringify(userArr));
  let navLocations = [
    "404.html",//0
    "index.html",//1
    "home.html",//2
    "lists.html",//3
    "invites.html",//4
    "settings.html",//5
    "notifications.html",//6
    "boughtGifts.html",//7
    "giftAddUpdate.html",//8
    "friendList.html",//9
    "privateFriendList.html",//10
    "confirmation.html", //11
    "faq.html",//12
    "userAddUpdate.html",//13
    "moderation.html",//14
    "family.html",//15
    "familyUpdate.html",//16
    "moderationQueue.html"];//17

  if (navNum >= navLocations.length)
    navNum = 0;

  if(consoleOutput)
    console.log("Navigating to " + navLocations[navNum]);
  window.location.href = navLocations[navNum];
}

function openModal(openThisModal, modalName){
  currentModalOpenObj = openThisModal;
  currentModalOpen = modalName;
  openThisModal.style.display = "block";
  if(consoleOutput)
    console.log("Modal Opened: " + modalName);
}

function closeModal(closeThisModal){
  try {
    currentModalOpenObj = null;
    currentModalOpen = "";
    closeThisModal.style.display = "none";
    if(consoleOutput)
      console.log("Modal Closed");
  } catch (err) {
    if(consoleOutput)
      console.log("Modal Not Open");
  }
}

function alternateButtonLabel(button, parentLabel, childLabel){
  let nowConfirm = 0;
  let alternator = 0;
  console.log(childLabel + " Button Feature Active");
  setInterval(function(){
    nowConfirm = nowConfirm + 1000;
    if(nowConfirm >= 3000){
      nowConfirm = 0;
      if(alternator == 0) {
        alternator++;
        button.innerHTML = parentLabel;
        button.style.background = "#00c606";
      } else {
        alternator--;
        button.innerHTML = childLabel;
        button.style.background = "#00ad05";
      }
    }
  }, 1000);
}

function isAlph(rChar){
  rChar = rChar.toUpperCase();
  switch (rChar){
    case "A":
    case "B":
    case "C":
    case "D":
    case "E":
    case "F":
    case "G":
    case "H":
    case "I":
    case "J":
    case "K":
    case "L":
    case "M":
    case "N":
    case "O":
    case "P":
    case "Q":
    case "R":
    case "S":
    case "T":
    case "U":
    case "V":
    case "W":
    case "X":
    case "Y":
    case "Z":
      return true;
    default:
      return false;
  }
}
