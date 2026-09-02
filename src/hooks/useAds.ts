/**
 * Ad layer — interstitial trigger logic with retention-aware scheduling.
 *
 * isAdFree / setAdFree are delegated to purchases.ts (RevenueCat source of truth).
 * All ad-display logic lives here.
 */

import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
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
let _initHatasi: Record<string, unknown> | null = null;

/**
 * Köprüden gelen hatayı alanlarıyla okur.
 *
 * `console.warn('...', e)` her düşen çağrı için ekrana boş bir `{}` basıyordu:
 * köprü, `message` ve `code` alanları numaralandırılamayan bir Error ile
 * reddediyor ve nesneyi serileştirmek hepsini atıyor. Alanları adıyla okumak,
 * arızanın kendi adını söylemesini sağlayan şey.
 *
 * Aynı yardımcı `lib/purchases.ts` içinde de var ve aynı dersten doğdu.
 */
function describeError(e: unknown): Record<string, unknown> {
  if (e == null || typeof e !== 'object') return { error: String(e) };
  const o = e as Record<string, unknown>;
  return {
    code: o.code,
    message: o.message,
    raw: Object.getOwnPropertyNames(e).join(','),
  };
}

/**
 * iOS only shows the App Tracking Transparency prompt when the app's
 * UIApplication state is `.active`. initAds() runs at launch — while the app
 * is still `.inactive` behind the splash screen — so a bare
 * requestTrackingAuthorization() gets silently dropped and Apple's reviewers
 * "cannot locate the ATT permission request." Wait for the active state before
 * asking, so the prompt reliably appears on a fresh install.
 */
async function waitForActive(): Promise<void> {
  const { isActive } = await CapApp.getState();
  if (isActive) return;
  await new Promise<void>((resolve) => {
    let settled = false;
    const finish = (handle?: { remove: () => void }) => {
      if (settled) return;
      settled = true;
      handle?.remove();
      resolve();
    };
    CapApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive) finish(handleRef);
    }).then((handle) => {
      handleRef = handle;
      // Re-check in case it went active between getState() and the listener attaching.
      CapApp.getState().then(({ isActive }) => {
        if (isActive) finish(handle);
      });
    });
    let handleRef: { remove: () => void } | undefined;
    // Safety net: never block init forever if the event never fires.
    setTimeout(() => finish(handleRef), 5000);
  });
}

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
    // 1) AdMob önce ilklenir. SIRA ÖNEMLİ VE BEDELİ ÖDENDİ.
    //
    //    Eklentinin kendi README'si sırayı yazıyor: initialize → requestConsentInfo
    //    → showConsentForm. Bu dosya tersini yapıyordu — `requestConsentInfo()`
    //    ilklemeden önce çağrılıyordu.
    //
    //    Sonuç sessiz bir ölümdü: o çağrı düştüğünde aşağıdaki `catch` hatayı
    //    yutuyor, `_adsReady` başlangıç değeri olan `false`'ta kalıyor ve
    //    `showInterstitialNow()` her seferinde ilk satırda dönüyordu. Yayınlanan
    //    uygulamada dört beş oyun boyunca tek bir reklam gösterilmedi ve tek iz
    //    kimsenin okumadığı bir `console.warn` oldu.
    //
    //    Bu, build 8'i öldüren hatanın aynı sınıfı: köprüden gelen bir çağrının
    //    sözleşmesini varsaymak, ve düşen çağrıyı sessizce yutmak.
    await AdMob.initialize();

    // 2) iOS App Tracking Transparency (IDFA)
    //    Uygulama `.active` iken koşmalı, yoksa iOS istemi hiç göstermiyor.
    await waitForActive();
    const before = await AdMob.trackingAuthorizationStatus();
    if (before.status === 'notDetermined') {
      await AdMob.requestTrackingAuthorization();
    }
    const att = await AdMob.trackingAuthorizationStatus();

    // 3) Google UMP consent (GDPR / EU regions)
    let consent = await AdMob.requestConsentInfo();
    if (consent.status === AdmobConsentStatus.REQUIRED && consent.isConsentFormAvailable) {
      consent = await AdMob.showConsentForm();
    }

    // 4) Personalized only when consent is fine (obtained or not required) AND tracking allowed
    const consentOk =
      consent.status === AdmobConsentStatus.OBTAINED ||
      consent.status === AdmobConsentStatus.NOT_REQUIRED;
    _npa = !(consentOk && att.status === 'authorized');

    _adsReady = consent.canRequestAds !== false; // respect UMP: no ads if consent refused
    _initHatasi = null;
    console.log('[Ads] init ok:', JSON.stringify({ adsReady: _adsReady, npa: _npa, att: att.status, consent: consent.status }));
  } catch (e) {
    // Hata **alanlarıyla** yazılıyor, nesne olarak değil: köprü, `message` ve
    // `code` alanları numaralandırılamayan bir Error ile reddediyor ve
    // `console.warn('...', e)` ekrana boş bir `{}` basıyor. Aynı ders
    // `purchases.ts` içinde de yazılı.
    _initHatasi = describeError(e);
    console.error('[Ads] init failed:', JSON.stringify(_initHatasi));
  }
}

/** Son ilkleme hatası — teşhis için okunabilir kalıyor. */
export function adInitHatasi(): Record<string, unknown> | null {
  return _initHatasi;
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
