/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let friendListElements = [];
let listeningFirebaseRefs = [];
let userArr = [];
let giftArr = [];
let oldGiftArr = [];
let inviteArr = [];
let userUserNames = [];
let initializedGifts = [];

let updateGiftToDBBool = false;
let giftListEmptyBool = false;
let potentialRemoval = false;
let giftUpdateLocal = false;

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
  getCurrentUserCommon();

  moderationSet = sessionStorage.getItem("moderationSet");
  giftUser = JSON.parse(sessionStorage.validGiftUser);

  if(consoleOutput)
    console.log("Friend: " + giftUser.userName + " loaded in");

  if (giftUser.giftList == undefined) {
    deployListEmptyNotification("No Gifts Found! Your Friend Must Not Have Any Gifts!");
    giftListEmptyBool = true;
  } else if (giftUser.giftList.length == 0) {
    deployListEmptyNotification("No Gifts Found! Your Friend Must Not Have Any Gifts!");
    giftListEmptyBool = true;
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

  userBase = firebase.database().ref("users/");
  userGifts = firebase.database().ref("users/" + giftUser.uid + "/giftList");
  userInvites = firebase.database().ref("users/" + user.uid + "/invites");

  databaseQuery();
  alternateButtonLabel(listNote, "Gift Lists", "Public");

  for(let i = 0; i < userArr.length; i++){
    userUserNames.push(userArr[i].userName);
  }

  function initializeSwapBtn() {
    swapList.innerHTML = "View " + giftUser.name + "'s <br/>Private List";
    swapList.onclick = function () {
      sessionStorage.setItem("validGiftUser", JSON.stringify(giftUser));
      navigation(10);
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
      postRef.on('child_added', function (data) {
        let i = findUIDItemInArr(data.key, userArr, true);
        if(userArr[i] != data.val() && i != -1){
          userArr[i] = data.val();
        } else {
          userArr.push(data.val());
        }

        if(data.key == giftUser.uid){
          giftUser = data.val();
        }
      });

      postRef.on('child_changed', function (data) {
        let i = findUIDItemInArr(data.key, userArr, true);
        if(userArr[i] != data.val() && i != -1){
          if(consoleOutput)
            console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
          userArr[i] = data.val();
        }

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
          updateFriendNav(user.friends);
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

        createGiftElement(data.val(), data.key);

        if(updateGiftToDBBool){
          updateGiftError(data, data.key);
          updateGiftToDBBool = false;
        }
      });

      postRef.on('child_changed', function(data) {
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
        }
      });

      postRef.on('child_removed', function(data) {
        potentialRemoval = true;
        oldGiftArr = [];
        for (let i = 0; i < giftArr.length; i++) {
          oldGiftArr.push(giftArr[i]);
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

    fetchData(userBase);
    fetchGifts(userGifts);
    fetchInvites(userInvites);

    listeningFirebaseRefs.push(userBase);
    listeningFirebaseRefs.push(userGifts);
    listeningFirebaseRefs.push(userInvites);
  }

  function findRemovedGift(oldArr, newArr) {
    let removedGiftIndex = -1;

    removedGiftIndex = findRemovedData(oldArr, newArr);
    if (removedGiftIndex != -1) {
      removeGiftElement(oldArr[removedGiftIndex].uid);
      let i = initializedGifts.indexOf(oldArr[removedGiftIndex].uid);
      initializedGifts.splice(i, 1);
      if (oldArr[removedGiftIndex].uid == currentModalOpen) {
        closeModal(giftModal);
        if (!giftUpdateLocal) {
          deployNotificationModal(false, "Gift Deleted!", "The gift you were viewing " +
              "was deleted by " + giftUser.name + "! This gift is no longer available to view...", 4);
        }
      }
      oldGiftArr.splice(removedGiftIndex, 1);
    }
  }

  function checkGiftBuyer(buyer){
    let updateGiftToDB = true;

    if(buyer == "" || buyer == null || buyer == undefined || userUserNames.includes(buyer)){
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

    try{
      document.getElementById('testData').remove();
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
  }

  function changeGiftElement(giftData, giftKey) {
    let uid = giftData.uid;
    let title = giftData.title;
    let editGift = document.getElementById('gift' + uid);
    editGift.innerHTML = title;
    initGiftElement(editGift, giftData, giftKey);
  }

  function initGiftElement(liItem, giftData, giftKey) {
    let multipleBool = false;
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
        buyGiftToDB(giftKey, giftMultiples, giftReceivedData, giftReceivedBy, false);
      };
      giftDontBuy.onclick = function(){
        buyGiftToDB(giftKey, giftMultiples, giftReceivedData, giftReceivedBy, true, giftBuyer);
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

  function buyGiftToDB(key, multiples, received, receivedBy, unBuyBool, buyer) {
    let multipleBool = false;
    let updateToDB = false;
    let buyerUserName = "!!!";
    let buyerData;
    giftUpdateLocal = true;

    if (buyer != undefined)
      buyerUserName = buyer;

    if (multiples != undefined)
      multipleBool = multiples;

    if (!multipleBool) {
      if (!unBuyBool && received == 0) {
        received = 1;
        buyerData = user.userName;
        updateToDB = true;
      } else if (unBuyBool && received == 1 && (buyerUserName == user.userName || buyerUserName == "")) {
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

    }

    giftUpdateLocal = false;
  }
};
