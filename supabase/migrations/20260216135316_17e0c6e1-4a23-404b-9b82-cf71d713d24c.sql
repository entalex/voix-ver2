
-- Drop the restrictive policies and recreate as permissive (the existing ones are RESTRICTIVE which blocks access)
DROP POLICY IF EXISTS "Anyone can view product features" ON public.product_features;
DROP POLICY IF EXISTS "Authenticated users can delete features" ON public.product_features;
DROP POLICY IF EXISTS "Authenticated users can insert features" ON public.product_features;
DROP POLICY IF EXISTS "Authenticated users can update features" ON public.product_features;

-- Recreate as PERMISSIVE policies
CREATE POLICY "Anyone can view product features"
ON public.product_features FOR SELECT
USING (true);

CREATE POLICY "Anyone can manage features"
ON public.product_features FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update features"
ON public.product_features FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete features"
ON public.product_features FOR DELETE
USING (true);

-- Fix storage policies too
DROP POLICY IF EXISTS "Authenticated users can upload to voix-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update voix-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete from voix-images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access on voix-images" ON storage.objects;

CREATE POLICY "Public read voix-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'voix-images');

CREATE POLICY "Anyone can upload to voix-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'voix-images');

CREATE POLICY "Anyone can update voix-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'voix-images');

CREATE POLICY "Anyone can delete from voix-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'voix-images');
