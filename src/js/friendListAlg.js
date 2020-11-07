var listeningFirebaseRefs = [];
var userArr = [];
var giftArr = [];
var inviteArr = [];
var userUserNames = [];

var areYouStillThereBool = false;
var readNotificationsBool = false;
var updateGiftToDBBool = false;
var giftListEmptyBool = false;

var currentModalOpen = "";

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
var listNote;
var inviteNote;
var notificationBtn;
var currentUser;
var offlineTimer;
var loadingTimer;
var userBase;
var userGifts;
var userInvites;



function getCurrentUser(){
    try {
        moderationSet = sessionStorage.getItem("moderationSet");
        user = JSON.parse(sessionStorage.validGiftUser);
        currentUser = JSON.parse(sessionStorage.validUser);
        console.log("User: " + currentUser.userName + " logged in");
        console.log("Friend: " + user.userName + " loaded in");
        if (user.giftList == undefined) {
            deployGiftListEmptyNotification();
            giftListEmptyBool = true;
        } else if (user.giftList.length == 0) {
            deployGiftListEmptyNotification();
            giftListEmptyBool = true;
        }
        if (currentUser.invites == undefined) {
            console.log("Invites Not Found");
        } else if (currentUser.invites != undefined) {
            if (currentUser.invites.length > 0) {
                inviteNote.style.background = "#ff3923";
            }
        }

        if (currentUser.readNotifications == undefined) {
            console.log("Read Notifications Not Found");
        } else {
            readNotificationsBool = true;
        }

        if (currentUser.notifications == undefined) {
            console.log("Notifications Not Found");
        } else if (currentUser.notifications != undefined) {
            if (readNotificationsBool){
                if (currentUser.notifications.length > 0 && currentUser.readNotifications.length != currentUser.notifications.length) {
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
            } else if (currentUser.notifications.length > 0) {
                notificationBtn.src = "img/bellNotificationOn.png";
                notificationBtn.onclick = function() {
                    navigation(4);
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
    giftList = document.getElementById('giftListContainer');
    offlineModal = document.getElementById('offlineModal');
    offlineSpan = document.getElementById('closeOffline');
    noteSpan = document.getElementById('closeNotification');
    backBtn = document.getElementById('backBtn');
    listNote = document.getElementById('listNote');
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
        currentModalOpen = "";
        console.log("Closed modal");
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
                        document.getElementById("TestGift").innerHTML = "No Gifts Found! Your Friend Must Not Have Any Gifts!";
                    }
                } catch(err){
                    if(giftCounter == 0) {
                        console.log("Loading Element Missing, Creating A New One");
                        var liItem = document.createElement("LI");
                        liItem.id = "TestGift";
                        liItem.className = "gift";
                        if (onlineInt == 0) {
                            var textNode = document.createTextNode("Loading Failed, Please Connect To Internet");
                        } else {
                            var textNode = document.createTextNode("No Gifts Found! Your Friend Must Not Have Any Gifts!");
                        }
                        liItem.appendChild(textNode);
                        giftList.insertBefore(liItem, document.getElementById("giftListContainer").childNodes[0]);
                    }
                }
                offlineModal.style.display = "block";
                currentModalOpen = "offlineModal";
                console.log("Modal Open: " + currentModalOpen);
                clearInterval(offlineTimer);
            }
        }, 1000);
    });

    //close offlineModal on close
    offlineSpan.onclick = function() {
        currentModalOpen = "";
        console.log("Closed modal");
        offlineModal.style.display = "none";
    };

    //close offlineModal on click
    window.onclick = function(event) {
        if (event.target == offlineModal) {
            currentModalOpen = "";
            console.log("Closed modal");
            offlineModal.style.display = "none";
        }
    };

    //initialize back button
    backBtn.innerHTML = "Back To Lists";
    backBtn.onclick = function() {
        if(moderationSet == 1){
            navigation(5);
        } else {
            navigation(1);
        }
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

    loginTimer(); //if action, then reset timer

    friendListButton();

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
        currentModalOpen = "noteModal";
        console.log("Modal Open: " + currentModalOpen);

        //close on close
        noteSpan.onclick = function() {
            currentModalOpen = "";
            console.log("Closed modal");
            noteModal.style.display = "none";
            areYouStillThereBool = false;
        };
    }

    function ohThereYouAre(){
        noteInfoField.innerHTML = "Welcome back, " + currentUser.name;
        noteTitleField.innerHTML = "Oh, There You Are!";

        var nowJ = 0;
        var j = setInterval(function(){
            nowJ = nowJ + 1000;
            if(nowJ >= 3000){
                currentModalOpen = "";
                console.log("Closed modal");
                noteModal.style.display = "none";
                areYouStillThereBool = false;
                clearInterval(j);
            }
        }, 1000);

        //close on click
        window.onclick = function(event) {
            if (event.target == noteModal) {
                currentModalOpen = "";
                console.log("Closed modal");
                noteModal.style.display = "none";
                areYouStillThereBool = false;
            }
        };
    }

    function friendListButton(){
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
                    document.getElementById("listNote").innerHTML = "Public";
                    document.getElementById("listNote").style.background = "#00ad05";
                }
            }
        }, 1000);
    }

    function databaseQuery() {

        userBase = firebase.database().ref("users/");
        userGifts = firebase.database().ref("users/" + user.uid + "/giftList");
        userInvites = firebase.database().ref("users/" + currentUser.uid + "/invites");

        var fetchData = function (postRef) {
            postRef.on('child_added', function (data) {
                onlineInt = 1;

                var i = findUIDItemInArr(data.key, userArr);
                if(userArr[i] != data.val() && i != -1){
                    //console.log("Adding " + userArr[i].userName + " to most updated version: " + data.val().userName);
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

        var fetchGifts = function (postRef) {
            postRef.on('child_added', function (data) {
                giftArr.push(data.val());

                if(checkGiftBuyer(data.val().buyer)){
                    data.val().buyer = "";
                    updateGiftToDBBool = true;
                }

                createGiftElement(data.val().description, data.val().link, data.val().received, data.val().title,
                    data.key, data.val().where, data.val().buyer, data.val().uid, data.val().creationDate);

                if(updateGiftToDBBool){
                    updateGiftError(data, data.key);
                    updateGiftToDBBool = false;
                }
            });

            postRef.on('child_changed', function(data) {
                giftArr[data.key] = data.val();

                if(data.val().uid == currentModalOpen){
                    currentModalOpen = "";
                    console.log("Closed modal");
                    modal.style.display = "none";
                }

                changeGiftElement(data.val().description, data.val().link, data.val().received, data.val().title,
                    data.key, data.val().where, data.val().buyer, data.val().uid, data.val().creationDate);
            });

            postRef.on('child_removed', function(data) {
                sessionStorage.setItem("validGiftUser", JSON.stringify(user));
                sessionStorage.setItem("validUser", JSON.stringify(currentUser));
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
        //alert("A gift needs to be updated! Key: " + giftKey);
        firebase.database().ref("users/" + user.uid + "/giftList/" + giftKey).update({
            buyer: ""
        });
    }

    function createGiftElement(giftDescription, giftLink, giftReceived, giftTitle, giftKey, giftWhere, giftBuyer, giftUid,
                               giftDate){
        console.log("Creating " + giftUid);
        try{
            document.getElementById("TestGift").remove();
        } catch (err) {}

        giftCounter++;

        var liItem = document.createElement("LI");
        liItem.id = "gift" + giftUid;
        liItem.className = "gift";
        if(giftReceived == 1) {
            liItem.className += " checked";
            //console.log("Checked, created");
        }
        liItem.onclick = function (){
            var spanGift = document.getElementsByClassName("close")[0];
            var buyBtn = document.getElementById('giftBuy');
            var dontBuyBtn = document.getElementById('giftDontBuy');
            var descField = document.getElementById('giftDescription');
            var boughtField = document.getElementById('giftBought');
            var titleField = document.getElementById('giftTitle');
            var whereField = document.getElementById('giftWhere');
            var linkField = document.getElementById('giftLink');

            noteTitleField = document.getElementById('notificationTitle');
            noteInfoField = document.getElementById('notificationInfo');

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
            if(giftReceived == 1){
                if(giftBuyer == "" || giftBuyer == null || giftBuyer == undefined){
                    boughtField.innerHTML = "This gift has been bought";
                } else {
                    boughtField.innerHTML = "This gift was bought by " + giftBuyer;
                }
            } else {
                boughtField.innerHTML = "This gift has not been bought yet";
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
            buyBtn.onclick = function(){
                if (giftReceived == 0) {
                    firebase.database().ref("users/" + user.uid + "/giftList/" + giftKey).update({
                        received: 1,
                        buyer: currentUser.userName
                    });
                } else {
                    alert("This gift has already been marked as bought!");
                }
            };
            dontBuyBtn.onclick = function(){
                if (giftReceived == 1) {
                    if (giftBuyer == currentUser.userName || giftBuyer == "") {
                        firebase.database().ref("users/" + user.uid + "/giftList/" + giftKey).update({
                            received: 0,
                            buyer: ""
                        });
                    } else {
                        alert("Only the buyer, " + giftBuyer + ", can \"Un-Buy\" this gift. Please contact them to undo this action " +
                            "if this has been done in error.");
                    }
                } else {
                    alert("This gift has already been marked as \"Un-Bought\"!");
                }
            };

            //show modal
            modal.style.display = "block";
            currentModalOpen = giftUid;
            console.log("Modal Open: " + currentModalOpen);

            //close on close
            spanGift.onclick = function() {
                currentModalOpen = "";
                console.log("Closed modal");
                modal.style.display = "none";
            };

            //close on click
            window.onclick = function(event) {
                if (event.target == modal) {
                    currentModalOpen = "";
                    console.log("Closed modal");
                    modal.style.display = "none";
                }
            };
        };
        var textNode = document.createTextNode(giftTitle);
        liItem.appendChild(textNode);

        giftList.insertBefore(liItem, document.getElementById("giftListContainer").childNodes[0]);
        clearInterval(offlineTimer);
    }

    function changeGiftElement(description, link, received, title, key, where, buyer, uid, date) {
        var editGift = document.getElementById("gift" + uid);
        editGift.innerHTML = title;
        editGift.className = "gift";
        if(received == 1) {
            editGift.className += " checked";
            //console.log("Checked, changed");
        }
        editGift.onclick = function (){
            var spanGift = document.getElementsByClassName("close")[0];
            var buyBtn = document.getElementById('giftBuy');
            var dontBuyBtn = document.getElementById('giftDontBuy');
            var descField = document.getElementById('giftDescription');
            var boughtField = document.getElementById('giftBought');
            var titleField = document.getElementById('giftTitle');
            var whereField = document.getElementById('giftWhere');
            var linkField = document.getElementById('giftLink');

            noteTitleField = document.getElementById('notificationTitle');
            noteInfoField = document.getElementById('notificationInfo');

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
            if(received == 1){
                if(buyer == "" || buyer == null || buyer == undefined){
                    boughtField.innerHTML = "This gift has been bought";
                } else {
                    boughtField.innerHTML = "This gift was bought by " + buyer;
                }
            } else {
                boughtField.innerHTML = "This gift has not been bought yet";
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
            buyBtn.onclick = function(){
                if(received == 0) {
                    firebase.database().ref("users/" + user.uid + "/giftList/" + key).update({
                        received: 1,
                        buyer: currentUser.userName
                    });
                } else {
                    alert("This gift has already been marked as bought!");
                }
            };
            dontBuyBtn.onclick = function(){
                if(received == 1) {
                    if (buyer == currentUser.userName || buyer == "") {
                        firebase.database().ref("users/" + user.uid + "/giftList/" + key).update({
                            received: 0,
                            buyer: ""
                        });
                    } else {
                        alert("Only the buyer, " + buyer + ", can \"Un-Buy\" this gift. Please contact them to undo this action " +
                            "if this has been done in error.");
                    }
                } else {
                    alert("This gift has already been marked as \"Un-Bought\"!");
                }
            };

            //show modal
            modal.style.display = "block";
            currentModalOpen = uid;
            console.log("Modal Open: " + currentModalOpen);

            //close on close
            spanGift.onclick = function() {
                currentModalOpen = "";
                console.log("Closed modal");
                modal.style.display = "none";
            };

            //close on click
            window.onclick = function(event) {
                if (event.target == modal) {
                    currentModalOpen = "";
                    console.log("Closed modal");
                    modal.style.display = "none";
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
};

function deployGiftListEmptyNotification(){
    try{
        document.getElementById("TestGift").innerHTML = "No Gifts Found! Your Friend Must Not Have Any Gifts!";
    } catch(err){
        console.log("Loading Element Missing, Creating A New One");
        var liItem = document.createElement("LI");
        liItem.id = "TestGift";
        liItem.className = "gift";
        var textNode = document.createTextNode("No Gifts Found! Your Friend Must Not Have Any Gifts!");
        liItem.appendChild(textNode);
        giftList.insertBefore(liItem, document.getElementById("giftListContainer").childNodes[0]);
    }

    clearInterval(offlineTimer);
}

function signOut(){
    sessionStorage.clear();
    window.location.href = "index.html";
}

function navigation(nav){
    sessionStorage.setItem("validUser", JSON.stringify(currentUser));
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
        case 5:
            window.location.href = "moderation.html";
            break;
        default:
            break;
    }
}
