/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let privateFriendListElements = [];
let listeningFirebaseRefs = [];
let userArr = [];
let giftArr = [];
let oldGiftArr = [];
let inviteArr = [];
let userUserNames = [];
let initializedGifts = [];

let updateGiftToDBBool = false;
let giftListEmptyBool = false;
let potentialRemoval = false;
let giftDeleteLocal = false;
let giftUpdateLocal = false;

let giftLimit = 50;
let dataCounter = 0;
let commonLoadingTimerInt = 0;

let giftCreationDate;
let dataListContainer;
let giftStorage;
let user;
let addGift;
let backBtn;
let swapList;
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
let limitsInitial;
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
let confirmModal;
let closeConfirmModal;
let confirmTitle;
let confirmContent;
let confirmBtn;
let denyBtn;



function getCurrentUser(){
  getCurrentUserCommon();
  moderationSet = sessionStorage.getItem("moderationSet");
  giftUser = JSON.parse(sessionStorage.validGiftUser);

  if(user.uid == giftUser.uid){
    if(consoleOutput)
      console.log("***HOW'D YOU GET HERE???***");
    navigation(1);//Index
  }

  if(consoleOutput)
    console.log("Friend: " + giftUser.userName + " loaded in");

  if (giftUser.privateList == undefined) {
    deployListEmptyNotification("No Gifts Found! Add Some Gifts With The Button Below!");
    giftListEmptyBool = true;
  } else if (giftUser.privateList.length == 0) {
    deployListEmptyNotification("No Gifts Found! Add Some Gifts With The Button Below!");
    giftListEmptyBool = true;
  }
}

