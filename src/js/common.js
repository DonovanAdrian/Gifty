/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

//***************************
//User Configurable Variables
let logoutReminder = 300; //default 300, 300 5 mins
let logoutLimit = 900; //default 900, 900 15 mins, 600 10 mins
let commonLoadingTimerLimit = 15000; //default 15000
let debugElementIntegrity = false; //Used to debug if elements are properly initialized (developer tool)
let redirectWarningBool = true; //Used to enable or disable URL redirect warnings
let twentyFourHourTime = false; //Used to enable or disable 24 hour time for getLocalTime();
let jokeGiftChances = 10000; //default 10000 (1 out of 10000). Only appears on friendList.html
let jokeGiftEnabled = true; //Enables/disables a joke gift that has a chance to randomly appear
//User Configurable Variables
//***************************



let listeningFirebaseRefs = [];
let userArr = [];
let inviteArr = [];
let familyArr = [];
let giftDBChanges = [];
let noteDBChanges = [];
let userDBChanges = [];
let cancellationReasons = [];
let listenDBOpType = [];
let listenExpectedUIDs = [];
let globalDBKeyChangesArr = [];
let globalDBDataChangesArr = [];
let localObjectChanges = [];
let backgroundAlternatorLimit = 30000;
let backgroundAlternatorStep = 0;
let commonLoadingTimerInt = 0;
let buttonAlternatorTimer = 0;
let buttonAlternatorInt = 0;
let buttonOpacLim = 7;
let maxListenForDB = 20;
let deployedNoteTimer = 0;
let listenForDBTimer = 0;
let navSuppressTimerCount = 0;
let navSuppressImpatientCount = 0;
let unsavedChangesNav = 0;
let failedNavNum = 0;
let dataCounter = 0;
let pendingNavigation = 0;
let timerErrorIssued = 0;
let dbInitialized = false;
let validPulseReceived = false;
let globalNotificationBool = false;
let consoleOutput = false;
let unsavedChanges = false;
let dbOperationInProgress = false;
let showSuccessfulDBOperation = false;
let userUpdateOverride = false;
let loadingTimerCancelled = false;
let userCreationOverride = false;
let privateUserOverride = false;
let areYouStillThereBool = false;
let areYouStillThereInit = false;
let notificationDeployed = false;
let giftAddUpdateOverride = false;
let modalClosingBool = false;
let checkNoteOnDBInit = false;
let emptyListNoteDeployed = false;
let privateListBool = true;
let dataListExists = false;
let currentModalOpenObj = null;
let currentModalOpen = "";
let pageName = "";
let giftyVersion = "v1.3a";
let defaultSuccessfulDBOperationTitle = "Pending Operation Completed!";
let defaultSuccessfulDBOperationNotice = "Your pending change was successfully saved! Thank you for your patience, you may " +
    "now navigate to other pages.";
let defaultSuccessfulDBNavigation = "NoNav";
let successfulDBOperationTitle = "Pending Operation Completed!";
let successfulDBOperationNotice = "Your pending change was successfully saved! Thank you for your patience, you may " +
    "now navigate to other pages.";
let successfulDBNavigation = "NoNav";
let backgroundAlternatorColor;
let unsavedChangesOverride;
let commonLoadingTimer;
let loginTimerInterval;
let ohThereYouInterval;
let transparencyInterval;
let deployedNoteInterval;
let listenForDBInterval;
let navSuppressTimer;
let openModalTimer;
let alternateButtonTimer;
let loginInitial;
let userInitial;
let limitsInitial;
let familyInitial;
let userBase;
let userGifts;
let userInvites;
let userFriends;
let userReadNotifications;
let userNotifications;
let autoSecretSanta;
let moderatorSettings;
let colorShifter;

let offlineSpan;
let offlineModal;
let offlineTimer;
let notificationModal;
let notificationInfo;
let notificationTitle;
let noteSpan;
let inviteNote;
let backBtn;
let notificationBtn;
let dataListContainer;
let testData;
let currentTitle;
let dataListChecker;
let verifiedElements;
let analytics;
let giftStorage;
let privateList;
let privateUser;
let giftUser;
let user;



function verifyElementIntegrity(arr){
  if (debugElementIntegrity) {
    verifiedElements = [];

    try {
      if (arr.length < 1)
        if (consoleOutput)
          console.log("Element List Empty!");
    } catch (err) {
      if (consoleOutput)
        console.log("Element List Empty!");
      arr = [];
    }

    if (consoleOutput)
      console.log("Checking " + arr.length + " Elements...");

    for (let i = 0; i < arr.length; i++) {
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
        if (consoleOutput)
          console.log("ERROR: Element " + i + " " + err.toString());
      }
    }

    if (consoleOutput)
      console.log("Verified " + verifiedElements.length + " Elements!");
  }
}

function fadeInPage() {
  if (!window.AnimationEvent) {
    return;
  }
  try {
    let fader = document.getElementById("fader");
    fader.classList.add("fade-out");
  } catch(err) {}
}

function initializeFadeOut() {
  let fader = document.getElementById("fader");

  if (!window.AnimationEvent) {
    return;
  }

  window.addEventListener("pageshow", function (event) {
    if (!event.persisted) {
      return;
    }
    fader.classList.remove("fade-in");
  });
}

function initializeSupplementalModals() {
  offlineModal = document.getElementById("offlineModal");
  offlineSpan = document.getElementById("closeOffline");
  notificationModal = document.getElementById("notificationModal");
  notificationTitle = document.getElementById("notificationTitle");
  notificationInfo = document.getElementById("notificationInfo");
  noteSpan = document.getElementById("closeNotification");
}

