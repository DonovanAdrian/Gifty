var listeningFirebaseRefs = [];
var giftArr = [];
var updatedGiftArr = [];
var inviteArr = [];
var updatedInviteArr = [];

var cleanedItems = "";

var giftCounter = 0;
var updatedArrMode = 0;
var onlineInt = 0;

var giftList;
var giftListHTML;
var offline;
var giftStorage;
var backBtn;
var offlineSpan;
var offlineModal;
var user;
var offlineTimer;
var modal;
var noteModal;
var noteSpan;
var noteInfoField;
var noteTitleField;
var listNote;
var inviteNote;
var userBase;
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

    var fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        onlineInt = 1;
        //--------------------------------------------------------------------------------Fetch Gifts
        if(data.key == "giftList") {
          giftArr = data.val();

          if (giftArr.length == 0) {//giftList exists, but is empty
            deployGiftListEmptyNotification();
          } else {//giftList exists and needs to be loaded into list
            for (var i = 0; i < giftArr.length; i++) {
              createGiftElement(giftArr[i].description, giftArr[i].link, giftArr[i].received, giftArr[i].title,
                giftArr[i].key, giftArr[i].where);
            }
            console.log("Gift List Loaded");
          }
        }
        //--------------------------------------------------------------------------------Fetch Invites
        if(data.key == "invites") {
          inviteArr = data.val();

          if(inviteArr.length != 0) {//inviteList exists
            inviteNote.style.background = "#ff3923";
            console.log("Invites found");
          }
        }
      });

      postRef.on('child_changed', function(data) {
        var updatedNode;
        var updateError = 0;
        if(data.key == "giftList") {
          updatedGiftArr = data.val();
          updatedNode = arrayDifferences(giftArr, updatedGiftArr);

          if (updatedArrMode == 1) {//delete
            removeGiftElement(giftArr[updatedNode].uid);
            giftArr.splice(updatedNode, 1);
            if(giftArr.length == 0){
              console.log("Gift List Empty");
              deployGiftListEmptyNotification();
            }
          } else if (updatedArrMode == 2) {//update
            giftArr[updatedNode] = updatedGiftArr[updatedNode];
            changeGiftElement(giftArr[updatedNode].description, giftArr[updatedNode].link,
              giftArr[updatedNode].received, giftArr[updatedNode].title,
              giftArr[updatedNode].key, giftArr[updatedNode].where);
          } else {
            console.log("Gift Update Error");
            updateError++;
          }
          updatedArrMode = 0;

          if (updateError == 0)
            console.log("Data Updated Successfully");
          else
            console.log("Data Not Updated... Please Advise");
        }

        if(data.key == "invites") {
          var updateError = 0;
          updatedInviteArr = data.val();
          updatedNode = arrayDifferences(inviteArr, updatedInviteArr);

          if(updatedArrMode == 1){
            inviteArr.splice(updatedNode, 1);
            if(inviteArr.length == 0){
              console.log("Invite List Empty");
              inviteNote.style.background = "#008222";
            }
          } else if (updatedArrMode == 2){
            inviteArr[updatedNode] = updatedInviteArr[updatedNode];
          } else {
            console.log("Invite Update Error");
            updateError++;
          }
          updatedArrMode = 0;

          if (updateError == 0)
            console.log("Data Updated Successfully");
          else
            console.log("Data Not Updated... Please Advise");
        }
      });

      postRef.on('child_removed', function(data) {
        if (data.key == "giftList") {
          deployGiftListEmptyNotification();
        }

        if (data.key == "invites") {
          console.log("Invite List Removed");
          if (inviteArr.length == 0) {
            inviteNote.style.background = "#008222";
          }
        }
      });
    };

    fetchData(userBase);

    listeningFirebaseRefs.push(userBase);
  }

  function arrayDifferences(arr1, arr2) {
    var tempArr = arr1;
    if (arr1.length != arr2.length) {//item was removed
      updatedArrMode = 1;
    } else {//item was updated
      updatedArrMode = 2;
    }
    for (var a = 0; a < arr1.length; a++) {
      for (var b = 0; b < arr2.length; b++) {
        if(arr1[a] == arr2[b]){
          console.log(arr1);
          console.log("Removing: " + arr1[a]);
          arr1.splice(a, 1);
          console.log(arr1);
          a--;//adjust "a" value to account for new arr1 size
          break;
        }
      }
    }

    return tempArr.indexOf(arr1[0]);
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
    console.log("Removing " + uid + " from local list...");
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
