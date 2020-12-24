var faqElements = [];
var userArr = [];
var supportArr = [];

var offlineSpan;
var offlineModal;
var emailBtn;
var user;
var inviteNote;
var settingsNote;
var notificationModal;
var notificationInfo;
var notificationTitle;
var noteSpan;



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
        userArr = JSON.parse(sessionStorage.userArr);
    } catch (err) {
        console.log(err.toString());
        window.location.href = "index.html";
    }
}

window.onload = function instantiate() {

    emailBtn = document.getElementById('emailBtn');
    offlineModal = document.getElementById('offlineModal');
    offlineSpan = document.getElementById("closeOffline");
    inviteNote = document.getElementById('inviteNote');
    settingsNote = document.getElementById('settingsNote');
    notificationModal = document.getElementById('notificationModal');
    notificationTitle = document.getElementById('notificationTitle');
    notificationInfo = document.getElementById('notificationInfo');
    noteSpan = document.getElementById('closeNotification');
    faqElements = [emailBtn, offlineModal, offlineSpan, inviteNote, settingsNote, notificationModal, notificationTitle,
        notificationInfo, noteSpan];
    verifyElementIntegrity(faqElements);
    getCurrentUser();
    commonInitialization();

    emailBtn.onclick = function () {
        var supportStr = genSupport();
        window.open('mailto:gifty.application@gmail.com?subject=Gifty Support #' + supportStr +
            '&body=Hey Gifty Support, %0D%0A%0D%0A%0D%0A%0D%0A Sincerely, ' + user.userName);
    };

    function genSupport() {
        var supportCode = "";
        for(var i = 0; i < 16; i++){
            supportCode = supportCode + randomizer();
        }
        addSupportToDB(supportCode);
        return supportCode;
    }

    function addSupportToDB(supportCode) {
        var supportCount = 0;
        try{
            supportCount = supportArr.length;
        } catch (err) {

        }
        console.log(supportCode);
        console.log(supportCount);
        firebase.database().ref("users/" + user.uid + "/support/" + supportCount).push();
        firebase.database().ref("users/" + user.uid + "/support/" + supportCount).set({
            supportCount: supportCount,
            supportString: supportCode
        });
    }

    function randomizer() {
        var alphabet = "123456789ABCDEFGHIJKLMNPQRSTUVWXYZ";
        var selector = Math.floor((Math.random() * alphabet.length));
        var charSelect = alphabet.charAt(selector);
        return charSelect;
    }

    settingsFAQButton();

    function settingsFAQButton(){
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
                    document.getElementById("settingsNote").innerHTML = "FAQ";
                    settingsNote.style.background = "#00ad05";
                }
            }
        }, 1000);
    }
};
