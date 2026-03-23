/**
 * In-App Purchase layer — RevenueCat wrapper for Capacitor iOS.
 *
 * ── ACTIVATION CHECKLIST ────────────────────────────────────────────────────
 *  Step 1 › npm install @revenuecat/purchases-capacitor
 *  Step 2 › npx cap sync ios
 *  Step 3 › Xcode → Signing & Capabilities → "+ Capability" → In-App Purchase
 *  Step 4 › App Store Connect → In-App Purchases → New:
 *             Type: Non-Consumable
 *             Product ID: com.imuststay.game.ortadogu_pack
 *  Step 5 › RevenueCat dashboard (app.revenuecat.com):
 *             - New App → iOS bundle: com.imuststay.game
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

// RC: import Purchases, { PURCHASES_ERROR_CODE } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';
import { STORAGE_KEYS } from '@/constants/storage';

export const RC_IOS_API_KEY      = 'appl_YOUR_KEY_HERE'; // ← replace before release
export const RC_ENTITLEMENT_ID   = 'premium';
export const ORTADOGU_PRODUCT_ID = 'com.imuststay.game.ortadogu_pack';

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
  if (!Capacitor.isNativePlatform()) return;
  try {
    // RC: await Purchases.configure({ apiKey: RC_IOS_API_KEY });
    // RC: await refreshPremiumStatus();
  } catch (e) {
    console.error('[IAP] Init failed:', e);
  }
}

/**
 * Fetch latest entitlement status from RevenueCat and sync to cache.
 * Call when the app returns to foreground or after any purchase attempt.
 */
export async function refreshPremiumStatus(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return cacheIsPremium();
  try {
    // RC: const { customerInfo } = await Purchases.getCustomerInfo();
    // RC: const active = !!customerInfo.entitlements.active[RC_ENTITLEMENT_ID];
    // RC: cacheSetPremium(active);
    // RC: return active;
  } catch (e) {
    console.error('[IAP] Status refresh failed:', e);
  }
  return cacheIsPremium();
}

/**
 * Restore previous purchases.
 * App Store guidelines require a visible "Restore Purchases" button in your paywall.
 */
export async function restorePurchases(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return cacheIsPremium();
  try {
    // RC: const { customerInfo } = await Purchases.restorePurchases();
    // RC: const active = !!customerInfo.entitlements.active[RC_ENTITLEMENT_ID];
    // RC: cacheSetPremium(active);
    // RC: return active;
  } catch (e) {
    console.error('[IAP] Restore failed:', e);
  }
  return cacheIsPremium();
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

  // RC: Uncomment the block below once RevenueCat is activated (Step 6)
  // try {
  //   const { offerings } = await Purchases.getOfferings();
  //   const pkg = offerings.current?.availablePackages.find(
  //     p => p.product.identifier === ORTADOGU_PRODUCT_ID,
  //   );
  //   if (!pkg) {
  //     console.error('[IAP] Product not found in offerings:', ORTADOGU_PRODUCT_ID);
  //     return 'error';
  //   }
  //   const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
  //   const active = !!customerInfo.entitlements.active[RC_ENTITLEMENT_ID];
  //   if (active) { cacheSetPremium(true); return 'success'; }
  //   return 'error';
  // } catch (e: any) {
  //   if (e?.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) return 'cancelled';
  //   console.error('[IAP] Purchase failed:', e);
  //   return 'error';
  // }

  // Guard: block real native purchases until RC is activated to avoid bypassing payment
  console.warn('[IAP] RevenueCat not yet activated — native purchase blocked');
  return 'error';
}
