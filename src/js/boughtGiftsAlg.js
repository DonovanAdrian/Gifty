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
let loadingTimerInt = 0;

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
let notificationModal;
let notificationInfo;
let notificationTitle;
let noteSpan;
let notificationBtn;
let inviteNote;
let homeNote;
let offlineTimer;
let loadingTimer;
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
  testData = document.getElementById('testData');
  boughtGiftElements = [notificationBtn, dataListContainer, offlineModal, offlineSpan, backBtn, inviteNote, homeNote,
    notificationModal, notificationTitle, notificationInfo, noteSpan, giftTitleFld, giftLinkFld, giftWhereFld,
    giftDescriptionFld, giftCreationDateFld, giftModal, testData];
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

  loadingTimer = setInterval(function(){
    loadingTimerInt = loadingTimerInt + 1000;
    if(loadingTimerInt >= 2000){
      if (testData == undefined){
        if(consoleOutput)
          console.log("TestData Missing. Loading Properly.");
      } else {
        testData.innerHTML = "Loading... Please Wait...";
      }
      clearInterval(loadingTimer);
    }
  }, 1000);

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
    let giftDescription = giftData.description;
    let giftLink = giftData.link;
    let giftTitle = giftData.title + " - for " + giftOwner;
    let giftWhere = giftData.where;
    let giftUid = giftData.uid;
    let giftDate = giftData.creationDate;

    try{
      testData.remove();
    } catch (err) {}

    let liItem = document.createElement("LI");
    liItem.id = "gift" + giftUid;
    liItem.className = "gift";
    liItem.onclick = function (){
      let spanGift = document.getElementsByClassName("close")[0];

      if (giftLink != ""){
        giftLinkFld.innerHTML = "Click me to go to the webpage!";
        giftLinkFld.onclick = function() {
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
        giftLinkFld.innerHTML = "There was no link provided";
        giftLinkFld.onclick = function() {
        };
      }
      if(giftDescription != "") {
        giftDescriptionFld.innerHTML = "Description: " + giftDescription;
      } else {
        giftDescriptionFld.innerHTML = "There was no description provided";
      }
      giftTitleFld.innerHTML = giftTitle;
      if(giftWhere != "") {
        giftWhereFld.innerHTML = "This can be found at: " + giftWhere;
      } else {
        giftWhereFld.innerHTML = "There was no location provided";
      }
      if(giftDate != undefined) {
        if (giftDate != "") {
          giftCreationDateFld.innerHTML = "Created on: " + giftDate;
        } else {
          giftCreationDateFld.innerHTML = "Creation date not available";
        }
      } else {
        giftCreationDateFld.innerHTML = "Creation date not available";
      }

      //show modal
      openModal(giftModal, giftUid);

      //close on close
      spanGift.onclick = function() {
        closeModal(giftModal);
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == giftModal) {
          closeModal(giftModal);
        }
      }
    };
    let textNode = document.createTextNode(giftTitle);
    liItem.appendChild(textNode);

    dataListContainer.insertBefore(liItem, document.getElementById('dataListContainer').childNodes[0]);
    initializedGiftsArr.push(giftUid);
    clearInterval(offlineTimer);
  }

  function changeGiftElement(giftData, giftOwner){
    let description = giftData.description;
    let link = giftData.link;
    let title = giftData.title + " - for " + giftOwner;
    let where = giftData.where;
    let uid = giftData.uid;
    let date = giftData.creationDate;

    if(consoleOutput)
      console.log("Updating " + uid);
    let editGift = document.getElementById('gift' + uid);
    editGift.innerHTML = title;
    editGift.className = "gift";
    editGift.onclick = function (){
      let spanGift = document.getElementsByClassName('close')[0];

      if (link != ""){
        giftLinkFld.innerHTML = "Click me to go to the webpage!";
        giftLinkFld.onclick = function() {
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
        giftLinkFld.innerHTML = "There was no link provided";
        giftLinkFld.onclick = function() {
        };
      }
      if(description != "") {
        giftDescriptionFld.innerHTML = "Description: " + description;
      } else {
        giftDescriptionFld.innerHTML = "There was no description provided";
      }
      giftTitleFld.innerHTML = title;
      if(where != "") {
        giftWhereFld.innerHTML = "This can be found at: " + where;
      } else {
        giftWhereFld.innerHTML = "There was no location provided";
      }
      if(date != undefined) {
        if (date != "") {
          giftCreationDateFld.innerHTML = "Created on: " + date;
        } else {
          giftCreationDateFld.innerHTML = "Creation date not available";
        }
      } else {
        giftCreationDateFld.innerHTML = "Creation date not available";
      }

      //show modal
      openModal(giftModal, uid);

      //close on close
      spanGift.onclick = function() {
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
};
