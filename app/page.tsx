"use client"
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { SlideContent } from './components/ContentVideoSlider'
import { CustomerVideoCardProps } from './components/CustomerVideoCard'
import HappyCustomersSection from './components/HappyCustomersSection'
import { ProductCardProps } from './components/ProductCard'

const sampleProducts: ProductCardProps[] = [
  {
    id: '1',
    image: '/v2/shilajit/1.JPG',
    title: 'Kailash Shilajit',
    description: 'Ayurvedic wellness sticks for daily health and vitality',
    price: 4500,
    originalPrice: 5000,
    rating: 5,
    reviewCount: 55,
    savings: '10% SAVINGS'
  },
  {
    id: '2',
    image: '/v2/ladoos/1.JPG',    
    title: 'Kailash Shilajit Ladoos',
    description: 'A mineral-rich energy ladoo crafted from 100% pure Himalayan Shilajit resin',
    price: 2999,
    originalPrice: 3499,
    rating: 4.8,
    reviewCount: 256,
    savings: '14% SAVINGS'
  },
  {
    id: '3',
    image: '/v2/pct/1.JPG',
    
    title: 'Kailash Shilajit PCT Capsules',
    description: 'Advanced post-cycle therapy support for optimal recovery',
    price: 1999,
    originalPrice: 2499,
    rating: 4.5,
    reviewCount: 89,
    savings: '20% SAVINGS'
  },
  {
    id: '4',
    image: '/v2/amrit_shot.png',
    title: 'Kailash Amrit Shots – Pack of 30',
    description: 'Kailash Amrit Shots is a 30-day wellness ritual powered by pure Himalayan forest honey and authentic Shilajit resin.',
    price: 3500,
    originalPrice: 4000,
    rating: 4.6,
    reviewCount: 178,
    savings: '12% SAVINGS'
  },
]

const contentSlides: SlideContent[] = [
  {
    id: '1',
    category: 'Skincare Essentials',
    title: 'Discover Your Perfect Skincare Routine',
    description: 'Transform your skin with our scientifically formulated products. Each ingredient is carefully selected to deliver visible results while being gentle on your skin.',
    buttonText: 'Shop Skincare',
    buttonLink: '/shop/skincare',
    videoSource: '/videos/skincare-1.mp4'
  },
  {
    id: '2',
    category: 'New Arrivals',
    title: 'Revolutionary Anti-Aging Collection',
    description: 'Turn back time with our advanced anti-aging formulas. Featuring peptides, retinol, and hyaluronic acid for younger-looking skin.',
    buttonText: 'Explore Collection',
    buttonLink: '/shop/anti-aging',
    videoSource: '/videos/anti-aging.mp4'
  },
  {
    id: '3',
    category: 'Natural Beauty',
    title: 'Clean Beauty, Real Results',
    description: 'Experience the power of nature with our organic, cruelty-free products. No harmful chemicals, just pure, effective ingredients.',
    buttonText: 'Shop Natural',
    buttonLink: '/shop/natural',
    videoSource: '/videos/natural.mp4'
  },
  {
    id: '4',
    category: 'Sun Protection',
    title: 'Ultimate Sun Defense',
    description: 'Protect your skin from harmful UV rays with our broad-spectrum sunscreens. Lightweight, non-greasy formulas for daily use.',
    buttonText: 'View Sunscreens',
    buttonLink: '/shop/sun-protection',
    videoSource: '/videos/sunscreen.mp4'
  },
  {
    id: '5',
    category: 'Hydration Heroes',
    title: 'Deep Hydration Solutions',
    description: 'Quench your skin\'s thirst with our intensive moisturizing treatments. Perfect for all skin types, especially dry and sensitive skin.',
    buttonText: 'Shop Moisturizers',
    buttonLink: '/shop/moisturizers',
    videoSource: '/videos/hydration.mp4'
  },
  {
    id: '6',
    category: 'Exclusive Sets',
    title: 'Complete Care Bundles',
    description: 'Get everything you need in our curated sets. Save money while achieving your best skin with our expertly paired products.',
    buttonText: 'Shop Bundles',
    buttonLink: '/shop/bundles',
    videoSource: '/videos/bundles.mp4'
  }
]

