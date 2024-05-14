/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let friendListElements = [];
let giftArr = [];
let oldGiftArr = [];
let userUserNames = [];
let userUIDList = [];
let initializedGifts = [];
let loadedBuyerDataViewArr = [];

let initializingElements = false;
let giftListEmptyBool = false;
let potentialRemoval = false;
let giftUpdateLocal = false;

let moderationSet = -1;

let giftCreationDate;
let giftModal;
let giftTitle;
let giftLink;
let giftWhere;
let giftDescription;
let giftBought;
let giftBuyerList;
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
let buyerDataViewModal;
let closeBuyerDataViewModal;
let buyerDataViewTitle;
let buyerDataViewText;
let buyerDataViewListContainer;
let testBuyerDataView;
let buyerDataViewBack;



function getCurrentUser(){
  getCurrentUserCommon();
  moderationSet = sessionStorage.getItem("moderationSet");
  giftUser = JSON.parse(sessionStorage.validGiftUser);
  failedNavNum = 9;

  logOutput("Friend: " + giftUser.userName + " loaded in");
  let publicFirstName = findFirstNameInFullName(giftUser.name);
  document.title = publicFirstName + "'s List";

  if (giftUser.giftList == undefined) {
    giftUser.giftList = [];
  } else {
    giftArr = giftUser.giftList;
    initializingElements = true;
    for (let i = 0; i < giftUser.giftList.length; i++) {
      createGiftElement(giftUser.giftList[i], i);
    }
    if (!createdJokeGift && giftUser.giftList.length > 0 && jokeGiftEnabled)
      rollForAJokeGift();
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
  } else {
    logOutput("Nope... Not this time!");
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
    giftLink.style.display = "none";
    giftDescription.innerHTML = "It's been my dream to get the premier in all of vegetable spiralizers, but not just any Vegetti... " +
        "The Vegetti VPRO Pro Deluxe Pack! I get 69 customizable accessories that allow me to shave the vegetables " +
        "to my liking for the perfect dish. It's one of a kind.";
    giftWhere.innerHTML = "Anywhere where Vegetti's are sold!";
    giftBought.innerHTML = "This gift hasn't been bought yet!";
    giftBuyerList.style.display = "none";
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
    updateMaintenanceLog(pageName, "The user, \"" + user.userName + "\" found an easter egg! (" + pageName +
        " Page) They also interacted with the gift, woohoo!");
    updateUserScore(user, jokeEasterEggScore);
  };

  let textNode = document.createTextNode("Vegetti");
  liItem.appendChild(textNode);
  dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
  dataCounter++;
}

