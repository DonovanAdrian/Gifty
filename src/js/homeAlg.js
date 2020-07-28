var listeningFirebaseRefs = [];
var giftArr = [];
var inviteArr = [];
var userBoughtGifts = [];
var userBoughtGiftsUsers = [];

var invitesValidBool = false;
var friendsValidBool = false;
var updateUserBool = false;
var areYouStillThereBool = false;

var giftCounter = 0;
var onlineInt = 0;
var logoutReminder = 300;
var logoutLimit = 900;

var giftCreationDate;
var giftList;
var giftListHTML;
var offline;
var giftStorage;
var privateList;
var boughtGifts;
var backBtn;
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
var userBase;
var userGifts;



function getCurrentUser(){
  try {
    user = JSON.parse(sessionStorage.validUser);
    console.log("User: " + user.userName + " logged in");
    if (user.giftList == undefined) {
      deployGiftListEmptyNotification();
    } else if (user.giftList.length == 0) {
      deployGiftListEmptyNotification();
    }
    if (user.invites == undefined) {
      console.log("Invites Not Found");
    } else if (user.invites != undefined) {
      if (user.invites.length > 0) {
        invitesValidBool = true;
      }
    }

    if (user.friends == undefined) {
      console.log("Friends Not Found");
    } else if (user.friends != undefined) {
      if (user.friends.length > 0) {
        friendsValidBool = true;
      }
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

function checkUserErrors(){
  var userUIDs = [];
  var inviteEditInt = 0;
  var friendEditInt = 0;
  var totalErrors = 0;

  for(var i = 0; i < userArr.length; i++){
    userUIDs.push(userArr[i].uid);
  }

  console.log("Checking for errors...");

  //check invites for users that no longer exist
  if(invitesValidBool){
    for(var i = 0; i < user.invites.length; i++){
      if(!userUIDs.includes(user.invites[i])){
        user.invites.splice(i, 1);
        inviteEditInt++;
      }
    }

    if(inviteEditInt > 0){
      updateUserBool = true;
      console.log("Update to DB required: 1...");
    }

    if(user.invites.length > 0) {
      inviteNote.style.background = "#ff3923";
    }
  }

  //check friends for users that no longer exist
  if(friendsValidBool){
    for(var i = 0; i < user.friends.length; i++){
      if(!userUIDs.includes(user.friends[i])){
        user.friends.splice(i, 1);
        friendEditInt++;
      }
    }

    if(friendEditInt > 0){
      updateUserBool = true;
      console.log("Update to DB required: 2...");
    }
  }

  if(updateUserBool){
    console.log("Updates needed! Computing...");
    totalErrors = friendEditInt + inviteEditInt;
    updateUserToDB(totalErrors, friendEditInt, inviteEditInt);
  } else {
    console.log("No updates needed!");
  }
}

function updateUserToDB(totalErrors, friendEditInt, inviteEditInt){
  if(inviteEditInt > 0) {
    var supplementaryInvitesArr = user.invites;
    firebase.database().ref("users/" + user.uid).update({
      invites: user.invites
    });
    user.invites = supplementaryInvitesArr;
  }
  if(friendEditInt > 0) {
    var supplementaryFriendsArr = user.friends;
    firebase.database().ref("users/" + user.uid).update({
      friends: user.friends
    });
    user.friends = supplementaryFriendsArr;
  }
  console.log("Updates pushed!");
}

function collectUserBoughtGifts(){
  var userGiftArr = [];
  var userPrivateGiftArr = [];
  for(var i = 0; i < userArr.length; i++) {
    userGiftArr = userArr[i].giftList;
    userPrivateGiftArr = userArr[i].privateList;

    if(userGiftArr == undefined){}
    else if (userGiftArr.length != undefined) {
      for (var a = 0; a < userGiftArr.length; a++) {
        if (userGiftArr[a].buyer == user.userName) {
          userBoughtGifts.push(userGiftArr[a]);
          userBoughtGiftsUsers.push(userArr[i].name);
        }
      }
    }

    if(userPrivateGiftArr == undefined){}
    else if (userPrivateGiftArr.length != undefined) {
      for (var b = 0; b < userPrivateGiftArr.length; b++) {
        if (userPrivateGiftArr[b].buyer == user.userName) {
          userBoughtGifts.push(userPrivateGiftArr[b]);
          userBoughtGiftsUsers.push(userArr[i].name + " (Private List)");
        }
      }
    }
  }
}

window.onload = function instantiate() {

  giftCreationDate = document.getElementById('giftCreationDate');
  giftList = document.getElementById('giftListContainer');
  giftListHTML = document.getElementById('giftListContainer').innerHTML;
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  noteModal = document.getElementById('notificationModal');
  noteTitleField = document.getElementById('notificationTitle');
  noteInfoField = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  inviteNote = document.getElementById('inviteNote');
  listNote = document.getElementById('listNote');
  boughtGifts = document.getElementById('boughtGifts');
  backBtn = document.getElementById('addGift');
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

  checkUserErrors();

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
            document.getElementById("TestGift").innerHTML = "No Gifts Found! Add Some Gifts With The Button Below!";
          }
        } catch(err) {
          if(giftCounter == 0) {
            console.log("Loading Element Missing, Creating A New One");
            var liItem = document.createElement("LI");
            liItem.id = "TestGift";
            liItem.className = "gift";
            if (onlineInt == 0) {
              var textNode = document.createTextNode("Loading Failed, Please Connect To Internet");
            } else {
              var textNode = document.createTextNode("No Gifts Found! Add Some Gifts With The Button Below!");
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

  collectUserBoughtGifts();
  boughtGifts.innerHTML = "Bought Gifts";
  boughtGifts.onclick = function(){
    if(userBoughtGifts.length == 0){
      alert("Buy Some Gifts From Some Users First!");
    } else {
      sessionStorage.setItem("boughtGifts", JSON.stringify(userBoughtGifts));
      sessionStorage.setItem("boughtGiftsUsers", JSON.stringify(userBoughtGiftsUsers));
      sessionStorage.setItem("validUser", JSON.stringify(user));
      sessionStorage.setItem("userArr", JSON.stringify(userArr));
      window.location.href = "boughtGifts.html";
    }
  };

  backBtn.innerHTML = "Add Gift";
  backBtn.onclick = function() {
    giftStorage = "";
    privateList = "";
    sessionStorage.setItem("privateList", JSON.stringify(privateList));
    sessionStorage.setItem("validUser", JSON.stringify(user));
    sessionStorage.setItem("userArr", JSON.stringify(userArr));
    sessionStorage.setItem("giftStorage", JSON.stringify(giftStorage));
    window.location.href = "giftAddUpdate.html";
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
    userGifts = firebase.database().ref("users/" + user.uid + "/giftList");
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

    var fetchGifts = function (postRef) {
      postRef.on('child_added', function (data) {
        giftArr.push(data.val());

        createGiftElement(data.val().description, data.val().link, data.val().received, data.val().title,
          data.key, data.val().where, data.val().uid, data.val().creationDate);
      });

      postRef.on('child_changed', function(data) {
        giftArr[data.key] = data.val();

        changeGiftElement(data.val().description, data.val().link, data.val().received, data.val().title,
          data.key, data.val().where, data.val().uid, data.val().creationDate);
      });

      postRef.on('child_removed', function(data) {
        location.reload();
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
    fetchGifts(userGifts);
    fetchInvites(userInvites);

    listeningFirebaseRefs.push(userBase);
    listeningFirebaseRefs.push(userGifts);
    listeningFirebaseRefs.push(userInvites);
  }

  function createGiftElement(giftDescription, giftLink, giftReceived, giftTitle, giftKey, giftWhere, giftUid, giftDate){
    try{
      document.getElementById("TestGift").remove();
    } catch (err) {}

    var liItem = document.createElement("LI");
    liItem.id = "gift" + giftUid;
    liItem.className = "gift";
    liItem.onclick = function (){
      var spanGift = document.getElementsByClassName("close")[0];
      var updateBtn = document.getElementById('giftUpdate');
      var deleteBtn = document.getElementById('giftDelete');
      var descField = document.getElementById('giftDescription');
      var titleField = document.getElementById('giftTitle');
      var whereField = document.getElementById('giftWhere');
      var linkField = document.getElementById('giftLink');

      if (giftLink != ""){
        linkField.innerHTML = "Click me to go to the webpage!";
        linkField.onclick = function() {
          var newGiftLink = "http://";
          if(giftLink.includes("https://")){
            giftLink = giftLink.slice(8, giftLink.length);
          } else if (giftLink.includes("http://")){
            giftLink = giftLink.slice(7, giftLink.length);
          }
          newGiftLink += giftLink;
          window.open(newGiftLink, "_blank");
        };
      } else {
        linkField.innerHTML = "There was no link provided";
        linkField.onclick = function() {
        };
      }
      if(giftDescription != "") {
        descField.innerHTML = "Description: " + giftDescription;
      } else {
        descField.innerHTML = "There was no description provided";
      }
      titleField.innerHTML = giftTitle;
      if(giftWhere != "") {
        whereField.innerHTML = "This can be found at: " + giftWhere;
      } else {
        whereField.innerHTML = "There was no location provided";
      }
      if(giftDate != undefined) {
        if (giftDate != "") {
          giftCreationDate.innerHTML = "Created on: " + giftDate;
        } else {
          giftCreationDate.innerHTML = "Creation date not available";
        }
      } else {
        giftCreationDate.innerHTML = "Creation date not available";
      }
      updateBtn.onclick = function(){
        updateGiftElement(giftUid);
      };
      deleteBtn.onclick = function(){
        deleteGiftElement(giftKey, giftTitle, giftUid);
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
    var textNode = document.createTextNode(giftTitle);
    liItem.appendChild(textNode);
    giftList.insertBefore(liItem, document.getElementById("giftListContainer").childNodes[0]);
    clearInterval(offlineTimer);

    giftCounter++;
  }

  function changeGiftElement(description, link, received, title, key, where, uid, date) {
    var editGift = document.getElementById("gift" + uid);
    editGift.innerHTML = title;
    editGift.className = "gift";
    editGift.onclick = function (){
      var spanGift = document.getElementsByClassName("close")[0];
      var updateBtn = document.getElementById('giftUpdate');
      var deleteBtn = document.getElementById('giftDelete');
      var descField = document.getElementById('giftDescription');
      var titleField = document.getElementById('giftTitle');
      var whereField = document.getElementById('giftWhere');
      var linkField = document.getElementById('giftLink');

      if (link != ""){
        linkField.innerHTML = "Click me to go to the webpage!";
        linkField.onclick = function() {
          var newGiftLink = "http://";
          if(link.includes("https://")){
            link = link.slice(8, link.length);
          } else if (link.includes("http://")){
            link = link.slice(7, link.length);
          }
          newGiftLink += link;
          window.open(newGiftLink, "_blank");
        };
      } else {
        linkField.innerHTML = "There was no link provided";
        linkField.onclick = function() {
        };
      }
      if(description != "") {
        descField.innerHTML = "Description: " + description;
      } else {
        descField.innerHTML = "There was no description provided";
      }
      titleField.innerHTML = title;
      if(where != "") {
        whereField.innerHTML = "This can be found at: " + where;
      } else {
        whereField.innerHTML = "There was no location provided";
      }
      if(date != undefined) {
        if (date != "") {
          giftCreationDate.innerHTML = "Created on: " + date;
        } else {
          giftCreationDate.innerHTML = "Creation date not available";
        }
      } else {
        giftCreationDate.innerHTML = "Creation date not available";
      }
      updateBtn.onclick = function(){
        updateGiftElement(uid);
      };
      deleteBtn.onclick = function(){
        deleteGiftElement(key, title, uid);
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

  function removeGiftElement(uid) {
    document.getElementById("gift" + uid).remove();

    giftCounter--;
    if (giftCounter == 0){
      deployGiftListEmptyNotification();
    }
  }

  function updateGiftElement(uid) {
    giftStorage = uid;
    privateList = "";
    sessionStorage.setItem("privateList", JSON.stringify(privateList));
    sessionStorage.setItem("validUser", JSON.stringify(user));
    sessionStorage.setItem("userArr", JSON.stringify(userArr));
    sessionStorage.setItem("giftStorage", JSON.stringify(giftStorage));
    window.location.href = "giftAddUpdate.html";
  }

  function deleteGiftElement(key, title, uid) {
    var verifyDeleteBool = true;
    var toDelete = -1;

    for (var i = 0; i < giftArr.length; i++){
      if(title == giftArr[i].title) {
        toDelete = i;
        break;
      }
    }

    if(toDelete != -1) {
      giftArr.splice(toDelete, 1);

      for (var i = 0; i < giftArr.length; i++) {
        if (title == giftArr[i].title) {
          verifyDeleteBool = false;
          break;
        }
      }
    } else {
      verifyDeleteBool = false;
    }

    if(verifyDeleteBool){
      removeGiftElement(uid);
      firebase.database().ref("users/" + user.uid).update({
        giftList: giftArr
      });

      modal.style.display = "none";

      noteInfoField.innerHTML = "Gift Deleted";
      noteTitleField.innerHTML = "Gift " + title + " successfully deleted!";
      noteModal.style.display = "block";

      //close on close
      noteSpan.onclick = function() {
        noteModal.style.display = "none";
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == noteModal) {
          noteModal.style.display = "none";
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

    } else {
      alert("Delete failed, please try again later!");
    }
  }
};

function deployGiftListEmptyNotification(){
  try{
    document.getElementById("TestGift").innerHTML = "No Gifts Found! Add Some Gifts With The Button Below!";
  } catch(err){
    console.log("Loading Element Missing, Creating A New One");
    var liItem = document.createElement("LI");
    liItem.id = "TestGift";
    liItem.className = "gift";
    var textNode = document.createTextNode("No Gifts Found! Add Some Gifts With The Button Below!");
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
