import { useState } from 'react';
import { EmojiImg } from '@/components/EmojiImg';
import { PowerType } from '@/types/game';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { playClickSound } from '@/hooks/useSound';

import { GameImages } from '@/config/assets';

const LAUNDER_FACTIONS: PowerType[] = ['yatirimcilar', 'mafya', 'tarikat', 'ordu'];

const FACTION_IMAGES: Record<PowerType, string> = {
  yatirimcilar: GameImages.faction_yatirimcilar,
  mafya:        GameImages.faction_mafya,
  tarikat:      GameImages.faction_tarikat,
  ordu:         GameImages.faction_ordu,
  halk:         '',
};

interface LaunderBarProps {
  totalLaundered: number;
  money: number;
  onLaunder: (faction: PowerType) => void;
  canLaunder: boolean;
  offshoreRate?: number;
  launderOutput?: number;
}

export function LaunderBar({ totalLaundered, money: _money, onLaunder, canLaunder, offshoreRate = 0, launderOutput = 20 }: LaunderBarProps) {
  const { t, lang } = useLanguage();
  const [showPicker, setShowPicker] = useState(false);

  const handleClick = () => {
    if (!canLaunder) return;
    playClickSound();
    setShowPicker(true);
  };

  const handleSelect = (faction: PowerType) => {
    playClickSound();
    onLaunder(faction);
    setShowPicker(false);
  };

  return (
    <div className="w-full max-w-md mx-auto px-3 py-1 relative">
      <div className="flex items-stretch gap-3">
        <button
          onClick={handleClick}
          disabled={!canLaunder}
          className={cn(
            "shrink-0 text-sm font-bold px-4 py-2 rounded-xl transition-all",
            canLaunder
              ? "bg-game-success/80 text-primary-foreground hover:bg-game-success cursor-pointer active:scale-95"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {lang === 'tr' ? 'Akla' : 'Launder'} (-30B)
        </button>

        <div className="flex-1 bg-muted/50 rounded-full overflow-hidden border border-border/50 relative">
          <div
            className="h-full bg-gradient-to-r from-game-success to-game-success-light rounded-full transition-all duration-500"
            style={{ width: `${Math.min(totalLaundered, 100)}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground gap-1">
            <EmojiImg emoji="💸" size={14} /> {totalLaundered}B
            {offshoreRate > 0 && Math.floor(totalLaundered * offshoreRate) > 0 && (
              <span className="text-game-success-light text-xs">
                (+{Math.floor(totalLaundered * offshoreRate)}/t)
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Faction picker modal */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-game-overlay/70 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl p-5 mx-4 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="mb-2"><EmojiImg emoji="🧼" size={28} /></div>
            <h3 className="text-lg font-bold text-foreground mb-1">
              {lang === 'tr' ? 'Kimin üzerinden aklayalım?' : 'Launder through whom?'}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              {lang === 'tr'
                ? `${launderOutput}B aklanır. Seçtiğin zümre +10 rep, diğer 3 grup -5 rep, Halk -10 rep.`
                : `${launderOutput}B laundered. Selected faction +10 rep, other 3 get -5 rep, Public -10 rep.`}
            </p>

            <div className="grid grid-cols-2 gap-3">
              {LAUNDER_FACTIONS.map((faction) => (
                <button
                  key={faction}
                  onClick={() => handleSelect(faction)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border/50 bg-background hover:bg-primary/10 hover:border-primary transition-all cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-border/50">
                    <img src={FACTION_IMAGES[faction]} alt={t(`power.${faction}`)} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm font-bold text-foreground">{t(`power.${faction}`)}</span>
                  <span className="text-xs text-game-success">+10 rep</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => { playClickSound(); setShowPicker(false); }}
              className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              {lang === 'tr' ? 'Vazgeç' : 'Cancel'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
