import nodemailer from 'nodemailer';

// Validate required environment variables on startup
const REQUIRED_ENV = ['EMAIL_USER', 'EMAIL_PASSWORD', 'EMAIL_SERVICE'] as const;
const missingVars = REQUIRED_ENV.filter(varName => !process.env[varName]);

if (missingVars.length > 0 && process.env.NODE_ENV !== 'test') {
  console.error('Missing required email configuration:', missingVars.join(', '));
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Missing required email configuration');
  }
}

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify connection on startup
transporter.verify((error) => {
  if (error) {
    console.error('Email server connection failed:', error);
  } else {
    console.log('Email server connection successful');
  }
});

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

const sendEmail = async ({ to, subject, text, html }: EmailOptions): Promise<boolean> => {
  if (missingVars.length > 0) {
    console.error('Email not sent - missing configuration');
    return false;
  }

  try {
    await transporter.sendMail({
      from: `"Auth App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendOtpEmail = (email: string, otp: string): Promise<boolean> => {
  const subject = 'Your OTP Code';
  const text = `Your OTP code is: ${otp}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Your One-Time Password (OTP)</h2>
      <p>Use the following OTP to complete your verification:</p>
      <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
        <h1 style="margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
      </div>
      <p>This OTP is valid for 5 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
    </div>`;

  return sendEmail({ to: email, subject, text, html });
};
