-- Add payment_method column to orders table
-- Supports 'online' (Razorpay) and 'cod' (Cash on Delivery)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'online';

-- Add comment describing the column
COMMENT ON COLUMN public.orders.payment_method IS 'Payment method: online (Razorpay), cod (Cash on Delivery)';

-- Update existing orders to have payment_method = 'online' (they were all online payments)
UPDATE public.orders SET payment_method = 'online' WHERE payment_method IS NULL;
