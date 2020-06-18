const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

const gmail = functions.config().gmail.login;
const password = functions.config().gmail.pass;

admin.initializeApp();
const db = admin.firestore();


var transporter= nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmail,
        pass: password
    }
});

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
    return transporter.sendMail(msg, (error, data) => {
        if (error) {
            console.log(error)
            return
        }
        console.log("Sent")
    });
});



//New matcher "submit" confirmation email
exports.newMatcher = functions.firestore.document('matchers/{matcherId}').onCreate( async (change, context) => {
    const matcherSnap = await db.collection('matchers').doc(context.params.matcherId).get();
    const matcher = matcherSnap.data();
    const msg = {
        to: matcher.pemail,
        from: 'teambonobud@gmail.com',
        subject: matcher.name + ' , thank you for using BonoBud!',
        text: 'Your BonoBud will reach out to you soon and the two of you can hammer it out!',
        html: '<strong>Your BonoBud will reach out to you soon and the two of you can hammer it out!</strong>',
    };
    return transporter.sendMail(msg, (error, data) => {
        if (error) {
            console.log(error)
            return
        }
        console.log("Sent")
    });
});