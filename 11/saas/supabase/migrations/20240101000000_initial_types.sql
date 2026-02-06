-- Migration number: 00000_initial_types.sql

-- Create ENUMs for fixed values
CREATE TYPE public.plan_type AS ENUM ('FREE', 'PRO', 'ENTERPRISE');
CREATE TYPE public.subscription_status AS ENUM ('ACTIVE', 'CANCELED', 'PAST_DUE', 'INCOMPLETE', 'INCOMPLETE_EXPIRED', 'TRIALING', 'UNPAID');
CREATE TYPE public.activity_type AS ENUM ('CREATE_NOTE', 'UPDATE_NOTE', 'DELETE_NOTE', 'CREATE_FOLDER', 'DELETE_FOLDER', 'USE_AI_SUMMARY', 'SHARE_NOTE', 'LOGIN', 'UPDATE_PROFILE');

-- Create a function to auto-update updated_at timestamp (will be used later)
-- We put it here or in a separate utility migration, but standard practice is often early.
CREATE OR REPLACE FUNCTION public.moddatetime()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
