var listeningFirebaseRefs = [];
var inviteArr = [];

var cleanedItems = "";

var userCounter = 0;
var onlineInt = 0;

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
var noteSpan;
var noteInfoField;
var noteTitleField;
var listNote;
var inviteNote;
var userInitial;



function getCurrentUser(){
  user = sessionStorage.getItem("validUser");
  if(user == null || user == undefined){
    window.location.href = "index.html";
  } else {
    console.log("User: " + user.key + " logged in");
    if (user.invites.length != 0) {
      inviteNote.style.background = "#ff3923";
    }
  }
}

window.onload = function instantiate() {

  giftList = document.getElementById('giftListContainer');
  giftListHTML = document.getElementById('giftListContainer').innerHTML;
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  noteSpan = document.getElementById('closeNotification');
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
            document.getElementById("TestGift").innerHTML = "No Users Found!";
          }
        } catch(err) {
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
          inviteNote.style.background = "#00c606";
        } else {
          alternator--;
          document.getElementById("settingsNote").innerHTML = "Moderation";
          inviteNote.style.background = "#00ad05";
        }
      }
    }, 1000);
  }

  function databaseQuery() {

    userInitial = firebase.database().ref("users/");
    userInvites = firebase.database().ref("users/" + user.key + "/invites");

    var fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        createUserElement(data);

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
        changeUserElement(data);

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
        removeUserElement(data.key);

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

  function createUserElement(userData){
    try{
      document.getElementById("TestGift").remove();
    } catch (err) {}

    var liItem = document.createElement("LI");
    liItem.id = "user" + userData.key;
    liItem.className = "gift";
    liItem.onclick = function (){
      var spanGift = document.getElementsByClassName("close")[0];
      modal = document.getElementById('giftModal');
      noteModal = document.getElementById('notificationModal');
      var warnBtn = document.getElementById('warnUser');
      var banBtn = document.getElementById('banUser');
      var userName = document.getElementById('userName');
      var userUID = document.getElementById('userUID');
      var userUserName = document.getElementById('userUserName');
      var userGifts = document.getElementById('userGifts');
      var userFriends = document.getElementById('userFriends');
      var userPassword = document.getElementById('userPassword');

      userName.innerHTML = userData.name;
      userUID.innerHTML = userData.key;
      userUserName.innerHTML = userData.userName;
      userGifts.innerHTML = "# Gifts: " + userData.giftList.length;
      userFriends.innerHTML = "# Friends: " + userData.friends.length;
      userPassword.innerHTML = "Click On Me To View Password";

      userGifts.onclick = function() {
        sessionStorage.setItem("validGiftUser", userData);//Other User Data
        sessionStorage.setItem("validUser", user);
        window.location.href = "friendList.html";
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
    var editGift = document.getElementById("user" + userData.key);
    editGift.innerHTML = userData.name;
    editGift.className = "gift";
    editGift.onclick = function (){
      var spanGift = document.getElementsByClassName("close")[0];
      modal = document.getElementById('giftModal');
      noteModal = document.getElementById('notificationModal');
      var warnBtn = document.getElementById('warnUser');
      var banBtn = document.getElementById('banUser');
      var userName = document.getElementById('userName');
      var userUID = document.getElementById('userUID');
      var userUserName = document.getElementById('userUserName');
      var userGifts = document.getElementById('userGifts');
      var userFriends = document.getElementById('userFriends');
      var userPassword = document.getElementById('userPassword');

      userName.innerHTML = userData.name;
      userUID.innerHTML = userData.key;
      userUserName.innerHTML = userData.userName;
      userGifts.innerHTML = "# Gifts: " + userData.giftList.length;
      userFriends.innerHTML = "# Friends: " + userData.friends.length;
      userPassword.innerHTML = "Click On Me To View Password";

      userGifts.onclick = function() {
        sessionStorage.setItem("validGiftUser", userData);//Other User Data
        sessionStorage.setItem("validUser", user);
        window.location.href = "friendList.html";
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
