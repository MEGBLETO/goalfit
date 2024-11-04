import nodemailer, { Transporter } from 'nodemailer';
import Mailgen, { Content } from 'mailgen';

const email = process.env.EMAIL as string;
const password = process.env.PASSWORD as string;

class MailService {
    private transporter: Transporter;
    private mailGenerator: Mailgen;

    constructor() {
        console.log(email, password, "Mail service initialized");

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: email,
                pass: password,
            }
        });

        this.mailGenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'FitGoal',
                link: 'http://fitgoal.com/',
            }
        });
    }

    // Method to send a welcome email
    async sendWelcomeEmail(userEmail: string, userName: string, verificationUrl: string): Promise<void> {
        const emailTemplate: Content = {
            body: {
                name: userName,
                intro: 'Welcome to FitGoal! We are excited to help you reach your fitness goals.',
                action: {
                    instructions: 'To get started, please fill out the following form so we can tailor your meal plan and workout plan just for you:',
                    button: {
                        color: '#A020F0', 
                        text: 'Complete Your Profile',
                        link: `${process.env.APP_URL}/complete-profile`,
                    }
                },
                outro: 'If you have any questions, simply reply to this email, and we’ll be happy to assist you.'
            }
        };

        const emailBody = this.mailGenerator.generate(emailTemplate);

        const mailOptions = {
            from: email,
            to: userEmail,
            subject: 'Welcome to FitGoal!',
            html: emailBody,
        };

        return await this.transporter.sendMail(mailOptions);
    }

    // Method to send a general email
    async sendGeneralEmail(recipient: string, subject: string, content: string, attachments: any = null): Promise<void> {
        const mailOptions = {
            from: email,
            to: recipient,
            subject: subject,
            text: content,
            attachments: attachments
        };

        await this.transporter.sendMail(mailOptions);
    }

    // Method to send a password reset email
    async sendPasswordResetEmail(userEmail: string, userName: string, resetUrl: string): Promise<void> {
        const emailTemplate: Content = {
            body: {
                name: userName,
                intro: 'You are receiving this email because a password reset request for your account was received.',
                action: {
                    instructions: 'Click the button below to reset your password:',
                    button: {
                        color: '#DC4D2F',
                        text: 'Reset your password',
                        link: resetUrl,
                    }
                },
                outro: 'If you did not request a password reset, no further action is required on your part.'
            }
        };

        const emailBody = this.mailGenerator.generate(emailTemplate);

        const mailOptions = {
            from: email,
            to: userEmail,
            subject: 'Password Reset Request',
            html: emailBody,
        };

        await this.transporter.sendMail(mailOptions);
    }

    // Method to send an account verification email
    async sendVerificationEmail(userEmail: string, userName: string, verificationUrl: string): Promise<void> {
        console.log(verificationUrl, "hello")
        const emailTemplate: Content = {
            body: {
                name: userName,
                intro: 'Welcome to FitGoal! Please verify your email address to get started.',
                action: {
                    instructions: 'Click the button below to verify your email:',
                    button: {
                        color: '#DC4D2F',
                        text: 'Verify your email',
                        link: verificationUrl,
                    }
                },
                outro: 'Need help or have questions? Simply reply to this email, and we will be happy to assist you.'
            }
        };

        const emailBody = this.mailGenerator.generate(emailTemplate);

        const mailOptions = {
            from: email,
            to: userEmail,
            subject: 'Verify your email address',
            html: emailBody,
        };

        await this.transporter.sendMail(mailOptions);
    }

    // Method to send a notification email
    async sendNotificationEmail(userEmail: string, subject: string, content: string): Promise<void> {
        const emailTemplate: Content = {
            body: {
                name: userEmail,
                intro: content,
                outro: 'Need help or have questions? Simply reply to this email, and we will be happy to assist you.'
            }
        };

        const emailBody = this.mailGenerator.generate(emailTemplate);

        const mailOptions = {
            from: email,
            to: userEmail,
            subject: subject,
            html: emailBody,
        };

        await this.transporter.sendMail(mailOptions);
    }

    // Method to send bulk emails
    async sendBulkEmails(recipients: string[], subject: string, content: string): Promise<void> {
        const emailTemplate: Content = {
            body: {
                intro: content,
                outro: 'Need help or have questions? Simply reply to this email, and we will be happy to assist you.'
            }
        };

        const emailBody = this.mailGenerator.generate(emailTemplate);

        const mailOptions = {
            from: email,
            bcc: recipients.join(','), 
            subject: subject,
            html: emailBody,
        };

        await this.transporter.sendMail(mailOptions);
    }
}

export default MailService;
