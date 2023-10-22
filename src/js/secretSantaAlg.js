/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

//List Page Variables
let secretSantaBtn;
let secretSantaUserModal;
let closeSecretSantaUserModal;
let secretSantaNameText;
let showSecretSantaAssignment;

//Family Page Variables
let secretSantaSectionHeader;
let secretSantaStateText;
let secretSantaNextStateText;
let secretSantaStatusText;
let secretSantaStateBtn;
let secretSantaShuffleBtn;
let secretSantaAutoBtn;
let secretSantaExportBtn;

let secretSantaElements = [];
let hideSecretSantaName = true;
let mostRecentSecretSantaState = 0;
let familyMemberSignUpMinimum = 3;

/*
* List Page Functions
*/
function initializeSecretSantaListPageVars() {
  secretSantaBtn = document.getElementById("secretSantaBtn");
  secretSantaUserModal = document.getElementById("secretSantaUserModal");
  closeSecretSantaUserModal = document.getElementById("closeSecretSantaUserModal");
  secretSantaNameText = document.getElementById("secretSantaNameText");
  showSecretSantaAssignment = document.getElementById("showSecretSantaAssignment");

  userInitial = firebase.database().ref("users/" + user.uid);
  familyInitial = firebase.database().ref("family/");

  secretSantaElements = [secretSantaBtn, secretSantaUserModal, closeSecretSantaUserModal, secretSantaNameText,
    showSecretSantaAssignment];
  verifyElementIntegrity(secretSantaElements);
}

function evaluateSecretSantaButton(familyData) {
  if (familyData.secretSantaState == undefined) {
    familyData.secretSantaState = 1;
    firebase.database().ref("family/" + familyData.uid).update({
      secretSantaState: 1
    });
  }
  if (familyData.members == undefined)
    familyData.members = [];

  if (familyData.members.includes(user.uid)) {
    mostRecentSecretSantaState = familyData.secretSantaState;

    if (familyData.secretSantaState == 2) {
      initializeSecretSantaButton(2);
    } else if (familyData.secretSantaState == 3) {
      let i = findUIDItemInArr(user.secretSantaName, userArr, true);
      if (i != -1) {
        initializeSecretSantaButton(3);
      } else {
        updateMaintenanceLog(pageName, "Critical Error: A user was improperly assigned a Secret Santa name!");
      }
    } else {
      disableSecretSantaBtn();
    }
  }
}

function disableSecretSantaBtn() {
  secretSantaBtn.style.display = "none";
  secretSantaBtn.onclick = function(){};
}

function initializeSecretSantaButton(stateIndex) {
  if (stateIndex == 2) {
    secretSantaBtn.style.display = "block";
    if (user.secretSanta == 0) {
      secretSantaBtn.innerHTML = "Sign Up For Secret Santa";
      secretSantaBtn.onclick = function() {
        firebase.database().ref("users/" + user.uid).update({
          secretSanta: 1
        });
        deployNotificationModal(false, "Signed Up!", "You have been signed up " +
            "for Secret Santa! Check back later for your assigned name.");
      };
    } else {
      secretSantaBtn.innerHTML = "Opt Out Of Secret Santa";
      secretSantaBtn.onclick = function() {
        firebase.database().ref("users/" + user.uid).update({
          secretSanta: 0
        });
        deployNotificationModal(false, "Opted Out!", "You have been opted out of " +
            "Secret Santa! Maybe sign up next year?");
      };
    }
  } else if (stateIndex == 3) {
    secretSantaBtn.style.display = "block";
    secretSantaBtn.innerHTML = "View Your Assignment";
    secretSantaBtn.onclick = function() {
      deploySecretSantaModal();
    };
  }
}

function deploySecretSantaModal() {
  showSecretSantaAssignment.onclick = function() {
    if (hideSecretSantaName) {
      secretSantaNameText.innerHTML = "Your Secret Santa Assignment: " + user.secretSantaName;
      secretSantaBtn.innerHTML = user.secretSantaName;
      showSecretSantaAssignment.innerHTML = "Hide Secret Santa Name";
      hideSecretSantaName = false;
    } else {
      secretSantaNameText.innerHTML = "Your Secret Santa Assignment: (Hidden)";
      secretSantaBtn.innerHTML = "View Your Assignment";
      showSecretSantaAssignment.innerHTML = "Show Secret Santa Name";
      hideSecretSantaName = true;
    }
  };

  openModal(secretSantaUserModal, "secretSantaAssignment");

  closeSecretSantaUserModal.onclick = function() {
    closeModal(secretSantaUserModal);
  };
}

