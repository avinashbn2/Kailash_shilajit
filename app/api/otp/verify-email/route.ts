import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyOTP, isOTPExpired } from '@/lib/otp'
import { generateVerificationToken } from '@/lib/jwt'
import { validateEmail } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, otp } = body

    // Validate inputs
    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { success: false, verified: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    if (!otp || otp.length !== 6) {
      return NextResponse.json(
        { success: false, verified: false, error: 'Invalid OTP format' },
        { status: 400 }
      )
    }

    // Find the most recent unverified OTP for this email
    const { data: otpRecords, error: fetchError } = await supabaseAdmin
      .from('otp_verifications')
      .select('*')
      .eq('email', email)
      .eq('otp_type', 'email')
      .eq('verified', false)
      .order('created_at', { ascending: false })
      .limit(1)

    if (fetchError || !otpRecords || otpRecords.length === 0) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          error: 'No OTP found. Please request a new one.',
        },
        { status: 400 }
      )
    }

    const otpRecord = otpRecords[0]

    // Check if OTP has expired
    if (isOTPExpired(otpRecord.expires_at)) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          error: 'OTP has expired. Please request a new one.',
        },
        { status: 400 }
      )
    }

    // Check if max attempts exceeded
    if (otpRecord.verification_attempts >= 5) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          error: 'Too many verification attempts. Please request a new OTP.',
        },
        { status: 429 }
      )
    }

    // Verify OTP
    const isValid = await verifyOTP(otp, otpRecord.otp_hash)

    if (!isValid) {
      // Increment attempt count
      await supabaseAdmin
        .from('otp_verifications')
        .update({ verification_attempts: otpRecord.verification_attempts + 1 })
        .eq('id', otpRecord.id)

      const attemptsRemaining = 5 - (otpRecord.verification_attempts + 1)

      return NextResponse.json(
        {
          success: false,
          verified: false,
          error: 'Invalid OTP',
          attemptsRemaining: Math.max(0, attemptsRemaining),
        },
        { status: 400 }
      )
    }

    // Mark OTP as verified
    await supabaseAdmin
      .from('otp_verifications')
      .update({
        verified: true,
        verified_at: new Date().toISOString(),
      })
      .eq('id', otpRecord.id)

    // Generate verification token (JWT)
    const verificationToken = generateVerificationToken(email, 'email')

    return NextResponse.json({
      success: true,
      verified: true,
      verificationToken,
    })
  } catch (error) {
    console.error('[API] Verify email OTP error:', error)
    return NextResponse.json(
      { success: false, verified: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
