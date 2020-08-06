var userArr = [];
var inviteArr = [];
var notificationArr = [];
var listeningFirebaseRefs = [];

var areYouStillThereBool = false;

var notificationCount = 0;
var onlineInt = 0;
var logoutReminder = 300;
var logoutLimit = 900;

var offline;
var notificationList;
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

    console.log(user.notifications);
    if(user.notifications == undefined) {
      console.log("Notifications Not Found");
      deployNotificationListEmptyNotification();
    } else {
      var notificationOverride = sessionStorage.getItem("notificationOverride");
      if (notificationOverride == undefined) {
        console.log("Notifications Found");
      } else {
        if (notificationOverride == "notificationArrEmpty") {
          console.log("Notifications Empty");
          deployNotificationListEmptyNotification();
        } else {
          console.log("Notifications Found");
        }
      }
    }
    userArr = JSON.parse(sessionStorage.userArr);
  } catch (err) {
    console.log(err.toString());
    window.location.href = "index.html";
  }
}

window.onload = function instantiate() {

  notificationList = document.getElementById("notificationListContainer");
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
            notificationList.insertBefore(liItem, document.getElementById("notificationListContainer").childNodes[0]);
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
        notificationArr.push(data.val());
        createNotificationElement(data.val(), data.key);
      });

      postRef.on('child_changed', function (data) {
        notificationArr[data.key] = data.val();
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

  function createNotificationElement(notificationString, notificationKey){
    try{
      document.getElementById("TestGift").remove();
    } catch (err) {}

    var friendUserData;
    var notificationTitle;
    var notificationDetails;
    var notificationPage;
    var notificationSplit = notificationString.split(",");
    if (notificationSplit.length == 2){
      var invitedName = notificationSplit[0];
      var pageName = notificationSplit[1];
      console.log(invitedName + " " + pageName);

      notificationTitle = "You received an invite!";
      notificationDetails = invitedName + " has sent you an invite!";
      notificationPage = pageName;
    } else if (notificationSplit.length == 3){
      var giftOwner = notificationSplit[0];
      var giftTitle = notificationSplit[1];
      var pageName = notificationSplit[2];
      //console.log(giftOwner + " " + giftTitle + " " + pageName);

      friendUserData = findFriendUserData(giftOwner);
      notificationPage = pageName;

      if (pageName == "friendList.html"){
        if(friendUserData != -1)
          notificationTitle = friendUserData.name + " updated a gift you bought!";
        else
          notificationTitle = "A gift you bought was updated!";
        notificationDetails = "The gift, " + giftTitle + ", was updated!";
      } else if (pageName == "privateFriendList.html") {
        if(friendUserData != -1)
          notificationTitle = friendUserData.name + "\'s private gift that you bought was updated!";
        else
          notificationTitle = "A private gift that you bought was updated!";
        notificationDetails = "The gift, " + giftTitle + ", was updated!";
      } else if (pageName == "deleteGift") {
        if(friendUserData != -1)
          notificationTitle = friendUserData.name + " deleted a gift you bought!";
        else
          notificationTitle = "A gift you bought was deleted!";
        notificationDetails = "The gift, " + giftTitle + ", was deleted...";
      } else {
        console.log("Notification Page Error, 1");
      }
    } else if (notificationSplit.length == 4){
      var giftOwner = notificationSplit[0];
      var giftDeleter = notificationSplit[1];
      var giftTitle = notificationSplit[2];
      var pageName = notificationSplit[3];

      friendUserData = findFriendUserData(giftOwner);

      notificationPage = pageName;

      if(friendUserData != -1)
        notificationTitle = friendUserData.name + "\'s private gift that you bought was deleted!";
      else
        notificationTitle = giftDeleter + " deleted a gift that you bought!";
      notificationDetails = "The gift, " + giftTitle + ", was deleted by " + giftDeleter + "...";
    } else {
      console.log("Unknown Notification String Received...");
    }

    var liItem = document.createElement("LI");
    liItem.id = "notification" + notificationKey;
    liItem.className = "gift";
    liItem.onclick = function (){
      var span = document.getElementsByClassName("close")[0];
      var notificationTitleField = document.getElementById('userNotificationTitle');
      var notificationDetailsField = document.getElementById('notificationDetails');
      var notificationPageField = document.getElementById('notificationPage');
      var notificationDelete = document.getElementById('notificationDelete');

      notificationTitleField.innerHTML = notificationTitle;
      notificationDetailsField.innerHTML = notificationDetails;

      if (notificationPage == "invites.html"){
        notificationPageField.innerHTML = "Click here to access your invites!";
        notificationPageField.onclick = function(){
          sessionStorage.setItem("validUser", JSON.stringify(user));
          window.location.href = "confirmation.html";
        };
      } else if (notificationPage == "friendList.html" && friendUserData != -1) {
        notificationPageField.innerHTML = "Click here to access their friend list!";
        notificationPageField.onclick = function(){
          sessionStorage.setItem("userArr", JSON.stringify(userArr));
          sessionStorage.setItem("validGiftUser", JSON.stringify(friendUserData));//Friend's User Data
          sessionStorage.setItem("validUser", JSON.stringify(user));
          window.location.href = "friendList.html";
        };
      } else if (notificationPage == "privateFriendList.html" && friendUserData != -1) {
        notificationPageField.innerHTML = "Click here to access their private friend list!";
        notificationPageField.onclick = function(){
          sessionStorage.setItem("userArr", JSON.stringify(userArr));
          sessionStorage.setItem("validGiftUser", JSON.stringify(friendUserData));//Friend's User Data
          sessionStorage.setItem("validUser", JSON.stringify(user));
          window.location.href = "privateFriendList.html";
        };
      } else if (notificationPage == "deleteGift") {
        notificationPageField.innerHTML = "If this has been done in error, please contact the gift owner.";
        notificationPageField.onclick = function(){};
      } else if (notificationPage == "deleteGiftPrivate") {
        notificationPageField.innerHTML = "If this has been done in error, please contact the person who deleted " +
          "the gift.";
        notificationPageField.onclick = function(){};
      } else {
        console.log("Notification Page Error, 2");
        notificationPageField.innerHTML = "There was an error loading this link, contact an administrator.";
        notificationPageField.onclick = function(){};
      }

      notificationDelete.onclick = function(){
        deleteNotification(notificationKey);
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
    var textNode = document.createTextNode(notificationTitle);
    liItem.appendChild(textNode);

    notificationList.insertBefore(liItem, document.getElementById("notificationListContainer").childNodes[0]);

    notificationCount++;
  }

  function changeNotificationElement(notificationString, notificationKey){
    try{
      document.getElementById("TestGift").remove();
    } catch (err) {}

    var friendUserData;
    var notificationTitle;
    var notificationDetails;
    var notificationPage;
    var notificationSplit = notificationString.split(",");
    if (notificationSplit.length == 2){
      var invitedName = notificationSplit[0];
      var pageName = notificationSplit[1];
      console.log(invitedName + " " + pageName);

      notificationTitle = "You received an invite!";
      notificationDetails = invitedName + " has sent you an invite!";
      notificationPage = pageName;
    } else if (notificationSplit.length == 3){
      var giftOwner = notificationSplit[0];
      var giftTitle = notificationSplit[1];
      var pageName = notificationSplit[2];
      console.log(giftOwner + " " + giftTitle + " " + pageName);

      friendUserData = findFriendUserData(giftOwner);
      notificationPage = pageName;

      if (pageName == "friendList.html"){
        if(friendUserData != -1)
          notificationTitle = friendUserData.name + " updated a gift you bought!";
        else
          notificationTitle = "A gift you bought was updated!";
        notificationDetails = "The gift, " + giftTitle + ", was updated!";
      } else if (pageName == "privateFriendList.html") {
        if(friendUserData != -1)
          notificationTitle = friendUserData.name + "\'s private gift that you bought was updated!";
        else
          notificationTitle = "A private gift that you bought was updated!";
        notificationDetails = "The gift, " + giftTitle + ", was updated!";
      } else if (pageName == "deleteGift") {
        if(friendUserData != -1)
          notificationTitle = friendUserData.name + " deleted a gift you bought!";
        else
          notificationTitle = "A gift you bought was deleted!";
        notificationDetails = "The gift, " + giftTitle + ", was deleted...";
      } else {
        console.log("Notification Page Error, 1");
      }
    } else if (notificationSplit.length == 4){
      var giftOwner = notificationSplit[0];
      var giftDeleter = notificationSplit[1];
      var giftTitle = notificationSplit[2];
      var pageName = notificationSplit[3];

      friendUserData = findFriendUserData(giftOwner);

      notificationPage = pageName;

      if(friendUserData != -1)
        notificationTitle = friendUserData.name + "\'s private gift that you bought was deleted!";
      else
        notificationTitle = giftDeleter + " deleted a gift that you bought!";
      notificationDetails = "The gift, " + giftTitle + ", was deleted by " + giftDeleter + "...";
    } else {
      console.log("Unknown Notification String Received...");
    }

    var liItemUpdate = document.getElementById("notification" + notificationKey);
    if (liItemUpdate == undefined) {
      liItemUpdate.innerHTML = notificationTitle;
      liItemUpdate.className = "gift";
      liItemUpdate.onclick = function () {
        var span = document.getElementsByClassName("close")[0];
        var notificationTitleField = document.getElementById('userNotificationTitle');
        var notificationDetailsField = document.getElementById('notificationDetails');
        var notificationPageField = document.getElementById('notificationPage');
        var notificationDelete = document.getElementById('notificationDelete');

        notificationTitleField.innerHTML = notificationTitle;
        notificationDetailsField.innerHTML = notificationDetails;

        if (notificationPage == "invites.html") {
          notificationPageField.innerHTML = "Click here to access your invites!";
          notificationPageField.onclick = function () {
            sessionStorage.setItem("validUser", JSON.stringify(user));
            window.location.href = "confirmation.html";
          };
        } else if (notificationPage == "friendList.html" && friendUserData != -1) {
          notificationPageField.innerHTML = "Click here to access their friend list!";
          notificationPageField.onclick = function () {
            sessionStorage.setItem("userArr", JSON.stringify(userArr));
            sessionStorage.setItem("validGiftUser", JSON.stringify(friendUserData));//Friend's User Data
            sessionStorage.setItem("validUser", JSON.stringify(user));
            window.location.href = "friendList.html";
          };
        } else if (notificationPage == "privateFriendList.html" && friendUserData != -1) {
          notificationPageField.innerHTML = "Click here to access their private friend list!";
          notificationPageField.onclick = function () {
            sessionStorage.setItem("userArr", JSON.stringify(userArr));
            sessionStorage.setItem("validGiftUser", JSON.stringify(friendUserData));//Friend's User Data
            sessionStorage.setItem("validUser", JSON.stringify(user));
            window.location.href = "privateFriendList.html";
          };
        } else if (notificationPage == "deleteGift") {
          notificationPageField.innerHTML = "If this has been done in error, please contact the gift owner.";
          notificationPageField.onclick = function () {
          };
        } else if (notificationPage == "deleteGiftPrivate") {
          notificationPageField.innerHTML = "If this has been done in error, please contact the person who deleted " +
            "the gift.";
          notificationPageField.onclick = function () {
          };
        } else {
          console.log("Notification Page Error, 2");
          notificationPageField.innerHTML = "There was an error loading this link, contact an administrator.";
          notificationPageField.onclick = function () {
          };
        }

        notificationDelete.onclick = function () {
          deleteNotification(notificationKey);
          modal.style.display = "none";
        };

        //show modal
        modal.style.display = "block";

        //close on close
        span.onclick = function () {
          modal.style.display = "none";
        };

        //close on click
        window.onclick = function (event) {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        }
      };
    }
  }

  function findFriendUserData(giftOwnerUID) {
    var i = findUIDItemInArr(giftOwnerUID, userArr);
    //console.log(i + " " + userArr[i].name);
    if (i != -1){
      return userArr[i];
    }
    return i;
  }

  function findUIDItemInArr(item, userArray){
    for(var i = 0; i < userArray.length; i++){
      if(userArray[i].uid == item){
        //console.log("Found item: " + item);
        return i;
      }
    }
    return -1;
  }

  function deleteNotification(uid) {
    removeNotificationElement(uid);
    console.log("Deleting " + uid);
    notificationArr.splice(uid, 1);

    if (notificationArr.length == 0) {
      sessionStorage.setItem("notificationOverride", "notificationArrEmpty");
    }

    user.notifications = notificationArr;

    sessionStorage.setItem("validUser", JSON.stringify(user));

    firebase.database().ref("users/" + user.uid).update({
      notifications: notificationArr
    });
  }

  function removeNotificationElement(uid) {
    document.getElementById("notification" + uid).remove();

    notificationCount--;
    if (notificationCount == 0){
      deployNotificationListEmptyNotification();
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
    notificationList.insertBefore(liItem, document.getElementById("notificationListContainer").childNodes[0]);
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
