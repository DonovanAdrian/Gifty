/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

var giftAddUpdateElements = [];
var listeningFirebaseRefs = [];
var giftArr = [];

var giftPresent = true;
var privateListBool = true;
var invalidURLBool = false;
var invalidURLOverride = false;

var invalidURL = "";

var giftUID = -1;

var giftStorage;
var privateList;
var offlineSpan;
var offlineModal;
var user;
var privateUser;
var giftDescriptionInp;
var giftTitleInp;
var giftWhereInp;
var giftLinkInp;
var updateGift;
var homeNote;
var listNote;
var inviteNote;
var currentGift;
var userGifts;
var notificationModal;
var notificationInfo;
var notificationTitle;
var noteSpan;



function getCurrentUser(){
  try {
    user = JSON.parse(sessionStorage.validUser);
    privateList = JSON.parse(sessionStorage.privateList);
    if(privateList == null || privateList == undefined || privateList == "") {
      privateListBool = false;
      console.log("User: " + user.userName + " loaded in");
    } else {
      privateUser = JSON.parse(sessionStorage.validPrivateUser);
      homeNote.className = "";
      listNote.className = "active";
      console.log("User: " + privateUser.userName + " loaded in");
      console.log("Friend: " + user.userName + " loaded in");
    }
    giftStorage = JSON.parse(sessionStorage.giftStorage);
    if (giftStorage == null || giftStorage == undefined || giftStorage == "") {
      giftPresent = false;
    } else {
      console.log("Gift: " + giftStorage + " found");
    }
    if (!privateListBool)
      if (user.invites == undefined) {
        console.log("Invites Not Found");
      } else if (user.invites != undefined) {
        if (user.invites.length > 0) {
          inviteNote.style.background = "#ff3923";
        }
      }
    else
      if (user.invites == undefined) {
        console.log("Invites Not Found");
      } else if (user.invites != undefined) {
        if (user.invites.length > 0) {
          inviteNote.style.background = "#ff3923";
        }
      }
    userArr = JSON.parse(sessionStorage.userArr);
  } catch (err) {
    console.log(err.toString());
    window.location.href = "index.html";
  }
}

