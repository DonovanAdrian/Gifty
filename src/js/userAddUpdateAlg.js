/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let userAddUpdateElements = [];
let listeningFirebaseRefs = [];
let userNameArr = [];
let userKeyArr = [];
let userArr = [];

let userNameBool = true;

let pinClearedInt = 0;
let userLimit = 100;

let offlineSpan;
let offlineModal;
let confirmSpan;
let confirmModal;
let deleteConfirm;
let deleteDeny;
let nameField;
let userNameField;
let pinField;
let pinConfField;
let btnUpdate;
let btnDelete;
let backBtn;
let limitsInitial;
let userInitial;
let user;
let notificationModal;
let notificationInfo;
let notificationTitle;
let noteSpan;



window.onload = function instantiate() {
  pageName = "UserAddUpdate";
  nameField = document.getElementById('nameField');
  userNameField = document.getElementById('userNameField');
  pinField = document.getElementById('pinField');
  pinConfField = document.getElementById('pinConfField');
  btnUpdate = document.getElementById('updateUser');
  btnDelete = document.getElementById('deleteUser');
  backBtn = document.getElementById('backBtn');
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  confirmModal = document.getElementById('confirmModal');
  confirmSpan = document.getElementById('closeConfirm');
  deleteConfirm = document.getElementById('deleteConfirm');
  deleteDeny = document.getElementById('deleteDeny');
  notificationModal = document.getElementById('notificationModal');
  notificationTitle = document.getElementById('notificationTitle');
  notificationInfo = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  userAddUpdateElements = [nameField, userNameField, pinField, pinConfField, btnUpdate, btnDelete, backBtn,
    offlineModal, offlineSpan, confirmModal, confirmSpan, deleteConfirm, deleteDeny, notificationModal,
    notificationTitle, notificationInfo, noteSpan];

  getCurrentUserCommon();

  function initializeBackBtn() {
    backBtn.style.display = "block";
    backBtn.style.left = "50%";
    backBtn.style.transform = "translate(-50%)";
    backBtn.innerHTML = "Loading...";
    backBtn.onclick = function() {
      navigation(5, true);
    };
  }

  function initializeDeleteUserBtn() {
    btnDelete.style.display = "block";
    btnDelete.style.left = "50%";
    btnDelete.style.transform = "translate(-50%)";
    btnDelete.innerHTML = "Loading...";
    btnDelete.onclick = function() {
      deleteCheck();
    };
  }

  function initializeUpdateUserBtn() {
    btnUpdate.innerHTML = "Loading...";
    btnUpdate.onclick = function() {
      updateSuppressCheck();
    };
  }

  if(user != null) {
    initializeBackBtn();
    initializeDeleteUserBtn();
  }

  initializeUpdateUserBtn();

  commonInitialization();
  verifyElementIntegrity(userAddUpdateElements);

  pinField.onclick = function() {
    if(pinClearedInt == 0) {
      pinField.value = "";
      pinConfField.value = "";
      pinClearedInt++;
    }
  };

  userInitial = firebase.database().ref("users/");
  limitsInitial = firebase.database().ref("limits/");

  databaseQuery();

  function databaseQuery() {
    let fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        if (findUIDItemInArr(data.key, userArr, true) == -1) {
          userArr.push(data.val());
          userNameArr.push(data.val().userName);
          userKeyArr.push(data.key);
        }

        if(user != null) {
          if (data.key == user.uid) {
            user = data.val();
            nameField.value = user.name;
            userNameField.value = user.userName;
            pinField.value = decode(user.encodeStr);
            pinConfField.placeholder = "Please Confirm Pin To Continue";
            btnUpdate.innerHTML = "Update User Profile";
            btnDelete.innerHTML = "Delete User Profile";
            backBtn.innerHTML = "Return To Settings";
          }
        }
      });

      postRef.on('child_changed', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          if(consoleOutput)
            console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
          userArr[i] = data.val();

          userNameArr[i] = data.val().userName;
        }

        if(user != null) {
          if (data.key == user.uid) {
            user = data.val();
            if(consoleOutput)
              console.log("Current User Updated");
          }
        }
      });

      postRef.on('child_removed', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        userArr.splice(i, 1);
        userNameArr.splice(i, 1);
      });
    };

    let fetchLimits = function (postRef) {
      postRef.on('child_added', function (data) {
        if (data.key == "userLimit") {
          userLimit = data.val();
          checkUserLimit();
        }
      });

      postRef.on('child_changed', function (data) {
        if (data.key == "userLimit") {
          userLimit = data.val();
        }
      });

      postRef.on('child_removed', function (data) {
        if (data.key == "userLimit") {
          userLimit = 50;
        }
      });
    };

    fetchLimits(limitsInitial);
    fetchData(userInitial);

    listeningFirebaseRefs.push(limitsInitial);
    listeningFirebaseRefs.push(userInitial);
  }

  function checkUserLimit() {
    if (userArr.length < userLimit && userArr.length != 0 && user == undefined) {
      btnUpdate.innerHTML = "Create User Profile";
      deployNotificationModal(false, "Secure Pin Notice!", "Alert! Please use a pin you have never used before." +
        " No computer system is 100% secure, so your due diligence as a user will be critical in protecting your pins.",
        false, 4);
    } else if (user == undefined && !userCreationOverride) {
      deployNotificationModal(false, "Gifty Database Full!", "Unfortunately this Gifty Database is full, so no more users can be created." +
        " Please contact the owner to obtain access. Redirecting back to login...", false, 4, 1);
    } else {
      btnUpdate.innerHTML = "Create User Profile";
    }
  }
};

