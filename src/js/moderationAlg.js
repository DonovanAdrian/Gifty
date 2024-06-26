/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let moderationElements = [];
let initializedUsers = [];
let loadedUserDataViewArr = [];
let loadedModerationTicketViewArr = [];
let ticketArr = [];
let newTicketArr = [];
let viewedNewTicketArr = [];

let moderationSet = 1;
let globalNoteInt = 0;
let listLimit = 0;
let giftLimit = 0;
let userLimit = 0;

let showHideUserDataBool = false;
let userUpdateLocal = false;
let secretSantaAssignmentShown = false;
let initializedDatabaseCheck = false;
let allowLogin = null;

let secretSantaAssignmentShownUser = "";
let loginDisabledMsg = "";
let giftURLLimit = "";

let ticketCount;
let localListedUserData;
let nukeNoteInfoIcon;
let nukeAllUserNotifications;
let nukeScoreInfoIcon;
let nukeAllUserScores;
let giftLinkInfoIcon;
let giftLinkBtn;
let limitsInfoIcon;
let limitsBtn;
let extraDataInfoIcon;
let hideExtraDataBtn;
let userListInfoIcon;
let userListDropDown;
let showNone;
let showUID;
let showName;
let showLastLogin;
let showActions;
let showReview;
let showUserScore;
let showShareCode;
let showFriends;
let showNotifications;
let showRelationships;
let showGifts;
let showModerator;
let showFamilyAssignment;
let showSecretSanta;
let showCurrentSecretSanta;
let showLastSecretSanta;
let globalNoteInfoIcon;
let sendGlobalNotification;
let loginFxnInfoIcon;
let loginFxnBtn;
let listLimitInfoIcon;
let listLimitBtn;
let confirmModal;
let closeConfirmModal;
let confirmTitle;
let confirmContent;
let confirmBtn;
let denyBtn;
let databaseLimitsModal;
let closeDatabaseLimitsModal;
let giftLimitInp;
let userLimitInp;
let confirmLimits;
let cancelLimits;
let loginDisabledModal;
let closeLoginDisabledModal;
let loginDisabledTitle;
let loginDisabledDesc;
let loginDisabledInp;
let loginDisabledInfo;
let resetDefaultLoginDisabledBtn;
let confirmLoginDisabled;
let cancelLoginDisabled;
let userOptionsBtn;
let userOptionsModal;
let userOptionsSpan;
let settingsNote;
let userModal;
let closeUserModal;
let userName;
let userUID;
let userUserName;
let userPublicGifts;
let userPrivateGifts;
let userFriendsList;
let userRelationshipList;
let userRelationshipBuffer;
let userNotificationsList;
let userNotificationsBuffer;
let userLastLogin;
let userLastAction;
let userLastReview;
let userScoreElem;
let userFamilyName;
let userSecretSanta;
let userSecretSantaPrior;
let userSecretSantaBtn;
let userSecretSantaBuffer;
let userPassword;
let moderatorOp;
let sendPrivateMessage;
let warnUser;
let banUser;
let userDataViewModal;
let closeUserDataViewModal;
let userDataViewTitle;
let userDataViewText;
let userDataViewListContainer;
let userDataViewBack;
let testUserDataView;
let moderationTicketViewModal;
let closeModerationTicketViewModal;
let moderationTicketViewTitle;
let moderationTicketViewText;
let moderationTicketViewLastTicket;
let moderationTicketViewOldestTicket;
let moderationTicketViewListContainer;
let testModerationTicketView;
let moderationTicketViewNavigate;
let privateMessageModal;
let closePrivateMessageModal;
let globalMsgTitle;
let globalMsgInp;
let sendMsg;
let cancelMsg;



function checkUserCookie() {
  try {
    if (userArr.length == 0)
      userArr = JSON.parse(sessionStorage.userArr);
    for (let i = 0; i < userArr.length; i++) {
      createUserElement(userArr[i]);
    }

    updateInitializedUsers();
  } catch (err) {}
}

function checkModerationCookie() {
  try {
    localListedUserData = JSON.parse(sessionStorage.localListedUserData);
    initializeShowUserData(localListedUserData);
  } catch (err) {}
}

function checkTicketCookie() {
  try {
    ticketArr = JSON.parse(sessionStorage.ticketArr);
    for (let i = 0; i < ticketArr.length; i++) {
      createQuickModerationTicketElem(ticketArr[i]);
    }
    evaluateInitialTicketTimeline(moderationTicketViewLastTicket, moderationTicketViewOldestTicket);
    initializeTicketCount(0);
  } catch (err) {}
}

function initializeListedUserData(listedUserDataInput, initializeCurrentUser) {
  localListedUserData = listedUserDataInput;
  if (listedUserDataInput == undefined) {
    listedUserDataInput = "None";
    updateDBWithShowUserData(listedUserDataInput);
  }

  if (initializeCurrentUser == undefined)
    initializeCurrentUser = false;

  if (initializeCurrentUser)
    updateDBWithShowUserData(listedUserDataInput);

  initializeShowUserData(listedUserDataInput);
  updateInitializedUsers();
  saveListedUserDataToCookie();
}

