var userArr = [];
var friendArr = [];
var inviteArr = [];
var listeningFirebaseRefs = [];

var readNotificationsBool = false;
var inviteListEmptyBool = false;

var inviteCount = 0;
var onlineInt = 0;
var loadingTimerInt = 0;

var userList;
var offlineSpan;
var offlineModal;
var user;
var userInitial;
var userInvites;
var userFriends;
var modal;
var inviteNote;
var loadingTimer;
var offlineTimer;
var noteModal;
var noteInfoField;
var noteTitleField;
var noteSpan;
var notificationBtn;



function getCurrentUser(){
    try {
        user = JSON.parse(sessionStorage.validUser);
        console.log("User: " + user.userName + " loaded in");
        if (user.invites == undefined) {
            console.log("Invites Not Found");
            deployInviteListEmptyNotification();
            inviteListEmptyBool = true;
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
    userList = document.getElementById("dataListContainer");
    offlineModal = document.getElementById('offlineModal');
    offlineSpan = document.getElementById("closeOffline");
    inviteNote = document.getElementById('inviteNote');
    noteModal = document.getElementById('notificationModal');
    noteTitleField = document.getElementById('notificationTitle');
    noteInfoField = document.getElementById('notificationInfo');
    noteSpan = document.getElementById('closeNotification');
    modal = document.getElementById('myModal');
    getCurrentUser();
    commonInitialization();

    loadingTimer = setInterval(function(){
        loadingTimerInt = loadingTimerInt + 1000;
        if(loadingTimerInt >= 2000){
            var testGift = document.getElementById("TestGift");
            if (testGift == undefined){
                //console.log("TestGift Missing. Loading Properly.");
            } else if (!inviteListEmptyBool) {
                testGift.innerHTML = "Loading... Please Wait...";
            }
            clearInterval(loadingTimer);
        }
    }, 1000);

    databaseQuery();

    inviteConfirmButton();

    function inviteConfirmButton(){
        var nowConfirm = 0;
        var alternator = 0;
        console.log("Invite Button Feature Active");
        setInterval(function(){
            nowConfirm = nowConfirm + 1000;
            if(nowConfirm >= 3000){
                nowConfirm = 0;
                if(alternator == 0) {
                    alternator++;
                    document.getElementById("inviteNote").innerHTML = "Confirm";
                    inviteNote.style.background = "#00c606";
                } else {
                    alternator--;
                    document.getElementById("inviteNote").innerHTML = "Invites";
                    inviteNote.style.background = "#00ad05";
                }
            }
        }, 1000);
    }

    function databaseQuery() {

        userInitial = firebase.database().ref("users/");
        userFriends = firebase.database().ref("users/" + user.uid + "/friends");
        userInvites = firebase.database().ref("users/" + user.uid + "/invites");

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

                if(data.key == currentModalOpen) {//Moved currentModalOpen reference to common.js
                    closeModal(modal);
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

        var fetchFriends = function (postRef) {
            postRef.on('child_added', function (data) {
                if (!friendArr.includes(data.val()))
                    friendArr.push(data.val());
            });

            postRef.on('child_changed', function (data) {
                console.log(friendArr);
                friendArr[data.key] = data.val();
                console.log(friendArr);
            });

            postRef.on('child_removed', function (data) {
                console.log(friendArr);
                friendArr.splice(data.key, 1);
                console.log(friendArr);
            });
        };

        var fetchInvites = function (postRef) {
            postRef.on('child_added', function (data) {
                inviteArr.push(data.val());

                createInviteElement(data.val());
                inviteNote.style.background = "#ff3923";
            });

            postRef.on('child_changed', function (data) {
                inviteArr[data.key] = data.val();

                changeInviteElement(data.val());
            });

            postRef.on('child_removed', function (data) {
                sessionStorage.setItem("validUser", JSON.stringify(user));
                location.reload();
            });
        };

        fetchData(userInitial);
        fetchFriends(userFriends);
        fetchInvites(userInvites);

        listeningFirebaseRefs.push(userInitial);
        listeningFirebaseRefs.push(userFriends);
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

    function createInviteElement(inviteKey){
        try{
            document.getElementById("TestGift").remove();
        } catch (err) {}

        var inviteData;
        for (var i = 0; i < userArr.length; i++){
            if(inviteKey == userArr[i].uid){
                inviteData = userArr[i];
                break;
            }
        }

        var userUid = inviteData.uid;
        var inviteName = inviteData.name;
        var inviteUserName = inviteData.userName;
        var inviteShareCode = inviteData.shareCode;
        var liItem = document.createElement("LI");
        liItem.id = "user" + userUid;
        liItem.className = "gift";
        liItem.onclick = function (){
            var span = document.getElementsByClassName("close")[0];
            var inviteAdd = document.getElementById('userAccept');
            var inviteDelete = document.getElementById('userDelete');
            var inviteNameField = document.getElementById('userName');
            var inviteUserNameField = document.getElementById('userUName');
            var inviteShareCodeField = document.getElementById('userShareCode');

            if(inviteShareCode == undefined) {
                inviteShareCode = "This User Does Not Have A Share Code";
            }

            inviteNameField.innerHTML = inviteName;
            inviteUserNameField.innerHTML = "User Name: " + inviteUserName;
            inviteShareCodeField.innerHTML = "Share Code: " + inviteShareCode;

            inviteAdd.onclick = function(){
                addInvite(inviteData);
                closeModal(modal);
            };

            inviteDelete.onclick = function(){
                deleteInvite(userUid);
                closeModal(modal);
            };

            //show modal
            openModal(modal, userUid);

            //close on close
            span.onclick = function() {
                closeModal(modal);
            };

            //close on click
            window.onclick = function(event) {
                if (event.target == modal) {
                    closeModal(modal);
                }
            }
        };
        var textNode = document.createTextNode(inviteName);
        liItem.appendChild(textNode);

        userList.insertBefore(liItem, document.getElementById("dataListContainer").childNodes[0]);

        inviteCount++;
    }

    function changeInviteElement(inviteKey){
        var inviteData;
        for (var i = 0; i < userArr.length; i++){
            if(inviteKey == userArr[i].uid){
                inviteData = userArr[i];
                break;
            }
        }

        var userUid = inviteData.uid;
        var inviteName = inviteData.name;
        var inviteUserName = inviteData.userName;
        var inviteShareCode = inviteData.shareCode;
        var liItemUpdate = document.getElementById("user" + inviteData.uid);
        liItemUpdate.innerHTML = inviteName;
        liItemUpdate.className = "gift";
        liItemUpdate.onclick = function (){
            var span = document.getElementsByClassName("close")[0];
            var inviteAdd = document.getElementById('userAccept');
            var inviteDelete = document.getElementById('userDelete');
            var inviteNameField = document.getElementById('userName');
            var inviteUserNameField = document.getElementById('userUName');
            var inviteShareCodeField = document.getElementById('userShareCode');

            if(inviteShareCode == undefined) {
                inviteShareCode = "This User Does Not Have A Share Code";
            }

            inviteNameField.innerHTML = inviteName;
            inviteUserNameField.innerHTML = "User Name: " + inviteUserName;
            inviteShareCodeField.innerHTML = "Share Code: " + inviteShareCode;

            inviteAdd.onclick = function(){
                addInvite(inviteData);
                closeModal(modal);
            };

            inviteDelete.onclick = function(){
                deleteInvite(userUid);
                closeModal(modal);
            };

            //show modal
            openModal(modal, userUid);

            //close on close
            span.onclick = function() {
                closeModal(modal);
            };

            //close on click
            window.onclick = function(event) {
                if (event.target == modal) {
                    closeModal(modal);
                }
            }
        };
    }

    function addInvite(inviteData){
        console.log("Adding " + inviteData.uid);
        console.log(friendArr);

        var friendFriendArr;
        if(inviteData.friends == undefined || inviteData.friends == null) {
            friendFriendArr = [];
        } else {
            friendFriendArr = inviteData.friends;
        }

        friendFriendArr.push(user.uid);
        firebase.database().ref("users/" + inviteData.uid).update({
            friends: friendFriendArr
        });


        if (friendArr == undefined || friendArr == null || friendArr.length == 0){
            friendArr = [];
            friendArr.push(inviteData.uid);
            user.friends = [];
            user.friends.push(inviteData.uid);
        } else {
            friendArr.push(inviteData.uid);
            user.friends.push(inviteData.uid);
        }
        firebase.database().ref("users/" + user.uid).update({
            friends: friendArr
        });

        console.log(friendArr);

        deleteInvite(inviteData.uid);
    }

    function deleteInvite(uid) {
        var verifyDeleteBool = true;
        var toDelete = -1;

        console.log("Deleting Invite " + uid);
        for (var i = 0; i < inviteArr.length; i++){
            if(inviteArr[i] == uid) {
                toDelete = i;
                break;
            }
        }

        if(toDelete != -1) {
            inviteArr.splice(toDelete, 1);

            for (var i = 0; i < inviteArr.length; i++) {
                if (inviteArr[i] == uid) {
                    verifyDeleteBool = false;
                    break;
                }
            }
        } else {
            verifyDeleteBool = false;
        }

        if(verifyDeleteBool){
            var note = findUIDItemInArr(uid, userArr);
            if(user.notifications != undefined)
                for(var x = 0; i < user.notifications.length; x++)
                    if(user.notifications[x].includes(userArr[note].name))
                        if(user.notifications[x].split(",").length == 2)
                            setReadNotification(x);

            user.invites = inviteArr;
            firebase.database().ref("users/" + user.uid).update({
                invites: inviteArr
            });

            if(inviteArr.length == 0)
                newNavigation(4);//Invites
        }
    }

    function setReadNotification(uid) {
        var readNotificationArr = user.readNotifications;

        if (readNotificationArr != undefined) {
            var toSet = readNotificationArr.indexOf(user.notifications[uid]);
            if(toSet == -1){
                readNotificationArr.push(user.notifications[uid]);
                firebase.database().ref("users/" + user.uid).update({
                    readNotifications: readNotificationArr
                });
            }
        } else {
            readNotificationArr = [];
            readNotificationArr.push(user.notifications[uid]);
            firebase.database().ref("users/" + user.uid).update({readNotifications:{0:readNotificationArr}});
        }
    }
};

function deployInviteListEmptyNotification(){
    try{
        document.getElementById("TestGift").innerHTML = "No Invites Found! You Already Accepted All Your Invites!";
    } catch(err){
        console.log("Loading Element Missing, Creating A New One");
        var liItem = document.createElement("LI");
        liItem.id = "TestGift";
        liItem.className = "gift";
        var textNode = document.createTextNode("No Invites Found! Invite Some Friends On The Invites Page!");
        liItem.appendChild(textNode);
        userList.insertBefore(liItem, document.getElementById("dataListContainer").childNodes[0]);
    }

    clearInterval(offlineTimer);
}
