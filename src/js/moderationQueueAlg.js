/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let moderationQueueElements = [];
let listeningFirebaseRefs = [];
let inviteArr = [];
let userArr = [];

let moderationSet = 1;
let dataCounter = 0;
let loadingTimerInt = 0;

let dataListContainer;
let nukeTickets;
let ticketModal;
let closeTicketModal;
let ticketTitle;
let ticketUID;
let ticketDetails;
let ticketLocation;
let ticketTime;
let deleteTicket;
let offlineSpan;
let offlineModal;
let user;
let offlineTimer;
let loadingTimer;
let notificationModal;
let notificationInfo;
let notificationTitle;
let noteSpan;
let inviteNote;
let userInitial;
let userInvites;
let moderationTickets;
let testData;
let userName;



function getCurrentUser(){
  try {
    user = JSON.parse(sessionStorage.validUser);
    console.log("User: " + user.userName + " loaded in");
    if (user.invites == undefined) {
      console.log("Invites Not Found");
    } else if (user.invites != undefined) {
      if (user.invites.length > 0) {
        inviteNote.style.background = "#ff3923";
      }
    }

    if (user.moderatorInt == 0){
      window.location.href = "home.html";
    }
    userArr = JSON.parse(sessionStorage.userArr);
    sessionStorage.setItem("moderationSet", moderationSet);
  } catch (err) {
    console.log(err.toString());
    window.location.href = "index.html";
  }
}

