'use client'

import { useState, useEffect, useRef } from 'react'
import ProductCard, { ProductCardProps } from './ProductCard'

interface ProductCarouselProps {
  products: ProductCardProps[]
  autoScrollInterval?: number
  title?: string
}

export default function ProductCarousel({ 
  products, 
  autoScrollInterval = 5000,
  title = "Featured Products"
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const touchStartRef = useRef<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const cardWidth = container.querySelector('.product-card')?.clientWidth || 0
      const gap = 16 // gap-4 = 16px
      const scrollPosition = index * (cardWidth + gap)
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      })
      setCurrentIndex(index)
    }
  }


  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX
    setIsAutoScrolling(false)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return
    
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStartRef.current - touchEnd
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext()
      } else {
        handlePrevious()
      }
    }
    
    touchStartRef.current = null
  }

  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    
    const container = scrollContainerRef.current
    const cardWidth = container.querySelector('.product-card')?.clientWidth || 0
    const gap = 16
    const scrollPosition = container.scrollLeft
    const newIndex = Math.round(scrollPosition / (cardWidth + gap))
    
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex)
    }
  }

  useEffect(() => {
    if (isAutoScrolling && autoScrollInterval > 0) {
      intervalRef.current = setInterval(() => {
        const newIndex = currentIndex < products.length - 1 ? currentIndex + 1 : 0
        scrollToIndex(newIndex)
      }, autoScrollInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [currentIndex, isAutoScrolling, autoScrollInterval, products.length])

  useEffect(() => {
    const handleMouseEnter = () => setIsAutoScrolling(false)
    const handleMouseLeave = () => setIsAutoScrolling(true)
    
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('mouseenter', handleMouseEnter)
      container.addEventListener('mouseleave', handleMouseLeave)
      
      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter)
        container.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  return (
    <div className="w-full py-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#373436]">{title}</h2>
        
        <div className="relative">
          <div className="overflow-hidden">
            <ul
              ref={scrollContainerRef}
              onScroll={handleScroll}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth list-none p-0 m-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="product-card flex-shrink-0 w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)] snap-start"
                >
                  <ProductCard {...product} />
                </div>
              ))}
            </ul>
          </div>
          
          <div className="flex justify-center mt-6 gap-2">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoScrolling(false)
                  scrollToIndex(index)
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-[#8A9C66] w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to product ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}