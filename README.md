# bonobud

BonoBud is a web app that matches people who would like to donate to a charity with people whose companies can match that donation. 
This basic version exchanges the emails of the matcher and donor so that the donation can be made and matched, increasing the social impact. 

1. Donors fill out a basic form and are sent an email confirmation. These entries are formatted into a feed for matchers to see.
2. Matchers pick a donation that they would like to match. 
3. Matchers fill out their information in a basic form and are sent an email confirmation with the email of the donor.
4. Donors are notified of the match (their BonoBuddy) and are given the email of the matcher. 

We (3 college freshmen) are currently on our 3rd week of developing this platform! 
This is still a work in progress, so please excuse the appearance and any bugs before it is released. To be released by early July!

Ann: has been managing Firebase implementation and data storage of matcher and donor information. She wrote both matcher.js and donor.js (works with matcher.html and donor.html respectively) to store and display matcher/donor data from the user forms. She also created her own basic search and filter function to show matchers the different donor requests.

Rishab: has been working on front end development with Bootstrap. He wrote all the html docs and is looking to reorganize the site. 

Michael: has been working on automating emails and managing the database to only include real, active users. He wrote index.js and has been using Firebase functions to trigger events and reference data. 