window.onload = function instantiate() {
  dataListContainer = document.getElementById('dataListContainer');
  nukeTickets = document.getElementById('nukeTickets');
  ticketModal = document.getElementById('ticketModal');
  closeTicketModal = document.getElementById('closeTicketModal');
  ticketTitle = document.getElementById('ticketTitle');
  ticketUID = document.getElementById('ticketUID');
  ticketDetails = document.getElementById('ticketDetails');
  ticketLocation = document.getElementById('ticketLocation');
  ticketTime = document.getElementById('ticketTime');
  deleteTicket = document.getElementById('deleteTicket');
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  inviteNote = document.getElementById('inviteNote');
  notificationModal = document.getElementById('notificationModal');
  notificationTitle = document.getElementById('notificationTitle');
  notificationInfo = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  testData = document.getElementById('testData');
  moderationQueueElements = [dataListContainer, nukeTickets, ticketModal, closeTicketModal, ticketTitle, ticketUID,
    ticketDetails, ticketLocation, ticketTime, deleteTicket, offlineModal, offlineSpan, inviteNote, notificationModal,
    notificationTitle, notificationInfo, noteSpan, testData];
  getCurrentUser();
  commonInitialization();
  verifyElementIntegrity(moderationQueueElements);

  loadingTimer = setInterval(function(){
    loadingTimerInt = loadingTimerInt + 1000;
    if(loadingTimerInt >= 2000){
      if (testData == undefined){
        console.log("TestData Missing. Loading Properly.");
      } else {
        testData.innerHTML = "Loading... Please Wait...";
      }
      clearInterval(loadingTimer);
    }
  }, 1000);

  databaseQuery();

  alternateButtonLabel(settingsNote, "Settings", "Moderation");

  function databaseQuery() {

    userInitial = firebase.database().ref("users/");
    userInvites = firebase.database().ref("users/" + user.uid + "/invites");
    moderationTickets = firebase.database().ref("maintenance/");

    let fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          console.log("Adding " + userArr[i].userName + " to most updated version: " + data.val().userName);
          userArr[i] = data.val();
        }

        if(data.key == user.uid){
          user = data.val();
          console.log("User Updated: 1");
        }
      });

      postRef.on('child_changed', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
          userArr[i] = data.val();
        }

        if(data.key == user.uid){
          user = data.val();
          console.log("User Updated: 2");
        }
      });

      postRef.on('child_removed', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1){
          console.log("Removing " + userArr[i].userName + " / " + data.val().userName);
          userArr.splice(i, 1);
        }
      });
    };

    let fetchInvites = function (postRef) {
      postRef.on('child_added', function (data) {
        inviteArr.push(data.val());

        inviteNote.style.background = "#ff3923";
      });

      postRef.on('child_changed', function (data) {
        console.log(inviteArr);
        inviteArr[data.key] = data.val();
        console.log(inviteArr);
      });

      postRef.on('child_removed', function (data) {
        console.log(inviteArr);
        inviteArr.splice(data.key, 1);
        console.log(inviteArr);

        if (inviteArr.length == 0) {
          console.log("Invite List Removed");
          inviteNote.style.background = "#008222";
        }
      });
    };

    let fetchModerationQueue = function (postRef) {
      postRef.once("value").then(function(snapshot) {
        if (snapshot.exists()) {
          postRef.on("child_added", function (data) {
            console.log(data.key + " Added!");
            createModerationTicket(data.val());
          });

          postRef.on("child_changed", function (data) {
            console.log(data.key + " Changed!");
            changeModerationTicket(data.val());
          });

          postRef.on("child_removed", function (data) {
            console.log(data.key + " Removed!");
            removeModerationTicket(data.val());
          });
        } else {
          deployListEmptyNotification("There Are No Items In The Moderation Queue!");
        }
      });
    };

    fetchData(userInitial);
    fetchInvites(userInvites);
    fetchModerationQueue(moderationTickets);

    listeningFirebaseRefs.push(userInitial);
    listeningFirebaseRefs.push(userInvites);
    listeningFirebaseRefs.push(moderationTickets);
  }

  function createModerationTicket (ticketData) {
    let ticketTitleText = "";
    try {
      testData.remove();
    } catch (err) {}

    let liItem = document.createElement("LI");
    liItem.id = "ticket" + ticketData.uid;
    liItem.className = "gift";
    if (ticketData.details.includes("Attempting to delete user")) {
      liItem.className += " highSev";
      ticketTitleText = "Attempt To Delete User";
    } else if (ticketData.details.includes("Invalid Login")) {
      liItem.className += " highSev";
      ticketTitleText = "Invalid Login Attempt";
    } else if (ticketData.details.includes("Attempting to delete gift")) {
      liItem.className += " mediumSev";
      ticketTitleText = "Attempt To Delete Gift";
    } else if (ticketData.details.includes("Attempting to update gift")) {
      liItem.className += " lowSev";
      ticketTitleText = "Attempt To Update Gift";
    } else {
      liItem.className += " highSev";
      ticketTitleText = "No Data Available!";
    }

    liItem.onclick = function (){
      ticketTitle.innerHTML = ticketTitleText;
      ticketDetails.innerHTML = ticketData.details;
      ticketUID.innerHTML = "UID: " + ticketData.uid;
      ticketTime.innerHTML = "Time: " + ticketData.time;
      if (ticketData.location == "index") {
        ticketLocation.innerHTML = "Location: login/index";
      } else {
        ticketLocation.innerHTML = "Location: " + ticketData.location;
      }

      deleteTicket.onclick = function () {
        deleteModerationTicket(ticketData);
      };

      //show modal
      openModal(ticketModal, ticketData.uid);

      //close on close
      closeTicketModal.onclick = function() {
        closeModal(ticketModal);
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == ticketModal) {
          closeModal(ticketModal);
        }
      };
    };
    let textNode = document.createTextNode(ticketTitleText);
    liItem.appendChild(textNode);

    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
    clearInterval(offlineTimer);

    dataCounter++;
    if (dataCounter > 5) {
      nukeTickets.style.opacity = ".75";
    }
  }

  function changeModerationTicket (ticketData) {
    let ticketTitleText = "";
    let editTicket = document.getElementById('ticket' + ticketData.uid);
    editTicket.className = "gift";
    if (ticketData.details.includes("Attempting to delete user")) {
      editTicket.className += " highSev";
      ticketTitleText = "Attempt To Delete User";
    } else if (ticketData.details.includes("Invalid Login")) {
      editTicket.className += " highSev";
      ticketTitleText = "Invalid Login Attempt";
    } else if (ticketData.details.includes("Attempting to delete gift")) {
      editTicket.className += " mediumSev";
      ticketTitleText = "Attempt To Delete Gift";
    } else if (ticketData.details.includes("Attempting to update gift")) {
      editTicket.className += " lowSev";
      ticketTitleText = "Attempt To Update Gift";
    } else {
      editTicket.className += " highSev";
      ticketTitleText = "No Data Available!";
    }
    editTicket.innerHTML = ticketTitleText;

    liItem.onclick = function (){
      ticketTitle.innerHTML = ticketTitleText;
      ticketDetails.innerHTML = ticketData.details;
      ticketUID.innerHTML = "UID: " + ticketData.uid;
      ticketTime.innerHTML = "Time: " + ticketData.time;
      if (ticketData.location == "index") {
        ticketLocation.innerHTML = "Location: login/index";
      } else {
        ticketLocation.innerHTML = "Location: " + ticketData.location;
      }

      deleteTicket.onclick = function () {
        deleteModerationTicket(ticketData);
      };

      //show modal
      openModal(ticketModal, ticketData.uid);

      //close on close
      closeTicketModal.onclick = function() {
        closeModal(ticketModal);
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == ticketModal) {
          closeModal(ticketModal);
        }
      };
    };
  }

  function deleteModerationTicket (ticketData) {
    /*
    let verifyDeleteBool = true;
    let toDelete = -1;

    for (let i = 0; i < giftArr.length; i++){
      if(title == giftArr[i].title) {
        toDelete = i;
        break;
      }
    }

    if(toDelete != -1) {
      giftArr.splice(toDelete, 1);

      for (let i = 0; i < giftArr.length; i++) {
        if (title == giftArr[i].title) {
          verifyDeleteBool = false;
          break;
        }
      }
    } else {
      verifyDeleteBool = false;
    }

    if(verifyDeleteBool){
      removeGiftElement(uid);
      firebase.database().ref("users/" + user.uid).update({
        giftList: giftArr
      });

      closeModal(giftModal);

      notificationInfo.innerHTML = "Gift Deleted";
      notificationTitle.innerHTML = "Gift " + title + " successfully deleted!";
      openModal(notificationModal, "noteModal");

      //close on close
      noteSpan.onclick = function() {
        closeModal(notificationModal);
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == notificationModal) {
          closeModal(notificationModal);
        }
      };

      let nowJ = 0;
      let j = setInterval(function(){
        nowJ = nowJ + 1000;
        if(nowJ >= 3000){
          closeModal(notificationModal);
          clearInterval(j);
        }
      }, 1000);

      if(buyer != ""){
        let userFound = findUserNameItemInArr(buyer, userArr);
        if(userFound != -1){
          addNotificationToDB(userArr[userFound], title);
        } else {
          if(consoleOutput)
            console.log("User not found");
        }
      } else {
        if(consoleOutput)
          console.log("No buyer, no notification needed");
      }

    } else {
      alert("Delete failed, please try again later!");
    }
     */
  }

  function removeModerationTicket (uid) {
    document.getElementById('ticket' + uid).remove();

    dataCounter--;
    if (dataCounter == 0){
      deployListEmptyNotification("There Are No Items In The Moderation Queue!");
    }
  }
};
