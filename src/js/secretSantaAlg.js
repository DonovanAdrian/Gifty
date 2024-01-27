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
let secretSantaShowHideBtn;
let secretSantaSectionHeader;
let secretSantaStateText;
let secretSantaNextStateText;
let secretSantaStatusText;
let secretSantaInfoIcon;
let secretSantaStateBtn;
let secretSantaShuffleBtn;
let secretSantaAutoBtn;
let secretSantaExportBtn;

//General Variables
let secretSantaElements = [];
let manualStateChange = false;
let hideSecretSantaName = true;
let runningExportProcess = false;
let secretSantaStressTesting = false;
let secretSantaShuffledInSession = false;
let secretSantaStressTestingLimit = 1000;
let mostRecentSecretSantaState = 0;
let familyMemberSignUpMinimum = 4;
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let showDate = new Date(currentYear, 9, 1, 0, 0, 0, 0);//Oct 1st
let assignDate = new Date(currentYear, 10, 1, 0, 0, 0, 0);//Nov 1st
let showDateShort = new Date(showDate);
let assignDateShort = new Date(assignDate);
let hideDateMin = 0; //Jan
let hideDateMax = 8; //Sept
let localReRollLimit = 5;
let assignmentAttemptLimits = 5;
let processingResultTextLimit = 5;
let processFamilyAttempts = 0;
let processingResultTextTimer = 0;
let processingSuccessCount = 0;
let processingFailureCount = 0;
let processingResultTextInterval;
let automaticControlFailureCount = 0;
let automaticControlFailureTimer = 0;
let automaticControlFailureLimit = 1;
let automaticControlFailureInterval;
let previousStatusValue = "";
let globalThanks = "Thank you for participating in the Secret Santa! See you next year!";
let globalApology = "Unfortunately the Secret Santa for this year has come to an early end! Please contact" +
    " a moderator for assistance";

/*
 * General Functions
 */
