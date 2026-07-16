-- ============================================================================
-- Fresh-project setup for oqgvhbpqrwsdfbanzuun
-- Reproduces the FINAL schema (all migrations consolidated), with user_id as
-- TEXT so both anonymous device UUIDs AND Apple Sign In IDs work.
-- Run once in the Supabase SQL Editor of the new project.
-- ============================================================================

-- ── profiles ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  nickname TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  avatar_id TEXT NOT NULL DEFAULT 'avatar_1',
  total_ap INTEGER NOT NULL DEFAULT 0,
  unlocked_avatars TEXT[] NOT NULL DEFAULT '{}',
  claimed_achievements TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public profile inserts" ON public.profiles;
CREATE POLICY "Allow public profile inserts" ON public.profiles FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public profile updates" ON public.profiles;
CREATE POLICY "Allow public profile updates" ON public.profiles FOR UPDATE TO public USING (true);

-- ── leaderboard_scores ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.leaderboard_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  nickname TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  elections_won INTEGER NOT NULL DEFAULT 0,
  max_money INTEGER NOT NULL DEFAULT 0,
  max_election_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  max_laundered INTEGER NOT NULL DEFAULT 0,
  death_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.leaderboard_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Scores viewable by everyone" ON public.leaderboard_scores;
CREATE POLICY "Scores viewable by everyone" ON public.leaderboard_scores FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public score inserts" ON public.leaderboard_scores;
CREATE POLICY "Allow public score inserts" ON public.leaderboard_scores FOR INSERT TO public WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_leaderboard_score   ON public.leaderboard_scores (score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_created ON public.leaderboard_scores (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user    ON public.leaderboard_scores (user_id);

-- ── game_events (write-only analytics) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.game_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.game_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert game events" ON public.game_events;
CREATE POLICY "Anyone can insert game events" ON public.game_events
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Only service role can read events" ON public.game_events;
CREATE POLICY "Only service role can read events" ON public.game_events
  FOR SELECT TO authenticated USING (false);

CREATE INDEX IF NOT EXISTS idx_game_events_name    ON public.game_events (event_name);
CREATE INDEX IF NOT EXISTS idx_game_events_created ON public.game_events (created_at);

-- ── updated_at trigger for profiles ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
