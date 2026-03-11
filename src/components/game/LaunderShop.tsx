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

  if (totalLaundered <= 0) return null;

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
    <div className="w-full max-w-md mx-auto px-4 mt-1">
      <div className="text-[10px] text-muted-foreground text-center mb-1.5">
        <EmojiImg emoji="💸" size={12} className="mr-0.5" /> {lang === 'tr' ? 'Aklanmış para' : 'Laundered funds'}: <span className="font-bold text-emerald-400">{totalLaundered}B</span>
      </div>

      <div className="flex gap-2">
        {/* Propaganda */}
        <button
          onClick={onPropaganda}
          disabled={!canPropaganda}
          className={cn(
            "flex-1 rounded-xl py-3 text-center transition-all",
            canPropaganda
              ? "bg-primary/80 hover:bg-primary cursor-pointer"
              : "bg-muted/40 cursor-not-allowed opacity-50"
          )}
        >
          <div className="text-lg"><EmojiImg emoji="📢" size={20} /></div>
          <div className="text-[10px] font-bold text-primary-foreground">
            {lang === 'tr' ? 'Propaganda' : 'Propaganda'}
          </div>
          <div className="text-[8px] text-primary-foreground/70">
            {lang === 'tr' ? 'Halk +10 rep' : 'Public +10 rep'}
          </div>
          <div className="text-[10px] font-bold text-primary-foreground mt-0.5">-{propagandaCost}B</div>
        </button>

        {/* Gizli İttifak */}
        <button
          onClick={() => setShowAlliance(true)}
          disabled={!canAlliance}
          className={cn(
            "flex-1 rounded-xl py-3 text-center transition-all",
            canAlliance
              ? "bg-accent/80 hover:bg-accent cursor-pointer"
              : "bg-muted/40 cursor-not-allowed opacity-50"
          )}
        >
          <div className="text-lg"><EmojiImg emoji="🤝" size={20} /></div>
          <div className="text-[10px] font-bold text-accent-foreground">
            {lang === 'tr' ? 'İttifak' : 'Alliance'}
          </div>
          <div className="text-[8px] text-accent-foreground/70">
            {lang === 'tr' ? '2 zümre +8 rep' : '2 factions +8 rep'}
          </div>
          <div className="text-[10px] font-bold text-accent-foreground mt-0.5">-{allianceCost}B</div>
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
                    "flex flex-col items-center gap-1 p-2 rounded-xl border transition-all cursor-pointer",
                    alliancePick.includes(faction)
                      ? "border-blue-500 bg-blue-500/20 ring-2 ring-blue-500"
                      : "border-border/50 bg-background hover:bg-primary/10 hover:border-primary"
                  )}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border/50">
                    <img src={FACTION_IMAGES[faction]} alt={t(`power.${faction}`)} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[9px] font-bold text-foreground">{t(`power.${faction}`)}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => { setShowAlliance(false); setAlliancePick([]); }}
              className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {lang === 'tr' ? 'Vazgeç' : 'Cancel'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
