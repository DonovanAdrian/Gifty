/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let confirmationElements = [];
let friendArr = [];
let oldInviteArr = [];
let initializedUsers = [];

let inviteDeleteLocal = false;
let potentialRemoval = false;

let deleteInviteRun = 0;

let inviteModal;
let closeInviteModal;
let userNameFld;
let userUNameFld;
let userShareCodeFld;
let userAcceptBtn;
let userDeleteBtn;



function getCurrentUser(){
  getCurrentUserCommon();
  failedNavNum = 11;

  if (user.invites == undefined) {
    user.invites = [];
  } else {
    inviteArr = user.invites;
    for (let i = 0; i < user.invites.length; i++) {
      createInviteElement(user.invites[i]);
    }
  }

  if (user.invites.length == 0) {
    deployListEmptyNotification("No Invites Found! You've Reviewed All Your Invites!");
  }
}

window.onload = function instantiate() {
  initializeConfirmationPage();

  function initializeConfirmationPage() {
    try {
      pageName = "Confirmation";
      backBtn = document.getElementById("backBtn");
      inviteNote = document.getElementById("inviteNote");
      notificationBtn = document.getElementById("notificationButton");
      inviteModal = document.getElementById("inviteModal");
      closeInviteModal = document.getElementById("closeInviteModal");
      userNameFld = document.getElementById("userNameFld");
      userUNameFld = document.getElementById("userUNameFld");
      userShareCodeFld = document.getElementById("userShareCodeFld");
      userAcceptBtn = document.getElementById("userAcceptBtn");
      userDeleteBtn = document.getElementById("userDeleteBtn");

      getCurrentUser();
      commonInitialization();

      confirmationElements = [testData, notificationBtn, dataListContainer, offlineModal, offlineSpan, inviteNote,
        notificationModal, notificationTitle, notificationInfo, noteSpan, inviteModal, closeInviteModal, userNameFld,
        userUNameFld, userShareCodeFld, userAcceptBtn, userDeleteBtn];

      verifyElementIntegrity(confirmationElements);

      userInitial = firebase.database().ref("users/");
      userFriends = firebase.database().ref("users/" + user.uid + "/friends");
      userInvites = firebase.database().ref("users/" + user.uid + "/invites");

      databaseQuery();
      updateConfirmationButton(user.friends);

      initializeBackBtn();
    } catch (err) {
      sendCriticalInitializationError(err);
    }
  }

  function databaseQuery() {
    let fetchData = function (postRef) {
      postRef.on("child_added", function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if (i != -1) {
          localObjectChanges = findObjectChanges(userArr[i], data.val());
          if (localObjectChanges.length != 0) {
            userArr[i] = data.val();

            if (data.key == user.uid) {
              user = data.val();
              updateConfirmationButton(user.friends);
              checkNotifications();
            }
            saveCriticalCookies();
          }
        } else {
          userArr.push(data.val());

          if (data.key == user.uid) {
            user = data.val();
            updateConfirmationButton(user.friends);
            checkNotifications();
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

            if(data.key == currentModalOpen) {
              closeModal(inviteModal);
              deployNotificationModal(false, data.val().name + " Updated!",
                  data.val().name + " was updated! Please reopen the window to see the changes.");
            }

            if(data.key == user.uid){
              user = data.val();
              updateConfirmationButton(user.friends);
              checkNotifications();
              if (user.invites != undefined) {
                inviteArr = user.invites;
              } else {
                inviteArr = [];
              }
              if (potentialRemoval) {
                findRemovedUser(oldInviteArr, inviteArr);
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
          saveCriticalCookies();
        }
      });
    };

    let fetchFriends = function (postRef) {
      postRef.on("child_added", function (data) {
        if (!friendArr.includes(data.val())) {
          friendArr.push(data.val());
        }
        if (user.friends != undefined)
          if (!user.friends.includes(data.val())) {
            user.friends.push(data.val());
          }
      });

      postRef.on("child_changed", function (data) {
        friendArr[data.key] = data.val();
        if (user.friends != undefined)
          user.friends[data.key] = data.val();
      });

      postRef.on("child_removed", function (data) {
        friendArr.splice(data.key, 1);
        if (user.friends != undefined)
          user.friends.splice(data.key, 1);
      });
    };

    let fetchInvites = function (postRef) {
      postRef.on("child_added", function (data) {
        if (inviteArr.indexOf(data.val()) == -1) {
          inviteArr.push(data.val());
          user.invites = inviteArr;
          saveCriticalCookies();
        }

        createInviteElement(data.val());
        inviteNote.style.background = "#ff3923";
      });

      postRef.on("child_changed", function (data) {
        inviteArr[data.key] = data.val();

        if (initializedUsers.includes(data.key)) {
          changeInviteElement(data.val());
          user.invites = inviteArr;
          saveCriticalCookies();
        }
      });

      postRef.on("child_removed", function () {
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
};

function updateConfirmationButton(confirmFriendData) {
  let setBlank = true;

  if (confirmFriendData != undefined)
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
    navigation(4);//Invites
  };
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
  let inviteIndex = findUIDItemInArr(inviteKey, userArr);
  let inviteData = userArr[inviteIndex];

  try{
    document.getElementById("testData").remove();
  } catch (err) {}

  if (inviteIndex != -1 && initializedUsers.indexOf(inviteKey) == -1) {
    let liItem = document.createElement("LI");
    liItem.id = "user" + inviteData.uid;
    initInviteElement(liItem, inviteData);
    let textNode = document.createTextNode(inviteData.name);
    liItem.appendChild(textNode);
    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
    clearInterval(commonLoadingTimer);
    clearInterval(offlineTimer);
    dataCounter++;
  } else {
    changeInviteElement(inviteKey);
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

  if (inviteData != undefined) {
    let liItemUpdate = document.getElementById("user" + inviteData.uid);
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
    userUNameFld.innerHTML = "<b>User Name:</b> " + inviteData.userName;
    userShareCodeFld.innerHTML = "<b>Share Code:</b> " + inviteData.shareCode;

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

  logOutput("Pre-adding " + inviteData.uid + " to User's Friend List:");
  logOutput(friendArr);

  if(inviteData.friends == undefined || inviteData.friends.length == 0) {
    friendFriendArr = [];
  } else {
    friendFriendArr = inviteData.friends;
  }

  if (!friendFriendArr.includes(user.uid)) {
    friendFriendArr.push(user.uid);
    logOutput("Added current user (" + user.uid + ") to friend's Friend List:");
    logOutput(friendFriendArr);
  }

  if (!friendFriendArr.includes(user.uid)) {
    deployNotificationModal(true, "Invite Confirmation Error!", "The invite could not be added to your " +
        "friend list! Please try again...", 4);
    updateMaintenanceLog("confirmation", "\"" + user.userName + "\" attempted to add friend, " +
        inviteData.userName + " and FAILED! (There was an issue with " + inviteData.userName + "'s friend list)");
    return;
  }

  if (friendArr == undefined || friendArr.length == 0) {
    userFriendArr = [];
  } else {
    userFriendArr = friendArr;
  }

  if (!userFriendArr.includes(inviteData.uid)) {
    userFriendArr.push(inviteData.uid);
    logOutput("Added friend user (" + inviteData.uid + ") to current user's Friend List:");
    logOutput(userFriendArr);
  }

  if (!userFriendArr.includes(inviteData.uid)) {
    deployNotificationModal(true, "Invite Confirmation Error!", "The invite could not be added to your " +
        "friend list! Please try again...", 4);
    updateMaintenanceLog("confirmation", "\"" + user.userName + "\" attempted to add friend, " +
        inviteData.userName + " and FAILED! (There was an issue with " + user.userName + "'s friend list)");
    return;
  }

  logOutput("New User's Friend List:");
  logOutput(userFriendArr)

  finalInviteData = [friendFriendArr, userFriendArr];
  updateUserScore(user, confirmInviteScore);
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

  logOutput("Pre User Invites:");
  logOutput(inviteArr);

  toDelete = inviteArr.indexOf(uid);

  if(toDelete != -1) {
    inviteArr.splice(toDelete, 1);
    for (let i = 0; i < inviteArr.length; i++) {
      if (inviteArr[i] == uid) {
        verifyDeleteBool = false;
      }
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

    logOutput("New User Invites:")
    logOutput(inviteArr);

    let inviteNoteIndex = findUIDItemInArr(uid, userArr);
    let noteSplit = [];
    let noteSplitCount = 0;
    if(user.notifications != undefined)
      for(let x = 0; x < user.notifications.length; x++) {
        if (user.notifications[x].data.includes(userArr[inviteNoteIndex].uid)) {
          noteSplit = user.notifications[x].data.split(",,,");
          for (let i = 0; i < noteSplit.length; i++) {
            noteSplit[i] = noteSplit[i].replaceAll("\"", "");
            if (noteSplit[i] != "") {
              noteSplitCount++;
            }
          }
          if (noteSplitCount == 1)
            firebase.database().ref("users/" + user.uid + "/notifications/" + x).update({
              read: 1
            });
        }
        noteSplitCount = 0;
      }

    for (let i = 0; i < inviteArr.length; i++) {
      if (inviteArr[i] == uid) {
        inviteArr.splice(i, 1);
      }
    }

    firebase.database().ref("users/" + user.uid).update({
      invites: inviteArr
    });

    if (finalInviteData != undefined) {
      logOutput("Updating Friend's Friend List To DB:");
      logOutput(finalInviteData[0]);

      firebase.database().ref("users/" + uid).update({
        friends: finalInviteData[0]
      });

      logOutput("Updating User's Friend List To DB:");
      logOutput(finalInviteData[1]);

      firebase.database().ref("users/" + user.uid).update({
        friends: finalInviteData[1]
      });

      user.invites = inviteArr;
      user.friends = finalInviteData[1];
      saveCriticalCookies();
    }

    removeInviteElement(uid);
    showSuccessfulDBOperation = true;
    listenForDBChanges("Confirm", user.uid);
    if (finalInviteData != undefined) {
      successfulDBOperationTitle = "Invite Accepted!";
      successfulDBOperationNotice = "Your invite from " + inviteData.name + " was successfully accepted!";
    } else {
      successfulDBOperationTitle = "Invite Deleted!";
      successfulDBOperationNotice = "Your invite from " + inviteData.name + " was successfully deleted!";
    }
    saveCriticalCookies();
    inviteDeleteLocal = false;
  } else {
    if (deleteInviteRun < 3) {
      deleteInviteRun++;
      deleteInvite(inviteData, finalInviteData);
    } else {
      deleteInviteRun = 0;
      deployNotificationModal(true, "Invite Confirmation Error!", "The invite could not be added to your " +
          "friend list! Please try again...", 4);
      updateMaintenanceLog("confirmation", "\"" + user.userName + "\" attempted to add friend, " +
          inviteData.userName + " and FAILED! (There was an issue with " + user.userName + "'s locally stored friend list)");
    }
  }
}

function removeInviteElement(uid) {
  document.getElementById("user" + uid).remove();

  dataCounter--;
  if (dataCounter == 0) {
    deployListEmptyNotification("No Invites Found! You've Reviewed All Your Invites!");
  }
}
