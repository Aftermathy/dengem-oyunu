import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import type { User, Session } from '@supabase/supabase-js';
import { getDeviceId } from '@/lib/deviceId';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithApple: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Migrate device-UUID rows to the real auth user_id.
 * Runs once after first Apple sign-in.
 */
async function migrateDeviceToAuth(authUserId: string): Promise<void> {
  const deviceId = getDeviceId();
  if (deviceId === authUserId) return; // already correct

  try {
    // Migrate profiles row
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', authUserId)
      .maybeSingle();

    if (!existing) {
      // No profile for auth user yet — update the device row
      await supabase
        .from('profiles')
        .update({ user_id: authUserId })
        .eq('user_id', deviceId);
    }

    // Migrate leaderboard rows
    await supabase
      .from('leaderboard_scores')
      .update({ user_id: authUserId })
      .eq('user_id', deviceId);
  } catch (err) {
    console.error('[Auth] Migration error:', err);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Track previous auth user id to detect first-ever sign-in transition (anonymous → authenticated)
  const prevUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Listen for auth state changes FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      // Migrate device data only on the first SIGNED_IN from an anonymous state (no setTimeout)
      if (event === 'SIGNED_IN' && newSession?.user && !prevUserIdRef.current) {
        migrateDeviceToAuth(newSession.user.id);
      }
      prevUserIdRef.current = newSession?.user?.id ?? null;
    });

    // Then check existing session — initialise prevUserIdRef so migration doesn't re-run on refresh
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      prevUserIdRef.current = existingSession?.user?.id ?? null;
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithApple = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await lovable.auth.signInWithOAuth('apple', {
        redirect_uri: window.location.origin,
      });

      if (result.error) {
        const msg = result.error instanceof Error ? result.error.message : String(result.error);
        console.error('[Auth] Apple Sign In error:', msg);
        return { success: false, error: msg };
      }

      // If redirected, the page will reload with session
      if ((result as any).redirected) {
        return { success: true };
      }

      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.error('[Auth] Apple Sign In exception:', msg);
      return { success: false, error: msg };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (err) {
      console.error('[Auth] Sign out error:', err);
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    signInWithApple,
    signOut,
  }), [user, session, isLoading, signInWithApple, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
