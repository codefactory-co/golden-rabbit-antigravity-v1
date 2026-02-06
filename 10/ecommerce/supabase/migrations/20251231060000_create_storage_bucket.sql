-- Create the product-images bucket
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true);

-- Enable RLS on the bucket
-- Note: RLS is usually enabled on storage.objects, not individually per bucket,
-- but policies are defined per bucket.

-- Policy: Allow public read access to product images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'product-images' );

-- Policy: Allow authenticated users (admins) to upload images
create policy "Authenticated users can upload images"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'product-images' );

-- Policy: Allow authenticated users (admins) to update their images
create policy "Authenticated users can update images"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'product-images' );

-- Policy: Allow authenticated users (admins) to delete images
create policy "Authenticated users can delete images"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'product-images' );
