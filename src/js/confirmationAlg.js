/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let confirmationElements = [];
let userArr = [];
let friendArr = [];
let inviteArr = [];
let oldInviteArr = [];
let listeningFirebaseRefs = [];
let initializedUsers = [];

let inviteDeleteLocal = false;
let potentialRemoval = false;

let dataCounter = 0;
let commonLoadingTimerInt = 0;
let deleteInviteRun = 0;

let testData;
let backBtn;
let dataListContainer;
let offlineSpan;
let offlineModal;
let user;
let userInitial;
let userInvites;
let userFriends;
let inviteModal;
let inviteNote;
let commonLoadingTimer;
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
  getCurrentUserCommon();

  if (user.invites == undefined) {
    deployListEmptyNotification("No Invites Found! You've Reviewed All Your Invites!");
  } else if (user.invites.length == 0) {
    deployListEmptyNotification("No Invites Found! You've Reviewed All Your Invites!");
  }
}

window.onload = function instantiate() {
  pageName = "Confirmation";
  testData = document.getElementById('testData');
  backBtn = document.getElementById('backBtn');
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

  userInitial = firebase.database().ref("users/");
  userFriends = firebase.database().ref("users/" + user.uid + "/friends");
  userInvites = firebase.database().ref("users/" + user.uid + "/invites");

  databaseQuery();
  updateConfirmationButton(user.friends)

  function updateConfirmationButton(confirmFriendData) {
    let setBlank = true;

    if (confirmFriendData != null)
      if (confirmFriendData.length != 0)
        if (confirmFriendData.length == 1) {
          alternateButtonLabel(inviteNote, "1 Friend", "Confirm");
          setBlank = false;
        } else if (confirmFriendData.length < 100) {
          alternateButtonLabel(inviteNote, confirmFriendData.length + " Friends", "Confirm");
          setBlank = false;
        }

    if (setBlank)
      alternateButtonLabel(inviteNote, "Friends", "Confirm");
  }

  function initializeBackBtn() {
    backBtn.innerHTML = "Return To Invites";
    backBtn.onclick = function() {
      navigation(4);
    };
  }

  initializeBackBtn();

  function databaseQuery() {
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

        if(data.key == currentModalOpen) {
          closeModal(inviteModal);
        }

        if(data.key == user.uid){
          user = data.val();
          updateConfirmationButton(user.friends);

          if (user.invites != undefined) {
            inviteArr = user.invites;
          } else {
            inviteArr = [];
          }
          if (potentialRemoval) {
            findRemovedUser(oldInviteArr, inviteArr);
            potentialRemoval = false;
          }
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
        if (!friendArr.includes(data.val())) {
          friendArr.push(data.val());
        }
        if (user.friends != null)
          if (!user.friends.includes(data.val())) {
            user.friends.push(data.val());
          }
      });

      postRef.on('child_changed', function (data) {
        friendArr[data.key] = data.val();
        if (user.friends != null)
          user.friends[data.key] = data.val();
      });

      postRef.on('child_removed', function (data) {
        friendArr.splice(data.key, 1);
        if (user.friends != null)
          user.friends.splice(data.key, 1);
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

        if (initializedUsers.includes(data.key)) {
          changeInviteElement(data.val());
        }
      });

      postRef.on('child_removed', function () {
        if (!inviteDeleteLocal) {
          potentialRemoval = true;
          oldInviteArr = [];
          for (let i = 0; i < inviteArr.length; i++) {
            oldInviteArr.push(inviteArr[i]);
          }
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

  function findRemovedUser(oldArr, newArr) {
    let removedUserIndex = -1;

    removedUserIndex = findRemovedData(oldArr, newArr, true);
    if (removedUserIndex != -1) {
      removeInviteElement(oldArr[removedUserIndex]);
      let i = initializedUsers.indexOf(oldArr[removedUserIndex]);
      initializedUsers.splice(i, 1);
      oldInviteArr.splice(removedUserIndex, 1);
    }
  }

  function createInviteElement(inviteKey){
    let inviteData;

    try{
      document.getElementById('testData').remove();
    } catch (err) {
      console.log("But it \"Doesn't Exist!!\"");
    }

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
      clearInterval(commonLoadingTimer);
      clearInterval(offlineTimer);
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
        confirmDeletion(inviteData);
        closeModal(inviteModal);
      };

      openModal(inviteModal, inviteData.uid);

      closeInviteModal.onclick = function() {
        closeModal(inviteModal);
      };
    };

    if (!initializedUsers.includes(inviteData.uid)) {
      initializedUsers.push(inviteData.uid);
    }
  }

  function addInvite(inviteData){
    let finalInviteData;
    let friendFriendArr;
    let userFriendArr;
    let currentUserScore;

    if (user.userScore == null) {
      user.userScore = 0;
    }

    user.userScore = user.userScore + 5;
    currentUserScore = user.userScore;

    if(consoleOutput) {
      console.log("Pre-adding " + inviteData.uid + " to User's Friend List:");
      console.log(friendArr);
    }

    if(inviteData.friends == null || inviteData.friends.length == 0) {
      friendFriendArr = [];
    } else {
      friendFriendArr = inviteData.friends;
    }

    friendFriendArr.push(user.uid);
    if(consoleOutput) {
      console.log("Added current user (" + user.uid + ") to friend's Friend List:");
      console.log(friendFriendArr);
    }

    if (!friendFriendArr.includes(user.uid)) {
      deployNotificationModal(true, "Invite Confirmation Error!", "The invite could not be added to your " +
        "friend list! Please try again...", 4);
      updateMaintenanceLog("confirmation", user.userName + " attempted to add friend, " +
        inviteData.userName + " and FAILED! (There was an issue with " + inviteData.userName + "'s friend list)");
      return;
    }

    if (friendArr == undefined || friendArr == null || friendArr.length == 0) {
      userFriendArr = [];
    } else {
      userFriendArr = friendArr;
    }

    userFriendArr.push(inviteData.uid);

    if (!userFriendArr.includes(inviteData.uid)) {
      deployNotificationModal(true, "Invite Confirmation Error!", "The invite could not be added to your " +
        "friend list! Please try again...", 4);
      updateMaintenanceLog("confirmation", user.userName + " attempted to add friend, " +
        inviteData.userName + " and FAILED! (There was an issue with " + user.userName + "'s friend list)");
      return;
    }

    if(consoleOutput) {
      console.log("New User's Friend List:")
      console.log(userFriendArr);
    }

    finalInviteData = [friendFriendArr, userFriendArr];
    firebase.database().ref("users/" + user.uid).update({userScore: currentUserScore});
    deleteInvite(inviteData, finalInviteData);
  }

  function confirmDeletion(delInviteData) {
    confirmTitle.innerHTML = "Confirm Invite Removal";
    confirmContent.innerHTML = "Are you sure you want to remove your invite, " + delInviteData.name + "?";

    confirmBtn.onclick = function() {
      closeModal(confirmModal);
      deleteInvite(delInviteData);
    };

    denyBtn.onclick = function() {
      closeModal(confirmModal);
      openModal(inviteModal, delInviteData.uid);
    }

    openModal(confirmModal, "confirmModal", true);

    closeConfirmModal.onclick = function() {
      closeModal(confirmModal);
      openModal(inviteModal, delInviteData.uid);
    };

    window.onclick = function(event) {
      if (event.target == confirmModal) {
        closeModal(confirmModal);
      }
    };
  }

  function deleteInvite(inviteData, finalInviteData) {
    let verifyDeleteBool = true;
    let toDelete;
    let uid = inviteData.uid;

    if(consoleOutput) {
      console.log("Pre User Invites:");
      console.log(inviteArr);
    }

    toDelete = inviteArr.indexOf(uid);

    if(toDelete != -1) {
      inviteArr.splice(toDelete, 1);

      if (inviteArr.includes(uid)) {
        verifyDeleteBool = false;
      }
    } else {
      verifyDeleteBool = false;
    }

    if(verifyDeleteBool){
      inviteDeleteLocal = true;
      let i = initializedUsers.indexOf(uid);
      if (i != -1) {
        initializedUsers.splice(i, 1);
      }

      let inviteNoteIndex = findUIDItemInArr(uid, userArr);
      let noteSplit = [];
      let noteSplitCount = 0;
      if(user.notifications != undefined)
        for(let x = 0; x < user.notifications.length; x++)
          if(user.notifications[x].data.includes(userArr[inviteNoteIndex].name)) {
            for (let i = 0; i < noteSplit.length; i++) {
              noteSplit[i] = noteSplit[i].replaceAll('"', '');
              if (noteSplit[i] != "") {
                noteSplitCount++;
              }
            }
            if (noteSplitCount == 1)
              firebase.database().ref("users/" + user.uid + "/notifications/" + x).update({
                read: 1
              });
          }

      if(consoleOutput) {
        console.log("New User Invites:");
        console.log(inviteArr);
      }

      firebase.database().ref("users/" + user.uid).update({
        invites: inviteArr
      });

      if (finalInviteData != null) {
        if(consoleOutput) {
          console.log("Updating Friend's Friend List To DB:");
          console.log(finalInviteData[0]);
        }

        firebase.database().ref("users/" + uid).update({
          friends: finalInviteData[0]
        });

        if(consoleOutput) {
          console.log("Updating User's Friend List To DB:");
          console.log(finalInviteData[1]);
        }

        firebase.database().ref("users/" + user.uid).update({
          friends: finalInviteData[1]
        });

        user.invites = inviteArr;
        user.friends = finalInviteData[1];
        sessionStorage.setItem("validUser", JSON.stringify(user));
      }

      removeInviteElement(uid);
      if (finalInviteData != null) {
        deployNotificationModal(false, "Invite Accepted!", "Your invite from " +
          inviteData.name + " was successfully accepted!");
      } else {
        deployNotificationModal(false, "Invite Deleted!", "Your invite from " +
          inviteData.name + " was successfully deleted!");
      }
      inviteDeleteLocal = false;
    } else {
      if (deleteInviteRun < 3) {
        deleteInviteRun++;
        deleteInvite(inviteData, finalInviteData);
      } else {
        deleteInviteRun = 0;
        deployNotificationModal(true, "Invite Confirmation Error!", "The invite could not be added to your " +
          "friend list! Please try again...", 4);
        updateMaintenanceLog("confirmation", user.userName + " attempted to add friend, " +
          inviteData.userName + " and FAILED! (There was an issue with " + user.userName + "'s locally stored friend list)");
      }
    }
  }

  function removeInviteElement(uid) {
    document.getElementById('user' + uid).remove();

    dataCounter--;
    if (dataCounter == 0) {
      deployListEmptyNotification("No Invites Found! You've Reviewed All Your Invites!");
    }
  }
};
