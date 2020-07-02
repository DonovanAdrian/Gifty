var listeningFirebaseRefs = [];
var giftArr = [];
var inviteArr = [];

var invitesValidBool = false;
var friendsValidBool = false;
var updateUserBool = false;

var giftCounter = 0;
var onlineInt = 0;

var giftList;
var giftListHTML;
var offline;
var giftStorage;
var backBtn;
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
var userBase;
var userGifts;



function getCurrentUser(){
  user = JSON.parse(sessionStorage.validUser);
  if(user == null || user == undefined){
    window.location.href = "index.html";
  } else {
    console.log("User: " + user.userName + " logged in");
    if (user.giftList == undefined) {
      deployGiftListEmptyNotification();
    } else if (user.giftList.length == 0) {
      deployGiftListEmptyNotification();
    }
    if(user.invites == undefined) {
      console.log("Invites Not Found");
    } else if (user.invites != undefined) {
      invitesValidBool = true;
    } else if (user.invites.length > 0) {
      invitesValidBool = true;
    }

    if(user.friends == undefined) {
      console.log("Friends Not Found");
    } else if (user.friends != undefined) {
      friendsValidBool = true;
    } else if (user.friends.length > 0) {
      friendsValidBool = true;
    }

    userArr = JSON.parse(sessionStorage.userArr);
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
    firebase.database().ref("users/" + user.uid).update({
      invites: user.invites
    });
  }
  if(friendEditInt > 0) {
    firebase.database().ref("users/" + user.uid).update({
      friends: user.friends
    });
  }
  console.log("Updates pushed!");
}

window.onload = function instantiate() {

  giftList = document.getElementById('giftListContainer');
  giftListHTML = document.getElementById('giftListContainer').innerHTML;
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  noteSpan = document.getElementById('closeNotification');
  backBtn = document.getElementById('addGift');
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

  backBtn.innerHTML = "Add New Gift";
  backBtn.onclick = function() {
    giftStorage = "";
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
      if (loginNum = logoutReminder){//default 600
        areYouStillThereNote();
      } else if (loginNum > logoutReminder){//default 600
        updateAYSTNote(loginNum);
      } else if (loginNum >= logoutLimit){//default 900
        signOut();
      }
      function resetTimer() {
        ohThereYouAre();
        loginNum = 0;
      }
    }, 1000);
  }

  function areYouStillThereNote(){
    modal.style.display = "none";

    noteInfoField.innerHTML = "You have been inactive for 10 minutes, you will be logged out in 5:00!";
    noteTitleField.innerHTML = "Are You Still There?";
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
  }

  function updateAYSTNote(timeElapsed){
    var timeRemaining = logoutLimit - timeElapsed;
    var timeMins = timeRemaining/60;
    var timeSecs = timeRemaining%60;
    noteInfoField.innerHTML = "You have been inactive for 10 minutes, you will be logged out in " + timeMins
      + ":" + timeSecs + "!";
  }

  function ohThereYouAre(){
    noteInfoField.innerHTML = "Welcome back, " + user.name;
    noteTitleField.innerHTML = "Oh, There You Are!";

    var nowJ = 0;
    var j = setInterval(function(){
      nowJ = nowJ + 1000;
      if(nowJ >= 3000){
        noteModal.style.display = "none";
        clearInterval(j);
      }
    }, 1000);
  }

  function databaseQuery() {

    userBase = firebase.database().ref("users/" + user.uid);
    userGifts = firebase.database().ref("users/" + user.uid + "/giftList");
    userInvites = firebase.database().ref("users/" + user.uid + "/invites");

    var fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        //check friends
        //check giftList
        //if a user does not exist in these lists, remove them and update to database

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
          data.key, data.val().where, data.val().uid);
      });

      postRef.on('child_changed', function(data) {
        giftArr[data.key] = data.val();

        changeGiftElement(data.val().description, data.val().link, data.val().received, data.val().title,
          data.key, data.val().where, data.val().uid);
      });

      postRef.on('child_removed', function(data) {
        giftArr.splice(data.key, 1);
        removeGiftElement(data.key);
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

  function createGiftElement(giftDescription, giftLink, giftReceived, giftTitle, giftKey, giftWhere, giftUid){
    try{
      document.getElementById("TestGift").remove();
    } catch (err) {}

    var liItem = document.createElement("LI");
    liItem.id = "gift" + giftKey;
    liItem.className = "gift";
    liItem.onclick = function (){
      var spanGift = document.getElementsByClassName("close")[0];
      modal = document.getElementById('giftModal');
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
      updateBtn.onclick = function(){
        updateGiftElement(giftUid);
      };
      deleteBtn.onclick = function(){
        deleteGiftElement(giftKey, giftTitle);
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

  function changeGiftElement(description, link, received, title, key, where, uid) {
    var editGift = document.getElementById("gift" + key);
    editGift.innerHTML = title;
    editGift.className = "gift";
    editGift.onclick = function (){
      var spanGift = document.getElementsByClassName("close")[0];
      modal = document.getElementById('giftModal');
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
      updateBtn.onclick = function(){
        updateGiftElement(uid);
      };
      deleteBtn.onclick = function(){
        deleteGiftElement(key, title);
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
    sessionStorage.setItem("validUser", JSON.stringify(user));
    sessionStorage.setItem("userArr", JSON.stringify(userArr));
    sessionStorage.setItem("giftStorage", JSON.stringify(giftStorage));
    window.location.href = "giftAddUpdate.html";
  }

  function deleteGiftElement(uid, title) {
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
