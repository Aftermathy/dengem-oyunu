/**
 * STYLES BACKUP — Responsive Refactor Reference
 * -----------------------------------------------
 * Bu dosya, responsive refactor öncesindeki sabit/büyük değerlerin
 * referans kaydıdır. Herhangi bir sorunla karşılaşırsan aşağıdaki
 * orijinal değerleri geri yükle.
 *
 * Refactor tarihi: 2026-04-03
 * Baseline cihaz  : iPhone 17 Pro Max (430 × 932 logical px)
 * Hedef aralık    : iPhone SE (375 × 667) — iPhone 17 Pro Max (430 × 932)
 */

// ─── index.css ────────────────────────────────────────────────────────────────
// ORIGINAL: html element had no explicit font-size (browser default = 16px)
// CHANGED TO:
//   html { font-size: clamp(13px, 3.72vw, 16px); }
//   /* 3.72vw × 430 ≈ 16px (Pro Max), × 375 ≈ 13.95px (SE), clamp min 13px */
//   :root { --s: 1; } /* overridden dynamically via scaleUtils context */

// ─── SwipeCard.tsx ────────────────────────────────────────────────────────────
// Line 84  — swipe exit translate:
//   BEFORE: translateX(${exiting === 'left' ? -500 : 500}px)
//   AFTER:  translateX(${exiting === 'left' ? -120 : 120}vw)
//
// Line 152 — character image dimensions:
//   BEFORE: className="w-[135px] h-[135px] object-cover rounded-full block"
//   AFTER:  style={{ width: 'min(135px, 31.4vw)', height: 'min(135px, 31.4vw)' }}
//           className="object-cover rounded-full block"

// ─── PowerBars.tsx ────────────────────────────────────────────────────────────
// Line 201 — bribe cost popup width:
//   BEFORE: style={{ width: '140px' }}
//   AFTER:  style={{ width: 'clamp(110px, 35vw, 140px)' }}
//
// Line 285 — bribe feedback toast min-width:
//   BEFORE: className="... min-w-[200px]"
//   AFTER:  className="... min-w-[clamp(160px,44vw,200px)]"

// ─── ElectionBattle.tsx ───────────────────────────────────────────────────────
// Line 68  — vote bar container:
//   BEFORE: className="flex justify-center items-end gap-8 px-8 py-3"
//   AFTER:  className="flex justify-center items-end gap-[min(32px,7.4vw)] px-[min(32px,7.4vw)] py-3"
//
// Line 72  — player vote bar height:
//   BEFORE: style={{ height: 130, ... }}
//   AFTER:  style={{ height: 'min(130px, 30.2vw)', ... }}
//
// Line 82  — opponent vote bar height:
//   BEFORE: style={{ height: 130, ... }}
//   AFTER:  style={{ height: 'min(130px, 30.2vw)', ... }}

// ─── StartScreen.tsx ──────────────────────────────────────────────────────────
// Throne icon (w-72 h-72 = 288px):
//   BEFORE: className="... w-72 h-72 ..."
//   AFTER:  className="... w-[min(288px,67vw)] h-[min(288px,67vw)] ..."
//
// Avatar profile button (w-24 = 96px):
//   BEFORE: className="w-24 aspect-square ..."
//   AFTER:  className="w-[min(96px,22vw)] aspect-square ..."

export {};
