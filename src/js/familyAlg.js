/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let familyElements = [];
let listeningFirebaseRefs = [];
let inviteArr = [];
let userArr = [];
let familyArr = [];
let familyMemberArr = [];
let familyConnectionArr = [];
let loadedFamilyMembersArr = [];
let loadedFamilyModalsArr = [];

let moderationSet = 1;
let onlineInt = 0;
let dataCounter = 0;
let loadingTimerInt = 0;

let inviteNote;
let settingsNote;
let dataListContainer;
let testData;
let createFamilyBtn;
let familyModal;
let closeFamilyModal;
let familyTitle;
let familyUID;
let familyMemberCount;
let familyListContainer;
let testFamily;
let familyConnectionCount;
let familyEdit;
let familyRemove;
let familyAddModal;
let closeFamilyAddModal;
let familyNameInp;
let addFamily;
let cancelFamily;
let offlineModal;
let offlineSpan;
let notificationModal;
let noteSpan;
let notificationTitle;
let notificationInfo;
let offlineTimer;
let loadingTimer;
let userInitial;
let userInvites;
let familyInitial;



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

    if (user.moderatorInt == 0){
      window.location.href = "home.html";
    }
    userArr = JSON.parse(sessionStorage.userArr);
    sessionStorage.setItem("moderationSet", moderationSet);
  } catch (err) {
    console.log(err.toString());
    window.location.href = "index.html";
  }
}

