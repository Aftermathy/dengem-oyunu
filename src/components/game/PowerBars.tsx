import { PowerState, PowerType } from '@/types/game';
import { PowerEffect, BRIBE_COSTS } from '@/types/game';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';
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
  projectedMoney?: number | null;
  onBribe?: (faction: PowerType) => void;
  canBribe?: (faction: PowerType) => boolean;
  getBribeCost?: (faction: PowerType) => number;
}

export function PowerBars({ power, activeEffects = [], money = 0, lastMoneyChange, projectedMoney, onBribe, canBribe, getBribeCost }: PowerBarsProps) {
  const { t, lang } = useLanguage();
  const powers: PowerType[] = ['halk', 'yatirimcilar', 'mafya', 'tarikat', 'ordu'];
  const [showBribe, setShowBribe] = useState<PowerType | null>(null);
  const [repChanges, setRepChanges] = useState<Record<PowerType, number | null>>({ halk: null, yatirimcilar: null, mafya: null, tarikat: null, ordu: null });
  const prevPowerRef = useRef<PowerState>(power);
  const changeKeyRef = useRef(0);
  const [changeKey, setChangeKey] = useState(0);

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

  const isAffected = (p: PowerType) => activeEffects.some(e => e.power === p);
  const getEffectDirection = (p: PowerType) => {
    const effect = activeEffects.find(e => e.power === p);
    if (!effect) return null;
    return effect.amount > 0 ? 'up' : 'down';
  };

  const bribeTextsAll: Record<PowerType, { tr: string; en: string }[]> = {
    halk: [
      { tr: '🎁 Halka yardım paketi gönder', en: '🎁 Send aid package to the people' },
      { tr: '🍞 Bedava ekmek dağıt', en: '🍞 Distribute free bread' },
      { tr: '🏥 Ücretsiz sağlık taraması yap', en: '🏥 Offer free health screenings' },
      { tr: '🎪 Meydan mitingi düzenle', en: '🎪 Organize a public rally' },
      { tr: '📺 Halka hitap et, gözyaşı dök', en: '📺 Address the nation, shed a tear' },
      { tr: '🏠 Dar gelirliye konut müjdesi ver', en: '🏠 Announce housing for the poor' },
      { tr: '⛽ Akaryakıt indirimi ilan et', en: '⛽ Announce fuel price cuts' },
      { tr: '🎓 Burs programı başlat', en: '🎓 Launch a scholarship program' },
      { tr: '🧓 Emekli maaşlarına zam yap', en: '🧓 Raise pension payments' },
      { tr: '🚰 Bedava su dağıt, fotoğraf çektir', en: '🚰 Hand out free water, pose for photos' },
    ],
    yatirimcilar: [
      { tr: '💎 Vergi indirimi teklif et', en: '💎 Offer tax breaks' },
      { tr: '🏗️ Özel sektöre ihale aç', en: '🏗️ Open tenders for private sector' },
      { tr: '📊 Borsa düzenlenmesini gevşet', en: '📊 Loosen stock market regulations' },
      { tr: '🏦 Özel bankaya lisans ver', en: '🏦 Grant a private banking license' },
      { tr: '✈️ Serbest ticaret bölgesi kur', en: '✈️ Establish a free trade zone' },
      { tr: '💰 Yabancı yatırımcıya vatandaşlık sat', en: '💰 Sell citizenship to foreign investors' },
      { tr: '🏭 Fabrika arazisi tahsis et', en: '🏭 Allocate factory land' },
      { tr: '📈 Devlet garantili kredi ver', en: '📈 Offer state-guaranteed loans' },
      { tr: '🤑 Holding patronuyla gizlice yemek ye', en: '🤑 Dine secretly with tycoons' },
      { tr: '🛢️ Maden ruhsatı arka kapıdan ver', en: '🛢️ Slip mining permits through back channels' },
    ],
    mafya: [
      { tr: '💵 Zarfı masanın altından uzat', en: '💵 Slide the envelope under the table' },
      { tr: '🔫 Silah ruhsatı işlemlerini kolaylaştır', en: '🔫 Expedite gun permits' },
      { tr: '🚬 Kaçak mal operasyonuna göz yum', en: '🚬 Turn a blind eye to smuggling' },
      { tr: '🎰 Kumarhane lisansı ver', en: '🎰 Grant casino licenses' },
      { tr: '🤫 Savcılık dosyasını kaybet', en: '🤫 Lose the prosecutor\'s file' },
      { tr: '🚗 Çalıntı araç şebekesini koru', en: '🚗 Protect the stolen car ring' },
      { tr: '💀 Rakip çeteyi sustur', en: '💀 Silence the rival gang' },
      { tr: '🍸 Gece kulübünde buluşma ayarla', en: '🍸 Arrange a nightclub meeting' },
      { tr: '🏴 Haraç bölgelerini yeniden paylaştır', en: '🏴 Redistribute protection racket zones' },
      { tr: '🗝️ Cezaevi müdürüne torpil yap', en: '🗝️ Pull strings with the prison warden' },
    ],
    tarikat: [
      { tr: '🕌 Vakfa bağış yap', en: '🕌 Donate to the foundation' },
      { tr: '📿 Tarikat liderini saraya davet et', en: '📿 Invite the cult leader to the palace' },
      { tr: '🏫 Özel okul iznini hızlandır', en: '🏫 Fast-track private school permits' },
      { tr: '📖 Dini yayınevine devlet desteği ver', en: '📖 Fund religious publishing house' },
      { tr: '🎤 Cuma hutbesinde adını anlat', en: '🎤 Get your name in Friday sermon' },
      { tr: '🌙 İftar programına sponsor ol', en: '🌙 Sponsor iftar events' },
      { tr: '🕯️ Türbe restorasyonu başlat', en: '🕯️ Start shrine restoration' },
      { tr: '👳 Cemaat okullarına kadro aç', en: '👳 Open positions in sect schools' },
      { tr: '🏛️ Vakıf arazisini imar planına sok', en: '🏛️ Zone foundation land for development' },
      { tr: '🤲 Şeyhe özel helikopter tahsis et', en: '🤲 Assign a private helicopter to the sheikh' },
    ],
    ordu: [
      { tr: '🎖️ Yeni silah sözleşmesi imzala', en: '🎖️ Sign new arms contract' },
      { tr: '🪖 Generallere erken terfi ver', en: '🪖 Grant early promotions to generals' },
      { tr: '🛡️ Savunma bütçesini artır', en: '🛡️ Increase defense budget' },
      { tr: '🚁 Yeni helikopter filosu al', en: '🚁 Purchase new helicopter fleet' },
      { tr: '🏅 Askeri tatbikat düzenle', en: '🏅 Organize military exercises' },
      { tr: '🗺️ Sınır karakollarını güçlendir', en: '🗺️ Reinforce border outposts' },
      { tr: '⭐ Paşalara lojman tahsis et', en: '⭐ Allocate residences for generals' },
      { tr: '🔧 Savunma sanayi ihalesini ayarla', en: '🔧 Rig the defense industry tender' },
      { tr: '🎯 Özel harp kursunu finanse et', en: '🎯 Fund special warfare training' },
      { tr: '🛩️ İHA projesine ek bütçe ver', en: '🛩️ Allocate extra budget for drone project' },
    ],
  };

  const getBribeText = (p: PowerType) => {
    const texts = bribeTextsAll[p];
    const idx = Math.floor(Math.random() * texts.length);
    return texts[idx][lang];
  };

  // Pre-select random text per faction on each render of bribe popup
  const [bribeTextCache, setBribeTextCache] = useState<Record<PowerType, string>>({
    halk: '', yatirimcilar: '', mafya: '', tarikat: '', ordu: '',
  });

  const handleShowBribe = (p: PowerType) => {
    if (showBribe === p) {
      setShowBribe(null);
    } else {
      setBribeTextCache(prev => ({ ...prev, [p]: getBribeText(p) }));
      setShowBribe(p);
    }
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

      <div className="flex justify-between gap-1.5 sm:gap-3 px-2 sm:px-4 py-3">
        {powers.map((p) => {
          const val = power[p];
          const affected = isAffected(p);
          const dir = getEffectDirection(p);
          const room = 100 - val;
          const gain = Math.min(room, 10);
          const ratio = gain / 10;
          const cost = getBribeCost ? Math.max(1, Math.round(getBribeCost(p) * ratio)) : 0;
          const canDo = canBribe ? canBribe(p) : false;

          return (
            <div key={p} className="flex flex-col items-center gap-1 flex-1 min-w-0">
              {/* Faction head with mouth animation */}
              <button
                onClick={() => handleShowBribe(p)}
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

              {/* Bribe popup */}
              {showBribe === p && (
                <div className="absolute mt-28 sm:mt-32 z-20 bg-card border-2 border-border rounded-xl p-2 shadow-xl min-w-[140px] text-center animate-fade-in">
                  <p className="text-[10px] text-muted-foreground mb-1">
                    {bribeTextCache[p]}
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
                    {cost}B → +{gain} rep
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
