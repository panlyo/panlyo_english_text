/*
# Create saved_texts table (single-tenant, no auth)

## Purpose
Stores text documents that users create and save in the English Text Studio app.
Since this app has no sign-in/login screen, all data is intentionally public/shared.

## New Tables
- `saved_texts`
  - `id` (uuid, primary key)
  - `title` (text, not null) — user-given name for the document
  - `content` (text, not null) — the full text body
  - `created_at` (timestamptz, default now)
  - `updated_at` (timestamptz, default now)

## Security
- Enable RLS on `saved_texts`.
- Grant CRUD to `anon` + `authenticated` so the anon-key frontend can reach the table.
- Allow anon + authenticated full CRUD because the data is intentionally shared/public (no-auth app).
*/

CREATE TABLE IF NOT EXISTS saved_texts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE saved_texts ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON saved_texts TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_saved_texts" ON saved_texts;
CREATE POLICY "anon_select_saved_texts" ON saved_texts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_saved_texts" ON saved_texts;
CREATE POLICY "anon_insert_saved_texts" ON saved_texts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_saved_texts" ON saved_texts;
CREATE POLICY "anon_update_saved_texts" ON saved_texts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_saved_texts" ON saved_texts;
CREATE POLICY "anon_delete_saved_texts" ON saved_texts FOR DELETE
  TO anon, authenticated USING (true);
