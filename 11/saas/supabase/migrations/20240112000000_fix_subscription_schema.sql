-- Migration number: 20240112000000_fix_subscription_schema.sql

-- Add columns expected by SupabaseSubscriptionRepository
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS plan_name TEXT DEFAULT 'Free',
ADD COLUMN IF NOT EXISTS amount INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_method_brand TEXT,
ADD COLUMN IF NOT EXISTS payment_method_last4 TEXT;

-- Temporarily make plan_id nullable since we are moving to plan_name
ALTER TABLE public.subscriptions ALTER COLUMN plan_id DROP NOT NULL;

-- Update existing rows (if any) to have logical defaults based on plan_id if possible
-- But simpler to just set defaults.
-- Since we are in early dev, we assume data is either empty or okay to be migrated softly.
