/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let moderationElements = [];
let listeningFirebaseRefs = [];
let inviteArr = [];
let userArr = [];
let familyArr = [];

let secretSantaAssignErrorMsg = "try again or look at the console for more details!";
let secretSantaPageName = "moderation";

let moderationSet = 1;
let dataCounter = 0;
let globalNoteInt = 0;
let commonLoadingTimerInt = 0;
let initialBtnInit = 0;

let dataListContainer;
let offlineSpan;
let offlineModal;
let privateMessageModal;
let sendGlobalNotification;
let user;
let offlineTimer;
let commonLoadingTimer;
let userModal;
let notificationModal;
let notificationInfo;
let notificationTitle;
let noteSpan;
let inviteNote;
let userInitial;
let userInvites;
let autoSecretSanta;
let familyInitial;
let activateSecretSanta;
let secretSantaModal;
let santaModalSpan;
let secretSantaBtn;
let secretSantaShuffle;
let secretSantaAutoBtn;
let settingsNote;
let testData;
let closeUserModal;
let userName;
let userUID;
let userUserName;
let userGifts;
let userPrivateGifts;
let userFriends;
let userLastLogin;
let userScore;
let userPassword;
let userSecretSanta;
let moderatorOp;
let sendPrivateMessage;
let warnUser;
let banUser;
let closePrivateMessageModal;
let globalMsgTitle;
let globalMsgInp;
let sendMsg;
let cancelMsg;



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

    if (user.moderatorInt == 0){
      window.location.href = "home.html";
    }
    userArr = JSON.parse(sessionStorage.userArr);
    sessionStorage.setItem("moderationSet", moderationSet);
  } catch (err) {
    console.log(err.toString());
    window.location.href = "index.html";
  }
}