window.onload = function instantiate() {
  try {
    failedNavNum = 14;
    pageName = "Moderation";
    backBtn = document.getElementById("backBtn");
    ticketCount = document.getElementById("ticketCount");
    inviteNote = document.getElementById("inviteNote");
    nukeNoteInfoIcon = document.getElementById("nukeNoteInfoIcon");
    nukeAllUserNotifications = document.getElementById("nukeAllUserNotifications");
    nukeScoreInfoIcon = document.getElementById("nukeScoreInfoIcon");
    nukeAllUserScores = document.getElementById("nukeAllUserScores");
    giftLinkInfoIcon = document.getElementById("giftLinkInfoIcon");
    giftLinkBtn = document.getElementById("giftLinkBtn");
    limitsInfoIcon = document.getElementById("limitsInfoIcon");
    limitsBtn = document.getElementById("limitsBtn");
    extraDataInfoIcon = document.getElementById("extraDataInfoIcon");
    hideExtraDataBtn = document.getElementById("hideExtraDataBtn");
    userListInfoIcon = document.getElementById("userListInfoIcon");
    userListDropDown = document.getElementById("userListDropDown");
    showNone = document.getElementById("showNone");
    showUID = document.getElementById("showUID");
    showName = document.getElementById("showName");
    showLastLogin = document.getElementById("showLastLogin");
    showActions = document.getElementById("showActions");
    showReview = document.getElementById("showReview");
    showUserScore = document.getElementById("showUserScore");
    showShareCode = document.getElementById("showShareCode");
    showGifts = document.getElementById("showGifts");
    showFriends = document.getElementById("showFriends");
    showNotifications = document.getElementById("showNotifications");
    showRelationships = document.getElementById("showRelationships");
    showModerator = document.getElementById("showModerator");
    showFamilyAssignment = document.getElementById("showFamilyAssignment");
    showSecretSanta = document.getElementById("showSecretSanta");
    showCurrentSecretSanta = document.getElementById("showCurrentSecretSanta");
    showLastSecretSanta = document.getElementById("showLastSecretSanta");
    globalNoteInfoIcon = document.getElementById("globalNoteInfoIcon");
    sendGlobalNotification = document.getElementById("sendGlobalNotification");
    loginFxnInfoIcon = document.getElementById("loginFxnInfoIcon");
    loginFxnBtn = document.getElementById("loginFxnBtn");
    listLimitInfoIcon = document.getElementById("listLimitInfoIcon");
    listLimitBtn = document.getElementById("listLimitBtn");
    confirmModal = document.getElementById("confirmModal");
    closeConfirmModal = document.getElementById("closeConfirmModal");
    confirmTitle = document.getElementById("confirmTitle");
    confirmContent = document.getElementById("confirmContent");
    confirmBtn = document.getElementById("confirmBtn");
    denyBtn = document.getElementById("denyBtn");
    databaseLimitsModal = document.getElementById("databaseLimitsModal");
    closeDatabaseLimitsModal = document.getElementById("closeDatabaseLimitsModal");
    giftLimitInp = document.getElementById("giftLimitInp");
    userLimitInp = document.getElementById("userLimitInp");
    confirmLimits = document.getElementById("confirmLimits");
    cancelLimits = document.getElementById("cancelLimits");
    loginDisabledModal = document.getElementById("loginDisabledModal");
    closeLoginDisabledModal = document.getElementById("closeLoginDisabledModal");
    loginDisabledTitle = document.getElementById("loginDisabledTitle");
    loginDisabledDesc = document.getElementById("loginDisabledDesc");
    loginDisabledInp = document.getElementById("loginDisabledInp");
    loginDisabledInfo = document.getElementById("loginDisabledInfo");
    resetDefaultLoginDisabledBtn = document.getElementById("resetDefaultLoginDisabledBtn");
    confirmLoginDisabled = document.getElementById("confirmLoginDisabled");
    cancelLoginDisabled = document.getElementById("cancelLoginDisabled");
    userOptionsBtn = document.getElementById("userOptionsBtn");
    userOptionsModal = document.getElementById("userOptionsModal");
    userOptionsSpan = document.getElementById("userOptionsSpan");
    settingsNote = document.getElementById("settingsNote");
    userModal = document.getElementById("userModal");
    closeUserModal = document.getElementById("closeUserModal");
    userName = document.getElementById("userName");
    userUID = document.getElementById("userUID");
    userUserName = document.getElementById("userUserName");
    userPublicGifts = document.getElementById("userPublicGifts");
    userPrivateGifts = document.getElementById("userPrivateGifts");
    userFriendsList = document.getElementById("userFriendsList");
    userRelationshipList = document.getElementById("userRelationshipList");
    userRelationshipBuffer = document.getElementById("userRelationshipBuffer");
    userNotificationsList = document.getElementById("userNotificationsList");
    userNotificationsBuffer = document.getElementById("userNotificationsBuffer");
    userLastLogin = document.getElementById("userLastLogin");
    userLastAction = document.getElementById("userLastAction");
    userLastReview = document.getElementById("userLastReview");
    userScoreElem = document.getElementById("userScoreElem");
    userFamilyName = document.getElementById("userFamilyName");
    userSecretSanta = document.getElementById("userSecretSanta");
    userSecretSantaPrior = document.getElementById("userSecretSantaPrior");
    userSecretSantaBtn = document.getElementById("userSecretSantaBtn");
    userSecretSantaBuffer = document.getElementById("userSecretSantaBuffer");
    userPassword = document.getElementById("userPassword");
    moderatorOp = document.getElementById("moderatorOp");
    sendPrivateMessage = document.getElementById("sendPrivateMessage");
    warnUser = document.getElementById("warnUser");
    banUser = document.getElementById("banUser");
    userDataViewModal = document.getElementById("userDataViewModal");
    closeUserDataViewModal = document.getElementById("closeUserDataViewModal");
    userDataViewTitle = document.getElementById("userDataViewTitle");
    userDataViewText = document.getElementById("userDataViewText");
    userDataViewListContainer = document.getElementById("userDataViewListContainer");
    userDataViewBack = document.getElementById("userDataViewBack");
    testUserDataView = document.getElementById("testUserDataView");
    moderationTicketViewModal = document.getElementById("moderationTicketViewModal");
    closeModerationTicketViewModal = document.getElementById("closeModerationTicketViewModal");
    moderationTicketViewTitle = document.getElementById("moderationTicketViewTitle");
    moderationTicketViewText = document.getElementById("moderationTicketViewText");
    moderationTicketViewLastTicket = document.getElementById("moderationTicketViewLastTicket");
    moderationTicketViewOldestTicket = document.getElementById("moderationTicketViewOldestTicket");
    moderationTicketViewListContainer = document.getElementById("moderationTicketViewListContainer");
    testModerationTicketView = document.getElementById("testModerationTicketView");
    moderationTicketViewNavigate = document.getElementById("moderationTicketViewNavigate");
    privateMessageModal = document.getElementById("privateMessageModal");
    closePrivateMessageModal = document.getElementById("closePrivateMessageModal");
    globalMsgTitle = document.getElementById("globalMsgTitle");
    globalMsgInp = document.getElementById("globalMsgInp");
    sendMsg = document.getElementById("sendMsg");
    cancelMsg = document.getElementById("cancelMsg");

    sessionStorage.setItem("moderationSet", JSON.stringify(moderationSet));
    getCurrentUserCommon();
    commonInitialization();
    checkModerationCookie();
    checkTicketCookie();
    checkUserCookie();

    moderationElements = [dataListContainer, offlineModal, offlineSpan, inviteNote, confirmModal, closeConfirmModal,
      confirmTitle, confirmContent, confirmBtn, denyBtn, notificationModal, notificationTitle, notificationInfo, noteSpan,
      privateMessageModal, sendGlobalNotification, nukeAllUserNotifications, nukeAllUserScores, loginFxnBtn, giftLinkBtn,
      limitsBtn, databaseLimitsModal, closeDatabaseLimitsModal, giftLimitInp, userLimitInp, confirmLimits, cancelLimits,
      loginDisabledModal, loginDisabledTitle, closeLoginDisabledModal, loginDisabledDesc, loginDisabledInp,
      loginDisabledInfo, resetDefaultLoginDisabledBtn, confirmLoginDisabled, cancelLoginDisabled, hideExtraDataBtn,
      userListDropDown, showNone, showUID, showName, showLastLogin, showActions, showReview, showUserScore,
      showShareCode, showGifts, showFriends, showNotifications, showRelationships, showModerator, showFamilyAssignment,
      showSecretSanta, showCurrentSecretSanta, showLastSecretSanta, sendPrivateMessage, userModal, userOptionsBtn,
      userOptionsModal, userOptionsSpan, settingsNote, testData, closeUserModal, userName, userUID, userUserName,
      userPublicGifts, userPrivateGifts, userFriendsList, userRelationshipList, userRelationshipBuffer,
      userNotificationsList, userNotificationsBuffer, userLastLogin, userLastAction, userLastReview, userScoreElem,
      userFamilyName, userSecretSanta, userSecretSantaPrior, userSecretSantaBtn, userSecretSantaBuffer, userPassword,
      moderatorOp, sendPrivateMessage, warnUser, banUser, userDataViewModal, closeUserDataViewModal, userDataViewTitle,
      userDataViewText, userDataViewListContainer, userDataViewBack, testUserDataView, moderationTicketViewModal,
      closeModerationTicketViewModal, moderationTicketViewTitle, moderationTicketViewText,
      moderationTicketViewLastTicket, moderationTicketViewOldestTicket, moderationTicketViewListContainer,
      testModerationTicketView, moderationTicketViewNavigate, closePrivateMessageModal, globalMsgTitle, globalMsgInp,
      sendMsg, cancelMsg, nukeNoteInfoIcon, nukeScoreInfoIcon, giftLinkInfoIcon, limitsInfoIcon, extraDataInfoIcon,
      userListInfoIcon, globalNoteInfoIcon, loginFxnInfoIcon, listLimitInfoIcon];

    verifyElementIntegrity(moderationElements);

    userInitial = firebase.database().ref("users/");
    userInvites = firebase.database().ref("users/" + user.uid + "/invites");
    moderationTickets = firebase.database().ref("maintenance/");
    moderatorSettings = firebase.database().ref("moderatorSettings/");
    familyInitial = firebase.database().ref("family/");
    loginInitial = firebase.database().ref("login/");
    limitsInitial = firebase.database().ref("limits/");

    databaseQuery();
    alternateButtonLabel(settingsNote, "Settings", "Moderation");
    generateUserOptionsModal();
    initializeBackBtn();
    initializeInfoIcons();
    initializeListedUserData(user.listedUserData);
  } catch (err) {
    sendCriticalInitializationError(err);
  }

  function databaseQuery() {
    let fetchFamilies = function (postRef){
      postRef.on("child_added", function (data) {
        let i = findUIDItemInArr(data.val().uid, familyArr);
        if (i == -1) {
          familyArr.push(data.val());
        }
      });

      postRef.on("child_changed", function (data) {
        let i = findUIDItemInArr(data.key, familyArr);
        if(familyArr[i] != data.val() && i != -1)
          familyArr[i] = data.val();
      });

      postRef.on("child_removed", function (data) {
        let i = findUIDItemInArr(data.key, familyArr);
        if(familyArr[i] != data.val() && i != -1)
          familyArr.splice(i, 1);
      });
    };

    let fetchModerationQueue = function (postRef) {
      postRef.once("value").then(function(snapshot) {
        if (snapshot.exists() || initializedDatabaseCheck) {
          postRef.on("child_added", function (data) {
            let i = findUIDItemInArr(data.key, ticketArr);
            if(i != -1) {
              localObjectChanges = findObjectChanges(ticketArr[i], data.val());
              if (localObjectChanges.length != 0) {
                logOutput("Changing " + ticketArr[i].uid);
                ticketArr[i] = data.val();
                saveTicketArrToCookie();
                changeQuickModerationTicketElem(data.val());
              }
            } else {
              ticketArr.push(data.val());
              newTicketArr.push(data.val());
              if (!loadedModerationTicketViewArr.includes("ticket_" + data.key)) {
                createQuickModerationTicketElem(data.val());
              }
              saveTicketArrToCookie();
            }
          });

          postRef.on("child_changed", function (data) {
            let i = findUIDItemInArr(data.key, ticketArr);
            if(i != -1){
              localObjectChanges = findObjectChanges(ticketArr[i], data.val());
              if (localObjectChanges.length != 0) {
                logOutput("Changing " + ticketArr[i].uid);
                ticketArr[i] = data.val();
                saveTicketArrToCookie();
                changeQuickModerationTicketElem(data.val());
              }
            }
          });

          postRef.on("child_removed", function (data) {
            logOutput(data.key + " Removed From DB!");
            let i = findUIDItemInArr(data.key, ticketArr);
            if(i != -1){
              logOutput("Removing " + ticketArr[i].uid);
              ticketArr.splice(i, 1);

              removeQuickModerationTicketElem(data.val());
              saveTicketArrToCookie();
            }
          });
        } else {
          ticketArr = [];
          saveTicketArrToCookie();
          nukeQuickModerationTicketElem();
          initializedDatabaseCheck = true;
          fetchModerationQueue(moderationTickets);
        }
      });
    };

    let fetchModeratorSettings = function (postRef) {
      postRef.once("value").then(function(snapshot) {
        if(snapshot.exists()) {
          logOutput("Moderator Settings Snapshot Exists!");
          postRef.on("child_added", function (data) {
            logOutput(data.key + " added");

            if (data.key == "listedUserData") {
              localListedUserData = data.val();
              logOutput("Added, correcting listedUserData source to current moderator.");
              initializeListedUserData(localListedUserData, true);
              firebase.database().ref("moderatorSettings/").child("listedUserData").remove();
            }
          });

          postRef.on("child_changed", function (data) {
            logOutput(data.key + " changed");

            if (data.key == "listedUserData") {
              localListedUserData = data.val();
              logOutput("Changed, correcting listedUserData source to current moderator.");
              initializeListedUserData(localListedUserData, true);
              firebase.database().ref("moderatorSettings/").child("listedUserData").remove();
            }
          });
        }
      });
    };

    let fetchData = function (postRef) {
      postRef.on("child_added", function (data) {
        if(globalNoteInt == 0) {
          globalNoteInt = 1;
          initializeGlobalNotification();
          initializeHideExtraDataButtonPlatform();
          initializeNukeNotification();
          initializeNukeScores();
        }

        let i = findUIDItemInArr(data.key, userArr);
        if (i != -1) {
          localObjectChanges = findObjectChanges(userArr[i], data.val());
          if (localObjectChanges.length != 0) {
            userArr[i] = data.val();
            changeUserElement(data.val());
            updateInitializedUsers();

            if (data.key == user.uid) {
              user = data.val();
              updateFriendNav(user.friends);
              if (localObjectChanges.includes("listedUserData")) {
                initializeListedUserData(user.listedUserData);
              }
            }
            saveCriticalCookies();
          }
        } else {
          createUserElement(data.val());
          userArr.push(data.val());

          if (data.key == user.uid) {
            user = data.val();
            updateFriendNav(user.friends);
          }
          saveCriticalCookies();
        }
      });

      postRef.on("child_changed", function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if (i != -1) {
          localObjectChanges = findObjectChanges(userArr[i], data.val());
          if (localObjectChanges.length != 0) {
            logOutput("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
            userArr[i] = data.val();
            changeUserElement(data.val());
            updateInitializedUsers();

            if(currentModalOpen == data.key && !userUpdateLocal) {
              deployNotificationModal(false, "User Updated!", "The user you were " +
                  "viewing was updated! Please reopen the window to view the changes.", 5);
            }

            if (data.key == user.uid) {
              user = data.val();
              updateFriendNav(user.friends);
              if (localObjectChanges.includes("listedUserData")) {
                initializeListedUserData(user.listedUserData);
              }
              logOutput("Current User Updated");
            }
            saveCriticalCookies();
          }
        }
      });

      postRef.on("child_removed", function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if (i != -1) {
          logOutput("Removing " + userArr[i].userName + " / " + data.val().userName);
          userArr.splice(i, 1);
          removeUserElement(data.val().uid);

          if(currentModalOpen == data.key) {
            deployNotificationModal(false, "User Removed!", "The user you were " +
                "viewing was deleted!", 5);
          }
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
          logOutput("Invite List Removed");
          inviteNote.style.background = "#008222";
        }
      });
    };

    let fetchLogin = function (postRef) {
      postRef.on("child_added", function (data) {
        if (data.key == "allowLogin") {
          allowLogin = data.val();
        } else if (data.key == "loginDisabledMsg") {
          loginDisabledMsg = data.val();
        }
        if (allowLogin != null && loginDisabledMsg != "") {
          initializeLoginBtn();
        }
      });

      postRef.on("child_changed", function (data) {
        if (data.key == "allowLogin") {
          allowLogin = data.val();
        } else if (data.key == "loginDisabledMsg") {
          loginDisabledMsg = data.val();
        }
        initializeLoginBtn();
      });

      postRef.on("child_removed", function (data) {
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
      postRef.on("child_added", function (data) {
        if (data.key == "userLimit") {
          userLimit = data.val();
        } else if (data.key == "giftLimit") {
          giftLimit = data.val();
        } else if (data.key == "giftURLLimit") {
          giftURLLimit = data.val();
          initializeURLLimitsBtn();
        } else if (data.key == "listLimit") {
          listLimit = data.val();
          initializeListLimitsBtn();
        }
        if (giftLimit > 0 && userLimit > 0) {
          initializeDatabaseLimitsBtn();
        }
      });

      postRef.on("child_changed", function (data) {
        if (data.key == "userLimit") {
          userLimit = data.val();
          initializeDatabaseLimitsBtn();
        } else if (data.key == "giftLimit") {
          giftLimit = data.val();
          initializeDatabaseLimitsBtn();
        } else if (data.key == "giftURLLimit") {
          giftURLLimit = data.val();
          initializeURLLimitsBtn();
        } else if (data.key == "listLimit") {
          listLimit = data.val();
          initializeListLimitsBtn();
        }
      });

      postRef.on("child_removed", function (data) {
        if (data.key == "userLimit") {
          userLimit = 50;
          initializeDatabaseLimitsBtn();
        } else if (data.key == "giftLimit") {
          giftLimit = 100;
          initializeDatabaseLimitsBtn();
        } else if (data.key == "giftURLLimit") {
          giftURLLimit = "";
          initializeURLLimitsBtn();
        } else if (data.key == "listLimit") {
          listLimit = data.val();
          initializeListLimitsBtn();
        }
      });
    };

    fetchData(userInitial);
    fetchInvites(userInvites);
    fetchModerationQueue(moderationTickets);
    fetchModeratorSettings(moderatorSettings);
    fetchFamilies(familyInitial);
    fetchLogin(loginInitial);
    fetchLimits(limitsInitial);

    listeningFirebaseRefs.push(userInitial);
    listeningFirebaseRefs.push(userInvites);
    listeningFirebaseRefs.push(moderationTickets);
    listeningFirebaseRefs.push(moderatorSettings);
    listeningFirebaseRefs.push(familyInitial);
    listeningFirebaseRefs.push(loginInitial);
    listeningFirebaseRefs.push(limitsInitial);
  }
};

function generateUserOptionsModal(){
  userOptionsBtn.onclick = function() {
    userOptionsBtn.style.transform = "rotate(" + (180 % 360) + "deg)";

    userOptionsSpan.onclick = function(){
      closeModal(userOptionsModal);
      userOptionsBtn.style.transform = "rotate(" + (-60 % 360) + "deg)";
    };

    window.onclick = function (event) {
      if (event.target == userOptionsModal) {
        closeModal(userOptionsModal);
        userOptionsBtn.style.transform = "rotate(" + (-60 % 360) + "deg)";
      }
    };

    openModal(userOptionsModal, "userOptionsModal", true);
  };
}

function initializeBackBtn() {
  backBtn.innerHTML = "Return To Settings";
  backBtn.onclick = function() {
    navigation(5);//Settings
  };
}

function initializeInfoIcons() {
  nukeNoteInfoIcon.onclick = function () {
    deployNotificationModal(true, "Remove All User Notifications", "This button " +
        "allows you to remove all the user's notifications. This cannot be reversed!" +
        "<br><br>For more information, reference the Tutorial button on the Settings page.", 10);
  };

  nukeScoreInfoIcon.onclick = function () {
    deployNotificationModal(true, "Reset User Scores", "This button allows you to " +
        "reset all the user's scores. This cannot be reversed!" +
        "<br><br>Note: User scores are an arbitrary means to tell how active a user is." +
        "<br><br>For more information, reference the Tutorial button on the Settings page.", 15);
  };

  giftLinkInfoIcon.onclick = function () {
    deployNotificationModal(true, "URL Limiter", "This button allows you to " +
        "customize the acceptable URLs that can be used when a gift is created. Please note that this only applies to " +
        "specific domains." +
        "<br><br>For example, to allow www.barnesandnoble.com, specify the area inbetween \"www\" and " +
        "\"com\"." +
        "<br><br>To allow more than one website, use this same principle in a comma-separated string, i.e., " +
        "amazon,amzn,bestbuy,barnesandnoble" +
        "<br><br>For more information, reference the Tutorial button on the Settings page.", 20);
  };

  limitsInfoIcon.onclick = function () {
    deployNotificationModal(true, "Database Limiter", "This button allows you to " +
        "select database limits if you happen to be on a limited budget for database storage data. (For example) " +
        "Please note that if you set a limit of 15 users and your database has 20, users will NOT be deleted. " +
        "However, no users will be able to create an account except for a moderator with their respective credentials." +
        "<br><br>For more information, reference the Tutorial button on the Settings page.", 20);
  };

  extraDataInfoIcon.onclick = function () {
    deployNotificationModal(true, "Hide Extraneous Data Points", "This button will " +
        "hide any extra data points that tend to clutter the moderation user interface, including \"quick-info\" options. " +
        "Please note that this setting is per-moderator, so don't worry about messing with hiding data for other moderators." +
        "<br><br>For more information, reference the Tutorial button on the Settings page.",
        20);
  };

  userListInfoIcon.onclick = function () {
    deployNotificationModal(true, "Supplemental User Info", "This dropdown menu " +
        "allows you to pick what quick-info you would like to view upon loading the user list. Please note that this " +
        "setting is global to all moderators, so this will affect what other moderators see." +
        "<br><br>For more information, reference the Tutorial button on the Settings page.", 15);
  };

  globalNoteInfoIcon.onclick = function () {
    deployNotificationModal(true, "Global Message", "This button allows you " +
        "to send a global notification to all of your users." +
        "<br><br>For more information, reference the Tutorial button on the Settings page.", 15);
  };

  loginFxnInfoIcon.onclick = function () {
    deployNotificationModal(true, "Login Functionality", "This button allows " +
        "you to disable and enable login functionality if significant issues were to occur. Please note that " +
        "moderators are still able to login even if login functionality is disabled." +
        "<br><br>For more information, reference the Tutorial button on the Settings page.", 20);
  };

  listLimitInfoIcon.onclick = function () {
    deployNotificationModal(true, "Parent/Child List Access", "Since " +
        "the parent/child feature is intended to prevent infants from being assigned to their parents, this button " +
        "would optionally allow you to prevent parents from seeing what has been bought on their infant's list and " +
        "vis versa if the parent is accessing their infants account." +
        "<br><br>For more information, reference the Tutorial button on the Settings page.", 25);
  };
}

function initializeHideExtraDataButtonPlatform() {
  if (user.hideExtraData == undefined) {
    user.hideExtraData = 1;
    firebase.database().ref("users/" + user.uid).update({
      hideExtraData: 1
    });
  }

  if (user.hideExtraData == 1) {
    hideExtraDataBtn.innerHTML = "Show Extra Data Points";
    hideExtraDataBtn.onclick = function() {
      initializeHideExtraDataButton(0);
    }
  } else if (user.hideExtraData == 0) {
    hideExtraDataBtn.innerHTML = "Hide Extra Data Points";
    hideExtraDataBtn.onclick = function() {
      initializeHideExtraDataButton(1);
    }
  } else {
    initializeHideExtraDataButton(1);
  }
}

function initializeHideExtraDataButton(desiredHiddenState) {
  user.hideExtraData = desiredHiddenState;
  firebase.database().ref("users/" + user.uid).update({
    hideExtraData: desiredHiddenState
  });
  initializeHideExtraDataButtonPlatform();
  initializeUserListDropdownOptions(true);
}


function initializeNukeNotification() {
  nukeAllUserNotifications.innerHTML = "Remove All User's Notifications";
  nukeAllUserNotifications.onclick = function () {
    userUpdateLocal = true;
    for (let i = 0; i < userArr.length; i++) {
      if (userArr[i].notifications != undefined) {
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
    userUpdateLocal = false;
  };
}

function initializeNukeScores() {
  nukeAllUserScores.innerHTML = "Reset All User's Scores";
  nukeAllUserScores.onclick = function () {
    userUpdateLocal = true;
    for (let i = 0; i < userArr.length; i++) {
      userArr[i].userScore = 0;
    }

    for (let i = 0; i < userArr.length; i++) {
      firebase.database().ref("users/" + userArr[i].uid + "/userScore/").remove();
    }

    deployNotificationModal(false, "User Scores Reset!",
        "Every User's Score Has Been Successfully Reset!");
    userUpdateLocal = false;
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
        addModerationNotificationMessagesToDB(globalMsgInp.value, userArr);
        globalMsgInp.value = "";
        closeModal(privateMessageModal);
        deployNotificationModal(false, "Message Sent!",
            "The Global Message Has Been Sent!");
      }
    };
    cancelMsg.onclick = function (){
      globalMsgInp.value = "";
      closeModal(privateMessageModal);
      openModal(userOptionsModal, "userOptionsModal");
      userOptionsBtn.style.transform = "rotate(" + (-60 % 360) + "deg)";
    };

    openModal(privateMessageModal, "addGlobalMsgModal");

    closePrivateMessageModal.onclick = function() {
      closeModal(privateMessageModal);
      userOptionsBtn.style.transform = "rotate(" + (-60 % 360) + "deg)";
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

function initializeDatabaseLimitsBtn() {
  limitsBtn.innerHTML = "Set Database Limits";
  limitsBtn.onclick = function() {
    generateLimitsModal();
  };
}

function initializeListLimitsBtn() {
  if (listLimit == 0) {
    listLimitBtn.innerHTML = "Enable Gift List Limiter";
    listLimitBtn.onclick = function (){
      firebase.database().ref("limits/").update({
        listLimit: 1
      });
    };
  } else {
    listLimitBtn.innerHTML = "Disable Gift List Limiter";
    listLimitBtn.onclick = function (){
      firebase.database().ref("limits/").update({
        listLimit: 0
      });
    };
  }
}

function initializeURLLimitsBtn() {
  giftLinkBtn.innerHTML = "Enable/Disable Gift URL Limiter";
  giftLinkBtn.onclick = function() {
    generateLoginDisabledModal(true);
  };
}

function generateLimitsModal() {
  closeModal(userOptionsModal);

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
        openModal(userOptionsModal, "userOptionsModal");
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
    openModal(userOptionsModal, "userOptionsModal");
  };

  closeDatabaseLimitsModal.onclick = function(){
    closeModal(databaseLimitsModal);
    openModal(userOptionsModal, "userOptionsModal");
  };

  window.onclick = function (event) {
    if (event.target == databaseLimitsModal) {
      closeModal(databaseLimitsModal);
      openModal(userOptionsModal, "userOptionsModal");
    }
  }

  openModal(databaseLimitsModal, "databaseLimitsModal", true);
}

function generateLoginDisabledModal(urlLimitBool) {
  closeModal(userOptionsModal);

  if (urlLimitBool) {
    loginDisabledTitle.innerHTML = "Set Custom URL Limiter String";
    loginDisabledDesc.innerHTML = "<b>URL Limiter String:</b>";
    loginDisabledInp.value = giftURLLimit;
    loginDisabledInp.placeholder = "Set Custom URL Limiter";
    loginDisabledInfo.innerHTML = "<i>Set A Custom List Of Acceptable URL Domains (i.e., amazon,amzn,bestbuy,barnesandnoble)</i>";
    if (giftURLLimit == "") {
      resetDefaultLoginDisabledBtn.innerHTML = "Enable Default URL Limiter";
      confirmLoginDisabled.innerHTML = "Confirm & Enable";
    } else {
      resetDefaultLoginDisabledBtn.innerHTML = "Disable URL Limiter";
      confirmLoginDisabled.innerHTML = "Confirm & Update";
    }
  } else {
    loginDisabledTitle.innerHTML = "Set Login Disabled Message Below";
    loginDisabledDesc.innerHTML = "<b>Login Disabled Message:</b>";
    loginDisabledInp.value = loginDisabledMsg;
    loginDisabledInp.placeholder = "Set Login Disabled Message";
    loginDisabledInfo.innerHTML = "<i>Set A Custom Alert Upon Attempted Login</i>";
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
        openModal(userOptionsModal, "userOptionsModal");
      }
    };
  }

  cancelLoginDisabled.onclick = function(){
    closeModal(loginDisabledModal);
    openModal(userOptionsModal, "userOptionsModal");
  };

  closeLoginDisabledModal.onclick = function(){
    closeModal(loginDisabledModal);
    openModal(userOptionsModal, "userOptionsModal");
  };

  window.onclick = function (event) {
    if (event.target == loginDisabledModal) {
      closeModal(loginDisabledModal);
      openModal(userOptionsModal, "userOptionsModal");
    }
  }

  openModal(loginDisabledModal, "loginDisabledModal", true);
}

function checkCSVURL(urlString, override) {
  urlString = urlString.replace(" ", "");
  if (urlString[0] == ",") {
    urlString = urlString.split("");
    urlString.splice(0);
    urlString = urlString.join("");
  }
  if (urlString[urlString.length-1] == ",") {
    urlString = urlString.split("");
    urlString.splice( urlString.length-1, urlString.length);
    urlString = urlString.join("");
  }
  if (urlString == "" && !override) {
    deployNotificationModal(true, "URL String Error!", "The URL Limiter Is NOT " +
        "currently active. If you wish to enable it, please enter a non-empty string", 4);
  } else if (urlString.includes(",,")) {
    deployNotificationModal(true, "URL String Error!", "Please do not include " +
        "more than one comma");
  } else if (urlString.includes(".")) {
    deployNotificationModal(true, "URL String Error!", "Please do not include " +
        "full URLs, only specific parts of a URL like \"www\" or \"bestbuy\".");
  } else {
    firebase.database().ref("limits/").update({
      giftURLLimit: urlString
    });
    if (urlString == "" && override) {
      updateMaintenanceLog("moderation", "URL Limiter disabled by the user \"" + user.userName);
      deployNotificationModal(false, "URL Limiter Disabled!", "The URL Limiter " +
          "has been disabled!");
    } else if (urlString == "amazon,amzn,bestbuy,barnesandnoble" && override) {
      updateMaintenanceLog("moderation", "Default URL Limiter set by the user \"" +
          user.userName + "\" " + "with the following string: " + urlString);
      deployNotificationModal(false, "Default URL Limiter Set!", "The Default " +
          "URL Limiter was successfully set! From now on, only gifts with the default limiters will be allowed.", 4);
    } else {
      updateMaintenanceLog("moderation", "URL Limiter set by the user \"" + user.userName + "\" " +
          "with the following string: " + urlString);
      deployNotificationModal(false, "URL Limiter Set!", "Your URL Limiter was " +
          "successfully set! From now on, only gifts with your specified limiter(s) will be allowed.", 4);
    }
  }
}

function generateModeratorPrivateMessageDialog(userData, warnBool) {
  let warnCount;
  if (warnBool) {
    globalMsgTitle.innerHTML = "Send A Warning Message Below";
    globalMsgInp.placeholder = "Your next offense will result in a ban...";
  } else {
    globalMsgTitle.innerHTML = "Send A Private Message To " + findFirstNameInFullName(userData.name) + " Below";
    globalMsgInp.placeholder = "Hey! Just to let you know...";
  }

  sendMsg.onclick = function (){
    if(globalMsgInp.value.includes(",,,")){
      deployNotificationModal(true, "Message Error!", "Please do not use commas " +
          "in the message. Thank you!");
    } else {
      userUpdateLocal = true;
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
            4);
      } else {
        deployNotificationModal(false, "Message Sent!",
            "The Private Message Has Been Sent!");
      }
      userUpdateLocal = false;
    }
  };
  cancelMsg.onclick = function (){
    globalMsgInp.value = "";
    closeModal(privateMessageModal);
    openModal(userModal, userData.uid);
  };

  openModal(privateMessageModal, "addGlobalMsgModal");

  closePrivateMessageModal.onclick = function() {
    closeModal(privateMessageModal);
  };
}

