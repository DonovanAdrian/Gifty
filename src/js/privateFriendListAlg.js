/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let privateFriendListElements = [];
let listeningFirebaseRefs = [];
let giftArr = [];
let inviteArr = [];
let userUserNames = [];
let instantiatedNodes = [];

let readNotificationsBool = false;
let updateGiftToDBBool = false;
let giftListEmptyBool = false;

let dataCounter = 0;
let onlineInt = 0;
let loadingTimerInt = 0;

let giftCreationDate;
let dataListContainer;
let giftStorage;
let user;
let addGift;
let offlineSpan;
let offlineModal;
let giftUser;
let userInvites;
let offlineTimer;
let loadingTimer;
let giftModal;
let notificationModal;
let notificationInfo;
let notificationTitle;
let noteSpan;
let listNote;
let inviteNote;
let notificationBtn;
let userBase;
let userGifts;
let testGift;
let closeGiftModal;
let giftTitle;
let giftLink;
let giftWhere;
let giftDescription;
let giftCreator;
let giftBought;
let giftBuy;
let giftDontBuy;
let giftEdit;
let giftDelete;



function getCurrentUser(){
  let localConsoleOutput = false;

  try {
    moderationSet = sessionStorage.getItem("moderationSet");
    giftUser = JSON.parse(sessionStorage.validGiftUser);
    user = JSON.parse(sessionStorage.validUser);
    if(user.moderatorInt == 1)
      localConsoleOutput = true;
    if(user.uid == giftUser.uid){
      if(localConsoleOutput)
        console.log("HOW'D YOU GET HERE???");
      newNavigation(2);//Home
    }
    if(localConsoleOutput) {
      console.log("User: " + user.userName + " loaded in");
      console.log("Friend: " + giftUser.userName + " loaded in");
    }
    if (giftUser.privateList == undefined) {
      deployGiftListEmptyNotification();
      giftListEmptyBool = true;
    } else if (giftUser.privateList.length == 0) {
      deployGiftListEmptyNotification();
      giftListEmptyBool = true;
    }
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
  } catch (err) {
    if(localConsoleOutput)
      console.log(err.toString());
    window.location.href = "index.html";
  }
}

