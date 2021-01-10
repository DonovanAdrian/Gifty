/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

var notificationsElements = [];
var userArr = [];
var inviteArr = [];
var notificationArr = [];
var readNotificationArr = [];
var listeningFirebaseRefs = [];

var notificationListEmptyBool = false;

var notificationCount = 0;
var onlineInt = 0;
var loadingTimerInt = 0;

var dataListContainer;
var offlineSpan;
var offlineModal;
var user;
var userReadNotifications;
var userNotifications;
var userInvites;
var noteViewModal;
var inviteNote;
var loadingTimer;
var offlineTimer;
var notificationModal;
var privateMessageModal;
var notificationInfo;
var notificationTitle;
var noteSpan;
var testGift;
var closeNoteViewModal;
var notificationViewTitle;
var notificationViewDetails;
var notificationViewPage;
var notificationViewDelete;
var privateMessageSpan;
var privateMessageInp;
var sendMsg;
var cancelMsg;



function getCurrentUser(){
  try {
    user = JSON.parse(sessionStorage.validUser);
    console.log("User: " + user.userName + " loaded in");
    if (user.invites == undefined) {
      console.log("Invites Not Found");
    } else if (user.invites != undefined) {
      if (user.invites.length > 0) {
        inviteNote.style.background = "#ff3923";
      }
    }

    //console.log(user.notifications);
    if(user.notifications == undefined) {
      console.log("Notifications Not Found");
      deployNotificationListEmptyNotification();
      notificationListEmptyBool = true;
    } else {
      var notificationOverride = sessionStorage.getItem("notificationOverride");
      if (notificationOverride == undefined) {
        console.log("Notifications Found");
      } else {
        if (notificationOverride == "notificationArrEmpty") {
          console.log("Notifications Empty");
          deployNotificationListEmptyNotification();
          notificationListEmptyBool = true;
        } else {
          console.log("Notifications Found");
        }
      }
    }
    userArr = JSON.parse(sessionStorage.userArr);
  } catch (err) {
    console.log(err.toString());
    window.location.href = "index.html";
  }
}

