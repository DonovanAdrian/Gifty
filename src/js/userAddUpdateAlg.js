var listeningFirebaseRefs = [];
var userNameArr = [];
var userKeyArr = [];
var userData = [];

var userNameBool = true;
var areYouStillThereBool = false;

var pinClearedInt = 0;
var logoutReminder = 300;
var logoutLimit = 900;

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
var noteModal;
var noteInfoField;
var noteTitleField;
var noteSpan;



function getCurrentUser(){
  try {
    user = JSON.parse(sessionStorage.validUser);
  } catch (err) {
    console.log("Welcome new user!");
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

    loginTimer(); //if action, then reset timer

    function loginTimer(){
      var loginNum = 0;
      console.log("Login Timer Started");
      setInterval(function(){ //900 15 mins, 600 10 mins
        document.onmousemove = resetTimer;
        document.onkeypress = resetTimer;
        document.onload = resetTimer;
        document.onmousemove = resetTimer;
        document.onmousedown = resetTimer; // touchscreen presses
        document.ontouchstart = resetTimer;
        document.onclick = resetTimer;     // touchpad clicks
        document.onscroll = resetTimer;    // scrolling with arrow keys
        document.onkeypress = resetTimer;
        loginNum = loginNum + 1;
        if (loginNum >= logoutLimit){//default 900
          signOut();
        } else if (loginNum > logoutReminder){//default 600
          areYouStillThereNote(loginNum);
          areYouStillThereBool = true;
        }
        function resetTimer() {
          if (areYouStillThereBool)
            ohThereYouAre();
          loginNum = 0;
        }
      }, 1000);
    }

    function areYouStillThereNote(timeElapsed){
      var timeRemaining = logoutLimit - timeElapsed;
      var timeMins = Math.floor(timeRemaining/60);
      var timeSecs = timeRemaining%60;

      if (timeSecs < 10) {
        timeSecs = ("0" + timeSecs).slice(-2);
      }

      modal.style.display = "none";
      noteInfoField.innerHTML = "You have been inactive for 5 minutes, you will be logged out in " + timeMins
        + ":" + timeSecs + "!";
      noteTitleField.innerHTML = "Are You Still There?";
      noteModal.style.display = "block";

      //close on close
      noteSpan.onclick = function() {
        noteModal.style.display = "none";
        areYouStillThereBool = false;
      };
    }

    function ohThereYouAre(){
      noteInfoField.innerHTML = "Welcome back, " + user.name;
      noteTitleField.innerHTML = "Oh, There You Are!";

      var nowJ = 0;
      var j = setInterval(function(){
        nowJ = nowJ + 1000;
        if(nowJ >= 3000){
          noteModal.style.display = "none";
          areYouStillThereBool = false;
          clearInterval(j);
        }
      }, 1000);

      //close on click
      window.onclick = function(event) {
        if (event.target == noteModal) {
          noteModal.style.display = "none";
          areYouStillThereBool = false;
        }
      };
    }
    alert("Please note that you will be required to input your confirmation pin to continue. If you would like to " +
      "cancel, please click the back button on the browser.");
  }
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
  noteModal = document.getElementById('notificationModal');
  noteTitleField = document.getElementById('notificationTitle');
  noteInfoField = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  getCurrentUser();

  const config = JSON.parse(sessionStorage.config);

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

  databaseQuery();

  function databaseQuery() {

    userInitial = firebase.database().ref("users/");

    var fetchData = function (postRef) {
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
            pinconfField.placeholder = "Please Confirm Pin To Continue";
            btnUpdate.innerHTML = "Update User Profile";
            btnDelete.innerHTML = "Delete User Profile";
            console.log("User Updated: 1");
          }
        }
      });

      postRef.on('child_changed', function (data) {
        var i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
          userArr[i] = data.val();
        }

        if(user != null) {
          if (data.key == user.uid) {
            user = data.val();
            console.log("User Updated: 2");
          }
        }

        i = findItemInArr(data.key, userKeyArr);
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
        var i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          console.log("Removing " + userArr[i].userName + " / " + data.val().userName);
          userArr.splice(i, 1);
        }

        i = findItemInArr(data.key, userKeyArr);
        console.log("Delete user " + userKeyArr[i] + ", " + data.val().userName  + ", from userNameArr: "
          + userNameArr[i]);
        userKeyArr.splice(i, 1);
        userNameArr.splice(i, 1);
      });
    };

    fetchData(userInitial);

    listeningFirebaseRefs.push(userInitial);
  }

  function findUIDItemInArr(item, userArray){
    for(var i = 0; i < userArray.length; i++){
      if(userArray[i].uid == item){
        console.log("Found item: " + item);
        return i;
      }
    }
    return -1;
  }

  function findItemInArr(item, array){
    for(var i = 0; i < array.length; i++){
      if(array[i] == item){
        console.log("Found item: " + item);
        return i;
      }
    }
  }
};

function deleteCheck(){

  console.log(user.uid + " will be deleted. Are you sure?");
  confirmModal.style.display = "block";

  deleteConfirm.onclick = function () {
    //REMOVE UID FROM GIFT LISTS, FRIEND LISTS, AND INVITE LISTS

    console.log("Confirmed to delete user " + user.uid);
    firebase.database().ref("users/").child(user.uid).remove();
    confirmModal.style.display = "none";

    btnDelete.innerHTML = "Please Wait...";
    btnUpdate.onclick = function(){};//forces the update button to do nothing
    btnDelete.onclick = function(){};//forces the delete button to do nothing
    window.location.href = "index.html";
  };

  deleteDeny.onclick = function () {
    console.log("Denied to delete user " + user.uid);
    confirmModal.style.display = "none";
  };

  //close on close
  confirmSpan.onclick = function () {
    console.log("Closed window, user " + user.uid + " not deleted");
    confirmModal.style.display = "none";
  };

  //close on click
  window.onclick = function (event) {
    if (event.target == confirmModal) {
      console.log("Clicked outside window, user " + user.uid + " not deleted");
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
    injectUserArr(userArr);
    var encodeKey = encode(pinField.value);
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
    injectUserArr(userArr);
    var encodeKey = encode(pinField.value);
    var shareCodeNew = genShareCode();
    console.log(shareCodeNew);
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
  for(var i = 1; i < 17; i++){
    tempShareCode = tempShareCode + getRandomAlphabet();
    if((i % 4) == 0 && i < 16){
      tempShareCode = tempShareCode + "-";
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
  if(user != null){
    updateUserToDB();
  } else {
    addUserToDB();
  }
}
