var userArr = [];
var inviteArr = [];
var listeningFirebaseRefs = [];

var areYouStillThereBool = false;

var notificationCount = 0;
var onlineInt = 0;
var logoutReminder = 300;
var logoutLimit = 900;

var offline;
var userList;
var offlineSpan;
var offlineModal;
var user;
var userNotifications;
var userInvites;
var modal;
var listNote;
var inviteNote;
var offlineTimer;
var noteModal;
var noteInfoField;
var noteTitleField;
var noteSpan;

function getCurrentUser(){
  try {
    user = JSON.parse(sessionStorage.validUser);
    console.log("User: " + user.userName + " logged in");
    if (user.invites == undefined) {
      console.log("Invites Not Found");
    } else if (user.invites != undefined) {
      if (user.invites.length > 0) {
        inviteNote.style.background = "#ff3923";
      }
    }

    if(user.notifications == undefined) {
      console.log("Notifications Not Found");
      deployNotificationListEmptyNotification();
    }
    userArr = JSON.parse(sessionStorage.userArr);
  } catch (err) {
    console.log(err.toString());
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
            document.getElementById("TestGift").innerHTML = "No Notifications Found!";
          }
        } catch(err){
          if(notificationCount == 0) {
            console.log("Loading Element Missing, Creating A New One");
            var liItem = document.createElement("LI");
            liItem.id = "TestGift";
            liItem.className = "gift";
            if (onlineInt == 0) {
              var textNode = document.createTextNode("Loading Failed, Please Connect To Internet");
            } else {
              var textNode = document.createTextNode("No Notifications Found!");
            }
            liItem.appendChild(textNode);
            userList.insertBefore(liItem, document.getElementById("userListContainer").childNodes[0]);
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

    userNotifications = firebase.database().ref("users/" + user.uid + "/notifications");
    userInvites = firebase.database().ref("users/" + user.uid + "/invites");

    var fetchNotifications = function (postRef) {
      postRef.on('child_added', function (data) {
        createNotificationElement(data.val(), data.key);
      });

      postRef.on('child_changed', function (data) {
        changeNotificationElement(data.val(), data.key);
      });

      postRef.on('child_removed', function (data) {
        location.reload();
      });
    };

    var fetchInvites = function (postRef) {
      postRef.on('child_added', function (data) {
        inviteArr.push(data.val());

        inviteNote.style.background = "#ff3923";
      });

      postRef.on('child_changed', function (data) {
        inviteArr[data.key] = data.val();
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

    fetchNotifications(userNotifications);
    fetchInvites(userInvites);

    listeningFirebaseRefs.push(userNotifications);
    listeningFirebaseRefs.push(userInvites);
  }

  function createNotificationElement(notificationString){
    var notificationSplit = notificationString.split(",");
    if (notificationSplit.length == 2){
      //invite
      //0, invitedName
      //1, pageName
      var invitedName = notificationSplit[0];
      var pageName = notificationSplit[1];
      console.log(invitedName + " " + pageName);
    } else if (notificationSplit.length == 3){
      //gift update
      //0, giftOwner
      //1, giftTitle
      //2, pageName (friendList, privateFriendList)
      var giftOwner = notificationSplit[0];
      var giftTitle = notificationSplit[1];
      var pageName = notificationSplit[2];
      console.log(giftOwner + " " + giftTitle + " " + pageName);
    }

    /*
    try{
      document.getElementById("TestGift").remove();
    } catch (err) {}

    var inviteData;
    for (var i = 0; i < userArr.length; i++){
      if(inviteKey == userArr[i].uid){
        inviteData = userArr[i];
        break;
      }
    }

    var userUid = inviteData.uid;
    var inviteName = inviteData.name;
    var inviteUserName = inviteData.userName;
    var inviteShareCode = inviteData.shareCode;
    var liItem = document.createElement("LI");
    liItem.id = "user" + userUid;
    liItem.className = "gift";
    liItem.onclick = function (){
      var span = document.getElementsByClassName("close")[0];
      var inviteDelete = document.getElementById('userDelete');
      var inviteNameField = document.getElementById('userName');
      var inviteUserNameField = document.getElementById('userUName');
      var inviteShareCodeField = document.getElementById('userShareCode');

      if(inviteShareCode == undefined) {
        inviteShareCode = "This User Does Not Have A Share Code";
      }

      inviteNameField.innerHTML = inviteName;
      inviteUserNameField.innerHTML = "User Name: " + inviteUserName;
      inviteShareCodeField.innerHTML = "Share Code: " + inviteShareCode;

      inviteDelete.onclick = function(){
        deleteInvite(userUid);
        modal.style.display = "none";
      };

      //show modal
      modal.style.display = "block";

      //close on close
      span.onclick = function() {
        modal.style.display = "none";
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }
    };
    var textNode = document.createTextNode(inviteName);
    liItem.appendChild(textNode);

    userList.insertBefore(liItem, document.getElementById("userListContainer").childNodes[0]);
    */

    notificationCount++;
  }

  function changeNotificationElement(notificationString){
    var notificationSplit = notificationString.split(",");
    if (notificationSplit.length == 2){
      //invite
      //0, invitedName
      //1, pageName
      var invitedName = notificationSplit[0];
      var pageName = notificationSplit[1];
    } else if (notificationSplit.length == 3){
      //gift update
      //0, giftOwner
      //1, giftTitle
      //2, pageName (friendList, privateFriendList)
      var giftOwner = notificationSplit[0];
      var giftTitle = notificationSplit[1];
      var pageName = notificationSplit[2];
    }

    /*
    var inviteData;
    for (var i = 0; i < userArr.length; i++){
      if(inviteKey == userArr[i].uid){
        inviteData = userArr[i];
        break;
      }
    }

    var userUid = inviteData.uid;
    var inviteName = inviteData.name;
    var inviteUserName = inviteData.userName;
    var inviteShareCode = inviteData.shareCode;
    var liItemUpdate = document.getElementById("user" + inviteData.uid);
    liItemUpdate.innerHTML = inviteName;
    liItemUpdate.className = "gift";
    liItemUpdate.onclick = function (){
      var span = document.getElementsByClassName("close")[0];
      var inviteDelete = document.getElementById('userDelete');
      var inviteNameField = document.getElementById('userName');
      var inviteUserNameField = document.getElementById('userUName');
      var inviteShareCodeField = document.getElementById('userShareCode');

      if(inviteShareCode == undefined) {
        inviteShareCode = "This User Does Not Have A Share Code";
      }

      inviteNameField.innerHTML = inviteName;
      inviteUserNameField.innerHTML = "User Name: " + inviteUserName;
      inviteShareCodeField.innerHTML = "Share Code: " + inviteShareCode;

      inviteDelete.onclick = function(){
        deleteInvite(userUid);
      };

      //show modal
      modal.style.display = "block";

      //close on close
      span.onclick = function() {
        modal.style.display = "none";
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }
    };
    */
  }

  function deleteInvite(uid) {
    var verifyDeleteBool = true;
    var toDelete = -1;

    console.log("Deleting " + uid);
    for (var i = 0; i < inviteArr.length; i++){
      if(inviteArr[i] == uid) {
        toDelete = i;
        break;
      }
    }

    if(toDelete != -1) {
      inviteArr.splice(toDelete, 1);

      for (var i = 0; i < inviteArr.length; i++) {
        if (inviteArr[i] == uid) {
          verifyDeleteBool = false;
          break;
        }
      }
    } else {
      verifyDeleteBool = false;
    }

    if(verifyDeleteBool){
      user.invites = inviteArr;
      firebase.database().ref("users/" + user.uid).update({
        invites: inviteArr
      });
    }
  }
};

function deployNotificationListEmptyNotification(){
  try{
    document.getElementById("TestGift").innerHTML = "No Notifications Found!";
  } catch(err){
    console.log("Loading Element Missing, Creating A New One");
    var liItem = document.createElement("LI");
    liItem.id = "TestGift";
    liItem.className = "gift";
    var textNode = document.createTextNode("No Notifications Found!");
    liItem.appendChild(textNode);
    userList.insertBefore(liItem, document.getElementById("userListContainer").childNodes[0]);
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
    case 4:
      window.location.href = "confirmation.html";
      break;
    default:
      break;
  }
}
