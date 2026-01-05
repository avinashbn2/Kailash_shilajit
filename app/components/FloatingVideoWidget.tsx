'use client'

import { Volume2, VolumeX, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface FloatingVideoWidgetProps {
  videoSource: string
  thumbnailImage?: string
}

export default function FloatingVideoWidget({ 
  videoSource, 
  thumbnailImage 
}: FloatingVideoWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded)
    if (!isExpanded) {
      // When expanding, unmute the video
      setIsMuted(false)
      if (videoRef.current) {
        videoRef.current.muted = false
      }
    } else {
      // When collapsing, mute the video
      setIsMuted(true)
      if (videoRef.current) {
        videoRef.current.muted = true
      }
    }
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(false)
    setIsMuted(true)
    if (videoRef.current) {
      videoRef.current.muted = true
    }
  }

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMuted(!isMuted)
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }
  }

  useEffect(() => {
    // Ensure video starts playing when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log('Auto-play was prevented:', error)
      })
    }
  }, [])

  return (
    <>
      {/* Overlay when expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 animate-fadeIn"
          onClick={handleClose}
        />
      )}

      {/* Floating Video Widget */}
      <div
        className={`fixed z-50 transition-all duration-500 ease-in-out ${
          isExpanded
            ? 'bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-[90vw] max-w-[500px] aspect-[9/16]'
            : 'bottom-6 left-6 w-24 h-24 hover:scale-110'
        }`}
        onClick={!isExpanded ? handleToggleExpand : undefined}
      >
        <div className={`relative w-full h-full ${isExpanded ? '' : 'cursor-pointer'}`}>
          {/* Video Container */}
          <div className={`relative w-full h-full bg-black ${
            isExpanded ? 'rounded-2xl' : 'rounded-full'
          } overflow-hidden shadow-2xl ${!isExpanded ? 'border-4 border-[#8A9C66]' : ''}`}>
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              poster={thumbnailImage}
            >
              <source src={videoSource} type="video/mp4" />
              <source src={videoSource} type="video/quicktime" />
              <source src={videoSource} />
              Your browser does not support the video tag.
            </video>

            {/* Gradient overlay for mini view */}
            {!isExpanded && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            )}

            {/* Controls for expanded view */}
            {isExpanded && (
              <>
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
                  aria-label="Close video"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                {/* Mute/Unmute button */}
                <button
                  onClick={handleToggleMute}
                  className="absolute bottom-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>
              </>
            )}
          </div>

          {/* Pulse animation for mini view */}
          {!isExpanded && (
            <div className="absolute inset-0 rounded-lg border-2 border-[#8A9C66]/50 animate-ping" />
          )}
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
  )
}