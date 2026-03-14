import { PowerState, PowerType } from '@/types/game';
import { PowerEffect } from '@/types/game';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import { playBribeSound } from '@/hooks/useSound';
import { EmojiImg, EmojiText } from '@/components/EmojiImg';

import factionHalk from '@/assets/faction-halk.jpg';
import factionYatirimcilar from '@/assets/faction-yatirimcilar.jpg';
import factionMafya from '@/assets/faction-mafya.jpg';
import factionTarikat from '@/assets/faction-tarikat.jpg';
import factionOrdu from '@/assets/faction-ordu.jpg';
import { getRandomBribeText } from '@/data/bribeTexts';

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
  projectedMoney?: number | null;
  onBribe?: (faction: PowerType) => void;
  canBribe?: (faction: PowerType) => boolean;
  getBribeCost?: (faction: PowerType) => number;
  isFirstSeenCard?: boolean;
}

export function PowerBars({ power, activeEffects = [], money = 0, lastMoneyChange, projectedMoney, onBribe, canBribe, getBribeCost, isFirstSeenCard = false }: PowerBarsProps) {
  const { t, lang } = useLanguage();
  const powers: PowerType[] = ['halk', 'yatirimcilar', 'mafya', 'tarikat', 'ordu'];
  const [showPercent, setShowPercent] = useState<PowerType | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [repChanges, setRepChanges] = useState<Record<PowerType, number | null>>({ halk: null, yatirimcilar: null, mafya: null, tarikat: null, ordu: null });
  const prevPowerRef = useRef<PowerState>(power);
  const changeKeyRef = useRef(0);
  const [changeKey, setChangeKey] = useState(0);
  
  const [bribeFeedback, setBribeFeedback] = useState<{ faction: PowerType; text: string; cost: number; gain: number } | null>(null);

  useEffect(() => {
    const prev = prevPowerRef.current;
    const changes: Record<PowerType, number | null> = { halk: null, yatirimcilar: null, mafya: null, tarikat: null, ordu: null };
    let hasChange = false;
    for (const key of powers) {
      const diff = power[key] - prev[key];
      if (diff !== 0) {
        changes[key] = diff;
        hasChange = true;
      }
    }
    prevPowerRef.current = power;
    if (hasChange) {
      changeKeyRef.current += 1;
      setChangeKey(changeKeyRef.current);
      setRepChanges(changes);
      const timer = setTimeout(() => setRepChanges({ halk: null, yatirimcilar: null, mafya: null, tarikat: null, ordu: null }), 1800);
      return () => clearTimeout(timer);
    }
  }, [power]);

  const getBarGradient = (value: number) => {
    if (value <= 15) return 'linear-gradient(to top, #ef4444, #f97316)';
    if (value <= 30) return 'linear-gradient(to top, #f97316, #eab308)';
    if (value <= 50) return 'linear-gradient(to top, #eab308, #22c55e)';
    if (value <= 70) return 'linear-gradient(to top, #22c55e, #14b8a6)';
    if (value <= 85) return 'linear-gradient(to top, #14b8a6, #06b6d4)';
    return 'linear-gradient(to top, #06b6d4, #0ea5e9)';
  };

  const getBarColor = (value: number) => {
    if (value <= 15) return '#ef4444';
    if (value <= 30) return '#f97316';
    if (value <= 50) return '#eab308';
    if (value <= 70) return '#22c55e';
    if (value <= 85) return '#14b8a6';
    return '#0ea5e9';
  };

  const isAffected = (p: PowerType) => activeEffects.some(e => e.power === p);
  const getEffectDirection = (p: PowerType) => {
    const effect = activeEffects.find(e => e.power === p);
    if (!effect) return null;
    return effect.amount > 0 ? 'up' : 'down';
  };

  const handleDirectBribe = (p: PowerType) => {
    if (!onBribe || !canBribe || !getBribeCost) return;
    if (!canBribe(p)) return;

    const room = 100 - power[p];
    const gain = Math.min(room, 10);
    const ratio = gain / 10;
    const cost = Math.max(1, Math.round(getBribeCost(p) * ratio));

    const text = getRandomBribeText(p, lang);

    playBribeSound();
    onBribe(p);

    setBribeFeedback({ faction: p, text, cost, gain });
    setTimeout(() => setBribeFeedback(null), 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Money display */}
      <div className="flex items-center justify-center gap-2 mb-0.5">
        <EmojiImg emoji="💰" size={20} />
        <span className={cn(
          "text-base font-black transition-colors duration-300",
          projectedMoney != null
            ? (money + projectedMoney <= 0 ? 'text-red-500' : 'text-foreground')
            : 'text-foreground'
        )}>
          {money}B
        </span>
        {projectedMoney != null && (
          <span className={cn(
            "text-xs font-bold italic transition-opacity",
            projectedMoney > 0 ? 'text-emerald-400' : 'text-red-400'
          )}>
            → {money + projectedMoney}B ({projectedMoney > 0 ? '+' : ''}{projectedMoney})
          </span>
        )}
        {projectedMoney == null && lastMoneyChange !== null && lastMoneyChange !== undefined && (
          <span className={cn(
            "text-xs font-bold animate-bounce",
            lastMoneyChange > 0 ? 'text-emerald-500' : 'text-red-500'
          )}>
            {lastMoneyChange > 0 ? '+' : ''}{lastMoneyChange}B
          </span>
        )}
      </div>

      <div className="flex justify-between gap-0.5 px-1 py-0.5">
        {powers.map((p) => {
          const val = power[p];
          const affected = isAffected(p);
          const dir = getEffectDirection(p);
          const canDo = canBribe ? canBribe(p) : false;

          return (
            <div key={p} className="flex flex-col items-center gap-0.5 flex-1 min-w-0 relative">
              {/* Faction head */}
              <button
                onClick={() => handleDirectBribe(p)}
                className={cn(
                  "w-14 h-14 rounded-full overflow-hidden border-2 transition-all duration-300 relative",
                  affected && isFirstSeenCard ? "scale-110 border-white/70" : affected ? "scale-110 border-primary" : "border-border/50",
                  canDo ? "hover:scale-110 hover:border-primary cursor-pointer active:scale-95" : "opacity-60",
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

              {/* Bribe feedback overlay */}
              {bribeFeedback?.faction === p && (
                <div className="fixed left-1/2 top-1/3 -translate-x-1/2 z-50 pointer-events-none animate-bribe-feedback">
                  <div className="bg-card/95 border-2 border-primary/50 rounded-2xl px-5 py-3 shadow-2xl text-center min-w-[200px]">
                    <div className="text-base text-foreground font-medium"><EmojiText text={bribeFeedback.text} size={18} /></div>
                    <div className="text-sm font-bold mt-1">
                      <span className="text-red-400">-{bribeFeedback.cost}B</span>
                      {' '}
                      <span className="text-emerald-400">+{bribeFeedback.gain} rep</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Power bar */}
              <div
                className="w-full h-20 bg-muted/50 rounded-full relative overflow-hidden border-4 border-black select-none"
                onMouseEnter={() => setShowPercent(p)}
                onMouseLeave={() => setShowPercent(null)}
                onTouchStart={() => {
                  longPressTimer.current = setTimeout(() => setShowPercent(p), 300);
                }}
                onTouchEnd={() => {
                  if (longPressTimer.current) clearTimeout(longPressTimer.current);
                  setShowPercent(null);
                }}
              >
                <div
                  className="absolute bottom-0 w-full rounded-full transition-all duration-500 ease-out"
                  style={{ height: `${val}%`, background: getBarGradient(val) }}
                />
                {showPercent === p && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <span
                      className="text-sm font-black"
                      style={{ color: getBarColor(val), textShadow: '0 0 4px #000, 0 0 8px #000, 0 1px 2px #000' }}
                    >
                      {val}%
                    </span>
                  </div>
                )}
                {affected && (
                  <div className={cn(
                    "absolute inset-0 rounded-full animate-pulse",
                    isFirstSeenCard ? 'bg-white/20' : dir === 'up' ? 'bg-emerald-400/30' : 'bg-red-400/30'
                  )} />
                )}
                {repChanges[p] !== null && (
                  <div
                    key={changeKey}
                    className="rep-change-indicator"
                  >
                    <span className={cn(
                      "text-xs font-light italic drop-shadow-md",
                      repChanges[p]! > 0 ? 'text-emerald-300' : 'text-red-300'
                    )}>
                      {repChanges[p]! > 0 ? '+' : ''}{repChanges[p]}
                    </span>
                  </div>
                )}
              </div>

              <span className="text-[9px] font-medium text-muted-foreground truncate w-full text-center">
                {t(`power.${p}`)}
              </span>
              {val >= 100 && (
                <span className="text-[9px] font-bold text-cyan-400 animate-pulse">
                  +5B/{t('game.turn').toLowerCase()}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
