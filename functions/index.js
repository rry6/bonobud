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
    const date = donor.date.toDate();
    const msg = {
        to: donor.email,
        from: 'Team BonoBud <teambonobud@gmail.com>',
        subject: donor.firstname + ', we received your donation request!',
        html: `
        <img src='cid:bl' width='300'/>
        <p>Hi ${donor.firstname}, <span style="float:right">Submission ID: ${donorSnap.id}</span></p>
        <p>Thank you for using BonoBud! Our bonobos are out searching for your BonoBuddy
        and you will be notified when someone wants to match your donation!
        <br> <br>
        We respect your time and want your donation to have the biggest impact possible.
        That is why your donation listing will be up for a maximum of 3 weeks. Then you
        will have the option to donate directly to the charity. Reply to this email or
        contact teambonobud@gmail.com with any feedback, questions, or concerns!
        <br> <br>
        Want to continue to increase your impact? Please share us with your friends and family!
        <br> <br>
        Sincerely, <br>
        Team BonoBud </p>
        <br> <br>
        <button class="btn btn-outline-success" onClick= "location.href=matcher.html">
          $${donor.amount} to
          <a href="${donor.link}" class="btn btn-lg btn-outline-warning" role="button" target = "_blank" aria-pressed="true"><b>${donor.charity}</b></a>
          <div>By ${donor.name}</div>
          <br>Reason: ${donor.reason}
          <br>Date: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</button>
          `,
          attachments: [{
              filename: 'bonobud logo.png',
              path: 'bonobud logo.png',
              cid: 'bl'
          }]
       };
    return transporter.sendMail(msg, (error, data) => {
        if (error) {
            console.log(error)
            db.doc('donors/{donorId}').update({
                status: 'faulty email'
            })
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
    const date = donor.date.toDate();
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
        subject: matcher.firstname + ', thank you for using BonoBud!',
        html: `
        <img src='cid:bl' width='300'/>
        <p>Hi ${matcher.firstname}, <span style="float:right">Submission ID: ${matcherSnap.id}</span></p>
        <p>We have processed your BonoBud matcher request!
        <br> <br>
        Thank you for choosing to help ${donor.name} increase their donation of
        $${donor.amount} to ${donor.charity}. Here is their email: ${donor.email}. Your BonoBuddy
        ${donor.firstname} has been notified of the match, so reach out and start the conversation!
        <br><br>
        Reply to this email or contact teambonobud@gmail.com with any feedback,
        questions, or concerns.
        <br><br>
        Want to continue to increase your impact? Please share us with your friends and family!
        Thank you for using BonoBud and we hope to see you again soon!
        <br> <br>
        Sincerely, <br>
        Team BonoBud </p>
        <br> <br>
        <div class="btn btn-outline-success" onClick= "location.href=matcher.html">
          $${donor.amount} to
          <a href="${donor.link}" class="btn btn-lg btn-outline-warning" role="button" target = "_blank" aria-pressed="true"><b>${donor.charity}</b></a>
          <div>By ${donor.name}</div>
          <br>Reason: ${donor.reason}
          <br>Date: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</div>
        `,
        attachments: [{
            filename: 'bonobud.svg',
            path: 'bonobud.svg',
            cid: 'bl'
        }]
    };
    const msg2 = {
        to: donor.email,
        from: 'Team BonoBud <teambonobud@gmail.com>',
        subject: donor.firstname + ', you\'ve been matched!',
        html: `
        <img src='cid:bl' width='300'/>
        <p>Hi ${donor.firstname},<span style="float:right">Submission ID: ${donorSnap.id}</span></p>
        <p>We have good news! ${matcher.name} from ${matcher.company} wants to
        match your donation of $${donor.amount} to ${donor.charity}. Here is their email: ${matcher.pemail}.
        Look out for an email from ${matcher.firstname} or reach out to start the conversation!
        <br><br>
        Here is a note from your BonoBuddy:
        <div>${matcher.note}</div>
        <br><br>
        Have any questions or concerns? Reply to this email or contact teambonobud@gmail.com.
        Feedback is also appreciated! Refer us to your friends and family or tell us how we can do better next time!
        <br><br>
        Thank you for using BonoBud and we hope to see you again soon!
        <br> <br>
        Sincerely, <br>
        Team BonoBud </p>
        `,
        attachments: [{
            filename: 'bonobud.svg',
            path: 'bonobud.svg',
            cid: 'bl'
        }]
    }
    return transporter.sendMail(msg, (error, data) => {
        if (error) {
            console.log(error)
            db.doc('donors/' + matcher.donorID).update({
                status: 'available'
            })
        }
        else {
            return transporter.sendMail(msg2, (error, data) => {
                if (error) {
                    console.log(error)
                    return
                }
            })
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
                const donor = doc.data();
                const date = doc.data().date.toDate();
                const msg = {
                    to: donor.email,
                    from: 'Team BonoBud <teambonobud@gmail.com>',
                    subject: donor.firstname + ', sorry to see you go!',
                    html: `
                    <img src='cid:bl' width='300'/>
                    <p>Hi ${donor.firstname},<span style="float:right">Submission ID: ${doc.id}</span></p>
                    <br> <br>
                    <p> Unfortunately, our bonobos could not find a matcher for your donation
                    of ${donor.amount} to ${donor.charity}. We hate to see you go, but we want your
                    donation to go to ${donor.charity} as soon as possible.
                    <br><br>
                    While most donations on BonoBud get matched, some may take longer than
                    others. If you are still interested in increasing the impact of your
                    donation, all it takes is two minutes to submit another form. Your continued
                    support means so much to us!
                    <br><br>
                    We are a brand new platform and therefore hitting some bumps along the
                    road. Please share us with your friends and family so that no donation
                    will go unmatched ever again!
                    <br> <br>
                    Sincerely, <br>
                    Team BonoBud </p>
                    <br> <br>
                    <button class="btn btn-outline-success" onClick= "location.href=matcher.html">
                      $${donor.amount} to
                      <a href="${donor.link}" class="btn btn-lg btn-outline-warning" role="button" target = "_blank" aria-pressed="true"><b>${donor.charity}</b></a>
                      <div>By ${donor.name}</div>
                      <br>Reason: ${donor.reason}
                      <br>Date: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</button>
                      `,
                      attachments: [{
                        filename: 'bonobud.svg',
                        path: 'bonobud.svg',
                        cid: 'bl'
                    }]
                };
                return transporter.sendMail(msg, (error, data) => {
                    if (error) {
                        console.log(error)
                        return
                    }
                    console.log("Sent")
                })
            }
            return null
        });
        return
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
});
