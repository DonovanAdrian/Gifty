/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let confirmationElements = [];
let userArr = [];
let friendArr = [];
let inviteArr = [];
let listeningFirebaseRefs = [];

let readNotificationsBool = false;
let inviteListEmptyBool = false;

let dataCounter = 0;
let loadingTimerInt = 0;
let deleteInviteRun = 0;

let testData;
let dataListContainer;
let offlineSpan;
let offlineModal;
let user;
let userInitial;
let userInvites;
let userFriends;
let inviteModal;
let inviteNote;
let loadingTimer;
let offlineTimer;
let notificationModal;
let notificationInfo;
let notificationTitle;
let noteSpan;
let notificationBtn;
let closeInviteModal;
let userNameFld;
let userUNameFld;
let userShareCodeFld;
let userAcceptBtn;
let userDeleteBtn;


function getCurrentUser(){
  let localConsoleOutput = false;

  try {
    user = JSON.parse(sessionStorage.validUser);
    if(user.moderatorInt == 1)
      localConsoleOutput = true;
    if(localConsoleOutput)
      console.log("User: " + user.userName + " loaded in");
    if (user.invites == undefined) {
      if(localConsoleOutput)
        console.log("Invites Not Found");
      deployListEmptyNotification("No Invites Found! You Already Accepted All Your Invites!");
      inviteListEmptyBool = true;
    } else if (user.invites != undefined) {
      if (user.invites.length > 0) {
        inviteNote.style.background = "#ff3923";
      }
    }

    if (user.readNotifications == undefined) {
      if(localConsoleOutput)
        console.log("Read Notifications Not Found");
    } else {
      readNotificationsBool = true;
    }

    if (user.notifications == undefined) {
      if(localConsoleOutput)
        console.log("Notifications Not Found");
    } else if (user.notifications != undefined) {
      if (readNotificationsBool){
        if (user.notifications.length > 0 && user.readNotifications.length < user.notifications.length) {
          notificationBtn.src = "img/bellNotificationOn.png";
          notificationBtn.onclick = function() {
            newNavigation(6);//Notifications
          }
        } else {
          notificationBtn.src = "img/bellNotificationOff.png";
          notificationBtn.onclick = function() {
            newNavigation(6);//Notifications
          }
        }
      } else if (user.notifications.length > 0) {
        notificationBtn.src = "img/bellNotificationOn.png";
        notificationBtn.onclick = function() {
          newNavigation(6);//Notifications
        }
      }
    }
    userArr = JSON.parse(sessionStorage.userArr);
  } catch (err) {
    if(localConsoleOutput)
      console.log(err.toString());
    window.location.href = "index.html";
  }
}

