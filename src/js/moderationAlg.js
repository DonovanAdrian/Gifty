/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let moderationElements = [];
let listeningFirebaseRefs = [];
let inviteArr = [];
let userArr = [];
let userUIDArr = [];
let tempUserArr = [];
let optInUserArr = [];
let familyArr = [];
let connectionsArr = [];

let secretSantaIntBool = false;
let secretSantaNameBool = false;

let moderationSet = 1;
let dataCounter = 0;
let onlineInt = 0;
let loadingTimerInt = 0;

let dataListContainer;
let offlineSpan;
let offlineModal;
let privateMessageModal;
let sendGlobalNotification;
let user;
let offlineTimer;
let loadingTimer;
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
let connectionsInitial;
let activateSecretSanta;
let secretSantaModal;
let santaModalSpan;
let secretSantaBtn;
let secretSantaShuffle;
let secretSantaAutoBtn;
let settingsNote;
let testGift;
let closeUserModal;
let userName;
let userUID;
let userUserName;
let userGifts;
let userPrivateGifts;
let userFriends;
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
    if(consoleOutput)
      console.log("User: " + user.userName + " loaded in");
    if (user.invites == undefined) {
      if(consoleOutput)
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
    if(consoleOutput)
      console.log(err.toString());
    window.location.href = "index.html";
  }
}

