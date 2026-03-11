import { useState } from 'react';
import { EmojiImg } from '@/components/EmojiImg';
import { PowerType } from '@/types/game';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

import factionHalk from '@/assets/faction-halk.jpg';
import factionYatirimcilar from '@/assets/faction-yatirimcilar.jpg';
import factionMafya from '@/assets/faction-mafya.jpg';
import factionTarikat from '@/assets/faction-tarikat.jpg';
import factionOrdu from '@/assets/faction-ordu.jpg';

const FACTION_IMAGES: Record<PowerType, string> = {
  halk: factionHalk,
  yatirimcilar: factionYatirimcilar,
  mafya: factionMafya,
  tarikat: factionTarikat,
  ordu: factionOrdu,
};

const ALL_FACTIONS: PowerType[] = ['halk', 'yatirimcilar', 'mafya', 'tarikat', 'ordu'];

interface LaunderShopProps {
  totalLaundered: number;
  lastShopResult: string | null;
  onPropaganda: () => void;
  canPropaganda: boolean;
  propagandaCost: number;
  onAlliance: (f1: PowerType, f2: PowerType) => void;
  canAlliance: boolean;
  allianceCost: number;
}

export function LaunderShop({
  totalLaundered,
  lastShopResult,
  onPropaganda, canPropaganda, propagandaCost,
  onAlliance, canAlliance, allianceCost,
}: LaunderShopProps) {
  const { t, lang } = useLanguage();
  const [showAlliance, setShowAlliance] = useState(false);
  const [alliancePick, setAlliancePick] = useState<PowerType[]>([]);

  // Always show, but disable buttons if no laundered money

  const handleAlliancePick = (f: PowerType) => {
    if (alliancePick.includes(f)) {
      setAlliancePick(alliancePick.filter(x => x !== f));
    } else if (alliancePick.length < 2) {
      const next = [...alliancePick, f];
      if (next.length === 2) {
        onAlliance(next[0], next[1]);
        setAlliancePick([]);
        setShowAlliance(false);
      } else {
        setAlliancePick(next);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-3 py-1.5">
      <div className="flex gap-2">
        {/* Propaganda */}
        <button
          onClick={onPropaganda}
          disabled={!canPropaganda}
          className={cn(
            "flex-1 flex items-center gap-2 rounded-xl px-3 py-2 transition-all",
            canPropaganda
              ? "bg-primary/80 hover:bg-primary cursor-pointer"
              : "bg-foreground/20 cursor-not-allowed opacity-60"
          )}
        >
          <EmojiImg emoji="📢" size={20} />
          <div className="text-left">
            <span className={cn("text-xs font-bold", canPropaganda ? "text-primary-foreground" : "text-foreground")}>
              {lang === 'tr' ? 'Propaganda' : 'Propaganda'}
            </span>
            <span className={cn("text-[10px] ml-1", canPropaganda ? "text-primary-foreground/70" : "text-foreground/50")}>
              {lang === 'tr' ? 'Halk +10' : 'Public +10'}
            </span>
          </div>
          <span className={cn("text-[10px] font-bold ml-auto", canPropaganda ? "text-primary-foreground" : "text-foreground/50")}>-{propagandaCost}B</span>
        </button>

        {/* Gizli İttifak */}
        <button
          onClick={() => setShowAlliance(true)}
          disabled={!canAlliance}
          className={cn(
            "flex-1 flex items-center gap-2 rounded-xl px-3 py-2 transition-all",
            canAlliance
              ? "bg-accent/80 hover:bg-accent cursor-pointer"
              : "bg-foreground/20 cursor-not-allowed opacity-60"
          )}
        >
          <EmojiImg emoji="🤝" size={20} />
          <div className="text-left">
            <span className={cn("text-xs font-bold", canAlliance ? "text-accent-foreground" : "text-foreground")}>
              {lang === 'tr' ? 'İttifak' : 'Alliance'}
            </span>
            <span className={cn("text-[10px] ml-1", canAlliance ? "text-accent-foreground/70" : "text-foreground/50")}>
              {lang === 'tr' ? '2 zümre +8' : '2 factions +8'}
            </span>
          </div>
          <span className={cn("text-[10px] font-bold ml-auto", canAlliance ? "text-accent-foreground" : "text-foreground/50")}>-{allianceCost}B</span>
        </button>
      </div>

      {/* Alliance picker modal */}
      {showAlliance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl p-5 mx-4 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="mb-2"><EmojiImg emoji="🤝" size={28} /></div>
            <h3 className="text-lg font-bold text-foreground mb-1">
              {lang === 'tr' ? '2 zümre seç' : 'Pick 2 factions'}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              {lang === 'tr'
                ? `Her biri +8 rep alır. (${alliancePick.length}/2 seçildi)`
                : `Each gets +8 rep. (${alliancePick.length}/2 selected)`}
            </p>

            <div className="grid grid-cols-3 gap-3">
              {ALL_FACTIONS.map((faction) => (
                <button
                  key={faction}
                  onClick={() => handleAlliancePick(faction)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all cursor-pointer",
                    alliancePick.includes(faction)
                      ? "border-blue-500 bg-blue-500/20 ring-2 ring-blue-500"
                      : "border-border/50 bg-background hover:bg-primary/10 hover:border-primary"
                  )}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border/50">
                    <img src={FACTION_IMAGES[faction]} alt={t(`power.${faction}`)} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-bold text-foreground">{t(`power.${faction}`)}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => { setShowAlliance(false); setAlliancePick([]); }}
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
