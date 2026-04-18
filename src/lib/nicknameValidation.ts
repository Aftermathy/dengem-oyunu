/**
 * Nickname validation rules:
 * - Min 2, Max 16 characters
 * - Allowed: Latin letters, Turkish letters, digits, space, hyphen, underscore, period
 * - Blocked: emojis, HTML tags, special symbols, leading/trailing spaces
 */

const ALLOWED_RE = /^[a-zA-ZğüşıöçĞÜŞİÖÇ0-9 ._-]+$/;

export const NICKNAME_MIN = 3;
export const NICKNAME_MAX = 12;

export type NicknameError = 'too_short' | 'too_long' | 'invalid_chars' | null;

export function validateNickname(raw: string): NicknameError {
  const trimmed = raw.trim();
  if (trimmed.length < NICKNAME_MIN) return 'too_short';
  if (trimmed.length > NICKNAME_MAX) return 'too_long';
  if (!ALLOWED_RE.test(trimmed)) return 'invalid_chars';
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
  } else {
    if (error === 'too_short') return `Minimum ${NICKNAME_MIN} characters`;
    if (error === 'too_long')  return `Maximum ${NICKNAME_MAX} characters`;
    if (error === 'invalid_chars') return 'Only letters, numbers, spaces and . _ - allowed';
  }
  return null;
}
