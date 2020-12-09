var listeningFirebaseRefs = [];
var userNameArr = [];
var userKeyArr = [];
var userData = [];
var userArr = [];

var userNameBool = true;

var pinClearedInt = 0;

var offlineSpan;
var offlineModal;
var confirmSpan;
var confirmModal;
var deleteConfirm;
var deleteDeny;
var nameField;
var userNameField;
var pinField;
var pinconfField;
var btnUpdate;
var btnDelete;
var userInitial;
var user;
var noteModal;
var noteInfoField;
var noteTitleField;
var noteSpan;



function getCurrentUser(){
    try {
        user = JSON.parse(sessionStorage.validUser);
    } catch (err) {
        console.log("Welcome new user!");
    }
    if(user == null){//newUser
        btnUpdate.innerHTML = "Create User Profile";
        alert("Alert! Make sure that you use pins that you have never used before! The pins will be stored securely," +
            "but in the case of an unforseen attack, this will be additional protection for your personal accounts.");
    } else {//returningUser
        btnUpdate.innerHTML = "Loading...";
        btnDelete.style.display = "block";
        btnDelete.style.position = "fixed";
        btnDelete.style.left = "50%";
        btnDelete.style.transform = "translate(-50%)";
        btnDelete.innerHTML = "Loading...";
        userArr = JSON.parse(sessionStorage.userArr);

        alert("Please note that you will be required to input your confirmation pin to continue. If you would like to " +
            "cancel, please click the back button on the browser.");
    }
}

//Instantiates all data upon loading the webpage
window.onload = function instantiate() {

    nameField = document.getElementById('name');
    userNameField = document.getElementById('username');
    pinField = document.getElementById('pin');
    pinconfField = document.getElementById('pinconf');
    btnUpdate = document.getElementById('updateUser');
    btnDelete = document.getElementById('deleteUser');
    offlineModal = document.getElementById('offlineModal');
    offlineSpan = document.getElementById('closeOffline');
    confirmModal = document.getElementById('confirmModal');
    confirmSpan = document.getElementsByClassName('closeConfirm');
    deleteConfirm = document.getElementById('deleteConfirm');
    deleteDeny = document.getElementById('deleteDeny');
    noteModal = document.getElementById('notificationModal');
    noteTitleField = document.getElementById('notificationTitle');
    noteInfoField = document.getElementById('notificationInfo');
    noteSpan = document.getElementById('closeNotification');
    getCurrentUser();
    commonInitialization();

    pinField.onclick = function() {
        if(pinClearedInt == 0) {
            pinField.value = "";
            pinconfField.value = "";
            pinClearedInt++;
        }
    };

    databaseQuery();

    function databaseQuery() {

        userInitial = firebase.database().ref("users/");

        var fetchData = function (postRef) {
            postRef.on('child_added', function (data) {
                userData.push(data.val());
                userNameArr.push(data.val().userName);
                userKeyArr.push(data.key);

                if(user != null) {
                    if (data.key == user.uid) {
                        user = data.val();
                        nameField.value = user.name;
                        userNameField.value = user.userName;
                        pinField.value = user.pin;
                        pinconfField.placeholder = "Please Confirm Pin To Continue";
                        btnUpdate.innerHTML = "Update User Profile";
                        btnDelete.innerHTML = "Delete User Profile";
                        console.log("User Updated: 1");
                    }
                }
            });

            postRef.on('child_changed', function (data) {
                var i = findUIDItemInArr(data.key, userArr);
                if(userArr[i] != data.val() && i != -1){
                    console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
                    userArr[i] = data.val();

                    userNameArr[i] = data.val().userName;
                }

                if(user != null) {
                    if (data.key == user.uid) {
                        user = data.val();
                        console.log("User Updated: 2");
                    }
                }
            });

            postRef.on('child_removed', function (data) {
                var i = findUIDItemInArr(data.key, userArr);
                userArr.splice(i, 1);
                userNameArr.splice(i, 1);
            });
        };

        fetchData(userInitial);

        listeningFirebaseRefs.push(userInitial);
    }

    function findUIDItemInArr(item, userArray){
        for(var i = 0; i < userArray.length; i++){
            if(userArray[i].uid == item){
                console.log("Found item: " + item);
                return i;
            }
        }
        return -1;
    }
};

