-- Create reviews table
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_name text not null,
  review_text text not null,
  rating integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table reviews enable row level security;

-- Create public access policy
create policy "Reviews are viewable by everyone" on reviews
  for select using (true);

create policy "Reviews are insertable by everyone" on reviews
  for insert with check (true);
