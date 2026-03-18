import { useState } from 'react';
import { GameIcon } from '@/components/GameIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import { STORAGE_KEYS } from '@/constants/storage';

interface SettingsMenuProps {
  onMainMenu: () => void;
}

export function SettingsMenu({ onMainMenu }: SettingsMenuProps) {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.SOUND_MUTED) === 'true';
  });

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    localStorage.setItem(STORAGE_KEYS.SOUND_MUTED, String(next));
    window.dispatchEvent(new CustomEvent('sound-mute-toggle', { detail: next }));
  };

  return (
    <div className="relative z-40">
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-muted/60 border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
      >
        <GameIcon name="settings" size={16} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 bg-card border border-border rounded-xl shadow-xl z-40 min-w-[160px] overflow-hidden">
            <button
              onClick={toggleMute}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted/50 transition-colors"
            >
              <GameIcon name={muted ? 'volume_off' : 'volume_on'} size={16} />
              {muted
                ? (lang === 'en' ? 'Unmute Sound' : 'Sesi Aç')
                : (lang === 'en' ? 'Mute Sound' : 'Sesi Kapat')}
            </button>
            <button
              onClick={() => { setOpen(false); onMainMenu(); }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted/50 transition-colors border-t border-border/50"
            >
              <GameIcon name="home" size={16} />
              {lang === 'en' ? 'Main Menu' : 'Ana Menü'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
