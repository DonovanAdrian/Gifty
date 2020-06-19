var listeningFirebaseRefs = [];
var giftArr = [];
var inviteArr = [];

var cleanedItems = "";

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
var offlineTimer;



function getCurrentUser(){
  user = sessionStorage.getItem("validUser");
  if(user === null || user == undefined){
    window.location.href = "index.html";
  } else {
    console.log("User: " + user.key + " logged in");
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

  cleanArrays();

  function databaseQuery() {

    userBase = firebase.database().ref("users/" + user.key);
    userGifts = firebase.database().ref("users/" + user.key + "/giftList");
    userInvites = firebase.database().ref("users/" + user.key + "/invites");

    var fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        onlineInt = 1;
      });
    };

    var fetchGifts = function (postRef) {
      postRef.on('child_added', function (data) {
        giftArr.push(data.val());

        createGiftElement(data.val().description, data.val().link, data.val().received, data.val().title,
          data.key, data.val().where);
      });

      postRef.on('child_changed', function(data) {
        console.log(giftArr);
        giftArr[data.key] = data.val();
        console.log(giftArr);

        changeGiftElement(data.val().description, data.val().link, data.val().received, data.val().title,
          data.key, data.val().where);
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

  function cleanArrays(){
    if (giftArr != undefined) {
      console.log(giftArr);
      deleteUndefinedObjects(giftArr, undefined, "gift");
      console.log(giftArr);
      /*
      firebase.database().ref("users/" + user.key).update({
        giftList: giftArr
      });
      */
    }

    if (inviteArr != undefined) {
      console.log(inviteArr);
      deleteUndefinedObjects(inviteArr, undefined, "invite");
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

  function createGiftElement(giftDescription, giftLink, giftReceived, giftTitle, giftUid, giftWhere){
    try{
      document.getElementById("TestGift").remove();
    } catch (err) {}

    giftCounter++;

    var liItem = document.createElement("LI");
    liItem.id = "gift" + giftUid;
    liItem.className = "gift";
    liItem.onclick = function (){
      var spanGift = document.getElementsByClassName("close")[0];
      modal = document.getElementById('giftModal');
      noteModal = document.getElementById('notificationModal');
      var updateBtn = document.getElementById('giftUpdate');
      var deleteBtn = document.getElementById('giftDelete');
      var descField = document.getElementById('giftDescription');
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
      updateBtn.onclick = function(){
        updateGiftElement(giftUid);
      };
      deleteBtn.onclick = function(){
        deleteGiftElement(giftUid, giftTitle);
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

  function changeGiftElement(description, link, received, title, uid, where) {
    var editGift = document.getElementById("gift" + uid);
    editGift.innerHTML = title;
    editGift.className = "gift";
    editGift.onclick = function (){
      var spanGift = document.getElementsByClassName("close")[0];
      modal = document.getElementById('giftModal');
      noteModal = document.getElementById('notificationModal');
      var updateBtn = document.getElementById('giftUpdate');
      var deleteBtn = document.getElementById('giftDelete');
      var descField = document.getElementById('giftDescription');
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
      updateBtn.onclick = function(){
        updateGiftElement(uid);
      };
      deleteBtn.onclick = function(){
        deleteGiftElement(uid, title);
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

  function updateGiftElement(uid) {
    giftStorage = uid;
    sessionStorage.setItem("giftStorage", giftStorage);
    window.location.href = "giftAddUpdate.html";
  }

  function deleteGiftElement(uid, title) {
    var verifyDeleteBool = true;
    var maxLength = giftArr.length - 1;
    var toDelete = -1;

    for (var i = 0; i < giftArr.length; i++){
      if(giftArr[i].key == uid) {
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
      firebase.database().ref("users/" + user).update({
        giftList: giftArr
      });
      
      removeGiftElement(maxLength);

      giftCounter--;
      if(giftCounter == 0){
        deployGiftListEmptyNotification();
      }

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

  backBtn.innerHTML = "Add New Gift";
  backBtn.onclick = function() {
    giftStorage = "";
    sessionStorage.setItem("giftStorage", giftStorage);
    window.location.href = "giftAddUpdate.html";
  };

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