function confirmOperation(operationTitle, operationContent, operationType, operationData, previousModal, previousModalTitle) {
  confirmTitle.innerHTML = operationTitle;
  confirmContent.innerHTML = operationContent;

  confirmBtn.onclick = function() {
    userUpdateLocal = true;
    if (operationType == "banUser") {
      firebase.database().ref("users/" + operationData.uid).update({
        ban: 1
      });
      deployNotificationModal(false, "Banned User!",
          operationData.name + " has been banned!");
    } else if (operationType == "modRevoke") {
      firebase.database().ref("users/" + operationData.uid).update({
        moderatorInt: 0
      });
      deployNotificationModal(false, "Moderator Role Revoked",
          "Revoked role for " + operationData.userName);
    } else if (operationType == "modGrant") {
      firebase.database().ref("users/" + operationData.uid).update({
        moderatorInt: 1
      });
      deployNotificationModal(false, "Moderator Role Granted",
          "Granted role for " + operationData.userName);
    } else if (operationType == "resetPass") {
      userPassword.innerHTML = "Temporary Password: " + resetUserPassword(operationData);
      openModal(previousModal, previousModalTitle);
    } else if (operationType == "showSanta") {
      secretSantaAssignmentShown = true;
      secretSantaAssignmentShownUser = operationData.uid;
    } else if ("showCurrentSecretSanta") {
      updateDBWithShowUserData("CurrentSecretSanta");
    }
    closeModal(confirmModal);
    userUpdateLocal = false;
  };

  denyBtn.onclick = function() {
    closeModal(confirmModal);
    openModal(previousModal, previousModalTitle);
  }

  openModal(confirmModal, "confirmModal", true);

  closeConfirmModal.onclick = function() {
    closeModal(confirmModal);
    openModal(previousModal, previousModalTitle);
  };

  window.onclick = function(event) {
    if (event.target == confirmModal) {
      closeModal(confirmModal);
    }
  };
}

