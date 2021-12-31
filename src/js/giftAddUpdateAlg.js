/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let giftAddUpdateElements = [];
let listeningFirebaseRefs = [];
let giftArr = [];

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
let notificationModal;
let notificationInfo;
let notificationTitle;
let noteSpan;



function getCurrentUser(){
  let localConsoleOutput = false;

  try {
    user = JSON.parse(sessionStorage.validUser);
    privateList = JSON.parse(sessionStorage.privateList);
    if(privateList == null || privateList == undefined || privateList == "") {
      privateListBool = false;
      if(user.moderatorInt == 1)
        localConsoleOutput = true;
      if(localConsoleOutput)
        console.log("User: " + user.userName + " loaded in");
      buttonText = "Back To Home";
      giftNavigationInt = 2;
    } else {
      privateUser = JSON.parse(sessionStorage.validPrivateUser);
      homeNote.className = "";
      listNote.className = "active";
      if(privateUser.moderatorInt == 1)
        localConsoleOutput = true;
      if(localConsoleOutput) {
        console.log("User: " + privateUser.userName + " loaded in");
        console.log("Friend: " + user.userName + " loaded in");
      }
      buttonText = "Back To Private List";
      giftNavigationInt = 10;
    }
    giftStorage = JSON.parse(sessionStorage.giftStorage);
    if (giftStorage == null || giftStorage == undefined || giftStorage == "") {
      giftPresent = false;
    } else {
      if(localConsoleOutput)
        console.log("Gift: " + giftStorage + " found");
    }
    if (!privateListBool)
      if (user.invites == undefined) {
        if(localConsoleOutput)
          console.log("Invites Not Found");
      } else if (user.invites != undefined) {
        if (user.invites.length > 0) {
          inviteNote.style.background = "#ff3923";
        }
      }
      else
      if (user.invites == undefined) {
        if(localConsoleOutput)
          console.log("Invites Not Found");
      } else if (user.invites != undefined) {
        if (user.invites.length > 0) {
          inviteNote.style.background = "#ff3923";
        }
      }
    userArr = JSON.parse(sessionStorage.userArr);
  } catch (err) {
    if(localConsoleOutput)
      console.log(err.toString());
    window.location.href = "index.html";
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

  function initializeBackBtn() {
    backBtn.innerHTML = buttonText;

    backBtn.onclick = function() {
      newNavigation(giftNavigationInt);
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
      }
    }
  }

  initializeBackBtn();

  initializeGiftAddBtn();

  databaseQuery();

  function databaseQuery() {

    if(!privateListBool) {
      userGifts = firebase.database().ref("users/" + user.uid + "/giftList/");
    } else {
      try{
        userGifts = firebase.database().ref("users/" + privateList.uid + "/privateList/");
      } catch (err) {
        if(consoleOutput)
          console.log("Unable to connect to private list");
      }
    }

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
        location.reload();
      });

    };

    fetchData(userGifts);

    listeningFirebaseRefs.push(userGifts);
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

  function updateGiftToDB(){
    let newURL = verifyURLString(giftLinkInp.value);
    let clearReceivedByBool = false;

    if(giftTitleInp.value === "")
      alert("It looks like you left the title blank. Make sure you add a title so other people know what to get " +
        "you!");
    else if (invalidURLBool)
      alert("It looks like you entered an invalid URL, please enter a valid URL or leave the field blank.");
    else {
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

          newNavigation(2);//Home
        } else {
          if (!multiplePurchases.checked && currentGift.multiples && currentGift.receivedBy.length != undefined) {
            if (currentGift.receivedBy.length != 0) {
              let userFound;
              for (let i = 0; i < currentGift.receivedBy.length; i++) {
                userFound = findUIDItemInArr(currentGift.receivedBy[i], userArr);
                if (userFound != -1)
                  addNotificationToDB(userArr[userFound], currentGift.title);
              }

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

          sessionStorage.setItem("validGiftUser", JSON.stringify(user));
          newNavigation(10);//PrivateFriendList
        }

        if(currentGift.buyer != ""){
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
        } else {
          if(consoleOutput)
            console.log("No buyer, no notification needed");
        }
      } else {
        alert("There was an error updating the gift, please try again!");
        if(consoleOutput)
          console.log(giftUID);
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

    notificationString = generateNotificationString(giftOwner, giftTitle, pageNameNote);

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

  function generateNotificationString(giftOwner, giftTitle, pageNameNote){
    if(consoleOutput)
      console.log("Generating Notification");
    return (giftOwner + "," + giftTitle + "," + pageNameNote);
  }

  function addGiftToDB(){
    let uid = giftArr.length;
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yy = today.getFullYear();
    let creationDate = mm + "/" + dd + "/" + yy;
    let newURL = verifyURLString(giftLinkInp.value);
    let currentUserScore = 0;

    if (user.userScore == null) {
      user.userScore = 0;
    }

    user.userScore = user.userScore + 2;

    if(!privateListBool) {
      currentUserScore = user.userScore + 2
      user.userScore = user.userScore + 2;
    }

    if(invalidURL != newURL)
      invalidURLOverride = false;
    if(giftTitleInp.value === "")
      alert("It looks like you left the title blank. Make sure you add a title so other people know what to get " +
        "you!");
    else if (invalidURLBool && !invalidURLOverride) {
      alert("It looks like you might have entered an invalid URL, double check to see if your url is valid and " +
        "try again.");
      invalidURLOverride = true;
      invalidURL = newURL;
    } else {
      if(!privateListBool) {
        let newUid = firebase.database().ref("users/" + user.uid + "/giftList/" + uid).push();
        newUid = newUid.toString();
        newUid = findUIDInString(newUid);
        firebase.database().ref("users/" + user.uid + "/giftList/" + uid).set({
          title: giftTitleInp.value,
          link: newURL,
          where: giftWhereInp.value,
          received: 0,
          uid: newUid,
          userScore: currentUserScore,
          buyer: "",
          description: giftDescriptionInp.value,
          creationDate: creationDate,
          multiples: multiplePurchases.checked
        });

        newNavigation(2);//Home
      } else {

        let newUid = firebase.database().ref("users/" + user.uid + "/privateList/" + uid).push();
        newUid = newUid.toString();
        newUid = findUIDInString(newUid);
        firebase.database().ref("users/" + user.uid + "/privateList/" + uid).set({
          title: giftTitleInp.value,
          link: newURL,
          where: giftWhereInp.value,
          received: 0,
          uid: newUid,
          userScore: currentUserScore,
          buyer: "",
          description: giftDescriptionInp.value,
          creationDate: creationDate,
          creator: privateUser.userName,
          multiples: multiplePurchases.checked
        });
        sessionStorage.setItem("validGiftUser", JSON.stringify(user));
        newNavigation(10);//PrivateFriendList
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
