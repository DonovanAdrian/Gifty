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
        if (!userArr.includes(data.val())) {
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
    if (userArr.length < userLimit && userArr.length != 0 && user == null) {
      btnUpdate.innerHTML = "Create User Profile";
      alert("Alert! Make sure that you use pins that you have never used before! The pins will be stored securely, " +
        "but in the case of an unforseen attack, this will be additional protection for your personal accounts.");
    } else if (user == undefined) {
      alert("Unfortunately this Gifty Database is full, so no more users can be created." +
        " Please contact the owner to obtain access.");
      navigation(1, false);
    }
  }
};

function deleteCheck(){
  updateMaintenanceLog("userAddUpdate", "Attempting to delete user: " + user.userName);

  if(consoleOutput)
    console.log(user.uid + " will be deleted. Are you sure?");
  openModal(confirmModal, "confirmModal");

  deleteConfirm.onclick = function () {
    if(consoleOutput)
      console.log("Confirmed to delete user " + user.uid);

    for (let i = 0; i < userArr.length; i++) {//todo
      //check friend lists
      //check invite lists
      //check gift lists
    }

    firebase.database().ref("users/").child(user.uid).remove();
    closeModal(confirmModal);

    btnDelete.innerHTML = "Please Wait...";
    btnUpdate.onclick = function(){};
    btnDelete.onclick = function(){};
    backBtn.onclick = function(){};
    navigation(1, false);
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
}

function updateUserToDB(){
  checkUserNames(userNameField.value);

  if (nameField.value === "" || userNameField.value === "" || pinField.value === "" || pinConfField.value === ""){
    alert("It looks like you left some fields blank. Make sure you have your full name, username, a pin, and " +
      "a confirmed pin below.");
  } else if (pinConfField.value !== pinField.value){
    alert("It looks like the pins you entered are not the same");
  } else if (!isNaN(pinField.value) == false) {
    alert("It looks like the pins you entered are not numeric, please make sure that they are numbers only");
  } else if (userNameBool == false && user == null){
    alert("It looks like the User Name you chose is already taken, please choose another.");
    userNameBool = true;
  } else {
    injectUserArr(userArr);
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

  if (nameField.value === "" || userNameField.value === "" || pinField.value === "" || pinConfField.value === ""){
    alert("It looks like you left some fields blank. Make sure you have your full name, username, a pin, and " +
      "a confirmed pin below.");
  } else if (pinConfField.value !== pinField.value){
    alert("It looks like the pins you entered are not the same");
  } else if (!isNaN(pinField.value) == false) {
    alert("It looks like the pins you entered are not numeric, please make sure that they are numbers only");
  } else if (userNameBool == false){
    alert("It looks like the User Name you chose is already taken, please choose another.");
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
