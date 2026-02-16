require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Bank System" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail,name) {
    const subject='Welcome To Bank Syastem!'
    const text=`Dear ${name},\n\nThank you for registering with our Bank System. We are excited to have you on board and look forward to providing you with excellent banking services.\n\nBest regards,\nBank System Team`
    const html=`<p>Dear ${name},</p><p>Thank you for registering with our Bank System. We are excited to have you on board and look forward to providing you with excellent banking services.</p><p>Best regards,<br>Bank System Team</p>`
    
    await sendEmail(userEmail,subject,text,html)
    
}

module.exports = {
    sendRegistrationEmail
};


