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
    "The users in this family are not active enough on Gifty.",
    "There were not enough family members signed up.",                      //25
    "There were not enough members in the family.",
    "). This failure was possibly due to:",
    "Failed Calling Automatic Control For ",
    "Secret Santa Automatic Control successfully changed",
    "Successfully shuffled the family,",                           //30
    "Successfully assigned the members of the family,",
    "has opened their warning",
    "Login disabled message reset by",
    "Login enabled by",
    "found an easter egg!",                          //35
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
    " mediumSev",
    " mediumSev",        //25
    " mediumSev",
    " mediumSev",
    " mediumSev",
    " lowSev",
    " lowSev",      //30
    " lowSev",
    " lowSev",
    " lowSev",
    " lowSev",
    " lowSev",      //35
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
    " - Failed To Auto-Set Secret Santa (Inactivity)",
    " - Failed To Auto-Set Secret Santa (Sign Ups)",                          //25
    " - Failed To Auto-Set Secret Santa (Membership)",
    " - Failed To Auto-Set Secret Santa (Assignments)",
    " - Failed To Initialize Automatic Control",
    " - Performed Secret Santa Automatic Control",
    " - Shuffled Secret Santa",                       //30
    " - Assigned Secret Santa",
    " - A Warned User Was Successfully Notified",
    " - Login Message Reset",
    " - Login Enabled",
    " - Easter Egg Found!",                         //35
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

function evaluateInitialTicketTimeline(newestTicketElement, oldestTicketElement) {
    let newestTicketDayCounterText = "";
    let oldestTicketDayCounterText = "";
    let localizedTicketTime;
    let diffTwoDates = 0;
    let newestTicketTime;
    let oldestTicketTime = 0;
    commonToday = new Date();

    if (ticketArr.length > 0) {
        localizedTicketTime = new Date(getLocalTime(ticketArr[0].time));
        newestTicketTime = Math.floor((Date.parse(commonToday) - Date.parse(localizedTicketTime)) / 86400000);
    } else {
        newestTicketDayCounterText = "No Tickets Yet!";
        oldestTicketDayCounterText = "No Tickets Yet!";
    }

    for (let i = 0; i < ticketArr.length; i++) {
        localizedTicketTime = new Date(getLocalTime(ticketArr[i].time));
        diffTwoDates = (Math.floor((Date.parse(commonToday) - Date.parse(localizedTicketTime)) / 86400000));
        if (diffTwoDates > oldestTicketTime) {
            oldestTicketTime = diffTwoDates;
        }
        if (diffTwoDates < newestTicketTime) {
            newestTicketTime = diffTwoDates;
        }
    }
    console.log(newestTicketTime);

    if (ticketArr.length > 0) {
        if (oldestTicketTime == 0) {
            oldestTicketDayCounterText = "Today";
        } else if (oldestTicketTime == 1) {
            oldestTicketDayCounterText = "Yesterday";
        } else if (oldestTicketTime > 1 && oldestTicketTime < 7) {
            oldestTicketDayCounterText = "Approx. " + oldestTicketTime + " Days Ago";
        } else if (oldestTicketTime >= 7 && oldestTicketTime < 14) {
            oldestTicketDayCounterText = "Approx. A Week Ago";
        } else if (oldestTicketTime >= 14 && oldestTicketTime < 32) {
            oldestTicketDayCounterText = "Approx. A Month Ago";
        } else if (oldestTicketTime >= 32 && oldestTicketTime < 366) {
            oldestTicketDayCounterText = "Within A Year";
        } else {
            oldestTicketDayCounterText = "A While Ago";
        }

        if (newestTicketTime == 0) {
            newestTicketDayCounterText = "Today";
        } else if (newestTicketTime == 1) {
            newestTicketDayCounterText = "Yesterday";
        } else if (newestTicketTime > 1 && newestTicketTime < 366) {
            newestTicketDayCounterText = "Approx. " + newestTicketTime + " Days Ago";
        } else {
            newestTicketDayCounterText = "A While Ago";
        }
    }

    newestTicketElement.innerHTML = "Newest Ticket: " + newestTicketDayCounterText;
    oldestTicketElement.innerHTML = "Oldest Ticket: " + oldestTicketDayCounterText;
}
