import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from 'react';
import { loadUserProfile, saveUserProfile, type UserProfile } from '@/lib/userProfile';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileRow = Pick<
  Database['public']['Tables']['profiles']['Row'],
  'nickname' | 'avatar_id' | 'total_ap' | 'unlocked_avatars' | 'claimed_achievements'
>;

interface UserProfileContextValue {
  userProfile: UserProfile;
  userId: string;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addAP: (amount: number) => void;
  unlockAvatar: (avatarId: string) => void;
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

async function syncProfileToSupabase(profile: UserProfile, userId: string): Promise<void> {
  try {
    /*
      The id is re-read from the live session instead of trusting the one passed
      in. React state can be a render behind, and a write that goes out with a
      stale or empty id is rejected by the row-level policy — the first launch of
      the identity build logged exactly that: "new row violates row-level
      security policy for table profiles". Asking the client who it is at the
      moment of writing removes the race rather than narrowing it.
    */
    const { data: { session } } = await supabase.auth.getSession();
    const uid = session?.user.id;
    if (!uid || uid !== userId) return;

    const record: ProfileInsert = {
      user_id: uid,
      nickname: profile.nickname || 'Player',
      avatar_id: profile.avatarId,
      total_ap: profile.totalAP,
      unlocked_avatars: profile.unlockedAvatars || [],
      claimed_achievements: profile.claimedAchievements || [],
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(record, { onConflict: 'user_id' });

    if (error) {
      // Column doesn't exist yet — retry without claimed_achievements
      if (error.message.includes('claimed_achievements')) {
        const { claimed_achievements: _dropped, ...recordWithout } = record;
        const { error: error2 } = await supabase
          .from('profiles')
          .upsert(recordWithout, { onConflict: 'user_id' });
        if (error2) console.error('[Profile] Sync error (fallback):', error2.message);
        return;
      }
      console.error('[Profile] Sync error:', error.message);
    }
  } catch (err) {
    console.error('[Profile] Sync exception:', err);
  }
}

async function fetchProfileFromSupabase(userId: string): Promise<Partial<UserProfile> | null> {
  try {
    // Try full fetch including claimed_achievements (requires migration)
    const { data, error } = await supabase
      .from('profiles')
      .select('nickname, avatar_id, total_ap, unlocked_avatars, claimed_achievements')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      // Column doesn't exist yet (migration pending) — retry without it
      if (error.message.includes('claimed_achievements')) {
        const { data: data2, error: error2 } = await supabase
          .from('profiles')
          .select('nickname, avatar_id, total_ap, unlocked_avatars')
          .eq('user_id', userId)
          .maybeSingle();
        if (error2) { console.error('[Profile] Fetch error:', error2.message); return null; }
        if (!data2) return null;
        return {
          nickname: data2.nickname || '',
          avatarId: data2.avatar_id || 'avatar_1',
          totalAP: data2.total_ap ?? 0,
          unlockedAvatars: data2.unlocked_avatars ?? [],
        };
      }
      console.error('[Profile] Fetch error:', error.message);
      return null;
    }
    if (!data) return null;

    const row = data as ProfileRow;
    return {
      nickname: row.nickname || '',
      avatarId: row.avatar_id || 'avatar_1',
      totalAP: row.total_ap ?? 0,
      unlockedAvatars: row.unlocked_avatars ?? [],
      claimedAchievements: row.claimed_achievements ?? [],
    };
  } catch (err) {
    console.error('[Profile] Fetch exception:', err);
    return null;
  }
}

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isReady } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(loadUserProfile);

  /*
    Empty string until the session is up. Identity used to be a device UUID the
    client made up for itself; it is now auth.uid(), which the server issued and
    can check. Every write is guarded on it being non-empty, because a write
    with no session is denied by the policies anyway and would only log noise.
  */
  const effectiveUserId = user?.id ?? '';

  useEffect(() => {
    let cancelled = false;
    if (!isReady || !effectiveUserId) return;
    async function initialSync() {
      // What the profile looked like when the request went out; anything that
      // differs when it comes back was changed by the player in the meantime.
      const base = loadUserProfile();
      const remote = await fetchProfileFromSupabase(effectiveUserId);
      if (cancelled || !remote) return;
      setProfile(prev => {
        // Merge arrays (union of local + remote)
        const localAvatars = prev.unlockedAvatars || [];
        const remoteAvatars = remote.unlockedAvatars || [];
        const mergedAvatars = [...new Set([...localAvatars, ...remoteAvatars])];

        // Merge claimed achievements (union of local + remote)
        const localClaimed = prev.claimedAchievements || [];
        const remoteClaimed = remote.claimedAchievements || [];
        const mergedClaimed = [...new Set([...localClaimed, ...remoteClaimed])];

        /*
          Local wins for the two fields the player edits by hand. The remote
          copy used to win unconditionally, so someone who opened the app on a
          weak connection and immediately changed their avatar watched the old
          one snap back when the request landed — and the next sync then wrote
          the rolled-back value out again. Totals and arrays still merge, so no
          progress is lost either way.
        */
        const editedLocally = prev.nickname !== base.nickname || prev.avatarId !== base.avatarId;

        const merged: UserProfile = {
          ...prev,
          nickname: editedLocally ? prev.nickname : (remote.nickname || prev.nickname),
          avatarId: editedLocally ? prev.avatarId : (remote.avatarId || prev.avatarId),
          totalAP: Math.max(prev.totalAP, remote.totalAP ?? 0),
          isAppleLinked: isAuthenticated,
          unlockedAvatars: mergedAvatars,
          claimedAchievements: mergedClaimed,
        };
        saveUserProfile(merged);
        return merged;
      });
    }
    void initialSync();
    return () => { cancelled = true; };
  }, [effectiveUserId, isReady, isAuthenticated]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      saveUserProfile(next);
      if (effectiveUserId) syncProfileToSupabase(next, effectiveUserId);
      return next;
    });
  }, [effectiveUserId]);

  const addAP = useCallback((amount: number) => {
    if (amount <= 0) return;
    setProfile(prev => {
      const next = { ...prev, totalAP: prev.totalAP + amount };
      saveUserProfile(next);
      if (effectiveUserId) syncProfileToSupabase(next, effectiveUserId);
      return next;
    });
  }, [effectiveUserId]);

  const unlockAvatar = useCallback((avatarId: string) => {
    setProfile(prev => {
      if (prev.unlockedAvatars?.includes(avatarId)) return prev;
      const next = { ...prev, unlockedAvatars: [...(prev.unlockedAvatars || []), avatarId] };
      saveUserProfile(next);
      if (effectiveUserId) syncProfileToSupabase(next, effectiveUserId);
      return next;
    });
  }, [effectiveUserId]);

  const value = useMemo(() => ({ userProfile: profile, userId: effectiveUserId, updateProfile, addAP, unlockAvatar }), [profile, effectiveUserId, updateProfile, addAP, unlockAvatar]);

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error('useUserProfile must be used within UserProfileProvider');
  return ctx;
}
