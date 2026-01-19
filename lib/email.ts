import { Resend } from 'resend'
import type { Order } from '@/types'

// Lazy initialize Resend client to avoid build-time errors when API key is not set
let resendClient: Resend | null = null
function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }
  return resendClient
}
const fromEmail = process.env.RESEND_FROM_EMAIL || 'orders@kailash.asia'

/**
 * Send OTP email for verification
 */
export async function sendOTPEmail(email: string, otp: string): Promise<void> {
  // Skip in development mode if configured
  if (process.env.SKIP_NOTIFICATIONS === 'true') {
    console.log(`[DEV MODE] Email OTP for ${email}: ${otp}`)
    return
  }

  try {
    const { data, error } = await getResendClient().emails.send({
      from: `Kailash.asia <${fromEmail}>`,
      to: email,
      subject: 'Your Verification Code - Kailash.asia',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8A9C66; margin: 0;">Kailash.asia</h1>
          </div>

          <h2 style="color: #373436; margin-bottom: 20px;">Email Verification</h2>

          <p style="color: #373436; font-size: 16px; line-height: 1.5;">
            Your verification code is:
          </p>

          <div style="background-color: #FFFCF9; border: 2px solid #8A9C66; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
            <div style="font-size: 36px; font-weight: bold; color: #8A9C66; letter-spacing: 8px;">
              ${otp}
            </div>
          </div>

          <p style="color: #373436; font-size: 14px; line-height: 1.5;">
            This code will expire in <strong>5 minutes</strong>.
          </p>

          <p style="color: #666; font-size: 14px; line-height: 1.5; margin-top: 30px;">
            If you didn't request this code, please ignore this email.
          </p>

          <div style="border-top: 1px solid #ddd; margin-top: 30px; padding-top: 20px; text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              &copy; 2024 Kailash.asia. All rights reserved.
            </p>
          </div>
        </div>
      `,
      text: `Your OTP code is: ${otp}. This code will expire in 5 minutes. If you didn't request this code, please ignore this email.`,
    })

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`)
    }

    console.log('[EMAIL] OTP sent successfully:', data?.id)
  } catch (error) {
    console.error('[EMAIL] Failed to send OTP:', error)
    throw error
  }
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(order: Order): Promise<void> {
  // Skip in development mode if configured
  if (process.env.SKIP_NOTIFICATIONS === 'true') {
    console.log(`[DEV MODE] Order confirmation email for ${order.customerEmail}`)
    return
  }

  try {
    const formattedAmount = (order.amount / 100).toFixed(2)
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const itemsHTML = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>${item.name}</strong><br/>
            <span style="color: #666; font-size: 14px;">Size: ${item.size} | Qty: ${item.quantity}</span>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
            ₹${((item.price * item.quantity) / 100).toFixed(2)}
          </td>
        </tr>
      `
      )
      .join('')

    const { data, error } = await getResendClient().emails.send({
      from: `Kailash.asia <${fromEmail}>`,
      to: order.customerEmail,
      subject: `Order Confirmation - #${order.orderId} | Kailash.asia`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FFFCF9;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8A9C66; margin: 0;">Kailash.asia</h1>
          </div>

          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #373436; margin-top: 0;">Thank you for your order!</h2>

            <p style="color: #373436; font-size: 16px; line-height: 1.5;">
              Hi ${order.customerName},
            </p>

            <p style="color: #373436; font-size: 16px; line-height: 1.5;">
              We've received your payment and are preparing your items for shipment.
            </p>

            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #373436; margin-top: 0;">Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 5px 0;"><strong>Order ID:</strong></td>
                  <td style="padding: 5px 0; text-align: right;">${order.orderId}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;"><strong>Payment ID:</strong></td>
                  <td style="padding: 5px 0; text-align: right;">${order.paymentId || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;"><strong>Order Date:</strong></td>
                  <td style="padding: 5px 0; text-align: right;">${orderDate}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;"><strong>Total Amount:</strong></td>
                  <td style="padding: 5px 0; text-align: right; color: #8A9C66; font-size: 18px;">₹${formattedAmount}</td>
                </tr>
              </table>
            </div>

            <h3 style="color: #373436;">Items Ordered</h3>
            <table style="width: 100%; border-collapse: collapse;">
              ${itemsHTML}
            </table>

            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #373436; margin-top: 0;">Shipping Details</h3>
              <p style="margin: 5px 0; color: #373436;"><strong>${order.customerName}</strong></p>
              <p style="margin: 5px 0; color: #666;">${order.shippingAddress}</p>
              <p style="margin: 5px 0; color: #666;">PIN: ${order.pinCode}</p>
              <p style="margin: 5px 0; color: #666;">Phone: ${order.customerPhone}</p>
            </div>

            <div style="background-color: #FFFCF9; border-left: 4px solid #8A9C66; padding: 15px; margin: 20px 0;">
              <h3 style="color: #373436; margin-top: 0;">What's Next?</h3>
              <ol style="color: #666; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Your order is being processed</li>
                <li>You'll receive a shipping confirmation email within 24-48 hours</li>
                <li>Track your order status anytime</li>
              </ol>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #666; font-size: 14px;">Need help?</p>
              <p style="color: #373436;">
                <strong>Email:</strong> support@kailash.asia<br/>
              </p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #999; font-size: 12px;">
              Thank you for shopping with Kailash.asia!
            </p>
            <p style="color: #999; font-size: 12px;">
              &copy; 2024 Kailash.asia. All rights reserved.
            </p>
          </div>
        </div>
      `,
      text: `
Thank you for your order, ${order.customerName}!

ORDER SUMMARY
Order ID: ${order.orderId}
Payment ID: ${order.paymentId || 'N/A'}
Order Date: ${orderDate}
Total Amount: ₹${formattedAmount}

ITEMS ORDERED
${order.items.map((item) => `- ${item.name} (${item.size}) × ${item.quantity} - ₹${((item.price * item.quantity) / 100).toFixed(2)}`).join('\n')}

SHIPPING DETAILS
${order.customerName}
${order.shippingAddress}
PIN: ${order.pinCode}
Phone: ${order.customerPhone}

WHAT'S NEXT?
1. Your order is being processed
2. You'll receive a shipping confirmation email within 24-48 hours
3. Track your order status anytime

NEED HELP?
Email: support@kailash.asia

Thank you for shopping with Kailash.asia!
      `,
    })

    if (error) {
      throw new Error(`Failed to send order confirmation email: ${error.message}`)
    }

    console.log('[EMAIL] Order confirmation sent successfully:', data?.id)
  } catch (error) {
    console.error('[EMAIL] Failed to send order confirmation:', error)
    throw error
  }
}
