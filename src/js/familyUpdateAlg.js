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
let oldFamilyMemberArr = [];
let oldFamilyLinksArr = [];

let moderationSet = 1;
let onlineInt = 0;
let familyCounter = 0;
let loadingTimerInt = 0;

let oldFamilyName = "";

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
let familyLinkViewModal;
let closeFamilyLinkViewModal;
let familyLinkViewTitle;
let familyLinkViewContainer;
let familySettingsModal;
let familySettingsTitle;
let closeFamilySettings;
let changeFamilyName;
let linkFamilies;
let existingLinks;
let confirmMemberModal;
let closeConfirmMemberModal;
let confMemberUserName;
let addMemberConfirm;
let addMemberDeny;
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
  familyLinkViewModal = document.getElementById('familyLinkViewModal');
  closeFamilyLinkViewModal = document.getElementById('closeFamilyLinkViewModal');
  familyLinkViewTitle = document.getElementById('familyLinkViewTitle');
  familyLinkViewContainer = document.getElementById('familyLinkViewContainer');
  familySettingsModal = document.getElementById('familySettingsModal');
  familySettingsTitle = document.getElementById('');
  closeFamilySettings = document.getElementById('closeFamilySettings');
  changeFamilyName = document.getElementById('changeFamilyName');
  linkFamilies = document.getElementById('linkFamilies');
  existingLinks = document.getElementById('existingLinks');
  confirmMemberModal = document.getElementById('confirmMemberModal');
  closeConfirmMemberModal = document.getElementById('closeConfirmMemberModal');
  confMemberUserName = document.getElementById('confMemberUserName');
  addMemberConfirm = document.getElementById('addMemberConfirm');
  addMemberDeny = document.getElementById('addMemberDeny');
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
    familyLinkInp, addFamilyLink, cancelFamilyLink, familyLinkViewModal, closeFamilyLinkViewModal, familyLinkViewTitle,
    familyLinkViewContainer, familySettingsModal, familySettingsTitle, closeFamilySettings, changeFamilyName,
    linkFamilies, existingLinks, confirmMemberModal, closeConfirmMemberModal, confMemberUserName, addMemberConfirm,
    addMemberDeny, offlineModal, offlineSpan, notificationModal, noteSpan, notificationTitle, notificationInfo];
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

  if(familyData.members.length > 0)
    for(let i = 0; i < familyData.members.length; i++) {
      let a = findUIDItemInArr(familyData.members[i], userArr);
      createFamilyMemberElement(userArr[a]);
    }
  else
    deployFamilyListEmptyNotification();

  function generateAddMemberModal() {
    addFamilyMember.onclick = function() {
      if(familyMemberInp.value != "" || (familyMemberInp.value.includes(" ") &&
          isAlph(familyMemberInp.value.charAt(0)))) {
        familyMemberInp.value = "";
        closeModal(familyAddModal);
        //use confirm invite from inviteAlg to verify correct user
        //send UID instead of username
        //addFamilyMemberToDB(newMemberUID);//---------------------*****************************ToDo
      }
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

  function generateFamilySettingsModal() {
    familySettingsTitle = familyData.name + " Settings";

    changeFamilyName.onclick = function() {
      closeModal(familySettingsModal);
      generateFamilyNameModal();
    };

    linkFamilies.onclick = function() {
      closeModal(familySettingsModal);
      generateFamilyLinkModal();
    };

    existingLinks.onclick = function() {
      closeModal(familySettingsModal);
      generateFamilyLinkViewModal();
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

  function generateFamilyNameModal() {
    updateFamilyName.onclick = function() {
      if(familyNameInp.value != "" || (familyNameInp.value.includes(" ") &&
          isAlph(familyNameInp.value.charAt(0)))) {
        changeFamilyNameInDB(familyNameInp);
        familyNameInp = "";
        closeModal(familyNameModal);
      }
    };

    cancelFamilyName.onclick = function() {
      familyNameInp = "";
      closeModal(familyNameModal);
    };

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

  function generateFamilyLinkModal() {
    addFamilyLink.onclick = function() {
      if(findFamilyInDB(familyLinkInp.value)) {
        familyLinkInp.value = "";
        closeModal(familyLinkModal);
      }
    };

    cancelFamilyLink.onclick = function() {
      familyLinkInp.value = "";
      closeModal(familyLinkModal);
    };

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

  function generateFamilyLinkViewModal() {//-----------------------**************************************ToDo
    //Load familyLinks with separate function createFamilyLinks
    //Repurpose familyMemberViewModal for viewing or removing links
    //change each element's name and function
    //change them back to the originals (if needed) when closed

    openModal(familyLinkViewModal, "familyLinkViewModal");

    closeFamilyLinkViewModal.onclick = function() {
      closeModal(familyLinkViewModal);
    };

    window.onclick = function(event) {
      if (event.target == familyLinkViewModal) {
        closeModal(familyLinkViewModal);
      }
    };
  }

  function generateAddUserBtn(){//------------*******************************ToDo
    let friendUserNameList = [];
    let upperCaseUserArr = [];
    if(user.friends != undefined || user.friends != null) {
      for (let i = 0; i < user.friends.length; i++) {
        for (let a = 0; a < userArr.length; a++) {
          if (userArr[a].uid == user.friends[i]) {
            friendUserNameList.push(userArr[a].userName.toUpperCase());
            break;
          }
        }
      }
    }
    for (let b = 0; b < userArr.length; b++){
      upperCaseUserArr.push(userArr[b].userName.toUpperCase());
    }

    addUser.onclick = function() {
      openModal(userInviteModal, "userInviteModal");
      addInvite.innerHTML = "Send Invite";

      addInvite.onclick = function() {
        let userLocation = -1;
        for (let i = 0; i < upperCaseUserArr.length; i++) {
          if (upperCaseUserArr[i] == userNameInp.value.toUpperCase()) {
            userLocation = i;
            break;
          }
        }

        inviteInfo.innerHTML = "";
        if(userNameInp.value == ""){
          inviteInfo.innerHTML = "User Name Field Empty, Please Try Again!";
        } else if (friendUserNameList.includes(userNameInp.value.toUpperCase())) {
          inviteInfo.innerHTML = "That User Is Already Your Friend, Please Try Again!";
        } else if (user.userName.toUpperCase() == userNameInp.value.toUpperCase()){
          inviteInfo.innerHTML = "You Cannot Invite Yourself, Please Try Again!";
        } else if (userLocation != -1) {
          try {
            if (user.invites.includes(userArr[userLocation].uid)) {
              inviteInfo.innerHTML = "This User Already Sent You An Invite, Please Try Again!";
            } else if (userArr[userLocation].invites.includes(user.uid)) {
              inviteInfo.innerHTML = "You Already Sent This User An Invite, Please Try Again!";
            } else {
              generateConfirmDialog(userLocation);
            }
          } catch (err) {
            try {
              if (userArr[userLocation].invites.includes(user.uid)) {
                inviteInfo.innerHTML = "You Already Sent This User An Invite, Please Try Again!";
              } else {
                generateConfirmDialog(userLocation);
              }
            } catch (err) {
              generateConfirmDialog(userLocation);
            }
          }
        } else if (userNameInp.value.toUpperCase() == "USER NAME BELOW"){
          inviteInfo.innerHTML = "Very Funny, Please Enter A User Name";
        } else if (userNameInp.value.toUpperCase() == "A USER NAME"){
          inviteInfo.innerHTML = "Listen Here, Please Input Something Serious";
        } else if (userNameInp.value.toUpperCase() == "SOMETHING SERIOUS"){
          inviteInfo.innerHTML = "You're Just Mocking Me At This Point";
        } else {
          inviteInfo.innerHTML = "That User Name Does Not Exist, Please Try Again!";
        }
      };

      cancelInvite.onclick = function() {
        closeModal(userInviteModal);
        userNameInp.value = "";
        inviteInfo.innerHTML = "";
      };

      closeUserInviteModal.onclick = function() {
        closeModal(userInviteModal);
        userNameInp.value = "";
        inviteInfo.innerHTML = "";
      };

      window.onclick = function(event) {
        if (event.target == userInviteModal) {
          closeModal(userInviteModal);
        }
      }
    };
    console.log("Add Button Generated");
  }

  function generateConfirmDialog(userLocation) {//------------*******************************ToDo
    //console.log(userLocation);
    //console.log(userArr[userLocation].userName);
    if (userLocation != -1) {
      confUserName.innerHTML = "Did you mean to add \"" + userArr[userLocation].name + "\"?";
      closeModal(userInviteModal);
      openModal(confirmModal, "confirmUserModal");

      inviteConfirm.onclick = function () {
        inviteUserDB(userArr[userLocation]);
        closeModal(confirmModal);
        userNameInp.value = "";
        inviteInfo.innerHTML = "";
      };

      inviteDeny.onclick = function () {
        closeModal(confirmModal);
        openModal(userInviteModal, "userInviteModal");
        userNameInp.value = "";
        inviteInfo.innerHTML = "";
      };

      //close on close
      closeConfirmModal.onclick = function () {
        closeModal(confirmModal);
        userNameInp.value = "";
        inviteInfo.innerHTML = "";
      };

      //close on click
      window.onclick = function (event) {
        if (event.target == confirmModal) {
          closeModal(confirmModal);
          userNameInp.value = "";
          inviteInfo.innerHTML = "";
        }
      }
    } else {
      alert("Error finding user, please contact the developer for assistance!");
    }
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

        for(let b = 0; i < familyData.members.length; i++)
          if(userArr[i].uid == familyData.members[b])
            changeFamilyMemberElement(userArr[i]);

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
      });

      postRef.on('child_changed', function (data) {//------------*******************************ToDo
        oldFamilyMemberArr = familyData.members;
        oldFamilyLinksArr = familyData.connections;

        if(familyData.uid == data.key) {
          familyData = data.val();

          if(oldFamilyMemberArr.length != familyData.members.length) {
            console.log("Something Changed! (FamilyMemberArr)");
            if (oldFamilyMemberArr.length > familyData.members.length) {
              //Remove old member ... better find it (and remove it)!
            } else {
              createFamilyMemberElement(familyData.members[familyData.members.length]);//Prolly wrong, might need -1
            }
          }

          if(oldFamilyLinksArr.length != familyData.connections.length) {
            console.log("Something Changed! (FamilyConnectionsArr)");
            if (oldFamilyLinksArr.length > familyData.connections.length) {
              //Remove old member ... better find it (and remove it)!
            }
          }
        }

        let i = findUIDItemInArr(data.key, familyArr);
        if(familyArr[i] != data.val() && i != -1) {
          familyArr[i] = data.val();
        }
      });

      postRef.on('child_removed', function (data) {
        if(data.key == familyData.uid)
          newNavigation(15);//family.html

        let i = findUIDItemInArr(data.key, familyArr);
        if(familyArr[i] != data.val() && i != -1) {
          familyArr.splice(i, 1);
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

  function createFamilyMemberElement(familyMemberData){
    try{
      testData.remove();
    } catch (err) {}

    let liItem = document.createElement("LI");
    liItem.id = "family" + familyMemberData.uid;
    liItem.className = "gift";
    liItem.onclick = function (){
      //initialize familyMemberViewModal data
      //----------------------------------------*********************************************ToDo

      //show modal
      openModal(familyMemberViewModal, familyMemberData.uid);

      //close on close
      closeFamilyMemberViewModal.onclick = function() {
        closeModal(familyMemberViewModal);
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == familyMemberViewModal) {
          closeModal(familyMemberViewModal);
        }
      };
    };
    let textNode = document.createTextNode(familyMemberData.name);
    liItem.appendChild(textNode);

    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
    clearInterval(offlineTimer);
    familyCounter++;
  }

  function changeFamilyMemberElement(familyMemberData) {
    let editGift = document.getElementById('family' + familyMemberData.uid);
    editGift.innerHTML = familyMemberData.name;
    editGift.className = "gift";
    editGift.onclick = function (){
      //initialize familyMemberViewModal data
      //----------------------------------------*********************************************ToDo

      //show modal
      openModal(familyMemberViewModal, familyMemberData.uid);

      //close on close
      closeFamilyMemberViewModal.onclick = function() {
        closeModal(familyMemberViewModal);
      };

      //close on click
      window.onclick = function(event) {
        if (event.target == familyMemberViewModal) {
          closeModal(familyMemberViewModal);
        }
      };
    };
  }

  function removeFamilyMemberFromDB(uid) {
    alert("This will eventually remove the family member from the database");
    //confirm//--------------------------------**********************************************ToDo (Later)

    for (let i = 0; i < familyMemberArr.length; i++)
      if (uid == familyMemberArr[i])
        familyMemberArr.splice(i, 1);

    firebase.database().ref("family/" + familyData.uid).update({
      members: familyMemberArr
    });

    location.reload();
  }


  function removeFamilyMemberElement(uid) {
    document.getElementById('family' + uid).remove();

    familyCounter--;
    if (familyCounter == 0){
      deployFamilyListEmptyNotification();
    }
  }

  function findFamilyInDB(familyLinkData){//-----------------------**************************************ToDo
    if (familyLinkData.length > 15 && familyLinkData.matches("^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]+$")) {
      console.log("This is a UID! " + familyLinkData);
    } else {
      console.log("This is a family name! " + familyLinkData);
    }
    //repurpose confirm dialog for this case
    alert("This will eventually link the current family to the input data: " + familyLinkData);
  }

  function changeFamilyNameInDB(newFamilyName){
    firebase.database().ref("family/" + familyData.uid).update({
      name:newFamilyName
    });
    newNavigation(15);//family.html
  }

  function addFamilyMemberToDB(memberUID){//-----------------------**************************************ToDo
    console.log(memberUID);

    console.log(familyMemberArr);
    if (familyMemberArr.length == 0)
      firebase.database().ref("family/" + familyData.uid).update({
        members:{0:memberUID}
      });
    else {
      familyMemberArr.push(memberUID);
      console.log(familyMemberArr);
      firebase.database().ref("family/" + familyData.uid).update({
        members: familyMemberArr
      });
    }
  }
};

function deployFamilyListEmptyNotification(){
  try{
    testData.innerHTML = "No Family Members Found!";
  } catch(err){
    console.log("Loading Element Missing, Creating A New One");
    let liItem = document.createElement("LI");
    liItem.id = "testData";
    liItem.className = "gift";
    let textNode = document.createTextNode("No Family Members Found!");
    liItem.appendChild(textNode);
    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
  }

  clearInterval(offlineTimer);
}
