-- Add payment_id column to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_id TEXT;

-- Create index on payment_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON public.orders(payment_id);
