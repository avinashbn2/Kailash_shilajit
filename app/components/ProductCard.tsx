'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'

export interface ProductCardProps {
  id: string
  image: string
  title: string
  description: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  savings?: string
  productUrl?: string
}

export default function ProductCard({
  id,
  image,
  title,
  description,
  price,
  originalPrice,
  rating,
  reviewCount,
  savings
}: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart } = useCart()
  const router = useRouter()

  const handleAddToBag = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAdding(true)

    // Add to cart with product data
    addToCart({
      id: '', // Will be generated in context
      productId: id,
      name: title,
      price: price,
      mrp: originalPrice || price,
      image: image,
      size: 'Default'
    }, 1)

    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Add to cart with product data (don't open cart drawer)
    addToCart({
      id: '', // Will be generated in context
      productId: id,
      name: title,
      price: price,
      mrp: originalPrice || price,
      image: image,
      size: 'Default'
    }, 1, false)

    // Redirect to checkout
    router.push('/checkout')
  }

  const renderStars = () => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="text-yellow-400 text-sm">★</span>
        )
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="text-yellow-400 text-sm">☆</span>
        )
      } else {
        stars.push(
          <span key={i} className="text-gray-300 text-sm">★</span>
        )
      }
    }
    return stars
  }

  return (
    <li className="product-item bg-[#FFFCF9] font-roboto">
      <div className="product-item-info flex flex-col h-full">
        
        {/* Product Image */}
        <div className="item-photo relative">
          <Link href={`/product/${id}`} className="product-item-photo block">
            <span className="product-image-container block">
              <span className="product-image-wrapper block relative" style={{paddingBottom: '100%'}}>
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="product-image-photo object-contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              </span>
            </span>
          </Link>
          
        </div>

        {/* Product Details */}
        <div className="product-item-details flex-1 flex flex-col p-4">
          <strong className="product-item-name mb-2">
            <Link 
              href={`/product/${id}`} 
              className="product-item-link text-lg font-bold hover:underline"
              title={title}
            >
              {title}
            </Link>
          </strong>

          <span className="product-usp text-gray-600 text-sm mb-4 flex-1">
            {description}
          </span>

          <div className="price-review">
            {/* Price */}
            <div className="plp-price mb-3">
              <span className="price-special flex items-center gap-2">
                <span className="text-2xl font-bold">₹{price.toLocaleString()}</span>
                {originalPrice && (
                  <>
                    <span className="text-sm">|</span>
                    <span className="text-gray-400 line-through text-sm">
                      Worth ₹{originalPrice.toLocaleString()}
                    </span>
                  </>
                )}
              </span>
              {savings && (
                <span className="discount-percent text-green-600 font-semibold text-sm">
                  ({savings})
                </span>
              )}
            </div>

            {/* Reviews */}
            <div className="yotpo bottomLine flex items-center gap-2 mb-4">
              <div className="yotpo-bottomline flex items-center gap-1">
                <span className="yotpo-stars flex">
                  {renderStars()}
                </span>
                <span className="sr-only">{rating} star rating</span>
                <button className="text-sm text-gray-600 hover:underline" aria-label={`${reviewCount} reviews`}>
                  {reviewCount} Reviews
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="product-item-inner p-4 pt-0">
          <div className="product-item-actions flex flex-col gap-2">
            {/* Add to Bag Button */}
            <button
              onClick={handleAddToBag}
              disabled={isAdding}
              className="w-full bg-white border-2 border-[#8A9C66] text-[#8A9C66] py-3 px-6 rounded-full hover:bg-[#8A9C66] hover:text-white transition-colors disabled:bg-gray-200 disabled:border-gray-300 disabled:text-gray-400 font-semibold"
              title="Add to Bag"
            >
              <span>{isAdding ? 'Adding...' : 'Add to Bag'}</span>
            </button>

            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              className="w-full bg-[#8A9C66] text-white py-3 px-6 rounded-full hover:bg-[#7a8a5a] transition-colors font-semibold"
              title="Buy Now"
            >
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}