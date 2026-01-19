import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { supabaseAdmin } from '@/lib/supabase'
import { validateVerificationToken } from '@/lib/jwt'
import { CheckoutFormData, CartItem } from '@/types'

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency = 'INR', customerData, items }: {
      amount: number
      currency?: string
      customerData: CheckoutFormData
      items: CartItem[]
    } = body

    // Validate required fields
    if (!amount || !customerData || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Skip verification in development mode if configured
    const skipVerification = process.env.SKIP_OTP_VERIFICATION === 'true'

    if (!skipVerification) {
      // Validate email verification token
      if (!customerData.emailVerificationToken) {
        return NextResponse.json(
          { error: 'Email verification required. Please verify your email.' },
          { status: 403 }
        )
      }

      if (!validateVerificationToken(
        customerData.emailVerificationToken,
        customerData.email,
        'email'
      )) {
        return NextResponse.json(
          { error: 'Invalid or expired email verification. Please verify again.' },
          { status: 403 }
        )
      }

      // Validate phone verification token
      if (!customerData.phoneVerificationToken) {
        return NextResponse.json(
          { error: 'Phone verification required. Please verify your phone number.' },
          { status: 403 }
        )
      }

      if (!validateVerificationToken(
        customerData.phoneVerificationToken,
        customerData.phone,
        'phone'
      )) {
        return NextResponse.json(
          { error: 'Invalid or expired phone verification. Please verify again.' },
          { status: 403 }
        )
      }
    }

    // Create unique receipt ID
    const receipt = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency,
      receipt,
      notes: {
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone
      }
    })

    // Store order in Supabase with 'created' status
    const { data: order, error: dbError } = await supabaseAdmin
      .from('orders')
      .insert({
        order_id: razorpayOrder.id,
        amount: amount * 100,
        currency,
        status: 'created',
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        shipping_address: customerData.address,
        pin_code: customerData.pinCode,
        items: items,
        email_verified: !skipVerification,
        phone_verified: !skipVerification,
        email_verified_at: !skipVerification ? new Date().toISOString() : null,
        phone_verified_at: !skipVerification ? new Date().toISOString() : null
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to store order in database' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      dbOrderId: order.id
    })

  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
