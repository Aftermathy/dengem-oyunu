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

let gameCount = 0;

/**
 * Show an interstitial ad every N games.
 * Returns a promise that resolves when the ad is dismissed (or skipped).
 * @param every - Show ad every N games (default: 1 = every game)
 */
export async function showInterstitialAd(every = 1): Promise<void> {
  gameCount++;

  // Don't show ad on the very first game
  if (gameCount <= 1) return;

  // Show ad every N games
  if ((gameCount - 1) % every !== 0) return;

  // TODO: Replace with actual AdMob call in native build
  console.log(`[Ads] Interstitial ad triggered (game #${gameCount})`);
  
  // Simulate ad display time (remove in production)
  // await new Promise(resolve => setTimeout(resolve, 2000));
}

/**
 * Check if the user has purchased the ad-free version.
 * TODO: Integrate with App Store in-app purchase verification.
 */
export function isAdFree(): boolean {
  return localStorage.getItem(STORAGE_KEYS.AD_FREE) === 'true';
}

/**
 * Call this after a successful in-app purchase.
 */
export function setAdFree(): void {
  localStorage.setItem(STORAGE_KEYS.AD_FREE, 'true');
}
