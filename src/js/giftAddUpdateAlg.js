var listeningFirebaseRefs = [];
var giftArr = [];

var giftPresent = true;
var privateListBool = true;
var areYouStillThereBool = false;

var giftUID = -1;
var logoutReminder = 300;
var logoutLimit = 900;

var giftStorage;
var privateList;
var offlineSpan;
var offlineModal;
var user;
var privateUser;
var descField;
var titleField;
var whereField;
var linkField;
var spanUpdate;
var currentGift;
var userGifts;
var noteModal;
var noteInfoField;
var noteTitleField;
var noteSpan;


function getCurrentUser(){
    try {
        user = JSON.parse(sessionStorage.validUser);
        privateList = JSON.parse(sessionStorage.privateList);
        if(privateList == null || privateList == undefined || privateList == "") {
            privateListBool = false;
            console.log("User: " + user.userName + " logged in");
        } else {
            privateUser = JSON.parse(sessionStorage.validPrivateUser);
            document.getElementById('homeNote').className = "";
            document.getElementById('listNote').className = "active";
            console.log("User: " + privateUser.userName + " logged in");
            console.log("Friend: " + user.userName + " logged in");
        }
        giftStorage = JSON.parse(sessionStorage.giftStorage);
        if (giftStorage == null || giftStorage == undefined || giftStorage == "") {
            giftPresent = false;
        } else {
            console.log("Gift: " + giftStorage + " found");
        }
        if (user.invites == undefined) {
            console.log("Invites Not Found");
        } else if (user.invites != undefined) {
            if (user.invites.length > 0) {
                inviteNote.style.background = "#ff3923";
            }
        }
        userArr = JSON.parse(sessionStorage.userArr);
    } catch (err) {
        console.log(err.toString());
        window.location.href = "index.html";
    }
}

