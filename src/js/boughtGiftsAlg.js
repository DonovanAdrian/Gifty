var listeningFirebaseRefs = [];
var inviteArr = [];
var userUserNames = [];
var userBoughtGiftsArr = [];
var userBoughtGiftsUsersArr = [];
var initializedGiftsArr = [];

var areYouStillThereBool = false;
var areYouStillThereInit = false;
var readNotificationsBool = false;

var onlineInt = 0;
var giftCounter = 0;
var loadingTimerInt = 0;
var logoutReminder = 300;
var logoutLimit = 900;
var moderationSet = -1;

var giftCreationDate;
var giftList;
var backBtn;
var offlineSpan;
var offlineModal;
var user;
var modal;
var noteModal;
var noteInfoField;
var noteTitleField;
var noteSpan;
var notificationBtn;
var inviteNote;
var offlineTimer;
var loadingTimer;
var userInitial;
var userInvites;



function getCurrentUser(){
    try {
        user = JSON.parse(sessionStorage.validUser);
        console.log("User: " + user.userName + " logged in");
        if (user.invites == undefined) {
            console.log("Invites Not Found");
        } else if (user.invites != undefined) {
            if (user.invites.length > 0) {
                inviteNote.style.background = "#ff3923";
            }
        }

        if (user.readNotifications == undefined) {
            console.log("Read Notifications Not Found");
        } else {
            readNotificationsBool = true;
        }

        if (user.readNotifications == undefined) {
            console.log("Read Notifications Not Found");
        } else {
            readNotificationsBool = true;
        }

        if (user.notifications == undefined) {
            console.log("Notifications Not Found");
        } else if (user.notifications != undefined) {
            if (readNotificationsBool){
                if (user.notifications.length > 0 && user.readNotifications.length != user.notifications.length) {
                    notificationBtn.src = "img/bellNotificationOn.png";
                    notificationBtn.onclick = function() {
                        navigation(4);
                    }
                } else {
                    notificationBtn.src = "img/bellNotificationOff.png";
                    notificationBtn.onclick = function() {
                        navigation(4);
                    }
                }
            } else if (user.notifications.length > 0) {
                notificationBtn.src = "img/bellNotificationOn.png";
                notificationBtn.onclick = function() {
                    navigation(4);
                }
            }
        }
        userArr = JSON.parse(sessionStorage.userArr);
        userBoughtGiftsArr = JSON.parse(sessionStorage.boughtGifts);
        userBoughtGiftsUsersArr = JSON.parse(sessionStorage.boughtGiftsUsers);
    } catch (err) {
        console.log(err.toString());
        window.location.href = "index.html";
    }
}

