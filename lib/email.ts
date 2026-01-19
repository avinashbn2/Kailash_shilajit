import nodemailer from 'nodemailer'
import type { Order } from '@/types'

// Create SMTP transporter
let transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  }
  return transporter
}

const fromEmail = process.env.SMTP_FROM_EMAIL || 'orders@kailash.asia'
const fromName = process.env.SMTP_FROM_NAME || 'Kailash.asia'

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
    const info = await getTransporter().sendMail({
      from: `${fromName} <${fromEmail}>`,
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

    console.log('[EMAIL] OTP sent successfully:', info.messageId)
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

    const isCOD = order.paymentMethod === 'cod' || order.status === 'cod_pending'

    const itemsHTML = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>${item.name}</strong><br/>
            <span style="color: #666; font-size: 14px;">Size: ${item.size} | Qty: ${item.quantity}</span>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
            ₹${(item.price * item.quantity).toLocaleString('en-IN')}
          </td>
        </tr>
      `
      )
      .join('')

    const paymentStatusMessage = isCOD
      ? 'Your order has been placed successfully. Payment will be collected on delivery.'
      : 'We\'ve received your payment and are preparing your items for shipment.'

    const paymentStatusRow = isCOD
      ? `<tr>
          <td style="padding: 5px 0;"><strong>Payment Method:</strong></td>
          <td style="padding: 5px 0; text-align: right;">Cash on Delivery</td>
        </tr>`
      : `<tr>
          <td style="padding: 5px 0;"><strong>Payment ID:</strong></td>
          <td style="padding: 5px 0; text-align: right;">${order.paymentId || 'N/A'}</td>
        </tr>`

    const info = await getTransporter().sendMail({
      from: `${fromName} <${fromEmail}>`,
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
              ${paymentStatusMessage}
            </p>

            ${isCOD ? `
            <div style="background-color: #FFF3CD; border: 1px solid #FFECB5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-weight: bold;">
                Cash on Delivery Order
              </p>
              <p style="color: #856404; margin: 5px 0 0 0; font-size: 14px;">
                Please keep ₹${formattedAmount} ready at the time of delivery.
              </p>
            </div>
            ` : ''}

            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #373436; margin-top: 0;">Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 5px 0;"><strong>Order ID:</strong></td>
                  <td style="padding: 5px 0; text-align: right;">${order.orderId}</td>
                </tr>
                ${paymentStatusRow}
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

${isCOD ? 'CASH ON DELIVERY ORDER - Please keep ₹' + formattedAmount + ' ready at the time of delivery.\n' : ''}
ORDER SUMMARY
Order ID: ${order.orderId}
${isCOD ? 'Payment Method: Cash on Delivery' : 'Payment ID: ' + (order.paymentId || 'N/A')}
Order Date: ${orderDate}
Total Amount: ₹${formattedAmount}

ITEMS ORDERED
${order.items.map((item) => `- ${item.name} (${item.size}) × ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`).join('\n')}

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

    console.log('[EMAIL] Order confirmation sent successfully:', info.messageId)
  } catch (error) {
    console.error('[EMAIL] Failed to send order confirmation:', error)
    throw error
  }
}

/**
 * Send COD order alert to support team
 */
export async function sendCODOrderAlertToSupport(order: Order): Promise<void> {
  // Skip in development mode if configured
  if (process.env.SKIP_NOTIFICATIONS === 'true') {
    console.log(`[DEV MODE] COD support alert for order ${order.orderId}`)
    return
  }

  try {
    const formattedAmount = (order.amount / 100).toFixed(2)
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    const itemsHTML = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.size}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
        </tr>
      `
      )
      .join('')

    const supportEmail = process.env.SUPPORT_EMAIL || 'support@kailash.asia'

    const info = await getTransporter().sendMail({
      from: `${fromName} Orders <${fromEmail}>`,
      to: supportEmail,
      subject: `[COD ORDER] New COD Order #${order.orderId} - ₹${formattedAmount}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #FFF3CD; border: 1px solid #FFECB5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #856404; margin: 0;">New Cash on Delivery Order</h2>
          </div>

          <h3 style="color: #373436; border-bottom: 2px solid #8A9C66; padding-bottom: 10px;">Order Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0;"><strong>Order ID:</strong></td>
              <td style="padding: 8px 0;">${order.orderId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Order Date:</strong></td>
              <td style="padding: 8px 0;">${orderDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Total Amount:</strong></td>
              <td style="padding: 8px 0; font-size: 18px; color: #8A9C66; font-weight: bold;">₹${formattedAmount}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Payment Method:</strong></td>
              <td style="padding: 8px 0; color: #856404; font-weight: bold;">Cash on Delivery</td>
            </tr>
          </table>

          <h3 style="color: #373436; border-bottom: 2px solid #8A9C66; padding-bottom: 10px;">Customer Information</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0;"><strong>Name:</strong></td>
              <td style="padding: 8px 0;">${order.customerName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Email:</strong></td>
              <td style="padding: 8px 0;">${order.customerEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Phone:</strong></td>
              <td style="padding: 8px 0;">${order.customerPhone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Address:</strong></td>
              <td style="padding: 8px 0;">${order.shippingAddress}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>PIN Code:</strong></td>
              <td style="padding: 8px 0;">${order.pinCode}</td>
            </tr>
          </table>

          <h3 style="color: #373436; border-bottom: 2px solid #8A9C66; padding-bottom: 10px;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Product</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Size</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Qty</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Price</th>
            </tr>
            ${itemsHTML}
          </table>

          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; color: #666;">
              This is an automated notification. Please process this COD order accordingly.
            </p>
          </div>
        </div>
      `,
      text: `
NEW CASH ON DELIVERY ORDER

ORDER DETAILS
Order ID: ${order.orderId}
Order Date: ${orderDate}
Total Amount: ₹${formattedAmount}
Payment Method: Cash on Delivery

CUSTOMER INFORMATION
Name: ${order.customerName}
Email: ${order.customerEmail}
Phone: ${order.customerPhone}
Address: ${order.shippingAddress}
PIN Code: ${order.pinCode}

ITEMS ORDERED
${order.items.map((item) => `- ${item.name} (${item.size}) × ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`).join('\n')}

This is an automated notification. Please process this COD order accordingly.
      `,
    })

    console.log('[EMAIL] COD support alert sent successfully:', info.messageId)
  } catch (error) {
    console.error('[EMAIL] Failed to send COD support alert:', error)
    throw error
  }
}
