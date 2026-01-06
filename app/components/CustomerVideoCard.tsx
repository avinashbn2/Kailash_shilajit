'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Heart, Send, X, Volume2, VolumeX } from 'lucide-react'

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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalMuted, setIsModalMuted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const modalVideoRef = useRef<HTMLVideoElement>(null)

  const handleAddToBag = () => {
    setIsAdding(true)
    console.log(`Adding ${title} to bag`)
    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  const handleMouseEnter = () => {
    if (videoRef.current && !isModalOpen) {
      videoRef.current.muted = false
    }
  }

  const handleMouseLeave = () => {
    if (videoRef.current && !isModalOpen) {
      videoRef.current.muted = true
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
    setIsModalMuted(false)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setIsModalMuted(false)
  }

  const handleToggleModalMute = () => {
    setIsModalMuted(!isModalMuted)
    if (modalVideoRef.current) {
      modalVideoRef.current.muted = !isModalMuted
    }
  }

  return (
    <>
      <div className="flex flex-col w-[280px] sm:w-[320px] flex-shrink-0">
        {/* Video Container */}
        <div
          className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-lg cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleOpenModal}
        >
          <video
            ref={videoRef}
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
            onClick={(e) => {
              e.stopPropagation()
              setIsLiked(!isLiked)
            }}
            className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
            aria-label="Like video"
          >
            <Heart
              className={`h-6 w-6 ${isLiked ? 'fill-white text-white' : 'text-white'}`}
            />
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
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

    {/* Video Modal */}
    {isModalOpen && (
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/50 z-40 animate-fadeIn"
          onClick={handleCloseModal}
        />

        {/* Video Container */}
        <div className="fixed bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-[90vw] max-w-[500px] aspect-[9/16] z-50">
          <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden shadow-2xl">
            <video
              ref={modalVideoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              muted={isModalMuted}
              playsInline
              src={videoSource}
            >
              <source src={videoSource} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
              aria-label="Close video"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Mute/Unmute button */}
            <button
              onClick={handleToggleModalMute}
              className="absolute bottom-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
              aria-label={isModalMuted ? "Unmute video" : "Mute video"}
            >
              {isModalMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.3s ease-in-out;
          }
        `}</style>
      </>
    )}
  </>
  )
}