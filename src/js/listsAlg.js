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
let secretSantaInit = false;

let secretSantaAssignErrorMsg = "refresh the page or ignore this message!";

let moderationSet = 0;

let autoSecretSanta;
let privateMessageModal;
let closeUserModal;
let userModal;
let secretSantaSignUp;
let secretSantaData;
let userTitle;
let publicList;
let sendPrivateMessage;
let closePrivateMessageModal;
let privateMessageInp;
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
  pageName = "Lists";
  notificationBtn = document.getElementById("notificationButton");
  dataListContainer = document.getElementById("dataListContainer");
  offlineModal = document.getElementById("offlineModal");
  offlineSpan = document.getElementById("closeOffline");
  inviteNote = document.getElementById("inviteNote");
  notificationModal = document.getElementById("notificationModal");
  notificationTitle = document.getElementById("notificationTitle");
  notificationInfo = document.getElementById("notificationInfo");
  noteSpan = document.getElementById("closeNotification");
  privateMessageModal = document.getElementById("privateMessageModal");
  closeUserModal = document.getElementById("closeUserModal");
  userModal = document.getElementById("userModal");
  secretSantaSignUp = document.getElementById("secretSanta");
  testData = document.getElementById("testData");
  userTitle = document.getElementById("userTitle");
  publicList = document.getElementById("publicList");
  privateList = document.getElementById("privateList");
  sendPrivateMessage = document.getElementById("sendPrivateMessage");
  closePrivateMessageModal = document.getElementById("closePrivateMessageModal");
  privateMessageInp = document.getElementById("privateMessageInp");
  sendMsg = document.getElementById("sendMsg");
  cancelMsg = document.getElementById("cancelMsg");
  listsElements = [notificationBtn, dataListContainer, offlineModal, offlineSpan, inviteNote, notificationModal,
    notificationTitle, notificationInfo, noteSpan, privateMessageModal, closeUserModal, userModal, secretSantaSignUp,
    testData, userTitle, publicList, privateList, sendPrivateMessage, closePrivateMessageModal, privateMessageInp,
    sendMsg, cancelMsg];

  getCurrentUser();
  commonInitialization();
  verifyElementIntegrity(listsElements);

  userBase = firebase.database().ref("users/");
  userFriends = firebase.database().ref("users/" + user.uid + "/friends");
  userInvites = firebase.database().ref("users/" + user.uid + "/invites");
  autoSecretSanta = firebase.database().ref("secretSanta/");

  databaseQuery();

  function databaseQuery() {
    let fetchSecretSanta = function (postRef) {
      postRef.once("value").then(function(snapshot) {
        if(snapshot.exists()) {
          postRef.on("child_added", function (data) {
            if (secretSantaInit == false) {
              secretSantaInit = true;
            }

            initializeSecretSantaDataList(data);
          });

          postRef.on("child_changed", function (data) {
            if(consoleOutput)
              console.log(data.key + " changed");

            initializeSecretSantaDataList(data);
          });

          postRef.on("child_removed", function (data) {
            if(consoleOutput)
              console.log(data.key + " removed");

            firebase.database().ref("secretSanta/").update({
              automaticUpdates: false,
              manualUpdates: false,
              santaState: 1
            });
          });
        } else {
          if(consoleOutput)
            console.log("Initializing Secret Santa In DB");

          firebase.database().ref("secretSanta/").update({
            automaticUpdates: false,
            manualUpdates: false,
            santaState: 1
          });
          fetchSecretSanta(autoSecretSanta);
        }
      });
    };

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
              if (currentState != undefined) {
                if (currentState != 1) {
                  showSecretSanta();
                } else {
                  hideSecretSanta();
                }
              }

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

      postRef.on("child_removed", function (data) {
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

    fetchData(userBase);
    fetchFriends(userFriends);
    fetchInvites(userInvites);
    fetchSecretSanta(autoSecretSanta);

    listeningFirebaseRefs.push(userBase);
    listeningFirebaseRefs.push(userFriends);
    listeningFirebaseRefs.push(userInvites);
    listeningFirebaseRefs.push(autoSecretSanta);
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

  liItem.className = "gift";
  liItem.onclick = function () {
    clearInterval(giftListInterval);
    userTitle.innerHTML = friendData.name;

    if(friendData.giftList == undefined){
      friendData.giftList = [];
    }

    if(friendData.giftList.length > 0) {
      setPublicButton = true;
      publicList.onclick = function () {
        sessionStorage.setItem("validGiftUser", JSON.stringify(friendData));
        navigation(9);//FriendList
      };
    } else {
      publicList.onclick = function () {};
    }

    if(friendData.privateList == undefined) {
      friendData.privateList = [];
    }

    if (setPublicButton) {
      flashGiftNumbers(friendData.privateList, friendData.giftList);
    } else {
      flashGiftNumbers(friendData.privateList, 0);
    }

    privateList.onclick = function() {
      sessionStorage.setItem("validGiftUser", JSON.stringify(friendData));
      navigation(10);//PrivateFriendList
    };

    sendPrivateMessage.onclick = function() {
      closeModal(userModal);
      clearInterval(giftListInterval);
      generatePrivateMessageDialog(friendData);
    };

    openModal(userModal, friendData.uid, true);

    closeUserModal.onclick = function() {
      closeModal(userModal);
      clearInterval(giftListInterval);
    };

    window.onclick = function(event) {
      if (event.target == userModal) {
        closeModal(userModal);
        clearInterval(giftListInterval);
      }
    }
  };

  if (!initializedUsers.includes(friendData.uid)) {
    initializedUsers.push(friendData.uid);
  }
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
