// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const { email, subject, message } = options;
  //Create a transporter
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_AUTH_USER,
      pass: process.env.EMAIL_AUTH_PASSWORD,
    },
  });
  //Define the email options
  const mailOptions = {
    from: 'Wexox <wexox@hello.io>',
    to: email,
    subject,
    text: message,
  };

  //send the actual email
  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
