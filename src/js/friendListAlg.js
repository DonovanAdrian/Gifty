/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let friendListElements = [];
let listeningFirebaseRefs = [];
let userArr = [];
let giftArr = [];
let inviteArr = [];
let userUserNames = [];

let readNotificationsBool = false;
let updateGiftToDBBool = false;
let giftListEmptyBool = false;

let onlineInt = 0;
let dataCounter = 0;
let loadingTimerInt = 0;
let moderationSet = -1;

let giftCreationDate;
let dataListContainer;
let backBtn;
let offlineSpan;
let offlineModal;
let giftUser;
let giftModal;
let giftTitle;
let giftLink;
let giftWhere;
let giftDescription;
let giftBought;
let giftBuy;
let giftDontBuy;
let notificationModal;
let notificationInfo;
let notificationTitle;
let noteSpan;
let listNote;
let inviteNote;
let notificationBtn;
let user;
let offlineTimer;
let loadingTimer;
let userBase;
let userGifts;
let userInvites;
let testGift;
let closeGiftModal;



function getCurrentUser(){
  try {
    moderationSet = sessionStorage.getItem("moderationSet");
    giftUser = JSON.parse(sessionStorage.validGiftUser);
    user = JSON.parse(sessionStorage.validUser);
    if(consoleOutput) {
      console.log("User: " + user.userName + " loaded in");
      console.log("Friend: " + giftUser.userName + " loaded in");
    }
    if (giftUser.giftList == undefined) {
      deployGiftListEmptyNotification();
      giftListEmptyBool = true;
    } else if (giftUser.giftList.length == 0) {
      deployGiftListEmptyNotification();
      giftListEmptyBool = true;
    }
    if (user.invites == undefined) {
      if(consoleOutput)
        console.log("Invites Not Found");
    } else if (user.invites != undefined) {
      if (user.invites.length > 0) {
        inviteNote.style.background = "#ff3923";
      }
    }

    if (user.readNotifications == undefined) {
      if(consoleOutput)
        console.log("Read Notifications Not Found");
    } else {
      readNotificationsBool = true;
    }

    if (user.notifications == undefined) {
      if(consoleOutput)
        console.log("Notifications Not Found");
    } else if (user.notifications != undefined) {
      if (readNotificationsBool){
        if (user.notifications.length > 0 && user.readNotifications.length != user.notifications.length) {
          notificationBtn.src = "img/bellNotificationOn.png";
          notificationBtn.onclick = function() {
            newNavigation(6);//Notifications
          }
        } else {
          notificationBtn.src = "img/bellNotificationOff.png";
          notificationBtn.onclick = function() {
            newNavigation(6);//Notifications
          }
        }
      } else if (user.notifications.length > 0) {
        notificationBtn.src = "img/bellNotificationOn.png";
        notificationBtn.onclick = function() {
          newNavigation(6);//Notifications
        }
      }
    }
    userArr = JSON.parse(sessionStorage.userArr);
  } catch (err) {
    if(consoleOutput)
      console.log(err.toString());
    window.location.href = "index.html";
  }
}

