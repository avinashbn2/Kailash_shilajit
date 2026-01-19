import { sendOrderConfirmationEmail, sendCODOrderAlertToSupport } from './email'

// Re-export for use in API routes
export { sendCODOrderAlertToSupport }
import { sendOrderSMS } from './sms'
import { retryWithBackoff } from './retry'
import type { Order, NotificationStatus } from '@/types'

/**
 * Send both email and SMS notifications for an order
 * Non-blocking - order succeeds even if notifications fail
 */
export async function sendOrderNotifications(
  order: Order
): Promise<NotificationStatus> {
  const results: NotificationStatus = {
    email: { success: false, error: null },
    sms: { success: false, error: null },
  }

  // Send email notification (with retry)
  try {
    await retryWithBackoff(() => sendOrderConfirmationEmail(order), 3, 1000)
    results.email.success = true
    console.log('[NOTIFICATIONS] Email sent successfully for order:', order.id)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    results.email.error = errorMessage
    console.error('[NOTIFICATIONS] Email failed for order:', order.id, error)
  }

  // Send SMS notification (with retry)
  try {
    await retryWithBackoff(() => sendOrderSMS(order), 3, 1000)
    results.sms.success = true
    console.log('[NOTIFICATIONS] SMS sent successfully for order:', order.id)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    results.sms.error = errorMessage
    console.error('[NOTIFICATIONS] SMS failed for order:', order.id, error)
  }

  return results
}
