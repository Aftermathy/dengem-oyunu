import { useState, useLayoutEffect } from 'react';
import { playClickSound } from '@/hooks/useSound';
import { EmojiImg } from '@/components/EmojiImg';
import { AvatarImg } from '@/components/AvatarImg';
import { AVATAR_DEFS, type UserProfile } from '@/lib/userProfile';
import { cn } from '@/lib/utils';

interface Props {
  userProfile: UserProfile;
  earnedAP: number;
  lang: string;
  onComplete: () => void;
}

interface StepContent {
  emoji: string;
  title: string;
  desc: string;
  btn: string;
}

type SpotPx = { fromPx: number; toPx: number; fromXPx: number; toXPx: number; below: boolean };

const SELECTORS = ['tut-avatar', 'tut-ap', 'tut-bottomnav'] as const;
const TOOLTIP_BELOW = [true, true, false];
const TOTAL_STEPS = 4;
const PAD = 6;

export function PostGameTutorial({ userProfile, earnedAP, lang, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [spots, setSpots] = useState<SpotPx[] | null>(null);
  const av = AVATAR_DEFS.find(a => a.id === userProfile.avatarId);
  const tr = lang === 'tr';

  useLayoutEffect(() => {
    const h = window.innerHeight;
    const w = window.innerWidth;
    const measured: SpotPx[] = SELECTORS.map((sel, i) => {
      const el = document.querySelector(`[data-tutorial="${sel}"]`);
      if (!el) return { fromPx: 0, toPx: h * 0.2, fromXPx: 0, toXPx: w, below: TOOLTIP_BELOW[i] };
      const r = el.getBoundingClientRect();
      return {
        fromPx:  Math.max(0, r.top - PAD),
        toPx:    Math.min(h, r.bottom + PAD),
        fromXPx: Math.max(0, r.left - PAD),
        toXPx:   Math.min(w, r.right + PAD),
        below:   TOOLTIP_BELOW[i],
      };
    });
    setSpots(measured);
  }, []);

  const next = () => { playClickSound(); setStep(s => s + 1); };
  const finish = () => { playClickSound(); onComplete(); };

  const spotlightSteps: StepContent[] = [
    {
      emoji: '👤',
      title: tr ? 'Profilin' : 'Your Profile',
      desc:  tr
        ? 'Bu profilin. Buradan avatarını değiştirip istatistiklerine burdan bakabilirsin.'
        : 'This is your profile. Tap it to change your avatar and check your stats.',
      btn: tr ? 'Devam →' : 'Next →',
    },
    {
      emoji: '⭐',
      title: tr ? `+${earnedAP} AP Kazandın!` : `You Earned +${earnedAP} AP!`,
      desc:  tr
        ? 'Bu AP oyun oynadıkça kazanırsın. Yeteneklerini geliştirmek ve liderlik tablosunu sallamak için kullanabilirsin.'
        : 'You earn AP by playing. Use it to develop skills and climb the leaderboard.',
      btn: tr ? 'Tamam, Anladım!' : 'Got it!',
    },
    {
      emoji: '🏅',
      title: tr ? 'Ek Araçların' : 'Your Additional Tools',
      desc:  tr
        ? 'Buradan başarımlarını, yeteneklerini ve sıralamanı kontrol edebilirsin.'
        : 'Check your achievements, skills, and ranking from here.',
      btn: tr ? 'Devam →' : 'Next →',
    },
  ];

  // ── Steps 0-2: Spotlight layout ──────────────────────────────────────────
  if (step < 3) {
    const content = spotlightSteps[step];
    const h = window.innerHeight;
    const w = window.innerWidth;

    // Use measured spots if ready, else show nothing until measured
    if (!spots) return null;

    const spot = spots[step];
    const { fromPx, toPx, fromXPx, toXPx, below } = spot;

    return (
      <div className="fixed inset-0 z-[160] pointer-events-auto">
        {/* ── Dark masks ────────────────────────────────────────────────── */}
        {fromPx > 0 && (
          <div className="absolute left-0 right-0 top-0 bg-black/85 pointer-events-none"
               style={{ height: fromPx }} />
        )}
        {toPx < h && (
          <div className="absolute left-0 right-0 bottom-0 bg-black/85 pointer-events-none"
               style={{ height: h - toPx }} />
        )}
        {fromXPx > 0 && (
          <div className="absolute bg-black/85 pointer-events-none"
               style={{ top: fromPx, height: toPx - fromPx, left: 0, width: fromXPx }} />
        )}
        {toXPx < w && (
          <div className="absolute bg-black/85 pointer-events-none"
               style={{ top: fromPx, height: toPx - fromPx, right: 0, width: w - toXPx }} />
        )}

        {/* ── Backdrop click to dismiss ─────────────────────────────────── */}
        <div className="fixed inset-0 z-[161]" onClick={next} />

        {/* ── Tooltip card ──────────────────────────────────────────────── */}
        <div
          className="absolute left-0 right-0 flex flex-col items-center px-4 z-[162]"
          style={below ? { top: toPx } : { bottom: h - fromPx }}
        >
          {below && (
            <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-primary/60 mb-0.5" />
          )}

          <div className="bg-card border-2 border-primary/50 rounded-2xl p-4 max-w-xs w-full text-center shadow-2xl">
            <div className="flex gap-1.5 justify-center mb-2">
              {Array.from({ length: TOTAL_STEPS - 1 }).map((_, i) => (
                <div key={i} className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === step ? 'w-8 bg-primary' : 'w-3 bg-muted'
                )} />
              ))}
            </div>

            {step === 0 && (
              <div className="flex justify-center mb-2">
                <div
                  className="w-14 h-14 rounded-full border-2 border-primary/50 overflow-hidden flex items-center justify-center"
                  style={{ background: av?.color || 'hsl(var(--muted))' }}
                >
                  {av ? <AvatarImg avatar={av} size={56} /> : <EmojiImg emoji="👤" size={32} />}
                </div>
              </div>
            )}

            <div className="text-2xl mb-1">{content.emoji}</div>
            <h3 className="text-sm font-black text-foreground mb-1">{content.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">{content.desc}</p>

            <button
              onClick={next}
              className="w-full py-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm active:scale-95 transition-all"
            >
              {content.btn}
            </button>
            <button
              onClick={finish}
              className="w-full mt-1.5 py-1 text-xs text-muted-foreground"
            >
              {tr ? 'Geç' : 'Skip'}
            </button>
          </div>

          {!below && (
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-primary/60 mt-0.5" />
          )}
        </div>
      </div>
    );
  }

  // ── Step 3: Final CTA (no spotlight) ─────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/80 px-6">
      <div className="bg-card border-2 border-primary/50 rounded-3xl p-8 max-w-xs w-full text-center shadow-2xl">
        <EmojiImg emoji="👑" size={52} className="mx-auto mb-3" />
        <h2 className="text-xl font-black text-foreground mb-2">
          {tr ? 'Hükmetmeye hazır mısın?' : 'Ready to rule?'}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
          {tr
            ? 'Tahta geri dön ve iktidarını pekiştir.'
            : 'Return to the throne and consolidate your power.'}
        </p>
        <button
          onClick={finish}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-black text-base active:scale-95 transition-all"
        >
          {tr ? '👑 Hükmet!' : '👑 Rule!'}
        </button>
      </div>
    </div>
  );
}
