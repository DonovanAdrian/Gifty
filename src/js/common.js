var currentModalOpen = "";

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
        "moderation.html"];//14

    if (navNum >= navLocations.length)
        navNum = 0;

    console.log("Navigating to " + navLocations[navNum]);
    window.location.href = navLocations[navNum];
}

function openModal(openThisModal, modalName){
    currentModalOpen = modalName;
    openThisModal.style.display = "block";
    console.log("Modal Opened: " + modalName);
}

function closeModal(closeThisModal){
    try {
        currentModalOpen = "";
        closeThisModal.style.display = "none";
        console.log("Modal Closed");
    } catch (err) {
        console.log("Modal Not Open");
    }
}
