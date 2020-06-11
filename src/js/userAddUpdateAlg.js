var listeningFirebaseRefs = [];
var userNameArr = [];
var userKeyArr = [];

var userNameBool = true;

var pinClearedInt = 0;

var offlineSpan;
var offlineModal;
var confirmSpan;
var confirmModal;
var deleteConfirm;
var deleteDeny;
var nameField;
var userNameField;
var pinField;
var pinconfField;
var btnUpdate;
var btnDelete;
var userInitial;
var user;



function getCurrentUser(){
  user = sessionStorage.getItem("validUser");
  if(user == null){//newUser
    btnUpdate.innerHTML = "Create User Profile";
  } else {//returningUser
    btnUpdate.innerHTML = "Loading...";
    btnDelete.style.display = "block";
    btnDelete.style.position = "fixed";
    btnDelete.style.left = "50%";
    btnDelete.style.transform = "translate(-50%)";
    btnDelete.innerHTML = "Loading...";
  }
  alert("Alert! Make sure that you use pins that you have never used before! The pins will be stored securely," +
    "but in the case of an unforseen attack, this will be additional protection for your personal accounts.");
}

//Instantiates all data upon loading the webpage
window.onload = function instantiate() {

  nameField = document.getElementById('name');
  userNameField = document.getElementById('username');
  pinField = document.getElementById('pin');
  pinconfField = document.getElementById('pinconf');
  btnUpdate = document.getElementById('updateUser');
  btnDelete = document.getElementById('deleteUser');
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  confirmModal = document.getElementById('confirmModal');
  confirmSpan = document.getElementsByClassName('closeConfirm');
  deleteConfirm = document.getElementById('deleteConfirm');
  deleteDeny = document.getElementById('deleteDeny');
  getCurrentUser();

  const config = {
    //Oops! This is gone!
  };
  firebase.initializeApp(config);
  firebase.analytics();

  firebase.auth().signInAnonymously().catch(function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
  });

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
    } else {
      // User is signed out.
    }
  });


  window.addEventListener("online", function(){
    offlineModal.style.display = "none";
    location.reload();
  });

  window.addEventListener("offline", function() {
    var now = 0;
    var g = setInterval(function(){
      now = now + 1000;
      if(now >= 5000){
        offlineModal.style.display = "block";
        clearInterval(g);
      }
    }, 1000);
  });

  //close offlineModal on close
  offlineSpan.onclick = function() {
    offlineModal.style.display = "none";
  };

  //close offlineModal on click
  window.onclick = function(event) {
    if (event.target == offlineModal) {
      offlineModal.style.display = "none";
    }
  };

  pinField.onclick = function() {
    if(pinClearedInt == 0) {
      pinField.value = "";
      pinconfField.value = "";
      pinClearedInt++;
    }
  };

  pinconfField.onclick = function() {
    if(pinClearedInt == 0) {
      pinField.value = "";
      pinconfField.value = "";
      pinClearedInt++;
    }
  };

  databaseQuery();

  function databaseQuery() {

    userInitial = firebase.database().ref("users/");

    var fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        userNameArr.push(data.val().userName);
        userKeyArr.push(data.key);
        if(user.key == data.key){
          nameField.value = user.name;
          userNameField.value = user.userName;
          pinField.value = user.pin;
          pinconfField.placeholder = "Please Confirm Pin To Continue";
          btnUpdate.innerHTML = "Update User Profile";
          btnDelete.innerHTML = "Delete User Profile";
        }
      });

      postRef.on('child_changed', function (data) {
        var i = findItemInArr(userKeyArr, data.key);
        console.log("Update userNameArr " + userNameArr[i] + " with data " + data.val().userName + "?");
        if(userNameArr[i] != data.val().userName){
          console.log("Yes!");
          console.log(userNameArr);
          userNameArr[i] = data.val().userName;
          console.log(userNameArr);
          console.log(".........Deleted?");
        } else {
          console.log("No! UserName does not need to be updated");
        }
      });

      postRef.on('child_removed', function (data) {
        var i = findItemInArr(userKeyArr, data.key);
        console.log("Delete user " + userKeyArr[i] + ", " + data.val().userName  + ", from userNameArr: "
          + userNameArr[i]);
        console.log("\nUSER KEY ARR");
        console.log(userKeyArr);
        userKeyArr.splice(i, 1);
        console.log(userKeyArr);
        console.log("\nUSER NAME ARR");
        console.log(userNameArr);
        userNameArr.splice(i, 1);
        console.log(userNameArr);
        console.log(".........Deleted?");
      });
    };

    fetchData(userInitial);

    listeningFirebaseRefs.push(userInitial);
  }
};

function findItemInArr(item, array){
  for(var i = 0; i < array.length; i++){
    if(array[i] == item){
      console.log("Found item: " + item);
      return i;
    }
  }
}

