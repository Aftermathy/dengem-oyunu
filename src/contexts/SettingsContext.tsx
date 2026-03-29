import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { STORAGE_KEYS } from '@/constants/storage';
import { setSfxVolume as audioSetSfx, setMusicVolume as audioSetMusic } from '@/utils/audioManager';

interface SettingsContextType {
  musicVolume: number;
  sfxVolume: number;
  showFactionPercentages: boolean;
  setMusicVolume: (v: number) => void;
  setSfxVolume: (v: number) => void;
  setShowFactionPercentages: (v: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  musicVolume: 0.5,
  sfxVolume: 0.8,
  showFactionPercentages: false,
  setMusicVolume: () => {},
  setSfxVolume: () => {},
  setShowFactionPercentages: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [musicVolume, _setMusicVolume] = useState(() => {
    const v = parseFloat(localStorage.getItem(STORAGE_KEYS.MUSIC_VOLUME) ?? '');
    return isNaN(v) ? 0.5 : Math.max(0, Math.min(1, v));
  });
  const [sfxVolume, _setSfxVolume] = useState(() => {
    const v = parseFloat(localStorage.getItem(STORAGE_KEYS.SFX_VOLUME) ?? '');
    return isNaN(v) ? 0.8 : Math.max(0, Math.min(1, v));
  });
  const [showFactionPercentages, _setShowFactionPercentages] = useState(
    () => localStorage.getItem(STORAGE_KEYS.SHOW_FACTION_PCT) === 'true'
  );

  const setMusicVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    _setMusicVolume(clamped);
    audioSetMusic(clamped);
  }, []);

  const setSfxVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    _setSfxVolume(clamped);
    audioSetSfx(clamped);
  }, []);

  const setShowFactionPercentages = useCallback((v: boolean) => {
    _setShowFactionPercentages(v);
    localStorage.setItem(STORAGE_KEYS.SHOW_FACTION_PCT, String(v));
  }, []);

  return (
    <SettingsContext.Provider value={{
      musicVolume, sfxVolume, showFactionPercentages,
      setMusicVolume, setSfxVolume, setShowFactionPercentages,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
