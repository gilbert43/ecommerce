const nodemailer = require("nodemailer");
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler(
    async (data,req,res) =>{
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL,
              pass: process.env.EMAIL_PASS,
            },
          });
          
          let mailOptions = {
            from: 'gilbert.ateka@aimsoft.co.ke',
            to: data.to,
            subject: data.subject,
            html: data.html,
            
          };
          
          transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
             console.log(err)
            } else {
              console.log(info)
            }
          });
    }
);

module.exports = {sendEmail}