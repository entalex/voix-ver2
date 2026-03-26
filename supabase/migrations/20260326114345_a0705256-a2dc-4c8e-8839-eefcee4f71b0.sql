ALTER TABLE public.product_features 
ADD COLUMN IF NOT EXISTS title_ka text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS description_ka text NOT NULL DEFAULT '';