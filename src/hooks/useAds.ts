/**
 * Ad layer — interstitial trigger logic with retention-aware scheduling.
 *
 * isAdFree / setAdFree are delegated to purchases.ts (RevenueCat source of truth).
 * All ad-display logic lives here.
 */

import { Capacitor } from '@capacitor/core';
import { STORAGE_KEYS } from '@/constants/storage';
import { isAdFree, setAdFree } from '@/lib/purchases';

// Re-export so every existing import of isAdFree/setAdFree from useAds still works
export { isAdFree, setAdFree };

// ─── Persistent game counter ──────────────────────────────────────────────────

function getTotalGamesPlayed(): number {
  return parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_GAMES) ?? '1', 10);
}

export function incrementGamesPlayed(): void {
  const current = getTotalGamesPlayed();
  localStorage.setItem(STORAGE_KEYS.TOTAL_GAMES, String(current + 1));
}

// ─── Interstitial display ─────────────────────────────────────────────────────

async function showInterstitialNow(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    console.log('[Ads] Interstitial (dev/web — simulated)');
    return;
  }
  // TODO: Replace with AdMob call once @capacitor-community/admob is installed:
  // import { AdMob } from '@capacitor-community/admob';
  // const adId = 'ca-app-pub-YOUR_ID/YOUR_UNIT';
  // try {
  //   await AdMob.prepareInterstitial({ adId });
  //   await AdMob.showInterstitial();
  // } catch (e) {
  //   console.warn('[Ads] Interstitial failed — skipping:', e);
  //   // Never throw: a failed ad must never block gameplay
  // }
  console.log('[Ads] Interstitial triggered (native placeholder)');
}

// ─── Retention-aware ad trigger ───────────────────────────────────────────────

export type AdEventType = 'gameOver' | 'electionWin';

/**
 * Call this at every ad opportunity. Applies the retention schedule:
 *
 * ┌─────────────────────────┬──────────┬─────────────┐
 * │ totalGamesPlayed        │ gameOver │ electionWin │
 * ├─────────────────────────┼──────────┼─────────────┤
 * │ 1  (first game ever)    │    ✗     │      ✗      │
 * │ 2  (second game)        │    ✓     │      ✗      │
 * │ 3+ (all subsequent)     │    ✓     │      ✓      │
 * └─────────────────────────┴──────────┴─────────────┘
 */
export async function handleAdTrigger(eventType: AdEventType): Promise<void> {
  if (isAdFree()) return;

  const games = getTotalGamesPlayed();

  // Rule 1: first game — never show
  if (games === 1) return;

  // Rule 2: second game — only on death, not on election win
  if (games === 2 && eventType === 'electionWin') return;

  // Rule 3: third game onward — show on both events
  await showInterstitialNow();
}

/**
 * Legacy helper kept for backward compatibility.
 * New code should use handleAdTrigger() instead.
 * @deprecated
 */
export async function showInterstitialAd(every = 1): Promise<void> {
  if (isAdFree()) return;
  const gameCount = getTotalGamesPlayed();
  if (gameCount <= 1) return;
  if ((gameCount - 1) % every !== 0) return;
  await showInterstitialNow();
}
