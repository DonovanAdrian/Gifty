var areYouStillThereBool = false;
var areYouStillThereInit = false;

var currentModalOpen = "";

var logoutReminder = 300;
var logoutLimit = 900;

var currentModalOpenObj = null;
var userChecker;
var dataListChecker;



function verifyElementIntegrity(arr){
    for(var i = 0; i < arr.length; i++){
        try {
            if (arr[i].innerHTML == undefined)
                console.log("WARNING: " + i + " UNDEFINED!");
            else if (arr[i].innerHTML == null)
                console.log("WARNING: " + i + " NULL!");
        } catch (err) {
            console.log("ERROR: Element " + i + " " + err.toString());
        }
    }
}

function instantiateCommon(){
    try {
        userChecker = JSON.parse(sessionStorage.validUser);
    } catch (err) {
        //console.log("No User Logged In...");
    }
    dataListChecker = document.getElementById('dataListContainer');
}

function commonInitialization(){
    const config = JSON.parse(sessionStorage.config);
    instantiateCommon();

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
                if(dataListChecker.innerHTML != null)
                    try{
                        document.getElementById("testGift").innerHTML = "Loading Failed, Please Connect To Internet";
                    } catch(err){
                        if(giftCounter == 0) {
                            console.log("Loading Element Missing, Creating A New One");
                            var liItem = document.createElement("LI");
                            liItem.id = "testGift";
                            liItem.className = "gift";
                            var textNode = document.createTextNode("Loading Failed, Please Connect To Internet");
                            liItem.appendChild(textNode);
                            dataListContainer.insertBefore(liItem, dataListChecker.childNodes[0]);
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

    if (userChecker != null)
        loginTimer();
}


function loginTimer(){
    var loginNum = 0;
    if (user.moderatorInt == 1)
        logoutLimit = 1800;
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
        closeModal(currentModalOpenObj);
        openModal(notificationModal, "noteModal");
        areYouStillThereInit = true;
    }
    notificationInfo.innerHTML = "You have been inactive for 5 minutes, you will be logged out in " + timeMins
        + ":" + timeSecs + "!";
    notificationTitle.innerHTML = "Are You Still There?";

    //close on close
    noteSpan.onclick = function() {
        closeModal(notificationModal);
        areYouStillThereBool = false;
        areYouStillThereInit = false;
    };
}

function ohThereYouAre(){
    notificationInfo.innerHTML = "Welcome back, " + user.name;
    notificationTitle.innerHTML = "Oh, There You Are!";

    var nowJ = 0;
    var j = setInterval(function(){
        nowJ = nowJ + 1000;
        if(nowJ >= 3000){
            closeModal(notificationModal);
            areYouStillThereBool = false;
            areYouStillThereInit = false;
            clearInterval(j);
        }
    }, 1000);

    //close on click
    window.onclick = function(event) {
        if (event.target == notificationModal) {
            closeModal(notificationModal);
            areYouStillThereBool = false;
            areYouStillThereInit = false;
        }
    };
}

function signOut(){
    sessionStorage.clear();
    window.location.href = "index.html";
}

function newNavigation(navNum) {
    sessionStorage.setItem("validUser", JSON.stringify(user));
    sessionStorage.setItem("userArr", JSON.stringify(userArr));
    var navLocations = [
        "404.html",//0
        "index.html",//1
        "home.html",//2
        "lists.html",//3
        "invites.html",//4
        "settings.html",//5
        "notifications.html",//6
        "boughtGifts.html",//7
        "giftAddUpdate.html",//8
        "friendList.html",//9
        "privateFriendList.html",//10
        "confirmation.html", //11
        "faq.html",//12
        "userAddUpdate.html",//13
        "moderation.html",//14
        "family.html",//15
        "familyUpdate.html"];//16

    if (navNum >= navLocations.length)
        navNum = 0;

    console.log("Navigating to " + navLocations[navNum]);
    window.location.href = navLocations[navNum];
}

function openModal(openThisModal, modalName){
    currentModalOpenObj = openThisModal;
    currentModalOpen = modalName;
    openThisModal.style.display = "block";
    console.log("Modal Opened: " + modalName);
}

function closeModal(closeThisModal){
    try {
        currentModalOpenObj = null;
        currentModalOpen = "";
        closeThisModal.style.display = "none";
        console.log("Modal Closed");
    } catch (err) {
        console.log("Modal Not Open");
    }
}
