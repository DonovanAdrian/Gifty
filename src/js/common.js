/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let buttonOpacLim = 7;
let logoutReminder = 300;
let logoutLimit = 900;
let consoleOutput = false;
let pageName = "";

let loadingTimerCancelled = false;

let areYouStillThereBool = false;
let areYouStillThereInit = false;

let currentModalOpenObj = null;

let currentModalOpen = "";
let currentTitle;

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
      if (arr[i].innerHTML == undefined) {
        if (consoleOutput)
          console.log("WARNING: " + i + " UNDEFINED!");
      } else if (arr[i].innerHTML == null) {
        if (consoleOutput)
          console.log("WARNING: " + i + " NULL!");
      } else {
        verifiedElements.push(arr[i]);
        if (consoleOutput)
          console.log("Verified Element!");
      }
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
  } catch (err) {}
  dataListChecker = document.getElementById('dataListContainer');
}

function commonInitialization(){
  if (consoleOutput)
    console.log("Initializing the " + pageName + " Page...");

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
      let isAnonymous = user.isAnonymous;
      let uid = user.uid;
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
        if(dataListChecker != null) {
          try {
            document.getElementById('testData').innerHTML = "Loading Failed, Please Connect To Internet";
          } catch (err) {
            if (dataCounter == 0) {
              if (consoleOutput)
                console.log("Loading Element Missing, Creating A New One");
              let liItem = document.createElement("LI");
              liItem.id = "testData";
              liItem.className = "gift";
              let textNode = document.createTextNode("Loading Failed, Please Connect To Internet");
              liItem.appendChild(textNode);
              dataListContainer.insertBefore(liItem, dataListChecker.childNodes[0]);
            }
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

  offlineSpan.onclick = function() {
    closeModal(offlineModal);
  };

  if (dataListChecker != null) {
    commonLoadingTimer = setInterval(function(){
      commonLoadingTimerInt = commonLoadingTimerInt + 1000;
      if(commonLoadingTimerInt >= 2000){
        if (testData == undefined){
          if(consoleOutput)
            console.log("TestData Missing. Loading Properly.");
        } else {
          if (!loadingTimerCancelled)
            testData.innerHTML = "Loading... Please Wait...";
        }
        clearInterval(commonLoadingTimer);
      }
    }, 1000);
  }

  if (userChecker != null)
    loginTimer();

  if (consoleOutput)
    console.log("The " + pageName + " Page has been initialized!");
}


function loginTimer(){
  let loginNum = 0;
  currentTitle = document.title;
  if (user.moderatorInt == 1)
    logoutLimit = 1800;
  if(consoleOutput)
    console.log("Login Timer Started");
  setInterval(function(){ //900 15 mins, 600 10 mins
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
    document.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onmousedown = resetTimer;
    document.ontouchstart = resetTimer;
    document.onclick = resetTimer;
    document.onscroll = resetTimer;
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
      document.title = "Where'd You Go?";
    }
    function resetTimer() {
      if (areYouStillThereBool) {
        if(consoleOutput)
          console.log("User Active");
        ohThereYouAre();
        document.title = currentTitle;
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
    openModal(notificationModal, "noteModal", true);
    areYouStillThereInit = true;
  }
  notificationInfo.innerHTML = "You have been inactive for 5 minutes, you will be logged out in " + timeMins
    + ":" + timeSecs + "!";
  notificationTitle.innerHTML = "Are You Still There?";

  noteSpan.onclick = function() {
    closeModal(notificationModal);
    areYouStillThereBool = false;
    areYouStillThereInit = false;
    document.title = currentTitle;
  };
}

function ohThereYouAre(){
  notificationInfo.innerHTML = "Welcome back, " + user.name;
  notificationTitle.innerHTML = "Oh, There You Are!";
  document.title = "Oh, There You Are!";

  let nowJ = 0;
  let j = setInterval(function(){
    nowJ = nowJ + 1000;
    if(nowJ >= 3000){
      closeModal(notificationModal);
      areYouStillThereBool = false;
      areYouStillThereInit = false;
      document.title = currentTitle;
      clearInterval(j);
    }
  }, 1000);

  window.onclick = function(event) {
    if (event.target == notificationModal) {
      closeModal(notificationModal);
      areYouStillThereBool = false;
      areYouStillThereInit = false;
      document.title = currentTitle;
      clearInterval(j);
    }
  };
}

function signOut(){
  sessionStorage.clear();
  window.location.href = "index.html";
}

function newNavigation(navNum) {
  try {
    if (privateUser != null) {
      if (consoleOutput)
        console.log("***Private***");
      sessionStorage.setItem("validUser", JSON.stringify(privateUser));
    } else {
      if (consoleOutput)
        console.log("***Normal***");
      sessionStorage.setItem("validUser", JSON.stringify(user));
    }
  } catch (err) {
    if (consoleOutput)
      console.log("***Normal + Catch***");
    sessionStorage.setItem("validUser", JSON.stringify(user));
  }


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

function openModal(openThisModal, modalName, ignoreBool){
  if (ignoreBool == null)
    ignoreBool = false;

  currentModalOpenObj = openThisModal;
  currentModalOpen = modalName;
  openThisModal.style.display = "block";
  if(consoleOutput)
    console.log("Modal Opened: " + modalName);

  if (!ignoreBool) {
    window.onclick = function (event) {
      if (event.target == currentModalOpenObj) {
        closeModal(currentModalOpenObj);
      }
    }
  }
}

function closeModal(closeThisModal){
  try {
    currentModalOpenObj = null;
    currentModalOpen = "";
    closeThisModal.style.display = "none";
    if(consoleOutput)
      console.log("Modal Closed");

    window.onclick = function(event) {}
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

function findUIDInString(input){
  let beginSearch = true;
  let skipThisChar = true;
  let uidBuilder = "";
  let potentialUID = "";

  for (let i = 0; i < input.length; i++) {
    if (input.charAt(i) == "/") {
      if (beginSearch) {
        uidBuilder = "";
        skipThisChar = true;
      } else {
        beginSearch = true;
        uidBuilder = uidBuilder + input.charAt(i);
      }
    }
    if (beginSearch && !skipThisChar) {
      uidBuilder = uidBuilder + input.charAt(i);
    }
    skipThisChar = false;
  }
  potentialUID = uidBuilder;
  return potentialUID;
}

function findUIDItemInArr(item, array){
  if (array != null) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].uid == item) {
        if (consoleOutput)
          console.log("Found item: " + item);
        return i;
      }
    }
  }
  return -1;
}

function deployListEmptyNotification(dataItemText){
  try{
    testData.innerHTML = dataItemText;
  } catch(err){
    if(consoleOutput)
      console.log("Loading Element Missing, Creating A New One");
    let liItem = document.createElement("LI");
    liItem.id = "testData";
    liItem.className = "gift";
    let textNode = document.createTextNode(dataItemText);
    liItem.appendChild(textNode);
    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
  }

  clearInterval(commonLoadingTimer);
  clearInterval(offlineTimer);
  loadingTimerCancelled = true;
}

function updateMaintenanceLog(locationData, detailsData) {
  let today = new Date();
  let UTChh = today.getUTCHours();
  let UTCmm = today.getUTCMinutes();
  let UTCss = today.getUTCSeconds();
  let dd = today.getUTCDate();
  let mm = today.getMonth()+1;
  let yy = today.getFullYear();
  let timeData = mm + "/" + dd + "/" + yy + " " + UTChh + ":" + UTCmm + ":" + UTCss;
  let newUid = firebase.database().ref("maintenance").push();
  newUid = newUid.toString();
  newUid = findUIDInString(newUid);

  firebase.database().ref("maintenance/" + newUid).set({
    uid: newUid,
    location: locationData,
    details: detailsData,
    time: timeData
  });
}

function setAlternatingButtonText(initialString, altString, alternatingBtn, alternator) {
  alternator[0] = alternator[0] + 1000;
  if(alternator[0] >= 3000) {
    alternator[0] = 0;
    if (alternator[1] == 0) {
      alternator[1]++;
      alternatingBtn.innerHTML = initialString;
    } else {
      alternator[1] = 0;
      alternatingBtn.innerHTML = altString;
    }
  }
}
