/**
 * audioManager — Howler.js backed sound system for Vite + Capacitor.
 *
 * Why Howler instead of expo-av:
 *   expo-av is React Native / Expo only. Howler.js is the Capacitor-compatible
 *   equivalent and maps 1-to-1 to the requested feature set:
 *
 *   expo-av Audio.setAudioModeAsync({ playsInSilentModeIOS: true })
 *     → Howler's html5:false (Web Audio API backend) bypasses the iOS
 *       silent switch exactly the same way.
 *
 *   expo-av sound.unloadAsync()   → howl.unload()   (used for one-shot sounds)
 *   expo-av Audio.Sound.createAsync(require(...)) → new Howl({ src: ['/sounds/x.mp3'] })
 *
 * Sound files live in public/sounds/ → served by Vite → copied to
 * ios/App/App/public/sounds/ by `npx cap sync ios`.
 * See public/sounds/README.md for the full file list.
 */

import { Howl, Howler } from 'howler';
import {
  hapticWarStart,
  hapticDoubleSharp,
  hapticError,
  hapticLight,
  hapticMedium,
} from '@/hooks/useHaptics';
import { STORAGE_KEYS } from '@/constants/storage';

// ─── Mute state ───────────────────────────────────────────────────────────────
// Mirrors the existing isMuted/localStorage + CustomEvent pattern.

let isMuted = localStorage.getItem(STORAGE_KEYS.SOUND_MUTED) === 'true';
Howler.volume(isMuted ? 0 : 1);

if (typeof window !== 'undefined') {
  window.addEventListener('sound-mute-toggle', ((e: CustomEvent) => {
    isMuted = e.detail as boolean;
    Howler.volume(isMuted ? 0 : 1);
  }) as EventListener);
}

// ─── Sound catalogue (unchanged identifiers) ─────────────────────────────────
export const SOUNDS = {
  BUTTON_CLICK:     'button_click',
  CARD_SWIPE_RIGHT: 'card_swipe_right',
  CARD_SWIPE_LEFT:  'card_swipe_left',
  GAME_OVER:        'game_over',
  BRIBE:            'bribe',
  WARNING:          'warning',
  WAR_START:        'war_start',
  ELECTION_CARD:    'election_card',
  AI_CARD:          'ai_card',
  SPECIAL_POWER:    'special_power',
  REROLL:           'reroll',
  BUDGET_WARNING:   'budget_warning',
} as const;

export type SoundKey = typeof SOUNDS[keyof typeof SOUNDS];

// ─── Asset dictionary ─────────────────────────────────────────────────────────
// Static mapping required: bundlers (Vite/webpack/Metro) cannot resolve
// dynamically constructed require/import paths at build time.
// Paths are relative to the Vite `public/` root and work unchanged in
// Capacitor iOS (files are copied verbatim to the app bundle).

const SOUND_FILES: Record<SoundKey, string> = {
  [SOUNDS.BUTTON_CLICK]:     '/sounds/click.mp3',
  [SOUNDS.CARD_SWIPE_RIGHT]: '/sounds/swipe_right.mp3',
  [SOUNDS.CARD_SWIPE_LEFT]:  '/sounds/swipe_left.mp3',
  [SOUNDS.GAME_OVER]:        '/sounds/game_over.mp3',
  [SOUNDS.BRIBE]:            '/sounds/bribe.mp3',
  [SOUNDS.WARNING]:          '/sounds/warning.mp3',
  [SOUNDS.WAR_START]:        '/sounds/war_start.mp3',
  [SOUNDS.ELECTION_CARD]:    '/sounds/election_card.mp3',
  [SOUNDS.AI_CARD]:          '/sounds/ai_card.mp3',
  [SOUNDS.SPECIAL_POWER]:    '/sounds/special_power.mp3',
  [SOUNDS.REROLL]:           '/sounds/reroll.mp3',
  [SOUNDS.BUDGET_WARNING]:   '/sounds/budget_warning.mp3',
};

// ─── Cache pool ───────────────────────────────────────────────────────────────
// High-frequency sounds (tap, swipe) stay loaded in RAM for instant playback.
// One-shot sounds (game_over, war_start) are loaded lazily and unloaded after
// each play to keep memory footprint small.

