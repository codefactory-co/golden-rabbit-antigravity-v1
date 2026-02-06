-- Allow authenticated users to insert posts
create policy "Authenticated users can create posts" on posts
  for insert with check (auth.uid() = user_id);
