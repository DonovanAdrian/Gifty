var inviteArr = [];
var friendArr = [];
var listeningFirebaseRefs = [];

var areYouStillThereBool = false;
var invitesFound = false;

var friendCount = 0;
var logoutReminder = 300;
var logoutLimit = 900;

var offline;
var userList;
var userListHTML;
var offlineSpan;
var offlineModal;
var userInviteModal;
var confirmUserModal;
var addUserBtn;
var user;
var newInvite;
var listNote;
var inviteNote;
var userInput;
var offlineTimer;
var userInitial;
var userFriends;
var userInvites;
var noteModal;
var noteInfoField;
var noteTitleField;
var noteSpan;
var modal;


function getCurrentUser(){
  try {
    user = JSON.parse(sessionStorage.validUser);
    console.log("User: " + user.userName + " logged in");
    if (user.invites == undefined) {
      console.log("Invites Not Found");
    } else if (user.invites != undefined) {
      if (user.invites.length > 0) {
        newInvite.style.display = "block";
        inviteNote.style.background = "#ff3923";
        invitesFound = true;
      }
    }
    if (user.friends == undefined) {
      deployFriendListEmptyNotification();
    } else if (user.friends.length == 0) {
      deployFriendListEmptyNotification();
    } else {
      console.log(user.friends);
    }

    if (user.notifications == undefined) {
      console.log("Notifications Not Found");
    } else if (user.notifications != undefined) {
      if (user.notifications.length > 0) {
        notificationBtn.src = "img/bellNotificationOn.png";
        notificationBtn.onclick = function() {
          sessionStorage.setItem("validUser", JSON.stringify(user));
          sessionStorage.setItem("userArr", JSON.stringify(userArr));
          window.location.href = "notifications.html";
        }
      }
    }
    userArr = JSON.parse(sessionStorage.userArr);
  } catch (err) {
    window.location.href = "index.html";
  }
}

