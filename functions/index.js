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
    const id = donorSnap.id.substring(0,9);
    const msg = { //donor request confirmation
        to: donor.email,
        from: 'Team BonoBud <teambonobud@gmail.com>',
        subject: donor.firstname + ', we received your donation request!',
        html: `<body> <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#B5EAD7"> <tbody><tr> <td align="left" style="padding-top:30px;padding-bottom:25px;padding-left:40px"> <a href="https://bonobud.com/" style="text-decoration:none" target="_blank"> <img alt="BonoBud" src="https://www.dropbox.com/s/ln1e83mejtjxql1/green%20bonologo.png?raw=1" width="250" border="0" style="display:block;height:auto"> </a> </td></tr><tr> <td align="left"> <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f5f5f5"> <tbody><tr> <td style="padding:25px"> <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="border:1px solid #ffffff;border-radius:15px"> <tbody> <tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b; padding-left:40px;padding-right:40px;padding-top:30px;padding-bottom:20px"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tbody> <tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;width:40%"> <div> <span style="padding:20px 0px">Hi <span>${donor.firstname}!</span> </span> </div></td><td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b" align="right"> <div> <span style="padding:20px 0px"> <b>Submission ID: </b> <span>${id}</span></span> </div></td></tr></tbody> </table> </td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-bottom:20px; padding-left:40px;padding-right:40px"> Thank you for using BonoBud! We are searching for your BonoBuddy and you will be notified when someone wants to match your donation! </td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-bottom:20px; padding-left:40px;padding-right:40px"> We respect your time and want your donation to have the biggest impact possible. That is why your donation listing will be up for a maximum of 2 weeks. We will then notify you so that you can donate directly to the charity. <a href="https://bonobud.com/faq.html" target="_blank" style="color:#6b6b6b">Click here</a> for general FAQs or reply to this email with any feedback, questions, or concerns. </td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-bottom:30px; padding-left:40px;padding-right:40px"> Want to continue to increase your impact? Follow us on Instagram @<a href="https://www.instagram.com/bono.bud/" target="_blank" style="color:#6b6b6b">bono.bud</a> and share us with your friends and family! Thank you for your support and we will email you soon! </td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-bottom:30px; padding-left:40px;padding-right:40px"> Sincerely, <br>Team BonoBud </td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-left:40px; padding-right:40px;padding-bottom:30px"> <table width=100% style="max-width:550px"> <tbody> <tr> <td> <table width=100% style="border:5px solid #B5EAD7;border-radius:15px;padding-left:15px;padding-right:15px;padding-top:15px; padding-bottom:15px;text-align:center"> <tbody> <tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b"> $${donor.amount} to <a href="${donor.link}" target=="_blank" style="text-decoration:none;color:#6b6b6b"><b>${donor.charity}</b></a> </td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b"> By ${donor.name}</td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b"> Reason*: ${donor.reason}</td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b"> Date: ${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}</td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody></table> </td></tr></tbody></table> </td></tr><tr> <td style="padding-left:30px;padding-right:30px;padding-bottom:30px;padding-top:30px" bgcolor="#B5EAD7"> <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#B5EAD7"> <tbody> <tr> <td><table width="80%" cellpadding="0" cellspacing="0" border="0" align="left"> <tbody> <tr> <td style="font-size:13px;font-family:Helvetica,sans-serif,Arial;line-height:16px;color:#8c8c8c;padding-bottom:20px" align="left">*Reason is a default message if none was provided by the user.</td></tr><tr> <td style="font-size:13px;font-family:Helvetica,sans-serif,Arial;line-height:16px;color:#8c8c8c;padding-bottom:20px" align="left">Click here for <a href="https://bonobud.com/faq.html" target="_blank" style="color:#8c8c8c">FAQs</a>. Please email <a href="mailto:teambonobud@gmail.com" target="_blank" style="color:#8c8c8c">teambonobud@gmail.com</a> with questions, concerns, or feedback. </td></tr><tr> <td style="font-size:13px;font-family:Helvetica,sans-serif,Arial;line-height:16px;color:#8c8c8c;padding-bottom:5px" align="left"><a href="https://www.instagram.com/bono.bud/" style="text-decoration:none" target="_blank"> <img alt="Instagram" src="https://www.dropbox.com/s/wvn8p3q0a9vubme/ig%20icon.png?raw=1" width="10" border="0" style="height:auto"> </a>Follow us on Instagram! @<a href="https://www.instagram.com/bono.bud/" target="_blank" style="color:#8c8c8c">bono.bud</a></td></tr><tr> <td style="font-size:13px;font-family:Helvetica,sans-serif,Arial;line-height:16px;color:#8c8c8c" align="left"><a href="https://bonobud.com/" style="text-decoration:none" target="_blank"> <img alt="Website" src="https://www.dropbox.com/s/tlajzis092f0o73/url%20icon.png?raw=1" width="10" border="0" style="height:auto"> </a>Refer us to friends and family! <a href="https://bonobud.com/" target="_blank" style="color:#8c8c8c">https://bonobud.com/</a></td></tr></tbody> </table> <table cellpadding="0" cellspacing="0" border="0" align="right"> <tbody> <tr> <td> <a href="https://bonobud.com/" style="text-decoration:none" target="_blank"> <img alt="BonoBud" src="https://www.dropbox.com/s/lnjl8615hknu5sv/green%20bonoboy.png?raw=1" width="50" border="0" style="display:block;height:auto"> </a> </td></tr></tbody> </table> </td></tr></tbody></table> </td></tr></tbody></table> </body>`
        // attachments: [{
        //     filename: 'green bonoboy.png',
        //     path: 'green bonoboy.png',
        //     cid: 'bonoboy'
        // },
        // {
        //     filename: 'green bonologo.png',
        //     path: 'green bonologo.png',
        //     cid: 'logo'
        // },
        // {
        //     filename: 'ig icon.png',
        //     path: 'ig icon.png',
        //     cid: 'ig'
        // },
        // {
        //     filename: 'url icon.png',
        //     path: 'url icon.png',
        //     cid: 'web'
        // }]
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
    const msg = { //matcher confirmation
        to: matcher.pemail,
        from: 'Team BonoBud <teambonobud@gmail.com>',
        subject: matcher.firstname + ', thank you for using BonoBud!',
        html: `
        <p>Hi ${matcher.firstname}, <span style="float:right">Submission ID: ${matcherSnap.id}</span></p>
        <p>We have processed your BonoBud matcher request!
        <br> <br>
        Thank you for choosing to help ${donor.name} increase their donation of
        $${donor.amount} to ${donor.charity}. Here is their email: ${donor.email}. Your BonoBuddy
        ${donor.firstname} has been notified of the match, so reach out and start the conversation!
        <br><br>
        Click here for general FAQs or reply to this email with any feedback, questions, or concerns.
        <br><br>
        Want to continue to increase your impact? Please share us with your friends and family!
        Thank you for using BonoBud and we hope to see you again soon!
        <br> <br>
        Sincerely, <br>
        Team BonoBud </p>
        <br> <br>
        <table width="100%" cellspacing="0" cellpadding="0">
          <tr>
              <td>
                  <table cellspacing="0" cellpadding="0">
                      <tr>
                          <td style="border-radius: 2px;" bgcolor="#ED2939">
                              <a href="https://bonobud.com/" target="_blank" style="padding: 8px 12px; border: 1px solid #ED2939;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">
                                <div>
                                  $${donor.amount} to
                                  <object><a href="${donor.link}" class="btn btn-lg btn-outline-warning" role="button" target = "_blank" aria-pressed="true"><b>${donor.charity}</b></a></object>
                                  <div>By ${donor.name}</div>
                                  <br>Reason: ${donor.reason}
                                  <br>Date: ${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}
                                </div>
                              </a>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
        </table>
        `
        // <button class="btn btn-outline-success" onClick="https://bonobud.com/" target="_blank">
        //   $${donor.amount} to
        //   <a href="${donor.link}" class="btn btn-lg btn-outline-warning" role="button" target = "_blank" aria-pressed="true"><b>${donor.charity}</b></a>
        //   <div>By ${donor.name}</div>
        //   <br>Reason: ${donor.reason}
        //   <br>Date: ${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}</button>
        // `
        // attachments: [{
        //     filename: 'bonobud.png',
        //     path: 'bonobud.png',
        //     cid: 'bl'
        // }]
    };
    var notesection = ``;
    if (matcher.note) { //checks if matcher note exists
      notesection = `<br><br>
      Here is a note from your BonoBuddy:
      <div>${matcher.note}</div>`;
    }
    const msg2 = { //donor notified of match
        to: donor.email,
        from: 'Team BonoBud <teambonobud@gmail.com>',
        subject: donor.firstname + ', you\'ve been matched!',
        html: `
        <p>Hi ${donor.firstname},<span style="float:right">Submission ID: ${donorSnap.id}</span></p>
        <p>We have good news! ${matcher.name} from ${matcher.company} wants to
        match your donation of $${donor.amount} to ${donor.charity}.
        <br><br>
        Here is their personal email: ${matcher.pemail}.
        If you would like to verify that ${matcher.firstname} works at ${matcher.company}, please contact them through
        their company email: ${matcher.cemail}.
        Look out for an email from ${matcher.firstname} or reach out to start the conversation!
        ${notesection}
        <br><br>
        Something doesn't look right? Check out our FAQs page or reply to this email with questions, concerns, or feedback.
        <br><br>
        Continue increasing your impact by referring us to your friends and family.
        Thank you for using BonoBud and we hope to see you again soon!
        <br> <br>
        Sincerely, <br>
        Team BonoBud </p>
        <br><br>
        <a href="https://bonobud.com/" target="_blank">
          <div>
          $${donor.amount} to
          <object><a href="${donor.link}" class="btn btn-lg btn-outline-warning" role="button" target = "_blank" aria-pressed="true"><b>${donor.charity}</b></a></object>
          <div>By ${donor.name}</div>
          <br>Reason: ${donor.reason}
          <br>Date: ${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}</div></a>
        `
        // attachments: [{
        //     filename: 'bonobud.png',
        //     path: 'bonobud.png',
        //     cid: 'bl'
        // }]
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
            if (difference > 14) {
                db.doc('donors/' + doc.id).update({
                    status: 'expired'
                });
                const donor = doc.data();
                const date = doc.data().date.toDate();
                const msg = { //donation request expired
                    to: donor.email,
                    from: 'Team BonoBud <teambonobud@gmail.com>',
                    subject: donor.firstname + ', sorry to see you go!',
                    html: `
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
                    <button class="btn btn-outline-success" onClick= "https://bonobud.com/">
                      $${donor.amount} to
                      <a href="${donor.link}" class="btn btn-lg btn-outline-warning" role="button" target = "_blank" aria-pressed="true"><b>${donor.charity}</b></a>
                      <div>By ${donor.name}</div>
                      <br>Reason: ${donor.reason}
                      <br>Date: ${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}</button>
                    `
                    //   attachments: [{
                    //     filename: 'bonobud.png',
                    //     path: 'bonobud.png',
                    //     cid: 'bl'
                    // }]
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
