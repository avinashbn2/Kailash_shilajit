-- Create function to cleanup old OTP records
CREATE OR REPLACE FUNCTION cleanup_old_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM public.otp_verifications
  WHERE
    (verified = TRUE AND verified_at < NOW() - INTERVAL '24 hours')
    OR (verified = FALSE AND expires_at < NOW() - INTERVAL '1 hour');
END;
$$ LANGUAGE plpgsql;

-- Note: To schedule this function to run periodically:
-- 1. In Supabase Dashboard: Database > Cron Jobs
-- 2. Create new cron job with schedule: 0 * * * * (every hour)
-- 3. SQL: SELECT cleanup_old_otps();
--
-- Alternatively, you can call this function manually or from your application:
-- SELECT cleanup_old_otps();
