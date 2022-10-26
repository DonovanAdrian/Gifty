/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let moderationElements = [];
let listeningFirebaseRefs = [];
let inviteArr = [];
let userArr = [];
let familyArr = [];
let initializedUsers = [];

let secretSantaAssignErrorMsg = "try again or look at the console for more details!";

let moderationSet = 1;
let dataCounter = 0;
let globalNoteInt = 0;
let commonLoadingTimerInt = 0;
let giftLimit = 0;
let userLimit = 0;

let secretSantaInit = false;

let allowLogin = null;

let loginDisabledMsg = "";
let giftURLLimit = "";

let dataListContainer;
let offlineSpan;
let offlineModal;
let privateMessageModal;
let sendGlobalNotification;
let nukeAllUserNotifications;
let nukeAllUserScores;
let loginFxnBtn;
let giftLinkBtn;
let limitsBtn;
let databaseLimitsModal;
let closeDatabaseLimitsModal;
let giftLimitInp;
let userLimitInp;
let confirmLimits;
let cancelLimits;
let loginDisabledModal;
let loginDisabledTitle;
let closeLoginDisabledModal;
let loginDisabledDesc;
let loginDisabledInp;
let loginDisabledInfo;
let resetDefaultLoginDisabledBtn;
let confirmLoginDisabled;
let cancelLoginDisabled;
let userListDropDown;
let showNone;
let showUID;
let showName;
let showLastLogin;
let showUserScore;
let showShareCode;
let showFriends;
let showSantaSignUp;
let showModerator;
let user;
let localListedUserData;
let offlineTimer;
let commonLoadingTimer;
let userModal;
let notificationModal;
let notificationInfo;
let notificationTitle;
let noteSpan;
let inviteNote;
let userInitial;
let userInvites;
let autoSecretSanta;
let moderatorSettings;
let familyInitial;
let userOptionsBtn;
let secretSantaModal;
let santaModalSpan;
let secretSantaBtn;
let secretSantaShuffle;
let secretSantaAutoBtn;
let settingsNote;
let testData;
let closeUserModal;
let userName;
let userUID;
let userUserName;
let userGifts;
let userPrivateGifts;
let userFriends;
let userLastLogin;
let userScore;
let userPassword;
let userSecretSanta;
let moderatorOp;
let sendPrivateMessage;
let warnUser;
let banUser;
let closePrivateMessageModal;
let globalMsgTitle;
let globalMsgInp;
let sendMsg;
let cancelMsg;
let loginInitial;
let limitsInitial;



