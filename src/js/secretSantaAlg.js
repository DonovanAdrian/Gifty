/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let secretBtnStates = [false, false];
let tempUserArr = [];
let assignedNameUsers = [];
let assignedUsers = [];
let removedUsers = [];

let ignoreFamilySet = false;
let showSecretTextCycler = false;

let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let showDate = new Date(currentYear, 10, 1, 0, 0, 0, 0);//Oct 1st
let assignDate = new Date(currentYear, 11, 1, 0, 0, 0, 0);//Nov 1st
let hideDateMin = 1; //Jan
let hideDateMax = 9; //Sept

let globalThanks = "Thank you for participating in the Secret Santa! See you next year!";
let globalApology = "Unfortunately the Secret Santa for this year has come to an early end! Please contact" +
  " a moderator for assistance";

let ignoreFamilySetTimer;
let textCyclerInterval;
let textCyclerLimiter = 0;

let giftListInterval;

let friendScoreNote = 0;
let failureReason = "Unknown Error";
let usersNotAssignedAlert = false;



function checkSecretSanta(autoUpdateBool){
  if(autoUpdateBool) {
    if (currentDate >= showDate && currentDate <= assignDate)
      showSecretSanta();
    if (currentDate >= assignDate && currentDate.getMonth() <= hideDateMin) {
      showSecretSanta();
      if(!checkIfSantaActive())
        createSecretSantaNames();
    }
    if (currentDate.getMonth() >= hideDateMin && currentDate.getMonth() <= hideDateMax)
      hideSecretSanta();
  } else
    hideSecretSanta();
}

function showSecretSanta(){
  if (user.secretSanta == null) {
    if (!checkIfSantaActive()) {
      secretSantaSignUp.style.display = "block";
      secretSantaSignUp.innerHTML = "Sign Up For Secret Santa";
    }
  } else {
    if (user.secretSanta == 0 && !checkIfSantaActive()) {
      secretSantaSignUp.style.display = "block";
      secretSantaSignUp.innerHTML = "Sign Up For Secret Santa";
    } else if (user.secretSanta == 1 && !checkIfSantaActive()) {
      secretSantaSignUp.style.display = "block";
      secretSantaSignUp.innerHTML = "Opt-Out Of Secret Santa";
    } else if (user.secretSanta == 1 && checkIfSantaActive()) {
      if (user.secretSantaName != null) {
        if (user.secretSantaName != "") {
          let i = findUIDItemInArr(user.secretSantaName, userArr, true);
          secretSantaData = userArr[i];
          secretSantaSignUp.innerHTML = userArr[i].name;
          secretSantaSignUp.style.display = "block";
        }
      }
    }
  }

  secretSantaSignUp.onclick = function() {
    if (checkIfSantaActive()) {
      generateSecretSantaModal();
    } else {
      if (user.secretSanta != null) {
        if (user.secretSanta == 0) {
          firebase.database().ref("users/" + user.uid).update({
            secretSanta: 1
          });
          user.secretSanta = 1;
          alert("You Have Been Opted Into Secret Santa! The Secret Santa Will Start Soon, Check Back Soon For Your Secret" +
            " Santa Recipient!");
          secretSantaSignUp.innerHTML = "Opt-Out Of Secret Santa";
        } else {
          firebase.database().ref("users/" + user.uid).update({
            secretSanta: 0
          });
          user.secretSanta = 0;
          alert("You Have Opted Out Of Secret Santa.");
          secretSantaSignUp.innerHTML = "Sign Up For Secret Santa";
        }
      } else {
        firebase.database().ref("users/" + user.uid).update({
          secretSanta: 1
        });
        user.secretSanta = 1;
        alert("You Have Been Opted Into Secret Santa! The Secret Santa Will Start Soon, Check Back Soon For Your Secret" +
          " Santa Recipient!");
        secretSantaSignUp.innerHTML = "Opt-Out Of Secret Santa";
      }
      sessionStorage.setItem("validUser", JSON.stringify(user));
    }
  };
}

function hideSecretSanta(){
  let clearSecretSantasBool = false;
  let manuallyEnableActiveBool = false;
  let globalSecretSantaMessage = "";

  try {
    secretSantaSignUp.style.display = "none";
    secretSantaSignUp.onclick = function () {};
  } catch (err) {}
  try {
    manuallyEnableActiveBool = secretBtnStates[1];
  } catch (err) {}

  if (currentDate >= showDate && currentDate.getMonth() < hideDateMin && checkIfSantaSignUp()) {
    clearSecretSantasBool = true;
    globalSecretSantaMessage = globalApology;
  } else if (currentDate.getMonth() >= hideDateMin && currentDate.getMonth() <= hideDateMax && checkIfSantaActive()) {
    clearSecretSantasBool = true;
    globalSecretSantaMessage = globalThanks;
  } else {
    if (consoleOutput && secretBtnStates[1])
      alert("It seems that the Secret Santa was cancelled out of cycle!");
  }

  if (clearSecretSantasBool) {
    if(checkForGlobalMessage() && manuallyEnableActiveBool) {
      addGlobalMessageToDB(globalSecretSantaMessage);
      if(consoleOutput)
        console.log("Sent A Global Message!");
    }

    removeSecretSantaNames();
    if(consoleOutput)
      console.log("Removed Secret Santa Names!");
    updateAllUsersToDBSantaNames();

    removeSecretSantaNums();
    if(consoleOutput)
      console.log("Removed Secret Santa Nums!");
    updateAllUsersToDBSantaNums();
  }
}

