/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let notificationsElements = [];
let notificationArr = [];
let notificationKeyArr = [];
let oldNotificationArr = [];
let initializedNotifications = [];

let notificationListEmptyBool = false;
let notificationDeleteLocal = false;
let potentialRemoval = false;
let noteErrorBool = false;

let nukeNotifications;
let noteViewModal;
let privateMessageModal;
let closeNoteViewModal;
let notificationViewTitle;
let notificationViewDetails;
let notificationViewPage;
let notificationViewDelete;
let privateMessageSpan;
let privateMsgTitle;
let privateMessageInp;
let sendMsg;
let cancelMsg;
let confirmModal;
let closeConfirmModal;
let confirmTitle;
let confirmContent;
let confirmBtn;
let denyBtn;



function getCurrentUser(){
  getCurrentUserCommon();
  failedNavNum = 6;

  if(user.notifications == undefined) {
    logOutput("Notifications Not Found");
    deployListEmptyNotification("No Notifications Found!");
    initializeNukeBtn();
    notificationArr = [];
    notificationListEmptyBool = true;
  } else {
    if (user.notifications[0].uid != undefined) {
      notificationArr = user.notifications;
      for (let i = 0; i < user.notifications.length; i++) {
        createNotificationElement(user.notifications[i], i);
        notificationKeyArr.push(user.notifications[i].uid);
      }
    }
  }
}