//Instantiates all data upon loading the webpage
window.onload = function instantiate() {

  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById("closeOffline");
  giftDescriptionInp = document.getElementById('giftDescriptionInp');
  giftTitleInp = document.getElementById('giftTitleInp');
  giftWhereInp = document.getElementById('giftWhereInp');
  giftLinkInp = document.getElementById('giftLinkInp');
  updateGift = document.getElementById('updateGift');
  homeNote = document.getElementById('homeNote');
  listNote = document.getElementById('listNote');
  inviteNote = document.getElementById('inviteNote');
  notificationModal = document.getElementById('notificationModal');
  notificationTitle = document.getElementById('notificationTitle');
  notificationInfo = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  giftAddUpdateElements = [offlineModal, offlineSpan, giftDescriptionInp, giftTitleInp, giftWhereInp, giftLinkInp,
    updateGift, homeNote, listNote, inviteNote, notificationModal, notificationTitle, notificationInfo, noteSpan];
  verifyElementIntegrity(giftAddUpdateElements);
  getCurrentUser();
  commonInitialization();

  if(giftPresent) {
    updateGift.innerHTML = "Update Gift";
    updateGift.onclick = function() {
      updateGiftToDB();
    }
  } else {
    updateGift.innerHTML = "Add New Gift";
    updateGift.onclick = function() {
      addGiftToDB();
    }
  }

  databaseQuery();

  function databaseQuery() {

    if(!privateListBool) {
      userGifts = firebase.database().ref("users/" + user.uid + "/giftList/");
    } else {
      try{
        userGifts = firebase.database().ref("users/" + privateList.uid + "/privateList/");
      } catch (err) {
        console.log("Unable to connect to private list");
      }
    }

    var fetchData = function (postRef) {
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
    }
  }

  function getGift() {
    if(!privateListBool) {
      for (var i = 0; i < user.giftList.length; i++) {
        if (user.giftList[i].uid == giftStorage) {
          currentGift = user.giftList[i];
          break;
        }
      }
    } else {
      for (var i = 0; i < user.privateList.length; i++) {
        if (privateList.privateList[i].uid == giftStorage) {
          currentGift = privateList.privateList[i];
          break;
        }
      }
    }
  }

  function updateGiftToDB(){
    var newURL = verifyURLString(giftLinkInp.value);

    if(giftTitleInp.value === "")
      alert("It looks like you left the title blank. Make sure you add a title so other people know what to get " +
        "you!");
    else if (invalidURLBool)
      alert("It looks like you entered an invalid URL, please enter a valid URL or leave the field blank.");
    else {
      if(giftUID != -1) {
        if (!privateListBool) {
          firebase.database().ref("users/" + user.uid + "/giftList/" + giftUID).update({
            title: giftTitleInp.value,
            link: newURL,
            where: giftWhereInp.value,
            received: currentGift.received,
            uid: giftStorage,
            buyer: currentGift.buyer,
            description: giftDescriptionInp.value,
            creationDate: ""
          });
          if (currentGift.creationDate != undefined) {
            if (currentGift.creationDate != "") {
              firebase.database().ref("users/" + user.uid + "/giftList/" + giftUID).update({
                creationDate: currentGift.creationDate
              });
            }
          }

          newNavigation(2);//Home
        } else {
          firebase.database().ref("users/" + privateList.uid + "/privateList/" + giftUID).update({
            title: giftTitleInp.value,
            link: newURL,
            where: giftWhereInp.value,
            received: currentGift.received,
            uid: giftStorage,
            buyer: currentGift.buyer,
            description: giftDescriptionInp.value
          });
          if (currentGift.creationDate != undefined) {
            if (currentGift.creationDate != "") {
              firebase.database().ref("users/" + privateList.uid + "/privateList/" + giftUID).update({
                creationDate: currentGift.creationDate
              });
            }
          }
          if (currentGift.creator != undefined) {
            if (currentGift.creator != "") {
              firebase.database().ref("users/" + privateList.uid + "/privateList/" + giftUID).update({
                creator: currentGift.creator
              });
            }
          }

          sessionStorage.setItem("validGiftUser", JSON.stringify(user));
          newNavigation(10);//PrivateFriendList
        }

        if(currentGift.buyer != ""){
          var userFound = findUserNameItemInArr(currentGift.buyer, userArr);
          if(userFound != -1){
            if(privateListBool){
              if (userArr[userFound].uid != privateUser.uid) {
                addNotificationToDB(userArr[userFound], currentGift.title);
              }
            } else {
              console.log(user.uid);
              if (userArr[userFound].uid != user.uid) {
                addNotificationToDB(userArr[userFound], currentGift.title);
              }
            }
          } else {
            console.log("User not found");
          }
        } else {
          console.log("No buyer, no notification needed");
        }
      } else {
        alert("There was an error updating the gift, please try again!");
        console.log(giftUID);
      }
    }
    invalidURLBool = false;
  }

  function findUserNameItemInArr(item, userArray){
    for(var i = 0; i < userArray.length; i++){
      if(userArray[i].userName == item){
        console.log("Found item: " + item);
        return i;
      }
    }
    return -1;
  }

  function addNotificationToDB(buyerUserData, giftTitle){
    var pageName = "friendList.html";
    var giftOwner = user.uid;
    if(privateListBool){
      pageName = "privateFriendList.html";
      giftOwner = privateList.uid;
    }
    var notificationString = generateNotificationString(giftOwner, giftTitle, pageName);
    var buyerUserNotifications;
    if(buyerUserData.notifications == undefined){
      buyerUserNotifications = [];
    } else {
      buyerUserNotifications = buyerUserData.notifications;
    }
    buyerUserNotifications.push(notificationString);

    if(buyerUserData.notifications != undefined) {
      firebase.database().ref("users/" + buyerUserData.uid).update({
        notifications: buyerUserNotifications
      });
      console.log("Added New Notification To DB");
    } else {
      console.log("New Notifications List");
      firebase.database().ref("users/" + buyerUserData.uid).update({notifications:{0:notificationString}});
      console.log("Added Notification To DB");
    }
  }

  function generateNotificationString(giftOwner, giftTitle, pageName){
    console.log("Generating Notification");
    return (giftOwner + "," + giftTitle + "," + pageName);
  }

  function addGiftToDB(){
    var uid = giftArr.length;
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yy = today.getFullYear();
    var creationDate = mm + "/" + dd + "/" + yy;
    var newURL = verifyURLString(giftLinkInp.value);

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
        var newUid = firebase.database().ref("users/" + user.uid + "/giftList/" + uid).push();
        newUid = newUid.toString();
        newUid = newUid.substr(77, 96);
        firebase.database().ref("users/" + user.uid + "/giftList/" + uid).set({
          title: giftTitleInp.value,
          link: newURL,
          where: giftWhereInp.value,
          received: 0,
          uid: newUid,
          buyer: "",
          description: giftDescriptionInp.value,
          creationDate: creationDate
        });

        newNavigation(2);//Home
      } else {

        var newUid = firebase.database().ref("users/" + user.uid + "/privateList/" + uid).push();
        newUid = newUid.toString();
        newUid = newUid.substr(80, 96);
        firebase.database().ref("users/" + user.uid + "/privateList/" + uid).set({
          title: giftTitleInp.value,
          link: newURL,
          where: giftWhereInp.value,
          received: 0,
          uid: newUid,
          buyer: "",
          description: giftDescriptionInp.value,
          creationDate: creationDate,
          creator: privateUser.userName
        });
        sessionStorage.setItem("validGiftUser", JSON.stringify(user));
        newNavigation(10);//PrivateFriendList
      }
    }
    invalidURLBool = false;
  }

  function verifyURLString(url){
    var urlBuilder = "";
    var tempURL = "";
    var failedURLs = [];
    var isChar = false;
    var preDot = false;
    var dotBool = false;
    var dotDuplicate = false;
    var postDot = false;
    var validURLBool = false;
    var validURLOverride = true;
    var invalidChar = false;
    var dotEnder = false;

    for(var i = 0; i < url.length; i++){
      if (url.charAt(i) == " ") {
        failedURLs.push(urlBuilder);
        urlBuilder = "";
      } else
        urlBuilder += url.charAt(i);
    }
    failedURLs.push(urlBuilder);

    for (var a = 0; a < failedURLs.length; a++) {
      for (var b = 0; b < failedURLs[a].length; b++) {
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
