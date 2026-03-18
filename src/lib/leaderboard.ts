import { supabase } from '@/integrations/supabase/client';
import { getDeviceId } from '@/lib/deviceId';

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
  nickname: string;
  score: number;
  elections_won?: number;
  max_money?: number;
  max_election_pct?: number;
  max_laundered?: number;
  death_reason?: string;
}

/**
 * Submit or update a score in the leaderboard.
 * Uses device UUID as user_id (will migrate to auth.uid() when Apple Auth is added).
 */
export async function submitScore(data: SubmitScoreData): Promise<boolean> {
  const deviceId = getDeviceId();

  try {
    const { error } = await supabase.from('leaderboard_scores').insert({
      user_id: deviceId,
      nickname: data.nickname || 'Player',
      score: data.score,
      elections_won: data.elections_won ?? 0,
      max_money: data.max_money ?? 0,
      max_election_pct: data.max_election_pct ?? 0,
      max_laundered: data.max_laundered ?? 0,
      death_reason: data.death_reason || null,
    });

    if (error) {
      console.error('[Leaderboard] Submit error:', error.message);
      return false;
    }
    console.log('[Leaderboard] Score submitted:', data.score);
    return true;
  } catch (err) {
    console.error('[Leaderboard] Submit exception:', err);
    return false;
  }
}

/**
 * Fetch top scores from all time.
 */
export async function fetchLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
  try {
    const { data, error } = await supabase
      .from('leaderboard_scores')
      .select('*')
      .order('score', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[Leaderboard] Fetch error:', error.message);
      return [];
    }
    return (data as LeaderboardEntry[]) || [];
  } catch (err) {
    console.error('[Leaderboard] Fetch exception:', err);
    return [];
  }
}
