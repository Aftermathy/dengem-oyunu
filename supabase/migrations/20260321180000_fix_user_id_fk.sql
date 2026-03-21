-- Drop FK constraints so device UUIDs (anonymous users) can also use profiles and leaderboard
-- auth.users FK only works for Apple Sign In users; device UUIDs are not in auth.users

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;
ALTER TABLE public.profiles ALTER COLUMN user_id TYPE TEXT;

ALTER TABLE public.leaderboard_scores DROP CONSTRAINT IF EXISTS leaderboard_scores_user_id_fkey;
ALTER TABLE public.leaderboard_scores ALTER COLUMN user_id TYPE TEXT;