window.onload = function instantiate() {

  userList = document.getElementById("userListContainer");
  userListHTML = document.getElementById("userListContainer").innerHTML;
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById("closeOffline");
  userInviteModal = document.getElementById('userModal');
  confirmUserModal = document.getElementById('confirmModal');
  listNote = document.getElementById('listNote');
  inviteNote = document.getElementById('inviteNote');
  newInvite = document.getElementById('newInviteIcon');
  addUserBtn = document.getElementById('addUser');
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
            document.getElementById("TestGift").innerHTML = "No Friends Found! Invite Some Friends With The Button Below!";
          }
        } catch(err){
          if(friendCount == 0) {
            console.log("Loading Element Missing, Creating A New One");
            var liItem = document.createElement("LI");
            liItem.id = "TestGift";
            liItem.className = "gift";
            if (onlineInt == 0) {
              var textNode = document.createTextNode("Loading Failed, Please Connect To Internet");
            } else {
              var textNode = document.createTextNode("No Friends Found! Invite Some Friends With The Button Below!");
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

  newInvite.onclick = function() {
    sessionStorage.setItem("validUser", JSON.stringify(user));
    window.location.href = "confirmation.html";
  };

  addUserBtn.innerHTML = "Invite User";
  generateAddUserBtn();

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

    userInitial = firebase.database().ref("users/");
    userFriends = firebase.database().ref("users/" + user.uid + "/friends");
    userInvites = firebase.database().ref("users/" + user.uid + "/invites");

    var fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        onlineInt = 1;

        var i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() || i != -1){
          //console.log("Adding " + userArr[i].userName + " to most updated version: " + data.val().userName);
          userArr[i] = data.val();
        }

        if(data.key == user.uid){
          user = data.val();
          console.log("User Updated: 1");
        }
      });

      postRef.on('child_changed', function (data) {
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
        var i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() || i != -1){
          console.log("Removing " + userArr[i].userName + " / " + data.val().userName);
          userArr.splice(i, 1);
        }
      });
    };

    var fetchFriends = function (postRef) {
      postRef.on('child_added', function (data) {
        friendArr.push(data.val());
        console.log("Creating " + data.val());
        createFriendElement(data.val());
      });

      postRef.on('child_changed', function (data) {
        friendArr[data.key] = data.val();
        console.log("Changing " + data.val());
        changeFriendElement(data.val());
      });

      postRef.on('child_removed', function (data) {
        location.reload();
      });
    };

    var fetchInvites = function (postRef) {
      postRef.on('child_added', function (data) {
        inviteArr.push(data.val());
      });

      postRef.on('child_changed', function (data) {
        inviteArr[data.key] = data.val();
      });

      postRef.on('child_removed', function (data) {
        inviteArr.splice(data.key, 1);

        if (inviteArr.length == 0) {
          console.log("Invite List Removed");
          newInvite.style.display = "none";
          inviteNote.style.background = "#008222";
        }
      });
    };

    fetchData(userInitial);
    fetchFriends(userFriends);
    fetchInvites(userInvites);

    listeningFirebaseRefs.push(userInitial);
    listeningFirebaseRefs.push(userFriends);
    listeningFirebaseRefs.push(userInvites);
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

  function createFriendElement(friendKey){
    var friendData;
    for (var i = 0; i < userArr.length; i++){
      if(friendKey == userArr[i].uid){
        friendData = userArr[i];
        break;
      }
    }

    if(friendData != null) {
      try{
        document.getElementById("TestGift").remove();
      } catch (err) {}

      var userUid = friendData.uid;
      var friendName = friendData.name;
      var friendUserName = friendData.userName;
      var friendShareCode = friendData.shareCode;
      var liItem = document.createElement("LI");
      liItem.id = "user" + userUid;
      liItem.className = "gift";
      liItem.onclick = function () {
        var span = document.getElementsByClassName("close")[0];
        var friendInviteRemove = document.getElementById('userInviteRemove');
        var friendNameField = document.getElementById('userName');
        var friendUserNameField = document.getElementById('userUName');
        var friendShareCodeField = document.getElementById('userShareCode');

        if (friendShareCode == undefined || friendShareCode == "") {
          friendShareCode = "This User Does Not Have A Share Code";
        }

        friendNameField.innerHTML = friendName;
        friendUserNameField.innerHTML = "User Name: " + friendUserName;
        friendShareCodeField.innerHTML = "Share Code: " + friendShareCode;

        friendInviteRemove.onclick = function () {
          modal.style.display = "none";
          deleteFriend(userUid);
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
      var textNode = document.createTextNode(friendName);
      liItem.appendChild(textNode);

      userList.insertBefore(liItem, document.getElementById("userListContainer").childNodes[0]);

      friendCount++;
    }
  }

  function changeFriendElement(friendKey){
    var friendData;
    for (var i = 0; i < userArr.length; i++){
      if(friendKey == userArr[i].uid){
        friendData = userArr[i];
        break;
      }
    }

    if(friendData != null) {
      var userUid = friendData.uid;
      var friendName = friendData.name;
      var friendUserName = friendData.userName;
      var friendShareCode = friendData.shareCode;
      var liItemUpdate = document.getElementById("user" + userUid);
      liItemUpdate.innerHTML = friendName;
      liItemUpdate.className = "gift";
      liItemUpdate.onclick = function () {
        var span = document.getElementsByClassName("close")[0];
        var friendInviteRemove = document.getElementById('userInviteRemove');
        var friendNameField = document.getElementById('userName');
        var friendUserNameField = document.getElementById('userUName');
        var friendShareCodeField = document.getElementById('userShareCode');

        if (friendShareCode == undefined) {
          friendShareCode = "This User Does Not Have A Share Code";
        }

        friendNameField.innerHTML = friendName;
        friendUserNameField.innerHTML = "User Name: " + friendUserName;
        friendShareCodeField.innerHTML = "Share Code: " + friendShareCode;

        friendInviteRemove.onclick = function () {
          modal.style.display = "none";
          deleteFriend(userUid);
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

  function deleteFriend(uid) {
    //Delete on user's side
    var userFriendArrBackup = friendArr;
    var friendFriendArrBackup = [];
    var verifyDeleteBool = true;
    var toDelete = -1;

    for (var i = 0; i < friendArr.length; i++){
      if(friendArr[i] == uid) {
        toDelete = i;
        break;
      }
    }

    if(toDelete != -1) {
      friendArr.splice(toDelete, 1);

      for (var i = 0; i < friendArr.length; i++) {
        if (friendArr[i] == uid) {
          verifyDeleteBool = false;
          break;
        }
      }
    } else {
      verifyDeleteBool = false;
    }

    if(verifyDeleteBool){
      removeFriendElement(uid);
      user.friends = friendArr;
      generateAddUserBtn(); //Regenerate the button for new friendArr

      firebase.database().ref("users/" + user.uid).update({
        friends: friendArr
      });

      //alert("Friend Successfully removed from your list!");
    } else {
      friendArr = user.friends;
      firebase.database().ref("users/" + user.uid).update({
        friends: userFriendArrBackup
      });
      alert("Delete failed, please try again later! (user)");
      return;
    }



    //Delete on friend's side
    verifyDeleteBool = true;
    toDelete = -1;
    var friendFriendArr;//Weird name, I know, but it's the friend's friend Array...

    for (var i = 0; i < userArr.length; i++){
      if(userArr[i].uid == uid) {
        friendFriendArr = userArr[i].friends;
        friendFriendArrBackup = friendFriendArr;
        break;
      }
    }
    for (var i = 0; i < friendFriendArr.length; i++){
      if (friendFriendArr[i] == user.uid){
        toDelete = i;
        break;
      }
    }

    if(toDelete != -1) {
      friendFriendArr.splice(toDelete, 1);

      for (var i = 0; i < friendFriendArr.length; i++) {
        if (friendFriendArr[i] == user.uid) {
          verifyDeleteBool = false;
          break;
        }
      }
    } else {
      verifyDeleteBool = false;
    }

    if(verifyDeleteBool){
      firebase.database().ref("users/" + uid).update({
        friends: friendFriendArr
      });

      //alert("Friend Successfully removed from their list!");
    } else {
      firebase.database().ref("users/" + uid).update({
        friends: friendFriendArrBackup
      });
      alert("Delete failed, please try again later! (friend)");
    }
  }

  function generateAddUserBtn(){
    var friendUserNameList = [];
    var upperCaseUserArr = [];
    if(user.friends != undefined || user.friends != null) {
      for (var i = 0; i < user.friends.length; i++) {
        for (var a = 0; a < userArr.length; a++) {
          if (userArr[a].uid == user.friends[i]) {
            friendUserNameList.push(userArr[a].userName.toUpperCase());
            break;
          }
        }
      }
    }
    for (var b = 0; b < userArr.length; b++){
      upperCaseUserArr.push(userArr[b].userName.toUpperCase());
    }

    addUserBtn.onclick = function() {
      var addSpan = document.getElementsByClassName("close")[1];
      var addBtn = document.getElementById('addInvite');
      var cancelBtn = document.getElementById('cancelInvite');
      var inviteInfo = document.getElementById('inviteInfo');
      userInput = document.getElementById('userNameInp');


      userInviteModal.style.display = "block";
      addBtn.innerHTML = "Send Invite";

      addBtn.onclick = function() {
        var userLocation = -1;
        for (var i = 0; i < upperCaseUserArr.length; i++) {
          if (upperCaseUserArr[i] == userInput.value.toUpperCase()) {
            userLocation = i;
            break;
          }
        }

        inviteInfo.innerHTML = "";
        if(userInput.value == ""){
          inviteInfo.innerHTML = "User Name Field Empty, Please Try Again!";
        } else if (friendUserNameList.includes(userInput.value.toUpperCase())) {
          inviteInfo.innerHTML = "That User Is Already Your Friend, Please Try Again!";
        } else if (user.userName.toUpperCase() == userInput.value.toUpperCase()){
          inviteInfo.innerHTML = "You Cannot Invite Yourself, Please Try Again!";
        } else if (userLocation != -1) {
          try {
            if (user.invites.includes(userArr[userLocation].uid)) {
              inviteInfo.innerHTML = "This User Already Sent You An Invite, Please Try Again!";
            } else if (userArr[userLocation].invites.includes(user.uid)) {
              inviteInfo.innerHTML = "You Already Sent This User An Invite, Please Try Again!";
            } else {
              generateConfirmDialog(userLocation);
            }
          } catch (err) {
            try {
              if (userArr[userLocation].invites.includes(user.uid)) {
                inviteInfo.innerHTML = "You Already Sent This User An Invite, Please Try Again!";
              } else {
                generateConfirmDialog(userLocation);
              }
            } catch (err) {
              generateConfirmDialog(userLocation);
            }
          }
        } else if (userInput.value.toUpperCase() == "USER NAME BELOW"){
          inviteInfo.innerHTML = "Very Funny, Please Enter A User Name";
        } else if (userInput.value.toUpperCase() == "A USER NAME"){
          inviteInfo.innerHTML = "Listen Here, Please Input Something Serious";
        } else if (userInput.value.toUpperCase() == "SOMETHING SERIOUS"){
          inviteInfo.innerHTML = "You're Just Mocking Me At This Point";
        } else {
          inviteInfo.innerHTML = "That User Name Does Not Exist, Please Try Again!";
        }
      };

      cancelBtn.onclick = function() {
        userInviteModal.style.display = "none";
        userInput.value = "";
        inviteInfo.innerHTML = "";
      };

      addSpan.onclick = function() {
        userInviteModal.style.display = "none";
        userInput.value = "";
        inviteInfo.innerHTML = "";
      };

      window.onclick = function(event) {
        if (event.target == userInviteModal) {
          userInviteModal.style.display = "none";
        }
      }
    };
    console.log("Add Button Generated");
  }

  function generateConfirmDialog(userLocation) {
    var confirmSpan = document.getElementsByClassName("close")[2];
    var inviteConfirm = document.getElementById('inviteConfirm');
    var inviteDeny = document.getElementById('inviteDeny');
    var confUserName = document.getElementById('confUserName');
    var inviteInfo = document.getElementById('inviteInfo');
    userInput = document.getElementById('userNameInp');

    //console.log(userLocation);
    //console.log(userArr[userLocation].userName);
    if (userLocation != -1) {
      confUserName.innerHTML = "Did you mean to add \"" + userArr[userLocation].name + "\"?";
      userInviteModal.style.display = "none";
      confirmUserModal.style.display = "block";

      inviteConfirm.onclick = function () {
        inviteUserDB(userArr[userLocation]);
        confirmUserModal.style.display = "none";
        userInput.value = "";
        inviteInfo.innerHTML = "";
      };

      inviteDeny.onclick = function () {
        confirmUserModal.style.display = "none";
        userInviteModal.style.display = "block";
        userInput.value = "";
        inviteInfo.innerHTML = "";
      };

      //close on close
      confirmSpan.onclick = function () {
        confirmUserModal.style.display = "none";
        userInput.value = "";
        inviteInfo.innerHTML = "";
      };

      //close on click
      window.onclick = function (event) {
        if (event.target == confirmUserModal) {
          confirmUserModal.style.display = "none";
          userInput.value = "";
          inviteInfo.innerHTML = "";
        }
      }
    } else {
      alert("Error finding user, please contact the developer for assistance!");
    }
  }

  function removeFriendElement(uid) {
    document.getElementById("user" + uid).remove();

    friendCount--;
    if(friendCount == 0){
      deployFriendListEmptyNotification();
    }
  }

  function inviteUserDB(invitedUser) {
    var invitedUserInvites;
    if(invitedUser.invites == undefined || invitedUser.invites == null){
      invitedUserInvites = [];
    } else {
      invitedUserInvites = invitedUser.invites;
    }
    invitedUserInvites.push(user.uid);

    //console.log(invitedUser.uid);
    if(invitedUser.invites != undefined) {

      firebase.database().ref("users/" + invitedUser.uid).update({
        invites: invitedUserInvites
      });
    } else {
      //console.log("New Invite List");
      firebase.database().ref("users/" + invitedUser.uid).update({invites:{0:user.uid}});
    }
  }
};

function deployFriendListEmptyNotification(){
  try{
    if (invitesFound) {
      document.getElementById("TestGift").innerHTML = "No Friends Found, But You Have Some Pending Invites!";
    } else {
      document.getElementById("TestGift").innerHTML = "No Friends Found! Invite Some Friends With The Button Below!";
    }
  } catch(err){
    console.log("Loading Element Missing, Creating A New One");
    var liItem = document.createElement("LI");
    liItem.id = "TestGift";
    liItem.className = "gift";
    if (invitesFound) {
      var textNode = document.createTextNode("No Friends Found, But You Have Some Pending Invites!");
    } else {
      var textNode = document.createTextNode("No Friends Found! Invite Some Friends With The Button Below!");
    }
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
    default:
      break;
  }
}
