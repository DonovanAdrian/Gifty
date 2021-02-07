/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let familyUpdateElements = [];
let listeningFirebaseRefs = [];
let inviteArr = [];
let userArr = [];
let familyArr = [];
let familyMemberArr = [];
let loadedFamilyLinksArr = [];
let oldFamilyMemberArr = [];
let oldFamilyLinksArr = [];

let moderationSet = 1;
let onlineInt = 0;
let familyCounter = 0;
let loadingTimerInt = 0;

let familyData;
let inviteNote;
let settingsNote;
let dataListContainer;
let testData;
let addMember;
let familySettings;
let familyMemberViewModal;
let closeFamilyMemberViewModal;
let familyMemberName;
let familyMemberUserName;
let familyMemberUID;
let removeFamilyMember;
let familyAddModal;
let closeFamilyAddModal;
let familyMemberInp;
let addMemberInfo;
let addFamilyMember;
let cancelFamilyMember;
let familyNameModal;
let closeFamilyNameModal;
let familyNameInp;
let updateFamilyName;
let cancelFamilyName;
let familyLinkModal;
let closeFamilyLinkModal;
let familyLinkInp;
let familyLinkInfo;
let addFamilyLink;
let cancelFamilyLink;
let familyLinkViewModal;
let closeFamilyLinkViewModal;
let familyLinkViewTitle;
let familyLinkViewContainer;
let familySettingsModal;
let familySettingsTitle;
let closeFamilySettings;
let changeFamilyName;
let linkFamilies;
let existingLinks;
let confirmMemberModal;
let closeConfirmMemberModal;
let confirmMemberTitle;
let confMemberUserName;
let addMemberConfirm;
let addMemberDeny;
let offlineModal;
let offlineSpan;
let notificationModal;
let noteSpan;
let notificationTitle;
let notificationInfo;
let offlineTimer;
let loadingTimer;
let userInitial;
let userInvites;
let familyInitial;



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
    familyData = JSON.parse(sessionStorage.familyData);
  } catch (err) {
    console.log(err.toString());
    window.location.href = "index.html";
  }
}

