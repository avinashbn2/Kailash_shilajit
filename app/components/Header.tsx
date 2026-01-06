'use client'

import { Menu, Search, ShoppingCart, User, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Search query:', searchQuery)
  }

  return (
    <>
      <header className="relative z-50 bg-[#373436] border-b border-[#373436]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between h-32 lg:h-48">
            <div className="flex items-center flex-1">
              <div className={`flex items-center transition-all duration-300 ${isSearchExpanded ? 'flex-1 max-w-md' : ''}`}>
                {!isSearchExpanded ? (
                  <button
                    onClick={() => setIsSearchExpanded(true)}
                    className="p-3 hover:bg-[#FFFCF9]/10 rounded-full transition-colors"
                    aria-label="Search"
                  >
                    <Search className="h-6 w-6 text-[#FFFCF9]" />
                  </button>
                ) : (
                  <form onSubmit={handleSearchSubmit} className="flex items-center w-full">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A9C66] focus:border-transparent"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsSearchExpanded(false)
                          setSearchQuery('')
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            <div className="flex-shrink-0 mx-8">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="Kailash Logo"
                  width={360}
                  height={120}
                  className="object-contain hidden lg:block"
                  priority
                />
                <Image
                  src="/logo.png"
                  alt="Kailash Logo"
                  width={240}
                  height={80}
                  className="object-contain block lg:hidden"
                  priority
                />
              </Link>
            </div>

            <div className="flex items-center flex-1 justify-end space-x-4">
              <Link
                href="/account"
                className="flex items-center space-x-1 text-[#FFFCF9] hover:text-[#FFFCF9]/80 transition-colors"
              >
                <User className="h-6 w-6" />
                <span className="hidden lg:inline text-lg">Account</span>
              </Link>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-3 hover:bg-[#FFFCF9]/10 rounded-full transition-colors"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="h-6 w-6 text-[#FFFCF9]" />
                <span className="absolute -top-1 -right-1 h-6 w-6 bg-[#8A9C66] text-white text-sm rounded-full flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="flex md:hidden items-center justify-between h-20">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-[#FFFCF9]/10 rounded-lg transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-[#FFFCF9]" />
              ) : (
                <Menu className="h-6 w-6 text-[#FFFCF9]" />
              )}
            </button>

            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Kailash Logo"
                width={180}
                height={60}
                className="object-contain"
                priority
              />
            </Link>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-[#FFFCF9]/10 rounded-full transition-colors"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="h-6 w-6 text-[#FFFCF9]" />
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#8A9C66] text-white text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-[#FFFCF9]/20 py-4">
              <div className="flex flex-col space-y-4">
                <form onSubmit={handleSearchSubmit} className="w-full">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A9C66] focus:border-transparent"
                    />
                  </div>
                </form>
                <Link
                  href="/account"
                  className="flex items-center space-x-2 text-[#FFFCF9] hover:text-[#FFFCF9]/80 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Account</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-[#FFFCF9] shadow-xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Shopping Cart</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              </div>
              <div className="border-t p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Total:</span>
                  <span className="text-xl font-bold">$0.00</span>
                </div>
                <button className="w-full bg-[#8A9C66] text-white py-3 rounded-lg hover:bg-[#7a8a5a] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed" disabled>
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}