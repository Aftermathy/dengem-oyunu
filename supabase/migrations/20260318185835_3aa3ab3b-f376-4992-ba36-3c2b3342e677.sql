
-- Add total_ap and avatar_id columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_ap integer NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_id text NOT NULL DEFAULT 'avatar_1';

-- Temporarily relax INSERT policies on profiles to allow device-based UUIDs without auth
-- (Will be tightened when Apple Auth is implemented)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Allow public profile inserts"
  ON public.profiles FOR INSERT
  TO public
  WITH CHECK (true);

-- Relax UPDATE policy temporarily
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Allow public profile updates"
  ON public.profiles FOR UPDATE
  TO public
  USING (true);

-- Relax INSERT policy on leaderboard_scores temporarily
DROP POLICY IF EXISTS "Users can insert own scores" ON public.leaderboard_scores;
CREATE POLICY "Allow public score inserts"
  ON public.leaderboard_scores FOR INSERT
  TO public
  WITH CHECK (true);
