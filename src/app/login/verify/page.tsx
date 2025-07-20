'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Container, Typography, Box, Alert, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Cookies from 'js-cookie';

// OTP validation schema
const loginOtpSchema = yup.object().shape({
  otp: yup
    .string()
    .required('OTP is required')
    .matches(/^\d{6}$/, 'OTP must be 6 digits'),
});

type OtpFormData = yup.InferType<typeof loginOtpSchema>;

const OTP_EXPIRY_TIME = 300; // 5 minutes in seconds

const LoginVerifyPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(OTP_EXPIRY_TIME);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [userData, setUserData] = useState<{ email: string }>({ email: '' });

  const { control, handleSubmit, formState: { errors } } = useForm<OtpFormData>({
    resolver: yupResolver(loginOtpSchema),
    defaultValues: {
      otp: '',
    },
  });

  // Generate a random 6-digit OTP
  const generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Function to send OTP email
  const sendOtp = async (email: string, otp: string) => {
    try {
      setIsSendingOtp(true);
      setError('');
      
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to send OTP');
      }
      
      console.log('OTP sent to email:', email);
      setCountdown(OTP_EXPIRY_TIME);
      setResendDisabled(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError(error instanceof Error ? error.message : 'Failed to send OTP. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Load user data from cookies and send OTP on component mount
  useEffect(() => {
    const tempLoginData = Cookies.get('tempLoginData');
    if (tempLoginData) {
      const parsedData = JSON.parse(tempLoginData);
      setUserData({ email: parsedData.email });
      
      // Generate and send OTP
      const otp = generateOtp();
      setGeneratedOtp(otp);
      sendOtp(parsedData.email, otp);
    } else {
      // Redirect to login if no login data is found
      router.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Handle countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleResendOtp = () => {
    if (!userData.email) return;
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);
    sendOtp(userData.email, newOtp);
  };

  const onSubmit = async (data: OtpFormData) => {
    try {
      setIsSubmitting(true);
      setError('');

      // Verify the OTP
      if (data.otp !== generatedOtp) {
        throw new Error('Invalid OTP. Please try again.');
      }

      // In a real app, you would make an API call to verify the OTP with your backend
      // const response = await fetch('/api/verify-login-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: userData.email, otp: data.otp }),
      // });
      // if (!response.ok) {
      //   const errorData = await response.json().catch(() => ({}));
      //   throw new Error(errorData.error || 'Failed to verify OTP');
      // }
      
      // For demo, just log the verification
      console.log('Login OTP verified successfully for email:', userData.email);

      // Clear temp login data from cookies
      Cookies.remove('tempLoginData');
      
      // Store auth token in cookies (in a real app, this would come from your backend)
      const authToken = 'dummy-auth-token';
      const refreshToken = 'dummy-refresh-token';
      
      // Set cookies with secure flags
      Cookies.set('authToken', authToken, { 
        expires: 1, // 1 day expiry
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      });
      
      Cookies.set('refreshToken', refreshToken, { 
        expires: 7, // 7 days expiry
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
      });

      // On successful verification, redirect to dashboard or home page.
      router.push('/');
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
      console.error('Verification error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Login Verification
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          We've sent a verification code to your email.
          Please enter it below to complete your login.
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3, width: '100%' }}>

          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="otp"
                label={`Verification Code (sent to ${userData.email || 'your email'})`}
                autoComplete="off"
                autoFocus
                error={!!errors.otp}
                helperText={errors.otp?.message}
                inputProps={{
                  maxLength: 6,
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                }}
              />
            )}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Button
              size="small"
              disabled={resendDisabled || isSendingOtp}
              onClick={handleResendOtp}
            >
              {isSendingOtp ? (
                <CircularProgress size={20} />
              ) : resendDisabled ? (
                `Resend in ${formatTime(countdown)}`
              ) : (
                'Resend OTP'
              )}
            </Button>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Verify Login'
            )}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginVerifyPage;