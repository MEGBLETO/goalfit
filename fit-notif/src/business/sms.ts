import twilio from 'twilio';

class SmsService {
   client: any;
   fromPhoneNumber: any;
   
  constructor() {
    this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    this.fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
  }

  async sendSms(phoneNumber: string, message: string) {
    try {
      const response = await this.client.messages.create({
        body: message,
        from: this.fromPhoneNumber,
        to: phoneNumber,
      });
      return response;
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw new Error('Failed to send SMS');
    }
  }

  async verifyOtp(phoneNumber: string, otp: string) {
    try {
      const storedOtp = await this.getStoredOtpForPhoneNumber(phoneNumber);
      if (storedOtp && storedOtp === otp) {
        return { valid: true };
      } else {
        return { valid: false };
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw new Error('Failed to verify OTP');
    }
  }

  async resendOtp(phoneNumber: string) {
    try {
      const newOtp = this.generateOtp();
      await this.storeOtpForPhoneNumber(phoneNumber, newOtp);
      const message = `Your OTP code is ${newOtp}`;
      return await this.sendSms(phoneNumber, message);
    } catch (error) {
      console.error('Error resending OTP:', error);
      throw new Error('Failed to resend OTP');
    }
  }

  async handleStatusUpdate(messageId: string, status: string, phoneNumber: string) {
    try {
      console.log(`Message ID: ${messageId} Status: ${status} Phone: ${phoneNumber}`);
      return { success: true };
    } catch (error) {
      console.error('Error handling status update:', error);
      throw new Error('Failed to handle status update');
    }
  }

  async getSmsHistory(phoneNumber:string, startDate: string, endDate: string) {
    try {
      const messages = await this.client.messages.list({
        to: phoneNumber,
        dateSentAfter: startDate,
        dateSentBefore: endDate,
      });
      return messages;
    } catch (error) {
      console.error('Error retrieving SMS history:', error);
      throw new Error('Failed to retrieve SMS history');
    }
  }

  async sendPromotionalSms(phoneNumber: string, message: string) {
    try {
      return await this.sendSms(phoneNumber, message);
    } catch (error) {
      console.error('Error sending promotional SMS:', error);
      throw new Error('Failed to send promotional SMS');
    }
  }

  async sendBulkSms(recipients: [string], message: string) {
    try {
      const responses = await Promise.all(
        recipients.map(phoneNumber => this.sendSms(phoneNumber, message))
      );
      return responses;
    } catch (error) {
      console.error('Error sending bulk SMS:', error);
      throw new Error('Failed to send bulk SMS');
    }
  }

  generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async storeOtpForPhoneNumber(phoneNumber: string, otp: string) {
    console.log(`Storing OTP ${otp} for phone number ${phoneNumber}`);
  }

  async getStoredOtpForPhoneNumber(phoneNumber: string) {
    console.log(`Fetching stored OTP for phone number ${phoneNumber}`);
    return '123456';
  }
}

export default SmsService;
