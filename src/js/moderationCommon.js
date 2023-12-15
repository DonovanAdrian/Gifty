/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let ticketTitles = [
    "Critical Error",
    "Critical Initialization Error",
    "attempted to remove friend",
    "attempted to add friend",
    "Invalid Login Attempt:",                              //5
    "Element Verification Failure",
    "encountered a modal that failed to reopen!",
    "experienced degraded performance",
    "Login Error Occurred",
    "attempted to access a restricted page",              //10
    "forced the moderation modal to appear",
    "failed to connect to the private list owned by",
    "Notification delete failed",
    "Gift delete failed",
    "Gift update failed for user",                          //15
    "Attempting to delete user",
    "Invalid Login Attempt During Maintenance Period:",
    "attempted to log in",
    "Login disabled by",
    "URL Limiter disabled by",                                 //20
    "URL Limiter set by",
    "Gift List Fix Performed",
    "Database limits set by",
    "has opened their warning",
    "Login disabled message reset by",                      //25
    "Login enabled by",
    "found an easter egg!",
    "found an easter egg... But got greedy",
    "found an easter egg..."
];

let ticketSeverities = [
    " highSev",
    " highSev",
    " highSev",
    " highSev",
    " highSev",       //5
    " highSev",
    " highSev",
    " highSev",
    " highSev",
    " highSev",       //10
    " highSev",
    " highSev",
    " highSev",
    " highSev",
    " highSev",     //15
    " mediumSev",
    " mediumSev",
    " mediumSev",
    " mediumSev",
    " mediumSev",     //20
    " mediumSev",
    " mediumSev",
    " mediumSev",
    " lowSev",
    " lowSev",        //25
    " lowSev",
    " lowSev",
    " lowSev",
    " lowSev"
];

let ticketSuffixes = [
    " - !!Critical Error Occurred!!",
    " - !!Critical Error Occurred!!",
    " - !!Friend Removal Error!!",
    " - !!Invite Removal Error!!",
    " - !!Invalid Login Attempt!!",                        //5
    " - Element Verification Failure",
    " - A Modal Failed To Reopen",
    " - Degraded Performance Experienced",
    " - !!Login Error!!",
    " - A Restricted Page Was Accessed",                //10
    " - A Restricted Window Was Forced Open",
    " - Gift List Connection Failed",
    " - Notification Delete Failed",
    " - Gift Delete Failed",
    " - Gift Update Failed",                            //15
    " - Attempt To Delete User",
    " - !!Invalid Login Attempt During Maintenance!!\"",
    " - A Banned User Attempted Login",
    " - Login Disabled",
    " - URL Limits Disabled",                          //20
    " - URL Limits Set",
    " - Automatic Gift List Fix Performed",
    " - Database Limits Set",
    " - A Warned User Was Successfully Notified",
    " - Login Message Reset",                          //25
    " - Login Enabled",
    " - Easter Egg Found!",
    " - Easter Egg Found...",
    " - Easter Egg Found...?"
];

let ticketSeverityFail = " highSev";
let ticketTitleSuffixFail = " - Ticket Title Unavailable, Open For More Details!";

function fetchModerationTitle(moderationData) {
    let localTime = getLocalTime(moderationData.time);
    let ticketTitleText;
    let ticketTitleSuffix;
    let ticketTitleFound = false;

    for (let i = 0; i < ticketTitles.length; i++) {
        if (moderationData.details.includes(ticketTitles[i])) {
            ticketTitleSuffix = ticketSuffixes[i];
            ticketTitleFound = true;
            break;
        }
    }

    if (!ticketTitleFound)
        ticketTitleSuffix = ticketTitleSuffixFail;

    ticketTitleText = localTime + ticketTitleSuffix;

    return ticketTitleText;
}

function fetchModerationTicketData(moderationData) {
    let ticketReturnText;
    let ticketTitleSuffix;
    let ticketTitleSev;
    let ticketTitleFound = false;

    for (let i = 0; i < ticketTitles.length; i++) {
        if (moderationData.details.includes(ticketTitles[i])) {
            ticketTitleSuffix = ticketSuffixes[i];
            ticketTitleSev = ticketSeverities[i];
            ticketTitleFound = true;
            break;
        }
    }

    if (!ticketTitleFound) {
        ticketTitleSuffix = ticketTitleSuffixFail;
        ticketTitleSev = ticketSeverityFail;
    }

    ticketReturnText = ticketTitleSuffix + ",,," + ticketTitleSev;

    return ticketReturnText;
}
