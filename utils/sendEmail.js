// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');

// SMTP Server : A SERVER for sending and receiving emails it communicates with other SMTP SERVER to deliver emails to the recipients
// our backend server need a SMTP server to handle sending message so we connect to one via nodemailer
// host : mean poviders (our SMTP server) that we can connect to them : gmail - yahoo - outlook 
// u can connect to multiple smtp servers by configuring multiple transporter
// Create transporter object for Gmail mean i will send my message from gmail
const gmailTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: process.env.SMTP_PORT ,
    secure: true,
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD
    }
});
const sendEmail = async (options) => {
        const mailOptions = {
            from: process.env.GMAIL_EMAIL,
            to: options.to,
            subject: options.subject,
            text: options.text,
    
        };
        try 
        {
        const info = await gmailTransporter.sendMail(mailOptions);
        } 
        catch (e) {
            console.log('Error sending', e);
        }
 
};



module.exports = sendEmail
