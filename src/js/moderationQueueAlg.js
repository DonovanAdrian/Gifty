/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let moderationQueueElements = [];
let listeningFirebaseRefs = [];
let initializedTickets = [];
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
        for (let i = 0; i < initializedTickets.length; i++) {
          try {
            removeModerationTicket(initializedTickets[i]);
          } catch(err) {}
        }
        initializedTickets = [];
        ticketArr = [];
        nukeTickets.innerHTML = "No Tickets To Remove!";
        nukeTickets.onclick = function () {};
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
        if (i != -1) {
          localObjectChanges = findObjectChanges(userArr[i], data.val());
          if (localObjectChanges.length != 0) {
            userArr[i] = data.val();

            if (data.key == user.uid) {
              user = data.val();
              updateFriendNav(user.friends);
            }
          }
        } else {
          userArr.push(data.val());

          if (data.key == user.uid) {
            user = data.val();
            updateFriendNav(user.friends);
          }
        }
      });

      postRef.on('child_changed', function (data) {
        let i = findUIDItemInArr(data.key, userArr, true);
        if (i != -1) {
          localObjectChanges = findObjectChanges(userArr[i], data.val());
          if (localObjectChanges.length != 0) {
            if (consoleOutput)
              console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
            userArr[i] = data.val();

            if(data.key == user.uid){
              user = data.val();
              updateFriendNav(user.friends);
              console.log("Current User Updated");
            }
          }
        }
      });

      postRef.on('child_removed', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if (i != -1) {
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
        inviteArr[data.key] = data.val();
      });

      postRef.on('child_removed', function (data) {
        inviteArr.splice(data.key, 1);

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
            let x = initializedTickets.indexOf(data.key);
            initializedTickets.splice(x, 1);
            removeModerationTicket(data.key);

            let i = findUIDItemInArr(data.key, ticketArr);
            if(ticketArr[i] != data.val() && i != -1){
              console.log("Removing " + ticketArr[i].uid);
              ticketArr.splice(i, 1);
            }
          });
        } else {
          firebase.database().ref("maintenance/").update({});
          deployListEmptyNotification("There Are No Items In The Moderation Queue!");
          initializeNukeBtn();
          fetchModerationQueue(moderationTickets);
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
      document.getElementById('testData').remove();
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
    let ticketTitleSuffix = "";

    liItem.className = "gift";
    if (ticketData.details.includes("Critical Error") || ticketData.details.includes("Critical Initialization Error")) {
      liItem.className += " highSev";
      ticketTitleSuffix = " - !!Critical Error Occurred!!";
    } else if (ticketData.details.includes("Attempting to delete user")) {
      liItem.className += " highSev";
      ticketTitleSuffix = " - Attempt To Delete User";
    } else if (ticketData.details.includes("experienced degraded performance")) {
      liItem.className += " highSev";
      ticketTitleSuffix = " - Degraded Performance Experienced";
    } else if (ticketData.details.includes("attempted to remove friend")) {
      liItem.className += " highSev";
      ticketTitleSuffix = " - !!Friend Removal Error!!";
    } else if (ticketData.details.includes("attempted to add friend")) {
      liItem.className += " highSev";
      ticketTitleSuffix = " - !!Invite Removal Error!!";
    } else if (ticketData.details.includes("Invalid Login")) {
      liItem.className += " highSev";
      ticketTitleSuffix = " - !!Invalid Login Attempt!!";
    } else if (ticketData.details.includes("Login Error")) {
      liItem.className += " highSev";
      ticketTitleSuffix = " - !!Login Error!!";
    } else if (ticketData.details.includes("attempted to log in")) {
      liItem.className += " highSev";
      ticketTitleSuffix = " - A Banned User Attempted Login";
    } else if (ticketData.details.includes("attempted to access a restricted page")) {
      liItem.className += " highSev";
      ticketTitleSuffix = " - A Restricted Page Was Accessed";
    }else if (ticketData.details.includes("forced the moderation modal to appear")) {
      liItem.className += " highSev";
      ticketTitleSuffix = " - A Restricted Window Was Forced Open";
    } else if (ticketData.details.includes("Login disabled by")) {
      liItem.className += " highSev";
      ticketTitleSuffix = " - Login Disabled";
    } else if (ticketData.details.includes("failed to connect to the private list owned by")) {
      liItem.className += " highSev";
      ticketTitleSuffix = " - Gift List Connection Failed";
    } else if (ticketData.details.includes("Notification delete failed")) {
      liItem.className += " highSev";
      ticketTitleSuffix = " - Notification Delete Failed";
    } else if (ticketData.details.includes("Gift delete failed")) {
      liItem.className += " highSev";
      ticketTitleSuffix = " - Gift Delete Failed";
    } else if (ticketData.details.includes("Gift update failed for user")) {
      liItem.className += " highSev";
      ticketTitleSuffix = " - Gift Update Failed";
    } else if (ticketData.details.includes("URL Limiter disabled by")) {
      liItem.className += " mediumSev";
      ticketTitleSuffix = " - URL Limits Disabled";
    } else if (ticketData.details.includes("URL Limiter set by")) {
      liItem.className += " mediumSev";
      ticketTitleSuffix = " - URL Limits Set";
    } else if (ticketData.details.includes("Database limits set by")) {
      liItem.className += " mediumSev";
      ticketTitleSuffix = " - Database Limits Set";
    } else if (ticketData.details.includes("has opened their warning")) {
      liItem.className += " mediumSev";
      ticketTitleSuffix = " - A Warned User Was Successfully Notified";
    } else if (ticketData.details.includes("Login disabled message reset by")) {
      liItem.className += " lowSev";
      ticketTitleSuffix = " - Login Message Reset";
    } else if (ticketData.details.includes("Login enabled by")) {
      liItem.className += " lowSev";
      ticketTitleSuffix = " - Login Enabled";
    } else {
      liItem.className += " highSev";
      ticketTitleSuffix = " - Ticket Title Unavailable, Open For More Details!";
    }

    ticketTitleText = ticketData.time + ticketTitleSuffix;

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
      let i = initializedTickets.indexOf(ticketData.uid);
      initializedTickets.splice(i, 1);
      removeModerationTicket(ticketData.uid);

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
