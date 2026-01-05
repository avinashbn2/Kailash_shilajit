'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

interface VideoBannerProps {
  videoSource?: string
  shopLink?: string
}

export default function VideoBanner({ videoSource = 'https://ik.imagekit.io/gqrc4jrxj/kailash/banner_new.mp4/ik-video.mp4?updatedAt=1757669846054a', shopLink = '/shop' }: VideoBannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoError, setVideoError] = useState<string>('')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      const handleCanPlay = () => {
        setIsLoaded(true)
        video.play().catch(error => {
          console.log('Video autoplay failed:', error)
          setVideoError(`Play failed: ${error.message}`)
        })
      }

      const handleError = () => {
        const videoError = video?.error
        if (videoError) {
          setVideoError(`Error ${videoError.code}: ${videoError.message}`)
          console.error('Video error:', videoError)
        }
      }

      const handleLoadedData = () => {
        console.log('Video loaded successfully')
        setIsLoaded(true)
      }

      video.addEventListener('canplay', handleCanPlay)
      video.addEventListener('error', handleError)
      video.addEventListener('loadeddata', handleLoadedData)
      
      // Force load
      video.load()

      return () => {
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('error', handleError)
        video.removeEventListener('loadeddata', handleLoadedData)
      }
    }
  }, [videoSource])

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative w-full h-[70vh] min-h-[400px] max-h-[800px]">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover z-20"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          src={videoSource}
        >
          Your browser does not support the video tag.
        </video>
        
        {/* Debug info - remove this later */}
        {videoError && (
          <div className="absolute top-4 left-4 bg-red-500 text-white p-2 rounded text-sm z-20">
            {videoError}
          </div>
        )}
        
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-10">
            <div className="text-gray-600">Loading video...</div>
          </div>
        )}
        
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        
        <div className="absolute bottom-8 left-8 z-10">
          <Link
            href={shopLink}
            className="inline-block bg-white text-black px-8 py-4 text-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            SHOP NOW
          </Link>
        </div>
      </div>
    </div>
  )
}