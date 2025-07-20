import { NextResponse } from 'next/server';
import { sendOtpEmail } from '@/lib/email';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_REGEX = /^\d{6}$/;

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    // Input validation
    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (!OTP_REGEX.test(otp)) {
      return NextResponse.json(
        { error: 'Invalid OTP format. Must be 6 digits.' },
        { status: 400 }
      );
    }

    const emailSent = await sendOtpEmail(email, otp);
    if (!emailSent) {
      console.error('Failed to send OTP email');
      return NextResponse.json(
        { error: 'Failed to send OTP. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in send-otp API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to send OTP', ...(process.env.NODE_ENV === 'development' && { details: errorMessage }) },
      { status: 500 }
    );
  }
}

// CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
