/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let privateFriendListElements = [];
let giftArr = [];
let oldGiftArr = [];
let userUserNames = [];
let initializedGifts = [];

let initializingElements = false;
let updateGiftToDBBool = false;
let giftListEmptyBool = false;
let potentialRemoval = false;
let giftDeleteLocal = false;
let giftUpdateLocal = false;

let giftLimit = 50;

let giftCreationDate;
let addGift;
let swapList;
let giftModal;
let listNote;
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
    initializingElements = true;
    for (let i = 0; i < giftUser.privateList.length; i++) {
      createGiftElement(giftUser.privateList[i], i);
    }
    if (!createdJokeGift && giftUser.privateList.length > 0 && jokeGiftEnabled)
      rollForAPrivateJokeGift();
    initializingElements = false;
    checkGiftLimit();
  }

  if (giftUser.privateList.length == 0) {
    deployListEmptyNotification("No Gifts Found! Add Some Gifts With The Button Below!");
    giftListEmptyBool = true;
  }
}

function rollForAPrivateJokeGift() {
  let randomNumberA = Math.floor(Math.random() * jokeGiftChances);
  let randomNumberB = Math.floor(Math.random() * jokeGiftChances);

  if (randomNumberA == randomNumberB) {
    generateCustomPrivateGift();
    createdJokeGift = true;
  } else {
    if (consoleOutput)
      console.log("Nope... Not this time!");
  }
}

function generateCustomPrivateGift() {
  let liItem = document.createElement("LI");
  let tempGiftUserName = findFirstNameInFullName(giftUser.name);
  liItem.id = "giftJokeGift";
  liItem.className = "gift";

  liItem.onclick = function () {
    giftTitle.innerHTML = "Vegetti";
    giftLink.innerHTML = "There was no link provided";
    giftLink.onclick = function() {};
    giftDescription.innerHTML = "It's been " + tempGiftUserName + "'s dream to get the premier in all of vegetable " +
        "spiralizers, but not just any Vegetti... The Vegetti VPRO Pro Deluxe Pack! It comes with 69 customizable " +
        "accessories that allows anyone to shave the vegetables to their liking for the perfect dish. It's one of a kind.";
    giftCreator.innerHTML = "This gift was created by you!";
    giftWhere.innerHTML = "Anywhere where Vegetti's are sold!";
    giftBought.innerHTML = "This gift hasn't been bought yet?";
    giftCreationDate.innerHTML = "Created today!!";

    giftBuy.onclick = function(){
      closeModal(giftModal);
      liItem.innerHTML = "Just Kidding!!";
      showUpdatedItem("JokeGift", true);
    };
    giftDontBuy.onclick = function(){
      closeModal(giftModal);
      liItem.innerHTML = "Just Kidding!!";
      showUpdatedItem("JokeGift", true);
    };

    openModal(giftModal, "PJokeGift");

    closeGiftModal.onclick = function() {
      closeModal(giftModal);
      liItem.innerHTML = "Just Kidding!!";
      showUpdatedItem("JokeGift", true);
    };
    updateMaintenanceLog(pageName, "The user, \"" + user.userName + "\" found an easter egg! (" + pageName +
        " Page) They also interacted with the gift, woohoo!");
    updateUserScore(user,100);
  };

  let textNode = document.createTextNode("Vegetti");
  liItem.appendChild(textNode);
  dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
  dataCounter++;
}

