-- Add new columns to store_settings table
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS tax_included BOOLEAN DEFAULT false;

-- Add checking constraints if needed, but BOOLEAN is fine.
