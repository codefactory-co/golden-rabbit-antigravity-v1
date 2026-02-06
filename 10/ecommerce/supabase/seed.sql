-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean up existing data (optional, be careful in production)
-- TRUNCATE public.order_items, public.orders, public.products, public.categories CASCADE;
-- DELETE FROM auth.users WHERE email LIKE '%@example.com';

-- 1. Create Users (Admin & Customers)
DO $$
DECLARE
  v_admin_id UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  v_customer_ids UUID[] := ARRAY[
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01',
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c02',
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c03',
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c04',
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c05'
  ]::UUID[];
  v_user_id UUID;
  i INT;
BEGIN
  -- 1. Create Admin User
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = v_admin_id) THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      v_admin_id,
      'authenticated',
      'authenticated',
      'admin@example.com',
      crypt('password123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Admin User"}',
      now(),
      now()
    );
  END IF;

  -- Update admin role in public.users (trigger sets it to customer by default unless logic changes)
  -- The trigger sets role to 'customer', so we need to update it to 'admin'
  UPDATE public.users SET role = 'admin' WHERE id = v_admin_id;

  -- 2. Create Customer Users
  FOREACH v_user_id IN ARRAY v_customer_ids LOOP
    i := array_position(v_customer_ids, v_user_id);
    
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = v_user_id) THEN
      INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at
      ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        v_user_id,
        'authenticated',
        'authenticated',
        'customer' || i || '@example.com',
        crypt('password123', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}',
        json_build_object('name', 'Customer ' || i),
        now(),
        now()
      );
    END IF;
  END LOOP;
END $$;

-- 2. Categories
INSERT INTO public.categories (name) VALUES 
('전자제품'), 
('의류'), 
('식품'),
('도서'),
('뷰티'),
('스포츠'),
('가구')
ON CONFLICT (name) DO NOTHING;

-- 3. Products
DO $$
DECLARE
  v_cat_electronics INT;
  v_cat_clothing INT;
  v_cat_food INT;
  v_cat_books INT;
  v_cat_beauty INT;
BEGIN
  SELECT id INTO v_cat_electronics FROM public.categories WHERE name = '전자제품';
  SELECT id INTO v_cat_clothing FROM public.categories WHERE name = '의류';
  SELECT id INTO v_cat_food FROM public.categories WHERE name = '식품';
  SELECT id INTO v_cat_books FROM public.categories WHERE name = '도서';
  SELECT id INTO v_cat_beauty FROM public.categories WHERE name = '뷰티';

  -- Electronics
  INSERT INTO public.products (name, description, category_id, price, stock, status, images) VALUES
  ('무선 노이즈 캔슬링 헤드폰', '최고의 음질과 편안한 착용감을 제공하는 헤드폰입니다.', v_cat_electronics, 299000, 50, 'active', ARRAY['https://placehold.co/600x400?text=Headphone']),
  ('프리미엄 스마트폰', '최신 프로세서와 고화질 카메라가 탑재된 스마트폰.', v_cat_electronics, 1200000, 30, 'active', ARRAY['https://placehold.co/600x400?text=Smartphone']),
  ('4K 게이밍 모니터', '144Hz 주사율을 지원하는 선명한 4K 모니터.', v_cat_electronics, 650000, 20, 'active', ARRAY['https://placehold.co/600x400?text=Monitor']),
  ('블루투스 기계식 키보드', '타건감이 좋은 무선 기계식 키보드.', v_cat_electronics, 150000, 100, 'active', ARRAY['https://placehold.co/600x400?text=Keyboard']);

  -- Clothing
  INSERT INTO public.products (name, description, category_id, price, stock, status, images) VALUES
  ('오버핏 데님 자켓', '트렌디한 핏의 데님 자켓입니다.', v_cat_clothing, 89000, 45, 'active', ARRAY['https://placehold.co/600x400?text=Denim+Jacket']),
  ('베이직 코튼 티셔츠', '매일 입기 좋은 편안한 면 티셔츠 세트.', v_cat_clothing, 29900, 200, 'active', ARRAY['https://placehold.co/600x400?text=T-Shirt']),
  ('슬림핏 슬랙스', '비즈니스 캐주얼에 어울리는 슬랙스.', v_cat_clothing, 49000, 60, 'active', ARRAY['https://placehold.co/600x400?text=Slacks']);

  -- Food
  INSERT INTO public.products (name, description, category_id, price, stock, status, images) VALUES
  ('프리미엄 원두 커피', '갓 로스팅한 신선한 원두.', v_cat_food, 15000, 150, 'active', ARRAY['https://placehold.co/600x400?text=Coffee']),
  ('유기농 그래놀라', '건강한 아침 식사를 위한 그래놀라.', v_cat_food, 12000, 80, 'active', ARRAY['https://placehold.co/600x400?text=Granola']);

  -- Books
  INSERT INTO public.products (name, description, category_id, price, stock, status, images) VALUES
  ('모던 자바스크립트 Deep Dive', '자바스크립트의 기본부터 심화까지.', v_cat_books, 45000, 40, 'active', ARRAY['https://placehold.co/600x400?text=JS+Book']),
  ('클린 아키텍처', '소프트웨어 구조를 설계하는 원칙.', v_cat_books, 28000, 30, 'active', ARRAY['https://placehold.co/600x400?text=Clean+Arch']);
  
  -- Beauty
  INSERT INTO public.products (name, description, category_id, price, stock, status, images) VALUES
  ('수분 충전 크림', '건조한 피부를 위한 고보습 크림.', v_cat_beauty, 32000, 70, 'active', ARRAY['https://placehold.co/600x400?text=Cream']);

