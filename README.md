# bonobud

BonoBud is a web app that matches people who would like to donate to a charity with people whose companies can match that donation through an eligable employee matching program. 
This basic version exchanges the emails of the matcher and donor so that the donation can be made and matched, increasing the overall social impact. 

1. Donors fill out a basic form and are sent an email confirmation. These entries are formatted into a feed for matchers to see.
2. Matchers pick a donation that they would like to match. 
3. Matchers fill out their information in a basic form and are sent an email confirmation with the email of the donor.
4. Donors are notified of the match (their BonoBuddy) and are given the email of the matcher. 

Launch date: July 21, 2020
www.bonobud.com

Ann: has been managing Firebase implementation and data storage of matcher and donor information. She wrote both matcher.js and donor.js (works with matcher.html and donor.html respectively) to store and display matcher/donor data from the user forms. She also created her own basic search and filter algorithm to show matchers the different donor requests.

Rishab: has been working on UI development with Bootstrap. He designed the website layout, CSS styling, and wrote all the HTML docs. 

Michael: has been working on automating emails and managing the database to only include real, active users. He wrote index.js and has been using Firebase functions to trigger events and reference data. 
