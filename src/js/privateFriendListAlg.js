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
let commonLoadingTimerInt = 0;

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
let commonLoadingTimer;
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
let testData;
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
        console.log("***HOW'D YOU GET HERE???***");
      newNavigation(1);//Index
    }
    if(localConsoleOutput) {
      console.log("User: " + user.userName + " loaded in");
      console.log("Friend: " + giftUser.userName + " loaded in");
    }
    if (giftUser.privateList == undefined) {
      deployListEmptyNotification("No Gifts Found! Add Some Gifts With The Button Below!");
      giftListEmptyBool = true;
    } else if (giftUser.privateList.length == 0) {
      deployListEmptyNotification("No Gifts Found! Add Some Gifts With The Button Below!");
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

  pageName = "PrivateFriendList";
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
  testData = document.getElementById('testData');
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
    testData, closeGiftModal, giftTitle, giftLink, giftWhere, giftDescription, giftCreator, giftBought, giftBuy,
    giftDontBuy, giftEdit, giftDelete];
  getCurrentUser();
  commonInitialization();
  verifyElementIntegrity(privateFriendListElements);

  for (let i = 0; i < userArr.length; i++) {
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

  databaseQuery();

  alternateButtonLabel(listNote, "Lists", "Private");

  function databaseQuery() {

    userBase = firebase.database().ref("users/");
    userGifts = firebase.database().ref("users/" + giftUser.uid + "/privateList/");
    userInvites = firebase.database().ref("users/" + user.uid + "/invites");

    let fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
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

        createGiftElement(data.val().description, data.val().link, data.val().received, data.val().receivedBy,
          data.val().title, data.key, data.val().where, data.val().uid, data.val().creationDate, data.val().buyer,
          data.val().creator, data.val().multiples);
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

        if(data.val().uid == currentModalOpen){
          closeModal(giftModal);
        }

        changeGiftElement(data.val().description, data.val().link, data.val().received, data.val().receivedBy,
          data.val().title, data.key, data.val().where, data.val().uid, data.val().creationDate, data.val().buyer,
          data.val().creator, data.val().multiples);
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

  function createGiftElement(description, link, received, receivedBy, title, key, where, uid, date, buyer, creator,
                             multiples){
    try{
      testData.remove();
    } catch (err) {}

    let liItem = document.createElement("LI");
    liItem.id = "gift" + uid;
    initGiftElement(liItem, description, link, received, receivedBy, title, key, where, uid, date, buyer, creator,
      multiples);
    let textNode = document.createTextNode(title);
    liItem.appendChild(textNode);

    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
    clearInterval(commonLoadingTimer);
    clearInterval(offlineTimer);
    dataCounter++;
  }

  function changeGiftElement(description, link, received, receivedBy, title, key, where, uid, date, buyer, creator,
                             multiples) {
    let editGift = document.getElementById('gift' + uid);
    editGift.innerHTML = title;
    initGiftElement(editGift, description, link, received, receivedBy, title, key, where, uid, date, buyer, creator,
      multiples);
  }

  function initGiftElement(liItem, description, link, received, receivedBy, title, key, where, uid, date, buyer,
                           creator, multiples) {
    let multipleBool = false;

    liItem.className = "gift";
    if(received == 1) {
      liItem.className += " checked";
      if(consoleOutput)
        console.log("Checked, created");
    } else if (multiples != undefined) {
      if (multiples && received < 0) {
        liItem.className += " multiCheck";
        if (consoleOutput)
          console.log("Multi check, created");
      }
    }

    liItem.onclick = function (){
      if (receivedBy == undefined) {
        receivedBy = [];
      }

      if (multiples != undefined) {
        multipleBool = multiples;
      }

      giftTitle.innerHTML = title;

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
      if(received == 1){
        if(buyer == undefined){
          giftBought.innerHTML = "This gift has been bought";
        } else {
          giftBought.innerHTML = "This gift was bought by " + buyer;
        }
      } else {
        if (multiples == undefined || received == 0) {
          giftBought.innerHTML = "This gift has not been bought yet";
        } else {
          let userBought = receivedBy.indexOf(user.uid);
          if (userBought == -1) {
            if (receivedBy.length == 1)
              giftBought.innerHTML = "This gift was bought by " + receivedBy.length + " person!";
            else
              giftBought.innerHTML = "This gift was bought by " + receivedBy.length + " people!";
          } else {
            if (receivedBy.length == 1)
              giftBought.innerHTML = "This gift was bought by you!";
            else
              giftBought.innerHTML = "This gift was bought by " + receivedBy.length + " people... Including you!";
          }
        }
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
        if (!multipleBool) {
          if (received == 0) {
            firebase.database().ref("users/" + giftUser.uid + "/privateList/" + key).update({
              received: 1,
              buyer: user.userName
            });
          } else {
            alert("This gift has already been marked as bought!");
          }
        } else {
          if (receivedBy.indexOf(user.uid) == -1) {
            receivedBy.push(user.uid);
            received = received - 1;
            firebase.database().ref("users/" + giftUser.uid + "/privateList/" + key).update({
              received: received,
              receivedBy: receivedBy
            });
          } else {
            alert("You can only buy this gift once!");
          }
        }
      };
      giftDontBuy.innerHTML = "Click on me to un-buy the gift!";
      giftDontBuy.onclick = function(){
        if (!multipleBool) {
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
        } else {
          let userBought = receivedBy.indexOf(user.uid);
          if (userBought != -1) {
            receivedBy.splice(userBought, 1);
            received = received + 1;
            firebase.database().ref("users/" + giftUser.uid + "/privateList/" + key).update({
              received: received,
              receivedBy: receivedBy
            });
          } else {
            alert("You haven't bought this gift!");
          }
        }
      };

      openModal(giftModal, uid);

      closeGiftModal.onclick = function() {
        closeModal(giftModal);
      };
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
    let buyerUserNotifications = [];
    let buyerReadNotifications = [];
    let updateNotificationBool = false;
    let notificationString = generateNotificationString(giftOwner, giftDeleter, giftTitle, pageName);

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

  function generateNotificationString(giftOwner, giftDeleter, giftTitle, pageName){
    if(consoleOutput)
      console.log("Generating Notification");
    return (giftOwner + "," + giftDeleter + "," + giftTitle + "," + pageName);
  }
};
