/**
 * useSound — thin re-export shim.
 * All synthesis code and the central SOUNDS catalogue live in
 * src/utils/audioManager.ts. Import from there for new code.
 */
export {
  SOUNDS,
  playAudio,
  preloadSounds,
  playMainMenuMusic,
  stopMainMenuMusic,
  isMusicMuted,
  setMusicMuted,
  playClickSound,
  playSwipeSound,
  playGameOverSound,
  playBribeSound,
  playWarningSound,
  playWarStartSound,
  playElectionCardSound,
  playAiCardSound,
  playSpecialPowerSound,
  playRerollSound,
  playBudgetWarningSound,
  getSfxVolume,
  getMusicVolume,
  setSfxVolume,
  setMusicVolume,
} from '@/utils/audioManager';
