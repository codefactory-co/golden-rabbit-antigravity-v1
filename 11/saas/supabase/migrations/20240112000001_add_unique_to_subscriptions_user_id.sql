-- Migration number: 20240112000001_add_unique_to_subscriptions_user_id.sql

-- Add unique constraint to user_id to support UPSERT operations
ALTER TABLE public.subscriptions
ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);
