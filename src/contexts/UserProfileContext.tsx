import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from 'react';
import { loadUserProfile, saveUserProfile, type UserProfile } from '@/lib/userProfile';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { getDeviceId } from '@/lib/deviceId';
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

function getEffectiveUserId(authUserId: string | undefined): string {
  return authUserId || getDeviceId();
}

async function syncProfileToSupabase(profile: UserProfile, userId: string): Promise<void> {
  try {
    const record: ProfileInsert = {
      user_id: userId,
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
      console.error('[Profile] Sync error:', error.message);
    }
  } catch (err) {
    console.error('[Profile] Sync exception:', err);
  }
}

async function fetchProfileFromSupabase(userId: string): Promise<Partial<UserProfile> | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('nickname, avatar_id, total_ap, unlocked_avatars, claimed_achievements')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
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
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(loadUserProfile);

  const effectiveUserId = getEffectiveUserId(user?.id);

  useEffect(() => {
    let cancelled = false;
    const isAuthenticated = effectiveUserId !== getDeviceId();
    async function initialSync() {
      const remote = await fetchProfileFromSupabase(effectiveUserId);
      if (cancelled || !remote) return;
      setProfile(prev => {
        // Merge arrays (union of local + remote)
        const localAvatars = prev.unlockedAvatars || [];
        const remoteAvatars = remote.unlockedAvatars || [];
        const mergedAvatars = [...new Set([...localAvatars, ...remoteAvatars])];

        const localClaims = prev.claimedAchievements || [];
        const remoteClaims = remote.claimedAchievements || [];
        const mergedClaims = [...new Set([...localClaims, ...remoteClaims])];

        const merged: UserProfile = {
          ...prev,
          nickname: remote.nickname || prev.nickname,
          avatarId: remote.avatarId || prev.avatarId,
          totalAP: Math.max(prev.totalAP, remote.totalAP ?? 0),
          isAppleLinked: isAuthenticated,
          unlockedAvatars: mergedAvatars,
          claimedAchievements: mergedClaims,
        };
        saveUserProfile(merged);
        return merged;
      });
    }
    initialSync();
    return () => { cancelled = true; };
  }, [effectiveUserId]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      saveUserProfile(next);
      syncProfileToSupabase(next, effectiveUserId);
      return next;
    });
  }, [effectiveUserId]);

  const addAP = useCallback((amount: number) => {
    if (amount <= 0) return;
    setProfile(prev => {
      const next = { ...prev, totalAP: prev.totalAP + amount };
      saveUserProfile(next);
      syncProfileToSupabase(next, effectiveUserId);
      return next;
    });
  }, [effectiveUserId]);

  const unlockAvatar = useCallback((avatarId: string) => {
    setProfile(prev => {
      if (prev.unlockedAvatars?.includes(avatarId)) return prev;
      const next = { ...prev, unlockedAvatars: [...(prev.unlockedAvatars || []), avatarId] };
      saveUserProfile(next);
      syncProfileToSupabase(next, effectiveUserId);
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
