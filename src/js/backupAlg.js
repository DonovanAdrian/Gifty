/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 *
 * Error Code Key *
 * 100 - The filename is too short, only formal text and csv files are allowed.
 * 200 - This does not appear to be a traditional Gifty Backup File
 * 300 - There was potential data loss with this file's export or import
 */

let entireDBDataArr = [];
let entireDBDataKeyArr = [];
let backupElements = [];
let listeningFirebaseRefs = [];
let inviteArr = [];
let userArr = [];
let familyArr = [];
let loadedDataArr = [];
let generatedLayerArr = [];

let moderationSet = 1;
let dataCounter = 0;
let globalNoteInt = 0;
let commonLoadingTimerInt = 0;
let generateDataLayer = 0;
let generateNLevelLayer = 0;
let ignoreLayer = 2;
let changesInt = 0;

let lastBackupWhen = "";
let generatedDataString = "";

let runningBackup = false;

let dataListContainer;
let offlineSpan;
let offlineModal;
let user;
let offlineTimer;
let commonLoadingTimer;
let notificationModal;
let notificationInfo;
let notificationTitle;
let noteSpan;
let inviteNote;
let entireDB;
let backupInitial;
let userInitial;
let userInvites;
let settingsNote;
let testData;
let backupSettings;
let backBtn;
let backupModal;
let backupSpan;
let lastBackup;
let exportBtn;
let importBtn;



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
    if (user.friends == undefined) {
      console.log("Friends Not Found");
    } else if (user.friends != undefined) {
      if (user.friends.length < 100 && user.friends.length > 0) {
        inviteNote.innerHTML = user.friends.length + " Friends";
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

  pageName = "Backups";
  dataListContainer = document.getElementById('dataListContainer');
  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById('closeOffline');
  inviteNote = document.getElementById('inviteNote');
  notificationModal = document.getElementById('notificationModal');
  notificationTitle = document.getElementById('notificationTitle');
  notificationInfo = document.getElementById('notificationInfo');
  noteSpan = document.getElementById('closeNotification');
  settingsNote = document.getElementById('settingsNote');
  testData = document.getElementById('testData');
  backupSettings = document.getElementById('backupSettings');
  backBtn = document.getElementById('backBtn');
  backupModal = document.getElementById('backupModal');
  backupSpan = document.getElementById('backupSpan');
  lastBackup = document.getElementById('lastBackup');
  exportBtn = document.getElementById('exportBtn');
  importBtn = document.getElementById('importBtn');
  backupElements = [dataListContainer, offlineModal, offlineSpan, inviteNote, notificationModal, notificationTitle,
    notificationInfo, noteSpan, settingsNote, testData, backupSettings, backBtn, backupModal, backupSpan,
    lastBackup, exportBtn, importBtn];
  getCurrentUser();
  commonInitialization();
  verifyElementIntegrity(backupElements);

  databaseQuery();

  alternateButtonLabel(settingsNote, "Settings", "Backups");

  generateBackupModal();

  function generateBackupModal(){
    backupSettings.onclick = function(){
      let fileHandle;
      let fileSuffix;

      lastBackup.innerHTML = "Last Backup: " + lastBackupWhen;

      exportBtn.onclick = function() {
        exportBackup();
      }
      exportBtn.innerHTML = "Export Backup";

      importBtn.addEventListener('click', async() => {
        try {
          [fileHandle] = await window.showOpenFilePicker();
          const file = await fileHandle.getFile();
          fileSuffix = file.name;
          if (file.name.length > 4) {
            fileSuffix = file.name.substring(file.name.length - 4);
            if (fileSuffix == ".txt" || fileSuffix == ".csv") {
              const contents = await file.text();
              importBackup(contents);
            } else {
              alert("Please only import text or comma seperated variable files!");
            }
          } else {
            alert("File Import Error! This backup file is not in the correct format! \n\nError Code: 100");
          }
        } catch (err) {}
      });
      importBtn.innerHTML = "Import Backup";

      backupSpan.onclick = function() {
        closeModal(backupModal);
      }

      openModal(backupModal, "backupModal");
    };
    backupSettings.innerHTML = "Backup Settings";
  }

  initializeBackBtn();

  function initializeBackBtn() {
    backBtn.innerHTML = "Return To Settings";

    backBtn.onclick = function() {
      navigation(5);
    };
  }

  function databaseQuery() {
    entireDB = firebase.database().ref("/");
    backupInitial = firebase.database().ref("backup/");
    userInitial = firebase.database().ref("users/");
    userInvites = firebase.database().ref("users/" + user.uid + "/invites");

    let fetchBackup = function (postRef) {
      postRef.once("value").then(function(snapshot) {
        if(snapshot.exists()) {
          postRef.on('child_added', function (data) {
            lastBackupWhen = data.val();
          });

          postRef.on('child_changed', function (data) {
            closeModal(backupModal);
            lastBackupWhen = data.val();
          });

          postRef.on('child_removed', function (data) {
            lastBackupWhen = "Never";
          });
        } else {
          if(consoleOutput)
            console.log("Initializing Backup Data In DB...");

          firebase.database().ref("backup/").update({
            backupWhen: "Never"
          });
        }
      });
    };

    let fetchAllData = function (postRef) {
      postRef.on('child_added', function (data) {
        entireDBDataArr.push(data.val());
        entireDBDataKeyArr.push(data.key);
        createKeyElement(data.key, data.val());
      });

      postRef.on('child_changed', function (data) {
        if (!runningBackup) {
          let i = entireDBDataKeyArr.indexOf(data.key);
          entireDBDataArr[i] = data.val();
          updateKeyElement(data.key);
          changesInt++;
        }
      });

      postRef.on('child_removed', function (data) {
        let i = entireDBDataKeyArr.indexOf(data.key);
        entireDBDataArr.splice(i, 1);
        entireDBDataKeyArr.splice(i, 1);
        removeKeyElement(data.key);
      });
    };

    let fetchData = function (postRef) {
      postRef.on('child_added', function (data) {
        if(data.key == user.uid){
          user = data.val();
        }
      });

      postRef.on('child_changed', function (data) {
        if(data.key == user.uid){
          user = data.val();
          console.log("Current User Updated");
        }
      });
    };

    let fetchInvites = function (postRef) {
      postRef.on('child_added', function (data) {
        inviteArr.push(data.val());
        inviteNote.style.background = "#ff3923";
      });

      postRef.on('child_changed', function (data) {
        console.log(inviteArr);
        inviteArr[data.key] = data.val();
        console.log(inviteArr);
      });

      postRef.on('child_removed', function (data) {
        console.log(inviteArr);
        inviteArr.splice(data.key, 1);
        console.log(inviteArr);

        if (inviteArr.length == 0) {
          console.log("Invite List Removed");
          inviteNote.style.background = "#008222";
        }
      });
    };

    fetchBackup(backupInitial);
    fetchAllData(entireDB);
    fetchData(userInitial);
    fetchInvites(userInvites);

    listeningFirebaseRefs.push(backupInitial);
    listeningFirebaseRefs.push(entireDB);
    listeningFirebaseRefs.push(userInitial);
    listeningFirebaseRefs.push(userInvites);
  }

  function createKeyElement(keyName, keyData) {
    try {
      testData.remove();
    } catch (err) {}

    compileNLevelKeyElements(keyData);
    generateBackupNodeElement(keyName);
  }

  function generateBackupNodeElement(keyName){
    let liItem = document.createElement("LI");
    liItem.id = "data" + keyName;
    liItem.className = "gift";
    let textNode = document.createTextNode(keyName);
    liItem.appendChild(textNode);
    dataListContainer.insertBefore(liItem, dataListContainer.childNodes[0]);
    clearInterval(commonLoadingTimer);
    clearInterval(offlineTimer);

    loadedDataArr.push(keyName);
    dataCounter++;
    if (dataCounter > buttonOpacLim) {
      backupSettings.style.opacity = ".75";
    }
  }

  function compileNLevelKeyElements(keyData) {
    compileNLevelObjectData(keyData, true);

    for (let i = 0; i < generatedLayerArr.length; i++) {
      generateBackupNodeElement(generatedLayerArr[i]);
    }
    generatedLayerArr = [];
  }

  function compileNLevelObjectData(keyData, reset) {
    let currentNLevel;
    let prefix = "";

    if (reset) {
      generateNLevelLayer = 1;
    } else {
      generateNLevelLayer++;
    }

    currentNLevel = generateNLevelLayer;

    for (let i = 0; i < currentNLevel; i++) {
      prefix += " > ";
    }

    if (currentNLevel < ignoreLayer) {
      for (let name in keyData) {
        if (typeof keyData[name] == "object") {
          generatedLayerArr.push(prefix + name);
          compileNLevelObjectData(keyData[name]);
          generateNLevelLayer--;
        } else {
          generatedLayerArr.push(prefix + name);
        }
      }
    }
  }

  function updateKeyElement(keyName) {
    let editData = document.getElementById('data' + keyName);
    editData.innerHTML = keyName + " (Updated!)";
    editData.className += " santa";
    backupSettings.style.background = "#3be357";
    exportBtn.style.background = "#3be357";
  }

  function removeKeyElement(keyName) {
    let removeItem = document.getElementById("data" + keyName);
    let removeItemIndex = findUIDItemInArr(keyName, loadedDataArr);
    loadedDataArr.splice(removeItemIndex, 1);
    removeItem.remove();
  }

  function exportBackup() {
    let today = new Date();
    let UTCmm = today.getUTCMinutes();
    let UTChh = today.getUTCHours();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yy = today.getFullYear();
    let backupDate = mm + "/" + dd + "/" + yy + " " + UTChh + ":" + UTCmm + " (UTC)";
    let simpleBackupDate = mm + "." + dd + "." + yy;
    let backupData = "GiftyBackupDataFile,\"BackupDate: " + backupDate + "\"\n";
    let updateBackupData;

    runningBackup = true;
    backupData = compileBackupData(backupData);

    let backupElement = document.createElement('a');
    backupElement.href = "data:text/csv;charset=utf-8," + encodeURI(backupData);
    backupElement.target = "_blank";

    backupElement.download = "GiftyBackup" + simpleBackupDate + "-" + generateRandomShortString() + ".csv";
    backupElement.click();

    firebase.database().ref("backup/").update({
      backupWhen: backupDate
    });

    if (changesInt > 0) {
      for (let i = 0; i < loadedDataArr.length; i++) {
        updateBackupData = document.getElementById("data" + loadedDataArr[i]);
        updateBackupData.innerHTML = loadedDataArr[i];
        updateBackupData.className = "gift";
      }
      backupSettings.style.background = "#ff8e8e";
      exportBtn.style.background = "#ff8e8e";
    }

    runningBackup = false;
  }

  function compileBackupData(inputData) {
    let outputData = inputData;
    generatedDataString = "";

    for (let i = 0; i < entireDBDataArr.length; i++) {
      outputData += "\nTOP,\"" + entireDBDataKeyArr[i] + "\"\n";

      if (typeof entireDBDataArr[i] == "object") {
        compileBackupObjectData(entireDBDataArr[i], true);
        outputData += generatedDataString;
        generatedDataString = "";
      }
    }

    return outputData;
  }

  function compileBackupObjectData(inputObj, reset) {
    let currentLayer;

    if (reset) {
      generateDataLayer = 1;
    } else {
      generateDataLayer++;
    }

    currentLayer = generateDataLayer;

    for (let name in inputObj) {
      if (typeof inputObj[name] == "object") {
        generatedDataString += currentLayer + ",\"" + name + "\"\n";
        compileBackupObjectData(inputObj[name]);
        generateDataLayer--;
      } else {
        generatedDataString += currentLayer + ",\"" + name + "\",\"" + inputObj[name] + "\"\n";
      }
    }
  }

  function generateRandomShortString() {
    let numSelect = "56789";
    let numSelector = Math.floor((Math.random() * numSelect.length));
    let strLenLim = numSelect.charAt(numSelector);
    let alphaNumSelect = "123456789ABCDEFGHIJKLMNPQRSTUVWXYZ";
    let randShortStr = "";
    let strSelector = 0;

    for (let i = 0; i < strLenLim; i++) {
      strSelector = Math.floor((Math.random() * alphaNumSelect.length));
      randShortStr += alphaNumSelect.charAt(strSelector);
    }

    return randShortStr;
  }

  function importBackup(importText) {
    let firstCol = [];
    let secondCol = [];
    let thirdCol = [];
    let importString = "";
    let importColumnState = 1;
    let lastPush = 0;
    let elementBool = false;

    //precheck for necessary prerequisites, including looking for:
    //basic element data that should be mandatory initialized by default (when ready... clear database and test)
    //this latter one being if you went directly from login to backup with one user

    if (importText.indexOf("TOP") && importText.indexOf("GiftyDataBackupFile")
      && importText.indexOf("BackupDate")) {//ADD MOAR
      for (let i = 0; i < importText.length; i++) {
        if (importText[i] == "\n") {
          if (lastPush == 2) {
            thirdCol.push(importString);
          }
          importColumnState = 1;
          importString = "";
        } else if (importText[i] == "," && !elementBool) {
          if (importString != "") {
            firstCol.push(importString);
            importColumnState = 2;
            importString = "";
          }
        } else if (importText[i] == "\"") {
          if (importString != "") {
            if (importColumnState == 2) {
              secondCol.push(importString);
            } else if (importColumnState == 3) {
              thirdCol.push(importString);
            }
            lastPush = importColumnState;
            importColumnState = 3;
            importString = "";
          }
          if (elementBool) {
            elementBool = false;
          } else {
            elementBool = true;
          }
        } else {
          importString += importText[i];
        }
      }

      //Correcting minor data collection error
      thirdCol.splice(0, 1);
      thirdCol.push("");

      if (firstCol.length == secondCol.length && secondCol.length == thirdCol.length) {
        processBackupData(firstCol, secondCol, thirdCol);
      } else {
        alert("File Import Error! This backup file is not in the correct format! \n\nError Code: 200");
      }
    } else {
      alert("File Import Error! This backup file is not in the correct format! \n\nError Code: 300");
    }
  }

  function processBackupData(colA, colB, colC) {
    let saveTopDataBool = false;
    let saveParentDataBool = false;
    let saveChildDataBool = false;
    let currentLevel = 0;
    let previousLevel = 0;
    let masterDBArr = [];
    let tempTopArr = [];
    let tempParentArr = [];
    let tempChildArr = [];
    let tempObj = {};
    let topStr = "";
    let parentStr = "";
    let childStr = "";
    let tempDataA;
    let tempDataB;

    console.log(colA);
    console.log(colB);
    console.log(colC);

    for (let i = 1; i < colA.length; i++) {
      if (colA[i] == "TOP") {
        currentLevel = 0;
      } else if (colA[i] == "1") {
        currentLevel = 1;
      } else if (colA[i] == "2") {
        currentLevel = 2;
      } else if (colA[i] == "3") {
        currentLevel = 3;
      }
      tempDataA = colB[i];
      tempDataB = colC[i];

      //need to consider moving up and down levels - such that the parent key is stored per each set of
      //objects.
      // top
      //  - object ***No objects at a higher level, save and continue
      //  - object ***No objects at a higher level, save and continue
      //  - object ***Object at a higher level found, collect more data
      //  -  -  object
      //  -  -  object
      //  - object ***No objects at a higher level, save and continue
      //  - object ***No objects at a higher level, save and continue

      if (previousLevel > currentLevel && currentLevel != 0) {
        if (saveParentDataBool) {
          saveTopDataBool = true;
          saveParentDataBool = true;
          console.log("Increased level, save top data!");
        } else if (saveChildDataBool) {
          saveParentDataBool = true;
          saveChildDataBool = false;
          console.log("Increased level, save parent data!");
        }
        console.log(colB[i] + " : " + colC[i]);
      } else if (currentLevel == 0 && colA[i] == "TOP") {
        if (i != 1) {//Initially nothing is stored, nothing is there to save
          console.log("Store into master array! " + i);
          console.log("");
          saveTopDataBool = true;
          saveParentDataBool = false;
        }
        console.log("Start collecting new object data for " + colB[i]);
        topStr = colB[i];
      } else if (previousLevel < currentLevel) {
        if (saveTopDataBool) {
          console.log("Add new parent object!");
          saveParentDataBool = true;
          saveTopDataBool = false;
        } else if (saveParentDataBool) {
          console.log("Add new child object!");
          saveChildDataBool = true;
          saveParentDataBool = false;
        }
        console.log(colB[i] + " : " + colC[i]);
      } else {
        console.log("Add new object!");
        console.log(colB[i] + " : " + colC[i]);
      }

      if (saveTopDataBool) {

      } else if (saveParentDataBool) {

      } else if (saveChildDataBool) {

      }

      //retain topKey when starting
      //retain parentKey when saving a new parent
      //save data as needed into tempParentArr
      //if child found, retain childKey
      //save child data as needed into tempChildArr
      //once finished, save tempChildArr into tempParentArr
      //May need a nested function to clear the previous array before merging?
      //once finished, save tempParentArr into tempTopArr
      //once finished, save tempTOPArr into masterDBArr

      previousLevel = currentLevel;
    }
    //If at end, save last object!
  }

  function pushBackupData(databaseArray) {
    console.log(databaseArray);
  }
};
