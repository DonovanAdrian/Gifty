var inviteArr = [];
var updatedInviteArr = [];
var friendArr = [];
var updatedFriendArr = [];
var listeningFirebaseRefs = [];
var userArr = [];

var onlineInt = 0;
var updatedArrMode = 0;
var friendCounter = 0;

var userList;
var userBase;
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

    var fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        onlineInt = 1;
        //--------------------------------------------------------------------------------Fetch Friends
        if(data.key == "friends") {
          friendArr = data.val();

          if (friendArr.length == 0) {//Friend List exists, but is empty
            deployFriendListEmptyNotification();
          } else {//Friend List exists and needs to be loaded into list
            for (var i = 0; i < friendArr.length; i++) {
              createFriendElement(friendArr[i]);
            }
            console.log("Friend List Loaded");
          }
        }
        //--------------------------------------------------------------------------------Fetch Invites
        if(data.key == "invites") {
          inviteArr = data.val();

          if(inviteArr.length != 0) {//inviteList exists
            inviteNote.style.background = "#ff3923";
            console.log("Invites found");
          }
        }
      });

      postRef.on('child_changed', function (data) {
        var updatedNode;
        var updateError = 0;
        if(data.key == "friends") {
          updatedFriendArr = data.val();
          updatedNode = arrayDifferences(friendArr, updatedFriendArr);

          if (updatedArrMode == 1) {//delete
            removeFriendElement(friendArr[updatedNode]);
            friendArr.splice(updatedNode, 1);
            if(friendArr.length == 0){
              console.log("Friend List Empty");
              deployFriendListEmptyNotification();
            }
          } else if (updatedArrMode == 2) {//update
            friendArr[updatedNode] = updatedFriendArr[updatedNode];
            changeFriendElement(friendArr[updatedNode]);
          } else {
            console.log("Friend Update Error");
            updateError++;
          }
          updatedArrMode = 0;

          if (updateError == 0)
            console.log("Data Updated Successfully");
          else
            console.log("Data Not Updated... Please Advise");
        }

        if(data.key == "invites") {
          var updateError = 0;
          updatedInviteArr = data.val();
          updatedNode = arrayDifferences(inviteArr, updatedInviteArr);

          if(updatedArrMode == 1){
            inviteArr.splice(updatedNode, 1);
            if(inviteArr.length == 0){
              console.log("Invite List Empty");
              inviteNote.style.background = "#008222";
            }
          } else if (updatedArrMode == 2){
            inviteArr[updatedNode] = updatedInviteArr[updatedNode];
          } else {
            console.log("Invite Update Error");
            updateError++;
          }
          updatedArrMode = 0;

          if (updateError == 0)
            console.log("Data Updated Successfully");
          else
            console.log("Data Not Updated... Please Advise");
        }
      });

      postRef.on('child_removed', function (data) {
        if(data.key == "friends") {
          deployFriendListEmptyNotification();
        }

        if (data.key == "invites") {
          console.log("Invite List Removed");
          if (inviteArr.length == 0) {
            inviteNote.style.background = "#008222";
          }
        }
      });
    };

    fetchData(userBase);

    listeningFirebaseRefs.push(userBase);
  }

  function arrayDifferences(arr1, arr2) {
    var tempArr = arr1;
    if (arr1.length != arr2.length) {//item was removed
      updatedArrMode = 1;
    } else {//item was updated
      updatedArrMode = 2;
    }
    for (var a = 0; a < arr1.length; a++) {
      for (var b = 0; b < arr2.length; b++) {
        if(arr1[a] == arr2[b]){
          console.log(arr1);
          console.log("Removing: " + arr1[a]);
          arr1.splice(a, 1);
          console.log(arr1);
          a--;//adjust "a" value to account for new arr1 size
          break;
        }
      }
    }

    return tempArr.indexOf(arr1[0]);
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

    friendCounter++;
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
    var friendUserName = friendData.val().userName;
    var friendGiftList = friendData.val().giftList;
    var editItem = document.createElement("LI");
    editItem.id = "user" + userUid;
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
    console.log("Removing " + uid + " from local list...");
    document.getElementById("gift" + uid).remove();

    friendCounter--;
    if(friendCounter == 0) {
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
