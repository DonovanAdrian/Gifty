/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let friendListElements = [];
let giftArr = [];
let oldGiftArr = [];
let userUserNames = [];
let initializedGifts = [];

let initializingElements = false;
let updateGiftToDBBool = false;
let giftListEmptyBool = false;
let potentialRemoval = false;
let giftUpdateLocal = false;
let createdJokeGift = false;

let moderationSet = -1;

let giftCreationDate;
let giftModal;
let giftTitle;
let giftLink;
let giftWhere;
let giftDescription;
let giftBought;
let giftBuy;
let giftDontBuy;
let listNote;
let closeGiftModal;
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
  failedNavNum = 9;

  if(consoleOutput)
    console.log("Friend: " + giftUser.userName + " loaded in");
  let publicFirstName = findFirstNameInFullName(giftUser.name);
  document.title = publicFirstName + "'s List";

  if (giftUser.giftList == undefined) {
    giftUser.giftList = [];
  } else {
    giftArr = giftUser.giftList;
    initializingElements = true;
    for (let i = 0; i < giftUser.giftList.length; i++) {
      createGiftElement(giftUser.giftList[i], i);
      if (!createdJokeGift && giftUser.giftList.length > 1 && jokeGiftEnabled)
        rollForAJokeGift();
    }
    initializingElements = false;
  }

  if (giftUser.giftList.length == 0) {
    deployListEmptyNotification("No Gifts Found! Your Friend Must Not Have Any Gifts!");
    giftListEmptyBool = true;
  }
}

function rollForAJokeGift() {
  let randomNumberA = Math.floor(Math.random() * jokeGiftChances);
  let randomNumberB = Math.floor(Math.random() * jokeGiftChances);

  if (randomNumberA == randomNumberB) {
    generateCustomGift();
    createdJokeGift = true;
  }
}

function generateCustomGift() {
  let liItem = document.createElement("LI");
  liItem.id = "giftJokeGift";
  liItem.className = "gift";

  liItem.onclick = function () {
    giftTitle.innerHTML = "Vegetti";
    giftLink.innerHTML = "There was no link provided";
    giftLink.onclick = function() {};
    giftDescription.innerHTML = "It's been my dream to get the premier in all of vegetable spiralizers, but not just any Vegetti... " +
        "The Vegetti VPRO Pro Deluxe Pack! I get 13 customizable accessories that allow me to shave the vegetables " +
        "to my liking for the perfect dish. It's one of a kind.";
    giftWhere.innerHTML = "Anywhere where Vegetti's are sold!";
    giftBought.innerHTML = "This gift hasn't been bought yet!";
    giftCreationDate.innerHTML = "Created today!";

    giftBuy.onclick = function(){
      closeModal(giftModal);
      liItem.innerHTML = "Just Kidding!";
      showUpdatedItem("JokeGift", true);
    };
    giftDontBuy.onclick = function(){
      closeModal(giftModal);
      liItem.innerHTML = "Just Kidding!";
      showUpdatedItem("JokeGift", true);
    };

    openModal(giftModal, "JokeGift");

    closeGiftModal.onclick = function() {
      closeModal(giftModal);
      liItem.innerHTML = "Just Kidding!";
      showUpdatedItem("JokeGift", true);
    };
  };

  let textNode = document.createTextNode("Vegetti");
  liItem.appendChild(textNode);
  dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
}

