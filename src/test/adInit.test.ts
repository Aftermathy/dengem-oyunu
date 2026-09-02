import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * AdMob ilkleme sırasının testi.
 *
 * Bu test bir sözleşmeyi kilitliyor: **`AdMob.initialize()` her şeyden önce
 * çağrılır.** Eklentinin kendi README'si sırayı böyle yazıyor
 * (initialize → requestConsentInfo → showConsentForm) ve tersi yapıldığında
 * arıza sessiz oluyor.
 *
 * Bedeli 1.0.5 (9) ile ödendi: yayınlanan uygulamada `requestConsentInfo()`
 * ilklemeden önce çağrılıyordu, düşen çağrıyı `catch` yutuyordu, `_adsReady`
 * başlangıç değeri `false`'ta kalıyordu ve `showInterstitialNow()` her
 * seferinde ilk satırda dönüyordu. Dört beş oyun boyunca tek reklam
 * gösterilmedi; tek iz kimsenin okumadığı bir `console.warn` oldu.
 *
 * İkinci sözleşme: ilkleme düşerse hata **alanlarıyla** yazılır. Köprü,
 * `message` ve `code` alanları numaralandırılamayan bir Error ile reddediyor;
 * nesneyi olduğu gibi yazdırmak ekrana boş bir `{}` basıyor.
 */

const cagrilar: string[] = [];

const admobSahte = {
  initialize: vi.fn(async () => { cagrilar.push('initialize'); }),
  trackingAuthorizationStatus: vi.fn(async () => {
    cagrilar.push('trackingAuthorizationStatus');
    return { status: 'authorized' as const };
  }),
  requestTrackingAuthorization: vi.fn(async () => { cagrilar.push('requestTrackingAuthorization'); }),
  requestConsentInfo: vi.fn(async () => {
    cagrilar.push('requestConsentInfo');
    return { status: 'NOT_REQUIRED', isConsentFormAvailable: false, canRequestAds: true };
  }),
  showConsentForm: vi.fn(async () => {
    cagrilar.push('showConsentForm');
    return { status: 'OBTAINED', isConsentFormAvailable: true, canRequestAds: true };
  }),
  prepareInterstitial: vi.fn(async () => { cagrilar.push('prepareInterstitial'); }),
  showInterstitial: vi.fn(async () => { cagrilar.push('showInterstitial'); }),
};

vi.mock('@capacitor/core', () => ({
  Capacitor: { isNativePlatform: () => true },
}));

vi.mock('@capacitor/app', () => ({
  App: {
    getState: async () => ({ isActive: true }),
    addListener: async () => ({ remove: () => {} }),
  },
}));

vi.mock('@capacitor-community/admob', () => ({
  AdMob: admobSahte,
  AdmobConsentStatus: { REQUIRED: 'REQUIRED', OBTAINED: 'OBTAINED', NOT_REQUIRED: 'NOT_REQUIRED' },
}));

vi.mock('@/lib/purchases', () => ({
  isAdFree: () => false,
  setAdFree: () => {},
}));

describe('initAds — çağrı sırası', () => {
  beforeEach(() => {
    cagrilar.length = 0;
    vi.clearAllMocks();
    Object.values(admobSahte).forEach((f) => f.mockClear?.());
  });

  it('initialize her şeyden önce çağrılır', async () => {
    const { initAds } = await import('@/hooks/useAds');
    await initAds();

    expect(cagrilar.length).toBeGreaterThan(0);
    expect(cagrilar[0]).toBe('initialize');
  });

  it('rıza sorgusu ilklemeden sonra gelir', async () => {
    const { initAds } = await import('@/hooks/useAds');
    await initAds();

    const i = cagrilar.indexOf('initialize');
    const r = cagrilar.indexOf('requestConsentInfo');
    expect(i).toBeGreaterThanOrEqual(0);
    expect(r).toBeGreaterThan(i);
  });
});

describe('initAds — düşen ilkleme sessiz kalmaz', () => {
  beforeEach(() => {
    cagrilar.length = 0;
    vi.resetModules();
  });

  it('hata alanlarıyla okunabilir kalır', async () => {
    // Köprünün gerçek reddi gibi: `message` numaralandırılamaz.
    const kopruHatasi = new Error('AdMob not initialized');
    admobSahte.initialize.mockRejectedValueOnce(kopruHatasi);

    const hatalar: string[] = [];
    const eski = console.error;
    console.error = (...a: unknown[]) => { hatalar.push(a.map(String).join(' ')); };

    const { initAds, adInitHatasi } = await import('@/hooks/useAds');
    await initAds();

    console.error = eski;

    const kayit = adInitHatasi();
    expect(kayit).not.toBeNull();
    // Asıl sözleşme: mesaj kayıp değil. Nesneyi olduğu gibi yazdırmak `{}` basardı.
    expect(kayit?.message).toBe('AdMob not initialized');
    expect(hatalar.join(' ')).toContain('AdMob not initialized');

    admobSahte.initialize.mockReset();
    admobSahte.initialize.mockImplementation(async () => { cagrilar.push('initialize'); });
  });
});
