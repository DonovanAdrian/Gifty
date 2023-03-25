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
  failedNavNum = 10;

  if(user.uid == giftUser.uid){
    if(consoleOutput)
      console.log("***HOW'D YOU GET HERE???***");
    navigation(1);//Index
  }

  if(consoleOutput)
    console.log("Friend: " + giftUser.userName + " loaded in");
  let privateFirstName = findFirstNameInFullName(giftUser.name);
  document.title = privateFirstName + "'s List";

  if (giftUser.privateList == undefined) {
    giftUser.privateList = [];
  } else {
    giftArr = giftUser.privateList;
    for (let i = 0; i < giftUser.privateList.length; i++) {
      createGiftElement(giftUser.privateList[i], i);
    }
    checkGiftLimit();
  }

  if (giftUser.privateList.length == 0) {
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
    let privateSwapFirstName = findFirstNameInFullName(giftUser.name);
    swapList.innerHTML = "View " + privateSwapFirstName + "'s <br/>Public List";
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
        if (i != -1) {
          localObjectChanges = findObjectChanges(userArr[i], data.val());
          if (localObjectChanges.length != 0) {
            userArr[i] = data.val();

            if (data.key == user.uid) {
              user = data.val();
              checkNotifications();
              updateFriendNav(user.friends);
            } else if (data.key == giftUser.uid) {
              giftUser = data.val();
            }
          }
        } else {
          userArr.push(data.val());

          if (data.key == user.uid) {
            user = data.val();
            checkNotifications();
            updateFriendNav(user.friends);
          } else if (data.key == giftUser.uid) {
            giftUser = data.val();
          }
        }
      });

      postRef.on('child_changed', function (data) {
        let i = findUIDItemInArr(data.key, userArr, true);
        if (i != -1) {
          localObjectChanges = findObjectChanges(userArr[i], data.val());
          if (localObjectChanges.length != 0) {
            if (consoleOutput)
              console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
            userArr[i] = data.val();

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
              checkNotifications();
              updateFriendNav(user.friends);
              if(consoleOutput)
                console.log("Current User Updated");
            }
          }
        }
      });

      postRef.on('child_removed', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if (i != -1) {
          if(consoleOutput)
            console.log("Removing " + userArr[i].userName + " / " + data.val().userName);
          userArr.splice(i, 1);
        }
      });
    };

    let fetchGifts = function (postRef) {
      postRef.on('child_added', function (data) {
        if (giftArr.indexOf(data.val()) == -1)
          giftArr.push(data.val());

        if(checkGiftBuyer(data.val().buyer)){
          data.val().buyer = "";
          updateGiftToDBBool = true;
        }

        createGiftElement(data.val(), data.key);

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

          changeGiftElement(data.val(), data.key);
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
};

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

  if(buyer == "" || buyer == undefined || userUserNames.includes(buyer)){
    updateGiftToDB = false;
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

function createGiftElement(pGiftData, pGiftKey){
  let createGiftUid = pGiftData.uid;
  let createGiftTitle = pGiftData.title;

  if (initializedGifts.indexOf(createGiftUid) == -1) {
    try {
      document.getElementById('testData').remove();
    } catch (err) {}

    let liItem = document.createElement("LI");
    liItem.id = "gift" + createGiftUid;
    initGiftElement(liItem, pGiftData, pGiftKey);
    let textNode = document.createTextNode(createGiftTitle);
    liItem.appendChild(textNode);

    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
    clearInterval(commonLoadingTimer);
    clearInterval(offlineTimer);
    dataCounter++;
    initializedGifts.push(createGiftUid);
    if (dataCounter > buttonOpacLim) {
      addGift.style.opacity = ".75";
      swapList.style.opacity = ".75";
    }
  } else {
    changeGiftElement(pGiftData, pGiftKey);
  }
}

function changeGiftElement(pGiftData, pGiftKey) {
  let changeGiftUid = pGiftData.uid;
  let changeGiftTitle = pGiftData.title;
  let editGift = document.getElementById('gift' + changeGiftUid);
  editGift.innerHTML = changeGiftTitle;
  initGiftElement(editGift, pGiftData, pGiftKey);
}

function initGiftElement(liItem, pGiftData, pGiftKey) {
  let multipleBool = false;
  let pGiftDescription = pGiftData.description;
  let pGiftLink = pGiftData.link;
  let pGiftReceived = pGiftData.received;
  let pGiftReceivedBy = pGiftData.receivedBy;
  let pGiftTitle = pGiftData.title;
  let pGiftWhere = pGiftData.where;
  let pGiftBuyer = pGiftData.buyer;
  let pGiftUid = pGiftData.uid;
  let pGiftDate = pGiftData.creationDate;
  let pGiftCreator = pGiftData.creator;
  let pGiftMultiples = pGiftData.multiples;
  let tempPGiftBuyer = "";

  liItem.className = "gift";
  if(pGiftReceived == 1) {
    liItem.className += " checked";
  } else if (pGiftMultiples != undefined) {
    if (pGiftMultiples && pGiftReceived < 0) {
      liItem.className += " multiCheck";
    }
  }

  liItem.onclick = function (){
    if (pGiftReceivedBy == undefined) {
      pGiftReceivedBy = [];
    }

    if (pGiftMultiples != undefined) {
      multipleBool = pGiftMultiples;
    }

    giftTitle.innerHTML = pGiftTitle;

    if (pGiftLink != ""){
      giftLink.innerHTML = "Click me to go to the webpage!";
      giftLink.onclick = function() {
        giftLinkRedirect(pGiftLink);
      };
    } else {
      giftLink.innerHTML = "There was no link provided";
      giftLink.onclick = function() {
      };
    }
    if(pGiftReceived == 1){
      if(pGiftBuyer == undefined || pGiftBuyer == ""){
        giftBought.innerHTML = "This gift has been bought";
      } else {
        if (pGiftBuyer == user.userName)
          giftBought.innerHTML = "This gift was bought by you!";
        else {
          tempPGiftBuyer = fetchNameByUserName(pGiftBuyer);
          if (tempPGiftBuyer == undefined)
            tempPGiftBuyer = pGiftBuyer;
          giftBought.innerHTML = "This gift was bought by " + tempPGiftBuyer;
        }
      }
    } else {
      if (pGiftMultiples == undefined || pGiftReceived == 0) {
        giftBought.innerHTML = "This gift has not been bought yet";
      } else {
        let userBought = pGiftReceivedBy.indexOf(user.uid);
        if (userBought == -1) {
          if (pGiftReceivedBy.length == 1)
            giftBought.innerHTML = "This gift was bought by " + pGiftReceivedBy.length + " person!";
          else
            giftBought.innerHTML = "This gift was bought by " + pGiftReceivedBy.length + " people!";
        } else {
          if (pGiftReceivedBy.length == 1)
            giftBought.innerHTML = "This gift was bought by you!";
          else
            giftBought.innerHTML = "This gift was bought by " + pGiftReceivedBy.length + " people... Including you!";
        }
      }
    }
    if (pGiftDescription != "") {
      giftDescription.innerHTML = "Description: " + pGiftDescription;
    } else {
      giftDescription.innerHTML = "There was no description provided";
    }
    if (pGiftCreator == undefined) {
      giftCreator.innerHTML = "Gift creator unavailable";
    } else {
      if (pGiftCreator == "")
        giftCreator.innerHTML = "Gift creator unavailable";
      else
        giftCreator.innerHTML = "Gift was created by " + pGiftCreator;
    }
    if (pGiftWhere != "") {
      giftWhere.innerHTML = "This can be found at: " + pGiftWhere;
    } else {
      giftWhere.innerHTML = "There was no location provided";
    }
    if (pGiftDate != undefined) {
      if (pGiftDate != "") {
        giftCreationDate.innerHTML = "Created on: " + pGiftDate;
      } else {
        giftCreationDate.innerHTML = "Creation date not available";
      }
    } else {
      giftCreationDate.innerHTML = "Creation date not available";
    }
    giftEdit.onclick = function(){
      updateGiftElement(pGiftUid);
    };
    giftDelete.onclick = function(){
      if (pGiftCreator == user.userName || pGiftCreator == undefined) {
        confirmDeletion(pGiftKey, pGiftTitle, pGiftUid, pGiftBuyer, pGiftReceivedBy);
      } else {
        if (pGiftCreator == ""){
          confirmDeletion(pGiftKey, pGiftTitle, pGiftUid, pGiftBuyer, pGiftReceivedBy);
        } else {
          let tempGiftCreator = fetchNameByUserName(pGiftCreator);
          if (tempGiftCreator == undefined)
            tempGiftCreator = pGiftCreator;
          deployNotificationModal(true, "Gift Delete Failed!", "Only the creator, " + tempGiftCreator + ", can " +
              "delete this gift. Please contact them to delete this gift if it needs to be removed.", 4);
        }
      }
    };
    giftBuy.onclick = function(){
      buyGiftToDB(pGiftUid, pGiftKey, pGiftMultiples, pGiftReceived, pGiftReceivedBy, false);
    };
    giftDontBuy.onclick = function(){
      buyGiftToDB(pGiftUid, pGiftKey, pGiftMultiples, pGiftReceived, pGiftReceivedBy, true, pGiftBuyer);
    };

    openModal(giftModal, pGiftUid);

    closeGiftModal.onclick = function() {
      closeModal(giftModal);
    };
  };
}

function fetchNameByUserName(userNameInput) {
  for (let i = 0; i < userArr.length; i++) {
    if (userNameInput == userArr[i].userName) {
      return userArr[i].name;
    }
  }

  return null;
}

function buyGiftToDB(priUid, key, multiples, received, receivedBy, unBuyBool, buyer) {
  let multipleBool = false;
  let updateToDB = false;
  let buyerUserName = "!!!";
  let buyerData;
  giftUpdateLocal = true;

  if (buyer != undefined)
    buyerUserName = buyer;

  if (multiples != undefined)
    multipleBool = multiples;

  if (!multipleBool) {
    if (!unBuyBool && received == 0) {
      received = 1;
      buyerData = user.userName;
      updateToDB = true;
    } else if (unBuyBool && received == 1 && (buyerUserName == user.userName || buyerUserName == "")) {
      received = 0;
      buyerData = "";
      updateToDB = true;
    } else {
      if (!unBuyBool)
        deployNotificationModal(true, "Gift Already Bought!", "This gift has " +
            "already been marked as bought!");
      else if (received == 0)
        deployNotificationModal(true, "Gift Already Un-Bought!", "This gift " +
            "has already been marked as \"Un-Bought\"!");
      else {
        let tempGiftBuyer = fetchNameByUserName(buyer);
        if (tempGiftBuyer == undefined)
          tempGiftBuyer = buyer;
        deployNotificationModal(true, "Gift Buy Error!", "Only the buyer, "
            + tempGiftBuyer + ", can \"Un-Buy\" this gift. Please contact them to undo this action if this has been done " +
            "in error.", 4);
      }
    }
    if (updateToDB) {
      firebase.database().ref("users/" + giftUser.uid + "/privateList/" + key).update({
        received: received,
        buyer: buyerData
      });
    }
  } else {
    let userBought = receivedBy.indexOf(user.uid);
    if (!unBuyBool && userBought == -1) {
      receivedBy.push(user.uid);
      received = received - 1;
      updateToDB = true;
    } else if (unBuyBool && userBought != -1) {
      receivedBy.splice(userBought, 1);
      received = received + 1;
      updateToDB = true;
    } else {
      if (!unBuyBool)
        deployNotificationModal(true, "You Already Bought This!", "You can only " +
            "buy this gift once!");
      else
        deployNotificationModal(true, "Gift Un-Buy Error!", "You haven't bought " +
            "this gift, so you can't un-buy it!");
    }
    if (updateToDB) {
      firebase.database().ref("users/" + giftUser.uid + "/privateList/" + key).update({
        received: received,
        receivedBy: receivedBy
      });
    }
  }

  if (updateToDB) {
    listenForDBChanges("Buy", priUid);
  }

  giftUpdateLocal = false;
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
          addPrivateDeleteNoteToDB(userArr[userFound], user.uid, title);
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
            addPrivateDeleteNoteToDB(userArr[userFound], user.uid, title);
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

function addPrivateDeleteNoteToDB(buyerUserData, giftDeleter, giftTitle){
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
        notificationFoundBool = true;
        break;
      }
    }

    if (!notificationFoundBool) {
      addNotificationToDB(buyerUserData, notificationString);
    }
  } else {
    addNotificationToDB(buyerUserData, notificationString);
  }

  if (updateNotificationBool) {
    firebase.database().ref("users/" + buyerUserData.uid).update({
      notifications: buyerUserNotifications
    });
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
      if (!dbOperationInProgress)
        privateUserOverride = true;
      navigation(8);
    };
  }
}