window.onload = function instantiate() {
  pageName = "FriendList";
  notificationBtn = document.getElementById("notificationButton");
  confirmModal = document.getElementById("confirmModal");
  closeConfirmModal = document.getElementById("closeConfirmModal");
  confirmTitle = document.getElementById("confirmTitle");
  confirmContent = document.getElementById("confirmContent");
  confirmBtn = document.getElementById("confirmBtn");
  denyBtn = document.getElementById("denyBtn");
  backBtn = document.getElementById("backBtn");
  listNote = document.getElementById("listNote");
  inviteNote = document.getElementById("inviteNote");
  giftModal = document.getElementById("giftModal");
  closeGiftModal = document.getElementById("closeGiftModal");
  giftTitle = document.getElementById("giftTitle");
  giftLink = document.getElementById("giftLink");
  giftWhere = document.getElementById("giftWhere");
  giftDescription = document.getElementById("giftDescription");
  giftBought = document.getElementById("giftBought");
  giftCreationDate = document.getElementById("giftCreationDate");
  giftBuy = document.getElementById("giftBuy");
  giftDontBuy = document.getElementById("giftDontBuy");
  friendListElements = [notificationBtn, dataListContainer, offlineModal, offlineSpan, confirmModal, closeConfirmModal,
    confirmTitle, confirmContent, confirmBtn, denyBtn, noteSpan, backBtn, listNote, inviteNote, notificationModal,
    notificationTitle, notificationInfo, noteSpan, giftModal, closeGiftModal, giftTitle, giftLink, giftWhere,
    giftDescription, giftBought, giftCreationDate, giftBuy, giftDontBuy, testData];

  getCurrentUser();
  commonInitialization();
  verifyElementIntegrity(friendListElements);

  userBase = firebase.database().ref("users/");
  userGifts = firebase.database().ref("users/" + giftUser.uid + "/giftList");
  userInvites = firebase.database().ref("users/" + user.uid + "/invites");

  databaseQuery();
  alternateButtonLabel(listNote, "Gift Lists", "Public");

  for(let i = 0; i < userArr.length; i++){
    userUserNames.push(userArr[i].userName);
  }

  function initializeSwapBtn() {
    let publicSwapFirstName = findFirstNameInFullName(giftUser.name);
    swapList.innerHTML = "View " + publicSwapFirstName + "'s <br/>Private List";
    swapList.onclick = function () {
      sessionStorage.setItem("validGiftUser", JSON.stringify(giftUser));
      navigation(10);//PrivateFriendList
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
              giftArr = giftUser.giftList;
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
        giftUser.giftList = giftArr;
        saveCriticalCookies();
      });

      postRef.on("child_changed", function(data) {
        if (initializedGifts.includes(data.val().uid)) {
          let previousBoughtStatus = giftArr[data.key].received;
          let currentBoughtStatus = data.val().received;
          giftArr[data.key] = data.val();

          if (data.val().uid == currentModalOpen) {
            closeModal(giftModal);
            if (!giftUpdateLocal) {
              if (previousBoughtStatus != currentBoughtStatus) {
                deployNotificationModal(false, "Gift Updated!", "The gift you were viewing " +
                    "was bought or un-bought by someone! Please reopen the gift to view the changes.", 4);
              } else {
                deployNotificationModal(false, "Gift Updated!", "The gift you were viewing " +
                    "was updated by " + giftUser.name + "! Please reopen the gift to view the changes.", 4);
              }
            }
          }

          changeGiftElement(data.val(), data.key);
          if (!potentialRemoval)
            showUpdatedItem(data.val().uid);
          giftUser.giftList = giftArr;
          saveCriticalCookies();
        }
      });

      postRef.on("child_removed", function(data) {
        potentialRemoval = true;
        oldGiftArr = [];
        for (let i = 0; i < giftArr.length; i++) {
          oldGiftArr.push(giftArr[i]);
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

    fetchData(userBase);
    fetchGifts(userGifts);
    fetchInvites(userInvites);

    listeningFirebaseRefs.push(userBase);
    listeningFirebaseRefs.push(userGifts);
    listeningFirebaseRefs.push(userInvites);
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
            "was deleted by " + giftUser.name + "! This gift is no longer available to view...", 4);
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
  firebase.database().ref("users/" + giftUser.uid + "/giftList/" + giftKey).update({
    buyer: ""
  });
}

function createGiftElement(giftData, giftKey){
  let giftUid = giftData.uid;
  let giftTitle = giftData.title;

  if (initializedGifts.indexOf(giftUid) == -1) {
    try {
      document.getElementById("testData").remove();
    } catch (err) {}

    let liItem = document.createElement("LI");
    liItem.id = "gift" + giftUid;
    initGiftElement(liItem, giftData, giftKey);
    let textNode = document.createTextNode(giftTitle);
    liItem.appendChild(textNode);
    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
    clearInterval(commonLoadingTimer);
    clearInterval(offlineTimer);
    dataCounter++;
    if (dataCounter > buttonOpacLim) {
      swapList.style.opacity = ".75";
    }
    initializedGifts.push(giftUid);
    if (!initializingElements)
      showUpdatedItem(giftUid);
  } else {
    changeGiftElement(giftData, giftKey);
  }
}

function changeGiftElement(giftData, giftKey) {
  let uid = giftData.uid;
  let title = giftData.title;
  let editGift = document.getElementById("gift" + uid);
  editGift.innerHTML = title;
  initGiftElement(editGift, giftData, giftKey);
}

function initGiftElement(liItem, giftData, giftKey) {
  giftData = initGiftDataIfEmpty(giftData);
  let buttonVisible = false;
  let buttonBreakAdded = false;
  let giftDescriptionData = giftData.description;
  let giftLinkData = giftData.link;
  let giftReceivedData = giftData.received;
  let giftReceivedBy = giftData.receivedBy;
  let giftTitleData = giftData.title;
  let giftWhereData = giftData.where;
  let giftBuyer = giftData.buyer;
  let giftUid = giftData.uid;
  let giftDate = giftData.creationDate;
  let giftMultiples = giftData.multiples;
  let giftInfoPrefix = "";

  liItem.className = "gift";
  if(giftReceivedData == 1) {
    liItem.className += " checked";
    if(consoleOutput)
      console.log("Checked, created");
  } else if (giftMultiples != undefined) {
    if (giftMultiples && giftReceivedData < 0) {
      liItem.className += " multiCheck";
      if (consoleOutput)
        console.log("Multi check, created");
    }
  }

  liItem.onclick = function () {
    giftTitle.innerHTML = giftTitleData;

    if (giftLinkData != ""){
      buttonVisible = true;
      giftLink.innerHTML = "Click me to go to this gift's webpage!";
      giftLink.style.display = "inline-block";
      giftLink.className = "basicBtn";
      giftLink.onclick = function() {
        giftLinkRedirect(giftLinkData);
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
    if (giftWhereData != "") {
      giftWhere.innerHTML = giftInfoPrefix + "This can be found at: " + giftWhereData;
    } else {
      giftWhere.innerHTML = "";
    }
    giftInfoPrefix = "";

    if (buttonVisible && !buttonBreakAdded) {
      giftInfoPrefix = "<br>";
      buttonBreakAdded = true;
    }
    if (giftDescriptionData != "") {
      giftDescription.innerHTML = giftInfoPrefix + "Description: " + giftDescriptionData;
    } else {
      giftDescription.innerHTML = "";
    }
    giftInfoPrefix = "";

    if(giftReceivedData == 1){
      if(giftBuyer == ""){
        giftBought.innerHTML = "This gift has been bought";
      } else {
        giftBought.innerHTML = "This gift has been bought by " +
            fetchGiftReceivedSuffix(false, giftBuyer, giftReceivedBy);
      }
    } else {
      if (giftReceivedData == 0) {
        giftBought.innerHTML = "This gift has not been bought yet";
      } else {
        giftBought.innerHTML = "This gift has been bought by " +
            fetchGiftReceivedSuffix(true, giftBuyer, giftReceivedBy);
      }
    }

    if (giftDate != "") {
      giftCreationDate.innerHTML = "Created on: " + giftDate;
    } else {
      giftCreationDate.innerHTML = "Creation date not available";
    }

    giftBuy.onclick = function(){
      buyGiftToDB(giftUid, giftKey, giftMultiples, giftReceivedData, giftReceivedBy, false);
    };
    giftDontBuy.onclick = function(){
      buyGiftToDB(giftUid, giftKey, giftMultiples, giftReceivedData, giftReceivedBy, true, giftBuyer);
    };

    openModal(giftModal, giftUid);

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

function buyGiftToDB(pubUid, key, multiples, received, receivedBy, unBuyBool, buyer) {
  let updateToDB = false;
  let buyerUID;
  let buyerData;
  let multipleBool;
  giftUpdateLocal = true;
  buyerUID = buyer;
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
      else
        deployNotificationModal(true, "Gift Buy Error!", "Only the buyer, "
            + buyer + ", can \"Un-Buy\" this gift. Please contact them to undo this action if this has been done " +
            "in error.", 4);
    }
    if (updateToDB) {
      firebase.database().ref("users/" + giftUser.uid + "/giftList/" + key).update({
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
      firebase.database().ref("users/" + giftUser.uid + "/giftList/" + key).update({
        received: received,
        receivedBy: receivedBy
      });
    }
  }

  if (updateToDB) {
    listenForDBChanges("Buy", pubUid);
  }

  giftUpdateLocal = false;
}

function removeGiftElement(uid) {
  document.getElementById("gift" + uid).remove();

  dataCounter--;
  if (dataCounter == 0){
    deployListEmptyNotification("No Gifts Found! Your Friend Must Not Have Any Gifts!");
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