window.onload = function instantiate() {

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
  testGift = document.getElementById('testGift');
  closeUserModal = document.getElementById('closeUserModal');
  userName = document.getElementById('userName');
  userUID = document.getElementById('userUID');
  userUserName = document.getElementById('userUserName');
  userGifts = document.getElementById('userGifts');
  userPrivateGifts = document.getElementById('userPrivateGifts');
  userFriends = document.getElementById('userFriends');
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
    settingsNote, testGift, closeUserModal, userName, userUID, userUserName, userGifts, userPrivateGifts, userFriends,
    userPassword, userSecretSanta, moderatorOp, sendPrivateMessage, warnUser, banUser, closePrivateMessageModal,
    globalMsgTitle, globalMsgInp, sendMsg, cancelMsg];
  verifyElementIntegrity(moderationElements);
  getCurrentUser();
  commonInitialization();

  loadingTimer = setInterval(function(){
    loadingTimerInt = loadingTimerInt + 1000;
    if(loadingTimerInt >= 2000){
      if (testGift == undefined){
        if(consoleOutput)
          console.log("TestGift Missing. Loading Properly.");
      } else {
        testGift.innerHTML = "Loading... Please Wait...";
      }
      clearInterval(loadingTimer);
    }
  }, 1000);

  databaseQuery();

  settingsModerateButton();

  initializeSecretSantaArrs();

  generateSecretSantaModal();

  function settingsModerateButton(){
    let nowConfirm = 0;
    let alternator = 0;
    if(consoleOutput)
      console.log("Settings Button Feature Active");
    setInterval(function(){
      nowConfirm = nowConfirm + 1000;
      if(nowConfirm >= 3000){
        nowConfirm = 0;
        if(alternator == 0) {
          alternator++;
          settingsNote.innerHTML = "Settings";
          settingsNote.style.background = "#00c606";
        } else {
          alternator--;
          settingsNote.innerHTML = "Moderation";
          settingsNote.style.background = "#00ad05";
        }
      }
    }, 1000);
  }

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

    //close on close
    closePrivateMessageModal.onclick = function() {
      closeModal(privateMessageModal);
    };

    //close on click
    window.onclick = function(event) {
      if (event.target == privateMessageModal) {
        closeModal(privateMessageModal);
      }
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

      //close on close
      closePrivateMessageModal.onclick = function() {
        closeModal(privateMessageModal);
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == privateMessageModal) {
          closeModal(privateMessageModal);
        }
      };
    };
  }

  function addGlobalMessageToDB(message) {
    let userNotificationArr = [];
    for (let i = 0; i < userArr.length; i++){
      if(userArr[i].notifications == undefined){
        userNotificationArr = [];
      } else {
        userNotificationArr = userArr[i].notifications;
      }
      userNotificationArr.push(message);

      if(userArr[i].notifications == undefined) {
        firebase.database().ref("users/" + userArr[i].uid).update({notifications:{0:message}});
      } else {
        firebase.database().ref("users/" + userArr[i].uid).update({
          notifications: userNotificationArr
        });
      }
    }
  }

  function databaseQuery() {

    userInitial = firebase.database().ref("users/");
    userInvites = firebase.database().ref("users/" + user.uid + "/invites");
    autoSecretSanta = firebase.database().ref("secretSanta/");
    familyInitial = firebase.database().ref("family/");
    connectionsInitial = firebase.database().ref("connections/");

    let fetchConnections = function (postRef){
      postRef.on('child_added', function (data) {
        connectionsArr.push(data.val());
      });

      postRef.on('child_changed', function (data) {
        let i = findUIDItemInArr(data.key, connectionsArr);
        if(connectionsArr[i] != data.val() && i != -1)
          connectionsArr[i] = data.val();
      });

      postRef.on('child_removed', function (data) {
        let i = findUIDItemInArr(data.key, connectionsArr);
        if(connectionsArr[i] != data.val() && i != -1)
          connectionsArr.splice(i, 1);
      });
    }

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
            if(data.key == "automaticUpdates")
              secretBtnStates[2] = data.val();
            if(data.key == "manuallyEnable")
              secretBtnStates[0] = data.val();
          });

          postRef.on('child_changed', function (data) {
            console.log(data.key + " changed");
            if(data.key == "automaticUpdates")
              secretBtnStates[2] = data.val();
            if(data.key == "manuallyEnable")
              secretBtnStates[0] = data.val();
          });

          postRef.on('child_removed', function (data) {
            console.log(data.key + " removed");
            if(data.key == "automaticUpdates")
              secretBtnStates[2] = data.val();
            if(data.key == "manuallyEnable")
              secretBtnStates[0] = data.val();
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

        if(onlineInt == 0) {
          onlineInt = 1;
          initializeGlobalNotification();
        }

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
        changeUserElement(data.val());

        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          if(consoleOutput)
            console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
          userArr[i] = data.val();
        }

        if(data.key == user.uid){
          user = data.val();
          if(consoleOutput)
            console.log("User Updated: 2");
        }

        if(currentModalOpen == data.key) {//Moved currentModalOpen reference to common.js
          closeModal(userModal);
        }
      });

      postRef.on('child_removed', function (data) {
        removeUserElement(data.val().uid);

        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          if(consoleOutput)
            console.log("Removing " + userArr[i].userName + " / " + data.val().userName);
          userArr.splice(i, 1);
        }

        if(currentModalOpen == data.key) {//Moved currentModalOpen reference to common.js
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

    fetchData(userInitial);
    fetchInvites(userInvites);
    fetchSecretSanta(autoSecretSanta);
    fetchFamilies(familyInitial);
    fetchConnections(connectionsInitial);

    listeningFirebaseRefs.push(userInitial);
    listeningFirebaseRefs.push(userInvites);
    listeningFirebaseRefs.push(autoSecretSanta);
    listeningFirebaseRefs.push(familyInitial);
    listeningFirebaseRefs.push(connectionsInitial);
  }

  function findUIDItemInArr(item, userArray){
    for(let i = 0; i < userArray.length; i++){
      if(userArray[i].uid == item){
        if(consoleOutput)
          console.log("Found item: " + item);
        return i;
      }
    }
    return -1;
  }

  function createUserElement(userData){
    try{
      testGift.remove();
    } catch (err) {}

    let liItem = document.createElement("LI");
    liItem.id = "user" + userData.uid;
    liItem.className = "gift";
    if (userData.secretSanta != null)
      if (userData.secretSanta == 1)
        liItem.className += " santa";
    liItem.onclick = function (){
      userName.innerHTML = userData.name;
      userUID.innerHTML = userData.uid;
      userUserName.innerHTML = userData.userName;
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
      userPassword.innerHTML = "Click On Me To View Password";

      if(userData.secretSanta != undefined) {
        if (userData.secretSanta == 0)
          userSecretSanta.innerHTML = "This User Is Not Opted Into Secret Santa";
        else
          userSecretSanta.innerHTML = "This User Is Signed Up For Secret Santa";
      } else {
        userSecretSanta.innerHTML = "This User Is Not Opted Into Secret Santa";
      }

      userSecretSanta.onclick = function() {
        manuallyOptInOut(userData);
      };

      userGifts.onclick = function() {
        if(userData.uid == user.uid){
          alert("Navigate to the home page to see your gifts!");
        } else {
          sessionStorage.setItem("validGiftUser", JSON.stringify(userData));//Other User Data
          newNavigation(9);//FriendList
        }
      };
      userPrivateGifts.onclick = function() {
        if(userData.uid == user.uid){
          alert("You aren't allowed to see these gifts, silly!");
        } else {
          sessionStorage.setItem("validGiftUser", JSON.stringify(userData));//Other User Data
          newNavigation(10);//PrivateFriendList
        }
      };
      userPassword.onclick = function() {
        try {
          userPassword.innerHTML = decode(userData.encodeStr);
        } catch (err) {
          userPassword.innerHTML = userData.pin;
        }
      };
      warnUser.onclick = function(){
        alert("This will eventually warn the user of a certain offense");
        //warn function
      };
      banUser.onclick = function(){
        alert("This will eventually ban the user for a certain offense");
        //ban function
      };
      if (userData.uid == "-L__dcUyFssV44G9stxY" && user.uid != "-L__dcUyFssV44G9stxY") {
        moderatorOp.innerHTML = "Don't Even Think About It";
        moderatorOp.onclick = function() {

        }
      } else if (userData.moderatorInt == 1) {
        moderatorOp.innerHTML = "Revoke Moderator Role";
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
        moderatorOp.innerHTML = "Grant Moderator Role";
        moderatorOp.onclick = function() {
          if(userData.userName == user.userName){
            alert("You cannot adjust your own role");
            if(consoleOutput)
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

      sendPrivateMessage.innerHTML = "Send Message To " + userData.name;
      sendPrivateMessage.onclick = function() {
        generatePrivateMessageDialog(userData);
      };

      //show modal
      openModal(userModal, userData.uid);

      //close on close
      closeUserModal.onclick = function() {
        closeModal(userModal);
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == userModal) {
          closeModal(userModal);
        }
      };
    };
    let textNode = document.createTextNode(userData.name);
    liItem.appendChild(textNode);

    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
    clearInterval(offlineTimer);

    dataCounter++;
    if (dataCounter > 5) {
      activateSecretSanta.style.opacity = ".75";
    }
  }

  function changeUserElement(userData) {
    let editGift = document.getElementById('user' + userData.uid);
    editGift.innerHTML = userData.name;
    editGift.className = "gift";
    if (userData.secretSanta != null)
      if (userData.secretSanta == 1)
        editGift.className += " santa";
    editGift.onclick = function (){
      userName.innerHTML = userData.name;
      userUID.innerHTML = userData.uid;
      userUserName.innerHTML = userData.userName;
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
      userPassword.innerHTML = "Click On Me To View Password";

      if(userData.secretSanta != undefined) {
        if (userData.secretSanta == 0)
          userSecretSanta.innerHTML = "This User Is Not Opted Into Secret Santa";
        else
          userSecretSanta.innerHTML = "This User Is Signed Up For Secret Santa";
      } else {
        userSecretSanta.innerHTML = "This User Is Not Opted Into Secret Santa";
      }

      userSecretSanta.onclick = function() {
        manuallyOptInOut(userData);
      };

      userGifts.onclick = function() {
        if(userData.uid == user.uid){
          alert("Navigate to the home page to see your gifts!");
        } else {
          sessionStorage.setItem("validGiftUser", JSON.stringify(userData));//Other User Data
          newNavigation(9);//FriendList
        }
      };
      userPrivateGifts.onclick = function() {
        if(userData.uid == user.uid){
          alert("You aren't allowed to see these gifts, silly!");
        } else {
          sessionStorage.setItem("validGiftUser", JSON.stringify(userData));//Other User Data
          newNavigation(10);//PrivateFriendList
        }
      };
      userPassword.onclick = function() {
        userPassword.innerHTML = decode(userData.encodeStr);
      };
      warnUser.onclick = function(){
        alert("This will eventually warn the user of a certain offense");
        //warn function
      };
      banUser.onclick = function(){
        alert("This will eventually ban the user for a certain offense");
        //ban function
      };
      if (userData.uid == "-L__dcUyFssV44G9stxY" && user.uid != "-L__dcUyFssV44G9stxY") {
        moderatorOp.innerHTML = "Don't Even Think About It";
        moderatorOp.onclick = function() {

        }
      } else if (userData.moderatorInt == 1) {
        moderatorOp.innerHTML = "Revoke Moderator Role";
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
        moderatorOp.innerHTML = "Grant Moderator Role";
        moderatorOp.onclick = function() {
          if(userData.userName == user.userName){
            alert("You cannot adjust your own role");
            if(consoleOutput)
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

      sendPrivateMessage.innerHTML = "Send Message To " + userData.name;
      sendPrivateMessage.onclick = function() {
        generatePrivateMessageDialog(userData);
      };

      //show modal
      openModal(userModal, userData.uid);

      //close on close
      closeUserModal.onclick = function() {
        closeModal(userModal);
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == userModal) {
          closeModal(userModal);
        }
      };
    };
  }

  function removeUserElement(uid) {
    document.getElementById('user' + uid).remove();

    dataCounter--;
    if (dataCounter == 0){
      deployUserListEmptyNotification();
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

function deployUserListEmptyNotification(){
  try{
    testGift.innerHTML = "No Users Found!";
  } catch(err){
    if(consoleOutput)
      console.log("Loading Element Missing, Creating A New One");
    let liItem = document.createElement("LI");
    liItem.id = "TestGift";
    liItem.className = "gift";
    let textNode = document.createTextNode("No Users Found!");
    liItem.appendChild(textNode);
    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
  }

  clearInterval(offlineTimer);
}
