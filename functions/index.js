const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();
const db = admin.firestore();

const gmail = functions.config().gmail.login;
const password = functions.config().gmail.pass;

var transporter= nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmail,
        pass: password
    }
});

//New donor "submit" confirmation email
exports.newDonor = functions.firestore.document('donors/{donorId}').onCreate( async (change, context) => {
    const donorSnap = await db.collection('donors').doc(context.params.donorId).get();
    const donor = donorSnap.data();
    const msg = {
        to: donor.email,
        from: 'Team BonoBud <teambonobud@gmail.com>',
        subject: donor.name + ', thank you for using BonoBud!',
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
    const donorSnap = await db.collection('donors').doc(matcher.donorID).get();
    const donor = donorSnap.data();
    const moneySnap = await db.collection('stats').doc('money').get();
    const currentMoney = moneySnap.data();
    const tSnap = await db.collection('stats').doc('traffic').get();
    const traffic = tSnap.data();
    const newTraffic = traffic.donations_matched + 1
    const newDonated = currentMoney.donated + donor.amount
    const newMatched = currentMoney.matched + (donor.amount * matcher.rate)
    const newTotal = newDonated + newMatched 
    db.doc('donors/' + matcher.donorID).update({
        status: 'Matched by '+ context.params.matcherId
    })
    db.doc('stats/money').update({
        donated: newDonated,
        matched: newMatched,
        total: newTotal
    })
    db.doc('stats/traffic').update({
        donations_matched: newTraffic
    })
    const msg = {
        to: matcher.pemail,
        from: 'Team BonoBud <teambonobud@gmail.com>',
        subject: matcher.name + ', thank you for using BonoBud!',
        text: "Your donor's email is " + donor.email + ", so reach out and donate!",
    };
    return transporter.sendMail(msg, (error, data) => {
        if (error) {
            console.log(error)
            return
        }
        console.log("Sent")
    });
});

//Notify donor that they have been matched
exports.matched = functions.firestore.document('matchers/{matcherId}').onCreate( async (change, context) => {
    const matcherSnap = await db.collection('matchers').doc(context.params.matcherId).get();
    const matcher = matcherSnap.data();
    const donorID = matcher.donorID;
    const donorSnap = await db.collection('donors').doc(donorID).get();
    const donor = donorSnap.data();
    const msg = {
        to: donor.email,
        from: 'Team BonoBud <teambonobud@gmail.com>',
        subject: donor.name + ', you just got matched!',
        text: 'Someone just matched you! Their email is: ' + matcher.pemail,
    };
    return transporter.sendMail(msg, (error, data) => {
        if (error) {
            console.log(error)
            return
        }
        console.log("Sent")
    });
});

//checks for expiring donor listings
exports.expired = functions.firestore.document('matchers/{matcherId}').onCreate( async (change, context) => {
    const currentTime = new Date();
    db.collection('donors').where('status', '==', 'available').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const difference = Math.floor((currentTime.getTime() - doc.data().date.toDate().getTime())/1000/60/60/24);
            if (difference > 21) {
                db.doc('donors/' + doc.id).update({
                    status: 'expired'
                });
                const msg = {
                    to: doc.data().email,
                    from: 'Team BonoBud <teambonobud@gmail.com>',
                    subject: doc.data().name + ', your donation listing has expired.',
                    text: 'Unfortunately, we were unable to match you with a BonoBud',
                };        
                return transporter.sendMail(msg, (error, data) => {
                    if (error) {
                        console.log(error)
                        return
                    }
                    console.log("Sent")
                })
            }
            return
        });
        return
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
});