window.onload = function instantiate() {

  dataListContainer = document.getElementById("dataListContainer");
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById("closeOffline");
  inviteNote = document.getElementById('inviteNote');
  notificationModal = document.getElementById('notificationModal');
  notificationTitle = document.getElementById('notificationTitle');
  notificationInfo = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  privateMessageModal = document.getElementById('privateMessageModal');
  noteViewModal = document.getElementById('noteViewModal');
  testGift = document.getElementById('testGift');
  closeNoteViewModal = document.getElementById('closeNoteViewModal');
  notificationViewTitle = document.getElementById('notificationViewTitle');
  notificationViewDetails = document.getElementById('notificationViewDetails');
  notificationViewPage = document.getElementById('notificationViewPage');
  notificationViewDelete = document.getElementById('notificationViewDelete');
  privateMessageSpan = document.getElementById('privateMessageSpan');
  privateMessageInp = document.getElementById('privateMessageInp');
  sendMsg = document.getElementById('sendMsg');
  cancelMsg = document.getElementById('cancelMsg');
  notificationsElements = [dataListContainer, offlineModal, offlineSpan, inviteNote, notificationModal,
    notificationTitle, notificationInfo, noteSpan, privateMessageModal, noteViewModal, testGift, closeNoteViewModal,
    notificationViewTitle, notificationViewDetails, notificationViewPage, notificationViewDelete, privateMessageSpan,
    privateMessageInp, sendMsg, cancelMsg];
  verifyElementIntegrity(notificationsElements);
  getCurrentUser();
  commonInitialization();

  loadingTimer = setInterval(function(){
    loadingTimerInt = loadingTimerInt + 1000;
    if(loadingTimerInt >= 2000){
      if (testGift == undefined){
        //console.log("TestGift Missing. Loading Properly.");
      } else if (testGift.innerHTML == "No Notifications Found!"){
        //console.log("No Notifications Found");
      } else if (!notificationListEmptyBool) {
        testGift.innerHTML = "Loading... Please Wait...";
      }
      clearInterval(loadingTimer);
    }
  }, 1000);

  databaseQuery();

  function databaseQuery() {

    userReadNotifications = firebase.database().ref("users/" + user.uid + "/readNotifications");
    userNotifications = firebase.database().ref("users/" + user.uid + "/notifications");
    userInvites = firebase.database().ref("users/" + user.uid + "/invites");

    var fetchReadNotifications = function (postRef){
      postRef.on('child_added', function (data) {
        if(!readNotificationArr.includes(data.val())) {
          readNotificationArr.push(data.val());
        }
        if (notificationArr.includes(data.val())){
          var liItemUpdate = document.getElementById("notification" + notificationArr.indexOf(data.val()));
          liItemUpdate.className += " checked";
        }
      });

      postRef.on('child_changed', function (data) {
        readNotificationArr[data.key] = data.val();
      });

      postRef.on('child_removed', function (data) {
        sessionStorage.setItem("validUser", JSON.stringify(user));
        location.reload();
      });
    };

    var fetchNotifications = function (postRef) {
      postRef.on('child_added', function (data) {
        notificationArr.push(data.val());
        createNotificationElement(data.val(), data.key);
      });

      postRef.on('child_changed', function (data) {
        notificationArr[data.key] = data.val();
        changeNotificationElement(data.val(), data.key);
      });

      postRef.on('child_removed', function (data) {
        sessionStorage.setItem("validUser", JSON.stringify(user));
        location.reload();
      });
    };

    var fetchInvites = function (postRef) {
      postRef.on('child_added', function (data) {
        inviteArr.push(data.val());

        inviteNote.style.background = "#ff3923";
      });

      postRef.on('child_changed', function (data) {
        inviteArr[data.key] = data.val();
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

    fetchReadNotifications(userReadNotifications);
    fetchNotifications(userNotifications);
    fetchInvites(userInvites);

    listeningFirebaseRefs.push(userReadNotifications);
    listeningFirebaseRefs.push(userNotifications);
    listeningFirebaseRefs.push(userInvites);
  }

  function createNotificationElement(notificationString, notificationKey){
    try{
      testGift.remove();
    } catch (err) {}

    var friendUserData;
    var notificationTitle;
    var notificationDetails;
    var notificationPage;
    var notificationSplit = notificationString.split(",");

    if(notificationString.includes("@#$:")) {
      var privateMessage = notificationString.split("@#$:");
      var messageSender = privateMessage[0];

      friendUserData = findFriendUserData(messageSender);
      notificationTitle = "New Message From " + friendUserData.name;
      notificationDetails = privateMessage[1];
      notificationPage = "privateMessage";
    } else {
      if (notificationSplit.length == 1) {
        notificationTitle = "New Message From An Administrator!";
        notificationDetails = notificationSplit[0];
        notificationPage = "globalNotification";
      } else if (notificationSplit.length == 2) {
        var invitedName = notificationSplit[0];
        var pageName = notificationSplit[1];
        //console.log(invitedName + " " + pageName);

        notificationTitle = "You received an invite!";
        notificationDetails = invitedName + " has sent you an invite!";
        notificationPage = pageName;
      } else if (notificationSplit.length == 3) {
        var giftOwner = notificationSplit[0];
        var giftTitle = notificationSplit[1];
        var pageName = notificationSplit[2];
        //console.log(giftOwner + " " + giftTitle + " " + pageName);

        friendUserData = findFriendUserData(giftOwner);
        notificationPage = pageName;

        if (pageName == "friendList.html") {
          if (friendUserData != -1)
            notificationTitle = friendUserData.name + " updated a gift you bought!";
          else
            notificationTitle = "A gift you bought was updated!";
          notificationDetails = "The gift, " + giftTitle + ", was updated!";
        } else if (pageName == "privateFriendList.html") {
          if (friendUserData != -1)
            notificationTitle = friendUserData.name + "\'s private gift that you bought was updated!";
          else
            notificationTitle = "A private gift that you bought was updated!";
          notificationDetails = "The gift, " + giftTitle + ", was updated!";
        } else if (pageName == "deleteGift") {
          if (friendUserData != -1)
            notificationTitle = friendUserData.name + " deleted a gift you bought!";
          else
            notificationTitle = "A gift you bought was deleted!";
          notificationDetails = "The gift, " + giftTitle + ", was deleted...";
        } else {
          console.log("Notification Page Error, 1");
        }
      } else if (notificationSplit.length == 4) {
        var giftOwner = notificationSplit[0];
        var giftDeleter = notificationSplit[1];
        var giftTitle = notificationSplit[2];
        var pageName = notificationSplit[3];

        friendUserData = findFriendUserData(giftOwner);

        notificationPage = pageName;

        if (friendUserData != -1)
          notificationTitle = friendUserData.name + "\'s private gift that you bought was deleted!";
        else
          notificationTitle = giftDeleter + " deleted a gift that you bought!";
        notificationDetails = "The gift, " + giftTitle + ", was deleted by " + giftDeleter + "...";
      } else {
        console.log("Unknown Notification String Received...");
      }
    }

    var liItem = document.createElement("LI");
    liItem.id = "notification" + notificationKey;
    liItem.className = "gift";
    if(readNotificationArr.includes(notificationString)) {
      liItem.className += " checked";
      //console.log("Checked, created");
    }
    liItem.onclick = function (){
      notificationViewTitle.innerHTML = notificationTitle;
      notificationViewDetails.innerHTML = notificationDetails;

      if (notificationPage == "privateMessage") {
        notificationViewPage.innerHTML = "To reply to this message, click here!";
        notificationViewPage.onclick = function(){
          generatePrivateMessageDialog(friendUserData);
        };
      } else if (notificationPage == "globalNotification"){
        notificationViewPage.innerHTML = "As always, if you need any other information, send me a support email that can" +
          " be found in the Help/FAQ under settings! Thank you!";
        notificationViewPage.onclick = function(){};
      } else if (notificationPage == "invites.html"){
        notificationViewPage.innerHTML = "Click here to access your invites!";
        notificationViewPage.onclick = function(){
          newNavigation(11);//Confirmation
        };
      } else if (notificationPage == "friendList.html" && friendUserData != -1) {
        notificationViewPage.innerHTML = "Click here to access their friend list!";
        notificationViewPage.onclick = function(){
          sessionStorage.setItem("validGiftUser", JSON.stringify(friendUserData));//Friend's User Data
          newNavigation(9);//FriendList
        };
      } else if (notificationPage == "privateFriendList.html" && friendUserData != -1) {
        notificationViewPage.innerHTML = "Click here to access their private friend list!";
        notificationViewPage.onclick = function(){
          sessionStorage.setItem("validGiftUser", JSON.stringify(friendUserData));//Friend's User Data
          newNavigation(10);//PrivateFriendList
        };
      } else if (notificationPage == "deleteGift") {
        notificationViewPage.innerHTML = "If this has been done in error, please contact the gift owner.";
        notificationViewPage.onclick = function(){};
      } else if (notificationPage == "deleteGiftPrivate") {
        notificationViewPage.innerHTML = "If this has been done in error, please contact the person who deleted " +
          "the gift.";
        notificationViewPage.onclick = function(){};
      } else {
        console.log("Notification Page Error, 2");
        notificationViewPage.innerHTML = "There was an error loading this link, contact an administrator.";
        notificationViewPage.onclick = function(){};
      }

      notificationViewDelete.onclick = function(){
        deleteNotification(notificationKey);
        closeModal(noteViewModal);
      };

      //show modal
      openModal(noteViewModal, notificationKey);

      //close on close
      closeNoteViewModal.onclick = function() {
        closeModal(noteViewModal);
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == noteViewModal) {
          closeModal(noteViewModal);
        }
      };

      if (!readNotificationArr.includes(notificationString)) {
        readNotificationArr.push(notificationString);

        user.readNotifications = readNotificationArr;
        updateReadNotificationToDB();
      }
    };
    var textNode = document.createTextNode(notificationTitle);
    liItem.appendChild(textNode);

    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);

    notificationCount++;
  }

  function changeNotificationElement(notificationString, notificationKey){
    try{
      testGift.remove();
    } catch (err) {}

    var friendUserData;
    var notificationTitle;
    var notificationDetails;
    var notificationPage;
    var notificationSplit = notificationString.split(",");

    if(notificationString.includes("@#$:")) {
      var privateMessage = notificationString.split("@#$:");
      var messageSender = privateMessage[0];

      friendUserData = findFriendUserData(messageSender);
      notificationTitle = "New Message From " + friendUserData.name;
      notificationDetails = privateMessage[1];
      notificationPage = "privateMessage";
    } else {
      if (notificationSplit.length == 1) {
        notificationTitle = "New Message From An Administrator!";
        notificationDetails = notificationSplit[0];
        notificationPage = "globalNotification";
      } else if (notificationSplit.length == 2) {
        var invitedName = notificationSplit[0];
        var pageName = notificationSplit[1];
        console.log(invitedName + " " + pageName);

        notificationTitle = "You received an invite!";
        notificationDetails = invitedName + " has sent you an invite!";
        notificationPage = pageName;
      } else if (notificationSplit.length == 3) {
        var giftOwner = notificationSplit[0];
        var giftTitle = notificationSplit[1];
        var pageName = notificationSplit[2];
        console.log(giftOwner + " " + giftTitle + " " + pageName);

        friendUserData = findFriendUserData(giftOwner);
        notificationPage = pageName;

        if (pageName == "friendList.html") {
          if (friendUserData != -1)
            notificationTitle = friendUserData.name + " updated a gift you bought!";
          else
            notificationTitle = "A gift you bought was updated!";
          notificationDetails = "The gift, " + giftTitle + ", was updated!";
        } else if (pageName == "privateFriendList.html") {
          if (friendUserData != -1)
            notificationTitle = friendUserData.name + "\'s private gift that you bought was updated!";
          else
            notificationTitle = "A private gift that you bought was updated!";
          notificationDetails = "The gift, " + giftTitle + ", was updated!";
        } else if (pageName == "deleteGift") {
          if (friendUserData != -1)
            notificationTitle = friendUserData.name + " deleted a gift you bought!";
          else
            notificationTitle = "A gift you bought was deleted!";
          notificationDetails = "The gift, " + giftTitle + ", was deleted...";
        } else {
          console.log("Notification Page Error, 1");
        }
      } else if (notificationSplit.length == 4) {
        var giftOwner = notificationSplit[0];
        var giftDeleter = notificationSplit[1];
        var giftTitle = notificationSplit[2];
        var pageName = notificationSplit[3];

        friendUserData = findFriendUserData(giftOwner);

        notificationPage = pageName;

        if (friendUserData != -1)
          notificationTitle = friendUserData.name + "\'s private gift that you bought was deleted!";
        else
          notificationTitle = giftDeleter + " deleted a gift that you bought!";
        notificationDetails = "The gift, " + giftTitle + ", was deleted by " + giftDeleter + "...";
      } else {
        console.log("Unknown Notification String Received...");
      }
    }

    var liItemUpdate = document.getElementById("notification" + notificationKey);
    if (liItemUpdate == undefined) {
      liItemUpdate.innerHTML = notificationTitle;
      liItemUpdate.className = "gift";
      if(readNotificationArr.includes(notificationString)) {
        liItemUpdate.className += " checked";
        //console.log("Checked, created");
      }
      liItemUpdate.onclick = function () {
        notificationViewTitle.innerHTML = notificationTitle;
        notificationViewDetails.innerHTML = notificationDetails;

        if (notificationPage == "privateMessage" && friendUserData != -1) {
          notificationViewPage.innerHTML = "To reply to this message, click here!";
          notificationViewPage.onclick = function(){
            generatePrivateMessageDialog(friendUserData);
          };
        } else if (notificationPage == "globalNotification"){
          notificationViewPage.innerHTML = "As always, if you need any other information, send me a support email that can" +
            " be found in the Help/FAQ under settings! Thank you!";
          notificationViewPage.onclick = function(){};
        } else if (notificationPage == "invites.html") {
          notificationViewPage.innerHTML = "Click here to access your invites!";
          notificationViewPage.onclick = function () {
            newNavigation(11);//Confirmation
          };
        } else if (notificationPage == "friendList.html" && friendUserData != -1) {
          notificationViewPage.innerHTML = "Click here to access their friend list!";
          notificationViewPage.onclick = function () {
            sessionStorage.setItem("validGiftUser", JSON.stringify(friendUserData));//Friend's User Data
            newNavigation(9);//FriendList
          };
        } else if (notificationPage == "privateFriendList.html" && friendUserData != -1) {
          notificationViewPage.innerHTML = "Click here to access their private friend list!";
          notificationViewPage.onclick = function () {
            sessionStorage.setItem("validGiftUser", JSON.stringify(friendUserData));//Friend's User Data
            newNavigation(10);//PrivateFriendList
          };
        } else if (notificationPage == "deleteGift") {
          notificationViewPage.innerHTML = "If this has been done in error, please contact the gift owner.";
          notificationViewPage.onclick = function () {
          };
        } else if (notificationPage == "deleteGiftPrivate") {
          notificationViewPage.innerHTML = "If this has been done in error, please contact the person who deleted " +
            "the gift.";
          notificationViewPage.onclick = function () {
          };
        } else {
          console.log("Notification Page Error, 2");
          notificationViewPage.innerHTML = "There was an error loading this link, contact an administrator.";
          notificationViewPage.onclick = function () {
          };
        }

        notificationViewDelete.onclick = function () {
          deleteNotification(notificationKey);
          closeModal(noteViewModal);
        };

        //show modal
        openModal(noteViewModal, notificationKey);

        //close on close
        closeNoteViewModal.onclick = function () {
          closeModal(noteViewModal);
        };

        //close on click
        window.onclick = function (event) {
          if (event.target == noteViewModal) {
            closeModal(noteViewModal);
          }
        };

        if (!readNotificationArr.includes(notificationString)) {
          readNotificationArr.push(notificationString);

          user.readNotifications = readNotificationArr;
          updateReadNotificationToDB();
        }
      };
    }
  }

  function generatePrivateMessageDialog(userData) {
    var message = "";

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

    //close on close
    privateMessageSpan.onclick = function() {
      closeModal(privateMessageModal);
    };

    //close on click
    window.onclick = function(event) {
      if (event.target == privateMessageModal) {
        closeModal(privateMessageModal);
      }
    };
  }

  function generatePrivateMessage(userUID, message){
    return userUID + "@#$:" + message;
  }

  function addPrivateMessageToDB(userData, message) {
    var userNotificationArr = [];
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
    var i = findUIDItemInArr(giftOwnerUID, userArr);
    //console.log(i + " " + userArr[i].name);
    if (i != -1){
      return userArr[i];
    }
    return i;
  }

  function findUIDItemInArr(item, userArray){
    for(var i = 0; i < userArray.length; i++){
      if(userArray[i].uid == item){
        //console.log("Found item: " + item);
        return i;
      }
    }
    return -1;
  }

  function deleteNotification(uid) {
    var deleteNotificationBool = true;
    console.log("Deleting " + uid);

    var toDelete = readNotificationArr.indexOf(notificationArr[uid]);
    readNotificationArr.splice(toDelete, 1);

    for (var i = 0; i < readNotificationArr.length; i++){
      if(readNotificationArr[i] == notificationArr[uid]){
        deleteNotificationBool = false;
      }
    }

    if(deleteNotificationBool) {
      notificationArr.splice(uid, 1);

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
      alert("Notification Not Deleted, Please Try Again!");
    }
  }

  function removeNotificationElement(uid) {
    document.getElementById("notification" + uid).remove();

    notificationCount--;
    if (notificationCount == 0){
      deployNotificationListEmptyNotification();
    }
  }

  function updateReadNotificationToDB(){
    //console.log(readNotificationArr);
    if (user.readNotifications != undefined) {
      firebase.database().ref("users/" + user.uid).update({
        readNotifications: readNotificationArr
      });
    } else {
      console.log("New Read Notifications List");
      firebase.database().ref("users/" + user.uid).update({readNotifications:{0:readNotificationArr}});
    }
  }
};

function deployNotificationListEmptyNotification(){
  try{
    testGift.innerHTML = "No Notifications Found!";
  } catch(err){
    console.log("Loading Element Missing, Creating A New One");
    var liItem = document.createElement("LI");
    liItem.id = "testGift";
    liItem.className = "gift";
    var textNode = document.createTextNode("No Notifications Found!");
    liItem.appendChild(textNode);
    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
  }

  clearInterval(offlineTimer);
}
