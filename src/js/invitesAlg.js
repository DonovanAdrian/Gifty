var friendKeyArr = [];
var inviteArr = [];
var listeningFirebaseRefs = [];
var userData = [];

var friendCount = 0;

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
  userListHTML = document.getElementById("userListContainer").innerHTML;
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById("closeOffline");
  userInviteModal = document.getElementById('userModal');
  confirmUserModal = document.getElementById('confirmModal');
  listNote = document.getElementById('listNote');
  inviteNote = document.getElementById('inviteNote');
  newInvite = document.getElementById('newInviteIcon');
  addUserBtn = document.getElementById('addUser');
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

  newInvite.onclick = function() {
    sessionStorage.setItem("validUser", user);
    window.location.href = "confirmation.html";
  };

  addUserBtn.innerHTML = "Invite User";
  generateAddUserBtn();

  databaseQuery();

  cleanArrays();

  function databaseQuery() {

    userInitial = firebase.database().ref("users/");
    userFriends = firebase.database().ref("users/" + user.key + "/friends");
    userInvites = firebase.database().ref("users/" + user.key + "/invites");

    var fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        onlineInt = 1;

        var i = findItemInArr(data, userArr);
        if(userArr[i] != data){
          console.log("Adding " + userArr[i].userName + " to most updated version: " + data.val().userName);
          console.log(userArr[i]);
          console.log(data.val());
          userArr[i] = data;
          console.log(userArr[i]);
        }
      });

      postRef.on('child_changed', function (data) {
        var i = findItemInArr(data, userArr);
        if(userArr[i] != data){
          console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
          console.log(userArr[i]);
          console.log(data.val());
          userArr[i] = data;
          console.log(userArr[i]);
        }
      });

      postRef.on('child_removed', function (data) {
        var i = findItemInArr(data, userArr);
        if(userArr[i] != data){
          console.log("Removing " + userArr[i].userName + " / " + data.val().userName);
          console.log(userArr[i]);
          console.log(data.val());
          userArr.splice(i, 1);
          console.log(userArr);
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
        removeFriendElement(data.key);
      });
    };

    var fetchInvites = function (postRef) {
      postRef.on('child_added', function (data) {
        inviteArr.push(data.val());

        newInvite.style.display = "block";
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

  function cleanArrays(){
    if (friendArr != undefined) {
      console.log(friendArr);
      deleteUndefinedObjects(friendArr, undefined, "friends");
      console.log(friendArr);
      /*
      firebase.database().ref("users/" + user.key).update({
        friends: friendArr
      });
      */
    }

    if (inviteArr != undefined) {
      console.log(inviteArr);
      deleteUndefinedObjects(inviteArr, undefined, "invites");
      console.log(inviteArr);
      /*
      firebase.database().ref("users/" + user.key).update({
        invites: inviteArr
      });
      */
    }

    if (cleanedItems != "") {
      console.log(cleanedItems);
    }
    cleanedItems = "";
  }

  function deleteUndefinedObjects(array, toDelete, itemType){
    var cleanedInt = 0;

    try {
      for(var i = 0; i < giftList.length; i++){
        if(giftList[i] == undefined){
          giftList.splice(i, 1);
          i--; //adjust i for spliced object
          cleanedInt++;
        }
      }
    } catch (err) {
      cleanedItems =+ "Error cleaning " + itemType + "! ";
    }

    if (cleanedInt > 0){
      cleanedItems =+ "Cleaned " + cleanedInt + " undefined " + itemType + " objects! ";
    }
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
    var friendShareCode = friendData.val().shareCode;
    var liItem = document.createElement("LI");
    liItem.id = "user" + userUid;
    liItem.className = "gift";
    liItem.onclick = function (){
      var span = document.getElementsByClassName("close")[0];
      var modal = document.getElementById('myModal');
      var friendInviteRemove = document.getElementById('userInviteRemove');
      var friendNameField = document.getElementById('userName');
      var friendUserNameField = document.getElementById('userUName');
      var friendShareCodeField = document.getElementById('userShareCode');

      if(friendShareCode == undefined) {
        friendShareCode = "This User Does Not Have A Share Code";
      }

      friendNameField.innerHTML = friendName;
      friendUserNameField.innerHTML = "User Name: " + friendUserName;
      friendShareCodeField.innerHTML = "Share Code: " + friendShareCode;

      friendInviteRemove.onclick = function(){
        modal.style.display = "none";
        deleteFriend(userUid);
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
    var textNode = document.createTextNode(friendName);
    liItem.appendChild(textNode);

    userList.insertBefore(liItem, document.getElementById("userListContainer").childNodes[0]);

    friendCount++;
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
    var friendShareCode = friendData.val().shareCode;
    var liItemUpdate = document.getElementById("user" + friendData.key);
    liItemUpdate.innerHTML = friendName;
    liItemUpdate.className = "gift";
    liItemUpdate.onclick = function (){
      var span = document.getElementsByClassName("close")[0];
      modal = document.getElementById('myModal');
      var friendInviteRemove = document.getElementById('userInviteRemove');
      var friendNameField = document.getElementById('userName');
      var friendUserNameField = document.getElementById('userUName');
      var friendShareCodeField = document.getElementById('userShareCode');

      if(friendShareCode == undefined) {
        friendShareCode = "This User Does Not Have A Share Code";
      }

      friendNameField.innerHTML = friendName;
      friendUserNameField.innerHTML = "User Name: " + friendUserName;
      friendShareCodeField.innerHTML = "Share Code: " + friendShareCode;

      friendInviteRemove.onclick = function(){
        modal.style.display = "none";
        deleteFriend(userUid);
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
  }

  function deleteFriend(uid) {
    //Delete on user's side
    var verifyDeleteBool = true;
    var toDelete = -1;

    for (var i = 0; i < friendArr.length; i++){
      if(friendArr[i] == uid) {
        toDelete = i;
        break;
      }
    }

    if(toDelete != -1) {
      console.log(friendArr);
      friendArr.splice(toDelete, 1);
      console.log(friendArr);

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
      /*
      firebase.database().ref("users/" + user.key).update({
        friends: friendArr
      });
      */

      modal.style.display = "none";

      removeFriendElement(uid);//this should only need to be here until the firebase command is uncommented
      alert("Friend Successfully removed from your list!");
    } else {
      alert("Delete failed, please try again later! (user)");
      return;
    }



    //Delete on friend's side
    verifyDeleteBool = true;
    toDelete = -1;
    var friendFriendArr;//Weird name, I know, but it's the friend's friend Array...

    for (var i = 0; i < userArr.length; i++){
      if(userArr[i].key == uid) {
        friendFriendArr = userArr[i].friends;
        break;
      }
    }
    for (var i = 0; i < friendFriendArr.length; i++){
      if (friendFriendArr[i] == user.key){
        toDelete = i;
        break;
      }
    }

    if(toDelete != -1) {
      console.log(friendFriendArr);
      friendFriendArr.splice(toDelete, 1);
      console.log(friendFriendArr);

      for (var i = 0; i < friendFriendArr.length; i++) {
        if (friendFriendArr[i] == user.key) {
          verifyDeleteBool = false;
          break;
        }
      }
    } else {
      verifyDeleteBool = false;
    }

    if(verifyDeleteBool){
      /*
      firebase.database().ref("users/" + uid.key).update({
        friends: friendFriendArr
      });
      */

      modal.style.display = "none";

      alert("Friend Successfully removed from their list!");
    } else {
      alert("Delete failed, please try again later! (friend)");
    }
  }

  function generateAddUserBtn(){
    addUserBtn.onclick = function() {
      var addSpan = document.getElementsByClassName("close")[1];
      var addBtn = document.getElementById('addInvite');
      var cancelBtn = document.getElementById('cancelInvite');
      var inviteInfo = document.getElementById('inviteInfo');
      userInput = document.getElementById('userNameInp');

      userInviteModal.style.display = "block";
      addBtn.innerHTML = "Send Invite"

      addBtn.onclick = function() {
        var userLocation = -1;
        var tempUserName = "";
        for (var i = 0; i < userArr; i++) {
          tempUserName = userArr[i].val().userName.toUpperCase();
          console.log(tempUserName);
          if (tempUserName == userInput.value.toUpperCase()) {
            userLocation = i;
            break;
          }
        }

        inviteInfo.innerHTML = "";
        if(userInput.value == ""){
          inviteInfo.innerHTML = "User Name Field Empty, Please Try Again!";
        } else if (user.val().friends.includes(userInput.value.toUpperCase())) {
          inviteInfo.innerHTML = "That User Is Already Your Friend, Please Try Again!";
        } else if (user.val().userName.toUpperCase() == userInput.value.toUpperCase()){
          inviteInfo.innerHTML = "You Cannot Invite Yourself, Please Try Again!";
        } else if (userLocation != -1) {
          try {
            if (user.val().invites.includes(userArr[userLocation].key)) {
              inviteInfo.innerHTML = "This User Already Sent You An Invite, Please Try Again!";
            } else if (userArr[userLocation].invites.includes(user.key)) {
              inviteInfo.innerHTML = "You Already Sent This User An Invite, Please Try Again!";
            } else {
              generateConfirmDialog();
            }
          } catch (err) {
            generateConfirmDialog();
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
      };

      //close on close
      addSpan.onclick = function() {
        userInviteModal.style.display = "none";
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == userInviteModal) {
          userInviteModal.style.display = "none";
        }
      }
    };
  }

  function generateConfirmDialog() {
    var confirmSpan = document.getElementsByClassName("close")[2];
    var inviteConfirm = document.getElementById('inviteConfirm');
    var inviteDeny = document.getElementById('inviteDeny');
    var confUserName = document.getElementById('confUserName');
    var userLocation = -1;
    var tempUserName = "";

    for (var i = 0; i < userArr; i++) {
      tempUserName = userArr[i].val().userName.toUpperCase();
      console.log(tempUserName);
      if (tempUserName == userInput.value.toUpperCase()) {
        userLocation = i;
        break;
      }
    }

    if (userLocation != -1) {
      confUserName.innerHTML = "Did you mean to add \"" + userInput.value + "\"?";
      userInviteModal.style.display = "none";
      confirmUserModal.style.display = "block";

      inviteConfirm.onclick = function () {
        inviteUserDB(userArr[userLocation]);
        confirmUserModal.style.display = "none";
      };

      inviteDeny.onclick = function () {
        confirmUserModal.style.display = "none";
        userInviteModal.style.display = "block";
      };

      //close on close
      confirmSpan.onclick = function () {
        confirmUserModal.style.display = "none";
      };

      //close on click
      window.onclick = function (event) {
        if (event.target == confirmUserModal) {
          confirmUserModal.style.display = "none";
        }
      }
    } else {
      alert("Error finding user, please contact the developer for assistance!");
    }
  }

  function removeFriendElement(uid) {
    document.getElementById("user" + uid.key).remove();

    friendCount--;
    if(friendCount == 0){
      deployFriendListEmptyNotification();
    }
  }

  function inviteUserDB(invitedUser) {
    var invitedUserInvites = invitedUser.invites;
    console.log(invitedUserInvites);
    invitedUserInvites.push(user.key);
    console.log(invitedUserInvites);

    if(invitedUser.invites != undefined) {
      /*
      firebase.database().ref("users/" + invitedUser.key).update({
        invites: invitedUserInvites
      });
      */
    } else {
      console.log("New Invite List");
      //firebase.database().ref("users/" + invitedUser.key).update({invites:{0:user.key}});
    }
  }
};

function deployFriendListEmptyNotification(){
  try{
    document.getElementById("TestGift").innerHTML = "No Friends Found! Invite Some Friends With The Button Below!";
  } catch(err){
    console.log("Loading Element Missing, Creating A New One");
    var liItem = document.createElement("LI");
    liItem.id = "TestGift";
    liItem.className = "gift";
    var textNode = document.createTextNode("No Friends Found! Invite Some Friends With The Button Below!");
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
