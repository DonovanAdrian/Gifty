/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let giftAddUpdateElements = [];
let oldGiftArr = [];
let giftArr = [];
let giftURLLimit = [];
let changedLocalGiftEditFields = [];
let unsavedGiftStorage = [];

let giftPresent = true;
let invalidURLBool = false;
let invalidURLOverride = false;
let giftChangeReloadNeeded = false;
let localGiftAddUpdate = false;

let invalidURL = "";
let buttonText = "";
let previousTitle = "";
let previousLink = "";
let previousWhere = "";
let previousDescription = "";
let previousMultiple = "";
let giftChangesStr = "";

let giftUID = -1;
let giftNavigationInt = 0;
let giftChangeReloadCount = 0;
let getGiftIndex = -1;

let giftDescriptionInp;
let giftTitleInp;
let giftWhereInp;
let giftLinkInp;
let multiplePurchases;
let titleInfoIcon;
let urlInfoIcon;
let whereInfoIcon;
let descriptionInfoIcon;
let multipleInfoIcon;
let updateGift;
let homeNote;
let listNote;
let tempCurrentGift;
let currentGift;
let confirmModal;
let closeConfirmModal;
let confirmTitle;
let confirmContent;
let confirmBtn;
let denyBtn;



function getCurrentUser(){
  privateList = JSON.parse(sessionStorage.privateList);
  failedNavNum = 8;
  if(privateList == undefined || privateList == "") {
    privateListBool = false;
    buttonText = "Back To Home";
    giftNavigationInt = 2;
  } else {
    privateUser = JSON.parse(sessionStorage.validPrivateUser);
    homeNote.className = "";
    listNote.className = "active";
    if (privateUser.moderatorInt == 1)
      consoleOutput = true;
    if(consoleOutput) {
      console.log("Private User: " + privateUser.userName + " loaded in");
    }
    buttonText = "Back To Private List";
    giftNavigationInt = 10;
    updateFriendNav(privateUser.friends, true);
    checkInvites(privateUser);
  }

  getCurrentUserCommon();

  if (privateListBool) {
    if (user.uid != privateUser.uid) {
      giftArr = user.privateList;
    } else {
      updateMaintenanceLog(pageName, "Critical Error: Private User is equal to Primary User!");
      deployNotificationModal(false, "Gift Page Error!", "Unfortunately there was " +
          "an error loading your friend's private list! You will be redirected to the Lists page for now. Please " +
          "notify a moderator of this occurrence.", 10, 3);
    }
  } else {
    giftArr = user.giftList;
  }
  if (giftArr == undefined) {
    giftArr = [];
  }

  try {
    giftStorage = JSON.parse(sessionStorage.giftStorage);
  } catch (err) {}
  try {
    unsavedChanges = JSON.parse(sessionStorage.unsavedChanges);
  } catch (err) {}
  if (giftStorage == undefined || giftStorage == "") {
    giftPresent = false;
  } else {
    if(consoleOutput)
      console.log("Gift: " + giftStorage + " found");
    if (privateListBool) {
      getGiftIndex = findUIDItemInArr(giftStorage, user.privateList, true);
      if (getGiftIndex != -1)
        currentGift = user.privateList[getGiftIndex];
    } else {
      getGiftIndex = findUIDItemInArr(giftStorage, user.giftList, true);
      if (getGiftIndex != -1)
        currentGift = user.giftList[getGiftIndex];
    }
    if (getGiftIndex != -1) {
      giftUID = getGiftIndex;
      initializeGiftFieldListeners();
      initializeData();
    }
  }

  if (unsavedChanges != undefined && tempCurrentGift != undefined)
    if (unsavedChanges) {
      unsavedGiftStorage = JSON.parse(sessionStorage.unsavedGiftStorage);
      tempCurrentGift = {
        title: unsavedGiftStorage[0],
        link: unsavedGiftStorage[1],
        where: unsavedGiftStorage[2],
        description: unsavedGiftStorage[3],
        multiples: unsavedGiftStorage[4]
      };
      if (tempCurrentGift.title != currentGift.title ||
          tempCurrentGift.link != currentGift.link ||
          tempCurrentGift.where != currentGift.where ||
          tempCurrentGift.description != currentGift.description ||
          tempCurrentGift.multiples != currentGift.multiples) {
        currentGift = tempCurrentGift;
      } else {
        unsavedChanges = false;
      }
    }
    else
      unsavedChanges = false;
  sessionStorage.setItem("unsavedChanges", JSON.stringify(unsavedChanges));
}

