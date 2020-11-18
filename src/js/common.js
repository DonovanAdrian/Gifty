function newNavigation(num) {
    switch(num){
        case 1:
            window.location.href = "index.html";
            break;
        case 2:
            window.location.href = "home.html";
            break;
        case 3:
            window.location.href = "lists.html";
            break;
        case 4:
            window.location.href = "invites.html";
            break;
        case 5:
            window.location.href = "settings.html";
            break;
        case 6:
            window.location.href = "notifications.html";
            break;
        case 7:
            window.location.href = "boughtGifts.html";
            break;
        case 8:
            window.location.href = "giftAddUpdate.html";
            break;
        case 9:
            window.location.href = "friendList.html";
            break;
        case 10:
            window.location.href = "privateFriendList.html";
            break;
        case 11:
            window.location.href = "confirmation.html";
            break;
        case 12:
            window.location.href = "faq.html";
            break;
        case 13:
            window.location.href = "userAddUpdate.html";
            break;
        case 14:
            window.location.href = "moderation.html";
            break;
        default:
            window.location.href = "404.html";
            break;
    }
}

function openModal(openThisModal, modalName){
    currentModalOpen = modalName;
    openThisModal.style.display = "block";
}

function closeModal(closeThisModal){
    currentModalOpen = "";
    closeThisModal.style.display = "none";
}
