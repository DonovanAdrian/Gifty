/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let reviewDate = new Date(currentYear, 0, 1, 0, 0, 0, 0);//Jan 1st

let homeElements = [];
let giftArr = [];
let oldGiftArr = [];
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
let setNextYearReviewBool = false;

let giftLimit = 50;

let reviewGifts;
let boughtGifts;
let addGift;
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



function getCurrentUser() {
  let fixUserGifts = false;
  getCurrentUserCommon();

  if (user.giftList != undefined)
    for (let i = 0; i < user.giftList.length; i++) {
      if (user.giftList[i] == null) {
        user.giftList.splice(i, 1);
        fixUserGifts = true;
      }
    }

  if (fixUserGifts) {
    commonInitialization();
    firebase.database().ref("users/" + user.uid).update({
      giftList: user.giftList
    });
  }

  checkYearlyReview();
  failedNavNum = 2;

  if (user.giftList == undefined) {
    user.giftList = [];
  } else {
    giftArr = user.giftList;
    for (let i = 0; i < user.giftList.length; i++) {
      createGiftElement(user.giftList[i].uid);
    }
    checkGiftLimit();
  }

  if (user.giftList.length == 0) {
    deployListEmptyNotification("No Gifts Found! Add Some Gifts With The Button Below!");
    giftListEmptyBool = true;
  }
}

function checkYearlyReview() {
  let tempVettedUserGifts = reviewUserGifts();
  let lastLoginReviewValid = JSON.parse(sessionStorage.lastLoginReviewValid);

  if (user.yearlyReview == undefined) {
    user.yearlyReview = 0;
  }

  if (tempVettedUserGifts.length > 0) {
    if (user.yearlyReview > currentYear) {
      if (consoleOutput)
        console.log("User Does Not Need Yearly Review! Skipping...");
    } else if (user.yearlyReview < currentYear && currentDate > reviewDate) {
      reviewGifts.style.display = "block";
      reviewGifts.innerHTML = "Review Gifts";
      reviewGifts.onclick = function () {
        initializeYearlyReview();
      };
      if (user.yearlyReview != 0) {
        initializeYearlyReview();
      }
    }
  } else if (currentDate > addReviewDays(reviewDate, 30) && user.yearlyReview < currentYear) {
    if (lastLoginReviewValid) {
      setNextYearReviewBool = true;
    }
  }
}