window.onload = function instantiate() {
  pageName = "PrivateFriendList";
  notificationBtn = document.getElementById("notificationButton");
  giftCreationDate = document.getElementById("giftCreationDate");
  confirmModal = document.getElementById("confirmModal");
  closeConfirmModal = document.getElementById("closeConfirmModal");
  confirmTitle = document.getElementById("confirmTitle");
  confirmContent = document.getElementById("confirmContent");
  confirmBtn = document.getElementById("confirmBtn");
  denyBtn = document.getElementById("denyBtn");
  inviteNote = document.getElementById("inviteNote");
  listNote = document.getElementById("listNote");
  addGift = document.getElementById("addGift");
  backBtn = document.getElementById("backBtn");
  swapList = document.getElementById("swapList");
  giftModal = document.getElementById("giftModal");
  closeGiftModal = document.getElementById("closeGiftModal");
  giftTitle = document.getElementById("giftTitle");
  giftLink = document.getElementById("giftLink");
  giftWhere = document.getElementById("giftWhere");
  giftDescription = document.getElementById("giftDescription");
  giftCreator = document.getElementById("giftCreator");
  giftBought = document.getElementById("giftBought");
  giftBuy = document.getElementById("giftBuy");
  giftDontBuy = document.getElementById("giftDontBuy");
  giftEdit = document.getElementById("giftEdit");
  giftDelete = document.getElementById("giftDelete");
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

  if (createdJokeGift) {
    updateMaintenanceLog(pageName, "The user, \"" + user.userName + "\" found an easter egg! (" + pageName +
        " Page) It was only generated though, they didn't click on it... yet.");
  }

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
      navigation(9);//FriendList
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
      postRef.on("child_added", function (data) {
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
            saveCriticalCookies();
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
          saveCriticalCookies();
        }
      });

      postRef.on("child_changed", function (data) {
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
              checkGiftLimit();
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
            saveCriticalCookies();
          }
        }
      });

      postRef.on("child_removed", function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if (i != -1) {
          if(consoleOutput)
            console.log("Removing " + userArr[i].userName + " / " + data.val().userName);
          userArr.splice(i, 1);
          saveCriticalCookies();
        }
      });
    };

    let fetchGifts = function (postRef) {
      postRef.on("child_added", function (data) {
        if (findUIDItemInArr(data.val().uid, giftArr, true) == -1)
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
        giftUser.privateList = giftArr;
        saveCriticalCookies();
        checkGiftLimitLite();
      });

      postRef.on("child_changed", function(data) {
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
          if (!potentialRemoval && !giftDeleteLocal)
            showUpdatedItem(data.val().uid);
          giftUser.giftList = giftArr;
          saveCriticalCookies();
          checkGiftLimit();
        }
      });

      postRef.on("child_removed", function() {
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
      postRef.on("child_added", function (data) {
        inviteArr.push(data.val());

        inviteNote.style.background = "#ff3923";
      });

      postRef.on("child_changed", function (data) {
        if(consoleOutput)
          console.log(inviteArr);
        inviteArr[data.key] = data.val();
        if(consoleOutput)
          console.log(inviteArr);
      });

      postRef.on("child_removed", function (data) {
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
      postRef.on("child_added", function (data) {
        if (data.key == "giftLimit") {
          giftLimit = data.val();
          checkGiftLimit();
        }
      });

      postRef.on("child_changed", function (data) {
        if (data.key == "giftLimit") {
          giftLimit = data.val();
          checkGiftLimit();
        }
      });

      postRef.on("child_removed", function (data) {
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
    let i = initializedGifts.indexOf(oldArr[removedGiftIndex].uid);
    initializedGifts.splice(i, 1);
    if (oldArr[removedGiftIndex].uid == currentModalOpen) {
      closeModal(giftModal);
      if (!giftUpdateLocal) {
        deployNotificationModal(false, "Gift Deleted!", "The gift you were viewing " +
            "was deleted by " + oldArr[removedGiftIndex].creator + "! This gift is no longer available to view...", 4);
      }
    }
    showUpdatedItem(oldArr[removedGiftIndex].uid, true);
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
      document.getElementById("testData").remove();
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
    if (dataCounter > buttonOpacLim) {
      addGift.style.opacity = ".75";
      swapList.style.opacity = ".75";
    }
    initializedGifts.push(createGiftUid);
    if (!initializingElements)
      showUpdatedItem(createGiftUid);
  } else {
    changeGiftElement(pGiftData, pGiftKey);
  }
}

function changeGiftElement(pGiftData, pGiftKey) {
  let changeGiftUid = pGiftData.uid;
  let changeGiftTitle = pGiftData.title;
  let editGift = document.getElementById("gift" + changeGiftUid);
  editGift.innerHTML = changeGiftTitle;
  initGiftElement(editGift, pGiftData, pGiftKey);
}

function initGiftElement(liItem, pGiftData, pGiftKey) {
  pGiftData = initGiftDataIfEmpty(pGiftData);
  let buttonVisible = false;
  let buttonBreakAdded = false;
  let creatorUserNameFetchedOrBlank = false;
  let buyerUserNameFetchedOrBlank = false;
  let pGiftDescription = pGiftData.description;
  let pGiftLink = pGiftData.link;
  let pGiftReceived = pGiftData.received;
  let pGiftReceivedBy = pGiftData.receivedBy;
  let pGiftTitle = pGiftData.title;
  let pGiftWhere = pGiftData.where;
  let pGiftBuyer = pGiftData.buyer;
  let pGiftBuyerUID = pGiftData.buyer;
  let pGiftUid = pGiftData.uid;
  let pGiftDate = pGiftData.creationDate;
  let pGiftCreator = pGiftData.creator;
  let pGiftMultiples = pGiftData.multiples;
  let giftInfoPrefix = "";

  if (pGiftCreator != "") {
    let uidIndex = findUIDItemInArr(pGiftCreator, userArr, true);
    if (uidIndex == -1) {
      uidIndex = findUserNameItemInArr(pGiftCreator, userArr, true);
      creatorUserNameFetchedOrBlank = true;
    }
    if (uidIndex == -1) {
      pGiftCreator = "";
      creatorUserNameFetchedOrBlank = true;
    } else {
      pGiftCreator = userArr[uidIndex].uid;
    }
    if (creatorUserNameFetchedOrBlank && dbInitialized) {
      firebase.database().ref("users/" + giftUser.uid + "/privateList/" + pGiftKey).update({
        creator: pGiftCreator
      });
    }
    if (uidIndex != -1) {
      pGiftCreator = findFirstNameInFullName(userArr[uidIndex].name);
    }
  }

  if (pGiftBuyer != "") {
    let uidIndex = findUIDItemInArr(pGiftBuyer, userArr, true);
    if (uidIndex == -1) {
      uidIndex = findUserNameItemInArr(pGiftBuyer, userArr, true);
      buyerUserNameFetchedOrBlank = true;
    }
    if (uidIndex == -1) {
      pGiftBuyer = "";
      buyerUserNameFetchedOrBlank = true;
    } else {
      pGiftBuyer = userArr[uidIndex].uid;
    }
    if (buyerUserNameFetchedOrBlank && dbInitialized) {
      firebase.database().ref("users/" + giftUser.uid + "/privateList/" + pGiftKey).update({
        buyer: pGiftBuyer
      });
    }
    if (uidIndex != -1) {
      pGiftBuyer = findFirstNameInFullName(userArr[uidIndex].name);
    }
  }

  liItem.className = "gift";
  if(pGiftReceived == 1) {
    liItem.className += " checked";
  } else if (pGiftMultiples && pGiftReceived < 0) {
    liItem.className += " multiCheck";
  }

  liItem.onclick = function (){
    giftTitle.innerHTML = pGiftTitle;

    if (pGiftLink != ""){
      buttonVisible = true;
      giftLink.innerHTML = "Click me to go to this gift's webpage!";
      giftLink.style.display = "inline-block";
      giftLink.className = "basicBtn";
      giftLink.onclick = function() {
        giftLinkRedirect(pGiftLink);
      };
    } else {
      giftLink.innerHTML = "There was no link provided";
      giftLink.style.display = "none";
      giftLink.onclick = function() {};
    }

    if (buttonVisible) {
      giftInfoPrefix = "<br>";
      buttonBreakAdded = true;
    }
    if (pGiftWhere != "") {
      giftWhere.innerHTML = giftInfoPrefix + "This can be found at: " + pGiftWhere;
    } else {
      giftWhere.innerHTML = "";
    }
    giftInfoPrefix = "";

    if (buttonVisible && !buttonBreakAdded) {
      giftInfoPrefix = "<br>";
      buttonBreakAdded = true;
    }
    if (pGiftDescription != "") {
      giftDescription.innerHTML = giftInfoPrefix + "Description: " + pGiftDescription;
    } else {
      giftDescription.innerHTML = "";
    }
    giftInfoPrefix = "";

    if (buttonVisible && !buttonBreakAdded) {
      giftInfoPrefix = "<br>";
      buttonBreakAdded = true;
    }
    if (pGiftCreator == "") {
      giftCreator.innerHTML = "";
    } else {
      if (pGiftData.creator == user.uid) {
        giftCreator.innerHTML = giftInfoPrefix + "This gift was created by you!";
      } else {
        giftCreator.innerHTML = giftInfoPrefix + "Gift was created by " + pGiftCreator;
      }
    }
    giftInfoPrefix = "";

    if(pGiftReceived == 1) {
      if(pGiftBuyer == "") {
        giftBought.innerHTML = "This gift has been bought";
      } else {
        giftBought.innerHTML = "This gift has been bought by " +
            fetchGiftReceivedSuffix(false, pGiftBuyer, pGiftReceivedBy);
      }
    } else {
      if (pGiftReceived == 0) {
        giftBought.innerHTML = "This gift has not been bought yet";
      } else {
        giftBought.innerHTML = "This gift has been bought by " +
            fetchGiftReceivedSuffix(true, pGiftBuyer, pGiftReceivedBy);
      }
    }

    if (pGiftDate != "") {
      giftCreationDate.innerHTML = "Created on: " + pGiftDate;
    } else {
      giftCreationDate.innerHTML = "Creation date not available";
    }

    giftEdit.onclick = function(){
      updateGiftElement(pGiftUid);
    };
    giftDelete.onclick = function(){
      if (pGiftData.creator == user.uid) {
        confirmDeletion(pGiftKey, pGiftTitle, pGiftUid, pGiftBuyer, pGiftReceivedBy);
      } else {
        if (pGiftCreator == "") {
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
      buyGiftToDB(pGiftUid, pGiftKey, pGiftMultiples, pGiftReceived, pGiftReceivedBy, true, pGiftBuyer, pGiftBuyerUID);
    };

    openModal(giftModal, pGiftUid);

    closeGiftModal.onclick = function() {
      closeModal(giftModal);
    };
  };
}

function buyGiftToDB(priUid, key, multiples, received, receivedBy, unBuyBool, buyer, buyerUID) {
  let updateToDB = false;
  let buyerData;
  let multipleBool;
  giftUpdateLocal = true;
  multipleBool = multiples;

  if (!multipleBool) {
    if (!unBuyBool && received == 0) {
      received = 1;
      buyerData = user.uid;
      updateToDB = true;
    } else if (unBuyBool && received == 1 && (buyerUID == user.uid || buyerUID == "")) {
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
  document.getElementById("gift" + uid).remove();

  dataCounter--;
  if (dataCounter == 0){
    deployListEmptyNotification("No Gifts Found! Add Some Gifts With The Button Below!");
  }
}

function updateGiftElement(uid) {
  giftStorage = uid;
  privateUserOverride = true;
  navigation(8);//GiftAddUpdate
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

    closeModal(currentModalOpen);

    successfulDBOperationTitle = "Gift Deleted";
    successfulDBOperationNotice = "Gift \"" + title + "\", was successfully deleted!";
    showSuccessfulDBOperation = true;
    listenForDBChanges("Delete", uid);

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
    updateMaintenanceLog("privateFriendList", "Gift delete failed for user \"" +
        giftUser.userName + "\", private list, gift " + uid);
  }
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
          "limit of the number of gifts that you can create (" + giftLimit + "). If you have more than that, no " +
          "problem! However, you'll need to remove some gifts to make new ones.", 8);
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
      navigation(8);//GiftAddUpdate
      privateUserOverride = false;
    };
  }
}

function showUpdatedItem(inputUid, removeItem) {
  let giftElem = document.getElementById("gift" + inputUid);
  let backColor = window.getComputedStyle(giftElem).backgroundColor;
  let oldCssColor = "";
  let oldCssColorA = "#f9f9f9";
  let oldCssColorB = "#eee";
  let newCssColor = "#c4ffc4";
  let giftElementTimer = 0;
  let maxGiftElemTimer = 3;
  let giftElementInterval;

  if (removeItem == undefined)
    removeItem = false;
  else if (removeItem) {
    newCssColor = "#ffc4c4";
    giftElem.onclick = function(){};
  }

  if (backColor == "rgb(249, 249, 249)") {
    oldCssColor = oldCssColorA;
  } else if (backColor == "rgb(238, 238, 238)") {
    oldCssColor = oldCssColorB;
  }

  giftElem.style.backgroundColor = newCssColor;

  giftElementInterval = setInterval(function(){
    giftElementTimer = giftElementTimer + 1;
    if(giftElementTimer >= maxGiftElemTimer){
      giftElementTimer = 0;
      giftElem.style.background = oldCssColor;
      if (removeItem)
        removeGiftElement(inputUid);
      refreshAllElements();
      clearInterval(giftElementInterval);
    }
  }, 1000);

  function refreshAllElements() {
    let tempElem;
    let tempAlternator = 0;
    let oldCssOptions = [oldCssColorB, oldCssColorA];
    if ((initializedGifts.length % 2) == 0) {
      oldCssOptions = [oldCssColorA, oldCssColorB];
    }
    for (let i = 0; i < initializedGifts.length; i++) {
      if (tempAlternator == 0)
        tempAlternator = 1;
      else
        tempAlternator = 0;

      tempElem = document.getElementById("gift" + initializedGifts[i]);
      tempElem.style.background = oldCssOptions[tempAlternator];
    }
  }
}
