/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

var listsElements = [];
var inviteArr = [];
var friendArr = [];
var listeningFirebaseRefs = [];
var userArr = [];

var readNotificationsBool = false;
var friendListEmptyBool = false;
var secretSantaNameBool = false;

var moderationSet = 0;
var onlineInt = 0;
var friendCount = 0;
var loadingTimerInt = 0;

var dataListContainer;
var userBase;
var userFriends;
var userInvites;
var offlineSpan;
var offlineModal;
var offlineTimer;
var loadingTimer;
var user;
var inviteNote;
var notificationModal;
var notificationInfo;
var notificationTitle;
var noteSpan;
var notificationBtn;
var privateMessageModal;
var closeUserModal;
var userModal;
var secretSantaSignUp;
var secretSantaData;
var testGift;
var userTitle;
var publicListCount;
var publicList;
var privateListCount;
var privateList;
var sendPrivateMessage;
var closePrivateMessageModal;
var privateMessageInp;
var sendMsg;
var cancelMsg;



function getCurrentUser(){
  try {
    user = JSON.parse(sessionStorage.validUser);
    console.log("User: " + user.userName + " loaded in");
    if (user.friends == undefined) {
      deployFriendListEmptyNotification();
      friendListEmptyBool = true;
    } else if (user.friends.length == 0) {
      deployFriendListEmptyNotification();
      friendListEmptyBool = true;
    }
    if (user.invites == undefined) {
      console.log("Invites Not Found");
    } else if (user.invites != undefined) {
      if (user.invites.length > 0) {
        inviteNote.style.background = "#ff3923";
      }
    }

    if (user.readNotifications == undefined) {
      console.log("Read Notifications Not Found");
    } else {
      readNotificationsBool = true;
    }

    if (user.notifications == undefined) {
      console.log("Notifications Not Found");
    } else if (user.notifications != undefined) {
      if (readNotificationsBool){
        if (user.notifications.length > 0 && user.readNotifications.length != user.notifications.length) {
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
    console.log(err.toString());
    window.location.href = "index.html";
  }
}

window.onload = function instantiate() {

  notificationBtn = document.getElementById('notificationButton');
  dataListContainer = document.getElementById("dataListContainer");
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById("closeOffline");
  inviteNote = document.getElementById('inviteNote');
  notificationModal = document.getElementById('notificationModal');
  notificationTitle = document.getElementById('notificationTitle');
  notificationInfo = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  privateMessageModal = document.getElementById('privateMessageModal');
  closeUserModal = document.getElementById('closeUserModal');
  userModal = document.getElementById('userModal');
  secretSantaSignUp = document.getElementById('secretSanta');
  testGift = document.getElementById('testGift');
  userTitle = document.getElementById('userTitle');
  publicListCount = document.getElementById('publicListCount');
  publicList = document.getElementById('publicList');
  privateListCount = document.getElementById('privateListCount');
  privateList = document.getElementById('privateList');
  sendPrivateMessage = document.getElementById('sendPrivateMessage');
  closePrivateMessageModal = document.getElementById('closePrivateMessageModal');
  privateMessageInp = document.getElementById('privateMessageInp');
  sendMsg = document.getElementById('sendMsg');
  cancelMsg = document.getElementById('cancelMsg');
  listsElements = [notificationBtn, dataListContainer, offlineModal, offlineSpan, inviteNote, notificationModal,
    notificationTitle, notificationInfo, noteSpan, privateMessageModal, closeUserModal, userModal, secretSantaSignUp,
    testGift, userTitle, publicListCount, publicList, privateListCount, privateList, sendPrivateMessage,
    closePrivateMessageModal, privateMessageInp, sendMsg, cancelMsg];
  verifyElementIntegrity(listsElements);
  getCurrentUser();
  commonInitialization();

  loadingTimer = setInterval(function(){
    loadingTimerInt = loadingTimerInt + 1000;
    if(loadingTimerInt >= 2000){
      if (testGift == undefined){
        //console.log("TestGift Missing. Loading Properly.");
      } else if (!friendListEmptyBool) {
        testGift.innerHTML = "Loading... Please Wait...";
      }
      clearInterval(loadingTimer);
    }
  }, 1000);

  databaseQuery();

  if (user.secretSantaName == null)
    if (user.secretSanta != null)
      if (user.secretSanta == 0)
        secretSantaSignUp.innerHTML = "Sign Up For Secret Santa";
      else
        secretSantaSignUp.innerHTML = "Opt-Out Of Secret Santa";
    else
      secretSantaSignUp.innerHTML = "Sign Up For Secret Santa";
  else {
    if (user.secretSantaName != "") {
      var i = findUIDItemInArr(user.secretSantaName, userArr);
      secretSantaData = userArr[i];
      secretSantaSignUp.innerHTML = userArr[i].name;
      secretSantaNameBool = true;
    } else {
      if (user.secretSanta != null)
        if (user.secretSanta == 0)
          secretSantaSignUp.innerHTML = "Sign Up For Secret Santa";
        else
          secretSantaSignUp.innerHTML = "Opt-Out Of Secret Santa";
      else
        secretSantaSignUp.innerHTML = "Sign Up For Secret Santa";
    }
  }

  secretSantaSignUp.onclick = function() {
    if (secretSantaNameBool) {
      generateSecretSantaModal();
    } else {
      if (user.secretSanta != null) {
        if (user.secretSanta == 0) {
          firebase.database().ref("users/" + user.uid).update({
            secretSanta: 1
          });
          user.secretSanta = 1;
          alert("You Have Been Opted Into Secret Santa! The Secret Santa Will Start Soon, Check Back Soon For Your Secret" +
            " Santa Recipient!");
          secretSantaSignUp.innerHTML = "Opt-Out Of Secret Santa";
        } else {
          firebase.database().ref("users/" + user.uid).update({
            secretSanta: 0
          });
          user.secretSanta = 0;
          alert("You Have Opted Out Of Secret Santa.");
          secretSantaSignUp.innerHTML = "Sign Up For Secret Santa";
        }
      } else {
        firebase.database().ref("users/" + user.uid).update({
          secretSanta: 1
        });
        user.secretSanta = 1;
        alert("You Have Been Opted Into Secret Santa! The Secret Santa Will Start Soon, Check Back Soon For Your Secret" +
          " Santa Recipient!");
        secretSantaSignUp.innerHTML = "Opt-Out Of Secret Santa";
      }
      sessionStorage.setItem("validUser", JSON.stringify(user));
    }
  };

  function generateSecretSantaModal(){
    if(secretSantaData != null){
      userTitle.innerHTML = secretSantaData.name;
      if(secretSantaData.giftList != undefined){
        if(secretSantaData.giftList.length > 0) {
          publicList.innerHTML = "Click on me to access " + secretSantaData.name + "\'s public list!";
          publicList.onclick = function () {
            sessionStorage.setItem("validGiftUser", JSON.stringify(secretSantaData));//Friend's User Data
            newNavigation(9);//FriendList
          };
          if (secretSantaData.giftList.length == 1)
            publicListCount.innerHTML = secretSantaData.name + " has 1 gift on their public list";
          else
            publicListCount.innerHTML = secretSantaData.name + " has " + secretSantaData.giftList.length + " gifts on their public list";
        } else {
          publicList.innerHTML = secretSantaData.name + "\'s public gift list is empty, please check back later!";
          publicList.onclick = function () {};
          publicListCount.innerHTML = secretSantaData.name + " has 0 gifts on their public list";
        }
      } else {
        publicList.innerHTML = secretSantaData.name + "\'s public gift list is empty, please check back later!";
        publicList.onclick = function () {};
        publicListCount.innerHTML = secretSantaData.name + " has 0 gifts on their public list";
      }
      if(secretSantaData.privateList != undefined){
        if(secretSantaData.privateList.length > 0) {
          if (secretSantaData.privateList.length == 1)
            privateListCount.innerHTML = secretSantaData.name + " has 1 gift on their private list";
          else
            privateListCount.innerHTML = secretSantaData.name + " has " + secretSantaData.privateList.length + " gifts on their private list";
        } else {
          privateListCount.innerHTML = secretSantaData.name + " has 0 gifts on their private list";
        }
      } else {
        privateListCount.innerHTML = secretSantaData.name + " has 0 gifts on their private list";
      }
      privateList.innerHTML = "Click on me to access " + secretSantaData.name + "\'s private gift list!";
      privateList.onclick = function() {
        sessionStorage.setItem("validGiftUser", JSON.stringify(secretSantaData));//Friend's User Data
        newNavigation(10);//PrivateFriendList
      };

      sendPrivateMessage.onclick = function() {
        generatePrivateMessageDialog(secretSantaData);
      };

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

      //show modal
      openModal(userModal, secretSantaData.uid);

      clearInterval(offlineTimer);
    }
  }

  function databaseQuery() {

    userBase = firebase.database().ref("users/");
    userFriends = firebase.database().ref("users/" + user.uid + "/friends");
    userInvites = firebase.database().ref("users/" + user.uid + "/invites");

    var fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        onlineInt = 1;

        var i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          //console.log("Adding " + userArr[i].userName + " to most updated version: " + data.val().userName);
          userArr[i] = data.val();
        }

        if(data.key == user.uid){
          user = data.val();
          console.log("User Updated: 1");
        }
      });

      postRef.on('child_changed', function (data) {
        var i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
          userArr[i] = data.val();

          if(friendArr.includes(data.key)){
            changeFriendElement(friendArr[friendArr.indexOf(data.key)]);
          }
        }

        if(data.key == user.uid){
          user = data.val();
          console.log("User Updated: 2");
        }
      });

      postRef.on('child_removed', function (data) {
        var i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          console.log("Removing " + userArr[i].userName + " / " + data.val().userName);
          userArr.splice(i, 1);
        }
      });
    };

    var fetchFriends = function (postRef) {
      postRef.on('child_added', function (data) {
        friendArr.push(data.val());

        createFriendElement(data.val());
      });

      postRef.on('child_changed', function (data) {
        console.log(friendArr);
        friendArr[data.key] = data.val();
        console.log(friendArr);

        changeFriendElement(data.val());
      });

      postRef.on('child_removed', function (data) {
        sessionStorage.setItem("validUser", JSON.stringify(user));
        location.reload();
      });
    };

    var fetchInvites = function (postRef) {
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

    fetchData(userBase);
    fetchFriends(userFriends);
    fetchInvites(userInvites);

    listeningFirebaseRefs.push(userBase);
    listeningFirebaseRefs.push(userFriends);
    listeningFirebaseRefs.push(userInvites);
  }

  function findUIDItemInArr(item, userArray){
    for(var i = 0; i < userArray.length; i++){
      if(userArray[i].uid == item){
        //console.log("Found item: " + item);
        return i;
      }
    }
    return -1;
  }

  function createFriendElement(friendKey) {
    var friendData;
    for (var i = 0; i < userArr.length; i++) {
      if (friendKey == userArr[i].uid) {
        friendData = userArr[i];
        break;
      }
    }

    if(friendData != null){
      try {
        testGift.remove();
      } catch (err) {}

      var userUid = friendData.uid;
      var friendName = friendData.name;
      var liItem = document.createElement("LI");
      liItem.id = "user" + userUid;
      liItem.className = "gift";
      liItem.onclick = function () {
        userTitle.innerHTML = friendData.name;
        if(friendData.giftList != undefined){
          if(friendData.giftList.length > 0) {
            publicList.onclick = function () {
              sessionStorage.setItem("validGiftUser", JSON.stringify(friendData));//Friend's User Data
              newNavigation(9);//FriendList
            };
            if (friendData.giftList.length == 1)
              publicListCount.innerHTML = friendData.name + " has 1 gift on their public list";
            else
              publicListCount.innerHTML = friendData.name + " has " + friendData.giftList.length + " gifts on their public list";
          } else {
            publicList.innerHTML = "Public List Empty";
            publicList.onclick = function () {};
            publicListCount.innerHTML = friendData.name + " has 0 gifts on their public list";
          }
        } else {
          publicList.innerHTML = "Public List Empty";
          publicList.onclick = function () {};
          publicListCount.innerHTML = friendData.name + " has 0 gifts on their public list";
        }
        if(friendData.privateList != undefined){
          if(friendData.privateList.length > 0) {
            if (friendData.privateList.length == 1)
              privateListCount.innerHTML = friendData.name + " has 1 gift on their private list";
            else
              privateListCount.innerHTML = friendData.name + " has " + friendData.privateList.length + " gifts on their private list";
          } else {
            privateListCount.innerHTML = friendData.name + " has 0 gifts on their private list";
          }
        } else {
          privateListCount.innerHTML = friendData.name + " has 0 gifts on their private list";
        }
        privateList.onclick = function() {
          sessionStorage.setItem("validGiftUser", JSON.stringify(friendData));//Friend's User Data
          newNavigation(10);//PrivateFriendList
        };

        sendPrivateMessage.onclick = function() {
          generatePrivateMessageDialog(friendData);
        };

        //show modal
        openModal(userModal, userUid);

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
      var textNode = document.createTextNode(friendName);
      liItem.appendChild(textNode);
      dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
      clearInterval(offlineTimer);

      friendCount++;
    }
  }

  function changeFriendElement(friendKey){
    var friendData;
    for (var i = 0; i < userArr.length; i++){
      if(friendKey == userArr[i].uid){
        friendData = userArr[i];
        break;
      }
    }

    if (friendData != null) {
      var friendName = friendData.name;
      var editItem = document.createElement("LI");
      editItem.innerHTML = friendName;
      editItem.className = "gift";
      editItem.onclick = function () {
        userTitle.innerHTML = friendData.name;
        if(friendData.giftList != undefined){
          if(friendData.giftList.length > 0) {
            publicList.onclick = function () {
              sessionStorage.setItem("validGiftUser", JSON.stringify(friendData));//Friend's User Data
              newNavigation(9);//FriendList
            };
            if (friendData.giftList.length == 1)
              publicListCount.innerHTML = friendData.name + " has 1 gift on their public list";
            else
              publicListCount.innerHTML = friendData.name + " has " + friendData.giftList.length + " gifts on their public list";
          } else {
            publicList.innerHTML = "Public List Empty";
            publicList.onclick = function () {};
            publicListCount.innerHTML = friendData.name + " has 0 gifts on their public list";
          }
        } else {
          publicList.innerHTML = "Public List Empty";
          publicList.onclick = function () {};
          publicListCount.innerHTML = friendData.name + " has 0 gifts on their public list";
        }
        if(friendData.privateList != undefined){
          if(friendData.privateList.length > 0) {
            if (friendData.privateList.length == 1)
              privateListCount.innerHTML = friendData.name + " has 1 gift on their private list";
            else
              privateListCount.innerHTML = friendData.name + " has " + friendData.privateList.length + " gifts on their private list";
          } else {
            privateListCount.innerHTML = friendData.name + " has 0 gifts on their private list";
          }
        } else {
          privateListCount.innerHTML = friendData.name + " has 0 gifts on their private list";
        }
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
        };

        //close on click
        window.onclick = function(event) {
          if (event.target == userModal) {
            closeModal(userModal);
          }
        }
      };
    }
  }

  function generatePrivateMessageDialog(userData) {
    var message = "";

    privateMessageInp.placeholder = "Hey! Just to let you know...";

    sendMsg.onclick = function (){
      message = generatePrivateMessage(user.uid, privateMessageInp.value);
      addPrivateMessageToDB(userData, message);
      privateMessageInp.value = "";
      closeModal(privateMessageModal);
      alert("The Message Has Been Sent!");
    };
    cancelMsg.onclick = function (){
      privateMessageInp.value = "";
      closeModal(privateMessageModal);
    };

    openModal(privateMessageModal, "add");

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

  function generatePrivateMessage(userUID, message){
    return userUID + "@#$:" + message;
  }

  function addPrivateMessageToDB(userData, message) {
    var userNotificationArr = [];
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

  function removeFriendElement(uid){
    document.getElementById("user" + uid).remove();

    friendCount--;
    if(friendCount == 0) {
      deployFriendListEmptyNotification();
    }
  }
};

function deployFriendListEmptyNotification(){
  try{
    testGift.innerHTML = "No Friends Found! Invite Some Friends In The \"Invite\" Tab!";
  } catch(err){
    console.log("Loading Element Missing, Creating A New One");
    var liItem = document.createElement("LI");
    liItem.id = "testGift";
    liItem.className = "gift";
    var textNode = document.createTextNode("No Friends Found! Invite Some Friends In The \"Invite\" Tab!");
    liItem.appendChild(textNode);
    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
  }

  clearInterval(offlineTimer);
}
