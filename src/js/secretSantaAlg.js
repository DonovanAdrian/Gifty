/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let secretBtnStates = [false, false];
let tempUserArr = [];
let assignedUsers = [];
let removedUsers = [];

let ignoreFamilySet = false;
let checkForSecretSantaBool = false;
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
let emptyArrayCount = 0;
let patternCount = 0;
let allUsersAttemptedCount = 0;
let failureReason = "Unknown Error";

//ToDo need to remove this
let yay = 0;
let nay = 0;
let masterResetCount = 0;
let patternResetCount = 0;
let allUsersResetOverall = 0;
let patternResetOverall = 0;
let emptyResetOverall = 0;
let errorResetOverall = 0;


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
    if(userArr[i].notifications == null){
      userNotificationArr = [];
    } else {
      userNotificationArr = userArr[i].notifications;
    }
    userNotificationArr.push(message);

    if(userArr[i].notifications == null) {
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
      checkForSecretSantaBool = true;
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
        checkForSecretSantaBool = true;
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

        for (let i = 0; i < 1000; i++) {
          createSecretSantaNames();
        }

        console.log("YAY! " + yay + " NAY... " + nay);
        console.log("Total Empty Array Resets: " + emptyResetOverall + "\n\nTotal Pattern Resets:" +
          patternResetOverall + "\n\nTotal All Users Attempted Resets:" + allUsersResetOverall +
          "\n\nTotal Error Resets:" + errorResetOverall);
        yay = 0;
        nay = 0;
        emptyResetOverall = 0;
        patternResetOverall = 0;
        allUsersResetOverall = 0;
        errorResetOverall = 0;

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
  if(userData.notifications == undefined){
    userNotificationArr = [];
  } else {
    userNotificationArr = userData.notifications;
  }
  userNotificationArr.push(message);

  if(userData.notifications == undefined) {
    firebase.database().ref("users/" + userData.uid).update({notifications:{0:message}});
  } else {
    firebase.database().ref("users/" + userData.uid).update({
      notifications: userNotificationArr
    });
  }
}

function checkForRandomErrors() {

  let optInFamilyArr = [];
  let optInFamilyStatsArr = [];
  let familySet = [];
  let existInFamInt = 0;
  let optInFamInt = 0;
  let potentialErrorInt = 0;

  for (let i = 0; i < userArr.length; i++) {
    if (userArr[i].secretSanta != null) {
      if (userArr[i].secretSanta == 1) {
        tempUserArr.push(userArr[i]);
        for (let a = 0; a < familyArr.length; a++) {
          if (familyArr[a].members != null) {
            if (familyArr[a].members.includes(userArr[i].uid)) {
              existInFamInt = 1;
              if (findUIDItemInArr(familyArr[a].uid, optInFamilyArr, true) == -1) {
                optInFamilyArr.push(familyArr[a]);
                optInFamilyStatsArr.push(1);
              } else {
                optInFamInt = findUIDItemInArr(familyArr[a].uid, optInFamilyArr,true);
                optInFamilyStatsArr[optInFamInt]++;
              }
            }
          }

          if (existInFamInt == 0) {
            assignedUsers.push(userArr[i]);
          } else {
            existInFamInt = 0;
          }
        }
      }
    }
  }

  for (let i = 0; i < optInFamilyArr.length; i++) {
    for (let a = 0; a < optInFamilyArr[i].members.length; a++) {
      let famSetUserIndex = findUIDItemInArr(optInFamilyArr[i].members[a], tempUserArr, true);
      if (famSetUserIndex != -1)
        familySet.push(tempUserArr[famSetUserIndex]);
    }

    if (familySet.length < 5)
      potentialErrorInt++;
    familySet = [];
  }

  tempUserArr = [];
  assignedUsers = [];

  return potentialErrorInt > 0;
}

