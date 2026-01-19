'use client'

import { useCart } from '@/contexts/CartContext'
import { validateIndianPostalCode } from '@/lib/validation'
import { Product, SizeVariant } from '@/types'
import { ChevronRight, Gift, Heart, Minus, Plus, Sparkles, Star, Volume2, VolumeX, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

// Legacy product database for fallback
const productsDatabase: Record<string, {
  id: string
  name: string
  shortDescription: string
  price: number
  mrp: number
  sizes: string[]
  currentSize: string
  sizeVariants: SizeVariant[]
  rating: number
  reviewCount: number
  questionCount: number
  answerCount: number
  images: string[]
  inStock: boolean
  whatIsIt: string
  whatDoesItDo: string[]
  ourPromise?: string
  usage?: string[]
  whatMakesItSpecial?: string
}> = {
  '1': {
    id: '1',
    name: 'Kailash Shilajit Sun-Dried Resin 25g',
    shortDescription: 'From untouched Himalayan rocks → purified only by the Sun → delivered with absolute honesty.',
    price: 4500,
    mrp: 5000,
    sizes: ['12g', '25g'],
    currentSize: '25g',
    sizeVariants: [
      { size: '12g', price: 2500, mrp: 2999 },
      { size: '25g', price: 4500, mrp: 5000 },
    ],
    rating: 5,
    reviewCount: 55,
    questionCount: 13,
    answerCount: 20,
    images: [
      '/v2/shilajit/1.JPG',
      '/v2/shilajit/2.JPG',
      '/v2/shilajit/3.JPG',
      '/v2/shilajit/4.JPG',
    ],
    inStock: true,
    whatIsIt: 'Kailash Shilajit is a 100% pure Himalayan resin formed over centuries within ancient mountain rocks. It is hand-harvested from remote cliffs by local Himalayan families, preserved in its raw, unaltered form, and delivered with complete transparency and trust.',
    whatDoesItDo: [
      'Sustained Energy & Stamina – keeps you active throughout the day',
      'Strength & Workout Recovery – supports muscle power and faster bounce-back',
      'Hormonal & Vitality Support – enhances endurance and overall wellness',
      'Mineral-Rich & Fulvic Powered – naturally nourishes your body with fulvic richness'
    ],
    ourPromise: '100% Pure. 0% Mixing. 0% Compromise. No heat processing. No aggressive filtration. No additives. Just potent Shilajit, exactly as the Himalayas create it.',
    usage: [
      'Take a pea-sized amount (200–300 mg) using a clean spoon/stick',
      'Mix into warm milk or water (don\'t boil)',
      'Stir until it dissolves naturally',
      'Drink once daily — after breakfast or before workout',
      'Store jar in a cool, dry place'
    ],
    whatMakesItSpecial: 'Our Shilajit is not sourced — it is hard-harvested.\nWe trek 1.5 days deep into the Himalayas, where the trails turn into cliffs and the cold tests every breath.\nCrossing frozen rivers and ancient rocks, we reach a source few ever see.\n\nEvery gram is hand-extracted by local mountain families, sun-purified naturally, and collected with respect — no machines, no heat, no shortcuts.\n\nRare resin. Real journey. Complete trust.'
  },
  '2': {
    id: '2',
    name: 'Kailash Shilajit Ladoos pack of 30',
    shortDescription: 'A mineral-rich energy ladoo crafted from 100% pure Himalayan Shilajit resin, reached after a 1.5-day trek into high mountain rocks. Naturally sweetened only with raw Himalayan forest honey and premium dry fruits — no heat, no sugar, no chemicals. Ancient resin. Real journey. Daily strength ritual.',
    price: 2999,
    mrp: 3499,
    sizes: ['30 count', '60 count'],
    currentSize: '30 count',
    sizeVariants: [
      { size: '30 count', price: 2999, mrp: 3499 },
      { size: '60 count', price: 5499, mrp: 6499 },
    ],
    rating: 4.8,
    reviewCount: 256,
    questionCount: 8,
    answerCount: 15,
    images: [
      '/v2/ladoos/1.JPG',
      '/v2/ladoos/2.JPG',
      '/v2/ladoos/3.JPG',
      '/v2/ladoos/4.JPG',
      '/v2/ladoos/5.JPG',
      '/v2/ladoos/6.JPG',
    ],
    inStock: true,
    whatIsIt: 'Kailash Shilajit Ladoos (270g | Pack of 30) are energy-dense wellness bites crafted from 100% pure Himalayan Shilajit resin, collected after a 1.5-day trek into the high ranges. We blend this ancient resin only with raw Himalayan forest honey and premium dry fruits — no heat, no sugar, no chemicals, no compromise. A ritual of endurance, purity, and honesty — rolled into one timeless Ladoo.',
    whatDoesItDo: [
      'Fuels natural long-lasting energy',
      'Supports strength, stamina & vitality',
      'Helps mineral recharge & workout recovery',
      'Enriched with fulvic compounds for immunity & clarity'
    ],
    ourPromise: 'Ancient source. Hand harvested. Sun purified. No heat. No sugar. No chemicals. No compromise',
    usage: [
      'Take 1 ladoo daily',
      'Eat after breakfast or 30 min before workout',
      'Pair with warm milk or lukewarm water',
    ],
  },
  '3': {
    id: '3',
    name: 'Kailash Shilajit PCT Capsules - Pack of 30',
    shortDescription: 'Kailash Shilajit PCT Capsules are a 30-day Ayurvedic recovery formula powered by pure mineral-rich Himalayan Shilajit and 11 restorative herbs. Made for those who train hard and recover naturally — no fillers, no sugar, no steroids, no mixing.',
    price: 2999,
    mrp: 3499,
    sizes: ['30 count', '60 count'],
    currentSize: '30 count',
    sizeVariants: [
      { size: '30 count', price: 1999, mrp: 2499 },
      { size: '60 count', price: 3499, mrp: 4499 },
    ],
    rating: 4.8,
    reviewCount: 256,
    questionCount: 8,
    answerCount: 15,
    images: [
      '/v2/pct/1.JPG',
      '/v2/pct/2.JPG',
      '/v2/pct/3.JPG',
      '/v2/pct/4.JPG',
    ],
    inStock: true,
    whatIsIt: 'Kailash Shilajit PCT Capsules are rooted in the wisdom of 11-herb Ayurvedic recovery science and powered by mineral-rich, pure Himalayan Shilajit. Crafted without fillers, synthetics, or any form of mixing, this formula is designed as a daily recovery ritual — supporting restoration, balance, and real strength, not a temporary energy boost.',
    whatDoesItDo: [
      'Restores energy after intense training',
      'Supports hormonal balance & recovery',
      'Helps muscle stress & post-workout fatigue',
      'Aids mineral recharge & liver restoration',
    ],
    ourPromise: '100% natural recovery. 0% compromise. No steroids. No sugar. No artificial enhancers. Only clean ingredients that rebuild, recover, and restore — the pure way',
    usage: [
      'Take 1 capsule daily (after breakfast or post-workout)',
      'Swallow with water or warm milk',
      'Max 2 capsules/day (do not exceed)',
    ],
  },
  '4': {
    id: '4',
    name: 'Kailash Amrit Shots – Pack of 30',
    shortDescription: 'Kailash Amrit Shots is a 30-day wellness ritual powered by pure Himalayan forest honey and authentic Shilajit resin. Each 10ml shot delivers natural energy, stamina, and mineral richness in its raw, unheated, and uncompromised form. No sugar, no additives, no mixing — just real Himalayan vitality in every bottle.',
    price: 2999,
    mrp: 3499,
    sizes: ['30 count', '60 count'],
    currentSize: '30 count',
    sizeVariants: [
      { size: '30 count', price: 3500, mrp: 4000 },
      { size: '60 count', price: 6500, mrp: 7500 },
    ],
    rating: 4.8,
    reviewCount: 256,
    questionCount: 8,
    answerCount: 15,
    images: [
      '/v2/amrit_shot.png',
    ],
    inStock: true,
    whatIsIt: 'Kailash Amrit Shots is a 30-day wellness ritual packed in 10ml shot bottles, crafted using pure Himalayan forest honey and authentic Shilajit resin. Sourced from the high Himalayas after a 1.5-day mountain trek, each bottle carries raw minerals and fulvic richness in its natural form, untouched by heat or artificial additives.',
    whatDoesItDo: [
      'Provides steady, long-lasting natural energy',
      'Supports stamina, endurance & strength',
      'Helps recover from daily fatigue & intense workouts',
      'Recharges the body with essential trace minerals',
      'Supports immunity & overall wellbeing',
      'Enhances mental clarity, focus & vitality',
    ],
    ourPromise: 'We keep it real because nature already made it perfect. No heat processing, no added sugar, no fillers, no artificial enhancers, and no mixing. Just two pure Himalayan elements sealed in every bottle with one oath — 100% Pure. 0% Mixing. 0% Compromise.',
    usage: [
      'Take 1 shot daily (after breakfast or post-workout)',
      'Consume directly or mix with water',
      'Max 2 shots/day (do not exceed)',
    ],
  },
  '5': {
    id: '5',
    name: 'Kailash Sea Buckthorn Capsules – 30 Capsules',
    shortDescription: 'From wild Himalayan berries → gently processed & encapsulated → delivered with complete purity.',
    price: 1499,
    mrp: 1799,
    sizes: ['30 capsules', '60 capsules'],
    currentSize: '30 capsules',
    sizeVariants: [
      { size: '30 capsules', price: 1499, mrp: 1799 },
      { size: '60 capsules', price: 2799, mrp: 3299 },
    ],
    rating: 4.7,
    reviewCount: 42,
    questionCount: 5,
    answerCount: 8,
    images: [
      '/v2/sbt_capsules/1.JPG',
      '/v2/sbt_capsules/2.JPG',
      '/v2/sbt_capsules/3.JPG',
      '/v2/sbt_capsules/4.JPG',
      '/v2/sbt_capsules/5.JPG',
    ],
    inStock: true,
    whatIsIt: 'Kailash Sea Buckthorn Capsules are made from 100% pure Himalayan Sea Buckthorn berries, wild-grown in the pristine high-altitude regions of the Himalayas. The berries are carefully handpicked at peak ripeness, gently processed into pulp, and then encapsulated to preserve their natural potency. Free from chemicals, dilution, and unnecessary processing, these capsules deliver Sea Buckthorn\'s full-spectrum nutrients — antioxidants, omega fatty acids, and essential vitamins — in a clean, convenient daily form, backed by complete purity, transparency, and trust.',
    whatDoesItDo: [
      'Natural Energy & Immunity Boost – supports sustained vitality and everyday resilience',
      'Skin, Gut & Cellular Repair – nourishes the body from within with powerful antioxidants',
      'Heart & Metabolic Support – helps maintain healthy circulation and internal balance',
      'Omega-Rich Superfruit Nutrition – delivers rare omegas, vitamins, and minerals for complete wellness',
    ],
    ourPromise: '100% Pure. 0% Dilution. 0% Compromise. Carefully processed to retain nutrients. No colorants. No flavoring agents. Just potent Himalayan Sea Buckthorn, encapsulated exactly as nature intends.',
    usage: [
      'Take 1–2 capsules daily with water',
      'Consume after breakfast or before workout',
      'Swallow whole — do not open or chew the capsule',
      'Use consistently for best results',
      'Store the bottle in a cool, dry place, away from direct sunlight',
    ],
    whatMakesItSpecial: 'Our Sea Buckthorn is not farmed — it is wild-harvested. We journey deep into high-altitude Himalayan valleys where harsh winters, thin air, and untouched terrain shape extraordinary nutrition. Thriving naturally along cold riverbanks and rugged land, these berries develop exceptional strength and potency. Each berry is handpicked by local mountain families, gently processed using traditional methods, and carefully encapsulated — no heat abuse, no shortcuts, no compromise.\n\nRare fruit. Ancient land. Pure nutrition. Complete trust.',
  },
  '6': {
    id: '6',
    name: 'Kailash Sea Buckthorn Pulp – 500ml',
    shortDescription: 'From wild Himalayan berries → gently pulped at source → delivered in its pure, natural form.',
    price: 1299,
    mrp: 1599,
    sizes: ['500ml', '1000ml'],
    currentSize: '500ml',
    sizeVariants: [
      { size: '500ml', price: 1299, mrp: 1599 },
      { size: '1000ml', price: 2399, mrp: 2899 },
    ],
    rating: 4.8,
    reviewCount: 67,
    questionCount: 6,
    answerCount: 10,
    images: [
      '/v2/sbt_pulp/1.JPG',
      '/v2/sbt_pulp/2.JPG',
      '/v2/sbt_pulp/3.JPG',
      '/v2/sbt_pulp/4.JPG',
      '/v2/sbt_pulp/5.JPG',
    ],
    inStock: true,
    whatIsIt: 'Kailash Sea Buckthorn Pulp is a 100% pure Himalayan superfruit extract made from wild-grown Sea Buckthorn berries harvested in the pristine high-altitude regions of the Himalayas. The berries are carefully handpicked at peak ripeness, gently pulped without chemicals or artificial additives, and preserved in their natural form to retain maximum nutrients. Rich in antioxidants, omega fatty acids, and vital vitamins, this pulp is delivered fresh with complete purity, transparency, and trust.',
    whatDoesItDo: [
      'Natural Energy & Immunity Boost – supports long-lasting vitality and daily resilience',
      'Skin, Gut & Cellular Repair – nourishes from within with powerful antioxidants',
      'Heart & Metabolic Support – helps maintain healthy circulation and balance',
      'Omega-Rich Superfruit Nutrition – delivers rare omegas, vitamins, and minerals for complete wellness',
    ],
    ourPromise: '100% Pure. 0% Dilution. 0% Compromise. Cold-processed to preserve nutrients. No colorants. No flavoring agents. Just potent Himalayan Sea Buckthorn pulp, exactly as nature creates it.',
    usage: [
      'Take 1–2 teaspoons (5–10 ml) of Sea Buckthorn pulp using a clean spoon',
      'Consume directly or mix with lukewarm water or juice (do not boil)',
      'Stir gently until well blended',
      'Drink once daily — preferably after breakfast or before workout',
      'Store bottle in a cool, dry place and refrigerate after opening',
    ],
    whatMakesItSpecial: 'Our Sea Buckthorn is not farmed — it is wild-harvested. We journey deep into the high-altitude Himalayan valleys where the air is thin, winters are harsh, and the land remains untouched. Growing naturally along cold riverbanks and rugged terrain, these berries survive extreme conditions, making them exceptionally potent. Each berry is handpicked by local mountain families at peak ripeness, gently pulped using traditional methods, and preserved in its raw form — no heat, no shortcuts, no compromise.\n\nRare fruit. Harsh land. Pure nutrition. Complete trust.',
  }
}

// Function to get product data based on ID
const getProductData = (id: string) => {
  // Return specific product data if available, otherwise return first product as fallback
  return productsDatabase[id] || productsDatabase['1']
}

export default function ProductDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const { addToCart } = useCart()
  const [productData, setProductData] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState('whatIsIt')
  const [pinCode, setPinCode] = useState('')
  const [showDeliveryInfo, setShowDeliveryInfo] = useState(false)
  const [modalVideoUrl, setModalVideoUrl] = useState<string | null>(null)
  const previewVideoRef = useRef<HTMLVideoElement>(null)

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`)
        if (response.ok) {
          const data = await response.json()
          setProductData(data)
          setSelectedSize(data.currentSize)
        } else {
          // Fallback to legacy data
          const fallbackData = getProductData(productId)
          setProductData(fallbackData as unknown as Product)
          setSelectedSize(fallbackData.currentSize)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        // Fallback to legacy data
        const fallbackData = getProductData(productId)
        setProductData(fallbackData as unknown as Product)
        setSelectedSize(fallbackData.currentSize)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta
    if (newQty >= 1 && newQty <= 10) {
      setQuantity(newQty)
    }
  }

  // Get current variant based on selected size (for dynamic pricing)
  const getCurrentVariant = (): SizeVariant | null => {
    if (!productData) return null

    // If sizeVariants exists and has data, find the matching variant
    if (productData.sizeVariants && productData.sizeVariants.length > 0) {
      const variant = productData.sizeVariants.find(v => v.size === selectedSize)
      if (variant) return variant
    }

    // Fallback to product's default price/mrp
    return { size: selectedSize, price: productData.price, mrp: productData.mrp }
  }

  // Get current price and mrp based on selected size variant
  const currentVariant = getCurrentVariant()
  const currentPrice = currentVariant?.price ?? productData?.price ?? 0
  const currentMrp = currentVariant?.mrp ?? productData?.mrp ?? 0

  const handleAddToBag = () => {
    if (!productData) return

    addToCart({
      id: '', // Will be generated in context
      productId: productData.id,
      name: productData.name,
      price: currentPrice,
      mrp: currentMrp,
      image: productData.images[0],
      size: selectedSize
    }, quantity)
  }

  const handleBuyNow = () => {
    if (!productData) return

    // Add to cart first (don't open cart drawer)
    addToCart({
      id: '', // Will be generated in context
      productId: productData.id,
      name: productData.name,
      price: currentPrice,
      mrp: currentMrp,
      image: productData.images[0],
      size: selectedSize
    }, quantity, false)

    // Redirect to checkout
    router.push('/checkout')
  }

  const handleCheckPinCode = () => {
    if (pinCode.length === 6 && validateIndianPostalCode(pinCode)) {
      setShowDeliveryInfo(true)
    } else if (pinCode.length === 6) {
      alert('Please enter a valid Indian PIN code');
    }
  }

  // Force preview video to load and play
  useEffect(() => {
    const video = previewVideoRef.current
    if (video && productData?.whatMakesItSpecial) {
      video.load()
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Preview video autoplay prevented:', error)
        })
      }
    }
  }, [productData])

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 opacity-50" />)
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />)
      }
    }
    return stars
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFCF9] -mt-48">
        <div className="max-w-7xl mx-auto px-4 pt-52 pb-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="aspect-square bg-gray-200 rounded-lg" />
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-10 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!productData) {
    return (
      <div className="min-h-screen bg-[#FFFCF9] -mt-48">
        <div className="max-w-7xl mx-auto px-4 pt-52 pb-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Product not found</h1>
          <Link href="/" className="text-[#8A9C66] hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-[#FFFCF9] -mt-48"
    >
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 pt-52 pb-4">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center text-sm">
            <li>
              <Link href="/" className="text-[#8A9C66] hover:text-[#7a8a5a] transition-colors">
                Home
              </Link>
            </li>
            <li className="mx-2">
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </li>
            <li>
              <Link href="/" className="text-[#8A9C66] hover:text-[#7a8a5a] transition-colors">
                Products
              </Link>
            </li>
            <li className="mx-2">
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </li>
            <li className="text-[#373436] font-medium truncate max-w-[300px] sm:max-w-none">
              {productData.name}
            </li>
          </ol>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Product Images */}
          <div className="relative bg-white/70 backdrop-blur-sm rounded-lg p-6">
            {/* Share and Wishlist buttons */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 bg-white rounded-full shadow-md hover:shadow-lg"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </button>
            </div>

            {/* Main Image */}
            <div className="relative aspect-square mb-4 bg-white/70 backdrop-blur-sm rounded-lg overflow-hidden">
              <Image
                src={productData.images[currentImageIndex]}
                alt={productData.name}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {productData.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 bg-white/70 backdrop-blur-sm ${
                    currentImageIndex === index ? 'border-[#8A9C66]' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Product ${index + 1}`}
                    width={80}
                    height={80}
                    className="object-contain w-full h-full"
                  />
                </button>
              ))}
            </div>

            <p className="text-xs text-[#373436]/80 mt-4">
              Disclaimer: The image is for representation purposes only. The packaging you receive might vary.
            </p>

            {/* Usage Section */}
            {productData.usage && (
              <div className="mt-6 p-6 bg-white/70 backdrop-blur-sm rounded-lg">
                <h3 className="text-lg font-bold text-[#373436] mb-4">How to use</h3>
                <ol className="space-y-3">
                  {productData.usage.map((step, index) => (
                    <li key={index} className="flex items-start text-[#373436]">
                      <span className="font-semibold mr-3 text-[#8A9C66]">{index + 1}.</span>
                      <span className="text-sm leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-4 text-[#373436]">{productData.name}</h1>

            <p className="text-[#373436] mb-6">{productData.shortDescription}</p>

            {/* Size Selection */}
            <div className="mb-6">
              <span className="text-sm font-medium mb-2 block text-[#373436]">SIZE :</span>
              <div className="flex gap-3">
                {productData.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-2 rounded ${
                      selectedSize === size
                        ? 'bg-[#8A9C66] text-white'
                        : 'bg-gray-100 text-[#373436] hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating and Reviews */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-0.5">
                  {renderStars(productData.rating)}
                </div>
                <span className="text-[#373436] font-medium">
                  {productData.reviewCount} Reviews
                </span>
                <span className="text-[#373436] mx-2">|</span>
                <span className="text-[#373436] font-medium">
                  {productData.questionCount} Questions \ {productData.answerCount} Answers
                </span>
              </div>
            </div>


            {/* Quantity Selector */}
            <div className="mb-6">
              <span className="text-sm font-medium mb-2 block text-[#373436]">QUANTITY:</span>
              <div className="flex items-center border border-gray-300 w-fit">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-3 hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  readOnly
                  className="w-16 text-center border-x border-gray-300 text-[#373436]"
                />
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-3 hover:bg-gray-100"
                  disabled={quantity >= 10}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl font-bold text-[#373436]">₹{(currentPrice * quantity).toLocaleString()}</span>
                {currentMrp > currentPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">₹{(currentMrp * quantity).toLocaleString()}</span>
                    <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                      {Math.round(((currentMrp - currentPrice) / currentMrp) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              {quantity > 1 && (
                <p className="text-sm text-[#373436]/60 mb-1">
                  ₹{currentPrice.toLocaleString()} × {quantity} items
                </p>
              )}
              <p className="text-xs text-[#373436] uppercase tracking-wide">
                (MRP INCLUSIVE OF ALL TAXES)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={handleAddToBag}
                className="flex-1 bg-white border-2 border-[#8A9C66] text-[#8A9C66] py-3 px-8 font-semibold hover:bg-[#8A9C66] hover:text-white transition-colors uppercase"
              >
                ADD TO BAG
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 bg-[#8A9C66] text-white py-3 px-8 font-semibold hover:bg-[#7a8a5a] transition-colors uppercase"
              >
                BUY NOW
              </button>
            </div>

            {/* Free Shipping Info */}
            <p className="text-sm text-[#373436] mb-8">
              Free shipping over INR 15,999/- for international and over INR 1000/- for domestic orders.
            </p>

            {/* Delivery Options */}
            <div className="border-t pt-6 mb-8">
              <h3 className="font-semibold mb-4 text-[#373436]">Delivery Options</h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="ENTER PIN CODE"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="flex-1 px-4 py-2 border border-gray-300 uppercase text-[#373436] placeholder-gray-500"
                />
                <button
                  onClick={handleCheckPinCode}
                  className="px-6 py-2 text-[#373436] font-semibold hover:bg-[#F5F2ED]"
                >
                  CHECK
                </button>
              </div>
              
              {showDeliveryInfo && (
                <div className="text-sm text-green-600 mb-2">
                  FREE Delivery: Tomorrow if ordered within 4 hours
                </div>
              )}
              
              <p className="text-sm text-[#373436]">
                Delivery outside India? Guaranteed dispatch within 48 Hrs.
              </p>
            </div>

            {/* Available Offers */}
            <div className="flex gap-4 mb-8">
              <button className="flex items-center gap-2 px-6 py-3 bg-[#E8EBE0] rounded hover:bg-[#8A9C66]/20 transition-colors">
                <Gift className="w-5 h-5" />
                <span className="font-medium text-[#373436]">AVAILABLE OFFERS</span>
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-[#E8EBE0] rounded hover:bg-[#8A9C66]/20 transition-colors">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium text-[#373436]">WHAT&apos;S NEW</span>
              </button>
            </div>

            {/* Product Information Tabs */}
            <div className="border-t pt-8">
              <div className="space-y-4">
                <div className="border-b">
                  <button
                    onClick={() => setActiveTab(activeTab === 'whatIsIt' ? '' : 'whatIsIt')}
                    className="w-full py-4 text-left font-semibold flex justify-between items-center text-[#373436] hover:text-[#373436]/80"
                  >
                    WHAT IS IT?
                    <ChevronRight className={`w-5 h-5 transform transition-transform ${
                      activeTab === 'whatIsIt' ? 'rotate-90' : ''
                    }`} />
                  </button>
                  {activeTab === 'whatIsIt' && (
                    <div className="pb-4 text-[#373436] whitespace-pre-line">
                      {productData.whatIsIt}
                    </div>
                  )}
                </div>

                <div className="border-b">
                  <button
                    onClick={() => setActiveTab(activeTab === 'whatDoesItDo' ? '' : 'whatDoesItDo')}
                    className="w-full py-4 text-left font-semibold flex justify-between items-center text-[#373436] hover:text-[#373436]/80"
                  >
                    WHAT DOES IT DO?
                    <ChevronRight className={`w-5 h-5 transform transition-transform ${
                      activeTab === 'whatDoesItDo' ? 'rotate-90' : ''
                    }`} />
                  </button>
                  {activeTab === 'whatDoesItDo' && (
                    <ul className="pb-4 text-[#373436] space-y-2">
                      {productData?.whatDoesItDo?.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Our Promise Section */}
                {productData.ourPromise && (
                  <div className="border-b">
                    <button
                      onClick={() => setActiveTab(activeTab === 'ourPromise' ? '' : 'ourPromise')}
                      className="w-full py-4 text-left font-semibold flex justify-between items-center text-[#373436] hover:text-[#373436]/80"
                    >
                      OUR PROMISE
                      <ChevronRight className={`w-5 h-5 transform transition-transform ${
                        activeTab === 'ourPromise' ? 'rotate-90' : ''
                      }`} />
                    </button>
                    {activeTab === 'ourPromise' && (
                      <div className="pb-4 text-[#373436] whitespace-pre-line">
                        {productData.ourPromise}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Ingredients Section */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#373436] mb-6">It&apos;s What&apos;s Inside That Really Matters</h2>
            <p className="text-[#373436] text-lg max-w-3xl mx-auto">
              {productId === '1'
                ? 'Pure Himalayan Shilajit resin — nothing added, nothing removed. Just the raw power of the mountains.'
                : (productId === '5' || productId === '6')
                  ? 'Pure wild-harvested Himalayan Sea Buckthorn — nature\'s most powerful superfruit, delivered in its most potent form.'
                  : 'Each ingredient is handpicked and infused following the wisdom of ancient Ayurvedic texts, ensuring that every bite delivers pure, targeted benefits for your mind, body, and soul.'
              }
            </p>
          </div>

          <div className={`grid gap-8 mb-8 ${
            (productId === '1' || productId === '5' || productId === '6')
              ? 'grid-cols-1 max-w-md mx-auto'
              : productId === '2'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : productId === '4'
                  ? 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto'
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
          }`}>
            {/* Ingredient - Sea Buckthorn (shown only for products 5 and 6) */}
            {(productId === '5' || productId === '6') && (
              <div className="text-center">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <Image
                    src="/v2/sbt_capsules/1.JPG"
                    alt="Sea Buckthorn"
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#373436] mb-3">Sea Buckthorn</h3>
                <p className="text-[#373436] text-sm leading-relaxed">
                  Sea Buckthorn, known as the &quot;Holy Fruit of the Himalayas&quot;, is a rare superfruit packed with over 190 bioactive compounds. Rich in omega fatty acids (including the rare Omega-7), antioxidants, vitamins C and E, it supports immunity, skin health, heart function, and overall vitality. Wild-harvested from high-altitude Himalayan valleys, these berries develop exceptional potency from surviving extreme conditions.
                </p>
              </div>
            )}

            {/* Ingredient - Shilajit (shown for products 1-4) */}
            {(productId === '1' || productId === '2' || productId === '3' || productId === '4') && (
              <div className="text-center">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <Image
                    src="/kailash_content/shilajit.jpg"
                    alt="Shilajit"
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#373436] mb-3">Shilajit</h3>
                <p className="text-[#373436] text-sm leading-relaxed">
                  Shilajit, known as &quot;the conqueror of mountains and destroyer of weakness&quot;, is a powerful Ayurvedic rasayana. Rich in fulvic acid and trace minerals, it boosts energy, enhances vitality, supports hormonal balance, and strengthens overall immunity.
                </p>
              </div>
            )}

            {/* Ingredient - Himalayan Forest Honey (shown for Ladoos and Amrit Shots) */}
            {(productId === '2' || productId === '4') && (
              <div className="text-center">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <Image
                    src="/kailash_content/honey.jpg"
                    alt="Himalayan Forest Honey"
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#373436] mb-3">Himalayan Forest Honey</h3>
                <p className="text-[#373436] text-sm leading-relaxed">
                  Sourced from the pristine Himalayan forests, this raw and unprocessed honey is rich in natural enzymes, antioxidants, and medicinal properties. It boosts immunity, supports digestion, enhances energy, and acts as a natural rejuvenator for overall well-being.
                </p>
              </div>
            )}

            {/* Additional ingredients for Ladoos (product 2) */}
            {productId === '2' && (
              <>
                {/* Ingredient - Cashew */}
                <div className="text-center">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    <Image
                      src="/kailash_content/cashew.jpeg"
                      alt="Cashew"
                      width={300}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#373436] mb-3">Cashew</h3>
                  <p className="text-[#373436] text-sm leading-relaxed">
                    Cashew, known as a nutrient-rich super nut, is a natural source of healthy fats, plant protein, and essential minerals. It supports heart health, improves energy levels, strengthens bones, and enhances overall vitality. Rich in antioxidants, cashews help boost immunity, promote brain function, and support healthy metabolism.
                  </p>
                </div>

                {/* Ingredient - Almonds */}
                <div className="text-center">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    <Image
                      src="/kailash_content/almonds.jpeg"
                      alt="Almonds"
                      width={300}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#373436] mb-3">Almonds</h3>
                  <p className="text-[#373436] text-sm leading-relaxed">
                    Almonds, known as a powerhouse of nutrition, are rich in healthy fats, plant protein, fiber, and essential vitamins. They support brain function, promote heart health, and help maintain healthy energy levels. Packed with antioxidants and vitamin E, almonds strengthen immunity, improve skin health, and support overall vitality.
                  </p>
                </div>

                {/* Ingredient - Walnuts */}
                <div className="text-center">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    <Image
                      src="/kailash_content/walnuts.jpeg"
                      alt="Walnuts"
                      width={300}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#373436] mb-3">Walnuts</h3>
                  <p className="text-[#373436] text-sm leading-relaxed">
                    Walnuts, known as a brain-boosting super nut, are rich in omega-3 fatty acids, plant protein, and powerful antioxidants. They support brain health, improve heart function, and help reduce inflammation. Walnuts also aid digestion, boost immunity, and promote overall vitality and long-term wellness.
                  </p>
                </div>

                {/* Ingredient - Pumpkin Seeds */}
                <div className="text-center">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    <Image
                      src="/kailash_content/pumpkin_seeds.jpeg"
                      alt="Pumpkin Seeds"
                      width={300}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#373436] mb-3">Pumpkin Seeds</h3>
                  <p className="text-[#373436] text-sm leading-relaxed">
                    Pumpkin seeds, known as a nutrient-dense super seed, are rich in plant protein, healthy fats, zinc, and magnesium. They support heart health, improve immunity, and promote hormonal balance. Packed with antioxidants, pumpkin seeds help boost energy levels, support digestion, and enhance overall vitality.
                  </p>
                </div>

                {/* Ingredient - Raisins */}
                <div className="text-center">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    <Image
                      src="/kailash_content/raisins.jpeg"
                      alt="Raisins (Kishmish)"
                      width={300}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#373436] mb-3">Raisins (Kishmish)</h3>
                  <p className="text-[#373436] text-sm leading-relaxed">
                    Raisins (Kishmish), known as a natural energy booster, are rich in natural sugars, fiber, and essential minerals. They support digestion, improve iron levels, and help maintain healthy energy throughout the day. Packed with antioxidants, raisins boost immunity, promote gut health, and support overall vitality.
                  </p>
                </div>
              </>
            )}

            {/* Show all 4 ingredients only for PCT Capsules (product 3) */}
            {productId === '3' && (
              <>
                {/* Ingredient - Safed Musli */}
                <div className="text-center">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    <Image
                      src="/kailash_content/safed_musli.jpg"
                      alt="Safed Musli"
                      width={300}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#373436] mb-3">Safed Musli</h3>
                  <p className="text-[#373436] text-sm leading-relaxed">
                    Safed Musli, hailed as &quot;White Gold&quot; in Ayurveda, is a natural aphrodisiac that enhances strength, stamina, and vitality. It supports reproductive health, boosts immunity, and restores overall energy levels.
                  </p>
                </div>

                {/* Ingredient - Ashwagandha */}
                <div className="text-center">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    <Image
                      src="/kailash_content/ashwagandha.jpg"
                      alt="Ashwagandha"
                      width={300}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#373436] mb-3">Ashwagandha</h3>
                  <p className="text-[#373436] text-sm leading-relaxed">
                    Ashwagandha, known as &quot;Indian Ginseng&quot;, is a revered adaptogen in Ayurveda. It helps reduce stress and anxiety, balances cortisol, improves strength and stamina, and promotes restful sleep while supporting overall vitality.
                  </p>
                </div>

                {/* Ingredient - Himalayan Forest Honey */}
                <div className="text-center">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    <Image
                      src="/kailash_content/honey.jpg"
                      alt="Himalayan Forest Honey"
                      width={300}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#373436] mb-3">Himalayan Forest Honey</h3>
                  <p className="text-[#373436] text-sm leading-relaxed">
                    Sourced from the pristine Himalayan forests, this raw and unprocessed honey is rich in natural enzymes, antioxidants, and medicinal properties. It boosts immunity, supports digestion, enhances energy, and acts as a natural rejuvenator for overall well-being.
                  </p>
                </div>
              </>
            )}
          </div>

          {productId === '3' && (
            <div className="text-center">
              <button className="bg-[#8A9C66] text-white px-8 py-3 font-bold hover:bg-[#7a8a5a] transition-colors uppercase rounded">
                VIEW FULL INGREDIENT LIST
              </button>
            </div>
          )}
        </div>
      </div>

      {/* What Makes It Special Section */}
      {productData.whatMakesItSpecial && (
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">

              {/* Video Section - Left */}
              <div className="relative">
                <div
                  className="relative aspect-[9/16] max-h-[600px] bg-gray-900 rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => setModalVideoUrl('https://res.cloudinary.com/dncyd9qf3/video/upload/q_auto,f_auto/v1768840347/ShilajitDocumentry_fc3z58.mp4')}
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

                  {/* Play Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[20px] border-l-[#8A9C66] border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-2" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Content - Right */}
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-[#373436] mb-6">What Makes It Special?</h2>

                <div className="text-[#373436] text-lg leading-relaxed whitespace-pre-line">
                  {productData.whatMakesItSpecial}
                </div>

                <div className="pt-4">
                  <button className="bg-[#8A9C66] text-white px-8 py-3 font-bold hover:bg-[#7a8a5a] transition-colors uppercase rounded">
                    Learn More
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {modalVideoUrl && (
        <VideoModal 
          videoUrl={modalVideoUrl} 
          onClose={() => setModalVideoUrl(null)} 
        />
      )}
    </div>
  )
}


// Video Modal Component
function VideoModal({ 
  videoUrl, 
  onClose 
}: { 
  videoUrl: string
  onClose: () => void 
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.play().catch(error => {
        console.log('Video play failed:', error)
      })
    }
  }, [])

  const handleToggleMute = () => {
    setIsMuted(!isMuted)
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          aria-label="Close video"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Video container - adapts to portrait or landscape */}
        <div className="relative w-full h-full max-w-[90vh] max-h-[90vh] flex items-center justify-center">
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            autoPlay
            loop
            muted={isMuted}
            controls={false}
            playsInline
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/quicktime" />
            <source src={videoUrl} />
          </video>

          {/* Custom controls */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={handleToggleMute}
              className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}