import { useState, useRef, useEffect } from 'react';
import { EventCard, PowerEffect } from '@/types/game';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { EmojiImg } from '@/components/EmojiImg';
import { playSwipeSound } from '@/hooks/useSound';
import arrowLeft from '@/assets/arrow-left.svg';
import arrowRight from '@/assets/arrow-right.svg';

interface SwipeCardProps {
  card: EventCard;
  onSwipe: (direction: 'left' | 'right') => void;
  onHoverEffects: (effects: PowerEffect[]) => void;
  onHoverMoney: (amount: number | null) => void;
  isFirstSeen: boolean;
}

export function SwipeCard({ card, onSwipe, onHoverEffects, onHoverMoney, isFirstSeen }: SwipeCardProps) {
  const { t } = useLanguage();
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [exiting, setExiting] = useState<'left' | 'right' | null>(null);
  const startX = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const threshold = 80;
  const direction = dragX > 25 ? 'right' : dragX < -25 ? 'left' : null;

  useEffect(() => {
    if (direction === 'right') {
      // Always pass effects so PowerBars can show white glow on first-seen
      onHoverEffects(card.rightEffects);
      onHoverMoney(isFirstSeen ? null : (card.rightMoney || null));
    } else if (direction === 'left') {
      onHoverEffects(card.leftEffects);
      onHoverMoney(isFirstSeen ? null : (card.leftMoney || null));
    } else {
      onHoverEffects([]);
      onHoverMoney(null);
    }
  }, [direction, card, onHoverEffects, onHoverMoney, isFirstSeen]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setDragX(e.clientX - startX.current);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(dragX) > threshold) {
      const dir = dragX > 0 ? 'right' : 'left';
      playSwipeSound(dir);
      setExiting(dir);
      setTimeout(() => {
        onSwipe(dir);
        setExiting(null);
        setDragX(0);
      }, 300);
    } else {
      setDragX(0);
    }
    onHoverEffects([]);
    onHoverMoney(null);
  };

  const rotation = dragX * 0.1;
  const leftActive = dragX < -25;
  const rightActive = dragX > 25;

  if (exiting) {
    return (
      <div className="relative w-full max-w-md h-full">
        <div
          className="relative w-full h-full transition-all duration-300 ease-out"
          style={{
            transform: `translateX(${exiting === 'left' ? -500 : 500}px) rotate(${exiting === 'left' ? -30 : 30}deg)`,
            opacity: 0,
          }}
        >
          <CardContent card={card} direction={null} t={t} isFirstSeen={false} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md h-full flex items-center">
      {/* Left arrow — far left edge */}
      <img
        src={arrowLeft}
        alt="swipe left"
        className={cn(
          "absolute -left-7 z-20 w-12 h-12 transition-all duration-200 pointer-events-none select-none",
          leftActive ? "opacity-100 scale-110" : "opacity-20"
        )}
      />

      {/* Right arrow — far right edge */}
      <img
        src={arrowRight}
        alt="swipe right"
        className={cn(
          "absolute -right-7 z-20 w-12 h-12 transition-all duration-200 pointer-events-none select-none",
          rightActive ? "opacity-100 scale-110" : "opacity-20"
        )}
      />

      {/* Swipeable card */}
      <div
        ref={cardRef}
        className={cn(
          "relative w-full h-full cursor-grab select-none touch-none",
          isDragging && "cursor-grabbing",
          leftActive && "ring-2 ring-red-400 rounded-2xl",
          rightActive && "ring-2 ring-emerald-400 rounded-2xl",
        )}
        style={{
          transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <CardContent card={card} direction={direction} t={t} isFirstSeen={isFirstSeen} />
      </div>
    </div>
  );
}

function CardContent({ card, direction, t, isFirstSeen }: {
  card: EventCard;
  direction: 'left' | 'right' | null;
  t: (key: string) => string;
  isFirstSeen: boolean;
}) {
  const leftMoney = card.leftMoney ?? 0;
  const rightMoney = card.rightMoney ?? 0;

  return (
    <div className="bg-card border-2 border-border rounded-2xl shadow-xl overflow-hidden h-full flex flex-col" style={{ transform: 'scale(0.9)', transformOrigin: 'center' }}>
      {/* Character header */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/20 p-3 text-center flex-[2] flex flex-col items-center justify-center min-h-0">
        <div className="mb-1"><EmojiImg emoji={card.characterEmoji} size={90} /></div>
        <h3 className="font-bold text-foreground text-2xl">{card.character}</h3>
        <span className="text-sm bg-muted px-3 py-0.5 rounded-full text-muted-foreground mt-0.5">
          {card.category}
        </span>
      </div>

      {/* Description */}
      <div className="px-5 py-2 flex-[2] flex items-center border-t border-border/30 min-h-0">
        <p className="text-sm text-foreground leading-snug italic w-full">
          "{card.description}"
        </p>
      </div>

      {/* Section A — Choices row (2× taller) */}
      <div className="grid grid-cols-2 border-t border-border flex-shrink-0">
        <div className={cn(
          "flex items-center gap-2 px-3 py-4 text-sm transition-colors border-r border-border min-h-[72px]",
          direction === 'left' ? 'bg-red-500/15 text-red-600 font-bold' : 'text-muted-foreground'
        )}>
          <span className="text-base shrink-0">←</span>
          <span className="leading-tight">{card.leftChoice}</span>
        </div>
        <div className={cn(
          "flex items-center justify-end gap-2 px-3 py-4 text-sm transition-colors min-h-[72px]",
          direction === 'right' ? 'bg-emerald-500/15 text-emerald-600 font-bold' : 'text-muted-foreground'
        )}>
          <span className="text-right leading-tight">{card.rightChoice}</span>
          <span className="text-base shrink-0">→</span>
        </div>
      </div>

      {/* Section B — Money row (2× taller) */}
      <div className="grid grid-cols-2 border-t border-border/60 bg-muted/20 flex-shrink-0">
        <div className="flex items-center justify-center text-sm font-bold py-3 min-h-[52px] border-r border-border/60">
          {isFirstSeen ? (
            <span className="text-muted-foreground/60 tracking-widest">? 💰</span>
          ) : leftMoney !== 0 ? (
            <span className={leftMoney > 0 ? 'text-emerald-600' : 'text-red-500'}>
              {leftMoney > 0 ? '+' : ''}{leftMoney}B 💰
            </span>
          ) : (
            <span className="text-muted-foreground/40">—</span>
          )}
        </div>
        <div className="flex items-center justify-center text-sm font-bold py-3 min-h-[52px]">
          {isFirstSeen ? (
            <span className="text-muted-foreground/60 tracking-widest">? 💰</span>
          ) : rightMoney !== 0 ? (
            <span className={rightMoney > 0 ? 'text-emerald-600' : 'text-red-500'}>
              {rightMoney > 0 ? '+' : ''}{rightMoney}B 💰
            </span>
          ) : (
            <span className="text-muted-foreground/40">—</span>
          )}
        </div>
      </div>
    </div>
  );
}
