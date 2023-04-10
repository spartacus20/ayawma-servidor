const express = require('express')
require('dotenv').config();
const nodemailer = require('nodemailer');

const router = express.Router();

router.post("/support", (req, res) => {

  

    var transporter = nodemailer.createTransport(
        {
            host: "mail.ayawma.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: "no-reply@ayawma.com", // generated ethereal user
                pass: "(i*i&L$peg??", // generated ethereal password
            },
        }
    )

    let mailOptions = {
        from: req.body.name + ' <' + req.body.email + '>', // sender address
        to: 'support@ayawma.com', // list of receivers
        subject: req.body.subject, // Subject line
        text: req.body.message // plain text body
    };


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).json({ error: 'Failed to send email' });
        } else {
            console.log('Message sent: %s', info.messageId);
            res.json({ message: 'Email sent successfully' });
        }
    });


})

module.exports = router;