window.onload = function instantiate() {

  notificationBtn = document.getElementById('notificationButton');
  giftCreationDate = document.getElementById('giftCreationDate');
  dataListContainer = document.getElementById('dataListContainer');
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  notificationModal = document.getElementById('notificationModal');
  notificationTitle = document.getElementById('notificationTitle');
  notificationInfo = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  inviteNote = document.getElementById('inviteNote');
  listNote = document.getElementById('listNote');
  addGift = document.getElementById('addGift');
  giftModal = document.getElementById('giftModal');
  testGift = document.getElementById('testGift');
  closeGiftModal = document.getElementById('closeGiftModal');
  giftTitle = document.getElementById('giftTitle');
  giftLink = document.getElementById('giftLink');
  giftWhere = document.getElementById('giftWhere');
  giftDescription = document.getElementById('giftDescription');
  giftCreator = document.getElementById('giftCreator');
  giftBought = document.getElementById('giftBought');
  giftBuy = document.getElementById('giftBuy');
  giftDontBuy = document.getElementById('giftDontBuy');
  giftEdit = document.getElementById('giftEdit');
  giftDelete = document.getElementById('giftDelete');
  privateFriendListElements = [notificationBtn, giftCreationDate, dataListContainer, offlineModal, offlineSpan,
    notificationModal, notificationTitle, notificationInfo, noteSpan, inviteNote, listNote, addGift, giftModal,
    testGift, closeGiftModal, giftTitle, giftLink, giftWhere, giftDescription, giftCreator, giftBought, giftBuy,
    giftDontBuy, giftEdit, giftDelete];
  getCurrentUser();
  commonInitialization();
  verifyElementIntegrity(privateFriendListElements);

  for(let i = 0; i < userArr.length; i++){
    userUserNames.push(userArr[i].userName);
  }

  addGift.innerHTML = "Add Private Gift";
  addGift.onclick = function() {
    giftStorage = "";
    sessionStorage.setItem("privateList", JSON.stringify(giftUser));
    sessionStorage.setItem("validUser", JSON.stringify(giftUser));
    sessionStorage.setItem("validPrivateUser", JSON.stringify(user));
    sessionStorage.setItem("userArr", JSON.stringify(userArr));
    sessionStorage.setItem("giftStorage", JSON.stringify(giftStorage));
    window.location.href = "giftAddUpdate.html";
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

  alternateButtonLabel(listNote, "Lists", "Private");

  function databaseQuery() {

    userBase = firebase.database().ref("users/");
    userGifts = firebase.database().ref("users/" + giftUser.uid + "/privateList/");
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
            data.key, data.val().where, data.val().uid, data.val().creationDate, data.val().buyer,
            data.val().creator);
        instantiatedNodes.push(data.val());

        if(updateGiftToDBBool){
          updateGiftError(data, data.key);
          updateGiftToDBBool = false;
        }
      });

      postRef.on('child_changed', function(data) {
        if(consoleOutput)
          console.log("Changing " + data.val().uid);
        giftArr[data.key] = data.val();
        instantiatedNodes[data.key] = data.val();

        if(data.val().uid == currentModalOpen){//Moved currentModalOpen reference to common.js
          closeModal(giftModal);
        }

        changeGiftElement(data.val().description, data.val().link, data.val().received, data.val().title,
            data.key, data.val().where, data.val().uid, data.val().creationDate, data.val().buyer,
            data.val().creator);
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
    alert("A gift needs to be updated! Key: " + giftKey);
    firebase.database().ref("users/" + giftUser.uid + "/privateList/" + giftKey).update({
      buyer: ""
    });
  }

  function createGiftElement(description, link, received, title, key, where, uid, date, buyer, creator){
    try{
      testGift.remove();
    } catch (err) {}

    let liItem = document.createElement("LI");
    liItem.id = "gift" + uid;
    liItem.className = "gift";
    if(received == 1) {
      liItem.className += " checked";
      if(consoleOutput)
        console.log("Checked, created");
    }
    liItem.onclick = function (){
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
      if(received == 1){
        if(buyer == null || buyer == undefined){
          giftBought.innerHTML = "This gift has been bought";
        } else {
          if (buyer == "")
            giftBought.innerHTML = "This gift has been bought";
          else
            giftBought.innerHTML = "This gift was bought by " + buyer;
        }
      } else {
        giftBought.innerHTML = "This gift has not been bought yet";
      }
      if(description != "") {
        giftDescription.innerHTML = "Description: " + description;
      } else {
        giftDescription.innerHTML = "There was no description provided";
      }
      if(creator == null || creator == undefined){
        giftCreator.innerHTML = "Gift creator unavailable";
      } else {
        if (creator == "")
          giftCreator.innerHTML = "Gift creator unavailable";
        else
          giftCreator.innerHTML = "Gift was created by " + creator;
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
      giftEdit.onclick = function(){
        updateMaintenanceLog("privateList", "Attempting to update gift:" + title + " " + key + " " + user.userName);
        updateGiftElement(uid);
      };
      giftDelete.onclick = function(){
        if (creator == user.userName || creator == null || creator == undefined) {
          updateMaintenanceLog("privateList", "Attempting to delete gift:" + title + " " + key + " " + user.userName);
          deleteGiftElement(key, title, buyer);
        } else {
          if (creator == ""){
            updateMaintenanceLog("privateList", "Attempting to delete gift:" + title + " " + key + " " + user.userName);
            deleteGiftElement(key, title, buyer);
          } else {
            updateMaintenanceLog("privateList", "Attempting to delete gift:" + title + " " + key + " " + user.userName);
            alert("Only the creator, " + creator + ", can delete this gift. Please contact them to delete this gift " +
                "if it needs to be removed.");
          }
        }
      };
      giftBuy.innerHTML = "Click on me to buy the gift!";
      giftBuy.onclick = function(){
        if (received == 0) {
          firebase.database().ref("users/" + giftUser.uid + "/privateList/" + key).update({
            received: 1,
            buyer: user.userName
          });
        } else {
          alert("This gift has already been marked as bought!");
        }
      };
      giftDontBuy.innerHTML = "Click on me to un-buy the gift!";
      giftDontBuy.onclick = function(){
        if (received == 1) {
          if (buyer == user.userName || buyer == null || buyer == undefined) {
            firebase.database().ref("users/" + giftUser.uid + "/privateList/" + key).update({
              received: 0,
              buyer: ""
            });
          } else {
            if (buyer == "") {
              firebase.database().ref("users/" + giftUser.uid + "/privateList/" + key).update({
                received: 0,
                buyer: ""
              });
            } else {
              alert("Only the buyer, " + buyer + ", can \"Un-Buy\" this gift. Please contact them to undo this action " +
                  "if this has been done in error.");
            }
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
    let textNode = document.createTextNode(title);
    liItem.appendChild(textNode);

    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
    clearInterval(offlineTimer);

    dataCounter++;
  }

  function changeGiftElement(description, link, received, title, key, where, uid, date, buyer, creator) {
    let editGift = document.getElementById('gift' + uid);
    editGift.innerHTML = title;
    editGift.className = "gift";
    if (received == 1) {
      editGift.className += " checked";
      if(consoleOutput)
        console.log("Checked, changed");
    }
    editGift.onclick = function () {
      if (link != "") {
        giftLink.innerHTML = "Click me to go to the webpage!";
        giftLink.onclick = function () {
          let newGiftLink = "http://";
          if (link.includes("https://")) {
            link = link.slice(8, link.length);
          } else if (link.includes("http://")) {
            link = link.slice(7, link.length);
          }
          newGiftLink += link;
          window.open(newGiftLink, "_blank");
        };
      } else {
        giftLink.innerHTML = "There was no link provided";
        giftLink.onclick = function () {
        };
      }
      if (received == 1) {
        if (buyer == null || buyer == undefined) {
          giftBought.innerHTML = "This gift has been bought";
        } else {
          if (buyer == "")
            giftBought.innerHTML = "This gift has been bought";
          else
            giftBought.innerHTML = "This gift was bought by " + buyer;
        }
      } else {
        giftBought.innerHTML = "This gift has not been bought yet";
      }
      if (description != "") {
        giftDescription.innerHTML = "Description: " + description;
      } else {
        giftDescription.innerHTML = "There was no description provided";
      }
      if (creator == null || creator == undefined) {
        giftCreator.innerHTML = "Gift creator unavailable";
      } else {
        if (creator == "")
          giftCreator.innerHTML = "Gift creator unavailable";
        else
          giftCreator.innerHTML = "Gift was created by " + creator;
      }
      giftTitle.innerHTML = title;
      if (where != "") {
        giftWhere.innerHTML = "This can be found at: " + where;
      } else {
        giftWhere.innerHTML = "There was no location provided";
      }
      if (date != undefined) {
        if (date != "") {
          giftCreationDate.innerHTML = "Created on: " + date;
        } else {
          giftCreationDate.innerHTML = "Creation date not available";
        }
      } else {
        giftCreationDate.innerHTML = "Creation date not available";
      }
      giftEdit.onclick = function () {
        updateMaintenanceLog("privateList", "Attempting to update gift:" + title + " " + key + " " + user.userName);
        updateGiftElement(uid);
      };
      giftDelete.onclick = function () {
        if (creator == user.userName || creator == null || creator == undefined) {
          updateMaintenanceLog("privateList", "Attempting to delete gift:" + title + " " + key + " " + user.userName);
          deleteGiftElement(key, title, buyer);
        } else {
          if (creator == ""){
            updateMaintenanceLog("privateList", "Attempting to delete gift:" + title + " " + key + " " + user.userName);
            deleteGiftElement(key, title, buyer);
          } else {
            updateMaintenanceLog("privateList", "Attempting to delete gift:" + title + " " + key + " " + user.userName);
            alert("Only the creator, " + creator + ", can delete this gift. Please contact them to delete this gift " +
                "if it needs to be removed.");
          }
        }
      };
      giftBuy.innerHTML = "Click on me to buy the gift!";
      giftBuy.onclick = function () {
        if (received == 0) {
          firebase.database().ref("users/" + giftUser.uid + "/privateList/" + key).update({
            received: 1,
            buyer: user.userName
          });
        } else {
          alert("This gift has already been marked as bought!");
        }
      };
      giftDontBuy.innerHTML = "Click on me to un-buy the gift!";
      giftDontBuy.onclick = function () {
        if (received == 1) {
          if (buyer == user.userName || buyer == null || buyer == undefined) {
            firebase.database().ref("users/" + giftUser.uid + "/privateList/" + key).update({
              received: 0,
              buyer: ""
            });
          } else {
            if (buyer == "") {
              firebase.database().ref("users/" + giftUser.uid + "/privateList/" + key).update({
                received: 0,
                buyer: ""
              });
            } else {
              alert("Only the buyer, " + buyer + ", can \"Un-Buy\" this gift. Please contact them to undo this action " +
                  "if this has been done in error.");
            }
          }
        } else {
          alert("This gift has already been marked as \"Un-Bought\"!");
        }
      };

      //show modal
      openModal(giftModal, uid);

      //close on close
      closeGiftModal.onclick = function () {
        closeModal(giftModal);
      };

      //close on click
      window.onclick = function (event) {
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

  function updateGiftElement(uid) {
    giftStorage = uid;
    sessionStorage.setItem("privateList", JSON.stringify(giftUser));
    sessionStorage.setItem("validUser", JSON.stringify(giftUser));
    sessionStorage.setItem("validPrivateUser", JSON.stringify(user));
    sessionStorage.setItem("userArr", JSON.stringify(userArr));
    sessionStorage.setItem("giftStorage", JSON.stringify(giftStorage));
    window.location.href = "giftAddUpdate.html";
  }

  function deleteGiftElement(key, title, buyer) {
    let verifyDeleteBool = true;
    let toDelete = -1;

    for (let i = 0; i < giftArr.length; i++){
      if(title == giftArr[i].title) {
        toDelete = i;
        break;
      }
    }

    if(toDelete != -1) {
      alert("Attempting to delete " + giftArr[toDelete].title + "! If this is successful, the page will reload.");
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
      firebase.database().ref("users/" + giftUser.uid).update({
        privateList: giftArr
      });

      if(buyer != ""){
        let userFound = findUserNameItemInArr(buyer, userArr);
        if(userFound != -1){
          if(userArr[userFound].uid != user.uid) {
            addNotificationToDB(userArr[userFound], user.name, title);
          }
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

  function addNotificationToDB(buyerUserData, giftDeleter, giftTitle){
    let pageName = "deleteGiftPrivate";
    let giftOwner = giftUser.uid;
    let notificationString = generateNotificationString(giftOwner, giftDeleter, giftTitle, pageName);
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

  function generateNotificationString(giftOwner, giftDeleter, giftTitle, pageName){
    if(consoleOutput)
      console.log("Generating Notification");
    return (giftOwner + "," + giftDeleter + "," + giftTitle + "," + pageName);
  }
};

function updateMaintenanceLog(locationData, detailsData) {
  let today = new Date();
  let UTChh = today.getUTCHours();
  let UTCmm = today.getUTCMinutes();
  let UTCss = today.getUTCSeconds();
  let dd = today.getUTCDate();
  let mm = today.getMonth()+1;
  let yy = today.getFullYear();
  let timeData = mm + "/" + dd + "/" + yy + " " + UTChh + ":" + UTCmm + ":" + UTCss;
  let newUid = firebase.database().ref("maintenance").push();
  newUid = newUid.toString();
  newUid = findUIDInString(newUid);

  firebase.database().ref("maintenance/" + newUid).set({
    uid: newUid,
    location: locationData,
    details: detailsData,
    time: timeData
  });
}

function deployGiftListEmptyNotification(){
  try{
    testGift.innerHTML = "No Gifts Found! Add Some Gifts With The Button Below!";
  } catch(err){
    if(consoleOutput)
      console.log("Loading Element Missing, Creating A New One");
    let liItem = document.createElement("LI");
    liItem.id = "testGift";
    liItem.className = "gift";
    let textNode = document.createTextNode("No Gifts Found! Add Some Gifts With The Button Below!");
    liItem.appendChild(textNode);
    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
  }

  clearInterval(offlineTimer);
}
