'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import CustomerVideoCard, { CustomerVideoCardProps } from './CustomerVideoCard'

interface HappyCustomersSectionProps {
  videos: CustomerVideoCardProps[]
}

export default function HappyCustomersSection({ videos }: HappyCustomersSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340 // Width of card + gap
      const currentScroll = scrollContainerRef.current.scrollLeft
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount

      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="w-full py-16 bg-[#F5F2ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#373436]">Real Stories, Real Results</h2>
        
        <div className="relative">
          {/* Navigation Buttons - Hidden on mobile */}
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 bg-[#FFFCF9] rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow hidden md:block"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-10 bg-[#FFFCF9] rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow hidden md:block"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Videos Container */}
          <div className="overflow-hidden">
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {videos.map((video) => (
                <div key={video.id} className="snap-start">
                  <CustomerVideoCard {...video} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}