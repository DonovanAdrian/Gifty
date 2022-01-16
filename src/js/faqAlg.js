/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let faqElements = [];
let userArr = [];
let supportArr = [];

let offlineSpan;
let offlineModal;
let emailBtn;
let user;
let inviteNote;
let settingsNote;
let notificationModal;
let notificationInfo;
let notificationTitle;
let noteSpan;



function getCurrentUser(){
  let localConsoleOutput = false;

  try {
    user = JSON.parse(sessionStorage.validUser);
    if(user.moderatorInt == 1)
      localConsoleOutput = true;
    if(localConsoleOutput)
      console.log("User: " + user.userName + " loaded in");
    if (user.invites == undefined) {
      if(localConsoleOutput)
        console.log("Invites Not Found");
    } else if (user.invites != undefined) {
      if (user.invites.length > 0) {
        inviteNote.style.background = "#ff3923";
      }
    }
    if (user.friends == undefined) {
      if(localConsoleOutput)
        console.log("Friends Not Found");
    } else if (user.friends != undefined) {
      if (user.friends.length < 100 && user.friends.length > 0) {
        inviteNote.innerHTML = user.friends.length + " Friends";
      }
    }
    userArr = JSON.parse(sessionStorage.userArr);
  } catch (err) {
    if(localConsoleOutput)
      console.log(err.toString());
    window.location.href = "index.html";
  }
}

window.onload = function instantiate() {

  pageName = "FAQ";
  emailBtn = document.getElementById('emailBtn');
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  inviteNote = document.getElementById('inviteNote');
  settingsNote = document.getElementById('settingsNote');
  notificationModal = document.getElementById('notificationModal');
  notificationTitle = document.getElementById('notificationTitle');
  notificationInfo = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  faqElements = [emailBtn, offlineModal, offlineSpan, inviteNote, settingsNote, notificationModal, notificationTitle,
    notificationInfo, noteSpan];
  getCurrentUser();
  commonInitialization();
  verifyElementIntegrity(faqElements);

  emailBtn.onclick = function () {
    let supportStr = genSupport();
    window.open('mailto:gifty.application@gmail.com?subject=Gifty Support #' + supportStr +
      '&body=Hey Gifty Support, %0D%0A%0D%0A%0D%0A%0D%0A Sincerely, ' + user.userName);
  };

  function genSupport() {
    let supportCode = "";
    for(let i = 0; i < 16; i++){
      supportCode = supportCode + randomizer();
    }
    addSupportToDB(supportCode);
    return supportCode;
  }

  function addSupportToDB(supportCode) {
    let supportCount = 0;
    try{
      supportCount = supportArr.length;
    } catch (err) {

    }
    if(consoleOutput) {
      console.log(supportCode);
      console.log(supportCount);
    }
    firebase.database().ref("users/" + user.uid + "/support/" + supportCount).push();
    firebase.database().ref("users/" + user.uid + "/support/" + supportCount).set({
      supportCount: supportCount,
      supportString: supportCode
    });
  }

  function randomizer() {
    let alphabet = "123456789ABCDEFGHIJKLMNPQRSTUVWXYZ";
    let selector = Math.floor((Math.random() * alphabet.length));
    let charSelect = alphabet.charAt(selector);
    return charSelect;
  }

  alternateButtonLabel(settingsNote, "Settings", "FAQ");
};