window.onload = function instantiate() {
  initializeGiftAddUpdatePage();

  function initializeGiftAddUpdatePage() {
    try {
      pageName = "GiftAddUpdate";
      confirmModal = document.getElementById("confirmModal");
      closeConfirmModal = document.getElementById("closeConfirmModal");
      confirmTitle = document.getElementById("confirmTitle");
      confirmContent = document.getElementById("confirmContent");
      confirmBtn = document.getElementById("confirmBtn");
      denyBtn = document.getElementById("denyBtn");
      giftDescriptionInp = document.getElementById("giftDescriptionInp");
      giftTitleInp = document.getElementById("giftTitleInp");
      giftWhereInp = document.getElementById("giftWhereInp");
      giftLinkInp = document.getElementById("giftLinkInp");
      multiplePurchases = document.getElementById("multiplePurchases");
      titleInfoIcon = document.getElementById("titleInfoIcon");
      urlInfoIcon = document.getElementById("urlInfoIcon");
      whereInfoIcon = document.getElementById("whereInfoIcon");
      descriptionInfoIcon = document.getElementById("descriptionInfoIcon");
      multipleInfoIcon = document.getElementById("multipleInfoIcon");
      updateGift = document.getElementById("updateGift");
      backBtn = document.getElementById("backBtn");
      homeNote = document.getElementById("homeNote");
      listNote = document.getElementById("listNote");
      inviteNote = document.getElementById("inviteNote");

      getCurrentUser();
      commonInitialization();

      giftAddUpdateElements = [offlineModal, offlineSpan, confirmModal, closeConfirmModal, confirmTitle, confirmContent,
        confirmBtn, denyBtn, giftDescriptionInp, giftTitleInp, giftWhereInp, giftLinkInp, multiplePurchases, titleInfoIcon,
        urlInfoIcon, whereInfoIcon, descriptionInfoIcon, multipleInfoIcon, updateGift, homeNote, listNote, inviteNote,
        notificationModal, notificationTitle, notificationInfo, noteSpan];

      verifyElementIntegrity(giftAddUpdateElements);

      limitsInitial = firebase.database().ref("limits/");
      if (!privateListBool) {
        userGifts = firebase.database().ref("users/" + user.uid + "/giftList/");
      } else {
        try {
          userGifts = firebase.database().ref("users/" + privateList.uid + "/privateList/");
        } catch (err) {
          updateMaintenanceLog("privateList", "\"" + user.userName + "\" failed to connect to the private list owned by \"" + privateList.userName + "\"!");
          deployNotificationModal(false, "Gift List Error!", "There was an error connecting to " +
              privateList.uid + "'s private list! Please notify a moderator about this issue!", 5, 3);
        }
      }

      databaseQuery();

      initializeInfoIcons();
      initializeBackBtn();
      initializeGiftAddBtn();
    } catch (err) {
      console.log("Critical Error: " + err.toString());
      updateMaintenanceLog(pageName, "Critical Initialization Error: " + err.toString() + " - Send This " +
          "Error To A Gifty Developer.");
    }
  }

  function databaseQuery() {
    let fetchLimits = function (postRef) {
      postRef.on("child_added", function (data) {
        clearInterval(commonLoadingTimer);
        clearInterval(offlineTimer);
        if (data.key == "giftLimit") {
          giftLimit = data.val();
        } else if (data.key == "giftURLLimit") {
          giftURLLimit = data.val();
          giftURLLimit = giftURLLimit.split(",");
        }
      });

      postRef.on("child_changed", function (data) {
        if (data.key == "giftLimit") {
          giftLimit = data.val();
        } else if (data.key == "giftURLLimit") {
          giftURLLimit = data.val();
          giftURLLimit = giftURLLimit.split(",");
        }
      });

      postRef.on("child_removed", function (data) {
        if (data.key == "giftLimit") {
          giftLimit = 100;
        } else if (data.key == "giftURLLimit") {
          giftURLLimit = "";
        }
      });
    };

    let fetchData = function (postRef) {
      postRef.on("child_added", function (data) {
        if (findUIDItemInArr(data.val().uid, giftArr, true) == -1) {
          oldGiftArr = forceNewArray(giftArr);
          giftArr.push(data.val());
          localObjectChanges = findObjectChanges(oldGiftArr, giftArr);
          if (localObjectChanges.length != 0) {
            if (data.val().uid == giftStorage) {
              giftUID = data.key;
              currentGift = data.val();
              initializeGiftFieldListeners();
              initializeData();
            }
          }
        } else {
          if (data.val().uid == giftStorage) {
            if (privateListBool) {
              getGiftIndex = findUIDItemInArr(giftStorage, user.privateList, true);
              if (getGiftIndex != -1)
                currentGift = user.privateList[getGiftIndex];
            } else {
              getGiftIndex = findUIDItemInArr(giftStorage, user.giftList, true);
              if (getGiftIndex != -1)
                currentGift = user.giftList[getGiftIndex];
            }
            if (data.val().title != currentGift.title ||
                data.val().link != currentGift.link ||
                data.val().where != currentGift.where ||
                data.val().description != currentGift.description ||
                data.val().multiples != currentGift.multiples) {
              unsavedChanges = false;
            }
          }
        }
      });

      postRef.on("child_changed", function (data) {
        oldGiftArr = forceNewArray(giftArr);
        giftArr[data.key] = data.val();
        localObjectChanges = findObjectChanges(oldGiftArr, giftArr);
        if (localObjectChanges.length != 0) {

          if (data.val().uid == giftStorage) {
            previousTitle = currentGift.title;
            previousLink = currentGift.link;
            previousWhere = currentGift.where;
            previousDescription = currentGift.description;
            previousMultiple = currentGift.multiples;
            currentGift = data.val();
            giftChangesStr = updateGiftAndBuildChangesString();
            if (!localGiftAddUpdate)
              if (giftChangeReloadNeeded) {
                deployGiftChangesConfirmModal("Notice: Gift Updated!", "Fields that " +
                    "you recently updated have been changed by someone else:<br/><br/>" + giftChangesStr +
                    "<br/><br/>Would you like to reload all the input fields with the new changes?" +
                    "<br/>(Note: If you do not reload, someone else's changes may be overwritten!)");
                giftChangeReloadNeeded = false;
                giftChangeReloadCount++;
              } else {
                deployNotificationModal(false, "Gift Updated!", "Someone else updated " +
                    "the following fields while you have been here:<br/><br/>" + giftChangesStr + "<br/><br/>Please note " +
                    "that no action is needed on your part! You may continue updating as needed.", 6);
              }
          }
        }
      });

      postRef.on("child_removed", function (data) {
        if (data.val().uid == giftStorage) {
          deployNotificationModal(false, "Current Gift Removed!", "Unfortunately " +
              "the gift you were editing was removed. Navigating to previous page...", 5, giftNavigationInt);
        }
      });
    };

    fetchData(userGifts);
    fetchLimits(limitsInitial);

    listeningFirebaseRefs.push(userGifts);
    listeningFirebaseRefs.push(limitsInitial);
  }
};

