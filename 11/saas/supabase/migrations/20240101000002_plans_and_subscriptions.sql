-- Migration number: 00002_plans_and_subscriptions.sql

-- 1. Plans Table
CREATE TABLE public.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name public.plan_type NOT NULL UNIQUE,
    price_krw INTEGER NOT NULL,
    limits JSONB NOT NULL DEFAULT '{}'::JSONB, -- e.g., {"storage_gb": 10, "note_count": -1, "ai_summary_count": 100} (-1 for infinite)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Seed Plans
INSERT INTO public.plans (name, price_krw, limits) VALUES 
('FREE', 0, '{"storage_gb": 1, "note_count": 100, "ai_summary_count": 0}'),
('PRO', 9900, '{"storage_gb": 10, "note_count": -1, "ai_summary_count": 100}'),
('ENTERPRISE', 29900, '{"storage_gb": -1, "note_count": -1, "ai_summary_count": -1}');


-- 2. Subscriptions Table
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.plans(id),
    status public.subscription_status NOT NULL DEFAULT 'ACTIVE',
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    next_billing_date TIMESTAMPTZ,
    payment_method_info JSONB, -- store partial info like {"brand": "Visa", "last4": "4242"}
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 3. Usage Table (to track consumption against limits)
CREATE TABLE public.usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    storage_used_bytes BIGINT NOT NULL DEFAULT 0,
    note_count INTEGER NOT NULL DEFAULT 0,
    ai_summary_count INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.usage ENABLE ROW LEVEL SECURITY;

-- 4. Payments Table (Transaction History)
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.subscriptions(id),
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'KRW',
    status TEXT NOT NULL, -- e.g., 'succeeded', 'failed'
    order_id TEXT, -- External Order ID from payment provider
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