window.onload = function instantiate() {

    notificationBtn = document.getElementById('notificationButton');
    giftCreationDate = document.getElementById('giftCreationDate');
    giftList = document.getElementById('giftListContainer');
    offlineModal = document.getElementById('offlineModal');
    offlineSpan = document.getElementById('closeOffline');
    noteSpan = document.getElementById('closeNotification');
    backBtn = document.getElementById('backBtn');
    inviteNote = document.getElementById('inviteNote');
    noteModal = document.getElementById('notificationModal');
    noteTitleField = document.getElementById('notificationTitle');
    noteInfoField = document.getElementById('notificationInfo');
    noteSpan = document.getElementById('closeNotification');
    modal = document.getElementById('giftModal');
    getCurrentUser();

    for(var i = 0; i < userArr.length; i++){
        userUserNames.push(userArr[i].userName);
    }

    const config = JSON.parse(sessionStorage.config);

    firebase.initializeApp(config);
    firebase.analytics();

    firebase.auth().signInAnonymously().catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
    });

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
        } else {
            // User is signed out.
        }
    });

    window.addEventListener("online", function(){
        closeModal(offlineModal);
        location.reload();
    });

    window.addEventListener("offline", function() {
        var now = 0;
        offlineTimer = setInterval(function(){
            now = now + 1000;
            if(now >= 5000){
                try{
                    document.getElementById("TestGift").innerHTML = "Loading Failed, Please Connect To Internet";
                } catch(err){
                    if(giftCounter == 0) {
                        console.log("Loading Element Missing, Creating A New One");
                        var liItem = document.createElement("LI");
                        liItem.id = "TestGift";
                        liItem.className = "gift";
                        var textNode = document.createTextNode("Loading Failed, Please Connect To Internet");
                        liItem.appendChild(textNode);
                        giftList.insertBefore(liItem, document.getElementById("giftListContainer").childNodes[0]);
                    }
                }
                openModal(offlineModal, "offlineModal");
                clearInterval(offlineTimer);
            }
        }, 1000);
    });

    //close offlineModal on close
    offlineSpan.onclick = function() {
        closeModal(offlineModal);
    };

    //close offlineModal on click
    window.onclick = function(event) {
        if (event.target == offlineModal) {
            closeModal(offlineModal);
        }
    };

    //initialize back button
    backBtn.innerHTML = "Back To Home";
    backBtn.onclick = function() {
        navigation(0);
    };

    loadingTimer = setInterval(function(){
        loadingTimerInt = loadingTimerInt + 1000;
        if(loadingTimerInt >= 2000){
            var testGift = document.getElementById("TestGift");
            if (testGift == undefined){
                //console.log("TestGift Missing. Loading Properly.");
            } else {
                testGift.innerHTML = "Loading... Please Wait...";
            }
            clearInterval(loadingTimer);
        }
    }, 1000);

    initializeGifts();

    databaseQuery();

    loginTimer();

    homeButton();

    function initializeGifts(){

        if(userBoughtGiftsArr.length == userBoughtGiftsUsersArr.length) {
            for (var i = 0; i < userBoughtGiftsArr.length; i++) {
                createGiftElement(userBoughtGiftsArr[i], userBoughtGiftsUsersArr[i]);
            }
        } else {
            alert("There has been a critical error, redirecting back home...");
            navigation(0);
        }
    }

    function loginTimer(){
        var loginNum = 0;
        console.log("Login Timer Started");
        setInterval(function(){ //900 15 mins, 600 10 mins
            document.onmousemove = resetTimer;
            document.onkeypress = resetTimer;
            document.onload = resetTimer;
            document.onmousemove = resetTimer;
            document.onmousedown = resetTimer; // touchscreen presses
            document.ontouchstart = resetTimer;
            document.onclick = resetTimer;     // touchpad clicks
            document.onscroll = resetTimer;    // scrolling with arrow keys
            document.onkeypress = resetTimer;
            loginNum = loginNum + 1;
            if (loginNum >= logoutLimit){//default 900
                console.log("User Timed Out");
                signOut();
            } else if (loginNum > logoutReminder){//default 600
                //console.log("User Inactive");
                areYouStillThereNote(loginNum);
                areYouStillThereBool = true;
            }
            function resetTimer() {
                if (areYouStillThereBool) {
                    //console.log("User Active");
                    ohThereYouAre();
                }
                loginNum = 0;
            }
        }, 1000);
    }

    function areYouStillThereNote(timeElapsed){
        var timeRemaining = logoutLimit - timeElapsed;
        var timeMins = Math.floor(timeRemaining/60);
        var timeSecs = timeRemaining%60;

        if (timeSecs < 10) {
            timeSecs = ("0" + timeSecs).slice(-2);
        }

        if(!areYouStillThereInit) {
            closeModal(modal);
            openModal(noteModal, "noteModal");
            areYouStillThereInit = true;
        }
        noteInfoField.innerHTML = "You have been inactive for 5 minutes, you will be logged out in " + timeMins
            + ":" + timeSecs + "!";
        noteTitleField.innerHTML = "Are You Still There?";

        //close on close
        noteSpan.onclick = function() {
            closeModal(noteModal);
            areYouStillThereBool = false;
            areYouStillThereInit = false;
        };
    }

    function ohThereYouAre(){
        noteInfoField.innerHTML = "Welcome back, " + user.name;
        noteTitleField.innerHTML = "Oh, There You Are!";

        var nowJ = 0;
        var j = setInterval(function(){
            nowJ = nowJ + 1000;
            if(nowJ >= 3000){
                closeModal(noteModal);
                areYouStillThereBool = false;
                areYouStillThereInit = false;
                clearInterval(j);
            }
        }, 1000);

        //close on click
        window.onclick = function(event) {
            if (event.target == noteModal) {
                closeModal(noteModal);
                areYouStillThereBool = false;
                areYouStillThereInit = false;
            }
        };
    }

    function homeButton(){
        var nowConfirm = 0;
        var alternator = 0;
        console.log("Home Button Feature Active");
        setInterval(function(){
            nowConfirm = nowConfirm + 1000;
            if(nowConfirm >= 3000){
                nowConfirm = 0;
                if(alternator == 0) {
                    alternator++;
                    document.getElementById("homeNote").innerHTML = "Home";
                    document.getElementById("homeNote").style.background = "#00c606";
                } else {
                    alternator--;
                    document.getElementById("homeNote").innerHTML = "Bought";
                    document.getElementById("homeNote").style.background = "#00ad05";
                }
            }
        }, 1000);
    }

    function databaseQuery() {

        userInitial = firebase.database().ref("users/");
        userInvites = firebase.database().ref("users/" + user.uid + "/invites");

        var fetchData = function (postRef) {
            postRef.on('child_added', function (data) {
                onlineInt = 1;

                var i = findUIDItemInArr(data.key, userArr);
                if(userArr[i] != data.val() && i != -1){
                    checkGiftLists(data.val());
                    userArr[i] = data.val();
                }

                if(data.key == user.uid){
                    user = data.val();
                    console.log("User Updated: 1");
                }
            });

            postRef.on('child_changed', function (data) {
                var i = findUIDItemInArr(data.key, userArr);
                if(userArr[i] != data.val() && i != -1){
                    checkGiftLists(data.val());

                    console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
                    userArr[i] = data.val();
                }

                if(data.key == user.uid){
                    user = data.val();
                    console.log("User Updated: 2");
                }
            });

            postRef.on('child_removed', function (data) {
                var i = findUIDItemInArr(data.key, userArr);
                if(userArr[i] != data.val() && i != -1){
                    console.log("Removing " + userArr[i].userName + " / " + data.val().userName);
                    userArr.splice(i, 1);
                }
            });
        };

        var fetchInvites = function (postRef) {
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

        fetchData(userInitial);
        fetchInvites(userInvites);

        listeningFirebaseRefs.push(userInitial);
        listeningFirebaseRefs.push(userInvites);
    }

    function checkGiftLists(updatedUserData){
        var newGiftList = updatedUserData.giftList;
        var newPrivateGiftList = updatedUserData.privateList;

        if(newGiftList == undefined){}
        else if(newGiftList != undefined) {
            for (var i = 0; i < userBoughtGiftsArr.length; i++) {
                var a = findUIDItemInArr(userBoughtGiftsArr[i].uid, newGiftList);
                if (a != -1) {
                    checkGiftData(userBoughtGiftsArr[i], newGiftList[a], updatedUserData.name);
                }
            }
        }

        if(newPrivateGiftList == undefined){}
        else if(newPrivateGiftList.length != undefined) {
            for (var i = 0; i < userBoughtGiftsArr.length; i++) {
                var a = findUIDItemInArr(userBoughtGiftsArr[i], newPrivateGiftList);
                if (a != -1) {
                    checkGiftData(userBoughtGiftsArr[i], newPrivateGiftList[a], updatedUserData.name);
                }
            }
        }
    }

    function checkGiftData(currentGiftData, newGiftData, giftOwner){
        var updateGiftBool = false;
        if(currentGiftData.description != newGiftData.description) {
            updateGiftBool = true;
        }
        if(currentGiftData.link != newGiftData.link) {
            updateGiftBool = true;
        }
        if(currentGiftData.title != newGiftData.title) {
            updateGiftBool = true;
        }
        if(currentGiftData.where != newGiftData.where) {
            updateGiftBool = true;
        }

        if(updateGiftBool) {
            if (newGiftData.uid == currentModalOpen){//Moved currentModalOpen reference to common.js
                closeModal(modal);
            }
            changeGiftElement(newGiftData, giftOwner);
        }
    }

    function findUIDItemInArr(item, itemArray){
        for(var i = 0; i < itemArray.length; i++){
            if(itemArray[i].uid == item){
                return i;
            }
        }
        return -1;
    }

    function createGiftElement(giftData, giftOwner){
        var giftDescription = giftData.description;
        var giftLink = giftData.link;
        var giftTitle = giftData.title + " - for " + giftOwner;
        var giftWhere = giftData.where;
        var giftUid = giftData.uid;
        var giftDate = giftData.creationDate;

        try{
            document.getElementById("TestGift").remove();
        } catch (err) {}

        var liItem = document.createElement("LI");
        liItem.id = "gift" + giftUid;
        liItem.className = "gift";
        liItem.onclick = function (){
            var spanGift = document.getElementsByClassName("close")[0];
            var descField = document.getElementById('giftDescription');
            var titleField = document.getElementById('giftTitle');
            var whereField = document.getElementById('giftWhere');
            var linkField = document.getElementById('giftLink');

            if (giftLink != ""){
                linkField.innerHTML = "Click me to go to the webpage!";
                linkField.onclick = function() {
                    var newGiftLink = "http://";
                    if(giftLink.includes("https://")){
                        giftLink = giftLink.slice(8, giftLink.length);
                    } else if (giftLink.includes("http://")){
                        giftLink = giftLink.slice(7, giftLink.length);
                    }
                    newGiftLink += giftLink;
                    window.open(newGiftLink, "_blank");
                };
            } else {
                linkField.innerHTML = "There was no link provided";
                linkField.onclick = function() {
                };
            }
            if(giftDescription != "") {
                descField.innerHTML = "Description: " + giftDescription;
            } else {
                descField.innerHTML = "There was no description provided";
            }
            titleField.innerHTML = giftTitle;
            if(giftWhere != "") {
                whereField.innerHTML = "This can be found at: " + giftWhere;
            } else {
                whereField.innerHTML = "There was no location provided";
            }
            if(giftDate != undefined) {
                if (giftDate != "") {
                    giftCreationDate.innerHTML = "Created on: " + giftDate;
                } else {
                    giftCreationDate.innerHTML = "Creation date not available";
                }
            } else {
                giftCreationDate.innerHTML = "Creation date not available";
            }

            //show modal
            openModal(modal, giftUid);

            //close on close
            spanGift.onclick = function() {
                closeModal(modal);
            };

            //close on click
            window.onclick = function(event) {
                if (event.target == modal) {
                    closeModal(modal);
                }
            }
        };
        var textNode = document.createTextNode(giftTitle);
        liItem.appendChild(textNode);

        giftList.insertBefore(liItem, document.getElementById("giftListContainer").childNodes[0]);
        initializedGiftsArr.push(giftUid);
        clearInterval(offlineTimer);
    }



    function changeGiftElement(giftData, giftOwner){
        var description = giftData.description;
        var link = giftData.link;
        var title = giftData.title + " - for " + giftOwner;
        var where = giftData.where;
        var uid = giftData.uid;
        var date = giftData.creationDate;

        console.log("Updating " + uid);
        var editGift = document.getElementById("gift" + uid);
        editGift.innerHTML = title;
        editGift.className = "gift";
        editGift.onclick = function (){
            var spanGift = document.getElementsByClassName("close")[0];
            var descField = document.getElementById('giftDescription');
            var titleField = document.getElementById('giftTitle');
            var whereField = document.getElementById('giftWhere');
            var linkField = document.getElementById('giftLink');

            if (link != ""){
                linkField.innerHTML = "Click me to go to the webpage!";
                linkField.onclick = function() {
                    var newGiftLink = "http://";
                    if(link.includes("https://")){
                        link = link.slice(8, link.length);
                    } else if (link.includes("http://")){
                        link = link.slice(7, link.length);
                    }
                    newGiftLink += link;
                    window.open(newGiftLink, "_blank");
                };
            } else {
                linkField.innerHTML = "There was no link provided";
                linkField.onclick = function() {
                };
            }
            if(description != "") {
                descField.innerHTML = "Description: " + description;
            } else {
                descField.innerHTML = "There was no description provided";
            }
            titleField.innerHTML = title;
            if(where != "") {
                whereField.innerHTML = "This can be found at: " + where;
            } else {
                whereField.innerHTML = "There was no location provided";
            }
            if(date != undefined) {
                if (date != "") {
                    giftCreationDate.innerHTML = "Created on: " + date;
                } else {
                    giftCreationDate.innerHTML = "Creation date not available";
                }
            } else {
                giftCreationDate.innerHTML = "Creation date not available";
            }

            //show modal
            openModal(modal, uid);

            //close on close
            spanGift.onclick = function() {
                closeModal(modal);
            };

            //close on click
            window.onclick = function(event) {
                if (event.target == modal) {
                    closeModal(modal);
                }
            };
        };
    }
};

function signOut(){
    sessionStorage.clear();
    window.location.href = "index.html";
}

function navigation(nav){
    sessionStorage.setItem("validUser", JSON.stringify(user));
    sessionStorage.setItem("userArr", JSON.stringify(userArr));
    switch(nav){
        case 0:
            window.location.href = "home.html";
            break;
        case 1:
            window.location.href = "lists.html";
            break;
        case 2:
            window.location.href = "invites.html";
            break;
        case 3:
            window.location.href = "settings.html";
            break;
        case 4:
            window.location.href = "notifications.html";
            break;
        default:
            break;
    }
}
