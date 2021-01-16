/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let settingsElements = [];
let userArr = [];

let editBtn;
let faqBtn;
let modBtn;
let familyBtn;
let offlineTimer;
let offlineSpan;
let offlineModal;
let inviteNote;
let user;
let notificationModal;
let notificationInfo;
let notificationTitle;
let noteSpan;



function getCurrentUser(){
  try {
    user = JSON.parse(sessionStorage.validUser);
    console.log("User: " + user.userName + " loaded in");
    if (user.invites == undefined) {
      console.log("Invites Not Found");
    } else if (user.invites != undefined) {
      if (user.invites.length > 0) {
        inviteNote.style.background = "#ff3923";
      }
    }
    if (user.moderatorInt == 1) {
      modBtn.style.display = "block";
      modBtn.onclick = function () {
        newNavigation(14);//Moderation
      };

      familyBtn.style.display = "block";
      familyBtn.onclick = function () {
        newNavigation(15);//Family
      };
    }
    userArr = JSON.parse(sessionStorage.userArr);
  } catch (err) {
    console.log(err.toString());
    window.location.href = "index.html";
  }
}

window.onload = function instantiate() {

  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  inviteNote = document.getElementById('inviteNote');
  editBtn = document.getElementById('edit');
  faqBtn = document.getElementById('faq');
  modBtn = document.getElementById('mod');
  familyBtn = document.getElementById('family');
  notificationModal = document.getElementById('notificationModal');
  notificationTitle = document.getElementById('notificationTitle');
  notificationInfo = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  settingsElements = [offlineModal, offlineSpan, inviteNote, editBtn, faqBtn, modBtn, familyBtn, notificationModal,
    notificationTitle, notificationInfo, noteSpan];
  verifyElementIntegrity(settingsElements);
  getCurrentUser();
  commonInitialization();

  editBtn.onclick = function (){
    newNavigation(13);//UserAddUpdate
  };

  faqBtn.onclick = function (){
    newNavigation(12);//FAQ
  };
};
