var listeningFirebaseRefs = [];
var giftArr = [];
var inviteArr = [];
var userUserNames = [];
var instantiatedNodes = [];
var tempInstantiatedNodes = [];

var areYouStillThereBool = false;
var updateGiftToDBBool = false;
var removingNodeBool = false;

var currentModalOpen = "";

var giftCounter = 0;
var onlineInt = 0;
var logoutReminder = 300;
var logoutLimit = 900;

var giftCreationDate;
var giftList;
var giftListHTML;
var offline;
var giftStorage;
var currentUser;
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
    moderationSet = sessionStorage.getItem("moderationSet");
    user = JSON.parse(sessionStorage.validGiftUser);
    currentUser = JSON.parse(sessionStorage.validUser);
    if(currentUser.uid == user.uid){
      console.log("HOW'D YOU GET HERE???");
      navigation(0);
    }
    console.log("User: " + currentUser.userName + " logged in");
    console.log("Friend: " + user.userName + " loaded in");
    if (user.privateList == undefined) {
      deployGiftListEmptyNotification();
    } else if (user.privateList.length == 0) {
      deployGiftListEmptyNotification();
    }
    if (currentUser.invites == undefined) {
      console.log("Invites Not Found");
    } else if (currentUser.invites != undefined) {
      if (currentUser.invites.length > 0) {
        inviteNote.style.background = "#ff3923";
      }
    }
    userArr = JSON.parse(sessionStorage.userArr);
  } catch (err) {
    window.location.href = "index.html";
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
  backBtn = document.getElementById('addGift');
  modal = document.getElementById('giftModal');
  getCurrentUser();

  for(var i = 0; i < userArr.length; i++){
    userUserNames.push(userArr[i].userName);
  }

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

  backBtn.innerHTML = "Add Private Gift";
  backBtn.onclick = function() {
    giftStorage = "";
    sessionStorage.setItem("privateList", JSON.stringify(user));
    sessionStorage.setItem("validUser", JSON.stringify(user));
    sessionStorage.setItem("validPrivateUser", JSON.stringify(currentUser));
    sessionStorage.setItem("userArr", JSON.stringify(userArr));
    sessionStorage.setItem("giftStorage", JSON.stringify(giftStorage));
    window.location.href = "giftAddUpdate.html";
  };

  databaseQuery();

  loginTimer(); //if action, then reset timer

  privateFriendListButton();

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

  function privateFriendListButton(){
    var nowConfirm = 0;
    var alternator = 0;
    console.log("Friend List Button Feature Active");
    setInterval(function(){
      nowConfirm = nowConfirm + 1000;
      if(nowConfirm >= 3000){
        nowConfirm = 0;
        if(alternator == 0) {
          alternator++;
          document.getElementById("listNote").innerHTML = "Lists";
          document.getElementById("listNote").style.background = "#00c606";
        } else {
          alternator--;
          document.getElementById("listNote").innerHTML = "Private";
          document.getElementById("listNote").style.background = "#00ad05";
        }
      }
    }, 1000);
  }

  function databaseQuery() {

    userBase = firebase.database().ref("users/" + currentUser.uid);
    userGifts = firebase.database().ref("users/" + user.uid + "/privateList/");
    userInvites = firebase.database().ref("users/" + currentUser.uid + "/invites");

    var fetchData = function (postRef) {
      postRef.on('child_added', function (data) {

        onlineInt = 1;
        if(data.key == "name"){
          currentUser.name = data.val();
        } else if (data.key == "pin"){
          currentUser.pin = data.val();
        } else if (data.key == "encodeStr"){
          currentUser.encodeStr = data.val();
        } else if (data.key == "userName"){
          currentUser.userName = data.val();
        } else if (data.key == "ban"){
          currentUser.ban = data.val();
        } else if (data.key == "firstLogin"){
          currentUser.firstLogin = data.val();
        } else if (data.key == "moderatorInt"){
          currentUser.moderatorInt = data.val();
        } else if (data.key == "organize"){
          currentUser.organize = data.val();
        } else if (data.key == "strike"){
          currentUser.strike = data.val();
        } else if (data.key == "theme"){
          currentUser.theme = data.val();
        } else if (data.key == "uid"){
          currentUser.uid = data.val();
        } else if (data.key == "warn"){
          currentUser.warn = data.val();
        } else if (data.key == "giftList"){
          currentUser.giftList = data.val();
        } else if (data.key == "support"){
          currentUser.support = data.val();
        } else if (data.key == "invites"){
          currentUser.invites = data.val();
        } else if (data.key == "friends"){
          currentUser.friends = data.val();
        } else if (data.key == "shareCode"){
          currentUser.shareCode = data.val();
        } else if (data.key == "privateList"){
          currentUser.privateList = data.val();
        } else {
          console.log("Unknown Key..." + data.key);
        }
      });
      postRef.on('child_changed', function (data) {
        if(data.key == "name"){
          currentUser.name = data.val();
        } else if (data.key == "pin"){
          currentUser.pin = data.val();
        } else if (data.key == "encodeStr"){
          currentUser.encodeStr = data.val();
        } else if (data.key == "userName"){
          currentUser.userName = data.val();
        } else if (data.key == "ban"){
          currentUser.ban = data.val();
        } else if (data.key == "firstLogin"){
          currentUser.firstLogin = data.val();
        } else if (data.key == "moderatorInt"){
          currentUser.moderatorInt = data.val();
        } else if (data.key == "organize"){
          currentUser.organize = data.val();
        } else if (data.key == "strike"){
          currentUser.strike = data.val();
        } else if (data.key == "theme"){
          currentUser.theme = data.val();
        } else if (data.key == "uid"){
          currentUser.uid = data.val();
        } else if (data.key == "warn"){
          currentUser.warn = data.val();
        } else if (data.key == "giftList"){
          currentUser.giftList = data.val();
        } else if (data.key == "support"){
          currentUser.support = data.val();
        } else if (data.key == "invites"){
          currentUser.invites = data.val();
        } else if (data.key == "friends"){
          currentUser.friends = data.val();
        } else if (data.key == "shareCode"){
          currentUser.shareCode = data.val();
        } else if (data.key == "privateList"){
          currentUser.privateList = data.val();
        } else {
          console.log("Unknown Key..." + data.key);
        }
      });
      postRef.on('child_removed', function (data) {
        if(data.key == "name"){
          currentUser.name = "";
        } else if (data.key == "pin"){
          currentUser.pin = "";
        } else if (data.key == "encodeStr"){
          currentUser.encodeStr = "";
        } else if (data.key == "userName"){
          currentUser.userName = "";
        } else if (data.key == "uid"){
          currentUser.uid = "";
        } else if (data.key == "giftList"){
          currentUser.giftList = [];
        } else if (data.key == "support"){
          currentUser.support = [];
        } else if (data.key == "invites"){
          currentUser.invites = [];
        } else if (data.key == "friends"){
          currentUser.friends = [];
        } else if (data.key == "shareCode"){
          currentUser.shareCode = "";
        } else if (data.key == "privateList"){
          currentUser.privateList = [];
        } else {
          console.log("Unknown Key..." + data.key);
        }
      });
    };

    var fetchGifts = function (postRef) {
      postRef.on('child_added', function (data) {
        giftArr.push(data.val());

        if(checkGiftBuyer(data.val().buyer)){
          data.val().buyer = "";
          updateGiftToDBBool = true;
        }

        createGiftElement(data.val().description, data.val().link, data.val().received, data.val().title,
          data.key, data.val().where, data.val().uid, data.val().creationDate, data.val().buyer,
          data.val().creator);
        instantiatedNodes.push(data.val());

        if(updateGiftToDBBool){
          updateGiftError(data, data.key);
          updateGiftToDBBool = false;
        }
      });

      postRef.on('child_changed', function(data) {
        //console.log("Changing " + data.val().uid);
        giftArr[data.key] = data.val();
        instantiatedNodes[data.key] = data.val();

        changeGiftElement(data.val().description, data.val().link, data.val().received, data.val().title,
          data.key, data.val().where, data.val().uid, data.val().creationDate, data.val().buyer,
          data.val().creator);
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

  function checkGiftBuyer(buyer){
    var updateGiftToDB = true;

    //console.log("Checking for buyer error...");

    if(buyer == "" || buyer == null || buyer == undefined || userUserNames.includes(buyer)){
      updateGiftToDB = false;
      //console.log("No buyer error");
    } else {
      console.log("Buyer error found!");
    }

    return updateGiftToDB;
  }

  function updateGiftError(giftData, giftKey){
    alert("A gift needs to be updated! Key: " + giftKey);
    firebase.database().ref("users/" + user.uid + "/privateList/" + giftKey).update({
      buyer: ""
    });
  }

  function createGiftElement(giftDescription, giftLink, giftReceived, giftTitle, giftKey, giftWhere, giftUid, giftDate,
                             giftBuyer, giftCreator){
    try{
      document.getElementById("TestGift").remove();
    } catch (err) {}

    var liItem = document.createElement("LI");
    liItem.id = "gift" + giftUid;
    liItem.className = "gift";
    if(giftReceived == 1) {
      liItem.className += " checked";
      //console.log("Checked, created");
    }
    liItem.onclick = function (){
      var spanGift = document.getElementsByClassName("close")[0];
      var editBtn = document.getElementById('giftEdit');
      var deleteBtn = document.getElementById('giftDelete');
      var titleField = document.getElementById('giftTitle');
      var descField = document.getElementById('giftDescription');
      var creatorField = document.getElementById('giftCreator');
      var whereField = document.getElementById('giftWhere');
      var linkField = document.getElementById('giftLink');
      var boughtField = document.getElementById('giftBought');
      var buyField = document.getElementById('giftBuy');
      var dontBuyField = document.getElementById('giftDontBuy');

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
      if(giftReceived == 1){
        if(giftBuyer == null || giftBuyer == undefined){
          boughtField.innerHTML = "This gift has been bought";
        } else {
          if (giftBuyer == "")
            boughtField.innerHTML = "This gift has been bought";
          else
            boughtField.innerHTML = "This gift was bought by " + giftBuyer;
        }
      } else {
        boughtField.innerHTML = "This gift has not been bought yet";
      }
      if(giftDescription != "") {
        descField.innerHTML = "Description: " + giftDescription;
      } else {
        descField.innerHTML = "There was no description provided";
      }
      if(giftCreator == null || giftCreator == undefined){
        creatorField.innerHTML = "Gift creator unavailable";
      } else {
        if (giftCreator == "")
          creatorField.innerHTML = "Gift creator unavailable";
        else
          creatorField.innerHTML = "Gift was created by " + giftCreator;
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
      editBtn.onclick = function(){
        updateGiftElement(giftUid);
      };
      deleteBtn.onclick = function(){
        if (giftCreator == currentUser.userName || giftCreator == null || giftCreator == undefined) {
          deleteGiftElement(giftKey, giftTitle, giftUid);
        } else {
          if (giftCreator == ""){
            deleteGiftElement(giftKey, giftTitle, giftUid);
          } else {
            alert("Only the creator, " + giftCreator + ", can delete this gift. Please contact them to delete this gift " +
              "if it needs to be removed.");
          }
        }
      };
      buyField.innerHTML = "Click on me to buy the gift!";
      buyField.onclick = function(){
        if (giftReceived == 0) {
          firebase.database().ref("users/" + user.uid + "/privateList/" + giftKey).update({
            received: 1,
            buyer: currentUser.userName
          });
        } else {
          alert("This gift has already been marked as bought!");
        }
      };
      dontBuyField.innerHTML = "Click on me to un-buy the gift!";
      dontBuyField.onclick = function(){
        if (giftReceived == 1) {
          if (giftBuyer == currentUser.userName || giftBuyer == null || giftBuyer == undefined) {
            firebase.database().ref("users/" + user.uid + "/privateList/" + giftKey).update({
              received: 0,
              buyer: ""
            });
          } else {
            if (giftBuyer == "") {
              firebase.database().ref("users/" + user.uid + "/privateList/" + giftKey).update({
                received: 0,
                buyer: ""
              });
            } else {
              alert("Only the buyer, " + giftBuyer + ", can \"Un-Buy\" this gift. Please contact them to undo this action " +
                "if this has been done in error.");
            }
          }
        } else {
          alert("This gift has already been marked as \"Un-Bought\"!");
        }
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

  function changeGiftElement(description, link, received, title, key, where, uid, date, buyer, creator) {
    var editGift = document.getElementById("gift" + uid);
    editGift.innerHTML = title;
    editGift.className = "gift";
    if (received == 1) {
      editGift.className += " checked";
      //console.log("Checked, changed");
    }
    editGift.onclick = function () {
      var spanGift = document.getElementsByClassName("close")[0];
      var editBtn = document.getElementById('giftEdit');
      var deleteBtn = document.getElementById('giftDelete');
      var titleField = document.getElementById('giftTitle');
      var descField = document.getElementById('giftDescription');
      var creatorField = document.getElementById('giftCreator');
      var whereField = document.getElementById('giftWhere');
      var linkField = document.getElementById('giftLink');
      var boughtField = document.getElementById('giftBought');
      var buyField = document.getElementById('giftBuy');
      var dontBuyField = document.getElementById('giftDontBuy');

      if (link != "") {
        linkField.innerHTML = "Click me to go to the webpage!";
        linkField.onclick = function () {
          var newGiftLink = "http://";
          if (link.includes("https://")) {
            link = link.slice(8, link.length);
          } else if (link.includes("http://")) {
            link = link.slice(7, link.length);
          }
          newGiftLink += link;
          window.open(newGiftLink, "_blank");
        };
      } else {
        linkField.innerHTML = "There was no link provided";
        linkField.onclick = function () {
        };
      }
      if (received == 1) {
        if (buyer == null || buyer == undefined) {
          boughtField.innerHTML = "This gift has been bought";
        } else {
          if (buyer == "")
            boughtField.innerHTML = "This gift has been bought";
          else
            boughtField.innerHTML = "This gift was bought by " + buyer;
        }
      } else {
        boughtField.innerHTML = "This gift has not been bought yet";
      }
      if (description != "") {
        descField.innerHTML = "Description: " + description;
      } else {
        descField.innerHTML = "There was no description provided";
      }
      if (creator == null || creator == undefined) {
        creatorField.innerHTML = "Gift creator unavailable";
      } else {
        if (creator == "")
          creatorField.innerHTML = "Gift creator unavailable";
        else
          creatorField.innerHTML = "Gift was created by " + creator;
      }
      titleField.innerHTML = title;
      if (where != "") {
        whereField.innerHTML = "This can be found at: " + where;
      } else {
        whereField.innerHTML = "There was no location provided";
      }
      if (date != undefined) {
        if (date != "") {
          giftCreationDate.innerHTML = "Created on: " + date;
        } else {
          giftCreationDate.innerHTML = "Creation date not available";
        }
      } else {
        giftCreationDate.innerHTML = "Creation date not available";
      }
      editBtn.onclick = function () {
        updateGiftElement(uid);
      };
      deleteBtn.onclick = function () {
        if (creator == currentUser.userName || creator == null || creator == undefined) {
          deleteGiftElement(key, title, uid);
        } else {
          if (creator == ""){
            deleteGiftElement(key, title, uid);
          } else {
            alert("Only the creator, " + creator + ", can delete this gift. Please contact them to delete this gift " +
              "if it needs to be removed.");
          }
        }
      };
      buyField.innerHTML = "Click on me to buy the gift!";
      buyField.onclick = function () {
        if (received == 0) {
          firebase.database().ref("users/" + user.uid + "/privateList/" + key).update({
            received: 1,
            buyer: currentUser.userName
          });
        } else {
          alert("This gift has already been marked as bought!");
        }
      };
      dontBuyField.innerHTML = "Click on me to un-buy the gift!";
      dontBuyField.onclick = function () {
        if (received == 1) {
          if (buyer == currentUser.userName || buyer == null || buyer == undefined) {
            firebase.database().ref("users/" + user.uid + "/privateList/" + key).update({
              received: 0,
              buyer: ""
            });
          } else {
            if (buyer == "") {
              firebase.database().ref("users/" + user.uid + "/privateList/" + key).update({
                received: 0,
                buyer: ""
              });
            } else {
              alert("Only the buyer, " + buyer + ", can \"Un-Buy\" this gift. Please contact them to undo this action " +
                "if this has been done in error.");
            }
          }
        } else {
          alert("This gift has already been marked as \"Un-Bought\"!");
        }
      };

      //show modal
      modal.style.display = "block";

      //close on close
      spanGift.onclick = function () {
        modal.style.display = "none";
      };

      //close on click
      window.onclick = function (event) {
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
    sessionStorage.setItem("privateList", JSON.stringify(user));
    sessionStorage.setItem("validUser", JSON.stringify(user));
    sessionStorage.setItem("validPrivateUser", JSON.stringify(currentUser));
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


      alert("Attempting to delete " + giftArr[toDelete].title + "! If this is successful, the page will reload.");
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
        privateList: giftArr
      });

      /*
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
      */

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
  sessionStorage.setItem("validUser", JSON.stringify(currentUser));
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
