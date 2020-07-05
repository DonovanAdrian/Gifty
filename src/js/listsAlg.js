var inviteArr = [];
var friendArr = [];
var listeningFirebaseRefs = [];
var userArr = [];

var areYouStillThereBool = false;

var moderationSet = 0;
var onlineInt = 0;
var friendCount = 0;
var logoutReminder = 300;
var logoutLimit = 900;

var userList;
var userBase;
var userFriends;
var userInvites;
var offlineSpan;
var offlineModal;
var offlineTimer;
var user;
var listNote;
var inviteNote;
var noteModal;
var noteInfoField;
var noteTitleField;
var noteSpan;
var modal;



function getCurrentUser(){
  try {
    user = JSON.parse(sessionStorage.validUser);
    if (user == null || user == undefined) {
      window.location.href = "index.html";
    } else {
      console.log("User: " + user.userName + " logged in");
      if (user.friends == undefined) {
        deployFriendListEmptyNotification();
      } else if (user.friends.length == 0) {
        deployFriendListEmptyNotification();
      }
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

  userList = document.getElementById("userListContainer");
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById("closeOffline");
  listNote = document.getElementById('listNote');
  inviteNote = document.getElementById('inviteNote');
  noteModal = document.getElementById('notificationModal');
  noteTitleField = document.getElementById('notificationTitle');
  noteInfoField = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  modal = document.getElementById('myModal');
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
            document.getElementById("TestGift").innerHTML = "No Friends Found! Invite Some Friends In The \"Invite\" Tab!";
          }
        } catch(err) {
          if(friendCount == 0) {
            console.log("Loading Element Missing, Creating A New One");
            var liItem = document.createElement("LI");
            liItem.id = "TestGift";
            liItem.className = "gift";
            if (onlineInt == 0) {
              var textNode = document.createTextNode("Loading Failed, Please Connect To Internet");
            } else {
              var textNode = document.createTextNode("No Friends Found! Invite Some Friends In The \"Invite\" Tab!");
            }
            liItem.appendChild(textNode);
            userList.insertBefore(liItem, document.getElementById("giftListContainer").childNodes[0]);
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

  function databaseQuery() {

    userBase = firebase.database().ref("users/" + user.uid);
    userFriends = firebase.database().ref("users/" + user.uid + "/friends");
    userInvites = firebase.database().ref("users/" + user.uid + "/invites");

    var fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        onlineInt = 1;
        if(data.key == "name"){
          user.name = data.val();
        } else if (data.key == "pin"){
          user.pin = data.val();
        } else if (data.key == "encodeStr"){
          user.encodeStr = data.val();
        } else if (data.key == "userName"){
          user.userName = data.val();
        } else if (data.key == "ban"){
          user.ban = data.val();
        } else if (data.key == "firstLogin"){
          user.firstLogin = data.val();
        } else if (data.key == "moderatorInt"){
          user.moderatorInt = data.val();
        } else if (data.key == "organize"){
          user.organize = data.val();
        } else if (data.key == "strike"){
          user.strike = data.val();
        } else if (data.key == "theme"){
          user.theme = data.val();
        } else if (data.key == "uid"){
          user.uid = data.val();
        } else if (data.key == "warn"){
          user.warn = data.val();
        } else if (data.key == "giftList"){
          user.giftList = data.val();
        } else if (data.key == "support"){
          user.support = data.val();
        } else if (data.key == "invites"){
          user.invites = data.val();
        } else if (data.key == "friends"){
          user.friends = data.val();
        } else if (data.key == "shareCode"){
          user.shareCode = data.val();
        } else {
          console.log("Unknown Key..." + data.key);
        }
      });
      postRef.on('child_changed', function (data) {
        if(data.key == "name"){
          user.name = data.val();
        } else if (data.key == "pin"){
          user.pin = data.val();
        } else if (data.key == "encodeStr"){
          user.encodeStr = data.val();
        } else if (data.key == "userName"){
          user.userName = data.val();
        } else if (data.key == "ban"){
          user.ban = data.val();
        } else if (data.key == "firstLogin"){
          user.firstLogin = data.val();
        } else if (data.key == "moderatorInt"){
          user.moderatorInt = data.val();
        } else if (data.key == "organize"){
          user.organize = data.val();
        } else if (data.key == "strike"){
          user.strike = data.val();
        } else if (data.key == "theme"){
          user.theme = data.val();
        } else if (data.key == "uid"){
          user.uid = data.val();
        } else if (data.key == "warn"){
          user.warn = data.val();
        } else if (data.key == "giftList"){
          user.giftList = data.val();
        } else if (data.key == "support"){
          user.support = data.val();
        } else if (data.key == "invites"){
          user.invites = data.val();
        } else if (data.key == "friends"){
          user.friends = data.val();
        } else if (data.key == "shareCode"){
          user.shareCode = data.val();
        } else {
          console.log("Unknown Key..." + data.key);
        }
      });
      postRef.on('child_removed', function (data) {
        if(data.key == "name"){
          user.name = "";
        } else if (data.key == "pin"){
          user.pin = "";
        } else if (data.key == "encodeStr"){
          user.encodeStr = "";
        } else if (data.key == "userName"){
          user.userName = "";
        } else if (data.key == "uid"){
          user.uid = "";
        } else if (data.key == "giftList"){
          user.giftList = [];
        } else if (data.key == "support"){
          user.support = [];
        } else if (data.key == "invites"){
          user.invites = [];
        } else if (data.key == "friends"){
          user.friends = [];
        } else if (data.key == "shareCode"){
          user.shareCode = "";
        } else {
          console.log("Unknown Key..." + data.key);
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
        console.log(friendArr);
        friendArr.splice(data.key, 1);
        console.log(friendArr);
        removeFriendElement(data.val().uid);
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
        document.getElementById("TestGift").remove();
      } catch (err) {}

      var userUid = friendData.uid;
      var friendName = friendData.name;
      var friendUserName = friendData.userName;
      var friendGiftList = friendData.giftList;
      var liItem = document.createElement("LI");
      liItem.id = "user" + userUid;
      liItem.className = "gift";
      liItem.onclick = function () {
        try {
          if (friendGiftList.length == 0) {
            deployEmptyFriendGiftListNotification(friendUserName);
          } else {
            sessionStorage.setItem("validGiftUser", JSON.stringify(friendData));//Friend's User Data
            sessionStorage.setItem("validUser", JSON.stringify(user));
            window.location.href = "friendList.html";
          }
        } catch (err) {
          console.log(err.toString());
          deployEmptyFriendGiftListNotification(friendUserName);
        }
      };
      var textNode = document.createTextNode(friendName);
      liItem.appendChild(textNode);
      userList.insertBefore(liItem, document.getElementById("userListContainer").childNodes[0]);

      friendCount++;
    }
  }

  function deployEmptyFriendGiftListNotification(userName){
    noteInfoField.innerHTML = userName + " does not currently have any items in their list, " +
      "please check back later!";
    noteTitleField.innerHTML = userName + " Gift List Empty!";
    noteModal.style.display = "block";

    //close on close
    noteSpan.onclick = function() {
      noteModal.style.display = "none";
      clearInterval(j);
    };

    //close on click
    window.onclick = function(event) {
      if (event.target == noteModal) {
        noteModal.style.display = "none";
        clearInterval(j);
      }
    };

    var nowJ = 0;
    var j = setInterval(function(){
      nowJ = nowJ + 1000;
      if(nowJ >= 3000){
        noteModal.style.display = "none";
        clearInterval(j);
      }
    }, 1000);
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
      var userUid = friendData.uid;
      var friendName = friendData.name;
      var friendUserName = friendData.userName;
      var friendGiftList = friendData.giftList;
      var editItem = document.createElement("LI");
      editItem.innerHTML = friendName;
      editItem.className = "gift";
      editItem.onclick = function () {
        try {
          if (friendGiftList.length == 0) {
            deployEmptyFriendGiftListNotification(friendUserName);
          } else {
            sessionStorage.setItem("validGiftUser", JSON.stringify(friendData));//Friend's User Data
            sessionStorage.setItem("validUser", JSON.stringify(user));
            window.location.href = "friendList.html";
          }
        } catch (err) {
          deployEmptyFriendGiftListNotification(friendUserName);
        }
      };
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
    document.getElementById("TestGift").innerHTML = "No Friends Found! Invite Some Friends In The \"Invite\" Tab!";
  } catch(err){
    console.log("Loading Element Missing, Creating A New One");
    var liItem = document.createElement("LI");
    liItem.id = "TestGift";
    liItem.className = "gift";
    var textNode = document.createTextNode("No Friends Found! Invite Some Friends In The \"Invite\" Tab!");
    liItem.appendChild(textNode);
    userList.insertBefore(liItem, document.getElementById("giftListContainer").childNodes[0]);
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
