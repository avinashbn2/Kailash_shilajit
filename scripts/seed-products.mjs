import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { config } from 'dotenv'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const products = [
  {
    id: '1',
    name: 'Kailash Shilajit Sun-Dried Resin 25g',
    short_description: 'From untouched Himalayan rocks → purified only by the Sun → delivered with absolute honesty.',
    price: 4500,
    mrp: 5000,
    images: ['/v2/shilajit/1.JPG', '/v2/shilajit/2.JPG', '/v2/shilajit/3.JPG', '/v2/shilajit/4.JPG'],
    sizes: ['12g', '25g'],
    current_size: '25g',
    rating: 5.0,
    review_count: 55,
    question_count: 13,
    answer_count: 20,
    in_stock: true,
    what_is_it: 'Kailash Shilajit is a 100% pure Himalayan resin formed over centuries within ancient mountain rocks. It is hand-harvested from remote cliffs by local Himalayan families, preserved in its raw, unaltered form, and delivered with complete transparency and trust.',
    what_does_it_do: [
      'Sustained Energy & Stamina – keeps you active throughout the day',
      'Strength & Workout Recovery – supports muscle power and faster bounce-back',
      'Hormonal & Vitality Support – enhances endurance and overall wellness',
      'Mineral-Rich & Fulvic Powered – naturally nourishes your body with fulvic richness'
    ],
    our_promise: '100% Pure. 0% Mixing. 0% Compromise. No heat processing. No aggressive filtration. No additives. Just potent Shilajit, exactly as the Himalayas create it.',
    usage: [
      'Take a pea-sized amount (200–300 mg) using a clean spoon/stick',
      'Mix into warm milk or water (don\'t boil)',
      'Stir until it dissolves naturally',
      'Drink once daily — after breakfast or before workout',
      'Store jar in a cool, dry place'
    ],
    what_makes_it_special: 'Our Shilajit is not sourced — it is hard-harvested.\nWe trek 1.5 days deep into the Himalayas, where the trails turn into cliffs and the cold tests every breath.\nCrossing frozen rivers and ancient rocks, we reach a source few ever see.\n\nEvery gram is hand-extracted by local mountain families, sun-purified naturally, and collected with respect — no machines, no heat, no shortcuts.\n\nRare resin. Real journey. Complete trust.'
  },
  {
    id: '2',
    name: 'Kailash Shilajit Ladoos pack of 30',
    short_description: 'A mineral-rich energy ladoo crafted from 100% pure Himalayan Shilajit resin, reached after a 1.5-day trek into high mountain rocks. Naturally sweetened only with raw Himalayan forest honey and premium dry fruits — no heat, no sugar, no chemicals. Ancient resin. Real journey. Daily strength ritual.',
    price: 2999,
    mrp: 3499,
    images: ['/v2/ladoos/1.JPG', '/v2/ladoos/2.JPG', '/v2/ladoos/3.JPG', '/v2/ladoos/4.JPG', '/v2/ladoos/5.JPG', '/v2/ladoos/6.JPG'],
    sizes: ['30 count', '60 count'],
    current_size: '30 count',
    rating: 4.8,
    review_count: 256,
    question_count: 8,
    answer_count: 15,
    in_stock: true,
    what_is_it: 'Kailash Shilajit Ladoos (270g | Pack of 30) are energy-dense wellness bites crafted from 100% pure Himalayan Shilajit resin, collected after a 1.5-day trek into the high ranges. We blend this ancient resin only with raw Himalayan forest honey and premium dry fruits — no heat, no sugar, no chemicals, no compromise. A ritual of endurance, purity, and honesty — rolled into one timeless Ladoo.',
    what_does_it_do: [
      'Fuels natural long-lasting energy',
      'Supports strength, stamina & vitality',
      'Helps mineral recharge & workout recovery',
      'Enriched with fulvic compounds for immunity & clarity'
    ],
    our_promise: 'Ancient source. Hand harvested. Sun purified. No heat. No sugar. No chemicals. No compromise',
    usage: [
      'Take 1 ladoo daily',
      'Eat after breakfast or 30 min before workout',
      'Pair with warm milk or lukewarm water'
    ],
    what_makes_it_special: null
  },
  {
    id: '3',
    name: 'Kailash Shilajit PCT Capsules - Pack of 30',
    short_description: 'Kailash Shilajit PCT Capsules are a 30-day Ayurvedic recovery formula powered by pure mineral-rich Himalayan Shilajit and 11 restorative herbs. Made for those who train hard and recover naturally — no fillers, no sugar, no steroids, no mixing.',
    price: 1999,
    mrp: 2499,
    images: ['/v2/pct/1.JPG', '/v2/pct/2.JPG', '/v2/pct/3.JPG', '/v2/pct/4.JPG'],
    sizes: ['30 count', '60 count'],
    current_size: '30 count',
    rating: 4.5,
    review_count: 89,
    question_count: 8,
    answer_count: 15,
    in_stock: true,
    what_is_it: 'Kailash Shilajit PCT Capsules are rooted in the wisdom of 11-herb Ayurvedic recovery science and powered by mineral-rich, pure Himalayan Shilajit. Crafted without fillers, synthetics, or any form of mixing, this formula is designed as a daily recovery ritual — supporting restoration, balance, and real strength, not a temporary energy boost.',
    what_does_it_do: [
      'Restores energy after intense training',
      'Supports hormonal balance & recovery',
      'Helps muscle stress & post-workout fatigue',
      'Aids mineral recharge & liver restoration'
    ],
    our_promise: '100% natural recovery. 0% compromise. No steroids. No sugar. No artificial enhancers. Only clean ingredients that rebuild, recover, and restore — the pure way',
    usage: [
      'Take 1 capsule daily (after breakfast or post-workout)',
      'Swallow with water or warm milk',
      'Max 2 capsules/day (do not exceed)'
    ],
    what_makes_it_special: null
  },
  {
    id: '4',
    name: 'Kailash Amrit Shots – Pack of 30',
    short_description: 'Kailash Amrit Shots is a 30-day wellness ritual powered by pure Himalayan forest honey and authentic Shilajit resin. Each 10ml shot delivers natural energy, stamina, and mineral richness in its raw, unheated, and uncompromised form. No sugar, no additives, no mixing — just real Himalayan vitality in every bottle.',
    price: 3500,
    mrp: 4000,
    images: ['/v2/amrit_shot.png'],
    sizes: ['30 count', '60 count'],
    current_size: '30 count',
    rating: 4.6,
    review_count: 178,
    question_count: 8,
    answer_count: 15,
    in_stock: true,
    what_is_it: 'Kailash Amrit Shots is a 30-day wellness ritual packed in 10ml shot bottles, crafted using pure Himalayan forest honey and authentic Shilajit resin. Sourced from the high Himalayas after a 1.5-day mountain trek, each bottle carries raw minerals and fulvic richness in its natural form, untouched by heat or artificial additives.',
    what_does_it_do: [
      'Provides steady, long-lasting natural energy',
      'Supports stamina, endurance & strength',
      'Helps recover from daily fatigue & intense workouts',
      'Recharges the body with essential trace minerals',
      'Supports immunity & overall wellbeing',
      'Enhances mental clarity, focus & vitality'
    ],
    our_promise: 'We keep it real because nature already made it perfect. No heat processing, no added sugar, no fillers, no artificial enhancers, and no mixing. Just two pure Himalayan elements sealed in every bottle with one oath — 100% Pure. 0% Mixing. 0% Compromise.',
    usage: [
      'Take 1 shot daily (after breakfast or post-workout)',
      'Consume directly or mix with water',
      'Max 2 shots/day (do not exceed)'
    ],
    what_makes_it_special: null
  }
]

