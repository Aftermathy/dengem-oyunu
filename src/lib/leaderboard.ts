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
  avatar_id?: string;
  /** True for the caller's own row. Computed by the view, so no identity travels. */
  is_me: boolean;
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
 * Fetch the public board.
 *
 * Reads `public_leaderboard`, not the table. The table's SELECT policy now only
 * returns the caller's own rows, because `user_id` is the sole identity in this
 * system and the old "viewable by everyone" policy handed every one of them to
 * anyone holding the shipped anon key. The view exposes what a board needs to
 * show — nickname, score, avatar — and no identity at all.
 *
 * It also deduplicates: a row is inserted at the end of every run and the score
 * is cumulative, so one active player used to occupy the entire top 50. The view
 * keeps each player's best.
 */
export async function fetchLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
  try {
    const { data, error } = await supabase
      .from('public_leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[Leaderboard] Fetch error:', error.message);
      return [];
    }
    if (!data) return [];

    return data.map(s => ({
      id: s.id ?? '',
      nickname: s.nickname ?? 'Player',
      score: s.score ?? 0,
      elections_won: s.elections_won ?? 0,
      max_money: s.max_money ?? 0,
      max_election_pct: s.max_election_pct ?? 0,
      max_laundered: s.max_laundered ?? 0,
      death_reason: s.death_reason,
      created_at: s.created_at ?? '',
      avatar_id: s.avatar_id ?? 'avatar_1',
      is_me: s.is_me ?? false,
    }));
  } catch (err) {
    console.error('[Leaderboard] Fetch exception:', err);
    return [];
  }
}

/** Outcome of a moderation action; the UI needs to tell these apart. */
export type ModerationResult = 'ok' | 'error';

/**
 * Report a leaderboard entry.
 *
 * Takes the row id, never a player id: the public view deliberately does not
 * expose user_id, and the RPC resolves the row to a player server-side. Three
 * distinct reporters hide the entry from everyone; the report itself stays for
 * a human to read afterwards.
 */
export async function reportEntry(entryId: string, reason?: string): Promise<ModerationResult> {
  try {
    const { error } = await supabase.rpc('report_leaderboard_entry', {
      p_entry_id: entryId,
      p_reason: reason ?? null,
    });
    if (error) { console.error('[Leaderboard] Report failed:', error.message); return 'error'; }
    return 'ok';
  } catch (err) {
    console.error('[Leaderboard] Report exception:', err);
    return 'error';
  }
}

/** Hide a player from this viewer's board, permanently and for them alone. */
export async function blockEntry(entryId: string): Promise<ModerationResult> {
  try {
    const { error } = await supabase.rpc('block_leaderboard_entry', { p_entry_id: entryId });
    if (error) { console.error('[Leaderboard] Block failed:', error.message); return 'error'; }
    return 'ok';
  } catch (err) {
    console.error('[Leaderboard] Block exception:', err);
    return 'error';
  }
}
