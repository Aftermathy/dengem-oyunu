/**
 * Ad layer — interstitial trigger logic with retention-aware scheduling.
 *
 * isAdFree / setAdFree are delegated to purchases.ts (RevenueCat source of truth).
 * All ad-display logic lives here.
 */

import { Capacitor } from '@capacitor/core';
import { AdMob, AdmobConsentStatus } from '@capacitor-community/admob';
import { STORAGE_KEYS } from '@/constants/storage';
import { isAdFree, setAdFree } from '@/lib/purchases';

// Re-export so every existing import of isAdFree/setAdFree from useAds still works
export { isAdFree, setAdFree };

// ─── AdMob configuration ──────────────────────────────────────────────────────
// The App ID (ca-app-pub-5942367057795211~4387951075) lives in Info.plist as
// GADApplicationIdentifier. Only the interstitial ad unit ID is needed here.
const INTERSTITIAL_AD_ID = 'ca-app-pub-5942367057795211/3936524936';

// Non-personalized ads flag — true when the user declines App Tracking Transparency.
let _npa = false;
let _adsReady = false;

/**
 * Initialize AdMob once at app startup. Runs the full compliance flow:
 *   1) iOS App Tracking Transparency (ATT) prompt for IDFA
 *   2) Google UMP consent (GDPR / EU) — shows the consent form when required
 *   3) Serves personalized ads only when the user consented AND allowed tracking;
 *      otherwise falls back to non-personalized. Skips ads entirely if UMP says
 *      they can't be requested.
 * Safe no-op on web/dev. Never throws — a failed init must not break the app.
 */
export async function initAds(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    // 1) iOS App Tracking Transparency (IDFA)
    const before = await AdMob.trackingAuthorizationStatus();
    if (before.status === 'notDetermined') {
      await AdMob.requestTrackingAuthorization();
    }
    const att = await AdMob.trackingAuthorizationStatus();

    // 2) Google UMP consent (GDPR / EU regions)
    let consent = await AdMob.requestConsentInfo();
    if (consent.status === AdmobConsentStatus.REQUIRED && consent.isConsentFormAvailable) {
      consent = await AdMob.showConsentForm();
    }

    // 3) Personalized only when consent is fine (obtained or not required) AND tracking allowed
    const consentOk =
      consent.status === AdmobConsentStatus.OBTAINED ||
      consent.status === AdmobConsentStatus.NOT_REQUIRED;
    _npa = !(consentOk && att.status === 'authorized');

    await AdMob.initialize();
    _adsReady = consent.canRequestAds !== false; // respect UMP: no ads if consent refused
  } catch (e) {
    console.warn('[Ads] init failed:', e);
  }
}

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
  if (!_adsReady) return; // AdMob not initialized — never block gameplay
  try {
    await AdMob.prepareInterstitial({ adId: INTERSTITIAL_AD_ID, npa: _npa });
    await AdMob.showInterstitial();
  } catch (e) {
    console.warn('[Ads] Interstitial failed — skipping:', e);
    // Never throw: a failed ad must never block gameplay
  }
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
