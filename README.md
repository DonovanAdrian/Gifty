# Gifty
> made by Donovan Adrian in JavaScript, HTML, and CSS

## ***Task List***
- Check out a list of tasks on the "Projects" section of my 
  profile! You can find planned release content there
  as well.

## Website Structure
- index
  - userAddUpdate *\(The first user on the database is given the moderator role)*
  - *USER LOGGED IN*
    - home
      - boughtGifts
      - giftAddUpdate
    - lists
      - friendList
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
    - notifications *\(Accessible from **almost** all pages)*
  
## Code Structure

- indexAlg, commonAlg, passOp
  - userAddUpdateAlg, commonAlg, passOp
    - homeAlg, commonAlg
      - boughtGiftAlg, commonAlg
      - giftAddUpdateAlg, commonAlg
    - listsAlg, commonAlg, secretSantaAlg
      - friendListAlg, commonAlg
    - invitesAlg, commonAlg
      - confirmationAlg, commonAlg
    - settingsAlg, commonAlg
      - faqAlg, commonAlg
      - moderationQueueAlg, commonAlg
      - moderationAlg, commonAlg, secretSantaAlg, passOp
        - friendListAlg, commonAlg
      - familyAlg, commonAlg
          - familyUpdateAlg, commonAlg
    - notificationAlg, commonAlg

## Welcome!
This website is meant to be a gift list registry that 
aims at eliminating the double-buying of gifts. My personal 
goal here was to offer something to my family that would 
give an extra layer of confidence when buying gifts for each 
other. In order to complete this, I enlisted Google Firebase 
to follow through with all database operations, while I 
handled all the data operations on the front end.


## How Well Does This Work?
While Gifty is far from perfect, I have been able to bring 
it up to full functionality over the past couple months! 
Some of the updates from the old version include more 
efficient data usage, faster page loading, data error 
correction, and more reliable database interactions.


## What Are Some Possible Use Cases For This Program?
As mentioned before, the primary use for this program is to 
be utilized as a gift list registry for my family. The goal 
was to completely eliminate the double-buying of gifts 
year-to-year over the holidays. It should be noted that I 
have no current plans to release this to the world besides 
this post on GitHub. As a result, security is minimal with a 
username and a pin, which is encoded into my own simple 
algorithm so that I can't read the pins if I need to access 
the database manually. If I ever released this to the world, 
my main priority would be to switch to Google's own 
authentication system. If Google's database becomes a paid 
service, however, then I would need to create my own local 
database.


## Can I Use This Code For My Own Family?
Of course! All you should need to do is fill in the config 
details of your own Google Firebase 
(Realtime Database, NOT Firestore!) and you will be all 
good to go! This data can be filled in on the /txt/config.txt
file. Please keep in mind that very MINOR security 
is built in to this application. As such, I am not 
responsible for any misuse of my own code that leads to 
the loss of personal data. If you have any additional 
questions or concerns, don't hesitate to contact me, 
whether it be through GitHub or some other way.


## Do You Have Any Other Plans For This Program?
At this time, I am in the process of adding various functions 
that will improve the user experience for moderators and normal 
users alike. Some of the planned features are listed in the 
"Projects" section of my GitHub profile, which will be posted 
as they are created/planned.
    