const customerVideos: CustomerVideoCardProps[] = [
  {
    id: '1',
    videoSource: 'https://ik.imagekit.io/gqrc4jrxj/kailash/Sequence%2005.mp4',
    thumbnailImage: '/api/placeholder/320/568',
    productImage: '/api/placeholder/100/100',
    title: 'Arjun Wrestler',
    description: 'Kailash Shilajit review',
    price: 2250
  },
  {
    id: '2',
    videoSource: 'https://ik.imagekit.io/gqrc4jrxj/kailash/Sachin%20Suvarna.mp4',
    thumbnailImage: '/api/placeholder/320/568',
    productImage: '/api/placeholder/100/100',
    title: 'Sachin Kabaddi',
    description: 'Kailash Shilajit review',
    price: 1850
  },
  // {
  //   id: '3',
  //   videoSource: '/videos/customer-3.mp4',
  //   thumbnailImage: '/api/placeholder/320/568',
  //   productImage: '/api/placeholder/100/100',
  //   title: 'Hydrating Face Mist',
  //   description: 'Refreshing rose water mist with hyaluronic acid for instant hydration',
  //   price: 999
  // },
  // {
  //   id: '4',
  //   videoSource: '/videos/customer-4.mp4',
  //   thumbnailImage: '/api/placeholder/320/568',
  //   productImage: '/api/placeholder/100/100',
  //   title: 'Anti-Aging Night Cream',
  //   description: 'Rich night cream with retinol and peptides for younger-looking skin',
  //   price: 3499
  // },
  // {
  //   id: '5',
  //   videoSource: '/videos/customer-5.mp4',
  //   thumbnailImage: '/api/placeholder/320/568',
  //   productImage: '/api/placeholder/100/100',
  //   title: 'Exfoliating Body Scrub',
  //   description: 'Gentle coffee scrub that removes dead skin cells and improves circulation',
  //   price: 1599
  // },
  // {
  //   id: '6',
  //   videoSource: '/videos/customer-6.mp4',
  //   thumbnailImage: '/api/placeholder/320/568',
  //   productImage: '/api/placeholder/100/100',
  //   title: 'Hair Growth Serum',
  //   description: 'Ayurvedic formula with bhringraj and amla for stronger, healthier hair',
  //   price: 2799
  // },
  // {
  //   id: '7',
  //   videoSource: '/videos/customer-7.mp4',
  //   thumbnailImage: '/api/placeholder/320/568',
  //   productImage: '/api/placeholder/100/100',
  //   title: 'Lip Care Duo',
  //   description: 'Day and night lip treatment for soft, plump lips',
  //   price: 799
  // },
  // {
  //   id: '8',
  //   videoSource: '/videos/customer-8.mp4',
  //   thumbnailImage: '/api/placeholder/320/568',
  //   productImage: '/api/placeholder/100/100',
  //   title: 'Acne Control Gel',
  //   description: 'Tea tree and salicylic acid gel for clear, blemish-free skin',
  //   price: 1299
  // }
]

