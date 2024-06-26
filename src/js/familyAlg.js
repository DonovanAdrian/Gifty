/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let familyElements = [];
let familyMemberArr = [];
let loadedFamilyMembersArr = [];

let initializedDatabaseCheck = false;

let settingsNote;
let createFamilyBtn;
let familyModal;
let closeFamilyModal;
let familyTitle;
let familyUID;
let familyMemberCount;
let familyListContainer;
let testFamily;
let familyOptionsHeaderBuffer;
let familyOptionsHeader;
let messageAllFamilyMembers;
let familyMessagingBuffer;
let familyEdit;
let familyRemove;
let familyAddModal;
let closeFamilyAddModal;
let familyNameInp;
let addFamily;
let cancelFamily;
let privateMessageModal;
let closePrivateMessageModal;
let globalMsgTitle;
let globalMsgInp;
let sendMsg;
let cancelMsg;



function checkFamilyCookie() {
  try {
    familyArr = JSON.parse(sessionStorage.familyArr);
    for (let i = 0; i < familyArr.length; i++) {
      createFamilyElement(familyArr[i]);
      if (familyArr[i].automaticSantaControl != undefined) {
        if (familyArr[i].automaticSantaControl == 1) {
          logOutput("Calling Automatic Control For " + familyArr[i].name + "...");
          try {
            dateCalculationHandler(familyArr[i]);
          } catch (err) {
            logOutput("Failed Calling Automatic Control For " + familyData.name + "... \"" + err.toString() + "\"");
            updateMaintenanceLog(pageName, "Failed To Initialize Automatic Control for " + familyData.name +
                ". Triggered by " + user.userName + "(" + user.uid + "). The following error occurred: " +
                err.toString() + "\"");
            automaticControlFailureCount++;
            checkForFailedFamilies();
          }
        }
      }
    }
  } catch (err) {}
}

