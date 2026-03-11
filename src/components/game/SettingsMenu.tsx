import { useState } from 'react';
import { Settings, Volume2, VolumeX, Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SettingsMenuProps {
  onMainMenu: () => void;
}

export function SettingsMenu({ onMainMenu }: SettingsMenuProps) {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(() => {
    return localStorage.getItem('sound-muted') === 'true';
  });

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    localStorage.setItem('sound-muted', String(next));
    // Dispatch event so useSound can listen
    window.dispatchEvent(new CustomEvent('sound-mute-toggle', { detail: next }));
  };

  return (
    <div className="relative z-40">
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-muted/60 border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Settings className="w-4 h-4" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 bg-card border border-border rounded-xl shadow-xl z-40 min-w-[160px] overflow-hidden">
            <button
              onClick={toggleMute}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted/50 transition-colors"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              {muted
                ? (lang === 'en' ? 'Unmute Sound' : 'Sesi Aç')
                : (lang === 'en' ? 'Mute Sound' : 'Sesi Kapat')}
            </button>
            <button
              onClick={() => { setOpen(false); onMainMenu(); }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted/50 transition-colors border-t border-border/50"
            >
              <Home className="w-4 h-4" />
              {lang === 'en' ? 'Main Menu' : 'Ana Menü'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
