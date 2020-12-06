var listeningFirebaseRefs = [];
var giftArr = [];
var inviteArr = [];
var userUserNames = [];
var instantiatedNodes = [];

var areYouStillThereBool = false;
var areYouStillThereInit = false;
var readNotificationsBool = false;
var updateGiftToDBBool = false;
var giftListEmptyBool = false;

var giftCounter = 0;
var onlineInt = 0;
var loadingTimerInt = 0;
var logoutReminder = 300;
var logoutLimit = 900;

var giftCreationDate;
var giftList;
var giftStorage;
var user;
var backBtn;
var offlineSpan;
var offlineModal;
var giftUser;
var userInvites;
var offlineTimer;
var loadingTimer;
var modal;
var noteModal;
var noteInfoField;
var noteTitleField;
var noteSpan;
var listNote;
var inviteNote;
var notificationBtn;
var userBase;
var userGifts;



function getCurrentUser(){
    try {
        moderationSet = sessionStorage.getItem("moderationSet");
        giftUser = JSON.parse(sessionStorage.validGiftUser);
        user = JSON.parse(sessionStorage.validUser);
        if(user.uid == giftUser.uid){
            console.log("HOW'D YOU GET HERE???");
            newNavigation(2);//Home
        }
        console.log("User: " + user.userName + " loaded in");
        console.log("Friend: " + giftUser.userName + " loaded in");
        if (giftUser.privateList == undefined) {
            deployGiftListEmptyNotification();
            giftListEmptyBool = true;
        } else if (giftUser.privateList.length == 0) {
            deployGiftListEmptyNotification();
            giftListEmptyBool = true;
        }
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
    } catch (err) {
        console.log(err.toString());
        window.location.href = "index.html";
    }
}