END $$;

-- 4. Store Settings (Ensure defaults)
INSERT INTO public.store_settings (id, store_name, currency) VALUES (1, 'Antigravity Store', 'KRW')
ON CONFLICT (id) DO UPDATE SET store_name = EXCLUDED.store_name;

-- 5. Orders & Order Items
DO $$
DECLARE
  v_users UUID[];
  v_products UUID[];
  v_user_id UUID;
  v_order_id UUID;
  v_product_id UUID;
  v_price NUMERIC;
  i INT;
  j INT;
BEGIN
  -- Get customers
  SELECT array_agg(id) INTO v_users FROM public.users WHERE role = 'customer';
  -- Get products
  SELECT array_agg(id) INTO v_products FROM public.products;

  -- Create random orders for each user
  FOREACH v_user_id IN ARRAY v_users LOOP
    FOR i IN 1..3 LOOP -- 3 orders per user
      INSERT INTO public.orders (
        user_id, 
        status, 
        total_amount, 
        shipping_name, 
        shipping_address, 
        created_at
      ) VALUES (
        v_user_id,
        (ARRAY['payment_completed', 'preparing', 'shipping', 'delivered']::public.order_status_type[])[floor(random() * 4 + 1)],
        0, -- Will calculate later
        'Customer Address ' || i,
        'Seoul, Gangnam-gu, Teheran-ro 123',
        NOW() - (random() * interval '30 days')
      ) RETURNING id INTO v_order_id;

      -- Add items to order
      FOR j IN 1..FLOOR(random() * 3 + 1) LOOP -- 1 to 3 items per order
        v_product_id := v_products[floor(random() * array_length(v_products, 1) + 1)];
        SELECT price INTO v_price FROM public.products WHERE id = v_product_id;
        
        INSERT INTO public.order_items (order_id, product_id, quantity, unit_price, subtotal)
        VALUES (v_order_id, v_product_id, 1, v_price, v_price);
      END LOOP;

      -- Update order total amount
      UPDATE public.orders 
      SET total_amount = (SELECT SUM(subtotal) FROM public.order_items WHERE order_id = v_order_id)
      WHERE id = v_order_id;
    END LOOP;
  END LOOP;
END $$;
