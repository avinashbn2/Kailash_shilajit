import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-min-32-chars-long'
const JWT_EXPIRY = '15m' // 15 minutes

interface VerificationTokenPayload {
  email?: string
  phone?: string
  type: 'email' | 'phone'
  verified: boolean
}

/**
 * Generate a JWT verification token
 */
export function generateVerificationToken(
  identifier: string,
  type: 'email' | 'phone'
): string {
  const payload: VerificationTokenPayload = {
    [type]: identifier,
    type,
    verified: true,
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

/**
 * Verify and decode a JWT verification token
 */
export function verifyVerificationToken(
  token: string
): VerificationTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as VerificationTokenPayload
    return decoded
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

/**
 * Validate that a verification token matches the provided identifier
 */
export function validateVerificationToken(
  token: string,
  identifier: string,
  type: 'email' | 'phone'
): boolean {
  const decoded = verifyVerificationToken(token)

  if (!decoded) {
    return false
  }

  if (decoded.type !== type) {
    return false
  }

  if (type === 'email' && decoded.email !== identifier) {
    return false
  }

  if (type === 'phone' && decoded.phone !== identifier) {
    return false
  }

  return decoded.verified === true
}
