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
  moderationQueueElements = [dataListContainer, offlineModal, offlineSpan, inviteNote, notificationModal,
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
    let ticketTitle = "";
    try {
      testData.remove();
    } catch (err) {}

    let liItem = document.createElement("LI");
    liItem.id = "ticket" + ticketData.uid;
    liItem.className = "gift";
    if (ticketData.details.includes("Attempting to delete user")) {
      liItem.className += " highSev";
      ticketTitle = "Attempt To Delete User";
    } else if (ticketData.details.includes("Invalid Login")) {
      liItem.className += " highSev";
      ticketTitle = "Invalid Login Attempt";
    } else if (ticketData.details.includes("Attempting to delete gift")) {
      liItem.className += " mediumSev";
      ticketTitle = "Attempt To Delete Gift";
    } else if (ticketData.details.includes("Attempting to update gift")) {
      liItem.className += " lowSev";
      ticketTitle = "Attempt To Update Gift";
    } else {
      liItem.className += " highSev";
      ticketTitle = "No Data Available!";
    }

    liItem.onclick = function (){
      ticketUID.innerHTML = ticketData.uid;
      ticketDetails.innerHTML = ticketData.details;
      ticketLocation.innerHTML = ticketData.location;
      ticketTime.innerHTML = ticketData.time;

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
    let textNode = document.createTextNode(ticketTitle);
    liItem.appendChild(textNode);

    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
    clearInterval(offlineTimer);

    dataCounter++;
    if (dataCounter > 5) {
      //Add "Nuke" Button?
    }
  }

  function changeModerationTicket (ticketData) {

  }
};
