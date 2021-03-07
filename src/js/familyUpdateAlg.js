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
let connectionsArr = [];
let loadedFamilyLinksArr = [];
let oldFamilyMemberArr = [];

let moderationSet = 1;
let onlineInt = 0;
let dataCounter = 0;
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
let familySettingsRemoveModal;
let familySettingsTitleR;
let closeFamilySettingsR;
let changeFamilyNameR;
let linkFamiliesR;
let existingLinksR;
let removeLinkFamilies;
let removeEntireLinkFamilies;
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
let connectionsInitial;



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
  familySettingsRemoveModal = document.getElementById('familySettingsRemoveModal');
  familySettingsTitleR = document.getElementById('familySettingsTitleR');
  closeFamilySettingsR = document.getElementById('closeFamilySettingsR');
  changeFamilyNameR = document.getElementById('changeFamilyNameR');
  linkFamiliesR = document.getElementById('linkFamiliesR');
  existingLinksR = document.getElementById('existingLinksR');
  removeLinkFamilies = document.getElementById('removeLinkFamilies');
  removeEntireLinkFamilies = document.getElementById('removeEntireLinkFamilies');
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
    closeFamilySettings, changeFamilyName, linkFamilies, familySettingsRemoveModal, familySettingsTitleR,
    closeFamilySettingsR, changeFamilyNameR, linkFamiliesR, existingLinksR, removeLinkFamilies,
    removeEntireLinkFamilies, confirmMemberModal, closeConfirmMemberModal, confirmMemberTitle, confMemberUserName,
    addMemberConfirm, addMemberDeny, offlineModal, offlineSpan, notificationModal, noteSpan, notificationTitle,
    notificationInfo];
  verifyElementIntegrity(familyUpdateElements);
  getCurrentUser();
  commonInitialization();

  userInitial = firebase.database().ref("users/");
  userInvites = firebase.database().ref("users/" + user.uid + "/invites");
  familyInitial = firebase.database().ref("family/");
  connectionsInitial = firebase.database().ref("connections/");

  loadingTimer = setInterval(function(){
    loadingTimerInt = loadingTimerInt + 1000;
    if(loadingTimerInt >= 2000){
      if(loadingTimerInt >= 5000){
        clearInterval(loadingTimer);
        if (testData == undefined) {
          console.log("testGift Missing. Loading Properly.");
        } else {
          deployFamilyListEmptyNotification();
        }
      } else {
        if (testData == undefined) {
          console.log("testGift Missing. Loading Properly.");
        } else {
          testData.innerHTML = "Loading... Please Wait...";
        }
      }
    }
  }, 1000);

  databaseQuery();

  alternateButtonLabel(settingsNote, "Settings", "Family");

  addMember.innerHTML = "Add Member";

  addMember.onclick = function() {
    generateAddMemberModal();
  };

  familySettings.innerHTML = "Family Settings";

  familySettings.onclick = function() {
    if (familyData.connections != null)
      if (familyData.connections != "")
        generateFamilySettingsRemoveModal();
      else
        generateFamilySettingsModal();
    else
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
    let familyMemberDuplicate = false;

    addFamilyMember.onclick = function() {
      if(familyMemberInp.value != "" || (familyMemberInp.value.includes(" ") &&
          isAlph(familyMemberInp.value.charAt(0)))) {
        for (let i = 0; i < userArr.length; i++)
          if(familyMemberInp.value.toLowerCase() == userArr[i].userName.toLowerCase()) {
            for(let z = 0; z < familyArr.length; z++) {
              if(familyArr[z].members != null)
                for(let y = 0; y < familyArr[z].members.length; y++)
                  if (familyArr[z].members[y] == userArr[i].uid)
                    familyMemberDuplicate = true;
            }

            if(!familyMemberDuplicate) {
              familyMemberFound = true;
              if (familyData.members != null)
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
            } else {
              console.log("User is already in another family!");
              addMemberInfo.innerHTML = "A user can only be in one family at a time! " +
                  "Link the two families OR remove this user from the other family first.";
            }
            break;
          }
        if(!familyMemberFound) {
          console.log("UserName Doesn't Exist!");
          addMemberInfo.innerHTML = "That user name does not exist, please try again!";
        }
      }
      familyMemberDuplicate = false;
      familyMemberFound = false;
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

  function generateFamilySettingsRemoveModal() {
    familySettingsTitleR.innerHTML = familyData.name + " Settings";

    changeFamilyNameR.onclick = function() {
      closeModal(familySettingsRemoveModal);
      generateFamilyNameModal();
    };

    linkFamiliesR.onclick = function() {
      closeModal(familySettingsRemoveModal);
      generateFamilyLinkModal();
    };

    existingLinksR.onclick = function() {
      closeModal(familySettingsRemoveModal);
      generateFamilyLinkViewModal();
    };

    removeLinkFamilies.onclick = function () {
      closeModal(familySettingsRemoveModal);
      removeFamilyLinkFromDB(familyData.uid);
    };

    removeEntireLinkFamilies.onclick = function () {
      let connectionIDToRemove = familyData.connections;
      let connectionsIndex = findUIDItemInArr(familyData.connections, connectionsArr);

      for (let i = 0; i < connectionsArr[connectionsIndex].families.length; i++)
        firebase.database().ref("family/" + connectionsArr[connectionsIndex].families[i]).update({
          connections: ""
        });

      firebase.database().ref("connections/").child(connectionIDToRemove).remove();

      closeModal(familySettingsRemoveModal);
    };

    openModal(familySettingsRemoveModal, "familySettingsRemoveModal");

    closeFamilySettingsR.onclick = function() {
      closeModal(familySettingsRemoveModal);
    };

    window.onclick = function(event) {
      if (event.target == familySettingsRemoveModal) {
        closeModal(familySettingsRemoveModal);
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
    let familyIndex = findUIDItemInArr(uidToLink, familyArr);
    let familyDataToUse;
    let otherFamilyData;

    if (familyData.connections != null || familyArr[familyIndex].connections != null)
      if (familyData.connections != "" || familyArr[familyIndex].connections != "") {
        if(familyData.connections != null)
          if(familyData.connections != "") {
            familyDataToUse = familyData;
            otherFamilyData = familyArr[familyIndex];
          }
        if(familyArr[familyIndex].connections != null)
          if(familyArr[familyIndex].connections != "") {
            familyDataToUse = familyArr[familyIndex];
            otherFamilyData = familyData;
          }

        console.log(otherFamilyData.connections);

        otherFamilyData.connections = familyDataToUse.connections;

        console.log(otherFamilyData.connections);
        firebase.database().ref("family/" + otherFamilyData.uid).update({
          connections: otherFamilyData.connections
        });

        for (let z = 0; z < connectionsArr.length; z++)
          if (connectionsArr[z].uid == familyDataToUse.connections) {
            console.log(connectionsArr[z].families);

            connectionsArr[z].families.push(otherFamilyData.uid);

            console.log(connectionsArr[z].families);
            firebase.database().ref("connections/" + connectionsArr[z].uid).update({
              families: connectionsArr[z].families
            });
            break;
          }
      } else {
        initializeNewConnectionInDB(uidToLink, familyIndex);
      }
    else {
      initializeNewConnectionInDB(uidToLink, familyIndex);
    }
  }

  function initializeNewConnectionInDB(uidToLink, familyIndex){
    let newUid = firebase.database().ref("connections").push();
    newUid = newUid.toString();
    newUid = newUid.substr(51, newUid.length);
    console.log(newUid);

    firebase.database().ref("connections/" + newUid).set({
      uid: newUid,
      families: [familyData.uid, uidToLink]
    });

    familyData.connections = newUid;
    firebase.database().ref("family/" + familyData.uid).update({
      connections: newUid,
    });

    familyArr[familyIndex].connections = newUid;
    firebase.database().ref("family/" + uidToLink).update({
      connections: newUid
    });
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
    try {
      testFamily.remove();
    } catch (err) {}

    if (familyData.connections != null)
      for (let i = 0; i < connectionsArr.length; i++) {
        if (connectionsArr[i].uid == familyData.connections) {
          for (let z = 0; z < connectionsArr[i].families.length; z++) {
            let familyIndex = findUIDItemInArr(connectionsArr[i].families[z], familyArr);
            if (!loadedFamilyLinksArr.includes(familyArr[familyIndex].uid)) {
              createFamilyLink(familyArr[familyIndex]);
              loadedFamilyLinksArr.push(familyArr[familyIndex].uid);
            }
          }
          break;
        }
      }
    else
      deployConnectionListEmptyNotification();
  }

  function removeFamilyLinkFromDB(uidToRemove) {
    let removalIndex = -1;
    console.log("Removing " + uidToRemove + "...");
    for (let i = 0; i < connectionsArr.length; i++)
      if (connectionsArr[i].uid == familyData.connections) {
        if (connectionsArr[i].families.length > 2) {
          for (let y = 0; y < connectionsArr[i].families.length; y++)
            if (uidToRemove == connectionsArr[i].families[y])
              removalIndex = y;
          console.log("Removing " + removalIndex + ": " + connectionsArr[i].families[removalIndex]);

          if (removalIndex != -1) {

            connectionsArr[i].families.splice(removalIndex, 1);

            firebase.database().ref("connections/" + connectionsArr[i].uid).update({
              families: connectionsArr[i].families
            });

            firebase.database().ref("family/" + uidToRemove).update({
              connections: ""
            });
          } else {
            alert("The family could not be removed from the Database! Please refresh the page and try again.");
          }
        } else {
          console.log("Removing connection item from DB");
          for(let z = 0; z < familyArr.length; z++)
            if(familyArr[z].connections == connectionsArr[i].uid)
              firebase.database().ref("family/" + familyArr[z].uid).update({
                connections: ""
              });

          firebase.database().ref("connections/").child(connectionsArr[i].uid).remove();
        }
        break;
      }
  }

  function createFamilyLink(linkedFamilyData) {
    let textNode;

    console.log(linkedFamilyData.name + " open");
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
        let connectionIDChecker = findUIDItemInArr(linkedFamilyData.connections, connectionsArr);
        console.log("Checking " + connectionIDChecker);

        document.getElementById("link" + linkedFamilyData.uid).remove();
        let loadedIndex = loadedFamilyLinksArr.indexOf(linkedFamilyData.uid);
        loadedFamilyLinksArr.splice(loadedIndex, 1);
        closeModal(familyMemberViewModal);
        if(linkedFamilyData.uid != familyData.uid && connectionsArr[connectionIDChecker].families.length > 2)
          openModal(familyLinkViewModal, "familyLinkViewModal");

        removeFamilyLinkFromDB(linkedFamilyData.uid);
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
    if (linkedFamilyData.uid == familyData.uid)
      textNode = document.createTextNode(linkedFamilyData.name + " (Current Family)");
    else
      textNode = document.createTextNode(linkedFamilyData.name);
    liItem.appendChild(textNode);

    familyLinkViewContainer.insertBefore(liItem, familyLinkViewContainer.childNodes[0]);
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

          if(familyData.connections == null && currentModalOpen == "familyLinkViewModal")
            closeModal(familyLinkViewModal);
          else
          if(familyData.connections == "" && currentModalOpen == "familyLinkViewModal")
            closeModal(familyLinkViewModal);

          if(familyData.members != null) {
            oldFamilyMemberArr = familyData.members;
            if (oldFamilyMemberArr.length != familyData.members.length) {
              console.log("Something Changed! (FamilyMemberArr)");
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

    let fetchConnections = function (postRef){
      postRef.on('child_added', function (data) {
        connectionsArr.push(data.val());
      });

      postRef.on('child_changed', function (data) {
        let i = findUIDItemInArr(data.key, connectionsArr);
        if(connectionsArr[i] != data.val() && i != -1)
          connectionsArr[i] = data.val();
      });

      postRef.on('child_removed', function (data) {
        let i = findUIDItemInArr(data.key, connectionsArr);
        if(connectionsArr[i] != data.val() && i != -1)
          connectionsArr.splice(i, 1);
      });
    }

    fetchData(userInitial);
    fetchInvites(userInvites);
    fetchFamilies(familyInitial);
    fetchConnections(connectionsInitial);

    listeningFirebaseRefs.push(userInitial);
    listeningFirebaseRefs.push(userInvites);
    listeningFirebaseRefs.push(familyInitial);
    listeningFirebaseRefs.push(connectionsInitial);
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
    dataCounter++;
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

    dataCounter--;
    if (dataCounter == 0){
      deployFamilyListEmptyNotification();
    }
  }

  function findFamilyInDB(familyLinkData){
    let foundFamilyToLink = false;
    let foundFamilyToLinkUID = "";

    console.log(familyLinkData);
    console.log(typeof (familyLinkData));

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
      let familyIndex = findUIDItemInArr(foundFamilyToLinkUID, familyArr);
      if (familyArr[familyIndex].uid != familyData.uid)
        if (familyArr[familyIndex].connections != null)
          if (familyArr[familyIndex].connections != "")
            if (familyData.connections != null)
              if (familyArr[familyIndex].connections == familyData.connections) {
                console.log("You have already linked this family!");
                familyLinkInfo.innerHTML = "This family has already been linked, please try another!";
              } else {
                if (familyData.connections != "") {
                  console.log("You cannot link this family more than once!");
                  familyLinkInfo.innerHTML = "This family cannot be linked more than once!";
                } else
                  validFamilyToLink(foundFamilyToLinkUID);
              }
            else
              validFamilyToLink(foundFamilyToLinkUID);
          else
            validFamilyToLink(foundFamilyToLinkUID);
        else
          validFamilyToLink(foundFamilyToLinkUID);
      else {
        console.log("You cannot link the current family!");
        familyLinkInfo.innerHTML = "You cannot link the current family to itself!";
      }
    } else {
      familyLinkInfo.innerHTML = "Family does not exist, please try again!";
    }
  }

  function validFamilyToLink(foundFamilyToLinkUID) {
    closeModal(familyLinkModal);
    familyLinkInfo.innerHTML = "";
    generateConfirmFamilyLink(foundFamilyToLinkUID);
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