window.onload = function instantiate() {
  try {
    pageName = "Notifications";
    nukeNotifications = document.getElementById("nukeNotifications");
    inviteNote = document.getElementById("inviteNote");
    privateMessageModal = document.getElementById("privateMessageModal");
    noteViewModal = document.getElementById("noteViewModal");
    closeNoteViewModal = document.getElementById("closeNoteViewModal");
    notificationViewTitle = document.getElementById("notificationViewTitle");
    notificationViewDetails = document.getElementById("notificationViewDetails");
    notificationViewPage = document.getElementById("notificationViewPage");
    notificationViewDelete = document.getElementById("notificationViewDelete");
    privateMessageSpan = document.getElementById("privateMessageSpan");
    privateMsgTitle = document.getElementById("privateMsgTitle");
    privateMessageInp = document.getElementById("privateMessageInp");
    sendMsg = document.getElementById("sendMsg");
    cancelMsg = document.getElementById("cancelMsg");
    confirmModal = document.getElementById("confirmModal");
    closeConfirmModal = document.getElementById("closeConfirmModal");
    confirmTitle = document.getElementById("confirmTitle");
    confirmContent = document.getElementById("confirmContent");
    confirmBtn = document.getElementById("confirmBtn");
    denyBtn = document.getElementById("denyBtn");

    getCurrentUser();
    commonInitialization();

    notificationsElements = [dataListContainer, nukeNotifications, offlineModal, offlineSpan, inviteNote,
      notificationModal, notificationTitle, notificationInfo, noteSpan, privateMessageModal, noteViewModal, testData,
      closeNoteViewModal, notificationViewTitle, notificationViewDetails, notificationViewPage, notificationViewDelete,
      privateMessageSpan, privateMsgTitle, privateMessageInp, sendMsg, cancelMsg, confirmModal, closeConfirmModal,
      confirmTitle, confirmContent, confirmBtn, denyBtn];

    verifyElementIntegrity(notificationsElements);

    userInitial = firebase.database().ref("users/");
    userReadNotifications = firebase.database().ref("users/" + user.uid + "/readNotifications");
    userNotifications = firebase.database().ref("users/" + user.uid + "/notifications");
    userInvites = firebase.database().ref("users/" + user.uid + "/invites");

    databaseQuery();
  } catch (err) {
    sendCriticalInitializationError(err);
  }

  function databaseQuery() {
    let fetchReadNotifications = function (postRef){
      postRef.on("child_added", function () {
        firebase.database().ref("users/" + user.uid + "/readNotifications/").remove();
      });
    }

    let fetchNotifications = function (postRef) {
      postRef.on("child_added", function (data) {
        if (data.val().uid != undefined) {
          if (notificationKeyArr.indexOf(data.val().uid) == -1) {
            notificationArr.push(data.val());
            notificationKeyArr.push(data.val().uid);
            createNotificationElement(data.val(), data.key);
          }
        } else {
          let newUid = generateNewNoteUID(data.key, data.val());
          notificationArr.push(data.val());
          notificationKeyArr.push(newUid);
          let notificationData = {
            data: data.val(),
            read: 0,
            uid: newUid
          };
          createNotificationElement(notificationData, data.key);
        }
        user.notifications = notificationArr;
        saveCriticalCookies();
      });

      postRef.on("child_changed", function (data) {
        notificationArr[data.key] = data.val();
        changeNotificationElement(data.val(), data.key);
        user.notifications = notificationArr;
        saveCriticalCookies();
      });

      postRef.on("child_removed", function () {
        if (!notificationDeleteLocal) {
          potentialRemoval = true;
          oldNotificationArr = [];
          for (let i = 0; i < notificationArr.length; i++) {
            oldNotificationArr.push(notificationArr[i]);
          }
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
          inviteNote.style.background = "#008222";
        }
      });
    };

    let fetchData = function (postRef) {
      postRef.on("child_added", function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if (i != -1) {
          localObjectChanges = findObjectChanges(userArr[i], data.val());
          if (localObjectChanges.length != 0) {
            userArr[i] = data.val();

            if (data.key == user.uid) {
              user = data.val();
              updateFriendNav(user.friends);
            }
            saveCriticalCookies();
          }
        } else {
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
            userArr[i] = data.val();

            if(data.key == user.uid){
              user = data.val();
              updateFriendNav(user.friends);
              notificationArr = user.notifications;
              if (potentialRemoval) {
                findRemovedNotification(oldNotificationArr, notificationArr);
                potentialRemoval = false;
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
        }
      });
    };

    fetchReadNotifications(userReadNotifications);
    fetchNotifications(userNotifications);
    fetchInvites(userInvites);
    fetchData(userInitial);

    listeningFirebaseRefs.push(userNotifications);
    listeningFirebaseRefs.push(userInvites);
    listeningFirebaseRefs.push(userInitial);
  }
};

function findRemovedNotification(oldArr, newArr) {
  let removedNotificationIndex = -1;

  removedNotificationIndex = findRemovedData(oldArr, newArr);
  if (removedNotificationIndex != -1) {
    removeNotificationElement(oldArr[removedNotificationIndex].uid);
    let i = initializedNotifications.indexOf(oldArr[removedNotificationIndex].uid);
    initializedNotifications.splice(i, 1);
    oldNotificationArr.splice(removedNotificationIndex, 1);
  }
}

function fetchNotificationData(createBool, liElem, notificationData, noteKey) {
  let noteToParse = notificationData.data;
  let noteSplit = noteToParse.split(",,,");
  let noteSplitCount = 0;
  let adminPM = false;
  let globalPM = false;
  let friendUserData;
  let notificationDataTitle = "***Notification Load Error***";
  let notificationDetails;
  let notificationPage;

  if (noteSplit.length >= 4) {
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
        notificationPage = "invites.html";
      } else if (noteSplitCount == 2) {//Type W, Messages/Announcements
        notificationDetails = "\"" + messageGiftTitle + "\"";
        if (adminPM) {
          notificationDataTitle = friendUserData.name + " sent you an administrative message";
          notificationPage = "privateMessage";
        } else if (globalPM) {
          notificationDataTitle = friendUserData.name + " sent an announcement!";
          notificationPage = "globalNotification";
        } else {
          notificationDataTitle = friendUserData.name + " sent you a private message!";
          notificationPage = "privateMessage";
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
          notificationPage = "noteERROR";
        }
        if (notificationPage != "noteError") {
          notificationPage = pageNameNote;
        }
      } else if (noteSplitCount == 4) {//Z, Gift Deletion (Private)
        let z = findUIDItemInArr(deleterUID, userArr);
        if (z != -1) {
          let deleterData = userArr[z];
          notificationDataTitle = deleterData.name + " deleted a private gift you bought...";
          notificationDetails = "The gift you bought for " + friendUserData.name + ", \"" + messageGiftTitle + "\", was" +
              " deleted by " + deleterData.name + " from " + friendUserData.name + "'s private gift list...";
          notificationPage = pageNameNote;
        } else {
          logOutput("DeleterUID not found!");
          notificationPage = "noteERROR";
        }
      } else {
        logOutput("Unknown Notification String Received...");
        notificationPage = "noteERROR";
      }
      initNotificationElement(liElem, notificationPage, notificationData, notificationDataTitle,
          notificationDetails, friendUserData, noteKey);
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
      notificationPage = "noteErrorUser";
      initNotificationElement(liElem, notificationPage, notificationData, notificationDataTitle,
          notificationDetails, undefined, noteKey);
    }
  } else {
    logOutput("Deprecated Notification Format!");
    notificationPage = "noteErrorLegacy";
    initNotificationElement(liElem, notificationPage, notificationData);
  }

  if (createBool) {
    let textNode = document.createTextNode(notificationDataTitle);
    liElem.appendChild(textNode);
    dataListContainer.insertBefore(liElem, dataListContainer.childNodes[0]);
    clearInterval(commonLoadingTimer);
    clearInterval(offlineTimer);

    initializeNukeBtn();
    dataCounter++;
    initializedNotifications.push(notificationData.uid);
  } else {
    liElem.innerHTML = notificationDataTitle;
  }
}

