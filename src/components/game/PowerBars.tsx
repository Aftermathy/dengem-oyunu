import { PowerState, PowerType } from '@/types/game';
import { PowerEffect } from '@/types/game';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import { playBribeSound, playBudgetWarningSound } from '@/hooks/useSound';
import { EmojiImg, EmojiText } from '@/components/EmojiImg';
import { useSettings } from '@/contexts/SettingsContext';

import { GameImages } from '@/config/assets';
import { getRandomBribeText } from '@/data/bribeTexts';

const FACTION_IMAGES: Record<PowerType, string> = {
  halk:         GameImages.faction_halk,
  yatirimcilar: GameImages.faction_yatirimcilar,
  mafya:        GameImages.faction_mafya,
  tarikat:      GameImages.faction_tarikat,
  ordu:         GameImages.faction_ordu,
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
  const { showFactionPercentages } = useSettings();
  const powers: PowerType[] = ['halk', 'yatirimcilar', 'mafya', 'tarikat', 'ordu'];
  const [bribeCostPreview, setBribeCostPreview] = useState<PowerType | null>(null);
  const [repChanges, setRepChanges] = useState<Record<PowerType, number | null>>({ halk: null, yatirimcilar: null, mafya: null, tarikat: null, ordu: null });
  const prevPowerRef = useRef<PowerState>(power);
  const changeKeyRef = useRef(0);
  const [changeKey, setChangeKey] = useState(0);
  type BribeFeedbackItem = { id: number; text: string; cost: number; gain: number; dying: boolean };
  const [bribeFeedbacks, setBribeFeedbacks] = useState<BribeFeedbackItem[]>([]);
  const feedbackIdRef = useRef(0);
  const [barValueShown, setBarValueShown] = useState<PowerType | null>(null);
  const barValueTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBarTap = (p: PowerType) => {
    if (barValueTimerRef.current) clearTimeout(barValueTimerRef.current);
    setBarValueShown(p);
    barValueTimerRef.current = setTimeout(() => setBarValueShown(null), 1500);
  };

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
    if (value <= 15) return 'linear-gradient(to top, hsl(var(--game-danger)), hsl(var(--game-election)))';
    if (value <= 30) return 'linear-gradient(to top, hsl(var(--game-election)), hsl(var(--game-gold-dark)))';
    if (value <= 50) return 'linear-gradient(to top, hsl(var(--game-gold-dark)), hsl(var(--game-success)))';
    if (value <= 70) return 'linear-gradient(to top, hsl(var(--game-success)), hsl(160 84% 39%))';
    if (value <= 85) return 'linear-gradient(to top, hsl(160 84% 39%), hsl(var(--game-income)))';
    return 'linear-gradient(to top, hsl(var(--game-income)), hsl(199 89% 48%))';
  };

  const isAffected = (p: PowerType) => activeEffects.some(e => e.power === p && e.amount !== 0);
  const getEffectDirection = (p: PowerType) => {
    const effect = activeEffects.find(e => e.power === p);
    if (!effect) return null;
    return effect.amount > 0 ? 'up' : 'down';
  };

  const executeBribe = (p: PowerType) => {
    if (!onBribe || !canBribe || !getBribeCost) return;
    if (!canBribe(p)) return;
    const room = 100 - power[p];
    const gain = Math.min(room, 10);
    const ratio = gain / 10;
    const cost = Math.max(1, Math.round(getBribeCost(p) * ratio));
    const text = getRandomBribeText(p, lang);
    playBribeSound();
    onBribe(p);
    const id = ++feedbackIdRef.current;
    setBribeFeedbacks(prev => [...prev, { id, text, cost, gain, dying: false }]);
    setTimeout(() => {
      setBribeFeedbacks(prev => prev.map(f => f.id === id ? { ...f, dying: true } : f));
    }, 1200);
    setTimeout(() => {
      setBribeFeedbacks(prev => prev.filter(f => f.id !== id));
    }, 1550);
  };

  const handleProfileTap = (p: PowerType) => {
    if (!canBribe || !getBribeCost) return;
    if (!canBribe(p)) {
      playBudgetWarningSound();
      return;
    }
    if (bribeCostPreview === p) {
      executeBribe(p);
      setBribeCostPreview(null);
    } else {
      setBribeCostPreview(p);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Money display */}
      <div className="flex items-center justify-center gap-2 mb-0.5">
        <EmojiImg emoji="💰" size={20} />
        <span className={cn(
          "text-base font-black transition-colors duration-300",
          projectedMoney != null
            ? (money + projectedMoney <= 0 ? 'text-game-danger' : 'text-foreground')
            : 'text-foreground'
        )}>
          {money}B
        </span>
        {projectedMoney != null && (
          <span className={cn(
            "text-xs font-bold italic transition-opacity",
            projectedMoney > 0 ? 'text-emerald-700 dark:text-game-success-light' : 'text-red-600 dark:text-game-danger-light'
          )}>
            → {money + projectedMoney}B ({projectedMoney > 0 ? '+' : ''}{projectedMoney})
          </span>
        )}
        {projectedMoney == null && lastMoneyChange !== null && lastMoneyChange !== undefined && (
          <span className={cn(
            "text-xs font-bold animate-bounce",
            lastMoneyChange > 0 ? 'text-emerald-700 dark:text-game-success' : 'text-red-600 dark:text-game-danger'
          )}>
            {lastMoneyChange > 0 ? '+' : ''}{lastMoneyChange}B
          </span>
        )}
      </div>

      <div className="flex justify-between gap-0.5 px-1 py-0.5">
        {powers.map((p, idx) => {
          const val = power[p];
          const affected = isAffected(p);
          const dir = getEffectDirection(p);
          const canDo = canBribe ? canBribe(p) : false;

          return (
            <div key={p} className={`flex flex-col items-center gap-0.5 flex-1 min-w-0 relative ${bribeCostPreview === p ? 'z-[70]' : 'z-50'}`}>
              {/* Faction head */}
              <button
                onClick={() => handleProfileTap(p)}
                className={cn(
                  "w-14 h-14 rounded-full overflow-hidden border-2 transition-all duration-300 relative",
                  affected
                    ? isFirstSeenCard
                      ? "scale-110 border-foreground/40"
                      : dir === 'up'
                        ? "scale-110 border-game-success/70"
                        : "scale-110 border-game-danger/70"
                    : "border-border/50",
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

              {/* Bribe cost popup — anchored below this faction's head */}
              {bribeCostPreview === p && getBribeCost && (() => {
                const cost = Math.max(1, Math.round(getBribeCost(p) * (Math.min(100 - val, 10) / 10)));
                // Edge factions anchor to screen edge; middle ones center on column
                const align =
                  idx === 0                   ? 'left-0' :
                  idx === powers.length - 1   ? 'right-0' :
                  'left-1/2 -translate-x-1/2';
                return (
                  <div
                    className={`absolute top-[70px] ${align} z-[55] pointer-events-none`}
                    style={{ width: '140px' }}
                  >
                    <div className="bg-card border-2 border-primary/60 rounded-2xl px-3 py-2 shadow-2xl text-center">
                      <div className="text-xs font-bold text-muted-foreground mb-0.5">{t(`power.${p}`)}</div>
                      <div className="text-base font-black text-game-danger-light">-{cost}B</div>
                      <div className="text-sm font-bold text-game-success-light">+10 rep</div>
                      <div className="text-[9px] text-muted-foreground mt-1">
                        {lang === 'tr' ? 'Tekrar tıkla → rüşvet ver' : 'Tap again → bribe'}
                      </div>
                    </div>
                  </div>
                );
              })()}


              {/* Power bar — colored fill + tap to show value */}
              <div
                className="w-full h-20 bg-muted/50 rounded-full relative overflow-hidden border-4 border-game-overlay select-none cursor-pointer"
                style={{ transform: 'translateZ(0)', isolation: 'isolate' }}
                onClick={() => handleBarTap(p)}
              >
                <div
                  className="absolute bottom-0 w-full"
                  style={{
                    height: `${val}%`,
                    background: getBarGradient(val),
                    transition: 'height 667ms cubic-bezier(0.4, 0, 0.2, 1)',
                    willChange: 'height',
                  }}
                />
                {affected && (
                  <div className={cn(
                    "absolute inset-0 rounded-full animate-pulse",
                    isFirstSeenCard ? 'bg-foreground/15' : dir === 'up' ? 'bg-game-success-light/30' : 'bg-game-danger-light/30'
                  )} />
                )}
                {repChanges[p] !== null && (
                  <div key={changeKey} className="rep-change-indicator">
                    <span className={cn(
                      "text-xs font-light italic drop-shadow-md",
                      repChanges[p]! > 0 ? 'text-game-success-light' : 'text-game-danger-light'
                    )}>
                      {repChanges[p]! > 0 ? '+' : ''}{repChanges[p]}
                    </span>
                  </div>
                )}
                {(showFactionPercentages || barValueShown === p) && (
                  <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
                    <span className="text-sm font-black text-transparent drop-shadow-none" style={{ WebkitTextStroke: '1px rgba(0,0,0,0.7)' }}>
                      {val}
                    </span>
                  </div>
                )}
              </div>

              <span className="text-[9px] font-medium text-muted-foreground truncate w-full text-center">
                {t(`power.${p}`)}
              </span>
              {val >= 100 && (
                <span className="text-[9px] font-bold text-game-income animate-pulse">
                  +5B/{t('game.turn').toLowerCase()}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Backdrop to dismiss bribe popup on outside tap */}
      {bribeCostPreview && (
        <div className="fixed inset-0 z-[45]" onClick={() => setBribeCostPreview(null)} />
      )}

      {/* Bribe feedback toasts — stacked, each fades independently */}
      {bribeFeedbacks.length > 0 && (
        <div className="fixed right-3 top-1/3 z-50 pointer-events-none flex flex-col items-end gap-2">
          {bribeFeedbacks.map(fb => (
            <div
              key={fb.id}
              className={cn(
                "transition-all duration-300",
                fb.dying ? "opacity-0 scale-95 -translate-y-1" : "opacity-100 scale-100 translate-y-0"
              )}
            >
              <div className="bg-card/95 border-2 border-primary/50 rounded-2xl px-5 py-3 shadow-2xl text-center min-w-[200px]">
                <div className="text-base text-foreground font-medium"><EmojiText text={fb.text} size={18} /></div>
                <div className="text-sm font-bold mt-1">
                  <span className="text-game-danger-light">-{fb.cost}B</span>
                  {' '}
                  <span className="text-game-success-light">+{fb.gain} rep</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
