import express from 'express';
import SmsService from '../business/sms';
import { error } from 'console';

const smsService = new SmsService();

const router = express.Router();

// Route to send a general SMS
router.post('/send', async (req, res) => {
    try {
        const { phoneNumber, message } = req.body;
        const response = await smsService.sendSms(phoneNumber, message);
        res.status(200).json({ message: 'SMS sent successfully', response });
    } catch (error) {
        console.error('Error sending SMS:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to verify an OTP
router.post('/verify', async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;
        const response = await smsService.verifyOtp(phoneNumber, otp);
        if (response.valid) {
            res.status(200).json({ message: 'OTP verified successfully' });
        } else {
            res.status(400).json({ message: 'Invalid or expired OTP' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to resend an OTP
router.post('/resend', async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        const response = await smsService.resendOtp(phoneNumber);
        res.status(200).json({ message: 'OTP resent successfully', response });
    } catch (error) {
        console.error('Error resending OTP:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle SMS delivery status (Webhook)
router.post('/status', async (req, res) => {
    try {
        const { messageId, status, phoneNumber } = req.body;
        const response = await smsService.handleStatusUpdate(messageId, status, phoneNumber);
        res.status(200).json({ message: 'Status update received', response });
    } catch (error) {
        console.error('Error handling status update:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to retrieve SMS history
router.get('/history', async (req, res) => {
    try {
        const phoneNumber = req.query.phoneNumber as string;
        const startDate = req.query.startDate as string;
        const endDate = req.query.endDate as string;

        if (!phoneNumber || !startDate || !endDate) {
            throw new Error("phoneNumber, startDate, and endDate are required");
        }

        const response = await smsService.getSmsHistory(phoneNumber, startDate, endDate);

        res.status(200).json({ message: 'SMS history retrieved successfully', response });
    } catch (error) {
        console.error('Error retrieving SMS history:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Route to send a promotional or notification SMS
router.post('/notify', async (req, res) => {
    try {
        const { phoneNumber, message } = req.body;
        const response = await smsService.sendPromotionalSms(phoneNumber, message);
        res.status(200).json({ message: 'Promotional SMS sent successfully', response });
    } catch (error) {
        console.error('Error sending promotional SMS:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to send bulk SMS
router.post('/send-bulk', async (req, res) => {
    try {
        const { recipients, message } = req.body;
        const response = await smsService.sendBulkSms(recipients, message);
        res.status(200).json({ message: 'Bulk SMS sent successfully', response });
    } catch (error) {
        console.error('Error sending bulk SMS:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;
