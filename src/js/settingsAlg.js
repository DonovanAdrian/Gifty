/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let settingsElements = [];
let listeningFirebaseRefs = [];
let inviteArr = [];
let userArr = [];

let settingsUserScore = 0;
let settingsUserScoreLimit = 10;

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
let modBtn;
let familyBtn;
let moderationModal;
let moderationSpan;
let moderationQueueBtn;
let userListBtn;
let backupBtn;
let offlineTimer;
let offlineSpan;
let offlineModal;
let inviteNote;
let user;
let notificationModal;
let notificationInfo;
let notificationTitle;
let noteSpan;
let userBase;
let userInvites;



function getCurrentUser(){
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
  pageName = "Settings";
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  inviteNote = document.getElementById('inviteNote');
  usernameInfo = document.getElementById('usernameInfo');
  usernameDisplay = document.getElementById('usernameDisplay');
  nameInfo = document.getElementById('nameInfo');
  nameDisplay = document.getElementById('nameDisplay');
  shareCodeInfo = document.getElementById('shareCodeInfo');
  shareCodeDisplay = document.getElementById('shareCodeDisplay');
  userScoreInfo = document.getElementById('userScoreInfo');
  userScoreDisplay = document.getElementById('userScoreDisplay');
  editBtn = document.getElementById('edit');
  faqBtn = document.getElementById('faq');
  modBtn = document.getElementById('mod');
  familyBtn = document.getElementById('family');
  moderationModal = document.getElementById('moderationModal');
  moderationSpan = document.getElementById('moderationSpan');
  moderationQueueBtn = document.getElementById('moderationQueueBtn');
  userListBtn = document.getElementById('userListBtn');
  backupBtn = document.getElementById('backupBtn');
  notificationModal = document.getElementById('notificationModal');
  notificationTitle = document.getElementById('notificationTitle');
  notificationInfo = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  settingsElements = [offlineModal, offlineSpan, inviteNote, usernameInfo, usernameDisplay, nameInfo, nameDisplay,
    shareCodeInfo, shareCodeDisplay, userScoreInfo, userScoreDisplay, editBtn, faqBtn, modBtn, familyBtn,
    moderationModal, moderationSpan, moderationQueueBtn, userListBtn, backupBtn, notificationModal, notificationTitle,
    notificationInfo, noteSpan];

  getCurrentUser();
  commonInitialization();
  verifyElementIntegrity(settingsElements);

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

    if (user.settingsScoreBlock == null) {
      user.settingsScoreBlock = 0;
    }

    if (settingsUserScore < settingsUserScoreLimit && user.settingsScoreBlock == 0) {
      settingsUserScore++;

      if (settingsUserScore == settingsUserScoreLimit) {
        extraText = "<br\><br\><br\>...NOW you've done it! No more points for you! >:(";
        updateUserScore(true);
      } else if (settingsUserScore >= 7) {
        extraText = "<br\><br\><br\>...Don't get greedy now!";
        updateUserScore(false);
      } else if (settingsUserScore >= 5) {
        extraText = "<br\><br\><br\>...Yes... You can click on these text icons to get more points!";
        updateUserScore(false);
      } else {
        updateUserScore(false);
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
        console.log("Unknown Input Data Item..." + extraText);
        break;
    }
  }

  function updateUserScore(limitHit){
    let currentUserScore;

    if (user.settingsScoreBlock == 0) {
      if (user.userScore == null) {
        user.userScore = 0;
      }

      user.userScore = user.userScore + 1;
      currentUserScore = user.userScore;

      firebase.database().ref("users/" + user.uid).update({
        userScore: currentUserScore,
        settingsScoreBlock: user.settingsScoreBlock
      });
    } else if (limitHit) {
      firebase.database().ref("users/" + user.uid).update({
        settingsScoreBlock: 1
      });
    }
  }

  initializeEditBtn();
  initializeFAQBtn();
  initializeUserInfo();

  userBase = firebase.database().ref("users/");
  userInvites = firebase.database().ref("users/" + user.uid + "/invites");

  databaseQuery();

  function databaseQuery() {
    let fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
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
          }
        } else {
          userArr.push(data.val());

          if (data.key == user.uid) {
            user = data.val();
            updateFriendNav(user.friends);
            updateSettingsUserData();
          }
        }
      });

      postRef.on('child_changed', function (data) {
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
          }
        }
      });

      postRef.on('child_removed', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if (i != -1) {
          if(consoleOutput)
            console.log("Removing " + userArr[i].userName + " / " + data.val().userName);
          userArr.splice(i, 1);
        }
      });
    };

    let fetchInvites = function (postRef) {
      postRef.on('child_added', function (data) {
        inviteArr.push(data.val());
        inviteNote.style.background = "#ff3923";
      });

      postRef.on('child_changed', function (data) {
        inviteArr[data.key] = data.val();
      });

      postRef.on('child_removed', function (data) {
        inviteArr.splice(data.key, 1);

        if (inviteArr.length == 0) {
          if (consoleOutput)
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

  let targetNode = document.getElementById('moderationModal');
  let observer = new MutationObserver(function(){
    if(targetNode.style.display != 'none' && user.moderatorInt != 1){
      updateMaintenanceLog("settings", "The user \"" + user.userName + "\" " +
          "forced the moderation modal to appear. Functionality and button text is NOT available to the user when forced " +
          "open, but please advise.");
    }
  });
  observer.observe(targetNode, { attributes: true, childList: true });
};

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
  moderationQueueBtn.innerHTML = "System Audit Log";
  userListBtn.innerHTML = "User List & Database Settings";
  backupBtn.innerHTML = "Backups";

  userListBtn.onclick = function(){
    navigation(14);//Moderation
  };

  moderationQueueBtn.onclick = function(){
    navigation(17);//ModerationQueue
  };

  backupBtn.onclick = function() {
    navigation(18);//Backups
  };

  moderationSpan.onclick = function(){
    closeModal(moderationModal);
  };

  openModal(moderationModal, "moderationModal");
}
