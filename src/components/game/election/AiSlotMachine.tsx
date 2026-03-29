import { useState, useEffect, useRef } from 'react';
import { ElectionCard } from '@/types/election';
import { EmojiImg } from '@/components/EmojiImg';
import { RARITY_STYLES } from './electionUtils';

interface AiSlotMachineProps {
  cards: ElectionCard[];      // exactly 4 cards
  winnerIndex: number;        // which one the AI actually plays
  onSettled: (winner: ElectionCard) => void;
}

export function AiSlotMachine({ cards, winnerIndex, onSettled }: AiSlotMachineProps) {
  const [highlightIdx, setHighlightIdx] = useState<number>(0);
  const [settled, setSettled] = useState(false);
  const onSettledRef = useRef(onSettled);
  onSettledRef.current = onSettled;

  useEffect(() => {
    const n = cards.length; // 4

    // Build a hop sequence that starts at pos 0, cycles, and lands on winnerIndex.
    // Total hops = winnerIndex + 12 guarantees:
    //   (winnerIndex + 12) % 4 === winnerIndex  (since 12 % 4 === 0)
    // This gives 12–15 hops depending on the winner slot.
    const totalHops = winnerIndex + 12;

    // Cubic ease-out: delay goes from ~55ms (fast) to ~450ms (slow)
    const delay = (i: number) => {
      const t = i / Math.max(totalHops - 1, 1);
      return Math.round(55 + t * t * t * 395); // 55 → 450 ms
    };

    const timers: ReturnType<typeof setTimeout>[] = [];
    let cumTime = 0;

    for (let hop = 0; hop < totalHops; hop++) {
      cumTime += delay(hop);
      const pos = (hop + 1) % n;
      timers.push(setTimeout(() => setHighlightIdx(pos), cumTime));
    }

    // Settle 500 ms after the final hop
    timers.push(
      setTimeout(() => {
        setSettled(true);
        onSettledRef.current(cards[winnerIndex]);
      }, cumTime + 500),
    );

    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-2 px-2 w-full max-w-sm mx-auto">
      {cards.map((card, i) => {
        const isHighlighted = !settled && i === highlightIdx;
        const isWinner = settled && i === winnerIndex;
        const isLoser = settled && i !== winnerIndex;
        const style = RARITY_STYLES[card.rarity];

        return (
          <div
            key={card.id}
            className={`relative border-2 rounded-xl p-3 flex items-center gap-3 transition-all ${
              isWinner
                ? `${style.border} ${style.bg} ${style.glow} scale-[1.04] duration-500`
                : isLoser
                ? 'border-white/10 bg-white/5 opacity-20 duration-700'
                : isHighlighted
                ? 'border-game-danger bg-game-danger/20 scale-[1.02] duration-75'
                : 'border-white/15 bg-white/5 duration-75'
            }`}
            style={
              isHighlighted
                ? { boxShadow: '0 0 22px hsl(var(--game-danger) / 0.65), inset 0 0 8px hsl(var(--game-danger) / 0.15)' }
                : isWinner
                ? { boxShadow: '0 0 28px hsl(var(--game-danger) / 0.5)' }
                : undefined
            }
          >
            {/* Spinning border flash when highlighted */}
            {isHighlighted && (
              <div
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, hsl(var(--game-danger)/0.4), transparent, hsl(var(--game-danger)/0.4))',
                  animation: 'slot-sweep 0.25s linear',
                }}
              />
            )}

            <EmojiImg
              emoji={card.emoji}
              size={28}
              className={`shrink-0 transition-all duration-300 ${isLoser ? 'grayscale opacity-30' : ''}`}
            />
            <p className={`text-sm font-bold leading-tight flex-1 transition-colors duration-500 ${
              isLoser ? 'text-white/25' : 'text-white'
            }`}>
              {card.text}
            </p>
            <span className={`text-sm font-black shrink-0 transition-all duration-300 ${
              isWinner
                ? 'text-game-danger-light scale-110'
                : isLoser
                ? 'text-white/20'
                : isHighlighted
                ? 'text-white'
                : 'text-white/50'
            }`}>
              -{card.voterEffect}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
