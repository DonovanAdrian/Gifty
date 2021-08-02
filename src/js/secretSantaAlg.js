/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let secretBtnStates = [false, false];
let tempUserArr = [];
let assignedUsers = [];

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
          let i = findUIDItemInArr(user.secretSantaName, userArr);
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
        secretSantaButtonManager("shuffle");
      };
    } else {
      checkForSecretSantaBool = true;
      secretSantaBtn.innerHTML = secretSantaBtnTxtTrigger;
      secretSantaBtn.onclick = function () {
        if (checkIfSantaSignUp()) {
          secretSantaButtonManager("shuffle");
        } else {
          alert ("Not enough people have signed up yet!");
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
            secretSantaButtonManager("shuffle");
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

function secretSantaButtonManager(buttonPressed) {
  switch(buttonPressed) {
    case "mainT":
      updateSecretSantaToDB("manual", true);
      break;
    case "mainF":
      updateSecretSantaToDB("manual", false);
      break;
    case "shuffle":
      createSecretSantaNames();
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
  if(secretSantaData != null){
    userTitle.innerHTML = secretSantaData.name;
    if(secretSantaData.giftList != null){
      if(secretSantaData.giftList.length > 0) {
        publicList.onclick = function () {
          sessionStorage.setItem("validGiftUser", JSON.stringify(secretSantaData));
          newNavigation(9);//FriendList
        };
        flashGiftNumbers(secretSantaData.giftList.length, publicList, "Public");
      } else {
        publicList.innerHTML = "Public List Empty";
        publicList.onclick = function () {};
      }
    } else {
      publicList.innerHTML = "Public List Empty";
      publicList.onclick = function () {};
    }

    privateList.innerHTML = "View Private Gift List";
    if(secretSantaData.privateList != undefined)
      flashGiftNumbers(secretSantaData.privateList.length, privateList, "Private");
    else
      flashGiftNumbers(0, privateList, "Private");
    privateList.onclick = function() {
      sessionStorage.setItem("validGiftUser", JSON.stringify(secretSantaData));
      newNavigation(10);//PrivateFriendList
    };

    sendPrivateMessage.onclick = function() {
      generatePrivateMessageDialog(secretSantaData);
    };

    closeUserModal.onclick = function() {
      closeModal(userModal);
    };

    openModal(userModal, secretSantaData.uid);

    clearInterval(offlineTimer);
  }
}

function flashGiftNumbers(giftsNum, giftsBtn, giftsIndicator) {
  let giftString;
  let giftAlternateText = "View " + giftsIndicator + " Gift List";

  if (giftsNum == 0)
    giftsNum = "No";

  if (giftsNum == 1)
    giftString = "There Is 1 " + giftsIndicator + " Gift";
  else
    giftString = "There Are " + giftsNum + " " + giftsIndicator + " Gifts";
  switch (giftsIndicator) {
    case "Private":
      privateListAlternator = setInterval(function(){
        setAlternatingButtonText(giftString, giftAlternateText, giftsBtn, giftButtonAlternatorsA);
      }, 1000);
      break;
    case "Public":
      publicListAlternator = setInterval(function(){
        setAlternatingButtonText(giftString, giftAlternateText, giftsBtn, giftButtonAlternatorsB);
      }, 1000);
      break;
    default:
      console.log("Whoops!");
      break;
  }
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
        clearInterval(privateListAlternator);
        clearInterval(publicListAlternator);
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
        clearInterval(privateListAlternator);
        clearInterval(publicListAlternator);
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
              if (findUIDItemInArr(familyArr[a].uid, optInFamilyArr) == -1) {
                optInFamilyArr.push(familyArr[a]);
                optInFamilyStatsArr.push(1);
              } else {
                optInFamInt = findUIDItemInArr(familyArr[a].uid, optInFamilyArr);
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
      let famSetUserIndex = findUIDItemInArr(optInFamilyArr[i].members[a], tempUserArr);
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
  let existInFamInt = 0;
  let optInFamInt = 0;
  let namesReadyBool = true;

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
              if (findUIDItemInArr(familyArr[a].uid, optInFamilyArr) == -1) {
                optInFamilyArr.push(familyArr[a]);
                optInFamilyStatsArr.push(1);
              } else {
                optInFamInt = findUIDItemInArr(familyArr[a].uid, optInFamilyArr);
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

  if (consoleOutput)
    console.log("Secret Santa Families Initialized!");

  for (let i = 0; i < optInFamilyArr.length; i++) {
    if (optInFamilyStatsArr[i] < 3) {
      if (!ignoreFamilySet && secretSantaPageName == "moderation") {
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
        let famSetUserIndex = findUIDItemInArr(optInFamilyArr[i].members[a], tempUserArr);
        if (famSetUserIndex != -1)
          familySet.push(tempUserArr[famSetUserIndex]);
      }
      if (!assignUsersSecretSantaNames(familySet)) {
        if (consoleOutput)
          alert("There was an error assigning Secret Santa names. Please " + secretSantaAssignErrorMsg);
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

        for (let a = 0; a < skippedFamilies[i].members.length; a++) {
          assignedUsers.push(skippedFamilies[i].members[a]);
        }
      }
    }

    if (assignedUsers.length == tempUserArr.length &&
        assignedFamilies.length == optInFamilyArr.length) {
      let userIndex = 0;
      for (let i = 0; i < tempUserArr.length; i++) {
        userIndex = findUIDItemInArr(tempUserArr[i].uid, userArr);
        userArr[userIndex].secretSantaName = tempUserArr[i].secretSantaName;
      }

      updateAllUsersToDBSantaNames();

      if (consoleOutput)
        console.log("Secret Santa Assignments Complete!");
      if (secretSantaPageName == "moderation") {
        initializeSecretSantaBtns();
      }
      if (secretSantaPageName == "lists") {
        showSecretSanta();
      }
    } else {
      if (consoleOutput)
        alert("There was an error assigning Secret Santa names automatically. Please " + secretSantaAssignErrorMsg);
      tempUserArr = [];
      assignedUsers = [];
    }
  }
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
  let selector;
  let userIndex;
  let retryCount = 0;
  let tempAssignArr = [];
  let assignActionSuccess = true;

  for (let i = 0; i < usersToAssign.length; i++)
    tempAssignArr.push(usersToAssign[i]);

  for (let i = 0; i < usersToAssign.length; i++) {
    selector = Math.floor((Math.random() * tempAssignArr.length));
    if (!assignedUsers.includes(tempAssignArr[selector].uid)) {
      if (tempAssignArr[selector].uid != usersToAssign[i].uid) {
        if (usersToAssign[i].friends.includes(tempAssignArr[selector].uid)) {
          try {
            if (usersToAssign[i].parentUser == tempAssignArr[selector].uid ||
                usersToAssign[i].childUser == tempAssignArr[selector].uid) {
              if (consoleOutput)
                console.log("These users are a parent or child of each other!");
              retryCount++;
              if (retryCount >= 10) {
                assignActionSuccess = false;
                break;
              }
              i--;
            } else {
              if (consoleOutput)
                console.log("MATCHED!");
              assignedUsers.push(tempAssignArr[selector].uid);
              userIndex = findUIDItemInArr(usersToAssign[i].uid, tempUserArr);
              tempUserArr[userIndex].secretSantaName = tempAssignArr[selector].uid;
              tempAssignArr.splice(selector, 1);
              retryCount = 0;
            }
          } catch (err) {
            if(consoleOutput)
              console.log("MATCHED!");
            assignedUsers.push(tempAssignArr[selector].uid);
            userIndex = findUIDItemInArr(usersToAssign[i].uid, tempUserArr);
            tempUserArr[userIndex].secretSantaName = tempAssignArr[selector].uid;
            tempAssignArr.splice(selector, 1);
            retryCount = 0;
          }
        } else {
          if(consoleOutput)
            console.log("These users aren't friends!");
          retryCount++;
          if(retryCount >= 10) {
            assignActionSuccess = false;
            break;
          }
          i--;
        }
      } else {
        if(consoleOutput)
          console.log("These are the same users!");
        retryCount++;
        if(retryCount >= 10) {
          assignActionSuccess = false;
          break;
        }
        i--;
      }
    } else {
      if(consoleOutput)
        console.log("This user has already been assigned!");
      retryCount++;
      if(retryCount >= 10) {
        assignActionSuccess = false;
        break;
      }
      i--;
    }
  }

  return assignActionSuccess;
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
  for(let i = 0; i < userArr.length; i++){
    if (userArr[i].secretSanta != null) {
      firebase.database().ref("users/" + userArr[i].uid).update({
        secretSanta: userArr[i].secretSanta
      });
    } else {
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
      console.log("Failed To Update Name " + userArr[i].name);
    }
  }
}