function initializeBackBtn() {
  backBtn.innerHTML = buttonText;

  backBtn.onclick = function() {
    navigation(giftNavigationInt);//PrivateFriendList/Home
  };
}

function initializeGiftAddBtn() {
  if (giftPresent) {
    updateGift.innerHTML = "Update Gift";
    updateGift.onclick = function () {
      updateGiftToDB();
    }
  } else {
    currentGift = {
      title:"",
      link:"",
      where:"",
      description:""
    }
    initializeGiftFieldListeners();
    updateGift.innerHTML = "Add New Gift";
    updateGift.onclick = function () {
      addGiftToDB();
      updateGift.onclick = function () {};
    };
  }
}

function initializeInfoIcons() {
  titleInfoIcon.onclick = function() {
    deployNotificationModal(false, "Gift Title", "This field is for the title " +
        "of your gift! This is the only mandatory field.", 4);
  };
  urlInfoIcon.onclick = function() {
    deployNotificationModal(false, "Gift URL", "This field is for a website URL " +
        "to spur ideas or to be precise about what you would like.", 6);
  };
  whereInfoIcon.onclick = function() {
    deployNotificationModal(false, "Gift Location", "This field is for telling " +
        "your friends where they would be able to find your gift.", 6);
  };
  descriptionInfoIcon.onclick = function() {
    deployNotificationModal(false, "Gift Description", "This field is for any " +
        "other details that you would like to add along with your gift. Type away!", 6);
  };
  multipleInfoIcon.onclick = function() {
    deployNotificationModal(false, "Gift Multiples?", "This checkbox allows this " +
        "gift to be bought more than once. For example, gift cards, candles, or pairs of socks!", 6);
  };
}

