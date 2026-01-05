'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart, Send } from 'lucide-react'

export interface CustomerVideoCardProps {
  id: string
  videoSource: string
  thumbnailImage?: string
  productImage: string
  title: string
  description: string
  price: number
}

export default function CustomerVideoCard({
  videoSource,
  thumbnailImage,
  productImage,
  title,
  description,
  price
}: CustomerVideoCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToBag = () => {
    setIsAdding(true)
    console.log(`Adding ${title} to bag`)
    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col w-[280px] sm:w-[320px] flex-shrink-0">
      {/* Video Container */}
      <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-lg">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          poster={thumbnailImage}
        >
          <source src={videoSource} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Video Overlay Actions */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-4">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
            aria-label="Like video"
          >
            <Heart 
              className={`h-6 w-6 ${isLiked ? 'fill-white text-white' : 'text-white'}`}
            />
          </button>
          <button
            className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
            aria-label="Share video"
          >
            <Send className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>

      {/* Product Card */}
      <div className="bg-[#FFFCF9] rounded-2xl shadow-md mt-4 p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="relative w-12 h-12 flex-shrink-0">
            <Image
              src={productImage}
              alt={title}
              fill
              className="rounded-lg object-cover"
              sizes="48px"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-base line-clamp-1 mb-1">
              {title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {description}
            </p>
          </div>
        </div>
        
        <div className="text-xl font-bold mb-3">
          INR {price.toLocaleString()}
        </div>
        
        <button
          onClick={handleAddToBag}
          disabled={isAdding}
          className="w-full bg-[#8A9C66] text-white py-3 rounded-full hover:bg-[#7a8a5a] transition-colors disabled:bg-gray-400 font-medium"
        >
          {isAdding ? 'Adding...' : 'Add to Bag'}
        </button>
      </div>
    </div>
  )
}