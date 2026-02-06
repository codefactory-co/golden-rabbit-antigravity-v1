-- Drop old policies to avoid conflicts
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
DROP POLICY IF EXISTS "Reviews are insertable by everyone" ON reviews;
DROP POLICY IF EXISTS "Reviews are updatable by everyone" ON reviews;

-- Create a single "All access" policy for public (needed for UPSERT)
CREATE POLICY "Public full access on reviews" ON reviews
  FOR ALL USING (true) WITH CHECK (true);
