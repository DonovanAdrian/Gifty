/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let listsElements = [];
let inviteArr = [];
let friendArr = [];
let listeningFirebaseRefs = [];
let userArr = [];
let giftButtonAlternatorsA = [0, 0];
let giftButtonAlternatorsB = [0, 0];

let readNotificationsBool = false;
let friendListEmptyBool = false;

let secretSantaAssignErrorMsg = "refresh the page or ignore this message!";
let secretSantaPageName = "lists";

let moderationSet = 0;
let dataCounter = 0;
let commonLoadingTimerInt = 0;

let dataListContainer;
let userBase;
let userFriends;
let userInvites;
let autoSecretSanta;
let offlineSpan;
let offlineModal;
let offlineTimer;
let commonLoadingTimer;
let user;
let inviteNote;
let notificationModal;
let notificationInfo;
let notificationTitle;
let noteSpan;
let notificationBtn;
let privateMessageModal;
let closeUserModal;
let userModal;
let secretSantaSignUp;
let secretSantaData;
let testData;
let userTitle;
let publicList;
let privateList;
let sendPrivateMessage;
let closePrivateMessageModal;
let privateMessageInp;
let sendMsg;
let cancelMsg;
let publicListAlternator;
let privateListAlternator;



function getCurrentUser(){
  let localConsoleOutput = false;

  try {
    user = JSON.parse(sessionStorage.validUser);
    if(user.moderatorInt == 1)
      localConsoleOutput = true;
    if(localConsoleOutput)
      console.log("User: " + user.userName + " loaded in");
    if (user.friends == undefined) {
      deployListEmptyNotification("No Friends Found! Invite Some Friends In The \"Invite\" Tab!");
      friendListEmptyBool = true;
    } else if (user.friends.length == 0) {
      deployListEmptyNotification("No Friends Found! Invite Some Friends In The \"Invite\" Tab!");
      friendListEmptyBool = true;
    }
    if (user.invites == undefined) {
      if(localConsoleOutput)
        console.log("Invites Not Found");
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
    sessionStorage.setItem("moderationSet", moderationSet);
  } catch (err) {
    if(localConsoleOutput)
      console.log(err.toString());
    window.location.href = "index.html";
  }
}

window.onload = function instantiate() {

  notificationBtn = document.getElementById('notificationButton');
  dataListContainer = document.getElementById('dataListContainer');
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  inviteNote = document.getElementById('inviteNote');
  notificationModal = document.getElementById('notificationModal');
  notificationTitle = document.getElementById('notificationTitle');
  notificationInfo = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  privateMessageModal = document.getElementById('privateMessageModal');
  closeUserModal = document.getElementById('closeUserModal');
  userModal = document.getElementById('userModal');
  secretSantaSignUp = document.getElementById('secretSanta');
  testData = document.getElementById('testData');
  userTitle = document.getElementById('userTitle');
  publicList = document.getElementById('publicList');
  privateList = document.getElementById('privateList');
  sendPrivateMessage = document.getElementById('sendPrivateMessage');
  closePrivateMessageModal = document.getElementById('closePrivateMessageModal');
  privateMessageInp = document.getElementById('privateMessageInp');
  sendMsg = document.getElementById('sendMsg');
  cancelMsg = document.getElementById('cancelMsg');
  listsElements = [notificationBtn, dataListContainer, offlineModal, offlineSpan, inviteNote, notificationModal,
    notificationTitle, notificationInfo, noteSpan, privateMessageModal, closeUserModal, userModal, secretSantaSignUp,
    testData, userTitle, publicList, privateList, sendPrivateMessage, closePrivateMessageModal, privateMessageInp,
    sendMsg, cancelMsg];
  getCurrentUser();
  commonInitialization();
  verifyElementIntegrity(listsElements);

  databaseQuery();

  function databaseQuery() {

    userBase = firebase.database().ref("users/");
    userFriends = firebase.database().ref("users/" + user.uid + "/friends");
    userInvites = firebase.database().ref("users/" + user.uid + "/invites");
    autoSecretSanta = firebase.database().ref("secretSanta/");

    let fetchSecretSanta = function (postRef) {
      postRef.once("value").then(function(snapshot) {
        if(snapshot.exists()) {
          if(consoleOutput)
            console.log("Secret Santa Snapshot Exists!");
          postRef.on('child_added', function (data) {
            if(consoleOutput)
              console.log(data.key + " added");
            if(data.key == "automaticUpdates")
              if(data.val())
                checkSecretSanta(data.val());
            if(data.key == "manuallyEnable")
              if (data.val())
                showSecretSanta();
          });

          postRef.on('child_changed', function (data) {
            if(consoleOutput)
              console.log(data.key + " changed");
            if(data.key == "automaticUpdates" || data.key == "manuallyEnable")
              checkSecretSanta(data.val());
          });

          postRef.on('child_removed', function (data) {
            if(consoleOutput)
              console.log(data.key + " removed");
            if(data.key == "automaticUpdates" || data.key == "manuallyEnable")
              checkSecretSanta(false);
          });
        } else {
          if(consoleOutput)
            console.log("Initializing Secret Santa In DB");

          firebase.database().ref("secretSanta/").update({
            automaticUpdates: false,
            manuallyEnable: false
          });
        }
      });
    };

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

          if(friendArr.includes(data.key)){
            changeFriendElement(friendArr[friendArr.indexOf(data.key)]);
          }
        }

        if(data.key == user.uid){
          if (user.secretSanta != data.val().secretSanta) {
            if (data.val().secretSanta == 1) {
              secretSantaSignUp.innerHTML = "Opt-Out Of Secret Santa";
            } else {
              secretSantaSignUp.innerHTML = "Sign Up For Secret Santa";
            }
          }

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
        friendArr.push(data.val());

        createFriendElement(data.val());
      });

      postRef.on('child_changed', function (data) {
        if(consoleOutput)
          console.log(friendArr);
        friendArr[data.key] = data.val();
        if(consoleOutput)
          console.log(friendArr);

        changeFriendElement(data.val());
      });

      postRef.on('child_removed', function (data) {
        sessionStorage.setItem("validUser", JSON.stringify(user));
        location.reload();
      });
    };

    let fetchInvites = function (postRef) {
      postRef.on('child_added', function (data) {
        inviteArr.push(data.val());

        inviteNote.style.background = "#ff3923";
      });

      postRef.on('child_changed', function (data) {
        if(consoleOutput)
          console.log(inviteArr);
        inviteArr[data.key] = data.val();
        if(consoleOutput)
          console.log(inviteArr);
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

    fetchData(userBase);
    fetchFriends(userFriends);
    fetchInvites(userInvites);
    fetchSecretSanta(autoSecretSanta);

    listeningFirebaseRefs.push(userBase);
    listeningFirebaseRefs.push(userFriends);
    listeningFirebaseRefs.push(userInvites);
    listeningFirebaseRefs.push(autoSecretSanta);
  }

  function createFriendElement(friendKey) {
    let friendData;
    for (let i = 0; i < userArr.length; i++) {
      if (friendKey == userArr[i].uid) {
        friendData = userArr[i];
        break;
      }
    }

    if(friendData != null){
      try {
        testData.remove();
      } catch (err) {}

      let userUid = friendData.uid;
      let friendName = friendData.name;
      let liItem = document.createElement("LI");
      liItem.id = "user" + userUid;
      initFriendElement(liItem, friendData);
      let textNode = document.createTextNode(friendName);
      liItem.appendChild(textNode);
      dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
      clearInterval(commonLoadingTimer);
      clearInterval(offlineTimer);
      dataCounter++;
    }
  }

  function changeFriendElement(friendKey){
    let friendData;
    for (let i = 0; i < userArr.length; i++){
      if(friendKey == userArr[i].uid){
        friendData = userArr[i];
        break;
      }
    }

    if (friendData != null) {
      let friendName = friendData.name;
      let editItem = document.createElement("LI");
      editItem.innerHTML = friendName;
      initFriendElement(editItem, friendData);
    }
  }

  function initFriendElement(liItem, friendData) {
    liItem.className = "gift";
    liItem.onclick = function () {
      clearInterval(privateListAlternator);
      clearInterval(publicListAlternator);
      userTitle.innerHTML = friendData.name;
      if(friendData.giftList != undefined){
        if(friendData.giftList.length > 0) {
          publicList.onclick = function () {
            sessionStorage.setItem("validGiftUser", JSON.stringify(friendData));//Friend's User Data
            newNavigation(9);//FriendList
          };
          flashGiftNumbers(friendData.giftList.length, publicList, "Public");
        } else {
          publicList.innerHTML = "Public List Empty";
          publicList.onclick = function () {};
        }
      } else {
        publicList.innerHTML = "Public List Empty";
        publicList.onclick = function () {};
      }

      privateList.innerHTML = "View Private Gift List";
      if(friendData.privateList != undefined)
        flashGiftNumbers(friendData.privateList.length, privateList, "Private");
      else
        flashGiftNumbers(0, privateList, "Private");
      privateList.onclick = function() {
        sessionStorage.setItem("validGiftUser", JSON.stringify(friendData));//Friend's User Data
        newNavigation(10);//PrivateFriendList
      };

      sendPrivateMessage.onclick = function() {
        generatePrivateMessageDialog(friendData);
      };

      //show modal
      openModal(userModal, friendData.uid);

      //close on close
      closeUserModal.onclick = function() {
        closeModal(userModal);
        clearInterval(privateListAlternator);
        clearInterval(publicListAlternator);
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == userModal) {
          closeModal(userModal);
          clearInterval(privateListAlternator);
          clearInterval(publicListAlternator);
        }
      }
    };
  }

  function removeFriendElement(uid){
    document.getElementById('user' + uid).remove();

    dataCounter--;
    if(dataCounter == 0) {
      deployListEmptyNotification("No Friends Found! Invite Some Friends In The \"Invite\" Tab!");
    }
  }
};