function deleteCheck(){
  let deleteCleanupUser;
  let replacementCreatorUser;
  let deleteChangeBool = false;
  let deleteBuyerBool = false;
  updateMaintenanceLog("userAddUpdate", "Attempting to delete user: " + user.userName);

  deployNotificationModal(false, "Account Delete Disabled!", "Account deletion is currently disabled." +
    " Please try again later!", false, 5);
  /*
  if(consoleOutput)
    console.log(user.uid + " will be deleted. Are you sure?");
  openModal(confirmModal, "confirmModal");

  deleteConfirm.onclick = function () {
    if(consoleOutput)
      console.log("Confirmed to delete user " + user.uid);

    for (let i = 0; i < userArr.length; i++) {//todo
      if (userArr[i].uid != user.uid) {
        deleteCleanupUser = userArr[i];

        console.log("");
        console.log("");
        console.log("----------------------------");
        console.log("UserArr Length: " + userArr.length);
        console.log("Index: " + i);
        console.log("CHECKING THE FOLLOWING USER:")
        console.log(deleteCleanupUser.userName)
        console.log(deleteCleanupUser.uid)
        if (deleteCleanupUser.friends != null) {
          let friendDelIndex = deleteCleanupUser.friends.indexOf(user.uid);
          if (deleteCleanupUser.friends[friendDelIndex] == user.uid) {
            console.log("Updating Friends")
            console.log(deleteCleanupUser.friends)//todo
            deleteCleanupUser.friends.splice(friendDelIndex, 1);
            console.log(deleteCleanupUser.friends)
            //todo
            firebase.database().ref("users/" + deleteCleanupUser.uid).update({
              friends: deleteCleanupUser.friends
            });
          }
        }

        if (deleteCleanupUser.invites != null) {
          let inviteDelIndex = deleteCleanupUser.invites.indexOf(user.uid);
          console.log("Updating Invites")
          console.log(deleteCleanupUser.invites)//todo
          deleteCleanupUser.invites.splice(inviteDelIndex, 1);
          console.log(deleteCleanupUser.invites)
          //todo
          firebase.database().ref("users/" + deleteCleanupUser.uid).update({
            invites: deleteCleanupUser.invites
          });
        }

        if (deleteCleanupUser.giftList != null) {
          for (let a = 0; a < deleteCleanupUser.giftList.length; a++) {
            if (deleteCleanupUser.giftList[a].buyer != undefined) {
              if (deleteCleanupUser.giftList[a].buyer == user.userName) {
                console.log("Updating Buyer")
                console.log(deleteCleanupUser.giftList[a])
                console.log(deleteCleanupUser.giftList[a].buyer)//todo
                deleteCleanupUser.giftList[a].received = 0;
                deleteCleanupUser.giftList[a].buyer = "";
                console.log(deleteCleanupUser.giftList[a].buyer)
                deleteChangeBool = true;
                deleteBuyerBool = true;
              }
            }
            if (!deleteBuyerBool)
              if (deleteCleanupUser.giftList[a].received != undefined) {
                if (deleteCleanupUser.giftList[a].received < 0) {
                  let z = deleteCleanupUser.giftList[a].receivedBy.indexOf(user.uid);
                  if (z != -1) {
                    console.log("Updating Received By")
                    console.log(deleteCleanupUser.giftList[a])
                    console.log(deleteCleanupUser.giftList[a].receivedBy)//todo
                    deleteCleanupUser.giftList[a].receivedBy.splice(z, 1);
                    deleteCleanupUser.giftList[a].received++;
                    console.log(deleteCleanupUser.giftList[a].receivedBy)
                    deleteChangeBool = true;
                  }
                }
              }
            deleteBuyerBool = false;
          }

          //todo
          if (deleteChangeBool) {
            firebase.database().ref("users/" + deleteCleanupUser.uid).update({
              giftList: deleteCleanupUser.giftList
            });
            deleteChangeBool = false;
          }
        }

        if (deleteCleanupUser.privateList != null) {
          //ForLoopNeeded, use above giftList as base for this once above is complete
          //Add gift creator removal as well...
          //  Create "getFriendReplacement" function to get most active friend
          //  If no friends, remove gift entirely (return null)

          for (let a = 0; a < deleteCleanupUser.privateList.length; a++) {
            if (deleteCleanupUser.privateList[a].buyer != undefined) {
              if (deleteCleanupUser.privateList[a].buyer == user.userName) {
                console.log("Updating Buyer")
                console.log(deleteCleanupUser.privateList[a])
                console.log(deleteCleanupUser.privateList[a].buyer)//todo
                deleteCleanupUser.privateList[a].received = 0;
                deleteCleanupUser.privateList[a].buyer = "";
                console.log(deleteCleanupUser.privateList[a].buyer)
                deleteChangeBool = true;
                deleteBuyerBool = true;
              }
            }
            if (!deleteBuyerBool)
              if (deleteCleanupUser.privateList[a].received != undefined) {
                if (deleteCleanupUser.privateList[a].received < 0) {
                  let z = deleteCleanupUser.privateList[a].receivedBy.indexOf(user.uid);
                  if (z != -1) {
                    console.log("Updating Received By")
                    console.log(deleteCleanupUser.privateList[a]);
                    console.log(deleteCleanupUser.privateList[a].receivedBy)//todo
                    deleteCleanupUser.privateList[a].receivedBy.splice(z, 1);
                    deleteCleanupUser.privateList[a].received++;
                    console.log(deleteCleanupUser.privateList[a].receivedBy)
                    deleteChangeBool = true;
                  }
                }
                if (deleteCleanupUser.privateList[a].creator != undefined) {
                  if (deleteCleanupUser.privateList[a].creator == user.userName) {
                    console.log("Updating Creator")
                    console.log(deleteCleanupUser.privateList[a]);
                    console.log(deleteCleanupUser.privateList[a].creator)//todo
                    replacementCreatorUser = getFriendReplacement(deleteCleanupUser);
                    if (replacementCreatorUser != null) {
                      deleteCleanupUser.privateList[a].creator = replacementCreatorUser.userName;
                      console.log(deleteCleanupUser.privateList[a].creator);
                    } else {
                      console.log("Deleting Gift")
                      deleteCleanupUser.privateList.splice(a, 1);
                      a--;
                    }
                    deleteChangeBool = true;
                  }
                }
              }
            deleteBuyerBool = false;
          }

          //todo
          if (deleteChangeBool) {
            firebase.database().ref("users/" + deleteCleanupUser.uid).update({
              privateList: deleteCleanupUser.privateList
            });
            deleteChangeBool = false;
          }
        }
      }
    }

    //todo (Removing removal functionality until above cleanup is tested)
    //firebase.database().ref("users/").child(user.uid).remove();
    closeModal(confirmModal);

    //todo same as above
    btnDelete.innerHTML = "Please Wait...";
    btnUpdate.onclick = function(){};
    btnDelete.onclick = function(){};
    backBtn.onclick = function(){};
    navigation(1, false);
    if(consoleOutput) {
      console.log("");
      console.log("Completed deleting user " + user.uid);
    }
  };

  deleteDeny.onclick = function () {
    if(consoleOutput)
      console.log("Denied to delete user " + user.uid);
    closeModal(confirmModal);
  };

  confirmSpan.onclick = function () {
    if(consoleOutput)
      console.log("Closed window, user " + user.uid + " not deleted");
    closeModal(confirmModal);
  };

  function getFriendReplacement(friendNeededUser) {
    let tempFriendReturn;
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
  */

}