function forceNewArray(inputArray) {
  let tempArray = [];
  for (let i = 0; i < inputArray.length; i++) {
    tempArray.push(inputArray[i]);
  }
  return tempArray;
}

function deployGiftChangesConfirmModal(confirmChangesTitle, confirmChangesContent) {
  confirmTitle.innerHTML = confirmChangesTitle;
  confirmContent.innerHTML = confirmChangesContent;

  confirmBtn.onclick = function () {
    reloadAllFields();
    closeModal(confirmModal);
  };

  denyBtn.onclick = function () {
    closeModal(confirmModal);
  };

  openModal(confirmModal, "confirmModal", true);

  closeConfirmModal.onclick = function () {
    closeModal(confirmModal);
  };

  window.onclick = function (event) {
    if (event.target == confirmModal) {
      closeModal(confirmModal);
    }
  };
}

function reloadAllFields() {
  giftTitleInp.value = currentGift.title;
  giftLinkInp.value = currentGift.link;
  giftWhereInp.value = currentGift.where;
  giftDescriptionInp.value = currentGift.description;
  multiplePurchases.checked = currentGift.multiples;
}

function updateGiftAndBuildChangesString() {
  let tempGiftChanges = "";

  if (previousTitle != currentGift.title) {
    tempGiftChanges = "Title";
    if (!changedLocalGiftEditFields.includes("Title")) {
      giftTitleInp.value = currentGift.title;
    } else {
      giftChangeReloadNeeded = true;
    }
  }
  if (previousLink != currentGift.link) {
    if (tempGiftChanges == "") {
      tempGiftChanges = "Link";
    } else {
      tempGiftChanges = tempGiftChanges + ", Link";
    }
    if (!changedLocalGiftEditFields.includes("Link")) {
      giftLinkInp.value = currentGift.link;
    } else {
      giftChangeReloadNeeded = true;
    }
  }
  if (previousWhere != currentGift.where) {
    if (tempGiftChanges == "") {
      tempGiftChanges = "Location";
    } else {
      tempGiftChanges = tempGiftChanges + ", Location";
    }
    if (!changedLocalGiftEditFields.includes("Location")) {
      giftWhereInp.value = currentGift.where;
    } else {
      giftChangeReloadNeeded = true;
    }
  }
  if (previousDescription != currentGift.description) {
    if (tempGiftChanges == "") {
      tempGiftChanges = "Description";
    } else {
      tempGiftChanges = tempGiftChanges + ", Description";
    }
    if (!changedLocalGiftEditFields.includes("Description")) {
      giftDescriptionInp.value = currentGift.description;
    } else {
      giftChangeReloadNeeded = true;
    }
  }
  if (previousMultiple != currentGift.multiples) {
    if (tempGiftChanges == "") {
      tempGiftChanges = "Multiples";
    } else {
      tempGiftChanges = tempGiftChanges + ", Multiples";
    }
    if (!changedLocalGiftEditFields.includes("Multiples")) {
      multiplePurchases.checked = currentGift.multiples;
    } else {
      giftChangeReloadNeeded = true;
    }
  }

  return tempGiftChanges;
}

function initializeGiftFieldListeners() {
  giftTitleInp.onblur = function() {
    if (giftTitleInp.value != currentGift.title && !changedLocalGiftEditFields.includes("Title")) {
      changedLocalGiftEditFields.push("Title");
      unsavedChanges = true;
    }
  };

  giftLinkInp.onblur = function() {
    if (giftLinkInp.value != currentGift.link && !changedLocalGiftEditFields.includes("Link")) {
      changedLocalGiftEditFields.push("Link");
      unsavedChanges = true;
    }
  };

  giftWhereInp.onblur = function() {
    if (giftWhereInp.value != currentGift.where && !changedLocalGiftEditFields.includes("Location")) {
      changedLocalGiftEditFields.push("Location");
      unsavedChanges = true;
    }
  };

  giftDescriptionInp.onblur = function() {
    if (giftDescriptionInp.value != currentGift.description && !changedLocalGiftEditFields.includes("Description")) {
      changedLocalGiftEditFields.push("Description");
      unsavedChanges = true;
    }
  };

  multiplePurchases.onclick = function() {
    if (multiplePurchases.checked != currentGift.multiples && !changedLocalGiftEditFields.includes("Multiples")) {
      changedLocalGiftEditFields.push("Multiples");
      unsavedChanges = true;
    }
  };
}

