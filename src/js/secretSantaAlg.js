/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let hideSecretSantaName = true;

let secretSantaBtn;
let secretSantaUserModal;
let closeSecretSantaUserModal;
let secretSantaNameText;
let showSecretSantaAssignment;

let mostRecentSecretSantaState = 0;

function initializeSecretSantaListPageVars() {
  secretSantaBtn = document.getElementById("secretSantaBtn");
  secretSantaUserModal = document.getElementById("secretSantaUserModal");
  closeSecretSantaUserModal = document.getElementById("closeSecretSantaUserModal");
  secretSantaNameText = document.getElementById("secretSantaNameText");
  showSecretSantaAssignment = document.getElementById("showSecretSantaAssignment");

  userInitial = firebase.database().ref("users/" + user.uid);
  familyInitial = firebase.database().ref("family/");
}

function evaluateSecretSantaButton(familyData) {
  if (familyData.secretSantaState == undefined) {
    familyData.secretSantaState = 0;
    firebase.database().ref("family/" + familyData.uid).update({
      secretSantaState: 0
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