window.onload = function instantiate() {
  pageName = "Moderation";
  dataListContainer = document.getElementById('dataListContainer');
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  inviteNote = document.getElementById('inviteNote');
  notificationModal = document.getElementById('notificationModal');
  notificationTitle = document.getElementById('notificationTitle');
  notificationInfo = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  privateMessageModal = document.getElementById('privateMessageModal');
  sendGlobalNotification = document.getElementById('sendGlobalNotification');
  nukeAllUserNotifications = document.getElementById('nukeAllUserNotifications');
  nukeAllUserScores = document.getElementById('nukeAllUserScores');
  loginFxnBtn = document.getElementById('loginFxnBtn');
  giftLinkBtn = document.getElementById('giftLinkBtn');
  limitsBtn = document.getElementById('limitsBtn');
  databaseLimitsModal = document.getElementById('databaseLimitsModal');
  closeDatabaseLimitsModal = document.getElementById('closeDatabaseLimitsModal');
  giftLimitInp = document.getElementById('giftLimitInp');
  userLimitInp = document.getElementById('userLimitInp');
  confirmLimits = document.getElementById('confirmLimits');
  cancelLimits = document.getElementById('cancelLimits');
  loginDisabledModal = document.getElementById('loginDisabledModal');
  loginDisabledTitle = document.getElementById('loginDisabledTitle');
  closeLoginDisabledModal = document.getElementById('closeLoginDisabledModal');
  loginDisabledDesc = document.getElementById('loginDisabledDesc');
  loginDisabledInp = document.getElementById('loginDisabledInp');
  loginDisabledInfo = document.getElementById('loginDisabledInfo');
  resetDefaultLoginDisabledBtn = document.getElementById('resetDefaultLoginDisabledBtn');
  confirmLoginDisabled = document.getElementById('confirmLoginDisabled');
  cancelLoginDisabled = document.getElementById('cancelLoginDisabled');
  userListDropDown = document.getElementById('userListDropDown');
  showNone = document.getElementById('showNone');
  showUID = document.getElementById('showUID');
  showName = document.getElementById('showName');
  showLastLogin = document.getElementById('showLastLogin');
  showUserScore = document.getElementById('showUserScore');
  showShareCode = document.getElementById('showShareCode');
  showFriends = document.getElementById('showFriends');
  showSantaSignUp = document.getElementById('showSantaSignUp');
  showModerator = document.getElementById('showModerator');
  sendPrivateMessage = document.getElementById('sendPrivateMessage');
  userModal = document.getElementById('userModal');
  userOptionsBtn = document.getElementById('userOptionsBtn');
  secretSantaModal = document.getElementById('santaModal');
  santaModalSpan = document.getElementById('secretSantaSpan');
  secretSantaBtn = document.getElementById('secretSantaBtn');
  secretSantaShuffle = document.getElementById('secretSantaShuffle');
  secretSantaAutoBtn = document.getElementById('secretSantaAutoBtn');
  settingsNote = document.getElementById('settingsNote');
  testData = document.getElementById('testData');
  closeUserModal = document.getElementById('closeUserModal');
  userName = document.getElementById('userName');
  userUID = document.getElementById('userUID');
  userUserName = document.getElementById('userUserName');
  userGifts = document.getElementById('userGifts');
  userPrivateGifts = document.getElementById('userPrivateGifts');
  userFriends = document.getElementById('userFriends');
  userLastLogin = document.getElementById('userLastLogin');
  userScore = document.getElementById('userScore');
  userPassword = document.getElementById('userPassword');
  userSecretSanta = document.getElementById('userSecretSanta');
  moderatorOp = document.getElementById('moderatorOp');
  sendPrivateMessage = document.getElementById('sendPrivateMessage');
  warnUser = document.getElementById('warnUser');
  banUser = document.getElementById('banUser');
  closePrivateMessageModal = document.getElementById('closePrivateMessageModal');
  globalMsgTitle = document.getElementById('globalMsgTitle');
  globalMsgInp = document.getElementById('globalMsgInp');
  sendMsg = document.getElementById('sendMsg');
  cancelMsg = document.getElementById('cancelMsg');
  moderationElements = [dataListContainer, offlineModal, offlineSpan, inviteNote, notificationModal, notificationTitle,
    notificationInfo, noteSpan, privateMessageModal, sendGlobalNotification, nukeAllUserNotifications,
    nukeAllUserScores, loginFxnBtn, giftLinkBtn, limitsBtn, databaseLimitsModal, closeDatabaseLimitsModal, giftLimitInp,
    userLimitInp, confirmLimits, cancelLimits, loginDisabledModal, loginDisabledTitle, closeLoginDisabledModal,
    loginDisabledDesc, loginDisabledInp, loginDisabledInfo, resetDefaultLoginDisabledBtn, confirmLoginDisabled,
    cancelLoginDisabled, userListDropDown, showNone, showUID, showName, showLastLogin, showUserScore, showShareCode,
    showFriends, showSantaSignUp, showModerator, sendPrivateMessage, userModal, userOptionsBtn, secretSantaModal,
    santaModalSpan, secretSantaBtn, secretSantaShuffle, secretSantaAutoBtn, settingsNote, testData, closeUserModal,
    userName, userUID, userUserName, userGifts, userPrivateGifts, userFriends, userLastLogin, userScore, userPassword,
    userSecretSanta, moderatorOp, sendPrivateMessage, warnUser, banUser, closePrivateMessageModal, globalMsgTitle,
    globalMsgInp, sendMsg, cancelMsg];

  sessionStorage.setItem("moderationSet", moderationSet);
  getCurrentUserCommon();
  commonInitialization();
  verifyElementIntegrity(moderationElements);

  userInitial = firebase.database().ref("users/");
  userInvites = firebase.database().ref("users/" + user.uid + "/invites");
  autoSecretSanta = firebase.database().ref("secretSanta/");
  moderatorSettings = firebase.database().ref("moderatorSettings/");
  familyInitial = firebase.database().ref("family/");
  loginInitial = firebase.database().ref("login/");
  limitsInitial = firebase.database().ref("limits/");

  databaseQuery();
  alternateButtonLabel(settingsNote, "Settings", "Moderation");
  generateUserOptionsModal();
  userOptionsBtn.innerHTML = "User Options";

  function initializeBackBtn() {
    backBtn.innerHTML = "Return To Settings";
    backBtn.onclick = function() {
      navigation(5);
    };
  }

  initializeBackBtn();

  function generatePrivateMessageDialog(userData, warnBool) {
    let warnCount;
    if (warnBool) {
      globalMsgTitle.innerHTML = "Send A Warning Message Below";
      globalMsgInp.placeholder = "Your next offense will result in a ban...";
    } else {
      globalMsgTitle.innerHTML = "Send A Private Message Below";
      globalMsgInp.placeholder = "Hey! Just to let you know...";
    }

    sendMsg.onclick = function (){
      if(globalMsgInp.value.includes(",,,")){
        deployNotificationModal(true, "Message Error!", "Please do not use commas " +
          "in the message. Thank you!");
      } else {
        addPrivateMessageToDB(userData, globalMsgInp.value);
        globalMsgInp.value = "";
        closeModal(privateMessageModal);
        if (warnBool) {
          warnCount = userData.warn;
          warnCount = warnCount + 1;
          firebase.database().ref("users/" + userData.uid).update({
            warn: warnCount
          });
          deployNotificationModal(false, "Warning Sent!", userData.name +
            " Has Been Warned! Once The User Reads The Warning, Their Warning Will Be Removed.",
            false, 4);
        } else {
          deployNotificationModal(false, "Message Sent!",
            "The Private Message Has Been Sent!");
        }
      }
    };
    cancelMsg.onclick = function (){
      globalMsgInp.value = "";
      closeModal(privateMessageModal);
    };

    openModal(privateMessageModal, "addGlobalMsgModal");

    closePrivateMessageModal.onclick = function() {
      closeModal(privateMessageModal);
    };
  }

  function addPrivateMessageToDB(userData, message) {
    let userNotificationArr = [];
    if(userData.notifications == undefined){
      userNotificationArr = [];
    } else {
      userNotificationArr = userData.notifications;
    }
    message = generateNotificationString(">admin" + user.uid, "", message, "");
    userNotificationArr.push(message);

    if(userData.notifications == undefined) {
      firebase.database().ref("users/" + userData.uid).update({notifications:{0:message}});
    } else {
      firebase.database().ref("users/" + userData.uid).update({
        notifications: userNotificationArr
      });
    }
  }

  function initializeShowUserData(showDataSelection) {
    let listOfShowUserElements = [showNone, showUID, showName, showLastLogin, showUserScore, showShareCode, showFriends,
      showSantaSignUp, showModerator];
    let showHideUserDataBool = false;

    userListDropDown.innerHTML = "Select Listed User Data (" + showDataSelection + ")";;
    userListDropDown.onclick = function() {
      for (let i = 0; i < listOfShowUserElements.length; i++) {
        if (showHideUserDataBool) {
          listOfShowUserElements[i].style.display = "none";
        } else {
          listOfShowUserElements[i].style.display = "block";
        }
      }

      if (showHideUserDataBool) {
        showHideUserDataBool = false;
      } else {
        showHideUserDataBool = true;
      }

      showNone.onclick = function(){
        updateDBWithShowUserData("None");
      };
      showUID.onclick = function(){
        updateDBWithShowUserData("UID");
      };
      showName.onclick = function(){
        updateDBWithShowUserData("Username");
      };
      showLastLogin.onclick = function(){
        updateDBWithShowUserData("Login");
      };
      showUserScore.onclick = function(){
        updateDBWithShowUserData("Score");
      };
      showShareCode.onclick = function(){
        updateDBWithShowUserData("Share");
      };
      showFriends.onclick = function(){
        updateDBWithShowUserData("Friends");
      };
      showSantaSignUp.onclick = function(){
        updateDBWithShowUserData("Santa");
      };
      showModerator.onclick = function(){
        updateDBWithShowUserData("Moderator");
      };
    };

    function updateDBWithShowUserData(showUserDataItem) {
      firebase.database().ref("moderatorSettings/").update({
        listedUserData: showUserDataItem
      });
    }
  }

  function updateInitializedUsers(){
    let tempElem;

    for (let i = 0; i < initializedUsers.length; i++) {
      tempElem = document.getElementById("user" + initializedUsers[i]);
      tempElem.className = "gift";
      tempElem.innerHTML = fetchUserData(initializedUsers[i]);
    }

    function fetchUserData(uid) {
      let userIndex = findUIDItemInArr(uid, userArr, true);
      let userData = userArr[userIndex];
      let userDataName = userData.name;
      let userDataString;

      if (userData.ban == 1) {
        tempElem.className = "gift highSev";
        userDataString = userDataName + " - BANNED";
      } else if (userData.warn >= 1) {
        tempElem.className = "gift mediumSev";
        userDataString = userDataName + " - WARNED: " + userData.warn;
      } else {
        switch (localListedUserData) {
          case "None":
            userDataString = userDataName;
            break;
          case "UID":
            userDataString = userDataName + ": " + userData.uid;
            break;
          case "Username":
            userDataString = userDataName + " - " + userData.userName;
            break;
          case "Login":
            userDataString = userDataName;
            if (userData.lastLogin != undefined) {
              if (userData.lastLogin != "Never Logged In") {
                let today = new Date();
                let lastLoginDate = new Date(userData.lastLogin);
                let lastLoginDateTrimmed = getMonthName(lastLoginDate.getMonth()) + " " + lastLoginDate.getDate() + ", " + lastLoginDate.getFullYear();
                let lastLoginDiff = Math.floor((today - lastLoginDate) / (1000 * 3600 * 24));
                userDataString = userDataName + " - " + lastLoginDateTrimmed;
                if (lastLoginDiff < 15) {
                  tempElem.className += " lowSev";
                } else if (lastLoginDiff < 31) {
                  tempElem.className += " mediumSev";
                } else if (lastLoginDiff < 61) {
                  tempElem.className += " highSev";
                }
              }
            }
            break;
          case "Score":
            userDataString = userDataName + " - 0";
            if (userData.userScore != undefined) {
              userDataString = userDataName + " - " + userData.userScore;
              if (userData.userScore > 500) {
                tempElem.className += " lowSev";
              } else if (userData.userScore > 250) {
                tempElem.className += " mediumSev";
              } else if (userData.userScore > 50) {
                tempElem.className += " highSev";
              }
            }
            break;
          case "Share":
            if (userData.shareCode != undefined)
              userDataString = userDataName + " - " + userData.shareCode;
            else
              userDataString = userDataName;
            break;
          case "Friends":
            userDataString = userDataName;
            if (userData.friends != undefined)
              if (userData.friends.length > 1) {
                userDataString = userDataName + " - " + userData.friends.length + " Friends";
              } else if (userData.friends.length == 1) {
                userDataString = userDataName + " - 1 Friend";
              }
            break;
          case "Santa":
            userDataString = userDataName;
            if (localListedUserData == "Santa") {
              if (userData.secretSanta != null) {
                if (userData.secretSanta == 1 && currentState != 3) {
                  tempElem.className += " santa";
                  userDataString = userDataName + " - Signed Up!";
                } else if (userData.secretSantaName != null) {
                  if (userData.secretSantaName != "") {
                    tempElem.className += " santa";
                    userDataString = userDataName + " - Name Assigned!";
                  } else if (userData.secretSanta == 1 && userData.secretSantaName == "") {
                    tempElem.className += " highSev";
                    userDataString = userDataName + " - NOT Assigned";
                  }
                }
              }
            }
            break;
          case "Moderator":
            userDataString = userDataName;
            if (userData.moderatorInt == 1) {
              userDataString = userDataName + " - Moderator";
              tempElem.className += " highSev";
            }
            break;
          default:
            console.log("Unknown User Data Input!");
            break;
        }
      }

      return userDataString;
    }
  }

  function getMonthName(month) {
    switch(month) {
      case 0:
        return "January";
      case 1:
        return "February";
      case 2:
        return "March";
      case 3:
        return "April";
      case 4:
        return "May";
      case 5:
        return "June";
      case 6:
        return "July";
      case 7:
        return "August";
      case 8:
        return "September";
      case 9:
        return "October";
      case 10:
        return "November";
      case 11:
        return "December";
      default:
        console.log("Invalid Month!");
        break;
    }
  }

  function initializeNukeNotification() {
    nukeAllUserNotifications.innerHTML = "Remove All User's Notifications";
    nukeAllUserNotifications.onclick = function () {
      for (let i = 0; i < userArr.length; i++) {
        if (userArr[i].notifications != null) {
          userArr[i].notifications = null;
          firebase.database().ref("users/" + userArr[i].uid + "/notifications/").remove();
        }

        if (userArr[i].readNotifications != null) {
          userArr[i].readNotifications = null;
          firebase.database().ref("users/" + userArr[i].uid + "/readNotifications/").remove();
        }
      }

      deployNotificationModal(false, "Notification Removal Successful!",
        "Every User's Notifications Have Been Successfully Removed!");
    };
  }

  function initializeNukeScores() {
    nukeAllUserScores.innerHTML = "Reset All User's Scores";
    nukeAllUserScores.onclick = function () {
      for (let i = 0; i < userArr.length; i++) {
        userArr[i].userScore = 0;
      }

      for (let i = 0; i < userArr.length; i++) {
        firebase.database().ref("users/" + userArr[i].uid + "/userScore/").remove();
      }

      deployNotificationModal(false, "User Scores Reset!",
        "Every User's Score Has Been Successfully Reset!");
    };
  }

  function initializeGlobalNotification() {
    sendGlobalNotification.innerHTML = "Send Global Message";
    sendGlobalNotification.onclick = function (){
      globalMsgInp.placeholder = "WARNING: An Important Message...";
      globalMsgTitle.innerHTML = "Enter Global Notification Below";

      sendMsg.onclick = function (){
        if(globalMsgInp.value.includes(",,,")){
          deployNotificationModal(true, "Message Error!", "Please do not use commas " +
            "in the notification. Thank you!");
        } else {
          addGlobalMessageToDB(globalMsgInp.value);
          globalMsgInp.value = "";
          closeModal(privateMessageModal);
          deployNotificationModal(false, "Message Sent!",
            "The Global Message Has Been Sent!");
        }
      };
      cancelMsg.onclick = function (){
        globalMsgInp.value = "";
        closeModal(privateMessageModal);
      };

      openModal(privateMessageModal, "addGlobalMsgModal");

      closePrivateMessageModal.onclick = function() {
        closeModal(privateMessageModal);
      };
    };
  }

  function initializeLoginBtn() {
    if(allowLogin) {
      loginFxnBtn.innerHTML = "Disable Login Function";
    } else {
      loginFxnBtn.innerHTML = "Enable Login Function";
    }
    loginFxnBtn.onclick = function(){
      if (allowLogin) {
        generateLoginDisabledModal(false);
      } else {
        loginFxnBtn.innerHTML = "Disable Login Function";
        firebase.database().ref("login/").update({
          allowLogin: true,
          loginDisabledMsg: loginDisabledMsg
        });
        deployNotificationModal(false, "Login Enabled!", "Login functionality has " +
          "been successfully enabled!");
        updateMaintenanceLog("moderation", "Login enabled by the user \"" + user.userName + "\"");
      }
    };
  }

  function initializeLimitsBtn() {
    limitsBtn.innerHTML = "Set Database Limits";
    limitsBtn.onclick = function() {
      generateLimitsModal();
    };
  }

  function initializeURLLimitsBtn() {
    giftLinkBtn.innerHTML = "Enable/Disable Gift URL Limiter";
    giftLinkBtn.onclick = function() {
      generateLoginDisabledModal(true);
    };
  }

  function generateLimitsModal() {
    closeModal(secretSantaModal);

    giftLimitInp.value = giftLimit;
    userLimitInp.value = userLimit;

    confirmLimits.onclick = function (){
      if (giftLimitInp.value == "" && userLimitInp.value == "") {
        deployNotificationModal(true, "Invalid Limits!",
          "Please Do Not Enter Empty Or Invalid Characters!");
      } else if (!isNaN(giftLimitInp.value) && !isNaN(userLimitInp.value)) {
        if (giftLimitInp.value > 0 && userLimitInp.value > 0) {
          firebase.database().ref("limits/").update({
            giftLimit: giftLimitInp.value,
            userLimit: userLimitInp.value
          });

          deployNotificationModal(false, "Limits Set!",
            "Database Limits Successfully Set!");
          updateMaintenanceLog("moderation", "Database limits set by the user \"" + user.userName
            + "\" " + "to Gift Limit: " + giftLimitInp.value + " and User Limit: " + userLimitInp.value);

          closeModal(databaseLimitsModal);
          openModal(secretSantaModal, "userOptionsModal");
        } else {
          deployNotificationModal(true, "Invalid Limits!",
            "Please Only Enter Numbers Greater Than Zero!");
        }
      } else {
        deployNotificationModal(true, "Invalid Limits!",
          "Please Only Enter Numbers Into The Fields!");
      }
    };

    cancelLimits.onclick = function(){
      closeModal(databaseLimitsModal);
      openModal(secretSantaModal, "userOptionsModal");
    };

    closeDatabaseLimitsModal.onclick = function(){
      closeModal(databaseLimitsModal);
      openModal(secretSantaModal, "userOptionsModal");
    };

    window.onclick = function (event) {
      if (event.target == databaseLimitsModal) {
        closeModal(databaseLimitsModal);
        openModal(secretSantaModal, "userOptionsModal");
      }
    }

    openModal(databaseLimitsModal, "databaseLimitsModal", true);
  }

  function generateLoginDisabledModal(urlLimitBool) {
    closeModal(secretSantaModal);

    if (urlLimitBool) {
      loginDisabledTitle.innerHTML = "Set Custom URL Limiter String";
      loginDisabledDesc.innerHTML = "URL Limiter String:";
      loginDisabledInp.value = giftURLLimit;
      loginDisabledInp.placeholder = "Set Custom URL Limiter";
      loginDisabledInfo.innerHTML = "Set A Custom List Of Acceptable URL Domains (i.e., amazon,amzn,bestbuy,barnesandnoble)";
      if (giftURLLimit == "") {
        resetDefaultLoginDisabledBtn.innerHTML = "Enable Default URL Limiter";
        confirmLoginDisabled.innerHTML = "Confirm & Enable";
      } else {
        resetDefaultLoginDisabledBtn.innerHTML = "Disable URL Limiter";
        confirmLoginDisabled.innerHTML = "Confirm & Update";
      }
    } else {
      loginDisabledTitle.innerHTML = "Set Login Disabled Message Below";
      loginDisabledDesc.innerHTML = "Login Disabled Message:";
      loginDisabledInp.value = loginDisabledMsg;
      loginDisabledInp.placeholder = "Set Login Disabled Message";
      loginDisabledInfo.innerHTML = "Set A Custom Alert Upon Attempted Login";
      resetDefaultLoginDisabledBtn.innerHTML = "Reset To Default Alert";
      confirmLoginDisabled.innerHTML = "Confirm & Disable";
    }

    if (urlLimitBool) {
      if (giftURLLimit == "") {
        resetDefaultLoginDisabledBtn.onclick = function () {
          checkCSVURL("amazon,amzn,bestbuy,barnesandnoble", true);
        };
      } else {
        resetDefaultLoginDisabledBtn.onclick = function () {
          checkCSVURL("", true);
        };
      }

      confirmLoginDisabled.onclick = function() {
        checkCSVURL(loginDisabledInp.value, false);
      };
    } else {
      resetDefaultLoginDisabledBtn.onclick = function () {
        loginDisabledInp.value = "Gifty is currently down for maintenance. Please wait for a moderator to finish " +
          "maintenance before logging in. Thank you for your patience!";
        firebase.database().ref("login/").update({
          allowLogin: allowLogin,
          loginDisabledMsg: "Gifty is currently down for maintenance. Please wait for a moderator to finish " +
            "maintenance before logging in. Thank you for your patience!"
        });
        deployNotificationModal(false, "Login Message Updated!",
          "Login Disabled Message Successfully Reset!");
        updateMaintenanceLog("moderation", "Login disabled message reset by the user \"" + user.userName
          + "\"");
      };

      confirmLoginDisabled.onclick = function () {
        if (loginDisabledInp.value == "") {
          deployNotificationModal(true, "Login Message Error!",
            "Please Do Not Leave The Login Message Empty!");
        } else {
          loginFxnBtn.innerHTML = "Enable Login Function";
          firebase.database().ref("login/").update({
            allowLogin: false,
            loginDisabledMsg: loginDisabledInp.value
          });
          deployNotificationModal(false, "Login Message Updated!",
            "Login Disabled Message Set And Login Disabled!");
          updateMaintenanceLog("moderation", "Login disabled by the user \"" + user.userName + "\" " +
            "with the following message: " + loginDisabledInp.value);

          closeModal(loginDisabledModal);
          openModal(secretSantaModal, "userOptionsModal");
        }
      };
    }

    cancelLoginDisabled.onclick = function(){
      closeModal(loginDisabledModal);
      openModal(secretSantaModal, "userOptionsModal");
    };

    closeLoginDisabledModal.onclick = function(){
      closeModal(loginDisabledModal);
      openModal(secretSantaModal, "userOptionsModal");
    };

    window.onclick = function (event) {
      if (event.target == loginDisabledModal) {
        closeModal(loginDisabledModal);
        openModal(secretSantaModal, "userOptionsModal");
      }
    }

    openModal(loginDisabledModal, "loginDisabledModal", true);
  }

  function checkCSVURL(urlString, override) {
    urlString = urlString.replace(" ", "");
    if (urlString[0] == ',') {
      urlString = urlString.split("");
      urlString.splice(0);
      urlString = urlString.join("");
    }
    if (urlString[urlString.length-1] == ',') {
      urlString = urlString.split("");
      urlString.splice( urlString.length-1, urlString.length);
      urlString = urlString.join("");
    }
    if (urlString == "" && !override) {
      deployNotificationModal(true, "URL String Error!", "The URL Limiter Is NOT currently active. If you wish to enable it, please enter a non-empty string", false, 4);
    } else if (urlString.includes(',,')) {
      deployNotificationModal(true, "URL String Error!", "Please do not include more than one comma");
    } else if (urlString.includes('.')) {
      deployNotificationModal(true, "URL String Error!", "Please do not include full URLs, only specific parts of a URL like \"www\" or \"bestbuy\".");
    } else {
      firebase.database().ref("limits/").update({
        giftURLLimit: urlString
      });
      if (urlString == "" && override) {
        updateMaintenanceLog("moderation", "URL Limiter disabled by the user \"" + user.userName);
        deployNotificationModal(false, "URL Limiter Disabled!", "The URL Limiter has been disabled!");
      } else if (urlString == "amazon,amzn,bestbuy,barnesandnoble" && override) {
        updateMaintenanceLog("moderation", "Default URL Limiter set by the user \"" + user.userName + "\" " +
          "with the following string: " + urlString);
        deployNotificationModal(false, "Default URL Limiter Set!", "The Default URL Limiter was successfully set! From now on, only gifts with the default limiters will be allowed.", false, 4);
      } else {
        updateMaintenanceLog("moderation", "URL Limiter set by the user \"" + user.userName + "\" " +
          "with the following string: " + urlString);
        deployNotificationModal(false, "URL Limiter Set!", "Your URL Limiter was successfully set! From now on, only gifts with your specified limiter(s) will be allowed.", false, 4);
      }
    }
  }

  function databaseQuery() {
    let fetchFamilies = function (postRef){
      postRef.on('child_added', function (data) {
        familyArr.push(data.val());
      });

      postRef.on('child_changed', function (data) {
        let i = findUIDItemInArr(data.key, familyArr);
        if(familyArr[i] != data.val() && i != -1)
          familyArr[i] = data.val();
      });

      postRef.on('child_removed', function (data) {
        let i = findUIDItemInArr(data.key, familyArr);
        if(familyArr[i] != data.val() && i != -1)
          familyArr.splice(i, 1);
      });
    };

    let fetchModeratorSettings = function (postRef) {
      postRef.once("value").then(function(snapshot) {
        if(snapshot.exists()) {
          console.log("Moderator Settings Snapshot Exists!");
          postRef.on('child_added', function (data) {
            console.log(data.key + " added");

            if (data.key == "listedUserData") {
              localListedUserData = data.val();
              initializeShowUserData(data.val());
              updateInitializedUsers();
            }
          });

          postRef.on('child_changed', function (data) {
            console.log(data.key + " changed");

            if (data.key == "listedUserData") {
              localListedUserData = data.val();
              initializeShowUserData(data.val());
              updateInitializedUsers();
            }
          });

          postRef.on('child_removed', function (data) {
            console.log(data.key + " removed!");

            firebase.database().ref("moderatorSettings/").update({
              listedUserData: "None"
            });
          });
        } else {
          console.log("Initializing Moderator Settings In DB");

          firebase.database().ref("moderatorSettings/").update({
            listedUserData: "None"
          });
          fetchModeratorSettings(moderatorSettings);
        }
      });
    };

    let fetchSecretSanta = function (postRef) {
      postRef.once("value").then(function(snapshot) {
        if(snapshot.exists()) {
          console.log("Secret Santa Snapshot Exists!");
          postRef.on('child_added', function (data) {
            console.log(data.key + " added");
            if (secretSantaInit == false) {
              secretSantaInit = true;
            }

            initializeSecretSantaDataMod(data);
          });

          postRef.on('child_changed', function (data) {
            console.log(data.key + " changed");

            initializeSecretSantaDataMod(data);
          });

          postRef.on('child_removed', function (data) {
            console.log(data.key + " removed!");

            firebase.database().ref("secretSanta/").update({
              automaticUpdates: false,
              manualUpdates: false,
              santaState: 1
            });
          });
        } else {
          console.log("Initializing Secret Santa In DB");

          firebase.database().ref("secretSanta/").update({
            automaticUpdates: false,
            manualUpdates: false,
            santaState: 1
          });
          fetchSecretSanta(autoSecretSanta);
        }
      });
    };

    let fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        createUserElement(data.val());

        if(globalNoteInt == 0) {
          globalNoteInt = 1;
          initializeGlobalNotification();
          initializeNukeNotification();
          initializeNukeScores();
        }

        let i = findUIDItemInArr(data.key, userArr, true);
        if(userArr[i] != data.val() && i != -1){
          userArr[i] = data.val();
        }

        if(data.key == user.uid){
          user = data.val();
        }
      });

      postRef.on('child_changed', function (data) {
        changeUserElement(data.val());

        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
          userArr[i] = data.val();
          updateInitializedUsers();
        }

        if(data.key == user.uid){
          user = data.val();
          console.log("Current User Updated");
        }

        if(currentModalOpen == data.key) {
          closeModal(userModal);
        }
      });

      postRef.on('child_removed', function (data) {
        removeUserElement(data.val().uid);

        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          console.log("Removing " + userArr[i].userName + " / " + data.val().userName);
          userArr.splice(i, 1);
        }

        if(currentModalOpen == data.key) {
          closeModal(userModal);
        }
      });
    };

    let fetchInvites = function (postRef) {
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

    let fetchLogin = function (postRef) {
      postRef.on('child_added', function (data) {
        if (data.key == "allowLogin") {
          allowLogin = data.val();
        } else if (data.key == "loginDisabledMsg") {
          loginDisabledMsg = data.val();
        }
        if (allowLogin != null && loginDisabledMsg != "") {
          initializeLoginBtn();
        }
      });

      postRef.on('child_changed', function (data) {
        if (data.key == "allowLogin") {
          allowLogin = data.val();
        } else if (data.key == "loginDisabledMsg") {
          loginDisabledMsg = data.val();
        }
        initializeLoginBtn();
      });

      postRef.on('child_removed', function (data) {
        if (data.key == "allowLogin") {
          allowLogin = true;
        } else if (data.key == "loginDisabledMsg") {
          loginDisabledMsg = "Gifty is currently down for maintenance. Please wait for a moderator to finish " +
            "maintenance before logging in. Thank you for your patience!";
        }
        initializeLoginBtn();
      });
    };

    let fetchLimits = function (postRef) {
      postRef.on('child_added', function (data) {
        if (data.key == "userLimit") {
          userLimit = data.val();
        } else if (data.key == "giftLimit") {
          giftLimit = data.val();
        } else if (data.key == "giftURLLimit") {
          giftURLLimit = data.val();
          initializeURLLimitsBtn();
        }
        if (giftLimit > 0 && userLimit > 0) {
          initializeLimitsBtn();
        }
      });

      postRef.on('child_changed', function (data) {
        if (data.key == "userLimit") {
          userLimit = data.val();
          initializeLimitsBtn();
        } else if (data.key == "giftLimit") {
          giftLimit = data.val();
          initializeLimitsBtn();
        } else if (data.key == "giftURLLimit") {
          giftURLLimit = data.val();
          initializeURLLimitsBtn();
        }
      });

      postRef.on('child_removed', function (data) {
        if (data.key == "userLimit") {
          userLimit = 50;
          initializeLimitsBtn();
        } else if (data.key == "giftLimit") {
          giftLimit = 100;
          initializeLimitsBtn();
        } else if (data.key == "giftURLLimit") {
          giftURLLimit = "";
          initializeURLLimitsBtn();
        }
      });
    };

    fetchData(userInitial);
    fetchInvites(userInvites);
    fetchSecretSanta(autoSecretSanta);
    fetchModeratorSettings(moderatorSettings);
    fetchFamilies(familyInitial);
    fetchLogin(loginInitial);
    fetchLimits(limitsInitial);

    listeningFirebaseRefs.push(userInitial);
    listeningFirebaseRefs.push(userInvites);
    listeningFirebaseRefs.push(autoSecretSanta);
    listeningFirebaseRefs.push(moderatorSettings);
    listeningFirebaseRefs.push(familyInitial);
    listeningFirebaseRefs.push(loginInitial);
    listeningFirebaseRefs.push(limitsInitial);
  }

  function createUserElement(userData){
    let textNode;
    try{
      testData.remove();
    } catch (err) {}

    let liItem = document.createElement("LI");
    liItem.id = "user" + userData.uid;
    initUserElement(liItem, userData);

    textNode = document.createTextNode(userData.name);
    liItem.appendChild(textNode);

    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
    clearInterval(offlineTimer);

    dataCounter++;
    initializedUsers.push(userData.uid);
    if (dataCounter > buttonOpacLim) {
      userOptionsBtn.style.opacity = ".75";
    }
  }

  function changeUserElement(userData) {
    let editUser = document.getElementById('user' + userData.uid);
    updateInitializedUsers();
    initUserElement(editUser, userData);
  }

  function initUserElement(liItem, userData) {
    liItem.className = "gift";

    liItem.onclick = function (){
      userName.innerHTML = userData.name;
      userUID.innerHTML = "UID: " + userData.uid;
      userUserName.innerHTML = "Username: " + userData.userName;
      if(userData.giftList != undefined){
        userGifts.innerHTML = "# Gifts: " + userData.giftList.length;
      } else {
        userGifts.innerHTML = "This User Has No Gifts";
      }
      if(userData.privateList != undefined){
        if(userData.uid == user.uid) {
          userPrivateGifts.innerHTML = "# Private Gifts: ???";
        } else {
          userPrivateGifts.innerHTML = "# Private Gifts: " + userData.privateList.length;
        }
      } else {
        userPrivateGifts.innerHTML = "This User Has No Private Gifts";
      }
      if(userData.friends != undefined) {
        userFriends.innerHTML = "# Friends: " + userData.friends.length;
      } else {
        userFriends.innerHTML = "This User Has No Friends";
      }
      if(userData.lastLogin != undefined) {
        userLastLogin.innerHTML = "Last Login: " + userData.lastLogin;
      } else {
        userLastLogin.innerHTML = "This User Has Never Logged In";
      }
      if(userData.userScore != undefined) {
        userScore.innerHTML = "User Score: " + userData.userScore;
      } else {
        userScore.innerHTML = "User Score: 0";
      }
      userPassword.innerHTML = "Click On Me To View Password";

      if (currentState == 2) {
        if(userData.secretSanta != undefined) {
          if (userData.secretSanta == 0) {
            userSecretSanta.innerHTML = "Click To Opt Into Secret Santa";
            userSecretSanta.style.color = "#f00";
          } else {
            userSecretSanta.innerHTML = "Click To Opt Out Of Secret Santa";
            userSecretSanta.style.color = "#00d118";
          }
        } else {
          userSecretSanta.innerHTML = "Click To Opt Into Secret Santa";
          userSecretSanta.style.color = "#f00";
        }
        userSecretSanta.onclick = function() {
          manuallyOptInOut(userData);
        };
      } else if (currentState == 3 && userData.secretSanta == 1) {
        if (userData.secretSantaName == "") {
          userSecretSanta.innerHTML = "This User Was Not Assigned A Name!";
          userSecretSanta.style.color = "#000";
          userSecretSanta.onclick = function(){};
        } else {
          userSecretSanta.innerHTML = "Click Here To View Secret Santa Assignment";
          userSecretSanta.style.color = "#00d118";
          userSecretSanta.onclick = function(){
            let userSecretIndex = findUIDItemInArr(userData.secretSantaName, userArr, true);
            userSecretSanta.innerHTML = userArr[userSecretIndex].name;
            userSecretSanta.onclick = function(){};
          };
        }
      } else if (currentState == 3 && userData.secretSanta == 0) {
        userSecretSanta.innerHTML = "This User Did Not Sign Up For Secret Santa";
        userSecretSanta.style.color = "#000";
        userSecretSanta.onclick = function(){};
      } else {
        userSecretSanta.innerHTML = "Secret Santa Is Not Active!";
        userSecretSanta.style.color = "#000";
        userSecretSanta.onclick = function() {};
      }

      userGifts.onclick = function() {
        if(userData.uid == user.uid){
          deployNotificationModal(true, "User Info",
            "Navigate to the home page to see your gifts!");
        } else {
          sessionStorage.setItem("validGiftUser", JSON.stringify(userData));
          navigation(9);//FriendList
        }
      };
      userPrivateGifts.onclick = function() {
        if(userData.uid == user.uid){
          deployNotificationModal(true, "User Info",
            "You aren't allowed to see your private gifts!");
        } else {
          sessionStorage.setItem("validGiftUser", JSON.stringify(userData));
          navigation(10);//PrivateFriendList
        }
      };
      userPassword.onclick = function() {
        userPassword.innerHTML = decode(userData.encodeStr);
      };
      warnUser.onclick = function(){
        generatePrivateMessageDialog(userData, true);
      };
      banUser.onclick = function(){
        if (userData.ban == 1) {
          firebase.database().ref("users/" + userData.uid).update({
            ban: 0
          });
          deployNotificationModal(false, "Unbanned User!",
            userData.name + " has been unbanned!");
        } else {
          firebase.database().ref("users/" + userData.uid).update({
            ban: 1
          });
          deployNotificationModal(false, "Banned User!",
            userData.name + " has been banned!");
        }
      };
      if (userData.uid == "-L__dcUyFssV44G9stxY" && user.uid != "-L__dcUyFssV44G9stxY") {
        moderatorOp.innerHTML = "Don't Even Think About It";
        moderatorOp.onclick = function() {};
      } else if (userData.moderatorInt == 1) {
        moderatorOp.innerHTML = "Click To Revoke Moderator Role";
        moderatorOp.style.color = "#00d118";
        moderatorOp.onclick = function() {
          if(userData.uid == user.uid){
            deployNotificationModal(true, "User Info",
              "You cannot adjust your own role");
          } else {
            deployNotificationModal(false, "Moderator Role Revoked",
              "Revoked role for " + userData.userName);
            firebase.database().ref("users/" + userData.uid).update({
              moderatorInt: 0
            });
            closeModal(userModal);
          }
        };
      } else {
        moderatorOp.innerHTML = "Click To Grant Moderator Role";
        moderatorOp.style.color = "#f00";
        moderatorOp.onclick = function() {
          if(userData.userName == user.userName){
            deployNotificationModal(true, "User Info",
              "You cannot adjust your own role");
          } else {
            firebase.database().ref("users/" + userData.uid).update({
              moderatorInt: 1
            });
            deployNotificationModal(false, "Moderator Role Granted",
              "Granted role for " + userData.userName);
            closeModal(userModal);
          }
        };
      }

      if (userData.ban == 1) {
        banUser.innerHTML = "Unban";
      } else if (userData.ban == 0) {
        banUser.innerHTML = "Ban";
      }

      sendPrivateMessage.innerHTML = "Click To Send Message To " + userData.name;
      sendPrivateMessage.onclick = function() {
        generatePrivateMessageDialog(userData, false);
      };

      openModal(userModal, userData.uid);

      closeUserModal.onclick = function() {
        closeModal(userModal);
      };

      function manuallyOptInOut(userData){
        if (userData.secretSanta != null) {
          if (userData.secretSanta == 0) {
            firebase.database().ref("users/" + userData.uid).update({
              secretSanta: 1
            });
            deployNotificationModal(false, "Secret Santa Opted In!",
              userData.name + " has been manually opted in to the Secret Santa Program!");
          } else {
            firebase.database().ref("users/" + userData.uid).update({
              secretSanta: 0
            });
            deployNotificationModal(false, "Secret Santa Opted Out!",
              userData.name + " has been manually opted out of the Secret Santa Program!");
          }
        } else {
          firebase.database().ref("users/" + userData.uid).update({
            secretSanta: 0
          });
          deployNotificationModal(false, "Secret Santa Opted Out!",
            userData.name + " has been manually opted out of the Secret Santa Program!");
        }
      }
    };
  }

  function removeUserElement(uid) {
    document.getElementById('user' + uid).remove();
    let i = initializedUsers.indexOf(uid);
    initializedUsers.splice(i , 1);

    dataCounter--;
    if (dataCounter == 0){
      deployListEmptyNotification("No Users Found!");
    }
  }
};
