ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS claimed_achievements text[] NOT NULL DEFAULT '{}';
