"use client"
import { Product } from '@/types'
import { Volume2, VolumeX, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { CustomerVideoCardProps } from './components/CustomerVideoCard'
import HappyCustomersSection from './components/HappyCustomersSection'
import OurStorySection from './components/OurStorySection'

// const contentSlides: SlideContent[] = [
//   {
//     id: '1',
//     category: 'Skincare Essentials',
//     title: 'Discover Your Perfect Skincare Routine',
//     description: 'Transform your skin with our scientifically formulated products. Each ingredient is carefully selected to deliver visible results while being gentle on your skin.',
//     buttonText: 'Shop Skincare',
//     buttonLink: '/shop/skincare',
//     videoSource: '/videos/skincare-1.mp4'
//   },
//   {
//     id: '2',
//     category: 'New Arrivals',
//     title: 'Revolutionary Anti-Aging Collection',
//     description: 'Turn back time with our advanced anti-aging formulas. Featuring peptides, retinol, and hyaluronic acid for younger-looking skin.',
//     buttonText: 'Explore Collection',
//     buttonLink: '/shop/anti-aging',
//     videoSource: '/videos/anti-aging.mp4'
//   },
//   {
//     id: '3',
//     category: 'Natural Beauty',
//     title: 'Clean Beauty, Real Results',
//     description: 'Experience the power of nature with our organic, cruelty-free products. No harmful chemicals, just pure, effective ingredients.',
//     buttonText: 'Shop Natural',
//     buttonLink: '/shop/natural',
//     videoSource: '/videos/natural.mp4'
//   },
//   {
//     id: '4',
//     category: 'Sun Protection',
//     title: 'Ultimate Sun Defense',
//     description: 'Protect your skin from harmful UV rays with our broad-spectrum sunscreens. Lightweight, non-greasy formulas for daily use.',
//     buttonText: 'View Sunscreens',
//     buttonLink: '/shop/sun-protection',
//     videoSource: '/videos/sunscreen.mp4'
//   },
//   {
//     id: '5',
//     category: 'Hydration Heroes',
//     title: 'Deep Hydration Solutions',
//     description: 'Quench your skin\'s thirst with our intensive moisturizing treatments. Perfect for all skin types, especially dry and sensitive skin.',
//     buttonText: 'Shop Moisturizers',
//     buttonLink: '/shop/moisturizers',
//     videoSource: '/videos/hydration.mp4'
//   },
//   {
//     id: '6',
//     category: 'Exclusive Sets',
//     title: 'Complete Care Bundles',
//     description: 'Get everything you need in our curated sets. Save money while achieving your best skin with our expertly paired products.',
//     buttonText: 'Shop Bundles',
//     buttonLink: '/shop/bundles',
//     videoSource: '/videos/bundles.mp4'
//   }
// ]

// Fallback products when API is unavailable
const fallbackProducts: Product[] = [
  {
    id: '1',
    name: 'Kailash Shilajit Sun-Dried Resin 25g',
    shortDescription: 'From untouched Himalayan rocks → purified only by the Sun → delivered with absolute honesty.',
    price: 4500,
    mrp: 5000,
    images: ['/v2/shilajit/1.JPG', '/v2/shilajit/2.JPG', '/v2/shilajit/3.JPG', '/v2/shilajit/4.JPG'],
    sizes: ['12g', '25g'],
    currentSize: '25g',
    rating: 5.0,
    reviewCount: 55,
    questionCount: 13,
    answerCount: 20,
    inStock: true,
  },
  {
    id: '2',
    name: 'Kailash Shilajit Ladoos pack of 30',
    shortDescription: 'A mineral-rich energy ladoo crafted from 100% pure Himalayan Shilajit resin, naturally sweetened with raw Himalayan forest honey and premium dry fruits.',
    price: 2999,
    mrp: 3499,
    images: ['/v2/ladoos/1.JPG', '/v2/ladoos/2.JPG', '/v2/ladoos/3.JPG', '/v2/ladoos/4.JPG', '/v2/ladoos/5.JPG', '/v2/ladoos/6.JPG'],
    sizes: ['30 count', '60 count'],
    currentSize: '30 count',
    rating: 4.8,
    reviewCount: 256,
    questionCount: 8,
    answerCount: 15,
    inStock: true,
  },
  {
    id: '3',
    name: 'Kailash Shilajit PCT Capsules - Pack of 30',
    shortDescription: 'A 30-day Ayurvedic recovery formula powered by pure mineral-rich Himalayan Shilajit and 11 restorative herbs.',
    price: 1999,
    mrp: 2499,
    images: ['/v2/pct/1.JPG', '/v2/pct/2.JPG', '/v2/pct/3.JPG', '/v2/pct/4.JPG'],
    sizes: ['30 count', '60 count'],
    currentSize: '30 count',
    rating: 4.5,
    reviewCount: 89,
    questionCount: 8,
    answerCount: 15,
    inStock: true,
  },
  {
    id: '4',
    name: 'Kailash Amrit Shots – Pack of 30',
    shortDescription: 'A 30-day wellness ritual powered by pure Himalayan forest honey and authentic Shilajit resin. Natural energy, stamina, and mineral richness.',
    price: 3500,
    mrp: 4000,
    images: ['/v2/amrit_shot.png'],
    sizes: ['30 count', '60 count'],
    currentSize: '30 count',
    rating: 4.6,
    reviewCount: 178,
    questionCount: 8,
    answerCount: 15,
    inStock: true,
  },
  {
    id: '5',
    name: 'Kailash Sea Buckthorn Capsules – 30 Capsules',
    shortDescription: 'From wild Himalayan berries → gently processed & encapsulated → delivered with complete purity.',
    price: 1499,
    mrp: 1799,
    images: ['/v2/sbt_capsules/1.JPG', '/v2/sbt_capsules/2.JPG', '/v2/sbt_capsules/3.JPG', '/v2/sbt_capsules/4.JPG', '/v2/sbt_capsules/5.JPG'],
    sizes: ['30 capsules', '60 capsules'],
    currentSize: '30 capsules',
    rating: 4.7,
    reviewCount: 42,
    questionCount: 5,
    answerCount: 8,
    inStock: true,
  },
  {
    id: '6',
    name: 'Kailash Sea Buckthorn Pulp – 500ml',
    shortDescription: 'From wild Himalayan berries → gently pulped at source → delivered in its pure, natural form.',
    price: 1299,
    mrp: 1599,
    images: ['/v2/sbt_pulp/1.JPG', '/v2/sbt_pulp/2.JPG', '/v2/sbt_pulp/3.JPG', '/v2/sbt_pulp/4.JPG', '/v2/sbt_pulp/5.JPG'],
    sizes: ['500ml', '1000ml'],
    currentSize: '500ml',
    rating: 4.8,
    reviewCount: 67,
    questionCount: 6,
    answerCount: 10,
    inStock: true,
  }
]

const customerVideos: CustomerVideoCardProps[] = [
  {
    id: '1',
    videoSource: 'https://res.cloudinary.com/dncyd9qf3/video/upload/q_auto,f_auto,w_480/v1768838975/Abhishek_Shetty_cogsfe.mp4',
    productImage: '/v2/IMG_0921.JPG',
    title: 'Abhishek Shetty',
    description: 'Kailash Shilajit review'
  },
  {
    id: '2',
    videoSource: 'https://res.cloudinary.com/dncyd9qf3/video/upload/q_auto,f_auto,w_480/v1768838937/Arjun_mwxxge.mp4',
    productImage: '/v2/IMG_0921.JPG',
    title: 'Arjun',
    description: 'Kailash Shilajit review'
  },
  {
    id: '3',
    videoSource: 'https://res.cloudinary.com/dncyd9qf3/video/upload/q_auto,f_auto,w_480/v1768838964/Jeevanan_K_kxuz6z.mp4',
    productImage: '/v2/IMG_0921.JPG',
    title: 'Jeevanan K',
    description: 'Kailash Shilajit review'
  },
  {
    id: '4',
    videoSource: 'https://res.cloudinary.com/dncyd9qf3/video/upload/q_auto,f_auto,w_480/v1768838947/SachinSuvarna_qd1ttz.mp4',
    productImage: '/v2/IMG_0921.JPG',
    title: 'Sachin Suvarna',
    description: 'Kailash Shilajit review'
  },
  {
    id: '5',
    videoSource: 'https://res.cloudinary.com/dncyd9qf3/video/upload/q_auto,f_auto,w_480/v1768838940/Vishwambar_hj34wm.mp4',
    productImage: '/v2/IMG_0921.JPG',
    title: 'Vishwambar',
    description: 'Kailash Shilajit review'
  }
]

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [modalVideoUrl, setModalVideoUrl] = useState<string | null>(null)
  const [isVideoMuted, setIsVideoMuted] = useState(false)
  const previewVideoRef = useRef<HTMLVideoElement>(null)
  const modalVideoRef = useRef<HTMLVideoElement>(null)
  const featuredProductsRef = useRef<HTMLDivElement>(null)

  // Fetch products from API with fallback
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const data = await response.json()
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data)
          } else {
            setProducts(fallbackProducts)
          }
        } else {
          setProducts(fallbackProducts)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts(fallbackProducts)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const scrollToFeaturedProducts = () => {
    if (featuredProductsRef.current) {
      const targetPosition = featuredProductsRef.current.getBoundingClientRect().top + window.pageYOffset - 80
      const startPosition = window.pageYOffset
      const distance = targetPosition - startPosition
      const duration = 1500 // 1.5 seconds for smooth scroll
      let start: number | null = null

      const animation = (currentTime: number) => {
        if (start === null) start = currentTime
        const timeElapsed = currentTime - start
        const progress = Math.min(timeElapsed / duration, 1)

        // Easing function for smooth acceleration and deceleration
        const ease = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2

        window.scrollTo(0, startPosition + distance * ease)

        if (timeElapsed < duration) {
          requestAnimationFrame(animation)
        }
      }

      requestAnimationFrame(animation)
    }
  }

  const handleOpenModal = (videoUrl: string) => {
    setModalVideoUrl(videoUrl)
    setIsVideoMuted(false)
  }

  const handleCloseModal = () => {
    setModalVideoUrl(null)
    setIsVideoMuted(false)
  }

  const handleToggleMute = () => {
    setIsVideoMuted(!isVideoMuted)
    if (modalVideoRef.current) {
      modalVideoRef.current.muted = !isVideoMuted
    }
  }

  return (
    <div className='bg-[#FFFCF9] overflow-x-hidden'>

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
              <button
                onClick={scrollToFeaturedProducts}
                className="bg-[#8A9C66] hover:bg-[#7a8a5a] text-white px-10 py-4 rounded-full font-semibold text-lg transition-colors cursor-pointer"
              >
                Shop Now
              </button>
            </div>

            {/* Product Images */}
            <div className="relative w-full max-w-4xl mt-8">
              <div className="flex items-end justify-center gap-3 md:gap-6">
                {/* Product 1 - Left */}
                <div className="w-32 sm:w-48 md:w-56 lg:w-64 h-48 sm:h-64 relative rounded-3xl shadow-2xl transform translate-y-8 overflow-hidden">
                  <Image
                    src="/v2/ladoo2.JPG"
                    alt="Product 1"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
                  />
                </div>

                {/* Product 2 - Center (Larger) */}
                <div className="w-40 sm:w-56 md:w-64 lg:w-72 h-56 sm:h-72 relative rounded-3xl shadow-2xl z-10 overflow-hidden">
                  <Image
                    src="/v2/shilajit.JPG"
                    alt="Product 2"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 224px, (max-width: 1024px) 256px, 288px"
                  />
                </div>

                {/* Product 3 - Right */}
                <div className="w-32 sm:w-48 md:w-56 lg:w-64 h-48 sm:h-64 relative rounded-3xl shadow-2xl transform translate-y-8 overflow-hidden">
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
            The Kailash Journey: Mountain to You
          </h2>

      <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">


{/* Video Section - Mobile: Above, Desktop: Left */}
<div className="relative order-1 lg:order-1">
  <div
    className="relative aspect-[9/16] max-h-[700px] bg-gray-900 rounded-lg overflow-hidden cursor-pointer group mx-auto max-w-md lg:max-w-none"
    onClick={() => handleOpenModal('https://res.cloudinary.com/dncyd9qf3/video/upload/q_auto,f_auto/v1768840347/ShilajitDocumentry_fc3z58.mp4')}
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
      <source src="https://res.cloudinary.com/dncyd9qf3/video/upload/q_auto,f_auto/v1768840347/ShilajitDocumentry_fc3z58.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center">
        <div className="w-0 h-0 border-l-[20px] border-l-[#8A9C66] border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-2" />
      </div>
    </div>
  </div>
</div>

{/* Text Content - Mobile: Below, Desktop: Right */}

<div className="space-y-6 order-2 lg:order-2">

  <div className="text-[#373436] text-base md:text-lg leading-relaxed space-y-6">

  <ul className="space-y-5">
    <li className="flex gap-3">
      <span className="text-2xl">🏔️</span>
      <span>
        <strong className="block text-xl">Beyond Human Reach</strong>
        Harvested through a relentless 1.5-day journey across knife-sharp cliffs and frozen Himalayan paths—where roads disappear and only faith, strength, and nature guide the way.
      </span>
    </li>

    <li className="flex gap-3">
      <span className="text-2xl">☀️</span>
      <span>
        <strong className="block text-xl">Pure as the Sun Allows</strong>
        Never boiled, burned, or chemically touched. Naturally purified under Himalayan sunlight and icy winds, so every living mineral remains exactly as nature intended.
      </span>
    </li>

    <li className="flex gap-3">
      <span className="text-2xl">🤝</span>
      <span>
        <strong className="block text-xl">Touched Only by Tradition</strong>
        Carefully gathered by native mountain families using ancestral wisdom and hand tools—where respect for the resin matters more than speed or profit.
      </span>
    </li>

    <li className="flex gap-3">
      <span className="text-2xl">🚫</span>
      <span>
        <strong className="block text-xl">No Imitation. No Compromise.</strong>
        No machines. No shortcuts. No commercial tricks. What you receive is raw, living Shilajit—unchanged from the moment it leaves the mountain.
      </span>
    </li>

    <li className="flex gap-3">
      <span className="text-2xl">⚡</span>
      <span>
        <strong className="block text-xl">When It&apos;s Real, It Always Works</strong>
        Pure Shilajit is rare. But once your body experiences the real resin, the change is undeniable—energy rises, clarity sharpens, strength awakens from within.
      </span>
    </li>
  </ul>

  <p className="pt-4 border-t border-gray-200 italic font-medium text-lg">
  &quot;True Shilajit doesn&apos;t convince. It transforms.&quot;
  </p>
</div>

</div>

</div>
</div>
</div>

      </section>

      {/* Featured Products Section */}
      <section ref={featuredProductsRef} className="w-full py-16 bg-[#FFFCF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-12 text-[#373436]">
            Featured Products
          </h2>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-8 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : (
              products.map((product) => {
                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden block"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gray-50 p-6">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
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
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-1 ml-2">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-sm font-medium text-[#373436]">{product.rating}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-[#373436]/60 mb-4 line-clamp-2">
                        {product.shortDescription}
                      </p>

                      {/* Price */}
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        <span className="text-2xl font-bold text-[#373436]">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.mrp > product.price && (
                          <>
                            <span className="text-sm text-gray-400 line-through">
                              ₹{product.mrp.toLocaleString()}
                            </span>
                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                              {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                            </span>
                          </>
                        )}
                      </div>

                      {/* Button */}
                      <span className="bg-[#8A9C66] hover:bg-[#7a8a5a] text-white px-6 py-2 rounded-full font-semibold transition-colors inline-block w-full text-center">
                        Buy Now
                      </span>
                    </div>
                  </Link>
                )
              })
            )}
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

      <OurStorySection />

      {/* Video Modal */}
      {modalVideoUrl && (
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
                muted={isVideoMuted}
                playsInline
                src={modalVideoUrl}
              >
                <source src={modalVideoUrl} type="video/mp4" />
                <source src={modalVideoUrl} type="video/quicktime" />
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
                onClick={handleToggleMute}
                className="absolute bottom-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
                aria-label={isVideoMuted ? "Unmute video" : "Mute video"}
              >
                {isVideoMuted ? (
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
    </div>
  )
}
