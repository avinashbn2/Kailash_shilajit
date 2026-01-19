-- Add size_variants JSONB column to products table
-- This allows different prices/MRPs for different size options
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS size_variants JSONB;

-- Migrate existing data: Convert sizes + price/mrp to size_variants
-- Each size will get the same price/mrp (to be updated manually later)
UPDATE public.products
SET size_variants = (
  SELECT jsonb_agg(
    jsonb_build_object('size', s, 'price', price, 'mrp', mrp)
  )
  FROM unnest(sizes) AS s
)
WHERE size_variants IS NULL AND sizes IS NOT NULL;

-- Add a comment describing the column structure
COMMENT ON COLUMN public.products.size_variants IS 'Array of size variant objects: [{size: string, price: number, mrp: number}]';