export default function Home() {
  const [modalVideoUrl, setModalVideoUrl] = useState<string | null>(null)
  const previewVideoRef = useRef<HTMLVideoElement>(null)
  return (
    <div className='bg-[#FFFCF9]'>

      {/* Promotional Hero Section */}
      <section className="w-full bg-[#F5F2ED] py-12 md:py-16 lg:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl  font-bold leading-tight mb-6 text-[#373436] max-w-5xl">
            Born in the Himalayas <br />
            Crafted by nature<br />
            

            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-[#373436]/60 leading-relaxed max-w-3xl mb-10">
            Brought to the world by Kailash, We don&apos;t just collect Shilajit from the mountains, we carry its legacy.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <button className="bg-[#8A9C66] hover:bg-[#7a8a5a] text-white px-10 py-4 rounded-full font-semibold text-lg transition-colors cursor-pointer">
                Shop Now
              </button>
            </div>

            {/* Product Images */}
            <div className="relative w-full max-w-4xl mt-8">
              <div className="flex items-end justify-center gap-6">
                {/* Product 1 - Left */}
                <div className="w-48 md:w-56 lg:w-64 h-64  relative rounded-3xl shadow-2xl transform translate-y-8 overflow-hidden">
                  <Image
                    src="/v2/IMG_0922.JPG"
                    alt="Product 1"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
                  />
                </div>

                {/* Product 2 - Center (Larger) */}
                <div className="w-56 md:w-64 lg:w-72 h-72 relative rounded-3xl shadow-2xl z-10 overflow-hidden">
                  <Image
                    src="/v2/IMG_0921.JPG"
                    alt="Product 2"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 224px, (max-width: 1024px) 256px, 288px"
                  />
                </div>

                {/* Product 3 - Right */}
                <div className="w-48 md:w-56 lg:w-64 h-64 relative rounded-3xl shadow-2xl transform translate-y-8 overflow-hidden">
                  <Image
                    src="/v2/amrit_shot.png"
                    alt="Product 3"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      <section>
      <h2 className="text-3xl mt-16 md:text-5xl lg:text-5xl font-bold text-center mb-12 text-[#373436]">
            Our Journey
          </h2>

      <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-8">
            <div className="grid grid-cols-2  items-start">


{/* Video Section - Left */}
<div className="relative">
  <div
    className="relative aspect-[9/16] max-h-[700px] bg-gray-900 rounded-lg overflow-hidden cursor-pointer group"
    onClick={() => setModalVideoUrl('https://ik.imagekit.io/gqrc4jrxj/kailash/Shilajit%20Documentry%20720p.mov')}
  >
    <video
      ref={previewVideoRef}
      className="w-full h-full object-cover"
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
    >
      <source src="https://ik.imagekit.io/gqrc4jrxj/kailash/Shilajit%20Documentry%20720p.mov" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    {/* Play Icon Overlay */}
    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center">
        <div className="w-0 h-0 border-l-[20px] border-l-[#8A9C66] border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-2" />
      </div>
    </div>
  </div>
</div>

{/* Text Content - Right */}

<div className="space-y-">

  <div className="text-[#373436] text-lg leading-relaxed space-y-6">
  <h2 className="font-bold text-2xl mb-4">The Kailash Promise: From Cliff to Capsule</h2>
  
  <ul className="space-y-4">
    <li className="flex ">
      <span className="text-xl">🏔️</span>
      <span>
        <strong className="block text-xl">The Hardest Reach</strong>
        Sourced via a 1.5-day trek through razor-edged cliffs and glacial trails where maps and roads fail.
      </span>
    </li>

    <li className="flex gap-3">
      <span className="text-xl">☀️</span>
      <span>
        <strong className="block text-xl">Sun-Purified & Raw</strong>
        Never heated or chemically altered. Purified naturally under Himalayan sunlight and cold winds to preserve trace minerals.
      </span>
    </li>

    <li className="flex gap-3">
      <span className="text-xl">🤝</span>
      <span>
        <strong className="block text-xl">Hand-Extracted by Locals</strong>
        Collected by mountain families using traditional tools and generational knowledge—valuing reverence over automation.
      </span>
    </li>

    <li className="flex gap-3">
      <span className="text-xl">🚫</span>
      <span>
        <strong className="block text-xl">No Shortcuts</strong>
        Zero machine processing or commercial modifications. We deliver the resin exactly as it exists in nature.
      </span>
    </li>

    <li className="flex gap-3">
      <span className="text-xl">⚡</span>
      <span>
        <strong className="block text-xl">Holistic Vitality</strong>
        A natural source for stamina, mental clarity, immunity, and strength, forged by the earth over centuries.
      </span>
    </li>
  </ul>

  <p className="pt-4 border-t border-gray-200 italic font-medium">
  &quot;Our story is our proof: No machines, no heat, no compromise.&quot;
  </p>
</div>

</div>

</div>
</div>
</div>

      </section>


      {/* Featured Products Section */}
      <section className="w-full py-16 bg-[#FFFCF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-12 text-[#373436]">
            Featured Products
          </h2>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sampleProducts.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden block"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-50 p-6">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>

                {/* Product Info */}
                <div className="p-6">
                  {/* Title and Rating */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-[#373436] flex-1">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-1 ml-2">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-sm font-medium text-[#373436]">{product.rating}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#373436]/60 mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Price and Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#373436]">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span className="bg-[#8A9C66] hover:bg-[#7a8a5a] text-white px-6 py-2 rounded-full font-semibold transition-colors inline-block">
                      Buy Now
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* <ContentVideoSlider 
        slides={contentSlides}
        autoScrollInterval={6000}
      /> */}

      <HappyCustomersSection 
        videos={customerVideos}
      />

      {/* <OurStorySection /> */}
    </div>
  )
}
