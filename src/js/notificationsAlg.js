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
let readNotificationArr = [];
let listeningFirebaseRefs = [];

let notificationListEmptyBool = false;
let settingReadNotifications = false;
let noteErrorBool = false;

let dataCounter = 0;
let commonLoadingTimerInt = 0;

let dataListContainer;
let nukeNotifications;
let offlineSpan;
let offlineModal;
let user;
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
  } else {
    let notificationOverride = sessionStorage.getItem("notificationOverride");
    if (notificationOverride == undefined) {
      if(consoleOutput)
        console.log("Notifications Found");
    } else {
      if (notificationOverride == "notificationArrEmpty") {
        if(consoleOutput)
          console.log("Notifications Empty");
        deployListEmptyNotification("No Notifications Found!");
        initializeNukeBtn();
        notificationListEmptyBool = true;
      } else {
        if(consoleOutput)
          console.log("Notifications Found");
      }
    }
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

  userReadNotifications = firebase.database().ref("users/" + user.uid + "/readNotifications");
  userNotifications = firebase.database().ref("users/" + user.uid + "/notifications");
  userInvites = firebase.database().ref("users/" + user.uid + "/invites");

  databaseQuery();

  function databaseQuery() {
    let fetchReadNotifications = function (postRef){
      postRef.on('child_added', function (data) {
        if(!readNotificationArr.includes(data.val())) {
          readNotificationArr.push(data.val());
        }
        if (notificationArr.includes(data.val())){
          let liItemUpdate = document.getElementById('notification' + notificationArr.indexOf(data.val()));
          liItemUpdate.className += " checked";
        }
      });

      postRef.on('child_changed', function (data) {
        readNotificationArr[data.key] = data.val();
      });

      postRef.on('child_removed', function (data) {
        sessionStorage.setItem("validUser", JSON.stringify(user));
        navigation(6);
      });
    };

    let fetchNotifications = function (postRef) {
      postRef.on('child_added', function (data) {
        notificationArr.push(data.val());
        notificationKeyArr.push(data.key);
        createNotificationElement(data.val(), data.key);
      });

      postRef.on('child_changed', function (data) {
        notificationArr[data.key] = data.val();
        changeNotificationElement(data.val(), data.key);
      });

      postRef.on('child_removed', function (data) {
        sessionStorage.setItem("validUser", JSON.stringify(user));
        navigation(6);
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
        if(consoleOutput)
          console.log(inviteArr);
        inviteArr.splice(data.key, 1);
        if(consoleOutput)
          console.log(inviteArr);

        if (inviteArr.length == 0) {
          if(consoleOutput)
            console.log("Invite List Removed");
          inviteNote.style.background = "#008222";
        }
      });
    };

    fetchReadNotifications(userReadNotifications);
    fetchNotifications(userNotifications);
    fetchInvites(userInvites);

    listeningFirebaseRefs.push(userReadNotifications);
    listeningFirebaseRefs.push(userNotifications);
    listeningFirebaseRefs.push(userInvites);
  }

  function fetchNotificationData(createBool, noteToParse, liElem, noteKey) {
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

        initNotificationElement(liElem, notificationDataTitle, noteToParse, noteKey, notificationDetails,
          notificationPage, friendUserData);
      } else {
        if (consoleOutput)
          console.log("SenderUID not found!");
        notificationPage = "noteERROR";
        initNotificationElement(liElem, null, noteToParse, noteKey, null,
          notificationPage, null);
      }
    } else {
      if (consoleOutput)
        console.log("Deprecated Notification Format!");
      notificationPage = "noteERROR";
      initNotificationElement(liElem, null, noteToParse, noteKey, null,
        notificationPage, null);
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
    } else {
      liElem.innerHTML = notificationDataTitle;
    }
  }

  function createNotificationElement(notificationString, notificationKey){
    try {
      testData.remove();
    } catch (err) {}

    let liItem = document.createElement("LI");
    liItem.id = "notification" + notificationKey;
    fetchNotificationData(true, notificationString, liItem, notificationKey);
  }

  function changeNotificationElement(notificationString, notificationKey){
    try {
      testData.remove();
    } catch (err) {}

    let liItemUpdate = document.getElementById('notification' + notificationKey);
    if (liItemUpdate != undefined) {
      fetchNotificationData(false, notificationString, liItemUpdate, notificationKey);
    }
  }

  function initNotificationElement(liItem, notificationElemTitle, notificationString, notificationKey, notificationDetails,
                                   notificationPage, friendUserData) {
    liItem.className = "gift";
    let warningCount;
    if (notificationPage == "noteERROR") {
      if (!noteErrorBool) {
        noteErrorBool = true;
        initializeNukeBtn();
      }
      liItem.className += " highSev";
    } else {
      if (readNotificationArr.includes(notificationString)) {
        liItem.className += " checked";
      }
    }
    liItem.onclick = function () {
      if (notificationPage == "noteERROR") {
        notificationViewTitle.innerHTML = "***Notification Load Error***";
        notificationViewDetails.innerHTML = "The notification failed to load correctly, please contact a moderator!";
      } else {
        notificationViewTitle.innerHTML = notificationElemTitle;
        notificationViewDetails.innerHTML = notificationDetails;
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

      if (notificationPage == "noteERROR") {
        notificationViewDelete.onclick = function () {
          deployNotificationModal(true, "Delete Function Unavailable!",
            "There is an error within your notification, please contact a moderator to clear your notifications.");
        };
      } else {
        notificationViewDelete.onclick = function () {
          deleteNotification(notificationKey);
          closeModal(noteViewModal);
        };
      }

      openModal(noteViewModal, notificationKey);

      closeNoteViewModal.onclick = function () {
        closeModal(noteViewModal);
      };

      if (!readNotificationArr.includes(notificationString)) {
        readNotificationArr.push(notificationString);
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

        if (!settingReadNotifications) {
          settingReadNotifications = true;

          for (let i = 0; i < notificationArr.length; i++) {
            if (notificationArr[i] == notificationString) {
              changeNotificationElement(notificationString, notificationKeyArr[i]);
            }
          }

          settingReadNotifications = false;
        }

        user.readNotifications = readNotificationArr;
        updateReadNotificationToDB();
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

  function findFriendUserData(giftOwnerUID) {
    let i = findUIDItemInArr(giftOwnerUID, userArr, true);
    if (i != -1){
      return userArr[i];
    }
    return i;
  }

  function deleteNotification(uid) {
    let deleteNotificationBool = true;
    if(consoleOutput)
      console.log("Deleting " + uid);

    let toDelete = readNotificationArr.indexOf(notificationArr[uid]);
    readNotificationArr.splice(toDelete, 1);

    for (let i = 0; i < readNotificationArr.length; i++){
      if(readNotificationArr[i] == notificationArr[uid]){
        deleteNotificationBool = false;
      }
    }

    if(deleteNotificationBool) {
      notificationArr.splice(uid, 1);
      notificationKeyArr.splice(uid, 1);

      if (notificationArr.length == 0) {
        sessionStorage.setItem("notificationOverride", "notificationArrEmpty");
      }

      user.notifications = notificationArr;

      firebase.database().ref("users/" + user.uid).update({
        notifications: notificationArr
      });

      updateReadNotificationToDB();

      removeNotificationElement(uid);
    } else {
      deployNotificationModal(true, "Delete Error!", "Notification Not Deleted, Please Try Again!");
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

  function updateReadNotificationToDB(){
    if (user.readNotifications != undefined) {
      firebase.database().ref("users/" + user.uid).update({
        readNotifications: readNotificationArr
      });
    } else {
      if(consoleOutput)
        console.log("New Read Notifications List");
      firebase.database().ref("users/" + user.uid).update({readNotifications:{0:readNotificationArr}});
    }
  }
};

function initializeNukeBtn() {
  if (notificationArr.length > 0) {
    if (!noteErrorBool) {
      nukeNotifications.innerHTML = "Remove All Notifications";
      nukeNotifications.onclick = function () {
        firebase.database().ref("users/" + user.uid + "/notifications/").remove();
        if (user.readNotifications != null) {
          firebase.database().ref("users/" + user.uid + "/readNotifications/").remove();
        }

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
