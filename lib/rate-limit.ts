import { LRUCache } from 'lru-cache'

const OTP_RATE_LIMIT_REQUESTS = parseInt(
  process.env.OTP_RATE_LIMIT_REQUESTS || '3'
)
const OTP_RATE_LIMIT_WINDOW_MINUTES = parseInt(
  process.env.OTP_RATE_LIMIT_WINDOW_MINUTES || '10'
)

// LRU cache to store request timestamps
// max: 10000 entries, ttl: 10 minutes
const otpRequestCache = new LRUCache<string, number[]>({
  max: 10000,
  ttl: 1000 * 60 * OTP_RATE_LIMIT_WINDOW_MINUTES,
})

export interface RateLimitResult {
  allowed: boolean
  retryAfter?: number
}

/**
 * Check if an OTP request is allowed based on rate limiting
 * Returns { allowed: boolean, retryAfter?: number (seconds) }
 */
export function checkOTPRateLimit(identifier: string): RateLimitResult {
  const now = Date.now()
  const windowMs = OTP_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000
  const requests = otpRequestCache.get(identifier) || []

  // Remove requests older than the time window
  const recentRequests = requests.filter((time) => now - time < windowMs)

  // Check if rate limit exceeded
  if (recentRequests.length >= OTP_RATE_LIMIT_REQUESTS) {
    const oldestRequest = Math.min(...recentRequests)
    const retryAfter = Math.ceil((oldestRequest + windowMs - now) / 1000)
    return { allowed: false, retryAfter }
  }

  // Add current request to the list
  recentRequests.push(now)
  otpRequestCache.set(identifier, recentRequests)

  return { allowed: true }
}

/**
 * Clear rate limit for an identifier (useful for testing)
 */
export function clearRateLimit(identifier: string): void {
  otpRequestCache.delete(identifier)
}
