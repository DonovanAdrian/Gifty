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
let enablePhoneBackups = true;

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

  function generateBackupModal(){
    backupSettings.onclick = function(){
      let fileHandle;
      let fileSuffix;

      if (!mobileDeviceCheck() || enablePhoneBackups) {
        lastBackup.innerHTML = "Last Backup: " + lastBackupWhen;

        exportBtn.onclick = function () {
          exportBackup();
        }
        exportBtn.innerHTML = "Export Backup";

        importBtn.addEventListener('click', async () => {
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
          } catch (err) {
          }
        });
        importBtn.innerHTML = "Import Backup";
        exportBtn.className = "basicBtn";
        importBtn.className = "basicBtn";
      } else {
        lastBackup.innerHTML = "Last Backup: " + lastBackupWhen +
          "<br /><br /> Mobile Device Detected!<br /><br /> " +
          "Mobile Devices Are Not Allowed To Export Or Import Backups.";

        exportBtn.className += " btnDisabled";
        exportBtn.innerHTML = "Export Backup Disabled";
        importBtn.className += " btnDisabled";
        importBtn.innerHTML = "Import Backup Disabled";
      }

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
        console.log(data.key);
        console.log(data.val());
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
    } else if (dataCounter == 1) {
      generateBackupModal();
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

  function mobileDeviceCheck() {
    const userAgentType = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgentType)) {
      return true;
    }
    else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgentType)) {
      return true;
    }
    return false;
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

    if (preCheckImport(importText)) {
      for (let i = 0; i < importText.length; i++) {
        if (importText[i] == "\n") {
          if (lastPush == 2) {
            thirdCol.push(importString);
          }
          importColumnState = 1;
          importString = "";
        } else if (importText[i] == "," && !elementBool) {
          if (importString != "") {
            if (importString == "TOP") {
              firstCol.push("0");
            } else {
              firstCol.push(importString);
            }
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

      firstCol.splice(0, 1);
      secondCol.splice(0, 1);
      thirdCol.splice(0, 1);
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

  function preCheckImport(importText) {
    let textCheckCounter = 0;
    let importThreshhold = 6;
    let keywordCheckArr = ["TOP", "GiftyDataBackupFile", "BackupDate", "login", "allowLogin", "users", "moderatorInt"];

    for (let i = 0; i < keywordCheckArr.length; i++) {
      if (importText.includes(keywordCheckArr[i])) {
        textCheckCounter++;
        if (textCheckCounter >= importThreshhold) {
          return true;
        }
      }
    }

    return false;
  }



  function processBackupData(colA, colB, colC) {
    let initialFromInt = 0;
    let initialToInt = 0;
    let handOffObj = {};
    let collectionArr = [];
    let parentStringArr = [];

    //console.log(colA);
    console.log(colB);
    //console.log(colC);

    for (let i = 0; i <= 44; i++) {//goals are 44, 155, then colA.length
      if (colA[i] == 0 && i != 0) {
        initialToInt = i - 1;
        fetchDataInRange(initialFromInt, initialToInt, colB[initialFromInt], 0);
        //Check Collection Arr Or HandOff Obj
        parentStringArr = [];
        collectionArr = [];
        initialFromInt = i;
      }
    }
    //initialToInt = colA.length;
    //fetchDataInRange(initialFromInt, initialToInt, colB[initialFromInt]);

    function fetchDataInRange(fromInt, toInt, parent, level) {
      let increaseLevelBool = false;
      let nextFromInt = fromInt + 1;
      let nextLevel = level + 1;
      let nextToInt = toInt;
      let lookAhead = 0;
      let tempObj = {};
      let tempArr = [];
      let levelArr = [];
      let parentObj = {};
      let prefix = "";

      if (!Number.isInteger(parseInt(parent))) {
        parentStringArr.push(parent);
      }
      for (let i = 0; i < level; i++) {
        prefix = " > " + prefix;
      }

      console.log("");
      console.log(parent + ":" + level);

      for (let i = fromInt; i <= toInt; i++) {
        lookAhead = i + 1;

        if (colA[lookAhead] > level && !increaseLevelBool) {
          increaseLevelBool = true;
          nextFromInt = lookAhead;
        }
        if (colA[lookAhead] <= level && increaseLevelBool) {
          nextToInt = i;
          fetchDataInRange(nextFromInt, nextToInt, colB[nextFromInt], nextLevel);
          nextFromInt = lookAhead;
          increaseLevelBool = false;
        }

        if (colA[i] == level) {
          console.log(prefix + i);
          if (Number.isInteger(parseInt(colB[i]))) {
            tempArr.push(colC[i]);
          } else {
            if (colA[lookAhead] > level && colC[i] == "") {
              //console.log("This is a parent object");
            } else {
              tempObj[colB[i]] = colC[i];
              console.log(tempObj);
              //levelArr.push(tempObj); May not be necessary
            }
          }
        }
      }

      if (Object.keys(handOffObj).length !== 0 && parentStringArr.length > 0) {
        parentObj = {};
        parentObj[parentStringArr[parentStringArr.length-1]] = handOffObj;
        handOffObj = parentObj;

        parentStringArr.splice(parentStringArr.length-1, 1);
        console.log(parentObj);
      } else if (tempArr.length > 0 && parentStringArr.length > 0) {
        tempObj[parentStringArr[parentStringArr.length-1]] = tempArr;

        parentStringArr.splice(parentStringArr.length-1, 1);

        levelArr.push(tempObj);
        console.log(levelArr); //May not need to push to levelArr if object is ready... Assign to handoffObj?
      } else if (levelArr.length > 1 && parentStringArr.length > 0) {
        console.log("Saving Object Collection To Parent...");
        console.log(levelArr);
        tempObj = {};

        for (let i = 0; i < levelArr.length; i++) {
          parentObj[Object.keys(levelArr[i])] = levelArr[i][Object.keys(levelArr[i])];
        }
        console.log(parentObj);
        tempObj = parentObj;
        parentObj = {};
        parentObj[parentStringArr[parentStringArr.length-1]] = tempObj;
        console.log(parentObj);
        handOffObj = parentObj;
        console.log(handOffObj);

        parentStringArr.splice(parentStringArr.length-1, 1);
      }
    }
  }

  function pushBackupData(databaseArray) {
    console.log(databaseArray);//Use "update"
  }
}
