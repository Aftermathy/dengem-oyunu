import { useState } from 'react';

/**
 * Placeholder hook for Apple Sign In.
 * Currently simulates linking — will be replaced with real auth later.
 */
export function useAppleSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLinked, setIsLinked] = useState(() => {
    try {
      return localStorage.getItem('ims_apple_linked') === 'true';
    } catch {
      return false;
    }
  });

  const signIn = async () => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 1200));
    setIsLinked(true);
    try {
      localStorage.setItem('ims_apple_linked', 'true');
    } catch {}
    setIsLoading(false);
    return { linked: true };
  };

  return { signIn, isLoading, isLinked };
}