function updateUserToDB(){
  checkUserNames(userNameField.value);

  if (nameField.value.includes(",,,") || userNameField.value.includes(",,,")) {
    deployNotificationModal(false, "User Error!", "Please do not include excess " +
      "commas in any of the fields!");
  } else if (nameField.value === "" || userNameField.value === "" || pinField.value === "" || pinConfField.value === ""){
    deployNotificationModal(false, "Empty Fields Error!", "It looks like you left some fields blank. Make " +
      "sure you have your full name, username, a pin, and a confirmed pin below.", false, 4);
  } else if (pinConfField.value !== pinField.value){
    deployNotificationModal(false, "Pin Mismatch Error!", "It looks like the pins you entered are NOT the same." +
      " Please re-type your pins to ensure they are identical.", false, 4);
  } else if (!isNaN(pinField.value) == false) {
    deployNotificationModal(false, "Pin Number Error!", "It looks like the pins you entered are not numeric, " +
      "please only enter numbers for your pin!", false, 4);
  } else if (userNameBool == false && user == null){
    deployNotificationModal(false, "User Name Taken!", "It looks like the User Name you chose is already taken," +
      " please choose another.", false, 4);
    userNameBool = true;
  } else {
    userUpdateOverride = true;
    injectUserArr(userArr);
    user.name = nameField.value;
    user.userName = userNameField.value;
    let encodeKey = encode(pinField.value);
    firebase.database().ref("users/" + user.uid).update({
      name: nameField.value,
      encodeStr: encodeKey,
      userName: userNameField.value,
      userScore: user.userScore,
      ban: user.ban,
      firstLogin: user.firstLogin,
      lastLogin: user.lastLogin,
      moderatorInt: user.moderatorInt,
      organize: user.organize,
      strike: user.strike,
      theme: user.theme,
      uid: user.uid,
      warn: user.warn,
    });
    if(user.giftList != undefined) {
      firebase.database().ref("users/" + user.uid).update({
        giftList: user.giftList
      });
    }
    if(user.support != undefined) {
      firebase.database().ref("users/" + user.uid).update({
        support: user.support
      });
    }
    if(user.invites != undefined) {
      firebase.database().ref("users/" + user.uid).update({
        invites: user.invites
      });
    }
    if(user.friends != undefined) {
      firebase.database().ref("users/" + user.uid).update({
        friends: user.friends
      });
    }
    if(user.shareCode != undefined) {
      firebase.database().ref("users/" + user.uid).update({
        shareCode: user.shareCode
      });
    }
    if(user.notifications != undefined) {
      firebase.database().ref("users/" + user.uid).update({
        notifications: user.notifications
      });
    }
    if (user.readNotifications != undefined) {
      firebase.database().ref("users/" + user.uid).update({
        readNotifications: user.readNotifications
      });
    }
    if (user.secretSanta != undefined) {
      firebase.database().ref("users/" + user.uid).update({
        secretSanta: user.secretSanta
      });
    }
    if (user.secretSantaName != undefined) {
      firebase.database().ref("users/" + user.uid).update({
        secretSantaName: user.secretSantaName
      });
    }

    btnUpdate.innerHTML = "Please Wait...";
    btnUpdate.onclick = function(){};
    btnDelete.onclick = function(){};
    backBtn.onclick = function(){};
    navigation(5, true);
  }
}

