/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let giftAddUpdateElements = [];
let listeningFirebaseRefs = [];
let giftArr = [];
let giftURLLimit = [];

let giftPresent = true;
let privateListBool = true;
let invalidURLBool = false;
let invalidURLOverride = false;

let invalidURL = "";
let buttonText = "";

let giftUID = -1;
let giftNavigationInt = 0;

let giftStorage;
let privateList;
let offlineSpan;
let offlineModal;
let user;
let privateUser;
let giftDescriptionInp;
let giftTitleInp;
let giftWhereInp;
let giftLinkInp;
let multiplePurchases;
let updateGift;
let homeNote;
let listNote;
let inviteNote;
let currentGift;
let userGifts;
let limitsInitial;
let notificationModal;
let notificationInfo;
let notificationTitle;
let noteSpan;



function getCurrentUser(){
  getCurrentUserCommon();

  privateList = JSON.parse(sessionStorage.privateList);
  if(privateList == null || privateList == undefined || privateList == "") {
    privateListBool = false;
    buttonText = "Back To Home";
    giftNavigationInt = 2;
  } else {
    privateUser = JSON.parse(sessionStorage.validPrivateUser);
    homeNote.className = "";
    listNote.className = "active";
    if(privateUser.moderatorInt == 1)
      consoleOutput = true;
    if(consoleOutput) {
      console.log("User: " + privateUser.userName + " loaded in");
    }
    buttonText = "Back To Private List";
    giftNavigationInt = 10;
  }

  try {
    giftStorage = JSON.parse(sessionStorage.giftStorage);
  } catch (err) {}
  if (giftStorage == null || giftStorage == undefined || giftStorage == "") {
    giftPresent = false;
  } else {
    if(consoleOutput)
      console.log("Gift: " + giftStorage + " found");
  }
}

