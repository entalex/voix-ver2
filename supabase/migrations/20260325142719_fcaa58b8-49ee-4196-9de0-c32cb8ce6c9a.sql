CREATE TABLE public.form_submission_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.form_submission_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON public.form_submission_logs
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE INDEX idx_form_submission_logs_ip_created ON public.form_submission_logs (ip_address, created_at DESC);