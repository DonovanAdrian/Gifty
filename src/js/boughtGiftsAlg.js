/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let boughtGiftElements = [];
let userUserNames = [];
let userBoughtGiftsArr = [];
let userBoughtGiftsUIDs = [];
let userBoughtGiftsUsersArr = [];
let initializedGiftsArr = [];
let itemColor = [" highSev", " lowSev"];

let moderationSet = -1;
let colorIndex = -1;

let lastUser;
let giftTitleFld;
let giftLinkFld;
let giftWhereFld;
let giftDescriptionFld;
let giftCreationDateFld;
let viewListBtn;
let giftModal;
let closeGiftModal;
let homeNote;
let confirmModal;
let closeConfirmModal;
let confirmTitle;
let confirmContent;
let confirmBtn;
let denyBtn;



function getCurrentUser() {
  failedNavNum = 7;
  getCurrentUserCommon();

  try {
    userBoughtGiftsArr = JSON.parse(sessionStorage.boughtGifts);
    userBoughtGiftsUIDs = JSON.parse(sessionStorage.boughtGiftsUIDs);
    userBoughtGiftsUsersArr = JSON.parse(sessionStorage.boughtGiftsUsers);
    if (userBoughtGiftsArr.length == 0 && userBoughtGiftsUIDs.length == 0 && userBoughtGiftsUsersArr.length == 0) {
      deployListEmptyNotification("No Gifts Found! Buy Some Gifts From Some Friends First!");
    } else if (userBoughtGiftsArr.length == 0 || userBoughtGiftsUIDs.length == 0 || userBoughtGiftsUsersArr.length == 0) {
      deployNotificationModal(false, "Bought Gifts Loading Error!", "There was an " +
          "error loading this page! Please come back to this page once you have bought some gifts. Redirecting back " +
          "home...", 5, 2);
    }
  } catch (err) {
    deployNotificationModal(false, "Bought Gifts Loading Error!", "There was an " +
        "error loading this page! Please come back to this page once you have bought some gifts. Redirecting back " +
        "home...", 5, 2);
  }
}

