/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let currentDate = "";
let showDate = "";
let assignDate = "";
let hideDate = "";

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

function hideSecretSanta(){
  secretSantaSignUp.style.display = "block";
  secretSantaSignUp.onclick = function(){};

  //if before assign date but after show date and some users have signed up, OR after assign date but before hide date
    //set to 0 and issue "apology" notifications
  //if after hide date
    //set to 0 and issue "thanks" notifications
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
