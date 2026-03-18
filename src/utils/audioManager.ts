import { hapticWarStart, hapticDoubleSharp, hapticError, hapticLight, hapticMedium } from '@/hooks/useHaptics';
import { STORAGE_KEYS } from '@/constants/storage';

// ─── AudioContext singleton ────────────────────────────────────────────────
let audioCtx: AudioContext | null = null;
let isMuted = localStorage.getItem(STORAGE_KEYS.SOUND_MUTED) === 'true';

if (typeof window !== 'undefined') {
  window.addEventListener('sound-mute-toggle', ((e: CustomEvent) => {
    isMuted = e.detail;
  }) as EventListener);
}

function getAudioCtx(): AudioContext | null {
  if (isMuted) return null;
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

// ─── Sound catalogue ──────────────────────────────────────────────────────
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

// ─── Synthesizers (private) ──────────────────────────────────────────────
function _playButtonClick() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const bufferSize = Math.floor(ctx.sampleRate * 0.015);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 8);
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 3000;
    const gain = ctx.createGain();
    gain.gain.value = 0.4;
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
  } catch { /* silent */ }
}

function _playCardSwipe(direction: 'left' | 'right') {
  hapticLight();
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.12;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(direction === 'right' ? 800 : 600, now);
    filter.frequency.exponentialRampToValueAtTime(direction === 'right' ? 2000 : 400, now + 0.1);
    filter.Q.value = 1.5;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.15);
  } catch { /* silent */ }
}

function _playGameOver() {
  hapticError();
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.6);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.7);
  } catch { /* silent */ }
}

function _playBribe() {
  hapticMedium();
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2800, now);
    osc.frequency.exponentialRampToValueAtTime(3200, now + 0.04);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
    const bufferSize = ctx.sampleRate * 0.12;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 3500;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.08, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.12);
  } catch { /* silent */ }
}

function _playWarning() {
  hapticDoubleSharp();
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    [0, 0.2].forEach((offset) => {
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, now + offset);
      osc.frequency.setValueAtTime(660, now + offset + 0.1);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.18);
    });
  } catch { /* silent */ }
}

function _playWarStart() {
  hapticWarStart();
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const drum1 = ctx.createOscillator();
    drum1.type = 'sine';
    drum1.frequency.setValueAtTime(80, now);
    drum1.frequency.exponentialRampToValueAtTime(40, now + 0.3);
    const drumGain1 = ctx.createGain();
    drumGain1.gain.setValueAtTime(0.35, now);
    drumGain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    drum1.connect(drumGain1);
    drumGain1.connect(ctx.destination);
    drum1.start(now);
    drum1.stop(now + 0.3);
    const drum2 = ctx.createOscillator();
    drum2.type = 'sine';
    drum2.frequency.setValueAtTime(90, now + 0.2);
    drum2.frequency.exponentialRampToValueAtTime(35, now + 0.5);
    const drumGain2 = ctx.createGain();
    drumGain2.gain.setValueAtTime(0.4, now + 0.2);
    drumGain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    drum2.connect(drumGain2);
    drumGain2.connect(ctx.destination);
    drum2.start(now + 0.2);
    drum2.stop(now + 0.5);
    const riser = ctx.createOscillator();
    riser.type = 'sawtooth';
    riser.frequency.setValueAtTime(100, now);
    riser.frequency.exponentialRampToValueAtTime(300, now + 0.5);
    const riserGain = ctx.createGain();
    riserGain.gain.setValueAtTime(0.08, now);
    riserGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    riser.connect(riserGain);
    riserGain.connect(ctx.destination);
    riser.start(now);
    riser.stop(now + 0.5);
  } catch { /* silent */ }
}

function _playElectionCard() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(900, now + 0.05);
    osc2.frequency.exponentialRampToValueAtTime(1600, now + 0.18);
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.08, now + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.05);
    osc2.stop(now + 0.2);
  } catch { /* silent */ }
}

function _playAiCard() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.4);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.4);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);
  } catch { /* silent */ }
}

function _playSpecialPower() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.3);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1200, now + 0.1);
    osc2.frequency.exponentialRampToValueAtTime(2400, now + 0.25);
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.1, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.3);
  } catch { /* silent */ }
}

function _playReroll() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const t = now + i * 0.06;
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1800 + i * 400, t);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.05);
    }
  } catch { /* silent */ }
}

function _playBudgetWarning() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, now);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  } catch { /* silent */ }
}

// ─── Central dispatcher ───────────────────────────────────────────────────
export function playAudio(sound: SoundKey): void {
  switch (sound) {
    case SOUNDS.BUTTON_CLICK:     return _playButtonClick();
    case SOUNDS.CARD_SWIPE_RIGHT: return _playCardSwipe('right');
    case SOUNDS.CARD_SWIPE_LEFT:  return _playCardSwipe('left');
    case SOUNDS.GAME_OVER:        return _playGameOver();
    case SOUNDS.BRIBE:            return _playBribe();
    case SOUNDS.WARNING:          return _playWarning();
    case SOUNDS.WAR_START:        return _playWarStart();
    case SOUNDS.ELECTION_CARD:    return _playElectionCard();
    case SOUNDS.AI_CARD:          return _playAiCard();
    case SOUNDS.SPECIAL_POWER:    return _playSpecialPower();
    case SOUNDS.REROLL:           return _playReroll();
    case SOUNDS.BUDGET_WARNING:   return _playBudgetWarning();
  }
}

// ─── Named convenience exports (backwards-compatible) ────────────────────
export const playClickSound        = ()                          => playAudio(SOUNDS.BUTTON_CLICK);
export const playSwipeSound        = (dir: 'left' | 'right')    => dir === 'right' ? playAudio(SOUNDS.CARD_SWIPE_RIGHT) : playAudio(SOUNDS.CARD_SWIPE_LEFT);
export const playGameOverSound     = ()                          => playAudio(SOUNDS.GAME_OVER);
export const playBribeSound        = ()                          => playAudio(SOUNDS.BRIBE);
export const playWarningSound      = ()                          => playAudio(SOUNDS.WARNING);
export const playWarStartSound     = ()                          => playAudio(SOUNDS.WAR_START);
export const playElectionCardSound = ()                          => playAudio(SOUNDS.ELECTION_CARD);
export const playAiCardSound       = ()                          => playAudio(SOUNDS.AI_CARD);
export const playSpecialPowerSound = ()                          => playAudio(SOUNDS.SPECIAL_POWER);
export const playRerollSound       = ()                          => playAudio(SOUNDS.REROLL);
export const playBudgetWarningSound= ()                          => playAudio(SOUNDS.BUDGET_WARNING);
