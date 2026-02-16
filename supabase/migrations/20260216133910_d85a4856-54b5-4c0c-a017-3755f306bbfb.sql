
-- Create product_features table
CREATE TABLE public.product_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_features ENABLE ROW LEVEL SECURITY;

-- Public read access (landing page is public)
CREATE POLICY "Anyone can view product features"
  ON public.product_features FOR SELECT
  USING (true);

-- Authenticated users can manage features (admin)
CREATE POLICY "Authenticated users can insert features"
  ON public.product_features FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update features"
  ON public.product_features FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete features"
  ON public.product_features FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_product_features_updated_at
  BEFORE UPDATE ON public.product_features
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('voix-images', 'voix-images', true);

-- Public read access for voix-images bucket
CREATE POLICY "Public read access for voix-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'voix-images');

-- Authenticated users can upload to voix-images
CREATE POLICY "Authenticated users can upload to voix-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'voix-images' AND auth.uid() IS NOT NULL);

-- Authenticated users can update their uploads
CREATE POLICY "Authenticated users can update voix-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'voix-images' AND auth.uid() IS NOT NULL);

-- Authenticated users can delete from voix-images
CREATE POLICY "Authenticated users can delete from voix-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'voix-images' AND auth.uid() IS NOT NULL);

-- Seed with default features
INSERT INTO public.product_features (title, description, image_url, order_index) VALUES
  ('Intelligent Voice Capture', 'VOIX passively captures every in-person interaction with military-grade audio processing. Our proprietary AI filters background noise, identifies speakers, and delivers crystal-clear transcriptions in real time — no manual input required.', NULL, 0),
  ('Automated Performance Auditing', 'Go beyond subjective reviews. VOIX scores every interaction against your custom benchmarks — tracking compliance, sentiment, talk ratios, and key phrase usage. Managers get objective, data-backed performance reports delivered automatically.', NULL, 1),
  ('Actionable Intelligence at Scale', 'Surface trends across thousands of interactions instantly. VOIX''s analytics engine identifies coaching opportunities, compliance risks, and top-performer patterns — turning raw voice data into strategic business decisions.', NULL, 2),
  ('Real-Time Monitoring & Alerts', 'Stay informed the moment it matters. Configure custom triggers for compliance keywords, escalation signals, or sentiment shifts — and receive instant notifications so your team can act before issues grow.', NULL, 3);
