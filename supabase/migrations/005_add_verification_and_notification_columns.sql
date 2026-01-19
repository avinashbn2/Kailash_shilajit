-- Add verification status columns to orders table
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS phone_verified_at TIMESTAMP WITH TIME ZONE;

-- Add notification status columns to orders table
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS email_notification_sent BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS email_notification_sent_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS email_notification_error TEXT,
  ADD COLUMN IF NOT EXISTS sms_notification_sent BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS sms_notification_sent_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS sms_notification_error TEXT;

-- Create indexes for querying unnotified orders
CREATE INDEX IF NOT EXISTS idx_orders_email_notification
  ON public.orders(email_notification_sent, status);

CREATE INDEX IF NOT EXISTS idx_orders_sms_notification
  ON public.orders(sms_notification_sent, status);

-- Create indexes for verification status queries
CREATE INDEX IF NOT EXISTS idx_orders_email_verified
  ON public.orders(email_verified);

CREATE INDEX IF NOT EXISTS idx_orders_phone_verified
  ON public.orders(phone_verified);
