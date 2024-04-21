/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let faqElements = [];
let supportArr = [];

let emailBtn;
let settingsNote;



window.onload = function instantiate() {
  initializeFAQPage();

  function initializeFAQPage() {
    try {
      failedNavNum = 12;
      pageName = "FAQ";
      emailBtn = document.getElementById("emailBtn");
      inviteNote = document.getElementById("inviteNote");
      settingsNote = document.getElementById("settingsNote");

      getCurrentUserCommon();
      commonInitialization();

      faqElements = [emailBtn, offlineModal, offlineSpan, inviteNote, settingsNote, notificationModal, notificationTitle,
        notificationInfo, noteSpan];

      verifyElementIntegrity(faqElements);
      alternateButtonLabel(settingsNote, "Settings", "FAQ");

      userInitial = firebase.database().ref("users/");

      databaseQuery();

      emailBtn.onclick = function () {
        let supportStr = genSupport();
        window.open("mailto:gifty.application@gmail.com?subject=Gifty Support #" + supportStr +
            "&body=Hey Gifty Support, %0D%0A%0D%0A%0D%0A%0D%0A Sincerely, " + user.userName);
      };
    } catch (err) {
      sendCriticalInitializationError(err);
    }
  }

  function databaseQuery() {
    let fetchData = function (postRef) {
      postRef.on("child_added", function (data) {
        clearInterval(commonLoadingTimer);
        clearInterval(offlineTimer);
        let i = findUIDItemInArr(data.key, userArr, true);
        if (i != -1) {
          localObjectChanges = findObjectChanges(userArr[i], data.val());
          if (localObjectChanges.length != 0) {
            userArr[i] = data.val();

            if (data.key == user.uid) {
              user = data.val();
            }
            saveCriticalCookies();
          }
        } else {
          userArr.push(data.val());

          if (data.key == user.uid) {
            user = data.val();
          }
          saveCriticalCookies();
        }
      });

      postRef.on("child_changed", function (data) {
        let i = findUIDItemInArr(data.key, userArr, true);
        if (i != -1) {
          localObjectChanges = findObjectChanges(userArr[i], data.val());
          if (localObjectChanges.length != 0) {
            logOutput("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
            userArr[i] = data.val();

            if (data.key == user.uid) {
              user = data.val();
              updateFriendNav(user.friends);
              logOutput("Current User Updated");
            }
            saveCriticalCookies();
          }
        }
      });

      postRef.on("child_removed", function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if (i != -1) {
          userArr.splice(i, 1);
          saveCriticalCookies();
        }
      });
    };

    fetchData(userInitial);

    listeningFirebaseRefs.push(userInitial);
  }
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
  logOutput(supportCode);
  logOutput(supportCount);
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
