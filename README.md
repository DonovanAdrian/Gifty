# Gifty
> made by Donovan Adrian in JavaScript, HTML, and CSS


## Welcome!
This website is meant to be a free gift list registry that
aims at eliminating the double-buying of gifts. My personal
goal here was to offer something to my family that would
give an extra layer of confidence when buying gifts for each
other. Getting two of everything isn't usually as fun as it sounds!


## What Are Some Possible Use Cases For This Program?
As mentioned before, the primary use for this program is to
be utilized as a gift list registry for my family. As such,
this could easily be used among families, friends, clubs, parties...
You name it! Ideally, this should only be deployed in "small"
use cases. Overall this was only designed with one family in mind,
with the ability to "expand" to a larger group... But not the world.
Speaking of... It should be noted that I have NO current plans
to release this to the world besides this repository on GitHub.
As a result, the strengths of this system rely on the "small"
use cases being deployed, especially with Firebase's stringent
(free) data limits.


## Do You Have Any Other Plans For This Program?
I've been hard at work bringing Gifty up to the point where it
is now... It's been a passion project for over 5 years. It started
as an Android app in 2018 and evolved into a "web-app" as time
went on. As of writing this at the beginning of 2024, I'm going to
start winding down on my plans for this project. Any latent ideas 
that I had for this project will trickle it's way into this 
repository someday.


## How Do I Set This Up For My Family And Friends?
The easiest way to set this up for yourself is to use
Google's Firebase Realtime Database in conjunction with
Google's Firebase Hosting. While it gets a little bit
technical, the best I can do is to provide the following
step-by-step list below. See the "Gifty Setup Tutorial"
section for more details on this!


## Great, Now I'm All Set Up! How Do I Use Gifty?
Once you've gotten Gifty all set up, create your first
account on the login! The first user will automatically 
be designated a moderator in the Gifty system. Once 
logged in, navigate to the "Settings" tab on the 
navigation bar, then click on "Tutorial". This page is
where you will find all the information you will need to
get started and use Gifty to the fullest!


## Gifty Setup Tutorial
Before beginning, please be sure to read all the following steps
THOROUGHLY before beginning any hands-on work. It will help to be
acquainted with the general process to ensure smooth sailing!
Additionally, the supplemental links below may be helpful in the following
step-by-step process. Please allow at least an hour to get everything
all set up and please be patient! Rome wasn't built in a day ;)

https://firebase.google.com/docs/database/web/start

https://firebase.google.com/docs/cli

- 1, Download the most recent version of Gifty.
- 2, Set up a Firebase Project at the following link,
  following the necessary prompts:
  - https://console.firebase.google.com/project/_/database
  - After creating your project, you will be brought to what
    is called the "Firebase Console". Go to the Project
    Overview page of your project and select "Web" under the
    "Add an app to get started" section (It may look like this:
    "</>").
  - Follow the registration setup prompts and select "Also
    set up Firebase Hosting for this app".
  - If you have other plans for hosting your Gifty deployment, 
    then Firebase Hosting can be ignored.
    - Once you reach step two of the Firebase setup, your 
      firebaseConfig info should now be generated and look 
      something like this:
      - const firebaseConfig = {
      - apiKey: "AtaxStyhBwVcVh0rD4T6HBu9O3xTB0vcW-NPpl0",
      - authDomain: "test-projects.firebaseapp.com",
      - projectId: "test-projects",
      - storageBucket: "test-projects.appspot.com",
      - messagingSenderId: "659853605215",
      - appId: "1:659853605215:web:a2r6fc94f2h6db035fb587",
      - measurementId: "G-9EIWMCLYSK"
      - };
    - Copy and paste this section of "code" into a text
      document, this will be important in the next step.
    - It will also be important to set your Realtime Database
      rules sooner than later. This can be done by accessing your
      Firebase Console and navigating to Realtime Database > Rules
      and setting both ".read" and ".write" to "true"
      - Because Gifty does not use Google's authentication system,
        authentication is NOT necessary to access Gifty. If this is
        not properly set up, then your iteration of Gifty may be
        inaccessible.
- 3, Open the Gifty release files that you downloaded in
  step 1 and navigate to /src/txt/config.txt
- 4, Copy and paste each "variable" INDIVIDUALLY into it's
  respective slot.
  - Using the example above, instead of
    [measurementId: "MEASUREMENTIDGOESHERE"],
    it should be [measurementId: "G-9EIWMCLYSK"]
- 5, Deploy Gifty (This is where it may get a little tricky)
  - If you are using Firebase Hosting, these deployment steps will
    apply to you. Otherwise, continue with your alternate deployment 
    method.
  - In the Firebase Console, navigate to Build > Hosting and
    click on "Get Started". Follow the steps that are displayed
    by using a console (this varies depending on your Operating
    System)
    - It will help to already have a pre-designated folder where
      you will be storing the Gifty files, even temporarily. Once
      you have finished deploying though, you will be able to delete
      the folder, if desired.
- 6, Once you have completed the console deployment, navigate
  to the new web address of your iteration of Gifty and give it
  a test drive! Create an account, make some gifts, and invite
  some friends and family to start using it!



---------------------------------------------------

---------------------------------------------------

---------------------------------------------------

Everything below this point is supplemental data for those who are curious!


## General Website Structure
- index
  - userAddUpdate *\(The first user on the database is given the moderator role)*
  - *USER LOGGED IN*
    - home
      - boughtGifts
      - giftAddUpdate
    - lists
      - friendList
      - privateFriendList
    - invites
      - confirmation
    - settings
      - faq
        - email form
      - tutorial
      - moderationQueue *\(Moderator Role Only)*
      - moderation *\(Moderator Role Only)*
        - friendList
      - family *\(Moderator Role Only)*
        - familyUpdate *\(Moderator Role Only)*
      - backup *\(Moderator Role Only, Coming Soon)*
    - notifications *\(Accessible from **almost** all pages)*
- 404

## General Code Structure (Per Each Page)

- indexAlg, commonAlg, passOp
  - userAddUpdateAlg, commonAlg, passOp
    - homeAlg, commonAlg
      - boughtGiftAlg, commonAlg
      - giftAddUpdateAlg, commonAlg
    - listsAlg, commonAlg, secretSantaAlg
      - friendListAlg, commonAlg
      - privateFriendListAlg, commonAlg
    - invitesAlg, commonAlg
      - confirmationAlg, commonAlg
    - settingsAlg, commonAlg
      - faqAlg, commonAlg
      - tutorialAlg, commonAlg
      - moderationQueueAlg, commonAlg, moderationCommonAlg
      - moderationAlg, commonAlg, moderationCommonAlg, passOp
        - friendListAlg, commonAlg
      - familyAlg, secretSantaAlg, commonAlg
        - familyUpdateAlg, commonAlg
      - backupAlg, commonAlg *(Coming Soon)*
    - notificationAlg, commonAlg
