import { describe, it, expect } from 'vitest';
import { validateNickname, sanitizeNickname, isOffensiveNickname } from '@/lib/nicknameValidation';

/**
 * The nickname is the one piece of user-written text this game shows to every
 * other player, so it is the whole of its user-generated content surface. These
 * tests pin the two failure directions that matter: a slur getting through, and
 * an ordinary name being refused.
 */

describe('validateNickname', () => {
  it('accepts ordinary names, Turkish letters included', () => {
    for (const n of ['Deniz', 'Ayşe_91', 'mert.can', 'Ali-Rıza', 'Gülşah']) {
      expect(validateNickname(n)).toBeNull();
    }
  });

  it('holds the length bounds', () => {
    expect(validateNickname('ab')).toBe('too_short');
    expect(validateNickname('a'.repeat(13))).toBe('too_long');
  });

  it('refuses characters outside the allowed set', () => {
    expect(validateNickname('den<b>iz')).toBe('invalid_chars');
    expect(validateNickname('deniz🔥')).toBe('invalid_chars');
  });

  it('refuses a slur before it can reach the board', () => {
    expect(validateNickname('orospu')).toBe('offensive');
    expect(validateNickname('sikikherif')).toBe('offensive');
  });
});

describe('isOffensiveNickname', () => {
  it('sees through the usual substitutions', () => {
    // Digits standing in for letters, separators between them, and Turkish
    // letters folded to plain ones are all the same word to the filter.
    for (const n of ['s1k', 'f.u.c.k', 'S-I-K', 'p1ç', 'B1TCH', 'or0spu']) {
      expect(isOffensiveNickname(n)).toBe(true);
    }
  });

  it('leaves innocent names that merely contain the letters alone', () => {
    // A filter that fires on these is worse than one that misses a rude name:
    // reporting catches what slips through, nothing catches a player who cannot
    // enter their own name.
    for (const n of ['Adam', 'Aqua', 'Damla', 'Amine', 'Sikorski', 'Gotham', 'Amir']) {
      expect(isOffensiveNickname(n)).toBe(false);
    }
  });

  it('matches the ambiguous fragments as whole words only', () => {
    // The deliberate trade: 'dick' alone is refused, 'Dickens' is a surname and
    // is not. A rude name built this way gets through the filter and is left to
    // the report button — which is the correct side to fail on.
    expect(isOffensiveNickname('dick')).toBe(true);
    expect(isOffensiveNickname('Dickens')).toBe(false);
    expect(isOffensiveNickname('am')).toBe(true);
    expect(isOffensiveNickname('adam')).toBe(false);
    // Separated letters still collapse to the whole word.
    expect(isOffensiveNickname('d.i.c.k')).toBe(true);
  });

  it('refuses the unambiguous words anywhere in the name', () => {
    expect(isOffensiveNickname('xxorospuxx')).toBe(true);
    expect(isOffensiveNickname('superfucker')).toBe(true);
  });

  it('says nothing about an empty or symbol-only name', () => {
    expect(isOffensiveNickname('')).toBe(false);
    expect(isOffensiveNickname('...')).toBe(false);
  });
});

describe('sanitizeNickname', () => {
  it('strips disallowed characters as they are typed and caps the length', () => {
    expect(sanitizeNickname('de<niz>🔥')).toBe('deniz');
    expect(sanitizeNickname('a'.repeat(30))).toHaveLength(12);
  });
});