window.onload = function instantiate() {
  pageName = "GiftAddUpdate";
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  giftDescriptionInp = document.getElementById('giftDescriptionInp');
  giftTitleInp = document.getElementById('giftTitleInp');
  giftWhereInp = document.getElementById('giftWhereInp');
  giftLinkInp = document.getElementById('giftLinkInp');
  multiplePurchases = document.getElementById('multiplePurchases');
  updateGift = document.getElementById('updateGift');
  homeNote = document.getElementById('homeNote');
  listNote = document.getElementById('listNote');
  inviteNote = document.getElementById('inviteNote');
  notificationModal = document.getElementById('notificationModal');
  notificationTitle = document.getElementById('notificationTitle');
  notificationInfo = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  giftAddUpdateElements = [offlineModal, offlineSpan, giftDescriptionInp, giftTitleInp, giftWhereInp, giftLinkInp,
    multiplePurchases, updateGift, homeNote, listNote, inviteNote, notificationModal, notificationTitle,
    notificationInfo, noteSpan];

  getCurrentUser();
  commonInitialization();
  verifyElementIntegrity(giftAddUpdateElements);

  limitsInitial = firebase.database().ref("limits/");
  if(!privateListBool) {
    userGifts = firebase.database().ref("users/" + user.uid + "/giftList/");
  } else {
    try{
      userGifts = firebase.database().ref("users/" + privateList.uid + "/privateList/");
    } catch (err) {
      updateMaintenanceLog("privateList", user.uid + " failed to connect to the private list owned by " + privateList.uid + "!");
      deployNotificationModal(false, "Gift List Error!", "There was an error connecting to " +
        privateList.uid + "'s private list! Please notify a moderator about this issue!", 5, 3);
    }
  }

  databaseQuery();

  function initializeBackBtn() {
    backBtn.innerHTML = buttonText;

    backBtn.onclick = function() {
      navigation(giftNavigationInt);
    };
  }

  function initializeGiftAddBtn() {
    if (giftPresent) {
      updateGift.innerHTML = "Update Gift";
      updateGift.onclick = function () {
        updateGiftToDB();
      }
    } else {
      updateGift.innerHTML = "Add New Gift";
      updateGift.onclick = function () {
        addGiftToDB();
      };
    }
  }

  initializeBackBtn();
  initializeGiftAddBtn();

  function databaseQuery() {
    let fetchLimits = function (postRef) {
      postRef.on('child_added', function (data) {
        if (data.key == "giftLimit") {
          giftLimit = data.val();
        } else if (data.key == "giftURLLimit") {
          giftURLLimit = data.val();
          giftURLLimit = giftURLLimit.split(",");
        }
      });

      postRef.on('child_changed', function (data) {
        if (data.key == "giftLimit") {
          giftLimit = data.val();
        } else if (data.key == "giftURLLimit") {
          giftURLLimit = data.val();
          giftURLLimit = giftURLLimit.split(",");
        }
      });

      postRef.on('child_removed', function (data) {
        if (data.key == "giftLimit") {
          giftLimit = 100;
        } else if (data.key == "giftURLLimit") {
          giftURLLimit = "";
        }
      });
    };

    let fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        giftArr.push(data);

        if(data.val().uid == giftStorage){
          giftUID = data.key;
          if(privateListBool){
            currentGift = data.val();
          }
          initializeData();
        }
      });

      postRef.on('child_changed', function (data) {
        giftArr[data.key] = data;

        if(data.val().uid == giftStorage){
          currentGift = data.val();
        }
      });

      postRef.on('child_removed', function (data) {
        if(privateListBool){
          sessionStorage.setItem("privateList", JSON.stringify(privateList));
        }
        sessionStorage.setItem("validUser", JSON.stringify(user));
        navigation(8);
      });

    };

    fetchData(userGifts);
    fetchLimits(limitsInitial);

    listeningFirebaseRefs.push(userGifts);
    listeningFirebaseRefs.push(limitsInitial);
  }

  function initializeData() {
    if(giftPresent) {
      getGift();

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

  function getGift() {
    if(!privateListBool) {
      for (let i = 0; i < user.giftList.length; i++) {
        if (user.giftList[i].uid == giftStorage) {
          currentGift = user.giftList[i];
          break;
        }
      }
    } else {
      for (let i = 0; i < user.privateList.length; i++) {
        if (privateList.privateList[i].uid == giftStorage) {
          currentGift = privateList.privateList[i];
          break;
        }
      }
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
    } else {
      if(giftUID != -1) {
        if (!privateListBool) {
          if (!multiplePurchases.checked && currentGift.multiples && currentGift.receivedBy.length != undefined) {
            if (currentGift.receivedBy.length != 0) {
              let userFound;
              for (let i = 0; i < currentGift.receivedBy.length; i++) {
                userFound = findUIDItemInArr(currentGift.receivedBy[i], userArr);
                if (userFound != -1)
                  addNotificationToDB(userArr[userFound], currentGift.title);
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

          firebase.database().ref("users/" + user.uid + "/giftList/" + giftUID).update({
            title: giftTitleInp.value,
            link: newURL,
            where: giftWhereInp.value,
            received: currentGift.received,
            uid: giftStorage,
            buyer: currentGift.buyer,
            description: giftDescriptionInp.value,
            multiples: multiplePurchases.checked
          });
          if (currentGift.creationDate != undefined) {
            firebase.database().ref("users/" + user.uid + "/giftList/" + giftUID).update({
              creationDate: currentGift.creationDate
            });
          }
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
                  addNotificationToDB(userArr[userFound], currentGift.title);
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

          firebase.database().ref("users/" + privateList.uid + "/privateList/" + giftUID).update({
            title: giftTitleInp.value,
            link: newURL,
            where: giftWhereInp.value,
            received: currentGift.received,
            uid: giftStorage,
            buyer: currentGift.buyer,
            description: giftDescriptionInp.value,
            multiples: multiplePurchases.checked
          });
          if (currentGift.creationDate != undefined) {
            firebase.database().ref("users/" + privateList.uid + "/privateList/" + giftUID).update({
              creationDate: currentGift.creationDate
            });
          }
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
                addNotificationToDB(userArr[userFound], currentGift.title);
              }
            } else {
              if(consoleOutput)
                console.log(user.uid);
              if (userArr[userFound].uid != user.uid) {
                addNotificationToDB(userArr[userFound], currentGift.title);
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
                addNotificationToDB(userArr[userFound], currentGift.title);
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

        if (!privateListBool) {
          deployNotificationModal(false, "Gift Updated!", "The gift, " +
            giftTitleInp.value + ", has been successfully updated in your gift list! Redirecting " +
            "back to home...",3, 2);
        } else {
          sessionStorage.setItem("validGiftUser", JSON.stringify(user));
          deployNotificationModal(false, "Private Gift Updated!", "The gift, " +
            giftTitleInp.value + ", has been successfully updated in " + user.name + "'s private gift list! Redirecting " +
            "back to their private list...", 3, 10);
        }
      } else {
        deployNotificationModal(false, "Gift Update Error!", "There was an error " +
          "updating the gift, please try again!");
        if (!privateListBool) {
          updateMaintenanceLog("home", "Gift update failed for user " + user.userName + "'s public list, gift " + giftUID);
        } else {
          updateMaintenanceLog("home", "Gift update failed for user " + privateList.uid + "'s private list, gift " + giftUID);
        }
      }
    }
    invalidURLBool = false;
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

  function addNotificationToDB(buyerUserData, giftTitle){
    let pageNameNote = "friendList.html";
    let giftOwner = user.uid;
    let notificationString;
    let buyerUserNotifications = [];
    let buyerReadNotifications = [];
    let updateNotificationBool = false;

    if(privateListBool){
      pageNameNote = "privateFriendList.html";
      giftOwner = privateList.uid;
    }

    notificationString = generateNotificationString(giftOwner,"", giftTitle, pageNameNote);

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

  function addGiftToDB(){
    let uid = giftArr.length;
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yy = today.getFullYear();
    let creationDate = mm + "/" + dd + "/" + yy;
    let newURL = verifyURLString(giftLinkInp.value);
    let currentUserScore;
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
      if(!privateListBool) {
        if (user.userScore == null) {
          user.userScore = 0;
        }

        user.userScore = user.userScore + 2;
        currentUserScore = user.userScore;

        firebase.database().ref("users/" + user.uid).update({
          userScore: currentUserScore
        });

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
        deployNotificationModal(false, "Gift Added!", "The gift, " +
          giftTitleInp.value + ", has been successfully added to your gift list! Redirecting " +
          "back to home...", 3, 2);
      } else {
        if (privateUser.userScore == null) {
          privateUser.userScore = 0;
        }

        privateUser.userScore = privateUser.userScore + 4;
        currentUserScore = privateUser.userScore;

        firebase.database().ref("users/" + privateUser.uid).update({
          userScore: currentUserScore
        });
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
          creator: privateUser.userName,
          multiples: multiplePurchases.checked
        });
        sessionStorage.setItem("validGiftUser", JSON.stringify(user));
        deployNotificationModal(false, "Private Gift Added!", "The gift, " +
          giftTitleInp.value + ", has been successfully added to " + user.name + "'s private gift list! Redirecting " +
          "back to their private list...", 3, 10);
      }
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
};
