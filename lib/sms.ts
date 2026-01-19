import type { Order } from '@/types'

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY
const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID || 'KAILSH'
const MSG91_OTP_TEMPLATE_ID = process.env.MSG91_OTP_TEMPLATE_ID
const MSG91_ORDER_TEMPLATE_ID = process.env.MSG91_ORDER_TEMPLATE_ID

/**
 * Send OTP SMS using MSG91
 */
export async function sendOTPSMS(phone: string, otp: string): Promise<void> {
  // Skip in development mode if configured
  if (process.env.SKIP_NOTIFICATIONS === 'true') {
    console.log(`[DEV MODE] SMS OTP for ${phone}: ${otp}`)
    return
  }

  if (!MSG91_AUTH_KEY || !MSG91_OTP_TEMPLATE_ID) {
    console.log('[SMS] MSG91 credentials not configured, skipping SMS')
    throw new Error('SMS not configured - MSG91 credentials missing')
  }

  try {
    // Format phone number (add country code if not present)
    const formattedPhone = phone.startsWith('91') ? phone : `91${phone}`

    const response = await fetch('https://control.msg91.com/api/v5/otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authkey: MSG91_AUTH_KEY,
      },
      body: JSON.stringify({
        template_id: MSG91_OTP_TEMPLATE_ID,
        mobile: formattedPhone,
        authkey: MSG91_AUTH_KEY,
        otp: otp,
        otp_expiry: 5, // minutes
      }),
    })

    const data = await response.json()

    if (data.type !== 'success' && !response.ok) {
      throw new Error(data.message || 'Failed to send SMS')
    }

    console.log('[SMS] OTP sent successfully to:', phone)
  } catch (error) {
    console.error('[SMS] Failed to send OTP:', error)
    throw error
  }
}

/**
 * Send order confirmation SMS using MSG91
 */
export async function sendOrderSMS(order: Order): Promise<void> {
  // Skip in development mode if configured
  if (process.env.SKIP_NOTIFICATIONS === 'true') {
    console.log(`[DEV MODE] Order confirmation SMS for ${order.customerPhone}`)
    return
  }

  if (!MSG91_AUTH_KEY || !MSG91_ORDER_TEMPLATE_ID) {
    console.log('[SMS] MSG91 credentials not configured, skipping SMS')
    throw new Error('SMS not configured - MSG91 credentials missing')
  }

  try {
    // Format phone number (add country code if not present)
    const formattedPhone = order.customerPhone.startsWith('91')
      ? order.customerPhone
      : `91${order.customerPhone}`

    // Format amount in rupees
    const amountInRupees = (order.amount / 100).toFixed(0)

    // Shorten order ID for SMS (take last 10 chars)
    const shortOrderId = order.orderId.substring(order.orderId.length - 10)

    // Create tracking URL (you can customize this)
    const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/order/success?orderId=${order.id}`

    const response = await fetch('https://control.msg91.com/api/v5/flow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authkey: MSG91_AUTH_KEY,
      },
      body: JSON.stringify({
        template_id: MSG91_ORDER_TEMPLATE_ID,
        sender: MSG91_SENDER_ID,
        short_url: '1', // Enable URL shortening
        mobiles: formattedPhone,
        authkey: MSG91_AUTH_KEY,
        order_id: shortOrderId,
        amount: amountInRupees,
        tracking_url: trackingUrl,
      }),
    })

    const data = await response.json()

    if (data.type !== 'success' && !response.ok) {
      throw new Error(data.message || 'Failed to send SMS')
    }

    console.log('[SMS] Order confirmation sent successfully to:', order.customerPhone)
  } catch (error) {
    console.error('[SMS] Failed to send order confirmation:', error)
    throw error
  }
}
