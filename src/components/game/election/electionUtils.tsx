import { useState, useRef, useEffect, useMemo } from 'react';
import { ElectionCard, CardRarity } from '@/types/election';

/* ── Rarity styles ── */
export const RARITY_STYLES: Record<CardRarity, { border: string; bg: string; glow: string; label: string; labelColor: string; textColor: string }> = {
  common:    { border: 'border-zinc-500/60',       bg: 'bg-zinc-900/20 backdrop-blur-sm', glow: '',                                                    label: '★',    labelColor: 'text-zinc-400',           textColor: 'text-zinc-300' },
  uncommon:  { border: 'border-game-success/70',   bg: 'bg-game-success/10',              glow: 'shadow-[0_0_12px_hsl(var(--game-success)/0.3)]',      label: '★★',   labelColor: 'text-game-success-light', textColor: 'text-game-success-light' },
  epic:      { border: 'border-game-special/70',   bg: 'bg-game-special/10',              glow: 'shadow-[0_0_18px_hsl(var(--game-special)/0.4)]',      label: '★★★',  labelColor: 'text-game-special-light', textColor: 'text-game-special-light' },
  legendary: { border: 'border-game-danger/80',    bg: 'bg-game-danger/10',               glow: 'shadow-[0_0_25px_hsl(var(--game-danger)/0.5)]',       label: '★★★★', labelColor: 'text-game-danger-light',  textColor: 'text-game-danger-light' },
};

export const REROLL_COST = 3;
export const MAX_REROLLS = 2;

/* ── Card utilities ── */
export function drawCards(cards: ElectionCard[], count: number, exclude: number[] = []): ElectionCard[] {
  const pool = cards.filter(c => !exclude.includes(c.id));
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function selectAiCard(cards: ElectionCard[], gap: number, usedIds: number[]): ElectionCard {
  const pool = cards.filter(c => !usedIds.includes(c.id));
  const available = pool.length > 0 ? pool : cards;
  const pick = (arr: ElectionCard[]) => arr[Math.floor(Math.random() * arr.length)];

  if (gap > 10) {
    const legendary = available.filter(c => c.rarity === 'legendary');
    if (Math.random() < 0.6 && legendary.length > 0) return pick(legendary);
    const epicPlus = available.filter(c => c.rarity === 'epic' || c.rarity === 'legendary');
    if (Math.random() < 0.8 && epicPlus.length > 0) return pick(epicPlus);
    return pick(available);
  }
  if (gap > 6) {
    const epicPlus = available.filter(c => c.rarity === 'epic' || c.rarity === 'legendary');
    if (Math.random() < 0.4 && epicPlus.length > 0) return pick(epicPlus);
    return pick(available);
  }
  if (gap > 3) {
    const epic = available.filter(c => c.rarity === 'epic' || c.rarity === 'legendary');
    if (Math.random() < 0.3 && epic.length > 0) return pick(epic);
    const uncommonPlus = available.filter(c => c.rarity !== 'common');
    if (Math.random() < 0.4 && uncommonPlus.length > 0) return pick(uncommonPlus);
    return pick(available);
  }
  return pick(available);
}

/* ── Labels ── */
export interface ElectionLabels {
  opposition: string; you: string; pickMove: string;
  oppMoving: string; budget: string; laundered: string;
  specialPowers: string; round: string;
  electionWon: string; electionLost: string;
  continue: string; skip: string; vote: string;
  reroll: string; rerollCost: string;
  balconyTitle: string; balconySubtitle: string; balconyContinue: string;
  insufficientBudget: string; insufficientLaundered: string;
}

export function getElectionLabels(lang: string): ElectionLabels {
  return lang === 'en' ? {
    opposition: 'Opposition', you: 'You', pickMove: 'Pick your move:',
    oppMoving: 'Opposition is making a move...', budget: 'Budget', laundered: 'Laundered',
    specialPowers: 'Special Powers (Laundered)', round: 'Round',
    electionWon: 'ELECTION WON!', electionLost: 'ELECTION LOST!',
    continue: '4 More Years!', skip: 'Skip (+1%)', vote: 'vote',
    reroll: 'Reroll', rerollCost: `${REROLL_COST}B`,
    balconyTitle: 'CONGRATULATIONS!', balconySubtitle: 'The people have chosen you... again!',
    balconyContinue: '4 More Years!',
    insufficientBudget: '⚠️ Insufficient Budget!', insufficientLaundered: '⚠️ Not Enough Laundered!',
  } : {
    opposition: 'Muhalefet', you: 'Sen', pickMove: 'Hamle seç:',
    oppMoving: 'Muhalefet hamle yapıyor...', budget: 'Bütçe', laundered: 'Aklanmış',
    specialPowers: 'Özel Güçler (Aklanmış Para)', round: 'Tur',
    electionWon: 'SEÇİM KAZANILDI!', electionLost: 'SEÇİM KAYBEDİLDİ!',
    continue: '4 Sene Daha!', skip: 'Pas (+1%)', vote: 'oy',
    reroll: 'Yenile', rerollCost: `${REROLL_COST}B`,
    balconyTitle: 'TEBRİKLER!', balconySubtitle: 'Millet yine seni seçti... yine de!',
    balconyContinue: '4 Sene Daha Devam!',
    insufficientBudget: '⚠️ Yetersiz Bütçe!', insufficientLaundered: '⚠️ Yetersiz Aklanmış Para!',
  };
}

/* ── Shared mini-components ── */

const CONFETTI_COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6b9d', '#c084fc', '#fb923c', '#34d399'];

export function ConfettiOverlay() {
  const pieces = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i, left: `${5 + Math.random() * 90}%`,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: `${Math.random() * 1.5}s`, duration: `${2 + Math.random() * 2}s`,
      size: 6 + Math.random() * 6,
    })), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {pieces.map(p => (
        <span key={p.id} className="confetti-piece"
          style={{ left: p.left, width: p.size, height: p.size, background: p.color, animationDelay: p.delay, animationDuration: p.duration }} />
      ))}
    </div>
  );
}

export function EmberParticles({ count = 12 }: { count?: number }) {
  const embers = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i, left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 4}s`, duration: `${3 + Math.random() * 4}s`,
      size: 3 + Math.random() * 4,
    })), [count]);
  return <>
    {embers.map(e => (
      <span key={e.id} className="ember-particle"
        style={{ left: e.left, width: e.size, height: e.size, animationDelay: e.delay, animationDuration: e.duration }} />
    ))}
  </>;
}

export function StaggeredTitle({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split('').map((ch, i) => (
        <span key={i} className="letter-stagger inline-block" style={{ animationDelay: `${i * 0.05}s` }}>
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </span>
  );
}

export function useAnimatedCount(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setValue(Math.round(t * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

export function AnimatedVote({ value, color, label }: { value: number; color: string; label: string }) {
  const display = useAnimatedCount(value);
  return (
    <div className="text-center">
      <span className="text-4xl font-black" style={{ color }}>{display}%</span>
      <p className="text-sm mt-1" style={{ color }}>{label}</p>
    </div>
  );
}
