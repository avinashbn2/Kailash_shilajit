import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'
import { sendOrderNotifications } from '@/lib/notifications'
import { RazorpayPaymentVerification } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body: RazorpayPaymentVerification = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex')

    const isValid = expectedSignature === razorpay_signature

    if (!isValid) {
      // Update order status to 'failed'
      await supabaseAdmin
        .from('orders')
        .update({ status: 'failed' })
        .eq('order_id', razorpay_order_id)

      return NextResponse.json(
        { error: 'Invalid signature', verified: false },
        { status: 400 }
      )
    }

    // Update order status to 'paid' and add payment ID
    const { data: order, error: dbError } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'paid',
        payment_id: razorpay_payment_id
      })
      .eq('order_id', razorpay_order_id)
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to update order status' },
        { status: 500 }
      )
    }

    // Send order notifications (email + SMS) - non-blocking
    const notificationResults = await sendOrderNotifications(order)

    // Update notification status in database
    await supabaseAdmin
      .from('orders')
      .update({
        email_notification_sent: notificationResults.email.success,
        email_notification_sent_at: notificationResults.email.success
          ? new Date().toISOString()
          : null,
        email_notification_error: notificationResults.email.error,
        sms_notification_sent: notificationResults.sms.success,
        sms_notification_sent_at: notificationResults.sms.success
          ? new Date().toISOString()
          : null,
        sms_notification_error: notificationResults.sms.error,
      })
      .eq('id', order.id)

    return NextResponse.json({
      verified: true,
      order,
      notifications: {
        email: notificationResults.email.success,
        sms: notificationResults.sms.success,
      },
    })

  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
