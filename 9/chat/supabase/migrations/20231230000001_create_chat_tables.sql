-- Create chats table
create table if not exists chats (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'New Chat',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create messages table
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references chats(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  type text default 'text',
  analysis_data jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table chats enable row level security;
alter table messages enable row level security;

-- Create public policies (since login is not required)
create policy "Chats are viewable by everyone" on chats
  for select using (true);

create policy "Chats are insertable by everyone" on chats
  for insert with check (true);

create policy "Messages are viewable by everyone" on messages
  for select using (true);

create policy "Messages are insertable by everyone" on messages
  for insert with check (true);