window.onload = function instantiate() {
  pageName = "PrivateFriendList";
  notificationBtn = document.getElementById('notificationButton');
  giftCreationDate = document.getElementById('giftCreationDate');
  dataListContainer = document.getElementById('dataListContainer');
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  confirmModal = document.getElementById('confirmModal');
  closeConfirmModal = document.getElementById('closeConfirmModal');
  confirmTitle = document.getElementById('confirmTitle');
  confirmContent = document.getElementById('confirmContent');
  confirmBtn = document.getElementById('confirmBtn');
  denyBtn = document.getElementById('denyBtn');
  notificationModal = document.getElementById('notificationModal');
  notificationTitle = document.getElementById('notificationTitle');
  notificationInfo = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  inviteNote = document.getElementById('inviteNote');
  listNote = document.getElementById('listNote');
  addGift = document.getElementById('addGift');
  backBtn = document.getElementById('backBtn');
  swapList = document.getElementById('swapList');
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
    confirmModal, closeConfirmModal, confirmTitle, confirmContent, confirmBtn, denyBtn, notificationModal,
    notificationTitle, notificationInfo, noteSpan, inviteNote, listNote, addGift, backBtn, swapList, giftModal,
    testData, closeGiftModal, giftTitle, giftLink, giftWhere, giftDescription, giftCreator, giftBought, giftBuy,
    giftDontBuy, giftEdit, giftDelete];

  getCurrentUser();
  commonInitialization();
  verifyElementIntegrity(privateFriendListElements);

  userBase = firebase.database().ref("users/");
  userGifts = firebase.database().ref("users/" + giftUser.uid + "/privateList/");
  userInvites = firebase.database().ref("users/" + user.uid + "/invites");
  limitsInitial = firebase.database().ref("limits/");

  databaseQuery();
  alternateButtonLabel(listNote, "Gift Lists", "Private");

  for (let i = 0; i < userArr.length; i++) {
    userUserNames.push(userArr[i].userName);
  }

  function initializeSwapBtn() {
    swapList.innerHTML = "View " + giftUser.name + "'s <br/>Public List";
    swapList.onclick = function () {
      sessionStorage.setItem("validGiftUser", JSON.stringify(giftUser));
      navigation(9);
    };
  }

  function initializeBackBtn() {
    backBtn.innerHTML = "Back To Gift Lists";
    backBtn.onclick = function () {
      if (moderationSet == 1) {
        navigation(14);//Moderation
      } else {
        navigation(3);//Lists
      }
    };
  }

  initializeBackBtn();
  initializeSwapBtn();

  function databaseQuery() {
    let fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        let i = findUIDItemInArr(data.key, userArr, true);
        if(userArr[i] != data.val() && i != -1){
          userArr[i] = data.val();
        } else {
          userArr.push(data.val());
        }

        if(data.key == giftUser.uid){
          giftUser = data.val();
        }
      });

      postRef.on('child_changed', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          if(consoleOutput)
            console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
          userArr[i] = data.val();
        }

        if (data.key == giftUser.uid) {
          giftUser = data.val();
          giftArr = giftUser.privateList;
          if (potentialRemoval) {
            findRemovedGift(oldGiftArr, giftArr);
            potentialRemoval = false;
          }
          if(consoleOutput)
            console.log("Current Gift User Updated");
        } else if (data.key == user.uid) {
          user = data.val();
          updateFriendNav(user.friends);
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

        if(checkGiftBuyer(data.val().buyer)){
          data.val().buyer = "";
          updateGiftToDBBool = true;
        }

        createGiftElement(data.val().description, data.val().link, data.val().received, data.val().receivedBy,
          data.val().title, data.key, data.val().where, data.val().uid, data.val().creationDate, data.val().buyer,
          data.val().creator, data.val().multiples);

        if(updateGiftToDBBool){
          updateGiftError(data, data.key);
          updateGiftToDBBool = false;
        }

        checkGiftLimitLite();
      });

      postRef.on('child_changed', function(data) {
        if (initializedGifts.includes(data.val().uid)) {
          let previousBoughtStatus = giftArr[data.key].received;
          let currentBoughtStatus = data.val().received;

          if (consoleOutput)
            console.log("Changing " + data.val().uid);
          giftArr[data.key] = data.val();

          if (data.val().uid == currentModalOpen) {
            closeModal(giftModal);
            if (!giftUpdateLocal) {
              if (previousBoughtStatus != currentBoughtStatus) {
                deployNotificationModal(false, "Gift Updated!", "The gift you were viewing " +
                  "was bought or un-bought by someone! Please reopen the gift to view the changes.", 4);
              } else {
                deployNotificationModal(false, "Gift Updated!", "The gift you were viewing " +
                  "was updated by another user! Please reopen the gift to view the changes.", 5);
              }
            }
          }

          changeGiftElement(data.val().description, data.val().link, data.val().received, data.val().receivedBy,
            data.val().title, data.key, data.val().where, data.val().uid, data.val().creationDate, data.val().buyer,
            data.val().creator, data.val().multiples);
        }
      });

      postRef.on('child_removed', function(data) {
        if (!giftDeleteLocal) {
          potentialRemoval = true;
          oldGiftArr = [];
          for (let i = 0; i < giftArr.length; i++) {
            oldGiftArr.push(giftArr[i]);
          }
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

  function findRemovedGift(oldArr, newArr) {
    let removedGiftIndex = -1;

    removedGiftIndex = findRemovedData(oldArr, newArr);
    if (removedGiftIndex != -1) {
      removeGiftElement(oldArr[removedGiftIndex].uid);
      let i = initializedGifts.indexOf(oldArr[removedGiftIndex].uid);
      initializedGifts.splice(i, 1);
      if (oldArr[removedGiftIndex].uid == currentModalOpen) {
        closeModal(giftModal);
        if (!giftUpdateLocal) {
          deployNotificationModal(false, "Gift Deleted!", "The gift you were viewing " +
            "was deleted by " + oldArr[removedGiftIndex].creator + "! This gift is no longer available to view...", 4);
        }
      }
      oldGiftArr.splice(removedGiftIndex, 1);
    }
  }

  function checkGiftBuyer(buyer){
    let updateGiftToDB = true;

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
    if(consoleOutput)
      console.log("A gift needs to be updated! Key: " + giftKey);
    firebase.database().ref("users/" + giftUser.uid + "/privateList/" + giftKey).update({
      buyer: ""
    });
  }

  function createGiftElement(description, link, received, receivedBy, title, key, where, uid, date, buyer, creator,
                             multiples){
    try{
      document.getElementById('testData').remove();
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
    initializedGifts.push(uid);
    if (dataCounter > buttonOpacLim) {
      addGift.style.opacity = ".75";
      swapList.style.opacity = ".75";
    }
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
    } else if (multiples != undefined) {
      if (multiples && received < 0) {
        liItem.className += " multiCheck";
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
        updateGiftElement(uid);
      };
      giftDelete.onclick = function(){
        if (creator == user.userName || creator == null || creator == undefined) {
          confirmDeletion(key, title, uid, buyer, receivedBy);
        } else {
          if (creator == ""){
            confirmDeletion(key, title, uid, buyer, receivedBy);
          } else {
            deployNotificationModal(true, "Gift Delete Failed!", "Only the creator, " + creator + ", can " +
              "delete this gift. Please contact them to delete this gift if it needs to be removed.", 4);
          }
        }
      };
      giftBuy.onclick = function(){
        giftUpdateLocal = true;
        if (!multipleBool) {
          if (received == 0) {
            firebase.database().ref("users/" + giftUser.uid + "/privateList/" + key).update({
              received: 1,
              buyer: user.userName
            });
          } else {
            deployNotificationModal(true, "Gift Already Bought!", "This gift has " +
              "already been marked as bought!");
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
            deployNotificationModal(true, "You Already Bought This!", "You can " +
              "only buy this gift once!");
          }
        }
        giftUpdateLocal = false;
      };
      giftDontBuy.onclick = function(){
        giftUpdateLocal = true;
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
                deployNotificationModal(true, "Gift Buy Error!", "Only the buyer, "
                  + buyer + ", can \"Un-Buy\" this gift. Please contact them to undo this action if this has been done " +
                  "in error.", 4);
              }
            }
          } else {
            deployNotificationModal(true, "Gift Already Un-Bought!", "This gift " +
              "has already been marked as \"Un-Bought\"!");
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
            deployNotificationModal(true, "Gift Un-Buy Error!", "You haven't bought " +
              "this gift, so you can't un-buy it!");
          }
        }
        giftUpdateLocal = false;
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
    privateUserOverride = true;
    navigation(8);
  }

  function confirmDeletion(key, title, uid, buyer, receivedBy) {
    confirmTitle.innerHTML = "Confirm Gift Delete";
    confirmContent.innerHTML = "Are you sure you want to delete your gift, " + title + "?";

    confirmBtn.onclick = function() {
      closeModal(confirmModal);
      deleteGiftElement(key, title, uid, buyer, receivedBy);
    };

    denyBtn.onclick = function() {
      closeModal(confirmModal);
      openModal(giftModal, "giftModal");
    }

    openModal(confirmModal, "confirmModal", true);

    closeConfirmModal.onclick = function() {
      closeModal(confirmModal);
      openModal(giftModal, "giftModal");
    };

    window.onclick = function(event) {
      if (event.target == confirmModal) {
        closeModal(confirmModal);
      }
    };
  }

  function deleteGiftElement(key, title, uid, buyer, receivedBy) {
    let verifyDeleteBool = true;
    let toDelete = -1;

    for (let i = 0; i < giftArr.length; i++){
      if(uid == giftArr[i].uid) {
        toDelete = i;
        break;
      }
    }

    if(toDelete != -1) {
      giftArr.splice(toDelete, 1);

      for (let i = 0; i < giftArr.length; i++) {
        if (uid == giftArr[i].uid) {
          verifyDeleteBool = false;
          break;
        }
      }
    } else {
      verifyDeleteBool = false;
    }

    if(verifyDeleteBool){
      let i = initializedGifts.indexOf(uid);
      initializedGifts.splice(i, 1);
      giftDeleteLocal = true;
      removeGiftElement(uid);

      firebase.database().ref("users/" + giftUser.uid).update({
        privateList: giftArr
      });

      closeModal(giftModal);

      deployNotificationModal(false, "Gift Deleted", "Gift " + title +
        " successfully deleted!");

      if(buyer != ""){
        let userFound = findUserNameItemInArr(buyer, userArr);
        if(userFound != -1){
          if(userArr[userFound].uid != user.uid) {
            addNotificationToDB(userArr[userFound], user.uid, title);
          }
        } else {
          if(consoleOutput)
            console.log("User not found");
        }
      } else if (receivedBy != null) {
        for (let i = 0; i < receivedBy.length; i++) {
          let userFound = findUIDItemInArr(receivedBy[i], userArr);
          if(userFound != -1){
            if(userArr[userFound].uid != user.uid) {
              addNotificationToDB(userArr[userFound], user.uid, title);
            }
          } else {
            if(consoleOutput)
              console.log("User not found");
          }
        }
      } else {
        if(consoleOutput)
          console.log("No buyer, no notification needed");
      }
      giftDeleteLocal = false;
    } else {
      deployNotificationModal(true, "Gift Delete Failed!", "Delete failed, please " +
        "try again later!");
      updateMaintenanceLog("privateFriendList", "Gift delete failed for user " +
        giftUser.userName + "'s private list, gift " + uid);
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
    let pageNameNote = "deleteGiftPrivate";
    let giftOwner = giftUser.uid;
    let buyerUserNotifications = [];
    let updateNotificationBool = false;
    let notificationFoundBool = false;
    let notificationString = generateNotificationString(giftOwner, giftDeleter, giftTitle, pageNameNote);

    if(buyerUserData.notifications != undefined){
      buyerUserNotifications = buyerUserData.notifications;
      for (let i = 0; i < buyerUserNotifications.length; i++) {
        if (buyerUserNotifications[i].data == notificationString) {
          buyerUserNotifications[i].read = 0;
          updateNotificationBool = true;
          break;
        }
      }

      if (!notificationFoundBool) {
        buyerUserNotifications.push(notificationString);
        updateNotificationBool = true;
      }
    }

    if (updateNotificationBool) {
      if (buyerUserData.notifications != undefined) {
        firebase.database().ref("users/" + buyerUserData.uid).update({
          notifications: buyerUserNotifications
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

  function checkGiftLimitLite() {
    if(giftArr.length >= giftLimit) {
      addGift.className += " btnDisabled";
      addGift.innerHTML = "Gift Limit Reached!";
      addGift.onclick = function () {
        deployNotificationModal(false, "Gift Limit Reached!", "You have reached the " +
          "limit of the number of gifts that you can create (" + giftLimit + "). Please remove some gifts in order to " +
          "create more!", 4);
      };
    }
  }

  function checkGiftLimit() {
    let disableAddBtn = false;

    if (giftUser.privateList != null) {
      if (giftUser.privateList.length >= giftLimit) {
        disableAddBtn = true;
      }
    }

    if (disableAddBtn) {
      addGift.className += " btnDisabled";
      addGift.innerHTML = "Gift Limit Reached!";
      addGift.onclick = function () {
        deployNotificationModal(false, "Gift Limit Reached!", "You have reached the " +
          "limit of the number of gifts that you can create (" + giftLimit + "). Please remove some gifts in order to " +
          "create more!", 4);
      };
    } else {
      addGift.innerHTML = "Add Private Gift";
      addGift.className = "addBtnB";
      addGift.onclick = function () {
        privateUserOverride = true;
        navigation(8);
      };
    }
  }
};