function checkIfSantaSignUp() {
  let signUpLimit = 0;

  for (let i = 0; i < userArr.length; i++)
    if(userArr[i].secretSanta != null)
      if(userArr[i].secretSanta > 0) {
        signUpLimit++;
      }

  if (signUpLimit > 2)
    return true;
  return false;
}

function checkIfSantaActive() {
  for (let i = 0; i < userArr.length; i++)
    if(userArr[i].secretSantaName != null)
      if(userArr[i].secretSantaName != "") {
        return true;
      }
  return false;
}

function checkForGlobalMessage() {
  for (let i = 0; i < userArr.length; i++) {
    if (userArr[i].notifications != undefined)
      if (userArr[i].notifications.includes(globalThanks) ||
        userArr[i].notifications.includes(globalApology)) {
        if (userArr[i].readNotifications != undefined)
          if (userArr[i].readNotifications.includes(globalThanks) ||
            userArr[i].readNotifications.includes(globalApology)) {
            return true;
          }
      }
  }
  return false;
}

function addGlobalMessageToDB(message) {
  let userNotificationArr = [];
  for (let i = 0; i < userArr.length; i++){
    if(userArr[i].notifications == undefined){
      userNotificationArr = [];
    } else {
      userNotificationArr = userArr[i].notifications;
    }
    userNotificationArr.push(message);

    if(userArr[i].notifications == undefined) {
      firebase.database().ref("users/" + userArr[i].uid).update({notifications:{0:message}});
    } else {
      firebase.database().ref("users/" + userArr[i].uid).update({
        notifications: userNotificationArr
      });
    }
  }
}

function initializeSecretSantaBtns() {
  let secretSantaBtnTxtEnable = "Enable Secret Santa";
  let secretSantaBtnTxtTrigger = "Assign Secret Santa Names";
  let secretSantaBtnTxtDisable = "Disable Secret Santa";

  secretSantaShuffle.innerHTML = "Button Disabled";
  secretSantaShuffle.onclick = function() {};

  if (!secretBtnStates[0]) {
    secretSantaBtn.innerHTML = secretSantaBtnTxtEnable;
    secretSantaBtn.onclick = function () {
      secretSantaButtonManager("mainT");
    };
  } else {
    if(checkIfSantaActive()) {
      secretSantaBtn.innerHTML = secretSantaBtnTxtDisable;
      secretSantaBtn.onclick = function () {
        secretSantaButtonManager("mainF");
      };
      secretSantaShuffle.innerHTML = "Shuffle Secret Santa";
      secretSantaShuffle.onclick = function() {
        secretSantaButtonManager("shuffle", true);
      };
    } else {
      secretSantaBtn.innerHTML = secretSantaBtnTxtTrigger;
      secretSantaBtn.onclick = function () {
        if (checkIfSantaSignUp()) {
          secretSantaButtonManager("shuffle", false);
        } else {
          alert ("Not enough people have signed up yet! At least 3 people need to be signed up in order" +
            " to assign names");
        }
      };
      secretSantaShuffle.innerHTML = secretSantaBtnTxtDisable;
      secretSantaShuffle.onclick = function() {
        secretSantaButtonManager("mainF");
      };
    }
  }

  if (!secretBtnStates[1]) {
    showSecretTextCycler = false;
    secretSantaAutoBtn.innerHTML = "Enable Auto Control";
    secretSantaAutoBtn.onclick = function () {
      secretSantaButtonManager("autoT");
    };
  } else {
    showSecretTextCycler = true;
    cycleSecretSantaAutoBtnTxt();
    if (!secretBtnStates[0]) {
      secretSantaBtn.innerHTML = "Manually " + secretSantaBtnTxtEnable;
      secretSantaBtn.onclick = function () {
        secretSantaButtonManager("mainT");
      };
    } else {
      if (checkIfSantaActive()) {
        secretSantaBtn.innerHTML = "Manually " + secretSantaBtnTxtDisable;
        secretSantaBtn.onclick = function () {
          secretSantaButtonManager("mainF");
        };
      } else {
        secretSantaBtn.innerHTML = "Manually " + secretSantaBtnTxtTrigger;
        secretSantaBtn.onclick = function () {
          if (checkIfSantaSignUp()) {
            secretSantaButtonManager("shuffle", false);
          } else {
            alert ("Not enough people have signed up yet!");
          }
        };
        secretSantaShuffle.innerHTML = "Manually " + secretSantaBtnTxtDisable;
        secretSantaShuffle.onclick = function() {
          secretSantaButtonManager("mainF");
        };
      }
    }
    secretSantaAutoBtn.innerHTML = "Disable Auto Control";
    secretSantaAutoBtn.onclick = function () {
      secretSantaButtonManager("autoF");
    };
  }
}

