/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let settingsElements = [];
let listeningFirebaseRefs = [];
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

    if (settingsUserScore < settingsUserScoreLimit) {
      settingsUserScore++;

      if (settingsUserScore == settingsUserScoreLimit) {
        extraText = "\n\n\n...NOW you've done it! No more points for you! >:(";
      } else if (settingsUserScore >= 7) {
        extraText = "\n\n\n...Don't get greedy now!";
        updateUserScore();
      } else if (settingsUserScore >= 5) {
        extraText = "\n\n\n...Yes... You can click on these text icons to get more points!";
        updateUserScore();
      } else {
        updateUserScore();
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

  function updateUserScore(){
    let currentUserScore;

    if (user.userScore == null) {
      user.userScore = 0;
    }

    user.userScore = user.userScore + 1;
    currentUserScore = user.userScore;

    userScoreDisplay.innerHTML = user.userScore;
    firebase.database().ref("users/" + user.uid).update({userScore: currentUserScore});
  }

  initializeEditBtn();
  initializeFAQBtn();
  initializeUserInfo();

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