const PERSISTENT_KEYS = new Set<SoundKey>([
  SOUNDS.BUTTON_CLICK,
  SOUNDS.CARD_SWIPE_RIGHT,
  SOUNDS.CARD_SWIPE_LEFT,
  SOUNDS.WARNING,
  SOUNDS.BUDGET_WARNING,
]);

const _pool = new Map<SoundKey, Howl>();

function buildHowl(key: SoundKey): Howl {
  return new Howl({
    src:     [SOUND_FILES[key]],
    preload: PERSISTENT_KEYS.has(key), // preload persistent; lazy-load the rest
    html5:   false, // ← Web Audio API backend: bypasses iOS silent switch
    volume:  0.8,
    onloaderror: (_id, err) =>
      console.warn(`[Audio] Load error for "${key}":`, err),
  });
}

function getHowl(key: SoundKey): Howl {
  if (_pool.has(key)) return _pool.get(key)!;
  const howl = buildHowl(key);
  _pool.set(key, howl);
  return howl;
}

// ─── Core play helper ─────────────────────────────────────────────────────────

function play(key: SoundKey): void {
  if (isMuted) return;
  try {
    const howl = getHowl(key);
    howl.play();

    // One-shot sounds: unload after playback to free RAM
    if (!PERSISTENT_KEYS.has(key)) {
      howl.once('end', () => {
        howl.unload();
        _pool.delete(key);
      });
    }
  } catch (e) {
    // Never let audio errors bubble up and interrupt gameplay
    console.warn('[Audio] Playback failed:', e);
  }
}

// ─── Preload API ──────────────────────────────────────────────────────────────
// iOS requires a user-gesture before the AudioContext unlocks. Call this on
// the first user tap so all persistent sounds are decoded and ready.
// Recommended call site: onClick handler on the very first button the user sees.

let _preloaded = false;

export function preloadSounds(): void {
  if (_preloaded) return;
  _preloaded = true;
  PERSISTENT_KEYS.forEach(key => getHowl(key));
}

// ─── Central dispatcher ───────────────────────────────────────────────────────
// Haptic triggers run synchronously alongside audio, mirroring the original
// Web Audio API implementation.

export function playAudio(sound: SoundKey): void {
  switch (sound) {
    case SOUNDS.BUTTON_CLICK:     play(sound); break;
    case SOUNDS.CARD_SWIPE_RIGHT: hapticLight();       play(sound); break;
    case SOUNDS.CARD_SWIPE_LEFT:  hapticLight();       play(sound); break;
    case SOUNDS.GAME_OVER:        hapticError();       play(sound); break;
    case SOUNDS.BRIBE:            hapticMedium();      play(sound); break;
    case SOUNDS.WARNING:          hapticDoubleSharp(); play(sound); break;
    case SOUNDS.WAR_START:        hapticWarStart();    play(sound); break;
    case SOUNDS.ELECTION_CARD:                         play(sound); break;
    case SOUNDS.AI_CARD:                               play(sound); break;
    case SOUNDS.SPECIAL_POWER:                         play(sound); break;
    case SOUNDS.REROLL:                                play(sound); break;
    case SOUNDS.BUDGET_WARNING:                        play(sound); break;
  }
}

// ─── Named convenience exports (backwards-compatible) ─────────────────────────
// Every existing import of these functions continues to work unchanged.

export const playClickSound         = () => playAudio(SOUNDS.BUTTON_CLICK);
export const playSwipeSound         = (dir: 'left' | 'right') =>
  dir === 'right'
    ? playAudio(SOUNDS.CARD_SWIPE_RIGHT)
    : playAudio(SOUNDS.CARD_SWIPE_LEFT);
export const playGameOverSound      = () => playAudio(SOUNDS.GAME_OVER);
export const playBribeSound         = () => playAudio(SOUNDS.BRIBE);
export const playWarningSound       = () => playAudio(SOUNDS.WARNING);
export const playWarStartSound      = () => playAudio(SOUNDS.WAR_START);
export const playElectionCardSound  = () => playAudio(SOUNDS.ELECTION_CARD);
export const playAiCardSound        = () => playAudio(SOUNDS.AI_CARD);
export const playSpecialPowerSound  = () => playAudio(SOUNDS.SPECIAL_POWER);
export const playRerollSound        = () => playAudio(SOUNDS.REROLL);
export const playBudgetWarningSound = () => playAudio(SOUNDS.BUDGET_WARNING);
