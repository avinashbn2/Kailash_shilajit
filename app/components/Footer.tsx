import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#373436] text-[#FFFCF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Kailash Logo"
                width={180}
                height={60}
                className="object-contain"
              />
            </Link>
            <p className="text-sm text-[#FFFCF9]/80">
              Born in the Himalayas, crafted by nature. We carry the legacy of pure Shilajit from cliff to capsule.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#8A9C66] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#8A9C66] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#8A9C66] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-[#FFFCF9]/80 hover:text-[#8A9C66] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-[#FFFCF9]/80 hover:text-[#8A9C66] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-[#FFFCF9]/80 hover:text-[#8A9C66] transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-[#FFFCF9]/80 hover:text-[#8A9C66] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping" className="text-sm text-[#FFFCF9]/80 hover:text-[#8A9C66] transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-[#FFFCF9]/80 hover:text-[#8A9C66] transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-[#FFFCF9]/80 hover:text-[#8A9C66] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-[#FFFCF9]/80 hover:text-[#8A9C66] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-[#FFFCF9]/80 hover:text-[#8A9C66] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm text-[#FFFCF9]/80">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>Himalayan Region, India</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-[#FFFCF9]/80">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a href="tel:+911234567890" className="hover:text-[#8A9C66] transition-colors">
                  +91 123 456 7890
                </a>
              </li>
              <li className="flex items-center space-x-2 text-sm text-[#FFFCF9]/80">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a href="mailto:info@kailash.com" className="hover:text-[#8A9C66] transition-colors">
                  info@kailash.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#FFFCF9]/20 pt-8 text-center">
          <p className="text-sm text-[#FFFCF9]/60">
            &copy; {new Date().getFullYear()} Kailash. All rights reserved. Crafted with care from the Himalayas.
          </p>
        </div>
      </div>
    </footer>
  )
}