function cycleSecretSantaAutoBtnTxt() {
  if (textCyclerLimiter == 0) {
    let textCycler = 0;
    let alternator = 0;
    let upcomingDate = checkNextDate();

    if (consoleOutput)
      console.log("Text Cycle Feature Active");

    textCyclerInterval = setInterval(function () {
      textCycler = textCycler + 1000;
      if (textCycler >= 3000) {
        textCycler = 0;
        if (showSecretTextCycler)
          if (alternator == 0) {
            alternator++;
            secretSantaAutoBtn.innerHTML = "Disable Auto Control";
          } else if (alternator == 1) {
            alternator++;
            secretSantaAutoBtn.innerHTML = "Next Trigger Date";
          } else {
            alternator = 0;
            secretSantaAutoBtn.innerHTML = upcomingDate;
          }
      }
    }, 1000);

    textCyclerLimiter++;
  }
}

function checkNextDate() {
  if (currentDate >= showDate && currentDate <= assignDate)
    return "Assigning " + assignDate.getMonth() + "/" + assignDate.getDay() + "/" + currentYear;
  if (currentDate >= assignDate && currentDate.getMonth() <= hideDateMin)
    if(checkIfSantaActive()) {
      return "Ending " + hideDateMin + "/1/" + currentYear+1;
    }
  if (currentDate.getMonth() >= hideDateMin && currentDate.getMonth() <= hideDateMax)
    return "Starting " + showDate.getMonth() + "/" + showDate.getDay() + "/" + currentYear;
}

function secretSantaButtonManager(buttonPressed, shuffleMode) {
  switch(buttonPressed) {
    case "mainT":
      updateSecretSantaToDB("manual", true);
      break;
    case "mainF":
      friendScoreNote = 0;
      updateSecretSantaToDB("manual", false);
      break;
    case "shuffle":
      if (shuffleMode) {
        secretSantaShuffle.onclick = function (){};

        createSecretSantaNames();

        secretSantaShuffle.onclick = function (){
          secretSantaButtonManager("shuffle", true);
        };
      } else {
        secretSantaBtn.onclick = function (){};

        createSecretSantaNames();

        secretSantaBtn.onclick = function (){
          if (checkIfSantaSignUp()) {
            secretSantaButtonManager("shuffle", false);
          } else {
            alert ("Not enough people have signed up yet!");
          }
        };
      }
      break;
    case "autoT":
      updateSecretSantaToDB("auto", true);
      break;
    case "autoF":
      showSecretTextCycler = false;
      updateSecretSantaToDB("auto", false);
      secretSantaAutoBtn.innerHTML = "Enable Auto Control";
      secretSantaAutoBtn.onclick = function () {
        secretSantaButtonManager("autoT");
      };
      break;
    default:
      if(consoleOutput)
        console.log("Unrecognized Button!?!");
      break;
  }
}

function updateSecretSantaToDB(settingToUpdate, settingToBool) {
  switch(settingToUpdate) {
    case "auto":
      firebase.database().ref("secretSanta/").update({
        automaticUpdates: settingToBool
      });
      break;
    case "manual":
      firebase.database().ref("secretSanta/").update({
        manuallyEnable: settingToBool
      });
      break;
    default:
      if(consoleOutput)
        console.log("Unrecognized Input!?!");
      break;
  }
}

function generateSecretSantaModal(){
  let setPublicButton = false;

  if(secretSantaData != null){
    userTitle.innerHTML = secretSantaData.name;
    if(secretSantaData.giftList != null){
      if(secretSantaData.giftList.length > 0) {
        setPublicButton = true;
        publicList.onclick = function () {
          sessionStorage.setItem("validGiftUser", JSON.stringify(secretSantaData));
          newNavigation(9);//FriendList
        };
      } else {
        publicList.onclick = function () {};
      }
    } else {
      publicList.onclick = function () {};
    }

    if(secretSantaData.privateList != undefined) {
      if (setPublicButton) {
        flashGiftNumbers(secretSantaData.privateList, secretSantaData.giftList);
      } else {
        flashGiftNumbers(secretSantaData.privateList, 0);
      }
    } else {
      if (setPublicButton) {
        flashGiftNumbers(0, secretSantaData.giftList);
      } else {
        flashGiftNumbers(0, 0);
      }
    }

    privateList.onclick = function() {
      sessionStorage.setItem("validGiftUser", JSON.stringify(secretSantaData));
      newNavigation(10);//PrivateFriendList
    };

    sendPrivateMessage.onclick = function() {
      generatePrivateMessageDialog(secretSantaData);
    };

    closeUserModal.onclick = function() {
      closeModal(userModal);
      clearInterval(giftListInterval);
    };

    openModal(userModal, secretSantaData.uid);

    clearInterval(offlineTimer);
  }
}

