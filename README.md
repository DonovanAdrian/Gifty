# Gifty
> made by Donovan Adrian in JavaScript, HTML, and CSS

## ***Task List***
- [x] Post On GitHub
- [x] Update Old Files
  - [x] index.html
  - [x] userAddUpdate.html
  - [x] home.html 
  - [x] giftAddUpdate.html
  - [x] lists.html
  - [x] friendList.html
  - [x] invites.html
  - [x] confirmation.html
  - [x] settings.html 
  - [x] faq.html
  - [x] moderation.html
  - [x] passOp.js
- [x] Test New Gifty Files
- [x] Add Supplemental ModerationAlg Features
- [x] Add Private Gift List Feature
- [x] Add Bought Gifts List Feature
- [x] Add Notifications Feature Across All Pages
- [x] Reconfigure Config Section
- [x] Append "Please Wait" To "Loading"
- [x] Add User Timeout Notification In Console
- [x] Add "Read Notifications" Feature
- [x] Add Global Notifications
- [ ] Add Moderator Private Messages (To Users)
- [ ] Add Private Messages (User to User)
- [ ] Add Helpful Comments
  -  This is something that I've been meaning to do in case other people want to learn from my work. This may be done in the form of a new repository labeled "Education Edition"
- [ ] Add Moderation Support Queue
  -  This will be put on the backburner for the time being, as it is a very minor feature.
- [ ] Touch Up Work/Testing **\(in progress)**

## Website Structure
- index
  - userAddUpdate
  - *USER LOGGED IN*
    - home
      - giftAddUpdate
    - lists
      - friendList
    - invites
      - confirmation
    - settings
      - faq
        - email form
      - moderation *\(Moderator Role Only)*
        - friendList

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
that will improve the user experience on multiple levels. 
Some of the planned features are listed in the Task List, 
which will be posted as they are created.
    
