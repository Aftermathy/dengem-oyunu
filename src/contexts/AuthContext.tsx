import { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef, type ReactNode } from 'react';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';

interface SignInWithApplePlugin {
  authorize(options: { clientId: string; redirectURI: string; scopes: string; state: string; nonce: string }): Promise<{
    response?: { identityToken?: string };
  }>;
}
const SignInWithApple = registerPlugin<SignInWithApplePlugin>('SignInWithApple');

const APPLE_CLIENT_ID = 'com.denizerdogan.imuststay';

interface AuthContextValue {
  /** The Supabase user. Present as soon as the anonymous session is up. */
  user: { id: string } | null;
  /** True only once the account is a real Apple account, not the anonymous one. */
  isAuthenticated: boolean;
  /** False until a session exists; nothing may touch the database before then. */
  isReady: boolean;
  isLoading: boolean;
  signInWithApple: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * SHA-256 of a string, lowercase hex.
 *
 * Apple copies the nonce it is given straight into the identity token, so the
 * value handed to the native prompt must already be the hash. Supabase is then
 * given the raw value and hashes it itself to compare. Sending the raw nonce to
 * Apple, or the hashed one to Supabase, makes verification fail — which is the
 * kind of mismatch that only shows up on a real device.
 */
async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAppleLinked, setIsAppleLinked] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  /** One session bootstrap per mount, never two. */
  const sessionStartedRef = useRef(false);

  /*
    Every install gets a real session before anything reads or writes the
    database. Without one auth.uid() is NULL, and the row-level policies added in
    20260830000000_identity_and_rls.sql deny everything — which is the point:
    identity is no longer a string the client asserts about itself.

    An anonymous session is persisted by supabase-js in localStorage, so the same
    install keeps the same uid across launches. Signing in with Apple later
    replaces it with the permanent account; the player's progress survives because
    localStorage is the primary copy of the profile and the server row is a sync
    target that simply re-creates itself under the new id.
  */
  useEffect(() => {
    let cancelled = false;

    /*
      Guarded against running twice. The first device run created two anonymous
      users 41 seconds apart in a single launch: two concurrent callers each saw
      no session and each created one, and the second silently orphaned the row
      the first had just written.
    */
    if (sessionStartedRef.current) return;
    sessionStartedRef.current = true;

    async function establishSession() {
      try {
        const { data } = await supabase.auth.getSession();
        let session = data.session;

        if (!session) {
          const { data: anon, error } = await supabase.auth.signInAnonymously();
          if (error) throw error;
          session = anon.session;
        }

        if (cancelled) return;
        setUserId(session?.user.id ?? null);
        setIsAppleLinked(
          (session?.user.identities ?? []).some(i => i.provider === 'apple'),
        );
      } catch (err) {
        // Offline first launch: the game is fully playable without a session,
        // it just does not sync. Leaving isReady true lets the UI proceed.
        console.error('[Auth] Could not establish a session:', err);
      } finally {
        if (!cancelled) setIsReady(true);
      }
    }

    void establishSession();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
      setIsAppleLinked((session?.user.identities ?? []).some(i => i.provider === 'apple'));
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signInWithApple = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    // Apple ile Giriş yalnız iOS'ta var. Android'de eklenti kayıtlı olmadığı
    // için köprü çağrısı "not implemented" ile düşerdi; kullanıcıya anlamsız
    // bir hata göstermek yerine kapıyı burada kapatıyoruz. Android'de oyuncu
    // anonim oturumla devam ediyor ve skor tablosu çalışmaya devam ediyor.
    if (Capacitor.getPlatform() !== 'ios') {
      return { success: false, error: 'Apple Sign In only available on iOS' };
    }
    setIsLoading(true);
    try {
      const rawNonce = crypto.randomUUID();
      const hashedNonce = await sha256Hex(rawNonce);

      const response = await SignInWithApple.authorize({
        clientId: APPLE_CLIENT_ID,
        redirectURI: `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/callback`,
        scopes: 'name email',
        state: crypto.randomUUID(),
        nonce: hashedNonce,
      });

      const identityToken = response.response?.identityToken;
      if (!identityToken) {
        setIsLoading(false);
        return { success: false, error: 'No identity token received' };
      }

      /*
        Supabase verifies the token's signature against Apple's published keys
        and checks aud against the Apple provider configured for this project
        (com.denizerdogan.imuststay). The previous implementation read the `sub`
        claim with atob() and trusted it, which means a hand-written token would
        have been accepted as any user.
      */
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: identityToken,
        nonce: rawNonce,
      });
      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      setUserId(data.user?.id ?? null);
      setIsAppleLinked(true);
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

  /*
    Signing out drops the Apple account and immediately takes a fresh anonymous
    one, so the game is never left without an identity: with no session the
    policies deny every read and write and the profile would silently stop
    syncing rather than visibly sign out.
  */
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    const { data } = await supabase.auth.signInAnonymously();
    setUserId(data.session?.user.id ?? null);
    setIsAppleLinked(false);
  }, []);

  /*
    Guideline 5.1.1(v): an app that lets you create an account must let you
    delete it from inside the app. The RPC removes the profile, the scores and
    the auth user itself, taking the identity from auth.uid() so a caller can
    only ever delete their own.
  */
  const deleteAccount = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.rpc('delete_my_account');
      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }
      await supabase.auth.signOut();
      localStorage.clear();
      const { data } = await supabase.auth.signInAnonymously();
      setUserId(data.session?.user.id ?? null);
      setIsAppleLinked(false);
      setIsLoading(false);
      return { success: true };
    } catch (err) {
      setIsLoading(false);
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  }, []);

  const user = useMemo(() => (userId ? { id: userId } : null), [userId]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: isAppleLinked,
    isReady,
    isLoading,
    signInWithApple,
    signOut,
    deleteAccount,
  }), [user, isAppleLinked, isReady, isLoading, signInWithApple, signOut, deleteAccount]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
