/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let homeElements = [];
let listeningFirebaseRefs = [];
let userArr = [];
let giftArr = [];
let inviteArr = [];
let userBoughtGifts = [];
let userBoughtGiftsUsers = [];

let invitesValidBool = false;
let friendsValidBool = false;
let readNotificationsBool = false;
let updateUserBool = false;
let giftListEmptyBool = false;

let giftLimit = 50;
let dataCounter = 0;
let commonLoadingTimerInt = 0;

let dataListContainer;
let giftStorage;
let privateList;
let boughtGifts;
let addGift;
let offlineSpan;
let offlineModal;
let user;
let offlineTimer;
let commonLoadingTimer;
let giftModal;
let giftTitle;
let giftLink;
let giftWhere;
let giftDescription;
let giftCreationDate;
let giftUpdate;
let giftDelete;
let closeGiftModal;
let notificationModal;
let notificationInfo;
let notificationTitle;
let noteSpan;
let inviteNote;
let limitsInitial;
let userBase;
let userGifts;
let userInvites;
let notificationBtn;
let testData;



function getCurrentUser(){
  getCurrentUserCommon();

  if (user.giftList == undefined) {
    deployListEmptyNotification("No Gifts Found! Add Some Gifts With The Button Below!");
    giftListEmptyBool = true;
  } else if (user.giftList.length == 0) {
    deployListEmptyNotification("No Gifts Found! Add Some Gifts With The Button Below!");
    giftListEmptyBool = true;
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
      if (user.notifications.length > 0 && user.readNotifications.length < user.notifications.length) {
        notificationBtn.src = "img/bellNotificationOn.png";
        notificationBtn.onclick = function() {
          navigation(6);//Notifications
        }
      } else {
        notificationBtn.src = "img/bellNotificationOff.png";
        notificationBtn.onclick = function() {
          navigation(6);//Notifications
        }
      }
    } else if (user.notifications.length > 0) {
      notificationBtn.src = "img/bellNotificationOn.png";
      notificationBtn.onclick = function() {
        navigation(6);//Notifications
      }
    }
  }
}

function checkUserErrors(){
  let userUIDs = [];
  let inviteEditInt = 0;
  let friendEditInt = 0;
  let totalErrors = 0;

  for(let i = 0; i < userArr.length; i++){
    userUIDs.push(userArr[i].uid);
  }

  if(consoleOutput)
    console.log("Checking for errors...");

  if(invitesValidBool){
    for(let i = 0; i < user.invites.length; i++){
      if(!userUIDs.includes(user.invites[i])){
        user.invites.splice(i, 1);
        inviteEditInt++;
      }
    }

    if(inviteEditInt > 0){
      updateUserBool = true;
      if(consoleOutput)
        console.log("Update to DB required: 1...");
    }

    if(user.invites.length > 0) {
      inviteNote.style.background = "#ff3923";
    }
  }

  if(friendsValidBool){
    for(let i = 0; i < user.friends.length; i++){
      if(!userUIDs.includes(user.friends[i])){
        user.friends.splice(i, 1);
        friendEditInt++;
      }
    }

    if(friendEditInt > 0){
      updateUserBool = true;
      if(consoleOutput)
        console.log("Update to DB required: 2...");
    }
  }

  if(updateUserBool){
    if(consoleOutput)
      console.log("Updates needed! Computing...");
    totalErrors = friendEditInt + inviteEditInt;
    updateUserToDB(totalErrors, friendEditInt, inviteEditInt);
  } else {
    if(consoleOutput)
      console.log("No updates needed!");
  }
}

function updateUserToDB(totalErrors, friendEditInt, inviteEditInt){
  if(inviteEditInt > 0) {
    let supplementaryInvitesArr = user.invites;
    firebase.database().ref("users/" + user.uid).update({
      invites: user.invites
    });
    user.invites = supplementaryInvitesArr;
  }
  if(friendEditInt > 0) {
    let supplementaryFriendsArr = user.friends;
    firebase.database().ref("users/" + user.uid).update({
      friends: user.friends
    });
    user.friends = supplementaryFriendsArr;
  }
  if(consoleOutput)
    console.log("Updates pushed!");
}