async function seedProducts() {
  console.log('🌱 Seeding products to Supabase...\n')

  try {
    // Check if products table exists and is accessible
    const { data: existingProducts, error: fetchError } = await supabase
      .from('products')
      .select('id')
      .limit(1)

    if (fetchError) {
      console.error('❌ Error accessing products table:', fetchError.message)
      console.log('\n📝 Please run the migration SQL manually in Supabase dashboard:')
      console.log('   1. Go to https://supabase.com/dashboard')
      console.log('   2. Navigate to SQL Editor')
      console.log('   3. Copy and paste the contents of:')
      console.log('      - supabase/migrations/001_create_orders_table.sql')
      console.log('      - supabase/migrations/002_create_products_table.sql')
      console.log('   4. Execute the SQL\n')
      return
    }

    // Upsert products (insert or update if exists)
    const { data, error } = await supabase
      .from('products')
      .upsert(products, { onConflict: 'id' })

    if (error) {
      console.error('❌ Error inserting products:', error)
      return
    }

    console.log('✅ Successfully seeded products!')
    console.log(`   Inserted/Updated ${products.length} products\n`)

    // Verify the data
    const { data: verifyData, error: verifyError } = await supabase
      .from('products')
      .select('id, name, price')

    if (!verifyError && verifyData) {
      console.log('📦 Products in database:')
      verifyData.forEach(p => {
        console.log(`   - ${p.name} (₹${p.price})`)
      })
    }

    console.log('\n✨ Database is ready!')
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

seedProducts()
