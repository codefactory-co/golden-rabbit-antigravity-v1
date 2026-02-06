-- Change reviews table id column from uuid to text to support custom string IDs like 'r001'
ALTER TABLE reviews ALTER COLUMN id TYPE text;
