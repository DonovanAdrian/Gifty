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
        let i = findUIDItemInArr(data.key, userArr, true);
        if (i != -1) {
          localObjectChanges = findObjectChanges(userArr[i], data.val());
          if (localObjectChanges.length != 0) {
            userArr[i] = data.val();

            if (user != null)
              if (data.key == user.uid) {
                user = data.val();
              }
          }
        } else {
          userArr.push(data.val());
          userNameArr.push(data.val().userName);
          userKeyArr.push(data.key);

          if (user != null)
            if (data.key == user.uid) {
              user = data.val();
            }
        }

        if(user != null)
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
      });

      postRef.on('child_changed', function (data) {
        let i = findUIDItemInArr(data.key, userArr, true);
        if (i != -1) {
          localObjectChanges = findObjectChanges(userArr[i], data.val());
          if (localObjectChanges.length != 0) {
            userArr[i] = data.val();
            userNameArr[i] = data.val().userName;

            if(user != null)
              if (data.key == user.uid) {
                user = data.val();
                if(consoleOutput)
                  console.log("Current User Updated");
              }
          }
        }
      });

      postRef.on('child_removed', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if (i != -1) {
          userArr.splice(i, 1);
          userNameArr.splice(i, 1);
        }
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
          4);
    } else if (user == undefined && !userCreationOverride) {
      deployNotificationModal(false, "Gifty Database Full!", "Unfortunately this Gifty Database is full, so no more users can be created." +
          " Please contact the owner to obtain access. Redirecting back to login...", 4, 1);
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

  if(consoleOutput)
    console.log(user.uid + " will be deleted. Are you sure?");
  openModal(confirmModal, "confirmModal");

  deleteConfirm.onclick = function () {
    if(consoleOutput)
      console.log("Confirmed to delete user " + user.uid);

    for (let i = 0; i < userArr.length; i++) {
      if (userArr[i].uid != user.uid) {
        deleteCleanupUser = userArr[i];

        if (deleteCleanupUser.friends != null) {
          let friendDelIndex = deleteCleanupUser.friends.indexOf(user.uid);
          if (deleteCleanupUser.friends[friendDelIndex] == user.uid) {
            deleteCleanupUser.friends.splice(friendDelIndex, 1);
            firebase.database().ref("users/" + deleteCleanupUser.uid).update({
              friends: deleteCleanupUser.friends
            });
          }
        }

        if (deleteCleanupUser.invites != null) {
          let inviteDelIndex = deleteCleanupUser.invites.indexOf(user.uid);
          if (deleteCleanupUser.invites[inviteDelIndex] == user.uid) {
            deleteCleanupUser.invites.splice(inviteDelIndex, 1);
            firebase.database().ref("users/" + deleteCleanupUser.uid).update({
              invites: deleteCleanupUser.invites
            });
          }
        }

        if (deleteCleanupUser.giftList != null) {
          for (let delUserGiftIndex = 0; delUserGiftIndex < deleteCleanupUser.giftList.length; delUserGiftIndex++) {
            if (deleteCleanupUser.giftList[delUserGiftIndex].buyer != undefined) {
              if (deleteCleanupUser.giftList[delUserGiftIndex].buyer == user.userName) {
                deleteCleanupUser.giftList[delUserGiftIndex].received = 0;
                deleteCleanupUser.giftList[delUserGiftIndex].buyer = "";
                deleteChangeBool = true;
                deleteBuyerBool = true;
              }
            }
            if (!deleteBuyerBool) {
              if (deleteCleanupUser.giftList[delUserGiftIndex].received != undefined) {
                if (deleteCleanupUser.giftList[delUserGiftIndex].received < 0) {
                  let delUserRcvdIndex = deleteCleanupUser.giftList[delUserGiftIndex].receivedBy.indexOf(user.uid);
                  if (deleteCleanupUser.giftList[delUserGiftIndex].receivedBy[delUserRcvdIndex] == user.uid) {
                    deleteCleanupUser.giftList[delUserGiftIndex].receivedBy.splice(delUserRcvdIndex, 1);
                    deleteCleanupUser.giftList[delUserGiftIndex].received++;
                    deleteChangeBool = true;
                  }
                }
              }
            }
            deleteBuyerBool = false;
          }

          if (deleteChangeBool) {
            firebase.database().ref("users/" + deleteCleanupUser.uid).update({
              giftList: deleteCleanupUser.giftList
            });
            deleteChangeBool = false;
          }
        }

        if (deleteCleanupUser.privateList != null) {
          for (let delUserGiftIndex = 0; delUserGiftIndex < deleteCleanupUser.privateList.length; delUserGiftIndex++) {
            if (deleteCleanupUser.privateList[delUserGiftIndex].buyer != undefined) {
              if (deleteCleanupUser.privateList[delUserGiftIndex].buyer == user.userName) {
                deleteCleanupUser.privateList[delUserGiftIndex].received = 0;
                deleteCleanupUser.privateList[delUserGiftIndex].buyer = "";
                deleteChangeBool = true;
                deleteBuyerBool = true;
              }
            }
            if (!deleteBuyerBool) {
              if (deleteCleanupUser.privateList[delUserGiftIndex].received != undefined) {
                if (deleteCleanupUser.privateList[delUserGiftIndex].received < 0) {
                  let delUserRcvdIndex = deleteCleanupUser.privateList[delUserGiftIndex].receivedBy.indexOf(user.uid);
                  if (deleteCleanupUser.privateList[delUserGiftIndex].receivedBy[delUserRcvdIndex] == user.uid) {
                    deleteCleanupUser.privateList[delUserGiftIndex].receivedBy.splice(delUserRcvdIndex, 1);
                    deleteCleanupUser.privateList[delUserGiftIndex].received++;
                    deleteChangeBool = true;
                  }
                }
              }
            }
            if (deleteCleanupUser.privateList[delUserGiftIndex].creator != undefined) {
              if (deleteCleanupUser.privateList[delUserGiftIndex].creator == user.userName) {
                replacementCreatorUser = getFriendReplacement(deleteCleanupUser);
                if (replacementCreatorUser != null) {
                  deleteCleanupUser.privateList[delUserGiftIndex].creator = replacementCreatorUser.userName;
                } else {
                  deleteCleanupUser.privateList.splice(delUserGiftIndex, 1);
                  delUserGiftIndex--;
                }
                deleteChangeBool = true;
              }
            }
            deleteBuyerBool = false;
          }

          if (deleteChangeBool) {
            firebase.database().ref("users/" + deleteCleanupUser.uid).update({
              privateList: deleteCleanupUser.privateList
            });
            deleteChangeBool = false;
          }
        }
      }
    }

    firebase.database().ref("users/").child(user.uid).remove();
    closeModal(confirmModal);

    btnDelete.innerHTML = "Please Wait...";
    btnUpdate.onclick = function(){};
    btnDelete.onclick = function(){};
    backBtn.onclick = function(){};
    if(consoleOutput) {
      console.log("");
      console.log("Completed deleting user " + user.uid);
    }
    deployNotificationModal(false, "User Account Deleted!", "Your account has been " +
        "successfully deleted. Redirecting back to Login...", 5, 1, false);
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

function updateUserToDB(){
  checkUserNames(userNameField.value);

  if (nameField.value.includes(",,,") || userNameField.value.includes(",,,")) {
    deployNotificationModal(false, "User Error!", "Please do not include excess " +
        "commas in any of the fields!");
  } else if (nameField.value === "" || userNameField.value === "" || pinField.value === "" || pinConfField.value === ""){
    deployNotificationModal(false, "Empty Fields Error!", "It looks like you left some fields blank. Make " +
        "sure you have your full name, username, a pin, and a confirmed pin below.", 4);
  } else if (pinConfField.value !== pinField.value){
    deployNotificationModal(false, "Pin Mismatch Error!", "It looks like the pins you entered are NOT the same." +
        " Please re-type your pins to ensure they are identical.", 4);
  } else if (!isNaN(pinField.value) == false) {
    deployNotificationModal(false, "Pin Number Error!", "It looks like the pins you entered are not numeric, " +
        "please only enter numbers for your pin!", 4);
  } else if (userNameBool == false && user == undefined){
    deployNotificationModal(false, "User Name Taken!", "It looks like the User Name you chose is already taken," +
        " please choose another.", 4);
    userNameBool = true;
  } else {
    userUpdateOverride = true;
    injectUserArr(userArr);
    user.name = nameField.value;
    user.userName = userNameField.value;
    let encodeKey = encode(pinField.value);

    if(user.shareCode == undefined) {
      user.shareCode = genShareCode();
    }
    if(user.giftList == undefined) {
      user.giftList = [];
    }
    if(user.notifications == undefined) {
      user.notifications = [];
    }
    if (user.settingsScoreBlock == undefined) {
      user.settingsScoreBlock = 0;
    }
    if (user.secretSanta == undefined) {
      user.secretSanta = 0;
    }
    if (user.secretSantaName == undefined) {
      user.secretSantaName = "";
    }
    if (user.secretSantaNamePrior == undefined) {
      user.secretSantaNamePrior = "";
    }
    if(user.yearlyReview == undefined) {
      let currentDate = new Date();
      user.yearlyReview = currentDate.getFullYear();
    }
    if(user.friends == undefined) {
      user.friends = [];
    }
    if(user.support == undefined) {
      user.support = [];
    }
    if(user.invites == undefined) {
      user.invites = [];
    }

    firebase.database().ref("users/" + user.uid).update({
      name: nameField.value,
      encodeStr: encodeKey,
      userName: userNameField.value,
      userScore: user.userScore,
      ban: user.ban,
      support: user.support,
      friends: user.friends,
      invites: user.invites,
      firstLogin: user.firstLogin,
      lastLogin: user.lastLogin,
      moderatorInt: user.moderatorInt,
      organize: user.organize,
      strike: user.strike,
      theme: user.theme,
      uid: user.uid,
      warn: user.warn,
      giftList: user.giftList,
      shareCode: user.shareCode,
      notifications: user.notifications,
      settingsScoreBlock: user.settingsScoreBlock,
      secretSanta: user.secretSanta,
      secretSantaName: user.secretSantaName,
      secretSantaNamePrior: user.secretSantaNamePrior,
      yearlyReview: user.yearlyReview
    });

    btnUpdate.innerHTML = "Please Wait...";
    btnUpdate.onclick = function(){};
    btnDelete.onclick = function(){};
    backBtn.onclick = function(){};
    deployNotificationModal(false, "User Account Updated!", "Your account has been " +
        "successfully updated. Redirecting back to Settings...", 5, 5, true);
  }
}

function addUserToDB(){
  let moderatorSetter = 0;
  let currentDate = new Date();
  let currentYear = currentDate.getFullYear();

  if(userArr.length == 0)
    moderatorSetter = 1;

  checkUserNames(userNameField.value);

  if (nameField.value.includes(",,,") || userNameField.value.includes(",,,")) {
    deployNotificationModal(false, "User Error!", "Please do not include excess " +
        "commas in any of the fields!");
  } else if (nameField.value === "" || userNameField.value === "" || pinField.value === "" || pinConfField.value === ""){
    deployNotificationModal(false, "Empty Fields Error!", "It looks like you left some fields blank. Make " +
        "sure you have your full name, username, a pin, and a confirmed pin below.", 4);
  } else if (pinConfField.value !== pinField.value){
    deployNotificationModal(false, "Pin Mismatch Error!", "It looks like the pins you entered are NOT the same." +
        " Please re-type your pins to ensure they are identical.", 4);
  } else if (!isNaN(pinField.value) == false) {
    deployNotificationModal(false, "Pin Number Error!", "It looks like the pins you entered are not numeric, " +
        "please only enter numbers for your pin!", 4);
  } else if (userNameBool == false){
    deployNotificationModal(false, "User Name Taken!", "It looks like the User Name you chose is already taken," +
        " please choose another.", 4);
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
      settingsScoreBlock: 0,
      secretSanta: 0,
      secretSantaName: "",
      secretSantaNamePrior: "",
      yearlyReview: currentYear
    });

    btnUpdate.innerHTML = "Please Wait...";
    btnUpdate.onclick = function(){};
    btnDelete.onclick = function(){};
    backBtn.onclick = function(){};
    deployNotificationModal(false, "User Account Created!", "Your account has been " +
        "successfully created! Redirecting back to Login...", 5, 1, false);
  }
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
