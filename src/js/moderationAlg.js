var listeningFirebaseRefs = [];
var inviteArr = [];

var areYouStillThereBool = false;

var moderationSet = 1;
var userCounter = 0;
var onlineInt = 0;
var logoutReminder = 300;
var logoutLimit = 1800;

var giftList;
var giftListHTML;
var offline;
var offlineSpan;
var offlineModal;
var user;
var userInvites;
var offlineTimer;
var modal;
var noteModal;
var noteInfoField;
var noteTitleField;
var noteSpan;
var listNote;
var inviteNote;
var userInitial;



function getCurrentUser(){
  try {
    user = JSON.parse(sessionStorage.validUser);
    if (user == null || user == undefined) {
      window.location.href = "index.html";
    } else {
      console.log("User: " + user.userName + " logged in");
      if (user.invites == undefined) {
        console.log("Invites Not Found");
      } else if (user.invites != undefined) {
        if (user.invites.length > 0) {
          inviteNote.style.background = "#ff3923";
        }
      }
      userArr = JSON.parse(sessionStorage.userArr);
    }

    sessionStorage.setItem("moderationSet", moderationSet);
  } catch (err) {
    window.location.href = "index.html";
  }
}

window.onload = function instantiate() {

  giftList = document.getElementById('giftListContainer');
  giftListHTML = document.getElementById('giftListContainer').innerHTML;
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  listNote = document.getElementById('listNote');
  inviteNote = document.getElementById('inviteNote');
  noteModal = document.getElementById('notificationModal');
  noteTitleField = document.getElementById('notificationTitle');
  noteInfoField = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  modal = document.getElementById('giftModal');
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
    offlineTimer = setInterval(function(){
      now = now + 1000;
      if(now >= 5000){
        try{
          if (onlineInt == 0) {
            document.getElementById("TestGift").innerHTML = "Loading Failed, Please Connect To Internet";
          } else {
            document.getElementById("TestGift").innerHTML = "No Users Found!";
          }
        } catch(err) {
          if(userCounter == 0){
            console.log("Loading Element Missing, Creating A New One");
            var liItem = document.createElement("LI");
            liItem.id = "TestGift";
            liItem.className = "gift";
            if (onlineInt == 0) {
              var textNode = document.createTextNode("Loading Failed, Please Connect To Internet");
            } else {
              var textNode = document.createTextNode("No Users Found!");
            }
            liItem.appendChild(textNode);
            giftList.insertBefore(liItem, document.getElementById("giftListContainer").childNodes[0]);
          }
        }
        offlineModal.style.display = "block";
        clearInterval(offlineTimer);
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

  databaseQuery();

  settingsModerateButton();

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

  function settingsModerateButton(){
    var nowConfirm = 0;
    var alternator = 0;
    console.log("Settings Button Feature Active");
    setInterval(function(){
      nowConfirm = nowConfirm + 1000;
      if(nowConfirm >= 3000){
        nowConfirm = 0;
        if(alternator == 0) {
          alternator++;
          document.getElementById("settingsNote").innerHTML = "Settings";
          settingsNote.style.background = "#00c606";
        } else {
          alternator--;
          document.getElementById("settingsNote").innerHTML = "Moderation";
          settingsNote.style.background = "#00ad05";
        }
      }
    }, 1000);
  }

  function databaseQuery() {

    userInitial = firebase.database().ref("users/");
    userInvites = firebase.database().ref("users/" + user.uid + "/invites");

    var fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        createUserElement(data.val());

        onlineInt = 1;

        var i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() || i != -1){
          console.log("Adding " + userArr[i].userName + " to most updated version: " + data.val().userName);
          userArr[i] = data.val();
        }

        if(data.key == user.uid){
          user = data.val();
          console.log("User Updated: 1");
        }
      });

      postRef.on('child_changed', function (data) {
        changeUserElement(data.val());

        var i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() || i != -1){
          console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
          userArr[i] = data.val();
        }

        if(data.key == user.uid){
          user = data.val();
          console.log("User Updated: 2");
        }
      });

      postRef.on('child_removed', function (data) {
        removeUserElement(data.val().uid);

        var i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() || i != -1){
          console.log("Removing " + userArr[i].userName + " / " + data.val().userName);
          userArr.splice(i, 1);
        }
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

    fetchData(userInitial);
    fetchInvites(userInvites);

    listeningFirebaseRefs.push(userInitial);
    listeningFirebaseRefs.push(userInvites);
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

  function createUserElement(userData){
    try{
      document.getElementById("TestGift").remove();
    } catch (err) {}

    var liItem = document.createElement("LI");
    liItem.id = "user" + userData.uid;
    liItem.className = "gift";
    liItem.onclick = function (){
      var spanGift = document.getElementsByClassName("close")[0];
      var warnBtn = document.getElementById('warnUser');
      var banBtn = document.getElementById('banUser');
      var userName = document.getElementById('userName');
      var userUID = document.getElementById('userUID');
      var userUserName = document.getElementById('userUserName');
      var userGifts = document.getElementById('userGifts');
      var userFriends = document.getElementById('userFriends');
      var userPassword = document.getElementById('userPassword');

      userName.innerHTML = userData.name;
      userUID.innerHTML = userData.uid;
      userUserName.innerHTML = userData.userName;
      if(userData.giftList != undefined){
        userGifts.innerHTML = "# Gifts: " + userData.giftList.length;
      }
      if(userData.friends != undefined) {
        userFriends.innerHTML = "# Friends: " + userData.friends.length;
      }
      userPassword.innerHTML = "Click On Me To View Password";

      userGifts.onclick = function() {
        if(userData.uid == user.uid){
          alert("Navigate to the home page to see your gifts!");
        } else {
          sessionStorage.setItem("validGiftUser", JSON.stringify(userData));//Other User Data
          sessionStorage.setItem("validUser", JSON.stringify(user));
          window.location.href = "friendList.html";
        }
      };
      userPassword.onclick = function() {
        try {
          userPassword.innerHTML = decode(userData.encodeStr);
        } catch (err) {
          userPassword.innerHTML = userData.pin;
        }
      };
      warnBtn.onclick = function(){
        alert("This will eventually warn the user of a certain offense");
        //warn function
      };
      banBtn.onclick = function(){
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
            modal.style.display = "none";
          }
        };
      } else {
        moderatorOp.innerHTML = "Grant Moderator Role";
        moderatorOp.onclick = function() {
          if(userData.userName == user.userName){
            alert("You cannot adjust your own role");
            console.log("...How'd you get here...?");
          } else {
            alert("Granted role for: " + userData.userName);
            firebase.database().ref("users/" + userData.uid).update({
              moderatorInt: 1
            });
            modal.style.display = "none";
          }
        };
      }

      //show modal
      modal.style.display = "block";

      //close on close
      spanGift.onclick = function() {
        modal.style.display = "none";
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }
    };
    var textNode = document.createTextNode(userData.name);
    liItem.appendChild(textNode);

    giftList.insertBefore(liItem, document.getElementById("giftListContainer").childNodes[0]);
    clearInterval(offlineTimer);

    userCounter++;
  }

  function changeUserElement(userData) {
    var editGift = document.getElementById("user" + userData.uid);
    editGift.innerHTML = userData.name;
    editGift.className = "gift";
    editGift.onclick = function (){
      var spanGift = document.getElementsByClassName("close")[0];
      var warnBtn = document.getElementById('warnUser');
      var banBtn = document.getElementById('banUser');
      var userName = document.getElementById('userName');
      var userUID = document.getElementById('userUID');
      var userUserName = document.getElementById('userUserName');
      var userGifts = document.getElementById('userGifts');
      var userFriends = document.getElementById('userFriends');
      var userPassword = document.getElementById('userPassword');
      var moderatorOp = document.getElementById('moderatorOp');

      userName.innerHTML = userData.name;
      userUID.innerHTML = userData.uid;
      userUserName.innerHTML = userData.userName;
      if(userData.giftList != undefined){
        userGifts.innerHTML = "# Gifts: " + userData.giftList.length;
      }
      if(userData.friends != undefined) {
        userFriends.innerHTML = "# Friends: " + userData.friends.length;
      }
      userPassword.innerHTML = "Click On Me To View Password";

      userGifts.onclick = function() {
        if(userData.uid == user.uid){
          alert("Navigate to the home page to see your gifts!");
        } else {
          sessionStorage.setItem("validGiftUser", JSON.stringify(userData));//Other User Data
          sessionStorage.setItem("validUser", JSON.stringify(user));
          window.location.href = "friendList.html";
        }
      };
      userPassword.onclick = function() {
        userPassword.innerHTML = decode(userData.encodeStr);
      };
      warnBtn.onclick = function(){
        alert("This will eventually warn the user of a certain offense");
        //warn function
      };
      banBtn.onclick = function(){
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
            modal.style.display = "none";
          }
        };
      } else {
        moderatorOp.innerHTML = "Grant Moderator Role";
        moderatorOp.onclick = function() {
          if(userData.userName == user.userName){
            alert("You cannot adjust your own role");
            console.log("...How'd you get here...?");
          } else {
            alert("Granted role for: " + userData.userName);
            firebase.database().ref("users/" + userData.uid).update({
              moderatorInt: 1
            });
            modal.style.display = "none";
          }
        };
      }

      //show modal
      modal.style.display = "block";

      //close on close
      spanGift.onclick = function() {
        modal.style.display = "none";
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      };
    };
  }

  function removeUserElement(uid) {
    document.getElementById("user" + uid).remove();

    userCounter--;
    if (userCounter == 0){
      deployUserListEmptyNotification();
    }
  }
};

function deployUserListEmptyNotification(){
  try{
    document.getElementById("TestGift").innerHTML = "No Users Found!";
  } catch(err){
    console.log("Loading Element Missing, Creating A New One");
    var liItem = document.createElement("LI");
    liItem.id = "TestGift";
    liItem.className = "gift";
    var textNode = document.createTextNode("No Users Found!");
    liItem.appendChild(textNode);
    giftList.insertBefore(liItem, document.getElementById("giftListContainer").childNodes[0]);
  }

  clearInterval(offlineTimer);
}

function signOut(){
  sessionStorage.clear();
  window.location.href = "index.html";
}

function navigation(nav){
  sessionStorage.setItem("validUser", JSON.stringify(user));
  sessionStorage.setItem("userArr", JSON.stringify(userArr));
  switch(nav){
    case 0:
      window.location.href = "home.html";
      break;
    case 1:
      window.location.href = "lists.html";
      break;
    case 2:
      window.location.href = "invites.html";
      break;
    case 3:
      window.location.href = "settings.html";
      break;
    default:
      break;
  }
}
