/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let moderationQueueElements = [];
let listeningFirebaseRefs = [];
let inviteArr = [];
let userArr = [];
let ticketArr = [];

let moderationSet = 1;
let dataCounter = 0;
let commonLoadingTimerInt = 0;

let dataListContainer;
let nukeTickets;
let backBtn;
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
let commonLoadingTimer;
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
    if (user.friends == undefined) {
      if(localConsoleOutput)
        console.log("Friends Not Found");
    } else if (user.friends != undefined) {
      if (user.friends.length < 100 && user.friends.length > 0) {
        inviteNote.innerHTML = user.friends.length + " Friends";
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

  pageName = "ModerationQueue";
  dataListContainer = document.getElementById('dataListContainer');
  nukeTickets = document.getElementById('nukeTickets');
  backBtn = document.getElementById('backBtn');
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
  moderationQueueElements = [dataListContainer, nukeTickets, backBtn, ticketModal, closeTicketModal, ticketTitle,
    ticketUID, ticketDetails, ticketLocation, ticketTime, deleteTicket, offlineModal, offlineSpan, inviteNote,
    notificationModal, notificationTitle, notificationInfo, noteSpan, testData];
  getCurrentUser();
  commonInitialization();
  verifyElementIntegrity(moderationQueueElements);

  databaseQuery();

  alternateButtonLabel(settingsNote, "Settings", "Moderation");

  function initializeNukeBtn() {
    if (ticketArr.length > 0) {
      nukeTickets.innerHTML = "Remove All Tickets";
      nukeTickets.onclick = function () {
        firebase.database().ref("maintenance/").remove();

        ticketArr = [];
        location.reload();
      };
    } else {
      nukeTickets.innerHTML = "No Tickets To Remove!";
      nukeTickets.onclick = function () {};
    }
  }

  function initializeBackBtn() {
    backBtn.innerHTML = "Return To Settings";

    backBtn.onclick = function() {
      newNavigation(5);
    };
  }

  function databaseQuery() {

    userInitial = firebase.database().ref("users/");
    userInvites = firebase.database().ref("users/" + user.uid + "/invites");
    moderationTickets = firebase.database().ref("maintenance/");

    let fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        let i = findUIDItemInArr(data.key, userArr, true);
        if(userArr[i] != data.val() && i != -1){
          userArr[i] = data.val();
        }

        if(data.key == user.uid){
          user = data.val();
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
          console.log("Current User Updated");
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
            ticketArr.push(data.val());
            createModerationTicket(data.val());
          });

          postRef.on("child_changed", function (data) {
            console.log(data.key + " Changed!");
            changeModerationTicket(data.val());

            let i = findUIDItemInArr(data.key, ticketArr);
            if(ticketArr[i] != data.val() && i != -1){
              console.log("Changing " + ticketArr[i].uid);
              ticketArr[i] = data.val();
            }
          });

          postRef.on("child_removed", function (data) {
            console.log(data.key + " Removed!");
            removeModerationTicket(data.key);

            let i = findUIDItemInArr(data.key, ticketArr);
            if(ticketArr[i] != data.val() && i != -1){
              console.log("Removing " + ticketArr[i].uid);
              ticketArr.splice(i, 1);
            }
          });
        } else {
          deployListEmptyNotification("There Are No Items In The Moderation Queue!");
          initializeNukeBtn();
          initializeBackBtn();
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
    try {
      testData.remove();
    } catch (err) {}

    let ticketTitleTextReturned;
    let liItem = document.createElement("LI");
    liItem.id = "ticket" + ticketData.uid;

    ticketTitleTextReturned = initModTicketElement(liItem, ticketData);

    let textNode = document.createTextNode(ticketTitleTextReturned);
    liItem.appendChild(textNode);

    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
    clearInterval(offlineTimer);

    if (dataCounter < 1) {
      initializeNukeBtn();
      initializeBackBtn();
    }
    dataCounter++;
    if (dataCounter > buttonOpacLim) {
      nukeTickets.style.opacity = ".75";
    }
  }

  function changeModerationTicket (ticketData) {
    let ticketTitleTextReturned;
    let editTicket = document.getElementById('ticket' + ticketData.uid);

    ticketTitleTextReturned = initModTicketElement(editTicket, ticketData);

    editTicket.innerHTML = ticketTitleTextReturned;
  }

  function initModTicketElement (liItem, ticketData) {
    let ticketTitleText = "";

    liItem.className = "gift";
    if (ticketData.details.includes("Attempting to delete user")) {
      liItem.className += " highSev";
      ticketTitleText = "!!Attempt To Delete User!! " + ticketData.uid;
    } else if (ticketData.details.includes("Invalid Login")) {
      liItem.className += " highSev";
      ticketTitleText = "!!Invalid Login Attempt!! " + ticketData.uid;
    } else if (ticketData.details.includes("Login Error")) {
      liItem.className += " highSev";
      ticketTitleText = "!!Login Error!! " + ticketData.uid;
    } else if (ticketData.details.includes("Attempting to delete gift")) {
      liItem.className += " mediumSev";
      ticketTitleText = "Attempt To Delete Gift " + ticketData.uid;
    } else if (ticketData.details.includes("Attempting to update gift")) {
      liItem.className += " lowSev";
      ticketTitleText = "Attempt To Update Gift " + ticketData.uid;
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

      openModal(ticketModal, ticketData.uid);

      closeTicketModal.onclick = function() {
        closeModal(ticketModal);
      };
    };

    return ticketTitleText;
  }

  function deleteModerationTicket (ticketData) {
    let verifyDeleteBool = true;
    let toDelete;
    let ticketNoteInterval;
    let ticketNoteTimer = 0;

    toDelete = findUIDItemInArr(ticketData.uid, ticketArr);

    if (toDelete != -1) {
      ticketArr.splice(toDelete, 1);
      if (findUIDItemInArr(ticketData.uid, ticketArr) != -1) {
        verifyDeleteBool = false;
      }
    } else {
      verifyDeleteBool = false;
    }

    if (verifyDeleteBool) {
      firebase.database().ref("maintenance/").child(ticketData.uid).remove();
      closeModal(ticketModal);

      notificationInfo.innerHTML = "Ticket Deleted";
      notificationTitle.innerHTML = "Moderation ticket " + ticketData.uid + " successfully deleted!";
      openModal(notificationModal, "noteModal", true);

      noteSpan.onclick = function() {
        closeModal(notificationModal);
        clearInterval(ticketNoteInterval);
      };

      window.onclick = function(event) {
        if (event.target == notificationModal) {
          closeModal(notificationModal);
          clearInterval(ticketNoteInterval);
        }
      };

      ticketNoteInterval = setInterval(function(){
        ticketNoteTimer = ticketNoteTimer + 1000;
        if(ticketNoteTimer >= 3000){
          closeModal(notificationModal);
          clearInterval(ticketNoteInterval);
        }
      }, 1000);
    } else {
      alert("Delete failed, please try again later!");
    }
  }

  function removeModerationTicket(uid) {
    try {
      document.getElementById('ticket' + uid).remove();

      dataCounter--;
      if (dataCounter == 0){
        deployListEmptyNotification("There Are No Items In The Moderation Queue!");
        initializeNukeBtn();
        initializeBackBtn();
      }
    } catch (err) {}
  }
};
