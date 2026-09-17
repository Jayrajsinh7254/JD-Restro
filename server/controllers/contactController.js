const Contact = require('../models/Contact');
const sendEmail = require('../utils/sendEmail');

let MOCK_CONTACTS_STORE = [];

// @desc    Submit contact message
// @route   POST /api/contact
// @access  Public
const createContactMessage = async (req, res, next) => {
    try {
        if (process.env.MOCK_DATABASE === 'true') {
            const newContact = {
                _id: 'c_' + Date.now().toString(),
                ...req.body,
                createdAt: new Date()
            };
            MOCK_CONTACTS_STORE.unshift(newContact);
            return res.status(201).json({
                success: true,
                data: newContact,
                message: 'Thank you! Your message has been received.'
            });
        }

        const message = await Contact.create(req.body);

        // Send notification email to admin
        try {
            const emailContent = `
        New Contact Form Submission:
        
        From: ${message.name} (${message.email})
        Subject: ${message.subject}
        
        Message:
        ${message.message}
      `;

            await sendEmail({
                email: process.env.EMAIL_FROM, // Send to restaurant email
                subject: `New Contact Form: ${message.subject}`,
                message: emailContent,
            });
        } catch (err) {
            console.log('Admin notification email could not be sent', err);
        }

        res.status(201).json({
            success: true,
            data: message,
            message: 'Message sent successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
const getContactMessages = async (req, res, next) => {
    try {
        if (process.env.MOCK_DATABASE === 'true') {
            return res.json({ success: true, count: MOCK_CONTACTS_STORE.length, data: MOCK_CONTACTS_STORE });
        }
        const messages = await Contact.find({}).sort({ createdAt: -1 });
        res.json({ success: true, count: messages.length, data: messages });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createContactMessage,
    getContactMessages,
};
