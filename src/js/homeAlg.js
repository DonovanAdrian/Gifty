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
let userBase;
let userGifts;
let userInvites;
let notificationBtn;
let testData;



function getCurrentUser(){
  let localConsoleOutput = false;

  try {
    user = JSON.parse(sessionStorage.validUser);
    if(user.moderatorInt == 1)
      localConsoleOutput = true;
    if(localConsoleOutput)
      console.log("User: " + user.userName + " loaded in");
    if (user.giftList == undefined) {
      deployListEmptyNotification("No Gifts Found! Add Some Gifts With The Button Below!");
      giftListEmptyBool = true;
    } else if (user.giftList.length == 0) {
      deployListEmptyNotification("No Gifts Found! Add Some Gifts With The Button Below!");
      giftListEmptyBool = true;
    }
    if (user.invites == undefined) {
      if(localConsoleOutput)
        console.log("Invites Not Found");
    } else if (user.invites != undefined) {
      if (user.invites.length > 0) {
        invitesValidBool = true;
      }
    }

    if (user.friends == undefined) {
      if(localConsoleOutput)
        console.log("Friends Not Found");
    } else if (user.friends != undefined) {
      if (user.friends.length > 0) {
        friendsValidBool = true;
      }
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
        if (user.notifications.length > 0 && user.readNotifications.length < user.notifications.length) {
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
    if(localConsoleOutput)
      console.log(err.toString());
    window.location.href = "index.html";
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

  //check invites for users that no longer exist
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

  //check friends for users that no longer exist
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
      }
    }

    if(userPrivateGiftArr == undefined){}
    else if (userPrivateGiftArr.length != undefined) {
      for (let b = 0; b < userPrivateGiftArr.length; b++) {
        if (userPrivateGiftArr[b].buyer == user.userName) {
          userBoughtGifts.push(userPrivateGiftArr[b]);
          userBoughtGiftsUsers.push(userArr[i].name + " (Private List)");
        }
      }
    }
  }
}

window.onload = function instantiate() {

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
  boughtGifts.innerHTML = "Bought Gifts";
  boughtGifts.onclick = function(){
    if(userBoughtGifts.length == 0){
      alert("Buy Some Gifts From Some Users First!");
    } else {
      sessionStorage.setItem("boughtGifts", JSON.stringify(userBoughtGifts));
      sessionStorage.setItem("boughtGiftsUsers", JSON.stringify(userBoughtGiftsUsers));
      newNavigation(7);//BoughtGifts
    }
  };

  addGift.innerHTML = "Add Gift";
  addGift.onclick = function() {
    giftStorage = "";
    privateList = "";
    sessionStorage.setItem("privateList", JSON.stringify(privateList));
    sessionStorage.setItem("giftStorage", JSON.stringify(giftStorage));
    newNavigation(8);//GiftAddUpdate
  };

  databaseQuery();

  function databaseQuery() {

    userBase = firebase.database().ref("users/");
    userGifts = firebase.database().ref("users/" + user.uid + "/giftList");
    userInvites = firebase.database().ref("users/" + user.uid + "/invites");

    let fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          if(consoleOutput)
            console.log("Adding " + userArr[i].userName + " to most updated version: " + data.val().userName);
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
              newNavigation(6);//Notifications
            }
          }
          if(consoleOutput)
            console.log("User Updated: 1");
        }
      });

      postRef.on('child_changed', function (data) {
        if(consoleOutput)
          console.log("User Updated: " + data.val().userName);
        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
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

    let fetchGifts = function (postRef) {
      postRef.on('child_added', function (data) {
        giftArr.push(data.val());

        createGiftElement(data.val().description, data.val().link, data.val().received, data.val().title,
            data.key, data.val().where, data.val().uid, data.val().creationDate, data.val().buyer);
      });

      postRef.on('child_changed', function(data) {
        giftArr[data.key] = data.val();

        changeGiftElement(data.val().description, data.val().link, data.val().received, data.val().title,
            data.key, data.val().where, data.val().uid, data.val().creationDate, data.val().buyer);
      });

      postRef.on('child_removed', function(data) {
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
          let newGiftLink = "http://";
          if(link.includes("https://")){
            giftLink = link.slice(8, link.length);
          } else if (link.includes("http://")){
            giftLink = link.slice(7, link.length);
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
      }
    };
  }

  function removeGiftElement(uid) {
    document.getElementById('gift' + uid).remove();

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
    newNavigation(8);//GiftAddUpdate
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

      //close on close
      noteSpan.onclick = function() {
        closeModal(notificationModal);
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == notificationModal) {
          closeModal(notificationModal);
        }
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
    let pageName = "deleteGift";
    let giftOwner = user.uid;
    let notificationString = generateNotificationString(giftOwner, giftTitle, pageName);
    let buyerUserNotifications;
    if(buyerUserData.notifications == undefined || buyerUserData.notifications == null){
      buyerUserNotifications = [];
    } else {
      buyerUserNotifications = buyerUserData.notifications;
    }
    buyerUserNotifications.push(notificationString);

    if(buyerUserData.notifications != undefined) {
      firebase.database().ref("users/" + buyerUserData.uid).update({
        notifications: buyerUserNotifications
      });
    } else {
      if(consoleOutput)
        console.log("New Notifications List");
      firebase.database().ref("users/" + buyerUserData.uid).update({notifications:{0:notificationString}});
    }
    if(consoleOutput)
      console.log("Added Notification To DB");
  }

  function generateNotificationString(giftOwner, giftTitle, pageName){
    if(consoleOutput)
      console.log("Generating Notification");
    return (giftOwner + "," + giftTitle + "," + pageName);
  }
};