function createNotificationElement(notificationData, notificationKey){
  if (initializedNotifications.indexOf(notificationData.uid) == -1) {
    try {
      testData.remove();
    } catch (err) {}

    let liItem = document.createElement("LI");
    liItem.id = "notification" + notificationData.uid;
    fetchNotificationData(true, liItem, notificationData, notificationKey);
  } else {
    changeNotificationElement(notificationData, notificationKey);
  }
}

function changeNotificationElement(notificationData, notificationKey){
  try {
    testData.remove();
  } catch (err) {}

  let liItemUpdate = document.getElementById("notification" + notificationData.uid);
  if (liItemUpdate != undefined) {
    fetchNotificationData(false, liItemUpdate, notificationData, notificationKey);
  }
}

function initNotificationElement(liItem, notificationPage, notificationData, notificationElemTitle,
                                 notificationDetails, friendUserData, noteKey) {
  let warningCount;
  liItem.className = "gift";

  if (noteKey != null) {
    if (notificationData.read == 1) {
      liItem.className += " checked";
    }
  } else {
    liItem.className += " highSev";
  }

  liItem.onclick = function () {
    if (noteKey != null) {
      notificationViewTitle.innerHTML = notificationElemTitle;
      notificationViewDetails.innerHTML = notificationDetails;
    } else {
      if (notificationPage == "noteErrorUser") {
        notificationViewTitle.innerHTML = "Notification From A Deleted User";
        notificationViewDetails.innerHTML = "Unfortunately the user that sent this notification deleted their profile...";
      } else if (notificationPage == "noteErrorLegacy") {
        if (!noteErrorBool) {
          noteErrorBool = true;
          initializeNukeBtn();
        }
      }
    }
    if (notificationPage == "privateMessage" && friendUserData != -1) {
      notificationViewPage.innerHTML = "<b>To reply to this message, click here!</b>";
      notificationViewPage.onclick = function(){
        generatePrivateMessageDialog(friendUserData);
      };
    } else if (notificationPage == "globalNotification"){
      notificationViewPage.innerHTML = "<i>Please send a message to a moderator if there are any questions or concerns.</i>";
      notificationViewPage.onclick = function(){};
    } else if (notificationPage == "invites.html") {
      notificationViewPage.innerHTML = "<b>Click here to access your invites!</b>";
      notificationViewPage.onclick = function () {
        navigation(11);//Confirmation
      };
    } else if (notificationPage == "friendList.html" && friendUserData != -1) {
      notificationViewPage.innerHTML = "<b>Click here to access their friend list!</b>";
      notificationViewPage.onclick = function () {
        sessionStorage.setItem("validGiftUser", JSON.stringify(friendUserData));
        navigation(9);//FriendList
      };
    } else if (notificationPage == "privateFriendList.html" && friendUserData != -1) {
      notificationViewPage.innerHTML = "<b>Click here to access their private friend list!</b>";
      notificationViewPage.onclick = function () {
        sessionStorage.setItem("validGiftUser", JSON.stringify(friendUserData));
        navigation(10);//PrivateFriendList
      };
    } else if (notificationPage == "deleteGift") {
      notificationViewPage.innerHTML = "<i>If this has been done in error, please contact the gift owner.</i>";
      notificationViewPage.onclick = function () {};
    } else if (notificationPage == "deleteGiftPrivate") {
      notificationViewPage.innerHTML = "<i>If this has been done in error, please contact the person who deleted " +
          "the gift.</i>";
      notificationViewPage.onclick = function () {};
    } else {
      logOutput("Notification Page Error, 2");
      notificationViewPage.innerHTML = "<i>Alternatively, send an email to Gifty support on the Settings > FAQ page!</i>";
      notificationViewPage.onclick = function () {
        navigation(12);//FAQ
      };
    }

    if (notificationPage == "noteErrorLegacy") {
      notificationViewDelete.onclick = function () {
        deployNotificationModal(true, "Delete Function Unavailable!",
            "There is an error within your notification, please contact a moderator to clear your notifications.");
      };
    } else {
      notificationViewDelete.onclick = function () {
        deleteNotification(notificationData.uid);
        closeModal(noteViewModal);
      };
    }

    openModal(noteViewModal, notificationData.uid);

    closeNoteViewModal.onclick = function () {
      closeModal(noteViewModal);
    };

    if (notificationData.read == 0) {
      firebase.database().ref("users/" + user.uid + "/notifications/" + noteKey).update({
        read: 1
      });

      if (notificationElemTitle == "New Message From An Administrator!") {
        warningCount = user.warn;

        if (warningCount > 0) {
          warningCount = warningCount - 1;
        }

        firebase.database().ref("users/" + user.uid).update({
          warn: warningCount
        });

        updateMaintenanceLog("notifications", "The user \"" + user.userName + "\" has opened their warning");
      }
    }
  };
}

