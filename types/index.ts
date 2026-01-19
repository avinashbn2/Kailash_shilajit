// Product Types
export interface Product {
  id: string
  name: string
  shortDescription: string
  price: number
  mrp: number
  images: string[]
  sizes: string[]
  currentSize: string
  rating: number
  reviewCount: number
  questionCount: number
  answerCount: number
  inStock: boolean
  whatIsIt?: string
  whatDoesItDo?: string[]
  ourPromise?: string
  usage?: string[]
  whatMakesItSpecial?: string
}

// Cart Types
export interface CartItem {
  id: string // Unique cart item ID (product.id + size)
  productId: string
  name: string
  price: number
  mrp: number
  image: string
  size: string
  quantity: number
}

export interface Cart {
  items: CartItem[]
  totalItems: number
  subtotal: number
  total: number
}

// Checkout Types
export interface CheckoutFormData {
  name: string
  email: string
  phone: string
  address: string
  pinCode: string
  emailVerificationToken?: string
  phoneVerificationToken?: string
}

// Order Types
export interface Order {
  id: string
  orderId: string // Razorpay order ID
  paymentId?: string // Razorpay payment ID
  amount: number
  currency: string
  status: 'created' | 'paid' | 'failed'
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  pinCode: string
  items: CartItem[]
  emailVerified?: boolean
  phoneVerified?: boolean
  emailVerifiedAt?: string
  phoneVerifiedAt?: string
  emailNotificationSent?: boolean
  emailNotificationSentAt?: string
  emailNotificationError?: string
  smsNotificationSent?: boolean
  smsNotificationSentAt?: string
  smsNotificationError?: string
  createdAt: string
  updatedAt: string
}

// Razorpay Types
export interface RazorpayOrderResponse {
  id: string
  entity: string
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  receipt: string
  status: string
  created_at: number
}

export interface RazorpayPaymentVerification {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

// OTP Verification Types
export interface OTPVerification {
  id: string
  email?: string
  phone?: string
  otpHash: string
  otpType: 'email' | 'phone'
  verificationAttempts: number
  verified: boolean
  verifiedAt?: string
  expiresAt: string
  ipAddress?: string
  createdAt: string
  updatedAt: string
}

export interface OTPSendResponse {
  success: boolean
  message?: string
  error?: string
  expiresIn?: number
  retryAfter?: number
}

export interface OTPVerifyResponse {
  success: boolean
  verified: boolean
  verificationToken?: string
  error?: string
  attemptsRemaining?: number
}

export interface NotificationStatus {
  email: {
    success: boolean
    error: string | null
  }
  sms: {
    success: boolean
    error: string | null
  }
}