function flashGiftNumbers(privateGiftList, publicGiftList) {
  let giftPrivateString;
  let giftPublicString;
  let giftPrivateAltText = "Click To Add Private Gifts!";
  let giftPublicAltText = "Click To View Public Gift List!";
  let privateGiftNum = 0;
  let publicGiftNum = 0;
  let emptyPrivateBool = false;
  let emptyPublicBool = false;

  if (privateGiftList != 0) {
    privateGiftNum = privateGiftList.length;

    for (let i = 0; i < privateGiftList.length; i++) {
      if (privateGiftList[i].received == 1) {
        privateGiftNum--;
      }
    }
  } else {
    emptyPrivateBool = true;
  }

  if (publicGiftList != 0) {
    publicGiftNum = publicGiftList.length;

    for (let i = 0; i < publicGiftList.length; i++) {
      if (publicGiftList[i].received == 1) {
        publicGiftNum--;
      }
    }
  } else {
    emptyPublicBool = true;
  }

  if (!emptyPrivateBool) {
    if (privateGiftNum == 0) {
      giftPrivateString = "All Private Gifts Have Been Bought!";
    } else if (privateGiftNum == 1) {
      giftPrivateString = "There Is 1 Un-Bought Private Gift!";
    } else {
      giftPrivateString = "There Are " + privateGiftNum + " Un-Bought Private Gifts!";
    }
  } else {
    giftPrivateString = "There Are No Private Gifts Yet!";
  }

  if (!emptyPublicBool) {
    if (publicGiftNum == 0) {
      giftPublicString = "All Public Gifts Have Been Bought!";
    } else if (publicGiftNum == 1) {
      giftPublicString = "There Is 1 Un-Bought Public Gift!";
    } else {
      giftPublicString = "There Are " + publicGiftNum + " Un-Bought Public Gifts!";
    }
  } else {
    giftPublicAltText = "Public Gift List Empty!";
    giftPublicString = "There Are No Public Gifts Yet!";
  }

  privateList.innerHTML = giftPrivateString;
  publicList.innerHTML = giftPublicString;

  giftListInterval = setInterval(function(){
    setAlternatingButtonText(giftPublicString, giftPublicAltText, publicList,
      giftPrivateString, giftPrivateAltText, privateList);
  }, 1000);
}

function generatePrivateMessageDialog(userData) {
  let message = "";

  privateMessageInp.placeholder = "Hey! Just to let you know...";

  sendMsg.onclick = function (){
    message = generatePrivateMessage(user.uid, privateMessageInp.value);
    addPrivateMessageToDB(userData, message);
    privateMessageInp.value = "";
    closeModal(privateMessageModal);
    openModal(userModal, userData.uid, true);

    window.onclick = function(event) {
      if (event.target == userModal) {
        closeModal(userModal);
        clearInterval(giftListInterval);
      }
    }

    alert("The Message Has Been Sent!");
  };
  cancelMsg.onclick = function (){
    privateMessageInp.value = "";
    closeModal(privateMessageModal);
    openModal(userModal, userData.uid, true);

    window.onclick = function(event) {
      if (event.target == userModal) {
        closeModal(userModal);
        clearInterval(giftListInterval);
      }
    }
  };

  openModal(privateMessageModal, "add");

  closePrivateMessageModal.onclick = function() {
    closeModal(privateMessageModal);
  };
}

function generatePrivateMessage(userUID, message){
  return userUID + "@#$:" + message;
}

function addPrivateMessageToDB(userData, message) {
  let userNotificationArr = [];
  let currentUserScore = user.userScore + 1;

  if(userData.notifications == undefined){
    userNotificationArr = [];
  } else {
    userNotificationArr = userData.notifications;
  }
  userNotificationArr.push(message);

  firebase.database().ref("users/" + user.uid).update({userScore: currentUserScore});

  if(userData.notifications == undefined) {
    firebase.database().ref("users/" + userData.uid).update({notifications:{0:message}});
  } else {
    firebase.database().ref("users/" + userData.uid).update({
      notifications: userNotificationArr
    });
  }
}

