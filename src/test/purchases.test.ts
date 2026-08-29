import { describe, it, expect, vi, beforeEach } from 'vitest';
import { STORAGE_KEYS } from '@/constants/storage';

/**
 * Contract tests for the in-app purchase layer.
 *
 * These exist because of a bug that shipped in 1.0.5 build 8: the code read
 * `const { offerings } = await Purchases.getOfferings()`, but that call resolves
 * to the Offerings object itself — `{ all, current }` — with no `offerings`
 * wrapper. The destructure yielded `undefined`, the next line threw, and
 * `purchaseOrtadoguPack` returned 'error' before Apple's sheet could open. On
 * device the purchase button simply did nothing, and the catch block printed a
 * bare `{}`, so the log said nothing either.
 *
 * The mocks below therefore return the shapes the plugin ACTUALLY returns, not
 * the shapes it would be convenient to assume. Two of the four calls are
 * wrapped and two are not; that asymmetry is the trap, so it is written out
 * explicitly here:
 *
 *   getOfferings()      -> { all, current }          (bare)
 *   getCustomerInfo()   -> { customerInfo }          (wrapped)
 *   restorePurchases()  -> { customerInfo }          (wrapped)
 *   purchasePackage()   -> { customerInfo, ... }     (wrapped)
 *
 * If a future SDK upgrade changes one of these, these tests fail here rather
 * than silently on a customer's phone.
 */

const PRODUCT_ID = 'com.denizerdogan.imuststay.ortadogu_pack';

const purchasePackage = vi.fn();
const getOfferings = vi.fn();
const getCustomerInfo = vi.fn();
const restore = vi.fn();

vi.mock('@capacitor/core', () => ({
  Capacitor: { isNativePlatform: () => true, getPlatform: () => 'ios' },
}));

vi.mock('@revenuecat/purchases-capacitor', () => ({
  Purchases: {
    configure: vi.fn(),
    setLogLevel: vi.fn(),
    getOfferings: (...a: unknown[]) => getOfferings(...a),
    getCustomerInfo: (...a: unknown[]) => getCustomerInfo(...a),
    restorePurchases: (...a: unknown[]) => restore(...a),
    purchasePackage: (...a: unknown[]) => purchasePackage(...a),
  },
  PURCHASES_ERROR_CODE: { PURCHASE_CANCELLED_ERROR: '1' },
  LOG_LEVEL: { DEBUG: 'DEBUG' },
}));

/** The package shape the SDK hands back, reduced to the fields we read. */
function pkg(productIdentifier: string) {
  return { identifier: '$rc_lifetime', product: { identifier: productIdentifier } };
}

/** `getOfferings()` resolves to this — note there is no `offerings` wrapper. */
function offeringsWith(...productIds: string[]) {
  const current = { identifier: '$rc_lifetime', availablePackages: productIds.map(pkg) };
  return { all: { $rc_lifetime: current }, current };
}

function customerInfo(premium: boolean) {
  return { customerInfo: { entitlements: { active: premium ? { premium: { isActive: true } } : {} } } };
}

function granted() {
  return localStorage.getItem(STORAGE_KEYS.AD_FREE) === 'true';
}

