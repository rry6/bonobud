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
        html: `
        <body> <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#B5EAD7"> <tbody><tr> <td align="left" style="padding-top:30px;padding-bottom:25px;padding-left:40px"> <a href="https://bonobud.com/" style="text-decoration:none" target="_blank"> <img alt="BonoBud" src="https://www.dropbox.com/s/iir1vc2t6gue6ij/transparent%20bonologo.png?raw=1" width="250" border="0" style="display:block;height:auto"> </a> </td></tr><tr> <td align="left"> <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f5f5f5"> <tbody><tr> <td style="padding:25px"> <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="border:1px solid #ffffff;border-radius:15px"> <tbody> <tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b; padding-left:40px;padding-right:40px;padding-top:30px;padding-bottom:20px"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tbody> <tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;width:40%"> <div> <span style="padding:20px 0px">Hi <span>${donor.firstname}!</span> </span> </div></td><td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b" align="right"> <div> <span style="padding:20px 0px"> <b>Submission ID: </b> <span>${id}</span></span> </div></td></tr></tbody> </table> </td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-bottom:20px; padding-left:40px;padding-right:40px"> <b>Thank you for using BonoBud!</b> We are searching for your BonoBuddy and you will be notified when someone wants to match your donation! </td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-bottom:20px; padding-left:40px;padding-right:40px"> We respect your time and want your donation to have the biggest impact possible. If your donation is not matched <b>within 2 weeks</b>, we will notify you so that you can donate directly to the charity. Please read our <a href="https://bonobud.com/faq.html" target="_blank" style="color:#6b6b6b">FAQs page</a> or reply to this email with any feedback, questions, or concerns. </td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-bottom:20px; padding-left:40px;padding-right:40px"> Want to continue to increase your impact? Follow us on Instagram @<a href="https://www.instagram.com/bono.bud/" target="_blank" style="color:#6b6b6b">bono.bud</a> and share us with your friends and family! </td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-bottom:30px; padding-left:40px;padding-right:40px"> Thank you for your support and we will email you soon! </td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-bottom:30px; padding-left:40px;padding-right:40px"> Sincerely, <br>Team BonoBud </td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-left:40px; padding-right:40px;padding-bottom:30px"> <table width=100% style="max-width:550px"> <tbody> <tr> <td> <table width=100% style="border:5px solid #B5EAD7;border-radius:15px;padding-left:15px;padding-right:15px;padding-top:15px; padding-bottom:15px;text-align:center"> <tbody> <tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b"> $${donor.amount} to <a href="${donor.link}" target=="_blank" style="text-decoration:none;color:#6b6b6b"><b>${donor.charity}</b></a> </td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b"> By ${donor.name}</td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b"> Reason*: ${donor.reason}</td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b"> Date: ${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}</td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody></table> </td></tr></tbody></table> </td></tr><tr> <td style="padding-left:30px;padding-right:30px;padding-bottom:30px;padding-top:30px" bgcolor="#B5EAD7"> <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#B5EAD7"> <tbody> <tr> <td><table width="75%" cellpadding="0" cellspacing="0" border="0" align="left"> <tbody> <tr> <td style="font-size:13px;font-family:Helvetica,sans-serif,Arial;line-height:16px;color:#8c8c8c;padding-bottom:20px" align="left">*Reason is a default message if none was provided by the user.</td></tr><tr> <td style="font-size:13px;font-family:Helvetica,sans-serif,Arial;line-height:16px;color:#8c8c8c;padding-bottom:20px" align="left">Click here for <a href="https://bonobud.com/faq.html" target="_blank" style="color:#8c8c8c">FAQs</a>. Please email <a href="mailto:teambonobud@gmail.com" target="_blank" style="color:#8c8c8c">teambonobud@gmail.com</a> with questions, concerns, or feedback. </td></tr><tr> <td style="font-size:13px;font-family:Helvetica,sans-serif,Arial;line-height:16px;color:#8c8c8c;padding-bottom:5px" align="left"> <a href="https://www.instagram.com/bono.bud/" style="text-decoration:none" target="_blank"> <img alt="Instagram" src="https://www.dropbox.com/s/wvn8p3q0a9vubme/ig%20icon.png?raw=1" width="10" border="0" style="height:auto"> </a> Follow us on Instagram! @<a href="https://www.instagram.com/bono.bud/" target="_blank" style="color:#8c8c8c">bono.bud</a></td></tr><tr> <td style="font-size:13px;font-family:Helvetica,sans-serif,Arial;line-height:16px;color:#8c8c8c" align="left"> <a href="https://bonobud.com/" style="text-decoration:none" target="_blank"> <img alt="Website" src="https://www.dropbox.com/s/sh18m4v3adsq90t/url%20icon2.png?raw=1" width="10" border="0" style="height:auto"> </a> Refer us to friends and family! <a href="https://bonobud.com/" target="_blank" style="color:#8c8c8c">https://bonobud.com/</a></td></tr></tbody> </table> <table cellpadding="0" cellspacing="0" border="0" align="right"> <tbody> <tr> <td> <a href="https://bonobud.com/" style="text-decoration:none" target="_blank"> <img alt="BonoBud" src="https://www.dropbox.com/s/8rgh6um586u93at/transparent%20bonoboy.png?raw=1" width="50" border="0" style="display:block;height:auto"> </a> </td></tr></tbody> </table> </td></tr></tbody></table> </td></tr></tbody></table> </body>
        `
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
    const dId = donorSnap.id.substring(0,9);
    const mId = matcherSnap.id.substring(0,9);
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
        <body> <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFDAC1"> <tbody><tr> <td align="left" style="padding-top:30px;padding-bottom:25px;padding-left:40px"> <a href="https://bonobud.com/" style="text-decoration:none" target="_blank"> <img alt="BonoBud" src="https://www.dropbox.com/s/iir1vc2t6gue6ij/transparent%20bonologo.png?raw=1" width="250" border="0" style="display:block;height:auto"> </a> </td></tr><tr> <td align="left"> <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f5f5f5"> <tbody><tr> <td style="padding:25px"> <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="border:1px solid #ffffff;border-radius:15px"> <tbody> <tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b; padding-left:40px;padding-right:40px;padding-top:30px;padding-bottom:20px"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tbody> <tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;width:40%"> <div> <span style="padding:20px 0px">Hi <span>${matcher.firstname}!</span> </span> </div></td><td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b" align="right"> <div> <span style="padding:20px 0px"> <b>Submission ID: </b> <span>${mId}</span></span> </div></td></tr></tbody> </table> </td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-bottom:20px; padding-left:40px;padding-right:40px"> <b>We have processed your BonoBud matcher request!</b> </td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-bottom:20px; padding-left:40px;padding-right:40px"> Thank you for choosing to help ${donor.name} increase their donation of $${donor.amount} to ${donor.charity}. <b>Here is their email: <a href="mailto:${donor.email}" target="_blank" style="color:#6b6b6b">${donor.email}</a>.</b> Your BonoBuddy ${donor.firstname} has been notified of the match, so reach out and start the conversation! </td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-bottom:20px; padding-left:40px;padding-right:40px"> Please read our <a href="https://bonobud.com/faq.html" target="_blank" style="color:#6b6b6b">FAQs page</a> or reply to this email with any feedback, questions, or concerns. </td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-bottom:30px; padding-left:40px;padding-right:40px"> Want to continue to increase your impact? Follow us on Instagram @<a href="https://www.instagram.com/bono.bud/" target="_blank" style="color:#6b6b6b">bono.bud</a> and share us with your friends and family! Thank you for using BonoBud and we hope to see you again soon! </td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-bottom:30px; padding-left:40px;padding-right:40px"> Sincerely, <br>Team BonoBud </td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-left:40px; padding-right:40px;padding-bottom:30px"> <table width=100% style="max-width:550px"> <tbody> <tr> <td> <table width=100% style="border:5px solid #FFDAC1;border-radius:15px;padding-left:15px;padding-right:15px;padding-top:15px; padding-bottom:15px;text-align:center"> <tbody> <tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b"> $${donor.amount} to <a href="${donor.link}" target=="_blank" style="text-decoration:none;color:#6b6b6b"><b>${donor.charity}</b></a> </td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b"> By ${donor.name}</td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b"> Reason*: ${donor.reason}</td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b"> Date: ${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}</td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody></table> </td></tr></tbody></table> </td></tr><tr> <td style="padding-left:30px;padding-right:30px;padding-bottom:30px;padding-top:30px" bgcolor="#FFDAC1"> <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFDAC1"> <tbody> <tr> <td><table width="75%" cellpadding="0" cellspacing="0" border="0" align="left"> <tbody> <tr> <td style="font-size:13px;font-family:Helvetica,sans-serif,Arial;line-height:16px;color:#8c8c8c;padding-bottom:20px" align="left">*Reason is a default message if none was provided by the user.</td></tr><tr> <td style="font-size:13px;font-family:Helvetica,sans-serif,Arial;line-height:16px;color:#8c8c8c;padding-bottom:20px" align="left">Click here for <a href="https://bonobud.com/faq.html" target="_blank" style="color:#8c8c8c">FAQs</a>. Please email <a href="mailto:teambonobud@gmail.com" target="_blank" style="color:#8c8c8c">teambonobud@gmail.com</a> with questions, concerns, or feedback. </td></tr><tr> <td style="font-size:13px;font-family:Helvetica,sans-serif,Arial;line-height:16px;color:#8c8c8c;padding-bottom:5px" align="left"> <a href="https://www.instagram.com/bono.bud/" style="text-decoration:none" target="_blank"> <img alt="Instagram" src="https://www.dropbox.com/s/wvn8p3q0a9vubme/ig%20icon.png?raw=1" width="10" border="0" style="height:auto"> </a> Follow us on Instagram! @<a href="https://www.instagram.com/bono.bud/" target="_blank" style="color:#8c8c8c">bono.bud</a></td></tr><tr> <td style="font-size:13px;font-family:Helvetica,sans-serif,Arial;line-height:16px;color:#8c8c8c" align="left"> <a href="https://bonobud.com/" style="text-decoration:none" target="_blank"> <img alt="Website" src="https://www.dropbox.com/s/sh18m4v3adsq90t/url%20icon2.png?raw=1" width="10" border="0" style="height:auto"> </a> Refer us to friends and family! <a href="https://bonobud.com/" target="_blank" style="color:#8c8c8c">https://bonobud.com/</a></td></tr></tbody> </table> <table cellpadding="0" cellspacing="0" border="0" align="right"> <tbody> <tr> <td> <a href="https://bonobud.com/" style="text-decoration:none" target="_blank"> <img alt="BonoBud" src="https://www.dropbox.com/s/8rgh6um586u93at/transparent%20bonoboy.png?raw=1" width="50" border="0" style="display:block;height:auto"> </a> </td></tr></tbody> </table> </td></tr></tbody></table> </td></tr></tbody></table> </body>
        `
    };
    var notesection = ``;
    if (matcher.note) { //checks if matcher note exists
      notesection = `
      <tr>
        <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-top:20px;padding-bottom:10px;
        padding-left:40px;padding-right:40px">
          Here is a note from your BonoBuddy:
        </td>
      </tr>
      <tr>
          <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;
          padding-left:40px;padding-right:40px">
            <table bgcolor="#f8f8f8" style="padding:10px">
              <tbody>
                <tr>
                  <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b">
                    ${matcher.note}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
      </tr>
      `;
    }
    const msg2 = { //donor notified of match
        to: donor.email,
        from: 'Team BonoBud <teambonobud@gmail.com>',
        subject: donor.firstname + ', you\'ve been matched!',
        html: `
        <body><table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#B5EAD7"><tbody><tr><td align="left" style="padding-top:30px;padding-bottom:25px;padding-left:40px"> <a href="https://bonobud.com/" style="text-decoration:none" target="_blank"> <img alt="BonoBud" src="https://www.dropbox.com/s/iir1vc2t6gue6ij/transparent%20bonologo.png?raw=1" width="250" border="0" style="display:block;height:auto"> </a></td></tr><tr><td align="left"><table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f5f5f5"><tbody><tr><td style="padding:25px"><table width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="border:1px solid #ffffff;border-radius:15px"><tbody><tr><td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b; padding-left:40px;padding-right:40px;padding-top:30px;padding-bottom:20px"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tbody><tr><td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;width:40%"><div> <span style="padding:20px 0px">Hi <span>${donor.firstname}!</span> </span></div></td><td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b" align="right"><div> <span style="padding:20px 0px"> <b>Submission ID: </b> <span>${dId}</span></span></div></td></tr></tbody></table></td></tr><tr><td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-bottom:20px; padding-left:40px;padding-right:40px"> We have good news! <b>${matcher.name} from ${matcher.company}</b> wants to match your donation of $${donor.amount} to ${donor.charity}.</td></tr><tr><td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-left:40px;padding-right:40px"> <b>Here is their personal email: <a href="mailto:${matcher.pemail}" target="_blank" style="color:#6b6b6b">${matcher.pemail}</a>.</b> If you would like to verify that ${matcher.firstname} works at ${matcher.company}, please contact them through their company email: <a href="mailto:${matcher.cemail}" target="_blank" style="color:#6b6b6b">${matcher.cemail}</a>. Go ahead, reach out and start the conversation! </td></tr>${notesection}<tr><td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-top:20px;padding-bottom:20px; padding-left:40px;padding-right:40px"> Something doesn't look right? Check out our <a href="https://bonobud.com/faq.html" target="_blank" style="color:#6b6b6b">FAQs page</a> or reply to this email with questions, concerns, or feedback.</td></tr><tr><td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-bottom:30px; padding-left:40px;padding-right:40px"> Don't forget to follow us on Instagram @<a href="https://www.instagram.com/bono.bud/" target="_blank" style="color:#6b6b6b">bono.bud</a> and share us with friends and family! Thank you for using BonoBud and we hope to see you again soon!</td></tr><tr><td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-bottom:30px; padding-left:40px;padding-right:40px"> Sincerely, <br>Team BonoBud</td></tr><tr><td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-left:40px; padding-right:40px;padding-bottom:30px"><table width=100% style="max-width:550px"><tbody><tr><td><table width=100% style="border:5px solid #B5EAD7;border-radius:15px;padding-left:15px;padding-right:15px;padding-top:15px; padding-bottom:15px;text-align:center"><tbody><tr><td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b"> $${donor.amount} to <a href="${donor.link}" target=="_blank" style="text-decoration:none;color:#6b6b6b"><b>${donor.charity}</b></a></td></tr><tr><td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b"> By ${donor.name}</td></tr><tr><td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b"> Reason*: ${donor.reason}</td></tr><tr><td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b"> Date: ${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}</td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td style="padding-left:30px;padding-right:30px;padding-bottom:30px;padding-top:30px" bgcolor="#B5EAD7"><table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#B5EAD7"><tbody><tr><td><table width="75%" cellpadding="0" cellspacing="0" border="0" align="left"><tbody><tr><td style="font-size:13px;font-family:Helvetica,sans-serif,Arial;line-height:16px;color:#8c8c8c;padding-bottom:20px" align="left">*Reason is a default message if none was provided by the user.</td></tr><tr><td style="font-size:13px;font-family:Helvetica,sans-serif,Arial;line-height:16px;color:#8c8c8c;padding-bottom:20px" align="left">Click here for <a href="https://bonobud.com/faq.html" target="_blank" style="color:#8c8c8c">FAQs</a>. Please email <a href="mailto:teambonobud@gmail.com" target="_blank" style="color:#8c8c8c">teambonobud@gmail.com</a> with questions, concerns, or feedback.</td></tr><tr><td style="font-size:13px;font-family:Helvetica,sans-serif,Arial;line-height:16px;color:#8c8c8c;padding-bottom:5px" align="left"> <a href="https://www.instagram.com/bono.bud/" style="text-decoration:none" target="_blank"> <img alt="Instagram" src="https://www.dropbox.com/s/wvn8p3q0a9vubme/ig%20icon.png?raw=1" width="10" border="0" style="height:auto"> </a> Follow us on Instagram! @<a href="https://www.instagram.com/bono.bud/" target="_blank" style="color:#8c8c8c">bono.bud</a></td></tr><tr><td style="font-size:13px;font-family:Helvetica,sans-serif,Arial;line-height:16px;color:#8c8c8c" align="left"> <a href="https://bonobud.com/" style="text-decoration:none" target="_blank"> <img alt="Website" src="https://www.dropbox.com/s/sh18m4v3adsq90t/url%20icon2.png?raw=1" width="10" border="0" style="height:auto"> </a> Refer us to friends and family! <a href="https://bonobud.com/" target="_blank" style="color:#8c8c8c">https://bonobud.com/</a></td></tr></tbody></table><table cellpadding="0" cellspacing="0" border="0" align="right"><tbody><tr><td> <a href="https://bonobud.com/" style="text-decoration:none" target="_blank"> <img alt="BonoBud" src="https://www.dropbox.com/s/8rgh6um586u93at/transparent%20bonoboy.png?raw=1" width="50" border="0" style="display:block;height:auto"> </a></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></body>
        `
    };
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
                const id = doc.id.substring(0,9);
                const msg = { //donation request expired
                    to: donor.email,
                    from: 'Team BonoBud <teambonobud@gmail.com>',
                    subject: donor.firstname + ', sorry to see you go!',
                    html: `
                    <body> <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#B5EAD7"> <tbody><tr> <td align="left" style="padding-top:30px;padding-bottom:25px;padding-left:40px"> <a href="https://bonobud.com/" style="text-decoration:none" target="_blank"> <img alt="BonoBud" src="https://www.dropbox.com/s/iir1vc2t6gue6ij/transparent%20bonologo.png?raw=1" width="250" border="0" style="display:block;height:auto"> </a> </td></tr><tr> <td align="left"> <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f5f5f5"> <tbody><tr> <td style="padding:25px"> <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="border:1px solid #ffffff;border-radius:15px"> <tbody> <tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b; padding-left:40px;padding-right:40px;padding-top:30px;padding-bottom:20px"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tbody> <tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;width:40%"> <div> <span style="padding:20px 0px">Hi <span>${donor.firstname}!</span> </span> </div></td><td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b" align="right"> <div> <span style="padding:20px 0px"> <b>Submission ID: </b> <span>${id}</span></span> </div></td></tr></tbody> </table> </td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-bottom:20px; padding-left:40px;padding-right:40px"> Unfortunately, our bonobos could not find a matcher for your donation of ${donor.amount} to ${donor.charity}. We hate to see you go, but <b>we want your donation to go to <a href="${donor.link}" target="_blank" style="color:#6b6b6b"> ${donor.charity}</a> as soon as possible</b>. </td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-bottom:20px; padding-left:40px;padding-right:40px"> While most donations on BonoBud get matched, some may take longer than others. If you are still interested in increasing the impact of your donation, all it takes is two minutes to <a href="https://bonobud.com/" target="_blank" style="color:#6b6b6b"> submit another form</a>. Your continued support means so much to us! </td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-bottom:30px; padding-left:40px;padding-right:40px"> We are a brand new platform and therefore hitting some bumps along the road. To ensure that no donation goes unmatched ever again, please <a href="https://www.instagram.com/bono.bud/" target="_blank" style="color:#6b6b6b">share us</a> with your friends and family! Thank you for your time and patience as we work on improving our system! </td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-bottom:30px; padding-left:40px;padding-right:40px"> Sincerely, <br>Team BonoBud </td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b;padding-left:40px; padding-right:40px;padding-bottom:30px"> <table width=100% style="max-width:550px"> <tbody> <tr> <td> <table width=100% style="border:5px solid #B5EAD7;border-radius:15px;padding-left:15px;padding-right:15px;padding-top:15px; padding-bottom:15px;text-align:center"> <tbody> <tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b"> $${donor.amount} to <a href="${donor.link}" target=="_blank" style="text-decoration:none;color:#6b6b6b"><b>${donor.charity}</b></a> </td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b"> By ${donor.name}</td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b"> Reason*: ${donor.reason}</td></tr><tr> <td style="font-family:Helvetica,sans-serif,Arial;font-size:16px;font-weight:500;line-height:150%;color:#6b6b6b"> Date: ${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}</td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody></table> </td></tr></tbody></table> </td></tr><tr> <td style="padding-left:30px;padding-right:30px;padding-bottom:30px;padding-top:30px" bgcolor="#B5EAD7"> <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#B5EAD7"> <tbody> <tr> <td><table width="75%" cellpadding="0" cellspacing="0" border="0" align="left"> <tbody> <tr> <td style="font-size:13px;font-family:Helvetica,sans-serif,Arial;line-height:16px;color:#8c8c8c;padding-bottom:20px" align="left">*Reason is a default message if none was provided by the user.</td></tr><tr> <td style="font-size:13px;font-family:Helvetica,sans-serif,Arial;line-height:16px;color:#8c8c8c;padding-bottom:20px" align="left">Click here for <a href="https://bonobud.com/faq.html" target="_blank" style="color:#8c8c8c">FAQs</a>. Please email <a href="mailto:teambonobud@gmail.com" target="_blank" style="color:#8c8c8c">teambonobud@gmail.com</a> with questions, concerns, or feedback. </td></tr><tr> <td style="font-size:13px;font-family:Helvetica,sans-serif,Arial;line-height:16px;color:#8c8c8c;padding-bottom:5px" align="left"> <a href="https://www.instagram.com/bono.bud/" style="text-decoration:none" target="_blank"> <img alt="Instagram" src="https://www.dropbox.com/s/wvn8p3q0a9vubme/ig%20icon.png?raw=1" width="10" border="0" style="height:auto"> </a> Follow us on Instagram! @<a href="https://www.instagram.com/bono.bud/" target="_blank" style="color:#8c8c8c">bono.bud</a></td></tr><tr> <td style="font-size:13px;font-family:Helvetica,sans-serif,Arial;line-height:16px;color:#8c8c8c" align="left"> <a href="https://bonobud.com/" style="text-decoration:none" target="_blank"> <img alt="Website" src="https://www.dropbox.com/s/sh18m4v3adsq90t/url%20icon2.png?raw=1" width="10" border="0" style="height:auto"> </a> Refer us to friends and family! <a href="https://bonobud.com/" target="_blank" style="color:#8c8c8c">https://bonobud.com/</a></td></tr></tbody> </table> <table cellpadding="0" cellspacing="0" border="0" align="right"> <tbody> <tr> <td> <a href="https://bonobud.com/" style="text-decoration:none" target="_blank"> <img alt="BonoBud" src="https://www.dropbox.com/s/8rgh6um586u93at/transparent%20bonoboy.png?raw=1" width="50" border="0" style="display:block;height:auto"> </a> </td></tr></tbody> </table> </td></tr></tbody></table> </td></tr></tbody></table> </body>
                    `

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
