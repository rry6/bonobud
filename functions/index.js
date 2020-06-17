// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
// Firebase Config
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

// Sendgrid Config
const sgMail = require('@sendgrid/mail');
const API_KEY = functions.config().sendgrid.key;
sgMail.setApiKey(API_KEY);

exports.newDonor = functions.firestore.document('donors/{donorId}').onCreate( async (change, context) => {
    const donorSnap = await db.collection('donors').doc(context.params.donorId).get();
    const donor = donorSnap.data();
    const msg = {
        to: donor.email,
        from: 'teambonobud@gmail.com',
        subject: donor.name + ' , thank you for using BonoBud!',
        text: 'Our bonobos will start looking for a matcher immediately!',
        html: '<strong>Our bonobos will start looking for a matcher immediately!</strong>',
    };
    return sgMail.send(msg);
});

exports.newMatcher = functions.firestore.document('matchers/{matcherId}').onCreate( async (change, context) => {
    const matcherSnap = await db.collection('matchers').doc(context.params.matcherId).get();
    const matcher = donorSnap.data();
    const msg = {
        to: matcher.pemail,
        from: 'teambonobud@gmail.com',
        subject: matcher.name + ' , thank you for using BonoBud!',
        text: 'Your BonoBud will reach out to you soon and the two of you can hammer it out!',
        html: '<strong>Your BonoBud will reach out to you soon and the two of you can hammer it out!</strong>',
    };
    return sgMail.send(msg);
});