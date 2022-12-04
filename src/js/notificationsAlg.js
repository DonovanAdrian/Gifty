/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let notificationsElements = [];
let userArr = [];
let inviteArr = [];
let notificationArr = [];
let notificationKeyArr = [];
let oldNotificationArr = [];
let listeningFirebaseRefs = [];
let initializedNotifications = [];

let notificationListEmptyBool = false;
let notificationDeleteLocal = false;
let potentialRemoval = false;
let noteErrorBool = false;

let dataCounter = 0;
let commonLoadingTimerInt = 0;

let dataListContainer;
let nukeNotifications;
let offlineSpan;
let offlineModal;
let user;
let userBase;
let userReadNotifications;
let userNotifications;
let userInvites;
let noteViewModal;
let inviteNote;
let commonLoadingTimer;
let offlineTimer;
let notificationModal;
let privateMessageModal;
let notificationInfo;
let notificationTitle;
let noteSpan;
let testData;
let closeNoteViewModal;
let notificationViewTitle;
let notificationViewDetails;
let notificationViewPage;
let notificationViewDelete;
let privateMessageSpan;
let privateMessageInp;
let sendMsg;
let cancelMsg;



function getCurrentUser(){
  getCurrentUserCommon();

  if(user.notifications == undefined) {
    if(consoleOutput)
      console.log("Notifications Not Found");
    deployListEmptyNotification("No Notifications Found!");
    initializeNukeBtn();
    notificationListEmptyBool = true;
  }
}

