-- Migration number: 20240112000004_allow_payment_updates.sql

-- Add UPDATE policy for users
-- This allows authenticated users to update their own payment records (e.g. status, approved_at).
CREATE POLICY "Users can update their own payments" ON public.payments
    FOR UPDATE USING (auth.uid() = user_id);