function createSecretSantaNames(){
  let assignedFamilies = [];
  let optInFamilyArr = [];
  let optInFamilyStatsArr = [];
  let skippedFamilies = [];
  let familySet = [];
  let potentialMatchesArr = [];
  let optInFamInt = 0;
  let errorsFound = 0;
  let errorsFoundLim = 10;
  let namesReadyBool = true;
  let santaNamesAssigned = false;

  tempUserArr = [];

  if (familyArr.length == 0 && (pageName == "Moderation")) {
    alert("It seems that you don't have any families created yet!\n\n" +
      "If you have more than 3 users on Gifty, assign them to a family before" +
      "attempting to assign them Secret Santa names!");
    return;
  }

  if (ignoreFamilySet) {
    clearInterval(ignoreFamilySetTimer);
    if (consoleOutput)
      console.log("Timer Stopped!");
    secretSantaBtn.innerHTML = "Assign Secret Santa Names";
  }

  for (let i = 0; i < userArr.length; i++) {
    if (userArr[i].secretSanta != null) {
      if (userArr[i].secretSanta == 1) {
        for (let a = 0; a < familyArr.length; a++) {
          if (familyArr[a].members != null) {
            if (familyArr[a].members.includes(userArr[i].uid)) {
              tempUserArr.push(userArr[i]);
              if (findUIDItemInArr(familyArr[a].uid, optInFamilyArr, true) == -1) {
                optInFamilyArr.push(familyArr[a]);
                optInFamilyStatsArr.push(1);
              } else {
                optInFamInt = findUIDItemInArr(familyArr[a].uid, optInFamilyArr, true);
                optInFamilyStatsArr[optInFamInt]++;
              }
            }
          }
        }
      }
    }
  }

  if (tempUserArr.length < 3 || tempUserArr.length == 0 && (pageName == "Moderation")) {
    alert("The signed up users DO NOT have enough friends! No users will be assigned names");
    return;
  } else if (checkFriendLists() && tempUserArr.length > 2 && (pageName == "Moderation")) {
    alert("Some users did not have any friends, so they will NOT be assigned a name!");
    friendScoreNote++;
  }

  for (let i = 0; i < optInFamilyArr.length; i++) {
    if (optInFamilyStatsArr[i] < 3) {
      if (!ignoreFamilySet && !checkIfSantaActive() && (pageName == "Moderation")) {
        alert("There is a family with less than three users signed up!\n\n\nYou have 10 SECONDS to press the button again" +
          " if you are okay with this. The users in question will NOT be assigned names.");
        startIgnoreFamilySetTimer();
        tempUserArr = [];
        assignedNameUsers = [];
        assignedUsers = [];
        return;
      } else {
        skippedFamilies.push(optInFamilyArr[i]);
      }
    } else {
      for (let a = 0; a < optInFamilyArr[i].members.length; a++) {
        let famSetUserIndex = findUIDItemInArr(optInFamilyArr[i].members[a], tempUserArr, true);
        if (famSetUserIndex != -1)
          familySet.push(tempUserArr[famSetUserIndex]);
      }

      potentialMatchesArr = buildPotentialMatchesArray(familySet);
      if (potentialMatchesArr.length > 3) {
        if (!checkBuiltArray(potentialMatchesArr)) {
          while (errorsFound < errorsFoundLim) {
            if (assignUsersSecretSantaNames(potentialMatchesArr)) {
              santaNamesAssigned = true;
              break;
            } else {
              errorsFound++;
              assignedNameUsers = [];
              assignedUsers = [];
            }
          }
          if (!santaNamesAssigned) {
            if (consoleOutput) {
              if (pageName == "Moderation")
                alert("There was an error assigning Secret Santa names. Please " + secretSantaAssignErrorMsg);

              console.log("*************************\n\nSecret Santa Assignments NOT COMPLETE" +
                "\n\nFailure Reason: " + failureReason + "\n\n*************************");
            }
            failureReason = "Unknown Error";
            tempUserArr = [];
            assignedNameUsers = [];
            assignedUsers = [];
            namesReadyBool = false;
          } else {
            assignedFamilies.push(optInFamilyArr[i].name);
            familySet = [];
          }
          santaNamesAssigned = false;
          errorsFound = 0;
        } else {
          usersNotAssignedAlert = true;
          skippedFamilies.push(optInFamilyArr[i]);
        }
      } else if (!ignoreFamilySet && !checkIfSantaActive() && (pageName == "Moderation")) {
        alert("There is a family with less than three eligible users!\n\n\nYou have 10 SECONDS to press the button again" +
          " if you are okay with this. The users in question will NOT be assigned names.");
        startIgnoreFamilySetTimer();
        tempUserArr = [];
        assignedNameUsers = [];
        assignedUsers = [];
        return;
      } else {
        skippedFamilies.push(optInFamilyArr[i]);
      }
    }
    familySet = [];
  }

  if (namesReadyBool) {
    if (skippedFamilies.length > 0) {
      if (consoleOutput) {
        console.log("Skipped Families: ");
        console.log(skippedFamilies);
      }
      for (let i = 0; i < skippedFamilies.length; i++) {
        assignedFamilies.push(skippedFamilies[i]);
      }

      for (let i = 0; i < tempUserArr.length; i++) {
        if (assignedNameUsers.indexOf(tempUserArr[i].uid) == -1) {
          for (let a = 0; a < skippedFamilies.length; a++) {
            if (skippedFamilies[a].members.indexOf(tempUserArr[i].uid) != -1) {
              assignedNameUsers.push(tempUserArr[i].uid);
            }
          }
        }
      }
    }

    if (assignedNameUsers.length == tempUserArr.length &&
      assignedFamilies.length == optInFamilyArr.length) {
      let userIndex = 0;
      for (let i = 0; i < tempUserArr.length; i++) {
        userIndex = findUIDItemInArr(tempUserArr[i].uid, userArr, true);
        userArr[userIndex].secretSantaName = tempUserArr[i].secretSantaName;
      }

      updateAllUsersToDBSantaNums();
      updateAllUsersToDBSantaNames();

      if (consoleOutput) {
        console.log("*************************\n\nSecret Santa Assignments Complete!\n\n*************************");
      }
      if (usersNotAssignedAlert) {
        alert("Some or all of the signed up users don't have enough mutual friends! NO users were assigned for one or more families...\n\n" +
          "Tips:\n-Your users need to invite more friends to their lists\n-Split up your users into separate family" +
          " lists");
        usersNotAssignedAlert = false;
      }
      if (secretSantaPageName == "moderation") {
        initializeSecretSantaBtns();
      }
      if (secretSantaPageName == "lists") {
        showSecretSanta();
      }
      tempUserArr = [];
      assignedNameUsers = [];
      assignedUsers = [];
    } else {
      if (consoleOutput) {
        if (pageName == "Moderation")
          alert("There was an error assigning Secret Santa names automatically. Please " + secretSantaAssignErrorMsg);

        console.log("*************************\n\nSecret Santa Assignments NOT COMPLETE" +
          "\n\nFailure Reason: " + failureReason + "\n\n*************************");
      }
      tempUserArr = [];
      assignedNameUsers = [];
      assignedUsers = [];
    }
  }
  failureReason = "Unknown Error";

  function checkBuiltArray(builtArray) {
    let warningsFound = false;
    let friendSizeLimit = Math.round(builtArray.length / 4);

    for (let i = 0; i < builtArray.length; i++) {
      if (builtArray[i].length <= friendSizeLimit) {
        warningsFound = true;
      }
    }

    return warningsFound;
  }

  function checkFriendLists() {
    let friendScoreBool = false;

    for (let i = 0; i < tempUserArr.length; i++) {
      if (tempUserArr[i].friends == null) {
        tempUserArr.splice(i, 1);
        friendScoreBool = true;
        i--;
      } else if (tempUserArr[i].friends.length == 0) {
        tempUserArr.splice(i, 1);
        friendScoreBool = true;
        i--;
      }
    }

    return friendScoreBool;
  }

  function startIgnoreFamilySetTimer() {
    let nowIgnore = 0;
    let alternatorIgnore = 0;
    let ignoreTimerInt = 10;

    ignoreFamilySet = true;
    secretSantaBtn.innerHTML = "Assign Secret Santa Names " + ignoreTimerInt;

    if(consoleOutput)
      console.log("Ignore Family Set Timer Active, 10 Seconds Remain!");
    ignoreFamilySetTimer = setInterval(function(){
      ignoreTimerInt--;
      nowIgnore = nowIgnore + 1000;
      if (alternatorIgnore == 0) {
        alternatorIgnore = 1;
        if(consoleOutput)
          console.log("Tick!");
      } else {
        alternatorIgnore = 0;
        if(consoleOutput)
          console.log("Tock!");
      }

      secretSantaBtn.innerHTML = "Assign Secret Santa Names " + ignoreTimerInt;

      if(nowIgnore >= 10000){
        if(consoleOutput)
          console.log("Times Up!");
        secretSantaBtn.innerHTML = "Assign Secret Santa Names";
        ignoreFamilySet = false;
        clearInterval(ignoreFamilySetTimer);
      }
    }, 1000);
  }
}

