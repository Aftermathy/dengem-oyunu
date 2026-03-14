import { supabase } from '@/integrations/supabase/client';

export interface LeaderboardEntry {
  id: string;
  nickname: string;
  score: number;
  elections_won: number;
  max_money: number;
  max_election_pct: number;
  max_laundered: number;
  death_reason: string | null;
  created_at: string;
  user_id: string;
}

export interface SubmitScoreData {
  score: number;
  elections_won: number;
  max_money: number;
  max_election_pct: number;
  max_laundered: number;
  death_reason?: string;
}

export async function submitScore(data: SubmitScoreData): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabase
    .from('profiles')
    .select('nickname')
    .eq('user_id', user.id)
    .single();

  const { error } = await supabase.from('leaderboard_scores').insert({
    user_id: user.id,
    nickname: profile?.nickname || 'Player',
    score: data.score,
    elections_won: data.elections_won,
    max_money: data.max_money,
    max_election_pct: data.max_election_pct,
    max_laundered: data.max_laundered,
    death_reason: data.death_reason || null,
  });

  return !error;
}

export async function fetchAllTimeLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
  const { data } = await supabase
    .from('leaderboard_scores')
    .select('*')
    .order('score', { ascending: false })
    .limit(limit);
  return (data as LeaderboardEntry[]) || [];
}

export async function fetchWeeklyLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const { data } = await supabase
    .from('leaderboard_scores')
    .select('*')
    .gte('created_at', oneWeekAgo.toISOString())
    .order('score', { ascending: false })
    .limit(limit);
  return (data as LeaderboardEntry[]) || [];
}
