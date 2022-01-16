/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let friendListElements = [];
let listeningFirebaseRefs = [];
let userArr = [];
let giftArr = [];
let inviteArr = [];
let userUserNames = [];

let readNotificationsBool = false;
let updateGiftToDBBool = false;
let giftListEmptyBool = false;

let dataCounter = 0;
let commonLoadingTimerInt = 0;
let moderationSet = -1;

let giftCreationDate;
let dataListContainer;
let backBtn;
let offlineSpan;
let offlineModal;
let giftUser;
let giftModal;
let giftTitle;
let giftLink;
let giftWhere;
let giftDescription;
let giftBought;
let giftBuy;
let giftDontBuy;
let notificationModal;
let notificationInfo;
let notificationTitle;
let noteSpan;
let listNote;
let inviteNote;
let notificationBtn;
let user;
let offlineTimer;
let commonLoadingTimer;
let userBase;
let userGifts;
let userInvites;
let testData;
let closeGiftModal;



function getCurrentUser(){
  let localConsoleOutput = false;

  try {
    moderationSet = sessionStorage.getItem("moderationSet");
    giftUser = JSON.parse(sessionStorage.validGiftUser);
    user = JSON.parse(sessionStorage.validUser);
    if(user.moderatorInt == 1)
      localConsoleOutput = true;
    if(localConsoleOutput) {
      console.log("User: " + user.userName + " loaded in");
      console.log("Friend: " + giftUser.userName + " loaded in");
    }
    if (giftUser.giftList == undefined) {
      deployListEmptyNotification("No Gifts Found! Your Friend Must Not Have Any Gifts!");
      giftListEmptyBool = true;
    } else if (giftUser.giftList.length == 0) {
      deployListEmptyNotification("No Gifts Found! Your Friend Must Not Have Any Gifts!");
      giftListEmptyBool = true;
    }
    if (user.invites == undefined) {
      if(localConsoleOutput)
        console.log("Invites Not Found");
    } else if (user.invites != undefined) {
      if (user.invites.length > 0) {
        inviteNote.style.background = "#ff3923";
      }
    }
    if (user.friends == undefined) {
      if(localConsoleOutput)
        console.log("Friends Not Found");
    } else if (user.friends != undefined) {
      if (user.friends.length < 100 && user.friends.length > 0) {
        inviteNote.innerHTML = user.friends.length + " Friends";
      }
    }

    if (user.readNotifications == undefined) {
      if(localConsoleOutput)
        console.log("Read Notifications Not Found");
    } else {
      readNotificationsBool = true;
    }

    if (user.notifications == undefined) {
      if(localConsoleOutput)
        console.log("Notifications Not Found");
    } else if (user.notifications != undefined) {
      if (readNotificationsBool){
        if (user.notifications.length > 0 && user.readNotifications.length != user.notifications.length) {
          notificationBtn.src = "img/bellNotificationOn.png";
          notificationBtn.onclick = function() {
            newNavigation(6);//Notifications
          }
        } else {
          notificationBtn.src = "img/bellNotificationOff.png";
          notificationBtn.onclick = function() {
            newNavigation(6);//Notifications
          }
        }
      } else if (user.notifications.length > 0) {
        notificationBtn.src = "img/bellNotificationOn.png";
        notificationBtn.onclick = function() {
          newNavigation(6);//Notifications
        }
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

  pageName = "FriendList";
  notificationBtn = document.getElementById('notificationButton');
  dataListContainer = document.getElementById('dataListContainer');
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  noteSpan = document.getElementById('closeNotification');
  backBtn = document.getElementById('backBtn');
  listNote = document.getElementById('listNote');
  inviteNote = document.getElementById('inviteNote');
  notificationModal = document.getElementById('notificationModal');
  notificationTitle = document.getElementById('notificationTitle');
  notificationInfo = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  giftModal = document.getElementById('giftModal');
  closeGiftModal = document.getElementById('closeGiftModal');
  giftTitle = document.getElementById('giftTitle');
  giftLink = document.getElementById('giftLink');
  giftWhere = document.getElementById('giftWhere');
  giftDescription = document.getElementById('giftDescription');
  giftBought = document.getElementById('giftBought');
  giftCreationDate = document.getElementById('giftCreationDate');
  giftBuy = document.getElementById('giftBuy');
  giftDontBuy = document.getElementById('giftDontBuy');
  testData = document.getElementById('testData');
  friendListElements = [notificationBtn, dataListContainer, offlineModal, offlineSpan, noteSpan, backBtn, listNote,
    inviteNote, notificationModal, notificationTitle, notificationInfo, noteSpan, giftModal, closeGiftModal, giftTitle,
    giftLink, giftWhere, giftDescription, giftBought, giftCreationDate, giftBuy, giftDontBuy, testData];
  getCurrentUser();
  commonInitialization();
  verifyElementIntegrity(friendListElements);

  for(let i = 0; i < userArr.length; i++){
    userUserNames.push(userArr[i].userName);
  }

  backBtn.innerHTML = "Back To Lists";
  backBtn.onclick = function() {
    if(moderationSet == 1){
      newNavigation(14);//Moderation
    } else {
      newNavigation(3);//Lists
    }
  };

  databaseQuery();

  alternateButtonLabel(listNote, "Lists", "Public");

  function databaseQuery() {

    userBase = firebase.database().ref("users/");
    userGifts = firebase.database().ref("users/" + giftUser.uid + "/giftList");
    userInvites = firebase.database().ref("users/" + user.uid + "/invites");

    let fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        let i = findUIDItemInArr(data.key, userArr, true);
        if(userArr[i] != data.val() && i != -1){
          userArr[i] = data.val();
        }

        if(data.key == giftUser.uid){
          giftUser = data.val();
        }
      });

      postRef.on('child_changed', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          if(consoleOutput)
            console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
          userArr[i] = data.val();
        }

        if(data.key == giftUser.uid){
          giftUser = data.val();
          if(consoleOutput)
            console.log("Current User Updated");
        }
      });

      postRef.on('child_removed', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          if(consoleOutput)
            console.log("Removing " + userArr[i].userName + " / " + data.val().userName);
          userArr.splice(i, 1);
        }
      });
    };

    let fetchGifts = function (postRef) {
      postRef.on('child_added', function (data) {
        giftArr.push(data.val());

        if(checkGiftBuyer(data.val().buyer)){
          data.val().buyer = "";
          updateGiftToDBBool = true;
        }

        createGiftElement(data.val().description, data.val().link, data.val().received, data.val().receivedBy,
          data.val().title, data.key, data.val().where, data.val().buyer, data.val().uid, data.val().creationDate,
          data.val().multiples);

        if(updateGiftToDBBool){
          updateGiftError(data, data.key);
          updateGiftToDBBool = false;
        }
      });

      postRef.on('child_changed', function(data) {
        giftArr[data.key] = data.val();

        if(data.val().uid == currentModalOpen){
          closeModal(giftModal);
        }

        changeGiftElement(data.val().description, data.val().link, data.val().received, data.val().receivedBy,
          data.val().title, data.key, data.val().where, data.val().buyer, data.val().uid, data.val().creationDate,
          data.val().multiples);
      });

      postRef.on('child_removed', function(data) {
        sessionStorage.setItem("validGiftUser", JSON.stringify(giftUser));
        sessionStorage.setItem("validUser", JSON.stringify(user));
        location.reload();
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

    fetchData(userBase);
    fetchGifts(userGifts);
    fetchInvites(userInvites);

    listeningFirebaseRefs.push(userBase);
    listeningFirebaseRefs.push(userGifts);
    listeningFirebaseRefs.push(userInvites);
  }

  function checkGiftBuyer(buyer){
    let updateGiftToDB = true;

    if(consoleOutput)
      console.log("Checking for buyer error...");

    if(buyer == "" || buyer == null || buyer == undefined || userUserNames.includes(buyer)){
      updateGiftToDB = false;
      if(consoleOutput)
        console.log("No buyer error");
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

  function createGiftElement(giftDescription, giftLink, giftReceived, giftReceivedBy, giftTitle, giftKey, giftWhere,
                             giftBuyer, giftUid, giftDate, giftMultiples){
    if(consoleOutput)
      console.log("Creating " + giftUid);
    try{
      testData.remove();
    } catch (err) {}


    let liItem = document.createElement("LI");
    liItem.id = "gift" + giftUid;
    initGiftElement(liItem, giftDescription, giftLink, giftReceived, giftReceivedBy, giftTitle, giftKey, giftWhere,
      giftBuyer, giftUid, giftDate, giftMultiples);
    let textNode = document.createTextNode(giftTitle);
    liItem.appendChild(textNode);
    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
    clearInterval(commonLoadingTimer);
    clearInterval(offlineTimer);
    dataCounter++;
  }

  function changeGiftElement(description, link, received, receivedBy, title, key, where, buyer, uid, date, multiples) {
    let editGift = document.getElementById('gift' + uid);
    editGift.innerHTML = title;
    initGiftElement(editGift, description, link, received, receivedBy, title, key, where, buyer, uid, date, multiples);
  }

  function initGiftElement(liItem, giftDescriptionData, giftLinkData, giftReceivedData, giftReceivedBy, giftTitleData, giftKey,
                           giftWhereData, giftBuyer, giftUid, giftDate, giftMultiples) {
    let multipleBool = false;

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
      if (giftReceivedBy == undefined) {
        giftReceivedBy = [];
      }

      if (giftMultiples != undefined) {
        multipleBool = giftMultiples;
      }

      giftTitle.innerHTML = giftTitleData;

      if (giftLinkData != "") {
        giftLink.innerHTML = "Click me to go to the webpage!";
        giftLink.onclick = function() {
          giftLinkRedirect(giftLinkData);
        };
      } else {
        giftLink.innerHTML = "There was no link provided";
        giftLink.onclick = function() {};
      }
      if(giftDescriptionData != "") {
        giftDescription.innerHTML = "Description: " + giftDescriptionData;
      } else {
        giftDescription.innerHTML = "There was no description provided";
      }
      if(giftWhereData != "") {
        giftWhere.innerHTML = "This can be found at: " + giftWhereData;
      } else {
        giftWhere.innerHTML = "There was no location provided";
      }
      if(giftReceivedData == 1){
        if(giftBuyer == undefined){
          giftBought.innerHTML = "This gift has been bought";
        } else {
          giftBought.innerHTML = "This gift was bought by " + giftBuyer;
        }
      } else {
        if (giftMultiples == undefined || giftReceivedData == 0) {
          giftBought.innerHTML = "This gift has not been bought yet";
        } else {
          let userBought = giftReceivedBy.indexOf(user.uid);
          if (userBought == -1) {
            if (giftReceivedBy.length == 1)
              giftBought.innerHTML = "This gift was bought by " + giftReceivedBy.length + " person!";
            else
              giftBought.innerHTML = "This gift was bought by " + giftReceivedBy.length + " people!";
          } else {
            if (giftReceivedBy.length == 1)
              giftBought.innerHTML = "This gift was bought by you!";
            else
              giftBought.innerHTML = "This gift was bought by " + giftReceivedBy.length + " people... Including you!";
          }
        }
      }
      if(giftDate != undefined) {
        if (giftDate != "") {
          giftCreationDate.innerHTML = "Created on: " + giftDate;
        } else {
          giftCreationDate.innerHTML = "Creation date not available";
        }
      } else {
        giftCreationDate.innerHTML = "Creation date not available";
      }
      giftBuy.onclick = function(){
        if (!multipleBool) {
          if (giftReceivedData == 0) {
            firebase.database().ref("users/" + giftUser.uid + "/giftList/" + giftKey).update({
              received: 1,
              buyer: user.userName
            });
          } else {
            alert("This gift has already been marked as bought!");
          }
        } else {
          if (giftReceivedBy.indexOf(user.uid) == -1) {
            giftReceivedBy.push(user.uid);
            giftReceivedData = giftReceivedData - 1;
            firebase.database().ref("users/" + giftUser.uid + "/giftList/" + giftKey).update({
              received: giftReceivedData,
              receivedBy: giftReceivedBy
            });
          } else {
            alert("You can only buy this gift once!");
          }
        }
      };
      giftDontBuy.onclick = function(){
        if (!multipleBool) {
          if (giftReceivedData == 1) {
            if (giftBuyer == user.userName || giftBuyer == "") {
              firebase.database().ref("users/" + giftUser.uid + "/giftList/" + giftKey).update({
                received: 0,
                buyer: ""
              });
            } else {
              alert("Only the buyer, " + giftBuyer + ", can \"Un-Buy\" this gift. Please contact them to undo this action " +
                "if this has been done in error.");
            }
          } else {
            alert("This gift has already been marked as \"Un-Bought\"!");
          }
        } else {
          let userBought = giftReceivedBy.indexOf(user.uid);
          if (userBought != -1) {
            giftReceivedBy.splice(userBought, 1);
            giftReceivedData = giftReceivedData + 1;
            firebase.database().ref("users/" + giftUser.uid + "/giftList/" + giftKey).update({
              received: giftReceivedData,
              receivedBy: giftReceivedBy
            });
          } else {
            alert("You haven't bought this gift!");
          }
        }
      };

      openModal(giftModal, giftUid);

      closeGiftModal.onclick = function() {
        closeModal(giftModal);
      };
    };
  }

  function removeGiftElement(uid) {
    document.getElementById('gift' + uid).remove();

    dataCounter--;
    if (dataCounter == 0){
      deployListEmptyNotification("No Gifts Found! Your Friend Must Not Have Any Gifts!");
    }
  }
};
