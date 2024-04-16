/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let settingsElements = [];
let ticketArr = [];

let settingsUserScore = 0;
let settingsUserScoreLimit = 10;

let initializedDatabaseCheck = false;

let localListedUserData;
let usernameInfo;
let usernameDisplay;
let nameInfo;
let nameDisplay;
let shareCodeInfo;
let shareCodeDisplay;
let userScoreInfo;
let userScoreDisplay;
let editBtn;
let faqBtn;
let tutorialBtn;
let giftyVersionIdentifier;
let giftyCopyrightIdentifier;
let modBtn;
let familyBtn;
let moderationModal;
let moderationSpan;
let moderationQueueBtn;
let userListBtn;



function getCurrentUser(){
  failedNavNum = 5;
  getCurrentUserCommon();

  if (user.moderatorInt == 1) {
    modBtn.style.display = "block";
    modBtn.onclick = function () {
      generateModerationModal();
    };

    familyBtn.style.display = "block";
    familyBtn.onclick = function () {
      navigation(15);//Family
    };
  }

  allowLogin = JSON.parse(sessionStorage.allowLogin);
}

window.onload = function instantiate() {
  try {
    pageName = "Settings";
    inviteNote = document.getElementById("inviteNote");
    usernameInfo = document.getElementById("usernameInfo");
    usernameDisplay = document.getElementById("usernameDisplay");
    nameInfo = document.getElementById("nameInfo");
    nameDisplay = document.getElementById("nameDisplay");
    shareCodeInfo = document.getElementById("shareCodeInfo");
    shareCodeDisplay = document.getElementById("shareCodeDisplay");
    userScoreInfo = document.getElementById("userScoreInfo");
    userScoreDisplay = document.getElementById("userScoreDisplay");
    editBtn = document.getElementById("editBtn");
    faqBtn = document.getElementById("faqBtn");
    tutorialBtn = document.getElementById("tutorialBtn");
    giftyVersionIdentifier = document.getElementById("giftyVersionIdentifier");
    giftyCopyrightIdentifier = document.getElementById("giftyCopyrightIdentifier");
    modBtn = document.getElementById("modBtn");
    familyBtn = document.getElementById("familyBtn");
    moderationModal = document.getElementById("moderationModal");
    moderationSpan = document.getElementById("moderationSpan");
    moderationQueueBtn = document.getElementById("moderationQueueBtn");
    userListBtn = document.getElementById("userListBtn");

    getCurrentUser();
    commonInitialization();

    settingsElements = [offlineModal, offlineSpan, inviteNote, usernameInfo, usernameDisplay, nameInfo, nameDisplay,
      shareCodeInfo, shareCodeDisplay, userScoreInfo, userScoreDisplay, editBtn, faqBtn, tutorialBtn, modBtn, familyBtn,
      moderationModal, moderationSpan, moderationQueueBtn, userListBtn, notificationModal, notificationTitle,
      notificationInfo, noteSpan];

    verifyElementIntegrity(settingsElements);

    giftyVersionIdentifier.innerHTML = "Version: " + giftyVersion;
    giftyCopyrightIdentifier.innerHTML = "©Donovan Adrian 2024";

    initializeEditBtn();
    initializeFAQBtn();
    initializeTutorialBtn();
    initializeUserInfo();
    initializeFamilyDBCheck();

    userInitial = firebase.database().ref("users/");
    userInvites = firebase.database().ref("users/" + user.uid + "/invites");

    databaseQuery();
  } catch (err) {
    sendCriticalInitializationError(err);
  }

  function databaseQuery() {
    let fetchData = function (postRef) {
      postRef.on("child_added", function (data) {
        clearInterval(commonLoadingTimer);
        clearInterval(offlineTimer);
        let i = findUIDItemInArr(data.key, userArr, true);
        if (i != -1) {
          localObjectChanges = findObjectChanges(userArr[i], data.val());
          if (localObjectChanges.length != 0) {
            userArr[i] = data.val();

            if (data.key == user.uid) {
              user = data.val();
              updateFriendNav(user.friends);
              updateSettingsUserData();
            }
            saveCriticalCookies();
          }
        } else {
          userArr.push(data.val());

          if (data.key == user.uid) {
            user = data.val();
            updateFriendNav(user.friends);
            updateSettingsUserData();
          }
          saveCriticalCookies();
        }
      });

      postRef.on("child_changed", function (data) {
        let i = findUIDItemInArr(data.key, userArr, true);
        if (i != -1) {
          localObjectChanges = findObjectChanges(userArr[i], data.val());
          if (localObjectChanges.length != 0) {
            userArr[i] = data.val();

            if(data.key == user.uid){
              user = data.val();
              updateFriendNav(user.friends);
              updateSettingsUserData();
              if(consoleOutput)
                console.log("Current User Updated");
            }
            saveCriticalCookies();
          }
        }
      });

      postRef.on("child_removed", function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if (i != -1) {
          if(consoleOutput)
            console.log("Removing " + userArr[i].userName + " / " + data.val().userName);
          userArr.splice(i, 1);
          saveCriticalCookies();
        }
      });
    };

    let fetchInvites = function (postRef) {
      postRef.on("child_added", function (data) {
        inviteArr.push(data.val());
        inviteNote.style.background = "#ff3923";
      });

      postRef.on("child_changed", function (data) {
        inviteArr[data.key] = data.val();
      });

      postRef.on("child_removed", function (data) {
        inviteArr.splice(data.key, 1);

        if (inviteArr.length == 0) {
          if (consoleOutput)
            console.log("Invite List Removed");
          inviteNote.style.background = "#008222";
        }
      });
    };

    fetchData(userInitial);
    fetchInvites(userInvites);
    listeningFirebaseRefs.push(userInitial);
    listeningFirebaseRefs.push(userInvites);
  }

  let targetNode = document.getElementById("moderationModal");
  let observer = new MutationObserver(function(){
    if(targetNode.style.display != "none" && user.moderatorInt != 1){
      updateMaintenanceLog("settings", "The user \"" + user.userName + "\" (" + user.uid + ") " +
          "forced the moderation modal to appear. Functionality and button text is NOT available to the user when forced " +
          "open, but please advise.");
    }
  });
  observer.observe(targetNode, { attributes: true, childList: true });
};

