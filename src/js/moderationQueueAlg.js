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

  sessionStorage.setItem("moderationSet", moderationSet);
  getCurrentUserCommon();
  commonInitialization();
  verifyElementIntegrity(moderationQueueElements);

  userInitial = firebase.database().ref("users/");
  userInvites = firebase.database().ref("users/" + user.uid + "/invites");
  moderationTickets = firebase.database().ref("maintenance/");

  databaseQuery();
  alternateButtonLabel(settingsNote, "Settings", "Moderation");

  function initializeNukeBtn() {
    if (ticketArr.length > 0) {
      nukeTickets.innerHTML = "Remove All Tickets";
      nukeTickets.onclick = function () {
        firebase.database().ref("maintenance/").remove();
        ticketArr = [];
        navigation(17);
      };
    } else {
      nukeTickets.innerHTML = "No Tickets To Remove!";
      nukeTickets.onclick = function () {};
    }
  }

  function initializeBackBtn() {
    backBtn.innerHTML = "Return To Settings";
    backBtn.onclick = function() {
      navigation(5);
    };
  }

  initializeBackBtn();

  function databaseQuery() {
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
      ticketTitleText = "Attempt To Delete User: " + ticketData.uid;
    } else if (ticketData.details.includes("attempted to remove friend")) {
      liItem.className += " highSev";
      ticketTitleText = "!!Friend Removal Error!! " + ticketData.uid;
    } else if (ticketData.details.includes("attempted to add friend")) {
      liItem.className += " highSev";
      ticketTitleText = "!!Invite Removal Error!! " + ticketData.uid;
    } else if (ticketData.details.includes("Invalid Login")) {
      liItem.className += " highSev";
      ticketTitleText = "!!Invalid Login Attempt!! " + ticketData.uid;
    } else if (ticketData.details.includes("Login Error")) {
      liItem.className += " highSev";
      ticketTitleText = "!!Login Error!! " + ticketData.uid;
    } else if (ticketData.details.includes("attempted to log in")) {
      liItem.className += " highSev";
      ticketTitleText = "A Banned User Attempted Login: " + ticketData.uid;
    } else if (ticketData.details.includes("attempted to access a restricted page")) {
      liItem.className += " highSev";
      ticketTitleText = "A Restricted Page Was Accessed: " + ticketData.uid;
    }else if (ticketData.details.includes("forced the moderation modal to appear")) {
      liItem.className += " highSev";
      ticketTitleText = "A Restricted Window Was Forced Open: " + ticketData.uid;
    } else if (ticketData.details.includes("Login disabled by")) {
      liItem.className += " highSev";
      ticketTitleText = "Login Disabled: " + ticketData.uid;
    } else if (ticketData.details.includes("Gift delete failed")) {
      liItem.className += " highSev";
      ticketTitleText = "Gift Delete Failed: " + ticketData.uid;
    } else if (ticketData.details.includes("URL Limiter disabled by")) {
      liItem.className += " mediumSev";
      ticketTitleText = "URL Limits Disabled: " + ticketData.uid;
    } else if (ticketData.details.includes("URL Limiter set by")) {
      liItem.className += " mediumSev";
      ticketTitleText = "URL Limits Set: " + ticketData.uid;
    } else if (ticketData.details.includes("Database limits set by")) {
      liItem.className += " mediumSev";
      ticketTitleText = "Database Limits Set: " + ticketData.uid;
    } else if (ticketData.details.includes("Attempting to delete gift")) {
      liItem.className += " lowSev";
      ticketTitleText = "Attempt To Delete Gift: " + ticketData.uid;
    } else if (ticketData.details.includes("has opened their warning")) {
      liItem.className += " mediumSev";
      ticketTitleText = "A Warned User Was Successfully Notified: " + ticketData.uid;
    } else if (ticketData.details.includes("Login disabled message reset by")) {
      liItem.className += " lowSev";
      ticketTitleText = "Login Message Reset: " + ticketData.uid;
    } else if (ticketData.details.includes("Login enabled by")) {
      liItem.className += " lowSev";
      ticketTitleText = "Login Enabled: " + ticketData.uid;
    } else if (ticketData.details.includes("Attempting to update gift")) {
      liItem.className += " lowSev";
      ticketTitleText = "Attempt To Update Gift: " + ticketData.uid;
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

      deployNotificationModal(false, "Ticket " + ticketData.uid + " Deleted!",
        "The moderation ticket, " + ticketData.uid + ", has been successfully deleted.");
    } else {
      deployNotificationModal(true, "Ticket Delete Failure!",
        "The moderation ticket, " + ticketData.uid + ", was NOT deleted. Please try again later.");
    }
  }

  function removeModerationTicket(uid) {
    try {
      document.getElementById('ticket' + uid).remove();

      dataCounter--;
      if (dataCounter == 0){
        deployListEmptyNotification("There Are No Items In The Moderation Queue!");
        initializeNukeBtn();
      }
    } catch (err) {}
  }
};
