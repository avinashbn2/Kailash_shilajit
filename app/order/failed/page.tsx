'use client'

import Link from 'next/link'
import { XCircle, RefreshCw, Home, Phone, Mail } from 'lucide-react'

export default function OrderFailedPage() {
  return (
    <div className="min-h-screen bg-[#FFFCF9] flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4">
        {/* Failed Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#373436] mb-2">Payment Failed</h1>
          <p className="text-gray-600">
            Unfortunately, your payment could not be processed.
          </p>
        </div>

        {/* Reasons Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="font-bold text-[#373436] mb-3">This might have happened due to:</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              <span>Insufficient funds in your account</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              <span>Card details entered incorrectly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              <span>Bank declined the transaction</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              <span>Network or connectivity issues</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              <span>Session timeout during payment</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-8">
          <Link
            href="/checkout"
            className="flex items-center justify-center gap-2 w-full bg-[#8A9C66] text-white py-4 rounded-xl font-semibold hover:bg-[#7a8a5a] transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full bg-white border-2 border-[#8A9C66] text-[#8A9C66] py-4 rounded-xl font-semibold hover:bg-[#8A9C66]/10 transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        {/* Support Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Need Help?</h3>
          <p className="text-sm text-blue-700 mb-3">
            If the problem persists, please contact our support team.
          </p>
          <div className="space-y-2 text-sm">
            <a
              href="mailto:support@kailash.asia"
              className="flex items-center gap-2 text-blue-700 hover:text-blue-900"
            >
              <Mail className="w-4 h-4" />
              support@kailash.asia
            </a>
            <a
              href="tel:+919876543210"
              className="flex items-center gap-2 text-blue-700 hover:text-blue-900"
            >
              <Phone className="w-4 h-4" />
              +91 98765 43210
            </a>
          </div>
        </div>

        {/* Note */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Don&apos;t worry, no amount has been deducted from your account.
          If any amount was debited, it will be refunded within 5-7 business days.
        </p>
      </div>
    </div>
  )
}
