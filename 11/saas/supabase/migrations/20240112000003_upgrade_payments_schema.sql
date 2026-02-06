-- Migration number: 20240112000003_upgrade_payments_schema.sql

-- 1. Add provider_payment_id column to store Toss Payment Key (or Stripe ID)
ALTER TABLE public.payments
ADD COLUMN IF NOT EXISTS provider_payment_id TEXT;

-- 2. Add INSERT policy for users
-- This allows authenticated users to insert their own payment records.
CREATE POLICY "Users can insert their own payments" ON public.payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);