function processFamily(familyMembers, ignoreLastYearsAssignments, testingInt) {
  processFamilyAttempts++;
  /*
  *******Result Code Key********
   -1  is a processing error, there's something very wrong
    0  (Zero) is a success
    1  is a failure to find a viable "Giver" user
`   2  is a user that had ZERO potential assignments
    3  is a Secret Santa recipient that was duplicated
    4  is a Secret Santa recipient that was not properly assigned
    5  Verification Step, a Secret Santa giver was duplicated
    6  Verification Step, a Secret Santa recipient was duplicated
    7  Verification Step, a Secret Santa giver was not in the same family
    8  Verification Step, a Secret Santa recipient was not in the same family
    9  Verification Step, a Secret Santa giver was NOT assigned a Secret Santa name
    10 Verification Step, Givers, Recipients, and Family Member count mismatch
    11 Verification Step, Giver and Receiver records do not match
    12 Completion Step, Error Saving records to DB
   */

  let processingResultCode = 0;
  let tempUserArr = cloneArray(userArr);
  let tempFamilyMemberArr = cloneArray(familyMembers);
  let secretGivers = [];
  let secretRecipients = [];
  let usersToBeGivers = [];
  let itemRemoved = false;
  let tempUserThatWasAssigned = "";
  let priorUserThatWasAssigned = "";
  let tempUsersToBeGiversFriends = [];
  let tempUsersToBeGiversChildRel = [];
  let tempUsersToBeGiversParentRel = [];
  let usersToBeGiversPotentialAssignments = [];
  let tempUsersToBeGiversPotentialAssignments = [];
  let tempIndex = 0;
  let altTempIndex = 0;

  if (consoleOutput && !secretSantaStressTesting)
    console.log("Starting Processing Attempt # " + processFamilyAttempts);
  try {
    //Iterate through all the family members and prepare to assign each user
    for (let i = 0; i < familyMembers.length; i++) {
      //Reset temp arrays prior to continuing
      tempUsersToBeGiversFriends = [];
      tempUsersToBeGiversChildRel = [];
      tempUsersToBeGiversParentRel = [];

      //Initialize temporary arrays
      tempIndex = findUIDItemInArr(tempFamilyMemberArr[i], tempUserArr, true);
      if (tempUserArr[tempIndex].secretSanta == 1) {
        usersToBeGivers.push(tempUserArr[tempIndex].uid);
        if (tempUserArr[tempIndex].friends != undefined) {
          tempUsersToBeGiversFriends = tempUserArr[tempIndex].friends;
        }
        if (tempUserArr[tempIndex].childUser != undefined) {
          tempUsersToBeGiversChildRel = tempUserArr[tempIndex].childUser;
        }
        if (tempUserArr[tempIndex].parentUser != undefined) {
          tempUsersToBeGiversParentRel = tempUserArr[tempIndex].parentUser;
        }

        //Starting with each family member's friends list, trim down each array of potential assignments
        for (let a = 0; a < tempUsersToBeGiversFriends.length; a++) {
          if (tempUsersToBeGiversParentRel.includes(tempUsersToBeGiversFriends[a])) {
            tempUsersToBeGiversFriends.splice(a, 1);
            itemRemoved = true;
          } else if (tempUsersToBeGiversChildRel.includes(tempUsersToBeGiversFriends[a])) {
            tempUsersToBeGiversFriends.splice(a, 1);
            itemRemoved = true;
          } else if (!familyMembers.includes(tempUsersToBeGiversFriends[a])) {
            tempUsersToBeGiversFriends.splice(a, 1);
            itemRemoved = true;
          } else {
            altTempIndex = findUIDItemInArr(tempUsersToBeGiversFriends[a], tempUserArr, true);
            if (altTempIndex != -1) {
              if (tempUserArr[altTempIndex].secretSanta != 1) {
                tempUsersToBeGiversFriends.splice(a, 1);
                itemRemoved = true;
              }
            } else {
              processingResultCode = 1;
              throw "Giver user initialization failure!";
            }
          }

          if (itemRemoved) {
            itemRemoved = false;
            a--;
          }
        }
        if (ignoreLastYearsAssignments == 0 && tempUserArr[tempIndex].secretSantaNamePrior != undefined) {
          let tempPriorAssignmentIndex = tempUsersToBeGiversFriends.indexOf(tempUserArr[tempIndex].secretSantaNamePrior);
          if (tempPriorAssignmentIndex != -1) {
            tempUsersToBeGiversFriends.splice(tempPriorAssignmentIndex, 1);
          }
        }

        usersToBeGiversPotentialAssignments.push(tempUsersToBeGiversFriends);
      }
    }

    //Iterate through each potential "giver" user and assign them a secret santa name
    for (let i = 0; i < usersToBeGivers.length; i++) {
      if (usersToBeGiversPotentialAssignments[i].length != 0) {
        //Find the next user to be assigned, ordering each user by whomever has the most "restrictions"
        //  This function will also call the assignment function to assign the "giver" user their secret santa name
        let tempIndex = findNextUserToBeAssigned(usersToBeGivers, usersToBeGiversPotentialAssignments);
        if (tempIndex == -1) {
          processingResultCode = 1;
          throw "Failed To Find A Viable User To Be A \"Giver\"";
        } else {
          //The "giver" user was successfully given a secret santa name, so they can be removed from the pool
          usersToBeGivers.splice(tempIndex, 1);
          usersToBeGiversPotentialAssignments.splice(tempIndex, 1);
          itemRemoved = true;
        }
      } else {
        processingResultCode = 2;
        throw "A User Had ZERO Potential Assignments!";
      }

      //Since the giver user was successfully assigned, we want to remove their secret santa name from the pool, too
      if (tempUserThatWasAssigned != "") {
        if (tempUserThatWasAssigned != priorUserThatWasAssigned) {
          for (let a = 0; a < usersToBeGiversPotentialAssignments.length; a++) {
            tempUsersToBeGiversPotentialAssignments = usersToBeGiversPotentialAssignments[a];
            tempIndex = tempUsersToBeGiversPotentialAssignments.indexOf(tempUserThatWasAssigned);
            if (tempIndex != -1) {
              tempUsersToBeGiversPotentialAssignments.splice(tempIndex, 1);
              usersToBeGiversPotentialAssignments[a] = tempUsersToBeGiversPotentialAssignments;
            }
          }
        } else {
          processingResultCode = 3;
          throw "A Secret Santa Recipient Was Duplicated"
        }
      } else {
        processingResultCode = 4;
        throw "A Secret Santa Recipient Was Not Properly Assigned To A Giver"
      }

      //Track the user that was previously assigned to ensure that immediate temporary assignments are not duplicated.
      priorUserThatWasAssigned = tempUserThatWasAssigned;

      if (itemRemoved) {
        itemRemoved = false;
        i--;
      }
    }
  } catch (err) {
    if (consoleOutput && !secretSantaStressTesting) {
      console.log("ERROR ENCOUNTERED PROCESSING FAMILY:");
      console.log(err.toString());
    }
    if (processingResultCode == 0)
      processingResultCode = -1;
  }

  //Helper function to find the next user to be assigned. Assigns the users that has the LEAST amount of possible users
  function findNextUserToBeAssigned(userList, potentialAssignments) {
    let tempLowestCount;
    let tempIndexOfLowestCount;

    tempLowestCount = potentialAssignments[0].length;
    tempIndexOfLowestCount = 0;
    for (let i = 0; i < userList.length; i++) {
      if (potentialAssignments[i].length < tempLowestCount) {
        tempLowestCount = potentialAssignments[i].length;
        tempIndexOfLowestCount = i;
      }
    }

    if (consoleOutput && !secretSantaStressTesting)
      console.log("Found Next User To Be Assigned, " + userList[tempIndexOfLowestCount]);
    //The user with the least amount of possible users is determined and verified. Assign them a name randomly.
    if (tempIndexOfLowestCount >= 0 && tempIndexOfLowestCount <= potentialAssignments.length) {
      if (potentialAssignments[tempIndexOfLowestCount].length > 0) {
        tempIndexOfLowestCount = assignUserToPotentialAssignment(tempIndexOfLowestCount, userList, potentialAssignments);
      } else {
        processingResultCode = 2;
        throw "A User Had ZERO Potential Assignments!";
      }
    } else {
      tempIndexOfLowestCount = -1;
    }

    return tempIndexOfLowestCount;
  }

  //Helper function to assign a user randomly. ReRolling is employed to prevent users from being assigned to each other.
  function assignUserToPotentialAssignment(indexToAssign, userList, potentialAssignments) {
    let selector;
    let tempIndex = 0;
    let listOfPotentialUsersArr = potentialAssignments[indexToAssign];

    for (let reRollCount = 0; reRollCount < localReRollLimit; reRollCount++) {
      selector = Math.floor((Math.random() * listOfPotentialUsersArr.length));

      tempIndex = secretGivers.indexOf(listOfPotentialUsersArr[selector]);
      if (secretRecipients[tempIndex] != userList[indexToAssign]) {
        break;
      }
    }

    tempUserThatWasAssigned = listOfPotentialUsersArr[selector];

    secretGivers.push(userList[indexToAssign]);
    secretRecipients.push(listOfPotentialUsersArr[selector]);

    tempIndex = findUIDItemInArr(userList[indexToAssign], tempUserArr, true);
    if (tempIndex != -1) {
      tempUserArr[tempIndex].secretSantaName = listOfPotentialUsersArr[selector];
    } else {
      //Return a -1 to indicate that a failure occurred
      indexToAssign = -1;
    }
    if (consoleOutput && !secretSantaStressTesting)
      console.log("Successfully Assigned " + userList[indexToAssign]);

    return indexToAssign;
  }

  //Save a specific user's assignment into the database
  function saveSecretSantaAssignmentToDB(userData) {
    firebase.database().ref("users/" + userData.uid).update({
      secretSantaName: userData.secretSantaName
    });
  }

  try {
    //Everything thus far was successful, let's verify the results
    if (processingResultCode == 0) {
      let tempIndex = 0;
      let tempGiverUser = "";
      let tempRecipientUser = "";
      let tempDuplicationCount = 0;
      if (consoleOutput && !secretSantaStressTesting)
        console.log("Successfully Completed Processing... Verifying Results.");

      //The Givers, Recipients, and Family Members size should all match
      if (secretGivers.length != secretRecipients.length && secretRecipients.length != familyMembers.length) {
        processingResultCode = 10;
        throw "Secret Santa Givers, Recipients, and Family Member count mismatch!";
      }

      //Iterate through the givers to verify that they have been assigned a name, they match with the recipient records,
      // they have not been duplicated, are within the correct family, and there are no other issues otherwise
      for (let i = 0; i < secretGivers.length; i++) {
        tempGiverUser = secretGivers[i];
        tempIndex = findUIDItemInArr(tempGiverUser, tempUserArr, true);
        if (tempIndex != -1) {
          if (tempUserArr[tempIndex].secretSantaName == undefined) {
            processingResultCode = 9;
            throw "A Secret Santa Giver was NOT assigned a name!";
          } else {
            if (tempUserArr[tempIndex].secretSantaName != secretRecipients[i]) {
              processingResultCode = 11;
              throw "The Secret Santa Giver and Receiver records do not match!";
            }
          }
        } else {
          processingResultCode = 9;
          throw "There was an issue verifying if a Secret Santa Giver was assigned a name!";
        }

        if (!familyMembers.includes(tempGiverUser)) {
          processingResultCode = 7;
          throw "A Secret Santa Giver was not in the family being assigned!";
        }

        for (let a = 0; a < secretGivers.length; a++) {
          if (tempGiverUser == secretGivers[a]) {
            tempDuplicationCount++;
          }
        }

        if (tempDuplicationCount < 1 || tempDuplicationCount > 1) {
          processingResultCode = 5;
          throw "A Secret Santa Giver was duplicated!";
        }
        tempDuplicationCount = 0;
      }

      //Iterate through the recipients to verify that they have not been duplicated, are in the expected family,
      // and there are no other issues otherwise
      for (let i = 0; i < secretRecipients.length; i++) {
        tempRecipientUser = secretRecipients[i];
        if (!familyMembers.includes(tempRecipientUser)) {
          processingResultCode = 8;
          throw "A Secret Santa Recipient was not in the family being assigned!";
        }

        for (let a = 0; a < secretRecipients.length; a++) {
          if (tempRecipientUser == secretRecipients[a]) {
            tempDuplicationCount++;
          }
        }

        if (tempDuplicationCount < 1 || tempDuplicationCount > 1) {
          processingResultCode = 6;
          throw "A Secret Santa Recipient was duplicated!";
        }
        tempDuplicationCount = 0;
      }

      if (testingInt == 0) {
        for (let i = 0; i < familyMembers.length; i++) {
          tempIndex = findUIDItemInArr(familyMembers[i], tempUserArr, true);
          if (tempIndex != -1) {
            if (consoleOutput && !secretSantaStressTesting)
              console.log("Saving " + tempUserArr[tempIndex].userName + "...");
            saveSecretSantaAssignmentToDB(tempUserArr[tempIndex]);
          } else {
            processingResultCode = 12;
            throw "There was an error saving the records to the DB!";
          }
        }
      }

      if (consoleOutput && !secretSantaStressTesting)
        console.log("Verification Complete. Secret Santa Assignments Successful!");
    }
  } catch (err) {
    if (consoleOutput && !secretSantaStressTesting) {
      console.log("ERROR ENCOUNTERED PROCESSING FAMILY:");
      console.log(err.toString());
    }
    if (processingResultCode == 0)
      processingResultCode = -1;
  }

  if (consoleOutput && !secretSantaStressTesting)
    console.log(" ***********************************************");
  return processingResultCode;

  /*
  *******Result Code Key********
   -1  is a processing error, there's something very wrong
    0  (Zero) is a success
    1  is a failure to find a viable "Giver" user
`   2  is a user that had ZERO potential assignments
    3  is a Secret Santa recipient that was duplicated
    4  is a Secret Santa recipient that was not properly assigned
    5  Verification Step, a Secret Santa giver was duplicated
    6  Verification Step, a Secret Santa recipient was duplicated
    7  Verification Step, a Secret Santa giver was not in the same family
    8  Verification Step, a Secret Santa recipient was not in the same family
    9  Verification Step, a Secret Santa giver was NOT assigned a Secret Santa name
    10 Verification Step, Givers, Recipients, and Family Member count mismatch
    11 Verification Step, Giver and Receiver records do not match
    12 Completion Step, Error Saving records to DB
   */
}

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
  } else if (familyData.secretSantaState > 3 || familyData.secretSantaState < 1) {
    familyData.secretSantaState = 1;
    firebase.database().ref("family/" + familyData.uid).update({
      secretSantaState: 1
    });
  }
  if (familyData.automaticSantaControl == undefined) {
    familyData.automaticSantaControl = 0;
    firebase.database().ref("family/" + familyData.uid).update({
      automaticSantaControl: 0
    });
  } else if (familyData.automaticSantaControl > 1 || familyData.automaticSantaControl < 0) {
    familyData.automaticSantaControl = 0;
    firebase.database().ref("family/" + familyData.uid).update({
      automaticSantaControl: 0
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
      } else if (user.secretSanta == 1) {
        updateMaintenanceLog(pageName, "Critical Error: A user was improperly assigned a Secret Santa " +
            "name! " + user.userName + " (" + user.uid + ")");
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
  let tempIndex = 0;

  showSecretSantaAssignment.onclick = function() {
    if (hideSecretSantaName) {
      tempIndex = findUIDItemInArr(user.secretSantaName, userArr, true);
      secretSantaNameText.innerHTML = "Your Secret Santa Assignment: " + userArr[tempIndex].name;
      secretSantaBtn.innerHTML = findFirstNameInFullName(userArr[tempIndex].name);
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
  secretSantaShowHideBtn = document.getElementById("secretSantaShowHideBtn");
  secretSantaSectionHeader = document.getElementById("secretSantaSectionHeader");
  secretSantaStateText = document.getElementById("secretSantaStateText");
  secretSantaNextStateText = document.getElementById("secretSantaNextStateText");
  secretSantaStatusText = document.getElementById("secretSantaStatusText");
  secretSantaInfoIcon = document.getElementById("secretSantaInfoIcon");
  secretSantaStateBtn = document.getElementById("secretSantaStateBtn");
  secretSantaShuffleBtn = document.getElementById("secretSantaShuffleBtn");
  secretSantaAutoBtn = document.getElementById("secretSantaAutoBtn");
  secretSantaExportBtn = document.getElementById("secretSantaExportBtn");

  secretSantaElements = [secretSantaShowHideBtn, secretSantaSectionHeader, secretSantaStateText, secretSantaNextStateText,
    secretSantaStatusText, secretSantaInfoIcon, secretSantaStateBtn, secretSantaShuffleBtn, secretSantaAutoBtn,
    secretSantaExportBtn];
  verifyElementIntegrity(secretSantaElements);

  //Generate shortened dates
  showDateShort = getMonthName(showDateShort.getMonth()) + " " + showDateShort.getDate() + ", " + showDateShort.getFullYear();
  assignDateShort = getMonthName(assignDateShort.getMonth()) + " " + assignDateShort.getDate() + ", " + assignDateShort.getFullYear();
}

function hideSecretSantaOptions() {
  secretSantaInfoIcon.style.display = "none";
  secretSantaSectionHeader.style.display = "none";
  secretSantaStateText.style.display = "none";
  secretSantaNextStateText.style.display = "none";
  secretSantaNextStateText.style.display = "none";
  secretSantaStatusText.style.display = "none";
  secretSantaShuffleBtn.style.display = "none";
  secretSantaStateBtn.style.display = "none";
  secretSantaAutoBtn.style.display = "none";
  secretSantaExportBtn.style.display = "none";

  secretSantaStateBtn.onclick = function() {};
  secretSantaAutoBtn.onclick = function() {};
  secretSantaShuffleBtn.onclick = function() {};
  secretSantaExportBtn.onclick = function() {};
}

function initializeSecretSantaFamilyModalElements(familyData) {
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
  if (familyData.automaticSantaControl == undefined) {
    familyData.automaticSantaControl = 0;
    firebase.database().ref("family/" + familyData.uid).update({
      automaticSantaControl: 0
    });
  } else if (familyData.automaticSantaControl > 1 || familyData.automaticSantaControl < 0) {
    familyData.automaticSantaControl = 0;
    firebase.database().ref("family/" + familyData.uid).update({
      automaticSantaControl: 0
    });
  }
  if (familyData.showSecretSantaOptions == undefined) {
    familyData.showSecretSantaOptions = 0;
    firebase.database().ref("family/" + familyData.uid).update({
      showSecretSantaOptions: 0
    });
  } else if (familyData.showSecretSantaOptions > 1 || familyData.showSecretSantaOptions < 0) {
    familyData.showSecretSantaOptions = 0;
    firebase.database().ref("family/" + familyData.uid).update({
      showSecretSantaOptions: 0
    });
  }

  if (familyData.automaticSantaControl == 0) {
    secretSantaAutoBtn.innerHTML = "Enable Automatic Control";
  } else if (familyData.automaticSantaControl == 1) {
    secretSantaAutoBtn.innerHTML = "Disable Automatic Control";
  }

  if (familyData.members == undefined)
    familyData.members = [];

  secretSantaSectionHeader.style.display = "block";
  secretSantaInfoIcon.style.display = "inline-block";
  secretSantaInfoIcon.onclick = function() {
    deployNotificationModal(true, "Secret Santa Info", "These are the Secret Santa " +
        "Controls. Depending on what state Secret Santa is in, some buttons will not appear. Additional information " +
        "regarding the Secret Santa status is also provided for your benefit, like the current state, next state, and " +
        "current status.<br><br>" +
        "The four total buttons are CHANGE STATE, SHUFFLE, AUTOMATIC CONTROL, and EXPORT.<br>" +
        "->EXPORT: This button will export a list of signed up users (Ready state) or a list of the assigned users " +
        "(Active state) in csv format.<br>" +
        "->AUTOMATIC CONTROL: This button will automatically change Secret Santa states on predetermined dates, when active.<br>" +
        "->SHUFFLE: This button will shuffle the family member's Secret Santa assignments.<br>" +
        "->CHANGE STATE: This button will change the Secret Santa states.<br><br>" +
        "The three Secret Santa states are as follows:<br>" +
        "->Idle State:<br>" +
        "--->This state is when Secret Santa is idle. Nothing is happening and each family member will not see any Secret " +
        "Santa prompts. This state will also reset any Secret Santa settings for every family member!<br>" +
        "->Ready State:<br>" +
        "--->This state is when Secret Santa is ready to assign users. Each family member will see a \"Sign Up\" button " +
        "on the \"Gift Lists\" page. Once enough users are signed up (" + familyMemberSignUpMinimum + "), then the " +
        "next state can be activated.<br>" +
        "->Active State:<br>" +
        "--->This state is when Secret Santa is fully active. Each family member has been assigned a user to buy a gift for. " +
        "Let the gifting begin!", 60);
  };
  if (familyData.secretSantaState == 1) {
    secretSantaStateText.innerHTML = "Secret Santa State: Idle";
    secretSantaNextStateText.innerHTML = "Next Secret Santa State: Ready";
    secretSantaNextStateText.style.display = "block";
    secretSantaStatusText.style.display = "none";
    secretSantaShuffleBtn.style.display = "none";
    secretSantaStateBtn.style.display = "inline-block";
    secretSantaAutoBtn.style.display = "inline-block";
    secretSantaExportBtn.style.display = "none";

    secretSantaStateBtn.onclick = function() {
      manualStateChange = true;
      changeSecretSantaState(familyData, 2, false);
    };
    secretSantaAutoBtn.onclick = function() {
      toggleAutomaticFunctionality(familyData);
    };
    secretSantaShuffleBtn.onclick = function() {};
    secretSantaExportBtn.onclick = function() {};
  } else if (familyData.secretSantaState == 2) {
    secretSantaStateText.innerHTML = "Secret Santa State: Ready";
    secretSantaNextStateText.innerHTML = "Next Secret Santa State: Active";
    secretSantaShuffleBtn.innerHTML = "Test Assignments";
    if (familyData.automaticSantaControl == 1) {
      secretSantaStatusText.innerHTML = "Secret Santa Status: Assigning Names On " + assignDateShort;
    } else {
      secretSantaStatusText.innerHTML = "Secret Santa Status: Ready To Assign Names";
    }
    secretSantaNextStateText.style.display = "block";
    secretSantaStatusText.style.display = "block";
    secretSantaShuffleBtn.style.display = "inline-block";
    secretSantaStateBtn.style.display = "inline-block";
    secretSantaAutoBtn.style.display = "inline-block";
    secretSantaExportBtn.style.display = "inline-block";

    secretSantaStateBtn.onclick = function() {
      manualStateChange = true;
      changeSecretSantaState(familyData, 3, false);
    };
    secretSantaAutoBtn.onclick = function() {
      toggleAutomaticFunctionality(familyData);
    };
    secretSantaExportBtn.onclick = function() {
      exportSecretSantaData(1, familyData);
    };
    secretSantaShuffleBtn.onclick = function() {
      if (familyData.members.length >= familyMemberSignUpMinimum) {
        if (evaluateUserReadiness(familyData.members)) {
          assignUsersToNames(familyData.members, 1);
        } else {
          deployNotificationModal(true, "Testing Failed!", "Not enough members " +
              "are signed up! Make sure that at least " + familyMemberSignUpMinimum + " family members are signed up " +
              "prior to trying again!");
        }
      } else {
        deployNotificationModal(true, "Testing Failed!", "There are not enough " +
            "members in this family! Make sure that at least " + familyMemberSignUpMinimum + " family members are in " +
            "this family and signed up prior to trying again!");
      }
    };
  } else if (familyData.secretSantaState == 3) {
    secretSantaStateText.innerHTML = "Secret Santa State: Active";
    secretSantaNextStateText.innerHTML = "Next Secret Santa State: Idle";
    secretSantaShuffleBtn.innerHTML = "Shuffle";
    if (familyData.automaticSantaControl == 1) {
      secretSantaStatusText.innerHTML = "Secret Santa Status: Activating On " + showDateShort;
    } else {
      secretSantaStatusText.innerHTML = "Secret Santa Status: Nominal";
    }
    secretSantaNextStateText.style.display = "block";
    secretSantaShuffleBtn.style.display = "inline-block";
    secretSantaStateBtn.style.display = "inline-block";
    secretSantaAutoBtn.style.display = "inline-block";
    secretSantaExportBtn.style.display = "inline-block";

    secretSantaStateBtn.onclick = function() {
      manualStateChange = true;
      changeSecretSantaState(familyData, 1, false);
    };
    secretSantaShuffleBtn.onclick = function() {
      if (!assignUsersToNames(familyData.members)) {
        deployNotificationModal(true, "Secret Santa Shuffle Failed!", "Shuffling " +
            "Secret Santa users was unsuccessful! Please try again...");
      } else {
        if (!secretSantaShuffledInSession) {
          secretSantaShuffledInSession = true;
          updateMaintenanceLog(pageName, "Successfully shuffled the family, \"" + familyData.name + "\"" +
              "! This was initiated by " + user.userName  + " (" + user.uid + ").");
        }
      }
    };
    secretSantaAutoBtn.onclick = function() {
      toggleAutomaticFunctionality(familyData);
    };
    secretSantaExportBtn.onclick = function() {
      exportSecretSantaData(2, familyData);
    };
  }

  if (familyData.showSecretSantaOptions == 0) {
    setSecretSantaShow();
  } else if (familyData.showSecretSantaOptions == 1) {
    setSecretSantaHide();
  }

  function setSecretSantaShow() {
    hideSecretSantaOptions();
    secretSantaShowHideBtn.innerHTML = "Show Secret Santa Options";
    secretSantaShowHideBtn.onclick = function() {
      familyData.showSecretSantaOptions = 1;
      initializeSecretSantaFamilyModalElements(familyData);
      firebase.database().ref("family/" + familyData.uid).update({
        showSecretSantaOptions: 1
      });
    }
  }

  function setSecretSantaHide() {
    secretSantaShowHideBtn.innerHTML = "Hide Secret Santa Options";
    secretSantaShowHideBtn.onclick = function() {
      familyData.showSecretSantaOptions = 0;
      hideSecretSantaOptions();
      setSecretSantaShow();
      firebase.database().ref("family/" + familyData.uid).update({
        showSecretSantaOptions: 0
      });
    };
  }
}

function changeSecretSantaState(familyData, desiredStateInt, suppressDialogs) {
  let stateIndicatorText;
  let changedStateConcatString;
  let validStateChange = false;
  let invalidStateChangeReason = "";
  let invalidModalOpenTime = 10;

  if (manualStateChange) {
    toggleAutomaticFunctionality(familyData, 0);
    updateMaintenanceLog(pageName, "A manual state change was triggered by " + user.userName + " (" +
        user.uid + ")" + " for the family \"" + familyData.name + "\". Please note that manually changing the state of " +
        "Secret Santa when Automatic Control is enabled will cause the Automatic Control to be disabled as a result.");
  }

  switch (desiredStateInt) {
    case 1:
      if (unassignAllFamilyMembers(familyData))
        validStateChange = true;
      invalidStateChangeReason = "Deactivating Secret Santa was unsuccessful! Please try again...";
      stateIndicatorText = "Idle";
      break;
    case 2:
      stateIndicatorText = "Ready";
      validStateChange = true;
      break;
    case 3:
      if (evaluateUserReadiness(familyData.members))
        validStateChange = true;
      if (familyData.members.length >= familyMemberSignUpMinimum) {
        invalidStateChangeReason = "Not enough members are signed up! Make sure that at least " +
            familyMemberSignUpMinimum + " family members are signed up prior to trying again!";
      } else {
        invalidStateChangeReason = "There are not enough members in this family! Make sure that at least " +
            familyMemberSignUpMinimum + " family members are in this family and signed up prior to trying again!";
      }
      if (validStateChange)
        if (assignUsersToNames(familyData.members)) {
          validStateChange = true;
          updateMaintenanceLog(pageName, "Successfully assigned the members of the family, \"" +
              familyData.name + "\"! This was initiated by " + user.userName  + " (" + user.uid + ").");
        } else {
          invalidStateChangeReason = "Assigning Secret Santa users was unsuccessful! Please try again...";
        }
      stateIndicatorText = "Active";
      break;
  }

  if (!suppressDialogs) {
    let updateFamily = document.getElementById("family" + familyData.uid);
    updateFamily.innerHTML = familyData.name;
    generateFamilyMemberList(updateFamily, familyData.members);
  }

  if (validStateChange) {
    firebase.database().ref("family/" + familyData.uid).update({
      secretSantaState: desiredStateInt
    });

    changedStateConcatString = familyData.name + "'s Secret Santa State has been successfully changed to " +
        stateIndicatorText + "!";

    familyData.secretSantaState = desiredStateInt;
    if (!suppressDialogs) {
      deployNotificationModal(true, "State Changed!", changedStateConcatString, 4);
      initializeSecretSantaFamilyModalElements(familyData);
    } else {
      updateMaintenanceLog(pageName, familyData.name + "'s Secret Santa Automatic Control successfully " +
          "changed to state " + desiredStateInt + ". This change was triggered by " + user.userName +
          " (" + user.uid + ")");
    }
  } else {
    if (invalidStateChangeReason.length > 150)
      invalidModalOpenTime = 20;
    if (!suppressDialogs) {
      deployNotificationModal(true, "Secret Santa State Change Failed!",
          invalidStateChangeReason, invalidModalOpenTime);
    } else {
      if (consoleOutput)
        console.log("Secret Santa state change failed! Reason: " + invalidStateChangeReason);
      automaticControlFailureCount++;
      updateMaintenanceLog(pageName, "Secret Santa Automatic Control FAILED to change to state " +
          desiredStateInt + " for the family \"" + familyData.name + "\". This automatic state change was triggered " +
          "by " + user.userName + " (" + user.uid + "). This failure was possibly due to: \"" +
          invalidStateChangeReason + "\"");
      checkForFailedFamilies();
    }
  }
  saveCriticalCookies();
  manualStateChange = false;
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

function toggleAutomaticFunctionality(familyData, automaticOverride) {
  if (automaticOverride != undefined) {
    let enableDisableAutoStr = "Enabled";

    if (automaticOverride == 0)
      enableDisableAutoStr = "Disabled";

    firebase.database().ref("family/" + familyData.uid).update({
      automaticSantaControl: automaticOverride
    });

    if (consoleOutput)
      console.log("Set Automatic Control Override (" + enableDisableAutoStr + ")");
  } else {
    let currentAutomaticControlCount = 0;

    for (let i = 0; i < familyArr.length; i++) {
      if (familyArr[i].automaticSantaControl == undefined)
        familyArr[i].automaticSantaControl = 0;

      if (familyArr[i].automaticSantaControl == 1) {
        currentAutomaticControlCount++;
      }
    }

    if (familyData.automaticSantaControl == 1) {
      firebase.database().ref("family/" + familyData.uid).update({
        automaticSantaControl: 0
      });
      deployNotificationModal(false, "Automatic Control Disabled!", "Secret Santa " +
          "Automatic Control has been successfully disabled!");
    } else if (currentAutomaticControlCount < automaticSecretSantaLimit) {
      if (familyData.automaticSantaControl == 0) {
        firebase.database().ref("family/" + familyData.uid).update({
          automaticSantaControl: 1
        });
        deployNotificationModal(false, "Automatic Control Enabled!", "Secret Santa " +
            "Automatic Control has been successfully enabled!");
      }
    } else {
      deployNotificationModal(true, "Automatic Control Limit Reached!", "Warning! " +
          "You have reached the set limit of families that can have Automatic Control Enabled! Disable some other " +
          "families and try again!<br><br><br>If desired, this limit can be changed in the common.js file of Gifty and " +
          "redeployed. Please note that an increased amount of automatic controlled families will potentially degrade " +
          "the Gifty experience!", 20);
    }
  }
}

function exportSecretSantaData(desiredExportType, familyData) {
  if (!runningExportProcess) {
    runningExportProcess = true;
    let familyMembers = familyData.members;
    console.log(familyMembers);
    let today = new Date();
    let UTCmm = today.getUTCMinutes();
    let UTChh = today.getUTCHours();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yy = today.getFullYear();
    let hh = today.getUTCHours();
    let utcMin = today.getUTCMinutes();
    let ss = today.getUTCSeconds();
    let exportDate = mm + "/" + dd + "/" + yy + " " + UTChh + ":" + UTCmm + " (UTC)";
    let timeStamp = "" + mm + dd + yy + hh + utcMin + ss;
    let backupData = "";
    let fileNamePrefix = "";
    let concreteExportType = "";

    if (desiredExportType == 1) {
      backupData = "\"GiftySecretSantaSignUpDataFile\",\"ExportDate: " + exportDate + "\",\"Family: " +
          familyData.name + "\",\"SecretSantaState: Ready\"\n";
      fileNamePrefix = "SignUps";
      concreteExportType = "sign ups";
    } else if (desiredExportType == 2) {
      backupData = "\"GiftySecretSantaAssignmentsDataFile\",\"ExportDate: " + exportDate + "\",\"Family: " +
          familyData.name + "\",\"SecretSantaState: Active\"\n";
      fileNamePrefix = "Assignments";
      concreteExportType = "assignments";
    }

    backupData += compileExportData(desiredExportType, familyMembers);
    let exportElement = document.createElement('a');
    let exportFilename = "Gifty" + fileNamePrefix + "Export-" + timeStamp + ".csv";

    let blob = new Blob([backupData], {type: "text/plain"});
    let url = window.URL.createObjectURL(blob);
    exportElement.href = url;
    exportElement.download = exportFilename;
    exportElement.click();
    window.URL.revokeObjectURL(url);
    deployNotificationModal(true, "Export Generated!", familyData.name + "'s " +
        "export file has been generated with their Secret Santa " + concreteExportType + " due to the current " +
        "Secret Santa state. The exported file name is: " + exportFilename, 10);
  } else {
    deployNotificationModal(true, "Currently Running Export... Please Wait!", "An " +
        "existing export is still running! Please wait until your first export completes and a file has been saved to " +
        "your machine.");
  }

  function compileExportData(exportType, familyMemberArr) {
    let outputData = "";
    let tempSignUpAssign = "";
    let tempIndex = 0;
    let tempIndexAlt = 0;

    if (exportType == 1) {
      outputData += "\"User UID\",\"User Name\",\"Full Name\",\"Signed Up?\"\n";
    } else if (exportType == 2) {
      outputData += "\"User UID\",\"User Name\",\"Full Name\",\"Assigned Name\"\n";
    }

    for (let i = 0; i < familyMemberArr.length; i++) {
      tempIndex = findUIDItemInArr(familyMemberArr[i], userArr, true);
      if (tempIndex != -1) {
        if (exportType == 1) {
          if (userArr[tempIndex].secretSanta == undefined)
            userArr[tempIndex].secretSanta = 0;
          if (userArr[tempIndex].secretSanta == 1)
            tempSignUpAssign = "Yes";
          else
            tempSignUpAssign = "No";
          outputData += "\"" + userArr[tempIndex].uid + "\",\"" + userArr[tempIndex].userName + "\",\""
              + userArr[tempIndex].name + "\",\"" + tempSignUpAssign + "\"\n";
        } else if (exportType == 2) {
          if (userArr[tempIndex].secretSantaName == undefined)
            tempSignUpAssign = "Error! Assignment Failure...";
          tempIndexAlt = findUIDItemInArr(userArr[tempIndex].secretSantaName, userArr, true);
          if (tempIndexAlt == -1)
            tempSignUpAssign = "Error! Assignment Failure...";
          else
            tempSignUpAssign = userArr[tempIndexAlt].name;
          outputData += "\"" + userArr[tempIndex].uid + "\",\"" + userArr[tempIndex].userName + "\",\""
              + userArr[tempIndex].name + "\",\"" + tempSignUpAssign + "\"\n";
        }
      }
    }

    runningExportProcess = false;
    return outputData;
  }
}

function unassignAllFamilyMembers(familyData) {
  let tempIndex = 0;
  let errorEncountered = false;
  let familyMembers = familyData.members;

  for (let i = 0; i < familyMembers.length; i++) {
    tempIndex = findUIDItemInArr(familyMembers[i], userArr, true);
    if (tempIndex != -1) {
      try {
        console.log("Resetting " + userArr[tempIndex].userName);
        resetSecretSantaNum(tempIndex);
        resetSecretSantaName(tempIndex);
      } catch (err) {
        if (consoleOutput)
          console.log("Error Occurred! " + err.toString());
        errorEncountered = true;
      }
    }
  }

  return !errorEncountered;

  function resetSecretSantaName(tempIndex) {
    let userData = userArr[tempIndex];
    let tempPreviousSecretSanta = userData.secretSantaName;

    if (userData.secretSantaNamePrior == undefined)
      userData.secretSantaNamePrior = "";
    if (userData.secretSantaName == "" && userData.secretSantaNamePrior != "") {
      tempPreviousSecretSanta = userData.secretSantaNamePrior;
    }

    if (consoleOutput)
      console.log(userData.userName + "'s Current -> Previous Assignment: " + tempPreviousSecretSanta);
    firebase.database().ref("users/" + userData.uid).update({
      secretSantaNamePrior: tempPreviousSecretSanta,
      secretSantaName: ""
    });

    userArr[tempIndex].secretSantaName = "";
  }

  function resetSecretSantaNum(tempIndex) {
    let userData = userArr[tempIndex];

    if (consoleOutput)
      console.log("Resetting " + userData.userName + "'s Secret Santa Status...");
    firebase.database().ref("users/" + userData.uid).update({
      secretSanta: 0
    });

    userArr[tempIndex].secretSanta = 0;
  }
}

function assignUsersToNames(familyMembers, testingInt) {
  let ignoreLastYearsAssignments = 0;
  let ignoreLastYearsAssignmentsThreshold;
  let processingResults = 0;
  let processingSuccess = false;
  let previousLimitValue = 0;

  if (testingInt == undefined) {
    testingInt = 0;
  }

  if (secretSantaStressTesting) {
    if (secretSantaStatusText.innerHTML == "Secret Santa Status: Nominal" ||
        secretSantaStatusText.innerHTML == "Secret Santa Status: Ready To Assign Names") {
      previousStatusValue = secretSantaStatusText.innerHTML;
    }

    secretSantaStatusText.innerHTML = "Processing...";
    previousLimitValue = assignmentAttemptLimits;
    assignmentAttemptLimits = secretSantaStressTestingLimit;
    ignoreLastYearsAssignmentsThreshold = secretSantaStressTestingLimit * 0.9;
  } else {
    previousLimitValue = assignmentAttemptLimits;
    ignoreLastYearsAssignmentsThreshold = assignmentAttemptLimits * 0.5;
  }

  for (let i = 0; i < assignmentAttemptLimits; i++) {
    if (i > ignoreLastYearsAssignmentsThreshold) {
      ignoreLastYearsAssignments = 1;
    }

    if (consoleOutput && !secretSantaStressTesting)
      console.log(" ***********************************************");
    processingResults = processFamily(familyMembers, ignoreLastYearsAssignments, testingInt);
    console.log("Result Code: " + processingResults);

    if (processingResults == 0 && !secretSantaStressTesting) {
      processingSuccess = true;
      break;
    } else {
      if (processingResults == 0) {
        processingSuccessCount++;
      } else {
        processingFailureCount++;
      }
    }
  }

  if (!secretSantaStressTesting && testingInt == 1) {
    setSecretSantaResultsText(processingResults, ignoreLastYearsAssignments, testingInt, processFamilyAttempts, false);
  } else if (secretSantaStressTesting && testingInt == 1) {
    setSecretSantaResultsText(null, null, null, null, true);
    processingFailureCount = 0;
    processingSuccessCount = 0;
  }

  assignmentAttemptLimits = previousLimitValue;
  processFamilyAttempts = 0;

  return processingSuccess;
}

function setSecretSantaResultsText(processingResults, ignoreLastYearsAssignments, testingInt, attemptCount, stressOverride) {
  let successfulStressTest = processingSuccessCount;
  let failedStressTest = processingFailureCount;
  let totalStressTests = successfulStressTest + failedStressTest;
  /*
  *******Result Code Key********
   -1  is a processing error, there's something very wrong
    0  (Zero) is a success
    1  is a failure to find a viable "Giver" user
`   2  is a user that had ZERO potential assignments
    3  is a Secret Santa recipient that was duplicated
    4  is a Secret Santa recipient that was not properly assigned
    5  Verification Step, a Secret Santa giver was duplicated
    6  Verification Step, a Secret Santa recipient was duplicated
    7  Verification Step, a Secret Santa giver was not in the same family
    8  Verification Step, a Secret Santa recipient was not in the same family
    9  Verification Step, a Secret Santa giver was NOT assigned a Secret Santa name
    10 Verification Step, Givers, Recipients, and Family Member count mismatch
    11 Verification Step, Giver and Receiver records do not match
    12 Completion Step, Error Saving records to DB
   */

  if (secretSantaStatusText.innerHTML == "Secret Santa Status: Nominal" ||
      secretSantaStatusText.innerHTML == "Secret Santa Status: Ready To Assign Names") {
    previousStatusValue = secretSantaStatusText.innerHTML;
  }

  if (!stressOverride) {
    console.log(fetchProcessingStatusText());
    if (processingResults == 0) {
      secretSantaStatusText.innerHTML = "Secret Santa Status: " + "Successful Assignment After " + attemptCount +
          " Tries!";
    } else {
      secretSantaStatusText.innerHTML = "Secret Santa Status: " + "UNSUCCESSFUL Assignment After " + attemptCount +
          " Tries... Check Console For More Details...";
      if (consoleOutput)
        console.log("Errors usually occur due to users that have too many restrictions... This can be resolved by " +
            "removing the amount of relationships that each user has, increasing the amount of friends in each user's " +
            "friend list, increasing the amount of signed up users in a family, " +
            "and/or increasing the amount of users in a given family.");
    }
  } else {
    secretSantaStatusText.innerHTML = "Secret Santa Status: Stress Testing Enabled, " +
        "Successful: " + successfulStressTest + " Failed: " + failedStressTest + " Total: " + totalStressTests;
  }

  processingResultTextTimer = 0;
  clearInterval(processingResultTextInterval);
  processingResultTextInterval = setInterval(function () {
    processingResultTextTimer = processingResultTextTimer + 1;
    if (processingResultTextTimer > processingResultTextLimit) {
      secretSantaStatusText.innerHTML = previousStatusValue;
      clearInterval(processingResultTextInterval);
    }
  }, 1000);

  function fetchProcessingStatusText() {
    let processingStatusText = "";

    if (attemptCount > 1) {
      processingStatusText = processingStatusText + attemptCount + " Attempts, ";
    }
    if (testingInt == 1) {
      processingStatusText = processingStatusText + "After Testing, ";
    }
    if (ignoreLastYearsAssignments == 1) {
      processingStatusText = processingStatusText + "Ignoring Last Years Assignments, ";
    }

    switch (processingResults) {
      case 0:
        //0  (Zero) is a success
        processingStatusText = processingStatusText + "Successfully Completed!";
        break;
      case 1:
        //1  is a failure to find a viable "Giver" user
      case 2:
        //2  is a user that had ZERO potential assignments
      case 3:
        //3  is a Secret Santa recipient that was duplicated
      case 4:
        //4  is a Secret Santa recipient that was not properly assigned
      case 5:
        //5  Verification Step, a Secret Santa giver was duplicated
      case 6:
        //6  Verification Step, a Secret Santa recipient was duplicated
      case 7:
        //7  Verification Step, a Secret Santa giver was not in the same family
      case 8:
        //8  Verification Step, a Secret Santa recipient was not in the same family
      case 9:
        //9  Verification Step, a Secret Santa giver was NOT assigned a Secret Santa name
      case 10:
        //10 Verification Step, Givers, Recipients, and Family Member count mismatch
      case 11:
        //11 Verification Step, Giver and Receiver records do not match
      case 12:
        //12 Completion Step, Error Saving records to DB
        processingStatusText = processingStatusText + "Encountered some errors... Check the console log for more details.";
        break;
      case -1:
      default:
        //-1  is a processing error, there's something very wrong
        processingStatusText = processingStatusText + "Encountered some UNKNOWN errors... Check the console log for more details.";
        break;
    }

    return processingStatusText;
  }
}

function dateCalculationHandler(familyData) {
  let currentFamilyState = familyData.secretSantaState;
  let currentFamilyName = familyData.name;
  let desiredNextState;

  if (consoleOutput)
    console.log(" * * * Secret Santa Automatic Control * * *");

  commonToday = new Date();
  let UTChh = commonToday.getUTCHours() + "";
  let UTCmm = commonToday.getUTCMinutes() + "";
  let UTCss = commonToday.getUTCSeconds() + "";
  let dd = commonToday.getUTCDate() + "";
  let mm = commonToday.getMonth() + 1 + "";
  let yy = commonToday.getFullYear() + "";


  if (UTChh.length == 1)
    UTChh = "0" + UTChh
  if (UTCmm.length == 1)
    UTCmm = "0" + UTCmm
  if (UTCss.length == 1)
    UTCss = "0" + UTCss
  if (dd.length == 1)
    dd = "0" + dd
  if (mm.length == 1)
    mm = "0" + mm

  let timeData = mm + "/" + dd + "/" + yy + " " + UTChh + ":" + UTCmm + ":" + UTCss;

  if (showDate <= commonToday && commonToday < assignDate) { //Between October 1st and November 1st
    if (consoleOutput)
      console.log("SET STATE 2, READY");
    desiredNextState = 2;
  } else if (assignDate <= commonToday && (hideDateMax < commonToday.getMonth())) { //Between November 1st and January
    if (consoleOutput)
      console.log("SET STATE 3, ACTIVE - ASSIGN USERS");
    desiredNextState = 3;
  } else if (commonToday < showDate &&
      (hideDateMin <= commonToday.getMonth() && commonToday.getMonth() <= hideDateMax)) { //Between January and October
    if (consoleOutput)
      console.log("SET STATE 1, IDLE");
    desiredNextState = 1;
  } else {
    if (consoleOutput)
      console.log("Unknown Condition! Setting To Default!");
    desiredNextState = 1;
  }

  if (familyData.secretSantaState == 2 && desiredNextState == 3)
    if (familyData.members.length >= familyMemberSignUpMinimum) {
      if (evaluateUserReadiness(familyData.members)) {
        if (consoleOutput)
          console.log("Family Members Checked And Verified");
      } else {
        automaticControlFailureCount++;
        updateMaintenanceLog(pageName, "Secret Santa Automatic Control FAILED to assign users to each " +
            "other for the family \"" + familyData.name + "\". There were not enough family members signed up. " +
            "Please note that automatic control has been disabled for this family. This automatic state change was " +
            "triggered by " + user.userName + " (" + user.uid + ").");
        toggleAutomaticFunctionality(familyData, 0);
        checkForFailedFamilies();
        return;
      }
    } else {
      automaticControlFailureCount++;
      updateMaintenanceLog(pageName, "Secret Santa Automatic Control FAILED to assign users to each " +
          "other for the family \"" + familyData.name + "\". There were not enough members in the family. " +
          "Please note that automatic control has been disabled for this family. This automatic state change was " +
          "triggered by " + user.userName + " (" + user.uid + ").");
      toggleAutomaticFunctionality(familyData, 0);
      checkForFailedFamilies();
      return;
    }

  if (desiredNextState == familyData.secretSantaState) {
    if (consoleOutput)
      console.log("No State Change Needed...");
  } else if (desiredNextState != (familyData.secretSantaState + 1) &&
      !(familyData.secretSantaState == 3 && desiredNextState == 1)) {
    if (consoleOutput)
      console.log(" * * Skipped State Detected! * *");
    automaticControlFailureCount++;
    updateMaintenanceLog(pageName, "Secret Santa Automatic Control FAILED to change to state " +
        desiredNextState + " for the family \"" + familyData.name + "\". The users in this family are not active " +
        "enough on Gifty. Please note that automatic control has been disabled for this family. This automatic state " +
        "change was triggered by " + user.userName + " (" + user.uid + ").");
    toggleAutomaticFunctionality(familyData, 0);
    checkForFailedFamilies();
  } else {
    console.log("Performing State Change...");
    changeSecretSantaState(familyData, desiredNextState, true);
  }

  if (consoleOutput) {
    console.log("Family: " + currentFamilyName);
    console.log("Current Time: " + timeData);
    console.log("Old State: " + currentFamilyState);
    console.log("New State: " + desiredNextState);
    console.log(" * * * Secret Santa Automatic Control Complete * * *");
  }
}

function checkForFailedFamilies(failureCheckDelay) {
  let familySupplementText = "family";

  if (failureCheckDelay == undefined)
    failureCheckDelay = automaticControlFailureLimit;

  if (automaticControlFailureCount > 0 && user.moderatorInt == 1) {
    if (automaticControlFailureCount > 1)
      familySupplementText = "families";

    automaticControlFailureTimer = 0;
    clearInterval(automaticControlFailureInterval);
    automaticControlFailureInterval = setInterval(function () {
      automaticControlFailureTimer = automaticControlFailureTimer + 1;
      if (automaticControlFailureTimer > failureCheckDelay) {
        deployNotificationModal(true, "Secret Santa Automatic Control Failure",
            "Unfortunately " + automaticControlFailureCount + " " + familySupplementText +
            " encountered issues during Secret Santa automatic control. Check the audit log for more details.", 10);
        automaticControlFailureCount = 0;
        clearInterval(automaticControlFailureInterval);
      }
    }, 1000);
  }
}
