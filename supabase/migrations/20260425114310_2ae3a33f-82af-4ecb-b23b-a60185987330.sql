-- Remove duplicate public read policy on storage.objects for voix-images.
-- Two identical SELECT policies existed; we keep one and drop the redundant one.
DROP POLICY IF EXISTS "Public read voix-images" ON storage.objects;