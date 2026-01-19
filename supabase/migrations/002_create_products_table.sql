-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_description TEXT NOT NULL,
  price INTEGER NOT NULL,
  mrp INTEGER NOT NULL,
  images TEXT[] NOT NULL,
  sizes TEXT[] NOT NULL,
  current_size TEXT NOT NULL,
  rating DECIMAL(3,2) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  question_count INTEGER NOT NULL DEFAULT 0,
  answer_count INTEGER NOT NULL DEFAULT 0,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  what_is_it TEXT,
  what_does_it_do TEXT[],
  our_promise TEXT,
  usage TEXT[],
  what_makes_it_special TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON public.products(in_stock);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to products
CREATE POLICY "Anyone can read products"
  ON public.products
  FOR SELECT
  USING (true);

-- Create policy to allow service role to do everything
CREATE POLICY "Service role can do everything"
  ON public.products
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample products
INSERT INTO public.products (
  id, name, short_description, price, mrp, images, sizes, current_size,
  rating, review_count, question_count, answer_count, in_stock,
  what_is_it, what_does_it_do, our_promise, usage, what_makes_it_special
) VALUES
(
  '1',
  'Kailash Shilajit Sun-Dried Resin 25g',
  'From untouched Himalayan rocks → purified only by the Sun → delivered with absolute honesty.',
  4500,
  5000,
  ARRAY['/v2/shilajit/1.JPG', '/v2/shilajit/2.JPG', '/v2/shilajit/3.JPG', '/v2/shilajit/4.JPG'],
  ARRAY['12g', '25g'],
  '25g',
  5.0,
  55,
  13,
  20,
  true,
  'Kailash Shilajit is a 100% pure Himalayan resin formed over centuries within ancient mountain rocks. It is hand-harvested from remote cliffs by local Himalayan families, preserved in its raw, unaltered form, and delivered with complete transparency and trust.',
  ARRAY[
    'Sustained Energy & Stamina – keeps you active throughout the day',
    'Strength & Workout Recovery – supports muscle power and faster bounce-back',
    'Hormonal & Vitality Support – enhances endurance and overall wellness',
    'Mineral-Rich & Fulvic Powered – naturally nourishes your body with fulvic richness'
  ],
  '100% Pure. 0% Mixing. 0% Compromise. No heat processing. No aggressive filtration. No additives. Just potent Shilajit, exactly as the Himalayas create it.',
  ARRAY[
    'Take a pea-sized amount (200–300 mg) using a clean spoon/stick',
    'Mix into warm milk or water (don''t boil)',
    'Stir until it dissolves naturally',
    'Drink once daily — after breakfast or before workout',
    'Store jar in a cool, dry place'
  ],
  E'Our Shilajit is not sourced — it is hard-harvested.\nWe trek 1.5 days deep into the Himalayas, where the trails turn into cliffs and the cold tests every breath.\nCrossing frozen rivers and ancient rocks, we reach a source few ever see.\n\nEvery gram is hand-extracted by local mountain families, sun-purified naturally, and collected with respect — no machines, no heat, no shortcuts.\n\nRare resin. Real journey. Complete trust.'
),
(
  '2',
  'Kailash Shilajit Ladoos pack of 30',
  'A mineral-rich energy ladoo crafted from 100% pure Himalayan Shilajit resin, reached after a 1.5-day trek into high mountain rocks. Naturally sweetened only with raw Himalayan forest honey and premium dry fruits — no heat, no sugar, no chemicals. Ancient resin. Real journey. Daily strength ritual.',
  2999,
  3499,
  ARRAY['/v2/ladoos/1.JPG', '/v2/ladoos/2.JPG', '/v2/ladoos/3.JPG', '/v2/ladoos/4.JPG', '/v2/ladoos/5.JPG', '/v2/ladoos/6.JPG'],
  ARRAY['30 count', '60 count'],
  '30 count',
  4.8,
  256,
  8,
  15,
  true,
  'Kailash Shilajit Ladoos (270g | Pack of 30) are energy-dense wellness bites crafted from 100% pure Himalayan Shilajit resin, collected after a 1.5-day trek into the high ranges. We blend this ancient resin only with raw Himalayan forest honey and premium dry fruits — no heat, no sugar, no chemicals, no compromise. A ritual of endurance, purity, and honesty — rolled into one timeless Ladoo.',
  ARRAY[
    'Fuels natural long-lasting energy',
    'Supports strength, stamina & vitality',
    'Helps mineral recharge & workout recovery',
    'Enriched with fulvic compounds for immunity & clarity'
  ],
  'Ancient source. Hand harvested. Sun purified. No heat. No sugar. No chemicals. No compromise',
  ARRAY[
    'Take 1 ladoo daily',
    'Eat after breakfast or 30 min before workout',
    'Pair with warm milk or lukewarm water'
  ],
  NULL
),
(
  '3',
  'Kailash Shilajit PCT Capsules - Pack of 30',
  'Kailash Shilajit PCT Capsules are a 30-day Ayurvedic recovery formula powered by pure mineral-rich Himalayan Shilajit and 11 restorative herbs. Made for those who train hard and recover naturally — no fillers, no sugar, no steroids, no mixing.',
  1999,
  2499,
  ARRAY['/v2/pct/1.JPG', '/v2/pct/2.JPG', '/v2/pct/3.JPG', '/v2/pct/4.JPG'],
  ARRAY['30 count', '60 count'],
  '30 count',
  4.5,
  89,
  8,
  15,
  true,
  'Kailash Shilajit PCT Capsules are rooted in the wisdom of 11-herb Ayurvedic recovery science and powered by mineral-rich, pure Himalayan Shilajit. Crafted without fillers, synthetics, or any form of mixing, this formula is designed as a daily recovery ritual — supporting restoration, balance, and real strength, not a temporary energy boost.',
  ARRAY[
    'Restores energy after intense training',
    'Supports hormonal balance & recovery',
    'Helps muscle stress & post-workout fatigue',
    'Aids mineral recharge & liver restoration'
  ],
  '100% natural recovery. 0% compromise. No steroids. No sugar. No artificial enhancers. Only clean ingredients that rebuild, recover, and restore — the pure way',
  ARRAY[
    'Take 1 capsule daily (after breakfast or post-workout)',
    'Swallow with water or warm milk',
    'Max 2 capsules/day (do not exceed)'
  ],
  NULL
),
(
  '4',
  'Kailash Amrit Shots – Pack of 30',
  'Kailash Amrit Shots is a 30-day wellness ritual powered by pure Himalayan forest honey and authentic Shilajit resin. Each 10ml shot delivers natural energy, stamina, and mineral richness in its raw, unheated, and uncompromised form. No sugar, no additives, no mixing — just real Himalayan vitality in every bottle.',
  3500,
  4000,
  ARRAY['/v2/amrit_shot.png'],
  ARRAY['30 count', '60 count'],
  '30 count',
  4.6,
  178,
  8,
  15,
  true,
  'Kailash Amrit Shots is a 30-day wellness ritual packed in 10ml shot bottles, crafted using pure Himalayan forest honey and authentic Shilajit resin. Sourced from the high Himalayas after a 1.5-day mountain trek, each bottle carries raw minerals and fulvic richness in its natural form, untouched by heat or artificial additives.',
  ARRAY[
    'Provides steady, long-lasting natural energy',
    'Supports stamina, endurance & strength',
    'Helps recover from daily fatigue & intense workouts',
    'Recharges the body with essential trace minerals',
    'Supports immunity & overall wellbeing',
    'Enhances mental clarity, focus & vitality'
  ],
  'We keep it real because nature already made it perfect. No heat processing, no added sugar, no fillers, no artificial enhancers, and no mixing. Just two pure Himalayan elements sealed in every bottle with one oath — 100% Pure. 0% Mixing. 0% Compromise.',
  ARRAY[
    'Take 1 shot daily (after breakfast or post-workout)',
    'Consume directly or mix with water',
    'Max 2 shots/day (do not exceed)'
  ],
  NULL
);
