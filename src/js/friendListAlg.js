var listeningFirebaseRefs = [];
var giftArr = [];
var updatedGiftArr = [];
var receivedList = [];

var giftTitle = "";
var giftUid = "";
var giftDescription = "";
var giftLink = "";
var giftWhere = "";
var giftBuyer = "";
var currentModalOpen = "";

var giftReceived = 0;
var offlineInt = 0;
var testGiftInt = 0;
var previousReceived = 0;

var receivedChangedBool = false;

var giftList;
var giftListHTML;
var offline;
var giftStorage;
var backBtn;
var offlineSpan;
var offlineModal;
var user;
var load;
var modal;
var noteModal;
var noteSpan;
var noteInfoField;
var noteTitleField;
var listNote;
var inviteNote;
var currentUser;



function getCurrentUser(){
  user = sessionStorage.getItem("validGiftUser");
  currentUser = sessionStorage.getItem("validUser");
  if(user == null || user == undefined){
    window.location.href = "index.html";
  } else {
    console.log("User: " + currentUser.key + " logged in");
  }
}

//Instantiates all data upon loading the webpage
window.onload = function instantiate() {
  getCurrentUser();

  giftList = document.getElementById('giftListContainer');
  giftListHTML = document.getElementById('giftListContainer').innerHTML;
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  noteSpan = document.getElementById('closeNotification');
  backBtn = document.getElementById('backBtn');
  listNote = document.getElementById('listNote');
  inviteNote = document.getElementById('inviteNote');

  const config = {
    //Oops! This is gone!
  };
  firebase.initializeApp(config);
  firebase.analytics();

  console.log("Logging in anonymously...");
  firebase.auth().signInAnonymously().catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      // ...
    } else {
      // User is signed out.
      // ...
    }
    // ...
  });


  window.addEventListener("online", function(){
    console.log("Online mode activated, clearing offline notification");
    offlineModal.style.display = "none";
  });

  window.addEventListener("offline", function() {
    var now = 0;
    console.log("Offline mode activated");
    var g = setInterval(function(){
      now = now + 1000;
      if(now >= 5000){
        try{
          document.getElementById("TestGift").innerHTML = "Loading Failed, Please Connect To Internet";
        } catch(err){
          console.log("Loading Element Missing");
        }
        console.log("Offline mode notified, showing offline notification");
        offlineModal.style.display = "block";
        clearInterval(g);
      }
    }, 1000);
  });

  //close offlineModal on close
  offlineSpan.onclick = function() {
    console.log("Offline modal closed: Closed manually");
    offlineModal.style.display = "none";
  };

  //close offlineModal on click
  window.onclick = function(event) {
    if (event.target == offlineModal) {
      console.log("Offline modal closed: Outside of modal");
      offlineModal.style.display = "none";
    }
  };

  databaseQuery();

  /*
  Things to do here:
  View Friend's Gifts and buy/unbuy the items! Each item can be seen as bought or not without opening the gift modal

  */
  function databaseQuery() {

    var now = 0;
    console.log("Loading Timer Active");
    load = setInterval(function(){
      now = now + 1000;
      if(now >= 10000){
        try{
          document.getElementById("TestGift").innerHTML = "Loading Failed, You Must Not Have Any Friends!";
        } catch(err){
          console.log("Loading Element Missing");
        }

        backBtn.innerHTML = "Back To Lists";
        backBtn.onclick = function() {
          sessionStorage.setItem("validUser", currentUser);
          window.location.href = "lists.html";
        };

        testGiftInt--;
        console.log("Loading Notification Deployed");
        clearInterval(load);
      }
    }, 1000);

    var userBase = firebase.database().ref("users/");
    var userInitial = firebase.database().ref("users/" + user);
    var userInvites = firebase.database().ref("users/" + user + "/invites");
    var userList = firebase.database().ref("users/" + user + "/lists");
    var userGifts = firebase.database().ref("users/" + user + "/giftList");



    var fetchGifts = function (postRef) {
      postRef.on('child_added', function (data) {
        if(data.key == user){
          giftArr = data.val().giftList;
          console.log("Loading " + user + "\'s List");
          try {
            if (giftArr.length == 0) {
              deployGiftListEmptyNotification();
            }
          } catch (err) {//giftList does not exist at all
            deployGiftListEmptyNotification();
          }
        }
      });

      postRef.on('child_changed', function (data) {
        var duplicateInt = 0;
        if(data.key == user){
          updatedGiftArr = data.val().giftList;
          console.log("Updated " + user + "\'s List");
          if(updatedGiftArr.length < giftArr.length){
            console.log("Updated Gift List Size Change Detected...");
            console.log(giftArr.length + " -> " + updatedGiftArr.length);
            console.log("Attempting to find change in data...");
            for(var i = updatedGiftArr.length; i >= 0; i++) {
              console.log("i: " + updatedGiftArr[i] + " " + i);
              for(var a = giftArr.length; a >= 0; a++) {//trying to find duplicates...
                console.log("a: " + giftArr[a] + " " + a);
                if(giftArr[a].title == updatedGiftArr[i].title){
                  duplicateInt++;
                  console.log("Duplicate? " + giftArr[a].title);
                }
                if(duplicateInt > 1){
                  console.log("Duplicate detected: " + giftArr[a].title);
                }
              }
              duplicateInt = 0;
            }
          }
          try {
            if(updatedGiftArr.length == 0){
              console.log("Updated List Still Empty, 1");
            }
          } catch (err) {
            console.log("Updated List Still Empty, 2");
          }
        }
      })
    };

    var fetchPosts = function (postRef) {
      console.log("Fetching...");
      postRef.on('child_added', function (data) {
        console.log("Child found: " + data.val().title);
        giftDescription = data.val().description;
        giftLink = data.val().link;
        giftReceived = data.val().received;
        giftTitle = data.val().title;
        giftUid = data.key;
        giftWhere = data.val().where;
        giftBuyer = data.val().buyer;
        receivedList.push(giftReceived);
        createGiftElement(giftDescription, giftLink, giftReceived, giftTitle, giftUid, giftWhere, giftBuyer);
      });

      postRef.on('child_changed', function (data) {
        console.log("Data of " + data.val().title + " changed");
        giftDescription = data.val().description;
        giftLink = data.val().link;
        giftReceived = data.val().received;
        giftTitle = data.val().title;
        giftUid = data.key;
        giftWhere = data.val().where;
        giftBuyer = data.val().buyer;

        changeGiftElement(giftDescription, giftLink, giftReceived, giftTitle, giftUid, giftWhere, giftBuyer);

        modal = document.getElementById('giftModal');
        console.log(currentModalOpen + " " + giftUid);
        if(modal.style.display == "block" && currentModalOpen == giftUid && giftReceived != 1 && giftReceived != 0){
          modal.style.display = "none";
          noteInfoField.innerHTML = giftTitle + " was edited, please click on the gift to view the changes";
          noteTitleField.innerHTML = giftTitle + " has been changed, please reopen the gift!";
          noteModal.style.display = "block";
          console.log("Gift Refresh Notified");

          //close on close
          noteSpan.onclick = function () {
            noteModal.style.display = "none";
          };

          //close on click
          window.onclick = function (event) {
            if (event.target == noteModal) {
              noteModal.style.display = "none";
            }
          };

          var nowJ = 0;
          var j = setInterval(function () {
            nowJ = nowJ + 1000;
            if (nowJ >= 7000) {
              console.log("Gift Delete Notification Removed");
              noteModal.style.display = "none";
              clearInterval(j);
            }
          }, 1000);
          receivedChangedBool = false;
        }
      });

      postRef.on('child_removed', function (data) {
        console.log("Data of " + data.val().title + " removed");
        giftUid = data.key;
        //removeGiftElement(giftUid);
      });

    };

    var fetchInvites = function (postRef) {
      console.log("Fetching...");
      postRef.on('child_added', function (data) {
        //add user to array
        //change list button to red
        inviteNote.style.background = "#ff3923";
        console.log("Invites found");
      });

      postRef.on('child_changed', function (data) {
      });

      postRef.on('child_removed', function (data) {
        //remove user from array
      });
    };

    fetchGifts(userBase);
    fetchPosts(userGifts);
    //fetchInvites(userInvites);

    listeningFirebaseRefs.push(userGifts);
    listeningFirebaseRefs.push(userInvites);
  }

  //Creates gift item for database
  function createGiftElement(giftDescription, giftLink, giftReceived, giftTitle, giftUid, giftWhere, giftBuyer){

    console.log("Loading... " + giftTitle + ": " + giftUid);
    var liItem = document.createElement("LI");
    liItem.id = "gift" + giftUid;
    liItem.className = "gift";
    if(giftReceived == 1) {
      liItem.className += " checked";
      console.log("Checked, created");
    }
    liItem.onclick = function (){
      currentModalOpen = giftUid;
      var spanGift = document.getElementsByClassName("close")[0];
      modal = document.getElementById('giftModal');
      noteModal = document.getElementById('notificationModal');
      var buyBtn = document.getElementById('giftBuy');
      var dontBuyBtn = document.getElementById('giftDontBuy');
      var descField = document.getElementById('giftDescription');
      //var receivedField = document.getElementById('giftReceived');
      var boughtField = document.getElementById('giftBought');
      var titleField = document.getElementById('giftTitle');
      var whereField = document.getElementById('giftWhere');
      var linkField = document.getElementById('giftLink');

      noteTitleField = document.getElementById('notificationTitle');
      noteInfoField = document.getElementById('notificationInfo');

      console.log("description: " + giftDescription);
      console.log("link: " + giftLink);
      console.log("received: " + giftReceived);
      console.log("title: " + giftTitle);
      console.log("uid: " + giftUid);
      console.log("where: " + giftWhere);



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
      if(giftReceived == 1){
        if(giftBuyer == "" || giftBuyer == null || giftBuyer == undefined){
          boughtField.innerHTML = "This gift has been bought";
        } else {
          boughtField.innerHTML = "This gift was bought by " + giftBuyer;
        }
      } else {
        boughtField.innerHTML = "This gift has not been bought yet";
      }
      buyBtn.onclick = function(){
        firebase.database().ref("users/" + user + "/giftList/" + giftUid).update({
          received: 1,
          buyer: currentUser.key
        });
      };
      dontBuyBtn.onclick = function(){
        firebase.database().ref("users/" + user + "/giftList/" + giftUid).update({
          received: 0,
          buyer: ""
        });
      };

      //show modal
      modal.style.display = "block";

      //close on close
      spanGift.onclick = function() {
        modal.style.display = "none";
        currentModalOpen = "";
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
          currentModalOpen = "";
        }
      }
    };
    var textNode = document.createTextNode(giftTitle);
    liItem.appendChild(textNode);

    giftList.insertBefore(liItem, document.getElementById("giftListContainer").childNodes[0]);

    if(testGiftInt <= 0) {
      backBtn.innerHTML = "Back To Lists";
      document.getElementById("TestGift").remove();
      console.log("Loading timer cancelled");
      console.log("Offline timer cancelled");
      console.log("TestGift removed");
      testGiftInt=1;
      clearInterval(offline);
      clearInterval(load);

      backBtn.onclick = function() {
        sessionStorage.setItem("validUser", currentUser);
        window.location.href = "lists.html";
      };
    }
  }

  function changeGiftElement(description, link, received, title, uid, where, buyer) {
    var editGift = document.getElementById("gift" + uid);
    editGift.innerHTML = title;
    editGift.className = "gift";
    if(received == 1) {
      editGift.className += " checked";
      console.log("Checked, changed");
    }
    editGift.onclick = function (){
      currentModalOpen = uid;
      var spanGift = document.getElementsByClassName("close")[0];
      modal = document.getElementById('giftModal');
      noteModal = document.getElementById('notificationModal');
      var buyBtn = document.getElementById('giftBuy');
      var dontBuyBtn = document.getElementById('giftDontBuy');
      var descField = document.getElementById('giftDescription');
      //var receivedField = document.getElementById('giftReceived');
      var boughtField = document.getElementById('giftBought');
      var titleField = document.getElementById('giftTitle');
      var whereField = document.getElementById('giftWhere');
      var linkField = document.getElementById('giftLink');

      noteTitleField = document.getElementById('notificationTitle');
      noteInfoField = document.getElementById('notificationInfo');

      console.log("description: " + description);
      console.log("link: " + link);
      console.log("received: " + received);
      console.log("title: " + title);
      console.log("uid: " + uid);
      console.log("where: " + where);



      if (link != ""){
        linkField.innerHTML = "Click me to go to the webpage!";
        linkField.onclick = function() {
          var newGiftLink = "http://";
          if(link.includes("https://")){
            link = link.slice(8, link.length);
          } else if (giftLink.includes("http://")){
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
      if(received == 1){
        if(buyer == "" || buyer == null || buyer == undefined){
          boughtField.innerHTML = "This gift has been bought";
        } else {
          boughtField.innerHTML = "This gift was bought by " + buyer;
        }
      } else {
        boughtField.innerHTML = "This gift has not been bought yet";
      }
      buyBtn.onclick = function(){
        firebase.database().ref("users/" + user + "/giftList/" + uid).update({
          received: 1,
          buyer: currentUser.key
        });
      };
      dontBuyBtn.onclick = function(){
        firebase.database().ref("users/" + user + "/giftList/" + uid).update({
          received: 0,
          buyer: ""
        });
      };

      //show modal
      modal.style.display = "block";

      //close on close
      spanGift.onclick = function() {
        modal.style.display = "none";
        currentModalOpen = "";
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
          currentModalOpen = "";
        }
      };
    };
  }

  function deployGiftListEmptyNotification(){
    try{
      document.getElementById("TestGift").innerHTML = "No Gifts Found! Add Some Gifts With The Button Below!";
    } catch(err){
      console.log("Loading Element Missing");
    }

    backBtn.innerHTML = "Add New Gift";
    backBtn.onclick = function() {
      giftStorage = "";
      sessionStorage.setItem("giftStorage", giftStorage);
      window.location.href = "giftAddUpdate.html";
    };

    testGiftInt--;
    console.log("Loading Notification Deployed");
    clearInterval(load);
  }

  function refreshModal(modal){
    modal.style.display = "none";
    modal.style.display = "block";
  }

  function removeGiftElement(uid) {
    document.getElementById("gift" + uid).remove();
  }
};

function signOut(){
  sessionStorage.clear();
  window.location.href = "index.html";
}

function navigation(nav){
  sessionStorage.setItem("validUser", currentUser);
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