function updateMaintenanceLog(locationData, detailsData) {
    var today = new Date();
    var UTChh = today.getUTCHours();
    var UTCmm = today.getUTCMinutes();
    var UTCss = today.getUTCSeconds();
    var dd = today.getUTCDate();
    var mm = today.getMonth()+1;
    var yy = today.getFullYear();
    var timeData = mm + "/" + dd + "/" + yy + " " + UTChh + ":" + UTCmm + ":" + UTCss;
    var newUid = firebase.database().ref("maintenance").push();
    newUid = newUid.toString();
    newUid = newUid.substr(51, 70);

    firebase.database().ref("maintenance/" + newUid).set({
        uid: newUid,
        location: locationData,
        details: detailsData,
        time: timeData
    });
}

function deleteCheck(){
    updateMaintenanceLog("userAddUpdate", "Attempting to delete user: " + user.userName);

    console.log(user.uid + " will be deleted. Are you sure?");
    openModal(confirmModal, "confirmModal");

    deleteConfirm.onclick = function () {
        console.log("Confirmed to delete user " + user.uid);
        firebase.database().ref("users/").child(user.uid).remove();
        closeModal(confirmModal);

        btnDelete.innerHTML = "Please Wait...";
        btnUpdate.onclick = function(){};//forces the update button to do nothing
        btnDelete.onclick = function(){};//forces the delete button to do nothing
        window.location.href = "index.html";
    };

    deleteDeny.onclick = function () {
        console.log("Denied to delete user " + user.uid);
        closeModal(confirmModal);
    };

    //close on close
    confirmSpan.onclick = function () {
        console.log("Closed window, user " + user.uid + " not deleted");
        closeModal(confirmModal);
    };

    //close on click
    window.onclick = function (event) {
        if (event.target == confirmModal) {
            console.log("Clicked outside window, user " + user.uid + " not deleted");
            closeModal(confirmModal);
        }
    }
}

function updateUserToDB(){

    checkUserNames(userNameField.value);

    if (nameField.value === "" || userNameField.value === "" || pinField.value === "" || pinconfField.value === ""){
        alert("It looks like you left some fields blank. Make sure you have your full name, username, a pin, and " +
            "a confirmed pin below.");
    } else if (pinconfField.value !== pinField.value){
        alert("It looks like the pins you entered are not the same");
    } else if (!isNaN(pinField.value) == false) {
        alert("It looks like the pins you entered are not numeric, please make sure that they are numbers only");
    } else if (userNameBool == false && user == null){
        alert("It looks like the User Name you chose is already taken, please choose another.");
        userNameBool = true;
    } else {
        var newPin = parseInt(pinField.value);
        injectUserArr(userArr);
        var encodeKey = encode(pinField.value);
        firebase.database().ref("users/" + user.uid).update({
            name: nameField.value,
            pin: newPin,
            encodeStr: encodeKey,
            userName: userNameField.value,
            ban: user.ban,
            firstLogin: user.firstLogin,
            moderatorInt: user.moderatorInt,
            organize: user.organize,
            strike: user.strike,
            theme: user.theme,
            uid: user.uid,
            warn: user.warn,
        });
        if(user.giftList != undefined) {
            firebase.database().ref("users/" + user.uid).update({
                giftList: user.giftList
            });
        }
        if(user.support != undefined) {
            firebase.database().ref("users/" + user.uid).update({
                support: user.support
            });
        }
        if(user.invites != undefined) {
            firebase.database().ref("users/" + user.uid).update({
                invites: user.invites
            });
        }
        if(user.friends != undefined) {
            firebase.database().ref("users/" + user.uid).update({
                friends: user.friends
            });
        }
        if(user.shareCode != undefined) {
            firebase.database().ref("users/" + user.uid).update({
                shareCode: user.shareCode
            });
        }
        if(user.notifications != undefined) {
            firebase.database().ref("users/" + user.uid).update({
                notifications: user.notifications
            });
        }
        if (user.readNotifications != undefined) {
            firebase.database().ref("users/" + user.uid).update({
                readNotifications: user.readNotifications
            });
        }
        if (user.secretSanta != undefined) {
            firebase.database().ref("users/" + user.uid).update({
                secretSanta: user.secretSanta
            });
        }
        if (user.secretSantaName != undefined) {
            firebase.database().ref("users/" + user.uid).update({
                secretSantaName: user.secretSantaName
            });
        }

        btnUpdate.innerHTML = "Please Wait...";
        btnUpdate.onclick = function(){};//forces the update button to do nothing
        btnDelete.onclick = function(){};//forces the delete button to do nothing
        sessionStorage.setItem("validUser", JSON.stringify(user));
        sessionStorage.setItem("userArr", JSON.stringify(userArr));
        window.location.href = "settings.html";
    }

}

