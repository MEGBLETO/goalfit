import express from 'express';
import MailService from '../business/mailing';
import formParserMiddleware from '../middleware/parser';
import fs from 'fs';
import path from 'path';
import { PersistentFile } from 'formidable'; // Import de PersistentFile

const mailServiceI = new MailService();

const router = express.Router();

// Route to send a welcome email
router.post('/send-welcome-email', async (req, res) => {
    try {
        console.log(process.env.EMAIL, process.env.PASSWORD);
        console.log(req.body, "hello");
        const { email, name, url } = req.body;

        const response = await mailServiceI.sendWelcomeEmail(email, name, url);

        console.log(response);
        res.status(200).json({ message: 'Welcome email sent successfully', response });
    } catch (error) {
        console.log(error);
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to send a general email
// router.post('/send-email', formParserMiddleware, async (req: any, res) => {
//     try {
//         console.log("request data", req)
//         const { to, subject, content } = req.fields;
//         const { attachments } = req.files
    
//         const response = await !attachments ? mailServiceI.sendGeneralEmail(to, subject, content) : mailServiceI.sendGeneralEmail(to, subject, content, attachments);
//         res.status(200).json({ message: 'Email sent successfully', response });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     }
// });


router.post('/send-email', formParserMiddleware, async (req: any, res) => {
    try {
        console.log("request data", req.fields, req.files);

        let { to, subject, content } = req.fields;
        let attachments = [];

        to = to[0]
        subject = subject[0]
        content = content[0]

        // Si des fichiers sont joints, les préparer sous forme de Buffer pour nodemailer
        if (req.files && req.files.attachments) {
            const filesArray = Array.isArray(req.files.attachments)
                ? req.files.attachments // Si plusieurs fichiers sont présents
                : [req.files.attachments]; // Si un seul fichier est présent
            
            // Transformer les fichiers en objets d'attachements compatibles avec nodemailer
            attachments = filesArray.map((file: any) => ({
                filename: file.originalFilename, // Nom du fichier
                content: fs.readFileSync(file.filepath), // Lire le fichier sous forme de Buffer
                contentType: file.mimetype // Type MIME du fichier (ex. 'application/pdf')
            }));
        }

        // Envoyer l'email en fonction de la présence ou non d'attachements
        const response = await mailServiceI.sendGeneralEmail(to, subject, content, attachments);
        
        res.status(200).json({ message: 'Email sent successfully', response });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to send a password reset email
router.post('/send-password-reset-email', async (req, res) => {
    try {
        const { email, name, resetUrl } = req.body;
        const response = await mailServiceI.sendPasswordResetEmail(email, name, resetUrl);
        res.status(200).json({ message: 'Password reset email sent successfully', response });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to send an account verification email
router.post('/send-verification-email', async (req, res) => {
    try {
        const { email, name, verificationUrl } = req.body;
        const response = await mailServiceI.sendVerificationEmail(email, name, verificationUrl);
        res.status(200).json({ message: 'Verification email sent successfully', response });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to send a notification email
router.post('/send-notification-email', async (req, res) => {
    try {
        const { email, subject, content } = req.body;
        const response = await mailServiceI.sendNotificationEmail(email, subject, content);
        res.status(200).json({ message: 'Notification email sent successfully', response });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to send bulk emails
router.post('/send-bulk-email', async (req, res) => {
    try {
        const { recipients, subject, content } = req.body;
        const response = await mailServiceI.sendBulkEmails(recipients, subject, content);
        res.status(200).json({ message: 'Bulk email sent successfully', response });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;
