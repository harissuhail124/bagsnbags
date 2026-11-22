const nodemailer = require('nodemailer');
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = require('../config/env');

/**
 * Send an email. In development, falls back to Ethereal if SMTP env vars are missing.
 */
const sendEmail = async ({ to, subject, text, html }) => {
  let transporter;
  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465, // true for 465, false otherwise
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  } else {
    // Create a test account on the fly (Ethereal)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  const info = await transporter.sendMail({
    from: `"Bags'n'Bags" <no-reply@bagsnbags.com>`,
    to,
    subject,
    text,
    html,
  });

  // If using Ethereal, log preview URL for dev
  if (info.messageId && info.preview && info.preview.url) {
    console.log('📧 Preview URL:', info.preview.url);
  } else if (info.messageId && nodemailer.getTestMessageUrl) {
    console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
  }

  return info;
};

module.exports = { sendEmail };
