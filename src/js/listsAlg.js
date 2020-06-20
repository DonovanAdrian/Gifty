var inviteArr = [];
var friendArr = [];
var listeningFirebaseRefs = [];
var userArr = [];

var onlineInt = 0;
var friendCount = 0;

var userList;
var userBase;
var userFriends;
var userInvites;
var giftList;
var offlineSpan;
var offlineModal;
var user;
var listNote;
var inviteNote;
var noteModal;
var noteSpan;
var noteInfoField;
var noteTitleField;



function getCurrentUser(){
  user = sessionStorage.getItem("validUser");
  if(user == null || user == undefined){
    window.location.href = "index.html";
  } else {
    console.log("User: " + user.key + " logged in");
    if(user.friends == undefined){
      deployFriendListEmptyNotification();
    }
    userArr = sessionStorage.getItem("userArr");
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
          giftList.insertBefore(liItem, document.getElementById("giftListContainer").childNodes[0]);
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

  function databaseQuery() {

    userBase = firebase.database().ref("users/" + user.key);
    userFriends = firebase.database().ref("users/" + user.key + "/friends");
    userInvites = firebase.database().ref("users/" + user.key + "/invites");

    var fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        onlineInt = 1;
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
        removeFriendElement(data.key);
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

  function createFriendElement(friendKey){
    try{
      document.getElementById("TestGift").remove();
    } catch (err) {}

    var friendData;
    for (var i = 0; i < userArr.length; i++){
      if(friendKey == userArr[i].key){
        friendData = userArr[i];
        break;
      }
    }

    var userUid = friendData.val().uid;
    var friendName = friendData.val().name;
    var friendUserName = friendData.val().userName;
    var friendGiftList = friendData.val().giftList;
    var liItem = document.createElement("LI");
    liItem.id = "user" + userUid;
    liItem.className = "gift";
    liItem.onclick = function () {
      try {
        if (friendGiftList.length == 0) {
          deployEmptyFriendGiftListNotification(friendUserName);
        } else {
          sessionStorage.setItem("validGiftUser", userRef);//Friend's User Data
          sessionStorage.setItem("validUser", user);
          window.location.href = "friendList.html";
        }
      } catch (err) {
        deployEmptyFriendGiftListNotification(friendUserName);
      }
    };
    var textNode = document.createTextNode(friendName);
    liItem.appendChild(textNode);
    userList.insertBefore(liItem, document.getElementById("userListContainer").childNodes[0]);

    friendCount++;
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
      if(friendKey == userArr[i].key){
        friendData = userArr[i];
        break;
      }
    }

    var userUid = friendData.val().uid;
    var friendName = friendData.val().name;
    var friendUserName = friendData.val().userName;
    var friendGiftList = friendData.val().giftList;
    var editItem = document.createElement("LI");
    editItem.innerHTML = friendName;
    editItem.className = "gift";
    editItem.onclick = function () {
      try {
        if (friendGiftList.length == 0) {
          deployEmptyFriendGiftListNotification(friendUserName);
        } else {
          sessionStorage.setItem("validGiftUser", userRef);//Friend's User Data
          sessionStorage.setItem("validUser", user);
          window.location.href = "friendList.html";
        }
      } catch (err) {
        deployEmptyFriendGiftListNotification(friendUserName);
      }
    };
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
    giftList.insertBefore(liItem, document.getElementById("giftListContainer").childNodes[0]);
  }

  clearInterval(offlineTimer);
}

function signOut(){
  sessionStorage.clear();
  window.location.href = "index.html";
}

function navigation(nav){
  sessionStorage.setItem("validUser", user);
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
