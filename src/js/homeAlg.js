/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let reviewDate = new Date(currentYear, 0, 1, 0, 0, 0, 0);//Jan 1st

let homeElements = [];
let listeningFirebaseRefs = [];
let userArr = [];
let giftArr = [];
let oldGiftArr = [];
let inviteArr = [];
let userBoughtGifts = [];
let initializedGifts = [];
let userBoughtGiftsUIDs = [];
let userBoughtGiftsUsers = [];
let vettedUserGifts = [];
let loadedVettedUserGifts = [];
let reviewedGiftsToKeep = [];
let reviewedGiftsToRemove = [];

let invitesValidBool = false;
let friendsValidBool = false;
let updateUserBool = false;
let giftListEmptyBool = false;
let giftDeleteLocal = false;
let potentialRemoval = false;
let setYearlyReviewBool = false;

let giftLimit = 50;
let dataCounter = 0;
let commonLoadingTimerInt = 0;

let dataListContainer;
let giftStorage;
let privateList;
let reviewGifts;
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
let reviewModal;
let closeReviewModal;
let reviewTitle;
let reviewDetails;
let reviewListContainer;
let testReview;
let reviewConfirm;
let reviewCancel;
let confirmModal;
let closeConfirmModal;
let confirmTitle;
let confirmContent;
let confirmBtn;
let denyBtn;
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
  checkYearlyReview();

  if (user.giftList == undefined) {
    deployListEmptyNotification("No Gifts Found! Add Some Gifts With The Button Below!");
    giftListEmptyBool = true;
  } else if (user.giftList.length == 0) {
    deployListEmptyNotification("No Gifts Found! Add Some Gifts With The Button Below!");
    giftListEmptyBool = true;
  }
}

function checkYearlyReview() {
  let tempVettedUserGifts = reviewUserGifts();
  if (tempVettedUserGifts.length > 0) {
    if (user.yearlyReview != undefined) {
      if (user.yearlyReview < currentYear && currentDate > reviewDate) {
        reviewGifts.style.display = "block";
        reviewGifts.innerHTML = "Review Gifts";
        reviewGifts.onclick = function () {
          initializeYearlyReview();
        };
        if (user.yearlyReview != 0) {
          initializeYearlyReview();
        }
      }
    } else {
      reviewGifts.style.display = "block";
      reviewGifts.innerHTML = "Review Gifts";
      reviewGifts.onclick = function () {
        initializeYearlyReview();
      };
      initializeYearlyReview();
    }
  }
}

function reviewUserGifts() {
  let tempGiftReviewArr = [];
  let tempUserGifts = [];

  if (user.giftList != undefined)
    tempUserGifts = user.giftList;

  for (let i = 0; i < tempUserGifts.length; i++) {
    if (tempUserGifts[i].creationDate < (currentYear - 1) || tempUserGifts[i].received != 0) {
      tempGiftReviewArr.push(tempUserGifts[i]);
    }
  }

  return tempGiftReviewArr;
}

