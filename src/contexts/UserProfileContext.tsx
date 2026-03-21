import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from 'react';
import { loadUserProfile, saveUserProfile, type UserProfile } from '@/lib/userProfile';
import { supabase } from '@/integrations/supabase/client';
import { getDeviceId } from '@/lib/deviceId';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfileContextValue {
  userProfile: UserProfile;
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
    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: userId,
        nickname: profile.nickname || 'Player',
        avatar_url: profile.avatarId,
        total_ap: profile.totalAP,
        avatar_id: profile.avatarId,
        unlocked_avatars: profile.unlockedAvatars || [],
      } as any, { onConflict: 'user_id' });

    if (error) {
      console.error('[Profile] Sync error:', error.message);
    } else {
      console.log('[Profile] Synced to cloud:', profile.nickname, 'AP:', profile.totalAP, 'avatars:', profile.unlockedAvatars?.length ?? 0);
    }
  } catch (err) {
    console.error('[Profile] Sync exception:', err);
  }
}

async function fetchProfileFromSupabase(userId: string): Promise<Partial<UserProfile> | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('nickname, avatar_url, total_ap, avatar_id, unlocked_avatars')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('[Profile] Fetch error:', error.message);
      return null;
    }
    if (!data) return null;

    return {
      nickname: data.nickname || '',
      avatarId: (data as any).avatar_id || data.avatar_url || 'avatar_1',
      totalAP: (data as any).total_ap ?? 0,
      unlockedAvatars: (data as any).unlocked_avatars ?? [],
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
    async function initialSync() {
      const remote = await fetchProfileFromSupabase(effectiveUserId);
      if (cancelled || !remote) return;
      setProfile(prev => {
        // Merge unlocked avatars (union of local + remote)
        const localAvatars = prev.unlockedAvatars || [];
        const remoteAvatars = remote.unlockedAvatars || [];
        const mergedAvatars = [...new Set([...localAvatars, ...remoteAvatars])];

        const merged: UserProfile = {
          ...prev,
          nickname: remote.nickname || prev.nickname,
          avatarId: remote.avatarId || prev.avatarId,
          totalAP: Math.max(prev.totalAP, remote.totalAP ?? 0),
          isAppleLinked: !!user,
          unlockedAvatars: mergedAvatars,
        };
        saveUserProfile(merged);
        return merged;
      });
    }
    initialSync();
    return () => { cancelled = true; };
  }, [effectiveUserId, user]);

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
      console.log('[Profile] Avatar unlocked:', avatarId);
      return next;
    });
  }, [effectiveUserId]);

  const value = useMemo(() => ({ userProfile: profile, updateProfile, addAP, unlockAvatar }), [profile, updateProfile, addAP, unlockAvatar]);

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error('useUserProfile must be used within UserProfileProvider');
  return ctx;
}
