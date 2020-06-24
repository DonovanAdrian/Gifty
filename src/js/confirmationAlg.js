var userArr = [];
var inviteArr = [];
var listeningFirebaseRefs = [];

var inviteCount = 0;
var onlineInt = 0;

var offline;
var userList;
var userListHTML;
var offlineSpan;
var offlineModal;
var user;
var userInitial;
var userInvites;
var userFriends;
var modal;
var listNote;
var inviteNote;
var offlineTimer;

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
  listNote = document.getElementById('listNote');
  inviteNote = document.getElementById('inviteNote');
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
            document.getElementById("TestGift").innerHTML = "No Friends Found! Wait For More Friends To Send You Invites!";
          }
        } catch(err){
          console.log("Loading Element Missing, Creating A New One");
          var liItem = document.createElement("LI");
          liItem.id = "TestGift";
          liItem.className = "gift";
          if (onlineInt == 0) {
            var textNode = document.createTextNode("Loading Failed, Please Connect To Internet");
          } else {
            var textNode = document.createTextNode("No Friends Found! Wait For More Friends To Send You Invites!");
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
  inviteConfirmButton();

  function inviteConfirmButton(){
    var nowConfirm = 0;
    var alternator = 0;
    console.log("Invite Button Feature Active");
    setInterval(function(){
      nowConfirm = nowConfirm + 1000;
      if(nowConfirm >= 3000){
        nowConfirm = 0;
        if(alternator == 0) {
          alternator++;
          document.getElementById("inviteNote").innerHTML = "Confirm";
          inviteNote.style.background = "#00c606";
        } else {
          alternator--;
          document.getElementById("inviteNote").innerHTML = "Invites";
          inviteNote.style.background = "#00ad05";
        }
      }
    }, 1000);
  }

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
      });

      postRef.on('child_changed', function (data) {
        console.log(friendArr);
        friendArr[data.key] = data.val();
        console.log(friendArr);
      });

      postRef.on('child_removed', function (data) {
        console.log(friendArr);
        friendArr.splice(data.key, 1);
        console.log(friendArr);
      });
    };

    var fetchInvites = function (postRef) {
      postRef.on('child_added', function (data) {
        inviteArr.push(data.val());

        createInviteElement(data.val());
        inviteNote.style.background = "#ff3923";
      });

      postRef.on('child_changed', function (data) {
        console.log(inviteArr);
        inviteArr[data.key] = data.val();
        console.log(inviteArr);

        changeInviteElement(data.val());
      });

      postRef.on('child_removed', function (data) {
        console.log(inviteArr);
        inviteArr.splice(data.key, 1);
        console.log(inviteArr);

        removeInviteElement(data.key);

        if (inviteArr.length == 0) {
          console.log("Invite List Removed");
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

  function findItemInArr(item, array){
    for(var i = 0; i < array.length; i++){
      if(array[i] == item){
        console.log("Found item: " + item);
        return i;
      }
    }
  }

  function createInviteElement(inviteKey){
    try{
      document.getElementById("TestGift").remove();
    } catch (err) {}

    var inviteData;
    for (var i = 0; i < userArr.length; i++){
      if(inviteKey == userArr[i].key){
        inviteData = userArr[i];
        break;
      }
    }

    var userUid = inviteData.val().uid;
    var inviteName = inviteData.val().name;
    var inviteUserName = inviteData.val().userName;
    var inviteShareCode = inviteData.val().shareCode;
    var liItem = document.createElement("LI");
    liItem.id = "user" + userUid;
    liItem.className = "gift";
    liItem.onclick = function (){
      var span = document.getElementsByClassName("close")[0];
      var modal = document.getElementById('myModal');
      var inviteAdd = document.getElementById('userAccept');
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

      inviteAdd.onclick = function(){
        modal.style.display = "none";
        addInvite(inviteData);
      };

      inviteDelete.onclick = function(){
        modal.style.display = "none";
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
    var textNode = document.createTextNode(inviteName);
    liItem.appendChild(textNode);

    userList.insertBefore(liItem, document.getElementById("userListContainer").childNodes[0]);

    inviteCount++;
  }

  function changeInviteElement(inviteKey){
    var inviteData;
    for (var i = 0; i < userArr.length; i++){
      if(inviteKey == userArr[i].key){
        inviteData = userArr[i];
        break;
      }
    }

    var userUid = inviteData.val().uid;
    var inviteName = inviteData.val().name;
    var inviteUserName = inviteData.val().userName;
    var inviteShareCode = inviteData.val().shareCode;
    var liItemUpdate = document.getElementById("user" + inviteData.key);
    liItemUpdate.innerHTML = inviteName;
    liItemUpdate.className = "gift";
    liItemUpdate.onclick = function (){
      var span = document.getElementsByClassName("close")[0];
      modal = document.getElementById('myModal');
      var inviteAdd = document.getElementById('userAccept');
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

      inviteAdd.onclick = function(){
        addInvite(inviteData);
      };

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
  }

  function addInvite(inviteData){
    var friendFriendArr = inviteData.friends;

    console.log(friendFriendArr);
    friendFriendArr.push(user.key);
    console.log(friendFriendArr);
    /*
    firebase.database().ref("users/" + inviteData.key).update({
      friends: friendFriendArr
    });
    */

    console.log(friendArr);
    friendArr.push(inviteData.key);
    console.log(friendArr);
    /*
    firebase.database().ref("users/" + user.key).update({
      friends: friendArr
    });
    */

    deleteInvite(inviteData.key);
  }

  function deleteInvite(uid) {
    var verifyDeleteBool = true;
    var toDelete = -1;

    for (var i = 0; i < inviteArr.length; i++){
      if(inviteArr[i] == uid) {
        toDelete = i;
        break;
      }
    }

    if(toDelete != -1) {
      console.log(inviteArr);
      inviteArr.splice(toDelete, 1);
      console.log(inviteArr);

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
      /*
      firebase.database().ref("users/" + user.key).update({
        invites: inviteArr
      });
      */

      modal.style.display = "none";

      removeInviteElement(uid);//This will only need to be here until firebase commands are uncommented
      alert("Invite Successfully removed!");
    } else {
      alert("Delete failed, please try again later!");
    }
  }

  function removeInviteElement(uid){
    document.getElementById("user" + uid).remove();

    inviteCount--;
    if(inviteCount == 0){
      deployInviteListEmptyNotification();
    }
  }
};

function deployInviteListEmptyNotification(){
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
    case 4:
      window.location.href = "confirmation.html";
      break;
    default:
      break;
  }
}
