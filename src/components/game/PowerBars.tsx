import { PowerState, PowerType } from '@/types/game';
import { PowerEffect, BRIBE_COSTS } from '@/types/game';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { playBribeSound } from '@/hooks/useSound';

import factionHalk from '@/assets/faction-halk.png';
import factionYatirimcilar from '@/assets/faction-yatirimcilar.png';
import factionMafya from '@/assets/faction-mafya.png';
import factionTarikat from '@/assets/faction-tarikat.png';
import factionOrdu from '@/assets/faction-ordu.png';

const FACTION_IMAGES: Record<PowerType, string> = {
  halk: factionHalk,
  yatirimcilar: factionYatirimcilar,
  mafya: factionMafya,
  tarikat: factionTarikat,
  ordu: factionOrdu,
};

interface PowerBarsProps {
  power: PowerState;
  activeEffects?: PowerEffect[];
  money?: number;
  lastMoneyChange?: number | null;
  onBribe?: (faction: PowerType) => void;
  canBribe?: (faction: PowerType) => boolean;
  getBribeCost?: (faction: PowerType) => number;
}

export function PowerBars({ power, activeEffects = [], money = 0, lastMoneyChange, onBribe, canBribe, getBribeCost }: PowerBarsProps) {
  const { t, lang } = useLanguage();
  const powers: PowerType[] = ['halk', 'yatirimcilar', 'mafya', 'tarikat', 'ordu'];
  const [showBribe, setShowBribe] = useState<PowerType | null>(null);

  const getBarGradient = (value: number) => {
    if (value <= 15) return 'linear-gradient(to top, #ef4444, #f97316)';
    if (value <= 30) return 'linear-gradient(to top, #f97316, #eab308)';
    if (value <= 50) return 'linear-gradient(to top, #eab308, #22c55e)';
    if (value <= 70) return 'linear-gradient(to top, #22c55e, #14b8a6)';
    if (value <= 85) return 'linear-gradient(to top, #14b8a6, #06b6d4)';
    return 'linear-gradient(to top, #06b6d4, #0ea5e9)';
  };

  const isAffected = (p: PowerType) => activeEffects.some(e => e.power === p);
  const getEffectDirection = (p: PowerType) => {
    const effect = activeEffects.find(e => e.power === p);
    if (!effect) return null;
    return effect.amount > 0 ? 'up' : 'down';
  };

  const bribeTexts: Record<PowerType, Record<string, string>> = {
    halk: { tr: '🎁 Halka yardım paketi gönder', en: '🎁 Send aid package to the people' },
    yatirimcilar: { tr: '💎 Vergi indirimi teklif et', en: '💎 Offer tax breaks' },
    mafya: { tr: '💵 Zarfı masanın altından uzat', en: '💵 Slide the envelope under the table' },
    tarikat: { tr: '🕌 Vakfa bağış yap', en: '🕌 Donate to the foundation' },
    ordu: { tr: '🎖️ Yeni silah sözleşmesi imzala', en: '🎖️ Sign new arms contract' },
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Money display */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-2xl">💰</span>
        <span className="text-xl font-black text-foreground">{money}B</span>
        {lastMoneyChange !== null && lastMoneyChange !== undefined && (
          <span className={cn(
            "text-sm font-bold animate-bounce",
            lastMoneyChange > 0 ? 'text-emerald-500' : 'text-red-500'
          )}>
            {lastMoneyChange > 0 ? '+' : ''}{lastMoneyChange}B
          </span>
        )}
      </div>

      <div className="flex justify-between gap-1.5 sm:gap-3 px-2 sm:px-4 py-3">
        {powers.map((p) => {
          const val = power[p];
          const affected = isAffected(p);
          const dir = getEffectDirection(p);
          const cost = getBribeCost ? getBribeCost(p) : 0;
          const canDo = canBribe ? canBribe(p) : false;

          return (
            <div key={p} className="flex flex-col items-center gap-1 flex-1 min-w-0">
              {/* Faction head with mouth animation */}
              <button
                onClick={() => setShowBribe(showBribe === p ? null : p)}
                className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 transition-all duration-300",
                  affected ? "scale-110 border-primary" : "border-border/50",
                  "hover:scale-110 hover:border-primary cursor-pointer",
                  showBribe === p && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                )}
              >
                <img
                  src={FACTION_IMAGES[p]}
                  alt={t(`power.${p}`)}
                  className={cn(
                    "w-full h-full object-cover",
                    affected && "faction-talking"
                  )}
                />
              </button>

              {/* Power bar */}
              <div className="w-full h-16 sm:h-20 bg-muted/50 rounded-full relative overflow-hidden border border-border/50">
                <div
                  className="absolute bottom-0 w-full rounded-full transition-all duration-500 ease-out"
                  style={{ height: `${val}%`, background: getBarGradient(val) }}
                />
                {affected && (
                  <div className={cn(
                    "absolute inset-0 rounded-full animate-pulse",
                    dir === 'up' ? 'bg-emerald-400/30' : 'bg-red-400/30'
                  )} />
                )}
              </div>

              <span className="text-[9px] sm:text-xs font-medium text-muted-foreground truncate w-full text-center">
                {t(`power.${p}`)}
              </span>
              {val >= 100 && (
                <span className="text-[8px] sm:text-[10px] font-bold text-cyan-400 animate-pulse">
                  +2B/tur
                </span>
              )}

              {/* Bribe popup */}
              {showBribe === p && (
                <div className="absolute mt-28 sm:mt-32 z-20 bg-card border-2 border-border rounded-xl p-2 shadow-xl min-w-[140px] text-center animate-fade-in">
                  <p className="text-[10px] text-muted-foreground mb-1">
                    {bribeTexts[p][lang]}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onBribe && canDo) {
                        playBribeSound();
                        onBribe(p);
                        setShowBribe(null);
                      }
                    }}
                    disabled={!canDo}
                    className={cn(
                      "text-xs font-bold px-3 py-1 rounded-lg transition-colors w-full",
                      canDo
                        ? "bg-primary text-primary-foreground hover:opacity-90"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    {cost}B → +{10} rep
                  </button>
                  {!canDo && (
                    <p className="text-[9px] text-destructive mt-1">
                      {money < cost
                        ? (lang === 'tr' ? 'Paran yetmez reis 😅' : 'Not enough cash boss 😅')
                        : (lang === 'tr' ? 'Zaten çok seviliyorsun 😎' : 'Already loved too much 😎')
                      }
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
