
-- Tighten product_features policies: public read, authenticated-only writes
DROP POLICY IF EXISTS "Anyone can manage features" ON public.product_features;
DROP POLICY IF EXISTS "Anyone can update features" ON public.product_features;
DROP POLICY IF EXISTS "Anyone can delete features" ON public.product_features;

CREATE POLICY "Authenticated users can insert features"
ON public.product_features FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update features"
ON public.product_features FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete features"
ON public.product_features FOR DELETE
TO authenticated
USING (true);

-- Tighten storage policies: public read, authenticated-only writes
DROP POLICY IF EXISTS "Anyone can upload to voix-images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update voix-images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete from voix-images" ON storage.objects;

CREATE POLICY "Auth users can upload to voix-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'voix-images');

CREATE POLICY "Auth users can update voix-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'voix-images');

CREATE POLICY "Auth users can delete from voix-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'voix-images');