function collectUserBoughtGifts(){
  let userGiftArr = [];
  let userPrivateGiftArr = [];

  userBoughtGifts = [];
  userBoughtGiftsUsers = [];
  for(let i = 0; i < userArr.length; i++) {
    userGiftArr = userArr[i].giftList;
    userPrivateGiftArr = userArr[i].privateList;

    if(userGiftArr == undefined){}
    else if (userGiftArr.length != undefined) {
      for (let a = 0; a < userGiftArr.length; a++) {
        if (userGiftArr[a].buyer == user.userName) {
          userBoughtGifts.push(userGiftArr[a]);
          userBoughtGiftsUsers.push(userArr[i].name);
        }
        if (userGiftArr[a].receivedBy != undefined)
          if (userGiftArr[a].receivedBy.includes(user.uid)) {
            userBoughtGifts.push(userGiftArr[a]);
            userBoughtGiftsUsers.push(userArr[i].name + " (Multiple Purchase Gift)");
          }
      }
    }

    if(userPrivateGiftArr == undefined){}
    else if (userPrivateGiftArr.length != undefined) {
      for (let b = 0; b < userPrivateGiftArr.length; b++) {
        if (userPrivateGiftArr[b].buyer == user.userName) {
          userBoughtGifts.push(userPrivateGiftArr[b]);
          userBoughtGiftsUsers.push(userArr[i].name + " (Private List)");
        }
        if (userPrivateGiftArr[b].receivedBy != undefined)
          if (userPrivateGiftArr[b].receivedBy.includes(user.uid)) {
            userBoughtGifts.push(userPrivateGiftArr[b]);
            userBoughtGiftsUsers.push(userArr[i].name + " (Private List, Multiple Purchase Gift)");
          }
      }
    }
  }
}