window.onload = function instantiate() {
  initializeFriendListPage();

  function initializeFriendListPage() {
    try {
      pageName = "FriendList";
      notificationBtn = document.getElementById("notificationButton");
      confirmModal = document.getElementById("confirmModal");
      closeConfirmModal = document.getElementById("closeConfirmModal");
      confirmTitle = document.getElementById("confirmTitle");
      confirmContent = document.getElementById("confirmContent");
      confirmBtn = document.getElementById("confirmBtn");
      denyBtn = document.getElementById("denyBtn");
      buyerDataViewModal = document.getElementById("buyerDataViewModal");
      closeBuyerDataViewModal = document.getElementById("closeBuyerDataViewModal");
      buyerDataViewTitle = document.getElementById("buyerDataViewTitle");
      buyerDataViewText = document.getElementById("buyerDataViewText");
      buyerDataViewListContainer = document.getElementById("buyerDataViewListContainer");
      testBuyerDataView = document.getElementById("testBuyerDataView");
      buyerDataViewBack = document.getElementById("buyerDataViewBack");
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
      giftBuyerList = document.getElementById("giftBuyerList");
      giftCreationDate = document.getElementById("giftCreationDate");
      giftBuy = document.getElementById("giftBuy");
      giftDontBuy = document.getElementById("giftDontBuy");

      getCurrentUser();
      commonInitialization();

      friendListElements = [notificationBtn, dataListContainer, offlineModal, offlineSpan, confirmModal, closeConfirmModal,
        confirmTitle, confirmContent, confirmBtn, denyBtn, buyerDataViewModal, closeBuyerDataViewModal, buyerDataViewTitle,
        buyerDataViewText, buyerDataViewListContainer, testBuyerDataView, buyerDataViewBack, noteSpan, backBtn, listNote,
        inviteNote, notificationModal, notificationTitle, notificationInfo, noteSpan, giftModal, closeGiftModal, giftTitle,
        giftLink, giftWhere, giftDescription, giftBought, giftBuyerList, giftCreationDate, giftBuy, giftDontBuy, testData];

      verifyElementIntegrity(friendListElements);

      userInitial = firebase.database().ref("users/");
      userGifts = firebase.database().ref("users/" + giftUser.uid + "/giftList");
      userInvites = firebase.database().ref("users/" + user.uid + "/invites");

      if (createdJokeGift) {
        updateMaintenanceLog(pageName, "The user, \"" + user.userName + "\" found an easter egg... (" + pageName +
            " Page) It was only generated though, they didn't click on it... yet.");
      }

      databaseQuery();
      alternateButtonLabel(listNote, "Gift Lists", "Public");

      for (let i = 0; i < userArr.length; i++) {
        userUserNames.push(userArr[i].userName);
        userUIDList.push(userArr[i].uid);
      }

      initializeBackBtn();
      initializeSwapBtn();
    } catch (err) {
      sendCriticalInitializationError(err);
    }
  }

  function databaseQuery() {
    let tempGiftCheckIndex = 0;

    let fetchData = function (postRef) {
      postRef.on("child_added", function (data) {
        let i = findUIDItemInArr(data.key, userArr);
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
        let i = findUIDItemInArr(data.key, userArr);
        if (i != -1) {
          localObjectChanges = findObjectChanges(userArr[i], data.val());
          if (localObjectChanges.length != 0) {
            logOutput("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
            userArr[i] = data.val();

            if (data.key == giftUser.uid) {
              giftUser = data.val();
              giftArr = giftUser.giftList;
              if (potentialRemoval) {
                findRemovedGift(oldGiftArr, giftArr);
                potentialRemoval = false;
              }
              logOutput("Current Gift User Updated");
            } else if (data.key == user.uid) {
              user = data.val();
              checkNotifications();
              updateFriendNav(user.friends);
              logOutput("Current User Updated");
            }
            saveCriticalCookies();
          }
        }
      });

      postRef.on("child_removed", function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if (i != -1) {
          logOutput("Removing " + userArr[i].userName + " / " + data.val().userName);
          userArr.splice(i, 1);
          saveCriticalCookies();
        }
      });
    };

    let fetchGifts = function (postRef) {
      postRef.on("child_added", function (data) {
        if (findUIDItemInArr(data.val().uid, giftArr) == -1)
          giftArr.push(data.val());

        tempGiftCheckIndex = checkGiftBuyer(data.val());
        if (tempGiftCheckIndex == -2) {
          data.val().buyer = "";
          updateGiftError(data.val(), data.key, undefined);
        } else if (tempGiftCheckIndex == -1) {
          data.val().buyer = "";
          updateGiftError(data.val(), data.key, "");
        } else if (tempGiftCheckIndex > 0) {
          updateGiftError(data.val(), data.key, userArr[tempGiftCheckIndex].uid);
        }

        createGiftElement(data.val(), data.key);

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
        inviteArr[data.key] = data.val();
      });

      postRef.on("child_removed", function (data) {
        inviteArr.splice(data.key, 1);

        if (inviteArr.length == 0) {
          logOutput("Invite List Removed");
          inviteNote.style.background = "#008222";
        }
      });
    };

    fetchData(userInitial);
    fetchGifts(userGifts);
    fetchInvites(userInvites);

    listeningFirebaseRefs.push(userInitial);
    listeningFirebaseRefs.push(userGifts);
    listeningFirebaseRefs.push(userInvites);
  }
};

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

