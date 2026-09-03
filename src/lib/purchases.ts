/**
 * In-App Purchase layer — RevenueCat wrapper for Capacitor iOS.
 *
 * ── ACTIVATION CHECKLIST ────────────────────────────────────────────────────
 *  Step 1 › npm install @revenuecat/purchases-capacitor
 *  Step 2 › npx cap sync ios
 *  Step 3 › Xcode → Signing & Capabilities → "+ Capability" → In-App Purchase
 *  Step 4 › App Store Connect → In-App Purchases → New:
 *             Type: Non-Consumable
 *             Product ID: com.denizerdogan.imuststay.ortadogu_pack
 *  Step 5 › RevenueCat dashboard (app.revenuecat.com):
 *             - New App → iOS bundle: com.denizerdogan.imuststay
 *             - New Entitlement ID: "premium"
 *             - Attach product to entitlement
 *             - Copy API Key (starts with "appl_") → paste into RC_IOS_API_KEY below
 *  Step 6 › Search "// RC:" in this file and uncomment those lines
 *  Step 7 › In main.tsx call: initPurchases()
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Until activated: localStorage is the sole persistence layer (dev / web).
 * After activation: RevenueCat is the SOURCE OF TRUTH; localStorage is a cache.
 */

import { Purchases, PURCHASES_ERROR_CODE, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';
import { STORAGE_KEYS } from '@/constants/storage';

export const RC_IOS_API_KEY      = 'appl_zddSGoSQLVgnyqKrzfOjHRRbeYV';

/**
 * Google Play anahtarı — YAYINDAN ÖNCE DOLDURULACAK.
 *
 * RevenueCat panelinde aynı projeye **ikinci bir uygulama** eklenip
 * (Play paketi `com.denizerdogan.imuststay`) oradan alınan, `goog_` ile
 * başlayan anahtar buraya yazılır. iOS anahtarı Android'de çalışmaz;
 * `Purchases.configure()` yanlış platform anahtarıyla sessizce başarısız
 * oluyor ve satın alma ekranı hiç açılmıyor — build 8'de aynı sınıf hata
 * bir akşam kaybettirmişti.
 *
 * Boş kaldığı sürece `IAP_ENABLED` Android'de kendini kapatıyor (aşağıda),
 * yani ürün eksik anahtarla yayına gidemez.
 */
export const RC_ANDROID_API_KEY  = '';

export const RC_ENTITLEMENT_ID   = 'premium';
export const ORTADOGU_PRODUCT_ID = 'com.denizerdogan.imuststay.ortadogu_pack';

/** Çalışılan platformun RevenueCat anahtarı. */
function rcApiKey(): string {
  return Capacitor.getPlatform() === 'android' ? RC_ANDROID_API_KEY : RC_IOS_API_KEY;
}

// Verbose RevenueCat logging. Off unless the build is made with
// VITE_IAP_DEBUG=1, so a shipped bundle never carries it. Turn it on when a
// purchase fails on device: the native SDK then prints the StoreKit error that
// the JS bridge swallows.
const IAP_DEBUG_LOG = import.meta.env.VITE_IAP_DEBUG === '1';

/**
 * Readable shape of a rejected native call.
 *
 * `console.error('...', e)` printed a bare `{}` for every failed purchase: the
 * bridge rejects with an Error whose `message` and `code` are non-enumerable,
 * so serializing the object threw all of it away and left us guessing. Reading
 * the fields by name is what makes the failure say its own name.
 */
function describeError(e: unknown): Record<string, unknown> {
  if (e == null || typeof e !== 'object') return { error: String(e) };
  const o = e as Record<string, unknown>;
  return {
    code: o.code,
    message: o.message,
    readableErrorCode: o.readableErrorCode,
    underlyingErrorMessage: o.underlyingErrorMessage,
    raw: typeof e === 'object' ? Object.getOwnPropertyNames(e).join(',') : String(e),
  };
}

// Master switch for the in-app purchase UI. Flipped ON for 1.0.5 (build 8).
// RELEASE GATE: do not submit this build until the Apple Paid Applications
// Agreement is Active AND the IAP is created in App Store Connect — otherwise
// the purchase sheet fails ("products could not be fetched") and App Review
// rejects.
/**
 * Satın alma katmanı açık mı.
 *
 * Android'de anahtar doldurulmadan açık olamaz: eksik anahtarla
 * `Purchases.configure()` düşer, ardındaki her çağrı sessizce `'error'` döner
 * ve kullanıcı çalışmayan bir satın alma düğmesi görür. Kapalıyken düğme
 * arayüzde hiç çizilmiyor (`StartScreen.tsx` ve `ProfileScreen.tsx`
 * `IAP_ENABLED` kontrol ediyor), yani eksik yapılandırma yayına sızamıyor.
 */
export const IAP_ENABLED =
  Capacitor.getPlatform() === 'android' ? RC_ANDROID_API_KEY.length > 0 : true;

// ─── localStorage cache ───────────────────────────────────────────────────────
// We write to localStorage after every verified purchase / restore so that
// isAdFree() remains synchronous and safe to call during render.

function cacheSetPremium(active: boolean): void {
  if (active) {
    localStorage.setItem(STORAGE_KEYS.AD_FREE, 'true');
    localStorage.setItem(STORAGE_KEYS.ORTADOGU_PACK, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEYS.AD_FREE);
    localStorage.removeItem(STORAGE_KEYS.ORTADOGU_PACK);
  }
}

function cacheIsPremium(): boolean {
  return localStorage.getItem(STORAGE_KEYS.AD_FREE) === 'true';
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Synchronous premium check — reads from the local cache.
 * Fast enough to call during render. After RC activation this stays the same
 * signature; it just reads a cache that RC keeps up-to-date.
 */
export function isAdFree(): boolean {
  return cacheIsPremium();
}

/**
 * Persist premium state locally.
 * Called after a verified purchase or restore. When RC is active, prefer
 * refreshPremiumStatus() so the server is the authority.
 */
export function setAdFree(): void {
  cacheSetPremium(true);
}

// ─── SDK lifecycle ────────────────────────────────────────────────────────────

/**
 * Initialize RevenueCat and sync latest entitlement status.
 * Call once at app start (main.tsx / App.tsx).
 */
export async function initPurchases(): Promise<void> {
  if (!IAP_ENABLED) return;          // IAP disabled → don't configure RevenueCat at all
  if (!Capacitor.isNativePlatform()) return;
  try {
    if (IAP_DEBUG_LOG) await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
    await Purchases.configure({ apiKey: rcApiKey() });
    await refreshPremiumStatus();
  } catch (e) {
    console.error('[IAP] Init failed:', JSON.stringify(describeError(e)));
  }
}

/**
 * Fetch latest entitlement status from RevenueCat and sync to cache.
 * Call when the app returns to foreground or after any purchase attempt.
 */
export async function refreshPremiumStatus(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return cacheIsPremium();
  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    const active = !!customerInfo.entitlements.active[RC_ENTITLEMENT_ID];
    cacheSetPremium(active);
    return active;
  } catch (e) {
    console.error('[IAP] Status refresh failed:', e);
  }
  return cacheIsPremium();
}

/**
 * Restore previous purchases.
 * App Store guidelines require a visible "Restore Purchases" button in your paywall.
 */
export type RestoreResult = 'restored' | 'nothing_to_restore' | 'error';

/**
 * Restore a previous purchase.
 *
 * Three outcomes, not two. This used to return a bare boolean and swallow every
 * exception, so "you never bought this", "the store could not be reached" and
 * "StoreKit failed" all arrived as `false` — and the settings screen printed
 * "Not found" at a paying customer whose network had simply dropped, while the
 * paywall printed "error" for the same call. Telling them apart is the whole
 * difference between "you own nothing" and "we could not check".
 */
export async function restorePurchases(): Promise<RestoreResult> {
  if (!Capacitor.isNativePlatform()) {
    return cacheIsPremium() ? 'restored' : 'nothing_to_restore';
  }
  try {
    const { customerInfo } = await Purchases.restorePurchases();
    const active = !!customerInfo.entitlements.active[RC_ENTITLEMENT_ID];
    cacheSetPremium(active);
    return active ? 'restored' : 'nothing_to_restore';
  } catch (e) {
    console.error('[IAP] Restore failed:', JSON.stringify(describeError(e)));
    // The local grant is left alone: a network failure must not revoke a pack
    // the customer already paid for.
    return 'error';
  }
}

/**
 * The pack's price as the App Store would print it, e.g. "₺149,99" or "$2.99".
 *
 * The paywall used to hardcode "$2.99". A Turkish storefront is charged ₺149,99,
 * so the button showed one number and Apple took another — a rejection under the
 * pricing guidelines and, more simply, a lie to the customer. StoreKit already
 * hands us the localised string; the only correct source is that one.
 *
 * Returns null when the store cannot be reached. Callers must be able to render
 * a paywall without a price rather than print a wrong one.
 */
export async function getPackPriceString(): Promise<string | null> {
  if (!Capacitor.isNativePlatform()) return null;
  try {
    const offerings = await Purchases.getOfferings();
    const pkg = offerings.current?.availablePackages.find(
      p => p.product.identifier === ORTADOGU_PRODUCT_ID,
    );
    return pkg?.product.priceString ?? null;
  } catch (e) {
    console.error('[IAP] Price lookup failed:', JSON.stringify(describeError(e)));
    return null;
  }
}

// ─── Purchase ─────────────────────────────────────────────────────────────────

/**
 * Trigger the native StoreKit purchase sheet for the Ortadoğu Kriz Paketi.
 *
 * Returns:
 *   'success'   — purchase verified, cache updated, DLC + ad-free active
 *   'cancelled' — user dismissed the sheet, no charge
 *   'error'     — network failure, product not found, etc.
 */
export async function purchaseOrtadoguPack(): Promise<'success' | 'cancelled' | 'error'> {
  // Non-native (web / Capacitor web preview): simulate for UI testing
  if (!Capacitor.isNativePlatform()) {
    cacheSetPremium(true);
    return 'success';
  }

  try {
    /*
      Not destructured: `getOfferings()` resolves to the Offerings object
      itself (`{ all, current }`), unlike `getCustomerInfo()` and
      `restorePurchases()` next to it, which resolve to `{ customerInfo }`.
      Reading `{ offerings }` off it yielded `undefined`, and the very next
      line threw "undefined is not an object (evaluating 'offerings.current')"
      before Apple's sheet could open — the purchase button looked dead on
      device while the store, the product and RevenueCat were all fine.
    */
    const offerings = await Purchases.getOfferings();
    const pkg = offerings.current?.availablePackages.find(
      p => p.product.identifier === ORTADOGU_PRODUCT_ID,
    );
    if (!pkg) {
      console.error('[IAP] Product not found in offerings:', ORTADOGU_PRODUCT_ID);
      return 'error';
    }
    const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
    const active = !!customerInfo.entitlements.active[RC_ENTITLEMENT_ID];
    if (active) { cacheSetPremium(true); return 'success'; }
    return 'error';
  } catch (e) {
    if ((e as { code?: string })?.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) return 'cancelled';
    console.error('[IAP] Purchase failed:', JSON.stringify(describeError(e)));
    return 'error';
  }
}
