/**
 * Nickname validation rules:
 * - Min 2, Max 16 characters
 * - Allowed: Latin letters, Turkish letters, digits, space, hyphen, underscore, period
 * - Blocked: emojis, HTML tags, special symbols, leading/trailing spaces
 */

const ALLOWED_RE = /^[a-zA-ZğüşıöçĞÜŞİÖÇ0-9 ._-]+$/;

export const NICKNAME_MIN = 3;
export const NICKNAME_MAX = 12;

export type NicknameError = 'too_short' | 'too_long' | 'invalid_chars' | 'offensive' | null;

/*
  Two lists, because one list cannot serve both jobs. This is the "filter
  objectionable material" leg of App Store Review Guideline 1.2; the report and
  block controls on the leaderboard are the other two, and the address on the
  support page is the fourth.

  A filter that guesses is worse than a permissive one: reporting catches what
  slips through, but nothing helps a player who cannot enter their own name.
  `Sikorski` and `Gotham` were both refused by a single substring list, which is
  why the ambiguous fragments moved to whole-word matching.
*/

/** Long enough to be unambiguous; refused anywhere inside the name. */
const BLOCKED_ANYWHERE = [
  'orospu', 'yarrak', 'pezevenk', 'gavat', 'ibne', 'kahpe', 'sikik', 'siktir',
  'anani', 'fuck', 'shit', 'cunt', 'bitch', 'nigg', 'hitler',
];

/*
  Short or ordinary as fragments, so only refused as a whole word: `sik` sits
  inside Sikorski, `got` inside Gotham, `pic` inside Picasso, `nazi` inside the
  Turkish name Nazif, `rape` inside grape, `am` inside adam.
*/
const BLOCKED_WHOLE_WORD = [
  'am', 'aq', 'oc', 'amk', 'sik', 'got', 'mal', 'pic', 'dick', 'nazi', 'rape',
];

/**
 * Fold the tricks people use to slip a word past a list: accented and Turkish
 * letters to their plain form, digits that stand in for letters, and any
 * separator between letters ("s-i-k", "f.u.c.k").
 */
function normalizeForFilter(raw: string): string {
  return raw
    .toLocaleLowerCase('tr')
    .replace(/[ğ]/g, 'g').replace(/[ü]/g, 'u').replace(/[ş]/g, 's')
    .replace(/[ı]/g, 'i').replace(/[ö]/g, 'o').replace(/[ç]/g, 'c')
    .replace(/[0]/g, 'o').replace(/[1|]/g, 'i').replace(/[3]/g, 'e')
    .replace(/[4@]/g, 'a').replace(/[5]/g, 's').replace(/[7]/g, 't')
    .replace(/[^a-z]/g, '');
}

/** True when the nickname carries one of the blocked words. */
export function isOffensiveNickname(raw: string): boolean {
  const folded = normalizeForFilter(raw);
  if (!folded) return false;

  if (BLOCKED_ANYWHERE.some(w => folded.includes(normalizeForFilter(w)))) return true;

  // Whole-word list: split on the separators the nickname rules allow, and fold
  // each piece on its own so "S-I-K" collapses to one word while "Sikorski"
  // stays one word that merely starts with those letters.
  const words = raw.toLocaleLowerCase('tr').split(/[\s._-]+/).filter(Boolean).map(normalizeForFilter);
  const collapsed = [folded, ...words];
  return BLOCKED_WHOLE_WORD.some(w => collapsed.includes(normalizeForFilter(w)));
}

export function validateNickname(raw: string): NicknameError {
  const trimmed = raw.trim();
  if (trimmed.length < NICKNAME_MIN) return 'too_short';
  if (trimmed.length > NICKNAME_MAX) return 'too_long';
  if (!ALLOWED_RE.test(trimmed)) return 'invalid_chars';
  if (isOffensiveNickname(trimmed)) return 'offensive';
  return null;
}

/** Sanitize on each keystroke: strip disallowed chars, cap at max length */
export function sanitizeNickname(raw: string): string {
  return raw
    .replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ0-9 ._-]/g, '')
    .slice(0, NICKNAME_MAX);
}

export function nicknameErrorText(error: NicknameError, lang: string): string | null {
  if (!error) return null;
  if (lang === 'tr') {
    if (error === 'too_short') return `En az ${NICKNAME_MIN} karakter giriniz`;
    if (error === 'too_long')  return `En fazla ${NICKNAME_MAX} karakter`;
    if (error === 'invalid_chars') return 'Sadece harf, rakam, boşluk ve . _ - kullanabilirsin';
    if (error === 'offensive') return 'Bu takma ad kullanılamaz';
  } else {
    if (error === 'too_short') return `Minimum ${NICKNAME_MIN} characters`;
    if (error === 'too_long')  return `Maximum ${NICKNAME_MAX} characters`;
    if (error === 'invalid_chars') return 'Only letters, numbers, spaces and . _ - allowed';
    if (error === 'offensive') return 'This nickname is not allowed';
  }
  return null;
}
