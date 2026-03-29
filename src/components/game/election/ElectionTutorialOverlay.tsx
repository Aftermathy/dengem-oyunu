import { useState } from 'react';
import { playClickSound } from '@/hooks/useSound';

interface Props {
  onComplete: () => void;
  lang: string;
}

// Election screen approximate vh sections (safe-area ~6vh, title ~9, vote bars ~30, budget+cards ~48, specials ~72)
const SPOTLIGHT: Array<{ from: number; to: number }> = [
  { from: 0,  to: 14 }, // title + round counter
  { from: 14, to: 39 }, // vote % bars
  { from: 39, to: 73 }, // budget + cards + skip
  { from: 73, to: 90 }, // special powers + laundered money
];

const STEPS_TR = [
  {
    emoji: '🔄',
    title: 'Tur Sayacı',
    desc: 'Seçim 4 turdan oluşur. Her turda bir sen bir muhalefet hamle yapar. Tüm turlar bitince oylar sayılır.',
  },
  {
    emoji: '📊',
    title: 'Oy Barları',
    desc: 'Sol bar senin oy oranın, sağ bar muhalefetin. Her hamle barları değiştirir. %50\'yi geçersen seçimi kazanırsın.',
  },
  {
    emoji: '🃏',
    title: 'Bütçe, Kartlar ve Pas',
    desc: 'Üstteki bütçeyle seçim hamlesi satın alırsın. Her kartın bir maliyeti ve oy etkisi var. Nadir kartlar pahalı ama güçlüdür. Bütçen bittiyse "Pas" seçeneğini kullan — yine de +1% kazanırsın.',
  },
  {
    emoji: '🌑',
    title: 'Özel Bağlantılar',
    desc: 'Aklanmış para ile özel bağlantılarını kullanırsın. Bu güçler tek kullanımlık ve çok etkilidir. Kara paran yoksa yoksa boşuna tenezzül etme.',
  },
];

const STEPS_EN = [
  {
    emoji: '🔄',
    title: 'Round Counter',
    desc: 'The election lasts 4 rounds. Each round you play a move, then your opponent does. The counter goes from 1/4 to 4/4. After all rounds, votes are counted.',
  },
  {
    emoji: '📊',
    title: 'Vote Bars',
    desc: 'The left bar is your vote share, the right is your opponent\'s. You need to push your green bar above 50%. Each move shifts the bars. Cross 50% and you win the election.',
  },
  {
    emoji: '🃏',
    title: 'Budget, Cards & Skip',
    desc: 'Use your budget (top) to buy campaign cards. Each card has a cost and a vote effect. Rarer cards are stronger. No budget? Use the free "Skip" option — you still gain +1%.',
  },
  {
    emoji: '🌑',
    title: 'Special Powers',
    desc: 'Special powers are activated with laundered money. They\'re single-use and very powerful. If you have no laundered funds, these options are locked.',
  },
];

export function ElectionTutorialOverlay({ onComplete, lang }: Props) {
  const steps = lang === 'tr' ? STEPS_TR : STEPS_EN;
  const [step, setStep] = useState(0);
  const current = steps[step];
  const isLast = step === steps.length - 1;
  const spot = SPOTLIGHT[step];

  // Steps 0-1: tooltip below spotlight; steps 2-3: tooltip above (cards+specials are in lower half)
  const tooltipBelow = step < 2;
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
        {tooltipBelow && (
          <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-game-election/60 mb-0.5" />
        )}

        <div className="bg-card border-2 border-game-election/60 rounded-2xl p-4 max-w-xs w-full text-center shadow-2xl">
          {/* Step dots */}
          <div className="flex gap-1.5 justify-center mb-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step
                    ? 'w-8 bg-game-election'
                    : 'w-3 bg-muted'
                }`}
              />
            ))}
          </div>

          <div className="text-3xl mb-1">{current.emoji}</div>
          <h3 className="text-sm font-black text-foreground mb-1">{current.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">{current.desc}</p>

          <button
            onClick={() => { playClickSound(); isLast ? onComplete() : setStep(s => s + 1); }}
            className="w-full py-2 rounded-xl font-bold text-sm active:scale-95 transition-all text-white"
            style={{ background: 'hsl(var(--game-election))' }}
          >
            {isLast
              ? (lang === 'tr' ? '🔥 Seçime Gir!' : '🔥 Fight!')
              : (lang === 'tr' ? 'Devam →' : 'Next →')}
          </button>
          <button
            onClick={() => { playClickSound(); onComplete(); }}
            className="w-full mt-1.5 py-1 text-xs text-muted-foreground"
          >
            {lang === 'tr' ? 'Geç' : 'Skip'}
          </button>
        </div>

        {!tooltipBelow && (
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-game-election/60 mt-0.5" />
        )}
      </div>
    </div>
  );
}