function assignUsersSecretSantaNames(usersToAssign) {
  let nextAssignArr = [];
  let nonCommonUserArr = [];
  let commonUserArr = [];
  let commonUserCountArr = [];
  let lowCommonCountArr = [];
  let usersToAssignActive = [];
  let nextUserIndex = 0;
  let lowestFriendCount = 0;
  let allUsersAssigned = false;
  let errorLimit = usersToAssign.length * 50;
  let errorCounter = -1;

  usersToAssignActive = buildAlternateArray(usersToAssign);

  if (!preFlightCheck()) {
    failureReason = "Non-Common User Error";
    return false;
  }

  while (!allUsersAssigned) {

    errorCounter++;
    if (errorCounter > errorLimit) {
      break;
    }

    lowestFriendCount = usersToAssignActive[0].length;
    nextUserIndex = 0;
    for (let i = 0; i < usersToAssignActive.length; i++) {
      if (usersToAssignActive[i].length < lowestFriendCount) {
        lowestFriendCount = usersToAssignActive[i].length;
        nextUserIndex = i;
      }
    }
    if (buildNextArray(nextUserIndex)) {
      assignUser();
      usersToAssignActive.splice(nextUserIndex, 1);
      nextAssignArr = [];
    } else {
      failureReason = "Users Not All Assigned";
      return allUsersAssigned;
    }

    if (usersToAssignActive.length == 0) {
      allUsersAssigned = true;
    }
  }

  failureReason = "Assign Function Not Ready";
  return allUsersAssigned;

  function assignUser() {
    if (checkNonCommonUsers() == -1) {
      if (checkLowCountUsers() == -1) {
        randomizeUsers(nextAssignArr);
      }
    }
  }

  function randomizeUsers(arr) {
    let selector;

    selector = Math.floor((Math.random() * arr.length));
    if (selector == 0)
      selector++;
    assignNextUserTo(arr[selector]);
  }

  function checkLowCountUsers() {
    if (lowCommonCountArr.length != 0) {
      let tempLowCountArr = [];
      let lowCountIndex = 0;

      for (let i = 1; i < nextAssignArr.length; i++) {
        lowCountIndex = lowCommonCountArr.indexOf(nextAssignArr[i]);
        if (lowCountIndex != -1) {
          tempLowCountArr.push(lowCommonCountArr[lowCountIndex]);
        }
      }

      if (tempLowCountArr.length > 1) {
        randomizeUsers(tempLowCountArr);
        return 1;
      } else if (tempLowCountArr.length == 1) {
        assignNextUserTo(tempLowCountArr[0]);
        return 0;
      }
    }

    return -1;
  }

  function checkNonCommonUsers() {
    if (nonCommonUserArr.length != 0)
      for (let i = 1; i < nextAssignArr.length; i++) {
        if (nonCommonUserArr.indexOf(nextAssignArr[i]) != -1) {
          assignNextUserTo(nonCommonUserArr[i]);
          return 0;
        }
      }

    return -1;
  }

  function assignNextUserTo(user) {
    let userIndex;

    userIndex = findUIDItemInArr(user.uid, nonCommonUserArr, true);
    nonCommonUserArr.splice(userIndex, 1);
    userIndex = findUIDItemInArr(user.uid, commonUserArr, true);
    commonUserArr.splice(userIndex, 1);
    commonUserCountArr.splice(userIndex, 1);
    userIndex = findUIDItemInArr(user.uid, lowCommonCountArr, true);
    lowCommonCountArr.splice(userIndex, 1);

    assignedUsers.push(user.uid);
    assignedNameUsers.push(nextAssignArr[0].uid);
    userIndex = findUIDItemInArr(nextAssignArr[0].uid, userArr, true);
    userArr[userIndex].secretSantaName = user.uid;
  }



  function buildNextArray(nextArrInt) {
    let tempNextArray = usersToAssignActive[nextArrInt];
    nextAssignArr.push(tempNextArray[0]);
    for (let i = 1; i < tempNextArray.length; i++) {
      if (assignedUsers.indexOf(tempNextArray[i].uid) == -1) {
        nextAssignArr.push(tempNextArray[i]);
      }
    }

    if (nextAssignArr.length == 1) {
      return false;
    }
    return true;
  }

  function preFlightCheck() {
    let tempNextArray = [];
    let tempNonCommonUserArr = [];
    let tempCommonUserArr = [];
    let tempCommonUserCountArr = [];
    let tempLowCommonCountArr = [];
    let nonCommonUserCount = 0;
    let userIndex = 0;

    for (let a = 0; a < usersToAssignActive.length; a++) {
      tempNextArray = usersToAssignActive[a];
      for (let b = 0; b < tempNextArray.length; b++) {
        userIndex = tempNonCommonUserArr.indexOf(tempNextArray[b].uid);
        if (userIndex != -1) {
          tempCommonUserArr.push(tempNonCommonUserArr[userIndex]);
          tempLowCommonCountArr.push(tempNonCommonUserArr[userIndex]);
          tempCommonUserCountArr.push(2);
          tempNonCommonUserArr.splice(userIndex, 1);
          nonCommonUserCount--;
        } else {
          userIndex = tempCommonUserArr.indexOf(tempNextArray[b].uid);
          if (userIndex != -1) {
            tempCommonUserCountArr[userIndex] = tempCommonUserCountArr[userIndex] + 1;
            if (tempCommonUserCountArr[userIndex] > 3) {
              userIndex = tempLowCommonCountArr.indexOf(tempNextArray[b].uid);
              tempLowCommonCountArr.splice(userIndex, 1);
            }
          } else {
            tempNonCommonUserArr.push(tempNextArray[b].uid);
            nonCommonUserCount++;
          }
        }
      }
    }

    commonUserArr = buildAlternateArray(tempCommonUserArr);
    nonCommonUserArr = buildAlternateArray(tempNonCommonUserArr);
    commonUserCountArr = buildAlternateArray(tempCommonUserCountArr);
    lowCommonCountArr = buildAlternateArray(tempLowCommonCountArr);

    if (nonCommonUserCount > 1) {
      return false;
    } else {
      return true;
    }
  }
}

