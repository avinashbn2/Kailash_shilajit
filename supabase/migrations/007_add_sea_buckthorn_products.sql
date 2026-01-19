-- Add Sea Buckthorn products

INSERT INTO public.products (
  id, name, short_description, price, mrp, images, sizes, current_size,
  rating, review_count, question_count, answer_count, in_stock,
  what_is_it, what_does_it_do, our_promise, usage, what_makes_it_special
) VALUES
(
  '5',
  'Kailash Sea Buckthorn Capsules – 30 Capsules',
  'From wild Himalayan berries → gently processed & encapsulated → delivered with complete purity.',
  1499,
  1799,
  ARRAY['/v2/sbt_capsules/1.JPG', '/v2/sbt_capsules/2.JPG', '/v2/sbt_capsules/3.JPG', '/v2/sbt_capsules/4.JPG', '/v2/sbt_capsules/5.JPG'],
  ARRAY['30 capsules', '60 capsules'],
  '30 capsules',
  4.7,
  42,
  5,
  8,
  true,
  'Kailash Sea Buckthorn Capsules are made from 100% pure Himalayan Sea Buckthorn berries, wild-grown in the pristine high-altitude regions of the Himalayas. The berries are carefully handpicked at peak ripeness, gently processed into pulp, and then encapsulated to preserve their natural potency. Free from chemicals, dilution, and unnecessary processing, these capsules deliver Sea Buckthorn''s full-spectrum nutrients — antioxidants, omega fatty acids, and essential vitamins — in a clean, convenient daily form, backed by complete purity, transparency, and trust.',
  ARRAY[
    'Natural Energy & Immunity Boost – supports sustained vitality and everyday resilience',
    'Skin, Gut & Cellular Repair – nourishes the body from within with powerful antioxidants',
    'Heart & Metabolic Support – helps maintain healthy circulation and internal balance',
    'Omega-Rich Superfruit Nutrition – delivers rare omegas, vitamins, and minerals for complete wellness'
  ],
  '100% Pure. 0% Dilution. 0% Compromise. Carefully processed to retain nutrients. No colorants. No flavoring agents. Just potent Himalayan Sea Buckthorn, encapsulated exactly as nature intends.',
  ARRAY[
    'Take 1–2 capsules daily with water',
    'Consume after breakfast or before workout',
    'Swallow whole — do not open or chew the capsule',
    'Use consistently for best results',
    'Store the bottle in a cool, dry place, away from direct sunlight'
  ],
  E'Our Sea Buckthorn is not farmed — it is wild-harvested. We journey deep into high-altitude Himalayan valleys where harsh winters, thin air, and untouched terrain shape extraordinary nutrition. Thriving naturally along cold riverbanks and rugged land, these berries develop exceptional strength and potency. Each berry is handpicked by local mountain families, gently processed using traditional methods, and carefully encapsulated — no heat abuse, no shortcuts, no compromise.\n\nRare fruit. Ancient land. Pure nutrition. Complete trust.'
),
(
  '6',
  'Kailash Sea Buckthorn Pulp – 500ml',
  'From wild Himalayan berries → gently pulped at source → delivered in its pure, natural form.',
  1299,
  1599,
  ARRAY['/v2/sbt_pulp/1.JPG', '/v2/sbt_pulp/2.JPG', '/v2/sbt_pulp/3.JPG', '/v2/sbt_pulp/4.JPG', '/v2/sbt_pulp/5.JPG'],
  ARRAY['500ml', '1000ml'],
  '500ml',
  4.8,
  67,
  6,
  10,
  true,
  'Kailash Sea Buckthorn Pulp is a 100% pure Himalayan superfruit extract made from wild-grown Sea Buckthorn berries harvested in the pristine high-altitude regions of the Himalayas. The berries are carefully handpicked at peak ripeness, gently pulped without chemicals or artificial additives, and preserved in their natural form to retain maximum nutrients. Rich in antioxidants, omega fatty acids, and vital vitamins, this pulp is delivered fresh with complete purity, transparency, and trust.',
  ARRAY[
    'Natural Energy & Immunity Boost – supports long-lasting vitality and daily resilience',
    'Skin, Gut & Cellular Repair – nourishes from within with powerful antioxidants',
    'Heart & Metabolic Support – helps maintain healthy circulation and balance',
    'Omega-Rich Superfruit Nutrition – delivers rare omegas, vitamins, and minerals for complete wellness'
  ],
  '100% Pure. 0% Dilution. 0% Compromise. Cold-processed to preserve nutrients. No colorants. No flavoring agents. Just potent Himalayan Sea Buckthorn pulp, exactly as nature creates it.',
  ARRAY[
    'Take 1–2 teaspoons (5–10 ml) of Sea Buckthorn pulp using a clean spoon',
    'Consume directly or mix with lukewarm water or juice (do not boil)',
    'Stir gently until well blended',
    'Drink once daily — preferably after breakfast or before workout',
    'Store bottle in a cool, dry place and refrigerate after opening'
  ],
  E'Our Sea Buckthorn is not farmed — it is wild-harvested. We journey deep into the high-altitude Himalayan valleys where the air is thin, winters are harsh, and the land remains untouched. Growing naturally along cold riverbanks and rugged terrain, these berries survive extreme conditions, making them exceptionally potent. Each berry is handpicked by local mountain families at peak ripeness, gently pulped using traditional methods, and preserved in its raw form — no heat, no shortcuts, no compromise.\n\nRare fruit. Harsh land. Pure nutrition. Complete trust.'
);