function generatePrivateMessageDialog(userData) {
  let message = "";

  privateMsgTitle.innerHTML = "Send A Private Message To " + findFirstNameInFullName(userData.name) + " Below";
  privateMessageInp.placeholder = "Hey! Just to let you know...";

  sendMsg.onclick = function (){
    message = generateNotificationString(user.uid, "", privateMessageInp.value, "");
    addPrivateMessageToDB(userData, message);
    privateMessageInp.value = "";
    closeModal(privateMessageModal);
  };
  cancelMsg.onclick = function (){
    privateMessageInp.value = "";
    closeModal(privateMessageModal);
  };

  openModal(privateMessageModal, "addGlobalMsgModal");

  privateMessageSpan.onclick = function() {
    closeModal(privateMessageModal);
  };
}

function addPrivateMessageToDB(userData, message) {
  updateUserScore(user, sendPrivateMessageScore);

  closeModal(privateMessageModal);
  addNotificationToDB(userData, message);
  successfulDBOperationTitle = "Message Sent!";
  successfulDBOperationNotice = "Your message to " + userData.userName + " was successfully delivered!";
  showSuccessfulDBOperation = true;
}

function deleteNotification(uid) {
  let verifyDeleteBool = true;
  let toDelete = -1;

  logOutput("Deleting " + uid);

  toDelete = findUIDItemInArr(uid, notificationArr);
  if (toDelete != -1) {
    notificationArr.splice(toDelete, 1);
    notificationKeyArr.splice(toDelete, 1);

    for (let i = 0; i < notificationArr.length; i++) {
      if (notificationArr[i] == notificationArr[uid]) {
        verifyDeleteBool = false;
      }
    }
  } else {
    verifyDeleteBool = false;
  }

  if(verifyDeleteBool) {
    let i = initializedNotifications.indexOf(uid);
    initializedNotifications.splice(i, 1);
    notificationDeleteLocal = true;
    removeNotificationElement(uid);

    user.notifications = notificationArr;

    firebase.database().ref("users/" + user.uid).update({
      notifications: notificationArr
    });

    successfulDBOperationTitle = "Notification Deleted";
    successfulDBOperationNotice = "Notification Successfully Deleted!";
    showSuccessfulDBOperation = true;
    listenForDBChanges("NoteDelete", uid);
    notificationDeleteLocal = false;
  } else {
    deployNotificationModal(true, "Delete Error!", "Notification Not Deleted, Please Try Again!");
    updateMaintenanceLog("notifications", "Notification delete failed for user \"" + user.userName + "\". It's UID is \"" + uid + "\"");
  }
}

function removeNotificationElement(uid) {
  document.getElementById("notification" + uid).remove();

  dataCounter--;
  if (dataCounter == 0){
    deployListEmptyNotification("No Notifications Found!");
    initializeNukeBtn();
  }
}

function initializeNukeBtn() {
  if (notificationArr == undefined)
    notificationArr = [];

  if (notificationArr.length > 0) {
    if (!noteErrorBool) {
      nukeNotifications.innerHTML = "Remove All Notifications";
      nukeNotifications.onclick = function () {
        confirmOperation("Are You Sure?", "This will remove ALL of your notifications. This " +
            "cannot be undone. Are you sure?");
      };
    } else {
      nukeNotifications.innerHTML = "Notification Removal Disabled!";
      nukeNotifications.onclick = function () {
        deployNotificationModal(false, "Deleting Notifications Unavailable!",
            "There is an error within your notifications, please contact a moderator to clear your notifications.");
      };
    }
  } else {
    nukeNotifications.innerHTML = "No Notifications To Remove!";
    nukeNotifications.onclick = function() {};
  }
}

function confirmOperation(operationTitle, operationContent) {
  confirmTitle.innerHTML = operationTitle;
  confirmContent.innerHTML = operationContent;

  confirmBtn.onclick = function() {
    firebase.database().ref("users/" + user.uid + "/notifications/").remove();

    for (let i = 0; i < initializedNotifications.length; i++) {
      removeNotificationElement(initializedNotifications[i]);
    }

    notificationArr = [];
    initializedNotifications = [];
    deployNotificationModal(false, "All Notifications Successfully Removed!",
        "All of your notifications have been successfully removed. You will now be redirected to the Home page.",
        5, 2); //Home
  };

  denyBtn.onclick = function() {
    closeModal(confirmModal);
  }

  openModal(confirmModal, "confirmModal", true);

  closeConfirmModal.onclick = function() {
    closeModal(confirmModal);
  };

  window.onclick = function(event) {
    if (event.target == confirmModal) {
      closeModal(confirmModal);
    }
  };
}
