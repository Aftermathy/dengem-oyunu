import { PowerState, PowerType } from '@/types/game';
import { PowerEffect, BRIBE_COSTS } from '@/types/game';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import { playBribeSound } from '@/hooks/useSound';
import { EmojiText } from '@/components/EmojiImg';

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

interface PowerBarsProps {
  power: PowerState;
  activeEffects?: PowerEffect[];
  money?: number;
  lastMoneyChange?: number | null;
  projectedMoney?: number | null;
  onBribe?: (faction: PowerType) => void;
  canBribe?: (faction: PowerType) => boolean;
  getBribeCost?: (faction: PowerType) => number;
}

const bribeTextsAll: Record<PowerType, { tr: string; en: string }[]> = {
  halk: [
    { tr: '🎁 Halka yardım paketi', en: '🎁 Aid package sent' },
    { tr: '🍞 Bedava ekmek dağıtıldı', en: '🍞 Free bread distributed' },
    { tr: '🏥 Ücretsiz sağlık taraması', en: '🏥 Free health screening' },
    { tr: '🎪 Meydan mitingi düzenlendi', en: '🎪 Public rally organized' },
    { tr: '📺 Halka hitap edildi', en: '📺 Addressed the nation' },
    { tr: '🏠 Konut müjdesi verildi', en: '🏠 Housing announced' },
    { tr: '⛽ Akaryakıt indirimi', en: '⛽ Fuel price cut' },
    { tr: '🎓 Burs programı başlatıldı', en: '🎓 Scholarships launched' },
    { tr: '🧓 Emekli maaşına zam', en: '🧓 Pensions raised' },
    { tr: '🚰 Bedava su dağıtıldı', en: '🚰 Free water handed out' },
  ],
  yatirimcilar: [
    { tr: '💎 Vergi indirimi verildi', en: '💎 Tax breaks offered' },
    { tr: '🏗️ Özel sektöre ihale açıldı', en: '🏗️ Tenders opened' },
    { tr: '📊 Borsa düzenlemesi gevşetildi', en: '📊 Market regulations loosened' },
    { tr: '🏦 Özel bankaya lisans', en: '🏦 Banking license granted' },
    { tr: '✈️ Serbest ticaret bölgesi', en: '✈️ Free trade zone' },
    { tr: '💰 Yatırımcıya vatandaşlık', en: '💰 Citizenship sold' },
    { tr: '🏭 Fabrika arazisi tahsis', en: '🏭 Factory land allocated' },
    { tr: '📈 Devlet garantili kredi', en: '📈 State loans offered' },
    { tr: '🤑 Patronlarla gizli yemek', en: '🤑 Secret tycoon dinner' },
    { tr: '🛢️ Maden ruhsatı verildi', en: '🛢️ Mining permits slipped' },
  ],
  mafya: [
    { tr: '💵 Zarf uzatıldı', en: '💵 Envelope slid under' },
    { tr: '🔫 Silah ruhsatı kolaylaştı', en: '🔫 Gun permits expedited' },
    { tr: '🚬 Kaçakçılığa göz yumuldu', en: '🚬 Smuggling overlooked' },
    { tr: '🎰 Kumarhane lisansı', en: '🎰 Casino licensed' },
    { tr: '🤫 Dosya kayboldu', en: '🤫 File lost' },
    { tr: '🚗 Çalıntı araç şebekesi korundu', en: '🚗 Car ring protected' },
    { tr: '💀 Rakip çete susturuldu', en: '💀 Rival gang silenced' },
    { tr: '🍸 Gece kulübü buluşması', en: '🍸 Nightclub meeting' },
    { tr: '🏴 Haraç bölgeleri paylaşıldı', en: '🏴 Racket zones split' },
    { tr: '🗝️ Cezaevi müdürüne torpil', en: '🗝️ Prison warden bribed' },
  ],
  tarikat: [
    { tr: '🕌 Vakfa bağış yapıldı', en: '🕌 Foundation donation' },
    { tr: '📿 Tarikat lideri davet edildi', en: '📿 Cult leader invited' },
    { tr: '🏫 Özel okul izni hızlandı', en: '🏫 School permits fast-tracked' },
    { tr: '📖 Dini yayınevine destek', en: '📖 Religious press funded' },
    { tr: '🎤 Cuma hutbesinde ad geçti', en: '🎤 Named in Friday sermon' },
    { tr: '🌙 İftar sponsorluğu', en: '🌙 Iftar sponsored' },
    { tr: '🕯️ Türbe restorasyonu', en: '🕯️ Shrine restored' },
    { tr: '👳 Cemaat okullarına kadro', en: '👳 Sect school positions' },
    { tr: '🏛️ Vakıf arazisi imara açıldı', en: '🏛️ Foundation land zoned' },
    { tr: '🤲 Şeyhe helikopter', en: '🤲 Helicopter for sheikh' },
  ],
  ordu: [
    { tr: '🎖️ Silah sözleşmesi imzalandı', en: '🎖️ Arms contract signed' },
    { tr: '🪖 Generallere erken terfi', en: '🪖 Early promotions' },
    { tr: '🛡️ Savunma bütçesi artırıldı', en: '🛡️ Defense budget raised' },
    { tr: '🚁 Helikopter filosu alındı', en: '🚁 Helicopter fleet bought' },
    { tr: '🏅 Askeri tatbikat düzenlendi', en: '🏅 Military exercises' },
    { tr: '🗺️ Sınır karakolları güçlendirildi', en: '🗺️ Borders reinforced' },
    { tr: '⭐ Paşalara lojman', en: '⭐ General residences' },
    { tr: '🔧 Savunma ihalesi ayarlandı', en: '🔧 Defense tender rigged' },
    { tr: '🎯 Özel harp kursu finanse', en: '🎯 Warfare training funded' },
    { tr: '🛩️ İHA projesine ek bütçe', en: '🛩️ Drone project funded' },
  ],
};

