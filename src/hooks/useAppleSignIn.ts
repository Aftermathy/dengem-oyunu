import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook for Apple Sign In — wraps AuthContext's signInWithApple.
 * Provides backward-compatible API for LeaderboardScreen and other consumers.
 */
export function useAppleSignIn() {
  const { isAuthenticated, signInWithApple, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithApple();
      if (!result.success) {
        setError(result.error || 'Sign in failed');
        setIsLoading(false);
        return null;
      }
      setIsLoading(false);
      return { linked: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      setIsLoading(false);
      return null;
    }
  }, [signInWithApple]);

  return {
    signIn,
    isLoading: isLoading || authLoading,
    isLinked: isAuthenticated,
    error,
  };
}