function checkGiftBuyer(giftData) {
  // -2 -> Multiple Buyer Error, received number needs to be fixed
  // -1 -> Gift Buyer Error, Needs To Be Cleared
  // 0  -> No Gift Buyer Error, No Issues
  // >0 -> Gift Buyer Error, Needs To Become A UID
  let updateGiftToDB = 0;
  let tempIndexOfUserName = 0;
  let buyer = giftData.buyer;
  let received = giftData.received;
  let receivedBy = giftData.receivedBy;

  if (receivedBy == undefined)
    receivedBy = [];

  if (received < 0 || receivedBy.length > 0) {
    if (receivedBy.length != Math.abs(received)) {
      updateGiftToDB = -2;
      logOutput("Multiple buyer error found!");
    }
  } else if (buyer == "" || buyer == undefined || userUIDList.includes(buyer)) {
    updateGiftToDB = 0;
  } else if (userUserNames.includes(buyer)) {
    tempIndexOfUserName = userUserNames.indexOf(buyer);
    updateGiftToDB = findUserNameItemInArr(userUserNames[tempIndexOfUserName], userArr);
  } else {
    updateGiftToDB = -1;
    logOutput("Buyer error found!");
  }

  return updateGiftToDB;
}

function updateGiftError(giftData, giftKey, buyerData) {
  if (buyerData == undefined) {
    logOutput("A multi-gift needs to be updated! Key: " + giftKey);

    let tempReceivedBy = giftData.receivedBy;
    let tempReceivedByLen = 0;

    if (tempReceivedBy == undefined)
      tempReceivedBy = [];

    tempReceivedByLen = Math.abs(tempReceivedBy.length) * -1;

    firebase.database().ref("users/" + giftUser.uid + "/giftList/" + giftKey).update({
      received: tempReceivedByLen
    });
  } else {
    logOutput("A gift needs to be updated! Key: " + giftKey);

    firebase.database().ref("users/" + giftUser.uid + "/giftList/" + giftKey).update({
      buyer: buyerData
    });
  }
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
  let giftBuyerUID = giftData.buyer;
  let giftUid = giftData.uid;
  let giftDate = giftData.creationDate;
  let giftMultiples = giftData.multiples;
  let giftInfoPrefix = "";

  liItem.className = "gift";
  if(giftReceivedData == 1) {
    liItem.className += " checked";
  } else if (giftMultiples != undefined) {
    if (giftMultiples && giftReceivedData < 0) {
      liItem.className += " multiCheck";
    }
  }

  liItem.onclick = function () {
    if (giftMultiples) {
      giftTitle.innerHTML = giftTitleData + " <i>(Multiple Purchase Gift)</i>";
    } else {
      giftTitle.innerHTML = giftTitleData;
    }

    if (giftLinkData != ""){
      buttonVisible = true;
      giftLink.innerHTML = "Click me to go to this gift's webpage!";
      giftLink.style.display = "inline-block";
      giftLink.className = "basicBtn";
      giftLink.onclick = function() {
        giftLinkRedirect(giftLinkData);
      };
    } else {
      giftLink.innerHTML = "<i>There was no link provided</i>";
      giftLink.style.display = "none";
      giftLink.onclick = function() {};
    }

    if (buttonVisible) {
      giftInfoPrefix = "<br>";
      buttonBreakAdded = true;
    }
    if (giftWhereData != "") {
      giftWhere.innerHTML = giftInfoPrefix + "<b>This can be found at:</b> " + giftWhereData;
    } else {
      giftWhere.innerHTML = "";
    }
    giftInfoPrefix = "";

    if (buttonVisible && !buttonBreakAdded) {
      giftInfoPrefix = "<br>";
      buttonBreakAdded = true;
    }
    if (giftDescriptionData != "") {
      giftDescription.innerHTML = giftInfoPrefix + "<b>Description:</b> " + giftDescriptionData;
    } else {
      giftDescription.innerHTML = "";
    }
    giftInfoPrefix = "";

    giftBuyerList.onclick = function() {};
    giftBuyerList.style.display = "none";
    giftBought.style.display = "block";
    if (giftReceivedData == 1) {
      if (giftBuyer == "") {
        giftBought.innerHTML = "<i>This gift has been bought</i>";
      } else {
        giftBought.innerHTML = "<i>This gift has been bought by " +
            fetchGiftReceivedSuffix(false, giftBuyer, giftReceivedBy) + "</i>";
      }
    } else {
      if (giftReceivedData == 0) {
        giftBought.innerHTML = "<b>This gift has not been bought yet</b>";
      } else {
        if (giftReceivedData < -1) {
          giftBuyerList.style.display = "inline-block";
          giftBought.style.display = "none";
          giftBuyerList.onclick = function() {
            generateBuyerDataViewModal(giftData);
          };
          giftBuyerList.innerHTML = "View Gift Buyers";
        } else {
          giftBought.innerHTML = "<i>This gift has been bought by " +
              fetchGiftReceivedSuffix(true, giftBuyer, giftReceivedBy) + "</i>";
        }
      }
    }

    if (giftDate != "") {
      giftCreationDate.innerHTML = "<b>Created on:</b> " + giftDate;
    } else {
      giftCreationDate.innerHTML = "<i>Creation date not available</i>";
    }

    giftBuy.onclick = function(){
      buyGiftToDB(giftUid, giftKey, giftMultiples, giftReceivedData, giftReceivedBy, false);
    };
    giftDontBuy.onclick = function(){
      buyGiftToDB(giftUid, giftKey, giftMultiples, giftReceivedData, giftReceivedBy, true, giftBuyer, giftBuyerUID);
    };

    openModal(giftModal, giftUid);

    closeGiftModal.onclick = function() {
      closeModal(giftModal);
    };
  };
}

