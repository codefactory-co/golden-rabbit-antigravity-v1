-- Migration number: 20240112000002_add_subscription_policies.sql

-- Add INSERT and UPDATE policies for subscriptions table to allow users to manage their own subscription
-- This is necessary because we are doing client-side (or server-component-side acting as user) upserts.

CREATE POLICY "Users can insert their own subscription" ON public.subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" ON public.subscriptions
    FOR UPDATE USING (auth.uid() = user_id);