function initializeSecretSantaDB() {
  let fetchUserData = function (postRef){
    postRef.on("child_changed", function (data) {
      if (data.key == "secretSanta") {
        user.secretSanta = data.val();
        initializeSecretSantaButton(mostRecentSecretSantaState);
      }
    });
  };

  let fetchFamilies = function (postRef){
    postRef.once("value").then(function(snapshot) {
      if (snapshot.exists()) {
        postRef.on("child_added", function (data) {
          let i = findUIDItemInArr(data.val().uid, familyArr, true);
          if (i == -1) {
            familyArr.push(data.val());
            saveCriticalCookies();
            evaluateSecretSantaButton(data.val());
          } else {
            localObjectChanges = findObjectChanges(familyArr[i], data.val());
            if (localObjectChanges.length != 0) {
              familyArr[i] = data.val();
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
              saveCriticalCookies();
              evaluateSecretSantaButton(data.val());
            }
          }
        });

        postRef.on("child_removed", function (data) {
          let i = findUIDItemInArr(data.key, familyArr);
          if (i != -1) {
            familyArr.splice(i, 1);
            saveCriticalCookies();
            disableSecretSantaBtn();
          }
        });
      }
    });
  };

  fetchUserData(userInitial);
  fetchFamilies(familyInitial);

  listeningFirebaseRefs.push(userInitial);
  listeningFirebaseRefs.push(familyInitial);
}

/*
* Family Page Functions
*/
function initializeSecretSantaFamilyPageVars() {
  secretSantaSectionHeader = document.getElementById("secretSantaSectionHeader");
  secretSantaStateText = document.getElementById("secretSantaStateText");
  secretSantaNextStateText = document.getElementById("secretSantaNextStateText");
  secretSantaStatusText = document.getElementById("secretSantaStatusText");
  secretSantaStateBtn = document.getElementById("secretSantaStateBtn");
  secretSantaShuffleBtn = document.getElementById("secretSantaShuffleBtn");
  secretSantaAutoBtn = document.getElementById("secretSantaAutoBtn");
  secretSantaExportBtn = document.getElementById("secretSantaExportBtn");

  secretSantaElements = [secretSantaSectionHeader, secretSantaStateText, secretSantaNextStateText,
    secretSantaStatusText, secretSantaStateBtn, secretSantaShuffleBtn, secretSantaAutoBtn, secretSantaExportBtn];
  verifyElementIntegrity(secretSantaElements);
}

function initializeSecretSantaFamilyModalElements(familyData) {
  console.log(familyData.secretSantaState);

  if (familyData.secretSantaState == undefined) {
    familyData.secretSantaState = 1;
    firebase.database().ref("family/" + familyData.uid).update({
      secretSantaState: 1
    });
  } else if (familyData.secretSantaState > 3 || familyData.secretSantaState < 1) {
    familyData.secretSantaState = 1;
    firebase.database().ref("family/" + familyData.uid).update({
      secretSantaState: 1
    });
  }
  if (familyData.members == undefined)
    familyData.members = [];

  if (familyData.secretSantaState == 1) {
    secretSantaStateText.innerHTML = "Secret Santa State: Idle";
    secretSantaNextStateText.innerHTML = "Next Secret Santa State: Ready";
    secretSantaNextStateText.style.display = "block";
    secretSantaStatusText.style.display = "none";
    secretSantaShuffleBtn.style.display = "none";
    secretSantaAutoBtn.style.display = "inline-block";
    secretSantaExportBtn.style.display = "none";

    secretSantaStateBtn.onclick = function() {
      changeSecretSantaState(familyData, 2);
    };
    secretSantaAutoBtn.onclick = function() {
      toggleAutomaticFunctionality();
    };
    secretSantaShuffleBtn.onclick = function() {};
    secretSantaExportBtn.onclick = function() {};
  } else if (familyData.secretSantaState == 2) {
    secretSantaStateText.innerHTML = "Secret Santa State: Ready";
    secretSantaNextStateText.innerHTML = "Next Secret Santa State: Active";
    secretSantaStatusText.innerHTML = "Secret Santa Status: Ready To Assign Names";
    secretSantaNextStateText.style.display = "block";
    secretSantaStatusText.style.display = "block";
    secretSantaShuffleBtn.style.display = "none";
    secretSantaAutoBtn.style.display = "inline-block";
    secretSantaExportBtn.style.display = "none";

    secretSantaStateBtn.onclick = function() {
      changeSecretSantaState(familyData, 3);
    };
    secretSantaAutoBtn.onclick = function() {
      toggleAutomaticFunctionality();
    };
    secretSantaExportBtn.onclick = function() {
      exportSecretSantaData(0, familyData.members);
    };
    secretSantaShuffleBtn.onclick = function() {};
  } else if (familyData.secretSantaState == 3) {
    secretSantaStateText.innerHTML = "Secret Santa State: Active";
    secretSantaNextStateText.innerHTML = "Next Secret Santa State: Idle";
    secretSantaStatusText.innerHTML = "Secret Santa Status: Nominal";
    secretSantaNextStateText.style.display = "block";
    secretSantaShuffleBtn.style.display = "inline-block";
    secretSantaAutoBtn.style.display = "inline-block";
    secretSantaExportBtn.style.display = "inline-block";

    secretSantaStateBtn.onclick = function() {
      changeSecretSantaState(familyData, 1);
    };
    secretSantaShuffleBtn.onclick = function() {
      if (!assignUsersToNames(familyData.members)) {
        deployNotificationModal(true, "Secret Santa Shuffle Failed!", "Assigning " +
            "Secret Santa users was unsuccessful! Do these users have too many restrictions? Please try again..." +
            "<br><br><br>NOTE: Restrictions are things like the amount of friends, family relationships, and more. " +
            "If your user doesn't have any friends or is related to too many people, assignments will be unsuccessful!",
            20);
      }
    };
    secretSantaAutoBtn.onclick = function() {
      toggleAutomaticFunctionality();
    };
    secretSantaExportBtn.onclick = function() {
      exportSecretSantaData(1, familyData.members);
    };
  }
}

