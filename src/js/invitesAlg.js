/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let inviteElements = [];
let inviteArr = [];
let friendArr = [];
let listeningFirebaseRefs = [];
let userArr = [];

let readNotificationsBool = false;
let invitesFound = false;
let friendListEmptyBool = false;

let dataCounter = 0;
let loadingTimerInt = 0;

let inviteListEmptyText = "";

let dataListContainer;
let offlineSpan;
let offlineModal;
let userInviteModal;
let confirmModal;
let addUser;
let user;
let newInviteIcon;
let inviteNote;
let userNameInp;
let offlineTimer;
let loadingTimer;
let userInitial;
let userFriends;
let userInvites;
let privateMessageModal;
let notificationModal;
let notificationInfo;
let notificationTitle;
let noteSpan;
let notificationBtn;
let inviteModal;
let closeInviteModal;
let testData;
let userName;
let userUName;
let userShareCode;
let sendPrivateMessage;
let userInviteRemove;
let closePrivateMessageModal;
let privateMessageInp;
let sendMsg;
let cancelMsg;
let closeConfirmModal;
let confUserName;
let inviteConfirm;
let inviteDeny;
let closeUserInviteModal;
let inviteInfo;
let addInvite;
let cancelInvite;



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
    } else if (user.invites != undefined) {
      if (user.invites.length > 0) {
        newInviteIcon.style.display = "block";
        inviteNote.style.background = "#ff3923";
        invitesFound = true;
      }
    }
    if (user.friends == undefined) {
      if (invitesFound)
        inviteListEmptyText = "No Friends Found, But You Have Some Pending Invites!";
      else
        inviteListEmptyText = "No Friends Found! Invite Some Friends With The Button Below!";
      deployListEmptyNotification(inviteListEmptyText);
      friendListEmptyBool = true;
    } else if (user.friends.length == 0) {
      if (invitesFound)
        inviteListEmptyText = "No Friends Found, But You Have Some Pending Invites!";
      else
        inviteListEmptyText = "No Friends Found! Invite Some Friends With The Button Below!";
      deployListEmptyNotification(inviteListEmptyText);
      friendListEmptyBool = true;
    } else {
      if(localConsoleOutput)
        console.log(user.friends);
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
  userInviteModal = document.getElementById('userInviteModal');
  closeUserInviteModal = document.getElementById('closeUserInviteModal');
  userNameInp = document.getElementById('userNameInp');
  inviteInfo = document.getElementById('inviteInfo');
  addInvite = document.getElementById('addInvite');
  cancelInvite = document.getElementById('cancelInvite');
  confirmModal = document.getElementById('confirmModal');
  closeConfirmModal = document.getElementById('closeConfirmModal');
  confUserName = document.getElementById('confUserName');
  inviteConfirm = document.getElementById('inviteConfirm');
  inviteDeny = document.getElementById('inviteDeny');
  inviteNote = document.getElementById('inviteNote');
  newInviteIcon = document.getElementById('newInviteIcon');
  addUser = document.getElementById('addUser');
  notificationModal = document.getElementById('notificationModal');
  notificationTitle = document.getElementById('notificationTitle');
  notificationInfo = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  privateMessageModal = document.getElementById('privateMessageModal');
  closePrivateMessageModal = document.getElementById('closePrivateMessageModal');
  privateMessageInp = document.getElementById('privateMessageInp');
  sendMsg = document.getElementById('sendMsg');
  cancelMsg = document.getElementById('cancelMsg');
  inviteModal = document.getElementById('inviteModal');
  closeInviteModal = document.getElementById('closeInviteModal');
  userName = document.getElementById('userName');
  userUName = document.getElementById('userUName');
  userShareCode = document.getElementById('userShareCode');
  sendPrivateMessage = document.getElementById('sendPrivateMessage');
  userInviteRemove = document.getElementById('userInviteRemove');
  testData = document.getElementById('testData');
  inviteElements = [notificationBtn, dataListContainer, offlineModal, offlineSpan, userInviteModal,
    closeUserInviteModal, userNameInp, inviteInfo, addInvite, cancelInvite, confirmModal, closeConfirmModal,
    confUserName, inviteConfirm, inviteDeny, inviteNote, newInviteIcon, addUser, notificationModal, notificationTitle,
    notificationInfo, noteSpan, privateMessageModal, closePrivateMessageModal, privateMessageInp, sendMsg, cancelMsg,
    inviteModal, closeInviteModal, userName, userUName, userShareCode, sendPrivateMessage, userInviteRemove, testData];
  getCurrentUser();
  commonInitialization();
  verifyElementIntegrity(inviteElements);

  newInviteIcon.onclick = function() {
    newNavigation(11);//Confirmation
  };

  loadingTimer = setInterval(function(){
    loadingTimerInt = loadingTimerInt + 1000;
    if(loadingTimerInt >= 2000){
      if (testData == undefined){
        if(consoleOutput)
          console.log("TestData Missing. Loading Properly.");
      } else if (!friendListEmptyBool) {
        testData.innerHTML = "Loading... Please Wait...";
      }
      clearInterval(loadingTimer);
    }
  }, 1000);

  addUser.innerHTML = "Invite User";
  generateAddUserBtn();

  databaseQuery();

  function databaseQuery() {

    userInitial = firebase.database().ref("users/");
    userFriends = firebase.database().ref("users/" + user.uid + "/friends");
    userInvites = firebase.database().ref("users/" + user.uid + "/invites");

    let fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        onlineInt = 1;

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
        friendArr.push(data.val());
        if(consoleOutput)
          console.log("Creating " + data.val());
        createFriendElement(data.val());
      });

      postRef.on('child_changed', function (data) {
        friendArr[data.key] = data.val();
        if(consoleOutput)
          console.log("Changing " + data.val());
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
      });

      postRef.on('child_changed', function (data) {
        inviteArr[data.key] = data.val();
      });

      postRef.on('child_removed', function (data) {
        inviteArr.splice(data.key, 1);

        if (inviteArr.length == 0) {
          if(consoleOutput)
            console.log("Invite List Removed");
          newInviteIcon.style.display = "none";
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

  function createFriendElement(friendKey){
    let friendData;
    for (let i = 0; i < userArr.length; i++)
      if(friendKey == userArr[i].uid){
        friendData = userArr[i];
        break;
      }

    if(friendData != null) {
      try{
        testData.remove();
      } catch (err) {}

      let userUid = friendData.uid;
      let friendName = friendData.name;
      let friendUserName = friendData.userName;
      let friendShareCode = friendData.shareCode;
      let liItem = document.createElement("LI");
      liItem.id = "user" + userUid;
      liItem.className = "gift";
      liItem.onclick = function () {
        if (friendShareCode == undefined || friendShareCode == "")
          friendShareCode = "This User Does Not Have A Share Code";

        userName.innerHTML = friendName;
        userUName.innerHTML = "User Name: " + friendUserName;
        userShareCode.innerHTML = "Share Code: " + friendShareCode;

        sendPrivateMessage.onclick = function() {
          generatePrivateMessageDialog(friendData);
        };

        userInviteRemove.onclick = function () {
          closeModal(inviteModal);
          deleteFriend(userUid);
        };

        //show modal
        openModal(inviteModal, userUid);

        //close on close
        closeInviteModal.onclick = function () {
          closeModal(inviteModal);
        };

        //close on click
        window.onclick = function (event) {
          if (event.target == inviteModal)
            closeModal(inviteModal);
        };
      };
      let textNode = document.createTextNode(friendName);
      liItem.appendChild(textNode);

      dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);

      dataCounter++;
    }
  }

  function changeFriendElement(friendKey){
    let friendData;
    for (let i = 0; i < userArr.length; i++)
      if(friendKey == userArr[i].uid){
        friendData = userArr[i];
        break;
      }

    if(friendData != null) {
      let userUid = friendData.uid;
      let friendName = friendData.name;
      let friendUserName = friendData.userName;
      let friendShareCode = friendData.shareCode;
      let liItemUpdate = document.getElementById('user' + userUid);
      liItemUpdate.innerHTML = friendName;
      liItemUpdate.className = "gift";
      liItemUpdate.onclick = function () {
        if (friendShareCode == undefined)
          friendShareCode = "This User Does Not Have A Share Code";

        userName.innerHTML = friendName;
        userUName.innerHTML = "User Name: " + friendUserName;
        userShareCode.innerHTML = "Share Code: " + friendShareCode;

        sendPrivateMessage.onclick = function() {
          generatePrivateMessageDialog(friendData);
        };

        userInviteRemove.onclick = function () {
          closeModal(inviteModal);
          deleteFriend(userUid);
        };

        //show modal
        openModal(inviteModal, userUid);

        //close on close
        closeInviteModal.onclick = function () {
          closeModal(inviteModal);
        };

        //close on click
        window.onclick = function (event) {
          if (event.target == inviteModal)
            closeModal(inviteModal);
        }
      };
    }
  }

  function generatePrivateMessageDialog(userData) {
    let message = "";

    privateMessageInp.placeholder = "Hey! Just to let you know...";

    sendMsg.onclick = function (){
      message = generatePrivateMessage(user.uid, privateMessageInp.value);
      addPrivateMessageToDB(userData, message);
      privateMessageInp.value = "";
      closeModal(privateMessageModal);
    };
    cancelMsg.onclick = function (){
      privateMessageInp.value = "";
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

  function generatePrivateMessage(userUID, message){
    return userUID + "@#$:" + message;
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

  function deleteFriend(uid) {
    //Delete on user's side-----------------------------------------
    let userFriendArrBackup = friendArr;
    let friendFriendArrBackup = [];
    let verifyDeleteBool = true;
    let toDelete = -1;

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

    if(verifyDeleteBool){
      removeFriendElement(uid);
      user.friends = friendArr;
      generateAddUserBtn(); //Regenerate the button for new friendArr

      firebase.database().ref("users/" + user.uid).update({
        friends: friendArr
      });

      //alert("Friend Successfully removed from your list!");
    } else {
      friendArr = user.friends;
      firebase.database().ref("users/" + user.uid).update({
        friends: userFriendArrBackup
      });
      alert("Delete failed, please try again later! (user)");
      return;
    }

    //Delete on friend's side---------------------------------------
    verifyDeleteBool = true;
    toDelete = -1;
    let friendFriendArr;//Weird name, I know, but it's the friend's friend Array...

    for (let i = 0; i < userArr.length; i++){
      if(userArr[i].uid == uid) {
        friendFriendArr = userArr[i].friends;
        friendFriendArrBackup = friendFriendArr;
        break;
      }
    }
    for (let i = 0; i < friendFriendArr.length; i++){
      if (friendFriendArr[i] == user.uid){
        toDelete = i;
        break;
      }
    }

    if(toDelete != -1) {
      friendFriendArr.splice(toDelete, 1);

      for (let i = 0; i < friendFriendArr.length; i++) {
        if (friendFriendArr[i] == user.uid) {
          verifyDeleteBool = false;
          break;
        }
      }
    } else {
      verifyDeleteBool = false;
    }

    if(verifyDeleteBool){
      firebase.database().ref("users/" + uid).update({
        friends: friendFriendArr
      });

      //alert("Friend Successfully removed from their list!");
    } else {
      firebase.database().ref("users/" + uid).update({
        friends: friendFriendArrBackup
      });
      alert("Delete failed, please try again later! (friend)");
    }
  }

  function generateAddUserBtn(){
    let friendUserNameList = [];
    let upperCaseUserArr = [];
    if(user.friends != undefined || user.friends != null) {
      for (let i = 0; i < user.friends.length; i++) {
        for (let a = 0; a < userArr.length; a++) {
          if (userArr[a].uid == user.friends[i]) {
            friendUserNameList.push(userArr[a].userName.toUpperCase());
            break;
          }
        }
      }
    }
    for (let b = 0; b < userArr.length; b++){
      upperCaseUserArr.push(userArr[b].userName.toUpperCase());
    }

    addUser.onclick = function() {
      openModal(userInviteModal, "userInviteModal");
      addInvite.innerHTML = "Send Invite";

      addInvite.onclick = function() {
        let userLocation = -1;
        for (let i = 0; i < upperCaseUserArr.length; i++) {
          if (upperCaseUserArr[i] == userNameInp.value.toUpperCase()) {
            userLocation = i;
            break;
          }
        }

        inviteInfo.innerHTML = "";
        if(userNameInp.value == ""){
          inviteInfo.innerHTML = "User Name Field Empty, Please Try Again!";
        } else if (friendUserNameList.includes(userNameInp.value.toUpperCase())) {
          inviteInfo.innerHTML = "That User Is Already Your Friend, Please Try Again!";
        } else if (user.userName.toUpperCase() == userNameInp.value.toUpperCase()){
          inviteInfo.innerHTML = "You Cannot Invite Yourself, Please Try Again!";
        } else if (userLocation != -1) {
          try {
            if (user.invites.includes(userArr[userLocation].uid)) {
              inviteInfo.innerHTML = "This User Already Sent You An Invite, Please Try Again!";
            } else if (userArr[userLocation].invites.includes(user.uid)) {
              inviteInfo.innerHTML = "You Already Sent This User An Invite, Please Try Again!";
            } else {
              generateConfirmDialog(userLocation);
            }
          } catch (err) {
            try {
              if (userArr[userLocation].invites.includes(user.uid)) {
                inviteInfo.innerHTML = "You Already Sent This User An Invite, Please Try Again!";
              } else {
                generateConfirmDialog(userLocation);
              }
            } catch (err) {
              generateConfirmDialog(userLocation);
            }
          }
        } else if (userNameInp.value.toUpperCase() == "USER NAME BELOW"){
          inviteInfo.innerHTML = "Very Funny, Please Enter A User Name";
        } else if (userNameInp.value.toUpperCase() == "A USER NAME"){
          inviteInfo.innerHTML = "Listen Here, Please Input Something Serious";
        } else if (userNameInp.value.toUpperCase() == "SOMETHING SERIOUS"){
          inviteInfo.innerHTML = "You're Just Mocking Me At This Point";
        } else {
          inviteInfo.innerHTML = "That User Name Does Not Exist, Please Try Again!";
        }
      };

      cancelInvite.onclick = function() {
        closeModal(userInviteModal);
        userNameInp.value = "";
        inviteInfo.innerHTML = "";
      };

      closeUserInviteModal.onclick = function() {
        closeModal(userInviteModal);
        userNameInp.value = "";
        inviteInfo.innerHTML = "";
      };

      window.onclick = function(event) {
        if (event.target == userInviteModal) {
          closeModal(userInviteModal);
        }
      }
    };
    if(consoleOutput)
      console.log("Add Button Generated");
  }

  function generateConfirmDialog(userLocation) {
    if(consoleOutput) {
      console.log(userLocation);
      console.log(userArr[userLocation].userName);
    }
    if (userLocation != -1) {
      confUserName.innerHTML = "Did you mean to add \"" + userArr[userLocation].name + "\"?";
      closeModal(userInviteModal);
      openModal(confirmModal, "confirmUserModal");

      inviteConfirm.onclick = function () {
        inviteUserDB(userArr[userLocation]);
        closeModal(confirmModal);
        userNameInp.value = "";
        inviteInfo.innerHTML = "";
      };

      inviteDeny.onclick = function () {
        closeModal(confirmModal);
        openModal(userInviteModal, "userInviteModal");
        userNameInp.value = "";
        inviteInfo.innerHTML = "";
      };

      //close on close
      closeConfirmModal.onclick = function () {
        closeModal(confirmModal);
        userNameInp.value = "";
        inviteInfo.innerHTML = "";
      };

      //close on click
      window.onclick = function (event) {
        if (event.target == confirmModal) {
          closeModal(confirmModal);
          userNameInp.value = "";
          inviteInfo.innerHTML = "";
        }
      }
    } else {
      alert("Error finding user, please contact the developer for assistance!");
    }
  }

  function removeFriendElement(uid) {
    document.getElementById('user' + uid).remove();

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
    let invitedUserInvites;
    if(invitedUser.invites == undefined || invitedUser.invites == null){
      invitedUserInvites = [];
    } else {
      invitedUserInvites = invitedUser.invites;
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

    let notificationString = generateNotificationString(user.name, "invites.html");
    let invitedUserNotificiations;
    if(invitedUser.notifications == undefined || invitedUser.notifications == null){
      invitedUserNotificiations = [];
    } else {
      invitedUserNotificiations = invitedUser.notifications;
    }
    invitedUserNotificiations.push(notificationString);

    if(invitedUser.notifications != undefined) {
      firebase.database().ref("users/" + invitedUser.uid).update({
        notifications: invitedUserNotificiations
      });
    } else {
      if(consoleOutput)
        console.log("New Notifications List");
      firebase.database().ref("users/" + invitedUser.uid).update({notifications:{0:notificationString}});
    }
  }

  function generateNotificationString(invitedName, pageName){
    return (invitedName + "," + pageName);
  }
};
