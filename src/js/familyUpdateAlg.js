/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let familyUpdateElements = [];
let listeningFirebaseRefs = [];
let inviteArr = [];
let userArr = [];
let familyArr = [];
let familyMemberArr = [];
let familyConnectionArr = [];

let moderationSet = 1;
let onlineInt = 0;
let familyCounter = 0;
let loadingTimerInt = 0;

let familyData;
let inviteNote;
let settingsNote;
let dataListContainer;
let testData;
let addMember;
let familySettings;
let familyMemberViewModal;
let closeFamilyMemberViewModal;
let familyMemberName;
let familyMemberUserName;
let familyMemberUID;
let removeFamilyMember;
let familyAddModal;
let closeFamilyAddModal;
let familyMemberInp;
let addFamilyMember;
let cancelFamilyMember;
let familyNameModal;
let closeFamilyNameModal;
let familyNameInp;
let updateFamilyName;
let cancelFamilyName;
let familyLinkModal;
let closeFamilyLinkModal;
let familyLinkInp;
let addFamilyLink;
let cancelFamilyLink;
let familySettingsModal;
let familySettingsTitle;
let closeFamilySettings;
let changeFamilyName;
let linkFamilies;
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
    familyData = JSON.parse(sessionStorage.familyData);
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
  addMember = document.getElementById('addMember');
  familySettings = document.getElementById('familySettings');
  familyMemberViewModal = document.getElementById('');
  closeFamilyMemberViewModal = document.getElementById('');
  familyMemberName = document.getElementById('');
  familyMemberUserName = document.getElementById('');
  familyMemberUID = document.getElementById('');
  removeFamilyMember = document.getElementById('');
  familyAddModal = document.getElementById('familyAddModal');
  closeFamilyAddModal = document.getElementById('closeFamilyAddModal');
  familyMemberInp = document.getElementById('familyMemberInp');
  addFamilyMember = document.getElementById('addFamilyMember');
  cancelFamilyMember = document.getElementById('cancelFamilyMember');
  familyNameModal = document.getElementById('familyNameModal');
  closeFamilyNameModal = document.getElementById('closeFamilyNameModal');
  familyNameInp = document.getElementById('familyNameInp');
  updateFamilyName = document.getElementById('updateFamilyName');
  cancelFamilyName = document.getElementById('cancelFamilyName');
  familyLinkModal = document.getElementById('familyLinkModal');
  closeFamilyLinkModal = document.getElementById('closeFamilyLinkModal');
  familyLinkInp = document.getElementById('familyLinkInp');
  addFamilyLink = document.getElementById('addFamilyLink');
  cancelFamilyLink = document.getElementById('cancelFamilyLink');
  familySettingsModal = document.getElementById('familySettingsModal');
  familySettingsTitle = document.getElementById('');
  closeFamilySettings = document.getElementById('closeFamilySettings');
  changeFamilyName = document.getElementById('changeFamilyName');
  linkFamilies = document.getElementById('linkFamilies');
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  notificationModal = document.getElementById('notificationModal');
  noteSpan = document.getElementById('closeNotification');
  notificationTitle = document.getElementById('notificationTitle');
  notificationInfo = document.getElementById('notificationInfo');
  familyUpdateElements = [inviteNote, settingsNote, dataListContainer, testData, addMember, familySettings,
    familyMemberViewModal, closeFamilyMemberViewModal, familyMemberName, familyMemberUserName, familyMemberUID,
    removeFamilyMember, familyAddModal, closeFamilyAddModal, familyMemberInp, addFamilyMember, cancelFamilyMember,
    familyNameModal, closeFamilyNameModal, familyNameInp, updateFamilyName, cancelFamilyName, familyLinkModal,
    closeFamilyLinkModal, familyNameInp, updateFamilyName, cancelFamilyName, familyLinkModal, closeFamilyLinkModal,
    familyLinkInp, addFamilyLink, cancelFamilyLink, familySettingsModal, familySettingsTitle, closeFamilySettings,
    changeFamilyName, linkFamilies, offlineModal, offlineSpan, notificationModal, noteSpan, notificationTitle,
    notificationInfo];
  verifyElementIntegrity(familyUpdateElements);
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
          //console.log("testGift Missing. Loading Properly.");
        } else {
          deployFamilyListEmptyNotification();
        }
      } else {
        if (testData == undefined) {
          //console.log("testGift Missing. Loading Properly.");
        } else {
          testData.innerHTML = "Loading... Please Wait...";
        }
      }
    }
  }, 1000);

  databaseQuery();

  familyModerateButton();

  addMember.innerHTML = "Add Member";

  addMember.onclick = function() {
    generateAddMemberModal();
  };

  familySettings.innerHTML = "Family Settings";

  familySettings.onclick = function() {
    generateFamilySettingsModal();
  };

  function generateAddMemberModal() {//-----------------------**************************************ToDo
    //Initialize Data On Modal?

    addFamilyMember.onclick = function() {//-----------------------**************************************ToDo
      if(familyMemberInp.value != "" || (familyMemberInp.value.includes(" ") && isAlph(familyMemberInp.value.charAt(0))))
        console.log("Placeholder!!!");
      //Add Family Member to list and DB if valid, refresh?
    };

    cancelFamilyMember.onclick = function() {
      familyMemberInp.value = "";
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

  function generateFamilySettingsModal() {//-----------------------**************************************ToDo
    //Initialize Data On Modal

    changeFamilyName.onclick = function() {
      closeModal(familySettingsModal);
      generateFamilyNameModal();
    };

    linkFamilies.onclick = function() {
      closeModal(familySettingsModal);
      generateFamilyLinkModal();
    };

    openModal(familySettingsModal, "familySettingsModal");

    closeFamilySettings.onclick = function() {
      closeModal(familySettingsModal);
    };

    window.onclick = function(event) {
      if (event.target == familySettingsModal) {
        closeModal(familySettingsModal);
      }
    };
  }

  function generateFamilyNameModal() {//-----------------------**************************************ToDo
    //Initialize Data On Modal
    //Extra functions

    openModal(familyNameModal, "familyNameModal");

    closeFamilyNameModal.onclick = function() {
      closeModal(familyNameModal);
    };

    window.onclick = function(event) {
      if (event.target == familyNameModal) {
        closeModal(familyNameModal);
      }
    };
  }

  function generateFamilyLinkModal() {//-----------------------**************************************ToDo
    //Initialize Data On Modal
    //Extra functions

    openModal(familyLinkModal, "familyLinkModal");

    closeFamilyLinkModal.onclick = function() {
      closeModal(familyLinkModal);
    };

    window.onclick = function(event) {
      if (event.target == familyLinkModal) {
        closeModal(familyLinkModal);
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

        //createFamilyElement(data.val());//-----------------------**************************************ToDo
      });

      postRef.on('child_changed', function (data) {
        let i = findUIDItemInArr(data.key, familyArr);
        if(familyArr[i] != data.val() && i != -1) {
          familyArr[i] = data.val();
          //changeFamilyElement(data.val());//-----------------------**************************************ToDo
        }
      });

      postRef.on('child_removed', function (data) {
        let i = findUIDItemInArr(data.key, familyArr);
        if(familyArr[i] != data.val() && i != -1) {
          familyArr.splice(i, 1);
          //removeFamilyMemberElement(data.key);//-----------------------**************************************ToDo
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

  function createFamilyMemberElement(familyData){//-----------------------**************************************ToDo
    try{
      testData.remove();
    } catch (err) {}

    let liItem = document.createElement("LI");
    liItem.id = "family" + familyData.uid;
    liItem.className = "gift";
    liItem.onclick = function (){
      familyConnectionArr = familyData.connections;
      familyMemberArr = familyData.members;

      if(familyConnectionArr != null)
        familyConnectionCount.innerHTML = familyConnectionArr.length;

      if(familyMemberArr != null) {
        familyMemberCount.innerHTML = familyMemberArr.length;
        try{
          testFamily.remove();
        } catch (err) {}
        for(let i = 0; i < familyMemberArr.length; i++){
          let liItem = document.createElement("LI");
          let familyMember = findUIDItemInArr(familyMemberArr[i], userArr);
          liItem.id = familyMemberArr[i];
          liItem.className = "gift";
          let textNode = document.createTextNode(userArr[familyMember].name);
          liItem.appendChild(textNode);
          dataListContainer.insertBefore(liItem, familyListContainer.childNodes[0]);
        }
      } else {
        familyMemberCount.innerHTML = 0;
        let liItem = document.createElement("LI");
        liItem.id = "testFamily";
        liItem.className = "gift";
        let textNode = document.createTextNode("No Family Members Found!");
        liItem.appendChild(textNode);
        dataListContainer.insertBefore(liItem, familyListContainer.childNodes[0]);
      }


      familyEdit.onclick = function (){
        sessionStorage.setItem("familyData", JSON.stringify(familyData));
        newNavigation(16);
      };

      familyRemove.onclick = function (){
        removeFamilyMemberFromDB(familyData.uid);
      };

      //show modal
      openModal(familyModal, familyData.uid);

      //close on close
      spanGift.onclick = function() {
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
    familyCounter++;
  }

  function changeFamilyMemberElement(familyData) {//-----------------------**************************************ToDo
    let editGift = document.getElementById('family' + familyData.uid);
    editGift.innerHTML = familyData.name;
    editGift.className = "gift";
    editGift.onclick = function (){
      familyConnectionArr = familyData.connections;
      familyMemberArr = familyData.members;

      if(familyConnectionArr != null)
        familyConnectionCount.innerHTML = familyConnectionArr.length;

      if(familyMemberArr != null) {
        familyMemberCount.innerHTML = familyMemberArr.length;
        try{
          testFamily.remove();
        } catch (err) {}
        for(let i = 0; i < familyMemberArr.length; i++){
          let liItem = document.createElement("LI");
          let familyMember = findUIDItemInArr(familyMemberArr[i], userArr);
          liItem.id = familyMemberArr[i];
          liItem.className = "gift";
          let textNode = document.createTextNode(userArr[familyMember].name);
          liItem.appendChild(textNode);
          dataListContainer.insertBefore(liItem, familyListContainer.childNodes[0]);
        }
      } else {
        familyMemberCount.innerHTML = 0;
        let liItem = document.createElement("LI");
        liItem.id = "testFamily";
        liItem.className = "gift";
        let textNode = document.createTextNode("No Family Members Found!");
        liItem.appendChild(textNode);
        dataListContainer.insertBefore(liItem, familyListContainer.childNodes[0]);
      }


      familyEdit.onclick = function (){
        sessionStorage.setItem("familyData", JSON.stringify(familyData));
        newNavigation(16);
      };

      familyRemove.onclick = function (){
        removeFamilyMemberFromDB(familyData.uid);
      };

      //show modal
      openModal(familyModal, familyData.uid);

      //close on close
      spanGift.onclick = function() {
        closeModal(familyModal);
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == familyModal) {
          closeModal(familyModal);
        }
      };
    };
  }

  function removeFamilyMemberFromDB(uid) {//-----------------------**************************************ToDo
    alert("This will eventually remove the family data from the database");
    //confirm
    //firebase.database().ref("family/").child(uid).remove();
  }


  function removeFamilyMemberElement(uid) {
    document.getElementById('family' + uid).remove();

    familyCounter--;
    if (familyCounter == 0){
      //deployFamilyListEmptyNotification();//-----------------------**************************************ToDo
    }
  }

  function addFamilyMemberToDB(familyName){//-----------------------**************************************ToDo
    let newUid = firebase.database().ref("family").push();
    newUid = newUid.toString();
    //newUid = newUid.substr(51, 70);
    console.log(newUid);
    console.log(familyName);

    /*
    firebase.database().ref("family/" + newUid).set({
      uid: newUid,
      name: familyName
    });
    */
  }
};

function deployFamilyListEmptyNotification(){//-----------------------**************************************ToDo
  try{
    testData.innerHTML = "No Families Found!";
  } catch(err){
    console.log("Loading Element Missing, Creating A New One");
    let liItem = document.createElement("LI");
    liItem.id = "testGift";
    liItem.className = "gift";
    let textNode = document.createTextNode("No Families Found!");
    liItem.appendChild(textNode);
    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
  }

  clearInterval(offlineTimer);
}