function initializeYearlyReview() {
  let yearlyReviewFirstName = findFirstNameInFullName(user.name);
  vettedUserGifts = reviewUserGifts();

  setYearlyReviewBool = true;
  reviewTitle.innerHTML = "Yearly Gift Review";
  reviewDetails.innerHTML = "Welcome Back " + yearlyReviewFirstName + "! Please take a moment to review the gifts " +
      "below that you would like to keep on your list.<br/><br/>Simply click or tap on the gifts below that you would " +
      "like to keep or remove. RED gifts will be removed and GREEN gifts will be kept.<br/><br/>If you would " +
      "like to review this later, click \"Maybe Later\" on the bottom right.";

  if (vettedUserGifts != null) {
    try {
      testReview.remove();
    } catch (err) {}

    if (vettedUserGifts.length != 0) {
      for (let a = 0; a < loadedVettedUserGifts.length; a++) {
        document.getElementById("review" + loadedVettedUserGifts[a].uid).remove();
      }
      loadedVettedUserGifts = [];

      loadGifts();
    } else
      loadGifts();
  } else {
    if (loadedVettedUserGifts.length != 0) {
      for (let a = 0; a < loadedVettedUserGifts.length; a++) {
        document.getElementById("review" + loadedVettedUserGifts[a].uid).remove();
      }
      loadedVettedUserGifts = [];
    }

    try {
      testReview.remove();
    } catch (err) {}
    let liItem = document.createElement("LI");
    liItem.id = "testReview";
    liItem.className = "gift";
    let textNode = document.createTextNode("No Review Gifts Found!");
    liItem.appendChild(textNode);
    reviewListContainer.insertBefore(liItem, reviewListContainer.childNodes[0]);

    loadedVettedUserGifts.push("testReview");
  }

  reviewConfirm.onclick = function() {
    closeModal(reviewModal);
    homeConfirmModal("Finalize Yearly Review Changes", "You are keeping " +
        reviewedGiftsToKeep.length + " gift(s) and removing " + reviewedGiftsToRemove.length + " gift(s). Do you wish " +
        "to continue? To return to the review, select \"No\".");
  };

  reviewCancel.onclick = function() {
    reviewedGiftsToRemove = [];
    reviewedGiftsToKeep = [];
    closeModal(reviewModal);
  }

  openModal(reviewModal, "reviewModal", true);

  closeReviewModal.onclick = function() {
    reviewedGiftsToRemove = [];
    reviewedGiftsToKeep = [];
    closeModal(reviewModal);
  };

  window.onclick = function(event) {
    if (event.target == reviewModal) {
      reviewedGiftsToRemove = [];
      reviewedGiftsToKeep = [];
      closeModal(reviewModal);
    }
  };

  function loadGifts() {
    let keepGiftIndex = 0;
    let removeGiftIndex = 0;

    for (let i = 0; i < vettedUserGifts.length; i++) {
      let liItem = document.createElement("LI");
      liItem.id = "review" + vettedUserGifts[i].uid;
      liItem.className = "gift lowSev";
      let textNode = document.createTextNode(vettedUserGifts[i].title);
      liItem.appendChild(textNode);
      reviewListContainer.insertBefore(liItem, reviewListContainer.childNodes[0]);
      liItem.onclick = function () {
        if (liItem.className.includes("lowSev")) {
          liItem.className = "gift highSev";
          keepGiftIndex = reviewedGiftsToKeep.indexOf(vettedUserGifts[i].uid);
          if (!reviewedGiftsToRemove.includes(vettedUserGifts[i].uid)) {
            reviewedGiftsToRemove.push(vettedUserGifts[i].uid);
          }
          if (keepGiftIndex != -1) {
            reviewedGiftsToKeep.splice(keepGiftIndex, 1);
          }
        } else {
          liItem.className = "gift lowSev";
          removeGiftIndex = reviewedGiftsToRemove.indexOf(vettedUserGifts[i].uid);
          if (!reviewedGiftsToKeep.includes(vettedUserGifts[i].uid)) {
            reviewedGiftsToKeep.push(vettedUserGifts[i].uid);
          }
          if (removeGiftIndex != -1) {
            reviewedGiftsToRemove.splice(removeGiftIndex, 1);
          }
        }
      };

      reviewedGiftsToKeep.push(vettedUserGifts[i].uid);
      loadedVettedUserGifts.push(vettedUserGifts[i]);
    }
  }
}

function processReviewedGifts() {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth()+1;
  let yy = today.getFullYear();
  let creationDate = mm + "/" + dd + "/" + yy;
  let emptyReceivedBy = [];
  let tempGiftArr = user.giftList;
  let tempGiftIndex = -1;
  let tempError = false;
  let bulkDeleteError = false;

  for (let i = 0; i < reviewedGiftsToKeep.length; i++) {
    tempGiftIndex = findUIDItemInArr(reviewedGiftsToKeep[i], tempGiftArr, true);
    if (tempGiftIndex != -1) {
      firebase.database().ref("users/" + user.uid + "/giftList/" + tempGiftIndex).update({
        received: 0,
        creationDate: creationDate,
        receivedBy: emptyReceivedBy,
        buyer: ""
      });
    }
  }

  for (let i = 0; i < reviewedGiftsToRemove.length; i++) {
    tempGiftIndex = findUIDItemInArr(reviewedGiftsToRemove[i], tempGiftArr, true);
    if (tempGiftIndex != -1) {
      tempError = deleteGiftElement(tempGiftArr[tempGiftIndex].title, tempGiftArr[tempGiftIndex].uid, tempGiftArr[tempGiftIndex].buyer, true);

      if (!bulkDeleteError) {
        bulkDeleteError = tempError;
      }
    }
  }

  firebase.database().ref("users/" + user.uid).update({
    yearlyReview: currentYear
  });

  reviewGifts.style.display = "none";

  reviewedGiftsToRemove = [];
  reviewedGiftsToKeep = [];

  if (bulkDeleteError) {
    deployNotificationModal(false, "Yearly Review Delete Error!", "One or more of " +
        "the gifts that you wanted to remove failed to be deleted! Please try removing them again manually.", 5);
  } else {
    deployNotificationModal(false, "Yearly Review Complete!", "Thank you for " +
        "completing the Yearly Gift Review! Your changes have been successfully applied.");
  }
}

