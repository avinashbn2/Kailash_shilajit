'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { CheckoutFormData } from '@/types'
import { validateAll } from '@/lib/validation'
import { ShoppingBag, Loader2 } from 'lucide-react'

interface RazorpayResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

declare global {
  interface Window {
    Razorpay: new (options: {
      key: string | undefined
      amount: number
      currency: string
      name: string
      description: string
      order_id: string
      prefill: {
        name: string
        email: string
        contact: string
      }
      theme: {
        color: string
      }
      handler: (response: RazorpayResponse) => void
      modal: {
        ondismiss: () => void
      }
    }) => {
      open: () => void
    }
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online')
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    pinCode: ''
  })
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({})
  const [orderPlaced, setOrderPlaced] = useState(false)

  // Redirect if cart is empty (but not if order was just placed)
  useEffect(() => {
    if (cart.items.length === 0 && !orderPlaced) {
      router.push('/')
    }
  }, [cart.items, router, orderPlaced])

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Format phone number as user types
    let formattedValue = value;
    if (name === 'phone') {
      // Allow only digits, +, space, -, (, )
      formattedValue = value.replace(/[^\d+\-\s()]/g, '');
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }))
    // Clear error when user starts typing
    if (errors[name as keyof CheckoutFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    // Use the new validation utility
    const validationResults = validateAll(formData.email, formData.phone, formData.pinCode);

    // Update errors based on validation results
    if (!validationResults.email) {
      newErrors.email = validationResults.errors.email;
    }

    if (!validationResults.phone) {
      newErrors.phone = validationResults.errors.phone;
    }

    if (!validationResults.postalCode) {
      newErrors.pinCode = validationResults.errors.postalCode;
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle COD order
  const handleCODPayment = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Format phone number before sending to backend
      const formattedPhone = formData.phone.replace(/\D/g, '').length === 12 && formData.phone.replace(/\D/g, '').startsWith('91')
        ? formData.phone.replace(/\D/g, '').substring(2)  // Remove country code
        : formData.phone.replace(/\D/g, '');  // Just clean the number

      const orderResponse = await fetch('/api/orders/cod', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: cart.total,
          currency: 'INR',
          customerData: {
            ...formData,
            phone: formattedPhone
          },
          items: cart.items
        })
      })

      const responseData = await orderResponse.json()
      console.log('COD Order Response:', responseData)

      if (!orderResponse.ok) {
        throw new Error(responseData.error || 'Failed to create COD order')
      }

      const { order } = responseData

      if (!order || !order.id) {
        console.error('No order ID in response:', responseData)
        alert('Order created but no order ID received. Please check your orders.')
        setIsLoading(false)
        return
      }

      // Mark order as placed to prevent redirect to home when cart is cleared
      setOrderPlaced(true)

      // Clear cart
      clearCart()

      // Redirect to success page
      const successUrl = `/order/success?orderId=${order.id}`
      console.log('Redirecting to:', successUrl)
      router.push(successUrl)

    } catch (error) {
      console.error('COD order error:', error)
      alert('Failed to place COD order. Please try again.')
      setIsLoading(false)
    }
  }

  // Handle online payment via Razorpay
  const handleOnlinePayment = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Create Razorpay order
      // Format phone number before sending to backend
      const formattedPhone = formData.phone.replace(/\D/g, '').length === 12 && formData.phone.replace(/\D/g, '').startsWith('91')
        ? formData.phone.replace(/\D/g, '').substring(2)  // Remove country code
        : formData.phone.replace(/\D/g, '');  // Just clean the number

      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: cart.total,
          currency: 'INR',
          customerData: {
            ...formData,
            phone: formattedPhone
          },
          items: cart.items
        })
      })

      if (!orderResponse.ok) {
        throw new Error('Failed to create order')
      }

      const { orderId, amount, currency } = await orderResponse.json()

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: 'Kailash.asia',
        description: 'Order Payment',
        order_id: orderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formattedPhone
        },
        theme: {
          color: '#8A9C66'
        },
        handler: async function (response: RazorpayResponse) {
          // Verify payment
          const verifyResponse = await fetch('/api/razorpay/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          })

          if (verifyResponse.ok) {
            const { order } = await verifyResponse.json()
            // Mark order as placed to prevent redirect to home
            setOrderPlaced(true)
            // Clear cart
            clearCart()
            // Redirect to success page
            router.push(`/order/success?orderId=${order.id}`)
          } else {
            router.push('/order/failed')
          }
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false)
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (error) {
      console.error('Payment error:', error)
      alert('Failed to initiate payment. Please try again.')
      setIsLoading(false)
    }
  }

  // Main payment handler - routes to COD or online payment
  const handlePayment = async () => {
    if (paymentMethod === 'cod') {
      await handleCODPayment()
    } else {
      await handleOnlinePayment()
    }
  }

  if (cart.items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#FFFCF9] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link href="/" className="text-[#373436] hover:text-[#8A9C66]">Home</Link></li>
            <li className="text-[#373436]">/</li>
            <li className="text-[#8A9C66] font-semibold">Checkout</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Customer Details Form */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#373436] mb-6">Shipping Details</h2>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#373436] mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A9C66] focus:border-transparent`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#373436] mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A9C66] focus:border-transparent`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[#373436] mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  maxLength={15}
                  className={`w-full px-4 py-3 border ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A9C66] focus:border-transparent`}
                  placeholder="10-digit mobile number (with or without +91)"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-[#373436] mb-2">
                  Full Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-4 py-3 border ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A9C66] focus:border-transparent`}
                  placeholder="House No, Building, Street, Area"
                />
                {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
              </div>

              {/* PIN Code */}
              <div>
                <label htmlFor="pinCode" className="block text-sm font-medium text-[#373436] mb-2">
                  PIN Code *
                </label>
                <input
                  type="text"
                  id="pinCode"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleInputChange}
                  maxLength={6}
                  className={`w-full px-4 py-3 border ${
                    errors.pinCode ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A9C66] focus:border-transparent`}
                  placeholder="6-digit PIN code"
                />
                {errors.pinCode && <p className="mt-1 text-sm text-red-500">{errors.pinCode}</p>}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 lg:p-8 h-fit lg:sticky lg:top-4">
            <h2 className="text-2xl font-bold text-[#373436] mb-6">Order Summary</h2>

            {/* Cart Items */}
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {cart.items.map(item => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200">
                  <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[#373436] truncate">{item.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">Size: {item.size}</p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-sm font-bold text-[#373436] mt-1">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-[#373436]">
                <span>Subtotal ({cart.totalItems} items)</span>
                <span>₹{cart.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#373436]">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-[#373436] pt-3 border-t border-gray-200">
                <span>Total</span>
                <span>₹{cart.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-[#373436] mb-3">Payment Method</h3>
              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'online' ? 'border-[#8A9C66] bg-[#8A9C66]/5' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'online' | 'cod')}
                    className="w-4 h-4 text-[#8A9C66] focus:ring-[#8A9C66]"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-[#373436]">Pay Online</span>
                    <p className="text-xs text-gray-500 mt-0.5">Credit/Debit Card, UPI, Net Banking</p>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'cod' ? 'border-[#8A9C66] bg-[#8A9C66]/5' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'online' | 'cod')}
                    className="w-4 h-4 text-[#8A9C66] focus:ring-[#8A9C66]"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-[#373436]">Cash on Delivery</span>
                    <p className="text-xs text-gray-500 mt-0.5">Pay when you receive your order</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full bg-[#8A9C66] text-white py-4 rounded-lg font-semibold hover:bg-[#7a8a5a] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  {paymentMethod === 'cod' ? 'Place Order (COD)' : 'Proceed to Payment'}
                </>
              )}
            </button>

            {/* Security Badge */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-600">
                {paymentMethod === 'cod' ? (
                  'You will pay on delivery'
                ) : (
                  <><span className="font-semibold">Secure Payment</span> powered by Razorpay</>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
