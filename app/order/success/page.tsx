'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Package, Mail, Phone, MapPin, Home, ShoppingBag } from 'lucide-react'
import { Order } from '@/types'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If no orderId, show generic success (don't redirect)
    if (!orderId) {
      setLoading(false)
      setError('no-order-id')
      return
    }

    // Fetch order details from Supabase
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`)
        if (response.ok) {
          const data = await response.json()
          setOrder(data)
        } else {
          setError('Could not load order details')
        }
      } catch (err) {
        console.error('Failed to fetch order:', err)
        setError('Failed to load order')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFCF9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8A9C66] mx-auto"></div>
          <p className="mt-4 text-[#373436]">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#FFFCF9] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#373436] mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Your order has been received. You will receive a confirmation email shortly.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#8A9C66] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#7a8a5a] transition-colors"
          >
            <Home className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  const isCOD = order.paymentMethod === 'cod' || order.status === 'cod_pending'
  const formattedAmount = (order.amount / 100).toLocaleString('en-IN')

  return (
    <div className="min-h-screen bg-[#FFFCF9] py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#373436] mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 text-lg">
            {isCOD ? 'Your Cash on Delivery order has been confirmed' : 'Thank you for your purchase'}
          </p>
        </div>

        {/* COD Notice */}
        {isCOD && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <span className="text-3xl">💵</span>
              </div>
              <div>
                <h3 className="font-bold text-amber-800 text-lg">Cash on Delivery</h3>
                <p className="text-amber-700 mt-1">
                  Please keep <span className="font-bold">₹{formattedAmount}</span> ready at the time of delivery.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Order Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <Package className="w-6 h-6 text-[#8A9C66]" />
            <h2 className="text-xl font-bold text-[#373436]">Order Details</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Order ID</p>
              <p className="font-bold text-[#373436] text-sm mt-1 break-all">{order.orderId}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{isCOD ? 'Payment Method' : 'Payment ID'}</p>
              <p className="font-bold text-[#373436] text-sm mt-1">
                {isCOD ? 'Cash on Delivery' : (order.paymentId || 'N/A')}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{isCOD ? 'Amount to Pay' : 'Amount Paid'}</p>
              <p className="font-bold text-[#8A9C66] text-lg mt-1">₹{formattedAmount}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Order Date</p>
              <p className="font-bold text-[#373436] text-sm mt-1">
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-bold text-[#373436] mb-4">Items Ordered</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={item.id || index} className="flex gap-4 bg-gray-50 rounded-lg p-3">
                  <div className="relative w-16 h-16 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-gray-100">
                    <Image
                      src={item.image || '/placeholder.png'}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#373436] text-sm line-clamp-2">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Size: {item.size} | Qty: {item.quantity}</p>
                    <p className="text-sm font-bold text-[#8A9C66] mt-1">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shipping Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-bold text-[#373436] mb-4">Shipping Details</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#8A9C66]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-[#8A9C66]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                <p className="font-semibold text-[#373436]">{order.customerEmail}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#8A9C66]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-[#8A9C66]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                <p className="font-semibold text-[#373436]">{order.customerPhone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#8A9C66]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#8A9C66]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Shipping Address</p>
                <p className="font-semibold text-[#373436]">{order.shippingAddress}</p>
                <p className="text-sm text-gray-600">PIN: {order.pinCode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Email Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📧</span>
            <div>
              <p className="font-semibold text-blue-800">Confirmation Email Sent</p>
              <p className="text-sm text-blue-700 mt-1">
                A confirmation email has been sent to <strong>{order.customerEmail}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-[#8A9C66]/10 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-[#373436] mb-3">What&apos;s Next?</h3>
          <ol className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="bg-[#8A9C66] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">1</span>
              <span>Your order is being processed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-[#8A9C66] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">2</span>
              <span>You&apos;ll receive a shipping confirmation within 24-48 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-[#8A9C66] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">3</span>
              <span>Track your order via the tracking link in your email</span>
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 bg-[#8A9C66] text-white py-4 rounded-xl font-semibold hover:bg-[#7a8a5a] transition-colors text-center flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>

        {/* Support */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Need help? Contact us at <a href="mailto:support@kailash.asia" className="text-[#8A9C66] font-semibold hover:underline">support@kailash.asia</a></p>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FFFCF9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8A9C66] mx-auto"></div>
          <p className="mt-4 text-[#373436]">Loading...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}
