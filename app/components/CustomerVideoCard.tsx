'use client'

import { useRef, useState } from 'react'
import { Heart, Send, X, Volume2, VolumeX } from 'lucide-react'

export interface CustomerVideoCardProps {
  id: string
  videoSource: string
  thumbnailImage?: string
  productImage: string
  title: string
  description: string
}

export default function CustomerVideoCard({
  videoSource,
  thumbnailImage,
}: CustomerVideoCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalMuted, setIsModalMuted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const modalVideoRef = useRef<HTMLVideoElement>(null)

  const handleMouseEnter = () => {
    if (videoRef.current && !isModalOpen) {
      videoRef.current.play()
      videoRef.current.muted = false
      videoRef.current.volume = 0.4
    }
  }

  const handleMouseLeave = () => {
    if (videoRef.current && !isModalOpen) {
      videoRef.current.pause()
      videoRef.current.muted = true
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
    setIsModalMuted(false)
    // Set volume after a brief delay to ensure video is ready
    setTimeout(() => {
      if (modalVideoRef.current) {
        modalVideoRef.current.volume = 0.4
      }
    }, 100)
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
            loop
            muted
            playsInline
            preload="metadata"
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