window.onload = function instantiate() {

  inviteNote = document.getElementById('inviteNote');
  settingsNote = document.getElementById('settingsNote');
  dataListContainer = document.getElementById('dataListContainer');
  testData = document.getElementById('testData');
  addMember = document.getElementById('addMember');
  familySettings = document.getElementById('familySettings');
  familyMemberViewModal = document.getElementById('familyMemberViewModal');
  closeFamilyMemberViewModal = document.getElementById('closeFamilyMemberViewModal');
  familyMemberName = document.getElementById('familyMemberName');
  familyMemberUserName = document.getElementById('familyMemberUserName');
  familyMemberUID = document.getElementById('familyMemberUID');
  removeFamilyMember = document.getElementById('removeFamilyMember');
  familyAddModal = document.getElementById('familyAddModal');
  closeFamilyAddModal = document.getElementById('closeFamilyAddModal');
  familyMemberInp = document.getElementById('familyMemberInp');
  addMemberInfo = document.getElementById('addMemberInfo');
  addFamilyMember = document.getElementById('addFamilyMember');
  cancelFamilyMember = document.getElementById('cancelFamilyMember');
  familyNameModal = document.getElementById('familyNameModal');
  closeFamilyNameModal = document.getElementById('closeFamilyNameModal');
  familyNameInp = document.getElementById('familyNameInp');
  updateFamilyName = document.getElementById('updateFamilyName');
  cancelFamilyName = document.getElementById('cancelFamilyName');
  familyLinkModal = document.getElementById('familyLinkModal');
  closeFamilyLinkModal = document.getElementById('closeFamilyLinkModal');
  familyLinkInp = document.getElementById('familyLinkInp');
  familyLinkInfo = document.getElementById('familyLinkInfo');
  addFamilyLink = document.getElementById('addFamilyLink');
  cancelFamilyLink = document.getElementById('cancelFamilyLink');
  familyLinkViewModal = document.getElementById('familyLinkViewModal');
  closeFamilyLinkViewModal = document.getElementById('closeFamilyLinkViewModal');
  familyLinkViewTitle = document.getElementById('familyLinkViewTitle');
  familyLinkViewContainer = document.getElementById('familyLinkViewContainer');
  familySettingsModal = document.getElementById('familySettingsModal');
  familySettingsTitle = document.getElementById('familySettingsTitle');
  closeFamilySettings = document.getElementById('closeFamilySettings');
  changeFamilyName = document.getElementById('changeFamilyName');
  linkFamilies = document.getElementById('linkFamilies');
  existingLinks = document.getElementById('existingLinks');
  confirmMemberModal = document.getElementById('confirmMemberModal');
  closeConfirmMemberModal = document.getElementById('closeConfirmMemberModal');
  confirmMemberTitle = document.getElementById('confirmMemberTitle');
  confMemberUserName = document.getElementById('confMemberUserName');
  addMemberConfirm = document.getElementById('addMemberConfirm');
  addMemberDeny = document.getElementById('addMemberDeny');
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  notificationModal = document.getElementById('notificationModal');
  noteSpan = document.getElementById('closeNotification');
  notificationTitle = document.getElementById('notificationTitle');
  notificationInfo = document.getElementById('notificationInfo');
  familyUpdateElements = [inviteNote, settingsNote, dataListContainer, testData, addMember, familySettings,
    familyMemberViewModal, closeFamilyMemberViewModal, familyMemberName, familyMemberUserName, familyMemberUID,
    removeFamilyMember, familyAddModal, closeFamilyAddModal, familyMemberInp, addMemberInfo, addFamilyMember,
    cancelFamilyMember, familyNameModal, closeFamilyNameModal, familyNameInp, familyLinkInfo, updateFamilyName,
    cancelFamilyName, familyLinkModal, closeFamilyLinkModal, familyNameInp, updateFamilyName, cancelFamilyName,
    familyLinkModal, closeFamilyLinkModal, familyLinkInp, addFamilyLink, cancelFamilyLink, familyLinkViewModal,
    closeFamilyLinkViewModal, familyLinkViewTitle, familyLinkViewContainer, familySettingsModal, familySettingsTitle,
    closeFamilySettings, changeFamilyName, linkFamilies, existingLinks, confirmMemberModal, closeConfirmMemberModal,
    confirmMemberTitle, confMemberUserName, addMemberConfirm, addMemberDeny, offlineModal, offlineSpan,
    notificationModal, noteSpan, notificationTitle, notificationInfo];
  verifyElementIntegrity(familyUpdateElements);
  getCurrentUser();
  commonInitialization();

  userInitial = firebase.database().ref("users/");
  userInvites = firebase.database().ref("users/" + user.uid + "/invites");
  familyInitial = firebase.database().ref("family/");

  loadingTimer = setInterval(function(){
    loadingTimerInt = loadingTimerInt + 1000;
    if(loadingTimerInt >= 2000){
      if(loadingTimerInt >= 5000){
        clearInterval(loadingTimer);
        if (testData == undefined) {
          //console.log("testGift Missing. Loading Properly.");
        } else {
          deployFamilyListEmptyNotification();
        }
      } else {
        if (testData == undefined) {
          //console.log("testGift Missing. Loading Properly.");
        } else {
          testData.innerHTML = "Loading... Please Wait...";
        }
      }
    }
  }, 1000);

  databaseQuery();

  familyModerateButton();

  addMember.innerHTML = "Add Member";

  addMember.onclick = function() {
    generateAddMemberModal();
  };

  familySettings.innerHTML = "Family Settings";

  familySettings.onclick = function() {
    generateFamilySettingsModal();
  };

  if(familyData.members != null)
    if(familyData.members.length > 0)
      for(let i = 0; i < familyData.members.length; i++) {
        let a = findUIDItemInArr(familyData.members[i], userArr);
        createFamilyMemberElement(userArr[a]);
      }
    else
      deployFamilyListEmptyNotification();
  else
    deployFamilyListEmptyNotification();

  function generateAddMemberModal() {
    let familyMemberFound = false;

    addFamilyMember.onclick = function() {
      if(familyMemberInp.value != "" || (familyMemberInp.value.includes(" ") &&
          isAlph(familyMemberInp.value.charAt(0)))) {
        for (let i = 0; i < userArr.length; i++)
          if(familyMemberInp.value.toLowerCase() == userArr[i].userName.toLowerCase()) {
            familyMemberFound = true;
            if(familyData.members != null)
              if (!familyData.members.includes(userArr[i].uid)) {
                generateConfirmDataModal(userArr[i].name, "Confirm Member Name Below",
                    "user", userArr[i].uid);
              } else {
                console.log("User is already in this family!");
                addMemberInfo.innerHTML = "That user is already added to this family, please try another!";
              }
            else
              generateConfirmDataModal(userArr[i].name, "Confirm Member Name Below",
                  "user", userArr[i].uid);
            break;
          }
        if(!familyMemberFound) {
          console.log("UserName Doesn't Exist!");
          addMemberInfo.innerHTML = "That user name does not exist, please try again!";
        }
      }
    };

    cancelFamilyMember.onclick = function() {
      addMemberInfo.innerHTML = "";
      familyMemberInp.value = "";
      closeModal(familyAddModal);
    };

    openModal(familyAddModal, "familyAddModal");

    closeFamilyAddModal.onclick = function() {
      addMemberInfo.innerHTML = "";
      closeModal(familyAddModal);
    };

    window.onclick = function(event) {
      if (event.target == familyAddModal) {
        addMemberInfo.innerHTML = "";
        closeModal(familyAddModal);
      }
    };
  }

  function generateConfirmDataModal(dataToConfirm, confirmString, confirmType, dataUID){
    closeModal(familyAddModal);
    confirmMemberTitle.innerHTML = confirmString;

    confMemberUserName.innerHTML = "Did you mean " + dataToConfirm + "?";

    addMemberConfirm.onclick = function() {
      if (confirmType == "user"){
        addMemberInfo.innerHTML = "";
        familyMemberInp.value = "";
        addFamilyMemberToDB(dataUID);
      } else if (confirmType == "link") {
        familyLinkInp.value = "";
        addFamilyLinkToDB(dataUID);
      }
      closeModal(confirmMemberModal);
      return true;
    };

    addMemberDeny.onclick = function() {
      closeModal(confirmMemberModal);
      if (confirmType == "user")
        openModal(familyAddModal, "familyAddModal");
      else if (confirmType == "link")
        openModal(familyLinkModal, "familyLinkModal");
      return false;
    }

    openModal(confirmMemberModal, "confirmMemberModal");

    closeConfirmMemberModal.onclick = function() {
      closeModal(confirmMemberModal);
      openModal(familyAddModal, "familyAddModal");
    };

    window.onclick = function(event) {
      if (event.target == confirmMemberModal) {
        closeModal(confirmMemberModal);
      }
    };
  }

  function generateFamilySettingsModal() {
    familySettingsTitle.innerHTML = familyData.name + " Settings";

    changeFamilyName.onclick = function() {
      closeModal(familySettingsModal);
      generateFamilyNameModal();
    };

    linkFamilies.onclick = function() {
      closeModal(familySettingsModal);
      generateFamilyLinkModal();
    };

    existingLinks.onclick = function() {
      closeModal(familySettingsModal);
      generateFamilyLinkViewModal();
    };

    openModal(familySettingsModal, "familySettingsModal");

    closeFamilySettings.onclick = function() {
      closeModal(familySettingsModal);
    };

    window.onclick = function(event) {
      if (event.target == familySettingsModal) {
        closeModal(familySettingsModal);
      }
    };
  }

  function generateFamilyNameModal() {
    updateFamilyName.onclick = function() {
      if(familyNameInp.value != "" || (familyNameInp.value.includes(" ") &&
          isAlph(familyNameInp.value.charAt(0)))) {
        changeFamilyNameInDB(familyNameInp.value);
        familyNameInp.value = "";
        closeModal(familyNameModal);
      }
    };

    cancelFamilyName.onclick = function() {
      familyNameInp = "";
      closeModal(familyNameModal);
    };

    openModal(familyNameModal, "familyNameModal");

    closeFamilyNameModal.onclick = function() {
      closeModal(familyNameModal);
    };

    window.onclick = function(event) {
      if (event.target == familyNameModal) {
        closeModal(familyNameModal);
      }
    };
  }

  function generateFamilyLinkModal() {
    addFamilyLink.onclick = function() {
      findFamilyInDB(familyLinkInp.value);
    };

    cancelFamilyLink.onclick = function() {
      familyLinkInp.value = "";
      familyLinkInfo.innerHTML = "";
      closeModal(familyLinkModal);
    };

    openModal(familyLinkModal, "familyLinkModal");

    closeFamilyLinkModal.onclick = function() {
      familyLinkInfo.innerHTML = "";
      closeModal(familyLinkModal);
    };

    window.onclick = function(event) {
      if (event.target == familyLinkModal) {
        familyLinkInfo.innerHTML = "";
        closeModal(familyLinkModal);
      }
    };
  }

  function generateConfirmFamilyLink(familyToLinkUID) {
    for(let i = 0; i < familyArr.length; i++)
      if(familyArr[i].uid == familyToLinkUID)
        generateConfirmDataModal(familyArr[i].name, "Confirm Family Name Below",
            "link", familyArr[i].uid);
  }

  function addFamilyLinkToDB(uidToLink){
    let familyLinksArr = [];
    let otherFamilyLinksArr = [];
    if(familyData.connections != null)
      familyLinksArr = familyData.connections;

    console.log("UID to add: " + uidToLink);

    //add other family to current family
    console.log(familyLinksArr);
    if (familyLinksArr.length == 0) {
      console.log("Create new array");
      firebase.database().ref("family/" + familyData.uid).update({
        connections: {0: uidToLink}
      });
    } else {
      familyLinksArr.push(uidToLink);
      console.log("Add to existing array");
      console.log(familyLinksArr);
      firebase.database().ref("family/" + familyData.uid).update({
        connections: familyLinksArr
      });
    }

    //Add current family to other family
    for(let i = 0; i < familyArr.length; i++)
      if(uidToLink == familyArr[i].uid) {
        if(familyArr[i].connections != null)
          otherFamilyLinksArr = familyArr[i].connections;
        break;
      }

    console.log(otherFamilyLinksArr);
    if (otherFamilyLinksArr.length == 0) {
      console.log("Create new array");
      firebase.database().ref("family/" + uidToLink).update({
        connections: {0: familyData.uid}
      });
    } else {
      otherFamilyLinksArr.push(familyData.uid);
      console.log("Add to existing array");
      console.log(otherFamilyLinksArr);
      firebase.database().ref("family/" + uidToLink).update({
        connections: otherFamilyLinksArr
      });
    }
  }

  function generateFamilyLinkViewModal() {
    familyLinkViewTitle.innerHTML = familyData.name + " Links";

    initializeFamilyLinks();

    openModal(familyLinkViewModal, "familyLinkViewModal");

    closeFamilyLinkViewModal.onclick = function() {
      closeModal(familyLinkViewModal);
    };

    window.onclick = function(event) {
      if (event.target == familyLinkViewModal) {
        closeModal(familyLinkViewModal);
      }
    };
  }

  function initializeFamilyLinks() {
    let familyDataConnections = familyData.connections;
    try {
      testFamily.remove();
    } catch (err) {}

    if (familyDataConnections != null)
      for (let i = 0; i < familyDataConnections.length; i++)
        if (!loadedFamilyLinksArr.includes(familyDataConnections[i])) {
          for (let a = 0; a < familyArr.length; a++)
            if (familyDataConnections[i] == familyArr[a].uid)
              createFamilyLink(familyArr[a]);
          loadedFamilyLinksArr.push(familyData.connections[i]);
        } else
          deployConnectionListEmptyNotification();

    if(loadedFamilyLinksArr.length == 0)
      deployConnectionListEmptyNotification();

  }

  function removeFamilyLinkFromDB(uidToRemove) {
    let familyConnectionsToRemoveArr = familyData.connections;
    let otherFamilyConnectionsToRemoveArr = [];
    let uidToRemoveLocation = 0

    //Remove link from current family
    for(let i = 0; i < familyConnectionsToRemoveArr.length; i++)
      if(familyConnectionsToRemoveArr[i] == uidToRemove) {
        console.log("Remove " + familyConnectionsToRemoveArr[i]);
        familyConnectionsToRemoveArr.splice(i, 1);

        firebase.database().ref("family/" + familyData.uid).update({
          connections: familyConnectionsToRemoveArr
        });
      }

    try {
      document.getElementById("link" + uidToRemove).remove();

      uidToRemoveLocation = findUIDItemInArr(uidToRemove, loadedFamilyLinksArr);
      loadedFamilyLinksArr.splice(uidToRemoveLocation, 1);

      if(loadedFamilyLinksArr.length == 0)
        deployConnectionListEmptyNotification();
    } catch (err) {}
    familyData.connections = familyConnectionsToRemoveArr;

    //Remove link from other family
    for(let i = 0; i < familyArr.length; i++)
      if(familyArr[i].uid == uidToRemove) {
        otherFamilyConnectionsToRemoveArr = familyArr[i].connections;
        for (let a = 0; a < otherFamilyConnectionsToRemoveArr.length; a++)
          if (otherFamilyConnectionsToRemoveArr[a] == familyData.uid) {
            console.log("Remove " + otherFamilyConnectionsToRemoveArr[a]);
            otherFamilyConnectionsToRemoveArr.splice(a, 1);

            firebase.database().ref("family/" + uidToRemove).update({
              connections: otherFamilyConnectionsToRemoveArr
            });
          }
      }
  }

  function createFamilyLink(linkedFamilyData) {
    let liItem = document.createElement("LI");
    liItem.id = "link" + linkedFamilyData.uid;
    liItem.className = "gift";
    liItem.onclick = function (){
      familyMemberName.innerHTML = linkedFamilyData.name;
      if(linkedFamilyData.members != null)
        familyMemberUserName.innerHTML = "# Members: " + linkedFamilyData.members.length;
      else
        familyMemberUserName.innerHTML = "# Members: 0";
      familyMemberUID.innerHTML = linkedFamilyData.uid;

      removeFamilyMember.onclick = function() {
        removeFamilyLinkFromDB(linkedFamilyData.uid);
        closeModal(familyMemberViewModal);
        openModal(familyLinkViewModal, "familyLinkViewModal");
      };

      //show modal
      closeModal(familyLinkViewModal);
      openModal(familyMemberViewModal, linkedFamilyData.uid);

      //close on close
      closeFamilyMemberViewModal.onclick = function() {
        closeModal(familyMemberViewModal);
        openModal(familyLinkViewModal, "familyLinkViewModal");
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == familyMemberViewModal) {
          closeModal(familyMemberViewModal);
        }
      };
    };
    let textNode = document.createTextNode(linkedFamilyData.name);
    liItem.appendChild(textNode);

    familyLinkViewContainer.insertBefore(liItem, familyLinkViewContainer.childNodes[0]);
  }

  function isAlph(rChar){
    rChar = rChar.toUpperCase();
    switch (rChar){
      case "A":
      case "B":
      case "C":
      case "D":
      case "E":
      case "F":
      case "G":
      case "H":
      case "I":
      case "J":
      case "K":
      case "L":
      case "M":
      case "N":
      case "O":
      case "P":
      case "Q":
      case "R":
      case "S":
      case "T":
      case "U":
      case "V":
      case "W":
      case "X":
      case "Y":
      case "Z":
        return true;
      default:
        return false;
    }
  }

  function familyModerateButton(){
    let nowConfirm = 0;
    let alternator = 0;
    console.log("Settings Button Feature Active");
    setInterval(function(){
      nowConfirm = nowConfirm + 1000;
      if(nowConfirm >= 3000){
        nowConfirm = 0;
        if(alternator == 0) {
          alternator++;
          settingsNote.innerHTML = "Settings";
          settingsNote.style.background = "#00c606";
        } else {
          alternator--;
          settingsNote.innerHTML = "Family";
          settingsNote.style.background = "#00ad05";
        }
      }
    }, 1000);
  }

  function databaseQuery() {

    let fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1)
          userArr[i] = data.val();

        if(data.key == user.uid)
          user = data.val();
      });

      postRef.on('child_changed', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1)
          userArr[i] = data.val();

        for(let b = 0; i < familyData.members.length; i++)
          if(userArr[i].uid == familyData.members[b])
            changeFamilyMemberElement(userArr[i]);

        if(data.key == user.uid)
          user = data.val();
      });

      postRef.on('child_removed', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1)
          userArr.splice(i, 1);
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

    let fetchFamilies = function (postRef){
      postRef.on('child_added', function (data) {
        familyArr.push(data.val());
      });

      postRef.on('child_changed', function (data) {
        if(familyData.uid == data.key) {
          familyData = data.val();
          sessionStorage.setItem("familyData", JSON.stringify(familyData));

          if(familyData.members != null) {
            oldFamilyMemberArr = familyData.members;
            if (oldFamilyMemberArr.length != familyData.members.length) {
              console.log("Something Changed! (FamilyMemberArr)");
              location.reload();
            }
          }

          if(familyData.connections != null) {
            oldFamilyLinksArr = familyData.connections;
            if (oldFamilyLinksArr.length != familyData.connections.length) {
              console.log("Something Changed! (FamilyConnectionsArr)");
              location.reload();
            }
          }
        }

        let i = findUIDItemInArr(data.key, familyArr);
        if(familyArr[i] != data.val() && i != -1) {
          familyArr[i] = data.val();
        }
      });

      postRef.on('child_removed', function (data) {
        if(data.key == familyData.uid)
          newNavigation(15);//family.html

        let i = findUIDItemInArr(data.key, familyArr);
        if(familyArr[i] != data.val() && i != -1) {
          familyArr.splice(i, 1);
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

  function findUIDItemInArr(item, userArray){
    for(let i = 0; i < userArray.length; i++)
      if(userArray[i].uid == item)
        return i;
    return -1;
  }

  function createFamilyMemberElement(familyMemberData){
    try{
      testData.remove();
    } catch (err) {}

    let liItem = document.createElement("LI");
    liItem.id = "family" + familyMemberData.uid;
    liItem.className = "gift";
    liItem.onclick = function (){
      familyMemberName.innerHTML = familyMemberData.name;
      familyMemberUserName.innerHTML = familyMemberData.userName;
      familyMemberUID.innerHTML = familyMemberData.uid;

      removeFamilyMember.onclick = function() {
        removeFamilyMemberFromDB(familyMemberData.uid);
      };

      //show modal
      openModal(familyMemberViewModal, familyMemberData.uid);

      //close on close
      closeFamilyMemberViewModal.onclick = function() {
        closeModal(familyMemberViewModal);
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == familyMemberViewModal) {
          closeModal(familyMemberViewModal);
        }
      };
    };
    let textNode = document.createTextNode(familyMemberData.name);
    liItem.appendChild(textNode);

    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
    clearInterval(offlineTimer);
    familyCounter++;
  }

  function changeFamilyMemberElement(familyMemberData) {
    let editGift = document.getElementById('family' + familyMemberData.uid);
    editGift.innerHTML = familyMemberData.name;
    editGift.className = "gift";
    editGift.onclick = function (){
      familyMemberName.innerHTML = familyMemberData.name;
      familyMemberUserName.innerHTML = familyMemberData.userName;
      familyMemberUID.innerHTML = familyMemberData.uid;

      removeFamilyMember.onclick = function() {
        removeFamilyMemberFromDB(familyMemberData.uid);
      };

      //show modal
      openModal(familyMemberViewModal, familyMemberData.uid);

      //close on close
      closeFamilyMemberViewModal.onclick = function() {
        closeModal(familyMemberViewModal);
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == familyMemberViewModal) {
          closeModal(familyMemberViewModal);
        }
      };
    };
  }

  function removeFamilyMemberFromDB(uid) {

    for (let i = 0; i < familyData.members.length; i++)
      if (uid == familyData.members[i])
        familyData.members.splice(i, 1);

    sessionStorage.setItem("familyData", JSON.stringify(familyData));

    firebase.database().ref("family/" + familyData.uid).update({
      members: familyData.members
    });

    location.reload();
  }


  function removeFamilyMemberElement(uid) {
    //For now this function has been deprecated because I opped for a page reload instead of
    //finding what was different between two arrays
    document.getElementById('family' + uid).remove();

    familyCounter--;
    if (familyCounter == 0){
      deployFamilyListEmptyNotification();
    }
  }

  function findFamilyInDB(familyLinkData){
    let foundFamilyToLink = false;
    let foundFamilyToLinkUID = "";

    console.log(familyLinkData);
    console.log(typeof(familyLinkData));

    if (familyLinkData.length > 15 && familyLinkData.match(
        "^(?=.*[a-zA-Z]+)(?=.*[0-9]+)[-]+[a-zA-Z0-9]+$")) {
      console.log("This is a UID! " + familyLinkData);
      foundFamilyToLink = true;
      foundFamilyToLinkUID = familyLinkData;
    } else {
      console.log("This is (potentially) a family name! " + familyLinkData);
      for (let i = 0; i < familyArr.length; i++)
        if (familyArr[i].name.toLowerCase() == familyLinkData.toLowerCase()) {
          console.log("It is a family name!" + familyArr[i].uid);
          foundFamilyToLink = true;
          foundFamilyToLinkUID = familyArr[i].uid;
          break;
        }
    }

    if(foundFamilyToLink) {
      if(familyData.connections != null)
        if(!familyData.connections.includes(foundFamilyToLinkUID)) {
          closeModal(familyLinkModal);
          familyLinkInfo.innerHTML = "";
          generateConfirmFamilyLink(foundFamilyToLinkUID);
        } else {
          familyLinkInfo.innerHTML = "This family has already been linked, please try another!";
        }
      else {
        closeModal(familyLinkModal);
        familyLinkInfo.innerHTML = "";
        generateConfirmFamilyLink(foundFamilyToLinkUID);
      }
    } else {
      familyLinkInfo.innerHTML = "Family does not exist, please try again!";
    }
  }

  function changeFamilyNameInDB(newFamilyName){
    firebase.database().ref("family/" + familyData.uid).update({
      name:newFamilyName
    });
    newNavigation(15);//family.html
  }

  function addFamilyMemberToDB(memberUID){
    if(familyData.members != null)
      if (familyData.members.length == 0) {
        familyData.members = [];
        familyData.members.push(memberUID);
        sessionStorage.setItem("familyData", JSON.stringify(familyData));
        let a = findUIDItemInArr(memberUID, userArr);
        createFamilyMemberElement(userArr[a]);
        firebase.database().ref("family/" + familyData.uid).update({
          members: {0: memberUID}
        });
        create
      } else {
        familyData.members.push(memberUID);
        sessionStorage.setItem("familyData", JSON.stringify(familyData));
        let a = findUIDItemInArr(memberUID, userArr);
        createFamilyMemberElement(userArr[a]);
        firebase.database().ref("family/" + familyData.uid).update({
          members: familyData.members
        });
      }
    else {
      familyData.members = [];
      familyData.members.push(memberUID);
      sessionStorage.setItem("familyData", JSON.stringify(familyData));
      let a = findUIDItemInArr(memberUID, userArr);
      createFamilyMemberElement(userArr[a]);
      firebase.database().ref("family/" + familyData.uid).update({
        members: {0: memberUID}
      });
    }
  }
};

function deployConnectionListEmptyNotification(){
  try{
    testFamily.innerHTML = "No Family Connections Found!";
  } catch(err){
    console.log("Loading Element Missing, Creating A New One");
    let liItem = document.createElement("LI");
    liItem.id = "testFamily";
    liItem.className = "gift";
    let textNode = document.createTextNode("No Family Connections Found!");
    liItem.appendChild(textNode);
    familyLinkViewContainer.insertBefore(liItem, familyLinkViewContainer.childNodes[0]);
  }

  clearInterval(offlineTimer);
}

function deployFamilyListEmptyNotification(){
  clearInterval(loadingTimer);
  try{
    testData.innerHTML = "No Family Members Found!";
  } catch(err){
    console.log("Loading Element Missing, Creating A New One");
    let liItem = document.createElement("LI");
    liItem.id = "testData";
    liItem.className = "gift";
    let textNode = document.createTextNode("No Family Members Found!");
    liItem.appendChild(textNode);
    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
  }

  clearInterval(offlineTimer);
}