window.onload = function instantiate() {
  pageName = "Notifications";
  dataListContainer = document.getElementById('dataListContainer');
  nukeNotifications = document.getElementById('nukeNotifications');
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  inviteNote = document.getElementById('inviteNote');
  notificationModal = document.getElementById('notificationModal');
  notificationTitle = document.getElementById('notificationTitle');
  notificationInfo = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  privateMessageModal = document.getElementById('privateMessageModal');
  noteViewModal = document.getElementById('noteViewModal');
  testData = document.getElementById('testData');
  closeNoteViewModal = document.getElementById('closeNoteViewModal');
  notificationViewTitle = document.getElementById('notificationViewTitle');
  notificationViewDetails = document.getElementById('notificationViewDetails');
  notificationViewPage = document.getElementById('notificationViewPage');
  notificationViewDelete = document.getElementById('notificationViewDelete');
  privateMessageSpan = document.getElementById('privateMessageSpan');
  privateMessageInp = document.getElementById('privateMessageInp');
  sendMsg = document.getElementById('sendMsg');
  cancelMsg = document.getElementById('cancelMsg');
  notificationsElements = [dataListContainer, nukeNotifications, offlineModal, offlineSpan, inviteNote,
    notificationModal, notificationTitle, notificationInfo, noteSpan, privateMessageModal, noteViewModal, testData,
    closeNoteViewModal, notificationViewTitle, notificationViewDetails, notificationViewPage, notificationViewDelete,
    privateMessageSpan, privateMessageInp, sendMsg, cancelMsg];

  getCurrentUser();
  commonInitialization();
  verifyElementIntegrity(notificationsElements);

  userBase = firebase.database().ref("users/");
  userReadNotifications = firebase.database().ref("users/" + user.uid + "/readNotifications");
  userNotifications = firebase.database().ref("users/" + user.uid + "/notifications");
  userInvites = firebase.database().ref("users/" + user.uid + "/invites");

  databaseQuery();

  function databaseQuery() {
    let fetchReadNotifications = function (postRef){
      postRef.on('child_added', function (data) {
        firebase.database().ref("users/" + user.uid + "/readNotifications/").remove();
      });
    }

    let fetchNotifications = function (postRef) {
      postRef.on('child_added', function (data) {
        if (data.val().uid != undefined) {
          notificationArr.push(data.val());
          notificationKeyArr.push(data.val().uid);
          createNotificationElement(data.val(), data.key);
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
      });

      postRef.on('child_changed', function (data) {
        console.log("Changed Notification" + data.val().uid + " " + data.val().read);
        notificationArr[data.key] = data.val();
        changeNotificationElement(data.val(), data.key);
      });

      postRef.on('child_removed', function (data) {
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
          inviteNote.style.background = "#008222";
        }
      });
    };

    let fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        let i = findUIDItemInArr(data.key, userArr, true);
        if(userArr[i] != data.val() && i != -1){
          userArr[i] = data.val();
        } else {
          userArr.push(data.val());
        }

        if(data.key == user.uid){
          user = data.val();
        }
      });

      postRef.on('child_changed', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          if(consoleOutput)
            console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
          userArr[i] = data.val();
        }

        if(data.key == user.uid){
          user = data.val();
          updateFriendNav(user.friends);
          notificationArr = user.notifications;
          if (potentialRemoval) {
            findRemovedNotification(oldNotificationArr, notificationArr);
            potentialRemoval = false;
          }
          if(consoleOutput)
            console.log("Current User Updated");
        }
      });

      postRef.on('child_removed', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          if(consoleOutput)
            console.log("Removing " + userArr[i].userName + " / " + data.val().userName);
          userArr.splice(i, 1);
        }
      });
    };

    fetchReadNotifications(userReadNotifications);
    fetchNotifications(userNotifications);
    fetchInvites(userInvites);
    fetchData(userBase);

    listeningFirebaseRefs.push(userNotifications);
    listeningFirebaseRefs.push(userInvites);
    listeningFirebaseRefs.push(userBase);
  }

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
        noteSplit[i] = noteSplit[i].replaceAll('"', '');
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

      let i = findUIDItemInArr(senderUID, userArr, true);
      if (i != -1) {
        friendUserData = userArr[i];

        if (noteSplitCount == 1) {//Type X, Invites
          notificationDataTitle = friendUserData.name + " has sent you a friend invite!";
          notificationDetails = friendUserData.name + " has sent you an invite to be added to each other's " +
              "friend lists. Accepting this invite will allow you to view each other's gift lists!";
          notificationPage = "invites.html";
        } else if (noteSplitCount == 2) {//Type W, Messages/Announcements
          notificationDetails = messageGiftTitle;
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
            notificationDetails = friendUserData.name + "'s public gift, " + messageGiftTitle + ", was updated!";
          } else if (pageNameNote == "privateFriendList.html") {
            notificationDataTitle = friendUserData.name + "\'s private gift that you bought was updated!";
            notificationDetails = friendUserData.name + "'s private gift, " + messageGiftTitle + ", was updated!";
          } else if (pageNameNote == "deleteGift") {
            notificationDataTitle = friendUserData.name + " deleted a gift you bought...";
            notificationDetails = "The gift you bought for " + friendUserData.name + ", " + messageGiftTitle + ", was" +
                " deleted from their public gift list...";
          } else {
            if (consoleOutput)
              console.log("Notification Page Error, 1");
            notificationPage = "noteERROR";
          }
          if (notificationPage != "noteError") {
            notificationPage = pageNameNote;
          }
        } else if (noteSplitCount == 4) {//Z, Gift Deletion (Private)
          let z = findUIDItemInArr(deleterUID, userArr, true);
          if (z != -1) {
            let deleterData = userArr[z];
            notificationDataTitle = deleterData.name + " deleted a private gift you bought...";
            notificationDetails = "The gift you bought for " + friendUserData.name + ", " + messageGiftTitle + ", was" +
                " deleted by " + deleterData.name + " from " + friendUserData.name + "'s private gift list...";
            notificationPage = pageNameNote;
          } else {
            if (consoleOutput)
              console.log("DeleterUID not found!");
            notificationPage = "noteERROR";
          }
        } else {
          if (consoleOutput)
            console.log("Unknown Notification String Received...");
          notificationPage = "noteERROR";
        }
        initNotificationElement(liElem, notificationPage, notificationData, notificationDataTitle,
            notificationDetails, friendUserData, noteKey);
      } else {
        if (consoleOutput)
          console.log("SenderUID not found!");
        notificationPage = "noteErrorUser";
        initNotificationElement(liElem, notificationPage, notificationData);
      }
    } else {
      if (consoleOutput)
        console.log("Deprecated Notification Format!");
      notificationPage = "noteErrorLegacy";
      initNotificationElement(liElem, notificationPage, notificationData);
    }

    if (createBool) {
      let textNode = document.createTextNode(notificationDataTitle);
      liElem.appendChild(textNode);
      dataListContainer.insertBefore(liElem, dataListContainer.childNodes[0]);
      clearInterval(commonLoadingTimer);
      clearInterval(offlineTimer);

      if (dataCounter < 1) {
        initializeNukeBtn();
      }
      dataCounter++;
      initializedNotifications.push(notificationData.uid);
    } else {
      liElem.innerHTML = notificationDataTitle;
    }
  }

  function createNotificationElement(notificationData, notificationKey){
    try {
      testData.remove();
    } catch (err) {}

    let liItem = document.createElement("LI");
    liItem.id = "notification" + notificationData.uid;
    fetchNotificationData(true, liItem, notificationData, notificationKey);
  }

  function changeNotificationElement(notificationData, notificationKey){
    try {
      testData.remove();
    } catch (err) {}

    let liItemUpdate = document.getElementById('notification' + notificationData.uid);
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
        notificationViewPage.innerHTML = "To reply to this message, click here!";
        notificationViewPage.onclick = function(){
          generatePrivateMessageDialog(friendUserData);
        };
      } else if (notificationPage == "globalNotification"){
        notificationViewPage.innerHTML = "Please send a message to a moderator if there are any questions or concerns.";
        notificationViewPage.onclick = function(){};
      } else if (notificationPage == "invites.html") {
        notificationViewPage.innerHTML = "Click here to access your invites!";
        notificationViewPage.onclick = function () {
          navigation(11);//Confirmation
        };
      } else if (notificationPage == "friendList.html" && friendUserData != -1) {
        notificationViewPage.innerHTML = "Click here to access their friend list!";
        notificationViewPage.onclick = function () {
          sessionStorage.setItem("validGiftUser", JSON.stringify(friendUserData));
          navigation(9);//FriendList
        };
      } else if (notificationPage == "privateFriendList.html" && friendUserData != -1) {
        notificationViewPage.innerHTML = "Click here to access their private friend list!";
        notificationViewPage.onclick = function () {
          sessionStorage.setItem("validGiftUser", JSON.stringify(friendUserData));
          navigation(10);//PrivateFriendList
        };
      } else if (notificationPage == "deleteGift") {
        notificationViewPage.innerHTML = "If this has been done in error, please contact the gift owner.";
        notificationViewPage.onclick = function () {};
      } else if (notificationPage == "deleteGiftPrivate") {
        notificationViewPage.innerHTML = "If this has been done in error, please contact the person who deleted " +
            "the gift.";
        notificationViewPage.onclick = function () {};
      } else {
        if(consoleOutput)
          console.log("Notification Page Error, 2");
        notificationViewPage.innerHTML = "Alternatively, send an email to Gifty support on the Settings > FAQ page!";
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

          updateMaintenanceLog("notifications", "The user " + user.userName + " has opened their warning");
        }
      }
    };
  }

  function generatePrivateMessageDialog(userData) {
    let message = "";

    privateMessageInp.placeholder = "Hey! Just to let you know...";

    sendMsg.onclick = function (){
      message = generatePrivateMessage(user.uid, privateMessageInp.value);
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

  function generatePrivateMessage(userUID, message){
    return userUID + "@#$:" + message;
  }

  function addPrivateMessageToDB(userData, message) {
    let userNotificationArr = [];
    if(userData.notifications == undefined){
      userNotificationArr = [];
    } else {
      userNotificationArr = userData.notifications;
    }
    userNotificationArr.push(message);

    if(userData.notifications == undefined) {
      firebase.database().ref("users/" + userData.uid).update({notifications:{0:message}});
    } else {
      firebase.database().ref("users/" + userData.uid).update({
        notifications: userNotificationArr
      });
    }
  }

  function deleteNotification(uid) {
    let verifyDeleteBool = true;
    let toDelete = -1;

    if(consoleOutput)
      console.log("Deleting " + uid);

    toDelete = findUIDItemInArr(uid, notificationArr, true);
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

      user.notifications = notificationArr;

      firebase.database().ref("users/" + user.uid).update({
        notifications: notificationArr
      });

      removeNotificationElement(uid);
      notificationDeleteLocal = false;
    } else {
      deployNotificationModal(true, "Delete Error!", "Notification Not Deleted, Please Try Again!");
      updateMaintenanceLog("notifications", "Notification delete failed for user " + user.userName + ". It's UID is " + uid);
    }
  }

  function removeNotificationElement(uid) {
    document.getElementById('notification' + uid).remove();

    dataCounter--;
    if (dataCounter == 0){
      deployListEmptyNotification("No Notifications Found!");
      initializeNukeBtn();
    }
  }
};

function initializeNukeBtn() {
  if (notificationArr.length > 0) {
    if (!noteErrorBool) {
      nukeNotifications.innerHTML = "Remove All Notifications";
      nukeNotifications.onclick = function () {
        firebase.database().ref("users/" + user.uid + "/notifications/").remove();

        notificationArr = [];
        navigation(2);//Home
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