function buildAlternateArray(oldArr){
  let newArr = [];

  for (let i = 0; i < oldArr.length; i++) {
    newArr.push(oldArr[i]);
  }

  return newArr;
}

function buildPotentialMatchesArray(usersToAssign) {
  let tempAssignArr = [];
  let tempPotentialMatchesArr = [];
  let potentialMatchesArr = [];
  let removedUsersArr = [];
  let removedUsersCheckArr = [];
  let removedUsersReasonsArr = [];
  let removedUsersString = "";
  let userIndex = 0;

  for (let i = 0; i < usersToAssign.length; i++) {
    tempAssignArr.push(usersToAssign[i]);
  }

  for (let a = 0; a < usersToAssign.length; a++) {
    tempPotentialMatchesArr.push(usersToAssign[a]);
    removedUsersString = usersToAssign[a].name + " was not assigned because: \n"

    for (let b = 0; b < tempAssignArr.length; b++) {
      if (usersToAssign[a].uid != tempAssignArr[b].uid) {//This user should NOT be the same user
        if (checkFriend(tempAssignArr[b].uid, usersToAssign[a])) {//These users MUST be friends
          if (!checkRelation(tempAssignArr[b].uid, usersToAssign[a])) {//These users CANNOT be parent/child
            tempPotentialMatchesArr.push(tempAssignArr[b]);
          } else {
            removedUsersString += "-" + tempAssignArr[b].name + " is related to this user\n";
          }
        } else {
          removedUsersString += "-" + tempAssignArr[b].name + " is not friends with this user\n";
        }
      }
    }

    if (tempPotentialMatchesArr.length > 2) {
      potentialMatchesArr.push(tempPotentialMatchesArr);
    } else {
      removedUsersArr.push(usersToAssign[a]);
      removedUsersReasonsArr.push(removedUsersString);
      userIndex = findUIDItemInArr(usersToAssign[a].uid, tempUserArr, true);
      tempUserArr.splice(userIndex, 1);

      for (let i = 0; i < potentialMatchesArr.length; i++) {
        userIndex = findUIDItemInArr(usersToAssign[a].uid, potentialMatchesArr[i], true);
        if (userIndex != -1) {
          potentialMatchesArr[i].splice(userIndex, 1);
        }
      }
    }
    tempPotentialMatchesArr = [];
  }

  if (consoleOutput && (pageName == "Moderation")) {
    console.log(removedUsersReasonsArr);
  }

  while(!checkRemovedUsers());

  return potentialMatchesArr;

  function checkRemovedUsers(){
    let arrayReady = true;
    let removedUserIndex = 0;

    for (let i = 0; i < potentialMatchesArr.length; i++) {
      removedUsersCheckArr = potentialMatchesArr[i];
      for (let a = 0; a < removedUsersCheckArr.length; a++) {
        removedUserIndex = findUIDItemInArr(removedUsersCheckArr.uid, removedUsersArr, true);
        if (removedUserIndex != -1) {
          arrayReady = false;
          removedUsersCheckArr.splice(removedUserIndex, 1);
          a--;
        }
      }
      potentialMatchesArr[i] = removedUsersCheckArr;
    }

    return arrayReady;
  }

  function checkRelation(selectedUser, staticUser) {
    let relatedBool = false;

    try {
      if (staticUser.parentUser == selectedUser || staticUser.childUser == selectedUser) {
        relatedBool = true;
      }
    } catch (err) {}

    return relatedBool;
  }

  function checkFriend(selectedUser, staticUser) {
    let friendBool = false;

    try {
      if (staticUser.friends.indexOf(selectedUser) != -1) {
        friendBool = true;
      }
    } catch (err) {}

    return friendBool;
  }
}

