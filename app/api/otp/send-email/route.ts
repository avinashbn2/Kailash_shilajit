import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { generateOTP, hashOTP, getOTPExpiry } from '@/lib/otp'
import { sendOTPEmail } from '@/lib/email'
import { checkOTPRateLimit } from '@/lib/rate-limit'
import { validateEmail } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate email format
    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check rate limiting
    const rateLimit = checkOTPRateLimit(email)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many requests. Please try again in ${rateLimit.retryAfter} seconds`,
          retryAfter: rateLimit.retryAfter,
        },
        { status: 429 }
      )
    }

    // Generate OTP
    const otp = generateOTP()
    const otpHash = await hashOTP(otp)
    const expiresAt = getOTPExpiry()

    // Get IP address for additional rate limiting
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

    // Store OTP in database
    const { error: dbError } = await supabaseAdmin
      .from('otp_verifications')
      .insert({
        email,
        otp_hash: otpHash,
        otp_type: 'email',
        expires_at: expiresAt.toISOString(),
        ip_address: ipAddress,
      })

    if (dbError) {
      console.error('[API] Failed to store OTP in database:', dbError)
      return NextResponse.json(
        { success: false, error: 'Failed to generate OTP. Please try again.' },
        { status: 500 }
      )
    }

    // Send OTP email
    try {
      await sendOTPEmail(email, otp)
    } catch (emailError) {
      console.error('[API] Failed to send OTP email:', emailError)
      return NextResponse.json(
        { success: false, error: 'Failed to send OTP email. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email',
      expiresIn: 300, // 5 minutes in seconds
    })
  } catch (error) {
    console.error('[API] Send email OTP error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
