/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let inviteElements = [];
let friendArr = [];
let oldFriendArr = [];
let commonFriendArr = [];
let initializedUsers = [];
let unBlacklistUsers = [];
let loadedBlacklistUsers = [];
let friendUserNameList = [];
let friendShareCodeList = [];

let invitesFound = false;
let potentialRemoval = false;
let friendDeleteLocal = false;
let friendListEmptyBool = false;

let easterEggA = 0;
let easterEggB = 0;
let easterEggC = 0;

let inviteListEmptyText = "";
let deletePendingUid = "";

let userInviteModal;
let confirmUserModal;
let blacklistModal;
let closeBlacklistModal;
let blacklistDescription;
let blacklistContainer;
let testBlacklist;
let blacklistRemove;
let blacklistedUsers;
let addUser;
let newInviteIcon;
let userNameInp;
let privateMessageModal;
let confirmModal;
let closeConfirmModal;
let confirmTitle;
let confirmContent;
let confirmBtn;
let denyBtn;
let inviteModal;
let closeInviteModal;
let userName;
let userUName;
let userShareCode;
let sendPrivateMessage;
let userInviteRemove;
let closePrivateMessageModal;
let privateMessageInp;
let sendMsg;
let cancelMsg;
let closeConfirmUserModal;
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
  failedNavNum = 4;
  if (user.friends == undefined) {
    user.friends = [];
  } else {
    friendArr = user.friends;
    for (let i = 0; i < user.friends.length; i++) {
      createFriendElement(user.friends[i]);
    }
  }

  if (user.friends.length == 0) {
    if (invitesFound)
      inviteListEmptyText = "No Friends Found, But You Have Some Pending Invites!";
    else
      inviteListEmptyText = "No Friends Found! Invite Some Friends With The Button Below!";
    deployListEmptyNotification(inviteListEmptyText);
    friendListEmptyBool = true;
  }
}