function addPrivateMessageToDB(userData, message) {
  userUpdateLocal = true;
  message = generateNotificationString(">admin" + user.uid, "", message, "");
  addNotificationToDB(userData, message);
  userUpdateLocal = false;
}

function createUserElement(userData){
  let textNode;
  try{
    document.getElementById("testData").remove();
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
  let editUser = document.getElementById("user" + userData.uid);
  initUserElement(editUser, userData);
}

function initUserElement(liItem, userData) {
  let resetPassBool = false;
  let userFoundInFam = false;
  let relationshipModifier = "";
  let tempString = "";
  let localFamilyData;

  userData = initUserDataIfEmpty(userData);

  userData = fixUserDataToDB(userData);

  liItem.className = "gift";

  liItem.onclick = function () {
    if (userData.ban == 1) {
      userName.innerHTML = userData.name + " - (BANNED)";
    } else {
      userName.innerHTML = userData.name;
    }
    userUserName.innerHTML = "<b>Username:</b> " + userData.userName;
    if (userData.lastLogin == "Never Logged In") {
      userLastLogin.innerHTML = "<b>Last Login:</b> Never Logged In";
    } else {
      userLastLogin.innerHTML = "<b>Last Login:</b> " + getLocalTime(userData.lastLogin);
    }
    userLastAction.innerHTML = "<b>Last Action:</b> " + userData.lastPerformedAction
    userScoreElem.innerHTML = "<b>User Score:</b> " + userData.userScore;

    userPublicGifts.onclick = function() {
      if (userData.uid == user.uid) {
        deployNotificationModal(true, "User Info",
            "Navigate to the home page to see your gifts!");
      } else {
        generateUserDataViewModal(userData.giftList, userData);
      }
    };
    if (userData.giftList.length == 0) {
      userPublicGifts.innerHTML = "This User Has No Gifts";
      userPublicGifts.onclick = function() {};
    } else if (userData.giftList.length == 1) {
      userPublicGifts.innerHTML = "View " + userData.giftList.length + " Public Gift";
    } else {
      userPublicGifts.innerHTML = "View " + userData.giftList.length + " Public Gifts";
    }
    if (userData.uid == user.uid) {
      userPrivateGifts.innerHTML = "??? Private Gifts ???";
      userPrivateGifts.onclick = function() {
        deployNotificationModal(true, "User Info",
            "You aren't allowed to see your private gifts!");
      };
    } else {
      userPrivateGifts.onclick = function() {
        generateUserDataViewModal(userData.privateList, userData);
      };
      if (userData.privateList.length == 0) {
        userPrivateGifts.innerHTML = "This User Has No Private Gifts";
        userPrivateGifts.onclick = function() {};
      } else if (userData.privateList.length == 1) {
        userPrivateGifts.innerHTML = "View " + userData.privateList.length + " Private Gift";
      } else {
        userPrivateGifts.innerHTML = "View " + userData.privateList.length + " Private Gifts";
      }
    }
    userFriendsList.onclick = function() {
      if (userData.uid == user.uid) {
        deployNotificationModal(true, "User Info",
            "Navigate to the \"Friends\" page to see your friends!");
      } else {
        generateUserDataViewModal(userData.friends, userData);
      }
    };
    if (userData.friends.length == 0) {
      userFriendsList.innerHTML = "This User Has No Friends";
      userFriendsList.onclick = function() {};
    } else if (userData.friends.length == 1) {
      userFriendsList.innerHTML = "View " + userData.friends.length + " Friend";
    } else {
      userFriendsList.innerHTML = "View " + userData.friends.length + " Friends";
    }

    warnUser.onclick = function(){
      generateModeratorPrivateMessageDialog(userData, true);
    };
    banUser.onclick = function(){
      userUpdateLocal = true;
      if (userData.ban == 1) {
        firebase.database().ref("users/" + userData.uid).update({
          ban: 0
        });
        deployNotificationModal(false, "Unbanned User!",
            userData.name + " has been unbanned!");
      } else {
        confirmOperation("Ban " + userData.name + "?", "While this CAN be undone, this " +
            "should only be used for serious offenses. Consider using warnings first, if not already done... Are you " +
            "sure you wish to ban " + userData.name + "?", "banUser", userData, userModal, userData.uid);
      }
      userUpdateLocal = false;
    };

    if (primaryOwner == undefined)
      primaryOwner = "";
    if (primaryOwner != "" && typeof primaryOwner == "string" &&
        userData.uid == primaryOwner && user.uid != primaryOwner) {
      moderatorOp.innerHTML = "Don't Even Think About It";
      moderatorOp.onclick = function() {};
    } else if (userData.moderatorInt == 1) {
      moderatorOp.innerHTML = "Revoke Moderator Role";
      moderatorOp.style.background = "#f00";
      moderatorOp.onclick = function() {
        if(userData.uid == user.uid){
          deployNotificationModal(true, "User Info",
              "You cannot adjust your own role");
        } else {
          confirmOperation("Revoke " + userData.name + "'s Moderator Role?",
              "Are you sure you would like to revoke " +
              userData.name + " from being a moderator?", "modRevoke", userData, userModal, userData.uid);
        }
      };
    } else {
      moderatorOp.innerHTML = "Grant Moderator Role";
      moderatorOp.style.background = "#00d118";
      moderatorOp.onclick = function() {
        if(userData.userName == user.userName){
          deployNotificationModal(true, "User Info",
              "You cannot adjust your own role");
        } else {
          confirmOperation("Grant " + userData.name + " Moderator Role?",
              "A moderator is powerful on Gifty, are you sure you would like to grant " +
              userData.name + " a moderator role?", "modGrant", userData, userModal, userData.uid);
        }
      };
    }

    if (userData.ban == 1) {
      banUser.innerHTML = "Unban";
    } else if (userData.ban == 0) {
      banUser.innerHTML = "Ban";
    }

    sendPrivateMessage.innerHTML = "Send Message To " + userData.name;
    sendPrivateMessage.onclick = function() {
      generateModeratorPrivateMessageDialog(userData, false);
    };

    userPassword.innerHTML = "Reset " + userData.name + "'s Password";
    userPassword.onclick = function() {
      if (!resetPassBool) {
        confirmOperation("Reset Password?", "Are you sure you wish to reset " +
            userData.name + "'s password?", "resetPass", userData, userModal, userData.uid);
        resetPassBool = true;
      } else {
        userPassword.innerHTML = "Reset " + userData.userName + "'s Password";
        resetPassBool = false;
      }
    };

    openModal(userModal, userData.uid);

    closeUserModal.onclick = function() {
      closeModal(userModal);
    };

    for (let i = 0; i < familyArr.length; i++) {
      if (familyArr[i].members != undefined) {
        if (familyArr[i].members.includes(userData.uid)) {
          userFoundInFam = true;
          localFamilyData = familyArr[i];
          break;
        }
      }
    }

    if (user.hideExtraData == 0) {
      let tempYearlyReview = userData.yearlyReview.toString();
      userUID.innerHTML = "<b>UID:</b> " + userData.uid;
      userUID.style.display = "block";

      if (tempYearlyReview.includes("*")) {
        userLastReview.innerHTML = "<b>Last Yearly Review:</b> " + userData.yearlyReview.slice(0, 4) + " <i>(Dismissed Popup)</i>";
      } else {
        userLastReview.innerHTML = "<b>Last Yearly Review:</b> " + userData.yearlyReview;
      }


      userLastReview.style.display = "block";

      userFamilyName.style.display = "block";
      if (localFamilyData == undefined) {
        userFamilyName.innerHTML = "<b>Family:</b> Not Assigned To A Family";
      } else {
        userFamilyName.innerHTML = "<b>Family:</b> \"" + localFamilyData.name + "\"";
      }

      userNotificationsList.style.display = "inline-block";
      userNotificationsBuffer.style.display = "block";
      userNotificationsList.onclick = function() {
        if (userData.uid == user.uid) {
          deployNotificationModal(true, "User Info",
              "Click on the bell icon at the bottom of MOST pages (Home, Lists, Friends, etc) to see your notifications!");
        } else {
          generateUserDataViewModal(userData.notifications, userData);
        }
      };
      if (userData.notifications.length == 0) {
        userNotificationsList.innerHTML = "This User Has No Notifications";
        userNotificationsList.onclick = function() {};
      } else if (userData.notifications.length == 1) {
        userNotificationsList.innerHTML = "View " + userData.notifications.length + " Notification";
      } else {
        userNotificationsList.innerHTML = "View " + userData.notifications.length + " Notifications";
      }

      userSecretSantaPrior.style.display = "block";
      if (userData.secretSantaNamePrior != "") {
        let tempIndex = 0;
        tempIndex = findUIDItemInArr(userData.secretSantaNamePrior, userArr);
        if (tempIndex != -1) {
          userSecretSantaPrior.innerHTML = "<b>Last Secret Santa Assignment:</b> " + findFirstNameInFullName(userArr[tempIndex].name);
        } else {
          userSecretSantaPrior.innerHTML = "<b>Last Secret Santa Assignment:</b> This User No Longer Exists!";
        }
      } else {
        userSecretSantaPrior.innerHTML = "<b>Last Secret Santa Assignment:</b> No Previous Assignment";
      }

      showSecretSantaUserControls(localFamilyData);

      userRelationshipList.style.display = "inline-block";
      userRelationshipBuffer.style.display = "block";
      userRelationshipList.onclick = function() {
        generateRelationshipDataList(userData);
      };
      if (userData.childUser.length == 0 && userData.parentUser.length == 0) {
        userRelationshipList.innerHTML = "No Family Relationships Set";
        userRelationshipList.onclick = function() {};
      } else if (userData.childUser.length != 0 && userData.parentUser.length == 0) {
        if (userData.childUser.length > 1)
          relationshipModifier = "ren";
        userRelationshipList.innerHTML = "View " + userData.childUser.length + " Child" + relationshipModifier;
      } else if (userData.childUser.length == 0 && userData.parentUser.length != 0) {
        if (userData.parentUser.length > 1)
          relationshipModifier = "s";
        userRelationshipList.innerHTML = "View " + userData.parentUser.length + " Parent" + relationshipModifier;
      } else {
        if (userData.parentUser.length > 1)
          relationshipModifier = "s";
        tempString = "View " + userData.parentUser.length + " Parent" + relationshipModifier;
        if (userData.childUser.length > 1)
          relationshipModifier = "ren";
        tempString =+ ", " + userData.childUser.length + " Child" + relationshipModifier;
        userRelationshipList.innerHTML = tempString;
      }
    } else {
      userUID.innerHTML = "";
      userUID.style.display = "none";

      userLastReview.innerHTML = "";
      userLastReview.style.display = "none";

      userFamilyName.innerHTML = "";
      userFamilyName.style.display = "none";

      userNotificationsList.innerHTML = "";
      userNotificationsList.style.display = "none";
      userNotificationsList.onclick = function() {};
      userNotificationsBuffer.style.display = "none";

      userSecretSanta.innerHTML = "";
      userSecretSanta.style.display = "none";
      userSecretSantaPrior.innerHTML = "";
      userSecretSantaPrior.style.display = "none";
      userSecretSantaBtn.innerHTML = "";
      userSecretSantaBtn.style.display = "none";
      userSecretSantaBtn.onclick = function() {};
      userSecretSantaBuffer.style.display = "none";
      showSecretSantaUserControls(localFamilyData);

      userRelationshipList.innerHTML = "";
      userRelationshipList.style.display = "none";
      userRelationshipList.onclick = function() {};
      userRelationshipBuffer.style.display = "none";
    }
  };

  function showSecretSantaUserControls(userFamilyData) {
    if (userFamilyData != undefined) {
      if (userFamilyData.secretSantaState != 1) {
        userSecretSanta.style.display = "block";
        userSecretSantaBtn.style.display = "inline-block";
        userSecretSantaBuffer.style.display = "block";
      }
      if (userFamilyData.secretSantaState == 1) {
        userSecretSanta.innerHTML = "<b>Secret Santa:</b> Idle";
        userSecretSantaBtn.innerHTML = "Secret Santa Idle";
        userSecretSantaBtn.onclick = function () {};
      } else if (userFamilyData.secretSantaState == 2) {
        if (userData.secretSanta == 0) {
          userSecretSanta.innerHTML = "<b>Secret Santa:</b> Not Signed Up";
          userSecretSantaBtn.innerHTML = "Opt Into Secret Santa";
        } else if (userData.secretSanta == 1) {
          userSecretSanta.innerHTML = "<b>Secret Santa:</b> Signed Up!";
          userSecretSantaBtn.innerHTML = "Opt Out Of Secret Santa";
        }
        userSecretSantaBtn.onclick = function () {
          userUpdateLocal = true;
          manuallyOptInOut(userData, localFamilyData);
        };
      } else if (userFamilyData.secretSantaState == 3) {
        if (userData.secretSantaName != "") {
          if (secretSantaAssignmentShown && secretSantaAssignmentShownUser != userData.uid) {
            secretSantaAssignmentShown = false;
            secretSantaAssignmentShownUser = "";
          }
          if (!secretSantaAssignmentShown) {
            userSecretSanta.innerHTML = "<b>Secret Santa:</b> Assigned!";
            userSecretSantaBtn.innerHTML = "View Secret Santa Assignment";
            userSecretSantaBtn.onclick = function () {
              confirmOperation("View " + userData.name + "'s Secret Santa Assignment?", "Are " +
                  "you sure you would like to view " + userData.name + "'s Secret Santa Assignment? If you are included " +
                  "in this individual's family within Gifty, their assignment could be you!", "showSanta",
                  userData, userModal, userData.uid);
            };
          } else {
            let tempIndex = findUIDItemInArr(userData.secretSantaName, userArr);
            userSecretSanta.innerHTML = "<b>Secret Santa:</b> " + findFirstNameInFullName(userArr[tempIndex].name);
            userSecretSantaBtn.innerHTML = "Hide Secret Santa Assignment";
            userSecretSantaBtn.onclick = function () {
              secretSantaAssignmentShown = false;
              deployNotificationModal(false, "Assignment Hidden!", userData.name +
                  "'s Secret Santa assignment has been hidden. The modal can now be opened again if desired.");
            };
          }
        }
      }
    } else {
      userSecretSanta.innerHTML = "<b>Secret Santa:</b> Unavailable";
      userSecretSantaBtn.innerHTML = "Secret Santa Button Unavailable";
      userSecretSantaBtn.onclick = function () {};
    }
  }
}

function fixUserDataToDB(userData) {
  let updatedUser = false;

  if (userData.lastLogin == "") {
    userData.lastLogin = "Never Logged In";
    firebase.database().ref("users/" + userData.uid).update({
      lastLogin: userData.lastLogin
    });
    logOutput("Updated " + userData.name + " Login");
    updatedUser = true;
  }
  if (userData.yearlyReview == 0) {
    userData.yearlyReview = commonToday.getFullYear() + "*";
    firebase.database().ref("users/" + userData.uid).update({
      yearlyReview: userData.yearlyReview
    });
    logOutput("Updated " + userData.name + " Review");
    updatedUser = true;
  }
  if (userData.lastPerformedAction == "") {
    userData.lastPerformedAction = "Upgraded Gifty Account";
    firebase.database().ref("users/" + userData.uid).update({
      lastPerformedAction: userData.lastPerformedAction
    });
    logOutput("Updated " + userData.name + " Action");
    updatedUser = true;
  }

  if (updatedUser) {
    let updatedUserIndex = findUIDItemInArr(userData.uid, userArr);
    if (updatedUserIndex != -1) {
      userArr[updatedUserIndex] = userData;
      saveCriticalCookies();
      logOutput("Saved changes locally.");
    }
  }

  return userData;
}

function resetUserPassword(userData) {
  let tempPasswordReturn = "";
  let maxPasswordLength = 4;
  let newEncodeStr;

  for (let i = 0; i <= maxPasswordLength; i++) {
    tempPasswordReturn += getRandomNumber();
  }

  newEncodeStr = encode(tempPasswordReturn);

  firebase.database().ref("users/" + userData.uid).update({
    encodeStr: newEncodeStr
  });

  updateMaintenanceLog(pageName, user.userName + " (" + user.uid + ") issued a password reset for " +
      userData.userName + " (" + userData.uid + "). The temporary password is \"" + tempPasswordReturn + "\". This password " +
      "is only temporary and will be removed from this log after 3 days!");

  return tempPasswordReturn;
}

function generateRelationshipDataList(userData) {
  let tempFamilyData = [];
  let tempIndex = 0;
  let parentList = userData.parentUser;
  let childList = userData.childUser;

  for (let i = 0; i < parentList.length; i++) {
    tempIndex = findUIDItemInArr(parentList[i], userArr);
    if (tempIndex != -1) {
      tempFamilyData.push("Parent -> " + userArr[tempIndex].name);
    }
  }
  for (let i = 0; i < childList.length; i++) {
    tempIndex = findUIDItemInArr(childList[i], userArr);
    if (tempIndex != -1) {
      tempFamilyData.push("Child -> " + userArr[tempIndex].name);
    }
  }

  if (tempFamilyData.length != 0) {
    generateUserDataViewModal(tempFamilyData, userData);
  } else {
    deployNotificationModal(true, "Family Relationships Load Error!", "There was " +
        "an issue loading the list of family relationships! Please try again...");
  }
}

function generateUserDataViewModal(dataToLoad, userData) {
  let dataToLoadType;
  let userUID = userData.uid;

  try {
    if (typeof dataToLoad[0] == "string" &&
        (dataToLoad[0].includes("Parent") || dataToLoad[0].includes("Child"))) {
      dataToLoadType = "Relationship";
    } else if (typeof dataToLoad[0] == "string" && !dataToLoad[0].includes("\",,,\"")) {
      dataToLoadType = "Friend";
    } else if (dataToLoad[0].data != undefined || dataToLoad[0].includes("\",,,\"")) {
      dataToLoadType = "Notification";
    } else {
      dataToLoadType = "Gift";
    }
  } catch (err) {
    dataToLoadType = "Gift";
  }

  userDataViewTitle.innerHTML = userData.name + "'s " + dataToLoadType + " List";
  userDataViewText.innerHTML = "<b>Total " + dataToLoadType + "s:</b> " + dataToLoad.length;

  closeModal(userModal);

  userDataViewBack.onclick = function() {
    closeModal(userDataViewModal);
    openModal(userModal, userUID);
  }

  closeUserDataViewModal.onclick = function() {
    closeModal(userDataViewModal);
  }

  openModal(userDataViewModal, userData.name + "'s " + dataToLoadType + " List");

  if (loadedUserDataViewArr.length != 0) {
    for (let a = 0; a < loadedUserDataViewArr.length; a++) {
      document.getElementById(loadedUserDataViewArr[a]).remove();
    }
    loadedUserDataViewArr = [];
  }

  try {
    testUserDataView.remove();
  } catch (err) {}

  for (let i = 0; i < dataToLoad.length; i++) {
    let liItem = document.createElement("LI");
    let textNode;
    let loadedUserDataViewElemID;

    liItem.className = "gift";

    if (dataToLoadType == "Friend") {
      let friendUserDataIndex = findUIDItemInArr(dataToLoad[i], userArr);
      let friendUserData = userArr[friendUserDataIndex];
      loadedUserDataViewElemID = dataToLoad[i];
      liItem.id = loadedUserDataViewElemID;
      textNode = document.createTextNode(friendUserData.name);
    } else if (dataToLoadType == "Relationship") {
      loadedUserDataViewElemID = dataToLoad[i];
      liItem.id = loadedUserDataViewElemID;
      textNode = document.createTextNode(dataToLoad[i]);
    } else if (dataToLoadType == "Notification") {
      let notificationReadData = dataToLoad[i].read;
      loadedUserDataViewElemID = dataToLoad[i].uid;
      liItem.id = loadedUserDataViewElemID;
      textNode = document.createTextNode(fetchNotificationTitle(dataToLoad[i]));

      if (userUID != user.uid) {
        if(notificationReadData == 1) {
          liItem.className += " checked";
        }
      }
    } else {
      let giftReceivedData = dataToLoad[i].received;
      let giftMultiples = dataToLoad[i].multiples;
      loadedUserDataViewElemID = dataToLoad[i].uid;
      liItem.id = loadedUserDataViewElemID;
      textNode = document.createTextNode(dataToLoad[i].title);

      if (userUID != user.uid) {
        if(giftReceivedData == 1) {
          liItem.className += " checked";
        } else if (giftMultiples != undefined) {
          if (giftMultiples && giftReceivedData < 0) {
            liItem.className += " multiCheck";
          }
        }
      }
    }

    liItem.appendChild(textNode);
    userDataViewListContainer.insertBefore(liItem, userDataViewListContainer.childNodes[0]);
    loadedUserDataViewArr.push(loadedUserDataViewElemID);
  }
}

function generateModerationTicketViewModal() {
  let viewedTicketElem;
  evaluateInitialTicketTimeline(moderationTicketViewLastTicket, moderationTicketViewOldestTicket);

  moderationTicketViewTitle.innerHTML = "Audit Log Ticket Preview";
  moderationTicketViewText.innerHTML = "<b>Total:</b> " + ticketArr.length + ", <b>New:</b> " + newTicketArr.length;

  moderationTicketViewNavigate.onclick = function() {
    navigation(17); //moderationQueue
  };

  closeModal(moderationTicketViewModal);

  closeModerationTicketViewModal.onclick = function() {
    if (viewedNewTicketArr.length > 0)
      for (let i = 0; i < viewedNewTicketArr.length; i++) {
        viewedTicketElem = document.getElementById("ticket_" + viewedNewTicketArr[i].uid)
        viewedTicketElem.className = "gift";
      }
    closeModal(moderationTicketViewModal);
  }

  openModal(moderationTicketViewModal, "moderationTicketPreviewModal");

  try {
    testModerationTicketView.remove();
  } catch (err) {}

  if (newTicketArr.length > 0) {
    viewedNewTicketArr = cloneArray(newTicketArr);
    newTicketArr = [];
    ticketCount.style.background = "#ff8e8e";
    ticketCount.onmouseover = function () {
      ticketCount.style.backgroundColor = "#ff4c4c";
    }
    ticketCount.onmouseout = function () {
      ticketCount.style.backgroundColor = "#ff8e8e";
    }
  }
}

function createQuickModerationTicketElem(ticketData) {
  let liItem = document.createElement("LI");
  let textNode;
  let loadedModerationTicketViewElemID;

  liItem.className = "gift";

  loadedModerationTicketViewElemID = "ticket_" + ticketData.uid;
  liItem.id = loadedModerationTicketViewElemID;
  textNode = document.createTextNode(fetchModerationTitle(ticketData));

  if (findUIDItemInArr(ticketData.uid, newTicketArr) != -1) {
    liItem.className += " lowSev";
  }

  liItem.appendChild(textNode);
  moderationTicketViewListContainer.insertBefore(liItem, moderationTicketViewListContainer.childNodes[0]);
  loadedModerationTicketViewArr.push(loadedModerationTicketViewElemID);
}

function changeQuickModerationTicketElem(ticketData) {
  let ticketTitleTextReturned;
  let editTicket = document.getElementById("ticket_" + ticketData.uid);

  ticketTitleTextReturned = fetchModerationTitle(ticketData);
  editTicket.innerHTML = ticketTitleTextReturned;
}

function removeQuickModerationTicketElem(ticketData) {
  let i = loadedModerationTicketViewArr.indexOf("ticket_" + ticketData.uid);
  if (i != -1) {
    loadedModerationTicketViewArr.splice(i, 1);
  }

  document.getElementById("ticket_" + ticketData.uid).remove();
}

function nukeQuickModerationTicketElem() {
  for (let i = 0; i < loadedModerationTicketViewArr.length; i++) {
    document.getElementById(loadedModerationTicketViewArr[i]).remove();
  }
}

function fetchNotificationTitle(notificationData) {
  let noteToParse = notificationData.data;
  let noteSplit;
  let noteParseError = false;
  try {
    noteSplit = noteToParse.split(",,,");
  } catch (err) {
    noteSplit = notificationData;
    noteParseError = true;
  }
  let noteSplitCount = 0;
  let adminPM = false;
  let globalPM = false;
  let friendUserData;
  let notificationDataTitle = "***Notification Load Error***";
  let notificationDetails;

  if (noteSplit.length >= 4 && !noteParseError) {
    for (let i = 0; i < noteSplit.length; i++) {
      noteSplit[i] = noteSplit[i].replaceAll("\"", "");
      if (noteSplit[i] != "") {
        noteSplitCount++;
      }
    }

    let senderUID = noteSplit[0];
    let deleterUID = noteSplit[1];
    let messageGiftTitle = noteSplit[2];
    let pageNameNote = noteSplit[3];

    if (senderUID.includes(">admin")) {
      if (senderUID.includes("Global")) {
        senderUID = senderUID.slice(12, senderUID.length);
        globalPM = true;
      } else {
        senderUID = senderUID.slice(6, senderUID.length);
        adminPM = true;
      }
    }

    let i = findUIDItemInArr(senderUID, userArr);
    if (i != -1) {
      friendUserData = userArr[i];

      if (noteSplitCount == 1) {//Type X, Invites
        notificationDataTitle = friendUserData.name + " has sent you a friend invite!";
        notificationDetails = friendUserData.name + " has sent you an invite to be added to each other's " +
            "friend lists. Accepting this invite will allow you to view each other's gift lists!";
      } else if (noteSplitCount == 2) {//Type W, Messages/Announcements
        notificationDetails = "\"" + messageGiftTitle + "\"";
        if (adminPM) {
          notificationDataTitle = friendUserData.name + " sent you an administrative message";
        } else if (globalPM) {
          notificationDataTitle = friendUserData.name + " sent an announcement!";
        } else {
          notificationDataTitle = friendUserData.name + " sent you a private message!";
        }
      } else if (noteSplitCount == 3) {//Type Y, Gift Updates/Gift Deletion (Public)
        if (pageNameNote == "friendList.html") {
          notificationDataTitle = friendUserData.name + " updated a gift you bought!";
          notificationDetails = friendUserData.name + "'s public gift, \"" + messageGiftTitle + "\", was updated!";
        } else if (pageNameNote == "privateFriendList.html") {
          notificationDataTitle = friendUserData.name + "'s private gift that you bought was updated!";
          notificationDetails = friendUserData.name + "'s private gift, \"" + messageGiftTitle + "\", was updated!";
        } else if (pageNameNote == "deleteGift") {
          notificationDataTitle = friendUserData.name + " deleted a gift you bought...";
          notificationDetails = "The gift you bought for " + friendUserData.name + ", \"" + messageGiftTitle + "\", was" +
              " deleted from their public gift list...";
        } else {
          logOutput("Notification Page Error, 1");
        }
      } else if (noteSplitCount == 4) {//Z, Gift Deletion (Private)
        let z = findUIDItemInArr(deleterUID, userArr);
        if (z != -1) {
          let deleterData = userArr[z];
          notificationDataTitle = deleterData.name + " deleted a private gift you bought...";
          notificationDetails = "The gift you bought for " + friendUserData.name + ", \"" + messageGiftTitle + "\", was" +
              " deleted by " + deleterData.name + " from " + friendUserData.name + "'s private gift list...";
        } else {
          logOutput("DeleterUID not found!");
        }
      } else {
        logOutput("Unknown Notification String Received...");
      }
    } else {
      logOutput("SenderUID not found for notification UID " + notificationData.uid);
      notificationDataTitle = "A Notification From A Deleted User!";
      if (noteSplitCount == 1) {
        notificationDetails = "This was related to an invitation to see their gift list, but the user no longer " +
            "exists. You can disregard and/or delete this notification."
      } else if (noteSplitCount == 2) {
        notificationDetails = "Here is the message that the deleted user sent you: \"" + messageGiftTitle + "\"";
      } else if (noteSplitCount == 3 || noteSplitCount == 4) {
        notificationDetails = "This was related to a gift that no longer exists. You can disregard and/or delete " +
            "this notification.";
      }
    }
  } else {
    if (noteSplit.data == undefined) {
      logOutput("Severely Deprecated Notification Format!");
      notificationDataTitle = "Deprecated Notification Format! Showing Unaltered Notification Data";
      notificationDetails = noteSplit;
    } else {
      logOutput("Deprecated Notification Format!");
      notificationDataTitle = "Deprecated Notification Format! Showing Unaltered Notification Data";
      notificationDetails = noteSplit.data.data;
    }
  }

  let notificationStringConcat = notificationDataTitle + " ---> " + notificationDetails;
  return notificationStringConcat;
}

function removeUserElement(uid) {
  document.getElementById("user" + uid).remove();
  let i = initializedUsers.indexOf(uid);
  initializedUsers.splice(i , 1);

  dataCounter--;
  if (dataCounter == 0){
    deployListEmptyNotification("No Users Found!");
  }
}

function initializeShowUserData(showDataSelection) {
  userListDropDown.innerHTML = "Show Quick Info (Current: " + showDataSelection + ")";
  userListDropDown.onclick = function() {
    initializeUserListDropdownOptions(false);
  };
}

function initializeUserListDropdownOptions(refreshBool) {
  let listOfShowUserElements = [showNone, showUID, showName, showLastLogin, showActions, showReview, showUserScore,
    showShareCode, showGifts, showFriends, showNotifications, showRelationships, showModerator, showSecretSanta,
    showFamilyAssignment, showCurrentSecretSanta, showLastSecretSanta];

  for (let i = 0; i < listOfShowUserElements.length; i++) {
    if (refreshBool) {
      if (showHideUserDataBool) {
        listOfShowUserElements[i].style.display = "block";
      } else {
        listOfShowUserElements[i].style.display = "none";
      }
    } else {
      if (showHideUserDataBool) {
        listOfShowUserElements[i].style.display = "none";
      } else {
        listOfShowUserElements[i].style.display = "block";
      }
    }
  }

  if (!refreshBool)
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
  showModerator.onclick = function(){
    updateDBWithShowUserData("Moderator");
  };
  showFamilyAssignment.onclick = function(){
    updateDBWithShowUserData("Family");
  };
  showSecretSanta.onclick = function(){
    updateDBWithShowUserData("SecretSanta");
  };
  showCurrentSecretSanta.onclick = function(){
    confirmOperation("Activate Current Secret Santa?", "Are you sure that you would like " +
        "to activate the \"Current Secret Santa\" quick view? If you are participating in a Secret Santa event, you " +
        "may have your Secret Santa spoiled!", "showCurrentSecretSanta", undefined,
        userOptionsModal, "userOptionsModal");
  }
  showLastSecretSanta.onclick = function(){
    updateDBWithShowUserData("LastSecretSanta");
  };


  if (user.hideExtraData == 0) {
    showActions.onclick = function(){
      updateDBWithShowUserData("Action");
    };
    showReview.onclick = function(){
      updateDBWithShowUserData("Review");
    };
    showGifts.onclick = function(){
      updateDBWithShowUserData("Gifts");
    };
    showFriends.onclick = function(){
      updateDBWithShowUserData("Friends");
    };
    showNotifications.onclick = function(){
      updateDBWithShowUserData("Notifications");
    };
    showRelationships.onclick = function(){
      updateDBWithShowUserData("Relationships");
    };
  } else {
    showActions.style.display = "none";
    showReview.style.display = "none";
    showGifts.style.display = "none";
    showFriends.style.display = "none";
    showNotifications.style.display = "none";
    showRelationships.style.display = "none";

    showActions.onclick = function(){};
    showReview.onclick = function(){};
    showGifts.onclick = function(){};
    showFriends.onclick = function(){};
    showNotifications.onclick = function(){};
    showRelationships.onclick = function(){};
  }
}

function updateDBWithShowUserData(listedUserDataInput) {
  firebase.database().ref("users/" + user.uid).update({
    listedUserData: listedUserDataInput
  });

  user.listedUserData = listedUserDataInput;
  saveCriticalCookies();
}

function updateInitializedUsers(){
  let tempElem;
  let userScoreHi = 0;
  let userScoreMid = 0;
  let userScoreLo = 0;
  let userScoreHiFactor = 0.3;
  let userScoreMidFactor = 0.6;
  let userScoreLoFactor = 0.9;

  for (let i = 0; i < userArr.length; i++) {
    if (userArr[i].userScore != undefined)
      if (userArr[i].userScore > userScoreHi) {
        userScoreHi = userArr[i].userScore;
      }
  }

  userScoreLo = userScoreHi - (userScoreHi * userScoreLoFactor);
  userScoreMid = userScoreHi - (userScoreHi * userScoreMidFactor);
  userScoreHi = userScoreHi - (userScoreHi * userScoreHiFactor);

  for (let i = 0; i < initializedUsers.length; i++) {
    tempElem = document.getElementById("user" + initializedUsers[i]);
    tempElem.className = "gift";
    tempElem.innerHTML = fetchUserData(initializedUsers[i]);
  }

  function fetchUserData(uid) {
    let userIndex = findUIDItemInArr(uid, userArr);
    let userData = userArr[userIndex];
    let userDataName = userData.name;
    let userDataString;
    let tempIndex = 0;
    let userFoundInFam = false;
    let userFamName = "";

    if (userData.ban == 1) {
      tempElem.className = "gift highSev";
      userDataString = userDataName + " - BANNED";
    } else if (userData.warn >= 1) {
      tempElem.className = "gift mediumSev";
      userDataString = userDataName + " - WARNED: " + userData.warn;
    } else {
      if (userData.ban == 0) {
        userDataString = userDataName;
      }
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

          if (userData.lastLogin == undefined) {
            userDataString = userDataName + " - No Log In Recorded";
          } else if (userData.lastLogin != "Never Logged In") {
            let today = new Date();
            let lastLoginDate = new Date(userData.lastLogin);
            let lastLoginDateTrimmed = getLocalTime(userData.lastLogin, true);
            let lastLoginDiff = Math.floor((today - lastLoginDate) / (1000 * 3600 * 24));
            userDataString = userDataName + " - " + lastLoginDateTrimmed;
            if (lastLoginDiff < 15) {
              tempElem.className += " lowSev";
            } else if (lastLoginDiff < 31) {
              tempElem.className += " mediumSev";
            } else if (lastLoginDiff < 61) {
              tempElem.className += " highSev";
            }
          } else {
            userDataString = userDataName + " - Never Logged In";
          }
          break;
        case "Action":
          if (userData.lastPerformedAction != undefined) {
            userDataString = userDataName + " - " + userData.lastPerformedAction;
            if (userData.lastPerformedAction.includes("Signed Out")) {
              tempElem.className += " lowSev";
            } else {
              tempElem.className += " highSev";
            }
          } else {
            userDataString = userDataName + " - No Actions Recorded";
          }
          break;
        case "Review":
          if (userData.yearlyReview == undefined)
            userData.yearlyReview = "";

          if (userData.yearlyReview == "") {
            userDataString = userDataName + " - No Yearly Review Recorded";
          } else {
            let tempYearlyReview = userData.yearlyReview.toString();
            if (tempYearlyReview.includes("*")) {
              userDataString = userDataName + " - Last Review: " + userData.yearlyReview.slice(0, 4) + " <i>(Dismissed Popup)</i>";
            } else {
              userDataString = userDataName + " - Last Review: " + userData.yearlyReview;
            }
          }
          break;
        case "Score":
          if (userData.userScore == undefined) {
            userData.userScore = 0;
            firebase.database().ref("users/" + userData.uid).update({
              userScore: 0
            });
          }

          userDataString = userDataName + " - " + userData.userScore;
          if (userData.userScore > userScoreHi) {
            tempElem.className += " highSev";
          } else if (userData.userScore > userScoreMid) {
            tempElem.className += " mediumSev";
          } else if (userData.userScore > userScoreLo) {
            tempElem.className += " lowSev";
          }
          break;
        case "Share":
          if (userData.shareCode == undefined) {
            userData.shareCode = "No Share Code Available!";
          }
          userDataString = userDataName + " - " + userData.shareCode;
          break;
        case "Gifts":
          if (userData.giftList == undefined)
            userData.giftList = [];
          if (userData.privateList == undefined)
            userData.privateList = [];
          userDataString = userDataName + " - # Public: " + userData.giftList.length + ", # Private: " + userData.privateList.length;
          break;
        case "Friends":
          userDataString = userDataName;
          if (userData.friends == undefined)
            userData.friends = [];

          if (userData.friends.length > 1) {
            userDataString = userDataName + " - " + userData.friends.length + " Friends";
          } else if (userData.friends.length == 1) {
            userDataString = userDataName + " - 1 Friend";
          }
          break;
        case "Notifications":
          if (userData.notifications == undefined)
            userData.notifications = [];
          userDataString = userDataName + " - # Notifications: " + userData.notifications.length;
          break;
        case "Relationships":
          let relationshipModifier = "";
          userDataString = userDataName;
          if (userData.parentUser == undefined)
            userData.parentUser = [];
          if (userData.childUser == undefined)
            userData.childUser = [];

          if (userData.childUser.length == 0 && userData.parentUser.length == 0) {
            userDataString = userDataName + " - No Relationships";
          } else if (userData.childUser.length != 0 && userData.parentUser.length == 0) {
            if (userData.childUser.length > 1)
              relationshipModifier = "ren";
            userDataString = userDataName + " - " + userData.childUser.length + " Child" + relationshipModifier;
          } else if (userData.childUser.length == 0 && userData.parentUser.length != 0) {
            if (userData.parentUser.length > 1)
              relationshipModifier = "s";
            userDataString = userDataName + " - " + userData.parentUser.length + " Parent" + relationshipModifier;
          } else {
            if (userData.parentUser.length > 1)
              relationshipModifier = "s";
            userDataString = userDataName + " - " + userData.parentUser.length + " Parent" + relationshipModifier;
            if (userData.childUser.length > 1)
              relationshipModifier = "ren";
            userDataString =+ ", " + userData.childUser.length + " Child" + relationshipModifier;
          }
          break;
        case "Moderator":
          userDataString = userDataName;
          if (userData.moderatorInt == 1) {
            userDataString = userDataName + " - Moderator";
            tempElem.className += " highSev";
          }
          break;
        case "Family":
          for (let i = 0; i < familyArr.length; i++) {
            if (familyArr[i].members != undefined)
              if (familyArr[i].members.includes(userData.uid)) {
                userFoundInFam = true;
                userFamName = familyArr[i].name;
                break;
              }
          }

          if (!userFoundInFam)
            userDataString = userDataName + " - No Family Found";
          else
            userDataString = userDataName + " - Family: \"" + userFamName + "\"";
          break;
        case "SecretSanta":
          userDataString = userDataName;
          if (userData.secretSanta == undefined)
            userData.secretSanta = 0;
          if (userData.secretSantaName == undefined)
            userData.secretSantaName = "";

          if (userData.secretSanta == 0) {
            userDataString = userDataName + " - Not Signed Up";
            tempElem.className += " highSev";
          } else if (userData.secretSanta == 1) {
            userDataString = userDataName + " - Signed Up";
            tempElem.className += " lowSev";
            if (userData.secretSantaName != "") {
              userDataString = userDataName + " - Signed Up (Assigned Name)";
            }
          }
          break;
        case "LastSecretSanta":
          if (userData.secretSantaNamePrior == undefined)
            userData.secretSantaNamePrior = "";

          if (userData.secretSantaNamePrior == "") {
            userDataString = userDataName + " - No Previous Assignments";
          } else {
            tempIndex = findUIDItemInArr(userData.secretSantaNamePrior, userArr);
            tempElem.className += " mediumSev";
            userDataString = userDataName + " - Previous Assignment: " + findFirstNameInFullName(userArr[tempIndex].name);
          }
          break;
        case "CurrentSecretSanta":
          if (userData.secretSantaName == undefined)
            userData.secretSantaName = "";

          if (userData.secretSantaName == "") {
            userDataString = userDataName + " - No Current Assignment";
          } else {
            tempIndex = findUIDItemInArr(userData.secretSantaName, userArr);
            tempElem.className += " lowSev";
            if (tempIndex != -1)
              userDataString = userDataName + " - Current Assignment: " + findFirstNameInFullName(userArr[tempIndex].name);
            else
              userDataString = userDataName + " - Current Assignment: " + userData.secretSantaName;
          }
          break;
        default:
          logOutput("Unknown User Data Input: " + localListedUserData);
          break;
      }
    }

    return userDataString;
  }
}

