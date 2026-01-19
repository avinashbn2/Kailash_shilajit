-- Create OTP verifications table for email and phone verification
CREATE TABLE IF NOT EXISTS public.otp_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Contact details (one must be present)
  email TEXT,
  phone TEXT,

  -- OTP details
  otp_hash TEXT NOT NULL,
  otp_type TEXT NOT NULL CHECK (otp_type IN ('email', 'phone')),

  -- Verification tracking
  verification_attempts INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE,

  -- Expiration & security
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ip_address TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),

  -- Constraints
  CONSTRAINT email_or_phone_required CHECK (email IS NOT NULL OR phone IS NOT NULL),
  CONSTRAINT verification_attempts_limit CHECK (verification_attempts <= 5)
);

-- Create indexes for performance
CREATE INDEX idx_otp_verifications_email ON public.otp_verifications(email) WHERE email IS NOT NULL;
CREATE INDEX idx_otp_verifications_phone ON public.otp_verifications(phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_otp_verifications_expires_at ON public.otp_verifications(expires_at);
CREATE INDEX idx_otp_verifications_created_at ON public.otp_verifications(created_at);
CREATE INDEX idx_otp_verifications_ip_address ON public.otp_verifications(ip_address);

-- Index for cleanup queries
CREATE INDEX idx_otp_verifications_cleanup ON public.otp_verifications(expires_at, verified)
  WHERE verified = FALSE;

-- Create function to update updated_at timestamp (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_otp_verifications_updated_at
  BEFORE UPDATE ON public.otp_verifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies (only service role can access)
CREATE POLICY "Service role has full access to otp_verifications" ON public.otp_verifications
  FOR ALL USING (auth.role() = 'service_role');
