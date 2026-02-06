-- Add billing_key to subscriptions table
ALTER TABLE public.subscriptions ADD COLUMN billing_key TEXT;
