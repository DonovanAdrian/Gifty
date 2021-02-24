/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let secretBtnStates = [false, false, false];
let optInFamilyArr = [];

let currentDate = "";
let showDate = "";//Oct 1st
let assignDate = "";//Nov 1st
let hideDate = "";//Jan 1st

function checkSecretSanta(autoUpdateBool){
  if(autoUpdateBool) {
    //Check current date
    //If (after show date)
    //show btn
    //If (after assign date)
    //shuffle!
    //if (after hide date)
    //hide
  } else
    hideSecretSanta();
}

function showSecretSanta(){
  secretSantaSignUp.style.display = "block";

  if (user.secretSantaName == null)
    if (user.secretSanta != null)
      if (user.secretSanta == 0)
        secretSantaSignUp.innerHTML = "Sign Up For Secret Santa";
      else
        secretSantaSignUp.innerHTML = "Opt-Out Of Secret Santa";
    else
      secretSantaSignUp.innerHTML = "Sign Up For Secret Santa";
  else {
    if (user.secretSantaName != "") {
      let i = findUIDItemInArr(user.secretSantaName, userArr);
      secretSantaData = userArr[i];
      secretSantaSignUp.innerHTML = userArr[i].name;
      secretSantaNameBool = true;
    } else {
      if (user.secretSanta != null)
        if (user.secretSanta == 0)
          secretSantaSignUp.innerHTML = "Sign Up For Secret Santa";
        else
          secretSantaSignUp.innerHTML = "Opt-Out Of Secret Santa";
      else
        secretSantaSignUp.innerHTML = "Sign Up For Secret Santa";
    }
  }

  secretSantaSignUp.onclick = function() {
    if (secretSantaNameBool) {
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

function hideSecretSanta(){//----------------------------*****************************ToDo
  secretSantaSignUp.style.display = "none";
  secretSantaSignUp.onclick = function(){};

  //if before assign date but after show date and some users have signed up, OR after assign date but before hide date
  //check if already set to 0 (if a 1 is found, follow through)
  //set to 0 and issue "apology" notifications
  //if after hide date
  //check if already set to 0 (if a 1 is found, follow through)
  //set to 0 and issue "thanks" notifications
}

function initializeSecretSantaBtns() {//----------------------------*****************************ToDo
  //shuffle btn [1]
  //true/false (enabled/disabled)
  //check if sSA is enabled (prior fxn)

  //***Activate Secret Santa Fxn*** (Alternates Between Below Deactivate Fxn)
  //***NOTIFY MODERATOR*** All Users Can Now Sign Up For Secret Santa! Click On "Shuffle Secret Santa" To Assign Users
  //Check if automatic switch is enabled, if so, append "Manually" to front of this btn
  //Check if already enabled/disabled, if so, change to appropriate name
  //Check if MANUALLY enabled, if so, change to "Activate Secret Santa"
  secretSantaBtn.innerHTML = "Enable Secret Santa";
  secretSantaBtn.onclick = function() {
    secretSantaButtonManager("main");
  };
  //***Deactivate Secret Santa Fxn*** (Alternates Between Above Activate Fxn)
  //Check if automatic switch is enabled, if so, append "Manually" to front of this btn

  //***Shuffle Secret Santa Fxn*** (Only available if Secret Santa is detected to be active)
  //Check and change text if Secret Santa names are not assigned yet and alert user if pressed
  secretSantaShuffle.innerHTML = "Shuffle Secret Santa";
  secretSantaShuffle.onclick = function() {
    secretSantaButtonManager("shuffle");
  };

  //***Automatic Enabling/Disabling Switch Fxn***
  //Check if enabled/disabled, change text accordingly
  //Check if MANUALLY enabled, if so, change to "Function Not Available" and alert user if pressed
  secretSantaAutoBtn.innerHTML = "Enable Auto Control";
  secretSantaAutoBtn.onclick = function () {
    secretSantaButtonManager("auto");
  };
}

function secretSantaButtonManager(buttonPressed) {//----------------------------*****************************ToDo
  switch(buttonPressed) {
    case "main":
      if (secretBtnStates[0])//main true
        console.log();
      else if (secretBtnStates[1])//shuffle true
        console.log();
      else//main false
        console.log();
      //if main false
      //change text (from enable to activate), change to true, change manually enable in db, run FXN?, update btns
      //change text in auto, alert if pressed
      //if auto true
      //alert user that auto is no longer enabled
      //if main true
      //change text (from activate to disable), change shuffle to true, run FXN, update btns
      //change text in shuffle, run FXN
      //if shuffle true
      //change text (from disable to enable), change sSA to false/main to false, change manually enable in db,
      //      run fxn, update btns
      //change text in shuffle, alert if pressed
      //change text in auto, run FXN
      break;
    case "shuffle":
      if (secretBtnStates[1])
        console.log("Run Shuffle Function");
      else
        alert("This function is not available unless Secret Santa is active!");
      break;
    case "auto":
      if (secretBtnStates[2])//auto true
        console.log();
      else//auto false
        console.log();
      //if auto false
      //change text, change to true, change automatic in db
      //if auto true
      //change text, change to false, change automatic in db
      break;
    default:
      console.log("Hmmm... This wasn't supposed to happen!");
      break;
  }
}

function generateSecretSantaModal(){
  if(secretSantaData != null){
    userTitle.innerHTML = secretSantaData.name;
    if(secretSantaData.giftList != undefined){
      if(secretSantaData.giftList.length > 0) {
        publicList.innerHTML = "Click on me to access " + secretSantaData.name + "\'s public list!";
        publicList.onclick = function () {
          sessionStorage.setItem("validGiftUser", JSON.stringify(secretSantaData));//Friend's User Data
          newNavigation(9);//FriendList
        };
        if (secretSantaData.giftList.length == 1)
          publicListCount.innerHTML = secretSantaData.name + " has 1 gift on their public list";
        else
          publicListCount.innerHTML = secretSantaData.name + " has " + secretSantaData.giftList.length + " gifts on their public list";
      } else {
        publicList.innerHTML = secretSantaData.name + "\'s public gift list is empty, please check back later!";
        publicList.onclick = function () {};
        publicListCount.innerHTML = secretSantaData.name + " has 0 gifts on their public list";
      }
    } else {
      publicList.innerHTML = secretSantaData.name + "\'s public gift list is empty, please check back later!";
      publicList.onclick = function () {};
      publicListCount.innerHTML = secretSantaData.name + " has 0 gifts on their public list";
    }
    if(secretSantaData.privateList != undefined){
      if(secretSantaData.privateList.length > 0) {
        if (secretSantaData.privateList.length == 1)
          privateListCount.innerHTML = secretSantaData.name + " has 1 gift on their private list";
        else
          privateListCount.innerHTML = secretSantaData.name + " has " + secretSantaData.privateList.length + " gifts on their private list";
      } else {
        privateListCount.innerHTML = secretSantaData.name + " has 0 gifts on their private list";
      }
    } else {
      privateListCount.innerHTML = secretSantaData.name + " has 0 gifts on their private list";
    }
    privateList.innerHTML = "Click on me to access " + secretSantaData.name + "\'s private gift list!";
    privateList.onclick = function() {
      sessionStorage.setItem("validGiftUser", JSON.stringify(secretSantaData));//Friend's User Data
      newNavigation(10);//PrivateFriendList
    };

    sendPrivateMessage.onclick = function() {
      generatePrivateMessageDialog(secretSantaData);
    };

    //close on close
    closeUserModal.onclick = function() {
      closeModal(userModal);
    };

    //close on click
    window.onclick = function(event) {
      if (event.target == userModal) {
        closeModal(userModal);
      }
    };

    //show modal
    openModal(userModal, secretSantaData.uid);

    clearInterval(offlineTimer);
  }
}

//Moderator Secret Santa Functions Go Here!

//***Activate Secret Santa Fxn*** (Alternates Between Below Deactivate Fxn)
//fetch all families
//put linked families into a multi-dimensional array if possible...
//if at least one set of linked families has enough users, enable secret santa CONDITIONALLY
//ARE YOU SURE???? Not all families have signed up, would you like to wait?
//collect validLinkedFamilies into a separate array
//if all families have appropriately signed up, continue normally
//collect all families into the validLinkedFamilies array
//using validLinkedFamilies, randomly pick each family member.
//Restart for a certain linked family if needed
//build in consideration for familial relations (i.e., babies) and adjust accordingly
//If it fails four times, prompt user to try again
//If successful, save each user's new secret santa to their user data in DB

//***Deactivate Secret Santa Fxn*** (Alternates Between Above Activate Fxn)
//fetch all users
//Send all users who signed up a "Thank you for participating in this year's Secret Santa"
//remove all secret santa sign up numbers
//update all users to DB
//remove all secret santa names
//update all users to DB
//These two processes are done separately to ensure that they are properly completed as needed
//In past iterations of the Secret Santa function, doing both actions (remove #'s AND names) caused problems...

//***Shuffle Secret Santa Fxn*** (Only available if Secret Santa is detected to be active)
//NOTE: This will capture any new sign ups and include them in the Secret Santa
//Dev Note: Make sure this is properly displayed on Lists Page
//fetch all families
//put linked families into a multi-dimensional array if possible...
//if at least one set of linked families has enough users, enable secret santa CONDITIONALLY
//ARE YOU SURE???? Not all families have signed up, would you like to wait?
//collect validLinkedFamilies into a separate array
//if all families have appropriately signed up, continue normally
//collect all families into the validLinkedFamilies array
//using validLinkedFamilies, randomly pick each family member.
//Restart for a certain linked family if needed
//build in consideration for familial relations (i.e., babies) and adjust accordingly
//If it fails four times, prompt user to try again
//If successful, save each user's new secret santa to their user data in DB

//***Automatic Enabling/Disabling Switch Fxn (If this is enabled, append "Manually" to front of above btn)***
//Automatically show Secret Santa button if a user lands on Lists page on a set date (~Mid October)
//Will be used to start the sign up process
//Automatically trigger above activation function if a user lands on Lists page on a set date (~Mid November)
//Dev Note: Go to Lists Page and adjust
//Automatically trigger above deactivation function if a user lands on Lists page on a set date (~Mid January)
//Send all users who signed up a thank you for participating and hide Secret Santa button

function initializeSecretSantaArrs(){//----------------------------*****************************ToDo
  tempUserArr = [];
  optInUserArr = [];
  for (let i = 0; i < userArr.length; i++) {
    if (userArr[i].secretSantaName != null)
      if (userArr[i].secretSantaName != "") {
        secretSantaNameBool = true;
        secretBtnStates[1] = true;
      }

    //This needs to be re-keyed to apply to being family-centric and not user-centric
    if (userArr[i].secretSanta != null)
      if (userArr[i].secretSanta == 1) {
        tempUserArr.push(userArr[i]);
        optInUserArr.push(userArr[i]);
        for (let i = 0; i < familyArr.length; i++) {
          if(familyArr[i].members != null)
            if(familyArr[i].members.includes(userArr[i].uid)) {
              if(!optInFamilyArr.includes(familyArr[i].uid)) {
                console.log("Adding " + familyArr[i].uid);
                optInFamilyArr.push(familyArr[i]);
              }
            }
        }
        if (optInUserArr.length > 2)
          secretSantaIntBool = true;
      }
  }

  initializeSecretSantaBtns();
}

function generateSecretSantaModal(){
  activateSecretSanta.onclick = function() {
    santaModalSpan.onclick = function(){
      closeModal(secretSantaModal);
    };

    window.onclick = function(event) {
      if (event.target == secretSantaModal) {
        closeModal(secretSantaModal);
      }
    };

    openModal(secretSantaModal, "secretSantaModal");
  };
  activateSecretSanta.innerHTML = "Secret Santa";
}

function createSecretSantaNames(){//----------------------------*****************************ToDo
  let optInPerFamilyArr = [];
  let assignedFamiliesArr = [];
  let optInFamilyIndex = 0;
  let selector;
  let userIndex;
  let retryCount = 0;

  //be aware of members that may be in multiple families... just in case (if already assigned a secret santa, cancel)

  for (let i = 0; i < optInFamilyArr.length; i++) {
    if (!assignedFamiliesArr.includes(optInFamilyArr[i].uid))
      if (optInFamilyArr[i].connections != null) {
        for (let y = 0; y < optInFamilyArr[i].connections.length; y++)
          optInFamilyIndex = findUIDItemInArr(optInFamilyArr[i].connections[y], optInFamilyArr);
        if (optInFamilyIndex != -1 &&
            !assignedFamiliesArr.includes(optInFamilyArr[i]).connections[y]) {
          for (let x = 0; x < optInFamilyArr[optInFamilyIndex].members; x++)
            if (optInUserArr.includes(optInFamilyArr[optInFamilyIndex].members[x]))
              optInPerFamilyArr.push(optInUserArr[optInUserArr.indexOf(optInFamilyArr[optInFamilyIndex].members[x])]);
          assignedFamiliesArr.push(optInFamilyArr[optInFamilyIndex].uid);
        }
      }
    for (let z = 0; z < optInFamilyArr[i].members.length; i++) {
      if (optInUserArr.includes(optInFamilyArr[i].members[z])) {
        optInPerFamilyArr.push(optInUserArr[optInUserArr.indexOf(optInFamilyArr[i].members[z])]);
      }
    }


    console.log("The following users will be assigned secret santas");
    console.log(optInPerFamilyArr);
    //CHECK IF OPT IN PER FAMILY ARR IS THE CORRECT SIZE OF 3 or more
    //ASSIGN SECRET SANTA NAMES WITH optInPerFamilyArr
    assignedFamiliesArr.push(optInFamilyArr[i].uid);
  }

  /*
  for (let i = 0; i < optInUserArr.length; i++) {
    selector = Math.floor((Math.random() * tempUserArr.length));
    if (!userUIDArr.includes(tempUserArr[selector].uid)) {
      if (tempUserArr[selector].name != optInUserArr[i].name) {
        if (optInUserArr[i].friends.includes(tempUserArr[selector].uid)) {
          console.log("Matched " + tempUserArr[selector].name + " to " + optInUserArr[i].name);
          userUIDArr.push(tempUserArr[selector].uid);
          userIndex = findUIDItemInArr(optInUserArr[i].uid, userArr);
          userArr[userIndex].secretSantaName = tempUserArr[selector].uid;
          tempUserArr.splice(selector, 1);
          retryCount = 0;
        } else {
          console.log("These Users Aren't Friends :(");
          retryCount++;
          if(retryCount >= 10)
            break;
          i--;
        }
      } else {
        console.log("These Are The Same Users :(");
        retryCount++;
        if(retryCount >= 10)
          break;
        i--;
      }
    } else {
      console.log("User Has Already Been Picked");
      retryCount++;
      if(retryCount >= 10)
        break;
      i--;
    }
  }
  if (optInUserArr.length != userUIDArr.length) {
    console.log("USERUIDARR:");
    console.log(userUIDArr);
    console.log("TEMPUSERARR:");
    console.log(tempUserArr);
    userUIDArr = [];
    removeSecretSantaNames();
    alert("Secret Santa System Was Unable To Properly Initialize Secret Santa Names. Please Try Again");
  } else {
    sessionStorage.setItem("userArr", JSON.stringify(userArr));
    updateAllUsersToDBSantaNames();
    userUIDArr = [];
  }
   */
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
    if (userArr[i].secretSanta != undefined) {
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
    if (userArr[i].secretSantaName != undefined) {
      firebase.database().ref("users/" + userArr[i].uid).update({
        secretSantaName: userArr[i].secretSantaName
      });
    } else {
      console.log("Failed To Update Name " + userArr[i].name);
    }
  }
}
