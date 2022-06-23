# Gifty
> made by Donovan Adrian in JavaScript, HTML, and CSS


## Welcome!
This website is meant to be a gift list registry that
aims at eliminating the double-buying of gifts. My personal
goal here was to offer something to my family that would
give an extra layer of confidence when buying gifts for each
other. Getting two of everything isn't as fun as it sounds!
In order to solve this problem, I enlisted Google Firebase
to follow through with all database and hosting operations, 
while I handled all the data processing operations on the 
front end.


## How Well Does This Work?
While Gifty is far from perfect, I have been able to bring
it up to full functionality within the past year or so!
Some updates from the old (non-public) version 
include more efficient data usage, faster page loading, 
data error correction, and more reliable database interactions.


## What Are Some Possible Use Cases For This Program?
As mentioned before, the primary use for this program is to
be utilized as a gift list registry for my family. The goal
was to completely eliminate the double-buying of gifts
year-to-year over the holidays. It should be noted that I
have no current plans to release this to the world besides
this post on GitHub. As a result, security is minimal with a
username and a pin, which is encoded into my own simple
algorithm so that I can't read the pins if I need to access
the database manually. That being said, this can absolutely 
be deployed in a multitude of smaller instances - on a per 
family basis. I have tried my best to make Gifty friendly 
to those who wish to make their own instance from the ground 
up for their own family.


## Do You Have Any Other Plans For This Program?
At this time, I am in the process of adding various functions
that will improve the user experience for moderators and normal
users alike. Some planned features are listed in the
"Projects" section of my GitHub profile, which will be posted
as they are created/planned.


## How Do I Set This Up For My Own Family?
The easiest way to set this up for yourself is to use 
Google's Firebase Realtime Database in conjunction with 
Google's Firebase Hosting. While it gets a little bit 
technical, the best I can do is to provide the following 
"simple" step-by-step list.


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
      set up Firebase Hosting for this app", if desired.
        - Once you reach step two, your firebaseConfig info
    should now be generated and look something like this:
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
    and setting both ".read" and ".write" to "auth!=null"
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
  - 5, Deploy Gifty (This is where it may get a little tricky
    - In the Firebase Console, navigate to Build > Hosting and
    click on "Get Started". Follow the steps that are displayed
    by using a console (this varies depending on your Operating 
    System)
      - It will help to already have a pre-designated folder where
      you will be storing the Gifty files, even temporarily. Once
      you have finished deploying though, you will be able to delete
      the folder, if desired.
  -6, Once you have completed the console deployment, navigate
  to the new web address of your iteration of Gifty and give it
  a test drive! Create an account, make some gifts, and invite
  your family to start using it!
  
If you encounter any issues in this step-by-step process, be sure to 
re-read the steps up until where you encountered the issue, and THEN
contact me for assistance. Thank you!!


---------------------------------------------------

---------------------------------------------------

---------------------------------------------------

Everything below this point is supplemental data for those who are curious!


## ***Task List***
- Check out a list of tasks on the "Projects" section of my 
  profile! You can find planned release content there
  as well.

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
      - moderationQueue *\(Moderator Role Only)*
      - moderation *\(Moderator Role Only)*
        - friendList
      - family *\(Moderator Role Only)*
        - familyUpdate *\(Moderator Role Only)*
      - backup *\(Moderator Role Only)*
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
      - moderationQueueAlg, commonAlg
      - moderationAlg, commonAlg, secretSantaAlg, passOp
        - friendListAlg, commonAlg
      - familyAlg, commonAlg
          - familyUpdateAlg, commonAlg
      - backupAlg, commonAlg
    - notificationAlg, commonAlg
