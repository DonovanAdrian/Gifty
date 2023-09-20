/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let initializedElementsArr = [];
let familyUpdateElements = [];
let loadedPCUserArr = [];
let globalParentData = [];
let globalChildData = [];
let expectedPCChanges = [];

let globalParentChildState = "";

let familyData;
let settingsNote;
let familySettings;
let familyMemberViewModal;
let closeFamilyMemberViewModal;
let familyMemberName;
let familyMemberUserName;
let familyMemberUID;
let familyMemberParent;
let familyMemberChild;
let familyMemberPCClear;
let parentInfoIcon;
let childInfoIcon;
let clearInfoIcon;
let removeFamilyMember;
let familyPCModal;
let closeFamilyPCModal;
let familyPCTitle;
let familyPCText;
let familyPCListContainer;
let familyPCBack;
let familyPCConfirm;
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
let changeNameInfoIcon;
let changeFamilyName;
let clearAllInfoIcon;
let clearAllPCRelationships;
let removeMembersInfoIcon;
let removeAllMembers;
let addMemberInfoIcon;
let addMember;
let confirmMemberModal;
let closeConfirmMemberModal;
let confirmMemberTitle;
let confMemberUserName;
let addMemberConfirm;
let addMemberDeny;



function checkFamilyMemberCookie() {
  try {
    familyData = JSON.parse(sessionStorage.familyData);
    if (familyData.members != null) {
      for (let i = 0; i < userArr.length; i++) {
        let memberIndex = familyData.members.indexOf(userArr[i].uid);
        if (memberIndex != -1) {
          createFamilyMemberElement(userArr[i]);
        }
      }
    }
  } catch (err) {}
}

