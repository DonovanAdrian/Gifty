/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let boughtGiftElements = [];
let listeningFirebaseRefs = [];
let inviteArr = [];
let userUserNames = [];
let userBoughtGiftsArr = [];
let userBoughtGiftsUsersArr = [];
let initializedGiftsArr = [];

let readNotificationsBool = false;

let dataCounter = 0;
let moderationSet = -1;
let commonLoadingTimerInt = 0;

let dataListContainer;
let backBtn;
let offlineSpan;
let offlineModal;
let user;
let giftTitleFld;
let giftLinkFld;
let giftWhereFld;
let giftDescriptionFld;
let giftCreationDateFld;
let giftModal;
let closeGiftModal;
let notificationModal;
let notificationInfo;
let notificationTitle;
let noteSpan;
let notificationBtn;
let inviteNote;
let homeNote;
let offlineTimer;
let commonLoadingTimer;
let testData;
let userInitial;
let userInvites;



function getCurrentUser(){
  let localConsoleOutput = false;

  try {
    user = JSON.parse(sessionStorage.validUser);
    if(user.moderatorInt == 1)
      localConsoleOutput = true;
    if(localConsoleOutput)
      console.log("User: " + user.userName + " loaded in");
    if (user.invites == undefined) {
      if(localConsoleOutput)
        console.log("Invites Not Found");
    } else if (user.invites != undefined) {
      if (user.invites.length > 0) {
        inviteNote.style.background = "#ff3923";
      }
    }

    if (user.readNotifications == undefined) {
      if(localConsoleOutput)
        console.log("Read Notifications Not Found");
    } else {
      readNotificationsBool = true;
    }

    if (user.readNotifications == undefined) {
      if(localConsoleOutput)
        console.log("Read Notifications Not Found");
    } else {
      readNotificationsBool = true;
    }

    if (user.notifications == undefined) {
      if(localConsoleOutput)
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
    userBoughtGiftsArr = JSON.parse(sessionStorage.boughtGifts);
    userBoughtGiftsUsersArr = JSON.parse(sessionStorage.boughtGiftsUsers);
  } catch (err) {
    if(localConsoleOutput)
      console.log(err.toString());
    window.location.href = "index.html";
  }
}

window.onload = function instantiate() {

  notificationBtn = document.getElementById('notificationBtn');
  dataListContainer = document.getElementById('dataListContainer');
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  backBtn = document.getElementById('backBtn');
  inviteNote = document.getElementById('inviteNote');
  homeNote = document.getElementById('homeNote');
  notificationModal = document.getElementById('notificationModal');
  notificationTitle = document.getElementById('notificationTitle');
  notificationInfo = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  giftTitleFld = document.getElementById('giftTitleFld');
  giftLinkFld = document.getElementById('giftLinkFld');
  giftWhereFld = document.getElementById('giftWhereFld');
  giftDescriptionFld = document.getElementById('giftDescriptionFld');
  giftCreationDateFld = document.getElementById('giftCreationDateFld');
  giftModal = document.getElementById('giftModal');
  closeGiftModal = document.getElementById('closeGiftModal');
  testData = document.getElementById('testData');
  boughtGiftElements = [notificationBtn, dataListContainer, offlineModal, offlineSpan, backBtn, inviteNote, homeNote,
    notificationModal, notificationTitle, notificationInfo, noteSpan, giftTitleFld, giftLinkFld, giftWhereFld,
    giftDescriptionFld, giftCreationDateFld, giftModal, closeGiftModal, testData];
  getCurrentUser();
  commonInitialization();
  verifyElementIntegrity(boughtGiftElements);

  for(let i = 0; i < userArr.length; i++){
    userUserNames.push(userArr[i].userName);
  }

  //initialize back button
  backBtn.innerHTML = "Back To Home";
  backBtn.onclick = function() {
    newNavigation(2);//Home
  };

  initializeGifts();

  databaseQuery();

  alternateButtonLabel(homeNote, "Home", "Bought");

  function initializeGifts(){

    if(userBoughtGiftsArr.length == userBoughtGiftsUsersArr.length) {
      for (let i = 0; i < userBoughtGiftsArr.length; i++) {
        createGiftElement(userBoughtGiftsArr[i], userBoughtGiftsUsersArr[i]);
        dataCounter++;
      }
    } else {
      alert("There has been a critical error, redirecting back home...");
      newNavigation(2);//Home
    }
  }

  function databaseQuery() {

    userInitial = firebase.database().ref("users/");
    userInvites = firebase.database().ref("users/" + user.uid + "/invites");

    let fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          checkGiftLists(data.val());
          userArr[i] = data.val();
        }

        if(data.key == user.uid){
          user = data.val();
          if(consoleOutput)
            console.log("User Updated: 1");
        }
      });

      postRef.on('child_changed', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          checkGiftLists(data.val());

          if(consoleOutput)
            console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
          userArr[i] = data.val();
        }

        if(data.key == user.uid){
          user = data.val();
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

    fetchData(userInitial);
    fetchInvites(userInvites);

    listeningFirebaseRefs.push(userInitial);
    listeningFirebaseRefs.push(userInvites);
  }

  function checkGiftLists(updatedUserData){
    let newGiftList = updatedUserData.giftList;
    let newPrivateGiftList = updatedUserData.privateList;

    if(newGiftList == undefined){}
    else if(newGiftList != undefined) {
      for (let i = 0; i < userBoughtGiftsArr.length; i++) {
        let a = findUIDItemInArr(userBoughtGiftsArr[i].uid, newGiftList);
        if (a != -1) {
          checkGiftData(userBoughtGiftsArr[i], newGiftList[a], updatedUserData.name);
        }
      }
    }

    if(newPrivateGiftList == undefined){}
    else if(newPrivateGiftList.length != undefined) {
      for (let i = 0; i < userBoughtGiftsArr.length; i++) {
        let a = findUIDItemInArr(userBoughtGiftsArr[i], newPrivateGiftList);
        if (a != -1) {
          checkGiftData(userBoughtGiftsArr[i], newPrivateGiftList[a], updatedUserData.name);
        }
      }
    }
  }

  function checkGiftData(currentGiftData, newGiftData, giftOwner){
    let updateGiftBool = false;
    if(currentGiftData.description != newGiftData.description) {
      updateGiftBool = true;
    }
    if(currentGiftData.link != newGiftData.link) {
      updateGiftBool = true;
    }
    if(currentGiftData.title != newGiftData.title) {
      updateGiftBool = true;
    }
    if(currentGiftData.where != newGiftData.where) {
      updateGiftBool = true;
    }

    if(updateGiftBool) {
      if (newGiftData.uid == currentModalOpen){//Moved currentModalOpen reference to common.js
        closeModal(giftModal);
      }
      changeGiftElement(newGiftData, giftOwner);
    }
  }

  function createGiftElement(giftData, giftOwner){
    try{
      testData.remove();
    } catch (err) {}

    let liItem = document.createElement("LI");
    liItem.id = "gift" + giftData.uid;
    initGiftElement(liItem, giftData, giftOwner);
    let textNode = document.createTextNode(giftData.title + " - for " + giftOwner);
    liItem.appendChild(textNode);

    dataListContainer.insertBefore(liItem, document.getElementById('dataListContainer').childNodes[0]);
    initializedGiftsArr.push(giftData.uid);
    clearInterval(commonLoadingTimer);
    clearInterval(offlineTimer);
  }

  function changeGiftElement(giftData, giftOwner){
    if(consoleOutput)
      console.log("Updating " + giftData.uid);
    let editGift = document.getElementById('gift' + giftData.uid);
    editGift.innerHTML = giftData.title + " - for " + giftOwner;
    initGiftElement(editGift, giftData, giftOwner);
  }

  function initGiftElement(liItem, giftData, giftOwner) {
    liItem.className = "gift";
    liItem.onclick = function (){
      if (giftData.link != ""){
        giftLinkFld.innerHTML = "Click me to go to the webpage!";
        giftLinkFld.onclick = function() {
          let newGiftLink = "http://";
          if(giftData.link.includes("https://")){
            giftData.link = giftData.link.slice(8, giftData.link.length);
          } else if (giftData.link.includes("http://")){
            giftData.link = giftData.link.slice(7, giftData.link.length);
          }
          newGiftLink += giftData.link;
          window.open(newGiftLink, "_blank");
        };
      } else {
        giftLinkFld.innerHTML = "There was no link provided";
        giftLinkFld.onclick = function() {};
      }
      if(giftData.description != "") {
        giftDescriptionFld.innerHTML = "Description: " + giftData.description;
      } else {
        giftDescriptionFld.innerHTML = "There was no description provided";
      }
      giftTitleFld.innerHTML = giftData.title + " - for " + giftOwner;
      if(giftData.where != "") {
        giftWhereFld.innerHTML = "This can be found at: " + giftData.where;
      } else {
        giftWhereFld.innerHTML = "There was no location provided";
      }
      if(giftData.creationDate != undefined) {
        if (giftData.creationDate != "") {
          giftCreationDateFld.innerHTML = "Created on: " + giftData.creationDate;
        } else {
          giftCreationDateFld.innerHTML = "Creation date not available";
        }
      } else {
        giftCreationDateFld.innerHTML = "Creation date not available";
      }

      //show modal
      openModal(giftModal, giftData.uid);

      //close on close
      closeGiftModal.onclick = function() {
        closeModal(giftModal);
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == giftModal) {
          closeModal(giftModal);
        }
      }
    };
  }
};
