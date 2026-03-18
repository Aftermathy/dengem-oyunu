
-- Add unique constraint on profiles.user_id for upsert support
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);