function createSecretSantaNames(){
  let assignedFamilies = [];
  let optInFamilyArr = [];
  let optInFamilyStatsArr = [];
  let skippedFamilies = [];
  let familySet = [];
  let friendScore = 0;
  let friendScoreThreshold = .25;
  let existInFamInt = 0;
  let optInFamInt = 0;
  let namesReadyBool = true;
  let friendScoreBool = false;

  tempUserArr = [];

  if (familyArr.length == 0) {
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
        tempUserArr.push(userArr[i]);
        for (let a = 0; a < familyArr.length; a++) {
          if (familyArr[a].members != null) {
            if (familyArr[a].members.includes(userArr[i].uid)) {
              existInFamInt = 1;
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

        if (existInFamInt == 0) {
          assignedUsers.push(userArr[i]);
        } else {
          existInFamInt = 0;
        }
      }
    }
  }

  for (let i = 0; i < tempUserArr.length; i++) {
    if (tempUserArr[i].friends == null) {
      tempUserArr.splice(i, 1);
      friendScoreBool = true;
      i--;
    }
  }

  for (let i = 0; i < tempUserArr.length; i++) {
    if (tempUserArr[i].friends != null) {
      friendScore = tempUserArr[i].friends.length;
      if (friendScore < (tempUserArr.length * friendScoreThreshold)) {
        tempUserArr.splice(i, 1);
        friendScoreBool = true;
        i--;
      }
    }
  }

  if (friendScoreBool && tempUserArr.length > 2) {
    if (friendScoreNote == 0)
      alert("Some friends did not have enough mutual friends, so they will NOT be assigned a name!");
    friendScoreNote++;
  } else if (friendScoreBool && tempUserArr.length < 3 || tempUserArr.length == 0) {
    alert("The signed up users DO NOT have enough friends! No users will be assigned names");
    return;
  }

  if (consoleOutput)
    console.log("Secret Santa Families Initialized!");

  for (let i = 0; i < optInFamilyArr.length; i++) {
    if (optInFamilyStatsArr[i] < 3) {
      if (!ignoreFamilySet && secretSantaPageName == "moderation" && !checkIfSantaActive()) {
        alert("There is a family with less than three users signed up!\n\n\nYou have 10 seconds to press the button again" +
          " if you are okay with this. The users in question will NOT be assigned names.");
        startIgnoreFamilySetTimer();
        tempUserArr = [];
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



      if (!assignUsersSecretSantaNames(familySet)) {
        if (consoleOutput) {
          nay++;
          //alert("There was an error assigning Secret Santa names. Please " + secretSantaAssignErrorMsg);
          console.log("*************************\n\nSecret Santa Assignments NOT COMPLETE\n\nPattern Resets: "
            + patternCount + "\n\nEmpty Array Resets: " + emptyArrayCount + "\n\nAll Users Attempted: "
            + allUsersAttemptedCount + "\n\nFailure Reason: " + failureReason + "\n\n*************************");
        }
        failureReason = "Unknown Error";
        allUsersResetOverall += allUsersAttemptedCount;
        allUsersAttemptedCount = 0;
        patternResetOverall += patternCount;
        patternCount = 0;
        emptyResetOverall += emptyArrayCount;
        emptyArrayCount = 0;
        tempUserArr = [];
        assignedUsers = [];
        namesReadyBool = false;
      } else {
        assignedFamilies.push(optInFamilyArr[i].name);
        familySet = [];
      }
    }
    familySet = [];
  }

  if (namesReadyBool) {
    if (consoleOutput)
      console.log("Secret Santa Names Assigned!");

    if (skippedFamilies.length > 0) {
      if (consoleOutput) {
        console.log("Skipped Families: ");
        console.log(skippedFamilies);
      }
      for (let i = 0; i < skippedFamilies.length; i++) {
        assignedFamilies.push(skippedFamilies[i]);
      }

      for (let i = 0; i < tempUserArr.length; i++) {
        if (assignedUsers.indexOf(tempUserArr[i].uid) == -1) {
          for (let a = 0; a < skippedFamilies.length; a++) {
            if (skippedFamilies[a].members.indexOf(tempUserArr[i].uid) != -1) {
              assignedUsers.push(tempUserArr[i].uid);
            }
          }
        }
      }
    }

    if (assignedUsers.length == tempUserArr.length &&
      assignedFamilies.length == optInFamilyArr.length) {
      let userIndex = 0;
      for (let i = 0; i < tempUserArr.length; i++) {
        userIndex = findUIDItemInArr(tempUserArr[i].uid, userArr, true);
        userArr[userIndex].secretSantaName = tempUserArr[i].secretSantaName;
      }

      //updateAllUsersToDBSantaNums();
      //updateAllUsersToDBSantaNames();
      yay++;
      if (consoleOutput)
        console.log("*************************\n\nSecret Santa Assignments Complete!\n\nPattern Resets: "
          + patternCount + "\n\nEmpty Array Resets: " + emptyArrayCount + "\n\nAll Users Attempted: "
          + allUsersAttemptedCount + "\n\n*************************");
      if (secretSantaPageName == "moderation") {
        initializeSecretSantaBtns();
      }
      if (secretSantaPageName == "lists") {
        showSecretSanta();
      }
    } else {
      nay++;
      if (consoleOutput) {
        //alert("There was an error assigning Secret Santa names automatically. Please " + secretSantaAssignErrorMsg);
        console.log("*************************\n\nSecret Santa Assignments NOT COMPLETE\n\nPattern Resets: "
          + patternCount + "\n\nEmpty Array Resets: " + emptyArrayCount + "\n\nAll Users Attempted: "
          + allUsersAttemptedCount + "\n\nFailure Reason: " + failureReason + "\n\n*************************");
      }
      tempUserArr = [];
      assignedUsers = [];
    }
  }
  failureReason = "Unknown Error";
  allUsersResetOverall += allUsersAttemptedCount;
  allUsersAttemptedCount = 0;
  patternResetOverall += patternCount;
  patternCount = 0;
  emptyResetOverall += emptyArrayCount;
  emptyArrayCount = 0;
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

function assignUsersSecretSantaNames(usersToAssign) {
  let userIndex;
  let selector = 0;
  let lastSelector = 0;
  let errorIndex = 0;
  let userRemovalIndex = 0;
  let errorLimiter = usersToAssign.length * 50;
  let masterResetInt = 0;
  let masterResetLim = 25;
  let usersToAssignIndex = 0;
  let ignoreResetBool = false;
  let arrayAssignBool = false;
  let randomSelectBool = true;
  let userAssignedBool = false;
  let assignUsersNamesSuccess = false;
  let allUsersAttemptedArr = [];
  let tempAssignArr = [];
  let patternArr = [];

  //Pattern variables
  let patternDetectionParameter = 3;
  let patternDetectionLimit = usersToAssign.length * patternDetectionParameter;
  let patternDetectionThreshold = 60; //Default 60 = 20 or more family members being checked
  let lowPatternLimit = 1.25; //Default 1.25 = 80% of the array is the same number
  let highPatternLimit = 4; //Default 4 = 25% of the array is the same number in a row

  resetTempArray();
  removedUsers = [];

  while (!arrayAssignBool) {
    if (randomSelectBool) {
      selector = Math.floor((Math.random() * tempAssignArr.length));
      if (selector == lastSelector && lastSelector != 0) {
        selector--;
      }
    } else {
      if (selector < tempAssignArr.length - 1) {
        selector++;
      } else {
        selector = 0;
        ignoreResetBool = true;
      }
    }

    patternArr.push(selector);

    if ((assignedUsers.indexOf(tempAssignArr[selector].uid) == -1) && //This user should NOT yet be assigned
      (usersToAssign[usersToAssignIndex].uid != tempAssignArr[selector].uid) && //This user should NOT be the same user
      (checkFriend(tempAssignArr[selector].uid, usersToAssign[usersToAssignIndex])) && //These users MUST be friends
      (!checkRelation(tempAssignArr[selector].uid, usersToAssign[usersToAssignIndex]))) {//These users CANNOT be parent/child
      allUsersAttemptedArr = [];
      errorIndex = 0;
      assignedUsers.push(tempAssignArr[selector].uid);
      userIndex = findUIDItemInArr(usersToAssign[usersToAssignIndex].uid, tempUserArr, true);
      tempUserArr[userIndex].secretSantaName = tempAssignArr[selector].uid;
      tempAssignArr.splice(selector, 1);
      randomSelectBool = true;
      userAssignedBool = true;
    } else {
      if (tempAssignArr.length <= 1) {
        emptyArrayCount++;
        resetAssignment();
      } else {
        if (ignoreResetBool) {
          randomSelectBool = true;
          ignoreResetBool = false;

          if (patternArr.length > patternDetectionLimit) {
            console.log("PATTERN: " + patternArr.length + " \nLIMIT: " + patternDetectionLimit);
            if(checkForPattern()) {
              patternCount++;
              resetAssignment();
            }
          }
        } else {
          randomSelectBool = false;
        }
      }
    }

    if (tempAssignArr.length == 0 && (assignedUsers.length == usersToAssign.length)) {
      arrayAssignBool = true;
      assignUsersNamesSuccess = true;
    } else if (usersToAssignIndex <= usersToAssign.length && userAssignedBool) {
      userAssignedBool = false;
      usersToAssignIndex++;
    }

    if (allUsersAttemptedArr.indexOf(selector) == -1) {
      allUsersAttemptedArr.push(selector);
    } else {
      if (allUsersAttemptedArr.length == tempAssignArr.length) {
        allUsersAttemptedCount++;
        userRemovalIndex = findUIDItemInArr(usersToAssign[usersToAssignIndex].uid, tempUserArr, true);
        removedUsers.push(tempUserArr[userRemovalIndex]);
        tempUserArr.splice(userRemovalIndex, 1);
        usersToAssign.splice(usersToAssignIndex, 1);
        errorIndex = 0;
        resetAssignment();
      }
    }

    lastSelector = selector;
    errorIndex++;
    if (errorIndex > errorLimiter) {
      failureReason = "Error Limiter Break";
      errorResetOverall++;
      break;
    }
  }

  return assignUsersNamesSuccess;



  function resetAssignment(){
    if(consoleOutput)
      console.log("Resetting Arrays...");
    resetTempArray();
    assignedUsers = [];
    allUsersAttemptedArr = [];
    usersToAssignIndex = 0;
    randomSelectBool = true;

    if (masterResetInt <= masterResetLim) {
      masterResetInt++;
    } else {
      failureReason = "Master Reset Break"
      masterResetCount++;
      arrayAssignBool = true;
    }
  }

  function checkForPattern() {
    let patternBool = false;
    let intCheck = 0;
    let lastInt = -1;
    let intOccurrence = 0;
    let intOccurrenceMax = 0;
    let checkedIntsArr = [];
    let patternThreshold;

    if (patternDetectionLimit < patternDetectionThreshold) {//Smaller array, simple checking for occurrences
      patternThreshold = lowPatternLimit;

      for (let a = 0; a < patternArr.length; a++) {
        if (checkedIntsArr.indexOf(patternArr[a]) == -1) {
          intCheck = patternArr[a];

          for (let i = 0; i < patternArr.length; i++) {
            if (intCheck == patternArr[i]) {
              intOccurrence++;
            }
          }

          if (intOccurrence > intOccurrenceMax) {
            intOccurrenceMax = intOccurrence;
          }

          checkedIntsArr.push(patternArr[a]);
        }
      }
    } else {//Larger array, more serious pattern detection
      patternThreshold = highPatternLimit;

      for (let a = 0; a < patternArr.length; a++) {
        if (patternArr[a] == lastInt) {
          intOccurrence++;
          if (intOccurrence > intOccurrenceMax) {
            intOccurrenceMax = intOccurrence;
          }
        } else {
          intOccurrence = 0;
        }
        lastInt = patternArr[a];
      }
    }

    if (intOccurrenceMax >= (patternArr.length/patternThreshold)) {
      if(consoleOutput)
        console.log("Pattern Detected!");
      console.log(patternArr);//ToDo remove this later
      patternResetOverall++;
      patternBool = true;
    }

    patternArr = [];

    return patternBool;
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

  function resetTempArray() {
    tempAssignArr = [];
    for (let i = 0; i < usersToAssign.length; i++) {
      tempAssignArr.push(usersToAssign[i]);
    }
  }
}

function generateActivateSecretSantaModal(){

  activateSecretSanta.onclick = function() {
    if (checkForSecretSantaBool) {
      if (checkForRandomErrors()) {
        alert("***WARNING***\n\n\nDue to a low number of users being randomly assigned names, there is a " +
          "higher likelihood for potential errors. Please be prepared to press the \"Assign\" button " +
          "more than once. To remedy this issue, invite more users to use Gifty or consolidate " +
          "your users into larger families. Thank you!");
      }
    }

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
