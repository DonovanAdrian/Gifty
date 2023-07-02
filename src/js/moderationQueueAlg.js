/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let moderationQueueElements = [];
let initializedTickets = [];
let ticketArr = [];

let moderationSet = 1;

let nukeTickets;
let ticketModal;
let closeTicketModal;
let ticketTitle;
let ticketUID;
let ticketDetails;
let ticketLocation;
let ticketTime;
let deleteTicket;
let moderationTickets;
let userName;



function checkTicketCookie() {
  try {
    ticketArr = JSON.parse(sessionStorage.ticketArr);
    for (let i = 0; i < ticketArr.length; i++) {
      createModerationTicket(ticketArr[i]);
    }
  } catch (err) {}
}

window.onload = function instantiate() {
  failedNavNum = 17;
  pageName = "ModerationQueue";
  nukeTickets = document.getElementById("nukeTickets");
  backBtn = document.getElementById("backBtn");
  ticketModal = document.getElementById("ticketModal");
  closeTicketModal = document.getElementById("closeTicketModal");
  ticketTitle = document.getElementById("ticketTitle");
  ticketUID = document.getElementById("ticketUID");
  ticketDetails = document.getElementById("ticketDetails");
  ticketLocation = document.getElementById("ticketLocation");
  ticketTime = document.getElementById("ticketTime");
  deleteTicket = document.getElementById("deleteTicket");
  inviteNote = document.getElementById("inviteNote");
  moderationQueueElements = [dataListContainer, nukeTickets, backBtn, ticketModal, closeTicketModal, ticketTitle,
    ticketUID, ticketDetails, ticketLocation, ticketTime, deleteTicket, offlineModal, offlineSpan, inviteNote,
    notificationModal, notificationTitle, notificationInfo, noteSpan, testData];

  sessionStorage.setItem("moderationSet", moderationSet);
  getCurrentUserCommon();
  commonInitialization();
  checkTicketCookie();
  verifyElementIntegrity(moderationQueueElements);

  userInitial = firebase.database().ref("users/");
  userInvites = firebase.database().ref("users/" + user.uid + "/invites");
  moderationTickets = firebase.database().ref("maintenance/");

  databaseQuery();
  alternateButtonLabel(settingsNote, "Settings", "Moderation");

  function initializeBackBtn() {
    backBtn.innerHTML = "Return To Settings";
    backBtn.onclick = function() {
      navigation(5);//Settings
    };
  }

  initializeBackBtn();

  function databaseQuery() {
    let fetchData = function (postRef) {
      postRef.on("child_added", function (data) {
        clearInterval(commonLoadingTimer);
        clearInterval(offlineTimer);
        let i = findUIDItemInArr(data.key, userArr, true);
        if (i != -1) {
          localObjectChanges = findObjectChanges(userArr[i], data.val());
          if (localObjectChanges.length != 0) {
            userArr[i] = data.val();

            if (data.key == user.uid) {
              user = data.val();
              updateFriendNav(user.friends);
            }
            saveCriticalCookies();
          }
        } else {
          userArr.push(data.val());

          if (data.key == user.uid) {
            user = data.val();
            updateFriendNav(user.friends);
          }
          saveCriticalCookies();
        }
      });

      postRef.on("child_changed", function (data) {
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
            saveCriticalCookies();
          }
        }
      });

      postRef.on("child_removed", function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if (i != -1) {
          console.log("Removing " + userArr[i].userName + " / " + data.val().userName);
          userArr.splice(i, 1);
        }
        saveCriticalCookies();
      });
    };

    let fetchInvites = function (postRef) {
      postRef.on("child_added", function (data) {
        inviteArr.push(data.val());
        inviteNote.style.background = "#ff3923";
      });

      postRef.on("child_changed", function (data) {
        inviteArr[data.key] = data.val();
      });

      postRef.on("child_removed", function (data) {
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
            let i = findUIDItemInArr(data.key, ticketArr, true);
            if(i != -1) {
              localObjectChanges = findObjectChanges(ticketArr[i], data.val());
              if (localObjectChanges.length != 0) {
                console.log("Changing " + ticketArr[i].uid);
                ticketArr[i] = data.val();
                changeModerationTicket(data.val());
                saveTicketArrToCookie();
              }
            } else {
              ticketArr.push(data.val());
              createModerationTicket(data.val());
              saveTicketArrToCookie();
            }
          });

          postRef.on("child_changed", function (data) {
            let i = findUIDItemInArr(data.key, ticketArr, true);
            if(i != -1){
              localObjectChanges = findObjectChanges(ticketArr[i], data.val());
              if (localObjectChanges.length != 0) {
                console.log("Changing " + ticketArr[i].uid);
                ticketArr[i] = data.val();
                changeModerationTicket(data.val());
                saveTicketArrToCookie();
              }
            }
          });

          postRef.on("child_removed", function (data) {
            console.log(data.key + " Removed!");
            let i = findUIDItemInArr(data.key, ticketArr);
            if(i != -1){
              console.log("Removing " + ticketArr[i].uid);
              ticketArr.splice(i, 1);

              let x = initializedTickets.indexOf(data.key);
              initializedTickets.splice(x, 1);
              removeModerationTicket(data.key);
              saveTicketArrToCookie();
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
};

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

function createModerationTicket (ticketData) {
  try {
    document.getElementById("testData").remove();
  } catch (err) {}

  let ticketTitleTextReturned;
  let liItem = document.createElement("LI");
  liItem.id = "ticket" + ticketData.uid;

  ticketTitleTextReturned = initModTicketElement(liItem, ticketData);

  let textNode = document.createTextNode(ticketTitleTextReturned);
  liItem.appendChild(textNode);

  dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
  clearInterval(offlineTimer);

  initializeNukeBtn();
  dataCounter++;
  if (dataCounter > buttonOpacLim) {
    nukeTickets.style.opacity = ".75";
  }
}

function changeModerationTicket (ticketData) {
  let ticketTitleTextReturned;
  let editTicket = document.getElementById("ticket" + ticketData.uid);

  ticketTitleTextReturned = initModTicketElement(editTicket, ticketData);
  editTicket.innerHTML = ticketTitleTextReturned;
}

function initModTicketElement (liItem, ticketData) {
  let localTime = getLocalTime(ticketData.time);
  let ticketTitleText = "";
  let ticketTitleSuffix;

  liItem.className = "gift";
  if (ticketData.details.includes("Critical Error") || ticketData.details.includes("Critical Initialization Error")) {
    liItem.className += " highSev";
    ticketTitleSuffix = " - !!Critical Error Occurred!!";
  } else if (ticketData.details.includes("Attempting to delete user")) {
    liItem.className += " mediumSev";
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
  } else if (ticketData.details.includes("Invalid Login Attempt:")) {
    liItem.className += " highSev";
    ticketTitleSuffix = " - !!Invalid Login Attempt!!";
  } else if (ticketData.details.includes("Invalid Login Attempt During Maintenance Period:")) {
    liItem.className += " mediumSev";
    ticketTitleSuffix = " - !!Invalid Login Attempt During Maintenance!!";
  } else if (ticketData.details.includes("Login Error Occurred")) {
    liItem.className += " highSev";
    ticketTitleSuffix = " - !!Login Error!!";
  } else if (ticketData.details.includes("attempted to log in")) {
    liItem.className += " mediumSev";
    ticketTitleSuffix = " - A Banned User Attempted Login";
  } else if (ticketData.details.includes("attempted to access a restricted page")) {
    liItem.className += " highSev";
    ticketTitleSuffix = " - A Restricted Page Was Accessed";
  }else if (ticketData.details.includes("forced the moderation modal to appear")) {
    liItem.className += " highSev";
    ticketTitleSuffix = " - A Restricted Window Was Forced Open";
  } else if (ticketData.details.includes("Login disabled by")) {
    liItem.className += " mediumSev";
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
    liItem.className += " lowSev";
    ticketTitleSuffix = " - A Warned User Was Successfully Notified";
  } else if (ticketData.details.includes("Login disabled message reset by")) {
    liItem.className += " lowSev";
    ticketTitleSuffix = " - Login Message Reset";
  } else if (ticketData.details.includes("Login enabled by")) {
    liItem.className += " lowSev";
    ticketTitleSuffix = " - Login Enabled";
  } else if (ticketData.details.includes("found an easter egg!")) {
    liItem.className += " lowSev";
    ticketTitleSuffix = " - Easter Egg Found!";
  } else if (ticketData.details.includes("found an easter egg... But got greedy")) {
    liItem.className += " lowSev";
    ticketTitleSuffix = " - Easter Egg Found...";
  } else {
    liItem.className += " highSev";
    ticketTitleSuffix = " - Ticket Title Unavailable, Open For More Details!";
  }

  ticketTitleText = localTime + ticketTitleSuffix;

  liItem.onclick = function (){
    ticketTitle.innerHTML = ticketTitleText;
    ticketDetails.innerHTML = ticketData.details;
    ticketUID.innerHTML = "UID: " + ticketData.uid;
    ticketTime.innerHTML = "Time: " + localTime;
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
    if (findUIDItemInArr(ticketData.uid, ticketArr, true) != -1) {
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
        "The moderation ticket, \"" + ticketData.uid + "\", has been successfully deleted.");
  } else {
    deployNotificationModal(true, "Ticket Delete Failure!",
        "The moderation ticket, \"" + ticketData.uid + "\", was NOT deleted. Please try again later.");
  }
}

function removeModerationTicket(uid) {
  try {
    document.getElementById("ticket" + uid).remove();

    dataCounter--;
    if (dataCounter == 0){
      deployListEmptyNotification("There Are No Items In The Moderation Queue!");
      initializeNukeBtn();
    }
  } catch (err) {}
}

function saveTicketArrToCookie(){
  sessionStorage.setItem("ticketArr", JSON.stringify(ticketArr));
}
