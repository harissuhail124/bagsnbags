const ContactMessage = require('../models/ContactMessage');
const { sendEmail } = require('../utils/email');

const submitContactMessage = async (req, res, next) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    const err = new Error('Name, email, and message are required.');
    err.statusCode = 400;
    return next(err);
  }

  const doc = await ContactMessage.create({
    name,
    email,
    subject: subject || 'General Atelier Inquiry',
    message,
  });

  // Optional: notify admin
  try {
    await sendEmail({
      to: 'concierge@bagsnbags.com',
      subject: `New Atelier Inquiry from ${name}: ${subject || 'Inquiry'}`,
      text: `Message from: ${name} (${email})\n\n${message}`,
    });
  } catch (e) {
    // ignore email failure in dev
  }

  res.status(201).json({ message: 'Your message has been received. Our concierge will be in touch shortly.' });
};

const listMessagesAdmin = async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.json({ messages });
};

module.exports = { submitContactMessage, listMessagesAdmin };
