-- email_verifications table for checkout OTP flow
CREATE TABLE IF NOT EXISTS public.email_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  otp_code text NOT NULL,
  expires_at timestamptz NOT NULL,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON public.email_verifications(email);

ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;

-- Allow the app (service role) full access; no public RLS policy needed since
-- all access goes through API routes using the service role key.