//Instantiates all data upon loading the webpage
window.onload = function instantiate() {

    offlineModal = document.getElementById('offlineModal');
    offlineSpan = document.getElementById("closeOffline");
    descField = document.getElementById('giftDescriptionInp');
    titleField = document.getElementById('giftTitleInp');
    whereField = document.getElementById('giftWhereInp');
    linkField = document.getElementById('giftLinkInp');
    spanUpdate = document.getElementById('updateGift');
    noteModal = document.getElementById('notificationModal');
    noteTitleField = document.getElementById('notificationTitle');
    noteInfoField = document.getElementById('notificationInfo');
    noteSpan = document.getElementById('closeNotification');
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
        console.log("Online mode activated, clearing offline notification");
        offlineModal.style.display = "none";
        location.reload();
    });

    window.addEventListener("offline", function() {
        var now = 0;
        var g = setInterval(function(){
            now = now + 1000;
            if(now >= 5000){
                offlineModal.style.display = "block";
                clearInterval(g);
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

    if(giftPresent) {
        spanUpdate.innerHTML = "Update Gift";
        spanUpdate.onclick = function() {
            updateGiftToDB();
        }
    } else {
        spanUpdate.innerHTML = "Add New Gift";
        spanUpdate.onclick = function() {
            addGiftToDB();
        }
    }

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

        modal.style.display = "none";
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

        if(!privateListBool) {
            userGifts = firebase.database().ref("users/" + user.uid + "/giftList/");
        } else {
            try{
                userGifts = firebase.database().ref("users/" + privateList.uid + "/privateList/");
            } catch (err) {
                console.log("Unable to connect to private list");
            }
        }

        var fetchData = function (postRef) {
            postRef.on('child_added', function (data) {
                giftArr.push(data);

                if(data.val().uid == giftStorage){
                    giftUID = data.key;
                    if(privateListBool){
                        currentGift = data.val();
                    }
                    initializeData();
                }
            });

            postRef.on('child_changed', function (data) {
                giftArr[data.key] = data;

                if(data.val().uid == giftStorage){
                    currentGift = data.val();
                }
            });

            postRef.on('child_removed', function (data) {
                if(privateListBool){
                    sessionStorage.setItem("privateList", JSON.stringify(privateList));
                }
                sessionStorage.setItem("validUser", JSON.stringify(user));
                location.reload();
            });

        };

        fetchData(userGifts);

        listeningFirebaseRefs.push(userGifts);
    }

    function initializeData() {
        if(giftPresent) {
            getGift();

            titleField.value = currentGift.title;
            if (currentGift.link == "")
                linkField.placeholder = "No Link Was Provided";
            else
                linkField.value = currentGift.link;
            if (currentGift.where == "")
                whereField.placeholder = "No Location Was Provided";
            else
                whereField.value = currentGift.where;
            if (currentGift.description == "")
                descField.placeholder = "No Description Was Provided";
            else
                descField.value = currentGift.description;
        }
    }

    function getGift() {
        if(!privateListBool) {
            for (var i = 0; i < user.giftList.length; i++) {
                if (user.giftList[i].uid == giftStorage) {
                    currentGift = user.giftList[i];
                    break;
                }
            }
        } else {
            for (var i = 0; i < user.privateList.length; i++) {
                if (privateList.privateList[i].uid == giftStorage) {
                    currentGift = privateList.privateList[i];
                    break;
                }
            }
        }
    }

    function updateGiftToDB(){
        if(titleField.value === "")
            alert("It looks like you left the title blank. Make sure you add a title so other people know what to get " +
                "you!");
        else {
            if(giftUID != -1) {
                if (!privateListBool) {
                    firebase.database().ref("users/" + user.uid + "/giftList/" + giftUID).update({
                        title: titleField.value,
                        link: linkField.value,
                        where: whereField.value,
                        received: currentGift.received,
                        uid: giftStorage,
                        buyer: currentGift.buyer,
                        description: descField.value,
                        creationDate: ""
                    });
                    if (currentGift.creationDate != undefined) {
                        if (currentGift.creationDate != "") {
                            firebase.database().ref("users/" + user.uid + "/giftList/" + giftUID).update({
                                creationDate: currentGift.creationDate
                            });
                        }
                    }

                    sessionStorage.setItem("validUser", JSON.stringify(user));
                    sessionStorage.setItem("userArr", JSON.stringify(userArr));
                    window.location.href = "home.html";
                } else {
                    firebase.database().ref("users/" + privateList.uid + "/privateList/" + giftUID).update({
                        title: titleField.value,
                        link: linkField.value,
                        where: whereField.value,
                        received: currentGift.received,
                        uid: giftStorage,
                        buyer: currentGift.buyer,
                        description: descField.value
                    });
                    if (currentGift.creationDate != undefined) {
                        if (currentGift.creationDate != "") {
                            firebase.database().ref("users/" + privateList.uid + "/privateList/" + giftUID).update({
                                creationDate: currentGift.creationDate
                            });
                        }
                    }
                    if (currentGift.creator != undefined) {
                        if (currentGift.creator != "") {
                            firebase.database().ref("users/" + privateList.uid + "/privateList/" + giftUID).update({
                                creator: currentGift.creator
                            });
                        }
                    }

                    sessionStorage.setItem("validGiftUser", JSON.stringify(user));
                    sessionStorage.setItem("validUser", JSON.stringify(privateUser));
                    sessionStorage.setItem("userArr", JSON.stringify(userArr));
                    window.location.href = "privateFriendList.html";
                }

                if(currentGift.buyer != ""){
                    var userFound = findUserNameItemInArr(currentGift.buyer, userArr);
                    if(userFound != -1){
                        if(privateListBool){
                            if (userArr[userFound].uid != privateUser.uid) {
                                addNotificationToDB(userArr[userFound], currentGift.title);
                            }
                        } else {
                            console.log(user.uid);
                            if (userArr[userFound].uid != user.uid) {
                                addNotificationToDB(userArr[userFound], currentGift.title);
                            }
                        }
                    } else {
                        console.log("User not found");
                    }
                } else {
                    console.log("No buyer, no notification needed");
                }
            } else {
                alert("There was an error updating the gift, please try again!");
                console.log(giftUID);
            }
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

    function addNotificationToDB(buyerUserData, giftTitle){
        var pageName = "friendList.html";
        var giftOwner = user.uid;
        if(privateListBool){
            pageName = "privateFriendList.html";
            giftOwner = privateList.uid;
        }
        var notificationString = generateNotificationString(giftOwner, giftTitle, pageName);
        var buyerUserNotifications;
        if(buyerUserData.notifications == undefined){
            buyerUserNotifications = [];
        } else {
            buyerUserNotifications = buyerUserData.notifications;
        }
        buyerUserNotifications.push(notificationString);

        if(buyerUserData.notifications != undefined) {
            firebase.database().ref("users/" + buyerUserData.uid).update({
                notifications: buyerUserNotifications
            });
            console.log("Added New Notification To DB");
        } else {
            console.log("New Notifications List");
            firebase.database().ref("users/" + buyerUserData.uid).update({notifications:{0:notificationString}});
            console.log("Added Notification To DB");
        }
    }

    function generateNotificationString(giftOwner, giftTitle, pageName){
        console.log("Generating Notification");
        return (giftOwner + "," + giftTitle + "," + pageName);
    }

    function addGiftToDB(){
        var uid = giftArr.length;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1;
        var yy = today.getFullYear();
        var creationDate = mm + "/" + dd + "/" + yy;

        if(titleField.value === "")
            alert("It looks like you left the title blank. Make sure you add a title so other people know what to get " +
                "you!");
        else {
            if(!privateListBool) {
                var newUid = firebase.database().ref("users/" + user.uid + "/giftList/" + uid).push();
                newUid = newUid.toString();
                newUid = newUid.substr(77, 96);
                firebase.database().ref("users/" + user.uid + "/giftList/" + uid).set({
                    title: titleField.value,
                    link: linkField.value,
                    where: whereField.value,
                    received: 0,
                    uid: newUid,
                    buyer: "",
                    description: descField.value,
                    creationDate: creationDate
                });

                sessionStorage.setItem("validUser", JSON.stringify(user));
                sessionStorage.setItem("userArr", JSON.stringify(userArr));
                window.location.href = "home.html"
            } else {

                var newUid = firebase.database().ref("users/" + user.uid + "/privateList/" + uid).push();
                newUid = newUid.toString();
                newUid = newUid.substr(80, 96);
                firebase.database().ref("users/" + user.uid + "/privateList/" + uid).set({
                    title: titleField.value,
                    link: linkField.value,
                    where: whereField.value,
                    received: 0,
                    uid: newUid,
                    buyer: "",
                    description: descField.value,
                    creationDate: creationDate,
                    creator: privateUser.userName
                });
                sessionStorage.setItem("validGiftUser", JSON.stringify(user));
                sessionStorage.setItem("validUser", JSON.stringify(privateUser));
                sessionStorage.setItem("userArr", JSON.stringify(userArr));
                window.location.href = "privateFriendList.html";
            }
        }
    }
};

function signOut(){
    sessionStorage.clear();
    window.location.href = "index.html";
}

function navigation(nav){
    if (!privateListBool)
        sessionStorage.setItem("validUser", JSON.stringify(user));
    else
        sessionStorage.setItem("validUser", JSON.stringify(privateUser));
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
        default:
            break;
    }
}
