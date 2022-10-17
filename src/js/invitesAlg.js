/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let inviteElements = [];
let inviteArr = [];
let friendArr = [];
let listeningFirebaseRefs = [];
let userArr = [];
let commonFriendArr = [];
let initializedUsers = [];

let readNotificationsBool = false;
let invitesFound = false;
let friendListEmptyBool = false;

let dataCounter = 0;
let commonLoadingTimerInt = 0;

let inviteListEmptyText = "";
let deletePendingUid = "";

let dataListContainer;
let offlineSpan;
let offlineModal;
let userInviteModal;
let confirmModal;
let addUser;
let user;
let newInviteIcon;
let inviteNote;
let userNameInp;
let offlineTimer;
let commonLoadingTimer;
let userInitial;
let userFriends;
let userInvites;
let privateMessageModal;
let notificationModal;
let notificationInfo;
let notificationTitle;
let noteSpan;
let notificationBtn;
let inviteModal;
let closeInviteModal;
let testData;
let userName;
let userUName;
let userShareCode;
let sendPrivateMessage;
let userInviteRemove;
let closePrivateMessageModal;
let privateMessageInp;
let sendMsg;
let cancelMsg;
let closeConfirmModal;
let confUserName;
let inviteConfirm;
let inviteDeny;
let closeUserInviteModal;
let addToBlackList;
let inviteInfo;
let addInvite;
let cancelInvite;



function getCurrentUser(){
  getCurrentUserCommon();

  if (user.friends == undefined) {
    if (invitesFound)
      inviteListEmptyText = "No Friends Found, But You Have Some Pending Invites!";
    else
      inviteListEmptyText = "No Friends Found! Invite Some Friends With The Button Below!";
    deployListEmptyNotification(inviteListEmptyText);
    friendListEmptyBool = true;
  } else if (user.friends.length == 0) {
    if (invitesFound)
      inviteListEmptyText = "No Friends Found, But You Have Some Pending Invites!";
    else
      inviteListEmptyText = "No Friends Found! Invite Some Friends With The Button Below!";
    deployListEmptyNotification(inviteListEmptyText);
    friendListEmptyBool = true;
  } else if (user.friends != undefined) {
    if (user.friends.length < 100 && user.friends.length > 0) {
      inviteNote.innerHTML = user.friends.length + " Friends";
    }
  } else {
    if(consoleOutput)
      console.log("Friends Found!");
  }

  if (user.readNotifications == undefined) {
    if(consoleOutput)
      console.log("Read Notifications Not Found");
  } else {
    readNotificationsBool = true;
  }

  if (user.notifications == undefined) {
    if(consoleOutput)
      console.log("Notifications Not Found");
  } else if (user.notifications != undefined) {
    if (readNotificationsBool){
      if (user.notifications.length > 0 && user.readNotifications.length != user.notifications.length) {
        flickerNotification();
        notificationBtn.onclick = function() {
          navigation(6);//Notifications
        }
      } else {
        notificationBtn.src = "img/bellNotificationOff.png";
        notificationBtn.onclick = function() {
          navigation(6);//Notifications
        }
      }
    } else if (user.notifications.length > 0) {
      flickerNotification();
      notificationBtn.onclick = function() {
        navigation(6);//Notifications
      }
    }
  }
}

