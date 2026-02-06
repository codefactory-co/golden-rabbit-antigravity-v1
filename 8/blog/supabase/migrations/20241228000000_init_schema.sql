-- Create categories table
create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create posts table
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  image_url text,
  category_id uuid references categories(id),
  user_id uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table categories enable row level security;
alter table posts enable row level security;

-- Create policies for public read access
create policy "Public categories are viewable by everyone." on categories
  for select using (true);

create policy "Public posts are viewable by everyone." on posts
  for select using (true);

-- Create policies for authenticated users to insert/update/delete their own posts (optional for now, but good practice)
-- Assuming we want to allow anyone to read, but only logged in users to write (if needed later)
-- For now, just public read is the requirement for the homepage display.
