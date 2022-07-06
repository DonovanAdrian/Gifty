/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let settingsElements = [];
let listeningFirebaseRefs = [];
let userArr = [];

let allowLogin = false;

let loginDisabledMsg = "";

let editBtn;
let faqBtn;
let modBtn;
let familyBtn;
let moderationModal;
let moderationSpan;
let moderationQueueBtn;
let userListBtn;
let backupBtn;
let loginFxnBtn;
let limitsBtn;
let databaseLimitsModal;
let closeDatabaseLimitsModal;
let giftLimitInp;
let userLimitInp;
let confirmLimits;
let cancelLimits;
let offlineTimer;
let offlineSpan;
let offlineModal;
let inviteNote;
let user;
let notificationModal;
let notificationInfo;
let notificationTitle;
let noteSpan;
let loginInitial;
let limitsInitial;



function getCurrentUser(){
  let localConsoleOutput = false;

  try {
    user = JSON.parse(sessionStorage.validUser);
    if(user.moderatorInt == 1)
      localConsoleOutput = true;
    allowLogin = JSON.parse(sessionStorage.allowLogin);
    if(localConsoleOutput)
      console.log("User: " + user.userName + " loaded in");
    if (user.invites == undefined) {
      if(localConsoleOutput)
        console.log("Invites Not Found");
    } else if (user.invites != undefined) {
      if (user.invites.length > 0) {
        inviteNote.style.background = "#ff3923";
      }
    }
    if (user.friends == undefined) {
      if(localConsoleOutput)
        console.log("Friends Not Found");
    } else if (user.friends != undefined) {
      if (user.friends.length < 100 && user.friends.length > 0) {
        inviteNote.innerHTML = user.friends.length + " Friends";
      }
    }
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
    userArr = JSON.parse(sessionStorage.userArr);
  } catch (err) {
    if(localConsoleOutput)
      console.log(err.toString());
    window.location.href = "index.html";
  }
}

window.onload = function instantiate() {

  pageName = "Settings";
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  inviteNote = document.getElementById('inviteNote');
  editBtn = document.getElementById('edit');
  faqBtn = document.getElementById('faq');
  modBtn = document.getElementById('mod');
  familyBtn = document.getElementById('family');
  moderationModal = document.getElementById('moderationModal');
  moderationSpan = document.getElementById('moderationSpan');
  moderationQueueBtn = document.getElementById('moderationQueueBtn');
  userListBtn = document.getElementById('userListBtn');
  backupBtn = document.getElementById('backupBtn');
  loginFxnBtn = document.getElementById('loginFxnBtn');
  limitsBtn = document.getElementById('limitsBtn');
  databaseLimitsModal = document.getElementById('databaseLimitsModal');
  closeDatabaseLimitsModal = document.getElementById('closeDatabaseLimitsModal');
  giftLimitInp = document.getElementById('giftLimitInp');
  userLimitInp = document.getElementById('userLimitInp');
  confirmLimits = document.getElementById('confirmLimits');
  cancelLimits = document.getElementById('cancelLimits');
  notificationModal = document.getElementById('notificationModal');
  notificationTitle = document.getElementById('notificationTitle');
  notificationInfo = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  settingsElements = [offlineModal, offlineSpan, inviteNote, editBtn, faqBtn, modBtn, familyBtn, moderationModal,
    moderationSpan, moderationQueueBtn, userListBtn, backupBtn, loginFxnBtn, limitsBtn, databaseLimitsModal,
    closeDatabaseLimitsModal, giftLimitInp, userLimitInp, confirmLimits, cancelLimits, notificationModal,
    notificationTitle, notificationInfo, noteSpan];
  getCurrentUser();
  commonInitialization();
  verifyElementIntegrity(settingsElements);

  editBtn.onclick = function (){
    navigation(13);//UserAddUpdate
  };

  faqBtn.onclick = function (){
    navigation(12);//FAQ
  };

  if (user.moderatorInt == 1) {
    databaseQuery();

    function databaseQuery() {
      loginInitial = firebase.database().ref("login/");
      limitsInitial = firebase.database().ref("limits/");

      let fetchLogin = function (postRef) {
        postRef.on('child_added', function (data) {
          if (data.key == "allowLogin") {
            allowLogin = data.val();
          } else if (data.key == "loginDisabledMsg") {
            loginDisabledMsg = data.val();
          }
        });

        postRef.on('child_changed', function (data) {
          if (data.key == "allowLogin") {
            allowLogin = data.val();
          } else if (data.key == "loginDisabledMsg") {
            loginDisabledMsg = data.val();
          }
        });

        postRef.on('child_removed', function (data) {
          if (data.key == "allowLogin") {
            allowLogin = true;
          } else if (data.key == "loginDisabledMsg") {
            loginDisabledMsg = "";
          }
        });
      };

      let fetchLimits = function (postRef) {
        postRef.on('child_added', function (data) {
          if (data.key == "userLimit") {
            userLimit = data.val();
          } else if (data.key == "giftLimit") {
            giftLimit = data.val();
          }
        });

        postRef.on('child_changed', function (data) {
          if (data.key == "userLimit") {
            userLimit = data.val();
          } else if (data.key == "giftLimit") {
            giftLimit = data.val();
          }
        });

        postRef.on('child_removed', function (data) {
          if (data.key == "userLimit") {
            userLimit = 50;
          } else if (data.key == "giftLimit") {
            giftLimit = 100;
          }
        });
      };

      fetchLogin(loginInitial);
      fetchLimits(limitsInitial);

      listeningFirebaseRefs.push(loginInitial);
      listeningFirebaseRefs.push(limitsInitial);
    }
  }
};

