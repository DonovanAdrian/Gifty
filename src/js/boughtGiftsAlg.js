var boughtGiftElements = [];
var listeningFirebaseRefs = [];
var inviteArr = [];
var userUserNames = [];
var userBoughtGiftsArr = [];
var userBoughtGiftsUsersArr = [];
var initializedGiftsArr = [];

var readNotificationsBool = false;

var onlineInt = 0;
var giftCounter = 0;
var moderationSet = -1;
var loadingTimerInt = 0;

var dataListContainer;
var backBtn;
var offlineSpan;
var offlineModal;
var user;
var giftTitleFld;
var giftLinkFld;
var giftWhereFld;
var giftDescriptionFld;
var giftCreationDateFld;
var giftModal;
var notificationModal;
var notificationInfo;
var notificationTitle;
var noteSpan;
var notificationBtn;
var inviteNote;
var homeNote;
var offlineTimer;
var loadingTimer;
var testGift;
var userInitial;
var userInvites;



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
                        newNavigation(6);//Notifications
                    }
                } else {
                    notificationBtn.src = "img/bellNotificationOff.png";
                    notificationBtn.onclick = function() {
                        newNavigation(6);//Notifications
                    }
                }
            } else if (user.notifications.length > 0) {
                notificationBtn.src = "img/bellNotificationOn.png";
                notificationBtn.onclick = function() {
                    newNavigation(6);//Notifications
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

    notificationBtn = document.getElementById('notificationBtn');
    dataListContainer = document.getElementById('dataListContainer');
    offlineModal = document.getElementById('offlineModal');
    offlineSpan = document.getElementById('closeOffline');
    backBtn = document.getElementById('backBtn');
    inviteNote = document.getElementById('inviteNote');
    homeNote = document.getElementById('homeNote');
    notificationModal = document.getElementById('notificationModal');
    notificationTitle = document.getElementById('notificationTitle');
    notificationInfo = document.getElementById('notificationInfo');
    noteSpan = document.getElementById('closeNotification');
    giftTitleFld = document.getElementById('giftTitleFld');
    giftLinkFld = document.getElementById('giftLinkFld');
    giftWhereFld = document.getElementById('giftWhereFld');
    giftDescriptionFld = document.getElementById('giftDescriptionFld');
    giftCreationDateFld = document.getElementById('giftCreationDateFld');
    giftModal = document.getElementById('giftModal');
    testGift = document.getElementById('testGift');
    boughtGiftElements = [notificationBtn, dataListContainer, offlineModal, offlineSpan, backBtn, inviteNote, homeNote,
        notificationModal, notificationTitle, notificationInfo, noteSpan, giftTitleFld, giftLinkFld, giftWhereFld,
        giftDescriptionFld, giftCreationDateFld, giftModal, testGift];
    verifyElementIntegrity(boughtGiftElements);
    getCurrentUser();
    commonInitialization();

    for(var i = 0; i < userArr.length; i++){
        userUserNames.push(userArr[i].userName);
    }

    //initialize back button
    backBtn.innerHTML = "Back To Home";
    backBtn.onclick = function() {
        newNavigation(2);//Home
    };

    loadingTimer = setInterval(function(){
        loadingTimerInt = loadingTimerInt + 1000;
        if(loadingTimerInt >= 2000){
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

    homeButton();

    function initializeGifts(){

        if(userBoughtGiftsArr.length == userBoughtGiftsUsersArr.length) {
            for (var i = 0; i < userBoughtGiftsArr.length; i++) {
                createGiftElement(userBoughtGiftsArr[i], userBoughtGiftsUsersArr[i]);
            }
        } else {
            alert("There has been a critical error, redirecting back home...");
            newNavigation(2);//Home
        }
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
                    homeNote.innerHTML = "Home";
                    homeNote.style.background = "#00c606";
                } else {
                    alternator--;
                    homeNote.innerHTML = "Bought";
                    homeNote.style.background = "#00ad05";
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
                closeModal(giftModal);
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
            testGift.remove();
        } catch (err) {}

        var liItem = document.createElement("LI");
        liItem.id = "gift" + giftUid;
        liItem.className = "gift";
        liItem.onclick = function (){
            var spanGift = document.getElementsByClassName("close")[0];

            if (giftLink != ""){
                giftLinkFld.innerHTML = "Click me to go to the webpage!";
                giftLinkFld.onclick = function() {
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
                giftLinkFld.innerHTML = "There was no link provided";
                giftLinkFld.onclick = function() {
                };
            }
            if(giftDescription != "") {
                giftDescriptionFld.innerHTML = "Description: " + giftDescription;
            } else {
                giftDescriptionFld.innerHTML = "There was no description provided";
            }
            giftTitleFld.innerHTML = giftTitle;
            if(giftWhere != "") {
                giftWhereFld.innerHTML = "This can be found at: " + giftWhere;
            } else {
                giftWhereFld.innerHTML = "There was no location provided";
            }
            if(giftDate != undefined) {
                if (giftDate != "") {
                    giftCreationDateFld.innerHTML = "Created on: " + giftDate;
                } else {
                    giftCreationDateFld.innerHTML = "Creation date not available";
                }
            } else {
                giftCreationDateFld.innerHTML = "Creation date not available";
            }

            //show modal
            openModal(giftModal, giftUid);

            //close on close
            spanGift.onclick = function() {
                closeModal(giftModal);
            };

            //close on click
            window.onclick = function(event) {
                if (event.target == giftModal) {
                    closeModal(giftModal);
                }
            }
        };
        var textNode = document.createTextNode(giftTitle);
        liItem.appendChild(textNode);

        dataListContainer.insertBefore(liItem, document.getElementById("dataListContainer").childNodes[0]);
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

            if (link != ""){
                giftLinkFld.innerHTML = "Click me to go to the webpage!";
                giftLinkFld.onclick = function() {
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
                giftLinkFld.innerHTML = "There was no link provided";
                giftLinkFld.onclick = function() {
                };
            }
            if(description != "") {
                giftDescriptionFld.innerHTML = "Description: " + description;
            } else {
                giftDescriptionFld.innerHTML = "There was no description provided";
            }
            giftTitleFld.innerHTML = title;
            if(where != "") {
                giftWhereFld.innerHTML = "This can be found at: " + where;
            } else {
                giftWhereFld.innerHTML = "There was no location provided";
            }
            if(date != undefined) {
                if (date != "") {
                    giftCreationDateFld.innerHTML = "Created on: " + date;
                } else {
                    giftCreationDateFld.innerHTML = "Creation date not available";
                }
            } else {
                giftCreationDateFld.innerHTML = "Creation date not available";
            }

            //show modal
            openModal(giftModal, uid);

            //close on close
            spanGift.onclick = function() {
                closeModal(giftModal);
            };

            //close on click
            window.onclick = function(event) {
                if (event.target == giftModal) {
                    closeModal(giftModal);
                }
            };
        };
    }
};
