'use client'

import { ChevronRight, Gift, Heart, Minus, Plus, Sparkles, Star, Volume2, VolumeX, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

// Product database
const productsDatabase: Record<string, {
  id: string
  name: string
  shortDescription: string
  price: number
  mrp: number
  sizes: string[]
  currentSize: string
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
    ],  },
    '3': {
      id: '3',
      name: 'Kailash Shilajit PCT Capsules - Pack of 30',
      shortDescription: 'Kailash Shilajit PCT Capsules are a 30-day Ayurvedic recovery formula powered by pure mineral-rich Himalayan Shilajit and 11 restorative herbs. Made for those who train hard and recover naturally — no fillers, no sugar, no steroids, no mixing.',
      price: 2999,
      mrp: 3499,
      sizes: ['30 count', '60 count'],
      currentSize: '30 count',
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
        'Take 1 capsule daily (after breakfast or post-workout',
	      'Swallow with water or warm milk',
      'Max 2 capsules/day (do not exceed',
      ],  },
      '4': {
        id: '4',
        name: 'Kailash Amrit Shots – Pack of 30',
        shortDescription: 'Kailash Amrit Shots is a 30-day wellness ritual powered by pure Himalayan forest honey and authentic Shilajit resin. Each 10ml shot delivers natural energy, stamina, and mineral richness in its raw, unheated, and uncompromised form. No sugar, no additives, no mixing — just real Himalayan vitality in every bottle.',
        price: 2999,
        mrp: 3499,
        sizes: ['30 count', '60 count'],
        currentSize: '30 count',
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
          'Take 1 capsule daily (after breakfast or post-workout',
          'Swallow with water or warm milk',
        'Max 2 capsules/day (do not exceed',
        ],  }
}

// Function to get product data based on ID
const getProductData = (id: string) => {
  // Return specific product data if available, otherwise return first product as fallback
  return productsDatabase[id] || productsDatabase['1']
}

export default function ProductDetailsPage() {
  const params = useParams()
  const productId = params.id as string
  const productData = getProductData(productId)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState(productData.currentSize)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState('whatIsIt')
  const [pinCode, setPinCode] = useState('')
  const [showDeliveryInfo, setShowDeliveryInfo] = useState(false)
  const [modalVideoUrl, setModalVideoUrl] = useState<string | null>(null)
  const previewVideoRef = useRef<HTMLVideoElement>(null)

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta
    if (newQty >= 1 && newQty <= 10) {
      setQuantity(newQty)
    }
  }

  const handleAddToBag = () => {
    console.log('Adding to bag:', { 
      product: productData.name, 
      size: selectedSize, 
      quantity 
    })
  }

  const handleCheckPinCode = () => {
    if (pinCode.length === 6) {
      setShowDeliveryInfo(true)
    }
  }

  // Force preview video to load and play
  useEffect(() => {
    const video = previewVideoRef.current
    if (video && productData.whatMakesItSpecial) {
      video.load()
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Preview video autoplay prevented:', error)
        })
      }
    }
  }, [productData.whatMakesItSpecial])

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

  return (
    <div
      className="min-h-screen bg-[#FFFCF9] -mt-48"
    >
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 pt-52 pb-4">
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
          <nav className="text-sm">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="text-[#373436] font-bold hover:text-[#373436]/80">HOME</Link></li>
              <li className="text-[#373436] font-bold">/</li>
              <li className="text-[#373436] font-bold uppercase">KAILASH SHILAJIT GUMMIES WITH HIMALAYAN FOREST HONEY & AYURVEDIC HERBS</li>
            </ol>
          </nav>
        </div>
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
                className="object-cover"
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
                    className="object-cover w-full h-full"
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

            {/* Circular Video Players - Customer Reviews */}
            <div className="mb-8">
              <div className="flex gap-4 justify-start">
                {[1, 2, 3, 4].map((index) => (
                  <CircularVideoPlayerSmall 
                    key={index} 
                    videoSource="/video.mov" 
                    onClick={() => setModalVideoUrl('/video.mov')}
                  />
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="text-3xl font-bold mb-2 text-[#373436]">₹{productData.price.toLocaleString()}</div>
              <p className="text-xs text-[#373436] uppercase tracking-wide">
                (MRP INCLUSIVE OF ALL TAXES)
              </p>
            </div>

            {/* Quantity and Add to Bag */}
            <div className="flex gap-4 mb-6">
              <div className="flex items-center border border-gray-300">
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
              
              <button
                onClick={handleAddToBag}
                className="flex-1 bg-[#8A9C66] text-white py-3 px-8 font-semibold hover:bg-[#7a8a5a] transition-colors uppercase"
              >
                ADD TO BAG
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
                      {productData.whatDoesItDo.map((item, index) => (
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
            <h2 className="text-4xl font-bold text-[#373436] mb-6">It's What's Inside That Really Matters</h2>
            <p className="text-[#373436] text-lg max-w-3xl mx-auto">
              Each ingredient is handpicked and infused following the wisdom of ancient Ayurvedic texts, ensuring that every bite delivers pure, targeted benefits for your mind, body, and soul.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Ingredient 1 - Shilajit */}
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
                Shilajit, known as "the conqueror of mountains and destroyer of weakness", is a powerful Ayurvedic rasayana. Rich in fulvic acid and trace minerals, it boosts energy, enhances vitality, supports hormonal balance, and strengthens overall immunity.
              </p>
            </div>

            {/* Ingredient 2 - Safed Musli */}
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
                Safed Musli, hailed as "White Gold" in Ayurveda, is a natural aphrodisiac that enhances strength, stamina, and vitality. It supports reproductive health, boosts immunity, and restores overall energy levels.
              </p>
            </div>

            {/* Ingredient 3 - Ashwagandha */}
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
                Ashwagandha, known as "Indian Ginseng", is a revered adaptogen in Ayurveda. It helps reduce stress and anxiety, balances cortisol, improves strength and stamina, and promotes restful sleep while supporting overall vitality.
              </p>
            </div>

            {/* Ingredient 4 - Himalayan Forest Honey */}
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
          </div>

          <div className="text-center">
            <button className="bg-[#8A9C66] text-white px-8 py-3 font-bold hover:bg-[#7a8a5a] transition-colors uppercase rounded">
              VIEW FULL INGREDIENT LIST
            </button>
          </div>
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

// Circular Video Player Component - Small version for product page
function CircularVideoPlayerSmall({ 
  videoSource, 
  onClick 
}: { 
  videoSource: string
  onClick: () => void 
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.play().catch(error => {
        console.log('Auto-play was prevented:', error)
      })
    }
  }, [])

  return (
    <div className="relative group" onClick={onClick}>
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#8A9C66] shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted={isMuted}
          playsInline
        >
          <source src={videoSource} type="video/mp4" />
          <source src={videoSource} type="video/quicktime" />
          <source src={videoSource} />
        </video>
        
        {/* Overlay with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        
        {/* Play icon overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-l-[10px] border-l-black border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1" />
          </div>
        </div>
      </div>
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