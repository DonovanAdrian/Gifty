/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let moderationQueueElements = [];
let initializedTickets = [];
let ticketArr = [];

let moderationSet = 1;

let initializedDatabaseCheck = false;

let ticketCount;
let nukeTickets;
let ticketModal;
let closeTicketModal;
let ticketTitle;
let ticketUID;
let ticketDetails;
let ticketLocation;
let ticketTime;
let deleteTicket;
let moderationTicketDataModal;
let closeModerationTicketDataModal;
let moderationTicketDataTitle;
let moderationTicketDataText;
let moderationTicketDataLastTicket;
let moderationTicketDataOldestTicket;
let moderationTicketDataNavigate;
let confirmModal;
let closeConfirmModal;
let confirmTitle;
let confirmContent;
let confirmBtn;
let denyBtn;
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
  try {
    failedNavNum = 17;
    pageName = "ModerationQueue";
    nukeTickets = document.getElementById("nukeTickets");
    backBtn = document.getElementById("backBtn");
    ticketCount = document.getElementById("ticketCount");
    ticketModal = document.getElementById("ticketModal");
    closeTicketModal = document.getElementById("closeTicketModal");
    ticketTitle = document.getElementById("ticketTitle");
    ticketUID = document.getElementById("ticketUID");
    ticketDetails = document.getElementById("ticketDetails");
    ticketLocation = document.getElementById("ticketLocation");
    ticketTime = document.getElementById("ticketTime");
    deleteTicket = document.getElementById("deleteTicket");
    moderationTicketDataModal = document.getElementById("moderationTicketDataModal");
    closeModerationTicketDataModal = document.getElementById("closeModerationTicketDataModal");
    moderationTicketDataTitle = document.getElementById("moderationTicketDataTitle");
    moderationTicketDataText = document.getElementById("moderationTicketDataText");
    moderationTicketDataLastTicket = document.getElementById("moderationTicketDataLastTicket");
    moderationTicketDataOldestTicket = document.getElementById("moderationTicketDataOldestTicket");
    moderationTicketDataNavigate = document.getElementById("moderationTicketDataNavigate");
    confirmModal = document.getElementById("confirmModal");
    closeConfirmModal = document.getElementById("closeConfirmModal");
    confirmTitle = document.getElementById("confirmTitle");
    confirmContent = document.getElementById("confirmContent");
    confirmBtn = document.getElementById("confirmBtn");
    denyBtn = document.getElementById("denyBtn");
    inviteNote = document.getElementById("inviteNote");

    sessionStorage.setItem("moderationSet", moderationSet);
    getCurrentUserCommon();
    commonInitialization();
    checkTicketCookie();

    moderationQueueElements = [dataListContainer, nukeTickets, backBtn, ticketCount, ticketModal, closeTicketModal,
      ticketTitle, ticketUID, ticketDetails, ticketLocation, ticketTime, deleteTicket, moderationTicketDataModal,
      closeModerationTicketDataModal, moderationTicketDataTitle, moderationTicketDataText, moderationTicketDataLastTicket,
      moderationTicketDataOldestTicket, moderationTicketDataNavigate, confirmModal, closeConfirmModal, confirmTitle,
      confirmContent, confirmBtn, denyBtn, offlineModal, offlineSpan, inviteNote, notificationModal, notificationTitle,
      notificationInfo, noteSpan, testData];

    verifyElementIntegrity(moderationQueueElements);

    userInitial = firebase.database().ref("users/");
    userInvites = firebase.database().ref("users/" + user.uid + "/invites");
    moderationTickets = firebase.database().ref("maintenance/");

    databaseQuery();
    alternateButtonLabel(settingsNote, "Settings", "Moderation");
    initializeBackBtn();
  } catch (err) {
    sendCriticalInitializationError(err);
  }

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
            logOutput("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
            userArr[i] = data.val();

            if(data.key == user.uid){
              user = data.val();
              updateFriendNav(user.friends);
              logOutput("Current User Updated");
            }
            saveCriticalCookies();
          }
        }
      });

      postRef.on("child_removed", function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if (i != -1) {
          logOutput("Removing " + userArr[i].userName + " / " + data.val().userName);
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
          logOutput("Invite List Removed");
          inviteNote.style.background = "#008222";
        }
      });
    };

    let fetchModerationQueue = function (postRef) {
      postRef.once("value").then(function(snapshot) {
        if (snapshot.exists() || initializedDatabaseCheck) {
          postRef.on("child_added", function (data) {
            let i = findUIDItemInArr(data.key, ticketArr, true);
            if(i != -1) {
              localObjectChanges = findObjectChanges(ticketArr[i], data.val());
              if (localObjectChanges.length != 0) {
                logOutput("Changing " + ticketArr[i].uid);
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
                logOutput("Changing " + ticketArr[i].uid);
                ticketArr[i] = data.val();
                changeModerationTicket(data.val());
                saveTicketArrToCookie();
              }
            }
          });

          postRef.on("child_removed", function (data) {
            logOutput(data.key + " Removed!");
            let i = findUIDItemInArr(data.key, ticketArr);
            if(i != -1){
              logOutput("Removing " + ticketArr[i].uid);
              ticketArr.splice(i, 1);

              let x = initializedTickets.indexOf(data.key);
              initializedTickets.splice(x, 1);
              removeModerationTicket(data.key);
              saveTicketArrToCookie();
            }
          });
        } else {
          deployListEmptyNotification("There Are No Items In The Moderation Queue!");
          ticketArr = [];
          saveTicketArrToCookie();
          initializedDatabaseCheck = true;
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

function initializeBackBtn() {
  backBtn.innerHTML = "Return To Settings";
  backBtn.onclick = function() {
    navigation(5);//Settings
  };
}

function initializeTicketCount() {
  let ticketCountString = "";

  if (ticketArr.length == 0) {
    ticketCountString = "No Tickets!";
  } else if (ticketArr.length == 1) {
    ticketCountString = "1 Ticket";
  } else if (ticketArr.length > 1) {
    ticketCountString = ticketArr.length + " Tickets";
  }
  ticketCount.innerHTML = ticketCountString;
  ticketCount.onclick = function() {
    generateModerationTicketDataModal();
  };
}

function initializeNukeBtn() {
  if (ticketArr == undefined)
    ticketArr = [];

  if (ticketArr.length > 0) {
    nukeTickets.innerHTML = "Remove All Tickets";
    nukeTickets.onclick = function () {
      confirmOperation("Are You Sure?", "This will remove ALL of your audit log tickets. This " +
          "cannot be undone. Are you sure?");
    };
  } else {
    nukeTickets.innerHTML = "No Tickets To Remove!";
    nukeTickets.onclick = function () {};
  }
  initializeTicketCount();
}

function confirmOperation(operationTitle, operationContent) {
  confirmTitle.innerHTML = operationTitle;
  confirmContent.innerHTML = operationContent;

  confirmBtn.onclick = function() {
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
    deployNotificationModal(false, "All Tickets Successfully Removed!",
        "All of your tickets have been successfully removed.",
        5); //Home
  };

  denyBtn.onclick = function() {
    closeModal(confirmModal);
  }

  openModal(confirmModal, "confirmModal", true);

  closeConfirmModal.onclick = function() {
    closeModal(confirmModal);
  };

  window.onclick = function(event) {
    if (event.target == confirmModal) {
      closeModal(confirmModal);
    }
  };
}

function createModerationTicket (ticketData) {
  try {
    document.getElementById("testData").remove();
  } catch (err) {}

  let ticketTitleTextReturned;
  let liItem = document.createElement("LI");
  liItem.id = "ticket" + ticketData.uid;

  if (ticketData.details.includes(") issued a password reset for ")) {
    if (((Date.parse(commonToday) - Date.parse(ticketData.time)) / 86400000) > 3) {
      let tempTicketDetails = ticketData.details;
      let tempTicketIndex = tempTicketDetails.indexOf(" The temporary password is ");
      let newTicketDetails = tempTicketDetails.substring(0, tempTicketIndex);
      newTicketDetails += " The temporary password was removed automatically after 3 days.";

      firebase.database().ref("maintenance/" + ticketData.uid).update({
        details: newTicketDetails
      });
    }
  }

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
  let ticketDataReturn;
  let ticketTitleSuffix;

  ticketDataReturn = fetchModerationTicketData(ticketData);
  ticketDataReturn = ticketDataReturn.split(",,,");
  liItem.className = "gift";
  ticketTitleSuffix = ticketDataReturn[0];
  liItem.className += ticketDataReturn[1];

  ticketTitleText = localTime + ticketTitleSuffix;

  liItem.onclick = function (){
    ticketTitle.innerHTML = ticketTitleText;
    ticketDetails.innerHTML = "<b>Ticket Details:</b> " + ticketData.details;
    ticketUID.innerHTML = "<b>UID:</b> " + ticketData.uid;
    ticketTime.innerHTML = "<b>Time:</b> " + localTime;
    if (ticketData.location == "index") {
      ticketLocation.innerHTML = "<b>Location:</b> login/index";
    } else {
      ticketLocation.innerHTML = "<b>Location:</b> " + ticketData.location;
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
        "The audit log ticket, \"" + ticketData.uid + "\", has been successfully deleted.");
    saveTicketArrToCookie();
  } else {
    deployNotificationModal(true, "Ticket Delete Failure!",
        "The audit log ticket, \"" + ticketData.uid + "\", was NOT deleted. Please try again later.");
  }
}

function removeModerationTicket(uid) {
  try {
    document.getElementById("ticket" + uid).remove();

    dataCounter--;
    if (dataCounter == 0){
      deployListEmptyNotification("There Are No Items In The Audit Log Queue!");
      initializeNukeBtn();
    }
  } catch (err) {}
}

function saveTicketArrToCookie(){
  sessionStorage.setItem("ticketArr", JSON.stringify(ticketArr));
  initializeNukeBtn();
}

function generateModerationTicketDataModal() {
  evaluateInitialTicketTimeline(moderationTicketDataLastTicket, moderationTicketDataOldestTicket);
  moderationTicketDataTitle.innerHTML = "Audit Log Ticket Data";
  moderationTicketDataText.innerHTML = "<b>Total:</b> " + ticketArr.length + " Ticket(s)";

  moderationTicketDataNavigate.onclick = function() {
    navigation(14); //moderation
  };

  closeModal(moderationTicketDataModal);

  closeModerationTicketDataModal.onclick = function() {
    closeModal(moderationTicketDataModal);
  }

  openModal(moderationTicketDataModal, "moderationTicketDataModal");
}