function initializeData() {
  if(giftPresent) {
    giftTitleInp.value = currentGift.title;
    if (currentGift.link == "")
      giftLinkInp.placeholder = "No Link Was Provided";
    else
      giftLinkInp.value = currentGift.link;
    if (currentGift.where == "")
      giftWhereInp.placeholder = "No Location Was Provided";
    else
      giftWhereInp.value = currentGift.where;
    if (currentGift.description == "")
      giftDescriptionInp.placeholder = "No Description Was Provided";
    else
      giftDescriptionInp.value = currentGift.description;
    if (currentGift.multiples != null)
      multiplePurchases.checked = currentGift.multiples;
  }
}

function updateGiftToDB() {
  let newURL = verifyURLString(giftLinkInp.value);
  let clearReceivedByBool = false;
  let notificationSent = false;
  let giftLimitBool = true;

  if (giftURLLimit != "") {
    for (let i = 0; i < giftURLLimit.length; i++) {
      if (newURL.includes(giftURLLimit[i])) {
        giftLimitBool = false;
      }
    }
  } else {
    giftLimitBool = false;
  }

  if(invalidURL != newURL)
    invalidURLOverride = false;
  if (giftTitleInp.value.includes(",,,") || giftWhereInp.value.includes(",,,")
      || giftDescriptionInp.value.includes(",,,")) {
    deployNotificationModal(false, "Gift Error!", "Please do not include excess " +
        "commas in any of the fields!");
  } else if (giftTitleInp.value === "") {
    deployNotificationModal(false, "Gift Title Blank!", "It looks like you left " +
        "the title blank. Make sure you add a title so other people know what to get you!", 4);
  } else if (giftLimitBool && newURL != "") {
    deployNotificationModal(false, "Invalid Gift URL!", "It looks like the URL" +
        " you are trying to use is restricted by moderators. Please use a different link or leave it blank!", 4);
  } else if (invalidURLBool && !invalidURLOverride) {
    deployNotificationModal(false, "Invalid Gift URL!", "It looks like you " +
        "entered an invalid URL, please enter a valid URL or leave the field blank. If this is intentional, you can " +
        "click \"Add Gift\", but the gift URL will not be saved.", 4);
    invalidURLOverride = true;
    invalidURL = newURL;
  } else if (!unsavedChanges) {
    deployNotificationModal(false, "No Changes Made!", "It looks like you didn't " +
        "make any changes to this gift! If this is the case, click on any of the navigation buttons or the \"Back\" " +
        "button below!", 4);
  } else {
    if(giftUID != -1) {
      unsavedChanges = false;
      localGiftAddUpdate = true;
      if (!privateListBool) {
        if (!multiplePurchases.checked && currentGift.multiples && currentGift.receivedBy.length != undefined) {
          if (currentGift.receivedBy.length != 0) {
            let userFound;
            for (let i = 0; i < currentGift.receivedBy.length; i++) {
              userFound = findUIDItemInArr(currentGift.receivedBy[i], userArr);
              if (userFound != -1)
                addUpdateNoteToDB(userArr[userFound], currentGift.title);
            }
            notificationSent = true;

            clearReceivedByBool = true;
            currentGift.received = 0;
          }
        } else if (multiplePurchases.checked && !currentGift.multiples && currentGift.received > 0) {
          currentGift.receivedBy = [];
          for (let i = 0; i < userArr.length; i++) {
            if (userArr[i].userName == currentGift.buyer) {
              currentGift.receivedBy.push(userArr[i].uid);
            }
          }

          firebase.database().ref("users/" + user.uid + "/giftList/" + giftUID).update({
            received: -1,
            receivedBy: currentGift.receivedBy,
            buyer: ""
          });
        }

        if (currentGift.creationDate == undefined) {
          let today = new Date();
          let dd = today.getDate();
          let mm = today.getMonth()+1;
          let yy = today.getFullYear();
          let creationDate = mm + "/" + dd + "/" + yy;
          currentGift.creationDate = creationDate;
        }

        firebase.database().ref("users/" + user.uid + "/giftList/" + giftUID).update({
          title: giftTitleInp.value,
          link: newURL,
          where: giftWhereInp.value,
          received: currentGift.received,
          uid: giftStorage,
          buyer: currentGift.buyer,
          description: giftDescriptionInp.value,
          multiples: multiplePurchases.checked,
          creationDate: currentGift.creationDate
        });

        if (currentGift.receivedBy != undefined) {
          firebase.database().ref("users/" + user.uid + "/giftList/" + giftUID).update({
            receivedBy: currentGift.receivedBy
          });
          if (clearReceivedByBool) {
            firebase.database().ref("users/" + user.uid + "/giftList/" + giftUID + "/receivedBy").remove();
          }
        }
        if (currentGift.userScore != undefined) {
          firebase.database().ref("users/" + user.uid + "/giftList/" + giftUID + "/userScore").remove();
        }
      } else {
        if (!multiplePurchases.checked && currentGift.multiples && currentGift.receivedBy.length != undefined) {
          if (currentGift.receivedBy.length != 0) {
            let userFound;
            for (let i = 0; i < currentGift.receivedBy.length; i++) {
              userFound = findUIDItemInArr(currentGift.receivedBy[i], userArr);
              if (userFound != -1)
                addUpdateNoteToDB(userArr[userFound], currentGift.title);
            }
            notificationSent = true;

            clearReceivedByBool = true;
            currentGift.received = 0;
          }
        } else if (multiplePurchases.checked && !currentGift.multiples && currentGift.received > 0) {
          currentGift.receivedBy = [];
          for (let i = 0; i < userArr.length; i++) {
            if (userArr[i].userName == currentGift.buyer) {
              currentGift.receivedBy.push(userArr[i].uid);
            }
          }
          currentGift.received = -1;
          currentGift.buyer = "";

          firebase.database().ref("users/" + privateList.uid + "/privateList/" + giftUID).update({
            received: -1,
            receivedBy: currentGift.receivedBy,
            buyer: ""
          });
        }

        if (currentGift.creationDate == undefined) {
          let today = new Date();
          let dd = today.getDate();
          let mm = today.getMonth()+1;
          let yy = today.getFullYear();
          let creationDate = mm + "/" + dd + "/" + yy;
          currentGift.creationDate = creationDate;
        }

        firebase.database().ref("users/" + privateList.uid + "/privateList/" + giftUID).update({
          title: giftTitleInp.value,
          link: newURL,
          where: giftWhereInp.value,
          received: currentGift.received,
          uid: giftStorage,
          buyer: currentGift.buyer,
          description: giftDescriptionInp.value,
          multiples: multiplePurchases.checked,
          creationDate: currentGift.creationDate
        });

        if (currentGift.creator != undefined) {
          firebase.database().ref("users/" + privateList.uid + "/privateList/" + giftUID).update({
            creator: currentGift.creator
          });
        }
        if (currentGift.receivedBy != undefined) {
          firebase.database().ref("users/" + privateList.uid + "/privateList/" + giftUID).update({
            receivedBy: currentGift.receivedBy
          });
          if (clearReceivedByBool) {
            firebase.database().ref("users/" + privateList.uid + "/privateList/" + giftUID + "/receivedBy").remove();
          }
        }
        if (currentGift.userScore != undefined) {
          firebase.database().ref("users/" + privateList.uid + "/privateList/" + giftUID + "/userScore").remove();
        }
      }

      if(currentGift.buyer != "" && !notificationSent){
        let userFound = findUserNameItemInArr(currentGift.buyer, userArr);
        if(userFound != -1){
          if(privateListBool){
            if (userArr[userFound].uid != privateUser.uid) {
              addUpdateNoteToDB(userArr[userFound], currentGift.title);
            }
          } else {
            if(consoleOutput)
              console.log(user.uid);
            if (userArr[userFound].uid != user.uid) {
              addUpdateNoteToDB(userArr[userFound], currentGift.title);
            }
          }
        } else {
          if(consoleOutput)
            console.log("User not found");
        }
      } else if (currentGift.receivedBy != null && !notificationSent) {
        for (let i = 0; i < currentGift.receivedBy.length; i++) {
          let userFound = findUIDItemInArr(currentGift.receivedBy[i], userArr);
          if(userFound != -1){
            if(userArr[userFound].uid != user.uid) {
              addUpdateNoteToDB(userArr[userFound], currentGift.title);
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

      let tempUnsavedChanges = true;
      unsavedGiftStorage = [giftTitleInp.value, giftLinkInp.value, giftWhereInp.value, giftDescriptionInp.value, multiplePurchases.checked]
      sessionStorage.setItem("unsavedChanges", JSON.stringify(tempUnsavedChanges));
      sessionStorage.setItem("unsavedGiftStorage", JSON.stringify(unsavedGiftStorage));
      showSuccessfulDBOperation = true;

      listenForDBChanges("Update", giftUID);
      giftAddUpdateOverride = true;
      if (!privateListBool) {
        successfulDBOperationTitle = "Gift Updated!";
        successfulDBOperationNotice = "The gift, \"" + giftTitleInp.value + "\", has been successfully updated in your gift list! Redirecting back to home...";
        successfulDBNavigation = 2;
      } else {
        successfulDBOperationTitle = "Private Gift Updated!";
        successfulDBOperationNotice = "The gift, \"" + giftTitleInp.value + "\", has been successfully updated in " + user.name + "'s private gift list! Redirecting back to their private list...";
        successfulDBNavigation = 10;
      }
      localGiftAddUpdate = false;
    } else {
      deployNotificationModal(false, "Gift Update Error!", "There was an error " +
          "updating the gift, please try again!");
      if (!privateListBool) {
        updateMaintenanceLog("home", "Gift update failed for user \"" + user.userName + "\", public list, gift " + giftUID);
      } else {
        updateMaintenanceLog("home", "Gift update failed for user \"" + privateList.uid + "\", private list, gift " + giftUID);
      }
    }
  }
  invalidURLBool = false;
}

function addUpdateNoteToDB(buyerUserData, giftTitle){
  let pageNameNote = "friendList.html";
  let giftOwner = user.uid;
  let buyerUserNotifications = [];
  let updateNotificationBool = false;
  let notificationFoundBool = false;
  if(privateListBool){
    pageNameNote = "privateFriendList.html";
    giftOwner = privateList.uid;
  }
  let notificationString = generateNotificationString(giftOwner,"", giftTitle, pageNameNote);

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

function addGiftToDB(){
  let uid = giftArr.length;
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth()+1;
  let yy = today.getFullYear();
  let creationDate = mm + "/" + dd + "/" + yy;
  let newURL = verifyURLString(giftLinkInp.value);
  let giftLimitBool = true;

  if (giftURLLimit != "") {
    for (let i = 0; i < giftURLLimit.length; i++) {
      if (newURL.includes(giftURLLimit[i])) {
        giftLimitBool = false;
      }
    }
  } else {
    giftLimitBool = false;
  }

  if(invalidURL != newURL)
    invalidURLOverride = false;
  if (giftTitleInp.value.includes(",,,") || giftWhereInp.value.includes(",,,")
      || giftDescriptionInp.value.includes(",,,")) {
    deployNotificationModal(false, "Gift Error!", "Please do not include excess " +
        "commas in any of the fields!");
  } else if (giftTitleInp.value === "") {
    deployNotificationModal(false, "Gift Title Blank!", "It looks like you " +
        "left the title blank. Make sure you add a title so other people know what to get you!", 4);
  } else if (giftLimitBool && newURL != "") {
    deployNotificationModal(false, "Invalid Gift URL!", "It looks like the URL" +
        " you are trying to use is restricted by moderators. Please use a different link or leave it blank!", 4);
  } else if (invalidURLBool && !invalidURLOverride) {
    deployNotificationModal(false, "Invalid Gift URL!", "It looks like you " +
        "entered an invalid URL, please enter a valid URL or leave the field blank. If this is intentional, you can " +
        "click \"Add Gift\", but the gift URL will not be saved.", 4);
    invalidURLOverride = true;
    invalidURL = newURL;
  } else {
    unsavedChanges = false;
    localGiftAddUpdate = true;
    if(!privateListBool) {
      updateUserScore(user, 2);

      let newUid = firebase.database().ref("users/" + user.uid + "/giftList/" + uid).push();
      newUid = newUid.toString();
      newUid = findUIDInString(newUid);
      firebase.database().ref("users/" + user.uid + "/giftList/" + uid).set({
        title: giftTitleInp.value,
        link: newURL,
        where: giftWhereInp.value,
        received: 0,
        uid: newUid,
        buyer: "",
        description: giftDescriptionInp.value,
        creationDate: creationDate,
        multiples: multiplePurchases.checked
      });

      let tempUnsavedChanges = true;
      unsavedGiftStorage = [giftTitleInp.value, giftLinkInp.value, giftWhereInp.value, giftDescriptionInp.value, multiplePurchases.checked];
      sessionStorage.setItem("unsavedChanges", JSON.stringify(tempUnsavedChanges));
      sessionStorage.setItem("unsavedGiftStorage", JSON.stringify(unsavedGiftStorage));
      showSuccessfulDBOperation = true;
      listenForDBChanges("Add", uid);
      successfulDBOperationTitle = "Gift Added!";
      successfulDBOperationNotice = "The gift, \"" + giftTitleInp.value + "\", has been successfully added to your gift list! Redirecting back to home...";
      successfulDBNavigation = 2;
    } else {
      if (user.uid != privateUser.uid) {
        updateUserScore(privateUser, 4);

        let newUid = firebase.database().ref("users/" + user.uid + "/privateList/" + uid).push();
        newUid = newUid.toString();
        newUid = findUIDInString(newUid);
        firebase.database().ref("users/" + user.uid + "/privateList/" + uid).set({
          title: giftTitleInp.value,
          link: newURL,
          where: giftWhereInp.value,
          received: 0,
          uid: newUid,
          buyer: "",
          description: giftDescriptionInp.value,
          creationDate: creationDate,
          creator: privateUser.uid,
          multiples: multiplePurchases.checked
        });

        let tempUnsavedChanges = true;
        unsavedGiftStorage = [giftTitleInp.value, giftLinkInp.value, giftWhereInp.value, giftDescriptionInp.value, multiplePurchases.checked]
        sessionStorage.setItem("unsavedChanges", JSON.stringify(tempUnsavedChanges));
        sessionStorage.setItem("unsavedGiftStorage", JSON.stringify(unsavedGiftStorage));
        showSuccessfulDBOperation = true;
        listenForDBChanges("Add", uid);
        successfulDBOperationTitle = "Private Gift Added!";
        successfulDBOperationNotice = "The gift, \"" + giftTitleInp.value + "\", has been successfully added to " + user.name + "'s private gift list! Redirecting back to their private list...";
        successfulDBNavigation = 10;
      } else {
        deployNotificationModal(false, "Gift Add Error!", "Please go back to your " +
            "friend's list and try to add this gift again!");
      }
    }
    localGiftAddUpdate = false;
  }
  invalidURLBool = false;
}

function verifyURLString(url){
  let urlBuilder = "";
  let tempURL = "";
  let failedURLs = [];
  let isChar = false;
  let preDot = false;
  let dotBool = false;
  let dotDuplicate = false;
  let postDot = false;
  let validURLBool = false;
  let validURLOverride = true;
  let invalidChar = false;
  let dotEnder = false;

  for(let i = 0; i < url.length; i++){
    if (url.charAt(i) == " ") {
      failedURLs.push(urlBuilder);
      urlBuilder = "";
    } else
      urlBuilder += url.charAt(i);
  }
  failedURLs.push(urlBuilder);

  for (let a = 0; a < failedURLs.length; a++) {
    for (let b = 0; b < failedURLs[a].length; b++) {
      if (isAlphNum(failedURLs[a].charAt(b))) {
        isChar = true;
        preDot = true;
        dotDuplicate = false;
        dotEnder = false;
      }
      if (isAlphNum(failedURLs[a].charAt(b)) && dotBool) {
        postDot = true;
        dotDuplicate = false;
        dotEnder = false;
      }
      if (failedURLs[a].charAt(b) == ".") {
        dotBool = true;
        dotEnder = true;
        if (!dotDuplicate)
          dotDuplicate = true;
        else
          validURLOverride = false;
      }
      if (postDot)
        validURLBool = true;
    }

    if (!dotEnder && validURLBool && validURLOverride) {
      tempURL = failedURLs[a];
    }

    preDot = false;
    dotBool = false;
    dotDuplicate = false;
    postDot = false;
    validURLBool = false;
    validURLOverride = true;
    dotEnder = false;
  }

  if (tempURL == "" && isChar)
    invalidURLBool = true;
  else if (invalidChar)
    invalidURLBool = true;
  else
  if(consoleOutput)
    console.log("Valid URL! " + tempURL);

  return tempURL;
}

function isAlphNum(rChar){
  rChar = rChar.toUpperCase();
  switch (rChar){
    case "A":
    case "B":
    case "C":
    case "D":
    case "E":
    case "F":
    case "G":
    case "H":
    case "I":
    case "J":
    case "K":
    case "L":
    case "M":
    case "N":
    case "O":
    case "P":
    case "Q":
    case "R":
    case "S":
    case "T":
    case "U":
    case "V":
    case "W":
    case "X":
    case "Y":
    case "Z":
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case "-":
    case "_":
    case "~":
    case ".":
    case ":":
    case "/":
    case "?":
    case "#":
    case "[":
    case "]":
    case "@":
    case "!":
    case "$":
    case "&":
    case "\"":
    case "\'":
    case "(":
    case ")":
    case "*":
    case "+":
    case ",":
    case ";":
    case "=":
      return true;
    default:
      return false;
  }
}