window.onload = function instantiate() {

  pageName = "Moderation";
  dataListContainer = document.getElementById('dataListContainer');
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  inviteNote = document.getElementById('inviteNote');
  notificationModal = document.getElementById('notificationModal');
  notificationTitle = document.getElementById('notificationTitle');
  notificationInfo = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  privateMessageModal = document.getElementById('privateMessageModal');
  sendGlobalNotification = document.getElementById('sendGlobalNotification');
  sendPrivateMessage = document.getElementById('sendPrivateMessage');
  userModal = document.getElementById('userModal');
  activateSecretSanta = document.getElementById('activateSecretSanta');
  secretSantaModal = document.getElementById('santaModal');
  santaModalSpan = document.getElementById('secretSantaSpan');
  secretSantaBtn = document.getElementById('secretSantaBtn');
  secretSantaShuffle = document.getElementById('secretSantaShuffle');
  secretSantaAutoBtn = document.getElementById('secretSantaAutoBtn');
  settingsNote = document.getElementById('settingsNote');
  testData = document.getElementById('testData');
  closeUserModal = document.getElementById('closeUserModal');
  userName = document.getElementById('userName');
  userUID = document.getElementById('userUID');
  userUserName = document.getElementById('userUserName');
  userGifts = document.getElementById('userGifts');
  userPrivateGifts = document.getElementById('userPrivateGifts');
  userFriends = document.getElementById('userFriends');
  userLastLogin = document.getElementById('userLastLogin');
  userScore = document.getElementById('userScore');
  userPassword = document.getElementById('userPassword');
  userSecretSanta = document.getElementById('userSecretSanta');
  moderatorOp = document.getElementById('moderatorOp');
  sendPrivateMessage = document.getElementById('sendPrivateMessage');
  warnUser = document.getElementById('warnUser');
  banUser = document.getElementById('banUser');
  closePrivateMessageModal = document.getElementById('closePrivateMessageModal');
  globalMsgTitle = document.getElementById('globalMsgTitle');
  globalMsgInp = document.getElementById('globalMsgInp');
  sendMsg = document.getElementById('sendMsg');
  cancelMsg = document.getElementById('cancelMsg');
  moderationElements = [dataListContainer, offlineModal, offlineSpan, inviteNote, notificationModal, notificationTitle,
    notificationInfo, noteSpan, privateMessageModal, sendGlobalNotification, sendPrivateMessage, userModal,
    activateSecretSanta, secretSantaModal, santaModalSpan, secretSantaBtn, secretSantaShuffle, secretSantaAutoBtn,
    settingsNote, testData, closeUserModal, userName, userUID, userUserName, userGifts, userPrivateGifts, userFriends,
    userLastLogin, userScore, userPassword, userSecretSanta, moderatorOp, sendPrivateMessage, warnUser, banUser,
    closePrivateMessageModal, globalMsgTitle, globalMsgInp, sendMsg, cancelMsg];
  getCurrentUser();
  commonInitialization();
  verifyElementIntegrity(moderationElements);

  databaseQuery();

  alternateButtonLabel(settingsNote, "Settings", "Moderation");

  generateActivateSecretSantaModal();

  function generatePrivateMessageDialog(userData) {
    globalMsgTitle.innerHTML = "Send A Private Message Below";
    globalMsgInp.placeholder = "Hey! Just to let you know...";

    sendMsg.onclick = function (){
      if(globalMsgInp.value.includes(",")){
        alert("Please do not use commas in the message. Thank you!");
      } else {
        addPrivateMessageToDB(userData, globalMsgInp.value);
        globalMsgInp.value = "";
        closeModal(privateMessageModal);
        alert("The Private Message Has Been Sent!");
      }
    };
    cancelMsg.onclick = function (){
      globalMsgInp.value = "";
      closeModal(privateMessageModal);
    };

    openModal(privateMessageModal, "addGlobalMsgModal");

    closePrivateMessageModal.onclick = function() {
      closeModal(privateMessageModal);
    };
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

  function initializeGlobalNotification() {
    sendGlobalNotification.innerHTML = "Send Global Message";
    sendGlobalNotification.onclick = function (){
      globalMsgInp.placeholder = "WARNING: An Important Message...";
      globalMsgTitle.innerHTML = "Enter Global Notification Below";

      sendMsg.onclick = function (){
        if(globalMsgInp.value.includes(",")){
          alert("Please do not use commas in the notification. Thank you!");
        } else {
          addGlobalMessageToDB(globalMsgInp.value);
          globalMsgInp.value = "";
          closeModal(privateMessageModal);
          alert("The Global Message Has Been Sent!");
        }
      };
      cancelMsg.onclick = function (){
        globalMsgInp.value = "";
        closeModal(privateMessageModal);
      };

      openModal(privateMessageModal, "addGlobalMsgModal");

      closePrivateMessageModal.onclick = function() {
        closeModal(privateMessageModal);
      };
    };
  }

  function databaseQuery() {

    userInitial = firebase.database().ref("users/");
    userInvites = firebase.database().ref("users/" + user.uid + "/invites");
    autoSecretSanta = firebase.database().ref("secretSanta/");
    familyInitial = firebase.database().ref("family/");

    let fetchFamilies = function (postRef){
      postRef.on('child_added', function (data) {
        familyArr.push(data.val());
      });

      postRef.on('child_changed', function (data) {
        let i = findUIDItemInArr(data.key, familyArr);
        if(familyArr[i] != data.val() && i != -1)
          familyArr[i] = data.val();
      });

      postRef.on('child_removed', function (data) {
        let i = findUIDItemInArr(data.key, familyArr);
        if(familyArr[i] != data.val() && i != -1)
          familyArr.splice(i, 1);
      });
    };

    let fetchSecretSanta = function (postRef) {
      postRef.once("value").then(function(snapshot) {
        if(snapshot.exists()) {
          console.log("Secret Santa Snapshot Exists!");
          postRef.on('child_added', function (data) {
            console.log(data.key + " added");
            if(data.key == "automaticUpdates" && secretBtnStates[1] != data.val()) {
              secretBtnStates[1] = data.val();
              initializeSecretSantaBtns();
            }

            if (initialBtnInit == 0 && data.key == "manuallyEnable") {
              if (secretBtnStates[0] != data.val())
                secretBtnStates[0] = data.val();
              initializeSecretSantaBtns();
              initialBtnInit++;
            } else if(data.key == "manuallyEnable" && secretBtnStates[0] != data.val()) {
              secretBtnStates[0] = data.val();
              initializeSecretSantaBtns();
              if(data.val())
                checkSecretSanta(data.val());
            }
          });

          postRef.on('child_changed', function (data) {
            console.log(data.key + " changed");
            if(data.key == "automaticUpdates" && secretBtnStates[1] != data.val()) {
              secretBtnStates[1] = data.val();
              initializeSecretSantaBtns();
            }

            if(data.key == "manuallyEnable" && secretBtnStates[0] != data.val()) {
              secretBtnStates[0] = data.val();
              initializeSecretSantaBtns();
              if(!data.val())
                hideSecretSanta();
            }
          });

          postRef.on('child_removed', function (data) {
            console.log(data.key + " removed");
            if(data.key == "automaticUpdates")
              secretBtnStates[1] = data.val();
            if(data.key == "manuallyEnable")
              secretBtnStates[0] = data.val();
            initializeSecretSantaBtns();
            if(data.key == "automaticUpdates" || data.key == "manuallyEnable")
              checkSecretSanta(false);
          });
        } else {
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
        createUserElement(data.val());

        if(globalNoteInt == 0) {
          globalNoteInt = 1;
          initializeGlobalNotification();
        }

        let i = findUIDItemInArr(data.key, userArr, true);
        if(userArr[i] != data.val() && i != -1){
          userArr[i] = data.val();
        }

        if(data.key == user.uid){
          user = data.val();
        }
      });

      postRef.on('child_changed', function (data) {
        changeUserElement(data.val());

        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
          userArr[i] = data.val();
        }

        if(data.key == user.uid){
          user = data.val();
          console.log("Current User Updated");
        }

        if(currentModalOpen == data.key) {
          closeModal(userModal);
        }
      });

      postRef.on('child_removed', function (data) {
        removeUserElement(data.val().uid);

        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          console.log("Removing " + userArr[i].userName + " / " + data.val().userName);
          userArr.splice(i, 1);
        }

        if(currentModalOpen == data.key) {
          closeModal(userModal);
        }
      });
    };

    let fetchInvites = function (postRef) {
      postRef.on('child_added', function (data) {
        inviteArr.push(data.val());

        inviteNote.style.background = "#ff3923";
      });

      postRef.on('child_changed', function (data) {
        console.log(inviteArr);
        inviteArr[data.key] = data.val();
        console.log(inviteArr);
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

    fetchData(userInitial);
    fetchInvites(userInvites);
    fetchSecretSanta(autoSecretSanta);
    fetchFamilies(familyInitial);

    listeningFirebaseRefs.push(userInitial);
    listeningFirebaseRefs.push(userInvites);
    listeningFirebaseRefs.push(autoSecretSanta);
    listeningFirebaseRefs.push(familyInitial);
  }

  function createUserElement(userData){
    try{
      testData.remove();
    } catch (err) {}

    let liItem = document.createElement("LI");
    liItem.id = "user" + userData.uid;
    initUserElement(liItem, userData);
    let textNode = document.createTextNode(" " + userData.name);
    liItem.appendChild(textNode);

    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
    clearInterval(offlineTimer);

    dataCounter++;
    if (dataCounter > buttonOpacLim) {
      activateSecretSanta.style.opacity = ".75";
    }
  }

  function changeUserElement(userData) {
    let editUser = document.getElementById('user' + userData.uid);
    editUser.innerHTML = userData.name;
    initUserElement(editUser, userData);
  }

  function initUserElement(liItem, userData) {
    liItem.className = "gift";
    if (userData.secretSanta != null) {
      if (userData.secretSanta == 1 && !checkIfSantaActive()) {
        liItem.className += " santa";
      } else if (userData.secretSantaName != "") {
        liItem.className += " santa";
      }
    }
    liItem.onclick = function (){
      userName.innerHTML = userData.name;
      userUID.innerHTML = "UID: " + userData.uid;
      userUserName.innerHTML = "Username: " + userData.userName;
      if(userData.giftList != undefined){
        userGifts.innerHTML = "# Gifts: " + userData.giftList.length;
      } else {
        userGifts.innerHTML = "This User Has No Gifts";
      }
      if(userData.privateList != undefined){
        userPrivateGifts.innerHTML = "# Private Gifts: " + userData.privateList.length;
      } else {
        userPrivateGifts.innerHTML = "This User Has No Private Gifts";
      }
      if(userData.friends != undefined) {
        userFriends.innerHTML = "# Friends: " + userData.friends.length;
      } else {
        userFriends.innerHTML = "This User Has No Friends";
      }
      if(userData.lastLogin != undefined) {
        userLastLogin.innerHTML = "Last Login: " + userData.lastLogin;
      } else {
        userLastLogin.innerHTML = "This User Has Never Logged In";
      }
      if(userData.userScore != undefined) {
        userScore.innerHTML = "User Score: " + userData.userScore;
      } else {
        userScore.innerHTML = "User Score: 0";
      }
      userPassword.innerHTML = "Click On Me To View Password";

      if ((checkIfSantaSignUp() && !checkIfSantaActive()) || (secretBtnStates[0] && !checkIfSantaActive())) {
        if(userData.secretSanta != undefined) {
          if (userData.secretSanta == 0) {
            userSecretSanta.innerHTML = "Click To Opt Into Secret Santa";
            userSecretSanta.style.color = "#f00";
          } else {
            userSecretSanta.innerHTML = "Click To Opt Out Of Secret Santa";
            userSecretSanta.style.color = "#00d118";
          }
        } else {
          userSecretSanta.innerHTML = "Click To Opt Into Secret Santa";
          userSecretSanta.style.color = "#f00";
        }
        userSecretSanta.onclick = function() {
          manuallyOptInOut(userData);
        };
      } else if (checkIfSantaActive()) {
        if (userData.secretSantaName == "") {
          userSecretSanta.innerHTML = "This User Was Not Assigned A Name!";
          userSecretSanta.style.color = "#000";
          userSecretSanta.onclick = function(){};
        } else {
          userSecretSanta.innerHTML = "Click Here To View Secret Santa Assignment";
          userSecretSanta.style.color = "#00d118";
          userSecretSanta.onclick = function(){
            let userSecretIndex = findUIDItemInArr(userData.secretSantaName, userArr, true);
            userSecretSanta.innerHTML = userArr[userSecretIndex].name;
            userSecretSanta.onclick = function(){};
          };
        }
      } else {
        userSecretSanta.innerHTML = "Secret Santa Is Not Active!";
        userSecretSanta.style.color = "#000";
        userSecretSanta.onclick = function() {};
      }

      userGifts.onclick = function() {
        if(userData.uid == user.uid){
          alert("Navigate to the home page to see your gifts!");
        } else {
          sessionStorage.setItem("validGiftUser", JSON.stringify(userData));
          newNavigation(9);//FriendList
        }
      };
      userPrivateGifts.onclick = function() {
        if(userData.uid == user.uid){
          alert("You aren't allowed to see these gifts, silly!");
        } else {
          sessionStorage.setItem("validGiftUser", JSON.stringify(userData));
          newNavigation(10);//PrivateFriendList
        }
      };
      userPassword.onclick = function() {
        userPassword.innerHTML = decode(userData.encodeStr);
      };
      warnUser.onclick = function(){//ToDo
        alert("This will eventually warn the user of a certain offense");
        //warn function
      };
      banUser.onclick = function(){//ToDo
        alert("This will eventually ban the user for a certain offense");
        //ban function
      };
      if (userData.uid == "-L__dcUyFssV44G9stxY" && user.uid != "-L__dcUyFssV44G9stxY") {
        moderatorOp.innerHTML = "Don't Even Think About It";
        moderatorOp.onclick = function() {

        }
      } else if (userData.moderatorInt == 1) {
        moderatorOp.innerHTML = "Click To Revoke Moderator Role";
        moderatorOp.style.color = "#00d118";
        moderatorOp.onclick = function() {
          if(userData.uid == user.uid){
            alert("You cannot adjust your own role");
          } else {
            alert("Revoked role for: " + userData.userName);
            firebase.database().ref("users/" + userData.uid).update({
              moderatorInt: 0
            });
            closeModal(userModal);
          }
        };
      } else {
        moderatorOp.innerHTML = "Click To Grant Moderator Role";
        moderatorOp.style.color = "#f00";
        moderatorOp.onclick = function() {
          if(userData.userName == user.userName){
            alert("You cannot adjust your own role");
            console.log("...How'd you get here...?");
          } else {
            alert("Granted role for: " + userData.userName);
            firebase.database().ref("users/" + userData.uid).update({
              moderatorInt: 1
            });
            closeModal(userModal);
          }
        };
      }

      sendPrivateMessage.innerHTML = "Click To Send Message To " + userData.name;
      sendPrivateMessage.onclick = function() {
        generatePrivateMessageDialog(userData);
      };

      openModal(userModal, userData.uid);

      closeUserModal.onclick = function() {
        closeModal(userModal);
      };
    };
  }

  function removeUserElement(uid) {
    document.getElementById('user' + uid).remove();

    dataCounter--;
    if (dataCounter == 0){
      deployListEmptyNotification("No Users Found!");
    }
  }
};

function manuallyOptInOut(userData){
  if (userData.secretSanta != null) {
    if (userData.secretSanta == 0) {
      firebase.database().ref("users/" + userData.uid).update({
        secretSanta: 1
      });
      alert(userData.name + " has been manually opted in to the Secret Santa Program!");
    } else {
      firebase.database().ref("users/" + userData.uid).update({
        secretSanta: 0
      });
      alert(userData.name + " has been manually opted out of the Secret Santa Program!");
    }
  } else {
    firebase.database().ref("users/" + userData.uid).update({
      secretSanta: 0
    });
    alert(userData.name + " has been manually opted out of the Secret Santa Program!");
  }
}
