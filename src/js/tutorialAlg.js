/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let tutorialElements = [];

let moderationTableOfContentsDiv;
let moderationTutorialContentDiv;
let settingsNote;
let settingsNote2;
let notificationBtn2;
let customAlternateButtonTimer;



function getCurrentUser() {
    getCurrentUserCommon();

    if (user.moderatorInt == 1) {
        moderationTableOfContentsDiv.style.display = "block";
        moderationTutorialContentDiv.style.display = "block";
    } else {
        moderationTableOfContentsDiv.style.display = "none";
        moderationTutorialContentDiv.style.display = "none";
    }
}

window.onload = function instantiate() {
    initializeTutorialPage();

    function initializeTutorialPage() {
        try {
            failedNavNum = 18;
            pageName = "Tutorial";
            inviteNote = document.getElementById("inviteNote");
            settingsNote = document.getElementById("settingsNote");
            settingsNote2 = document.getElementById("settingsNote2");
            notificationBtn = document.getElementById("notificationButton");
            notificationBtn2 = document.getElementById("notificationButton2");
            moderationTableOfContentsDiv = document.getElementById("moderationTableOfContentsDiv");
            moderationTutorialContentDiv = document.getElementById("moderationTutorialContentDiv");

            getCurrentUser();
            commonInitialization();
            flickerNotification();
            customFlickerNotification();

            tutorialElements = [offlineModal, offlineSpan, inviteNote, settingsNote, settingsNote2, notificationBtn,
                notificationBtn2, moderationTableOfContentsDiv, moderationTutorialContentDiv, notificationModal,
                notificationTitle, notificationInfo, noteSpan];

            verifyElementIntegrity(tutorialElements);
            alternateButtonLabel(settingsNote, "Settings", "Tutorial");
            customAlternateButtonLabel(settingsNote2, "Settings", "Tutorial");

            userInitial = firebase.database().ref("users/");

            databaseQuery();

            emailBtn.onclick = function () {
                let supportStr = genSupport();
                window.open("mailto:gifty.application@gmail.com?subject=Gifty Support #" + supportStr +
                    "&body=Hey Gifty Support, %0D%0A%0D%0A%0D%0A%0D%0A Sincerely, " + user.userName);
            };
        } catch (err) {
            sendCriticalInitializationError(err);
        }
    }

    function databaseQuery() {
        let fetchData = function (postRef) {
            postRef.on("child_added", function (data) {
                clearInterval(commonLoadingTimer);
                clearInterval(offlineTimer);
                let i = findUIDItemInArr(data.key, userArr, true);
                if (i != -1) {
                    localObjectChanges = findObjectChanges(userArr[i], data.val());
                    if (localObjectChanges.length != 0) {
                        userArr[i] = data.val();

                        if (data.key == user.uid) {
                            user = data.val();
                        }
                        saveCriticalCookies();
                    }
                } else {
                    userArr.push(data.val());

                    if (data.key == user.uid) {
                        user = data.val();
                    }
                    saveCriticalCookies();
                }
            });

            postRef.on("child_changed", function (data) {
                let i = findUIDItemInArr(data.key, userArr, true);
                if (i != -1) {
                    localObjectChanges = findObjectChanges(userArr[i], data.val());
                    if (localObjectChanges.length != 0) {
                        if (consoleOutput)
                            console.log("Updating " + userArr[i].userName + " to most updated version: " + data.val().userName);
                        userArr[i] = data.val();

                        if (data.key == user.uid) {
                            user = data.val();
                            updateFriendNav(user.friends);
                            if (consoleOutput)
                                console.log("Current User Updated");
                        }
                        saveCriticalCookies();
                    }
                }
            });

            postRef.on("child_removed", function (data) {
                let i = findUIDItemInArr(data.key, userArr);
                if (i != -1) {
                    userArr.splice(i, 1);
                    saveCriticalCookies();
                }
            });
        };

        fetchData(userInitial);

        listeningFirebaseRefs.push(userInitial);
    }
};

function customFlickerNotification() {
    let flickerTimer = 0;
    let flickerAlternator = 0;
    let normalFilter = "grayscale(0%)";
    let applyFilter = "grayscale(75%)";
    let normalOpacity = "1";
    let applyOpacity = "0.75";


    if (consoleOutput)
        console.log("Notification Feature 2 Active");
    notificationBtn2.src = "img/bellNotificationOn.png";
    setInterval(function() {
        flickerTimer = flickerTimer + 1000;
        if (flickerTimer >= 1000) {
            flickerTimer = 0;
            flickerAlternator++;
            if (flickerAlternator == 0) {
                notificationBtn2.style.filter = applyFilter;
                notificationBtn2.style.opacity = applyOpacity;
            } else if (flickerAlternator == 1) {
                notificationBtn2.style.filter = normalFilter;
                notificationBtn2.style.opacity = normalOpacity;
            } else if (flickerAlternator == 2) {
                notificationBtn2.style.filter = applyFilter;
                notificationBtn2.style.opacity = applyOpacity;
            } else if (flickerAlternator == 3) {
                notificationBtn2.style.filter = normalFilter;
                notificationBtn2.style.opacity = normalOpacity;
            } else if (flickerAlternator == 4) {
                notificationBtn2.style.filter = applyFilter;
                notificationBtn2.style.opacity = applyOpacity;
            } else if (flickerAlternator <= 12) {
                notificationBtn2.style.filter = normalFilter;
                notificationBtn2.style.opacity = normalOpacity;
            } else {
                flickerAlternator = 0;
                notificationBtn2.style.filter = applyFilter;
                notificationBtn2.style.opacity = applyOpacity;
            }
        }
    }, 750);
}

function customAlternateButtonLabel(button, parentLabel, childLabel) {
    let nowConfirm = 0;
    let alternator = 0;
    clearInterval(customAlternateButtonTimer);
    if (consoleOutput)
        console.log(childLabel + " Button 2 Feature Set");
    customAlternateButtonTimer = setInterval(function() {
        nowConfirm = nowConfirm + 1000;
        if (nowConfirm >= 3000) {
            nowConfirm = 0;
            if (alternator == 0) {
                alternator++;
                button.innerHTML = parentLabel;
                button.style.background = "rgba(200, 200, 200, 0.5)";
            } else {
                alternator--;
                button.innerHTML = childLabel;
                button.style.background = "rgba(200, 200, 200, 0.75)";
            }
        }
    }, 1000);
}

function genSupport() {
    let supportCode = "";
    for(let i = 0; i < 16; i++){
        supportCode = supportCode + randomizer();
    }
    addSupportToDB(supportCode);
    return supportCode;
}

function addSupportToDB(supportCode) {
    let supportCount = 0;
    try{
        supportCount = supportArr.length;
    } catch (err) {

    }
    if(consoleOutput) {
        console.log(supportCode);
        console.log(supportCount);
    }
    firebase.database().ref("users/" + user.uid + "/support/" + supportCount).push();
    firebase.database().ref("users/" + user.uid + "/support/" + supportCount).set({
        supportCount: supportCount,
        supportString: supportCode
    });
}

function randomizer() {
    let alphabet = "123456789ABCDEFGHIJKLMNPQRSTUVWXYZ";
    let selector = Math.floor((Math.random() * alphabet.length));
    let charSelect = alphabet.charAt(selector);
    return charSelect;
}
