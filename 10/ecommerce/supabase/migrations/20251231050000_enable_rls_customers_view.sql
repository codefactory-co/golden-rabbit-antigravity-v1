-- Enable RLS for the view (Security Invoker)
-- This ensures that the view respects the Row Level Security policies of the underlying tables (users, orders).
-- Without this, the view executes with the privileges of the owner (definer).

ALTER VIEW public.customers_with_stats SET (security_invoker = true);
