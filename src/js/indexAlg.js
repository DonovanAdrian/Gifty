/**
 * ----------------------------------------------------------------------------------------------
 * Congrats! You're looking at my code, most everything here has been
 * repurposed from Google's Firebase as well as ideas and assets from
 * www.w3schools.com. Google's example can be found at:
 * https://github.com/firebase/quickstart-js
 * ----------------------------------------------------------------------------------------------
 *
 * ToDo:
 * Test userAddUpdate data.key update/delete functions (updates/removes usernames from arrays, check that they work)
 * Test userAddUpdate delete user function (firebase remove function NOT active)
 *
 *
 * ----------------------------------------------------------------------------------------------
 *
 * OTHER PLANS:
 * Create Moderator
 * Add decoder to moderator
 * Notifications
 * (bell at bottom left of screen)
 *  -Let's users know about server outages or upgrades
 *  -Email sign up? Automatic email dispatch for invitations?
 *
 *   OTHER STUFF:
 *    -Upon deleting all gifts, create a new "Test Gift" id that says "You no longer have any gifts"
 *    -Edit TestGifts to give hints about where to go. (At home, add a gift! At lists, no friends, send an invite?)
 *    -Settings "Invite notification" (Button turns red) not working
 *    -Change cleanArray to be included in ALL files
 *    -Bonus Points: Clean all user arrays upon login (only of user, not ALL users...)
 *    -CHANGE TESTGIFT (Do not remove) TO SAY "YOU HAVE A PENDING INVITE, GO TO INVITES TAB TO ACCEPT"
 *    -Only remove testgift if needed
 *    -Bonus Points: In Invite Tab, Change Test Gift To Say "Click On The Letter Icon Below To Accept Invites"
 *
 *   !!!-Confirmation-Users not properly being allocated... Almost fixed
 *    -Test end of list, throws error at child_changed?
 *   !!!-Invites-Users not properly being allocated
 *    -Use Confirmation style boi, copy - paste and redefine? Fix Confirmation first though ^^
 *   !!!-FriendList Buy/UnBuy Gifts
 *    -Buy/UnBuy Triggers notification when buying multiple gifts at once, Maybe fixed?
 *
 *
 *
 *   After Initial Release:
 *
 *   -"Error Logs"
 *    -Scatter bools around apps to ensure completion of operations
 *    -If bools are incomplete, push data to an error list in server
 *    -Set location, current user, bools, and other relevant data
 *    -Consent to data sharing to devs to help make the app better?
 *
 *   -"Sent Invite Lists"
 *    -Show as pending
 *    -Remove properly after invite completion
 *
 *   -"Private Gift Lists"
 *    -A gift list that the user cannot see but their friends can
 *    -"Hey this would be cool" but they don't add it to their list

 -Gift List Comments (Did you mean to say this?)
 -Gift turns red when there is a notification
 *
 *
 * ----------------------------------------------------------------------------------------------
 *
 * IMPORTANT RELOAD UPDATE:
 *
 * USE THIS FUNCTION:
 reloadTimer();

 function reloadTimer(){
    var reloadNum = 0;
    var reloadCount = 0;
    var reloadBool = true;
    //console.log("Reload Timer Started");
    var rel = setInterval(function(){
      reloadNum = reloadNum + 1;
      if (reload && reloadNum >= 60 && reloadBool) {//reload 1min
        //console.log("Reload 1");
        location.reload();
      } else if (reloadNum >= 60 && reloadBool) {//no reload 1min
        //console.log("No Reload, 1 - " + reloadCount);
        reloadCount+=1;
        if (reloadCount>10) {
          reloadBool = false;
        }
        reloadNum = 0;
      } else if (reload && reloadNum >= 600){//reload 10min
        //console.log("Reload 10");
        location.reload();
      } else if (reloadNum >= 600){//no reload 10min
        //console.log("No Reload... 10");
        reloadNum = 0;
      }
    }, 1000);
  }
 *
 * DECLARE RELOAD AT TOP:
 var reload = false;
 *
 * ADD RELOAD TO DATA_CHANGED AND DATA_DELETED:
 reload=true;
 *
 *
 * ----------------------------------------------------------------------------------------------
 */

var listeningFirebaseRefs = [];
var userArr = [];

var loginBool = false;
var reload = false;

var userInitial;
var username;
var pin;
var offlineSpan;
var offlineModal;
var validUser;


//Instantiates all data upon loading the webpage
window.onload = function instantiate() {

  username = document.getElementById("username");
  pin = document.getElementById("pin");

  offlineModal = document.getElementById('offlineModal');
  offlineSpan = document.getElementById("closeOffline");

  const config = {
    //Oops! This is gone!
  };
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
    offlineModal.style.display = "none";
    location.reload();
  });

  window.addEventListener("offline", function() {
    var now = 0;
    var g = setInterval(function(){
      now = now + 1000;
      if(now >= 5000){
        offlineModal.style.display = "block";
        clearInterval(g);
      }
    }, 1000);
  });

  //close offlineModal on close
  offlineSpan.onclick = function() {
    offlineModal.style.display = "none";
  };

  //close offlineModal on click
  window.onclick = function(event) {
    if (event.target == offlineModal) {
      offlineModal.style.display = "none";
    }
  };

  reloadTimer();

  function reloadTimer(){
    var reloadNum = 0;
    var reloadCount = 0;
    var reloadBool = true;
    var rel = setInterval(function(){
      reloadNum = reloadNum + 1;
      if (reload && reloadNum >= 60 && reloadBool) {//reload 1min
        location.reload();
      } else if (reloadNum >= 60 && reloadBool) {//no reload 1min
        reloadCount+=1;
        if (reloadCount>10) {
          reloadBool = false;
        }
        reloadNum = 0;
      } else if (reload && reloadNum >= 600){//reload 10min
        location.reload();
      } else if (reloadNum >= 600){//no reload 10min
        reloadNum = 0;
      }
    }, 1000);
  }

  databaseQuery();

  function databaseQuery() {

    userInitial = firebase.database().ref("users/");

    var fetchPosts = function (postRef) {
      postRef.on('child_added', function (data) {
        userArr.push(data);
      });

      postRef.on('child_changed', function (data) {
        reload=true;
      });

      postRef.on('child_removed', function (data) {
        reload=true;
      });
    };

    fetchPosts(userInitial);

    listeningFirebaseRefs.push(userInitial);
  }
};


function login() {
  for(var i = 0; i < userArr.length; i++){
    if(userArr[i].userName.toLowerCase() == username.value.toLowerCase()){
      try {
        if(decode(userArr[i].encodeStr) == pin.value){
          loginBool = true;
        } else {

        }
      } catch (err) {
        if(userArr[i].pin == pin.value){
          loginBool = true;
        } else {

        }
      }
    }
    if(loginBool === true){
      break;
    }
  }
  if (loginBool === true){
    document.getElementById("loginInfo").innerHTML = "User Authenticated";
    validUser = userArr[i];
    sessionStorage.setItem("validUser", validUser);
    sessionStorage.setItem("userArr", userArr);
    window.location.href = "home.html";
  } else if (loginBool === false) {
    document.getElementById("loginInfo").innerHTML = "Username or Password Incorrect";
  }
}

function signUp(){
  window.location.href = "userAddUpdate.html";
}
