/**
 * ScaleUtils — Responsive sizing helpers
 * ----------------------------------------
 * Baseline cihaz: iPhone 17 Pro Max → 430 × 932 logical pixels
 *
 * Bu uygulama bir web uygulamasıdır (Tailwind CSS + Capacitor).
 * React Native değil, bu nedenle:
 *   • rem tabanlı Tailwind sınıfları → index.css'teki `html { font-size }` ile ölçeklenir
 *   • inline style px değerleri      → aşağıdaki fonksiyonlar ile ölçeklenir
 *
 * Kullanım örneği:
 *   import { s, sv, sc } from '@/utils/scaleUtils';
 *   <div style={{ width: s(135), height: s(135) }} />
 *   <div style={{ height: sv(130) }} />
 *   <div style={{ width: sc(140, 110) }} />
 */

/** Baseline tasarım genişliği (iPhone 17 Pro Max) */
export const BASE_WIDTH = 430;

/** Baseline tasarım yüksekliği (iPhone 17 Pro Max) */
export const BASE_HEIGHT = 932;

/**
 * Yatay ölçekleme: px değerini viewport genişliğine göre küçültür.
 * Pro Max'te tam px değer, SE'de orantılı olarak küçük değer döner.
 *
 * @example s(135) → "min(135px, 31.395vw)"
 *   430px ekranda: 31.395vw = 135px  ✓ (tam)
 *   375px ekranda: 31.395vw ≈ 117.7px ✓ (küçük)
 *   320px ekranda: 31.395vw ≈ 100.5px ✓ (daha küçük)
 */
export function s(px: number): string {
  const vw = ((px / BASE_WIDTH) * 100).toFixed(3);
  return `min(${px}px, ${vw}vw)`;
}

/**
 * Dikey ölçekleme: px değerini viewport yüksekliğine göre küçültür.
 * svh (small viewport height) kullanılır — klavye açıkken dahi kararlı davranır.
 *
 * @example sv(130) → "min(130px, 13.948svh)"
 *   932px yükseklikte: 13.948svh = 130px  ✓ (tam)
 *   667px yükseklikte: 13.948svh ≈ 93px   ✓ (küçük)
 */
export function sv(px: number): string {
  const vh = ((px / BASE_HEIGHT) * 100).toFixed(3);
  return `min(${px}px, ${vh}svh)`;
}

/**
 * Clamp ile ölçekleme: min ve max arasında viewport'a göre değer döner.
 * Küçük ekranlarda minPx'in altına düşmez.
 *
 * @example sc(140, 110) → "clamp(110px, 32.558vw, 140px)"
 *   430px: 32.558vw = 140px → max'a ulaştı  ✓
 *   375px: 32.558vw ≈ 122px                  ✓
 *   320px: 32.558vw ≈ 104px → min 110px'e clamp  ✓
 */
export function sc(px: number, minPx: number): string {
  const vw = ((px / BASE_WIDTH) * 100).toFixed(3);
  return `clamp(${minPx}px, ${vw}vw, ${px}px)`;
}

/**
 * Font ölçekleme: rem-tabanlı olmayan font için px → vw dönüşümü.
 * Genellikle `s()` tercih edilir; bu fonksiyon font-size için özelleştirilmiştir.
 */
export function sf(px: number, minPx = Math.round(px * 0.75)): string {
  const vw = ((px / BASE_WIDTH) * 100).toFixed(3);
  return `clamp(${minPx}px, ${vw}vw, ${px}px)`;
}
