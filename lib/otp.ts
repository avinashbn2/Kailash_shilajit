import bcrypt from 'bcryptjs'

/**
 * Generate a cryptographically random 6-digit OTP
 */
export function generateOTP(): string {
  const min = 100000
  const max = 999999
  const otp = Math.floor(Math.random() * (max - min + 1)) + min
  return otp.toString()
}

/**
 * Hash an OTP using bcrypt
 */
export async function hashOTP(otp: string): Promise<string> {
  const saltRounds = 10
  return await bcrypt.hash(otp, saltRounds)
}

/**
 * Verify an OTP against its hash
 */
export async function verifyOTP(otp: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(otp, hash)
}

/**
 * Get OTP expiry timestamp (5 minutes from now)
 */
export function getOTPExpiry(): Date {
  const expirySeconds = parseInt(process.env.OTP_EXPIRY_SECONDS || '300')
  const now = new Date()
  return new Date(now.getTime() + expirySeconds * 1000)
}

/**
 * Check if an OTP has expired
 */
export function isOTPExpired(expiresAt: Date | string): boolean {
  const expiryDate = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt
  return new Date() > expiryDate
}