function commonInitialization(){
  let commonDBInitCount = 0;
  let commonDBInitLimit = 5;
  initializeSupplementalModals();
  backgroundAlternator();

  window.addEventListener( "pageshow", function ( event ) {
    var historyTraversal = event.persisted ||
        ( typeof window.performance != "undefined" &&
            window.performance.navigation.type === 2 );
    if ( historyTraversal ) {
      window.location.reload();
    }
  });

  if (consoleOutput) {
    let today = new Date();
    console.log(today);
    console.log("Initializing the " + pageName + " Page...");
  }

  fadeInPage();
  initializeFadeOut();

  const config = JSON.parse(sessionStorage.config);

  try {
    initializeDB(config);
  } catch (err) {
    let dbInitTimer = 0;
    let dbInitInterval;
    if (consoleOutput)
      console.log("Error initializing database... Attempting to reconnect...");

    dbInitInterval = setInterval(function(){
      dbInitTimer = dbInitTimer + 1000;
      if (dbInitTimer >= 5000 && commonDBInitCount < commonDBInitLimit) {
        commonDBInitCount++;
        initializeDB(config);
        clearInterval(dbInitInterval);
      } else if (commonDBInitCount >= commonDBInitLimit) {
        console.log("ERROR! There were significant issues experienced trying to initialize the connection to the " +
            "database! Please refresh the page or test your connection!");
        try {
          deployNotificationModal(false, "Database Connection Error!", "It appears " +
              "that you are experiencing connection issues! Ensure that you have a fast connection, then close and " +
              "reopen this browser tab.", 6);
        } catch (err) {}
        clearInterval(dbInitInterval);
      }
    }, 1000);
  }

  window.addEventListener("online", function(){
    clearInterval(offlineTimer);
    deployNotificationModal(false, "Internet Restored!", "Internet connection " +
        "restored! Please wait, refreshing the page...", 4, failedNavNum);
  });

  window.addEventListener("offline", function() {
    let now = 0;
    offlineTimer = setInterval(function(){
      now = now + 1000;
      if(now >= 5000){
        clearInterval(commonLoadingTimer);
        timerErrorIssued = 0;
        if(dataListExists) {
          try {
            document.getElementById("testData").innerHTML = "Loading Failed, Please Connect To Internet";
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

  if (!emptyListNoteDeployed) {
    commonLoadingTimer = setInterval(function(){
      commonLoadingTimerInt = commonLoadingTimerInt + 1000;
      if (commonLoadingTimerInt >= (commonLoadingTimerLimit * 2)) {
        if (document.getElementById("loginBtn") != undefined) {
          deployNotificationModal(false, "Loading Error!", "It appears that " +
              "loading the login page has taken a significant amount of time. If this slow speed continues, please " +
              "note that your experience will be severely degraded. If desired, try refreshing the page and contact a " +
              "moderator.", 180);
          document.getElementById("loginBtn").innerHTML = "Possible Loading Error...";
          document.getElementById("signUpFld").innerHTML = "Possible Loading Error...";
        } else {
          if (document.getElementById("testData") != undefined) {
            document.getElementById("testData").innerHTML = "Potential Loading Failure...";
          }
          deployNotificationModal(false, "Loading Error!", "It appears that " +
              "this page has taken a significant amount of time to connect to the database. If this slow speed " +
              "continues, please note that your experience will be severely degraded. If desired, try refreshing the " +
              "page and contact a moderator.", 180);
        }
        if (consoleOutput)
          console.log("Timer Critical Error Issued");
        if (user != undefined) {
          updateMaintenanceLog(pageName, "Critical Error: Critical Loading Time Experienced By \"" + user.userName + "\"");
        } else {
          updateMaintenanceLog(pageName, "Critical Error: Critical Loading Time Experienced!");
        }
        clearInterval(commonLoadingTimer);
        timerErrorIssued = 0;
      } else if (commonLoadingTimerInt >= commonLoadingTimerLimit) {
        if (timerErrorIssued == 0) {
          if (consoleOutput)
            console.log("Timer Error Issued");
          if (document.getElementById("testData") != undefined) {
            document.getElementById("testData").innerHTML = "Loading Is Taking Longer Than Expected...";
          } else if (document.getElementById("loginBtn") != undefined) {
            document.getElementById("loginBtn").innerHTML = "Loading Is Taking Longer Than Expected...";
          }
          deployNotificationModal(false, "Database Connection Slow...", "Database " +
              "connection is very slow... If this slow speed continues, your experience will be severely degraded.", 6);
          if (user != undefined) {
            updateMaintenanceLog(pageName, "Critical Error: Significant Loading Time Experienced By \"" + user.userName + "\"");
          } else {
            updateMaintenanceLog(pageName, "Critical Error: Significant Loading Time Experienced!");
          }
          timerErrorIssued++;
        }
      } else if (commonLoadingTimerInt >= 1000 && dataListExists) {
        if (validPulseReceived){
          clearInterval(commonLoadingTimer);
          timerErrorIssued = 0;
          if(consoleOutput)
            console.log("Pulse Check Complete. Loading Properly.");
        }
      }
    }, 1000);
  }

  if (user != undefined && pageName != "Index") {
    loginTimer();
  } else {
    if (consoleOutput) {
      console.log("User Not Found!");
    }
  }

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

  if (pageName != "Index" && !(pageName == "UserAddUpdate" && user == undefined)) {
    databaseCommonPulse();
  }
  if (checkNoteOnDBInit) {
    checkNotifications();
  }
  dbInitialized = true;
}

function databaseCommonPulse() {
  let commonUserValidPulse = firebase.database().ref("users/" + user.uid);
  let fetchCommonData = function (postRef) {
    postRef.on("child_added", function (data) {
      if (data.key == "ban") {
        validPulseReceived = true;
        if (data.val() != 0) {
          signOut();
        }
      }
    });

    postRef.on("child_changed", function (data) {
      if (data.key == "ban") {
        validPulseReceived = true;
        if (data.val() != 0) {
          signOut();
        }
      }
    });

    postRef.on("child_removed", function (data) {
      if (data.key == "ban") {
        signOut();
      }
    });
  };

  fetchCommonData(commonUserValidPulse);
  listeningFirebaseRefs.push(commonUserValidPulse);
}

function getCurrentUserCommon(){
  let restrictedPages = ["Backups", "Moderation", "ModerationQueue", "Family", "FamilyUpdate"];
  let notificationPages = ["Home", "BoughtGifts", "Confirmation", "FriendList", "Invites", "Lists", "PrivateFriendList"];
  dataListChecker = document.getElementById("dataListContainer");
  if(dataListChecker != undefined) {
    dataListExists = true;
    dataListContainer = document.getElementById("dataListContainer");
    testData = document.getElementById("testData");
  }

  try {
    if (pageName == "GiftAddUpdate") {
      user = JSON.parse(sessionStorage.validUser);

      if (user.moderatorInt == 1 && privateUser == undefined) {
        consoleOutput = true;
        console.log("User: " + user.userName + " loaded in");
        checkInvites(user);
        updateFriendNav(user.friends, true);
      }
    } else if (pageName != "UserAddUpdate") {
      user = JSON.parse(sessionStorage.validUser);

      if (user.moderatorInt == 1 && privateUser == undefined) {
        consoleOutput = true;
        console.log("User: " + user.userName + " loaded in");
      } else if (restrictedPages.includes(pageName)) {
        pageName = pageName.toLowerCase();
        const config = JSON.parse(sessionStorage.config);
        initializeDB(config);
        updateMaintenanceLog(pageName, "The user \"" + user.userName + "\" (" + user.uid + ") " +
            "attempted to access a restricted page.");
        navigation(2);//Home
      }

      if (notificationPages.includes(pageName)) {
        checkNoteOnDBInit = true;
      }
      checkInvites(user);
      updateFriendNav(user.friends, true);
    } else {
      try {
        userCreationOverride = JSON.parse(sessionStorage.userCreationOverride);
      } catch (err) {}
      try {
        user = JSON.parse(sessionStorage.validUser);
        if (user.moderatorInt == 1) {
          consoleOutput = true;
          console.log("User: " + user.userName + " loaded in");
        }
      } catch (err) {}
    }

    userArr = JSON.parse(sessionStorage.userArr);
  } catch (err) {
    if(consoleOutput)
      console.log("Error Reading Data... Sending Error Report To DB.");
    try {
      const config = JSON.parse(sessionStorage.config);
      initializeDB(config);
      updateMaintenanceLog(pageName, "Critical Initialization Error: " + err.toString());
    } catch (err) {}
    if(consoleOutput)
      console.log(err.toString());
    navigation(1, false);//Index
    throw "Error Reading Data!";
  }
}

function checkNotifications() {
  let readNotificationsBool = true;

  notificationBtn.className = "notificationIcon noteBasicBuffer";
  if (user.notifications == undefined) {
    notificationBtn.src = "img/bellNotificationOff.png";
    notificationBtn.onclick = function() {}
  } else {
    if (user.notifications[0].read != undefined) {
      readNotificationsBool = checkReadNotes(false);
    } else {
      readNotificationsBool = checkReadNotes(true);
    }

    if (!readNotificationsBool){
      flickerNotification();
      notificationBtn.onclick = function() {
        notificationNavigation();
      }
    } else if (user.notifications.length > 0) {
      notificationBtn.src = "img/bellNotificationOff.png";
      notificationBtn.onclick = function() {
        notificationNavigation();
      }
    } else if (user.notifications.length == 0) {
      notificationBtn.src = "img/bellNotificationOff.png";
      notificationBtn.onclick = function() {}
    }
  }
}

function notificationNavigation() {
  let notificationSize;
  let notificationScale = 15;

  notificationSize = notificationBtn.height + (notificationBtn.height * Math.log2(notificationScale));
  notificationBtn.style.height = notificationSize + "px";
  notificationBtn.style.width = notificationSize + "px";
  navigation(6);//Notifications
}

function checkReadNotes(updateNotes) {
  let readNoteFound = true;
  let legacyReadBool = false;
  let legacyReadOverride = 0;

  if (!updateNotes) {
    for (let i = 0; i < user.notifications.length; i++) {
      if (user.notifications[i].read == 0) {
        return false;
      }
    }
  } else {
    if (user.readNotifications != undefined)
      legacyReadBool = true;

    for (let i = 0; i < user.notifications.length; i++) {
      if (legacyReadBool) {
        if (user.readNotifications.indexOf(user.notifications[i]) != -1) {
          legacyReadOverride = 1;
        } else {
          legacyReadOverride = 0;
          readNoteFound = false;
        }
      }
      generateNewNoteUID(i, user.notifications[i], legacyReadOverride);
      legacyReadOverride = 0;
    }
  }

  return readNoteFound;
}

function addNotificationToDB (recipientData, notificationString) {
  let recipientNotes = recipientData.notifications;
  if (recipientNotes == undefined)
    recipientNotes = [];
  let uid = recipientNotes.length;
  let newUid = firebase.database().ref("users/" + recipientData.uid + "/notifications/" + uid).push();
  newUid = newUid.toString();
  newUid = findUIDInString(newUid);
  firebase.database().ref("users/" + recipientData.uid + "/notifications/" + uid).set({
    uid: newUid,
    data: notificationString,
    read: 0
  });

  if (!globalNotificationBool)
    listenForDBChanges("Notification", newUid);
}

function generateNewNoteUID (noteKey, noteString, readOverride) {
  if (readOverride == undefined)
    readOverride = 0

  let newUid = firebase.database().ref("users/" + user.uid + "/notifications/" + noteKey).push();
  newUid = newUid.toString();
  newUid = findUIDInString(newUid);
  firebase.database().ref("users/" + user.uid + "/notifications/" + noteKey).update({
    uid: newUid,
    data: noteString,
    read: readOverride
  });

  return newUid;
}

function checkInvites(inputUser) {
  if (inputUser.invites == undefined) {
    if (consoleOutput)
      console.log("Invites Not Found");
    inputUser.invites = [];
  }
  if (inputUser.invites.length > 0) {
    inviteNote.style.background = "#ff3923";
    if (pageName == "Invites") {
      newInviteIcon.style.display = "block";
      invitesFound = true;
    }
  }
}

function updateFriendNav(friendListData, initIgnore) {
  let giftUserPages = ["FriendList", "PrivateFriendList"];

  if (initIgnore == undefined) {
    if (giftUserPages.includes(pageName)) {
      initIgnore = false;
    } else {
      initIgnore = true;
    }
  }

  if (friendListData != undefined) {
    if (giftUserPages.includes(pageName) && !initIgnore) {
      if (friendListData.indexOf(giftUser.uid) == -1) {
        navigation(3);//Lists
      }
    }

    if (friendListData.length < 100 && friendListData.length > 1) {
      inviteNote.innerHTML = friendListData.length + " Friends";
    } else if (friendListData.length == 1) {
      inviteNote.innerHTML = "1 Friend";
    }
  } else {
    inviteNote.innerHTML = "Friends";
  }
}

function loginTimer(){
  let loginNum = 0;
  clearInterval(loginTimerInterval);

  if (document.title != "Where'd You Go?" && document.title != "Oh, There You Are!")
    currentTitle = document.title;
  if (user.moderatorInt == 1)
    logoutLimit = 1800;
  loginTimerInterval = setInterval(function(){ //900 15 mins, 600 10 mins
    document.onclick = loginTimer;
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
    clearInterval(loginTimerInterval);
    areYouStillThereBool = false;
    areYouStillThereInit = false;
    document.title = currentTitle;
    if(consoleOutput)
      console.log("User Active");
    ohThereYouAre();
  };

  window.onclick = function(event) {
    if (event.target == notificationModal) {
      closeModal(notificationModal);
      clearInterval(loginTimerInterval);
      areYouStillThereBool = false;
      areYouStillThereInit = false;
      document.title = currentTitle;
      if(consoleOutput)
        console.log("User Active");
      ohThereYouAre();
    }
  };
}

function ohThereYouAre(){
  let ohThereYouTimer = 0;
  let ohThereYouLimit = 3;

  document.title = "Oh, There You Are!";
  ohThereYouInterval = setInterval(function(){
    ohThereYouTimer = ohThereYouTimer + 1;
    if (ohThereYouTimer >= ohThereYouLimit){
      clearInterval(ohThereYouInterval);
      areYouStillThereInit = false;
      document.title = currentTitle;
      loginTimer();
    }
  }, 1000);
}

function deployNotificationModal(reopenPreviousModal, noteTitle, noteInfo, customTime, customNavigation, customNavParam) {
  let navigationBool = true;
  let previousModalName = "";
  let previousModal;

  deployedNoteTimer = 0;
  clearInterval(deployedNoteInterval);

  if (noteTitle == undefined)
    noteTitle = "Notification Title";
  else if (noteTitle == "")
    noteTitle = "Notification Title";

  if (noteInfo == undefined)
    noteInfo = "Notification Info";
  else if (noteInfo == "")
    noteInfo = "Notification Info";

  if (reopenPreviousModal != undefined && currentModalOpenObj != undefined)
    if (reopenPreviousModal) {
      previousModal = currentModalOpenObj;
      if (previousModalName != undefined)
        previousModalName = currentModalOpen;
      else
        previousModalName = "previousModal";
    }
    else
      reopenPreviousModal = false;

  if (customTime == undefined)
    customTime = 3;
  else if (isNaN(customTime))
    customTime = 3;

  if (customNavigation == undefined)
    navigationBool = false;
  else if (isNaN(customNavigation))
    navigationBool = false;
  else
  if (consoleOutput)
    console.log("Navigation Ready");

  notificationInfo.innerHTML = noteInfo;
  notificationTitle.innerHTML = noteTitle;
  if (!notificationDeployed) {
    openModal(notificationModal, "noteModal", true);
    if (pageName != "Index" && consoleOutput)
      console.log("Notification Deployed");
  }
  notificationDeployed = true;

  noteSpan.onclick = function() {
    if (navigationBool) {
      if (consoleOutput)
        console.log("Notification Navigating....");
      navigation(customNavigation, customNavParam);//Custom
    }
    notificationDeployed = false;
    closeModal(notificationModal);
    if (reopenPreviousModal != undefined)
      if (reopenPreviousModal)
        openModal(previousModal, previousModalName);
    clearInterval(deployedNoteInterval);
  };

  deployedNoteInterval = setInterval(function(){
    deployedNoteTimer = deployedNoteTimer + 1;
    if(deployedNoteTimer >= customTime){
      if (navigationBool) {
        if (consoleOutput)
          console.log("Notification Navigating...");
        navigation(customNavigation, customNavParam);//Custom
      }
      notificationDeployed = false;
      closeModal(notificationModal);
      if (reopenPreviousModal != undefined)
        if (reopenPreviousModal)
          openModal(previousModal, previousModalName);
      clearInterval(deployedNoteInterval);
    }
  }, 1000);

  window.onclick = function(event) {
    if (event.target == notificationModal) {
      if (navigationBool) {
        if (consoleOutput)
          console.log("Notification Navigating.....");
        navigation(customNavigation, customNavParam);//Custom
      }
      notificationDeployed = false;
      closeModal(notificationModal);
      if (reopenPreviousModal != undefined)
        if (reopenPreviousModal)
          openModal(previousModal, previousModalName);
      clearInterval(deployedNoteInterval);
    }
  };
}

function signOut(){
  if (unsavedChanges) {
    if (pageName == "GiftAddUpdate") {
      unsavedChangesNav = 1;
      unsavedChangesOverride = false;
      deployConfirmationModal("Unsaved Changes!", "You have unsaved changes! " +
          "Would you like to continue?");
      return;
    }
  }
  if (!dbOperationInProgress) {
    config = JSON.parse(sessionStorage.config);
    sessionStorage.clear();
    sessionStorage.setItem("config", JSON.stringify(config));
    navigation(1, false);//Index
  } else {
    deployNotificationModal(false, "Pending Operation In Progress",
        "Please do not navigate until your changes are saved!", 4);
    showSuccessfulDBOperation = true;
  }
}

function initGiftDataIfEmpty(inputGiftData) {
  let giftDataProperties = ["description", "link", "received", "receivedBy",
    "title", "where", "buyer", "creationDate", "creator", "multiples"];

  for (let i = 0; i < giftDataProperties.length; i++) {
    if (inputGiftData[giftDataProperties[i]] == undefined)
      switch (giftDataProperties[i]) {
        case "multiples":
          inputGiftData[giftDataProperties[i]] = false;
          break;
        case "receivedBy":
          inputGiftData[giftDataProperties[i]] = [];
          break;
        default:
          inputGiftData[giftDataProperties[i]] = "";//buyer, creator, creationDate
      }
  }

  return inputGiftData;
}

function fetchGiftReceivedSuffix(multipleBuyer, buyerStr, buyerArr){
  let returnGiftSuffix = "";

  if (!multipleBuyer) {
    if (buyerStr == user.uid) {
      returnGiftSuffix = "you!";
    } else {
      let tempUserNameFetch = fetchNameByUserName(buyerStr);
      if (tempUserNameFetch == undefined)
        tempUserNameFetch = buyerStr;
      returnGiftSuffix = tempUserNameFetch;
    }
  } else {
    let userBought = buyerArr.indexOf(user.uid);
    if (userBought == -1) {
      if (buyerArr.length == 1) {
        returnGiftSuffix = "1 person!";
      } else {
        returnGiftSuffix = buyerArr.length + " people!";
      }
    } else {
      if (buyerArr.length == 1) {
        returnGiftSuffix = "you!";
      } else {
        returnGiftSuffix = buyerArr.length + " people... Including you!";
      }
    }
  }

  return returnGiftSuffix;
}

function fetchNameByUserName(userNameInput) {
  for (let i = 0; i < userArr.length; i++) {
    if (userNameInput == userArr[i].userName) {
      return userArr[i].name;
    }
  }

  return undefined;
}

function findObjectChanges(objInputOld, objInputNew, limiterBool) {
  let objectKeysChanged = [];
  let objectDataChanged = [];
  let objectKeysChecked = [];

  if (limiterBool == undefined)
    limiterBool = false;

  for (let oldObjKey in objInputOld) {
    if (!objInputOld.hasOwnProperty(oldObjKey)) continue;

    let oldObjValue = objInputOld[oldObjKey];
    let newObjValue = objInputNew[oldObjKey];
    if (oldObjValue == undefined || newObjValue == undefined) {
      objectKeysChanged.push(oldObjKey);
      objectDataChanged.push(newObjValue);
    } else {
      if (oldObjValue != newObjValue) {
        if (oldObjValue.length == undefined) {
          objectKeysChanged.push(oldObjKey);
          objectDataChanged.push(newObjValue);
        } else {
          let arrDataChanged = checkArrayChanges(oldObjValue, newObjValue);
          if (typeof arrDataChanged != "boolean") {
            objectKeysChanged.push(oldObjKey);
            objectDataChanged.push(arrDataChanged);
          } else if (arrDataChanged) {
            objectKeysChanged.push(oldObjKey);
            objectDataChanged.push(newObjValue);
          }
        }
      }
    }
    objectKeysChecked.push(oldObjKey);
  }

  for (let newObjKey in objInputNew) {
    if (!objectKeysChecked.includes(newObjKey)) {
      let newObjValue = objInputNew[newObjKey];
      objectKeysChanged.push(newObjKey);
      objectDataChanged.push(newObjValue);
    }
  }

  if (!limiterBool) {
    if (consoleOutput)
      if (objectKeysChanged.length != 0) {
        console.log("Key(s) Changed:");
        console.log(objectKeysChanged);
        console.log(objectDataChanged);
      }

    for (let i = 0; i < objectKeysChanged.length; i++) {
      globalDBKeyChangesArr.push(objectKeysChanged[i]);
      globalDBDataChangesArr.push(objectDataChanged[i]);
    }
  }

  return objectKeysChanged;
}

function checkArrayChanges(oldArrInput, newArrInput) {
  let changedArrItems = [];

  if (oldArrInput == undefined && newArrInput == undefined) {
    return false;
  } else if (oldArrInput == undefined || newArrInput == undefined) {
    return true;
  } else if (oldArrInput.length == undefined && newArrInput.length == undefined) {
    return false;
  } else if (oldArrInput.length == undefined || newArrInput.length == undefined) {
    return true;
  } else if (oldArrInput.length != newArrInput.length) {
    return true;
  }

  for (let i = 0; i < oldArrInput.length; i++) {
    if (typeof oldArrInput[i] != "object") {
      if (oldArrInput[i] != newArrInput[i]) {
        return true;
      }
    } else {
      changedArrItems = findObjectChanges(oldArrInput[i], newArrInput[i], true);
      if (changedArrItems.length != 0) {
        if (oldArrInput[i].uid != undefined)
          return oldArrInput[i].uid;
        else
          return true;
      }
    }
  }

  return false;
}

function listenForDBChanges(dbChangeType, expectedUID) {
  listenDBOpType.push(dbChangeType);
  listenExpectedUIDs.push(expectedUID);

  dbOperationInProgress = true;

  clearInterval(listenForDBInterval);
  listenForDBTimer = 0;
  listenForDBInterval = setInterval(function(){
    listenForDBTimer = listenForDBTimer + 1;
    if (globalDBKeyChangesArr.length != 0) {
      if (consoleOutput)
        console.log("Checking For Changes...");
      checkGlobalDBChanges();
    }
    if(listenForDBTimer >= maxListenForDB){
      let tempDegradedPerfUser;
      showSuccessfulDBOperation = false;
      dbOperationInProgress = false;
      deployNotificationModal(false, "Pending Operation Failed!",
          "Your pending changes were NOT successfully saved. You may have a slow connection or be " +
          "experiencing an error. Please try again or contact a moderator! Refreshing page...", 6, failedNavNum);
      if (privateUser != null)
        tempDegradedPerfUser = "\"" + privateUser.userName + "\" (As A Private User)";
      else
        tempDegradedPerfUser = "\"" + user.userName + "\"";
      updateMaintenanceLog(pageName, tempDegradedPerfUser + " experienced degraded performance or an error with " +
          dbChangeType + " Operation and UID " + expectedUID);
      clearInterval(listenForDBInterval);
      listenForDBTimer = 0;
    }
  }, 500);
}

function checkGlobalDBChanges() {
  if (globalDBKeyChangesArr.length != 0)
    for (let i = 0; i < globalDBKeyChangesArr.length; i++) {
      if (listenExpectedUIDs.length != 0)
        getDBOpType(globalDBDataChangesArr[i], globalDBKeyChangesArr[i]);
      else
        break;
    }
}

function getDBOpType(dataChangeInput, keyChangeInput) {
  giftDBChanges = ["Add", "Update", "Delete", "Buy"];
  noteDBChanges = ["Invite", "Notification", "NoteDelete"];
  userDBChanges = ["Remove", "Confirm"];
  cancellationReasons = [giftDBChanges, noteDBChanges, userDBChanges];
  if (!isNaN(keyChangeInput)) {
    cancelDBChangeListener("Add", keyChangeInput);
    cancelDBChangeListener("Update", keyChangeInput);
  }
  switch (keyChangeInput) {
    case "friends":
      if (pageName == "Invites")
        cancelDBChangeListener("Remove", dataChangeInput);
      break;
    case "invites":
      if (pageName == "Confirmation")
        cancelDBChangeListener("Confirm", dataChangeInput);
      break;
    case "notifications":
      if (dataChangeInput[0].uid != undefined) {
        cancelDBChangeListener("Invite", dataChangeInput);
        cancelDBChangeListener("Notification", dataChangeInput);
        cancelDBChangeListener("NoteDelete", dataChangeInput);
      }
      break;
    case "giftList":
    case "privateList":
      if (pageName == "FriendList")
        cancelDBChangeListener("Buy", dataChangeInput);
      else if (pageName == "PrivateFriendList") {
        if (typeof dataChangeInput == "string") {
          cancelDBChangeListener("Buy", dataChangeInput);
        } else {
          cancelDBChangeListener("Delete", dataChangeInput);
        }
      }
      else if (pageName == "Home")
        if (dataChangeInput.length != undefined)
          cancelDBChangeListener("Delete", dataChangeInput);
      break;
  }
}

function cancelDBChangeListener(expectedChange, receivedUID, overrideBool) {
  let unrelatedCancelOverride = false;
  let updateArrs = false;
  let receivedUIDCount = 0;
  let removalLocation = 0;
  let tempString = "";
  let cancelReason;

  for (let i = 0; i < cancellationReasons.length; i++) {
    if (cancellationReasons[i].includes(expectedChange)) {
      cancelReason = cancellationReasons[i];
      break;
    }
  }

  if (overrideBool == undefined) {
    overrideBool = false;
  }

  if (overrideBool) {
    console.log(receivedUID)
    if (receivedUID != undefined)
      updateArrs = true;
  } else {
    for (let i = 0; i < listenExpectedUIDs.length; i++) {
      if (expectedChange == "Notification") {
        for (let a = 0; a < receivedUID.length; a++) {
          tempString = receivedUID[a].uid;
          if (tempString != undefined) {
            if (tempString == listenExpectedUIDs[i]) {
              receivedUID = listenExpectedUIDs[i];
              break;
            }
          }
        }
      }
      if (expectedChange == "Invite") {
        for (let a = 0; a < receivedUID.length; a++) {
          tempString = receivedUID[a].data;
          if (tempString != undefined) {
            if (tempString.includes(listenExpectedUIDs[i])) {
              receivedUID = listenExpectedUIDs[i];
              break;
            }
          }
        }
      }
      if (expectedChange == "NoteDelete") {
        if (receivedUID == undefined) {
          updateArrs = true;
          overrideBool = true;
        } else if (findUIDItemInArr(listenExpectedUIDs[i], receivedUID, true)) {
          updateArrs = true;
          overrideBool = true;
        }
      }
      if (expectedChange == "Confirm" || expectedChange == "Remove") {
        if (receivedUID == undefined) {
          updateArrs = true;
          overrideBool = true;
        } else if (!receivedUID.includes(listenExpectedUIDs[i])) {
          updateArrs = true;
          overrideBool = true;
        }
      }
      if (expectedChange == "Delete") {
        if (findUIDItemInArr(listenExpectedUIDs[i], receivedUID, true) == -1) {
          receivedUID = listenExpectedUIDs[i];
        }
      }

      if (listenExpectedUIDs[i] == receivedUID) {
        if (listenDBOpType[i] == expectedChange) {
          updateArrs = true;
          removalLocation = i;
        }
        receivedUIDCount++;
      }
    }
  }

  if (updateArrs) {
    if (overrideBool) {
      listenExpectedUIDs = [];
      listenDBOpType = [];
    } else {
      listenExpectedUIDs.splice(removalLocation, 1);
      listenDBOpType.splice(removalLocation, 1);
      for (let i = 0; i < cancelReason.length; i++) {
        if (!listenDBOpType.includes(cancelReason[i])) {
          unrelatedCancelOverride = true;
        }
      }
    }

    if (listenExpectedUIDs.length == 0 || unrelatedCancelOverride) {
      if (consoleOutput)
        console.log("All Expected Changes Received!");
      if (showSuccessfulDBOperation) {
        if (privateListBool)
          sessionStorage.setItem("validGiftUser", JSON.stringify(user));
        if (pageName == "GiftAddUpdate") {
          unsavedChanges = false;
          giftAddUpdateOverride = false;
          unsavedGiftStorage = ["", "", "", "", ""]
          sessionStorage.setItem("unsavedChanges", JSON.stringify(unsavedChanges));
          sessionStorage.setItem("unsavedGiftStorage", JSON.stringify(unsavedGiftStorage));
        }
        deployNotificationModal(false, successfulDBOperationTitle,
            successfulDBOperationNotice, 4, successfulDBNavigation);
        successfulDBOperationTitle = defaultSuccessfulDBOperationTitle;
        successfulDBOperationNotice = defaultSuccessfulDBOperationNotice;
        successfulDBNavigation = defaultSuccessfulDBNavigation;
        pendingNavigation = 0;
        saveCriticalCookies();
      }
      clearInterval(listenForDBInterval);
      showSuccessfulDBOperation = false;
      dbOperationInProgress = false;
      listenExpectedUIDs = [];
      listenDBOpType = [];
      globalDBKeyChangesArr = [];
      globalDBDataChangesArr = [];
    }
  }
}

function deployConfirmationModal(unsavedChangesTitle, unsavedChangesContent) {
  confirmTitle.innerHTML = unsavedChangesTitle;
  confirmContent.innerHTML = unsavedChangesContent;

  confirmBtn.onclick = function () {
    if (pageName == "GiftAddUpdate") {
      if (unsavedChanges) {
        unsavedChanges = false;
        unsavedGiftStorage = ["", "", "", "", ""];
        sessionStorage.setItem("unsavedChanges", JSON.stringify(unsavedChanges));
        sessionStorage.setItem("unsavedGiftStorage", JSON.stringify(unsavedGiftStorage));
        navigation(unsavedChangesNav, unsavedChangesOverride);//Custom
      }
    }
    closeModal(confirmModal);
  };

  denyBtn.onclick = function () {
    closeModal(confirmModal);
  };

  openModal(confirmModal, "confirmModal", true);

  closeConfirmModal.onclick = function () {
    closeModal(confirmModal);
  };

  window.onclick = function (event) {
    if (event.target == confirmModal) {
      closeModal(confirmModal);
    }
  };
}

function navigation(navNum, loginOverride) {
  clearInterval(colorShifter);
  if (pendingNavigation == 0) {
    pendingNavigation = 1;
    if (unsavedChanges) {
      if (pageName == "GiftAddUpdate") {
        unsavedChangesNav = navNum;
        deployConfirmationModal("Unsaved Changes!", "You have unsaved changes! " +
            "Would you like to continue?");
        pendingNavigation = 0;
        return;
      }
    }
    if (dbOperationInProgress) {
      deployNotificationModal(false, "Pending Operation In Progress",
          "Please do not navigate until your changes are saved!", 4);
      showSuccessfulDBOperation = true;
      pendingNavigation = 0;
    } else {
      if (loginOverride == undefined && !privateUserOverride) {
        try {
          if (privateUser != undefined && !giftAddUpdateOverride) {
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
        } catch (err) {
        }
      } else if (loginOverride == undefined && privateUserOverride) {
        sessionStorage.setItem("privateList", JSON.stringify(giftUser));
        sessionStorage.setItem("validUser", JSON.stringify(giftUser));
        sessionStorage.setItem("validPrivateUser", JSON.stringify(user));
        sessionStorage.setItem("userArr", JSON.stringify(userArr));
        sessionStorage.setItem("giftStorage", JSON.stringify(giftStorage));
      } else if (userUpdateOverride != undefined) {
        if (userUpdateOverride) {
          sessionStorage.setItem("validUser", JSON.stringify(user));
          sessionStorage.setItem("userArr", JSON.stringify(userArr));
        }
      }
      sessionStorage.setItem("backgroundAlternatorColor", JSON.stringify(backgroundAlternatorColor));
      sessionStorage.setItem("backgroundAlternatorStep", JSON.stringify(backgroundAlternatorStep));

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

      if (consoleOutput)
        console.log("Navigating to " + navLocations[navNum]);

      let fader = document.getElementById("fader");
      let listener = function () {
        fader.removeEventListener("animationend", listener);
        window.location.href = navLocations[navNum];
      };
      fader.addEventListener("animationend", listener);
      if (loginOverride) {
        fader.style.background = "#ffffff";
      } else if (loginOverride != undefined) {
        fader.style.background = "#870b0b";
      }
      fader.classList.add("fade-in");
    }
  } else {
  }
  navigationSuppressionTimer();
}

function navigationSuppressionTimer() {
  let navSuppressTimerLimit = 30;
  let navSuppressImpatientLimit = 5;
  clearInterval(navSuppressTimer);
  if (navSuppressTimerCount > 0) {
    navSuppressImpatientCount++;
    if (navSuppressImpatientCount > navSuppressImpatientLimit) {
      if (consoleOutput)
        console.log("Chill out, man");
      deployNotificationModal(false, "Navigation Suppression Error", "It appears " +
          "that there is an issue navigating. Please wait about 5 seconds and try again. If issues persist, contact " +
          "a moderator.", 10);
    }
  }

  navSuppressTimer = setInterval(function () {
    navSuppressTimerCount = navSuppressTimerCount + 10;
    if (navSuppressTimerCount >= navSuppressTimerLimit) {
      pendingNavigation = 0;
      navSuppressTimerCount = 0;
      navSuppressImpatientCount = 0;
      clearInterval(navSuppressTimer);
    }
  }, 1000);
}

function openModal(openThisModal, modalName, ignoreBool){
  let openRetryTimer = 0;

  if (ignoreBool == undefined) {
    ignoreBool = false;
  }

  if (currentModalOpenObj != undefined) {
    closeModal(currentModalOpenObj);
  }

  if (modalClosingBool) {
    clearInterval(openModalTimer);
    openModalTimer = setInterval(function () {
      openRetryTimer = openRetryTimer + 10;
      if (openRetryTimer >= 50) {
        if (!modalClosingBool) {
          openThisModal.classList.remove("modal-content-close");
          openThisModal.classList.add("modal-content-open");
          openRetryTimer = 0;
          currentModalOpenObj = openThisModal;
          currentModalOpen = modalName;
          openThisModal.style.display = "block";
          if (consoleOutput)
            console.log("A Modal Opened: " + modalName);
          clearInterval(openModalTimer);
        }
      }
    }, 60);
  } else {
    openThisModal.classList.remove("modal-content-close");
    openThisModal.classList.add("modal-content-open");
    currentModalOpenObj = openThisModal;
    currentModalOpen = modalName;
    openThisModal.style.display = "block";
    if (consoleOutput)
      console.log("B Modal Opened: " + modalName);
  }

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
    let currentTransparency;
    let closeTimerBufferTracker = 0;
    let closeTimerBuffer = 10;

    closeThisModal.classList.remove("modal-content-open");
    closeThisModal.classList.add("modal-content-close");

    modalClosingBool = true;

    if (!window.AnimationEvent) {
      return;
    }

    clearInterval(transparencyInterval);
    transparencyInterval = setInterval( function(){
      if (closeTimerBufferTracker > closeTimerBuffer) {
        currentTransparency = window.getComputedStyle(closeThisModal).getPropertyValue("opacity");
        if (currentTransparency < 0.05) {
          closeModalFinal();
        } else if (currentTransparency == 1) {
          closeModalFinal();
        }
      }

      closeTimerBufferTracker++;
    }, 1);

    window.onclick = function(event) {}
  } catch (err) {
    if(consoleOutput)
      console.log("Modal Not Open");
  }

  function closeModalFinal() {
    closeThisModal.style.display = "none";
    modalClosingBool = false;
    if (consoleOutput)
      if (currentModalOpen != "" && currentModalOpen != undefined)
        console.log(currentModalOpen + " Modal Closed");
      else
        console.log("Modal Closed");
    currentModalOpenObj = null;
    currentModalOpen = "";
    clearInterval(transparencyInterval);
  }
}

function flickerNotification(){
  let flickerTimer = 0;
  let flickerAlternator = 0;
  let normalFilter = "grayscale(0%)";
  let applyFilter = "grayscale(75%)";
  let normalOpacity = "1";
  let applyOpacity = "0.75";
  if (consoleOutput)
    console.log("Notification Feature Active");
  notificationBtn.src = "img/bellNotificationOn.png";
  setInterval(function(){
    flickerTimer = flickerTimer + 1000;
    if(flickerTimer >= 1000){
      flickerTimer = 0;
      flickerAlternator++;
      if(flickerAlternator == 0) {
        notificationBtn.style.filter = applyFilter;
        notificationBtn.style.opacity = applyOpacity;
      } else if (flickerAlternator == 1) {
        notificationBtn.style.filter = normalFilter;
        notificationBtn.style.opacity = normalOpacity;
      } else if (flickerAlternator == 2) {
        notificationBtn.style.filter = applyFilter;
        notificationBtn.style.opacity = applyOpacity;
      } else if (flickerAlternator == 3) {
        notificationBtn.style.filter = normalFilter;
        notificationBtn.style.opacity = normalOpacity;
      } else if (flickerAlternator == 4) {
        notificationBtn.style.filter = applyFilter;
        notificationBtn.style.opacity = applyOpacity;
      } else if (flickerAlternator <= 12) {
        notificationBtn.style.filter = normalFilter;
        notificationBtn.style.opacity = normalOpacity;
      } else {
        flickerAlternator = 0;
        notificationBtn.style.filter = applyFilter;
        notificationBtn.style.opacity = applyOpacity;
      }
    }
  }, 750);
}

function alternateButtonLabel(button, parentLabel, childLabel){
  let nowConfirm = 0;
  let alternator = 0;
  clearInterval(alternateButtonTimer);
  if (consoleOutput)
    console.log(childLabel + " Button Feature Set");
  alternateButtonTimer = setInterval(function(){
    nowConfirm = nowConfirm + 1000;
    if(nowConfirm >= 3000){
      nowConfirm = 0;
      if(alternator == 0) {
        alternator++;
        button.innerHTML = parentLabel;
        button.style.background = "rgba(200, 200, 200, 0.5)";
      } else {
        alternator--;
        button.innerHTML = childLabel;
        button.style.background = "rgba(200, 200, 200, 0.75)";
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

function findFirstNameInFullName(nameInpStr){
  let firstNameFound = nameInpStr;
  let returnFirstName = "";
  for (let i = 0; i < nameInpStr.length; i++) {
    if (nameInpStr[i] != " ") {
      returnFirstName = returnFirstName + nameInpStr[i];
    } else {
      break;
    }
  }

  if (returnFirstName == "") {
    returnFirstName = firstNameFound;
  }

  return returnFirstName;
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

function findUIDItemInArr(item, array, override) {
  if (array != undefined) {
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

function findUserNameItemInArr(item, userArray, override){
  if (userArray != undefined) {
    for (let i = 0; i < userArray.length; i++) {
      if (userArray[i].userName == item) {
        if (consoleOutput && !override) {
          console.log("Found item: " + item);
        }
        return i;
      }
    }
  }
  return -1;
}

function findRemovedData(oldRemovalArr, newRemovalArr, ignoreUID) {
  let foundInInner = false;

  if (newRemovalArr == undefined) {
    newRemovalArr = [];
  }
  if (ignoreUID == undefined) {
    ignoreUID = false;
  }

  if (newRemovalArr.length == 0 && oldRemovalArr.length == 1) {
    return 0;
  } else {
    for (let a = 0; a < oldRemovalArr.length; a++) {
      for (let b = 0; b < newRemovalArr.length; b++) {
        if (ignoreUID) {
          if (oldRemovalArr[a] == newRemovalArr[b]) {
            foundInInner = true;
            break;
          }
        } else {
          if (oldRemovalArr[a].uid == newRemovalArr[b].uid) {
            foundInInner = true;
            break;
          }
        }
      }
      if (!foundInInner) {
        return a;
      }
      foundInInner = false;
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
  timerErrorIssued = 0;
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
  emptyListNoteDeployed = true;
}

function updateMaintenanceLog(locationData, detailsData) {
  let today = new Date();
  let UTChh = today.getUTCHours() + "";
  let UTCmm = today.getUTCMinutes() + "";
  let UTCss = today.getUTCSeconds() + "";
  let dd = today.getUTCDate() + "";
  let mm = today.getMonth() + 1 + "";
  let yy = today.getFullYear() + "";


  if (UTChh.length == 1)
    UTChh = "0" + UTChh
  if (UTCmm.length == 1)
    UTCmm = "0" + UTCmm
  if (UTCss.length == 1)
    UTCss = "0" + UTCss
  if (dd.length == 1)
    dd = "0" + dd
  if (mm.length == 1)
    mm = "0" + mm

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
  if (redirectWarningBool) {
    let prevGiftModal = currentModalOpenObj;
    confirmTitle.innerHTML = "Redirecting Away From Gifty!";
    confirmContent.innerHTML = "You are about to go to the following webpage:<br/><br/>" + link + "<br/><br/>Are you sure?";

    confirmBtn.onclick = function () {
      if (!link.includes("https://") && !link.includes("http://")) {
        link = "http://" + link;
      }
      window.open(link, "_blank");

      closeModal(confirmModal);
      openModal(prevGiftModal, "giftModal");
    };

    denyBtn.onclick = function () {
      closeModal(confirmModal);
      openModal(prevGiftModal, "giftModal");
    };

    openModal(confirmModal, "confirmModal", true);

    closeConfirmModal.onclick = function () {
      closeModal(confirmModal);
      openModal(prevGiftModal, "giftModal");
    };

    window.onclick = function (event) {
      if (event.target == confirmModal) {
        closeModal(confirmModal);
      }
    };
  } else {
    if (!link.includes("https://") && !link.includes("http://")) {
      link = "http://" + link;
    }
    window.open(link, "_blank");
  }
}

function generateNotificationString(senderUID, deleterUID, messageGiftTitle, pageNameStr){
  let message;
  message = "\"" + senderUID + "\",,,\"" + deleterUID + "\",,,\"" + messageGiftTitle + "\",,,\"" + pageNameStr + "\"";
  if(consoleOutput)
    console.log("Generating Notification String...");
  return message;
}

function addReviewDays(date, days) {
  const tempDate = new Date(Number(date));
  tempDate.setDate(date.getDate() + days);
  return tempDate;
}

function saveCriticalCookies(){
  let possibleKeys ;
  let possibleValues;
  if (privateUserOverride) {
    possibleKeys = ["privateList", "validUser", "validPrivateUser", "userArr", "giftStorage"];
    possibleValues = [giftUser, giftUser, user, userArr, giftStorage];
  } else {
    possibleKeys = ["validUser", "userArr", "validGiftUser", "familyArr"];
    possibleValues = [user, userArr, giftUser, familyArr];
  }

  for (let i = 0; i < possibleKeys.length; i++) {
    if (possibleValues[i] != undefined)
      sessionStorage.setItem(possibleKeys[i], JSON.stringify(possibleValues[i]));
  }
}

function getLocalTime(UTCTime, shortHand) {
  let localTime;
  let amPMNote;
  let MM;
  let dd;
  let yy;
  let hh;
  let mm;
  let ss;

  if (shortHand == undefined)
    shortHand = false;

  UTCTime = new Date(UTCTime + " UTC");
  UTCTime.toLocaleString();

  dd = UTCTime.getDate() + "";
  yy = UTCTime.getFullYear() + "";
  if (shortHand) {
    MM = UTCTime.getMonth()
    localTime = getMonthName(MM) + " " + dd + ", " + yy;
  } else {
    amPMNote = "AM";
    MM = UTCTime.getMonth() + 1 + "";
    hh = UTCTime.getHours() + "";
    mm = UTCTime.getMinutes() + "";
    ss = UTCTime.getSeconds() + "";

    if (!twentyFourHourTime)
      if (hh >= 12) {
        hh = hh - 12;
        amPMNote = "PM";
        if (hh == 0) {
          hh = 12;
        }
      }

    if (hh.length == 1)
      hh = "0" + hh;
    if (mm.length == 1)
      mm = "0" + mm;
    if (ss.length == 1)
      ss = "0" + ss;
    if (dd.length == 1)
      dd = "0" + dd;
    if (MM.length == 1)
      MM = "0" + MM;
    if (twentyFourHourTime)
      localTime = MM + "/" + dd + "/" + yy + " " + hh + ":" + mm + ":" + ss;
    else
      localTime = MM + "/" + dd + "/" + yy + " " + hh + ":" + mm + ":" + ss + " " + amPMNote;
  }

  return localTime;
}

function cloneArray(inputArr) {
  let outputArr = [];

  if (inputArr != undefined)
    for (let i = 0; i < inputArr.length; i++) {
      outputArr.push(inputArr[i]);
    }

  return outputArr;
}

function backgroundAlternator(){
  let nowBackground = 0;
  let currentBackgroundColor = "#870b0b";
  let transitionTime = "6s";

  try {
    if (JSON.parse(sessionStorage.backgroundAlternatorStep) != undefined)
      backgroundAlternatorStep = JSON.parse(sessionStorage.backgroundAlternatorStep);
    if (JSON.parse(sessionStorage.backgroundAlternatorColor) != undefined)
      currentBackgroundColor = JSON.parse(sessionStorage.backgroundAlternatorColor);
  } catch (err) {}


  setColorOfItem(currentBackgroundColor);
  clearInterval(colorShifter);

  colorShifter = setInterval(function(){
    nowBackground = nowBackground + 1000;
    if(nowBackground >= backgroundAlternatorLimit){
      nowBackground = 0;
      if(backgroundAlternatorStep == 0) {
        backgroundAlternatorStep++;
        setColorOfItem("#0041a3");
      } else if (backgroundAlternatorStep == 1){
        backgroundAlternatorStep++;
        setColorOfItem("#008222");
      } else if (backgroundAlternatorStep == 2){
        backgroundAlternatorStep++;
        setColorOfItem("#0b8781");
      } else if (backgroundAlternatorStep == 3){
        backgroundAlternatorStep++;
        setColorOfItem("#700b87");
      } else {
        backgroundAlternatorStep = 0;
        setColorOfItem("#870b0b");
      }
    }
  }, 1000);

  function setColorOfItem(colorValue) {
    let tempAlternator;
    let tempTimerInt = 0;
    let getElementNav = document.getElementsByClassName("topnav")[0];
    let getElementModalHeader = document.getElementsByClassName("modal-header");
    let getElementModalFooter = document.getElementsByClassName("modal-footer");
    if (getElementNav != undefined) {
      getElementNav.style.background = colorValue;
      if (getElementNav.style.transition != transitionTime) {
        tempAlternator = setInterval(function(){
          tempTimerInt = tempTimerInt + 1000;
          if(tempTimerInt >= 3000){
            getElementNav.style.transition = transitionTime;
            clearInterval(tempAlternator);
          }
        }, 1000);
      }
    } else {
      document.body.style.background = colorValue;
    }
    backgroundAlternatorColor = colorValue;
    try {
      for (let i = 0; i < getElementModalHeader.length; i++) {
        getElementModalHeader[i].style.background = colorValue;
        getElementModalHeader[i].style.transition = transitionTime;
      }
      for (let i = 0; i < getElementModalFooter.length; i++) {
        getElementModalFooter[i].style.background = colorValue;
        getElementModalFooter[i].style.transition = transitionTime;
      }
    } catch (err) {}
  }
}