function initializeEditBtn() {
  editBtn.onclick = function () {
    navigation(13, false);//UserAddUpdate
  };
}

function initializeFAQBtn() {
  faqBtn.onclick = function (){
    navigation(12);//FAQ
  };
}

function initializeTutorialBtn() {
  tutorialBtn.onclick = function (){
    navigation(18);//Tutorial
  }
}

function initializeUserInfo() {
  updateSettingsUserData();

  usernameInfo.onclick = function() {displayUserDataAlert(0)};
  usernameDisplay.onclick = function() {displayUserDataAlert(0)};
  nameInfo.onclick = function() {displayUserDataAlert(1)};
  nameDisplay.onclick = function() {displayUserDataAlert(1)};
  shareCodeInfo.onclick = function() {displayUserDataAlert(2)};
  shareCodeDisplay.onclick = function() {displayUserDataAlert(2)};
  userScoreInfo.onclick = function() {displayUserDataAlert(3)};
  userScoreDisplay.onclick = function() {displayUserDataAlert(3)};
}

function displayUserDataAlert(userDataItem) {
  let extraText = "";

  if (user.settingsScoreBlock == undefined) {
    user.settingsScoreBlock = 0;
  }

  if (settingsUserScore < settingsUserScoreLimit && user.settingsScoreBlock == 0 && settingsEasterEggScore != 0) {
    settingsUserScore++;

    if (settingsUserScore == settingsUserScoreLimit) {
      extraText = "<br\><br\><br\>...NOW you've done it! No more points for you! >:(";
      updateMaintenanceLog(pageName, "The user, \"" + user.userName + "\", found an easter egg... But got greedy :(" +
          "  Their ability to obtain user score points through this easter egg has been disabled!");
      updateUserScore(user,settingsEasterEggScore, true);
    } else if (settingsUserScore >= 7) {
      extraText = "<br\><br\><br\>...Don't get greedy now!";
      updateUserScore(user,settingsEasterEggScore, false);
    } else if (settingsUserScore >= 5) {
      extraText = "<br\><br\><br\>...Yes... You can click on these text icons to get more points!";
      updateMaintenanceLog(pageName, "The user, \"" + user.userName + "\" found an easter egg!");
      updateUserScore(user, settingsEasterEggScore, false);
    } else {
      updateUserScore(user, settingsEasterEggScore, false);
    }
  }

  switch (userDataItem) {
    case 0:
      deployNotificationModal(false, "Your Username!", "This is your Username! Other people can use this to invite you to see their list!" + extraText);
      break;
    case 1:
      deployNotificationModal(false, "Your Name!", "This is your Name! This is what other people will see when they look at your list and when you buy gifts." + extraText);
      break;
    case 2:
      deployNotificationModal(false, "Your Share Code!", "This is your Share Code! Other people can use this to invite you to see their list!" + extraText);
      break;
    case 3:
      deployNotificationModal(false, "Your User Score!", "This is your User Score! This is an arbitrary number that shows how active you are on Gifty!" + extraText);
      break;
    default:
      if (consoleOutput)
        console.log("Unknown Input Data Item..." + extraText);
      break;
  }
}

