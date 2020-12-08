var userArr = [];

var editBtn;
var faqBtn;
var modBtn;
var offlineTimer;
var offlineSpan;
var offlineModal;
var inviteNote;
var user;
var noteModal;
var noteInfoField;
var noteTitleField;
var noteSpan;
var modal;



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
        if (user.moderatorInt == 1) {
            modBtn.style.display = "block";
            modBtn.onclick = function () {
                newNavigation(14);//Moderation
            }
        }
        userArr = JSON.parse(sessionStorage.userArr);
    } catch (err) {
        console.log(err.toString());
        window.location.href = "index.html";
    }
}

window.onload = function instantiate() {

    offlineModal = document.getElementById('offlineModal');
    offlineSpan = document.getElementById("closeOffline");
    inviteNote = document.getElementById('inviteNote');
    editBtn = document.getElementById("edit");
    faqBtn = document.getElementById("faq");
    modBtn = document.getElementById("mod");
    noteModal = document.getElementById('notificationModal');
    noteTitleField = document.getElementById('notificationTitle');
    noteInfoField = document.getElementById('notificationInfo');
    noteSpan = document.getElementById('closeNotification');
    modal = document.getElementById('myModal');
    getCurrentUser();
    commonInitialization();

    editBtn.onclick = function (){
        newNavigation(13);//UserAddUpdate
    };

    faqBtn.onclick = function (){
        newNavigation(12);//FAQ
    };
};
