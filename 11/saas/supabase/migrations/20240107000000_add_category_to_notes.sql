-- Migration number: 20240107000000_add_category_to_notes.sql

ALTER TABLE public.notes ADD COLUMN category TEXT;
