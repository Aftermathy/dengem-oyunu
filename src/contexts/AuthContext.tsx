import { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef, type ReactNode } from 'react';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { getDeviceId } from '@/lib/deviceId';
import { supabase } from '@/integrations/supabase/client';

interface SignInWithApplePlugin {
  authorize(options: { clientId: string; redirectURI: string; scopes: string; state: string; nonce: string }): Promise<{
    response?: { identityToken?: string };
  }>;
}
const SignInWithApple = registerPlugin<SignInWithApplePlugin>('SignInWithApple');

const APPLE_USER_KEY = 'ims_apple_user_id';

interface AuthContextValue {
  user: { id: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithApple: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function migrateDeviceToApple(appleUserId: string): Promise<void> {
  const deviceId = getDeviceId();
  if (deviceId === appleUserId) return;
  try {
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', appleUserId)
      .maybeSingle();

    if (!existing) {
      await supabase
        .from('profiles')
        .update({ user_id: appleUserId })
        .eq('user_id', deviceId);
    }

    await supabase
      .from('leaderboard_scores')
      .update({ user_id: appleUserId })
      .eq('user_id', deviceId);
  } catch (err) {
    console.error('[Auth] Migration error:', err);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [appleUserId, setAppleUserId] = useState<string | null>(() =>
    localStorage.getItem(APPLE_USER_KEY)
  );
  const [isLoading, setIsLoading] = useState(false);
  const hasMigratedRef = useRef(false);

  useEffect(() => {
    if (appleUserId && !hasMigratedRef.current) {
      hasMigratedRef.current = true;
      migrateDeviceToApple(appleUserId);
    }
  }, [appleUserId]);

  const signInWithApple = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!Capacitor.isNativePlatform()) {
      return { success: false, error: 'Apple Sign In only available on iOS' };
    }
    setIsLoading(true);
    try {
      const response = await SignInWithApple.authorize({
        clientId: 'com.denizerdogan.imuststay',
        redirectURI: 'https://oqgvhbpqrwsdfbanzuun.supabase.co/auth/v1/callback',
        scopes: 'name email',
        state: crypto.randomUUID(),
        nonce: crypto.randomUUID(),
      });

      const identityToken = response.response?.identityToken;
      if (!identityToken) {
        setIsLoading(false);
        return { success: false, error: 'No identity token received' };
      }

      const payload = JSON.parse(atob(identityToken.split('.')[1]));
      const sub: string = payload.sub;
      if (!sub) {
        setIsLoading(false);
        return { success: false, error: 'No user ID in token' };
      }

      localStorage.setItem(APPLE_USER_KEY, sub);
      setAppleUserId(sub);
      await migrateDeviceToApple(sub);
      setIsLoading(false);
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes('cancel') || msg.toLowerCase().includes('dismiss')) {
        setIsLoading(false);
        return { success: false, error: 'cancelled' };
      }
      console.error('[Auth] Apple Sign In error:', msg);
      setIsLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const signOut = useCallback(async () => {
    localStorage.removeItem(APPLE_USER_KEY);
    setAppleUserId(null);
  }, []);

  const user = useMemo(() => (appleUserId ? { id: appleUserId } : null), [appleUserId]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: !!appleUserId,
    isLoading,
    signInWithApple,
    signOut,
  }), [user, appleUserId, isLoading, signInWithApple, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