function initializeFamilyDBCheck(){
  if (user.moderatorInt == 1) {
    familyInitial = firebase.database().ref("family/");

    let fetchFamilies = function (postRef){
      postRef.once("value").then(function(snapshot) {
        if (snapshot.exists()) {
          postRef.on("child_added", function (data) {
            let i = findUIDItemInArr(data.val().uid, familyArr, true);
            if (i == -1) {
              familyArr.push(data.val());
              saveCriticalCookies();
            } else {
              localObjectChanges = findObjectChanges(familyArr[i], data.val());
              if (localObjectChanges.length != 0) {
                familyArr[i] = data.val();
                saveCriticalCookies();
              }
            }
          });

          postRef.on("child_changed", function (data) {
            let i = findUIDItemInArr(data.key, familyArr);
            if (i != -1) {
              localObjectChanges = findObjectChanges(familyArr[i], data.val());
              if (localObjectChanges.length != 0) {
                familyArr[i] = data.val();
                saveCriticalCookies();
              }
            }
          });

          postRef.on("child_removed", function (data) {
            let i = findUIDItemInArr(data.key, familyArr);
            if (i != -1) {
              familyArr.splice(i, 1);
              saveCriticalCookies();
            }
          });
        }
      });
    };

    fetchFamilies(familyInitial);

    listeningFirebaseRefs.push(familyInitial);
  }
}

function updateSettingsUserData() {
  usernameDisplay.innerHTML = user.userName;
  nameDisplay.innerHTML = user.name;
  if (user.shareCode != null)
    shareCodeDisplay.innerHTML = user.shareCode;
  else
    shareCodeDisplay.innerHTML = "You do not have a share code...";
  if (user.userScore != null)
    userScoreDisplay.innerHTML = user.userScore;
  else
    userScoreDisplay.innerHTML = "You do not have a user score...";
}

function generateModerationModal(){
  queryModeratorData();

  moderationQueueBtn.innerHTML = "System Audit Log";
  userListBtn.innerHTML = "User List & Database Settings";

  userListBtn.onclick = function(){
    navigation(14);//Moderation
  };

  moderationQueueBtn.onclick = function(){
    navigation(17);//ModerationQueue
  };

  moderationSpan.onclick = function(){
    closeModal(moderationModal);
  };

  openModal(moderationModal, "moderationModal");
}

function queryModeratorData() {
  moderationTickets = firebase.database().ref("maintenance/");
  moderatorSettings = firebase.database().ref("moderatorSettings/");

  let fetchModerationQueue = function (postRef) {
    postRef.once("value").then(function(snapshot) {
      if (snapshot.exists() || initializedDatabaseCheck) {
        postRef.on("child_added", function (data) {
          let i = findUIDItemInArr(data.key, ticketArr, true);
          if(i != -1) {
            localObjectChanges = findObjectChanges(ticketArr[i], data.val());
            if (localObjectChanges.length != 0) {
              if (consoleOutput)
                console.log("Changing " + ticketArr[i].uid);
              ticketArr[i] = data.val();
              saveTicketArrToCookie();
            }
          } else {
            ticketArr.push(data.val());
            saveTicketArrToCookie();
          }
        });

        postRef.on("child_changed", function (data) {
          let i = findUIDItemInArr(data.key, ticketArr, true);
          if(i != -1){
            localObjectChanges = findObjectChanges(ticketArr[i], data.val());
            if (localObjectChanges.length != 0) {
              if (consoleOutput)
                console.log("Changing " + ticketArr[i].uid);
              ticketArr[i] = data.val();
              saveTicketArrToCookie();
            }
          }
        });

        postRef.on("child_removed", function (data) {
          let i = findUIDItemInArr(data.key, ticketArr);
          if(i != -1){
            if (consoleOutput)
              console.log("Removing " + ticketArr[i].uid);
            ticketArr.splice(i, 1);
            saveTicketArrToCookie();
          }
        });
      } else {
        ticketArr = [];
        saveTicketArrToCookie();
        initializedDatabaseCheck = true;
        fetchModerationQueue(moderationTickets);
      }
    });
  };

  let fetchModeratorSettings = function (postRef) {
    postRef.once("value").then(function(snapshot) {
      if(snapshot.exists()) {
        if (consoleOutput)
          console.log("Moderator Settings Snapshot Exists!");
        postRef.on("child_added", function (data) {
          if (consoleOutput)
            console.log(data.key + " added");

          if (data.key == "listedUserData") {
            localListedUserData = data.val();
            saveListedUserDataToCookie();
          }
        });

        postRef.on("child_changed", function (data) {
          if (consoleOutput)
            console.log(data.key + " changed");

          if (data.key == "listedUserData") {
            localListedUserData = data.val();
            saveListedUserDataToCookie();
          }
        });

        postRef.on("child_removed", function (data) {
          if (consoleOutput)
            console.log(data.key + " removed!");

          firebase.database().ref("moderatorSettings/").update({
            listedUserData: "None"
          });
        });
      }
    });
  };

  fetchModeratorSettings(moderatorSettings);
  fetchModerationQueue(moderationTickets);

  listeningFirebaseRefs.push(moderatorSettings);
  listeningFirebaseRefs.push(moderationTickets);
}

function saveListedUserDataToCookie() {
  sessionStorage.setItem("localListedUserData", JSON.stringify(localListedUserData));
}


function saveTicketArrToCookie(){
  sessionStorage.setItem("ticketArr", JSON.stringify(ticketArr));
}