function generateActivateSecretSantaModal(){

  activateSecretSanta.onclick = function() {
    santaModalSpan.onclick = function(){
      closeModal(secretSantaModal);
    };

    openModal(secretSantaModal, "secretSantaModal");
  };
  activateSecretSanta.innerHTML = "Secret Santa";
}

function removeSecretSantaNames(){
  for (let i = 0; i < userArr.length; i++)
    userArr[i].secretSantaName = "";
  sessionStorage.setItem("userArr", JSON.stringify(userArr));
}

function removeSecretSantaNums(){
  for (let i = 0; i < userArr.length; i++)
    userArr[i].secretSanta = 0;
  sessionStorage.setItem("userArr", JSON.stringify(userArr));
}

function updateAllUsersToDBSantaNums(){
  let userIndex = 0;

  for (let i = 0; i < removedUsers.length; i++) {
    userIndex = findUIDItemInArr(removedUsers[i].uid, userArr, true);
    userArr[userIndex].secretSanta = 0;
  }

  for(let i = 0; i < userArr.length; i++){
    if (userArr[i].secretSanta != null) {
      firebase.database().ref("users/" + userArr[i].uid).update({
        secretSanta: userArr[i].secretSanta
      });
    } else {
      if (consoleOutput)
        console.log("Failed To Update Num " + userArr[i].name);
    }
  }
}

function updateAllUsersToDBSantaNames(){
  for(let i = 0; i < userArr.length; i++) {
    if (userArr[i].secretSantaName != null) {
      firebase.database().ref("users/" + userArr[i].uid).update({
        secretSantaName: userArr[i].secretSantaName
      });
    } else {
      if (consoleOutput)
        console.log("Failed To Update Name " + userArr[i].name);
    }
  }
}