window.onload = function instantiate() {
  pageName = "Home";
  notificationBtn = document.getElementById('notificationButton');
  dataListContainer = document.getElementById('dataListContainer');
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  notificationModal = document.getElementById('notificationModal');
  notificationTitle = document.getElementById('notificationTitle');
  notificationInfo = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  inviteNote = document.getElementById('inviteNote');
  boughtGifts = document.getElementById('boughtGifts');
  addGift = document.getElementById('addGift');
  giftModal = document.getElementById('giftModal');
  giftTitle = document.getElementById('giftTitle');
  giftLink = document.getElementById('giftLink');
  giftWhere = document.getElementById('giftWhere');
  giftDescription = document.getElementById('giftDescription');
  giftCreationDate = document.getElementById('giftCreationDate');
  giftUpdate = document.getElementById('giftUpdate');
  giftDelete = document.getElementById('giftDelete');
  closeGiftModal = document.getElementById('closeGiftModal');
  testData = document.getElementById('testData');
  homeElements = [notificationBtn, dataListContainer, offlineModal, offlineSpan, notificationModal, notificationTitle,
    notificationInfo, noteSpan, inviteNote, boughtGifts, addGift, giftModal, giftTitle, giftLink, giftWhere,
    giftDescription, giftCreationDate, giftUpdate, giftDelete, closeGiftModal, testData];

  getCurrentUser();
  commonInitialization();
  verifyElementIntegrity(homeElements);
  checkUserErrors();
  collectUserBoughtGifts();

  userBase = firebase.database().ref("users/");
  userGifts = firebase.database().ref("users/" + user.uid + "/giftList");
  userInvites = firebase.database().ref("users/" + user.uid + "/invites");
  limitsInitial = firebase.database().ref("limits/");

  databaseQuery();

  function initializeBoughtGiftsBtn() {
    boughtGifts.innerHTML = "Bought Gifts";
    boughtGifts.onclick = function () {
      if (userBoughtGifts.length == 0) {
        alert("Buy Some Gifts From Some Users First!");
      } else {
        sessionStorage.setItem("boughtGifts", JSON.stringify(userBoughtGifts));
        sessionStorage.setItem("boughtGiftsUsers", JSON.stringify(userBoughtGiftsUsers));
        navigation(7);//BoughtGifts
      }
    };
  }

  initializeBoughtGiftsBtn();

  function databaseQuery() {
    let fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        let i = findUIDItemInArr(data.key, userArr, true);
        if(userArr[i] != data.val() && i != -1){
          userArr[i] = data.val();
        }

        if(data.key == user.uid){
          user = data.val();
          if (data.val().notifications == undefined) {
            notificationBtn.src = "img/bellNotificationOff.png";
            notificationBtn.onclick = function () {}
          } else if (data.val().readNotifications == undefined){
            if(consoleOutput)
              console.log("No Read Notifications");
          } else if (data.val().readNotifications.length == data.val().notifications.length) {
            notificationBtn.src = "img/bellNotificationOff.png";
            notificationBtn.onclick = function() {
              navigation(6);//Notifications
            }
          }
        }
      });

      postRef.on('child_changed', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          if(consoleOutput)
            console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
          userArr[i] = data.val();
        }

        if(data.key == user.uid){
          user = data.val();
          if(consoleOutput)
            console.log("Current User Updated");
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

        createGiftElement(data.val().description, data.val().link, data.val().received, data.val().title,
          data.key, data.val().where, data.val().uid, data.val().creationDate, data.val().buyer);

        checkGiftLimit();
      });

      postRef.on('child_changed', function(data) {
        giftArr[data.key] = data.val();

        changeGiftElement(data.val().description, data.val().link, data.val().received, data.val().title,
          data.key, data.val().where, data.val().uid, data.val().creationDate, data.val().buyer);
      });

      postRef.on('child_removed', function(data) {
        sessionStorage.setItem("validUser", JSON.stringify(user));
        navigation(2);
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

    let fetchLimits = function (postRef) {
      postRef.on('child_added', function (data) {
        if (data.key == "giftLimit") {
          giftLimit = data.val();
          checkGiftLimit();
        }
      });

      postRef.on('child_changed', function (data) {
        if (data.key == "giftLimit") {
          giftLimit = data.val();
          checkGiftLimit();
        }
      });

      postRef.on('child_removed', function (data) {
        if (data.key == "giftLimit") {
          giftLimit = 100;
          checkGiftLimit();
        }
      });
    };

    fetchData(userBase);
    fetchGifts(userGifts);
    fetchInvites(userInvites);
    fetchLimits(limitsInitial);

    listeningFirebaseRefs.push(userBase);
    listeningFirebaseRefs.push(userGifts);
    listeningFirebaseRefs.push(userInvites);
    listeningFirebaseRefs.push(limitsInitial);
  }

  function createGiftElement(description, link, received, title, key, where, uid, date, buyer){
    try{
      testData.remove();
    } catch (err) {}

    let liItem = document.createElement("LI");
    liItem.id = "gift" + uid;

    initGiftElement(liItem, description, link, received, title, key, where, uid, date, buyer);

    let textNode = document.createTextNode(title);
    liItem.appendChild(textNode);
    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
    clearInterval(commonLoadingTimer);
    clearInterval(offlineTimer);

    dataCounter++;
    if (dataCounter > buttonOpacLim)
      boughtGifts.style.opacity = ".75";
  }

  function changeGiftElement(description, link, received, title, key, where, uid, date, buyer) {
    let editGift = document.getElementById('gift' + uid);
    editGift.innerHTML = title;

    initGiftElement(description, link, received, title, key, where, uid, date, buyer);
  }

  function initGiftElement(liItem, description, link, received, title, key, where, uid, date, buyer) {
    liItem.className = "gift";
    liItem.onclick = function (){
      if (link != ""){
        giftLink.innerHTML = "Click me to go to the webpage!";
        giftLink.onclick = function() {
          giftLinkRedirect(link);
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
      if(date != undefined) {
        if (date != "") {
          giftCreationDate.innerHTML = "Created on: " + date;
        } else {
          giftCreationDate.innerHTML = "Creation date not available";
        }
      } else {
        giftCreationDate.innerHTML = "Creation date not available";
      }
      giftUpdate.onclick = function(){
        updateMaintenanceLog("home", "Attempting to update gift: " + title + " " + key + " " + user.userName);
        updateGiftElement(uid);
      };
      giftDelete.onclick = function(){
        updateMaintenanceLog("home", "Attempting to delete gift: " + title + " " + key + " " + user.userName);
        deleteGiftElement(key, title, uid, buyer);
      };

      openModal(giftModal, uid);

      closeGiftModal.onclick = function() {
        closeModal(giftModal);
      };
    };
  }

  function removeGiftElement(uid) {
    document.getElementById('gift' + uid).remove();

    checkGiftLimit();

    dataCounter--;
    if (dataCounter == 0){
      deployListEmptyNotification("No Gifts Found! Add Some Gifts With The Button Below!");
    }
  }

  function updateGiftElement(uid) {
    giftStorage = uid;
    privateList = "";
    sessionStorage.setItem("privateList", JSON.stringify(privateList));
    sessionStorage.setItem("giftStorage", JSON.stringify(giftStorage));
    navigation(8);//GiftAddUpdate
  }

  function deleteGiftElement(key, title, uid, buyer) {
    let verifyDeleteBool = true;
    let toDelete = -1;

    for (let i = 0; i < giftArr.length; i++){
      if(title == giftArr[i].title) {
        toDelete = i;
        break;
      }
    }

    if(toDelete != -1) {
      giftArr.splice(toDelete, 1);

      for (let i = 0; i < giftArr.length; i++) {
        if (title == giftArr[i].title) {
          verifyDeleteBool = false;
          break;
        }
      }
    } else {
      verifyDeleteBool = false;
    }

    if(verifyDeleteBool){
      removeGiftElement(uid);
      firebase.database().ref("users/" + user.uid).update({
        giftList: giftArr
      });

      closeModal(giftModal);

      notificationInfo.innerHTML = "Gift Deleted";
      notificationTitle.innerHTML = "Gift " + title + " successfully deleted!";
      openModal(notificationModal, "noteModal");

      noteSpan.onclick = function() {
        closeModal(notificationModal);
      };

      let nowJ = 0;
      let j = setInterval(function(){
        nowJ = nowJ + 1000;
        if(nowJ >= 3000){
          closeModal(notificationModal);
          clearInterval(j);
        }
      }, 1000);

      if(buyer != ""){
        let userFound = findUserNameItemInArr(buyer, userArr);
        if(userFound != -1){
          addNotificationToDB(userArr[userFound], title);
        } else {
          if(consoleOutput)
            console.log("User not found");
        }
      } else {
        if(consoleOutput)
          console.log("No buyer, no notification needed");
      }

    } else {
      alert("Delete failed, please try again later!");
    }
  }

  function findUserNameItemInArr(item, userArray){
    for(let i = 0; i < userArray.length; i++){
      if(userArray[i].userName == item){
        if(consoleOutput)
          console.log("Found item: " + item);
        return i;
      }
    }
    return -1;
  }

  function addNotificationToDB(buyerUserData, giftTitle){
    let pageNameNote = "deleteGift";
    let giftOwner = user.uid;
    let buyerUserNotifications = [];
    let buyerReadNotifications = [];
    let updateNotificationBool = false;
    let notificationString = generateNotificationString(giftOwner, giftTitle, pageNameNote);

    if(buyerUserData.notifications != undefined){
      buyerUserNotifications = buyerUserData.notifications;
    }
    if(buyerUserData.readNotifications != undefined){
      buyerReadNotifications = buyerUserData.readNotifications;
    }

    if (!buyerUserNotifications.includes(notificationString)) {
      buyerUserNotifications.push(notificationString);
      updateNotificationBool = true;
    } else if (buyerReadNotifications.includes(notificationString)) {
      let i = buyerReadNotifications.indexOf(notificationString);
      buyerReadNotifications.splice(i, 1);
      updateNotificationBool = true;
    }

    if (updateNotificationBool) {
      if (buyerUserData.notifications != undefined) {
        firebase.database().ref("users/" + buyerUserData.uid).update({
          notifications: buyerUserNotifications,
          readNotifications: buyerReadNotifications
        });
        if (consoleOutput)
          console.log("Added New Notification To DB");
      } else {
        if (consoleOutput)
          console.log("New Notifications List");
        firebase.database().ref("users/" + buyerUserData.uid).update({notifications: {0: notificationString}});
        if (consoleOutput)
          console.log("Added Notification To DB");
      }
    }
  }

  function generateNotificationString(giftOwner, giftTitle, pageNameNote){
    if(consoleOutput)
      console.log("Generating Notification");
    return (giftOwner + "," + giftTitle + "," + pageNameNote);
  }

  function checkGiftLimit() {
    let disableAddBtn = false;

    if (user.giftList != null) {
      if (user.giftList.length >= giftLimit) {
        disableAddBtn = true;
      }
    }

    if (disableAddBtn) {
      addGift.className += " btnDisabled";
      addGift.innerHTML = "Gift Limit Reached!";
      addGift.onclick = function () {
        alert("You have reached the limit of the number of gifts that you can create (" + giftLimit + "). " +
          "Please remove some gifts in order to create more!");
      };
    } else {
      addGift.innerHTML = "Add Gift";
      addGift.className = "addBtn";
      addGift.onclick = function () {
        giftStorage = "";
        privateList = "";
        sessionStorage.setItem("privateList", JSON.stringify(privateList));
        sessionStorage.setItem("giftStorage", JSON.stringify(giftStorage));
        navigation(8);//GiftAddUpdate
      };
    }
  }
};