window.onload = function instantiate() {

  inviteNote = document.getElementById('inviteNote');
  settingsNote = document.getElementById('settingsNote');
  dataListContainer = document.getElementById('dataListContainer');
  testData = document.getElementById('testData');
  createFamilyBtn = document.getElementById('createFamily');
  familyModal = document.getElementById('familyModal');
  closeFamilyModal = document.getElementById('closeFamilyModal');
  familyTitle = document.getElementById('familyTitle');
  familyUID = document.getElementById('familyUID');
  familyMemberCount = document.getElementById('familyMemberCount');
  familyListContainer = document.getElementById('familyListContainer');
  testFamily = document.getElementById('testFamily');
  familyConnectionCount = document.getElementById('familyConnectionCount');
  familyEdit = document.getElementById('familyEdit');
  familyRemove = document.getElementById('familyRemove');
  familyAddModal = document.getElementById('familyAddModal');
  closeFamilyAddModal = document.getElementById('closeFamilyAddModal');
  familyNameInp = document.getElementById('familyNameInp');
  addFamily = document.getElementById('addFamily');
  cancelFamily = document.getElementById('cancelFamily');
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  notificationModal = document.getElementById('notificationModal');
  noteSpan = document.getElementById('closeNotification');
  notificationTitle = document.getElementById('notificationTitle');
  notificationInfo = document.getElementById('notificationInfo');
  familyElements = [inviteNote, settingsNote, dataListContainer, testData, createFamilyBtn, familyModal,
    closeFamilyModal, familyTitle, familyUID, familyMemberCount, familyListContainer, testFamily, familyConnectionCount,
    familyEdit, familyRemove, familyAddModal, closeFamilyAddModal, familyNameInp, addFamily, cancelFamily, offlineModal,
    offlineSpan, notificationModal, noteSpan, notificationTitle, notificationInfo];
  verifyElementIntegrity(familyElements);
  getCurrentUser();
  commonInitialization();

  userInitial = firebase.database().ref("users/");
  userInvites = firebase.database().ref("users/" + user.uid + "/invites");
  familyInitial = firebase.database().ref("family/");

  loadingTimer = setInterval(function(){
    loadingTimerInt = loadingTimerInt + 1000;
    if(loadingTimerInt >= 2000){
      if(loadingTimerInt >= 5000){
        clearInterval(loadingTimer);
        if (testData == undefined) {
          console.log("testGift Missing. Loading Properly.");
        } else {
          deployFamilyListEmptyNotification();
        }
      } else {
        if (testData == undefined) {
          console.log("testGift Missing. Loading Properly.");
        } else {
          testData.innerHTML = "Loading... Please Wait...";
        }
      }
    }
  }, 1000);

  databaseQuery();

  familyModerateButton();

  createFamilyBtn.innerHTML = "Create Family";

  createFamilyBtn.onclick = function() {
    generateAddFamilyModal();
  };

  function generateAddFamilyModal(){
    addFamily.onclick = function() {
      if(familyNameInp.value != "" || (familyNameInp.value.includes(" ") && isAlph(familyNameInp.value.charAt(0))))
        addFamilyToDB(familyNameInp.value);
    };

    cancelFamily.onclick = function() {
      familyNameInp.value = "";
      closeModal(familyAddModal);
    };

    openModal(familyAddModal, "familyAddModal");

    closeFamilyAddModal.onclick = function() {
      closeModal(familyAddModal);
    };

    window.onclick = function(event) {
      if (event.target == familyAddModal) {
        closeModal(familyAddModal);
      }
    };
  }

  function isAlph(rChar){
    rChar = rChar.toUpperCase();
    switch (rChar){
      case "A":
      case "B":
      case "C":
      case "D":
      case "E":
      case "F":
      case "G":
      case "H":
      case "I":
      case "J":
      case "K":
      case "L":
      case "M":
      case "N":
      case "O":
      case "P":
      case "Q":
      case "R":
      case "S":
      case "T":
      case "U":
      case "V":
      case "W":
      case "X":
      case "Y":
      case "Z":
        return true;
      default:
        return false;
    }
  }

  function familyModerateButton(){
    let nowConfirm = 0;
    let alternator = 0;
    console.log("Settings Button Feature Active");
    setInterval(function(){
      nowConfirm = nowConfirm + 1000;
      if(nowConfirm >= 3000){
        nowConfirm = 0;
        if(alternator == 0) {
          alternator++;
          settingsNote.innerHTML = "Settings";
          settingsNote.style.background = "#00c606";
        } else {
          alternator--;
          settingsNote.innerHTML = "Family";
          settingsNote.style.background = "#00ad05";
        }
      }
    }, 1000);
  }

  function databaseQuery() {

    let fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1)
          userArr[i] = data.val();

        if(data.key == user.uid)
          user = data.val();
      });

      postRef.on('child_changed', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1)
          userArr[i] = data.val();

        if(data.key == user.uid)
          user = data.val();
      });

      postRef.on('child_removed', function (data) {
        let i = findUIDItemInArr(data.key, userArr);
        if(userArr[i] != data.val() && i != -1)
          userArr.splice(i, 1);
      });
    };

    let fetchInvites = function (postRef) {
      postRef.on('child_added', function (data) {
        inviteArr.push(data.val());

        inviteNote.style.background = "#ff3923";
      });

      postRef.on('child_changed', function (data) {
        inviteArr[data.key] = data.val();
      });

      postRef.on('child_removed', function (data) {
        inviteArr.splice(data.key, 1);

        if (inviteArr.length == 0) {
          console.log("Invite List Removed");
          inviteNote.style.background = "#008222";
        }
      });
    };

    let fetchFamilies = function (postRef){
      postRef.on('child_added', function (data) {
        familyArr.push(data.val());

        createFamilyElement(data.val());
      });

      postRef.on('child_changed', function (data) {
        let i = findUIDItemInArr(data.key, familyArr);
        if(familyArr[i] != data.val() && i != -1) {
          familyArr[i] = data.val();
          changeFamilyElement(data.val());
        }
      });

      postRef.on('child_removed', function (data) {
        let i = findUIDItemInArr(data.key, familyArr);
        if(familyArr[i] != data.val() && i != -1) {
          familyArr.splice(i, 1);
          removeFamilyElement(data.key);
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

  function findUIDItemInArr(item, userArray){
    for(let i = 0; i < userArray.length; i++)
      if(userArray[i].uid == item)
        return i;
    return -1;
  }

  function createFamilyElement(familyData){
    try{
      testData.remove();
    } catch (err) {}

    let liItem = document.createElement("LI");
    liItem.id = "family" + familyData.uid;
    liItem.className = "gift";
    liItem.onclick = function (){
      familyConnectionArr = familyData.connections;
      familyMemberArr = familyData.members;
      familyTitle.innerHTML = familyData.name;
      familyUID.innerHTML = "UID: " + familyData.uid;

      if(familyConnectionArr != null)
        familyConnectionCount.innerHTML = "# Connections: " + familyConnectionArr.length;
      else
        familyConnectionCount.innerHTML = "# Connections: " + 0;

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
            let familyMember = findUIDItemInArr(familyMemberArr[i], userArr);
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
            let familyMember = findUIDItemInArr(familyMemberArr[i], userArr);
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
        newNavigation(16);//familyUpdate
      };

      familyRemove.onclick = function (){
        closeModal(familyModal);
        removeFamilyFromDB(familyData.uid);
      };

      //show modal
      openModal(familyModal, familyData.uid);

      //close on close
      closeFamilyModal.onclick = function() {
        closeModal(familyModal);
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == familyModal) {
          closeModal(familyModal);
        }
      };
    };
    let textNode = document.createTextNode(familyData.name);
    liItem.appendChild(textNode);

    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
    clearInterval(offlineTimer);
    dataCounter++;
  }

  function changeFamilyElement(familyData) {
    let editFamily = document.getElementById('family' + familyData.uid);
    editFamily.innerHTML = familyData.name;
    editFamily.className = "gift";
    editFamily.onclick = function (){
      familyConnectionArr = familyData.connections;
      familyMemberArr = familyData.members;
      familyTitle.innerHTML = familyData.name;
      familyUID.innerHTML = "UID: " + familyData.uid;

      if(familyConnectionArr != null)
        familyConnectionCount.innerHTML = "# Connections: " + familyConnectionArr.length;
      else
        familyConnectionCount.innerHTML = "# Connections: " + 0;

      if (!loadedFamilyModalsArr.includes(familyData.uid)) {
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
              console.log("Removed " + loadedFamilyMembersArr[a]);
            }
            loadedFamilyMembersArr = [];
          } else
            for (let i = 0; i < familyMemberArr.length; i++) {
              let liItem = document.createElement("LI");
              let familyMember = findUIDItemInArr(familyMemberArr[i], userArr);
              liItem.id = familyMemberArr[i];
              liItem.className = "gift";
              let textNode = document.createTextNode(userArr[familyMember].name);
              liItem.appendChild(textNode);
              familyListContainer.insertBefore(liItem, familyListContainer.childNodes[0]);

              console.log("Loaded " + familyMemberArr[i]);
              loadedFamilyMembersArr.push(familyMemberArr[i]);
            }
        } else {
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
        }
        loadedFamilyModalsArr.push(familyData.uid);
      }

      familyEdit.onclick = function (){
        sessionStorage.setItem("familyData", JSON.stringify(familyData));
        newNavigation(16);//familyUpdate
      };

      familyRemove.onclick = function (){
        closeModal(familyModal);
        removeFamilyFromDB(familyData.uid);
      };

      //show modal
      openModal(familyModal, familyData.uid);

      //close on close
      closeFamilyModal.onclick = function() {
        closeModal(familyModal);
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == familyModal) {
          closeModal(familyModal);
        }
      };
      if(!loadedFamilyModalsArr.includes(familyData.uid))
        loadedFamilyModalsArr.push(familyData.uid);
    };
  }

  function removeFamilyFromDB(uid) {
    let familyConnectionsToRemoveArr = [];

    for(let i = 0; i < familyArr.length; i++)
      if(familyArr[i].connections != null) {
        familyConnectionsToRemoveArr = familyArr[i].connections;
        for (let a = 0; a < familyConnectionsToRemoveArr.length; a++)
          if (familyConnectionsToRemoveArr[a] == uid) {
            familyConnectionsToRemoveArr.splice(a, 1);

            firebase.database().ref("family/" + familyArr[i].uid).update({
              connections: familyConnectionsToRemoveArr
            });
          }
      }

    firebase.database().ref("family/").child(uid).remove();
  }


  function removeFamilyElement(uid) {
    document.getElementById('family' + uid).remove();

    dataCounter--;
    if (dataCounter == 0){
      deployFamilyListEmptyNotification();
    }
  }

  function addFamilyToDB(familyName){
    let newUid = firebase.database().ref("family").push();
    newUid = newUid.toString();
    newUid = newUid.substr(46, 70);
    console.log(newUid);
    console.log(familyName);

    firebase.database().ref("family/" + newUid).set({
      uid: newUid,
      name: familyName
    });

    closeModal(familyAddModal);
  }
};

function deployFamilyListEmptyNotification(){
  try{
    testData.innerHTML = "No Families Found!";
  } catch(err){
    console.log("Loading Element Missing, Creating A New One");
    let liItem = document.createElement("LI");
    liItem.id = "testData";
    liItem.className = "gift";
    let textNode = document.createTextNode("No Families Found!");
    liItem.appendChild(textNode);
    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
  }

  clearInterval(offlineTimer);
}
