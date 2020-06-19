var listeningFirebaseRefs = [];
var giftArr = [];
var inviteArr = [];

var onlineInt = 0;

var giftList;
var giftListHTML;
var offline;
var backBtn;
var offlineSpan;
var offlineModal;
var user;
var modal;
var noteModal;
var noteSpan;
var noteInfoField;
var noteTitleField;
var listNote;
var inviteNote;
var currentUser;
var offlineTimer;
var userBase;
var userInvites;
var userGifts;



function getCurrentUser(){
  user = sessionStorage.getItem("validGiftUser");
  currentUser = sessionStorage.getItem("validUser");
  if(currentUser == null || currentUser == undefined){
    window.location.href = "index.html";
  } else {
    console.log("User: " + currentUser.key + " logged in");
    console.log("Friend: " + user.key + " loaded in");
    if (user.giftList == undefined) {
      deployGiftListEmptyNotification();
    } else if (user.invites.length != 0) {
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
  backBtn = document.getElementById('backBtn');
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
            document.getElementById("TestGift").innerHTML = "No Gifts Found! Your Friend Must Not Have Any Gifts!";
          }
        } catch(err){
          console.log("Loading Element Missing, Creating A New One");
          var liItem = document.createElement("LI");
          liItem.id = "TestGift";
          liItem.className = "gift";
          if (onlineInt == 0) {
            var textNode = document.createTextNode("Loading Failed, Please Connect To Internet");
          } else {
            var textNode = document.createTextNode("No Gifts Found! Your Friend Must Not Have Any Gifts!");
          }
          liItem.appendChild(textNode);
          giftList.insertBefore(liItem, document.getElementById("giftListContainer").childNodes[0]);
        }
        offlineModal.style.display = "block";
        clearInterval(offlineTimer);
      }
    }, 1000);
  });

  //initialize back button
  backBtn.innerHTML = "Back To Lists";
  backBtn.onclick = function() {
    sessionStorage.setItem("validUser", currentUser);
    window.location.href = "lists.html";
  };

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

  function databaseQuery() {

    userBase = firebase.database().ref("users/" + user.key);
    userGifts = firebase.database().ref("users/" + user.key + "/giftList");
    userInvites = firebase.database().ref("users/" + currentUser.key + "/invites");

    var fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        onlineInt = 1;
      });
    };

    var fetchGifts = function (postRef) {
      postRef.on('child_added', function (data) {
        giftArr.push(data.val());

        createGiftElement(data.val().description, data.val().link, data.val().received, data.val().title,
          data.key, data.val().where, data.val().buyer);
      });

      postRef.on('child_changed', function(data) {
        console.log(giftArr);
        giftArr[data.key] = data.val();
        console.log(giftArr);

        changeGiftElement(data.val().description, data.val().link, data.val().received, data.val().title,
          data.key, data.val().where, data.val().buyer);
      });

      postRef.on('child_removed', function(data) {
        console.log(giftArr);
        giftArr.splice(data.key, 1);
        console.log(giftArr);
        removeGiftElement(data.key);

        if (giftArr.length == 0) {
          deployGiftListEmptyNotification();
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

    fetchData(userBase);
    fetchGifts(userGifts);
    fetchInvites(userInvites);

    listeningFirebaseRefs.push(userBase);
    listeningFirebaseRefs.push(userGifts);
    listeningFirebaseRefs.push(userInvites);
  }

  function createGiftElement(giftDescription, giftLink, giftReceived, giftTitle, giftUid, giftWhere, giftBuyer){
    try{
      document.getElementById("TestGift").remove();
    } catch (err) {}

    giftCounter++;

    var liItem = document.createElement("LI");
    liItem.id = "gift" + giftUid;
    liItem.className = "gift";
    if(giftReceived == 1) {
      liItem.className += " checked";
      console.log("Checked, created");
    }
    liItem.onclick = function (){
      var spanGift = document.getElementsByClassName("close")[0];
      modal = document.getElementById('giftModal');
      noteModal = document.getElementById('notificationModal');
      var buyBtn = document.getElementById('giftBuy');
      var dontBuyBtn = document.getElementById('giftDontBuy');
      var descField = document.getElementById('giftDescription');
      var boughtField = document.getElementById('giftBought');
      var titleField = document.getElementById('giftTitle');
      var whereField = document.getElementById('giftWhere');
      var linkField = document.getElementById('giftLink');

      noteTitleField = document.getElementById('notificationTitle');
      noteInfoField = document.getElementById('notificationInfo');

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
      var spanGift = document.getElementsByClassName("close")[0];
      modal = document.getElementById('giftModal');
      noteModal = document.getElementById('notificationModal');
      var buyBtn = document.getElementById('giftBuy');
      var dontBuyBtn = document.getElementById('giftDontBuy');
      var descField = document.getElementById('giftDescription');
      var boughtField = document.getElementById('giftBought');
      var titleField = document.getElementById('giftTitle');
      var whereField = document.getElementById('giftWhere');
      var linkField = document.getElementById('giftLink');

      noteTitleField = document.getElementById('notificationTitle');
      noteInfoField = document.getElementById('notificationInfo');

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
  }
};

function deployGiftListEmptyNotification(){
  try{
    document.getElementById("TestGift").innerHTML = "No Gifts Found! Your Friend Must Not Have Any Gifts!";
  } catch(err){
    console.log("Loading Element Missing, Creating A New One");
    var liItem = document.createElement("LI");
    liItem.id = "TestGift";
    liItem.className = "gift";
    var textNode = document.createTextNode("No Gifts Found! Your Friend Must Not Have Any Gifts!");
    liItem.appendChild(textNode);
    giftList.insertBefore(liItem, document.getElementById("giftListContainer").childNodes[0]);
  }

  backBtn.innerHTML = "Back To Lists";
  backBtn.onclick = function() {
    sessionStorage.setItem("validUser", currentUser);
    window.location.href = "lists.html";
  };

  clearInterval(offlineTimer);
}

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
