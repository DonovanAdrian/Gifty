/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let familyElements = [];
let familyMemberArr = [];
let loadedFamilyMembersArr = [];

let settingsNote;
let createFamilyBtn;
let familyModal;
let closeFamilyModal;
let familyTitle;
let familyUID;
let familyMemberCount;
let familyListContainer;
let testFamily;
let familyEdit;
let familyRemove;
let familyAddModal;
let closeFamilyAddModal;
let familyNameInp;
let addFamily;
let cancelFamily;



function checkFamilyCookie(){
  try {
    familyArr = JSON.parse(sessionStorage.familyArr);
    for (let i = 0; i < familyArr.length; i++) {
      createFamilyElement(familyArr[i]);
    }
  } catch (err) {}
}

window.onload = function instantiate() {
  failedNavNum = 15;
  pageName = "Family";
  inviteNote = document.getElementById("inviteNote");
  settingsNote = document.getElementById("settingsNote");
  createFamilyBtn = document.getElementById("createFamily");
  backBtn = document.getElementById("backBtn");
  familyModal = document.getElementById("familyModal");
  closeFamilyModal = document.getElementById("closeFamilyModal");
  familyTitle = document.getElementById("familyTitle");
  familyUID = document.getElementById("familyUID");
  familyMemberCount = document.getElementById("familyMemberCount");
  familyListContainer = document.getElementById("familyListContainer");
  testFamily = document.getElementById("testFamily");
  familyEdit = document.getElementById("familyEdit");
  familyRemove = document.getElementById("familyRemove");
  familyAddModal = document.getElementById("familyAddModal");
  closeFamilyAddModal = document.getElementById("closeFamilyAddModal");
  familyNameInp = document.getElementById("familyNameInp");
  addFamily = document.getElementById("addFamily");
  cancelFamily = document.getElementById("cancelFamily");

  getCurrentUserCommon();
  commonInitialization();

  familyElements = [inviteNote, settingsNote, dataListContainer, testData, createFamilyBtn, backBtn, familyModal,
    closeFamilyModal, familyTitle, familyUID, familyMemberCount, familyListContainer, testFamily, familyEdit,
    familyRemove, familyAddModal, closeFamilyAddModal, familyNameInp, addFamily, cancelFamily, offlineModal,
    offlineSpan, notificationModal, noteSpan, notificationTitle, notificationInfo];

  checkFamilyCookie();
  verifyElementIntegrity(familyElements);

  userInitial = firebase.database().ref("users/");
  userInvites = firebase.database().ref("users/" + user.uid + "/invites");
  familyInitial = firebase.database().ref("family/");

  databaseQuery();
  alternateButtonLabel(settingsNote, "Settings", "Family");

  function initializeCreateFamilyBtn() {
    createFamilyBtn.innerHTML = "Create Family";
    createFamilyBtn.onclick = function () {
      generateAddFamilyModal();
    };
  }

  function initializeBackBtn() {
    backBtn.innerHTML = "Return To Settings";
    backBtn.onclick = function() {
      navigation(5);//Settings
    };
  }

  initializeCreateFamilyBtn();
  initializeBackBtn();

  function generateAddFamilyModal(){
    addFamily.onclick = function() {
      if(familyNameInp.value != "" || (familyNameInp.value.includes(" ") && isAlph(familyNameInp.value.charAt(0)))) {
        addFamilyToDB(familyNameInp.value);
        familyNameInp.value = "";
      }
    };

    cancelFamily.onclick = function() {
      familyNameInp.value = "";
      closeModal(familyAddModal);
    };

    openModal(familyAddModal, "familyAddModal");

    closeFamilyAddModal.onclick = function() {
      closeModal(familyAddModal);
    };
  }

  function databaseQuery() {
    let fetchData = function (postRef) {
      postRef.on("child_added", function (data) {
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
            if (consoleOutput)
              console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
            userArr[i] = data.val();

            if (data.key == user.uid) {
              user = data.val();
              updateFriendNav(user.friends);
              if(consoleOutput)
                console.log("Current User Updated");
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

    let fetchInvites = function (postRef) {
      postRef.on("child_added", function (data) {
        inviteArr.push(data.val());

        inviteNote.style.background = "#ff3923";
      });

      postRef.on("child_changed", function (data) {
        inviteArr[data.key] = data.val();
      });

      postRef.on("child_removed", function (data) {
        inviteArr.splice(data.key, 1);

        if (inviteArr.length == 0) {
          console.log("Invite List Removed");
          inviteNote.style.background = "#008222";
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

              createFamilyElement(data.val());
              saveCriticalCookies();
            } else {
              localObjectChanges = findObjectChanges(familyArr[i], data.val());
              if (localObjectChanges.length != 0) {
                familyArr[i] = data.val();

                changeFamilyElement(data.val());
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
                changeFamilyElement(data.val());
                saveCriticalCookies();
              }
            }
          });

          postRef.on("child_removed", function (data) {
            let i = findUIDItemInArr(data.key, familyArr);
            if (i != -1) {
              familyArr.splice(i, 1);
              removeFamilyElement(data.key);
              saveCriticalCookies();
            }
          });
        } else {
          deployListEmptyNotification("No Families Found!");
        }
      });
    };

    fetchData(userInitial);
    fetchInvites(userInvites);
    fetchFamilies(familyInitial);

    listeningFirebaseRefs.push(userInitial);
    listeningFirebaseRefs.push(userInvites);
    listeningFirebaseRefs.push(familyInitial);
  }
};

function createFamilyElement(familyData){
  try{
    document.getElementById("testData").remove();
  } catch (err) {}

  let liItem = document.createElement("LI");
  liItem.id = "family" + familyData.uid;
  initFamilyElement(liItem, familyData);
  let textNode = document.createTextNode(familyData.name);
  liItem.appendChild(textNode);

  dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
  clearInterval(commonLoadingTimer);
  clearInterval(offlineTimer);
  dataCounter++;
}

function changeFamilyElement(familyData) {
  let editFamily = document.getElementById("family" + familyData.uid);
  editFamily.innerHTML = familyData.name;
  initFamilyElement(editFamily, familyData);
}

function initFamilyElement(liItem, familyData) {
  liItem.className = "gift";
  liItem.onclick = function (){
    familyMemberArr = familyData.members;
    familyTitle.innerHTML = familyData.name;
    familyUID.innerHTML = "UID: " + familyData.uid;

    if (familyMemberArr != null) {
      try {
        testFamily.remove();
      } catch (err) {}
      familyMemberCount.innerHTML = "# Members: " + familyMemberArr.length;
      try {
        testFamily.remove();
      } catch (err) {}

      if (loadedFamilyMembersArr.length != 0) {
        for (let a = 0; a < loadedFamilyMembersArr.length; a++) {
          document.getElementById(loadedFamilyMembersArr[a]).remove();
        }
        loadedFamilyMembersArr = [];

        for (let i = 0; i < familyMemberArr.length; i++) {
          let liItem = document.createElement("LI");
          let familyMember = findUIDItemInArr(familyMemberArr[i], userArr, true);
          liItem.id = familyMemberArr[i];
          liItem.className = "gift";
          let textNode = document.createTextNode(userArr[familyMember].name);
          liItem.appendChild(textNode);
          familyListContainer.insertBefore(liItem, familyListContainer.childNodes[0]);

          loadedFamilyMembersArr.push(familyMemberArr[i]);
        }
      } else
        for (let i = 0; i < familyMemberArr.length; i++) {
          let liItem = document.createElement("LI");
          let familyMember = findUIDItemInArr(familyMemberArr[i], userArr, true);
          liItem.id = familyMemberArr[i];
          liItem.className = "gift";
          let textNode = document.createTextNode(userArr[familyMember].name);
          liItem.appendChild(textNode);
          familyListContainer.insertBefore(liItem, familyListContainer.childNodes[0]);

          loadedFamilyMembersArr.push(familyMemberArr[i]);
        }
    } else {
      if (loadedFamilyMembersArr.length != 0) {
        for (let a = 0; a < loadedFamilyMembersArr.length; a++) {
          document.getElementById(loadedFamilyMembersArr[a]).remove();
        }
        loadedFamilyMembersArr = [];
      }

      try {
        testFamily.remove();
      } catch (err) {}
      familyMemberCount.innerHTML = "# Members: " + 0;
      let liItem = document.createElement("LI");
      liItem.id = "testFamily";
      liItem.className = "gift";
      let textNode = document.createTextNode("No Family Members Found!");
      liItem.appendChild(textNode);
      familyListContainer.insertBefore(liItem, familyListContainer.childNodes[0]);

      loadedFamilyMembersArr.push("testFamily");
    }

    familyEdit.onclick = function (){
      sessionStorage.setItem("familyData", JSON.stringify(familyData));
      navigation(16);//familyUpdate
    };

    familyRemove.onclick = function (){
      closeModal(familyModal);
      removeFamilyFromDB(familyData.uid);
    };

    openModal(familyModal, familyData.uid);

    closeFamilyModal.onclick = function() {
      closeModal(familyModal);
    };
  };
}

function removeFamilyFromDB(uidToRemove) {
  firebase.database().ref("family/").child(uidToRemove).remove();
}

function removeFamilyElement(uid) {
  document.getElementById("family" + uid).remove();

  dataCounter--;
  if (dataCounter == 0){
    deployListEmptyNotification("No Families Found!");
  }
}

function addFamilyToDB(familyName){
  let newUid = firebase.database().ref("family").push();
  newUid = newUid.toString();
  newUid = findUIDInString(newUid);

  firebase.database().ref("family/" + newUid).set({
    uid: newUid,
    name: familyName
  });

  closeModal(familyAddModal);
}
