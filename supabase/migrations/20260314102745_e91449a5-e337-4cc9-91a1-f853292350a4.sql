
CREATE TABLE public.game_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Allow anonymous inserts (no auth required for analytics)
ALTER TABLE public.game_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert game events"
  ON public.game_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- No select/update/delete for public - analytics data is write-only from client
CREATE POLICY "Only service role can read events"
  ON public.game_events
  FOR SELECT
  TO authenticated
  USING (false);

-- Index for querying
CREATE INDEX idx_game_events_name ON public.game_events (event_name);
CREATE INDEX idx_game_events_created ON public.game_events (created_at);