function generateBuyerDataViewModal(giftData) {
  let giftUID = giftData.uid;
  let buyersToLoad = giftData.receivedBy;

  buyerDataViewTitle.innerHTML = giftData.title + "'s Buyers";
  buyerDataViewText.innerHTML = "<b>Total Buyers:</b> " + buyersToLoad.length;

  closeModal(giftModal);

  buyerDataViewBack.onclick = function() {
    closeModal(buyerDataViewModal);
    openModal(giftModal, giftUID);
  }

  closeBuyerDataViewModal.onclick = function() {
    closeModal(buyerDataViewModal);
  }

  openModal(buyerDataViewModal, giftData.title + "'s Buyers");

  if (loadedBuyerDataViewArr.length != 0) {
    for (let a = 0; a < loadedBuyerDataViewArr.length; a++) {
      document.getElementById(loadedBuyerDataViewArr[a]).remove();
    }
    loadedBuyerDataViewArr = [];
  }

  try {
    testBuyerDataView.remove();
  } catch (err) {}

  for (let i = 0; i < buyersToLoad.length; i++) {
    let liItem = document.createElement("LI");
    let textNode;
    let loadedBuyerDataViewElemID;
    let loadedBuyerDataName = "";
    let loadedBuyerDataIndex = -1;

    loadedBuyerDataIndex = findUIDItemInArr(buyersToLoad[i], userArr);
    if (loadedBuyerDataIndex == -1)
      loadedBuyerDataIndex = findUserNameItemInArr(buyersToLoad[i], userArr);

    if (loadedBuyerDataIndex == -1)
      loadedBuyerDataName = "Buyer's Name Not Found!";
    else
      loadedBuyerDataName = userArr[loadedBuyerDataIndex].name;

    liItem.className = "gift";

    loadedBuyerDataViewElemID = buyersToLoad[i];
    liItem.id = loadedBuyerDataViewElemID;
    textNode = document.createTextNode(loadedBuyerDataName);

    liItem.appendChild(textNode);
    buyerDataViewListContainer.insertBefore(liItem, buyerDataViewListContainer.childNodes[0]);
    loadedBuyerDataViewArr.push(loadedBuyerDataViewElemID);
  }
}

function fetchNameByUserName(userNameInput) {
  for (let i = 0; i < userArr.length; i++) {
    if (userNameInput == userArr[i].userName) {
      return userArr[i].name;
    }
  }

  return null;
}

function buyGiftToDB(pubUid, key, multiples, received, receivedBy, unBuyBool, buyer, buyerUID) {
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
