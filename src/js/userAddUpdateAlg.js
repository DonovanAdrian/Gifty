/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let userAddUpdateElements = [];
let listeningFirebaseRefs = [];
let userNameArr = [];
let userKeyArr = [];
let userData = [];
let userArr = [];

let userNameBool = true;

let pinClearedInt = 0;

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
let userInitial;
let user;
let notificationModal;
let notificationInfo;
let notificationTitle;
let noteSpan;



function getCurrentUser(){
  try {
    user = JSON.parse(sessionStorage.validUser);
  } catch (err) {
    //console.log("Welcome new user!");
  }
  if(user == null){//newUser
    btnUpdate.innerHTML = "Create User Profile";
    alert("Alert! Make sure that you use pins that you have never used before! The pins will be stored securely," +
        "but in the case of an unforseen attack, this will be additional protection for your personal accounts.");
  } else {//returningUser
    btnUpdate.innerHTML = "Loading...";
    btnDelete.style.display = "block";
    btnDelete.style.position = "fixed";
    btnDelete.style.left = "50%";
    btnDelete.style.transform = "translate(-50%)";
    btnDelete.innerHTML = "Loading...";
    userArr = JSON.parse(sessionStorage.userArr);

    alert("Please note that you will be required to input your confirmation pin to continue. If you would like to " +
        "cancel, please click the back button on the browser.");
  }
}

//Instantiates all data upon loading the webpage
window.onload = function instantiate() {

  nameField = document.getElementById('nameField');
  userNameField = document.getElementById('userNameField');
  pinField = document.getElementById('pinField');
  pinConfField = document.getElementById('pinConfField');
  btnUpdate = document.getElementById('updateUser');
  btnDelete = document.getElementById('deleteUser');
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  confirmModal = document.getElementById('confirmModal');
  confirmSpan = document.getElementsByClassName('closeConfirm');
  deleteConfirm = document.getElementById('deleteConfirm');
  deleteDeny = document.getElementById('deleteDeny');
  notificationModal = document.getElementById('notificationModal');
  notificationTitle = document.getElementById('notificationTitle');
  notificationInfo = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  userAddUpdateElements = [nameField, userNameField, pinField, pinConfField, btnUpdate, btnDelete, offlineModal,
    offlineSpan, confirmModal, confirmSpan, deleteConfirm, deleteDeny, notificationModal, notificationTitle,
    notificationInfo, noteSpan];
  verifyElementIntegrity(userAddUpdateElements);
  getCurrentUser();
  commonInitialization();

  pinField.onclick = function() {
    if(pinClearedInt == 0) {
      pinField.value = "";
      pinConfField.value = "";
      pinClearedInt++;
    }
  };

  databaseQuery();

  function databaseQuery() {

    userInitial = firebase.database().ref("users/");

    let fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        userData.push(data.val());
        userNameArr.push(data.val().userName);
        userKeyArr.push(data.key);

        if(user != null) {
          if (data.key == user.uid) {
            user = data.val();
            nameField.value = user.name;
            userNameField.value = user.userName;
            pinField.value = user.pin;
            pinConfField.placeholder = "Please Confirm Pin To Continue";
            btnUpdate.innerHTML = "Update User Profile";
            btnDelete.innerHTML = "Delete User Profile";
            if(consoleOutput)
              console.log("User Updated: 1");
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
              console.log("User Updated: 2");
          }
        }
      });

      postRef.on('child_removed', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        userArr.splice(i, 1);
        userNameArr.splice(i, 1);
      });
    };

    fetchData(userInitial);

    listeningFirebaseRefs.push(userInitial);
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
};

function updateMaintenanceLog(locationData, detailsData) {
  let today = new Date();
  let UTChh = today.getUTCHours();
  let UTCmm = today.getUTCMinutes();
  let UTCss = today.getUTCSeconds();
  let dd = today.getUTCDate();
  let mm = today.getMonth()+1;
  let yy = today.getFullYear();
  let timeData = mm + "/" + dd + "/" + yy + " " + UTChh + ":" + UTCmm + ":" + UTCss;
  let newUid = firebase.database().ref("maintenance").push();
  newUid = newUid.toString();
  newUid = newUid.substr(51, 70);

  firebase.database().ref("maintenance/" + newUid).set({
    uid: newUid,
    location: locationData,
    details: detailsData,
    time: timeData
  });
}

function deleteCheck(){
  updateMaintenanceLog("userAddUpdate", "Attempting to delete user: " + user.userName);

  if(consoleOutput)
    console.log(user.uid + " will be deleted. Are you sure?");
  openModal(confirmModal, "confirmModal");

  deleteConfirm.onclick = function () {
    if(consoleOutput)
      console.log("Confirmed to delete user " + user.uid);
    firebase.database().ref("users/").child(user.uid).remove();
    closeModal(confirmModal);

    btnDelete.innerHTML = "Please Wait...";
    btnUpdate.onclick = function(){};//forces the update button to do nothing
    btnDelete.onclick = function(){};//forces the delete button to do nothing
    window.location.href = "index.html";
  };

  deleteDeny.onclick = function () {
    if(consoleOutput)
      console.log("Denied to delete user " + user.uid);
    closeModal(confirmModal);
  };

  //close on close
  confirmSpan.onclick = function () {
    if(consoleOutput)
      console.log("Closed window, user " + user.uid + " not deleted");
    closeModal(confirmModal);
  };

  //close on click
  window.onclick = function (event) {
    if (event.target == confirmModal) {
      if(consoleOutput)
        console.log("Clicked outside window, user " + user.uid + " not deleted");
      closeModal(confirmModal);
    }
  }
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
    let newPin = parseInt(pinField.value);
    injectUserArr(userArr);
    let encodeKey = encode(pinField.value);
    firebase.database().ref("users/" + user.uid).update({
      name: nameField.value,
      pin: newPin,
      encodeStr: encodeKey,
      userName: userNameField.value,
      ban: user.ban,
      firstLogin: user.firstLogin,
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
    btnUpdate.onclick = function(){};//forces the update button to do nothing
    btnDelete.onclick = function(){};//forces the delete button to do nothing
    sessionStorage.setItem("validUser", JSON.stringify(user));
    sessionStorage.setItem("userArr", JSON.stringify(userArr));
    window.location.href = "settings.html";
  }

}

function addUserToDB(){

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
    let newPin = parseInt(pinField.value);
    injectUserArr(userArr);
    let encodeKey = encode(pinField.value);
    let shareCodeNew = genShareCode();
    //console.log(shareCodeNew);
    newUid = newUid.toString();
    newUid = newUid.substr(45, 64);
    firebase.database().ref("users/" + newUid).set({
      name: nameField.value,
      pin: newPin,
      encodeStr: encodeKey,
      userName: userNameField.value,
      ban: 0,
      firstLogin: 0,
      moderatorInt: 0,
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
    btnUpdate.onclick = function(){};//forces the update button to do nothing
    btnDelete.onclick = function(){};//forces the delete button to do nothing
    window.location.href = "index.html";
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