function deleteCheck(){

  console.log(user.key + " will be deleted. Are you sure?");
  confirmModal.style.display = "block";

  deleteConfirm.onclick = function () {
    console.log("Confirmed to delete user " + user.key);
    //firebase.database().ref("users/").child(user.key).remove(); //-----------------------------UNCOMMENT DELETE LATER
    confirmModal.style.display = "none";

    btnDelete.innerHTML = "Please Wait...";
    btnUpdate.onclick = function(){};//forces the update button to do nothing
    btnDelete.onclick = function(){};//forces the delete button to do nothing
    window.location.href = "index.html";
  };

  deleteDeny.onclick = function () {
    console.log("Denied to delete user " + user.key);
    confirmModal.style.display = "none";
  };

  //close on close
  confirmSpan.onclick = function () {
    console.log("Closed window, user " + user.key + " not deleted");
    confirmModal.style.display = "none";
  };

  //close on click
  window.onclick = function (event) {
    if (event.target == confirmModal) {
      console.log("Clicked outside window, user " + user.key + " not deleted");
      confirmModal.style.display = "none";
    }
  }
}

function updateUserToDB(){

  checkUserNames(userNameField.value);

  if (nameField.value === "" || userNameField.value === "" || pinField.value === "" || pinconfField.value === ""){
    alert("It looks like you left some fields blank. Make sure you have your full name, username, a pin, and " +
      "a confirmed pin below.");
  } else if (pinconfField.value !== pinField.value){
    alert("It looks like the pins you entered are not the same");
  } else if (!isNaN(pinField.value) == false) {
    alert("It looks like the pins you entered are not numeric, please make sure that they are numbers only");
  } else if (userNameBool == false && user == null){
    alert("It looks like the User Name you chose is already taken, please choose another.");
    userNameBool = true;
  } else {
    var newPin = parseInt(pinField.value);
    var encodeKey = encode(pinField.value);
    firebase.database().ref("users/" + user.key).update({
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
      uid: user.key,
      warn: user.warn,
    });
    if(user.giftList != undefined) {
      firebase.database().ref("users/" + user.key).update({
        giftList: user.giftList
      });
    }
    if(user.support != undefined) {
      firebase.database().ref("users/" + user.key).update({
        support: user.support
      });
    }
    if(user.invites != undefined) {
      firebase.database().ref("users/" + user.key).update({
        invites: user.invites
      });
    }
    if(user.friends != undefined) {
      firebase.database().ref("users/" + user.key).update({
        friends: user.friends
      });
    }
    if(user.shareCode != undefined) {
      firebase.database().ref("users/" + user.key).update({
        shareCode: user.shareCode
      });
    }

    btnUpdate.innerHTML = "Please Wait...";
    btnUpdate.onclick = function(){};//forces the update button to do nothing
    btnDelete.onclick = function(){};//forces the delete button to do nothing
    sessionStorage.setItem("validUser", user);
    window.location.href = "settings.html";
  }

}

function addUserToDB(){

  checkUserNames(userNameField.value);

  if (nameField.value === "" || userNameField.value === "" || pinField.value === "" || pinconfField.value === ""){
    alert("It looks like you left some fields blank. Make sure you have your full name, username, a pin, and " +
      "a confirmed pin below.");
  } else if (pinconfField.value !== pinField.value){
    alert("It looks like the pins you entered are not the same");
  } else if (!isNaN(pinField.value) == false) {
    alert("It looks like the pins you entered are not numeric, please make sure that they are numbers only");
  } else if (userNameBool == false){
    alert("It looks like the User Name you chose is already taken, please choose another.");
    userNameBool = true;
  } else {
    var newUid = firebase.database().ref("users").push();
    var newPin = parseInt(pinField.value);
    var encodeKey = encode(pinField.value);
    var shareCodeNew = genShareCode();
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
      shareCode: shareCodeNew
    });

    btnUpdate.innerHTML = "Please Wait...";
    btnUpdate.onclick = function(){};//forces the update button to do nothing
    btnDelete.onclick = function(){};//forces the delete button to do nothing
    window.location.href = "index.html";
  }
}

function genShareCode(){
  var tempShareCode = "";
  for(var i = 0; i < 16; i++){
    tempShareCode =+ getRandomAlphabet();
    if((i % 4) == 0){
      tempShareCode =+ "-";
    }
  }
  return tempShareCode;
}

function getRandomAlphabet(){
  var alphabet = "123456789ABCDEFGHIJKLMNPQRSTUVWXYZ";
  var selector = Math.floor((Math.random() * alphabet.length));
  var charSelect = alphabet.charAt(selector);
  return charSelect;
}

function checkUserNames(userName){
  for(var i = 0; i < userNameArr.length; i++){
    if(userName == userNameArr[i]){
      userNameBool = false;
    }
  }
}

function updateSuppressCheck(){
  if(user !== null){
    updateUserToDB();
  } else {
    addUserToDB();
  }
}