function reviewUserGifts() {
  let tempGiftReviewArr = [];
  let tempUserGifts = [];

  if (user.giftList != undefined)
    tempUserGifts = user.giftList;

  for (let i = 0; i < tempUserGifts.length; i++) {
    if (tempUserGifts[i].creationDate < (currentYear - 1) || tempUserGifts[i].creationDate == undefined
        || tempUserGifts[i].creationDate == "" || tempUserGifts[i].received != 0) {
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
  for (let i = 0; i < userArr.length; i++) {
    if (userArr[i].uid != user.uid) {
      userGiftArr = userArr[i].giftList;
      userPrivateGiftArr = userArr[i].privateList;

      if (userGiftArr == undefined)
        userGiftArr = [];
      if (userPrivateGiftArr == undefined)
        userPrivateGiftArr = [];

      for (let a = 0; a < userGiftArr.length; a++) {
        if (userGiftArr[a].buyer == user.userName || userGiftArr[a].buyer == user.uid) {
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
  initializeHomePage();

  function initializeHomePage() {
    try {
      pageName = "Home";
      notificationBtn = document.getElementById("notificationButton");
      confirmModal = document.getElementById("confirmModal");
      closeConfirmModal = document.getElementById("closeConfirmModal");
      confirmTitle = document.getElementById("confirmTitle");
      confirmContent = document.getElementById("confirmContent");
      confirmBtn = document.getElementById("confirmBtn");
      denyBtn = document.getElementById("denyBtn");
      inviteNote = document.getElementById("inviteNote");
      reviewGifts = document.getElementById("reviewGifts");
      boughtGifts = document.getElementById("boughtGifts");
      addGift = document.getElementById("addGift");
      giftModal = document.getElementById("giftModal");
      giftTitle = document.getElementById("giftTitle");
      giftLink = document.getElementById("giftLink");
      giftWhere = document.getElementById("giftWhere");
      giftDescription = document.getElementById("giftDescription");
      giftCreationDate = document.getElementById("giftCreationDate");
      giftUpdate = document.getElementById("giftUpdate");
      giftDelete = document.getElementById("giftDelete");
      closeGiftModal = document.getElementById("closeGiftModal");
      reviewModal = document.getElementById("reviewModal");
      closeReviewModal = document.getElementById("closeReviewModal");
      reviewTitle = document.getElementById("reviewTitle");
      reviewDetails = document.getElementById("reviewDetails");
      reviewListContainer = document.getElementById("reviewListContainer");
      testReview = document.getElementById("testReview");
      reviewConfirm = document.getElementById("reviewConfirm");
      reviewCancel = document.getElementById("reviewCancel");

      getCurrentUser();
      commonInitialization();

      homeElements = [notificationBtn, dataListContainer, offlineModal, offlineSpan, confirmModal, closeConfirmModal,
        confirmTitle, confirmContent, confirmBtn, denyBtn, notificationModal, notificationTitle, notificationInfo,
        noteSpan, inviteNote, boughtGifts, addGift, giftModal, giftTitle, giftLink, giftWhere, giftDescription,
        giftCreationDate, giftUpdate, giftDelete, closeGiftModal, reviewModal, closeReviewModal, reviewTitle,
        reviewDetails, reviewListContainer, testReview, reviewConfirm, reviewCancel, testData];

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
      if (setNextYearReviewBool) {
        firebase.database().ref("users/" + user.uid).update({
          yearlyReview: currentYear
        });
      }

      initializeBoughtGiftsBtn();
    } catch (err) {
      sendCriticalInitializationError(err);
    }
  }

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
            }
            saveCriticalCookies();
          }
        } else {
          userArr.push(data.val());

          if (data.key == user.uid) {
            user = data.val();
            checkNotifications();
            updateFriendNav(user.friends);
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
        if (findUIDItemInArr(data.val().uid, giftArr, true) == -1) {
          giftArr.push(data.val());
          user.giftList = giftArr;
          saveCriticalCookies();
        }
        createGiftElement(data.val().uid);
        checkGiftLimit();
      });

      postRef.on("child_changed", function(data) {
        if (initializedGifts.includes(data.val().uid)) {
          giftArr[data.key] = data.val();
          changeGiftElement(data.val().uid);
          if (data.val().uid == currentModalOpen) {
            closeModal(giftModal);
          }
          user.giftList = giftArr;
          saveCriticalCookies();
        }
      });

      postRef.on("child_removed", function(data) {
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

function createGiftElement(uid) {
  let giftIndex = findUIDItemInArr(uid, giftArr, true);
  if (giftIndex != -1 && initializedGifts.indexOf(uid) == -1) {
    try {
      document.getElementById("testData").remove();
    } catch (err) {}

    let liItem = document.createElement("LI");
    liItem.id = "gift" + uid;
    initGiftElement(liItem, uid);
    let textNode = document.createTextNode(giftArr[giftIndex].title);
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
  } else {
    changeGiftElement(uid);
  }
}

function changeGiftElement(uid) {
  let giftIndex = findUIDItemInArr(uid, giftArr, true);
  if (giftIndex != -1) {
    let editGift = document.getElementById("gift" + uid);
    editGift.innerHTML = giftArr[giftIndex].title;
    initGiftElement(editGift, uid);
  }
}

function initGiftElement(liItem, uid) {
  let giftIndex = findUIDItemInArr(uid, giftArr, true);
  if (giftIndex != -1) {
    let description = giftArr[giftIndex].description;
    let link = giftArr[giftIndex].link;
    let title = giftArr[giftIndex].title;
    let where = giftArr[giftIndex].where;
    let date = giftArr[giftIndex].creationDate;
    let buyer = giftArr[giftIndex].buyer;

    liItem.className = "gift";
    liItem.onclick = function () {
      if (link != "") {
        giftLink.innerHTML = "Click me to go to the webpage you provided!";
        giftLink.onclick = function () {
          giftLinkRedirect(link);
        };
      } else {
        giftLink.innerHTML = "You did not provide a link for this gift";
        giftLink.onclick = function () {
        };
      }
      if (description != "") {
        giftDescription.innerHTML = "Description: " + description;
      } else {
        giftDescription.innerHTML = "You did not provide a description for this gift";
      }
      giftTitle.innerHTML = title;
      if (where != "") {
        giftWhere.innerHTML = "This can be found at: " + where;
      } else {
        giftWhere.innerHTML = "You did not provide a location for where to find this gift";
      }
      if (date == undefined) {
        date = "";
      }
      if (date != "") {
        giftCreationDate.innerHTML = "Created on: " + date;
      } else {
        giftCreationDate.innerHTML = "Creation date not available";
      }
      giftUpdate.onclick = function () {
        updateGiftElement(uid);
      };
      giftDelete.onclick = function () {
        homeConfirmModal("Confirm Gift Delete", "Are you sure you want to delete your gift, " +
            title + "?", title, uid, buyer);
      };
      openModal(giftModal, uid);
      closeGiftModal.onclick = function () {
        closeModal(giftModal);
      };
    };
  }
}

function findRemovedGift(oldArr, newArr) {
  let removedGiftIndex;
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
  document.getElementById("gift" + uid).remove();
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

  for (let i = 0; i < giftArr.length; i++) {
    if(uid == giftArr[i].uid) {
      toDelete = i;
      break;
    }
  }

  if (toDelete != -1) {
    giftArr.splice(toDelete, 1);
    user.giftList = giftArr;

    for (let i = 0; i < giftArr.length; i++) {
      if (uid == giftArr[i].uid) {
        verifyDeleteBool = false;
        break;
      }
    }
  } else {
    verifyDeleteBool = false;
  }

  if (verifyDeleteBool) {
    saveCriticalCookies();
    let i = initializedGifts.indexOf(uid);
    initializedGifts.splice(i, 1);
    giftDeleteLocal = true;
    removeGiftElement(uid);

    firebase.database().ref("users/" + user.uid).update({
      giftList: giftArr
    });

    closeModal(giftModal);

    if (buyer != "" || buyer == undefined) {
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

    if (!bulkDelete) {
      successfulDBOperationTitle = "Gift Deleted";
      successfulDBOperationNotice = "Your gift, \"" + title + "\", was successfully deleted!";
      showSuccessfulDBOperation = true;
      listenForDBChanges("Delete", uid);
    }
    giftDeleteLocal = false;
  } else {
    if (!bulkDelete)
      deployNotificationModal(true, "Gift Delete Failed!", "Delete failed, please " +
          "try again later!");
    updateMaintenanceLog("home", "Gift delete failed for user \"" + user.userName +
        "\", public list, gift " + title + " (" + uid + ")");
    return true;
  }
  return false;
}

function addDeleteNoteToDB(buyerUserData, giftTitle) {
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
          "the limit of the number of gifts that you can create (" + giftLimit + "). If you have more than that, no " +
          "problem! However, you'll need to remove some gifts to make new ones.", 8);
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
