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

// ─── Volume levels ─────────────────────────────────────────────────────────────
let _sfxVolume = (() => {
  const v = parseFloat(localStorage.getItem(STORAGE_KEYS.SFX_VOLUME) ?? '');
  return isNaN(v) ? 0.8 : Math.max(0, Math.min(1, v));
})();

let _musicVolume = (() => {
  const v = parseFloat(localStorage.getItem(STORAGE_KEYS.MUSIC_VOLUME) ?? '');
  return isNaN(v) ? 0.5 : Math.max(0, Math.min(1, v));
})();

// ─── Mute state ───────────────────────────────────────────────────────────────
// Mirrors the existing isMuted/localStorage + CustomEvent pattern.

let isMuted = localStorage.getItem(STORAGE_KEYS.SOUND_MUTED) === 'true';

// NOTE: Do NOT call Howler.volume() here at module load.
// On iOS WKWebView, any Howler API that touches AudioContext outside a user
// gesture creates a suspended context that can never be resumed — causing
// permanent silence. We defer all AudioContext work to the first touchstart.

// Shared helper: apply mute state and broadcast to all listeners
function _applyMute(muted: boolean): void {
  isMuted = muted;
  Howler.volume(muted ? 0 : 1);
  localStorage.setItem(STORAGE_KEYS.SOUND_MUTED, String(muted));
  window.dispatchEvent(new CustomEvent('sound-mute-toggle', { detail: muted }));
}

if (typeof window !== 'undefined') {
  window.addEventListener('sound-mute-toggle', ((e: CustomEvent) => {
    isMuted = e.detail as boolean;
    Howler.volume(isMuted ? 0 : 1);
  }) as EventListener);

  // ── iOS AudioContext lifecycle ────────────────────────────────────────────
  //
  // iOS rule: AudioContext must be created AND resumed inside a user gesture.
  //
  // _needsReinit: set by visibilitychange (background→foreground).
  //   The actual reinit runs on the next touchstart (gesture context).
  //
  // _audioUnlocked: false until the very first touchstart. On that first
  //   touch we create the AudioContext inside the gesture so iOS starts it
  //   in 'running' state instead of 'suspended'.

  let _needsReinit = false;
  let _audioUnlocked = false;

  const _doReinit = (): void => {
    const wasPlayingMusic = !!_musicHowl;
    if (_musicHowl) { _musicHowl.stop(); _musicHowl.unload(); _musicHowl = null; }
    _musicLoading = false;
    _musicGen++;
    Howler.unload();
    _pool.clear();
    _preloaded = false;

    const newCtx = Howler.ctx;
    if (newCtx && newCtx.state !== 'running') {
      newCtx.resume().then(() => { Howler.volume(isMuted ? 0 : 1); }).catch(() => {});
    } else {
      Howler.volume(isMuted ? 0 : 1);
    }

    preloadSounds();
    if (wasPlayingMusic) playMainMenuMusic();
  };

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      _needsReinit = true;
    }
  });

  document.addEventListener('touchstart', () => {
    if (_needsReinit) {
      _needsReinit = false;
      _doReinit();
      return;
    }

    // First-ever touch: unlock AudioContext inside gesture so iOS allows it.
    if (!_audioUnlocked) {
      _audioUnlocked = true;
      if (!_preloaded) preloadSounds(); // creates Howl instances → Howler creates AudioContext here
      Howler.volume(isMuted ? 0 : 1);
      const ctx = Howler.ctx;
      if (ctx && ctx.state !== 'running') {
        ctx.resume().catch(() => {});
      }
      return;
    }

    // Subsequent touches: just ensure context is still running
    const ctx = Howler.ctx;
    if (ctx && ctx.state !== 'running') {
      ctx.resume().catch(() => {});
    }
  }, { passive: true });
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

// All sounds are persistent — 12 small MP3s (~28 KB each ≈ 336 KB total) is
// negligible on mobile. Lazy-loading causes iOS async-decode failures outside
// the gesture context, so we preload everything up front.
const PERSISTENT_KEYS = new Set<SoundKey>(Object.values(SOUNDS));

