var listeningFirebaseRefs = [];
var giftArr = [];

var giftPresent = true;

var offline;
var giftList;
var giftStorage;
var offlineSpan;
var offlineModal;
var user;
var descField;
var titleField;
var whereField;
var linkField;
var spanUpdate;
var currentGift;
var userGifts;



function getCurrentUser(){
  user = sessionStorage.getItem("validUser");
  if(user == null || user == undefined){
    window.location.href = "index.html";
  } else {
    console.log("User: " + user.key + " logged in");
    giftStorage = sessionStorage.getItem("giftStorage");
    if(giftStorage == null || giftStorage == undefined || giftStorage == ""){
      giftPresent = false;
    } else {
      console.log("Gift: " + giftStorage + " found");
    }
  }
}

//Instantiates all data upon loading the webpage
window.onload = function instantiate() {

  giftList = document.getElementById("giftListContainer");
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById("closeOffline");
  descField = document.getElementById('giftDescriptionInp');
  titleField = document.getElementById('giftTitleInp');
  whereField = document.getElementById('giftWhereInp');
  linkField = document.getElementById('giftLinkInp');
  spanUpdate = document.getElementById('updateGift');
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
    console.log("Online mode activated, clearing offline notification");
    offlineModal.style.display = "none";
    location.reload();
  });

  window.addEventListener("offline", function() {
    var now = 0;
    var g = setInterval(function(){
      now = now + 1000;
      if(now >= 5000){
        offlineModal.style.display = "block";
        clearInterval(g);
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

  function databaseQuery() {

    userGifts = firebase.database().ref("users/" + user.key + "/giftList/");

    initializeData();

    var fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        giftArr.push(data);

        if(giftStorage == data.key) {
          if(giftPresent) {
            spanUpdate.innerHTML = "Update Gift";
            spanUpdate.onclick = function() {
              updateGiftToDB();
            }
          } else {
            spanUpdate.innerHTML = "Add New Gift";
            spanUpdate.onclick = function() {
              addGiftToDB();
            }
          }
        }
      });

      postRef.on('child_changed', function (data) {
        console.log(giftArr);
        giftArr[data.key] = data;
        console.log(giftArr);
      });

      postRef.on('child_removed', function (data) {
        console.log(giftArr);
        giftArr.splice(data.key, 1);
        console.log(giftArr);
      });

    };

    fetchData(userGifts);

    listeningFirebaseRefs.push(userGifts);
  }

  function initializeData() {
    if(giftPresent) {
      getGift();

      titleField.value = currentGift.title;
      if (currentGift.link == "")
        linkField.placeholder = "No Link Was Provided";
      else
        linkField.value = currentGift.link;
      if (currentGift.where == "")
        whereField.placeholder = "No Location Was Provided";
      else
        whereField.value = currentGift.where;
      if (currentGift.description == "")
        descField.placeholder = "No Description Was Provided";
      else
        descField.value = currentGift.description;
    }
  }

  function getGift() {
    for (var i = 0; i < user.giftList.length; i++){
      if(user.giftList[i] == giftStorage){
        currentGift = user.giftList[i];
        break;
      }
    }
  }

  function updateGiftToDB(){
    if(titleField.value === "")
      alert("It looks like you left the title blank. Make sure you add a title so other people know what to get " +
        "you!");
    else {
      firebase.database().ref("users/" + user.key + "/giftList/" + uid).update({
        title: titleField.value,
        link: linkField.value,
        where: whereField.value,
        received: currentGift.received,
        uid: giftStorage,
        buyer: currentGift.buyer,
        description: descField.value
      });

      sessionStorage.setItem("validUser", user);
      window.location.href = "home.html";
    }
  }

  function addGiftToDB(){
    var uid = giftArr.length;

    if(titleField.value === "")
      alert("It looks like you left the title blank. Make sure you add a title so other people know what to get " +
        "you!");
    else {
      var newUid = firebase.database().ref("users/" + user.key + "/giftList/" + uid).push();
      newUid = newUid.toString();
      newUid = newUid.substr(77, 96);
      firebase.database().ref("users/" + user.key + "/giftList/" + uid).set({
        title: titleField.value,
        link: linkField.value,
        where: whereField.value,
        received: 0,
        uid: newUid,
        buyer: "",
        description: descField.value
      });

      sessionStorage.setItem("validUser", user);
      window.location.href = "home.html";
    }
  }
};

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
