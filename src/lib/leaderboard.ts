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
  avatar_id?: string;
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
 * Submit a score to the leaderboard.
 * Caller must pass the effective userId (from UserProfileContext.userId).
 */
export async function submitScore(data: SubmitScoreData, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('leaderboard_scores').insert({
      user_id: userId,
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
    return true;
  } catch (err) {
    console.error('[Leaderboard] Submit exception:', err);
    return false;
  }
}

/**
 * Fetch top scores, enriched with avatar_id from profiles.
 */
export async function fetchLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
  try {
    const { data: scores, error } = await supabase
      .from('leaderboard_scores')
      .select('*')
      .order('score', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[Leaderboard] Fetch error:', error.message);
      return [];
    }
    if (!scores || scores.length === 0) return [];

    // Batch-fetch avatar_ids from profiles for all user_ids in the result
    const userIds = [...new Set(scores.map(s => s.user_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, avatar_id')
      .in('user_id', userIds);

    const avatarMap: Record<string, string> = {};
    for (const p of profiles || []) {
      avatarMap[p.user_id] = p.avatar_id;
    }

    return scores.map(s => ({
      id: s.id,
      nickname: s.nickname,
      score: s.score,
      elections_won: s.elections_won,
      max_money: s.max_money,
      max_election_pct: s.max_election_pct,
      max_laundered: s.max_laundered,
      death_reason: s.death_reason,
      created_at: s.created_at,
      user_id: s.user_id,
      avatar_id: avatarMap[s.user_id] || 'avatar_1',
    }));
  } catch (err) {
    console.error('[Leaderboard] Fetch exception:', err);
    return [];
  }
}
