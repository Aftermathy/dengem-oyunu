import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { playClickSound } from '@/hooks/useSound';

interface Props {
  onComplete: () => void;
}

// Layout vh breakpoints for iPhone 17 Pro Max (932px logical height, 59px dynamic island safe area)
// pt-safe(6.3) + pt-1(0.4) = 6.7vh start
// money row    ends  ~9.5vh  (26px)
// factions     ends ~26.3vh  (156px: h-14 button + h-20 bar + label + py-0.5)
// turn counter ends ~31.2vh  (46px: year + election text + py-0.5)
// launder bar  ends ~36.0vh  (44px: py-1 + button py-2)
// card                36.0vh –100vh
const SPOTLIGHT: Array<{ from: number; to: number }> = [
  { from: 0,  to: 10 }, // money
  { from: 10, to: 26 }, // factions  — ends just before turn counter at 26.3vh
  { from: 26, to: 31 }, // turn / election countdown
  { from: 31, to: 35 }, // launder bar
  { from: 36, to: 100 }, // card
];

const STEPS_TR = [
  { emoji: '💰', title: 'Para',                      desc: 'Paranın bitmesi iktidarının bitmesi demek. Zümreler seni soyar, kararların hazineni eritir. Rüşvet vermeden önce bak — kasanda ne kaldı?' },
  { emoji: '⚡', title: 'Zümreler ve Güç Barları',   desc: '5 güç grubun var. Herhangi biri 0\'a inerse iktidarın biter. 100\'e çıkarsa her tur bonus para kazandırır. Bir yüze tıkla → rüşvet ver, desteğini artır.' },
  { emoji: '🗓️', title: 'Tur ve Seçime Kalan Zaman', desc: 'Her karar bir çeyrek yıl. Seçim yaklaşıyorsa alt çubuk kırmızı yanar. Güçsüz yakalanırsan sandıkta gömülürsün.' },
  { emoji: '🧼', title: 'Para Aklama',               desc: '50B harcayarak para aklayabilirsin. Aklanan para seçim meydanında oy satın almak için kullanılır. Aklanmış para barı ne kadar doluysa o kadar güçlüsün.' },
  { emoji: '🃏', title: 'Karar Kartları',            desc: 'Sağa kaydır → Kabul et. Sola kaydır → Reddet. Her karar zümrelerini etkiler. Para etkisi de görebilirsin — ama sadece daha önce gördüğün kartlarda.' },
];

const STEPS_EN = [
  { emoji: '💰', title: 'Money',                       desc: 'Running out of money means losing power. Factions drain your budget, decisions shrink your treasury. Check your balance before bribing.' },
  { emoji: '⚡', title: 'Factions & Power Bars',       desc: 'You have 5 factions. If any hit 0, your reign ends. If any hit 100, you earn bonus money each turn. Tap a face → bribe them, boost support.' },
  { emoji: '🗓️', title: 'Turn & Election Countdown',   desc: 'Every decision is one quarter-year. When an election nears, the counter glows red. Get caught weak and the ballot box buries you.' },
  { emoji: '🧼', title: 'Money Laundering',            desc: 'Spend 50B to launder money. Laundered funds buy votes in elections. The fuller the bar, the more power you wield at the polls.' },
  { emoji: '🃏', title: 'Decision Cards',              desc: 'Swipe right → Accept. Swipe left → Reject. Each choice affects factions. You can also see money effects — but only on cards you\'ve seen before.' },
];

export function TutorialOverlay({ onComplete }: Props) {
  const { lang } = useLanguage();
  const steps = lang === 'tr' ? STEPS_TR : STEPS_EN;
  const [step, setStep] = useState(0);
  const current = steps[step];
  const isLast = step === steps.length - 1;
  const spot = SPOTLIGHT[step];

  // Tooltip goes below the spotlight unless it's the last step (card area fills bottom)
  const tooltipBelow = step < 4;
  const tooltipTop = tooltipBelow ? spot.to : undefined;
  const tooltipBottom = !tooltipBelow ? (100 - spot.from) : undefined;

  return (
    <div className="fixed inset-0 z-[160] pointer-events-auto">
      {/* Top dark mask */}
      {spot.from > 0 && (
        <div
          className="absolute left-0 right-0 top-0 bg-black/85 pointer-events-none"
          style={{ height: `${spot.from}vh` }}
        />
      )}
      {/* Bottom dark mask */}
      {spot.to < 100 && (
        <div
          className="absolute left-0 right-0 bottom-0 bg-black/85 pointer-events-none"
          style={{ height: `${100 - spot.to}vh` }}
        />
      )}

      {/* Tooltip card */}
      <div
        className="absolute left-0 right-0 flex flex-col items-center px-4 z-10"
        style={
          tooltipTop !== undefined
            ? { top: `${tooltipTop}vh` }
            : { bottom: `${tooltipBottom}vh` }
        }
      >
        {/* Arrow pointing up into spotlight (when tooltip is below) */}
        {tooltipBelow && (
          <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-primary/60 mb-0.5" />
        )}

        <div className="bg-card border-2 border-primary/50 rounded-2xl p-4 max-w-xs w-full text-center shadow-2xl">
          {/* Step dots */}
          <div className="flex gap-1.5 justify-center mb-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-primary' : 'w-3 bg-muted'}`}
              />
            ))}
          </div>

          <div className="text-3xl mb-1">{current.emoji}</div>
          <h3 className="text-sm font-black text-foreground mb-1">{current.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">{current.desc}</p>

          <button
            onClick={() => { playClickSound(); isLast ? onComplete() : setStep(s => s + 1); }}
            className="w-full py-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm active:scale-95 transition-all"
          >
            {isLast
              ? (lang === 'tr' ? '👑 Başla!' : "👑 Let's Go!")
              : (lang === 'tr' ? 'Devam →' : 'Next →')}
          </button>
          <button
            onClick={() => { playClickSound(); onComplete(); }}
            className="w-full mt-1.5 py-1 text-xs text-muted-foreground"
          >
            {lang === 'tr' ? 'Geç' : 'Skip'}
          </button>
        </div>

        {/* Arrow pointing down into spotlight (when tooltip is above, last step) */}
        {!tooltipBelow && (
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-primary/60 mt-0.5" />
        )}
      </div>
    </div>
  );
}
