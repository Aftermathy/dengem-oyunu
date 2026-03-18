import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from 'react';
import { loadUserProfile, saveUserProfile, type UserProfile } from '@/lib/userProfile';
import { supabase } from '@/integrations/supabase/client';
import { getDeviceId } from '@/lib/deviceId';

interface UserProfileContextValue {
  userProfile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addAP: (amount: number) => void;
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

/** Sync local profile to Supabase profiles table */
async function syncProfileToSupabase(profile: UserProfile): Promise<void> {
  const deviceId = getDeviceId();
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: deviceId,
        nickname: profile.nickname || 'Player',
        avatar_url: profile.avatarId,
        total_ap: profile.totalAP,
        avatar_id: profile.avatarId,
      } as any, { onConflict: 'user_id' });

    if (error) {
      console.error('[Profile] Sync error:', error.message);
    } else {
      console.log('[Profile] Synced to cloud:', profile.nickname, 'AP:', profile.totalAP);
    }
  } catch (err) {
    console.error('[Profile] Sync exception:', err);
  }
}

/** Fetch profile from Supabase and merge with local */
async function fetchProfileFromSupabase(): Promise<Partial<UserProfile> | null> {
  const deviceId = getDeviceId();
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('nickname, avatar_url, total_ap, avatar_id')
      .eq('user_id', deviceId)
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
    };
  } catch (err) {
    console.error('[Profile] Fetch exception:', err);
    return null;
  }
}

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(loadUserProfile);

  // On mount: fetch from Supabase and merge (take higher AP)
  useEffect(() => {
    let cancelled = false;
    async function initialSync() {
      const remote = await fetchProfileFromSupabase();
      if (cancelled || !remote) return;
      setProfile(prev => {
        const merged: UserProfile = {
          ...prev,
          nickname: remote.nickname || prev.nickname,
          avatarId: remote.avatarId || prev.avatarId,
          totalAP: Math.max(prev.totalAP, remote.totalAP ?? 0),
        };
        saveUserProfile(merged);
        return merged;
      });
    }
    initialSync();
    return () => { cancelled = true; };
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      saveUserProfile(next);
      syncProfileToSupabase(next);
      return next;
    });
  }, []);

  const addAP = useCallback((amount: number) => {
    if (amount <= 0) return;
    setProfile(prev => {
      const next = { ...prev, totalAP: prev.totalAP + amount };
      saveUserProfile(next);
      syncProfileToSupabase(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ userProfile: profile, updateProfile, addAP }), [profile, updateProfile, addAP]);

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error('useUserProfile must be used within UserProfileProvider');
  return ctx;
}