window.onload = function instantiate() {
  initializeFamilyPage();

  function initializeFamilyPage() {
    try {
      failedNavNum = 15;
      pageName = "Family";
      inviteNote = document.getElementById("inviteNote");
      settingsNote = document.getElementById("settingsNote");
      createFamilyBtn = document.getElementById("createFamily");
      backBtn = document.getElementById("backBtn");
      familyModal = document.getElementById("familyModal");
      closeFamilyModal = document.getElementById("closeFamilyModal");
      familyTitle = document.getElementById("familyTitle");
      familyUID = document.getElementById("familyUID");
      familyMemberCount = document.getElementById("familyMemberCount");
      familyListContainer = document.getElementById("familyListContainer");
      testFamily = document.getElementById("testFamily");
      familyOptionsHeaderBuffer = document.getElementById("familyOptionsHeaderBuffer");
      familyOptionsHeader = document.getElementById("familyOptionsHeader");
      messageAllFamilyMembers = document.getElementById("messageAllFamilyMembers");
      familyMessagingBuffer = document.getElementById("familyMessagingBuffer");
      familyEdit = document.getElementById("familyEdit");
      familyRemove = document.getElementById("familyRemove");
      familyAddModal = document.getElementById("familyAddModal");
      closeFamilyAddModal = document.getElementById("closeFamilyAddModal");
      familyNameInp = document.getElementById("familyNameInp");
      addFamily = document.getElementById("addFamily");
      cancelFamily = document.getElementById("cancelFamily");
      privateMessageModal = document.getElementById("privateMessageModal");
      closePrivateMessageModal = document.getElementById("closePrivateMessageModal");
      globalMsgTitle = document.getElementById("globalMsgTitle");
      globalMsgInp = document.getElementById("globalMsgInp");
      sendMsg = document.getElementById("sendMsg");
      cancelMsg = document.getElementById("cancelMsg");

      getCurrentUserCommon();
      commonInitialization();
      initializeSecretSantaFamilyPageVars();

      familyElements = [inviteNote, settingsNote, dataListContainer, testData, createFamilyBtn, backBtn, familyModal,
        closeFamilyModal, familyTitle, familyUID, familyMemberCount, familyListContainer, testFamily,
        familyOptionsHeaderBuffer, familyOptionsHeader, messageAllFamilyMembers, familyMessagingBuffer, familyEdit,
        familyRemove, familyAddModal, closeFamilyAddModal, familyNameInp, addFamily, cancelFamily, privateMessageModal,
        closePrivateMessageModal, globalMsgTitle, globalMsgInp, sendMsg, cancelMsg, offlineModal, offlineSpan,
        notificationModal, noteSpan, notificationTitle, notificationInfo];

      checkFamilyCookie();
      verifyElementIntegrity(familyElements);

      userInitial = firebase.database().ref("users/");
      userInvites = firebase.database().ref("users/" + user.uid + "/invites");
      familyInitial = firebase.database().ref("family/");

      databaseQuery();
      alternateButtonLabel(settingsNote, "Settings", "Family");

      initializeCreateFamilyBtn();
      initializeBackBtn();
    } catch (err) {
      sendCriticalInitializationError(err);
    }
  }

  function databaseQuery() {
    let fetchData = function (postRef) {
      postRef.on("child_added", function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if (i != -1) {
          localObjectChanges = findObjectChanges(userArr[i], data.val());
          if (localObjectChanges.length != 0) {
            userArr[i] = data.val();

            if (data.key == user.uid) {
              user = data.val();
            }
            saveCriticalCookies();
          }
        } else {
          userArr.push(data.val());

          if (data.key == user.uid) {
            user = data.val();
          }
          saveCriticalCookies();
        }
      });

      postRef.on("child_changed", function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if (i != -1) {
          localObjectChanges = findObjectChanges(userArr[i], data.val());
          if (localObjectChanges.length != 0) {
            logOutput("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
            userArr[i] = data.val();

            if (data.key == user.uid) {
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
          userArr.splice(i, 1);
          saveCriticalCookies();
        }
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

    let fetchFamilies = function (postRef){
      postRef.once("value").then(function(snapshot) {
        if (snapshot.exists() || initializedDatabaseCheck) {
          postRef.on("child_added", function (data) {
            let i = findUIDItemInArr(data.val().uid, familyArr);
            if (i == -1) {
              familyArr.push(data.val());

              createFamilyElement(data.val());
              saveCriticalCookies();
            } else {
              localObjectChanges = findObjectChanges(familyArr[i], data.val());
              if (localObjectChanges.length != 0) {
                familyArr[i] = data.val();

                changeFamilyElement(data.val());
                saveCriticalCookies();
              }
            }
          });

          postRef.on("child_changed", function (data) {
            let i = findUIDItemInArr(data.key, familyArr);
            if (i != -1) {
              localObjectChanges = findObjectChanges(familyArr[i], data.val());
              if (localObjectChanges.length != 0) {
                familyArr[i] = data.val();
                changeFamilyElement(data.val());
                saveCriticalCookies();
              }
            }
          });

          postRef.on("child_removed", function (data) {
            let i = findUIDItemInArr(data.key, familyArr);
            if (i != -1) {
              familyArr.splice(i, 1);
              removeFamilyElement(data.key);
              saveCriticalCookies();
            }
          });
        } else {
          deployListEmptyNotification("No Families Found!");
          initializedDatabaseCheck = true;
          fetchFamilies(familyInitial);
        }
      });
    };

    fetchData(userInitial);
    fetchInvites(userInvites);
    fetchFamilies(familyInitial);

    listeningFirebaseRefs.push(userInitial);
    listeningFirebaseRefs.push(userInvites);
    listeningFirebaseRefs.push(familyInitial);
  }
};

function initializeCreateFamilyBtn() {
  createFamilyBtn.innerHTML = "Create Family";
  createFamilyBtn.onclick = function () {
    generateAddFamilyModal();
  };
}

function initializeBackBtn() {
  backBtn.innerHTML = "Return To Settings";
  backBtn.onclick = function() {
    navigation(5);//Settings
  };
}

function generateAddFamilyModal(){
  addFamily.onclick = function() {
    if(familyNameInp.value != "" || (familyNameInp.value.includes(" ") && isAlph(familyNameInp.value.charAt(0)))) {
      addFamilyToDB(familyNameInp.value);
      familyNameInp.value = "";
    }
  };

  cancelFamily.onclick = function() {
    familyNameInp.value = "";
    closeModal(familyAddModal);
  };

  openModal(familyAddModal, "familyAddModal");

  closeFamilyAddModal.onclick = function() {
    closeModal(familyAddModal);
  };
}

function createFamilyElement(familyData){
  try{
    document.getElementById("testData").remove();
  } catch (err) {}

  let liItem = document.createElement("LI");
  liItem.id = "family" + familyData.uid;
  initFamilyElement(liItem, familyData);
  let textNode = document.createTextNode(familyData.name);
  liItem.appendChild(textNode);

  dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
  clearInterval(commonLoadingTimer);
  clearInterval(offlineTimer);
  dataCounter++;
}

function changeFamilyElement(familyData) {
  let editFamily = document.getElementById("family" + familyData.uid);
  editFamily.innerHTML = familyData.name;
  initFamilyElement(editFamily, familyData);
}

function initFamilyElement(liItem, familyData) {
  liItem.className = "gift";
  liItem.onclick = function () {
    initializeSecretSantaFamilyModalElements(familyData);

    familyMemberArr = familyData.members;
    if (familyData.members == undefined) {
      familyMemberArr = [];
    }
    familyTitle.innerHTML = familyData.name;
    familyUID.innerHTML = "UID: " + familyData.uid;

    try {
      testFamily.remove();
    } catch (err) {}
    if (familyMemberArr.length <= 2)
      familyMemberCount.innerHTML = "# Members: " + familyMemberArr.length + " (Click \"Edit Family\" to add members!)";
    else
      familyMemberCount.innerHTML = "# Members: " + familyMemberArr.length + " (Click \"Edit Family\" to configure relationships!)";

    if (familyMemberArr.length > 0) {
      familyOptionsHeaderBuffer.style.display = "inline-block";
      familyOptionsHeader.style.display = "block";
      messageAllFamilyMembers.innerHTML = "Message All Family Members";
      messageAllFamilyMembers.onclick = function() {
        initializeGlobalNotification("Family", familyData);
      };
      messageAllFamilyMembers.style.display = "inline-block";
      familyMessagingBuffer.style.display = "block";
    } else {
      familyOptionsHeaderBuffer.style.display = "none";
      familyOptionsHeader.style.display = "none";
      messageAllFamilyMembers.innerHTML = "";
      messageAllFamilyMembers.onclick = function() {};
      messageAllFamilyMembers.style.display = "none";
      familyMessagingBuffer.style.display = "none";
    }

    generateFamilyMemberList(liItem, familyMemberArr);

    familyEdit.onclick = function (){
      sessionStorage.setItem("familyData", JSON.stringify(familyData));
      navigation(16);//familyUpdate
    };

    familyRemove.onclick = function (){
      closeModal(familyModal);
      removeFamilyFromDB(familyData.uid);
    };

    openModal(familyModal, familyData.uid);

    closeFamilyModal.onclick = function() {
      closeModal(familyModal);
    };
  };
}

function initializeGlobalNotification(messageType, familyData) {
  let overallMessageType = "";
  let supplementalExampleText = "";
  let userList = [];
  let tempIndex = -1;

  if (messageType == "Santa") {
    overallMessageType = " To All Secret Santa Participants";
    supplementalExampleText = " Enjoy Secret Santa!";
  } else if (messageType == "Family") {
    overallMessageType = " To All Family Members";
    supplementalExampleText = " Have a great day!";
  }

  globalMsgInp.placeholder = "Hello " + familyData.name + "!" + supplementalExampleText;
  globalMsgTitle.innerHTML = "Send A Message" + overallMessageType;

  sendMsg.onclick = function (){
    if(globalMsgInp.value.includes(",,,")){
      deployNotificationModal(true, "Message Error!", "Please do not use commas " +
          "in the notification. Thank you!");
    } else {
      for (let i = 0; i < familyData.members.length; i++) {
        tempIndex = findUIDItemInArr(familyData.members[i], userArr);

        if (tempIndex != -1 && messageType == "Santa" && userArr[tempIndex].secretSanta == 1) {
          userList.push(userArr[tempIndex]);
        } else if (tempIndex != -1 && messageType == "Family") {
          userList.push(userArr[tempIndex]);
        }
      }
      if (userList.length > 0) {
        addModerationNotificationMessagesToDB(globalMsgInp.value, userList);
        globalMsgInp.value = "";
        closeModal(privateMessageModal);
        deployNotificationModal(false, "Message Sent!",
            "The Message Has Been Sent!");
      } else {
        deployNotificationModal(false, "Message Failed!",
            "The message failed to send! Please try again later.");
      }
    }
  };
  cancelMsg.onclick = function (){
    globalMsgInp.value = "";
    closeModal(privateMessageModal);
    openModal(familyModal, familyData.uid);
  };

  openModal(privateMessageModal, "addGlobalMsgModal");

  closePrivateMessageModal.onclick = function() {
    closeModal(privateMessageModal);
  };
}

function generateFamilyMemberList(liItem, familyMemberArr) {
  let tempFamilyMemberName = "";

  for (let a = 0; a < loadedFamilyMembersArr.length; a++) {
    document.getElementById(loadedFamilyMembersArr[a]).remove();
  }
  loadedFamilyMembersArr = [];

  if (familyMemberArr.length > 0) {
    for (let i = 0; i < familyMemberArr.length; i++) {
      let liItem = document.createElement("LI");
      let familyMember = findUIDItemInArr(familyMemberArr[i], userArr);

      if (!loadedFamilyMembersArr.includes(familyMemberArr[i])) {
        liItem.id = familyMemberArr[i];
        liItem.className = "gift";
        tempFamilyMemberName = userArr[familyMember].name;
        if (userArr[familyMember].secretSanta == undefined)
          userArr[familyMember].secretSanta = 0;
        if (userArr[familyMember].secretSantaName == undefined)
          userArr[familyMember].secretSantaName = "";

        if (userArr[familyMember].secretSanta == 1 && userArr[familyMember].secretSantaName == "") {
          tempFamilyMemberName += " - Signed Up For Secret Santa!"
        } else if (userArr[familyMember].secretSanta == 1 && userArr[familyMember].secretSantaName != "") {
          tempFamilyMemberName += " - Assigned A Name!"
        }
        let textNode = document.createTextNode(tempFamilyMemberName);
        liItem.appendChild(textNode);
        familyListContainer.insertBefore(liItem, familyListContainer.childNodes[0]);

        loadedFamilyMembersArr.push(familyMemberArr[i]);
      }
    }
  } else {
    let liItem = document.createElement("LI");
    liItem.id = "testFamily";
    liItem.className = "gift";
    let textNode = document.createTextNode("No Family Members Found!");
    liItem.appendChild(textNode);
    familyListContainer.insertBefore(liItem, familyListContainer.childNodes[0]);
    loadedFamilyMembersArr.push("testFamily");
  }
}

function removeFamilyFromDB(uidToRemove) {
  firebase.database().ref("family/").child(uidToRemove).remove();
}

function removeFamilyElement(uid) {
  document.getElementById("family" + uid).remove();

  dataCounter--;
  if (dataCounter == 0){
    deployListEmptyNotification("No Families Found!");
  }
}

function addFamilyToDB(familyName){
  let newUid = firebase.database().ref("family").push();
  newUid = newUid.toString();
  newUid = findUIDInString(newUid);

  firebase.database().ref("family/" + newUid).set({
    uid: newUid,
    name: familyName
  });

  closeModal(familyAddModal);
}