window.onload = function instantiate() {

  notificationBtn = document.getElementById('notificationButton');
  dataListContainer = document.getElementById('dataListContainer');
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  noteSpan = document.getElementById('closeNotification');
  backBtn = document.getElementById('backBtn');
  listNote = document.getElementById('listNote');
  inviteNote = document.getElementById('inviteNote');
  notificationModal = document.getElementById('notificationModal');
  notificationTitle = document.getElementById('notificationTitle');
  notificationInfo = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  giftModal = document.getElementById('giftModal');
  closeGiftModal = document.getElementById('closeGiftModal');
  giftTitle = document.getElementById('giftTitle');
  giftLink = document.getElementById('giftLink');
  giftWhere = document.getElementById('giftWhere');
  giftDescription = document.getElementById('giftDescription');
  giftBought = document.getElementById('giftBought');
  giftCreationDate = document.getElementById('giftCreationDate');
  giftBuy = document.getElementById('giftBuy');
  giftDontBuy = document.getElementById('giftDontBuy');
  testGift = document.getElementById('testGift');
  friendListElements = [notificationBtn, dataListContainer, offlineModal, offlineSpan, noteSpan, backBtn, listNote,
    inviteNote, notificationModal, notificationTitle, notificationInfo, noteSpan, giftModal, closeGiftModal, giftTitle,
    giftLink, giftWhere, giftDescription, giftBought, giftCreationDate, giftBuy, giftDontBuy, testGift];
  verifyElementIntegrity(friendListElements);
  getCurrentUser();
  commonInitialization();

  for(let i = 0; i < userArr.length; i++){
    userUserNames.push(userArr[i].userName);
  }

  //initialize back button
  backBtn.innerHTML = "Back To Lists";
  backBtn.onclick = function() {
    if(moderationSet == 1){
      newNavigation(14);//Moderation
    } else {
      newNavigation(3);//Lists
    }
  };

  loadingTimer = setInterval(function(){
    loadingTimerInt = loadingTimerInt + 1000;
    if(loadingTimerInt >= 2000){
      if (testGift == undefined){
        if(consoleOutput)
          console.log("TestGift Missing. Loading Properly.");
      } else if (!giftListEmptyBool) {
        testGift.innerHTML = "Loading... Please Wait...";
      }
      clearInterval(loadingTimer);
    }
  }, 1000);

  databaseQuery();

  friendListButton();

  function friendListButton(){
    let nowConfirm = 0;
    let alternator = 0;
    if(consoleOutput)
      console.log("Friend List Button Feature Active");
    setInterval(function(){
      nowConfirm = nowConfirm + 1000;
      if(nowConfirm >= 3000){
        nowConfirm = 0;
        if(alternator == 0) {
          alternator++;
          listNote.innerHTML = "Lists";
          listNote.style.background = "#00c606";
        } else {
          alternator--;
          listNote.innerHTML = "Public";
          listNote.style.background = "#00ad05";
        }
      }
    }, 1000);
  }

  function databaseQuery() {

    userBase = firebase.database().ref("users/");
    userGifts = firebase.database().ref("users/" + giftUser.uid + "/giftList");
    userInvites = firebase.database().ref("users/" + user.uid + "/invites");

    let fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        onlineInt = 1;

        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          if(consoleOutput)
            console.log("Adding " + userArr[i].userName + " to most updated version: " + data.val().userName);
          userArr[i] = data.val();
        }

        if(data.key == giftUser.uid){
          giftUser = data.val();
          if(consoleOutput)
            console.log("User Updated: 1");
        }
      });

      postRef.on('child_changed', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          if(consoleOutput)
            console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
          userArr[i] = data.val();
        }

        if(data.key == giftUser.uid){
          giftUser = data.val();
          if(consoleOutput)
            console.log("User Updated: 2");
        }
      });

      postRef.on('child_removed', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          if(consoleOutput)
            console.log("Removing " + userArr[i].userName + " / " + data.val().userName);
          userArr.splice(i, 1);
        }
      });
    };

    let fetchGifts = function (postRef) {
      postRef.on('child_added', function (data) {
        giftArr.push(data.val());

        if(checkGiftBuyer(data.val().buyer)){
          data.val().buyer = "";
          updateGiftToDBBool = true;
        }

        createGiftElement(data.val().description, data.val().link, data.val().received, data.val().title,
            data.key, data.val().where, data.val().buyer, data.val().uid, data.val().creationDate);

        if(updateGiftToDBBool){
          updateGiftError(data, data.key);
          updateGiftToDBBool = false;
        }
      });

      postRef.on('child_changed', function(data) {
        giftArr[data.key] = data.val();

        if(data.val().uid == currentModalOpen){//Moved currentModalOpen reference to common.js
          closeModal(giftModal);
        }

        changeGiftElement(data.val().description, data.val().link, data.val().received, data.val().title,
            data.key, data.val().where, data.val().buyer, data.val().uid, data.val().creationDate);
      });

      postRef.on('child_removed', function(data) {
        sessionStorage.setItem("validGiftUser", JSON.stringify(giftUser));
        sessionStorage.setItem("validUser", JSON.stringify(user));
        location.reload();
      });
    };

    let fetchInvites = function (postRef) {
      postRef.on('child_added', function (data) {
        inviteArr.push(data.val());

        inviteNote.style.background = "#ff3923";
      });

      postRef.on('child_changed', function (data) {
        if(consoleOutput)
          console.log(inviteArr);
        inviteArr[data.key] = data.val();
        if(consoleOutput)
          console.log(inviteArr);
      });

      postRef.on('child_removed', function (data) {
        if(consoleOutput)
          console.log(inviteArr);
        inviteArr.splice(data.key, 1);
        if(consoleOutput)
          console.log(inviteArr);

        if (inviteArr.length == 0) {
          if(consoleOutput)
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

  function findUIDItemInArr(item, userArray){
    for(let i = 0; i < userArray.length; i++){
      if(userArray[i].uid == item){
        if(consoleOutput)
          console.log("Found item: " + item);
        return i;
      }
    }
    return -1;
  }

  function checkGiftBuyer(buyer){
    let updateGiftToDB = true;

    if(consoleOutput)
      console.log("Checking for buyer error...");

    if(buyer == "" || buyer == null || buyer == undefined || userUserNames.includes(buyer)){
      updateGiftToDB = false;
      if(consoleOutput)
        console.log("No buyer error");
    } else {
      if(consoleOutput)
        console.log("Buyer error found!");
    }

    return updateGiftToDB;
  }

  function updateGiftError(giftData, giftKey){
    //alert("A gift needs to be updated! Key: " + giftKey);
    firebase.database().ref("users/" + giftUser.uid + "/giftList/" + giftKey).update({
      buyer: ""
    });
  }

  function createGiftElement(giftDescription, giftLink, giftReceived, giftTitle, giftKey, giftWhere, giftBuyer, giftUid,
                             giftDate){
    if(consoleOutput)
      console.log("Creating " + giftUid);
    try{
      testGift.remove();
    } catch (err) {}

    dataCounter++;

    let liItem = document.createElement("LI");
    liItem.id = "gift" + giftUid;
    liItem.className = "gift";
    if(giftReceived == 1) {
      liItem.className += " checked";
      if(consoleOutput)
        console.log("Checked, created");
    }
    liItem.onclick = function (){
      if (giftLink != ""){
        giftLink.innerHTML = "Click me to go to the webpage!";
        giftLink.onclick = function() {
          let newGiftLink = "http://";
          if(giftLink.includes("https://")){
            giftLink = giftLink.slice(8, giftLink.length);
          } else if (giftLink.includes("http://")){
            giftLink = giftLink.slice(7, giftLink.length);
          }
          newGiftLink += giftLink;
          window.open(newGiftLink, "_blank");
        };
      } else {
        giftLink.innerHTML = "There was no link provided";
        giftLink.onclick = function() {
        };
      }
      if(giftDescription != "") {
        giftDescription.innerHTML = "Description: " + giftDescription;
      } else {
        giftDescription.innerHTML = "There was no description provided";
      }
      giftTitle.innerHTML = giftTitle;
      if(giftWhere != "") {
        giftWhere.innerHTML = "This can be found at: " + giftWhere;
      } else {
        giftWhere.innerHTML = "There was no location provided";
      }
      if(giftReceived == 1){
        if(giftBuyer == "" || giftBuyer == null || giftBuyer == undefined){
          giftBought.innerHTML = "This gift has been bought";
        } else {
          giftBought.innerHTML = "This gift was bought by " + giftBuyer;
        }
      } else {
        giftBought.innerHTML = "This gift has not been bought yet";
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
      giftBuy.onclick = function(){
        if (giftReceived == 0) {
          firebase.database().ref("users/" + giftUser.uid + "/giftList/" + giftKey).update({
            received: 1,
            buyer: user.userName
          });
        } else {
          alert("This gift has already been marked as bought!");
        }
      };
      giftDontBuy.onclick = function(){
        if (giftReceived == 1) {
          if (giftBuyer == user.userName || giftBuyer == "") {
            firebase.database().ref("users/" + giftUser.uid + "/giftList/" + giftKey).update({
              received: 0,
              buyer: ""
            });
          } else {
            alert("Only the buyer, " + giftBuyer + ", can \"Un-Buy\" this gift. Please contact them to undo this action " +
                "if this has been done in error.");
          }
        } else {
          alert("This gift has already been marked as \"Un-Bought\"!");
        }
      };

      //show modal
      openModal(giftModal, giftUid);

      //close on close
      closeGiftModal.onclick = function() {
        closeModal(giftModal);
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == giftModal) {
          closeModal(giftModal);
        }
      };
    };
    let textNode = document.createTextNode(giftTitle);
    liItem.appendChild(textNode);

    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
    clearInterval(offlineTimer);
  }

  function changeGiftElement(description, link, received, title, key, where, buyer, uid, date) {
    let editGift = document.getElementById('gift' + uid);
    editGift.innerHTML = title;
    editGift.className = "gift";
    if(received == 1) {
      editGift.className += " checked";
      if(consoleOutput)
        console.log("Checked, changed");
    }
    editGift.onclick = function (){
      if (link != ""){
        giftLink.innerHTML = "Click me to go to the webpage!";
        giftLink.onclick = function() {
          let newGiftLink = "http://";
          if(link.includes("https://")){
            link = link.slice(8, link.length);
          } else if (link.includes("http://")){
            link = link.slice(7, link.length);
          }
          newGiftLink += link;
          window.open(newGiftLink, "_blank");
        };
      } else {
        giftLink.innerHTML = "There was no link provided";
        giftLink.onclick = function() {
        };
      }
      if(description != "") {
        giftDescription.innerHTML = "Description: " + description;
      } else {
        giftDescription.innerHTML = "There was no description provided";
      }
      giftTitle.innerHTML = title;
      if(where != "") {
        giftWhere.innerHTML = "This can be found at: " + where;
      } else {
        giftWhere.innerHTML = "There was no location provided";
      }
      if(received == 1){
        if(buyer == "" || buyer == null || buyer == undefined){
          giftBought.innerHTML = "This gift has been bought";
        } else {
          giftBought.innerHTML = "This gift was bought by " + buyer;
        }
      } else {
        giftBought.innerHTML = "This gift has not been bought yet";
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
      giftBuy.onclick = function(){
        if(received == 0) {
          firebase.database().ref("users/" + giftUser.uid + "/giftList/" + key).update({
            received: 1,
            buyer: user.userName
          });
        } else {
          alert("This gift has already been marked as bought!");
        }
      };
      giftDontBuy.onclick = function(){
        if(received == 1) {
          if (buyer == user.userName || buyer == "") {
            firebase.database().ref("users/" + giftUser.uid + "/giftList/" + key).update({
              received: 0,
              buyer: ""
            });
          } else {
            alert("Only the buyer, " + buyer + ", can \"Un-Buy\" this gift. Please contact them to undo this action " +
                "if this has been done in error.");
          }
        } else {
          alert("This gift has already been marked as \"Un-Bought\"!");
        }
      };

      //show modal
      openModal(giftModal, uid);

      //close on close
      closeGiftModal.onclick = function() {
        closeModal(giftModal);
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == giftModal) {
          closeModal(giftModal);
        }
      };
    };
  }

  function removeGiftElement(uid) {
    document.getElementById('gift' + uid).remove();

    dataCounter--;
    if (dataCounter == 0){
      deployGiftListEmptyNotification();
    }
  }
};

function deployGiftListEmptyNotification(){
  try{
    testGift.innerHTML = "No Gifts Found! Your Friend Must Not Have Any Gifts!";
  } catch(err){
    if(consoleOutput)
      console.log("Loading Element Missing, Creating A New One");
    let liItem = document.createElement("LI");
    liItem.id = "testGift";
    liItem.className = "gift";
    let textNode = document.createTextNode("No Gifts Found! Your Friend Must Not Have Any Gifts!");
    liItem.appendChild(textNode);
    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
  }

  clearInterval(offlineTimer);
}
