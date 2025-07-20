# Authentication Flow with Email OTP

A secure authentication system built with Next.js, featuring email-based OTP verification for both signup and login processes. This project implements modern security practices and provides a seamless user experience.



## ✨ Features

- 🔐 Secure email-based authentication
- ✉️ Real OTP delivery via email
- 📱 Responsive design with Material UI
- 🛡️ Secure cookie-based session management
- ⚡ Fast refresh and optimized builds
- 🔄 Token refresh mechanism
- 📝 Form validation with Yup
- 🎨 Modern UI with Material UI components

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- Email service credentials (Gmail, SendGrid, etc.)

### Installation

1. Clone the repository:
   
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   EMAIL_SERVICE=your_email_service  # e.g., gmail, sendgrid
   EMAIL_USER=your_email@example.com
   EMAIL_PASSWORD=your_app_specific_password
   NODE_ENV=development
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## 📚 Documentation

### Project Structure

```
src/
├── app/                    # App router pages
│   ├── api/                # API routes
│   ├── login/              # Login pages
│   ├── signup/             # Signup pages
│   └── ...
├── components/             # Reusable components
├── lib/                    # Utility functions
│   └── email.ts            # Email service
└── styles/                 # Global styles
```

### Authentication Flow

1. **Signup Process**:
   - User submits email and password
   - System sends OTP to the provided email
   - User verifies OTP to complete registration
   - Account is created and session is established

2. **Login Process**:
   - User submits email and password
   - System sends OTP to the registered email
   - User verifies OTP to authenticate
   - Session is established with tokens

### Environment Variables

| Variable       | Required | Description                          |
|----------------|----------|--------------------------------------|
| `EMAIL_SERVICE`| Yes      | Email service provider (e.g., gmail) |
| `EMAIL_USER`   | Yes      | Sender email address                 |
| `EMAIL_PASSWORD`| Yes     | App-specific password or API key     |
| `NODE_ENV`     | No       | Environment (development/production)  |