function generateModerationModal(){
  if(allowLogin) {
    loginFxnBtn.innerHTML = "Disable Login Function";
  } else {
    loginFxnBtn.innerHTML = "Enable Login Function";
  }

  userListBtn.onclick = function(){
    navigation(14);//Moderation
  };

  moderationQueueBtn.onclick = function(){
    navigation(17);//ModerationQueue
  };

  backupBtn.onclick = function() {
    navigation(18);//Backups
  };

  limitsBtn.onclick = function() {
    generateLimitsModal();
  };


  loginFxnBtn.onclick = function(){
    if (allowLogin) {
      loginFxnBtn.innerHTML = "Enable Login Function";
      firebase.database().ref("login/").update({
        allowLogin: false,
        loginDisabledMsg: "Gifty is currently down for maintenance. Please wait for a moderator to finish " +
          "maintenance before logging in. Thank you for your patience!"
      });
    } else {
      loginFxnBtn.innerHTML = "Disable Login Function";
      firebase.database().ref("login/").update({
        allowLogin: true,
        loginDisabledMsg: "Gifty is currently down for maintenance. Please wait for a moderator to finish " +
          "maintenance before logging in. Thank you for your patience!"
      });
    }
  };

  moderationSpan.onclick = function(){
    closeModal(moderationModal);
  };

  openModal(moderationModal, "moderationModal");
}

function generateLimitsModal() {
  closeModal(moderationModal);
  let invalidChars = ['+', '-', 'e'];

  giftLimitInp.value = giftLimit;
  userLimitInp.value = userLimit;

  confirmLimits.onclick = function (){
    if (giftLimitInp.value == "" && userLimitInp.value == "") {
      alert("Please Do Not Enter Invalid Characters!");
    } else if (!isNaN(giftLimitInp.value) && !isNaN(userLimitInp.value)) {

      firebase.database().ref("limits/").update({
        giftLimit: giftLimitInp.value,
        userLimit: userLimitInp.value
      });

      alert("Database Limits Successfully Set!");

      closeModal(databaseLimitsModal);
      openModal(moderationModal, "moderationModal");
    } else {
      alert("Please Only Enter Numbers Into The Fields!");
    }
  }

  cancelLimits.onclick = function(){
    closeModal(databaseLimitsModal);
    openModal(moderationModal, "moderationModal");
  };

  closeDatabaseLimitsModal.onclick = function(){
    closeModal(databaseLimitsModal);
    openModal(moderationModal, "moderationModal");
  };

  window.onclick = function (event) {
    if (event.target == databaseLimitsModal) {
      closeModal(databaseLimitsModal);
      openModal(moderationModal, "moderationModal");
    }
  }

  openModal(databaseLimitsModal, "databaseLimitsModal", true);
}