function changeSecretSantaState(familyData, desiredStateInt) {
  let stateIndicatorText;
  let changedStateConcatString;
  let validStateChange = false;
  let invalidStateChangeReason = "";
  let invalidModalOpenTime = 10;

  switch (desiredStateInt) {
    case 1:
      if (unassignAllFamilyMembers(familyData.members))
        validStateChange = true;
      invalidStateChangeReason = "Deactivating Secret Santa was unsuccessful! Please try again...";
      stateIndicatorText = "Idle";
      break;
    case 2:
      if (evaluateUserReadiness(familyData.members))
        validStateChange = true;
      if (familyData.members > familyMemberSignUpMinimum) {
        invalidStateChangeReason = "Not enough members are signed up! Make sure that at least " +
            familyMemberSignUpMinimum + " family members are signed up prior to trying again!";
      } else {
        invalidStateChangeReason = "There are not enough members in this family! Make sure that at least " +
            familyMemberSignUpMinimum + " family members are in this family and signed up prior to trying again!";
      }
      stateIndicatorText = "Ready";
      break;
    case 3:
      if (assignUsersToNames(familyData.members))
        validStateChange = true;
      invalidStateChangeReason = "Assigning Secret Santa users was unsuccessful! Do these users have too many " +
          "restrictions? Please try again...<br><br><br>NOTE: Restrictions are things like the amount of friends, " +
          "family relationships, and more. If your user doesn't have any friends or is related to too many people, " +
          "assignments will be unsuccessful!";
      stateIndicatorText = "Active";
      break;
  }

  if (validStateChange) {
    firebase.database().ref("family/" + familyData.uid).update({
      secretSantaState: desiredStateInt
    });

    changedStateConcatString = familyData.name + "'s Secret Santa State has been successfully changed to " +
        stateIndicatorText + "!";

    familyData.secretSantaState = desiredStateInt;
    deployNotificationModal(true, "State Changed!", changedStateConcatString, 4);
    initializeSecretSantaFamilyModalElements(familyData);
  } else {
    if (invalidStateChangeReason.length > 150)
      invalidModalOpenTime = 20;
    deployNotificationModal(true, "Secret Santa State Change Failed!",
        invalidStateChangeReason, invalidModalOpenTime);
  }
}

function evaluateUserReadiness(familyMembers) {
  let tempIndex = 0;
  let tempSignUpCount = 0;
  let familyReady = false;

  for (let i = 0; i < familyMembers.length; i++) {
    tempIndex = findUIDItemInArr(familyMembers[i], userArr, true);
    if (tempIndex != -1) {
      if (userArr[tempIndex].secretSanta == 1)
        tempSignUpCount++;
    }
  }

  if (tempSignUpCount >= familyMemberSignUpMinimum)
    familyReady = true;

  return familyReady;
}

function toggleAutomaticFunctionality() {//todo placeholder
  alert("This button will eventually toggle secret santa automatic control");
}

function exportSecretSantaData(desiredExportType, familyMembers) {//todo placeholder
  alert("This button will eventually export the secret santa data to a csv");
  switch (desiredExportType) {
    case 0:
      //exporting all currently signed up users in family
      break;
    case 1:
      //exporting all signed up users AND their assignments in family
      break;
  }
}

function unassignAllFamilyMembers(familyMembers) {//todo placeholder
  return true;
}

function assignUsersToNames(familyMembers) {//todo placeholder
  return true;
}