function addUserToDB(){
  let moderatorSetter = 0;

  if(userArr.length == 0)
    moderatorSetter = 1;

  checkUserNames(userNameField.value);

  if (nameField.value.includes(",,,") || userNameField.value.includes(",,,")) {
    deployNotificationModal(false, "User Error!", "Please do not include excess " +
      "commas in any of the fields!");
  } else if (nameField.value === "" || userNameField.value === "" || pinField.value === "" || pinConfField.value === ""){
    deployNotificationModal(false, "Empty Fields Error!", "It looks like you left some fields blank. Make " +
      "sure you have your full name, username, a pin, and a confirmed pin below.", false, 4);
  } else if (pinConfField.value !== pinField.value){
    deployNotificationModal(false, "Pin Mismatch Error!", "It looks like the pins you entered are NOT the same." +
      " Please re-type your pins to ensure they are identical.", false, 4);
  } else if (!isNaN(pinField.value) == false) {
    deployNotificationModal(false, "Pin Number Error!", "It looks like the pins you entered are not numeric, " +
      "please only enter numbers for your pin!", false, 4);
  } else if (userNameBool == false){
    deployNotificationModal(false, "User Name Taken!", "It looks like the User Name you chose is already taken," +
      " please choose another.", false, 4);
    userNameBool = true;
  } else {
    let newUid = firebase.database().ref("users").push();
    injectUserArr(userArr);
    let encodeKey = encode(pinField.value);
    let shareCodeNew = genShareCode();
    newUid = newUid.toString();
    newUid = findUIDInString(newUid);
    firebase.database().ref("users/" + newUid).set({
      name: nameField.value,
      encodeStr: encodeKey,
      userName: userNameField.value,
      userScore: 0,
      ban: 0,
      firstLogin: 0,
      lastLogin: "Never Logged In",
      moderatorInt: moderatorSetter,
      organize: 0,
      strike: 0,
      theme: 0,
      uid: newUid,
      warn: 0,
      shareCode: shareCodeNew,
      secretSanta: 0,
      secretSantaName: ""
    });

    btnUpdate.innerHTML = "Please Wait...";
    btnUpdate.onclick = function(){};
    btnDelete.onclick = function(){};
    backBtn.onclick = function(){};
    navigation(1, false);
  }

  function genShareCode(){
    let tempShareCode = "";
    for(let i = 1; i < 17; i++){
      tempShareCode = tempShareCode + getRandomAlphabet();
      if((i % 4) == 0 && i < 16){
        tempShareCode = tempShareCode + "-";
      }
    }
    return tempShareCode;
  }

  function getRandomAlphabet(){
    let alphabet = "123456789ABCDEFGHIJKLMNPQRSTUVWXYZ";
    let selector = Math.floor((Math.random() * alphabet.length));
    let charSelect = alphabet.charAt(selector);
    return charSelect;
  }
}

function checkUserNames(userName){
  for(let i = 0; i < userNameArr.length; i++){
    if(userName == userNameArr[i]){
      userNameBool = false;
    }
  }
}

function updateSuppressCheck(){
  if(user != null){
    updateUserToDB();
  } else {
    addUserToDB();
  }
}
