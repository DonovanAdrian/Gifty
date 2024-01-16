/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let listsElements = [];
let friendArr = [];
let oldFriendArr = [];
let initializedUsers = [];

let potentialRemoval = false;
let friendListEmptyBool = false;

let moderationSet = 0;
let listLimit = 0;

let privateMessageModal;
let closeUserModal;
let userModal;
let userTitle;
let publicList;
let multipleGiftCaveat;
let sendPrivateMessage;
let closePrivateMessageModal;
let privateMessageInp;
let giftListInterval;
let sendMsg;
let cancelMsg;



function getCurrentUser(){
  getCurrentUserCommon();
  failedNavNum = 3;
  if (user.friends == undefined) {
    user.friends = [];
  } else {
    friendArr = user.friends;
    for (let i = 0; i < user.friends.length; i++) {
      createFriendElement(user.friends[i]);
    }
  }

  if (user.friends.length == 0) {
    deployListEmptyNotification("No Friends Found! Invite Some Friends In The \"Invite\" Tab!");
    friendListEmptyBool = true;
  }
  sessionStorage.setItem("moderationSet", moderationSet);
}

window.onload = function instantiate() {
  try {
    pageName = "Lists";
    notificationBtn = document.getElementById("notificationButton");
    inviteNote = document.getElementById("inviteNote");
    privateMessageModal = document.getElementById("privateMessageModal");
    closeUserModal = document.getElementById("closeUserModal");
    userModal = document.getElementById("userModal");
    userTitle = document.getElementById("userTitle");
    publicList = document.getElementById("publicList");
    privateList = document.getElementById("privateList");
    multipleGiftCaveat = document.getElementById("multipleGiftCaveat");
    sendPrivateMessage = document.getElementById("sendPrivateMessage");
    closePrivateMessageModal = document.getElementById("closePrivateMessageModal");
    privateMessageInp = document.getElementById("privateMessageInp");
    sendMsg = document.getElementById("sendMsg");
    cancelMsg = document.getElementById("cancelMsg");

    getCurrentUser();
    commonInitialization();
    initializeSecretSantaListPageVars();

    listsElements = [notificationBtn, dataListContainer, offlineModal, offlineSpan, inviteNote, notificationModal,
      notificationTitle, notificationInfo, noteSpan, privateMessageModal, closeUserModal, userModal, testData, userTitle,
      publicList, privateList, sendPrivateMessage, closePrivateMessageModal, privateMessageInp, sendMsg, cancelMsg];

    verifyElementIntegrity(listsElements);

    userBase = firebase.database().ref("users/");
    userFriends = firebase.database().ref("users/" + user.uid + "/friends");
    userInvites = firebase.database().ref("users/" + user.uid + "/invites");
    limitsInitial = firebase.database().ref("limits/");

    databaseQuery();
    initializeSecretSantaDB();
  } catch (err) {
    sendCriticalInitializationError(err);
  }

  function databaseQuery() {
    let fetchData = function (postRef) {
      postRef.on("child_added", function (data) {
        let i = findUIDItemInArr(data.key, userArr, true);
        if (i != -1) {
          localObjectChanges = findObjectChanges(userArr[i], data.val());
          if (localObjectChanges.length != 0) {
            userArr[i] = data.val();

            if (data.key == user.uid) {
              user = data.val();
              checkNotifications();
            }
            saveCriticalCookies();
          }
        } else {
          userArr.push(data.val());

          if (data.key == user.uid) {
            user = data.val();
            checkNotifications();
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

            if(data.key == user.uid){
              user = data.val();
              checkNotifications();
              updateFriendNav(user.friends);
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
          if(consoleOutput)
            console.log("Removing " + userArr[i].userName + " / " + data.val().userName);
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
        changeFriendElement(data.val());
        user.friends = friendArr;
        saveCriticalCookies();
      });

      postRef.on("child_removed", function () {
        potentialRemoval = true;
        oldFriendArr = [];
        for (let i = 0; i < friendArr.length; i++) {
          oldFriendArr.push(friendArr[i]);
        }
      });
    };

    let fetchInvites = function (postRef) {
      postRef.on("child_added", function (data) {
        inviteArr.push(data.val());

        inviteNote.style.background = "#ff3923";
      });

      postRef.on("child_changed", function (data) {
        if(consoleOutput)
          console.log(inviteArr);
        inviteArr[data.key] = data.val();
        if(consoleOutput)
          console.log(inviteArr);
      });

      postRef.on("child_removed", function (data) {
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

    let fetchLimits = function (postRef) {
      postRef.on("child_added", function (data) {
        if (data.key == "listLimit") {
          listLimit = data.val();
        }
      });

      postRef.on("child_changed", function (data) {
        if (data.key == "listLimit") {
          listLimit = data.val();
        }
      });

      postRef.on("child_removed", function (data) {
        if (data.key == "listLimit") {
          listLimit = data.val();
        }
      });
    };

    fetchData(userBase);
    fetchFriends(userFriends);
    fetchInvites(userInvites);
    fetchLimits(limitsInitial);

    listeningFirebaseRefs.push(userBase);
    listeningFirebaseRefs.push(userFriends);
    listeningFirebaseRefs.push(userInvites);
    listeningFirebaseRefs.push(limitsInitial);
  }
};

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

function createFriendElement(friendKey) {
  let friendIndex = findUIDItemInArr(friendKey, userArr, true);
  let friendData = userArr[friendIndex];

  if(friendIndex != -1 && initializedUsers.indexOf(friendKey) == -1){
    try {
      document.getElementById("testData").remove();
    } catch (err) {}

    let userUid = friendData.uid;
    let friendName = friendData.name;
    let liItem = document.createElement("LI");
    liItem.id = "user" + userUid;
    initFriendElement(liItem, friendData);
    let textNode = document.createTextNode("View " + friendName + "'s Gift Lists");
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

  if (friendData != null) {
    let friendName = friendData.name;
    let editItem = document.createElement("LI");
    editItem.innerHTML = friendName;
    initFriendElement(editItem, friendData);
  }
}

function initFriendElement(liItem, friendData) {
  let setPublicButton = false;
  let childUserList = friendData.childUser;
  let parentUserList = friendData.parentUser;
  let fixPublicGifts = false;
  let brokenPublicGifts = [];
  let aggregatedPublicGiftData = "";
  let fixPrivateGifts = false;
  let brokenPrivateGifts = [];
  let aggregatedPrivateGiftData = "";
  let friendElemErrEncountered = false;
  let friendElemErrStr = "";

  if (childUserList == undefined) {
    childUserList = [];
  }
  if (parentUserList == undefined) {
    parentUserList = [];
  }

  liItem.className = "gift";
  liItem.onclick = function () {
    clearInterval(giftListInterval);
    userTitle.innerHTML = friendData.name;

    try {
      if (friendData.giftList == undefined) {
        friendData.giftList = [];
        publicList.onclick = function () {
        };
      } else {
        brokenPublicGifts = friendData.giftList;
        aggregatedPublicGiftData = compileGiftData(brokenPublicGifts);
        for (let i = 0; i < friendData.giftList.length; i++) {
          if (friendData.giftList[i] == null) {
            friendData.giftList.splice(i, 1);
            fixPublicGifts = true;
          }
        }

        if (fixPublicGifts) {
          updateMaintenanceLog(pageName, "Gift List Fix Performed (Public): " + aggregatedPublicGiftData);
          firebase.database().ref("users/" + friendData.uid).update({
            giftList: friendData.giftList
          });
        }
      }
    } catch (err) {
      friendElemErrEncountered = true;
      friendElemErrStr = err.toString();
    }

    if (!friendElemErrEncountered) {
      if (friendData.giftList.length > 0) {
        setPublicButton = true;
        publicList.onclick = function () {
          if (listLimit == 1 && user.moderatorInt == 0 && (childUserList.includes(user.uid) || parentUserList.includes(user.uid))) {
            if (parentUserList.includes(user.uid)) {
              deployNotificationModal(false, "Relationship Detected!", "It appears that " +
                  "you are the parent of " + friendData.name + " so you are blocked from seeing their list. Please contact " +
                  "a moderator if this has been done in error.", 8);
            } else if (childUserList.includes(user.uid)) {
              deployNotificationModal(false, "Relationship Detected!", "It appears that " +
                  "you are the child of " + friendData.name + " so you are blocked from seeing their list. Please contact " +
                  "a moderator if this has been done in error.", 8);
            }
          } else {
            sessionStorage.setItem("validGiftUser", JSON.stringify(friendData));
            navigation(9);//FriendList
          }
        };
      }

      try {
        if (friendData.privateList == undefined) {
          friendData.privateList = [];
        } else {
          brokenPrivateGifts = friendData.privateList;
          aggregatedPrivateGiftData = compileGiftData(brokenPrivateGifts);
          for (let i = 0; i < friendData.privateList.length; i++) {
            if (friendData.privateList[i] == null) {
              friendData.privateList.splice(i, 1);
              fixPrivateGifts = true;
            }
          }

          if (fixPrivateGifts) {
            updateMaintenanceLog(pageName, "Gift List Fix Performed (Private): " + aggregatedPrivateGiftData);
            firebase.database().ref("users/" + friendData.uid).update({
              privateList: friendData.privateList
            });
          }
        }
      } catch (err) {
        friendElemErrEncountered = true;
        friendElemErrStr = err.toString();
      }
    }

    if (!friendElemErrEncountered) {
      if (setPublicButton) {
        flashGiftNumbers(friendData.privateList, friendData.giftList);
      } else {
        flashGiftNumbers(friendData.privateList, 0);
      }

      privateList.onclick = function () {
        if (listLimit == 1 && user.moderatorInt == 0 && (childUserList.includes(user.uid) || parentUserList.includes(user.uid))) {
          if (parentUserList.includes(user.uid)) {
            deployNotificationModal(false, "Relationship Detected!", "It appears that " +
                "you are the parent of " + friendData.name + " so you are blocked from seeing their private list. Please " +
                "contact a moderator if this has been done in error.", 8);
          } else if (childUserList.includes(user.uid)) {
            deployNotificationModal(false, "Relationship Detected!", "It appears that " +
                "you are the child of " + friendData.name + " so you are blocked from seeing their private list. Please " +
                "contact a moderator if this has been done in error.", 8);
          }
        } else {
          sessionStorage.setItem("validGiftUser", JSON.stringify(friendData));
          navigation(10);//PrivateFriendList
        }
      };

      sendPrivateMessage.onclick = function () {
        closeModal(userModal);
        clearInterval(giftListInterval);
        generatePrivateMessageDialog(friendData);
      };

      openModal(userModal, friendData.uid, true);

      closeUserModal.onclick = function () {
        closeModal(userModal);
        clearInterval(giftListInterval);
      };

      window.onclick = function (event) {
        if (event.target == userModal) {
          closeModal(userModal);
          clearInterval(giftListInterval);
        }
      }
    } else {
      deployNotificationModal(false, "List Loading Error!", "Uh Oh! Looks like " +
          "there was an error loading this user's list. Please let a moderator know and check back later.", 10);
      updateMaintenanceLog(pageName, "Critical Error: Gift List Load Error: " + friendElemErrStr);
    }
  };

  if (!initializedUsers.includes(friendData.uid)) {
    initializedUsers.push(friendData.uid);
  }
}

function compileGiftData(potentiallyBrokenList) {
  let finalCompileStr = "";

  try {
    for (let i = 0; i < potentiallyBrokenList.length; i++) {
      finalCompileStr += " Gift " + i +
          ", UID: " + potentiallyBrokenList[i].uid +
          ", Title: " + potentiallyBrokenList[i].title +
          ", URL: " + potentiallyBrokenList[i].link +
          ", Location: " + potentiallyBrokenList[i].where +
          ", Description: " + potentiallyBrokenList[i].description +
          ", Received: " + potentiallyBrokenList[i].received +
          ", Buyer: " + potentiallyBrokenList[i].buyer +
          ", Created On: " + potentiallyBrokenList[i].creationDate +
          ", Multiples: " + potentiallyBrokenList[i].multiples;
      if (potentiallyBrokenList[i].receivedBy != undefined)
        finalCompileStr += ", Received By: " + potentiallyBrokenList[i].receivedBy;
      else
        finalCompileStr += ", Received By Field Empty";
      finalCompileStr += "  ---  ";
    }
    if (finalCompileStr == "") {
      finalCompileStr = "No Data";
    }
  } catch (err) {
    finalCompileStr = "Gift List Compilation Error: " + err.toString();
  }

  return finalCompileStr;
}

function removeFriendElement(uid){
  document.getElementById("user" + uid).remove();

  dataCounter--;
  if(dataCounter == 0) {
    deployListEmptyNotification("No Friends Found! Invite Some Friends In The \"Invite\" Tab!");
  }

  let i = initializedUsers.indexOf(uid);
  if (i != -1) {
    initializedUsers.splice(i, 1);
  }
}

function flashGiftNumbers(privateGiftList, publicGiftList) {
  let giftPrivateString;
  let giftPublicString;
  let giftPrivateAltText = "";
  let giftPublicAltText = "";
  let giftPrivateAsterisk = "";
  let giftPublicAsterisk = "";
  let privateGiftNum = 0;
  let publicGiftNum = 0;
  let emptyPrivateBool = false;
  let emptyPublicBool = false;
  let showPublicAsterisk = false;
  let showPrivateAsterisk = false;

  if (privateGiftList != undefined)
    if (privateGiftList != 0) {
      privateGiftNum = privateGiftList.length;

      for (let i = 0; i < privateGiftList.length; i++) {
        if (privateGiftList[i].received == 1) {
          privateGiftNum--;
        } else if (privateGiftList[i].received < 0) {
          privateGiftNum--;
          if (privateGiftList[i].receivedBy != undefined)
            if (!privateGiftList[i].receivedBy.includes(user.uid)) {
              showPrivateAsterisk = true;
              giftPrivateAsterisk = "*";
            }
        }
      }
    } else {
      emptyPrivateBool = true;
    }
  else
    emptyPrivateBool = true;

  if (publicGiftList != undefined)
    if (publicGiftList != 0) {
      publicGiftNum = publicGiftList.length;

      for (let i = 0; i < publicGiftList.length; i++) {
        if (publicGiftList[i].received == 1) {
          publicGiftNum--;
        } else if (publicGiftList[i].received < 0) {
          publicGiftNum--;
          if (publicGiftList[i].receivedBy != undefined)
            if (!publicGiftList[i].receivedBy.includes(user.uid)) {
              showPublicAsterisk = true;
              giftPublicAsterisk = "*";
            }
        }
      }
    } else {
      emptyPublicBool = true;
    }
  else
    emptyPrivateBool = true;

  giftPrivateAltText = "Click To Add Private Gifts!" + giftPrivateAsterisk;
  giftPublicAltText = "Click To View Public Gift List!" + giftPublicAsterisk;
  if (!emptyPrivateBool) {
    if (privateGiftNum == 0) {
      giftPrivateString = "All Private Gifts Have Been Bought!" + giftPrivateAsterisk;
    } else if (privateGiftNum == 1) {
      giftPrivateString = "There Is 1 Un-Bought Private Gift!" + giftPrivateAsterisk;
    } else {
      giftPrivateString = "There Are " + privateGiftNum + " Un-Bought Private Gifts!" + giftPrivateAsterisk;
    }
  } else {
    giftPrivateString = "There Are No Private Gifts Yet!";
  }

  if (!emptyPublicBool) {
    if (publicGiftNum == 0) {
      giftPublicString = "All Public Gifts Have Been Bought!" + giftPublicAsterisk;
    } else if (publicGiftNum == 1) {
      giftPublicString = "There Is 1 Un-Bought Public Gift!" + giftPublicAsterisk;
    } else {
      giftPublicString = "There Are " + publicGiftNum + " Un-Bought Public Gifts!" + giftPublicAsterisk;
    }
  } else {
    giftPublicAltText = "Public Gift List Empty!";
    giftPublicString = "There Are No Public Gifts Yet!";
  }

  privateList.innerHTML = giftPrivateString;
  publicList.innerHTML = giftPublicString;

  giftListInterval = setInterval(function(){
    setAlternatingButtonText(giftPublicString, giftPublicAltText, publicList,
        giftPrivateString, giftPrivateAltText, privateList);
  }, 1000);

  if (showPublicAsterisk || showPrivateAsterisk) {
    multipleGiftCaveat.style.display = "block";
  } else {
    multipleGiftCaveat.style.display = "none";
  }
}

function generatePrivateMessageDialog(userData) {
  let message = "";

  privateMessageInp.placeholder = "Hey! Just to let you know...";

  sendMsg.onclick = function (){
    if(privateMessageInp.value.includes(",,,")){
      deployNotificationModal(true, "Message Error!", "Please do not use commas in the message. Thank you!");
    } else {
      message = generateNotificationString(user.uid, "", privateMessageInp.value, "");
      addPrivateMessageToDB(userData, message);
      privateMessageInp.value = "";
    }
  };
  cancelMsg.onclick = function (){
    privateMessageInp.value = "";
    closeModal(privateMessageModal);
    openModal(userModal, userData.uid, true);

    window.onclick = function(event) {
      if (event.target == userModal) {
        closeModal(userModal);
        clearInterval(giftListInterval);
      }
    }
  };

  openModal(privateMessageModal, "add");

  closePrivateMessageModal.onclick = function() {
    closeModal(privateMessageModal);
  };
}

function addPrivateMessageToDB(userData, message) {
  updateUserScore(user, sendPrivateMessageScore);
  updateUserScore(user, sendPrivateMessageScore);
  closeModal(privateMessageModal);
  addNotificationToDB(userData, message);
  successfulDBOperationTitle = "Message Sent!";
  successfulDBOperationNotice = "Your message to " + userData.userName + " was successfully delivered!";
  showSuccessfulDBOperation = true;
}