window.onload = function instantiate() {
  pageName = "Invites";
  notificationBtn = document.getElementById('notificationButton');
  dataListContainer = document.getElementById('dataListContainer');
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  userInviteModal = document.getElementById('userInviteModal');
  closeUserInviteModal = document.getElementById('closeUserInviteModal');
  userNameInp = document.getElementById('userNameInp');
  addToBlackList = document.getElementById('addToBlackList');
  inviteInfo = document.getElementById('inviteInfo');
  addInvite = document.getElementById('addInvite');
  cancelInvite = document.getElementById('cancelInvite');
  confirmModal = document.getElementById('confirmModal');
  closeConfirmModal = document.getElementById('closeConfirmModal');
  confUserName = document.getElementById('confUserName');
  inviteConfirm = document.getElementById('inviteConfirm');
  inviteDeny = document.getElementById('inviteDeny');
  inviteNote = document.getElementById('inviteNote');
  newInviteIcon = document.getElementById('newInviteIcon');
  addUser = document.getElementById('addUser');
  notificationModal = document.getElementById('notificationModal');
  notificationTitle = document.getElementById('notificationTitle');
  notificationInfo = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  privateMessageModal = document.getElementById('privateMessageModal');
  closePrivateMessageModal = document.getElementById('closePrivateMessageModal');
  privateMessageInp = document.getElementById('privateMessageInp');
  sendMsg = document.getElementById('sendMsg');
  cancelMsg = document.getElementById('cancelMsg');
  inviteModal = document.getElementById('inviteModal');
  closeInviteModal = document.getElementById('closeInviteModal');
  userName = document.getElementById('userName');
  userUName = document.getElementById('userUName');
  userShareCode = document.getElementById('userShareCode');
  sendPrivateMessage = document.getElementById('sendPrivateMessage');
  userInviteRemove = document.getElementById('userInviteRemove');
  testData = document.getElementById('testData');
  inviteElements = [notificationBtn, dataListContainer, offlineModal, offlineSpan, userInviteModal,
    closeUserInviteModal, userNameInp, addToBlackList, inviteInfo, addInvite, cancelInvite, confirmModal, closeConfirmModal,
    confUserName, inviteConfirm, inviteDeny, inviteNote, newInviteIcon, addUser, notificationModal, notificationTitle,
    notificationInfo, noteSpan, privateMessageModal, closePrivateMessageModal, privateMessageInp, sendMsg, cancelMsg,
    inviteModal, closeInviteModal, userName, userUName, userShareCode, sendPrivateMessage, userInviteRemove, testData];

  getCurrentUser();
  commonInitialization();
  verifyElementIntegrity(inviteElements);

  userInitial = firebase.database().ref("users/");
  userFriends = firebase.database().ref("users/" + user.uid + "/friends");
  userInvites = firebase.database().ref("users/" + user.uid + "/invites");

  databaseQuery();

  function generateInviteIcon() {
    newInviteIcon.onclick = function () {
      navigation(11);//Confirmation
    };
  }

  if (invitesFound) {
    generateInviteIcon();
  }
  generateAddUserBtn();
  evaluateCommonFriends();


  function databaseQuery() {
    let fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        globalNoteInt = 1;

        let i = findUIDItemInArr(data.key, userArr, true);
        if(userArr[i] != data.val() && i != -1){
          userArr[i] = data.val();
        }

        if(data.key == user.uid){
          user = data.val();
        }
      });

      postRef.on('child_changed', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          if(consoleOutput) {
            console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
          }
          userArr[i] = data.val();
          if (initializedUsers.includes(data.key) && deletePendingUid != data.key) {
            changeFriendElement(data.key);
          }
        }

        if(data.key == user.uid){
          user = data.val();
          if(consoleOutput)
            console.log("Current User Updated");
        }
      });

      postRef.on('child_removed', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          if(consoleOutput) {
            console.log("Removing " + userArr[i].userName + " / " + data.val().userName);
          }
          userArr.splice(i, 1);
        }
      });
    };

    let fetchFriends = function (postRef) {
      postRef.on('child_added', function (data) {
        friendArr.push(data.val());
        createFriendElement(data.val());
      });

      postRef.on('child_changed', function (data) {
        friendArr[data.key] = data.val();
        if(consoleOutput)
          console.log("Changing " + data.val());
        changeFriendElement(data.key);
      });

      postRef.on('child_removed', function (data) {
        sessionStorage.setItem("validUser", JSON.stringify(user));
        navigation(4);
      });
    };

    let fetchInvites = function (postRef) {
      postRef.on('child_added', function (data) {
        inviteArr.push(data.val());
      });

      postRef.on('child_changed', function (data) {
        inviteArr[data.key] = data.val();
      });

      postRef.on('child_removed', function (data) {
        inviteArr.splice(data.key, 1);

        if (inviteArr.length == 0) {
          if(consoleOutput)
            console.log("Invite List Removed");
          newInviteIcon.style.display = "none";
          inviteNote.style.background = "#008222";
        }
      });
    };

    fetchData(userInitial);
    fetchFriends(userFriends);
    fetchInvites(userInvites);

    listeningFirebaseRefs.push(userInitial);
    listeningFirebaseRefs.push(userFriends);
    listeningFirebaseRefs.push(userInvites);
  }

  function createFriendElement(friendKey){
    let friendData;
    let textNode;
    for (let i = 0; i < userArr.length; i++)
      if(friendKey == userArr[i].uid){
        friendData = userArr[i];
        break;
      }

    if(friendData != null) {
      try {
        testData.remove();
      } catch (err) {}

      let liItem = document.createElement("LI");
      liItem.id = "user" + friendData.uid;
      initFriendElement(liItem, friendData);
      if (friendData.moderatorInt > 0) {
        textNode = document.createTextNode(friendData.name + " (Moderator)");
      } else {
        textNode = document.createTextNode(friendData.name);
      }
      liItem.appendChild(textNode);
      dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
      clearInterval(commonLoadingTimer);
      clearInterval(offlineTimer);
      dataCounter++;
    }
  }

  function changeFriendElement(friendKey){
    let friendData;
    for (let i = 0; i < userArr.length; i++) {
      if (friendKey == userArr[i].uid) {
        friendData = userArr[i];
        break;
      }
    }

    if(friendData != null) {
      console.log("Updating " + friendData.name);
      let liItemUpdate = document.getElementById("user" + friendData.uid);
      if (friendData.moderatorInt > 0) {
        liItemUpdate.innerHTML = friendData.name + " (Moderator)";
      } else {
        liItemUpdate.innerHTML = friendData.name;
      }
      initFriendElement(liItemUpdate, friendData);
    }
  }

  function initFriendElement(liItem, friendData) {
    liItem.className = "gift";
    if (friendData.moderatorInt > 0) {
      liItem.className += " highSev";
    }
    liItem.onclick = function () {
      if (friendData.shareCode == undefined || friendData.shareCode == "")
        friendData.shareCode = "This User Does Not Have A Share Code";

      userName.innerHTML = friendData.name;
      userUName.innerHTML = "User Name: " + friendData.userName;
      userShareCode.innerHTML = "Share Code: " + friendData.shareCode;

      sendPrivateMessage.onclick = function() {
        closeModal(inviteModal);
        generatePrivateMessageDialog(friendData);
      };

      userInviteRemove.onclick = function () {
        closeModal(inviteModal);
        deleteFriend(friendData);
      };

      openModal(inviteModal, friendData.uid);

      closeInviteModal.onclick = function () {
        closeModal(inviteModal);
      };
    };

    if (!initializedUsers.includes(friendData.uid)) {
      initializedUsers.push(friendData.uid);
    }
  }

  function generatePrivateMessageDialog(userData) {
    let message = "";

    privateMessageInp.placeholder = "Hey! Just to let you know...";

    sendMsg.onclick = function (){
      if(privateMessageInp.value.includes(",,,")){
        deployNotificationModal(true, "Message Error!", "Please do not use commas " +
          "in the message. Thank you!");
      } else {
        message = generateNotificationString(user.uid, "", privateMessageInp.value, "");
        addPrivateMessageToDB(userData, message);
        privateMessageInp.value = "";
        closeModal(privateMessageModal);
        openModal(inviteModal, userData.uid);
      }
    };
    cancelMsg.onclick = function (){
      privateMessageInp.value = "";
      closeModal(privateMessageModal);
      openModal(inviteModal, userData.uid);
    };

    openModal(privateMessageModal, "addGlobalMsgModal");

    closePrivateMessageModal.onclick = function() {
      closeModal(privateMessageModal);
    };
  }

  function addPrivateMessageToDB(userData, message) {
    let userNotificationArr;
    let currentUserScore;

    if (user.userScore == null) {
      user.userScore = 0;
    }

    user.userScore = user.userScore + 1;
    currentUserScore = user.userScore;

    if(userData.notifications == undefined){
      userNotificationArr = [];
    } else {
      userNotificationArr = userData.notifications;
    }
    userNotificationArr.push(message);

    firebase.database().ref("users/" + user.uid).update({userScore: currentUserScore});

    if(userData.notifications == undefined) {
      firebase.database().ref("users/" + userData.uid).update({notifications:{0:message}});
    } else {
      firebase.database().ref("users/" + userData.uid).update({
        notifications: userNotificationArr
      });
    }
    deployNotificationModal(false, "Message Sent!", "Your message to " +
      userData.userName + " was successfully delivered!");
  }

  function deleteFriend(delFriendData) {
    let verifyDeleteBool = true;
    let verifyDeleteBoolFriend = true;
    let toDelete = -1;
    let uid = delFriendData.uid;
    let friendFriendArr;

    deletePendingUid = uid;

    for (let i = 0; i < friendArr.length; i++){
      if(friendArr[i] == uid) {
        toDelete = i;
        break;
      }
    }

    if(toDelete != -1) {
      friendArr.splice(toDelete, 1);

      for (let i = 0; i < friendArr.length; i++) {
        if (friendArr[i] == uid) {
          verifyDeleteBool = false;
          break;
        }
      }
    } else {
      verifyDeleteBool = false;
    }

    if (!verifyDeleteBool) {
      friendArr = user.friends;
      deployNotificationModal(true, "Remove Friend Failure!", "Your friend was not " +
        "able to be removed from your friend list. Please try again later!");
      updateMaintenanceLog("invites", user.userName + " attempted to remove friend, " +
        delFriendData.userName + " and FAILED! (There was an issue with " + user.userName + "'s friend list)");
      return;
    }

    toDelete = -1;

    for (let i = 0; i < userArr.length; i++) {
      if(userArr[i].uid == uid) {
        friendFriendArr = userArr[i].friends;
        break;
      }
    }

    for (let i = 0; i < friendFriendArr.length; i++) {
      if (friendFriendArr[i] == user.uid){
        toDelete = i;
        break;
      }
    }

    if(toDelete != -1) {
      friendFriendArr.splice(toDelete, 1);

      for (let i = 0; i < friendFriendArr.length; i++) {
        if (friendFriendArr[i] == user.uid) {
          verifyDeleteBoolFriend = false;
          break;
        }
      }
    } else {
      verifyDeleteBoolFriend = false;
    }

    if (verifyDeleteBoolFriend && verifyDeleteBool) {
      firebase.database().ref("users/" + user.uid).update({
        friends: friendArr
      });

      let i = initializedUsers.indexOf(uid);
      if (i != -1) {
        initializedUsers.splice(i, 1);
      }

      firebase.database().ref("users/" + uid).update({
        friends: friendFriendArr
      });

      deletePendingUid = "";
      removeFriendElement(uid);
      user.friends = friendArr;
      generateAddUserBtn();
    } else {
      deployNotificationModal(true, "Remove Friend Failure!", "Your friend was not " +
        "able to be removed from your friend list. Please try again later!");
      updateMaintenanceLog("invites", user.userName + " attempted to remove friend, " +
        delFriendData.userName + " and FAILED! (There was an issue with " + delFriendData.userName + "'s friend list)");
    }
  }

  function evaluateCommonFriends(){
    let userFriendInt1;
    let userFriendInt2;
    let userFriendData1;
    let userFriendData2;
    let userFriendLength = 0;
    let commonFriends = 0;
    let commonFriendData;
    let userBlackListCommon = [];

    addToBlackList.style.display = "none";

    if (user.friends != null) {
      userFriendLength = user.friends.length;
    }

    if (user.userBlackList != null) {
      userBlackListCommon = user.userBlackList;
    }

    if (userFriendLength > 3) {
      for (let i = 0; i < userFriendLength; i++) {
        userFriendInt1 = findUIDItemInArr(user.friends[i], userArr, true);
        userFriendData1 = userArr[userFriendInt1].friends;

        for (let a = 0; a < userFriendData1.length; a++) {
          userFriendInt2 = findUIDItemInArr(user.friends[i], userArr, true);
          userFriendData2 = userArr[userFriendInt2].friends;
          for (let b = 0; b < userFriendData2.length; b++) {
            if (userFriendData1[a] == userFriendData2[b]) {
              commonFriends += 1;
            }
          }
        }

        if (commonFriends > 3 && userFriendData1.length > userFriendLength) {
          commonFriendData = userArr[userFriendInt1];
          break;
        }
      }

      if (commonFriendData != undefined) {
        for (let c = 0; c < commonFriendData.friends.length; c++) {
          if (!user.friends.includes(commonFriendData.friends[c]) && commonFriendData.friends[c] != user.uid) {
            commonFriendArr.push(commonFriendData.friends[c]);
          }
        }

        if (commonFriendArr.length > 0 && userBlackListCommon.length != commonFriendArr.length) {
          addUser.style.background = "#3be357";
        }
      }
    }
  }

  function generateAddUserBtn(){
    let commonFriendIndex;
    let userBlackList = [];
    let friendUserNameList = [];
    let friendShareCodeList = [];
    let upperCaseUserArr = [];

    if(user.friends != undefined || user.friends != null) {
      for (let i = 0; i < user.friends.length; i++) {
        for (let a = 0; a < userArr.length; a++) {
          if (userArr[a].uid == user.friends[i]) {
            friendUserNameList.push(userArr[a].userName.toUpperCase());
            friendShareCodeList.push(userArr[a].shareCode);
            break;
          }
        }
      }
    }

    for (let b = 0; b < userArr.length; b++){
      upperCaseUserArr.push(userArr[b].userName.toUpperCase());
    }

    if (user.userBlackList != null) {
      userBlackList = user.userBlackList;
    }

    addUser.onclick = function() {
      openModal(userInviteModal, "userInviteModal");
      addInvite.innerHTML = "Send Invite";

      if (commonFriendArr.length > 0) {
        for (let z = 0; z < commonFriendArr.length; z++) {
          commonFriendIndex = findUIDItemInArr(commonFriendArr[z], userArr);
          if (commonFriendIndex != -1 && !userBlackList.includes(userArr[commonFriendIndex].uid)) {
            inviteInfo.innerHTML = "Suggested Friend: " + userArr[commonFriendIndex].userName + " " + "(" + userArr[commonFriendIndex].name + ")";
            inviteInfo.onclick = function() {
              userNameInp.value = userArr[commonFriendIndex].userName;
            };
            addToBlackList.style.display = "block";
            addToBlackList.onclick = function () {
              if (!userBlackList.includes(userArr[commonFriendIndex].uid)) {
                userBlackList.push(userArr[commonFriendIndex].uid);
                firebase.database().ref("users/" + user.uid).update({
                  userBlackList: userBlackList
                });
              }
              user.userBlackList = userBlackList;
              inviteInfo.innerHTML = "";
              addToBlackList.style.display = "none";
              addUser.style.background = "#ff4c4c";
            };
            break;
          }
        }
      }

      addInvite.onclick = function() {
        let userLocation = -1;
        let containsInt = false;
        let dashCount = 0;
        let shareCodeBool = false;

        for (let i = 0; i < userNameInp.value.length; i++) {
          if (userNameInp.value[i] >= '0' && userNameInp.value[i] <= '9') {
            containsInt = true;
          } else if (userNameInp.value[i] == '-') {
            dashCount++;
          }

          if (dashCount > 2 && containsInt) {
            shareCodeBool = true;
            break;
          }
        }

        if (shareCodeBool) {
          for (let i = 0; i < userArr.length; i++) {
            if (userArr[i].shareCode == userNameInp.value) {
              userLocation = i;
              break;
            }
          }
        } else {
          for (let i = 0; i < upperCaseUserArr.length; i++) {
            if (upperCaseUserArr[i] == userNameInp.value.toUpperCase()) {
              userLocation = i;
              break;
            }
          }
        }

        addToBlackList.style.display = "none";
        addToBlackList.onclick = function() {};
        inviteInfo.innerHTML = "";
        if(userNameInp.value == ""){
          inviteInfo.innerHTML = "No User Name Or Share Code Provided, Please Try Again!";
        } else if (friendShareCodeList.includes(userNameInp.value) ||
          friendUserNameList.includes(userNameInp.value.toUpperCase())) {
          inviteInfo.innerHTML = userNameInp.value + " Is Already Your Friend, Please Try Again!";
        } else if (user.userName.toUpperCase() == userNameInp.value.toUpperCase() ||
          user.shareCode == userNameInp.value){
          inviteInfo.innerHTML = "You Cannot Invite Yourself, Please Try Again!";
        } else if (userLocation != -1) {
          try {
            if (user.invites.includes(userArr[userLocation].uid)) {
              inviteInfo.innerHTML = userNameInp.value + " Already Sent You An Invite, Please Try Again!";
            } else if (userArr[userLocation].invites.includes(user.uid)) {
              inviteInfo.innerHTML = "You Already Sent " + userNameInp.value + " An Invite, Please Try Again!";
            } else {
              generateConfirmDialog(userLocation);
            }
          } catch (err) {
            try {
              if (userArr[userLocation].invites.includes(user.uid)) {
                inviteInfo.innerHTML = "You Already Sent " + userNameInp.value + " An Invite, Please Try Again!";
              } else {
                generateConfirmDialog(userLocation);
              }
            } catch (err) {
              generateConfirmDialog(userLocation);
            }
          }
        } else if (userNameInp.value.toUpperCase() == "USER NAME BELOW"){
          inviteInfo.innerHTML = "Very Funny, Please Enter A User Name";
        } else if (userNameInp.value.toUpperCase() == "A USER NAME"){
          inviteInfo.innerHTML = "Listen Here, Please Input Something Serious";
        } else if (userNameInp.value.toUpperCase() == "SOMETHING SERIOUS"){
          inviteInfo.innerHTML = "You're Just Mocking Me At This Point";
        } else {
          if (shareCodeBool) {
            inviteInfo.innerHTML = "That Share Code, \"" + userNameInp.value + "\" Does Not Exist, Please Try Again!";
          } else {
            inviteInfo.innerHTML = "That User Name, \"" + userNameInp.value + "\" Does Not Exist, Please Try Again!";
          }
        }
      };

      cancelInvite.onclick = function() {
        closeModal(userInviteModal);
        userNameInp.value = "";
        inviteInfo.innerHTML = "";
        addToBlackList.style.display = "none";
        addToBlackList.onclick = function() {};
      };

      closeUserInviteModal.onclick = function() {
        closeModal(userInviteModal);
        userNameInp.value = "";
        inviteInfo.innerHTML = "";
        addToBlackList.style.display = "none";
        addToBlackList.onclick = function() {};
      };
    };
    addUser.innerHTML = "Invite User";

    if(consoleOutput)
      console.log("Add Button Generated");
  }

  function generateConfirmDialog(userLocation) {
    if(consoleOutput) {
      console.log(userLocation);
      console.log(userArr[userLocation].userName);
    }
    if (userLocation != -1) {
      closeModal(userInviteModal);
      confUserName.innerHTML = "Did you mean to add \"" + userArr[userLocation].name + "\"?";

      inviteConfirm.onclick = function () {
        inviteUserDB(userArr[userLocation]);
        closeModal(confirmModal);
        userNameInp.value = "";
        inviteInfo.innerHTML = "";
        addToBlackList.style.display = "none";
        addToBlackList.onclick = function() {};
      };

      inviteDeny.onclick = function () {
        closeModal(confirmModal);
        openModal(userInviteModal, "userInviteModal");
        userNameInp.value = "";
        inviteInfo.innerHTML = "";
        addToBlackList.style.display = "none";
        addToBlackList.onclick = function() {};
      };

      closeConfirmModal.onclick = function () {
        closeModal(confirmModal);
        userNameInp.value = "";
        inviteInfo.innerHTML = "";
        addToBlackList.style.display = "none";
        addToBlackList.onclick = function() {};
      };

      window.onclick = function (event) {
        if (event.target == confirmModal) {
          closeModal(confirmModal);
          userNameInp.value = "";
          inviteInfo.innerHTML = "";
          addToBlackList.style.display = "none";
          addToBlackList.onclick = function() {};
        }
      }
      openModal(confirmModal, "confirmUserModal", true);
    } else {
      deployNotificationModal(true, "User Finder Error!", "There was an error " +
        "finding that user... Please contact the developer for assistance on the FAQ page!");
    }
  }

  function removeFriendElement(uid) {
    document.getElementById('user' + uid).remove();

    dataCounter--;
    if(dataCounter == 0){
      if (invitesFound)
        inviteListEmptyText = "No Friends Found, But You Have Some Pending Invites!";
      else
        inviteListEmptyText = "No Friends Found! Invite Some Friends With The Button Below!";
      deployListEmptyNotification(inviteListEmptyText);
    }
  }

  function inviteUserDB(invitedUser) {
    let invitedUserInvites;
    if(invitedUser.invites == undefined || invitedUser.invites == null){
      invitedUserInvites = [];
    } else {
      invitedUserInvites = invitedUser.invites;
    }
    invitedUserInvites.push(user.uid);

    if(invitedUser.invites != undefined) {
      firebase.database().ref("users/" + invitedUser.uid).update({
        invites: invitedUserInvites
      });
    } else {
      if(consoleOutput)
        console.log("New Invite List");
      firebase.database().ref("users/" + invitedUser.uid).update({invites:{0:user.uid}});
    }

    if (commonFriendArr.includes(invitedUser.uid)) {
      let i = commonFriendArr.indexOf(invitedUser.uid);
      commonFriendArr.splice(i, 1);
    }

    let notificationString = generateNotificationString(user.uid,"","","");
    let invitedUserNotifications;
    if(invitedUser.notifications == undefined){
      invitedUserNotifications = [];
    } else {
      invitedUserNotifications = invitedUser.notifications;
    }
    invitedUserNotifications.push(notificationString);

    if(invitedUser.notifications != undefined) {
      firebase.database().ref("users/" + invitedUser.uid).update({
        notifications: invitedUserNotifications
      });
    } else {
      if(consoleOutput)
        console.log("New Notifications List");
      firebase.database().ref("users/" + invitedUser.uid).update({notifications:{0:notificationString}});
    }
  }
};
