/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let buttonAlternatorTimer = 0;
let buttonAlternatorInt = 0;

let buttonOpacLim = 7;
let logoutReminder = 300;
let logoutLimit = 900;
let consoleOutput = false;
let pageName = "";

let loadingTimerCancelled = false;

let areYouStillThereBool = false;
let areYouStillThereInit = false;

let signOutFadeOut = false;

let closeModalTimer;
let currentModalOpenObj = null;
let modalClosingBool = false;

let currentModalOpen = "";
let currentTitle;

let userChecker;
let dataListChecker;
let verifiedElements;
let analytics;



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
    if (pageName != "Index") {
      userChecker = JSON.parse(sessionStorage.validUser);
      if (userChecker.moderatorInt == 1)
        consoleOutput = true;
    }
  } catch (err) {}
  dataListChecker = document.getElementById('dataListContainer');
}

function fadeInPage() {
  if (!window.AnimationEvent) {
    return;
  }
  try {
    let fader = document.getElementById('fader');
    fader.classList.add('fade-out');
  } catch(err) {}
}

function initializeFadeOut() {
  let fader = document.getElementById('fader');

  if (!window.AnimationEvent) {
    return;
  }

  window.addEventListener('pageshow', function (event) {
    if (!event.persisted) {
      return;
    }
    fader.classList.remove('fade-in');
  });
}

function commonInitialization(){
  if (consoleOutput) {
    let today = new Date();
    console.log(today);
    console.log("Initializing the " + pageName + " Page...");
  }

  fadeInPage();
  initializeFadeOut();

  const config = JSON.parse(sessionStorage.config);
  instantiateCommon();

  try {
    initializeDB(config);
  } catch (err) {
    let dbInitTimer = 0;
    let dbInitInterval;

    dbInitInterval = setInterval(function(){
      dbInitTimer = dbInitTimer + 1000;
      if(dbInitTimer >= 3000){
        initializeDB(config);
        clearInterval(dbInitInterval);
      }
    }, 1000);
  }

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
          closeModal(currentModalOpenObj);
        } catch (err) {}
        openModal(offlineModal, "offlineModal");
        clearInterval(offlineTimer);
        if (pageName == "Index") {
          loginBtn.innerHTML = "No Internet!";
          allowLogin = false;
          loginDisabledMsg = "It seems that you are offline! Please connect to the internet to be able to " +
            "use Gifty properly!";
        }
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

  if (userChecker != undefined)
    loginTimer();

  if (consoleOutput)
    console.log("The " + pageName + " Page has been initialized!");
}

function initializeDB(config) {
  firebase.initializeApp(config);
  analytics = firebase.analytics();

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      let isAnonymous = user.isAnonymous;
      let uid = user.uid;
    }
  });
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
  navigation(1, false);
}

function navigation(navNum, loginOverride, privateUserOverride) {

  if (loginOverride == undefined && privateUserOverride == undefined) {
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

    try {
      sessionStorage.setItem("userArr", JSON.stringify(userArr));
    } catch (err) {}
  } else if (loginOverride == undefined && privateUserOverride) {
    giftStorage = "";
    sessionStorage.setItem("privateList", JSON.stringify(giftUser));
    sessionStorage.setItem("validUser", JSON.stringify(giftUser));
    sessionStorage.setItem("validPrivateUser", JSON.stringify(user));
    sessionStorage.setItem("userArr", JSON.stringify(userArr));
    sessionStorage.setItem("giftStorage", JSON.stringify(giftStorage));
  }

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
    "moderationQueue.html",//17
    "backup.html"];//18

  if (navNum >= navLocations.length)
    navNum = 0;

  if(consoleOutput)
    console.log("Navigating to " + navLocations[navNum]);

  let fader = document.getElementById('fader');
  let listener = function() {
    fader.removeEventListener('animationend', listener);
    window.location.href = navLocations[navNum];
  };
  fader.addEventListener('animationend', listener);
  if (loginOverride) {
    fader.style.background = "white";
  } else if (loginOverride != undefined) {
    fader.style.background = "#870b0b";
  }
  fader.classList.add('fade-in');
}

