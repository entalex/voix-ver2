
-- Drop old permissive storage policies
DROP POLICY IF EXISTS "Auth users can upload to voix-images" ON storage.objects;
DROP POLICY IF EXISTS "Auth users can update voix-images" ON storage.objects;
DROP POLICY IF EXISTS "Auth users can delete from voix-images" ON storage.objects;

-- Create admin-only storage policies
CREATE POLICY "Only admins can upload to voix-images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'voix-images'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Only admins can update voix-images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'voix-images'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Only admins can delete from voix-images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'voix-images'
    AND public.has_role(auth.uid(), 'admin')
  );

-- Add length constraints to product_features using validation triggers
CREATE OR REPLACE FUNCTION public.validate_product_feature()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF length(NEW.title) > 80 THEN
    RAISE EXCEPTION 'Title must be 80 characters or less';
  END IF;
  IF length(NEW.description) > 500 THEN
    RAISE EXCEPTION 'Description must be 500 characters or less';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_product_feature_trigger
  BEFORE INSERT OR UPDATE ON public.product_features
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_product_feature();

-- Add length constraint to site_settings value
CREATE OR REPLACE FUNCTION public.validate_site_setting()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF length(NEW.value) > 10000 THEN
    RAISE EXCEPTION 'Setting value must be 10000 characters or less';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_site_setting_trigger
  BEFORE INSERT OR UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_site_setting();