function homeConfirmModal(modalTitle, modalContent, title, uid, buyer) {
  let keepRemoveGiftBool = false;

  confirmTitle.innerHTML = modalTitle;
  confirmContent.innerHTML = modalContent;

  if (title == undefined && uid == undefined && buyer == undefined)
    keepRemoveGiftBool = true;

  confirmBtn.onclick = function() {
    if (!keepRemoveGiftBool)
      deleteGiftElement(title, uid, buyer);
    else
      processReviewedGifts();
    closeModal(confirmModal);
  };

  denyBtn.onclick = function() {
    closeModal(confirmModal);
    if (!keepRemoveGiftBool)
      openModal(giftModal, "giftModal");
    else
      openModal(reviewModal, "reviewModal");
  }

  openModal(confirmModal, "confirmModal", true);

  closeConfirmModal.onclick = function() {
    closeModal(confirmModal);
    if (!keepRemoveGiftBool)
      openModal(giftModal, "giftModal");
  };

  window.onclick = function(event) {
    if (event.target == confirmModal) {
      closeModal(confirmModal);
    }
  };
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
  userBoughtGiftsUIDs = [];
  userBoughtGiftsUsers = [];
  for(let i = 0; i < userArr.length; i++) {
    userGiftArr = userArr[i].giftList;
    userPrivateGiftArr = userArr[i].privateList;

    if(userGiftArr == undefined){}
    else if (userGiftArr.length != undefined) {
      for (let a = 0; a < userGiftArr.length; a++) {
        if (userGiftArr[a].buyer == user.userName) {
          userBoughtGifts.push(userGiftArr[a]);
          userBoughtGiftsUIDs.push(userArr[i].uid);
          userBoughtGiftsUsers.push(userArr[i].name);
        }
        if (userGiftArr[a].receivedBy != undefined)
          if (userGiftArr[a].receivedBy.includes(user.uid)) {
            userBoughtGifts.push(userGiftArr[a]);
            userBoughtGiftsUIDs.push(userArr[i].uid);
            userBoughtGiftsUsers.push(userArr[i].name + " (Multiple Purchase Gift)");
          }
      }
    }

    if(userPrivateGiftArr == undefined){}
    else if (userPrivateGiftArr.length != undefined) {
      for (let b = 0; b < userPrivateGiftArr.length; b++) {
        if (userPrivateGiftArr[b].buyer == user.userName) {
          userBoughtGifts.push(userPrivateGiftArr[b]);
          userBoughtGiftsUIDs.push(userArr[i].uid);
          userBoughtGiftsUsers.push(userArr[i].name + " (Private List)");
        }
        if (userPrivateGiftArr[b].receivedBy != undefined)
          if (userPrivateGiftArr[b].receivedBy.includes(user.uid)) {
            userBoughtGifts.push(userPrivateGiftArr[b]);
            userBoughtGiftsUIDs.push(userArr[i].uid);
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
  reviewGifts = document.getElementById('reviewGifts');
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
  reviewModal = document.getElementById('reviewModal');
  closeReviewModal = document.getElementById('closeReviewModal');
  reviewTitle = document.getElementById('reviewTitle');
  reviewDetails = document.getElementById('reviewDetails');
  reviewListContainer = document.getElementById('reviewListContainer');
  testReview = document.getElementById('testReview');
  reviewConfirm = document.getElementById('reviewConfirm');
  reviewCancel = document.getElementById('reviewCancel');
  testData = document.getElementById('testData');
  homeElements = [notificationBtn, dataListContainer, offlineModal, offlineSpan, confirmModal, closeConfirmModal,
    confirmTitle, confirmContent, confirmBtn, denyBtn, notificationModal, notificationTitle, notificationInfo,
    noteSpan, inviteNote, boughtGifts, addGift, giftModal, giftTitle, giftLink, giftWhere, giftDescription,
    giftCreationDate, giftUpdate, giftDelete, closeGiftModal, reviewModal, closeReviewModal, reviewTitle,
    reviewDetails, reviewListContainer, testReview, reviewConfirm, reviewCancel, testData];

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

  if (setYearlyReviewBool) {
    firebase.database().ref("users/" + user.uid).update({
      yearlyReview: 0
    });
  }

  function initializeBoughtGiftsBtn() {
    boughtGifts.innerHTML = "Bought Gifts";
    boughtGifts.onclick = function () {
      if (userBoughtGifts.length == 0) {
        deployNotificationModal(false, "No Bought Gifts!", "You haven't bought any " +
            "gifts yet. Buy some gifts from some friends first!");
      } else {
        sessionStorage.setItem("boughtGifts", JSON.stringify(userBoughtGifts));
        sessionStorage.setItem("boughtGiftsUIDs", JSON.stringify(userBoughtGiftsUIDs));
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
        if (i != -1) {
          localObjectChanges = findObjectChanges(userArr[i], data.val());
          if (localObjectChanges.length != 0) {
            userArr[i] = data.val();

            if (data.key == user.uid) {
              user = data.val();
              checkNotifications();
              updateFriendNav(user.friends);
            }
          }
        } else {
          userArr.push(data.val());

          if (data.key == user.uid) {
            user = data.val();
            checkNotifications();
            updateFriendNav(user.friends);
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

            if (data.key == user.uid) {
              user = data.val();
              checkNotifications();
              updateFriendNav(user.friends);
              giftArr = user.giftList;
              if (potentialRemoval) {
                findRemovedGift(oldGiftArr, giftArr);
                potentialRemoval = false;
              }
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
        giftArr.push(data.val());

        createGiftElement(data.val().description, data.val().link, data.val().received, data.val().title,
            data.val().where, data.val().uid, data.val().creationDate, data.val().buyer);

        checkGiftLimit();
      });

      postRef.on('child_changed', function(data) {
        if (initializedGifts.includes(data.val().uid)) {
          giftArr[data.key] = data.val();

          changeGiftElement(data.val().description, data.val().link, data.val().received, data.val().title,
              data.val().where, data.val().uid, data.val().creationDate, data.val().buyer);
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

  function createGiftElement(description, link, received, title, where, uid, date, buyer){
    try{
      document.getElementById('testData').remove();
    } catch (err) {}

    let liItem = document.createElement("LI");
    liItem.id = "gift" + uid;

    initGiftElement(liItem, description, link, received, title, where, uid, date, buyer);

    let textNode = document.createTextNode(title);
    liItem.appendChild(textNode);
    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
    clearInterval(commonLoadingTimer);
    clearInterval(offlineTimer);

    dataCounter++;
    initializedGifts.push(uid);
    if (dataCounter > buttonOpacLim) {
      boughtGifts.style.opacity = ".75";
      reviewGifts.style.opacity = ".75";
    }
  }

  function changeGiftElement(description, link, received, title, where, uid, date, buyer) {
    let editGift = document.getElementById('gift' + uid);
    editGift.innerHTML = title;

    initGiftElement(description, link, received, title, where, uid, date, buyer);
  }

  function initGiftElement(liItem, description, link, received, title, where, uid, date, buyer) {
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
        updateGiftElement(uid);
      };
      giftDelete.onclick = function(){
        homeConfirmModal("Confirm Gift Delete", "Are you sure you want to delete your gift, " +
            title + "?", title, uid, buyer);
      };

      openModal(giftModal, uid);

      closeGiftModal.onclick = function() {
        closeModal(giftModal);
      };
    };
  }
};

function findRemovedGift(oldArr, newArr) {
  let removedGiftIndex = -1;

  removedGiftIndex = findRemovedData(oldArr, newArr);
  if (removedGiftIndex != -1) {
    removeGiftElement(oldArr[removedGiftIndex].uid);
    let i = initializedGifts.indexOf(oldArr[removedGiftIndex].uid);
    initializedGifts.splice(i, 1);
    oldGiftArr.splice(removedGiftIndex, 1);
  }
}

function removeGiftElement(uid) {
  console.log("Remove gift " + uid);
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

function deleteGiftElement(title, uid, buyer, bulkDelete) {
  let verifyDeleteBool = true;
  let toDelete = -1;

  if (bulkDelete == undefined)
    bulkDelete = false;

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

    firebase.database().ref("users/" + user.uid).update({
      giftList: giftArr
    });

    closeModal(giftModal);

    if (!bulkDelete)
      deployNotificationModal(false, "Gift Deleted", "Gift " + title +
          " successfully deleted!");

    if(buyer != ""){
      let userFound = findUserNameItemInArr(buyer, userArr);
      if(userFound != -1){
        addDeleteNoteToDB(userArr[userFound], title);
      } else {
        if(consoleOutput)
          console.log("User not found");
      }
    } else {
      if(consoleOutput)
        console.log("No buyer, no notification needed");
    }
    giftDeleteLocal = false;
  } else {
    if (!bulkDelete)
      deployNotificationModal(true, "Gift Delete Failed!", "Delete failed, please " +
          "try again later!");
    updateMaintenanceLog("home", "Gift delete failed for user " + user.userName + "'s public list, gift " + uid);
    return true;
  }
  return false;
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

function addDeleteNoteToDB(buyerUserData, giftTitle){
  let pageNameNote = "deleteGift";
  let giftOwner = user.uid;
  let buyerUserNotifications = [];
  let updateNotificationBool = false;
  let notificationFoundBool = false;
  let notificationString = generateNotificationString(giftOwner, "", giftTitle, pageNameNote);

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
      deployNotificationModal(false, "Gift Limit Reached!", "You have reached " +
          "the limit of the number of gifts that you can create (" + giftLimit + "). Please remove some gifts in order " +
          "to create more!", 4);
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
