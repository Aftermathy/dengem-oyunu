/**
 * Ad integration hook - placeholder for AdMob interstitial ads.
 * 
 * In the native (Capacitor) build, replace the showInterstitial implementation
 * with the actual AdMob plugin call:
 * 
 * import { AdMob, AdOptions } from '@capacitor-community/admob';
 * 
 * const adOptions: AdOptions = {
 *   adId: 'ca-app-pub-XXXXX/YYYYY', // Your AdMob ad unit ID
 * };
 * 
 * async function showInterstitial() {
 *   await AdMob.prepareInterstitial(adOptions);
 *   await AdMob.showInterstitial();
 * }
 */

import { STORAGE_KEYS } from '@/constants/storage';

// ─── Total games played — persistent across sessions ─────────────────────────

function getTotalGamesPlayed(): number {
  return parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_GAMES) ?? '1', 10);
}

export function incrementGamesPlayed(): void {
  const current = getTotalGamesPlayed();
  localStorage.setItem(STORAGE_KEYS.TOTAL_GAMES, String(current + 1));
}

// ─── Ad-free status ───────────────────────────────────────────────────────────

/**
 * Check if the user has purchased the ad-free version.
 * TODO: Integrate with App Store in-app purchase receipt verification.
 */
export function isAdFree(): boolean {
  return localStorage.getItem(STORAGE_KEYS.AD_FREE) === 'true';
}

/** Call this after a successful in-app purchase to persist ad-free state. */
export function setAdFree(): void {
  localStorage.setItem(STORAGE_KEYS.AD_FREE, 'true');
  localStorage.setItem(STORAGE_KEYS.ORTADOGU_PACK, 'true');
}

// ─── Interstitial display ─────────────────────────────────────────────────────

/**
 * Show an interstitial ad (placeholder — replace with AdMob call in native build).
 * @param every - Show ad every N games (default: 1)
 */
export async function showInterstitialAd(every = 1): Promise<void> {
  if (isAdFree()) return;

  const gameCount = getTotalGamesPlayed();

  // Don't show ad on the very first game
  if (gameCount <= 1) return;

  // Show ad every N games
  if ((gameCount - 1) % every !== 0) return;

  // TODO: Replace with actual AdMob call in native build:
  // import { AdMob } from '@capacitor-community/admob';
  // await AdMob.prepareInterstitial({ adId: 'ca-app-pub-XXX/YYY' });
  // await AdMob.showInterstitial();
  console.log(`[Ads] Interstitial ad triggered (game #${gameCount})`);
}
