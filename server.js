// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    const mailOptions = {
        from: email,
        to: 'divinepropertymaint@gmail.com',
        subject: 'New Contact Form from Website!',
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    const userConfirmationMailOptions = {
        from: 'divinepropertymaint@gmail.com',
        to: email,
        subject: 'Thank you for contacting Divine Property Maintenance',
        text: 'We will get back to you shortly',
    };

    try {
        await transporter.sendMail(mailOptions);
        await transporter.sendMail(userConfirmationMailOptions);
        res.status(200).send({ message: 'Emails sent successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
