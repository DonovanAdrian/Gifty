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
let oldFamilyMemberArr = [];
let loadedPCUserArr = [];
let parentChildAlternatorsA = [0, 0];
let parentChildAlternatorsB = [0, 0];

let moderationSet = 1;
let dataCounter = 0;
let commonLoadingTimerInt = 0;

let globalParentData;
let globalChildData;
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
let familyMemberParent;
let familyMemberChild;
let familyMemberPCClear;
let removeFamilyMember;
let familyPCModal;
let closeFamilyPCModal;
let familyPCTitle;
let familyPCText;
let familyPCListContainer;
let familyPCBack;
let testFamily;
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
let familySettingsModal;
let familySettingsTitle;
let closeFamilySettings;
let changeFamilyName;
let removeAllMembers;
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
let commonLoadingTimer;
let userInitial;
let userInvites;
let familyInitial;
let parentAlternator;
let childAlternator;



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

  pageName = "FamilyUpdate";
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
  familyMemberParent = document.getElementById('familyMemberParent');
  familyMemberChild = document.getElementById('familyMemberChild');
  familyMemberPCClear = document.getElementById('familyMemberPCClear');
  removeFamilyMember = document.getElementById('removeFamilyMember');
  familyPCModal = document.getElementById('familyPCModal');
  closeFamilyPCModal = document.getElementById('closeFamilyPCModal');
  familyPCTitle = document.getElementById('familyPCTitle');
  familyPCText = document.getElementById('familyPCText');
  familyPCListContainer = document.getElementById('familyPCListContainer');
  familyPCBack = document.getElementById('familyPCBack');
  testFamily = document.getElementById('testFamily');
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
  familySettingsModal = document.getElementById('familySettingsModal');
  familySettingsTitle = document.getElementById('familySettingsTitle');
  closeFamilySettings = document.getElementById('closeFamilySettings');
  changeFamilyName = document.getElementById('changeFamilyName');
  removeAllMembers = document.getElementById('removeAllMembers');
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
    familyMemberParent, familyMemberChild, familyMemberPCClear, removeFamilyMember, familyPCModal, closeFamilyPCModal,
    familyPCTitle, familyPCText, familyPCListContainer, familyPCBack, testFamily, familyAddModal, closeFamilyAddModal,
    familyMemberInp, addMemberInfo, addFamilyMember, cancelFamilyMember, familyNameModal, closeFamilyNameModal,
    familyNameInp, updateFamilyName, cancelFamilyName, familyNameInp, updateFamilyName, cancelFamilyName,
    familySettingsModal, familySettingsTitle, closeFamilySettings, changeFamilyName, removeAllMembers,
    confirmMemberModal, closeConfirmMemberModal, confirmMemberTitle, confMemberUserName, addMemberConfirm,
    addMemberDeny, offlineModal, offlineSpan, notificationModal, noteSpan, notificationTitle, notificationInfo];
  getCurrentUser();
  commonInitialization();
  verifyElementIntegrity(familyUpdateElements);

  userInitial = firebase.database().ref("users/");
  userInvites = firebase.database().ref("users/" + user.uid + "/invites");
  familyInitial = firebase.database().ref("family/");

  databaseQuery();

  alternateButtonLabel(settingsNote, "Settings", "Family");

  addMember.innerHTML = "Add Member";

  addMember.onclick = function() {
    generateAddMemberModal();
  };

  familySettings.innerHTML = "Family Settings";

  familySettings.onclick = function() {
    generateFamilySettingsModal();
  };

  if(familyData.members != null) {
    if (familyData.members.length > 0) {
      for (let i = 0; i < familyData.members.length; i++) {
        let a = findUIDItemInArr(familyData.members[i], userArr);
        createFamilyMemberElement(userArr[a]);
      }
    } else {
      deployListEmptyNotification("No Family Members Found!");
    }
  } else {
    deployListEmptyNotification("No Family Members Found!");
  }

  function generateAddMemberModal() {
    let familyMemberFound = false;
    let familyMemberDuplicate = false;

    addFamilyMember.onclick = function() {
      if(familyMemberInp.value != "" || (familyMemberInp.value.includes(" ") &&
          isAlph(familyMemberInp.value.charAt(0)))) {
        for (let i = 0; i < userArr.length; i++) {
          if (familyMemberInp.value.toLowerCase() == userArr[i].userName.toLowerCase()) {
            for (let z = 0; z < familyArr.length; z++) {
              if (familyArr[z].members != null) {
                for (let y = 0; y < familyArr[z].members.length; y++) {
                  if (familyArr[z].members[y] == userArr[i].uid && familyArr[z].uid != familyData.uid) {
                    familyMemberDuplicate = true;
                  }
                }
              }
            }

            if (!familyMemberDuplicate) {
              familyMemberFound = true;
              if (familyData.members != null)
                if (!familyData.members.includes(userArr[i].uid)) {
                  generateConfirmDataModal("Did you mean " + userArr[i].name + "?",
                      "Confirm Member Name Below",
                      "user", userArr[i].uid);
                } else {
                  console.log("User is already in THIS family!");
                  addMemberInfo.innerHTML = "That user is already added to this family, please try another!";
                }
              else
                generateConfirmDataModal("Did you mean " + userArr[i].name + "?",
                    "Confirm Member Name Below",
                    "user", userArr[i].uid);
            } else {
              console.log("User is already in ANOTHER family!");
              addMemberInfo.innerHTML = "A user can only be in one family at a time!";
            }
            break;
          }
        }
        if(!familyMemberFound && !familyMemberDuplicate) {
          console.log("Username doesn't exist!");
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

    confMemberUserName.innerHTML = dataToConfirm;

    addMemberConfirm.onclick = function() {
      if (confirmType == "user"){
        addMemberInfo.innerHTML = "";
        familyMemberInp.value = "";
        addFamilyMemberToDB(dataUID);
      } else if (confirmType == "parentChild") {
        updateFamilyRelationsToDB();
      }
      closeModal(confirmMemberModal);
      return true;
    };

    addMemberDeny.onclick = function() {
      closeModal(confirmMemberModal);
      if (confirmType == "user") {
        openModal(familyAddModal, "familyAddModal");
      } else if (confirmType == "parentChild") {
        openModal(familyPCModal, "familyPCModal");
      }
      return false;
    }

    openModal(confirmMemberModal, "confirmMemberModal");

    closeConfirmMemberModal.onclick = function() {
      closeModal(confirmMemberModal);
      if (confirmType == "user") {
        openModal(familyAddModal, "familyAddModal");
      } else if (confirmType == "parentChild") {
        openModal(familyPCModal, "familyPCModal");
        globalChildData = null;
        globalParentData = null;
      }
    };

    window.onclick = function(event) {
      if (event.target == confirmMemberModal) {
        closeModal(confirmMemberModal);
        globalChildData = null;
        globalParentData = null;
      }
    };
  }

  function generateFamilySettingsModal() {
    familySettingsTitle.innerHTML = familyData.name + " Settings";

    changeFamilyName.onclick = function() {
      closeModal(familySettingsModal);
      generateFamilyNameModal();
    };

    removeAllMembers.onclick = function() {
      removeAllFamilyMembers(familyData);
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

  function removeAllFamilyMembers(familyRemove) {
    let i = findUIDItemInArr(familyRemove.uid, familyArr);
    familyArr[i].members = [];

    firebase.database().ref("family/" + familyRemove.uid).child("/members/").remove();
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

        if(data.key == currentModalOpen)
          closeModal(currentModalOpenObj);
      });

      postRef.on('child_removed', function (data) {
        if(data.key == currentModalOpen)
          closeModal(currentModalOpenObj);

        try {
          document.getElementById("family" + data.key).remove();
        } catch (err) {}

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

  function createFamilyMemberElement(familyMemberData){
    try {
      testData.remove();
    } catch (err) {}

    let liItem = document.createElement("LI");
    liItem.id = "family" + familyMemberData.uid;
    initFamilyElement(liItem, familyMemberData);
    let textNode = document.createTextNode(familyMemberData.name);
    liItem.appendChild(textNode);

    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
    clearInterval(commonLoadingTimer);
    clearInterval(offlineTimer);
    dataCounter++;
    if (dataCounter > buttonOpacLim) {
      familySettings.style.opacity = ".75";
    }
  }

  function changeFamilyMemberElement(familyMemberData) {
    let editFamily = document.getElementById('family' + familyMemberData.uid);
    editFamily.innerHTML = familyMemberData.name;
    initFamilyElement(editFamily, familyMemberData);
  }

  function initFamilyElement(liItem, familyMemberData) {
    liItem.className = "gift";
    liItem.onclick = function (){
      familyMemberName.innerHTML = familyMemberData.name;
      familyMemberUserName.innerHTML = familyMemberData.userName;
      familyMemberUID.innerHTML = familyMemberData.uid;

      if (familyMemberData.parentUser == null && familyMemberData.childUser == null) {
        familyMemberParent.innerHTML = "Set Parent";

        familyMemberChild.innerHTML = "Set Child";

        familyMemberPCClear.innerHTML = "Button Disabled";
        familyMemberPCClear.className += " btnDisabled";

        familyMemberParent.onclick = function() {
          generateFamilyPCModal("parent", familyMemberData);
        };

        familyMemberChild.onclick = function() {
          generateFamilyPCModal("child", familyMemberData);
        };

        familyMemberPCClear.onclick = function() {};
      } else {
        cycleParentChildText(familyMemberData);

        familyMemberPCClear.innerHTML = "Clear Parent Child Data";

        familyMemberPCClear.onclick = function() {
          clearParentChildData(familyMemberData);

          closeModal(familyMemberViewModal);
          try {
            clearInterval(parentAlternator);
            clearInterval(childAlternator);
          } catch (err) {}
        };
      }

      removeFamilyMember.onclick = function() {
        removeFamilyMemberFromDB(familyMemberData.uid);
      };

      //show modal
      openModal(familyMemberViewModal, familyMemberData.uid);

      //close on close
      closeFamilyMemberViewModal.onclick = function() {
        closeModal(familyMemberViewModal);
        try {
          clearInterval(parentAlternator);
          clearInterval(childAlternator);
        } catch (err) {}
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == familyMemberViewModal) {
          closeModal(familyMemberViewModal);
          try {
            clearInterval(parentAlternator);
            clearInterval(childAlternator);
          } catch (err) {}
        }
      };
    };
  }

  function clearParentChildData (familyMemberData) {
    let parentUser;
    let childUser;

    if (familyMemberData.parentUser != null) {
      parentUser = familyMemberData.parentUser;
      childUser = familyMemberData.uid;
    } else {
      parentUser = familyMemberData.uid;
      childUser = familyMemberData.childUser;
    }

    firebase.database().ref("users/" + parentUser).update({
      childUser: "",
      parentUser: ""
    });
    firebase.database().ref("users/" + childUser).update({
      childUser: "",
      parentUser: ""
    });

    alert("Parent and Child Data Cleared!");
  }

  function cycleParentChildText (parentChildData) {
    let parentInitText = "Click Here To Reset Parent";
    let childInitText = "Click Here To Reset Child";
    let parentAltText;
    let childAltText;

    if (parentChildData.parentUser != null) {
      let i = findUIDItemInArr(parentChildData.parentUser, userArr);
      parentAltText = "Parent: " + userArr[i].name;
      childAltText = "Child: " + parentChildData.name;
    } else {
      let i = findUIDItemInArr(parentChildData.childUser, userArr);
      parentAltText = "Parent: " + parentChildData.name;
      childAltText = "Child: " + userArr[i].name;
    }

    parentAlternator = setInterval(function(){
      setAlternatingButtonText(parentInitText, parentAltText, familyMemberParent, parentChildAlternatorsA);
    }, 1000);

    childAlternator = setInterval(function(){
      setAlternatingButtonText(childInitText, childAltText, familyMemberChild, parentChildAlternatorsB);
    }, 1000);

    familyMemberParent.onclick = function () {
      generateFamilyPCModal("parent", parentChildData);
    };
    familyMemberChild.onclick = function () {
      generateFamilyPCModal("child", parentChildData);
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

  function generateFamilyPCModal(parentChild, parentChildData) {
    closeModal(familyMemberViewModal);
    try {
      clearInterval(parentAlternator);
      clearInterval(childAlternator);
    } catch (err) {}

    if (parentChild == "child") {
      familyPCTitle.innerHTML = "Choose A Child";
    } else if (parentChild == "parent") {
      familyPCTitle.innerHTML = "Choose A Parent";
    }
    familyPCText.innerHTML = "In order to prevent parents and their YOUNG children from being paired with" +
        " each other during Secret Santa, please choose " + parentChildData.name + "\'s " + parentChild +
        " user from the list below.";

    familyPCBack.onclick = function() {
      closeModal(familyPCModal);
      openModal(familyMemberViewModal, parentChildData.uid);

      window.onclick = function(event) {
        if (event.target == familyMemberViewModal) {
          closeModal(familyMemberViewModal);
          try {
            clearInterval(parentAlternator);
            clearInterval(childAlternator);
          } catch (err) {}
        }
      };
    }

    generateFamilyPCUserList(parentChild, parentChildData);

    openModal(familyPCModal, parentChildData.uid);

    closeFamilyPCModal.onclick = function() {
      closeModal(familyPCModal);
    }

    window.onclick = function(event) {
      if (event.target == familyPCModal) {
        closeModal(familyPCModal);
      }
    };
  }

  function generateFamilyPCUserList(parentChild, parentChildOmit) {
    try {
      testFamily.remove();
    } catch (err) {}

    if (loadedPCUserArr.length != 0) {
      for (let a = 0; a < loadedPCUserArr.length; a++) {
        document.getElementById(loadedPCUserArr[a]).remove();
      }
      loadedPCUserArr = [];
    }

    if (userArr.length > 1) {
      for (let i = 0; i < userArr.length; i++) {
        if (userArr[i].uid != parentChildOmit.uid && findUIDItemInArr(userArr[i].uid, loadedPCUserArr) == -1) {
          let liItem = document.createElement("LI");
          liItem.id = userArr[i].uid;
          liItem.className = "gift";
          let textNode = document.createTextNode(userArr[i].name);

          liItem.onclick = function () {
            if (parentChild == "child") {
              globalChildData = userArr[i];
              globalParentData = parentChildOmit;
              generateConfirmDataModal("Are you sure you want " + parentChildOmit.name
                  + "\'s child to be " + userArr[i].name + "?",
                  "Confirm The Child Selection", "parentChild", null);
            } else if (parentChild == "parent") {
              globalChildData = parentChildOmit;
              globalParentData = userArr[i];
              generateConfirmDataModal("Are you sure you want " + parentChildOmit.name
                  + "\'s parent to be " + userArr[i].name + "?",
                  "Confirm The Parent Selection", "parentChild", null);
            }
          };

          liItem.appendChild(textNode);
          familyPCListContainer.insertBefore(liItem, familyPCListContainer.childNodes[0]);

          loadedPCUserArr.push(userArr[i].uid);
        }
      }
    } else {
      testFamily.innerHTML = "There is only one user in the database!";
    }
  }

  function updateFamilyRelationsToDB() {
    if (globalParentData != null && globalChildData != null) {
      firebase.database().ref("users/" + globalChildData.uid).update({
        childUser: "",
        parentUser: globalParentData.uid
      });
      firebase.database().ref("users/" + globalParentData.uid).update({
        childUser: globalChildData.uid,
        parentUser: ""
      });
    } else {
      alert("There was an error updating the parent and child of this user, please try again!");
    }

    globalChildData = null;
    globalParentData = null;
  }
};
