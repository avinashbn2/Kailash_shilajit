'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export interface SlideContent {
  id: string
  category: string
  title: string
  description: string
  buttonText: string
  buttonLink: string
  videoSource: string
}

interface ContentVideoSliderProps {
  slides: SlideContent[]
  autoScrollInterval?: number
}

export default function ContentVideoSlider({ 
  slides, 
  autoScrollInterval = 6000 
}: ContentVideoSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)

  useEffect(() => {
    if (isAutoScrolling && autoScrollInterval > 0 && slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, autoScrollInterval)

      return () => clearInterval(interval)
    }
  }, [currentSlide, isAutoScrolling, autoScrollInterval, slides.length])

  const handleDotClick = (index: number) => {
    setCurrentSlide(index)
    setIsAutoScrolling(false)
    setTimeout(() => setIsAutoScrolling(true), 10000)
  }

  const handleMouseEnter = () => setIsAutoScrolling(false)
  const handleMouseLeave = () => setIsAutoScrolling(true)

  if (slides.length === 0) return null

  const activeSlide = slides[currentSlide]

  return (
    <div
      className="w-full bg-gradient-to-r from-[#F5F2ED] to-[#E8EBE0] py-16"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <div className="max-w-xl">
              <p className="text-sm font-medium text-[#8A9C66] mb-2 uppercase tracking-wider">
                {activeSlide.category}
              </p>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-[#373436] mb-6 leading-tight">
                {activeSlide.title}
              </h2>
              
              <p className="text-lg text-[#373436]/80 mb-8 leading-relaxed">
                {activeSlide.description}
              </p>
              
              <Link
                href={activeSlide.buttonLink}
                className="inline-flex items-center gap-2 bg-[#8A9C66] text-white px-8 py-4 rounded-full hover:bg-[#7a8a5a] transition-colors duration-300 font-semibold group"
              >
                {activeSlide.buttonText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Dots Indicator */}
            <div className="flex gap-2 mt-8">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`transition-all duration-300 ${
                    index === currentSlide
                      ? 'w-8 h-2 bg-[#8A9C66] rounded-full'
                      : 'w-2 h-2 bg-gray-400 rounded-full hover:bg-gray-600'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Video */}
          <div className="order-1 lg:order-2">
            <div className="relative aspect-[4/3] lg:aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
              <video
                key={activeSlide.videoSource}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={activeSlide.videoSource} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Optional gradient overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}