describe('purchaseOrtadoguPack', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('finds the package in the bare Offerings object and completes the purchase', async () => {
    getOfferings.mockResolvedValue(offeringsWith(PRODUCT_ID));
    purchasePackage.mockResolvedValue(customerInfo(true));

    const { purchaseOrtadoguPack } = await import('@/lib/purchases');
    expect(await purchaseOrtadoguPack()).toBe('success');

    // The regression: reaching purchasePackage at all is the assertion. Before
    // the fix, the throw happened one line earlier and this was never called.
    expect(purchasePackage).toHaveBeenCalledTimes(1);
    expect(purchasePackage.mock.calls[0][0].aPackage.product.identifier).toBe(PRODUCT_ID);
    expect(granted()).toBe(true);
  });

  it('does not grant the entitlement when StoreKit reports it inactive', async () => {
    getOfferings.mockResolvedValue(offeringsWith(PRODUCT_ID));
    purchasePackage.mockResolvedValue(customerInfo(false));

    const { purchaseOrtadoguPack } = await import('@/lib/purchases');
    expect(await purchaseOrtadoguPack()).toBe('error');
    expect(granted()).toBe(false);
  });

  it('reports error without charging when the product is missing from the offering', async () => {
    getOfferings.mockResolvedValue(offeringsWith('com.some.other.product'));

    const { purchaseOrtadoguPack } = await import('@/lib/purchases');
    expect(await purchaseOrtadoguPack()).toBe('error');
    expect(purchasePackage).not.toHaveBeenCalled();
    expect(granted()).toBe(false);
  });

  it('reports error when there is no current offering at all', async () => {
    getOfferings.mockResolvedValue({ all: {}, current: null });

    const { purchaseOrtadoguPack } = await import('@/lib/purchases');
    expect(await purchaseOrtadoguPack()).toBe('error');
    expect(purchasePackage).not.toHaveBeenCalled();
  });

  it('distinguishes a user cancellation from a failure and grants nothing', async () => {
    getOfferings.mockResolvedValue(offeringsWith(PRODUCT_ID));
    purchasePackage.mockRejectedValue({ code: '1' });

    const { purchaseOrtadoguPack } = await import('@/lib/purchases');
    expect(await purchaseOrtadoguPack()).toBe('cancelled');
    expect(granted()).toBe(false);
  });

  it('treats an opaque native rejection as an error rather than a cancellation', async () => {
    getOfferings.mockResolvedValue(offeringsWith(PRODUCT_ID));
    purchasePackage.mockRejectedValue(new Error('undefined is not an object'));

    const { purchaseOrtadoguPack } = await import('@/lib/purchases');
    expect(await purchaseOrtadoguPack()).toBe('error');
    expect(granted()).toBe(false);
  });
});

describe('restorePurchases', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('grants the entitlement when the restored customer has it', async () => {
    restore.mockResolvedValue(customerInfo(true));
    const { restorePurchases } = await import('@/lib/purchases');
    expect(await restorePurchases()).toBe('restored');
    expect(granted()).toBe(true);
  });

  it('clears a stale local grant when the restore says the user has nothing', async () => {
    localStorage.setItem(STORAGE_KEYS.AD_FREE, 'true');
    localStorage.setItem(STORAGE_KEYS.ORTADOGU_PACK, 'true');
    restore.mockResolvedValue(customerInfo(false));

    const { restorePurchases } = await import('@/lib/purchases');
    expect(await restorePurchases()).toBe('nothing_to_restore');
    expect(granted()).toBe(false);
  });

  it('separates "you own nothing" from "we could not check"', async () => {
    restore.mockRejectedValue(new Error('offline'));
    const { restorePurchases } = await import('@/lib/purchases');
    // Not 'nothing_to_restore': telling a paying customer they own nothing
    // because the network blinked is the bug this distinction exists to stop.
    expect(await restorePurchases()).toBe('error');
  });

  it('does not revoke an existing local grant when the store is unreachable', async () => {
    localStorage.setItem(STORAGE_KEYS.AD_FREE, 'true');
    localStorage.setItem(STORAGE_KEYS.ORTADOGU_PACK, 'true');
    restore.mockRejectedValue(new Error('offline'));

    const { restorePurchases } = await import('@/lib/purchases');
    expect(await restorePurchases()).toBe('error');
    expect(granted()).toBe(true);
  });
});

describe('refreshPremiumStatus', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('falls back to the cached grant when the network read throws', async () => {
    localStorage.setItem(STORAGE_KEYS.AD_FREE, 'true');
    localStorage.setItem(STORAGE_KEYS.ORTADOGU_PACK, 'true');
    getCustomerInfo.mockRejectedValue(new Error('offline'));

    const { refreshPremiumStatus } = await import('@/lib/purchases');
    // A paying customer must not lose the pack because the network blinked.
    expect(await refreshPremiumStatus()).toBe(true);
    expect(granted()).toBe(true);
  });
});
