var familyElements = [inviteNote, settingsNote, dataListContainer, testData, createFamilyBtn, familyModal,
    closeFamilyModal, familyTitle, familyMemberCount, familyListContainer, testFamily, familyConnectionCount,
    publicListCount, privateListCount, familyEdit, familyRemove, familyAddModal, closeFamilyAddModal, familyNameInp,
    addFamily, cancelFamily, offlineModal, closeOffline, notificationModal, closeNotification, notificationTitle,
    notificationInfo];
var listeningFirebaseRefs = [];
var inviteArr = [];
var userArr = [];
var familyArr = [];

var moderationSet = 1;
var onlineInt = 0;
var familyCounter = 0;
var loadingTimerInt = 0;

var inviteNote;
var settingsNote;
var dataListContainer;
var testData;
var createFamilyBtn;
var familyModal;
var closeFamilyModal;
var familyTitle;
var familyMemberCount;
var familyListContainer;
var testFamily;
var familyConnectionCount;
var publicListCount;
var privateListCount;
var familyEdit;
var familyRemove;
var familyAddModal;
var closeFamilyAddModal;
var familyNameInp;
var addFamily;
var cancelFamily;
var offlineModal;
var closeOffline;
var notificationModal;
var closeNotification;
var notificationTitle;
var notificationInfo;

var userInitial;
var userInvites;
var familyInitial;



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
    familyMemberCount = document.getElementById('familyMemberCount');
    familyListContainer = document.getElementById('familyListContainer');
    testFamily = document.getElementById('testFamily');
    familyConnectionCount = document.getElementById('familyConnectionCount');
    publicListCount = document.getElementById('publicListCount');
    privateListCount = document.getElementById('privateListCount');
    familyEdit = document.getElementById('familyEdit');
    familyRemove = document.getElementById('familyRemove');
    familyAddModal = document.getElementById('familyAddModal');
    closeFamilyAddModal = document.getElementById('closeFamilyAddModal');
    familyNameInp = document.getElementById('familyNameInp');
    addFamily = document.getElementById('addFamily');
    cancelFamily = document.getElementById('cancelFamily');
    offlineModal = document.getElementById('offlineModal');
    closeOffline = document.getElementById('closeOffline');
    notificationModal = document.getElementById('notificationModal');
    closeNotification = document.getElementById('closeNotification');
    notificationTitle = document.getElementById('notificationTitle');
    notificationInfo = document.getElementById('notificationInfo');

    userInitial = firebase.database().ref("users/");
    userInvites = firebase.database().ref("users/" + user.uid + "/invites");
    familyInitial = firebase.database().ref("family/");
    verifyElementIntegrity(familyElements);
    getCurrentUser();
    commonInitialization();

    loadingTimer = setInterval(function(){
        loadingTimerInt = loadingTimerInt + 1000;
        if(loadingTimerInt >= 2000){
            if (testData == undefined){
                //console.log("TestGift Missing. Loading Properly.");
            } else {
                testData.innerHTML = "Loading... Please Wait...";
            }
            clearInterval(loadingTimer);
        }
    }, 1000);

    databaseQuery();

    familyModerateButton();

    addFamily.onclick = function() {
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
        var nowConfirm = 0;
        var alternator = 0;
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

        var fetchData = function (postRef) {
            postRef.on('child_added', function (data) {
                var i = findUIDItemInArr(data.key, userArr);
                if(userArr[i] != data.val() && i != -1)
                    userArr[i] = data.val();

                if(data.key == user.uid)
                    user = data.val();
            });

            postRef.on('child_changed', function (data) {
                var i = findUIDItemInArr(data.key, userArr);
                if(userArr[i] != data.val() && i != -1)
                    userArr[i] = data.val();

                if(data.key == user.uid)
                    user = data.val();
            });

            postRef.on('child_removed', function (data) {
                var i = findUIDItemInArr(data.key, userArr);
                if(userArr[i] != data.val() && i != -1)
                    userArr.splice(i, 1);
            });
        };

        var fetchInvites = function (postRef) {
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

        var fetchFamilies = function (postRef){
            postRef.on('child_added', function (data) {
                familyArr.push(data.val());

                createFamilyElement(data.val());
            });

            postRef.on('child_changed', function (data) {
                var i = findUIDItemInArr(data.key, familyArr);
                if(familyArr[i] != data.val() && i != -1) {
                    familyArr[i] = data.val();
                    changeFamilyElement(data.val());
                }
            });

            postRef.on('child_removed', function (data) {
                var i = findUIDItemInArr(data.key, familyArr);
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
        for(var i = 0; i < userArray.length; i++)
            if(userArray[i].uid == item)
                return i;
        return -1;
    }

    function createFamilyElement(familyData){
        try{
            testData.remove();
        } catch (err) {}

        var liItem = document.createElement("LI");
        liItem.id = "family" + familyData.uid;
        liItem.className = "gift";
        liItem.onclick = function (){
            //initializeModalData

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
        var textNode = document.createTextNode(familyData.name);
        liItem.appendChild(textNode);

        giftList.insertBefore(liItem, dataListContainer.childNodes[0]);
        clearInterval(offlineTimer);
        familyCounter++;
    }

    function changeFamilyElement(familyData) {
        var editGift = document.getElementById("family" + familyData.uid);
        editGift.innerHTML = familyData.name;
        editGift.className = "gift";
        editGift.onclick = function (){
            //initializeModalData

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

    function removeFamilyElement(uid) {
        document.getElementById("family" + uid).remove();

        familyCounter--;
        if (familyCounter == 0){
            deployUserListEmptyNotification();
        }
    }

    function addFamilyToDB(familyName){
        var newUid = firebase.database().ref("family").push();
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

function deployUserListEmptyNotification(){
    try{
        testData.innerHTML = "No Users Found!";
    } catch(err){
        console.log("Loading Element Missing, Creating A New One");
        var liItem = document.createElement("LI");
        liItem.id = "TestGift";
        liItem.className = "gift";
        var textNode = document.createTextNode("No Users Found!");
        liItem.appendChild(textNode);
        giftList.insertBefore(liItem, dataListContainer.childNodes[0]);
    }

    clearInterval(offlineTimer);
}