function openModal(openThisModal, modalName, ignoreBool){
  if (!modalClosingBool) {
    openThisModal.classList.add('modal-content-open');
    openThisModal.classList.remove('modal-content-close');

    if (ignoreBool == null) {
      ignoreBool = false;
    }
    if (currentModalOpenObj != null) {
      closeModal(currentModalOpenObj);
    }

    currentModalOpenObj = openThisModal;
    currentModalOpen = modalName;
    openThisModal.style.display = "block";
    if (consoleOutput)
      console.log("Modal Opened: " + modalName);

    if (!ignoreBool) {
      window.onclick = function (event) {
        if (event.target == currentModalOpenObj) {
          closeModal(currentModalOpenObj);
        }
      }
    }
  }
}

function closeModal(closeThisModal){
  try {
    let closeTimer = 0;
    currentModalOpenObj = null;
    currentModalOpen = "";

    closeThisModal.classList.remove('modal-content-open');
    closeThisModal.classList.add('modal-content-close');
    modalClosingBool = true;

    if (!window.AnimationEvent) {
      return;
    }

    clearInterval(closeModalTimer);
    closeModalTimer = setInterval(function(){
      closeTimer = closeTimer + 10;
      if(closeTimer >= 370){
        closeTimer = 0;
        closeThisModal.style.display = "none";
        modalClosingBool = false;
        if(consoleOutput)
          console.log("Modal Closed");
        clearInterval(closeModalTimer);
      }
    }, 10);



    window.onclick = function(event) {}
  } catch (err) {
    if(consoleOutput)
      console.log("Modal Not Open");
  }
}

function alternateButtonLabel(button, parentLabel, childLabel){
  let nowConfirm = 0;
  let alternator = 0;
  if (consoleOutput)
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

function findUIDItemInArr(item, array, override){
  if (array != null) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].uid == item) {
        if (consoleOutput && !override) {
          console.log("Found item: " + item);
        }
        return i;
      }
    }
  }
  return -1;
}

function deployListEmptyNotification(dataItemText){
  let giftElements = document.getElementsByClassName("gift");
  let elementFoundBool = false;

  try{
    for(let i = 0; i < giftElements.length; i++) {
      if (giftElements[i].id == "testData") {
        elementFoundBool = true;
        testData.innerHTML = dataItemText;
      }
    }

    if (!elementFoundBool) {
      generateTestDataElement();
    }
  } catch(err){
    generateTestDataElement();
  }

  clearInterval(commonLoadingTimer);
  clearInterval(offlineTimer);
  loadingTimerCancelled = true;

  function generateTestDataElement(){
    if(consoleOutput)
      console.log("Loading Element Missing, Creating A New One");
    let liItem = document.createElement("LI");
    liItem.id = "testData";
    liItem.className = "gift";
    let textNode = document.createTextNode(dataItemText);
    liItem.appendChild(textNode);
    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
  }
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

function setAlternatingButtonText(initialStringA, altStringA, alternatingBtnA,
                                  initialStringB, altStringB, alternatingBtnB) {
  buttonAlternatorTimer = buttonAlternatorTimer + 1000;
  if(buttonAlternatorTimer >= 3000) {
    buttonAlternatorTimer = 0;
    if (buttonAlternatorInt == 0) {
      buttonAlternatorInt++;
      alternatingBtnA.innerHTML = initialStringA;
      alternatingBtnB.innerHTML = initialStringB;
    } else {
      buttonAlternatorInt = 0;
      alternatingBtnA.innerHTML = altStringA;
      alternatingBtnB.innerHTML = altStringB;
    }
  }
}

function giftLinkRedirect(link) {
  if(!link.includes("https://") && !link.includes("http://")){
    link = "http://" + link;
  }

  window.open(link, "_blank");
}