export function PowerBars({ power, activeEffects = [], money = 0, lastMoneyChange, projectedMoney, onBribe, canBribe, getBribeCost }: PowerBarsProps) {
  const { t, lang } = useLanguage();
  const powers: PowerType[] = ['halk', 'yatirimcilar', 'mafya', 'tarikat', 'ordu'];
  const [showPercent, setShowPercent] = useState<PowerType | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [repChanges, setRepChanges] = useState<Record<PowerType, number | null>>({ halk: null, yatirimcilar: null, mafya: null, tarikat: null, ordu: null });
  const prevPowerRef = useRef<PowerState>(power);
  const changeKeyRef = useRef(0);
  const [changeKey, setChangeKey] = useState(0);
  
  // Bribe feedback: shows text + cost overlay on the faction image
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

    // Get random bribe text
    const texts = bribeTextsAll[p];
    const text = texts[Math.floor(Math.random() * texts.length)][lang];

    playBribeSound();
    onBribe(p);

    // Show feedback
    setBribeFeedback({ faction: p, text, cost, gain });
    setTimeout(() => setBribeFeedback(null), 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Money display */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-2xl">💰</span>
        <span className={cn(
          "text-xl font-black transition-colors duration-300",
          projectedMoney != null
            ? (money + projectedMoney <= 0 ? 'text-red-500' : 'text-foreground')
            : 'text-foreground'
        )}>
          {money}B
        </span>
        {projectedMoney != null && (
          <span className={cn(
            "text-sm font-bold italic transition-opacity",
            projectedMoney > 0 ? 'text-emerald-400' : 'text-red-400'
          )}>
            → {money + projectedMoney}B ({projectedMoney > 0 ? '+' : ''}{projectedMoney})
          </span>
        )}
        {projectedMoney == null && lastMoneyChange !== null && lastMoneyChange !== undefined && (
          <span className={cn(
            "text-sm font-bold animate-bounce",
            lastMoneyChange > 0 ? 'text-emerald-500' : 'text-red-500'
          )}>
            {lastMoneyChange > 0 ? '+' : ''}{lastMoneyChange}B
          </span>
        )}
      </div>

      <div className="flex justify-between gap-1.5 sm:gap-3 px-2 sm:px-4 py-2">
        {powers.map((p) => {
          const val = power[p];
          const affected = isAffected(p);
          const dir = getEffectDirection(p);
          const canDo = canBribe ? canBribe(p) : false;

          return (
            <div key={p} className="flex flex-col items-center gap-1 flex-1 min-w-0 relative">
              {/* Faction head - direct bribe on click */}
              <button
                onClick={() => handleDirectBribe(p)}
                className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 transition-all duration-300 relative",
                  affected ? "scale-110 border-primary" : "border-border/50",
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
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-bribe-feedback">
                  <div className="bg-card/95 border border-primary/50 rounded-lg px-2 py-1 shadow-lg whitespace-nowrap text-center">
                    <div className="text-[8px] text-muted-foreground">{bribeFeedback.text}</div>
                    <div className="text-[9px] font-bold">
                      <span className="text-red-400">-{bribeFeedback.cost}B</span>
                      {' '}
                      <span className="text-emerald-400">+{bribeFeedback.gain} rep</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Power bar */}
              <div
                className="w-full h-16 sm:h-20 bg-muted/50 rounded-full relative overflow-hidden border-4 border-black select-none"
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
                    dir === 'up' ? 'bg-emerald-400/30' : 'bg-red-400/30'
                  )} />
                )}
                {repChanges[p] !== null && (
                  <div
                    key={changeKey}
                    className="rep-change-indicator"
                  >
                    <span className={cn(
                      "text-xs sm:text-sm font-light italic drop-shadow-md",
                      repChanges[p]! > 0 ? 'text-emerald-300' : 'text-red-300'
                    )}>
                      {repChanges[p]! > 0 ? '+' : ''}{repChanges[p]}
                    </span>
                  </div>
                )}
              </div>

              <span className="text-[9px] sm:text-xs font-medium text-muted-foreground truncate w-full text-center">
                {t(`power.${p}`)}
              </span>
              {val >= 100 && (
                <span className="text-[8px] sm:text-[10px] font-bold text-cyan-400 animate-pulse">
                  +2B/{t('game.turn').toLowerCase()}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
