var listeningFirebaseRefs = [];
var inviteArr = [];
var userArr = [];
var userUIDArr = [];
var tempUserArr = [];
var optInUserArr = [];

var areYouStillThereBool = false;
var secretSantaIntBool = false;
var secretSantaNameBool = false;

var moderationSet = 1;
var userCounter = 0;
var onlineInt = 0;
var loadingTimerInt = 0;
var logoutReminder = 300;
var logoutLimit = 1800;

var giftList;
var offlineSpan;
var offlineModal;
var addGlobalMsgModal;
var addGlobalMsgBtn;
var sendPrivateMessage;
var user;
var offlineTimer;
var loadingTimer;
var modal;
var noteModal;
var noteInfoField;
var noteTitleField;
var noteSpan;
var inviteNote;
var userInitial;
var userInvites;
var activateSecretSanta;
var secretSantaModal;
var santaModalSpan;
var secretSantaShuffle;
var secretSantaBtn;



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

    giftList = document.getElementById('giftListContainer');
    offlineModal = document.getElementById('offlineModal');
    offlineSpan = document.getElementById('closeOffline');
    inviteNote = document.getElementById('inviteNote');
    noteModal = document.getElementById('notificationModal');
    noteTitleField = document.getElementById('notificationTitle');
    noteInfoField = document.getElementById('notificationInfo');
    noteSpan = document.getElementById('closeNotification');
    addGlobalMsgModal = document.getElementById('userModal');
    addGlobalMsgBtn = document.getElementById('sendGlobalNotification');
    sendPrivateMessage = document.getElementById('sendPrivateMessage');
    modal = document.getElementById('giftModal');
    activateSecretSanta = document.getElementById('activateSecretSanta');
    secretSantaModal = document.getElementById('santaModal');
    santaModalSpan = document.getElementById('secretSantaSpan');
    secretSantaShuffle = document.getElementById('secretSantaShuffle');
    secretSantaBtn = document.getElementById('secretSantaBtn');
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
        closeModal(offlineModal);
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
                        document.getElementById("TestGift").innerHTML = "No Users Found!";
                    }
                } catch(err) {
                    if(userCounter == 0){
                        console.log("Loading Element Missing, Creating A New One");
                        var liItem = document.createElement("LI");
                        liItem.id = "TestGift";
                        liItem.className = "gift";
                        if (onlineInt == 0) {
                            var textNode = document.createTextNode("Loading Failed, Please Connect To Internet");
                        } else {
                            var textNode = document.createTextNode("No Users Found!");
                        }
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

    databaseQuery();

    settingsModerateButton();

    loginTimer(); //if action, then reset timer

    initializeSecretSantaArrs();

    function initializeSecretSantaArrs(){
        tempUserArr = [];
        optInUserArr = [];

        for (var i = 0; i < userArr.length; i++) {
            if (userArr[i].secretSantaName != null)
                if (userArr[i].secretSantaName != "")
                    secretSantaNameBool = true;
            if (userArr[i].secretSanta != null)
                if (userArr[i].secretSanta == 1) {
                    tempUserArr.push(userArr[i]);
                    optInUserArr.push(userArr[i]);
                    if (optInUserArr.length > 2)
                        secretSantaIntBool = true;
                }
        }
    }

    generateSecretSantaModal();

    function generateSecretSantaModal(){
        activateSecretSanta.onclick = function() {
            if (secretSantaNameBool && secretSantaIntBool) {
                secretSantaBtn.onclick = function () {
                    secretSantaBtn.innerHTML = "Click On Me To Deactivate Secret Santa";
                    removeSecretSantaNames();
                    updateAllUsersToDBSantaNames();
                    alert("The Secret Santa Has Been Deactivated!");
                    removeSecretSantaNums();
                    updateAllUsersToDBSantaNums();
                    secretSantaNameBool = false;
                    closeModal(secretSantaModal);
                    generateSecretSantaModal();
                };

                secretSantaShuffle.onclick = function () {
                    initializeSecretSantaArrs();
                    removeSecretSantaNames();
                    createSecretSantaNames();
                    secretSantaNameBool = true;
                    alert("The Secret Santa has been shuffled!");
                };

                secretSantaBtn.innerHTML = "Click On Me To Deactivate Secret Santa";
                secretSantaShuffle.innerHTML = "Click Me To Shuffle Secret Santa Names!";

            } else if (secretSantaIntBool) {
                secretSantaBtn.onclick = function () {
                    secretSantaBtn.innerHTML = "Click On Me To Activate Secret Santa";
                    createSecretSantaNames();
                    alert("Secret Santa System Has Been Initialized. Enjoy!");
                    secretSantaNameBool = true;
                    closeModal(secretSantaModal);
                    generateSecretSantaModal();
                };

                secretSantaShuffle.onclick = function(){
                    alert("Shuffle Button Not Available Until Secret Santa Is Active");
                };

                secretSantaBtn.innerHTML = "Click On Me To Activate Secret Santa";
                secretSantaShuffle.innerHTML = "Shuffle Button Not Available!";

            } else {
                secretSantaBtn.onclick = function () {
                    alert("Secret Santa Button Is Not Available Until 3 Or More Users Have Signed Up");
                };

                secretSantaShuffle.onclick = function(){
                    alert("Shuffle Button Not Available Until Secret Santa Is Active");
                };

                secretSantaBtn.innerHTML = "Secret Santa Not Available! Click Me For More Info!";
                secretSantaShuffle.innerHTML = "Shuffle Button Not Available!";
            }

            santaModalSpan.onclick = function(){
                closeModal(secretSantaModal);
            };

            window.onclick = function(event) {
                if (event.target == secretSantaModal) {
                    closeModal(secretSantaModal);
                }
            };

            openModal(secretSantaModal, "secretSantaModal");
        };

        activateSecretSanta.innerHTML = "Secret Santa";
    }

    function createSecretSantaNames(){
        var selector;
        var userIndex;
        var retryCount = 0;

        for (var i = 0; i < optInUserArr.length; i++) {
            selector = Math.floor((Math.random() * tempUserArr.length));
            if (!userUIDArr.includes(tempUserArr[selector].uid)) {
                if (tempUserArr[selector].name != optInUserArr[i].name) {
                    if (optInUserArr[i].friends.includes(tempUserArr[selector].uid)) {
                        console.log("Matched " + tempUserArr[selector].name + " to " + optInUserArr[i].name);
                        userUIDArr.push(tempUserArr[selector].uid);
                        userIndex = findUIDItemInArr(optInUserArr[i].uid, userArr);
                        userArr[userIndex].secretSantaName = tempUserArr[selector].uid;
                        tempUserArr.splice(selector, 1);
                        retryCount = 0;
                    } else {
                        //console.log("These Users Aren't Friends :(");
                        retryCount++;
                        if(retryCount >= 10)
                            break;
                        i--;
                    }
                } else {
                    //console.log("These Are The Same Users :(");
                    retryCount++;
                    if(retryCount >= 10)
                        break;
                    i--;
                }
            } else {
                //console.log("User Has Already Been Picked");
                retryCount++;
                if(retryCount >= 10)
                    break;
                i--;
            }
        }

        if (optInUserArr.length != userUIDArr.length) {
            console.log("USERUIDARR:");
            console.log(userUIDArr);
            console.log("TEMPUSERARR:");
            console.log(tempUserArr);
            userUIDArr = [];
            removeSecretSantaNames();
            alert("Secret Santa System Was Unable To Properly Initialize Secret Santa Names. Please Try Again");
        } else {
            sessionStorage.setItem("userArr", JSON.stringify(userArr));
            updateAllUsersToDBSantaNames();
            userUIDArr = [];
        }
    }

    function removeSecretSantaNames(){
        for (var i = 0; i < userArr.length; i++)
            userArr[i].secretSantaName = "";

        sessionStorage.setItem("userArr", JSON.stringify(userArr));
    }

    function removeSecretSantaNums(){
        for (var i = 0; i < userArr.length; i++)
            userArr[i].secretSanta = 0;

        sessionStorage.setItem("userArr", JSON.stringify(userArr));
    }

    function updateAllUsersToDBSantaNums(){
        for(var i = 0; i < userArr.length; i++){
            if (userArr[i].secretSanta != undefined) {
                firebase.database().ref("users/" + userArr[i].uid).update({
                    secretSanta: userArr[i].secretSanta
                });
            } else {
                console.log("Failed To Update Num " + userArr[i].name);
            }
        }
    }

    function updateAllUsersToDBSantaNames(){
        for(var i = 0; i < userArr.length; i++) {
            if (userArr[i].secretSantaName != undefined) {
                firebase.database().ref("users/" + userArr[i].uid).update({
                    secretSantaName: userArr[i].secretSantaName
                });
            } else {
                console.log("Failed To Update Name " + userArr[i].name);
            }
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

        try {
            closeModal(modal);
        } catch (err) {
            //console.log("Basic Modal Not Open");
        }
        noteInfoField.innerHTML = "You have been inactive for 5 minutes, you will be logged out in " + timeMins
            + ":" + timeSecs + "!";
        noteTitleField.innerHTML = "Are You Still There?";
        openModal(noteModal, "openModal");

        //close on close
        noteSpan.onclick = function() {
            closeModal(noteModal);
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
                closeModal(noteModal);
                areYouStillThereBool = false;
                clearInterval(j);
            }
        }, 1000);

        //close on click
        window.onclick = function(event) {
            if (event.target == noteModal) {
                closeModal(noteModal);
                areYouStillThereBool = false;
            }
        };
    }

    function settingsModerateButton(){
        var nowConfirm = 0;
        var alternator = 0;
        console.log("Settings Button Feature Active");
        setInterval(function(){
            nowConfirm = nowConfirm + 1000;
            if(nowConfirm >= 3000){
                nowConfirm = 0;
                if(alternator == 0) {
                    alternator++;
                    document.getElementById("settingsNote").innerHTML = "Settings";
                    settingsNote.style.background = "#00c606";
                } else {
                    alternator--;
                    document.getElementById("settingsNote").innerHTML = "Moderation";
                    settingsNote.style.background = "#00ad05";
                }
            }
        }, 1000);
    }

    function generatePrivateMessageDialog(userData) {
        var sendNote = document.getElementById('sendNote');
        var cancelNote = document.getElementById('cancelNote');
        var privateNoteInp = document.getElementById('globalNoteInp');
        var spanNote = document.getElementById('globalNoteSpan');
        var globalNoteTitle = document.getElementById('globalNoteTitle');

        globalNoteTitle.innerHTML = "Send A Private Message Below";
        privateNoteInp.placeholder = "Hey! Just to let you know...";

        sendNote.onclick = function (){
            if(privateNoteInp.value.includes(",")){
                alert("Please do not use commas in the message. Thank you!");
            } else {
                addPrivateMessageToDB(userData, privateNoteInp.value);
                privateNoteInp.value = "";
                closeModal(addGlobalMsgModal);
                alert("The Private Message Has Been Sent!");
            }
        };
        cancelNote.onclick = function (){
            privateNoteInp.value = "";
            closeModal(addGlobalMsgModal);
        };

        openModal(addGlobalMsgModal, "addGlobalMsgModal");

        //close on close
        spanNote.onclick = function() {
            closeModal(addGlobalMsgModal);
        };

        //close on click
        window.onclick = function(event) {
            if (event.target == addGlobalMsgModal) {
                closeModal(addGlobalMsgModal);
            }
        };
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

    function initializeGlobalNotification() {
        addGlobalMsgBtn.innerHTML = "Send Global Message";
        addGlobalMsgBtn.onclick = function (){
            var sendNote = document.getElementById('sendNote');
            var cancelNote = document.getElementById('cancelNote');
            var globalNoteInp = document.getElementById('globalNoteInp');
            var spanNote = document.getElementById('globalNoteSpan');
            var globalNoteTitle = document.getElementById('globalNoteTitle');

            globalNoteInp.placeholder = "WARNING: An Important Message...";
            globalNoteTitle.innerHTML = "Enter Global Notification Below";

            sendNote.onclick = function (){
                if(globalNoteInp.value.includes(",")){
                    alert("Please do not use commas in the notification. Thank you!");
                } else {
                    addGlobalMessageToDB(globalNoteInp.value);
                    globalNoteInp.value = "";
                    closeModal(addGlobalMsgModal);
                    alert("The Global Message Has Been Sent!");
                }
            };
            cancelNote.onclick = function (){
                globalNoteInp.value = "";
                closeModal(addGlobalMsgModal);
            };

            openModal(addGlobalMsgModal, "addGlobalMsgModal");

            //close on close
            spanNote.onclick = function() {
                closeModal(addGlobalMsgModal);
            };

            //close on click
            window.onclick = function(event) {
                if (event.target == addGlobalMsgModal) {
                    closeModal(addGlobalMsgModal);
                }
            };
        };
    }

    function addGlobalMessageToDB(message) {
        var userNotificationArr = [];
        for (var i = 0; i < userArr.length; i++){
            if(userArr[i].notifications == undefined){
                userNotificationArr = [];
            } else {
                userNotificationArr = userArr[i].notifications;
            }
            userNotificationArr.push(message);

            if(userArr[i].notifications == undefined) {
                firebase.database().ref("users/" + userArr[i].uid).update({notifications:{0:message}});
            } else {
                firebase.database().ref("users/" + userArr[i].uid).update({
                    notifications: userNotificationArr
                });
            }
        }
    }

    function databaseQuery() {

        userInitial = firebase.database().ref("users/");
        userInvites = firebase.database().ref("users/" + user.uid + "/invites");

        var fetchData = function (postRef) {
            postRef.on('child_added', function (data) {
                createUserElement(data.val());

                if(onlineInt == 0) {
                    onlineInt = 1;
                    initializeGlobalNotification();
                }

                var i = findUIDItemInArr(data.key, userArr);
                if(userArr[i] != data.val() && i != -1){
                    //console.log("Adding " + userArr[i].userName + " to most updated version: " + data.val().userName);
                    userArr[i] = data.val();
                }

                if(data.key == user.uid){
                    user = data.val();
                    //console.log("User Updated: 1");
                }
            });

            postRef.on('child_changed', function (data) {
                changeUserElement(data.val());

                var i = findUIDItemInArr(data.key, userArr);
                if(userArr[i] != data.val() && i != -1){
                    //console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
                    userArr[i] = data.val();
                }

                if(data.key == user.uid){
                    user = data.val();
                    //console.log("User Updated: 2");
                }

                if(currentModalOpen == data.key) {//Moved currentModalOpen reference to common.js
                    closeModal(modal);
                }
            });

            postRef.on('child_removed', function (data) {
                removeUserElement(data.val().uid);

                var i = findUIDItemInArr(data.key, userArr);
                if(userArr[i] != data.val() && i != -1){
                    //console.log("Removing " + userArr[i].userName + " / " + data.val().userName);
                    userArr.splice(i, 1);
                }

                if(currentModalOpen == data.key) {//Moved currentModalOpen reference to common.js
                    closeModal(modal);
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

    function findUIDItemInArr(item, userArray){
        for(var i = 0; i < userArray.length; i++){
            if(userArray[i].uid == item){
                //console.log("Found item: " + item);
                return i;
            }
        }
        return -1;
    }

    function createUserElement(userData){
        try{
            document.getElementById("TestGift").remove();
        } catch (err) {}

        var liItem = document.createElement("LI");
        liItem.id = "user" + userData.uid;
        liItem.className = "gift";
        if (userData.secretSanta != null)
            if (userData.secretSanta == 1)
                liItem.className += " santa";
        liItem.onclick = function (){
            var spanGift = document.getElementsByClassName("close")[0];
            var warnBtn = document.getElementById('warnUser');
            var banBtn = document.getElementById('banUser');
            var userName = document.getElementById('userName');
            var userUID = document.getElementById('userUID');
            var userUserName = document.getElementById('userUserName');
            var userGifts = document.getElementById('userGifts');
            var userPrivateGifts = document.getElementById('userPrivateGifts');
            var userFriends = document.getElementById('userFriends');
            var userPassword = document.getElementById('userPassword');
            var userSecretSanta = document.getElementById('userSecretSanta');
            var moderatorOp = document.getElementById('moderatorOp');

            userName.innerHTML = userData.name;
            userUID.innerHTML = userData.uid;
            userUserName.innerHTML = userData.userName;
            if(userData.giftList != undefined){
                userGifts.innerHTML = "# Gifts: " + userData.giftList.length;
            } else {
                userGifts.innerHTML = "This User Has No Gifts";
            }
            if(userData.privateList != undefined){
                userPrivateGifts.innerHTML = "# Private Gifts: " + userData.privateList.length;
            } else {
                userPrivateGifts.innerHTML = "This User Has No Private Gifts";
            }
            if(userData.friends != undefined) {
                userFriends.innerHTML = "# Friends: " + userData.friends.length;
            } else {
                userFriends.innerHTML = "This User Has No Friends";
            }
            userPassword.innerHTML = "Click On Me To View Password";

            if(userData.secretSanta != undefined) {
                if (userData.secretSanta == 0)
                    userSecretSanta.innerHTML = "This User Is Not Opted Into Secret Santa";
                else
                    userSecretSanta.innerHTML = "This User Is Signed Up For Secret Santa";
            } else {
                userSecretSanta.innerHTML = "This User Is Not Opted Into Secret Santa";
            }

            userSecretSanta.onclick = function() {
                manuallyOptInOut(userData);
            };

            userGifts.onclick = function() {
                if(userData.uid == user.uid){
                    alert("Navigate to the home page to see your gifts!");
                } else {
                    sessionStorage.setItem("validGiftUser", JSON.stringify(userData));//Other User Data
                    navigation(4);
                }
            };
            userPrivateGifts.onclick = function() {
                if(userData.uid == user.uid){
                    alert("You aren't allowed to see these gifts, silly!");
                } else {
                    sessionStorage.setItem("validGiftUser", JSON.stringify(userData));//Other User Data
                    navigation(5);
                }
            };
            userPassword.onclick = function() {
                try {
                    userPassword.innerHTML = decode(userData.encodeStr);
                } catch (err) {
                    userPassword.innerHTML = userData.pin;
                }
            };
            warnBtn.onclick = function(){
                alert("This will eventually warn the user of a certain offense");
                //warn function
            };
            banBtn.onclick = function(){
                alert("This will eventually ban the user for a certain offense");
                //ban function
            };
            if (userData.uid == "-L__dcUyFssV44G9stxY" && user.uid != "-L__dcUyFssV44G9stxY") {
                moderatorOp.innerHTML = "Don't Even Think About It";
                moderatorOp.onclick = function() {

                }
            } else if (userData.moderatorInt == 1) {
                moderatorOp.innerHTML = "Revoke Moderator Role";
                moderatorOp.onclick = function() {
                    if(userData.uid == user.uid){
                        alert("You cannot adjust your own role");
                    } else {
                        alert("Revoked role for: " + userData.userName);
                        firebase.database().ref("users/" + userData.uid).update({
                            moderatorInt: 0
                        });
                        closeModal(modal);
                    }
                };
            } else {
                moderatorOp.innerHTML = "Grant Moderator Role";
                moderatorOp.onclick = function() {
                    if(userData.userName == user.userName){
                        alert("You cannot adjust your own role");
                        console.log("...How'd you get here...?");
                    } else {
                        alert("Granted role for: " + userData.userName);
                        firebase.database().ref("users/" + userData.uid).update({
                            moderatorInt: 1
                        });
                        closeModal(modal);
                    }
                };
            }

            sendPrivateMessage.innerHTML = "Send Message To " + userData.name;
            sendPrivateMessage.onclick = function() {
                generatePrivateMessageDialog(userData);
            };

            //show modal
            openModal(modal, userData.uid);

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
        var textNode = document.createTextNode(userData.name);
        liItem.appendChild(textNode);

        giftList.insertBefore(liItem, document.getElementById("giftListContainer").childNodes[0]);
        clearInterval(offlineTimer);

        userCounter++;
        if (userCounter > 5) {
            activateSecretSanta.style.opacity = ".75";
        }
    }

    function changeUserElement(userData) {
        var editGift = document.getElementById("user" + userData.uid);
        editGift.innerHTML = userData.name;
        editGift.className = "gift";
        if (userData.secretSanta != null)
            if (userData.secretSanta == 1)
                editGift.className += " santa";
        editGift.onclick = function (){
            var spanGift = document.getElementsByClassName("close")[0];
            var warnBtn = document.getElementById('warnUser');
            var banBtn = document.getElementById('banUser');
            var userName = document.getElementById('userName');
            var userUID = document.getElementById('userUID');
            var userUserName = document.getElementById('userUserName');
            var userGifts = document.getElementById('userGifts');
            var userPrivateGifts = document.getElementById('userPrivateGifts');
            var userFriends = document.getElementById('userFriends');
            var userPassword = document.getElementById('userPassword');
            var userSecretSanta = document.getElementById('userSecretSanta');
            var moderatorOp = document.getElementById('moderatorOp');

            userName.innerHTML = userData.name;
            userUID.innerHTML = userData.uid;
            userUserName.innerHTML = userData.userName;
            if(userData.giftList != undefined){
                userGifts.innerHTML = "# Gifts: " + userData.giftList.length;
            } else {
                userGifts.innerHTML = "This User Has No Gifts";
            }
            if(userData.privateList != undefined){
                userPrivateGifts.innerHTML = "# Private Gifts: " + userData.privateList.length;
            } else {
                userPrivateGifts.innerHTML = "This User Has No Private Gifts";
            }
            if(userData.friends != undefined) {
                userFriends.innerHTML = "# Friends: " + userData.friends.length;
            } else {
                userFriends.innerHTML = "This User Has No Friends";
            }
            userPassword.innerHTML = "Click On Me To View Password";

            if(userData.secretSanta != undefined) {
                if (userData.secretSanta == 0)
                    userSecretSanta.innerHTML = "This User Is Not Opted Into Secret Santa";
                else
                    userSecretSanta.innerHTML = "This User Is Signed Up For Secret Santa";
            } else {
                userSecretSanta.innerHTML = "This User Is Not Opted Into Secret Santa";
            }

            userSecretSanta.onclick = function() {
                manuallyOptInOut(userData);
            };

            userGifts.onclick = function() {
                if(userData.uid == user.uid){
                    alert("Navigate to the home page to see your gifts!");
                } else {
                    sessionStorage.setItem("validGiftUser", JSON.stringify(userData));//Other User Data
                    navigation(4);
                }
            };
            userPrivateGifts.onclick = function() {
                if(userData.uid == user.uid){
                    alert("You aren't allowed to see these gifts, silly!");
                } else {
                    sessionStorage.setItem("validGiftUser", JSON.stringify(userData));//Other User Data
                    navigation(5);
                }
            };
            userPassword.onclick = function() {
                userPassword.innerHTML = decode(userData.encodeStr);
            };
            warnBtn.onclick = function(){
                alert("This will eventually warn the user of a certain offense");
                //warn function
            };
            banBtn.onclick = function(){
                alert("This will eventually ban the user for a certain offense");
                //ban function
            };
            if (userData.uid == "-L__dcUyFssV44G9stxY" && user.uid != "-L__dcUyFssV44G9stxY") {
                moderatorOp.innerHTML = "Don't Even Think About It";
                moderatorOp.onclick = function() {

                }
            } else if (userData.moderatorInt == 1) {
                moderatorOp.innerHTML = "Revoke Moderator Role";
                moderatorOp.onclick = function() {
                    if(userData.uid == user.uid){
                        alert("You cannot adjust your own role");
                    } else {
                        alert("Revoked role for: " + userData.userName);
                        firebase.database().ref("users/" + userData.uid).update({
                            moderatorInt: 0
                        });
                        closeModal(modal);
                    }
                };
            } else {
                moderatorOp.innerHTML = "Grant Moderator Role";
                moderatorOp.onclick = function() {
                    if(userData.userName == user.userName){
                        alert("You cannot adjust your own role");
                        console.log("...How'd you get here...?");
                    } else {
                        alert("Granted role for: " + userData.userName);
                        firebase.database().ref("users/" + userData.uid).update({
                            moderatorInt: 1
                        });
                        closeModal(modal);
                    }
                };
            }

            sendPrivateMessage.innerHTML = "Send Message To " + userData.name;
            sendPrivateMessage.onclick = function() {
                generatePrivateMessageDialog(userData);
            };

            //show modal
            openModal(modal, userData.uid);

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

    function removeUserElement(uid) {
        document.getElementById("user" + uid).remove();

        userCounter--;
        if (userCounter == 0){
            deployUserListEmptyNotification();
        }
    }
};

function manuallyOptInOut(userData){
    if (userData.secretSanta != null) {
        if (userData.secretSanta == 0) {
            firebase.database().ref("users/" + userData.uid).update({
                secretSanta: 1
            });
            alert(userData.name + " has been manually opted in to the Secret Santa Program!");
        } else {
            firebase.database().ref("users/" + userData.uid).update({
                secretSanta: 0
            });
            alert(userData.name + " has been manually opted out of the Secret Santa Program!");
        }
    } else {
        firebase.database().ref("users/" + userData.uid).update({
            secretSanta: 0
        });
        alert(userData.name + " has been manually opted out of the Secret Santa Program!");
    }
}

function deployUserListEmptyNotification(){
    try{
        document.getElementById("TestGift").innerHTML = "No Users Found!";
    } catch(err){
        console.log("Loading Element Missing, Creating A New One");
        var liItem = document.createElement("LI");
        liItem.id = "TestGift";
        liItem.className = "gift";
        var textNode = document.createTextNode("No Users Found!");
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
            window.location.href = "friendList.html";
            break;
        case 5:
            window.location.href = "privateFriendList.html";
            break;
        default:
            break;
    }
}
