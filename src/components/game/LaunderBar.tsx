import { useState } from 'react';
import { EmojiImg } from '@/components/EmojiImg';
import { PowerType } from '@/types/game';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

import factionYatirimcilar from '@/assets/faction-yatirimcilar.jpg';
import factionMafya from '@/assets/faction-mafya.jpg';
import factionTarikat from '@/assets/faction-tarikat.jpg';
import factionOrdu from '@/assets/faction-ordu.jpg';

const LAUNDER_FACTIONS: PowerType[] = ['yatirimcilar', 'mafya', 'tarikat', 'ordu'];

const FACTION_IMAGES: Record<PowerType, string> = {
  yatirimcilar: factionYatirimcilar,
  mafya: factionMafya,
  tarikat: factionTarikat,
  ordu: factionOrdu,
  halk: '',
};

interface LaunderBarProps {
  totalLaundered: number;
  money: number;
  onLaunder: (faction: PowerType) => void;
  canLaunder: boolean;
}

export function LaunderBar({ totalLaundered, money: _money, onLaunder, canLaunder }: LaunderBarProps) {
  const { t, lang } = useLanguage();
  const [showPicker, setShowPicker] = useState(false);

  const handleClick = () => {
    if (!canLaunder) return;
    setShowPicker(true);
  };

  const handleSelect = (faction: PowerType) => {
    onLaunder(faction);
    setShowPicker(false);
  };

  return (
    <div className="w-full max-w-md mx-auto px-3 py-1 relative">
      <div className="flex items-center gap-3">
        <button
          onClick={handleClick}
          disabled={!canLaunder}
          className={cn(
            "text-sm font-bold px-4 py-2 rounded-xl transition-all whitespace-nowrap shrink-0",
            canLaunder
              ? "bg-emerald-600/80 text-white hover:bg-emerald-500 cursor-pointer active:scale-95"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          <EmojiImg emoji="🧼" size={15} /> {lang === 'tr' ? 'Akla' : 'Launder'} (-30B)
        </button>

        <div className="flex-1 h-7 bg-muted/50 rounded-full overflow-hidden border border-border/50 relative">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(totalLaundered, 100)}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-foreground">
            <EmojiImg emoji="💸" size={12} /> {totalLaundered}B {lang === 'tr' ? 'aklandı' : 'laundered'}
          </span>
        </div>
      </div>

      {/* Faction picker modal */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl p-5 mx-4 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="mb-2"><EmojiImg emoji="🧼" size={28} /></div>
            <h3 className="text-lg font-bold text-foreground mb-1">
              {lang === 'tr' ? 'Kimin üzerinden aklayalım?' : 'Launder through whom?'}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              {lang === 'tr'
                ? '20B aklanır. Seçtiğin zümre +10 rep, diğer 3 grup -5 rep, Halk -10 rep.'
                : '20B laundered. Selected faction +10 rep, other 3 get -5 rep, Public -10 rep.'}
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
                  <span className="text-xs text-emerald-500">+10 rep</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowPicker(false)}
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