window.onload = function instantiate() {

    notificationBtn = document.getElementById('notificationButton');
    giftCreationDate = document.getElementById('giftCreationDate');
    giftList = document.getElementById('dataListContainer');
    offlineModal = document.getElementById('offlineModal');
    offlineSpan = document.getElementById('closeOffline');
    noteModal = document.getElementById('notificationModal');
    noteTitleField = document.getElementById('notificationTitle');
    noteInfoField = document.getElementById('notificationInfo');
    noteSpan = document.getElementById('closeNotification');
    inviteNote = document.getElementById('inviteNote');
    listNote = document.getElementById('listNote');
    backBtn = document.getElementById('addGift');
    modal = document.getElementById('giftModal');
    getCurrentUser();
    commonInitialization();

    for(var i = 0; i < userArr.length; i++){
        userUserNames.push(userArr[i].userName);
    }

    backBtn.innerHTML = "Add Private Gift";
    backBtn.onclick = function() {
        giftStorage = "";
        sessionStorage.setItem("privateList", JSON.stringify(giftUser));
        sessionStorage.setItem("validUser", JSON.stringify(giftUser));
        sessionStorage.setItem("validPrivateUser", JSON.stringify(user));
        sessionStorage.setItem("userArr", JSON.stringify(userArr));
        sessionStorage.setItem("giftStorage", JSON.stringify(giftStorage));
        window.location.href = "giftAddUpdate.html";
    };

    loadingTimer = setInterval(function(){
        loadingTimerInt = loadingTimerInt + 1000;
        if(loadingTimerInt >= 2000){
            var testGift = document.getElementById("TestGift");
            if (testGift == undefined){
                //console.log("TestGift Missing. Loading Properly.");
            } else if (!giftListEmptyBool) {
                testGift.innerHTML = "Loading... Please Wait...";
            }
            clearInterval(loadingTimer);
        }
    }, 1000);

    databaseQuery();

    privateFriendListButton();

    function privateFriendListButton(){
        var nowConfirm = 0;
        var alternator = 0;
        console.log("Friend List Button Feature Active");
        setInterval(function(){
            nowConfirm = nowConfirm + 1000;
            if(nowConfirm >= 3000){
                nowConfirm = 0;
                if(alternator == 0) {
                    alternator++;
                    document.getElementById("listNote").innerHTML = "Lists";
                    document.getElementById("listNote").style.background = "#00c606";
                } else {
                    alternator--;
                    document.getElementById("listNote").innerHTML = "Private";
                    document.getElementById("listNote").style.background = "#00ad05";
                }
            }
        }, 1000);
    }

    function databaseQuery() {

        userBase = firebase.database().ref("users/");
        userGifts = firebase.database().ref("users/" + giftUser.uid + "/privateList/");
        userInvites = firebase.database().ref("users/" + user.uid + "/invites");

        var fetchData = function (postRef) {
            postRef.on('child_added', function (data) {
                onlineInt = 1;

                var i = findUIDItemInArr(data.key, userArr);
                if(userArr[i] != data.val() && i != -1){
                    //console.log("Adding " + userArr[i].userName + " to most updated version: " + data.val().userName);
                    userArr[i] = data.val();
                }

                if(data.key == giftUser.uid){
                    giftUser = data.val();
                    console.log("User Updated: 1");
                }
            });

            postRef.on('child_changed', function (data) {
                var i = findUIDItemInArr(data.key, userArr);
                if(userArr[i] != data.val() && i != -1){
                    console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
                    userArr[i] = data.val();
                }

                if(data.key == giftUser.uid){
                    giftUser = data.val();
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

        var fetchGifts = function (postRef) {
            postRef.on('child_added', function (data) {
                giftArr.push(data.val());

                if(checkGiftBuyer(data.val().buyer)){
                    data.val().buyer = "";
                    updateGiftToDBBool = true;
                }

                createGiftElement(data.val().description, data.val().link, data.val().received, data.val().title,
                    data.key, data.val().where, data.val().uid, data.val().creationDate, data.val().buyer,
                    data.val().creator);
                instantiatedNodes.push(data.val());

                if(updateGiftToDBBool){
                    updateGiftError(data, data.key);
                    updateGiftToDBBool = false;
                }
            });

            postRef.on('child_changed', function(data) {
                //console.log("Changing " + data.val().uid);
                giftArr[data.key] = data.val();
                instantiatedNodes[data.key] = data.val();

                if(data.val().uid == currentModalOpen){//Moved currentModalOpen reference to common.js
                    closeModal(modal);
                }

                changeGiftElement(data.val().description, data.val().link, data.val().received, data.val().title,
                    data.key, data.val().where, data.val().uid, data.val().creationDate, data.val().buyer,
                    data.val().creator);
            });

            postRef.on('child_removed', function(data) {
                sessionStorage.setItem("validGiftUser", JSON.stringify(giftUser));
                sessionStorage.setItem("validUser", JSON.stringify(user));
                location.reload();
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

        fetchData(userBase);
        fetchGifts(userGifts);
        fetchInvites(userInvites);

        listeningFirebaseRefs.push(userBase);
        listeningFirebaseRefs.push(userGifts);
        listeningFirebaseRefs.push(userInvites);
    }

    function findUIDItemInArr(item, userArray){
        for(var i = 0; i < userArray.length; i++){
            if(userArray[i].uid == item){
                //console.log("Found item: " + item);
                return i;
            }
        }
        return -1;
    }

    function checkGiftBuyer(buyer){
        var updateGiftToDB = true;

        //console.log("Checking for buyer error...");

        if(buyer == "" || buyer == null || buyer == undefined || userUserNames.includes(buyer)){
            updateGiftToDB = false;
            //console.log("No buyer error");
        } else {
            console.log("Buyer error found!");
        }

        return updateGiftToDB;
    }

    function updateGiftError(giftData, giftKey){
        alert("A gift needs to be updated! Key: " + giftKey);
        firebase.database().ref("users/" + giftUser.uid + "/privateList/" + giftKey).update({
            buyer: ""
        });
    }

    function createGiftElement(giftDescription, giftLink, giftReceived, giftTitle, giftKey, giftWhere, giftUid, giftDate,
                               giftBuyer, giftCreator){
        try{
            document.getElementById("TestGift").remove();
        } catch (err) {}

        var liItem = document.createElement("LI");
        liItem.id = "gift" + giftUid;
        liItem.className = "gift";
        if(giftReceived == 1) {
            liItem.className += " checked";
            //console.log("Checked, created");
        }
        liItem.onclick = function (){
            var spanGift = document.getElementsByClassName("close")[0];
            var editBtn = document.getElementById('giftEdit');
            var deleteBtn = document.getElementById('giftDelete');
            var titleField = document.getElementById('giftTitle');
            var descField = document.getElementById('giftDescription');
            var creatorField = document.getElementById('giftCreator');
            var whereField = document.getElementById('giftWhere');
            var linkField = document.getElementById('giftLink');
            var boughtField = document.getElementById('giftBought');
            var buyField = document.getElementById('giftBuy');
            var dontBuyField = document.getElementById('giftDontBuy');

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
            if(giftReceived == 1){
                if(giftBuyer == null || giftBuyer == undefined){
                    boughtField.innerHTML = "This gift has been bought";
                } else {
                    if (giftBuyer == "")
                        boughtField.innerHTML = "This gift has been bought";
                    else
                        boughtField.innerHTML = "This gift was bought by " + giftBuyer;
                }
            } else {
                boughtField.innerHTML = "This gift has not been bought yet";
            }
            if(giftDescription != "") {
                descField.innerHTML = "Description: " + giftDescription;
            } else {
                descField.innerHTML = "There was no description provided";
            }
            if(giftCreator == null || giftCreator == undefined){
                creatorField.innerHTML = "Gift creator unavailable";
            } else {
                if (giftCreator == "")
                    creatorField.innerHTML = "Gift creator unavailable";
                else
                    creatorField.innerHTML = "Gift was created by " + giftCreator;
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
            editBtn.onclick = function(){
                updateMaintenanceLog("privateList", "Attempting to update gift:" + giftTitle + " " + giftKey + " " + user.userName);
                updateGiftElement(giftUid);
            };
            deleteBtn.onclick = function(){
                if (giftCreator == user.userName || giftCreator == null || giftCreator == undefined) {
                    updateMaintenanceLog("privateList", "Attempting to delete gift:" + giftTitle + " " + giftKey + " " + user.userName);
                    deleteGiftElement(giftKey, giftTitle, giftBuyer);
                } else {
                    if (giftCreator == ""){
                        updateMaintenanceLog("privateList", "Attempting to delete gift:" + giftTitle + " " + giftKey + " " + user.userName);
                        deleteGiftElement(giftKey, giftTitle, giftBuyer);
                    } else {
                        updateMaintenanceLog("privateList", "Attempting to delete gift:" + giftTitle + " " + giftKey + " " + user.userName);
                        alert("Only the creator, " + giftCreator + ", can delete this gift. Please contact them to delete this gift " +
                            "if it needs to be removed.");
                    }
                }
            };
            buyField.innerHTML = "Click on me to buy the gift!";
            buyField.onclick = function(){
                if (giftReceived == 0) {
                    firebase.database().ref("users/" + giftUser.uid + "/privateList/" + giftKey).update({
                        received: 1,
                        buyer: user.userName
                    });
                } else {
                    alert("This gift has already been marked as bought!");
                }
            };
            dontBuyField.innerHTML = "Click on me to un-buy the gift!";
            dontBuyField.onclick = function(){
                if (giftReceived == 1) {
                    if (giftBuyer == user.userName || giftBuyer == null || giftBuyer == undefined) {
                        firebase.database().ref("users/" + giftUser.uid + "/privateList/" + giftKey).update({
                            received: 0,
                            buyer: ""
                        });
                    } else {
                        if (giftBuyer == "") {
                            firebase.database().ref("users/" + giftUser.uid + "/privateList/" + giftKey).update({
                                received: 0,
                                buyer: ""
                            });
                        } else {
                            alert("Only the buyer, " + giftBuyer + ", can \"Un-Buy\" this gift. Please contact them to undo this action " +
                                "if this has been done in error.");
                        }
                    }
                } else {
                    alert("This gift has already been marked as \"Un-Bought\"!");
                }
            };

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
            };
        };
        var textNode = document.createTextNode(giftTitle);
        liItem.appendChild(textNode);

        giftList.insertBefore(liItem, document.getElementById("dataListContainer").childNodes[0]);
        clearInterval(offlineTimer);

        giftCounter++;
    }

    function changeGiftElement(description, link, received, title, key, where, uid, date, buyer, creator) {
        var editGift = document.getElementById("gift" + uid);
        editGift.innerHTML = title;
        editGift.className = "gift";
        if (received == 1) {
            editGift.className += " checked";
            //console.log("Checked, changed");
        }
        editGift.onclick = function () {
            var spanGift = document.getElementsByClassName("close")[0];
            var editBtn = document.getElementById('giftEdit');
            var deleteBtn = document.getElementById('giftDelete');
            var titleField = document.getElementById('giftTitle');
            var descField = document.getElementById('giftDescription');
            var creatorField = document.getElementById('giftCreator');
            var whereField = document.getElementById('giftWhere');
            var linkField = document.getElementById('giftLink');
            var boughtField = document.getElementById('giftBought');
            var buyField = document.getElementById('giftBuy');
            var dontBuyField = document.getElementById('giftDontBuy');

            if (link != "") {
                linkField.innerHTML = "Click me to go to the webpage!";
                linkField.onclick = function () {
                    var newGiftLink = "http://";
                    if (link.includes("https://")) {
                        link = link.slice(8, link.length);
                    } else if (link.includes("http://")) {
                        link = link.slice(7, link.length);
                    }
                    newGiftLink += link;
                    window.open(newGiftLink, "_blank");
                };
            } else {
                linkField.innerHTML = "There was no link provided";
                linkField.onclick = function () {
                };
            }
            if (received == 1) {
                if (buyer == null || buyer == undefined) {
                    boughtField.innerHTML = "This gift has been bought";
                } else {
                    if (buyer == "")
                        boughtField.innerHTML = "This gift has been bought";
                    else
                        boughtField.innerHTML = "This gift was bought by " + buyer;
                }
            } else {
                boughtField.innerHTML = "This gift has not been bought yet";
            }
            if (description != "") {
                descField.innerHTML = "Description: " + description;
            } else {
                descField.innerHTML = "There was no description provided";
            }
            if (creator == null || creator == undefined) {
                creatorField.innerHTML = "Gift creator unavailable";
            } else {
                if (creator == "")
                    creatorField.innerHTML = "Gift creator unavailable";
                else
                    creatorField.innerHTML = "Gift was created by " + creator;
            }
            titleField.innerHTML = title;
            if (where != "") {
                whereField.innerHTML = "This can be found at: " + where;
            } else {
                whereField.innerHTML = "There was no location provided";
            }
            if (date != undefined) {
                if (date != "") {
                    giftCreationDate.innerHTML = "Created on: " + date;
                } else {
                    giftCreationDate.innerHTML = "Creation date not available";
                }
            } else {
                giftCreationDate.innerHTML = "Creation date not available";
            }
            editBtn.onclick = function () {
                updateMaintenanceLog("privateList", "Attempting to update gift:" + title + " " + key + " " + user.userName);
                updateGiftElement(uid);
            };
            deleteBtn.onclick = function () {
                if (creator == user.userName || creator == null || creator == undefined) {
                    updateMaintenanceLog("privateList", "Attempting to delete gift:" + title + " " + key + " " + user.userName);
                    deleteGiftElement(key, title, buyer);
                } else {
                    if (creator == ""){
                        updateMaintenanceLog("privateList", "Attempting to delete gift:" + title + " " + key + " " + user.userName);
                        deleteGiftElement(key, title, buyer);
                    } else {
                        updateMaintenanceLog("privateList", "Attempting to delete gift:" + title + " " + key + " " + user.userName);
                        alert("Only the creator, " + creator + ", can delete this gift. Please contact them to delete this gift " +
                            "if it needs to be removed.");
                    }
                }
            };
            buyField.innerHTML = "Click on me to buy the gift!";
            buyField.onclick = function () {
                if (received == 0) {
                    firebase.database().ref("users/" + giftUser.uid + "/privateList/" + key).update({
                        received: 1,
                        buyer: user.userName
                    });
                } else {
                    alert("This gift has already been marked as bought!");
                }
            };
            dontBuyField.innerHTML = "Click on me to un-buy the gift!";
            dontBuyField.onclick = function () {
                if (received == 1) {
                    if (buyer == user.userName || buyer == null || buyer == undefined) {
                        firebase.database().ref("users/" + giftUser.uid + "/privateList/" + key).update({
                            received: 0,
                            buyer: ""
                        });
                    } else {
                        if (buyer == "") {
                            firebase.database().ref("users/" + giftUser.uid + "/privateList/" + key).update({
                                received: 0,
                                buyer: ""
                            });
                        } else {
                            alert("Only the buyer, " + buyer + ", can \"Un-Buy\" this gift. Please contact them to undo this action " +
                                "if this has been done in error.");
                        }
                    }
                } else {
                    alert("This gift has already been marked as \"Un-Bought\"!");
                }
            };

            //show modal
            openModal(modal, uid);

            //close on close
            spanGift.onclick = function () {
                closeModal(modal);
            };

            //close on click
            window.onclick = function (event) {
                if (event.target == modal) {
                    closeModal(modal);
                }
            };
        };
    }

    function removeGiftElement(uid) {
        document.getElementById("gift" + uid).remove();

        giftCounter--;
        if (giftCounter == 0){
            deployGiftListEmptyNotification();
        }
    }

    function updateGiftElement(uid) {
        giftStorage = uid;
        sessionStorage.setItem("privateList", JSON.stringify(giftUser));
        sessionStorage.setItem("validUser", JSON.stringify(giftUser));
        sessionStorage.setItem("validPrivateUser", JSON.stringify(user));
        sessionStorage.setItem("userArr", JSON.stringify(userArr));
        sessionStorage.setItem("giftStorage", JSON.stringify(giftStorage));
        window.location.href = "giftAddUpdate.html";
    }

    function deleteGiftElement(key, title, buyer) {
        var verifyDeleteBool = true;
        var toDelete = -1;

        for (var i = 0; i < giftArr.length; i++){
            if(title == giftArr[i].title) {
                toDelete = i;
                break;
            }
        }

        if(toDelete != -1) {
            alert("Attempting to delete " + giftArr[toDelete].title + "! If this is successful, the page will reload.");
            giftArr.splice(toDelete, 1);

            for (var i = 0; i < giftArr.length; i++) {
                if (title == giftArr[i].title) {
                    verifyDeleteBool = false;
                    break;
                }
            }
        } else {
            verifyDeleteBool = false;
        }

        if(verifyDeleteBool){
            firebase.database().ref("users/" + giftUser.uid).update({
                privateList: giftArr
            });

            if(buyer != ""){
                var userFound = findUserNameItemInArr(buyer, userArr);
                if(userFound != -1){
                    if(userArr[userFound].uid != user.uid) {
                        addNotificationToDB(userArr[userFound], user.name, title);
                    }
                } else {
                    console.log("User not found");
                }
            } else {
                console.log("No buyer, no notification needed");
            }
        } else {
            alert("Delete failed, please try again later!");
        }
    }

    function findUserNameItemInArr(item, userArray){
        for(var i = 0; i < userArray.length; i++){
            if(userArray[i].userName == item){
                console.log("Found item: " + item);
                return i;
            }
        }
        return -1;
    }

    function addNotificationToDB(buyerUserData, giftDeleter, giftTitle){
        var pageName = "deleteGiftPrivate";
        var giftOwner = giftUser.uid;
        var notificationString = generateNotificationString(giftOwner, giftDeleter, giftTitle, pageName);
        var buyerUserNotifications;
        if(buyerUserData.notifications == undefined || buyerUserData.notifications == null){
            buyerUserNotifications = [];
        } else {
            buyerUserNotifications = buyerUserData.notifications;
        }
        buyerUserNotifications.push(notificationString);

        if(buyerUserData.notifications != undefined) {
            firebase.database().ref("users/" + buyerUserData.uid).update({
                notifications: buyerUserNotifications
            });
        } else {
            console.log("New Notifications List");
            firebase.database().ref("users/" + buyerUserData.uid).update({notifications:{0:notificationString}});
        }
        console.log("Added Notification To DB");
    }

    function generateNotificationString(giftOwner, giftDeleter, giftTitle, pageName){
        console.log("Generating Notification");
        return (giftOwner + "," + giftDeleter + "," + giftTitle + "," + pageName);
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

function deployGiftListEmptyNotification(){
    try{
        document.getElementById("TestGift").innerHTML = "No Gifts Found! Add Some Gifts With The Button Below!";
    } catch(err){
        console.log("Loading Element Missing, Creating A New One");
        var liItem = document.createElement("LI");
        liItem.id = "TestGift";
        liItem.className = "gift";
        var textNode = document.createTextNode("No Gifts Found! Add Some Gifts With The Button Below!");
        liItem.appendChild(textNode);
        giftList.insertBefore(liItem, document.getElementById("dataListContainer").childNodes[0]);
    }

    clearInterval(offlineTimer);
}
