# Email OTP Authentication Setup

This document explains how to set up the email functionality for the OTP authentication flow.

## Prerequisites

1. Node.js (v14 or later)
2. npm or yarn
3. An email service provider (Gmail, SendGrid, etc.)

## Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
# Email Configuration
EMAIL_SERVICE=gmail  # or your email service provider
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password  # For Gmail, use an App Password

# Optional: Set to 'development' for more detailed error messages
NODE_ENV=development
```

## Gmail Setup (Recommended for Development)

1. Go to your [Google Account Settings](https://myaccount.google.com/)
2. Navigate to "Security"
3. Enable "2-Step Verification" if not already enabled
4. Go to "App Passwords"
   - If you don't see this option, make sure 2-Step Verification is enabled
5. Generate a new app password
   - Select "Mail" as the app
   - Select your device type
   - Click "Generate"
6. Copy the generated 16-character password
7. Use this password as the `EMAIL_PASSWORD` in your `.env.local` file

## Other Email Providers

For other email providers (like SendGrid, Mailgun, etc.), you'll need to:

1. Sign up for an account with the provider
2. Get your SMTP credentials
3. Update the email configuration in `src/lib/email.ts` with the appropriate SMTP settings

## Testing the Email Setup

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Navigate to the signup or login page
3. Enter your email address and submit the form
4. Check your email for the OTP (also check spam folder)
5. Enter the OTP to complete verification

## Troubleshooting

1. **Email not sending**
   - Check your `.env.local` file for correct credentials
   - Verify your email service provider's SMTP settings
   - Check the browser console and server logs for errors

2. **Gmail blocking sign-ins**
   - Make sure to use an App Password instead of your regular password
   - Check if "Less secure app access" is enabled in your Google Account settings

3. **Emails going to spam**
   - Check your spam folder
   - Whitelist the sender email address
   - For production, set up proper SPF, DKIM, and DMARC records

## Production Considerations

For production environments, consider:

1. Using a dedicated email service (SendGrid, Mailgun, etc.)
2. Setting up domain authentication (SPF, DKIM, DMARC)
3. Implementing rate limiting on the `/api/send-otp` endpoint
4. Using a queue system for sending emails
5. Monitoring email delivery and bounce rates
