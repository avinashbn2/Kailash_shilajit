import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendOrderNotifications, sendCODOrderAlertToSupport } from '@/lib/notifications'
import { CheckoutFormData, CartItem } from '@/types'

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

    // Create unique COD order ID
    const codOrderId = `COD_${Date.now()}_${Math.random().toString(36).substring(7)}`

    // Store order in Supabase with 'cod_pending' status
    const { data: order, error: dbError } = await supabaseAdmin
      .from('orders')
      .insert({
        order_id: codOrderId,
        amount: amount * 100, // Convert to paise for consistency
        currency,
        status: 'cod_pending',
        payment_method: 'cod',
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        shipping_address: customerData.address,
        pin_code: customerData.pinCode,
        items: items
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

    // Transform the order data to match our Order type
    const transformedOrder = {
      id: order.id,
      orderId: order.order_id,
      paymentId: order.payment_id || null,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      paymentMethod: order.payment_method,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      shippingAddress: order.shipping_address,
      pinCode: order.pin_code,
      items: order.items,
      createdAt: order.created_at,
      updatedAt: order.updated_at
    }

    // Return success immediately - don't wait for notifications
    const response = NextResponse.json({
      success: true,
      order: transformedOrder,
    })

    // Send notifications in the background (non-blocking)
    // Using Promise.all with catch to ensure they don't block
    Promise.all([
      sendOrderNotifications(transformedOrder).catch(err => {
        console.error('[COD] Failed to send notifications:', err)
        return { email: { success: false, error: err.message }, sms: { success: false, error: err.message } }
      }),
      sendCODOrderAlertToSupport(transformedOrder).catch(err => {
        console.error('[COD] Failed to send support alert:', err)
      })
    ]).then(async ([notificationResults]) => {
      // Update notification status in database (fire and forget)
      if (notificationResults) {
        try {
          await supabaseAdmin
            .from('orders')
            .update({
              email_notification_sent: notificationResults.email?.success || false,
              email_notification_sent_at: notificationResults.email?.success
                ? new Date().toISOString()
                : null,
              email_notification_error: notificationResults.email?.error || null,
              sms_notification_sent: notificationResults.sms?.success || false,
              sms_notification_sent_at: notificationResults.sms?.success
                ? new Date().toISOString()
                : null,
              sms_notification_error: notificationResults.sms?.error || null,
            })
            .eq('id', order.id)
        } catch (err) {
          console.error('[COD] Failed to update notification status:', err)
        }
      }
    })

    return response

  } catch (error) {
    console.error('Error creating COD order:', error)
    return NextResponse.json(
      { error: 'Failed to create COD order' },
      { status: 500 }
    )
  }
}