const _pool = new Map<SoundKey, Howl>();

function buildHowl(key: SoundKey): Howl {
  return new Howl({
    src:     [SOUND_FILES[key]],
    preload: PERSISTENT_KEYS.has(key), // preload persistent; lazy-load the rest
    html5:   false, // ← Web Audio API backend: bypasses iOS silent switch
    volume:  _sfxVolume,
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
    const ctx = Howler.ctx;
    const doPlay = () => {
      try {
        const howl = getHowl(key);
        howl.play();
        if (!PERSISTENT_KEYS.has(key)) {
          howl.once('end', () => { howl.unload(); _pool.delete(key); });
        }
      } catch (e) {
        console.warn('[Audio] Playback failed:', e);
      }
    };

    // If the AudioContext is suspended (e.g. after iOS background), resume it
    // first and play only after the context is running. Without this, sounds
    // fired on the same tick as the first touchstart after backgrounding are
    // silently dropped even though ctx.resume() was called — because resume()
    // is async and the context is still suspended when howl.play() executes.
    if (ctx && ctx.state !== 'running') {
      ctx.resume().then(doPlay).catch(() => {});
    } else {
      doPlay();
    }
  } catch (e) {
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

// ─── Main Menu Music ──────────────────────────────────────────────────────────
// Looping background track for the start screen. Shares the global mute state.
// Uses a sprite-based loop to eliminate the ~500ms gap that MP3 loop: true produces
// (the gap comes from trailing silence in the encoded file).

let _musicHowl: Howl | null = null;
let _musicLoading = false;
let _musicGen = 0; // incremented on stop to cancel in-flight probe

export function isMusicMuted(): boolean {
  return isMuted;
}

export function setMusicMuted(muted: boolean): void {
  _applyMute(muted);
}

export function playMainMenuMusic(): void {
  if (_musicHowl || _musicLoading) return;
  _musicLoading = true;
  const gen = ++_musicGen;
  const src = ['/sounds/main_menu.mp3'];

  // Step 1: silent probe to measure the exact audio duration
  const probe = new Howl({
    src,
    html5: false,
    volume: 0,
    onload: function () {
      const durationMs = Math.floor(probe.duration() * 1000);
      probe.unload();
      _musicLoading = false;
      if (gen !== _musicGen) return; // stopMainMenuMusic was called — abort

      // Step 2: create the real Howl with a sprite that trims trailing silence
      // Trimming 500 ms from the end removes the encoder/fade-out gap on loop.
      const loopEnd = Math.max(1000, durationMs - 500);
      _musicHowl = new Howl({
        src,
        html5: false,
        volume: _musicVolume,
        sprite: { main: [0, loopEnd, true] },
        onloaderror: (_id, err) => console.warn('[Audio] Music load error:', err),
      });
      _musicHowl.play('main'); // Howler global volume handles muting
    },
    onloaderror: (_id, err) => {
      _musicLoading = false;
      console.warn('[Audio] Music probe error:', err);
    },
  });
}

export function stopMainMenuMusic(): void {
  _musicGen++;       // invalidate any in-flight probe
  _musicLoading = false;
  if (!_musicHowl) return;
  _musicHowl.stop();
  _musicHowl.unload();
  _musicHowl = null;
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

// ─── Volume control exports ────────────────────────────────────────────────────
export function getSfxVolume(): number { return _sfxVolume; }
export function getMusicVolume(): number { return _musicVolume; }

export function setSfxVolume(vol: number): void {
  _sfxVolume = Math.max(0, Math.min(1, vol));
  localStorage.setItem(STORAGE_KEYS.SFX_VOLUME, String(_sfxVolume));
  _pool.forEach(howl => howl.volume(_sfxVolume));
}

export function setMusicVolume(vol: number): void {
  _musicVolume = Math.max(0, Math.min(1, vol));
  localStorage.setItem(STORAGE_KEYS.MUSIC_VOLUME, String(_musicVolume));
  if (_musicHowl) _musicHowl.volume(_musicVolume);
}
