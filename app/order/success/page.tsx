'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Package, Mail, Phone, MapPin } from 'lucide-react'
import { Order } from '@/types'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) {
      router.push('/')
      return
    }

    // Fetch order details from Supabase
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`)
        if (response.ok) {
          const data = await response.json()
          setOrder(data)
        }
      } catch (error) {
        console.error('Failed to fetch order:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, router])

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

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FFFCF9] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#373436]">Order not found</p>
          <Link href="/" className="text-[#8A9C66] hover:underline mt-4 inline-block">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFFCF9] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#373436] mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">Thank you for your purchase</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-[#8A9C66]" />
            <h2 className="text-xl font-semibold text-[#373436]">Order Details</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-semibold text-[#373436]">{order.orderId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment ID</p>
              <p className="font-semibold text-[#373436]">{order.paymentId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Amount Paid</p>
              <p className="font-semibold text-[#373436]">₹{(order.amount / 100).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-semibold text-[#373436]">
                {new Date(order.createdAt).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-[#373436] mb-3">Items Ordered</h3>
            <div className="space-y-3">
              {order.items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 h-16 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-contain" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#373436] text-sm">{item.name}</p>
                    <p className="text-xs text-gray-600">Size: {item.size} | Qty: {item.quantity}</p>
                    <p className="text-sm font-bold text-[#373436]">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shipping Details Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#373436] mb-4">Shipping Details</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#8A9C66] mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-[#373436]">{order.customerEmail}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#8A9C66] mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold text-[#373436]">{order.customerPhone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#8A9C66] mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Shipping Address</p>
                <p className="font-semibold text-[#373436]">{order.shippingAddress}</p>
                <p className="font-semibold text-[#373436]">PIN: {order.pinCode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Email Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            📧 A confirmation email has been sent to <strong>{order.customerEmail}</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            href="/"
            className="flex-1 bg-[#8A9C66] text-white py-3 rounded-lg font-semibold hover:bg-[#7a8a5a] transition-colors text-center"
          >
            Continue Shopping
          </Link>
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
