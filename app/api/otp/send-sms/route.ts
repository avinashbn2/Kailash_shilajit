import { generateOTP, getOTPExpiry, hashOTP } from '@/lib/otp'
import { checkOTPRateLimit } from '@/lib/rate-limit'
import { sendOTPSMS } from '@/lib/sms'
import { supabaseAdmin } from '@/lib/supabase'
import { formatIndianPhoneNumber, validateIndianPhoneNumber } from '@/lib/validation'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    let { phone } = body

    // Validate and format phone number
    if (!phone || !validateIndianPhoneNumber(phone)) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number. Please enter a 10-digit Indian mobile number.' },
        { status: 400 }
      )
    }

    // Format phone number (remove country code for storage)
    phone = formatIndianPhoneNumber(phone)

    // Check rate limiting
    const rateLimit = checkOTPRateLimit(phone)
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
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'

    // Store OTP in database
    const { error: dbError } = await supabaseAdmin
      .from('otp_verifications')
      .insert({
        phone,
        otp_hash: otpHash,
        otp_type: 'phone',
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

    // Send OTP SMS
    try {
      await sendOTPSMS(phone, otp)
    } catch (smsError) {
      console.error('[API] Failed to send OTP SMS:', smsError)
      return NextResponse.json(
        { success: false, error: 'Failed to send OTP SMS. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your phone',
      expiresIn: 300, // 5 minutes in seconds
    })
  } catch (error) {
    console.error('[API] Send SMS OTP error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