window.onload = function instantiate() {
  failedNavNum = 16;
  pageName = "FamilyUpdate";
  inviteNote = document.getElementById("inviteNote");
  settingsNote = document.getElementById("settingsNote");
  backBtn = document.getElementById("backBtn");
  familySettings = document.getElementById("familySettings");
  familyMemberViewModal = document.getElementById("familyMemberViewModal");
  closeFamilyMemberViewModal = document.getElementById("closeFamilyMemberViewModal");
  familyMemberName = document.getElementById("familyMemberName");
  familyMemberUserName = document.getElementById("familyMemberUserName");
  familyMemberUID = document.getElementById("familyMemberUID");
  familyMemberParent = document.getElementById("familyMemberParent");
  familyMemberChild = document.getElementById("familyMemberChild");
  familyMemberPCClear = document.getElementById("familyMemberPCClear");
  parentInfoIcon = document.getElementById("parentInfoIcon");
  childInfoIcon = document.getElementById("childInfoIcon");
  clearInfoIcon = document.getElementById("clearInfoIcon");
  removeFamilyMember = document.getElementById("removeFamilyMember");
  familyPCModal = document.getElementById("familyPCModal");
  closeFamilyPCModal = document.getElementById("closeFamilyPCModal");
  familyPCTitle = document.getElementById("familyPCTitle");
  familyPCText = document.getElementById("familyPCText");
  familyPCListContainer = document.getElementById("familyPCListContainer");
  familyPCBack = document.getElementById("familyPCBack");
  familyPCConfirm = document.getElementById("familyPCConfirm");
  testFamily = document.getElementById("testFamily");
  familyAddModal = document.getElementById("familyAddModal");
  closeFamilyAddModal = document.getElementById("closeFamilyAddModal");
  familyMemberInp = document.getElementById("familyMemberInp");
  addMemberInfo = document.getElementById("addMemberInfo");
  addFamilyMember = document.getElementById("addFamilyMember");
  cancelFamilyMember = document.getElementById("cancelFamilyMember");
  familyNameModal = document.getElementById("familyNameModal");
  closeFamilyNameModal = document.getElementById("closeFamilyNameModal");
  familyNameInp = document.getElementById("familyNameInp");
  updateFamilyName = document.getElementById("updateFamilyName");
  cancelFamilyName = document.getElementById("cancelFamilyName");
  familySettingsModal = document.getElementById("familySettingsModal");
  familySettingsTitle = document.getElementById("familySettingsTitle");
  closeFamilySettings = document.getElementById("closeFamilySettings");
  changeNameInfoIcon = document.getElementById("changeNameInfoIcon");
  changeFamilyName = document.getElementById("changeFamilyName");
  clearAllInfoIcon = document.getElementById("clearAllInfoIcon");
  clearAllPCRelationships = document.getElementById("clearAllPCRelationships");
  removeMembersInfoIcon = document.getElementById("removeMembersInfoIcon");
  removeAllMembers = document.getElementById("removeAllMembers");
  addMemberInfoIcon = document.getElementById("addMemberInfoIcon");
  addMember = document.getElementById("addMember");
  confirmMemberModal = document.getElementById("confirmMemberModal");
  closeConfirmMemberModal = document.getElementById("closeConfirmMemberModal");
  confirmMemberTitle = document.getElementById("confirmMemberTitle");
  confMemberUserName = document.getElementById("confMemberUserName");
  addMemberConfirm = document.getElementById("addMemberConfirm");
  addMemberDeny = document.getElementById("addMemberDeny");

  getCurrentUserCommon();
  commonInitialization();

  familyUpdateElements = [inviteNote, settingsNote, dataListContainer, testData, backBtn, familySettings,
    familyMemberViewModal, closeFamilyMemberViewModal, familyMemberName, familyMemberUserName, familyMemberUID,
    familyMemberParent, familyMemberChild, familyMemberPCClear, removeFamilyMember, familyPCModal, closeFamilyPCModal,
    familyPCTitle, familyPCText, familyPCListContainer, familyPCBack, testFamily, familyAddModal, closeFamilyAddModal,
    familyMemberInp, addMemberInfo, addFamilyMember, cancelFamilyMember, familyNameModal, closeFamilyNameModal,
    familyNameInp, updateFamilyName, cancelFamilyName, familyNameInp, updateFamilyName, cancelFamilyName,
    familySettingsModal, familySettingsTitle, closeFamilySettings, changeNameInfoIcon, changeFamilyName,
    clearAllInfoIcon, clearAllPCRelationships, removeMembersInfoIcon, removeAllMembers, addMemberInfoIcon, addMember,
    confirmMemberModal, closeConfirmMemberModal, confirmMemberTitle, confMemberUserName, addMemberConfirm,
    addMemberDeny, offlineModal, offlineSpan, notificationModal, noteSpan, notificationTitle, notificationInfo];

  checkFamilyMemberCookie();
  verifyElementIntegrity(familyUpdateElements);

  userInitial = firebase.database().ref("users/");
  userInvites = firebase.database().ref("users/" + user.uid + "/invites");
  familyInitial = firebase.database().ref("family/");

  databaseQuery();
  alternateButtonLabel(settingsNote, "Settings", "Family");

  function initializeFamilySettingsBtn() {
    familySettings.innerHTML = "Family Settings";
    familySettings.onclick = function () {
      generateFamilySettingsModal();
    };
  }

  function initializeBackBtn() {
    backBtn.innerHTML = "Return To Family Page";
    backBtn.onclick = function() {
      navigation(15);//family.html
    };
  }

  function initializeInfoIcons() {
    parentInfoIcon.onclick = function() {
      deployNotificationModal(true, "Secret Santa Parent Restriction", "Use this " +
          "button to assign a parent to a user. By assigning a parent to a user, the user is restricted from being " +
          "assigned to the parent for Secret Santa. Additionally, the parent will automatically be assigned to the " +
          "child in return.", 6);
    };
    childInfoIcon.onclick = function() {
      deployNotificationModal(true, "Secret Santa Child Restriction", "Use this " +
          "button to assign a child to a user. By assigning a child to a user, the user is restricted from being " +
          "assigned to the child for Secret Santa. Additionally, the child will automatically be assigned to the " +
          "parent in return.", 6);
    };
    clearInfoIcon.onclick = function() {
      deployNotificationModal(true, "Clear Parent & Child Data", "This button " +
          "offers a quick way to clear any relationships between this user and their respective parent(s)/child(ren). " +
          "If you would like to clear ALL Parent/Child relationships in this family, select the \"Family Settings\" " +
          "button on the bottom left, then select \"Clear All Parent/Child Relationships\".", 4);
    };

    changeNameInfoIcon.onclick = function() {
      deployNotificationModal(true, "Change Family Name", "This button allows " +
          "you to update this family's name within Gifty.", 3);
    };
    clearAllInfoIcon.onclick = function() {
      deployNotificationModal(true, "Clear All Parent & Child Data", "This button " +
          "offers a quick way to clear ALL relationships between every user in this family.", 3);
    };
    removeMembersInfoIcon.onclick = function() {
      deployNotificationModal(true, "Remove All Members", "This button " +
          "offers a quick way to remove every member from this family.<br><br>Please note that any parent/child " +
          "relationships will also be cleared as a result.", 6);
    };
    addMemberInfoIcon.onclick = function() {
      deployNotificationModal(true, "Add Member", "This button " +
          "allows you to add a given user to this family. Please note that a given user cannot exist in two families " +
          "at the same time.", 5);
    };
  }

  initializeFamilySettingsBtn();
  initializeBackBtn();
  initializeInfoIcons();

  if(familyData.members != null) {
    if (familyData.members.length == 0) {
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
                  closeModal(familyAddModal);
                  generateConfirmDataModal("Did you mean " + userArr[i].name + "?",
                      "Confirm Member Name Below",
                      "user", userArr[i].uid);
                } else {
                  console.log("User is already in THIS family!");
                  addMemberInfo.innerHTML = "That user is already added to this family, please try another!";
                }
              else {
                closeModal(familyAddModal);
                generateConfirmDataModal("Did you mean " + userArr[i].name + "?",
                    "Confirm Member Name Below",
                    "user", userArr[i].uid);
              }
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
      generateFamilySettingsModal();
    };

    openModal(familyAddModal, "familyAddModal");

    closeFamilyAddModal.onclick = function() {
      addMemberInfo.innerHTML = "";
      closeModal(familyAddModal);
      generateFamilySettingsModal();
    };
  }

  function refreshMemberModalData() {
    let familyPCRelationshipsExist = false;

    if (familyData.members == undefined)
      familyData.members = [];

    for (let i = 0; i < userArr.length; i++) {
      if (familyData.members.includes(userArr[i].uid)) {
        if (userArr[i].parentUser != undefined) {
          if (userArr[i].parentUser != "" && userArr[i].parentUser.length > 0) {
            familyPCRelationshipsExist = true;
            break;
          }
        }
        if (userArr[i].childUser != undefined) {
          if (userArr[i].childUser != "" && userArr[i].childUser.length > 0) {
            familyPCRelationshipsExist = true;
            break;
          }
        }
      }
    }

    if (familyData.members.length == 0) {
      removeAllMembers.innerHTML = "No Members In Family";
      removeAllMembers.className = "basicBtn btnDisabled";
      removeAllMembers.onclick = function() {
        deployNotificationModal(true, "No Members In Family!", "There are currently " +
            "no members in this family, so there are no members to remove.");
      };
    } else {
      removeAllMembers.innerHTML = "Remove All Members";
      removeAllMembers.className = "basicBtn";
      removeAllMembers.onclick = function() {
        generateConfirmDataModal("Are you sure that you'd like to remove ALL the users from this family? " +
            "<br><br>Please note that upon completion, any existing parent/child relationships will be cleared and you " +
            "will be redirected to the main family page.",
            "Remove ALL Members?", "removeAllMembers", familyData);
      };
    }

    if (familyPCRelationshipsExist) {
      clearAllPCRelationships.innerHTML = "Clear All Parent/Child Relationships";
      clearAllPCRelationships.className = "basicBtn";
      clearAllPCRelationships.onclick = function() {
        generateConfirmDataModal("Are you sure that you'd like to clear ALL parent & child " +
            "relationships within this family?",
            "Clear ALL Parent & Child Relationships?", "clearAllPC", null);
      };
    } else {
      clearAllPCRelationships.innerHTML = "No Parent/Child Relationships";
      clearAllPCRelationships.className = "basicBtn btnDisabled";
      clearAllPCRelationships.onclick = function() {
        deployNotificationModal(true, "No Parent Child Relationships!", "There are " +
            "currently no parent/child relationships in this family, so there are no relationships to remove.");
      };
    }

    familySettingsTitle.innerHTML = "\"" + familyData.name + "\" Settings";
  }

  function generateFamilySettingsModal() {
    refreshMemberModalData();

    changeFamilyName.onclick = function() {
      closeModal(familySettingsModal);
      generateFamilyNameModal(familyData.name);
    };

    addMember.onclick = function() {
      generateAddMemberModal();
    };

    openModal(familySettingsModal, "familySettingsModal");

    closeFamilySettings.onclick = function() {
      closeModal(familySettingsModal);
    };
  }

  function generateFamilyNameModal() {
    familyNameInp.value = familyData.name;
    updateFamilyName.onclick = function() {
      if(familyNameInp.value != "" || (familyNameInp.value.includes(" ") &&
          isAlph(familyNameInp.value.charAt(0)))) {
        changeFamilyNameInDB(familyNameInp.value);
        familyNameInp.value = "";
        closeModal(familyNameModal);
      }
    };

    cancelFamilyName.onclick = function() {
      closeModal(familyNameModal);
      generateFamilySettingsModal();
    };

    openModal(familyNameModal, "familyNameModal");

    closeFamilyNameModal.onclick = function() {
      closeModal(familyNameModal);
      generateFamilySettingsModal();
    };
  }

  function databaseQuery() {
    let fetchData = function (postRef) {
      postRef.on("child_added", function (data) {
        let i = findUIDItemInArr(data.key, userArr, true);
        if (i != -1) {
          localObjectChanges = findObjectChanges(userArr[i], data.val());
          if (localObjectChanges.length != 0) {
            userArr[i] = data.val();

            if (data.key == user.uid) {
              user = data.val();
            }
            saveCriticalCookies();
          }
          if (familyData.members != null) {
            let memberIndex = familyData.members.indexOf(userArr[i].uid);
            if (memberIndex != -1) {
              if (initializedElementsArr.indexOf(userArr[i].uid) == -1) {
                createFamilyMemberElement(userArr[i]);
                refreshMemberModalData();
              } else {
                changeFamilyMemberElement(userArr[i]);
                refreshMemberModalData();
              }
            }
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
        let tempExpectedIndex = 0;
        let i = findUIDItemInArr(data.key, userArr, true);
        if (i != -1) {
          localObjectChanges = findObjectChanges(userArr[i], data.val());
          if (localObjectChanges.length != 0) {
            if (expectedPCChanges.length > 0) {
              tempExpectedIndex = expectedPCChanges.indexOf(data.key)
              if (tempExpectedIndex != -1) {
                expectedPCChanges.splice(tempExpectedIndex, 1);
              }
            }

            if (consoleOutput)
              console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
            userArr[i] = data.val();

            let memberIndex = familyData.members.indexOf(userArr[i].uid);
            if (memberIndex != -1) {
              changeFamilyMemberElement(userArr[i]);
              refreshMemberModalData();
            }

            if(data.key == currentModalOpen) {
              closeModal(currentModalOpenObj);
              deployNotificationModal(false, data.val().name + " Updated!",
                  data.val().name + " was updated! Please reopen the window to see the changes.");
            }

            if (data.key == user.uid) {
              user = data.val();
              updateFriendNav(user.friends);
              if(consoleOutput)
                console.log("Current User Updated");
            }
            saveCriticalCookies();
          }
        }

        if (expectedPCChanges.length > 0) {
          tempExpectedIndex = expectedPCChanges.indexOf(data.key)
          if (tempExpectedIndex != -1)
            databaseQuery();
        }
      });

      postRef.on("child_removed", function (data) {
        if(data.key == currentModalOpen) {
          closeModal(currentModalOpenObj);
          deployNotificationModal(false, data.val().name + " Removed!",
              data.val().name + " was removed! This user is no longer accessible.");
        }

        try {
          document.getElementById("family" + data.key).remove();
        } catch (err) {}

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
          console.log("Invite List Removed");
          inviteNote.style.background = "#008222";
        }
      });
    };

    let fetchFamilies = function (postRef){
      postRef.on("child_added", function (data) {
        familyArr.push(data.val());
        saveCriticalCookies();
      });

      postRef.on("child_changed", function (data) {
        if(familyData.uid == data.key) {
          familyData = data.val();

          if (familyData.members != null) {
            if (initializedElementsArr.length > familyData.members.length) {
              for (let i = 0; i < initializedElementsArr.length; i++) {
                let memberIndex = familyData.members.indexOf(initializedElementsArr[i]);
                if (memberIndex == -1) {
                  removeFamilyMemberElement(initializedElementsArr[i]);
                  refreshMemberModalData();
                  closeModal(familyMemberViewModal);
                  initializedElementsArr.splice(i, 1);
                  break;
                }
              }
            } else {
              for (let i = 0; i < familyData.members.length; i++) {
                if (initializedElementsArr.indexOf(familyData.members[i]) == -1) {
                  let userIndex = findUIDItemInArr(familyData.members[i], userArr, true);
                  createFamilyMemberElement(userArr[userIndex]);
                  refreshMemberModalData();
                  break;
                }
              }
            }
          }
        }

        let i = findUIDItemInArr(data.key, familyArr);
        if(familyArr[i] != data.val() && i != -1) {
          familyArr[i] = data.val();
          saveCriticalCookies();
        }
      });

      postRef.on("child_removed", function (data) {
        if(data.key == familyData.uid)
          navigation(15);//family.html

        let i = findUIDItemInArr(data.key, familyArr);
        if(familyArr[i] != data.val() && i != -1) {
          familyArr.splice(i, 1);
          saveCriticalCookies();
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

function removeAllFamilyMembers(familyRemove) {
  let emptyFamily = false;
  let i = findUIDItemInArr(familyRemove.uid, familyArr, true);
  if (familyArr[i].members != null) {
    if (familyArr[i].members.length == 0) {
      emptyFamily = true;
    } else {
      familyArr[i].members = [];
      firebase.database().ref("family/" + familyRemove.uid).child("/members/").remove();
      saveCriticalCookies();
    }
  } else {
    emptyFamily = true;
  }

  if (emptyFamily) {
    deployNotificationModal(true, "Family Empty!", "This family is empty, so no members can be removed!");
  } else {
    deployNotificationModal(false, "Member Removal Complete", "All members were removed from this family! " +
        "The page will now be redirected to the Family page.", 4, 15);
  }
}

function createFamilyMemberElement(familyMemberData){
  let familyMemberName = familyMemberData.name + generateParentChildSuffixString(familyMemberData);
  try {
    document.getElementById("testData").remove();
  } catch (err) {}

  let liItem = document.createElement("LI");
  liItem.id = "family" + familyMemberData.uid;
  initFamilyElement(liItem, familyMemberData);
  let textNode = document.createTextNode(familyMemberName);
  liItem.appendChild(textNode);

  dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
  clearInterval(commonLoadingTimer);
  clearInterval(offlineTimer);
  dataCounter++;
  if (dataCounter > buttonOpacLim) {
    familySettings.style.opacity = ".75";
  }
  initializedElementsArr.push(familyMemberData.uid);
}

function changeFamilyMemberElement(familyMemberData) {
  let familyMemberName = familyMemberData.name + generateParentChildSuffixString(familyMemberData);
  let editFamily = document.getElementById("family" + familyMemberData.uid);
  editFamily.innerHTML = familyMemberName;
  initFamilyElement(editFamily, familyMemberData);
}

function removeFamilyMemberElement(familyMemberUID) {
  document.getElementById("family" + familyMemberUID).remove();
}

function initFamilyElement(liItem, familyMemberData) {
  let enableClearPCData = false;

  liItem.className = "gift";
  liItem.onclick = function (){
    familyMemberName.innerHTML = familyMemberData.name;
    familyMemberUserName.innerHTML = familyMemberData.userName;
    familyMemberUID.innerHTML = familyMemberData.uid;

    if (familyData.members.length > 3) {
      familyMemberParent.className = "basicBtn";
      familyMemberChild.className = "basicBtn";

      familyMemberParent.onclick = function () {
        generateFamilyPCModal("parent", familyMemberData);
      };
      familyMemberChild.onclick = function () {
        generateFamilyPCModal("child", familyMemberData);
      };

      familyMemberData.parentUser = checkForUserStringConversionToArr(familyMemberData.parentUser);
      familyMemberData.childUser = checkForUserStringConversionToArr(familyMemberData.childUser);

      if (familyMemberData.parentUser.length == 0) {
        familyMemberParent.innerHTML = "View Parent Options";
      } else {
        enableClearPCData = true;
        if (familyMemberData.parentUser.length == 1)
          familyMemberParent.innerHTML = "1 Parent, Click To View"
        else
          familyMemberParent.innerHTML = familyMemberData.parentUser.length + " Parents, Click To View";
        if (consoleOutput) {
          console.log("Found Parent Data For " + familyMemberData.name + ":");
          console.log(familyMemberData.parentUser);
        }
      }
      if (familyMemberData.childUser.length == 0) {
        familyMemberChild.innerHTML = "View Children Options";
      } else {
        enableClearPCData = true;
        if (familyMemberData.childUser.length == 1)
          familyMemberChild.innerHTML = "1 Child, Click To View"
        else
          familyMemberChild.innerHTML = familyMemberData.childUser.length + " Children, Click To View";
        if (consoleOutput) {
          console.log("Found Child Data For " + familyMemberData.name + ":");
          console.log(familyMemberData.childUser);
        }
      }
      if (enableClearPCData) {
        familyMemberPCClear.innerHTML = "Clear Parent & Child Data";
        familyMemberPCClear.className = "basicBtn";
        familyMemberPCClear.onclick = function () {
          generateConfirmDataModal("Are you sure that you'd like any parent or children relationships " +
              "that "  + familyMemberData.name + " has are cleared? Please note that this will only clear this user's " +
              "relationships and not everyone's.",
              "Clear Parent & Child Relationship?", "clearSpecificPC", familyMemberData);
        };
      } else {
        familyMemberPCClear.innerHTML = "Button Disabled";
        familyMemberPCClear.className += " btnDisabled";

        familyMemberPCClear.onclick = function () {
          deployNotificationModal(true, "Button Disabled!", "This button is disabled, please set a parent " +
              "or child for this user first.");
        };
      }

      familyMemberParent.onclick = function () {
        generateFamilyPCModal("parent", familyMemberData);
      };
      familyMemberChild.onclick = function () {
        generateFamilyPCModal("child", familyMemberData);
      };
    } else {
      familyMemberParent.innerHTML = "Button Disabled";
      familyMemberParent.className += " btnDisabled";
      familyMemberChild.innerHTML = "Button Disabled";
      familyMemberChild.className += " btnDisabled";
      familyMemberPCClear.innerHTML = "Button Disabled";
      familyMemberPCClear.className += " btnDisabled";

      familyMemberParent.onclick = function () {
        deployNotificationModal(true, "Button Disabled!", "This button is disabled, please add more " +
            "members to this family first.");
      };
      familyMemberChild.onclick = function () {
        deployNotificationModal(true, "Button Disabled!", "This button is disabled, please add more " +
            "members to this family first.");
      };
      familyMemberPCClear.onclick = function () {
        deployNotificationModal(true, "Button Disabled!", "This button is disabled, please add more " +
            "members to this family first.");
      };
    }

    removeFamilyMember.onclick = function() {
      generateConfirmDataModal("Are you sure you'd like to remove " + familyMemberData.name + " from " +
          "this family? Please note that their parent/child relationships will also be cleared!",
          "Remove "  + familyMemberData.name, "removeFamilyMember", familyMemberData);
    };

    openModal(familyMemberViewModal, familyMemberData.uid);

    closeFamilyMemberViewModal.onclick = function() {
      closeModal(familyMemberViewModal);
    };
  };
}

function generateParentChildSuffixString(inputFamilyData) {
  let pcSuffixStr = "";
  let addedParentStatBool = false;
  let inputParentUserArr = inputFamilyData.parentUser;
  let inputChildUserArr = inputFamilyData.childUser;

  if (inputParentUserArr == undefined)
    inputParentUserArr = [];
  if (inputChildUserArr == undefined)
    inputChildUserArr = [];

  if (inputParentUserArr.length != 0 || inputChildUserArr.length != 0) {
    pcSuffixStr = " - ";
    if (inputParentUserArr.length == 1) {
      pcSuffixStr += "1 Parent";
      addedParentStatBool = true;
    } else if (inputParentUserArr.length > 1) {
      pcSuffixStr += inputParentUserArr.length + " Parents";
      addedParentStatBool = true;
    }

    if (inputChildUserArr.length == 1) {
      if (addedParentStatBool)
        pcSuffixStr += ", ";
      pcSuffixStr += "1 Child";
    } else if (inputChildUserArr.length > 1) {
      if (addedParentStatBool)
        pcSuffixStr += ", ";
      pcSuffixStr += inputChildUserArr.length + " Children";
    }
  }

  return pcSuffixStr;
}

function checkForUserStringConversionToArr(strChkData, returnUserData) {
  let returnChildArray = [];
  let tempStrChkIndex = 0;

  if (returnUserData == undefined)
    returnUserData = false;

  if (strChkData == undefined)
    returnChildArray = [];
  else if (typeof strChkData == "string" && strChkData == "")
    returnChildArray = [];
  else if (typeof strChkData == "string" && strChkData != "") {
    if (returnUserData) {
      tempStrChkIndex = findUIDItemInArr(strChkData, userArr, true);
      returnChildArray.push(userArr[tempStrChkIndex]);
    } else {
      returnChildArray.push(strChkData);
    }
  } else {
    returnChildArray = strChkData;
  }

  return returnChildArray;
}

function clearParentChildData (familyMemberData) {
  let parentUsers = [];
  let childUsers = [];
  let errorInt = 0;
  let errorBool = false;
  let tempPCIndex = 0;
  let tempPCArray = [];
  let tempPCUser;

  if (familyMemberData.parentUser != null) {
    if (familyMemberData.parentUser.length != 0)
      for (let i = 0; i < familyMemberData.parentUser.length; i++) {
        tempPCIndex = findUIDItemInArr(familyMemberData.parentUser[i], userArr, true);
        if (tempPCIndex != -1)
          parentUsers.push(userArr[tempPCIndex]);
      }
  } else {
    errorInt++;
  }
  if (familyMemberData.childUser != null) {
    if (familyMemberData.childUser.length != 0)
      for (let i = 0; i < familyMemberData.childUser.length; i++) {
        tempPCIndex = findUIDItemInArr(familyMemberData.childUser[i], userArr, true);
        if (tempPCIndex != -1)
          childUsers.push(userArr[tempPCIndex]);
      }
  } else {
    errorInt++;
  }
  if (errorInt == 2) {
    errorBool = true;
  }

  if (!errorBool) {
    for (let i = 0; i < parentUsers.length; i++) {
      tempPCUser = parentUsers[i];
      tempPCArray = checkForUserStringConversionToArr(tempPCUser.childUser);
      tempPCIndex = tempPCArray.indexOf(familyMemberData.uid)
      if (tempPCIndex != -1) {
        tempPCArray.splice(tempPCIndex, 1);
        firebase.database().ref("users/" + tempPCUser.uid).update({
          childUser: tempPCArray
        });
      }
    }

    for (let i = 0; i < childUsers.length; i++) {
      tempPCUser = childUsers[i];
      tempPCArray = checkForUserStringConversionToArr(tempPCUser.parentUser);
      tempPCIndex = tempPCArray.indexOf(familyMemberData.uid)
      if (tempPCIndex != -1) {
        tempPCArray.splice(tempPCIndex, 1);
        firebase.database().ref("users/" + tempPCUser.uid).update({
          parentUser: tempPCArray
        });
      }
    }

    familyMemberData.childUser = [];
    familyMemberData.parentUser = [];

    firebase.database().ref("users/" + familyMemberData.uid).update({
      childUser: [],
      parentUser: []
    });

    deployNotificationModal(false, "Parent/Child Data Cleared", "The Parent and Child data has been " +
        "successfully cleared from the database!");
  } else {
    deployNotificationModal(true, "Data Clear Error!", "The Parent and Child data was NOT cleared... " +
        "Please try again.");
  }
}

function clearAllParentChildData() {
  let userIndex = 0;

  for (let i = 0; i < familyData.members.length; i++) {
    userIndex = findUIDItemInArr(familyData.members[i], userArr, false);
    if (userIndex != -1) {
      userArr[userIndex].childUser = [];
      userArr[userIndex].parentUser = [];
      firebase.database().ref("users/" + userArr[userIndex].uid).update({
        childUser: [],
        parentUser: []
      });
    }
  }

  deployNotificationModal(false, "ALL Parent/Child Data Cleared", "All Parent and Child data has been " +
      "successfully cleared from the database!");
}

function removeFamilyMemberFromDB(memberToRemove) {
  clearParentChildData(memberToRemove);

  let i = familyData.members.indexOf(memberToRemove.uid);
  if (i != -1) {
    familyData.members.splice(i, 1);

    sessionStorage.setItem("familyData", JSON.stringify(familyData));

    firebase.database().ref("family/" + familyData.uid).update({
      members: familyData.members
    });
  }
}

function changeFamilyNameInDB(newFamilyName){
  firebase.database().ref("family/" + familyData.uid).update({
    name:newFamilyName
  });
  deployNotificationModal(false, "Family Name Updated!", "The family name has been updated! The page will " +
      "now be redirected to the Family page.", 4, 15);
}

function addFamilyMemberToDB(memberUID){
  if(familyData.members != null)
    if (familyData.members.length == 0) {
      familyData.members = [];
      familyData.members.push(memberUID);
      sessionStorage.setItem("familyData", JSON.stringify(familyData));
      firebase.database().ref("family/" + familyData.uid).update({
        members: {0: memberUID}
      });
    } else {
      familyData.members.push(memberUID);
      sessionStorage.setItem("familyData", JSON.stringify(familyData));
      firebase.database().ref("family/" + familyData.uid).update({
        members: familyData.members
      });
    }
  else {
    familyData.members = [];
    familyData.members.push(memberUID);
    sessionStorage.setItem("familyData", JSON.stringify(familyData));
    firebase.database().ref("family/" + familyData.uid).update({
      members: {0: memberUID}
    });
  }
}

function generateFamilyPCModal(parentChild, parentChildData) {
  let tempChildData = cloneArray(parentChildData.childUser);
  let tempParentData = cloneArray(parentChildData.parentUser);
  let changeDetected;
  let tempFamPCIndex;
  let tempPCData;
  closeModal(familyMemberViewModal);
  globalParentData = [];
  globalChildData = [];

  if (parentChild == "child") {
    familyPCTitle.innerHTML = "Choose Children";
    tempPCData = parentChildData.childUser;
    for (let i = 0; i < tempPCData.length; i++) {
      tempFamPCIndex = findUIDItemInArr(tempPCData[i], userArr, true);
      globalChildData.push(userArr[tempFamPCIndex]);
    }
  } else if (parentChild == "parent") {
    familyPCTitle.innerHTML = "Choose Parents";
    tempPCData = parentChildData.parentUser;
    for (let i = 0; i < tempPCData.length; i++) {
      tempFamPCIndex = findUIDItemInArr(tempPCData[i], userArr, true);
      globalParentData.push(userArr[tempFamPCIndex]);
    }
  }

  if ((parentChildData.parentUser.length == 0 && parentChild == "parent") ||
      (parentChildData.childUser.length == 0 && parentChild == "child")) {
    familyPCText.innerHTML = "Please select from the list below to choose " + parentChildData.name + "\'s " + parentChild +
        " user(s). Click on any user to select or deselect them as a " + parentChild + " user, then click Confirm to" +
        " save your changes."
  } else {
    familyPCText.innerHTML = "The user(s) in green below is/are currently " + parentChildData.name + "\'s " + parentChild +
        " user(s). Click on any user to select or deselect them as a " + parentChild + " user, then click Confirm to" +
        " save your changes. Note that users in red will be removed as a " + parentChild + " user.";
  }

  familyPCBack.onclick = function() {
    closeModal(familyPCModal);
    openModal(familyMemberViewModal, parentChildData.uid);
  }

  generateFamilyPCUserList(parentChild, parentChildData);

  openModal(familyPCModal, parentChildData.uid);

  familyPCConfirm.onclick = function () {
    changeDetected = false;
    if (parentChild == "child") {
      changeDetected = checkForPCListChanges();

      if (changeDetected) {
        if (globalChildData.length == 0) {
          generateConfirmDataModal("Please confirm that all of " + parentChildData.name + "'s children " +
              "should be removed.<br/><br/>Please note that this \"parent\" user will automatically be removed " +
              "from the child user(s) as well.",
              "Confirm Child Removal", "parentChild", null);
        } else {
          generateConfirmDataModal("Please confirm that the following user(s) should be assigned as a " +
              "child to " + parentChildData.name + "<br/><br/>" + generatePCAddString(globalChildData) + "<br/><br/>Please note " +
              "that this \"parent\" user will automatically be assigned to the child user(s) as well.",
              "Confirm Child Selection", "parentChild", null);
        }
      } else {
        deployNotificationModal(true, "No Changes Detected!", "It appears that " +
            "you did not make any changes to this user's relationships. No changes have been made.");
      }
    } else if (parentChild == "parent") {
      changeDetected = checkForPCListChanges();

      if (changeDetected) {
        if (globalParentData.length == 0) {
          generateConfirmDataModal("Please confirm that all of " + parentChildData.name + "'s parents " +
              "should be removed.<br/><br/>Please note that this \"child\" user will automatically be removed " +
              "from the parent user(s) as well.",
              "Confirm Child Removal", "parentChild", null);
        } else {
          generateConfirmDataModal("Please confirm that the following user(s) should be assigned as a " +
              "parent to " + parentChildData.name + "<br/><br/>" + generatePCAddString(globalParentData) + "<br/><br/>Please note " +
              "that this \"child\" user will automatically be assigned to the parent user(s) as well.",
              "Confirm Parent Selection", "parentChild", null);
        }
      } else {
        deployNotificationModal(true, "No Changes Detected!", "It appears that " +
            "you did not make any changes to this user's relationships. No changes have been made.");
      }
    }
  };

  closeFamilyPCModal.onclick = function() {
    closeModal(familyPCModal);
  }

  function checkForPCListChanges() {
    let changesFound = false;

    if (parentChild == "child") {
      for (let i = 0; i < globalChildData.length; i++) {
        if (tempChildData.indexOf(globalChildData[i].uid) == -1) {
          changesFound = true;
          break;
        }
      }

      if (!changesFound) {
        for (let i = 0; i < tempChildData.length; i++) {
          if (findUIDItemInArr(tempChildData[i], globalChildData, true) == -1) {
            changesFound = true;
            break;
          }
        }
      }
    } else if (parentChild == "parent") {
      for (let i = 0; i < globalParentData.length; i++) {
        if (tempParentData.indexOf(globalParentData[i].uid) == -1) {
          changesFound = true;
          break;
        }
      }

      if (!changesFound) {
        for (let i = 0; i < tempParentData.length; i++) {
          if (findUIDItemInArr(tempParentData[i], globalParentData, true) == -1) {
            changesFound = true;
            break;
          }
        }
      }
    }

    return changesFound;
  }
}

function generateFamilyPCUserList(parentChild, parentChildOmit) {
  let tempParentData = parentChildOmit.parentUser;
  let tempChildData = parentChildOmit.childUser;
  if (tempParentData == undefined)
    tempParentData = [];
  if (tempChildData == undefined)
    tempChildData = [];
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
      if (userArr[i].uid != parentChildOmit.uid && findUIDItemInArr(userArr[i].uid, loadedPCUserArr, true) == -1 &&
          familyData.members.indexOf(userArr[i].uid) != -1 &&
          ((tempChildData.indexOf(userArr[i].uid) == -1 && parentChild == "parent") ||
              tempParentData.indexOf(userArr[i].uid) == -1 && parentChild == "child")) {
        let notAnOriginalPC = false;
        let liItem = document.createElement("LI");
        liItem.id = userArr[i].uid;
        liItem.className = "gift";
        let textNode = document.createTextNode(userArr[i].name);

        if ((parentChildOmit.parentUser.indexOf(userArr[i].uid) != -1 && parentChild == "parent") ||
            (parentChildOmit.childUser.indexOf(userArr[i].uid) != -1 && parentChild == "child")) {
          liItem.className = "gift lowSev";

        } else {
          liItem.className = "gift";
          notAnOriginalPC = true;
        }

        liItem.onclick = function () {
          if (parentChild == "child") {
            globalParentChildState = "child";
            if (findUIDItemInArr(parentChildOmit.uid, globalParentData, true) == -1) {
              globalParentData.push(parentChildOmit);
            }
            switch (liItem.className) {
              case "gift":
                globalChildData.push(userArr[i]);
                liItem.className = "gift lowSev";
                break;
              case "gift highSev":
                globalChildData.push(userArr[i]);
                liItem.className = "gift lowSev";
                break;
              case "gift lowSev":
                let a = findUIDItemInArr(userArr[i].uid, globalChildData, true);
                globalChildData.splice(a, 1);
                if (notAnOriginalPC) {
                  liItem.className = "gift";
                } else {
                  liItem.className = "gift highSev";
                }
                break;
              default:
                console.log("Error!");
            }
          } else if (parentChild == "parent") {
            globalParentChildState = "parent";
            if (findUIDItemInArr(parentChildOmit.uid, globalChildData, true) == -1) {
              globalChildData.push(parentChildOmit);
            }
            switch (liItem.className) {
              case "gift":
                globalParentData.push(userArr[i]);
                liItem.className = "gift lowSev";
                break;
              case "gift highSev":
                globalParentData.push(userArr[i]);
                liItem.className = "gift lowSev";
                break;
              case "gift lowSev":
                let a = findUIDItemInArr(userArr[i].uid, globalParentData, true);
                globalParentData.splice(a, 1);
                if (notAnOriginalPC) {
                  liItem.className = "gift";
                } else {
                  liItem.className = "gift highSev";
                }
                break;
              default:
                console.log("Error Toggling Color!");
            }
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

function generatePCAddString(listOfUsers){
  let formattedUserList = "";

  formattedUserList = listOfUsers[0].name;
  if (listOfUsers.length > 2) {
    for (let i = 1; i < listOfUsers.length; i++) {
      if (i < listOfUsers.length - 1) {
        formattedUserList += ", " + listOfUsers[i].name;
      } else {
        formattedUserList += ", and " + listOfUsers[i].name;
      }
    }
  } else if (listOfUsers.length == 2) {
    formattedUserList += " and " + listOfUsers[1].name;
  }

  return formattedUserList;
}

function generateConfirmDataModal(stringToConfirm, confirmTitle, confirmType, dataObject){
  confirmMemberTitle.innerHTML = confirmTitle;
  confMemberUserName.innerHTML = stringToConfirm;

  addMemberConfirm.onclick = function() {
    if (confirmType == "user"){
      addMemberInfo.innerHTML = "";
      familyMemberInp.value = "";
      addFamilyMemberToDB(dataObject);
    } else if (confirmType == "parentChild") {
      updateFamilyRelationsToDB();
    } else if (confirmType == "clearSpecificPC") {
      clearParentChildData(dataObject);
      familyMemberParent.innerHTML = "View Parent Options";
      familyMemberChild.innerHTML = "View Children Options";
    } else if (confirmType == "clearAllPC") {
      clearAllParentChildData();
    } else if (confirmType == "removeAllMembers") {
      clearAllParentChildData();
      removeAllFamilyMembers(dataObject);
    } else if (confirmType == "removeFamilyMember") {
      removeFamilyMemberFromDB(dataObject);
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
    } else if (confirmType == "clearSpecificPC") {
      openModal(familyMemberViewModal, "familyMemberViewModal");
    } else if (confirmType == "clearAllPC" || confirmType == "removeAllMembers") {
      openModal(familySettingsModal, "familySettingsModal");
    } else if (confirmType == "removeFamilyMember") {
      openModal(familyMemberViewModal, "familyMemberViewModal");
    }
    return false;
  }

  openModal(confirmMemberModal, "confirmMemberModal", true);

  closeConfirmMemberModal.onclick = function() {
    closeModal(confirmMemberModal);
    if (confirmType == "user") {
      openModal(familyAddModal, "familyAddModal");
    } else if (confirmType == "parentChild") {
      openModal(familyPCModal, "familyPCModal");
    } else if (confirmType == "clearSpecificPC") {
      openModal(familyMemberViewModal, "familyMemberViewModal");
    } else if (confirmType == "clearAllPC" || confirmType == "removeAllMembers") {
      openModal(familySettingsModal, "familySettingsModal");
    } else if (confirmType == "removeFamilyMember") {
      openModal(familyMemberViewModal, "familyMemberViewModal");
    }
  };

  window.onclick = function(event) {
    if (event.target == confirmMemberModal) {
      closeModal(confirmMemberModal);
      globalChildData = [];
      globalParentData = [];
    }
  };
}

function updateFamilyRelationsToDB() {
  let tempPCUserData;
  let tempPCArrData = [];
  let changesMade = 0;
  let tempIndex = 0;

  if (globalParentData != undefined && globalChildData != undefined &&
      (globalParentChildState != "parent" || globalParentChildState != "child")) {

    if (globalParentChildState == "parent") {
      tempPCArrData = cloneArray(globalChildData[0].parentUser);
      if (tempPCArrData != undefined)
        for (let i = 0; i < tempPCArrData.length; i++) {
          //if childData[0].parents isn't in parentData (If old list user is not in new list user, remove)
          if (findUIDItemInArr(tempPCArrData[i], globalParentData, true) == -1)
            if (removePCFromList(true, globalChildData[0], tempPCArrData[i])) {
              changesMade++;
              tempIndex = findUIDItemInArr(tempPCArrData[i], userArr, true);
              tempPCUserData = userArr[tempIndex];
              //if childData[0] in childUser (if current child is still in other user's childUser list, remove)
              if (tempPCUserData.childUser.indexOf(globalChildData[0].uid) != -1)
                if (removePCFromList(false, tempPCUserData, globalChildData[0].uid))
                  changesMade++;
            }
        }

      for (let i = 0; i < globalParentData.length; i++) {
        if (checkForChanges(true, globalChildData[0], globalParentData[i]))
          changesMade++;
        if (checkForChanges(false, globalParentData[i], globalChildData[0]))
          changesMade++;
      }
    } else if (globalParentChildState == "child") {
      tempPCArrData = cloneArray(globalParentData[0].childUser);
      if (tempPCArrData != undefined)
        for (let i = 0; i < tempPCArrData.length; i++) {
          //if parentData[0].children isn't in childData (If old list user is not in new list user, remove)
          if (findUIDItemInArr(tempPCArrData[i], globalChildData, true) == -1)
            if (removePCFromList(false, globalParentData[0], tempPCArrData[i])) {
              changesMade++;
              tempIndex = findUIDItemInArr(tempPCArrData[i], userArr, true);
              tempPCUserData = userArr[tempIndex];
              //if parentData[0] in parentUser (if current child is still in other user's childUser list, remove)
              if (tempPCUserData.parentUser.indexOf(globalParentData[0].uid) != -1)
                if (removePCFromList(true, tempPCUserData, globalParentData[0].uid))
                  changesMade++;
            }
        }

      for (let i = 0; i < globalChildData.length; i++) {
        if (checkForChanges(false, globalParentData[0], globalChildData[i]))
          changesMade++;
        if (checkForChanges(true, globalChildData[i], globalParentData[0]))
          changesMade++;
      }
    }

    if (changesMade == 0) {
      deployNotificationModal(false, "Parent/Children Relationships FAILED!",
          "There was an issue updating the relationships between parents and children, it appears that " +
          "no changes were made. If desired, clear the parent/child relationships and try again.");
    } else {
      deployNotificationModal(false, "Parent/Children Relationships Updated!",
          "The Parent and Child data has been successfully updated!");
    }
  } else {
    deployNotificationModal(true, "Parent/Child Assignment Error!", "There was an error updating the " +
        "parent and child of this user, please try again!", 4);
  }

  globalChildData = undefined;
  globalParentData = undefined;
  globalParentChildState = "";

  function checkForChanges(updatePCUserDataBool, inputUserData, userDataToCheck) {//true = child's parent(s)
    let updatePerformed = false;
    let tempInputPCData;
    let tempCheckIndex;

    if (updatePCUserDataBool) {
      tempInputPCData = inputUserData.parentUser;
    } else {
      tempInputPCData = inputUserData.childUser;
    }

    if (tempInputPCData == undefined)
      tempInputPCData = [];

    tempCheckIndex = tempInputPCData.indexOf(userDataToCheck.uid);
    if (tempCheckIndex == -1) {
      if (addPCToList(updatePCUserDataBool, inputUserData, userDataToCheck.uid))
        updatePerformed = true;
    }

    return updatePerformed;
  }

  function addPCToList(updatePCUserDataBool, inputUserData, userDataToAdd) {
    let updatePerformed = false;
    let tempAddIndex = -1;
    let tempPCArrData;

    if (updatePCUserDataBool) {
      tempPCArrData = inputUserData.parentUser;
    } else {
      tempPCArrData = inputUserData.childUser;
    }

    if (tempPCArrData != undefined) {
      tempAddIndex = tempPCArrData.indexOf(userDataToAdd);
    } else {
      tempPCArrData = [];
    }
    if (tempAddIndex == -1) {
      tempPCArrData.push(userDataToAdd);
      updateDatabaseWithPCData(updatePCUserDataBool, inputUserData, tempPCArrData);
      updatePerformed = true;
    }

    return updatePerformed;
  }

  function removePCFromList(updatePCUserDataBool, inputUserData, userUIDToRemove) {//true = child's parent(s)
    let updatePerformed = false;
    let tempRemoveIndex;
    let tempPCArrData;

    if (updatePCUserDataBool) {
      tempPCArrData = inputUserData.parentUser;
    } else {
      tempPCArrData = inputUserData.childUser;
    }

    if (tempPCArrData != undefined) {
      tempRemoveIndex = tempPCArrData.indexOf(userUIDToRemove);
      if (tempRemoveIndex != -1) {
        tempPCArrData.splice(tempRemoveIndex, 1);
        updateDatabaseWithPCData(updatePCUserDataBool, inputUserData, tempPCArrData);
        updatePerformed = true;
      }
    }

    return updatePerformed;
  }

  function updateDatabaseWithPCData(updatePCUserDataBool, inputUserData, inputPCData) {//true = child's parent(s)
    if (expectedPCChanges.indexOf(inputUserData.uid) == -1)
      expectedPCChanges.push(inputUserData.uid);

    if (updatePCUserDataBool) {
      firebase.database().ref("users/" + inputUserData.uid).update({
        parentUser: inputPCData
      });
    } else {
      firebase.database().ref("users/" + inputUserData.uid).update({
        childUser: inputPCData
      });
    }
  }
}
