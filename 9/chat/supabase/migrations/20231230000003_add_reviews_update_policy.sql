-- Add update policy to reviews table for public upsert support
create policy "Reviews are updatable by everyone" on reviews
  for update with check (true);
