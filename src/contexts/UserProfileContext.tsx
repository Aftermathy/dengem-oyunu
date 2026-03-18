import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import { loadUserProfile, saveUserProfile, type UserProfile } from '@/lib/userProfile';

interface UserProfileContextValue {
  userProfile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addAP: (amount: number) => void;
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(loadUserProfile);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      saveUserProfile(next);
      return next;
    });
  }, []);

  const addAP = useCallback((amount: number) => {
    if (amount <= 0) return;
    setProfile(prev => {
      const next = { ...prev, totalAP: prev.totalAP + amount };
      saveUserProfile(next);
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
