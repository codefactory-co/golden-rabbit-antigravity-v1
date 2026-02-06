-- View for easier customer stats aggregation and sorting
CREATE OR REPLACE VIEW public.customers_with_stats AS
SELECT 
  u.id, 
  u.email, 
  u.name, 
  u.phone,
  u.role, 
  u.is_vip, 
  u.created_at,
  COUNT(o.id) as order_count,
  COALESCE(SUM(o.total_amount), 0) as total_order_amount
FROM public.users u
LEFT JOIN public.orders o ON u.id = o.user_id
GROUP BY u.id;