window.onload = function instantiate() {
  try {
    pageName = "Invites";
    notificationBtn = document.getElementById("notificationButton");
    userInviteModal = document.getElementById("userInviteModal");
    closeUserInviteModal = document.getElementById("closeUserInviteModal");
    userNameInp = document.getElementById("userNameInp");
    addToBlackList = document.getElementById("addToBlackList");
    inviteInfo = document.getElementById("inviteInfo");
    addInvite = document.getElementById("addInvite");
    cancelInvite = document.getElementById("cancelInvite");
    confirmUserModal = document.getElementById("confirmUserModal");
    closeConfirmUserModal = document.getElementById("closeConfirmUserModal");
    confUserName = document.getElementById("confUserName");
    inviteConfirm = document.getElementById("inviteConfirm");
    inviteDeny = document.getElementById("inviteDeny");
    inviteNote = document.getElementById("inviteNote");
    newInviteIcon = document.getElementById("newInviteIcon");
    blacklistModal = document.getElementById("blacklistModal");
    closeBlacklistModal = document.getElementById("closeBlacklistModal");
    blacklistDescription = document.getElementById("blacklistDescription");
    blacklistContainer = document.getElementById("blacklistContainer");
    testBlacklist = document.getElementById("testBlacklist");
    blacklistRemove = document.getElementById("blacklistRemove");
    blacklistedUsers = document.getElementById("blacklistedUsers");
    addUser = document.getElementById("addUser");
    confirmModal = document.getElementById("confirmModal");
    closeConfirmModal = document.getElementById("closeConfirmModal");
    confirmTitle = document.getElementById("confirmTitle");
    confirmContent = document.getElementById("confirmContent");
    confirmBtn = document.getElementById("confirmBtn");
    denyBtn = document.getElementById("denyBtn");
    privateMessageModal = document.getElementById("privateMessageModal");
    closePrivateMessageModal = document.getElementById("closePrivateMessageModal");
    privateMessageInp = document.getElementById("privateMessageInp");
    sendMsg = document.getElementById("sendMsg");
    cancelMsg = document.getElementById("cancelMsg");
    inviteModal = document.getElementById("inviteModal");
    closeInviteModal = document.getElementById("closeInviteModal");
    userName = document.getElementById("userName");
    userUName = document.getElementById("userUName");
    userShareCode = document.getElementById("userShareCode");
    sendPrivateMessage = document.getElementById("sendPrivateMessage");
    userInviteRemove = document.getElementById("userInviteRemove");

    getCurrentUser();
    initializeBlacklistBtn();
    commonInitialization();

    inviteElements = [notificationBtn, dataListContainer, offlineModal, offlineSpan, userInviteModal,
      closeUserInviteModal, userNameInp, addToBlackList, inviteInfo, addInvite, cancelInvite, confirmUserModal,
      closeConfirmUserModal, confUserName, inviteConfirm, inviteDeny, inviteNote, newInviteIcon, blacklistModal,
      closeBlacklistModal, blacklistDescription, blacklistContainer, testBlacklist, blacklistRemove, blacklistedUsers,
      addUser, confirmModal, closeConfirmModal, confirmTitle, confirmContent, confirmBtn, denyBtn, notificationModal,
      notificationTitle, notificationInfo, noteSpan, privateMessageModal, closePrivateMessageModal, privateMessageInp,
      sendMsg, cancelMsg, inviteModal, closeInviteModal, userName, userUName, userShareCode, sendPrivateMessage,
      userInviteRemove, testData];

    verifyElementIntegrity(inviteElements);

    userInitial = firebase.database().ref("users/");
    userFriends = firebase.database().ref("users/" + user.uid + "/friends");
    userInvites = firebase.database().ref("users/" + user.uid + "/invites");

    databaseQuery();

    if (invitesFound) {
      generateInviteIcon();
    }
    generateAddUserBtn();
  } catch (err) {
    sendCriticalInitializationError(err);
  }

  function databaseQuery() {
    let fetchData = function (postRef) {
      postRef.on("child_added", function (data) {
        globalNoteInt = 1;

        let i = findUIDItemInArr(data.key, userArr, true);
        if (i != -1) {
          localObjectChanges = findObjectChanges(userArr[i], data.val());
          if (localObjectChanges.length != 0) {
            userArr[i] = data.val();

            if (data.key == user.uid) {
              user = data.val();
              checkNotifications();
              updateFriendNav(user.friends);
            }
            saveCriticalCookies();
          }
        } else {
          userArr.push(data.val());

          if (data.key == user.uid) {
            user = data.val();
            checkNotifications();
            updateFriendNav(user.friends);
          }
          saveCriticalCookies();
        }
      });

      postRef.on("child_changed", function (data) {
        let i = findUIDItemInArr(data.key, userArr, true);
        if (i != -1) {
          localObjectChanges = findObjectChanges(userArr[i], data.val());
          if (localObjectChanges.length != 0) {
            if (consoleOutput)
              console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
            userArr[i] = data.val();

            if (initializedUsers.includes(data.key) && deletePendingUid != data.key) {
              changeFriendElement(data.key);
            }

            if(data.key == user.uid){
              user = data.val();
              checkNotifications();
              updateFriendNav(user.friends);
              refreshFriendInviteArrays();
              friendArr = user.friends;
              if (potentialRemoval) {
                findRemovedUser(oldFriendArr, friendArr);
                potentialRemoval = false;
              }
              if(consoleOutput)
                console.log("Current User Updated");
            }
            saveCriticalCookies();
          }
        }
      });

      postRef.on("child_removed", function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if (i != -1) {
          if(consoleOutput) {
            console.log("Removing " + userArr[i].userName + " / " + data.val().userName);
          }
          userArr.splice(i, 1);
          saveCriticalCookies();
        }
      });
    };

    let fetchFriends = function (postRef) {
      postRef.on("child_added", function (data) {
        if (friendArr.indexOf(data.val()) == -1) {
          friendArr.push(data.val());
          user.friends = friendArr;
          saveCriticalCookies();
        }
        createFriendElement(data.val());
      });

      postRef.on("child_changed", function (data) {
        friendArr[data.key] = data.val();
        if(consoleOutput)
          console.log("Changing " + data.val());
        changeFriendElement(data.key);
        user.friends = friendArr;
        saveCriticalCookies();
      });

      postRef.on("child_removed", function (data) {
        if (!friendDeleteLocal) {
          potentialRemoval = true;
          oldFriendArr = [];
          for (let i = 0; i < friendArr.length; i++) {
            oldFriendArr.push(friendArr[i]);
          }
        }
      });
    };

    let fetchInvites = function (postRef) {
      postRef.on("child_added", function (data) {
        generateInviteIcon();
        inviteArr.push(data.val());
      });

      postRef.on("child_changed", function (data) {
        inviteArr[data.key] = data.val();
      });

      postRef.on("child_removed", function (data) {
        inviteArr.splice(data.key, 1);

        if (inviteArr.length == 0) {
          if(consoleOutput)
            console.log("Invite List Removed");
          disableInviteIcon();
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
};

function generateInviteIcon() {
  newInviteIcon.style.display = "block";
  newInviteIcon.onclick = function () {
    navigation(11);//Confirmation
  };
}

function disableInviteIcon() {
  newInviteIcon.style.display = "none";
  newInviteIcon.onclick = function () {};
}

function showBlacklistModal() {
  let tempBlacklist = user.userBlackList;
  let unBlacklistUserIndex = 0;
  let blacklistedUserIndex = 0;

  clearLoadedBlacklistUsers(false);

  for (let i = 0; i < tempBlacklist.length; i++) {
    let liItem = document.createElement("LI");
    blacklistedUserIndex = findUIDItemInArr(tempBlacklist[i], userArr, true);
    liItem.id = "blacklist" + tempBlacklist[i];
    liItem.className = "gift";
    if (unBlacklistUsers.includes(tempBlacklist[i])) {
      liItem.className = "gift lowSev";
    }
    let textNode = document.createTextNode("\"" + userArr[blacklistedUserIndex].userName + "\", " + userArr[blacklistedUserIndex].name);
    liItem.appendChild(textNode);
    blacklistContainer.insertBefore(liItem, blacklistContainer.childNodes[0]);
    liItem.onclick = function () {
      if (liItem.className.includes("lowSev")) {
        liItem.className = "gift";
        unBlacklistUserIndex = unBlacklistUsers.indexOf(tempBlacklist[i]);
        if (unBlacklistUserIndex != -1)
          unBlacklistUsers.splice(unBlacklistUserIndex, 1);
      } else {
        liItem.className = "gift lowSev";
        if (!unBlacklistUsers.includes(tempBlacklist[i])) {
          unBlacklistUsers.push(tempBlacklist[i]);
        }
      }
      console.log(unBlacklistUsers);
    };

    loadedBlacklistUsers.push("blacklist" + tempBlacklist[i]);
  }

  blacklistRemove.onclick = function () {
    if (unBlacklistUsers.length == 0) {
      deployNotificationModal(true, "No Users Selected!", "You did not select " +
          "any users to remove from your blacklist! When selecting users, make sure their names turn green, then try " +
          "again.", 5);
    } else {
      for (let i = 0; i < unBlacklistUsers.length; i++) {
        unBlacklistUserIndex = tempBlacklist.indexOf(unBlacklistUsers[i]);
        if (unBlacklistUserIndex != -1) {
          tempBlacklist.splice(unBlacklistUserIndex, 1);
        }
      }
      firebase.database().ref("users/" + user.uid).update({
        userBlackList: tempBlacklist
      });
      user.userBlackList = tempBlacklist;
      saveCriticalCookies();
      deployNotificationModal(false, "Un-Blacklisted Users!", "You have " +
          "successfully un-blacklisted the selected users!", 5);
      unBlacklistUsers = [];
      initializeBlacklistBtn();
      generateAddUserBtn();
    }
  };

  openModal(blacklistModal, "blacklistModal");

  closeBlacklistModal.onclick = function() {
    closeModal(blacklistModal);
  };
}

function clearLoadedBlacklistUsers(addTestElem) {
  if (addTestElem == undefined)
    addTestElem = true;

  if (loadedBlacklistUsers.length != 0) {
    for (let a = 0; a < loadedBlacklistUsers.length; a++) {
      document.getElementById(loadedBlacklistUsers[a]).remove();
    }
    loadedBlacklistUsers = [];
  }

  try {
    testBlacklist.remove();
  } catch (err) {}

  if (addTestElem) {
    let liItem = document.createElement("LI");
    liItem.id = "testBlacklist";
    liItem.className = "gift";
    let textNode = document.createTextNode("No Blacklist Users Found!");
    liItem.appendChild(textNode);
    blacklistContainer.insertBefore(liItem, blacklistContainer.childNodes[0]);

    loadedBlacklistUsers.push("testBlacklist");
  }
}

function initializeBlacklistBtn() {
  if (user.userBlackList == null)
    user.userBlackList = [];

  if (user.userBlackList.length == 0) {
    clearLoadedBlacklistUsers();
    blacklistedUsers.onclick = function () {};
    blacklistedUsers.style.display = "none";
    blacklistDescription.style.display = "none";
    blacklistRemove.innerHTML = "No Users Found!";
    blacklistRemove.onclick = function () {};
  } else {
    blacklistedUsers.onclick = function () {
      showBlacklistModal();
    };
    blacklistedUsers.style.display = "inline-block";
    blacklistedUsers.innerHTML = "View Blacklisted Users";
    blacklistDescription.style.display = "block";
    blacklistRemove.innerHTML = "Un-Blacklist Users";
  }
}

function findRemovedUser(oldArr, newArr) {
  let removedUserIndex = -1;

  removedUserIndex = findRemovedData(oldArr, newArr, true);
  if (removedUserIndex != -1) {
    removeFriendElement(oldArr[removedUserIndex]);
    let i = initializedUsers.indexOf(oldArr[removedUserIndex]);
    initializedUsers.splice(i, 1);
    oldFriendArr.splice(removedUserIndex, 1);
  }
}

function createFriendElement(friendKey){
  let textNode;
  let friendIndex = findUIDItemInArr(friendKey, userArr, true);
  let friendData = userArr[friendIndex];

  if(friendIndex != -1 && initializedUsers.indexOf(friendKey) == -1) {
    try {
      document.getElementById("testData").remove();
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
  } else {
    changeFriendElement(friendKey);
  }
}

function changeFriendElement(friendKey){
  let friendIndex = findUIDItemInArr(friendKey, userArr, true);
  let friendData = userArr[friendIndex];

  if(friendData != null) {
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
      confirmDeletion(friendData);
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
  updateUserScore(user, sendPrivateMessage);

  closeModal(privateMessageModal);
  addNotificationToDB(userData, message);
  successfulDBOperationTitle = "Message Sent!";
  successfulDBOperationNotice = "Your message to " + userData.userName + " was successfully delivered!";
  showSuccessfulDBOperation = true;
}

function confirmDeletion(delFriendData) {
  confirmTitle.innerHTML = "Confirm Friend Removal";
  confirmContent.innerHTML = "Are you sure you want to remove your friend, " + delFriendData.name + "?";

  confirmBtn.onclick = function() {
    closeModal(confirmModal);
    deleteFriend(delFriendData);
  };

  denyBtn.onclick = function() {
    closeModal(confirmModal);
    openModal(inviteModal, delFriendData.uid);
  }

  openModal(confirmModal, "confirmModal", true);

  closeConfirmModal.onclick = function() {
    closeModal(confirmModal);
    openModal(inviteModal, delFriendData.uid);
  };

  window.onclick = function(event) {
    if (event.target == confirmModal) {
      closeModal(confirmModal);
    }
  };
}

function deleteFriend(delFriendData) {
  let replacementCreatorUser;
  let deleteChangeBool = false;
  let deleteBuyerBool = false;
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
    saveCriticalCookies();
    deployNotificationModal(true, "Remove Friend Failure!", "Your friend was not " +
        "able to be removed from your friend list. Please try again later!");
    updateMaintenanceLog("invites", "\"" + user.userName + "\" attempted to remove friend, " +
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

  let deleteUserIndex = findUIDItemInArr(uid, userArr);
  if (deleteUserIndex != -1) {
    cleanUpGifts(userArr[deleteUserIndex], user);
    cleanUpGifts(user, userArr[deleteUserIndex]);
  } else {
    verifyDeleteBool = false;
  }

  if (verifyDeleteBoolFriend && verifyDeleteBool) {
    friendDeleteLocal = true;
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
    saveCriticalCookies();
    refreshFriendInviteArrays();
    listenForDBChanges("Remove", uid);
    successfulDBOperationTitle = "Friend Removed!";
    successfulDBOperationNotice = "The user " + delFriendData.name + " has been successfully removed from your friend list!";
    showSuccessfulDBOperation = true;
    friendDeleteLocal = false;
  } else {
    deployNotificationModal(true, "Remove Friend Failure!", "Your friend was not " +
        "able to be removed from your friend list. Please try again later!");
    updateMaintenanceLog("invites", "\"" + user.userName + "\" attempted to remove friend, " +
        delFriendData.userName + " and FAILED! (There was an issue with " + delFriendData.userName + "'s friend list)");
  }

  function cleanUpGifts(listOwner, listViewer) {
    if (listOwner.giftList != null) {
      for (let delUserGiftIndex = 0; delUserGiftIndex < listOwner.giftList.length; delUserGiftIndex++) {
        if (listOwner.giftList[delUserGiftIndex].buyer != undefined) {
          if (listOwner.giftList[delUserGiftIndex].buyer == listViewer.userName) {
            listOwner.giftList[delUserGiftIndex].received = 0;
            listOwner.giftList[delUserGiftIndex].buyer = "";
            deleteChangeBool = true;
            deleteBuyerBool = true;
          }
        }
        if (!deleteBuyerBool) {
          if (listOwner.giftList[delUserGiftIndex].received != undefined) {
            if (listOwner.giftList[delUserGiftIndex].received < 0) {
              let delUserRcvdIndex = listOwner.giftList[delUserGiftIndex].receivedBy.indexOf(listViewer.uid);
              if (listOwner.giftList[delUserGiftIndex].receivedBy[delUserRcvdIndex] == listViewer.uid) {
                listOwner.giftList[delUserGiftIndex].receivedBy.splice(delUserRcvdIndex, 1);
                listOwner.giftList[delUserGiftIndex].received++;
                deleteChangeBool = true;
              }
            }
          }
        }
        deleteBuyerBool = false;
      }

      if (deleteChangeBool) {
        firebase.database().ref("users/" + listOwner.uid).update({
          giftList: listOwner.giftList
        });
        deleteChangeBool = false;
      }
    }

    if (listOwner.privateList != null) {
      for (let delUserGiftIndex = 0; delUserGiftIndex < listOwner.privateList.length; delUserGiftIndex++) {
        if (listOwner.privateList[delUserGiftIndex].buyer != undefined) {
          if (listOwner.privateList[delUserGiftIndex].buyer == listViewer.userName) {
            listOwner.privateList[delUserGiftIndex].received = 0;
            listOwner.privateList[delUserGiftIndex].buyer = "";
            deleteChangeBool = true;
            deleteBuyerBool = true;
          }
        }
        if (!deleteBuyerBool) {
          if (listOwner.privateList[delUserGiftIndex].received != undefined) {
            if (listOwner.privateList[delUserGiftIndex].received < 0) {
              let delUserRcvdIndex = listOwner.privateList[delUserGiftIndex].receivedBy.indexOf(listViewer.uid);
              if (listOwner.privateList[delUserGiftIndex].receivedBy[delUserRcvdIndex] == listViewer.uid) {
                listOwner.privateList[delUserGiftIndex].receivedBy.splice(delUserRcvdIndex, 1);
                listOwner.privateList[delUserGiftIndex].received++;
                deleteChangeBool = true;
              }
            }
          }
        }
        if (listOwner.privateList[delUserGiftIndex].creator != undefined) {
          if (listOwner.privateList[delUserGiftIndex].creator == listViewer.userName) {
            replacementCreatorUser = getFriendReplacement(listOwner);
            if (replacementCreatorUser != null) {
              listOwner.privateList[delUserGiftIndex].creator = replacementCreatorUser.userName;
            } else {
              listOwner.privateList.splice(delUserGiftIndex, 1);
              delUserGiftIndex--;
            }
            deleteChangeBool = true;
          }
        }
        deleteBuyerBool = false;
      }

      if (deleteChangeBool) {
        firebase.database().ref("users/" + listOwner.uid).update({
          privateList: listOwner.privateList
        });
        deleteChangeBool = false;
      }
    }
  }

  function getFriendReplacement(friendNeededUser) {
    let tempFriendReturn = null;
    let userReplacementIndex = -1;
    let tempFriendReplacementScore = 0;

    if (friendNeededUser.friends.length > 0)
      for (let i = 0; i < friendNeededUser.friends.length; i++) {
        userReplacementIndex = findUIDItemInArr(friendNeededUser.friends[i], userArr, true);
        if (userReplacementIndex != -1) {
          if (userArr[userReplacementIndex].userScore > tempFriendReplacementScore) {
            tempFriendReturn = userArr[userReplacementIndex];
            tempFriendReplacementScore = userArr[userReplacementIndex].userScore;
          }
        }
      }

    return tempFriendReturn;
  }
}

function evaluateCommonFriends(){
  let userInviteInt;
  let userInviteData;
  let userFriendInt1;
  let userFriendInt2;
  let userFriendData1;
  let userFriendData2;
  let userFriendLength = 0;
  let commonFriends = 0;
  let commonFriendData;
  let userBlackListCommon = [];

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
      if (userArr[userFriendInt1].friends == undefined)
        userFriendData1 = [];

      for (let a = 0; a < userFriendData1.length; a++) {
        userFriendInt2 = findUIDItemInArr(user.friends[i], userArr, true);
        userFriendData2 = userArr[userFriendInt2].friends;
        if (userArr[userFriendInt2].friends == undefined)
          userFriendData2 = [];

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
          userInviteInt = findUIDItemInArr(commonFriendData.friends[c], userArr, true);
          if (userInviteInt != undefined) {
            userInviteData = userArr[userInviteInt].invites;
            if (userInviteData == undefined)
              userInviteData = [];
          } else {
            userInviteData = [];
          }

          if (!commonFriendArr.includes(commonFriendData.friends[c]) && !userInviteData.includes(user.uid)
              && !userBlackListCommon.includes(commonFriendData.friends[c])) {
            commonFriendArr.push(commonFriendData.friends[c]);
          }
        }
      }

      if (commonFriendArr.length > 0 && userBlackListCommon.length != commonFriendArr.length) {
        addUser.style.background = "#3be357";
      }
    }
  }
}

function refreshFriendInviteArrays() {
  friendUserNameList = [];
  friendShareCodeList = [];

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
}

function generateAddUserBtn(){
  let commonFriendIndex;
  let userBlackList = [];
  let upperCaseUserArr = [];
  let setSuggestedUser = false;

  refreshFriendInviteArrays();

  for (let b = 0; b < userArr.length; b++){
    upperCaseUserArr.push(userArr[b].userName.toUpperCase());
  }

  generateSuggestedUser();

  addUser.onclick = function() {
    generateSuggestedUser();
    openModal(userInviteModal, "userInviteModal");
    addInvite.innerHTML = "Send Invite";

    addInvite.onclick = function() {
      let userLocation = -1;
      let containsInt = false;
      let dashCount = 0;
      let shareCodeBool = false;

      if (user.settingsScoreBlock == undefined) {
        user.settingsScoreBlock = 0;
      }

      for (let i = 0; i < userNameInp.value.length; i++) {
        if (userNameInp.value[i] >= "0" && userNameInp.value[i] <= "9") {
          containsInt = true;
        } else if (userNameInp.value[i] == "-") {
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

      if (!setSuggestedUser) {
        addToBlackList.style.display = "none";
        addToBlackList.onclick = function () {};
        inviteInfo.innerHTML = "";
      }
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
      } else if (userNameInp.value.toUpperCase() == "USER NAME OR SHARE CODE BELOW"
          && easterEggA == 0 && easterEggB == 0 && easterEggC == 0
          && user.settingsScoreBlock == 0){
        inviteInfo.innerHTML = "Very Funny, Please Enter A User Name";
        clearInviteModalFields();

        updateUserScore(user, invitesEasterEggScoreA);
        easterEggA = 1;
        updateMaintenanceLog(pageName, "The user, \"" + user.userName + "\" found an easter egg!");
      } else if (userNameInp.value.toUpperCase() == "A USER NAME"
          && easterEggA == 1 && easterEggB == 0 && easterEggC == 0){
        inviteInfo.innerHTML = "Listen Here, Please Input Something Serious";
        clearInviteModalFields();

        updateUserScore(user, invitesEasterEggScoreB);
        easterEggB = 1;
      } else if (userNameInp.value.toUpperCase() == "SOMETHING SERIOUS"
          && easterEggA == 1 && easterEggB == 1 && easterEggC == 0){
        inviteInfo.innerHTML = "You're Just Mocking Me At This Point";
        clearInviteModalFields();

        updateUserScore(user, invitesEasterEggScoreC);
        easterEggC = 1;
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
      inviteInfo.innerHTML = "";
      clearInviteModalFields();
    };

    closeUserInviteModal.onclick = function() {
      closeModal(userInviteModal);
      inviteInfo.innerHTML = "";
      clearInviteModalFields();
    };
  };
  addUser.innerHTML = "Invite User";

  if(consoleOutput)
    console.log("Add Button Generated");

  function clearInviteModalFields() {
    userNameInp.value = "";
    addToBlackList.style.display = "none";
    addToBlackList.onclick = function() {};
  }

  function generateSuggestedUser() {
    if (user.userBlackList == undefined) {
      user.userBlackList = [];
    }
    userBlackList = user.userBlackList;

    evaluateCommonFriends();
    if (commonFriendArr.length > 0) {
      for (let z = 0; z < commonFriendArr.length; z++) {
        commonFriendIndex = findUIDItemInArr(commonFriendArr[z], userArr, true);
        if (commonFriendIndex != -1 && !userBlackList.includes(userArr[commonFriendIndex].uid)) {
          inviteInfo.style.display = "block";
          addToBlackList.style.display = "block";
          addUser.style.background = "#3be357";
          inviteInfo.innerHTML = "Suggested Friend: " + userArr[commonFriendIndex].userName + " " + "(" + userArr[commonFriendIndex].name + ")";
          inviteInfo.onclick = function() {
            userNameInp.value = userArr[commonFriendIndex].userName;
          };
          addToBlackList.onclick = function () {
            if (!userBlackList.includes(userArr[commonFriendIndex].uid)) {
              userBlackList.push(userArr[commonFriendIndex].uid);
              firebase.database().ref("users/" + user.uid).update({
                userBlackList: userBlackList
              });
            }
            user.userBlackList = userBlackList;
            saveCriticalCookies();
            initializeBlacklistBtn();
            generateAddUserBtn();
            deployNotificationModal(true, "Suggested User Removed!", "The suggested " +
                "user will no longer be suggested. Click on \"View Blacklisted Users\" if this was done in error.", 5);
          };
          setSuggestedUser = true;
          break;
        }
      }
      if (!setSuggestedUser) {
        inviteInfo.innerHTML = "";
        addToBlackList.style.display = "none";
        addUser.style.background = "#ff4c4c";
      }
    }
  }
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
      closeModal(confirmUserModal);
      userNameInp.value = "";
      inviteInfo.innerHTML = "";
      addToBlackList.style.display = "none";
      addToBlackList.onclick = function() {};
    };

    inviteDeny.onclick = function () {
      closeModal(confirmUserModal);
      openModal(userInviteModal, "userInviteModal");
      userNameInp.value = "";
      inviteInfo.innerHTML = "";
      addToBlackList.style.display = "none";
      addToBlackList.onclick = function() {};
    };

    closeConfirmUserModal.onclick = function () {
      closeModal(confirmUserModal);
      userNameInp.value = "";
      inviteInfo.innerHTML = "";
      addToBlackList.style.display = "none";
      addToBlackList.onclick = function() {};
    };

    window.onclick = function (event) {
      if (event.target == confirmUserModal) {
        closeModal(confirmUserModal);
        userNameInp.value = "";
        inviteInfo.innerHTML = "";
        addToBlackList.style.display = "none";
        addToBlackList.onclick = function() {};
      }
    }
    openModal(confirmUserModal, "confirmUserModal", true);
  } else {
    deployNotificationModal(true, "User Finder Error!", "There was an error " +
        "finding that user... Please contact the developer for assistance on the FAQ page!");
  }
}

function removeFriendElement(uid) {
  document.getElementById("user" + uid).remove();

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
  let invitedUserInvites = invitedUser.invites;
  if(invitedUser.invites == undefined){
    invitedUserInvites = [];
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
    if (commonFriendArr.length == 0) {
      addUser.onmouseover = function () {
        addUser.style.backgroundColor = "#ff4c4c";
      }
      addUser.onmouseout = function () {
        addUser.style.backgroundColor = "#ff8e8e";
      }
    }
  }

  let notificationString = generateNotificationString(user.uid,"","","");
  addNotificationToDB(invitedUser, notificationString);
  listenForDBChanges("Invite", user.uid);
  successfulDBOperationTitle = "Invite Sent!";
  successfulDBOperationNotice = "Your invite to " + invitedUser.name + " was successfully sent!";
  showSuccessfulDBOperation = true;
}
