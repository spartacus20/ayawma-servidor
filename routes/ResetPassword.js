
const express = require('express')
require('dotenv').config();
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const { conector } = require("../mysql_conector.js");
const bcrypt = require("bcrypt");

const router = express.Router();


router.post("/forgot-password", (req, res) => {

    const { email } = req.body;
    console.log(req.body)
    const QUERY = "SELECT * FROM users WHERE email = ?";

    conector.query(QUERY, [email], (err, rows) => {

        if (err) throw err;



        const data = JSON.parse(JSON.stringify(rows));

        const secret = process.env.REFRESH_TOKEN_SECRET + data[0].password;

        const token = jwt.sign({ email: data[0].email, id: data[0].id }, secret, {
            expiresIn: "15m",
        })

        const link = process.env.CLIENT_URL + "reset-password/" + data[0].id + "/" + token
        console.log(link)

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

        email_body = `
        <div class="nl-container" style="min-width: 320px;Margin: 0 auto;">
        <div style="background-color:transparent;">
            <div class="block-grid"
                style="Margin: 0 auto;max-width: 600px;width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                <div class="inner-block-grid"
                    style="border-collapse:collapse;display: table;width: 100%;table-layout: fixed; border-top: 1px solid lightgray;">

                    <div class="col width-100 responsive-width-100"
                        style="Float: left;background-color: transparent;display: table-cell;vertical-align: top;width: 600px;">

                        <div style="background-color: transparent;">
                            <div style="line-height: 16px; font-size:1px">&nbsp;</div>

                            <div style="line-height:16px; font-size:1px">&nbsp;</div>
                        </div>
                        <div style="background-color: transparent;">
                            <div style="width: 100% !important;">
                                <table width="100%" cellpadding="16"
                                    style="width: 100%; table-layout: fixed; border-collapse: collapse; border-top: 0px solid #ccc;">
                                    <tbody>
                                        <tr>
                                            <td valign="middle" align="left" style="padding: 16px; text-align: left;">
                                                <h1
                                                    style="font-family: Open Sans, Arial, Sans;font-style: normal;font-weight: bold;font-size: 24px;line-height: 24px;color:#333333; margin: 0;">
                                                    Update your password</h1>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <table width="100%" cellpadding="16"
                                    style="width: 100%; table-layout: fixed; border-collapse: collapse;">
                                    <tbody>
                                        <tr>
                                            <td valign="middle" align="left"
                                                style="padding: 16px; text-align: left; padding-top:0px;">
                                                <p
                                                    style="font-family: Open Sans, Arial, Sans;font-style: normal;font-weight: normal;font-size: 14px;line-height: 20px;color:#333333; margin-top:20px;">
                                                    You don´t remember the password to access the best offers? We have the solution.</p>
                                                <p
                                                    style="font-family: Open Sans, Arial, Sans;font-style: normal;font-weight: normal;font-size: 14px;line-height: 20px;color:#333333; margin-top:20px;">
                                                    Click on the next button 👇</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div style="width: 100% !important;">
                            <div align="center" style="margin-right: 8px;margin-left: 8px;">
                                    <!-- link aqui -->
                                 <a href="${link}"
                                    style="color: #FFFFFF; text-decoration: none;" target="_blank"
                                    title="Update your password">

                                    <div
                                        style="display: inline-block; line-height: 18px; color: #FFFFFF; background-color: black; border-radius: 3px; max-width: 100%; width: auto; border: 0px solid transparent ; padding-top: 12px; padding-right: 24px; padding-bottom: 12px; padding-left: 24px; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; text-align: center;">

                                        <span>
                                            <p><span style="font-size: 14pt;">Update your password</span></p>
                                        </span>

                                    </div>
                            

                                </a>
                                <div style="line-height: 8px; font-size:1px">&nbsp;</div>
                            </div>
                        </div>
                        <div style="background-color: transparent;">
                            <div style="width: 100% !important; border-bottom: 1px solid lightgrey;">
                                <table width="100%" cellpadding="16"
                                    style="width: 100%; table-layout: fixed; border-collapse: collapse; border-top: 0px solid #ccc;">
                                    <tbody>
                                        <tr>
                                            <td valign="middle" align="left" style="padding: 16px; text-align: left;">
                                                <p
                                                    style="font-family: Open Sans, Arial, Sans;font-style: normal;font-weight: normal;font-size: 14px;line-height: 20px;color:#333333; margin-top:20px;">
                                                    You have 15 minutes to access this link. Do not forget that you can only use it once. More secure, impossible.</p>
                                            </td>
                                        </tr>
                                    </tbody>

                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
        `

        var mailOptions = {
            from: '"Ayawma" <no-reply@ayawma.com>',
            to: data[0].email,
            subject: "Password Reset",
            text: link,
            html: email_body,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });

        res.send({ msg: "Email has been sent" })

    })



})

router.post("/reset-password/:id/:token",  async (req, res) => {

    const { id, token } = req.params
    const { password } = req.body
    console.log(password)
    console.log(token)
    let passwordHashed = await bcrypt.hash(password, 10); 
    // const verifiedToken =  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
    // console.log(verifiedToken)
    console.log(passwordHashed)
    const QUERY = "UPDATE `users` SET password = ? WHERE id = ?"; 
    
    conector.query(QUERY, [passwordHashed, id], (err) => {
        if(err) throw err; 
        res.send({msg: "Password has been changed"})
    })
    console.log(passwordHashed)




})



module.exports = router;