window.onload = function instantiate() {
  initializeBoughtGiftsPage();

  function initializeBoughtGiftsPage() {
    try {
      pageName = "BoughtGifts";
      inviteNote = document.getElementById("inviteNote");
      notificationBtn = document.getElementById("notificationBtn");
      backBtn = document.getElementById("backBtn");
      homeNote = document.getElementById("homeNote");
      giftTitleFld = document.getElementById("giftTitleFld");
      giftLinkFld = document.getElementById("giftLinkFld");
      giftWhereFld = document.getElementById("giftWhereFld");
      giftDescriptionFld = document.getElementById("giftDescriptionFld");
      giftCreationDateFld = document.getElementById("giftCreationDateFld");
      viewListBtn = document.getElementById("viewListBtn");
      giftModal = document.getElementById("giftModal");
      closeGiftModal = document.getElementById("closeGiftModal");
      confirmModal = document.getElementById("confirmModal");
      closeConfirmModal = document.getElementById("closeConfirmModal");
      confirmTitle = document.getElementById("confirmTitle");
      confirmContent = document.getElementById("confirmContent");
      confirmBtn = document.getElementById("confirmBtn");
      denyBtn = document.getElementById("denyBtn");

      getCurrentUser();
      commonInitialization();

      boughtGiftElements = [notificationBtn, dataListContainer, offlineModal, offlineSpan, backBtn, inviteNote, homeNote,
        notificationModal, notificationTitle, notificationInfo, noteSpan, giftTitleFld, giftLinkFld, giftWhereFld,
        giftDescriptionFld, giftCreationDateFld, viewListBtn, giftModal, closeGiftModal, testData, confirmModal,
        closeConfirmModal, confirmTitle, confirmContent, confirmBtn, denyBtn];

      verifyElementIntegrity(boughtGiftElements);

      userInitial = firebase.database().ref("users/");
      userInvites = firebase.database().ref("users/" + user.uid + "/invites");

      for(let i = 0; i < userArr.length; i++){
        userUserNames.push(userArr[i].userName);
      }

      initializeBackBtn();
      initializeGifts();
      databaseQuery();
      alternateButtonLabel(homeNote, "Home", "Bought");
    } catch (err) {
      sendCriticalInitializationError(err);
    }
  }

  function databaseQuery() {
    let fetchData = function (postRef) {
      postRef.on("child_added", function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        let previousUserData;
        if(i != -1){
          localObjectChanges = findObjectChanges(userArr[i], data.val());
          if (localObjectChanges.length != 0) {
            previousUserData = userArr[i];
            userArr[i] = data.val();

            if(data.key == user.uid){
              user = data.val();
              checkNotifications();
              updateFriendNav(user.friends);
            } else {
              checkGiftLists(data.val(), previousUserData);
            }
            saveCriticalCookies();
          }
        } else {
          userArr.push(data.val());
          saveCriticalCookies();
        }
      });

      postRef.on("child_changed", function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        let previousUserData;
        if(i != -1){
          localObjectChanges = findObjectChanges(userArr[i], data.val());

          if (localObjectChanges.length != 0) {
            logOutput("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
            previousUserData = userArr[i];
            userArr[i] = data.val();

            if(data.key == user.uid){
              user = data.val();
              checkNotifications();
              updateFriendNav(user.friends);
              logOutput("Current User Updated");
            } else {
              checkGiftLists(data.val(), previousUserData);
            }
            saveCriticalCookies();
          }
        }
      });

      postRef.on("child_removed", function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if(i != -1){
          logOutput("Removing " + userArr[i].userName + " / " + data.val().userName);
          userArr.splice(i, 1);
          saveCriticalCookies();
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
    fetchInvites(userInvites);

    listeningFirebaseRefs.push(userInitial);
    listeningFirebaseRefs.push(userInvites);
  }
};

function checkGiftLists(updatedUserData, oldUserData){
  let oldGiftList = oldUserData.giftList;
  let oldPrivateGiftList = oldUserData.privateList;
  let newGiftList = updatedUserData.giftList;
  let newPrivateGiftList = updatedUserData.privateList;
  let removedGiftIndex = -1;

  if (oldGiftList == undefined)
    oldGiftList = [];
  if (oldPrivateGiftList == undefined)
    oldPrivateGiftList = [];
  if (newGiftList == undefined)
    newGiftList = [];
  if (newPrivateGiftList == undefined)
    newPrivateGiftList = [];

  for (let i = 0; i < newGiftList.length; i++) {
    let a = findUIDItemInArr(newGiftList[i].uid, userBoughtGiftsArr);
    if (a == -1) {
      if (newGiftList[i].buyer != "") {
        if (newGiftList[i].buyer == user.userName) {
          userBoughtGiftsArr.push(newGiftList[i]);
          userBoughtGiftsUIDs.push(updatedUserData.uid);
          userBoughtGiftsUsersArr.push(updatedUserData.name);
          createGiftElement(newGiftList[i], updatedUserData.uid, updatedUserData.name);
        }
      } else if (newGiftList[i].receivedBy != undefined)
        if (newGiftList[i].receivedBy.includes(user.uid)) {
          userBoughtGiftsArr.push(newGiftList[i]);
          userBoughtGiftsUIDs.push(updatedUserData.uid);
          userBoughtGiftsUsersArr.push(updatedUserData.name + " (Multiple Purchase Gift)");
          createGiftElement(newGiftList[i], updatedUserData.uid, updatedUserData.name + " (Multiple Purchase Gift)");
        }
    } else {
      if (newGiftList[i].buyer == "" && newGiftList[i].receivedBy == undefined) {
        userBoughtGiftsArr.splice(a, 1);
        userBoughtGiftsUIDs.splice(a, 1);
        userBoughtGiftsUsersArr.splice(a, 1);
        removeGiftElement(newGiftList[i].uid);
      } else if (newGiftList[i].receivedBy != undefined)
        if (!newGiftList[i].receivedBy.includes(user.uid)) {
          userBoughtGiftsArr.splice(a, 1);
          userBoughtGiftsUIDs.splice(a, 1);
          userBoughtGiftsUsersArr.splice(a, 1);
          removeGiftElement(newGiftList[i].uid);
        }
    }
  }

  removedGiftIndex = findRemovedData(oldGiftList, newGiftList);
  if (removedGiftIndex != -1) {
    let b = findUIDItemInArr(oldGiftList[removedGiftIndex].uid, userBoughtGiftsArr);
    if (b != -1) {
      userBoughtGiftsArr.splice(b, 1);
      userBoughtGiftsUIDs.splice(b, 1);
      userBoughtGiftsUsersArr.splice(b, 1);
      removeGiftElement(oldGiftList[removedGiftIndex].uid);
    }
  }

  for (let i = 0; i < newPrivateGiftList.length; i++) {
    let a = findUIDItemInArr(newPrivateGiftList[i].uid, userBoughtGiftsArr);
    if (a == -1) {
      if (newPrivateGiftList[i].buyer != "") {
        if (newPrivateGiftList[i].buyer == user.userName) {
          userBoughtGiftsArr.push(newPrivateGiftList[i]);
          userBoughtGiftsUIDs.push(updatedUserData.uid);
          userBoughtGiftsUsersArr.push(updatedUserData.name + " (Private List)");
          createGiftElement(newPrivateGiftList[i], updatedUserData.uid, updatedUserData.name + " (Private List)");
        }
      } else if (newPrivateGiftList[i].receivedBy != undefined)
        if (newPrivateGiftList[i].receivedBy.includes(user.uid)) {
          userBoughtGiftsArr.push(newPrivateGiftList[i]);
          userBoughtGiftsUIDs.push(updatedUserData.uid);
          userBoughtGiftsUsersArr.push(updatedUserData.name + " (Private List, Multiple Purchase Gift)");
          createGiftElement(newPrivateGiftList[i], updatedUserData.uid, updatedUserData.name + " (Private List, Multiple Purchase Gift)");
        }
    } else {
      if (newPrivateGiftList[i].buyer == "" && newPrivateGiftList[i].receivedBy == undefined) {
        userBoughtGiftsArr.splice(a, 1);
        userBoughtGiftsUIDs.splice(a, 1);
        userBoughtGiftsUsersArr.splice(a, 1);
        removeGiftElement(newPrivateGiftList[i].uid);
      } else if (newPrivateGiftList[i].receivedBy != undefined)
        if (!newPrivateGiftList[i].receivedBy.includes(user.uid)) {
          userBoughtGiftsArr.splice(a, 1);
          userBoughtGiftsUIDs.splice(a, 1);
          userBoughtGiftsUsersArr.splice(a, 1);
          removeGiftElement(newPrivateGiftList[i].uid);
        }
    }
  }

  removedGiftIndex = findRemovedData(oldPrivateGiftList, newPrivateGiftList);
  if (removedGiftIndex != -1) {
    let b = findUIDItemInArr(oldPrivateGiftList[removedGiftIndex].uid, userBoughtGiftsArr);
    if (b != -1) {
      userBoughtGiftsArr.splice(b, 1);
      userBoughtGiftsUIDs.splice(b, 1);
      userBoughtGiftsUsersArr.splice(b, 1);
      removeGiftElement(oldPrivateGiftList[removedGiftIndex].uid);
    }
  }

  for (let i = 0; i < userBoughtGiftsArr.length; i++) {
    let a = findUIDItemInArr(userBoughtGiftsArr[i].uid, newGiftList);
    if (a != -1) {
      checkGiftData(userBoughtGiftsArr[i], newGiftList[a], userBoughtGiftsUIDs[i], userBoughtGiftsUsersArr[i]);
    }
  }

  for (let i = 0; i < userBoughtGiftsArr.length; i++) {
    let a = findUIDItemInArr(userBoughtGiftsArr[i].uid, newPrivateGiftList);
    if (a != -1) {
      checkGiftData(userBoughtGiftsArr[i], newPrivateGiftList[a], userBoughtGiftsUIDs[i], userBoughtGiftsUsersArr[i]);
    }
  }
}

function removeGiftElement(uid) {
  document.getElementById("gift" + uid).remove();

  dataCounter--;
  if (dataCounter == 0){
    deployListEmptyNotification("No Gifts Found! Buy Some Gifts From Some Friends First!");
  }
}

function checkGiftData(currentGiftData, newGiftData, giftOwnerUID, giftOwner){
  let updateGiftBool = false;
  let giftOwnerTrim = "";
  let previousGiftOwnerTrim = "";

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
    if (newGiftData.uid == currentModalOpen){
      for (let i = 0; i < giftOwner.length; i++) {
        if (giftOwner[i] != "(") {
          previousGiftOwnerTrim = giftOwnerTrim;
          giftOwnerTrim = giftOwnerTrim + giftOwner[i];
        } else {
          giftOwnerTrim = previousGiftOwnerTrim;
          break;
        }
      }
      if (giftOwner.includes("Private")) {
        deployNotificationModal(false, "Gift Updated!", giftOwnerTrim + "'s " +
            "private gift was updated! Please reopen the gift to view the changes.", 5);
      } else {
        deployNotificationModal(false, "Gift Updated!", "The gift you were viewing " +
            "was updated by " + giftOwnerTrim + "! Please reopen the gift to view the changes.", 5);
      }
    }
    let i = findUIDItemInArr(currentGiftData.uid, userBoughtGiftsArr);
    if (i != -1) {
      userBoughtGiftsArr[i] = newGiftData;
    }
    changeGiftElement(newGiftData, giftOwnerUID, giftOwner);
  }
}

function createGiftElement(giftData, giftOwnerUID, giftOwner){
  let giftOwnerTrim = "";
  let previousGiftOwnerTrim = "";
  try{
    document.getElementById("testData").remove();
  } catch (err) {}

  let liItem = document.createElement("LI");
  liItem.id = "gift" + giftData.uid;
  initGiftElement(liItem, giftData, giftOwnerUID, giftOwner, true);
  for (let i = 0; i < giftOwner.length; i++) {
    if (giftOwner[i] != "(") {
      previousGiftOwnerTrim = giftOwnerTrim;
      giftOwnerTrim = giftOwnerTrim + giftOwner[i];
    } else {
      giftOwnerTrim = previousGiftOwnerTrim;
      break;
    }
  }
  if (lastUser != giftOwnerTrim) {
    if (colorIndex < itemColor.length - 1) {
      colorIndex++;
    } else {
      colorIndex = 0;
    }
  }
  liItem.className += itemColor[colorIndex];
  let textNode = document.createTextNode(giftData.title + " - for " + giftOwner);
  liItem.appendChild(textNode);

  dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
  initializedGiftsArr.push(giftData.uid);
  clearInterval(commonLoadingTimer);
  clearInterval(offlineTimer);
  lastUser = giftOwnerTrim;
  dataCounter++;
}

function changeGiftElement(giftData, giftOwnerUID, giftOwner){
  logOutput("Updating " + giftData.uid);
  let editGift = document.getElementById("gift" + giftData.uid);
  editGift.innerHTML = giftData.title + " - for " + giftOwner;
  initGiftElement(editGift, giftData, giftOwnerUID, giftOwner, false);
}

function initGiftElement(liItem, giftData, giftOwnerUID, giftOwner, createGiftBool) {
  let giftOwnerIndex = findUIDItemInArr(giftOwnerUID, userArr);
  let giftOwnerData = userArr[giftOwnerIndex];
  giftData = initGiftDataIfEmpty(giftData);
  let buttonVisible = false;
  let buttonBreakAdded = false;
  let giftInfoPrefix = "";

  if (createGiftBool)
    liItem.className = "gift";
  liItem.onclick = function (){
    giftTitleFld.innerHTML = giftData.title + " - <i>for " + giftOwner + "</i>";

    if (giftData.link != ""){
      buttonVisible = true;
      giftLinkFld.innerHTML = "Click me to go to this gift's webpage!";
      giftLinkFld.style.display = "inline-block";
      giftLinkFld.className = "basicBtn";
      giftLinkFld.onclick = function() {
        giftLinkRedirect(giftData.link);
      };
    } else {
      giftLinkFld.innerHTML = "<i>There was no link provided</i>";
      giftLinkFld.style.display = "none";
      giftLinkFld.onclick = function() {};
    }

    if (buttonVisible) {
      giftInfoPrefix = "<br>";
      buttonBreakAdded = true;
    }
    if (giftData.where != "") {
      giftWhereFld.innerHTML = giftInfoPrefix + "<b>This can be found at:</b> " + giftData.where;
    } else {
      giftWhereFld.innerHTML = "";
    }
    giftInfoPrefix = "";

    if (buttonVisible && !buttonBreakAdded) {
      giftInfoPrefix = "<br>";
      buttonBreakAdded = true;
    }
    if (giftData.description != "") {
      giftDescriptionFld.innerHTML = giftInfoPrefix + "<b>Description:</b> " + giftData.description;
    } else {
      giftDescriptionFld.innerHTML = "";
    }
    giftInfoPrefix = "";

    if (giftData.creationDate != "") {
      giftCreationDateFld.innerHTML = "<b>Created on:</b> " + giftData.creationDate;
    } else {
      giftCreationDateFld.innerHTML = "<i>Creation date not available</i>";
    }

    if (giftOwnerIndex != -1) {
      if (giftOwner.includes("Private")) {
        viewListBtn.innerHTML = "View " + giftOwnerData.name + "'s Private List";
        viewListBtn.onclick = function(){
          sessionStorage.setItem("validGiftUser", JSON.stringify(giftOwnerData));
          navigation(10);//PrivateFriendList
        };
      } else {
        viewListBtn.innerHTML = "View " + giftOwnerData.name + "'s Public List";
        viewListBtn.onclick = function(){
          sessionStorage.setItem("validGiftUser", JSON.stringify(giftOwnerData));
          navigation(9);//FriendList
        };
      }
    } else {
      viewListBtn.innerHTML = "";
      viewListBtn.onclick = function(){};
    }

    openModal(giftModal, giftData.uid);

    closeGiftModal.onclick = function() {
      closeModal(giftModal);
    };
  };
}

function initializeGifts(){
  if(userBoughtGiftsArr.length == userBoughtGiftsUsersArr.length) {
    for (let i = 0; i < userBoughtGiftsArr.length; i++) {
      createGiftElement(userBoughtGiftsArr[i], userBoughtGiftsUIDs[i], userBoughtGiftsUsersArr[i]);
    }
  } else {
    deployNotificationModal(false, "Critical Error!", "There has been a critical error, redirecting " +
        "back home...", 4, 2);
  }
}

function initializeBackBtn(){
  backBtn.innerHTML = "Back To Home";
  backBtn.onclick = function() {
    navigation(2);//Home
  };
}
