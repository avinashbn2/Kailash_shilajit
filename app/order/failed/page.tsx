'use client'

import Link from 'next/link'
import { XCircle } from 'lucide-react'

export default function OrderFailedPage() {
  return (
    <div className="min-h-screen bg-[#FFFCF9] flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
          <XCircle className="w-12 h-12 text-red-600" />
        </div>

        <h1 className="text-3xl font-bold text-[#373436] mb-4">Payment Failed</h1>
        <p className="text-gray-600 mb-8">
          Unfortunately, your payment could not be processed. Please try again or contact support if the problem persists.
        </p>

        <div className="space-y-3">
          <Link
            href="/checkout"
            className="block w-full bg-[#8A9C66] text-white py-3 rounded-lg font-semibold hover:bg-[#7a8a5a] transition-colors"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="block w-full bg-white border-2 border-[#8A9C66] text-[#8A9C66] py-3 rounded-lg font-semibold hover:bg-[#8A9C66]/10 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
