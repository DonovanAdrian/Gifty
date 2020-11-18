var userArr = [];
var inviteArr = [];
var notificationArr = [];
var readNotificationArr = [];
var listeningFirebaseRefs = [];

var areYouStillThereBool = false;
var notificationListEmptyBool = false;

var notificationCount = 0;
var onlineInt = 0;
var loadingTimerInt = 0;
var logoutReminder = 300;
var logoutLimit = 900;

var notificationList;
var offlineSpan;
var offlineModal;
var user;
var userReadNotifications;
var userNotifications;
var userInvites;
var modal;
var inviteNote;
var loadingTimer;
var offlineTimer;
var noteModal;
var addGlobalMsgModal;
var noteInfoField;
var noteTitleField;
var noteSpan;

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

        //console.log(user.notifications);
        if(user.notifications == undefined) {
            console.log("Notifications Not Found");
            deployNotificationListEmptyNotification();
            notificationListEmptyBool = true;
        } else {
            var notificationOverride = sessionStorage.getItem("notificationOverride");
            if (notificationOverride == undefined) {
                console.log("Notifications Found");
            } else {
                if (notificationOverride == "notificationArrEmpty") {
                    console.log("Notifications Empty");
                    deployNotificationListEmptyNotification();
                    notificationListEmptyBool = true;
                } else {
                    console.log("Notifications Found");
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

    notificationList = document.getElementById("notificationListContainer");
    offlineModal = document.getElementById('offlineModal');
    offlineSpan = document.getElementById("closeOffline");
    inviteNote = document.getElementById('inviteNote');
    noteModal = document.getElementById('notificationModal');
    noteTitleField = document.getElementById('notificationTitle');
    noteInfoField = document.getElementById('notificationInfo');
    noteSpan = document.getElementById('closeNotification');
    addGlobalMsgModal = document.getElementById('userModal');
    modal = document.getElementById('myModal');
    getCurrentUser();

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
        offlineModal.style.display = "none";
        location.reload();
    });

    window.addEventListener("offline", function() {
        var now = 0;
        offlineTimer = setInterval(function(){
            now = now + 1000;
            if(now >= 5000){
                try{
                    if (onlineInt == 0) {
                        document.getElementById("TestGift").innerHTML = "Loading Failed, Please Connect To Internet";
                    } else {
                        document.getElementById("TestGift").innerHTML = "No Notifications Found!";
                    }
                } catch(err){
                    if(notificationCount == 0) {
                        console.log("Loading Element Missing, Creating A New One");
                        var liItem = document.createElement("LI");
                        liItem.id = "TestGift";
                        liItem.className = "gift";
                        if (onlineInt == 0) {
                            var textNode = document.createTextNode("Loading Failed, Please Connect To Internet");
                        } else {
                            var textNode = document.createTextNode("No Notifications Found!");
                        }
                        liItem.appendChild(textNode);
                        notificationList.insertBefore(liItem, document.getElementById("notificationListContainer").childNodes[0]);
                    }
                }
                offlineModal.style.display = "block";
                clearInterval(offlineTimer);
            }
        }, 1000);
    });

    //close offlineModal on close
    offlineSpan.onclick = function() {
        offlineModal.style.display = "none";
    };

    //close offlineModal on click
    window.onclick = function(event) {
        if (event.target == offlineModal) {
            offlineModal.style.display = "none";
        }
    };

    loadingTimer = setInterval(function(){
        loadingTimerInt = loadingTimerInt + 1000;
        if(loadingTimerInt >= 2000){
            var testGift = document.getElementById("TestGift");
            if (testGift == undefined){
                //console.log("TestGift Missing. Loading Properly.");
            } else if (testGift.innerHTML == "No Notifications Found!"){
                //console.log("No Notifications Found");
            } else if (!notificationListEmptyBool) {
                testGift.innerHTML = "Loading... Please Wait...";
            }
            clearInterval(loadingTimer);
        }
    }, 1000);

    databaseQuery();

    loginTimer(); //if action, then reset timer

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

        try {
            modal.style.display = "none";
        } catch (err) {
            //console.log("Basic Modal Not Open");
        }
        noteInfoField.innerHTML = "You have been inactive for 5 minutes, you will be logged out in " + timeMins
            + ":" + timeSecs + "!";
        noteTitleField.innerHTML = "Are You Still There?";
        noteModal.style.display = "block";

        //close on close
        noteSpan.onclick = function() {
            noteModal.style.display = "none";
            areYouStillThereBool = false;
        };
    }

    function ohThereYouAre(){
        noteInfoField.innerHTML = "Welcome back, " + user.name;
        noteTitleField.innerHTML = "Oh, There You Are!";

        var nowJ = 0;
        var j = setInterval(function(){
            nowJ = nowJ + 1000;
            if(nowJ >= 3000){
                noteModal.style.display = "none";
                areYouStillThereBool = false;
                clearInterval(j);
            }
        }, 1000);

        //close on click
        window.onclick = function(event) {
            if (event.target == noteModal) {
                noteModal.style.display = "none";
                areYouStillThereBool = false;
            }
        };
    }

    function databaseQuery() {

        userReadNotifications = firebase.database().ref("users/" + user.uid + "/readNotifications");
        userNotifications = firebase.database().ref("users/" + user.uid + "/notifications");
        userInvites = firebase.database().ref("users/" + user.uid + "/invites");

        var fetchReadNotifications = function (postRef){
            postRef.on('child_added', function (data) {
                if(!readNotificationArr.includes(data.val())) {
                    readNotificationArr.push(data.val());
                }
                if (notificationArr.includes(data.val())){
                    var liItemUpdate = document.getElementById("notification" + notificationArr.indexOf(data.val()));
                    liItemUpdate.className += " checked";
                }
            });

            postRef.on('child_changed', function (data) {
                readNotificationArr[data.key] = data.val();
            });

            postRef.on('child_removed', function (data) {
                sessionStorage.setItem("validUser", JSON.stringify(user));
                location.reload();
            });
        };

        var fetchNotifications = function (postRef) {
            postRef.on('child_added', function (data) {
                notificationArr.push(data.val());
                createNotificationElement(data.val(), data.key);
            });

            postRef.on('child_changed', function (data) {
                notificationArr[data.key] = data.val();
                changeNotificationElement(data.val(), data.key);
            });

            postRef.on('child_removed', function (data) {
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
                inviteArr[data.key] = data.val();
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

        fetchReadNotifications(userReadNotifications);
        fetchNotifications(userNotifications);
        fetchInvites(userInvites);

        listeningFirebaseRefs.push(userReadNotifications);
        listeningFirebaseRefs.push(userNotifications);
        listeningFirebaseRefs.push(userInvites);
    }

    function createNotificationElement(notificationString, notificationKey){
        try{
            document.getElementById("TestGift").remove();
        } catch (err) {}

        var friendUserData;
        var notificationTitle;
        var notificationDetails;
        var notificationPage;
        var notificationSplit = notificationString.split(",");

        if(notificationString.includes("@#$:")) {
            var privateMessage = notificationString.split("@#$:");
            var messageSender = privateMessage[0];

            friendUserData = findFriendUserData(messageSender);
            notificationTitle = "New Message From " + friendUserData.name;
            notificationDetails = privateMessage[1];
            notificationPage = "privateMessage";
        } else {
            if (notificationSplit.length == 1) {
                notificationTitle = "New Message From An Administrator!";
                notificationDetails = notificationSplit[0];
                notificationPage = "globalNotification";
            } else if (notificationSplit.length == 2) {
                var invitedName = notificationSplit[0];
                var pageName = notificationSplit[1];
                //console.log(invitedName + " " + pageName);

                notificationTitle = "You received an invite!";
                notificationDetails = invitedName + " has sent you an invite!";
                notificationPage = pageName;
            } else if (notificationSplit.length == 3) {
                var giftOwner = notificationSplit[0];
                var giftTitle = notificationSplit[1];
                var pageName = notificationSplit[2];
                //console.log(giftOwner + " " + giftTitle + " " + pageName);

                friendUserData = findFriendUserData(giftOwner);
                notificationPage = pageName;

                if (pageName == "friendList.html") {
                    if (friendUserData != -1)
                        notificationTitle = friendUserData.name + " updated a gift you bought!";
                    else
                        notificationTitle = "A gift you bought was updated!";
                    notificationDetails = "The gift, " + giftTitle + ", was updated!";
                } else if (pageName == "privateFriendList.html") {
                    if (friendUserData != -1)
                        notificationTitle = friendUserData.name + "\'s private gift that you bought was updated!";
                    else
                        notificationTitle = "A private gift that you bought was updated!";
                    notificationDetails = "The gift, " + giftTitle + ", was updated!";
                } else if (pageName == "deleteGift") {
                    if (friendUserData != -1)
                        notificationTitle = friendUserData.name + " deleted a gift you bought!";
                    else
                        notificationTitle = "A gift you bought was deleted!";
                    notificationDetails = "The gift, " + giftTitle + ", was deleted...";
                } else {
                    console.log("Notification Page Error, 1");
                }
            } else if (notificationSplit.length == 4) {
                var giftOwner = notificationSplit[0];
                var giftDeleter = notificationSplit[1];
                var giftTitle = notificationSplit[2];
                var pageName = notificationSplit[3];

                friendUserData = findFriendUserData(giftOwner);

                notificationPage = pageName;

                if (friendUserData != -1)
                    notificationTitle = friendUserData.name + "\'s private gift that you bought was deleted!";
                else
                    notificationTitle = giftDeleter + " deleted a gift that you bought!";
                notificationDetails = "The gift, " + giftTitle + ", was deleted by " + giftDeleter + "...";
            } else {
                console.log("Unknown Notification String Received...");
            }
        }

        var liItem = document.createElement("LI");
        liItem.id = "notification" + notificationKey;
        liItem.className = "gift";
        if(readNotificationArr.includes(notificationString)) {
            liItem.className += " checked";
            //console.log("Checked, created");
        }
        liItem.onclick = function (){
            var span = document.getElementsByClassName("close")[0];
            var notificationTitleField = document.getElementById('userNotificationTitle');
            var notificationDetailsField = document.getElementById('notificationDetails');
            var notificationPageField = document.getElementById('notificationPage');
            var notificationDelete = document.getElementById('notificationDelete');

            notificationTitleField.innerHTML = notificationTitle;
            notificationDetailsField.innerHTML = notificationDetails;

            if (notificationPage == "privateMessage") {
                notificationPageField.innerHTML = "To reply to this message, click here!";
                notificationPageField.onclick = function(){
                    generatePrivateMessageDialog(friendUserData);
                };
            } else if (notificationPage == "globalNotification"){
                notificationPageField.innerHTML = "As always, if you need any other information, send me a support email that can" +
                    " be found in the Help/FAQ under settings! Thank you!";
                notificationPageField.onclick = function(){};
            } else if (notificationPage == "invites.html"){
                notificationPageField.innerHTML = "Click here to access your invites!";
                notificationPageField.onclick = function(){
                    navigation(4);
                };
            } else if (notificationPage == "friendList.html" && friendUserData != -1) {
                notificationPageField.innerHTML = "Click here to access their friend list!";
                notificationPageField.onclick = function(){
                    sessionStorage.setItem("validGiftUser", JSON.stringify(friendUserData));//Friend's User Data
                    navigation(5);
                };
            } else if (notificationPage == "privateFriendList.html" && friendUserData != -1) {
                notificationPageField.innerHTML = "Click here to access their private friend list!";
                notificationPageField.onclick = function(){
                    sessionStorage.setItem("validGiftUser", JSON.stringify(friendUserData));//Friend's User Data
                    navigation(6);
                };
            } else if (notificationPage == "deleteGift") {
                notificationPageField.innerHTML = "If this has been done in error, please contact the gift owner.";
                notificationPageField.onclick = function(){};
            } else if (notificationPage == "deleteGiftPrivate") {
                notificationPageField.innerHTML = "If this has been done in error, please contact the person who deleted " +
                    "the gift.";
                notificationPageField.onclick = function(){};
            } else {
                console.log("Notification Page Error, 2");
                notificationPageField.innerHTML = "There was an error loading this link, contact an administrator.";
                notificationPageField.onclick = function(){};
            }

            notificationDelete.onclick = function(){
                deleteNotification(notificationKey);
                modal.style.display = "none";
            };

            //show modal
            modal.style.display = "block";

            //close on close
            span.onclick = function() {
                modal.style.display = "none";
            };

            //close on click
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            };

            if (!readNotificationArr.includes(notificationString)) {
                readNotificationArr.push(notificationString);

                user.readNotifications = readNotificationArr;
                updateReadNotificationToDB();
            }
        };
        var textNode = document.createTextNode(notificationTitle);
        liItem.appendChild(textNode);

        notificationList.insertBefore(liItem, document.getElementById("notificationListContainer").childNodes[0]);

        notificationCount++;
    }

    function changeNotificationElement(notificationString, notificationKey){
        try{
            document.getElementById("TestGift").remove();
        } catch (err) {}

        var friendUserData;
        var notificationTitle;
        var notificationDetails;
        var notificationPage;
        var notificationSplit = notificationString.split(",");

        if(notificationString.includes("@#$:")) {
            var privateMessage = notificationString.split("@#$:");
            var messageSender = privateMessage[0];

            friendUserData = findFriendUserData(messageSender);
            notificationTitle = "New Message From " + friendUserData.name;
            notificationDetails = privateMessage[1];
            notificationPage = "privateMessage";
        } else {
            if (notificationSplit.length == 1) {
                notificationTitle = "New Message From An Administrator!";
                notificationDetails = notificationSplit[0];
                notificationPage = "globalNotification";
            } else if (notificationSplit.length == 2) {
                var invitedName = notificationSplit[0];
                var pageName = notificationSplit[1];
                console.log(invitedName + " " + pageName);

                notificationTitle = "You received an invite!";
                notificationDetails = invitedName + " has sent you an invite!";
                notificationPage = pageName;
            } else if (notificationSplit.length == 3) {
                var giftOwner = notificationSplit[0];
                var giftTitle = notificationSplit[1];
                var pageName = notificationSplit[2];
                console.log(giftOwner + " " + giftTitle + " " + pageName);

                friendUserData = findFriendUserData(giftOwner);
                notificationPage = pageName;

                if (pageName == "friendList.html") {
                    if (friendUserData != -1)
                        notificationTitle = friendUserData.name + " updated a gift you bought!";
                    else
                        notificationTitle = "A gift you bought was updated!";
                    notificationDetails = "The gift, " + giftTitle + ", was updated!";
                } else if (pageName == "privateFriendList.html") {
                    if (friendUserData != -1)
                        notificationTitle = friendUserData.name + "\'s private gift that you bought was updated!";
                    else
                        notificationTitle = "A private gift that you bought was updated!";
                    notificationDetails = "The gift, " + giftTitle + ", was updated!";
                } else if (pageName == "deleteGift") {
                    if (friendUserData != -1)
                        notificationTitle = friendUserData.name + " deleted a gift you bought!";
                    else
                        notificationTitle = "A gift you bought was deleted!";
                    notificationDetails = "The gift, " + giftTitle + ", was deleted...";
                } else {
                    console.log("Notification Page Error, 1");
                }
            } else if (notificationSplit.length == 4) {
                var giftOwner = notificationSplit[0];
                var giftDeleter = notificationSplit[1];
                var giftTitle = notificationSplit[2];
                var pageName = notificationSplit[3];

                friendUserData = findFriendUserData(giftOwner);

                notificationPage = pageName;

                if (friendUserData != -1)
                    notificationTitle = friendUserData.name + "\'s private gift that you bought was deleted!";
                else
                    notificationTitle = giftDeleter + " deleted a gift that you bought!";
                notificationDetails = "The gift, " + giftTitle + ", was deleted by " + giftDeleter + "...";
            } else {
                console.log("Unknown Notification String Received...");
            }
        }

        var liItemUpdate = document.getElementById("notification" + notificationKey);
        if (liItemUpdate == undefined) {
            liItemUpdate.innerHTML = notificationTitle;
            liItemUpdate.className = "gift";
            if(readNotificationArr.includes(notificationString)) {
                liItemUpdate.className += " checked";
                //console.log("Checked, created");
            }
            liItemUpdate.onclick = function () {
                var span = document.getElementsByClassName("close")[0];
                var notificationTitleField = document.getElementById('userNotificationTitle');
                var notificationDetailsField = document.getElementById('notificationDetails');
                var notificationPageField = document.getElementById('notificationPage');
                var notificationDelete = document.getElementById('notificationDelete');

                notificationTitleField.innerHTML = notificationTitle;
                notificationDetailsField.innerHTML = notificationDetails;

                if (notificationPage == "privateMessage" && friendUserData != -1) {
                    notificationPageField.innerHTML = "To reply to this message, click here!";
                    notificationPageField.onclick = function(){
                        generatePrivateMessageDialog(friendUserData);
                    };
                } else if (notificationPage == "globalNotification"){
                    notificationPageField.innerHTML = "As always, if you need any other information, send me a support email that can" +
                        " be found in the Help/FAQ under settings! Thank you!";
                    notificationPageField.onclick = function(){};
                } else if (notificationPage == "invites.html") {
                    notificationPageField.innerHTML = "Click here to access your invites!";
                    notificationPageField.onclick = function () {
                        navigation(4);
                    };
                } else if (notificationPage == "friendList.html" && friendUserData != -1) {
                    notificationPageField.innerHTML = "Click here to access their friend list!";
                    notificationPageField.onclick = function () {
                        sessionStorage.setItem("validGiftUser", JSON.stringify(friendUserData));//Friend's User Data
                        navigation(5);
                    };
                } else if (notificationPage == "privateFriendList.html" && friendUserData != -1) {
                    notificationPageField.innerHTML = "Click here to access their private friend list!";
                    notificationPageField.onclick = function () {
                        sessionStorage.setItem("validGiftUser", JSON.stringify(friendUserData));//Friend's User Data
                        navigation(6);
                    };
                } else if (notificationPage == "deleteGift") {
                    notificationPageField.innerHTML = "If this has been done in error, please contact the gift owner.";
                    notificationPageField.onclick = function () {
                    };
                } else if (notificationPage == "deleteGiftPrivate") {
                    notificationPageField.innerHTML = "If this has been done in error, please contact the person who deleted " +
                        "the gift.";
                    notificationPageField.onclick = function () {
                    };
                } else {
                    console.log("Notification Page Error, 2");
                    notificationPageField.innerHTML = "There was an error loading this link, contact an administrator.";
                    notificationPageField.onclick = function () {
                    };
                }

                notificationDelete.onclick = function () {
                    deleteNotification(notificationKey);
                    modal.style.display = "none";
                };

                //show modal
                modal.style.display = "block";

                //close on close
                span.onclick = function () {
                    modal.style.display = "none";
                };

                //close on click
                window.onclick = function (event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                };

                if (!readNotificationArr.includes(notificationString)) {
                    readNotificationArr.push(notificationString);

                    user.readNotifications = readNotificationArr;
                    updateReadNotificationToDB();
                }
            };
        }
    }

    function generatePrivateMessageDialog(userData) {
        var sendNote = document.getElementById('sendNote');
        var cancelNote = document.getElementById('cancelNote');
        var privateNoteInp = document.getElementById('privateNoteInp');
        var spanNote = document.getElementById('privateNoteSpan');
        var globalNoteTitle = document.getElementById('privateNoteTitle');
        var message = "";

        globalNoteTitle.innerHTML = "Send A Private Message Below";
        privateNoteInp.placeholder = "Hey! Just to let you know...";

        sendNote.onclick = function (){
            message = generatePrivateMessage(user.uid, privateNoteInp.value);
            addPrivateMessageToDB(userData, message);
            privateNoteInp.value = "";
            addGlobalMsgModal.style.display = "none";
        };
        cancelNote.onclick = function (){
            privateNoteInp.value = "";
            addGlobalMsgModal.style.display = "none";
        };

        addGlobalMsgModal.style.display = "block";

        //close on close
        spanNote.onclick = function() {
            addGlobalMsgModal.style.display = "none";
        };

        //close on click
        window.onclick = function(event) {
            if (event.target == addGlobalMsgModal) {
                addGlobalMsgModal.style.display = "none";
            }
        };
    }

    function generatePrivateMessage(userUID, message){
        return userUID + "@#$:" + message;
    }

    function addPrivateMessageToDB(userData, message) {
        var userNotificationArr = [];
        if(userData.notifications == undefined){
            userNotificationArr = [];
        } else {
            userNotificationArr = userData.notifications;
        }
        userNotificationArr.push(message);

        if(userData.notifications == undefined) {
            firebase.database().ref("users/" + userData.uid).update({notifications:{0:message}});
        } else {
            firebase.database().ref("users/" + userData.uid).update({
                notifications: userNotificationArr
            });
        }
    }

    function findFriendUserData(giftOwnerUID) {
        var i = findUIDItemInArr(giftOwnerUID, userArr);
        //console.log(i + " " + userArr[i].name);
        if (i != -1){
            return userArr[i];
        }
        return i;
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

    function deleteNotification(uid) {
        var deleteNotificationBool = true;
        console.log("Deleting " + uid);

        var toDelete = readNotificationArr.indexOf(notificationArr[uid]);
        readNotificationArr.splice(toDelete, 1);

        for (var i = 0; i < readNotificationArr.length; i++){
            if(readNotificationArr[i] == notificationArr[uid]){
                deleteNotificationBool = false;
            }
        }

        if(deleteNotificationBool) {
            notificationArr.splice(uid, 1);

            if (notificationArr.length == 0) {
                sessionStorage.setItem("notificationOverride", "notificationArrEmpty");
            }

            user.notifications = notificationArr;

            firebase.database().ref("users/" + user.uid).update({
                notifications: notificationArr
            });

            updateReadNotificationToDB();

            removeNotificationElement(uid);
        } else {
            alert("Notification Not Deleted, Please Try Again!");
        }
    }

    function removeNotificationElement(uid) {
        document.getElementById("notification" + uid).remove();

        notificationCount--;
        if (notificationCount == 0){
            deployNotificationListEmptyNotification();
        }
    }

    function updateReadNotificationToDB(){
        //console.log(readNotificationArr);
        if (user.readNotifications != undefined) {
            firebase.database().ref("users/" + user.uid).update({
                readNotifications: readNotificationArr
            });
        } else {
            console.log("New Read Notifications List");
            firebase.database().ref("users/" + user.uid).update({readNotifications:{0:readNotificationArr}});
        }
    }
};

function deployNotificationListEmptyNotification(){
    try{
        document.getElementById("TestGift").innerHTML = "No Notifications Found!";
    } catch(err){
        console.log("Loading Element Missing, Creating A New One");
        var liItem = document.createElement("LI");
        liItem.id = "TestGift";
        liItem.className = "gift";
        var textNode = document.createTextNode("No Notifications Found!");
        liItem.appendChild(textNode);
        notificationList.insertBefore(liItem, document.getElementById("notificationListContainer").childNodes[0]);
    }

    clearInterval(offlineTimer);
}

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
            window.location.href = "confirmation.html";
            break;
        case 5:
            window.location.href = "friendList.html";
            break;
        case 6:
            window.location.href = "privateFriendList.html";
            break;
        default:
            break;
    }
}