function addUserToDB(){

    checkUserNames(userNameField.value);

    if (nameField.value === "" || userNameField.value === "" || pinField.value === "" || pinconfField.value === ""){
        alert("It looks like you left some fields blank. Make sure you have your full name, username, a pin, and " +
            "a confirmed pin below.");
    } else if (pinconfField.value !== pinField.value){
        alert("It looks like the pins you entered are not the same");
    } else if (!isNaN(pinField.value) == false) {
        alert("It looks like the pins you entered are not numeric, please make sure that they are numbers only");
    } else if (userNameBool == false){
        alert("It looks like the User Name you chose is already taken, please choose another.");
        userNameBool = true;
    } else {
        var newUid = firebase.database().ref("users").push();
        var newPin = parseInt(pinField.value);
        injectUserArr(userArr);
        var encodeKey = encode(pinField.value);
        var shareCodeNew = genShareCode();
        console.log(shareCodeNew);
        newUid = newUid.toString();
        newUid = newUid.substr(45, 64);
        firebase.database().ref("users/" + newUid).set({
            name: nameField.value,
            pin: newPin,
            encodeStr: encodeKey,
            userName: userNameField.value,
            ban: 0,
            firstLogin: 0,
            moderatorInt: 0,
            organize: 0,
            strike: 0,
            theme: 0,
            uid: newUid,
            warn: 0,
            shareCode: shareCodeNew,
            secretSanta: 0,
            secretSantaName: ""
        });

        btnUpdate.innerHTML = "Please Wait...";
        btnUpdate.onclick = function(){};//forces the update button to do nothing
        btnDelete.onclick = function(){};//forces the delete button to do nothing
        window.location.href = "index.html";
    }
}

function genShareCode(){
    var tempShareCode = "";
    for(var i = 1; i < 17; i++){
        tempShareCode = tempShareCode + getRandomAlphabet();
        if((i % 4) == 0 && i < 16){
            tempShareCode = tempShareCode + "-";
        }
    }
    return tempShareCode;
}

function getRandomAlphabet(){
    var alphabet = "123456789ABCDEFGHIJKLMNPQRSTUVWXYZ";
    var selector = Math.floor((Math.random() * alphabet.length));
    var charSelect = alphabet.charAt(selector);
    return charSelect;
}

function checkUserNames(userName){
    for(var i = 0; i < userNameArr.length; i++){
        if(userName == userNameArr[i]){
            userNameBool = false;
        }
    }
}

function updateSuppressCheck(){
    if(user != null){
        updateUserToDB();
    } else {
        addUserToDB();
    }
}