function initializeTicketCount(initializeInt) {//0 is initializing, 1 is updates
  let ticketCountString = "";

  if (initializeInt == 1 && ticketArr.length > 0) {
    ticketCount.style.background = "#3be357";
    ticketCount.onmouseover = function () {
      ticketCount.style.backgroundColor = "#3be357";
    }
    ticketCount.onmouseout = function () {
      ticketCount.style.backgroundColor = "#3be357";
    }
  }

  if (ticketArr.length == 0) {
    ticketCountString = "No Tickets!";
  } else if (ticketArr.length == 1) {
    ticketCountString = "1 Ticket";
  } else if (ticketArr.length > 1) {
    ticketCountString = ticketArr.length + " Tickets";
  }
  ticketCount.innerHTML = ticketCountString;
  ticketCount.onclick = function() {
    generateModerationTicketViewModal();
  };
}

function saveListedUserDataToCookie() {
  sessionStorage.setItem("localListedUserData", JSON.stringify(localListedUserData));
}

function saveTicketArrToCookie(){
  sessionStorage.setItem("ticketArr", JSON.stringify(ticketArr));
  initializeTicketCount(1);
}

function manuallyOptInOut(userData, userFamilyData) {
  if (userFamilyData == undefined) {
    deployNotificationModal(true, "Opt In Failed!",
        findFirstNameInFullName(userData.name) + " is not assigned to a family! Secret Santa cannot be opted " +
        "in without an accompanying family.", 10);
    return;
  }

  if (userData.secretSanta == null)
    userData.secretSanta = 0;

  if (userFamilyData.secretSantaState != 2) {
    deployNotificationModal(true, "Opt In Failed!",
        findFirstNameInFullName(userData.name) + "'s assigned family is not in the correct state! Their " +
        "family (" + familyArr[i].name + "), must be in the \"Ready\" state in order to opt users in manually.", 10);
    return;
  }

  if (userData.secretSanta == 0) {
    firebase.database().ref("users/" + userData.uid).update({
      secretSanta: 1
    });
    deployNotificationModal(false, "Opt In Success!",
        userData.name + " has been manually opted in to the Secret Santa Program!");
  } else {
    firebase.database().ref("users/" + userData.uid).update({
      secretSanta: 0
    });
    deployNotificationModal(false, "Opt Out Success!",
        userData.name + " has been manually opted out of the Secret Santa Program!");
  }
  userUpdateLocal = false;
}