window.onload = function instantiate() {

  testData = document.getElementById('testData');
  notificationBtn = document.getElementById('notificationButton');
  dataListContainer = document.getElementById('dataListContainer');
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  inviteNote = document.getElementById('inviteNote');
  notificationModal = document.getElementById('notificationModal');
  notificationTitle = document.getElementById('notificationTitle');
  notificationInfo = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  inviteModal = document.getElementById('inviteModal');
  closeInviteModal = document.getElementById('closeInviteModal');
  userNameFld = document.getElementById('userNameFld');
  userUNameFld = document.getElementById('userUNameFld');
  userShareCodeFld = document.getElementById('userShareCodeFld');
  userAcceptBtn = document.getElementById('userAcceptBtn');
  userDeleteBtn = document.getElementById('userDeleteBtn');
  confirmationElements = [testData, notificationBtn, dataListContainer, offlineModal, offlineSpan, inviteNote,
    notificationModal, notificationTitle, notificationInfo, noteSpan, inviteModal, closeInviteModal, userNameFld,
    userUNameFld, userShareCodeFld, userAcceptBtn, userDeleteBtn];
  getCurrentUser();
  commonInitialization();
  verifyElementIntegrity(confirmationElements);

  loadingTimer = setInterval(function(){
    loadingTimerInt = loadingTimerInt + 1000;
    if(loadingTimerInt >= 2000){
      if (testData == undefined){
        if(consoleOutput)
          console.log("TestData Missing. Loading Properly.");
      } else if (!inviteListEmptyBool) {
        testData.innerHTML = "Loading... Please Wait...";
      }
      clearInterval(loadingTimer);
    }
  }, 1000);

  databaseQuery();

  alternateButtonLabel(inviteNote, "Invites", "Confirm");

  function databaseQuery() {

    userInitial = firebase.database().ref("users/");
    userFriends = firebase.database().ref("users/" + user.uid + "/friends");
    userInvites = firebase.database().ref("users/" + user.uid + "/invites");

    let fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          if(consoleOutput)
            console.log("Adding " + userArr[i].userName + " to most updated version: " + data.val().userName);
          userArr[i] = data.val();
        }

        if(data.key == user.uid){
          user = data.val();
          if(consoleOutput)
            console.log("User Updated: 1");
        }
      });

      postRef.on('child_changed', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          if(consoleOutput)
            console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
          userArr[i] = data.val();
        }

        if(data.key == currentModalOpen) {//Moved currentModalOpen reference to common.js
          closeModal(inviteModal);
        }

        if(data.key == user.uid){
          user = data.val();
          if(consoleOutput)
            console.log("User Updated: 2");
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

    let fetchFriends = function (postRef) {
      postRef.on('child_added', function (data) {
        if (!friendArr.includes(data.val())) {
          friendArr.push(data.val());
        }
        if (!user.friends.includes(data.val())) {
          user.friends.push(data.val());
        }
      });

      postRef.on('child_changed', function (data) {
        if(consoleOutput)
          console.log(friendArr);
        friendArr[data.key] = data.val();
        if(consoleOutput)
          console.log(friendArr);

        if(consoleOutput)
          console.log(user.friends);
        user.friends[data.key] = data.val();
        if(consoleOutput)
          console.log(user.friends);
      });

      postRef.on('child_removed', function (data) {
        if(consoleOutput)
          console.log(friendArr);
        friendArr.splice(data.key, 1);
        if(consoleOutput)
          console.log(friendArr);

        if(consoleOutput)
          console.log(user.friends);
        user.friends.splice(data.key, 1);
        if(consoleOutput)
          console.log(user.friends);
      });
    };

    let fetchInvites = function (postRef) {
      postRef.on('child_added', function (data) {
        inviteArr.push(data.val());

        createInviteElement(data.val());
        inviteNote.style.background = "#ff3923";
      });

      postRef.on('child_changed', function (data) {
        inviteArr[data.key] = data.val();

        changeInviteElement(data.val());
      });

      postRef.on('child_removed', function (data) {
        sessionStorage.setItem("validUser", JSON.stringify(user));
        location.reload();
      });
    };

    fetchData(userInitial);
    fetchFriends(userFriends);
    fetchInvites(userInvites);

    listeningFirebaseRefs.push(userInitial);
    listeningFirebaseRefs.push(userFriends);
    listeningFirebaseRefs.push(userInvites);
  }

  function createInviteElement(inviteKey){
    try{
      testData.remove();
    } catch (err) {}

    let inviteData;
    for (let i = 0; i < userArr.length; i++){
      if(inviteKey == userArr[i].uid){
        inviteData = userArr[i];
        break;
      }
    }

    if (inviteData != null) {
      let liItem = document.createElement("LI");
      liItem.id = "user" + inviteData.uid;
      initInviteElement(liItem, inviteData);
      let textNode = document.createTextNode(inviteData.name);
      liItem.appendChild(textNode);
      dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
      dataCounter++;
    }
  }

  function changeInviteElement(inviteKey){
    let inviteData;
    for (let i = 0; i < userArr.length; i++){
      if(inviteKey == userArr[i].uid){
        inviteData = userArr[i];
        break;
      }
    }

    if (inviteData != null) {
      let liItemUpdate = document.getElementById('user' + inviteData.uid);
      liItemUpdate.innerHTML = inviteData.name;
      initInviteElement(liItemUpdate, inviteData);
    }
  }

  function initInviteElement(liItem, inviteData) {
    liItem.className = "gift";
    liItem.onclick = function (){

      if(inviteData.shareCode == undefined) {
        inviteData.shareCode = "This User Does Not Have A Share Code";
      }

      userNameFld.innerHTML = inviteData.name;
      userUNameFld.innerHTML = "User Name: " + inviteData.userName;
      userShareCodeFld.innerHTML = "Share Code: " + inviteData.shareCode;

      userAcceptBtn.onclick = function(){
        addInvite(inviteData);
        closeModal(inviteModal);
      };

      userDeleteBtn.onclick = function(){
        deleteInvite(inviteData.uid);
        closeModal(inviteModal);
      };

      //show modal
      openModal(inviteModal, inviteData.uid);

      //close on close
      closeInviteModal.onclick = function() {
        closeModal(inviteModal);
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == inviteModal) {
          closeModal(inviteModal);
        }
      }
    };
  }

  function addInvite(inviteData){
    let finalInviteData;
    let friendFriendArr;
    let userFriendArr;

    if(consoleOutput) {
      console.log("Adding " + inviteData.uid);
      console.log(friendArr);
    }

    if(inviteData.friends == undefined || inviteData.friends == null || inviteData.friends.length == 0) {
      friendFriendArr = [];
    } else {
      friendFriendArr = inviteData.friends;
    }

    friendFriendArr.push(user.uid);

    if (!friendFriendArr.includes(user.uid)) {
      alert("The invite could not be added to your friend list! Please try again...");
      return;
    }

    if (friendArr == undefined || friendArr == null || friendArr.length == 0) {
      userFriendArr = [];
    } else {
      userFriendArr = friendArr;
    }

    userFriendArr.push(inviteData.uid);

    if (!userFriendArr.includes(inviteData.uid)) {
      alert("The invite could not be added to your friend list! Please try again...");
      return;
    }

    if(consoleOutput)
      console.log(userFriendArr);

    finalInviteData = [friendFriendArr, userFriendArr];

    deleteInvite(inviteData.uid, finalInviteData);
  }

  function deleteInvite(uid, finalInviteData) {
    let verifyDeleteBool = true;
    let toDelete;

    if(consoleOutput)
      console.log(inviteArr);
    if(consoleOutput)
      console.log("Deleting Invite " + uid);

    toDelete = findUIDItemInArr(uid, inviteArr);

    if(toDelete != -1) {
      inviteArr.splice(toDelete, 1);

      if (inviteArr.includes(uid)) {
        verifyDeleteBool = false;
      }
    } else {
      verifyDeleteBool = false;
    }

    if(verifyDeleteBool){
      let note = findUIDItemInArr(uid, userArr);
      if(user.notifications != undefined)
        for(let x = 0; x < user.notifications.length; x++)
          if(user.notifications[x].includes(userArr[note].name))
            if(user.notifications[x].split(",").length == 2)
              setReadNotification(x);

      if(consoleOutput) {
        console.log(inviteArr);
        console.log("Updating Invites To DB...");
      }
      firebase.database().ref("users/" + user.uid).update({
        invites: inviteArr
      });

      if(consoleOutput)
        console.log("Updating Friend's Friend List To DB...");
      firebase.database().ref("users/" + uid).update({
        friends: finalInviteData[0]
      });

      if(consoleOutput)
        console.log("Updating User's Friend List To DB...");
      firebase.database().ref("users/" + user.uid).update({
        friends: finalInviteData[1]
      });

      user.invites = inviteArr;
      user.friends = finalInviteData[1];

      if(inviteArr.length == 0) {
        newNavigation(4);//Invites
      }
    } else {
      if (deleteInviteRun < 3) {
        deleteInviteRun++;
        deleteInvite(uid, finalInviteData);
      } else {
        deleteInviteRun = 0;

        alert("The invite could not be added to your friend list! Please try again...");
      }
    }
  }

  function setReadNotification(uid) {
    let readNotificationArr = user.readNotifications;

    if (readNotificationArr != undefined) {
      let toSet = readNotificationArr.indexOf(user.notifications[uid]);
      if(toSet == -1){
        readNotificationArr.push(user.notifications[uid]);
        firebase.database().ref("users/" + user.uid).update({
          readNotifications: readNotificationArr
        });
      }
    } else {
      readNotificationArr = [];
      readNotificationArr.push(user.notifications[uid]);
      firebase.database().ref("users/" + user.uid).update({readNotifications:{0:readNotificationArr}});
    }
  }
};
