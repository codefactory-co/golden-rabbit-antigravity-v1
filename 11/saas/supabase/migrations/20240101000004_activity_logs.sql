-- Migration number: 00004_activity_logs.sql

CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type public.activity_type NOT NULL,
    description TEXT,
    metadata JSONB, -- Store extra info like browser, IP, or specific target IDs
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
