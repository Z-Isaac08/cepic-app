const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // In development, we'll use console logging instead of real emails
    if (process.env.NODE_ENV === 'production' && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      this.transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      this.isConfigured = true;
    } else {
      this.transporter = null;
      this.isConfigured = false;
      console.log('📧 Email Service: Development mode - emails will be logged to console');
    }
  }

  async send2FACode(email, code, name = '') {
    // In development mode, just log to console
    if (!this.isConfigured) {
      console.log('\n🔐 2FA CODE EMAIL SIMULATION');
      console.log('='.repeat(50));
      console.log(`📧 To: ${email}`);
      console.log(`👤 Name: ${name || 'User'}`);
      console.log(`🔑 2FA Code: ${code}`);
      console.log(`⏰ Expires: 10 minutes`);
      console.log('='.repeat(50));
      return { success: true };
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your 2FA Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Verification Code</h2>
          <p>Hello ${name || 'there'},</p>
          <p>Your verification code is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; margin: 0; font-size: 32px; letter-spacing: 5px;">${code}</h1>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <p>Best regards,<br>The ProjectMoney Team</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`2FA code sent to ${email}`);
      return { success: true };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  async sendWelcomeEmail(email, name) {
    // In development mode, just log to console
    if (!this.isConfigured) {
      console.log('\n🎉 WELCOME EMAIL SIMULATION');
      console.log('='.repeat(50));
      console.log(`📧 To: ${email}`);
      console.log(`👤 Name: ${name}`);
      console.log(`📄 Subject: Welcome to ProjectMoney!`);
      console.log('='.repeat(50));
      return { success: true };
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to ProjectMoney!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to ProjectMoney!</h2>
          <p>Hello ${name},</p>
          <p>Thank you for joining ProjectMoney. Your account has been successfully created.</p>
          <p>You can now log in and start using our services.</p>
          <p>Best regards,<br>The ProjectMoney Team</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${email}`);
      return { success: true };
    } catch (error) {
      console.error('Welcome email sending failed:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();