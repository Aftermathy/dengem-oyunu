import { useState, useRef, useEffect } from 'react';
import { EventCard, PowerEffect } from '@/types/game';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { playSwipeSound } from '@/hooks/useSound';

interface SwipeCardProps {
  card: EventCard;
  onSwipe: (direction: 'left' | 'right') => void;
  onHoverEffects: (effects: PowerEffect[]) => void;
}

export function SwipeCard({ card, onSwipe, onHoverEffects }: SwipeCardProps) {
  const { t } = useLanguage();
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [exiting, setExiting] = useState<'left' | 'right' | null>(null);
  const startX = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const threshold = 100;
  const direction = dragX > 30 ? 'right' : dragX < -30 ? 'left' : null;

  useEffect(() => {
    if (direction === 'right') {
      onHoverEffects(card.rightEffects);
    } else if (direction === 'left') {
      onHoverEffects(card.leftEffects);
    } else {
      onHoverEffects([]);
    }
  }, [direction, card, onHoverEffects]);

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
  };

  const rotation = dragX * 0.1;

  const getMoneyPreview = (dir: 'left' | 'right') => {
    const m = dir === 'left' ? card.leftMoney : card.rightMoney;
    if (!m) return null;
    return m;
  };

  if (exiting) {
    return (
      <div
        className="relative w-72 sm:w-80 md:w-96 transition-all duration-300 ease-out"
        style={{
          transform: `translateX(${exiting === 'left' ? -500 : 500}px) rotate(${exiting === 'left' ? -30 : 30}deg)`,
          opacity: 0,
        }}
      >
        <CardContent card={card} direction={null} t={t} />
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative w-72 sm:w-80 md:w-96 cursor-grab select-none touch-none",
        isDragging && "cursor-grabbing"
      )}
      style={{
        transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Choice labels */}
      <div
        className="absolute -left-2 top-8 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold z-10 transition-opacity"
        style={{ opacity: dragX < -30 ? Math.min(1, Math.abs(dragX) / 100) : 0 }}
      >
        ← {t('game.reject')}
        {getMoneyPreview('left') !== null && (
          <span className="ml-1 text-xs">
            ({getMoneyPreview('left')! > 0 ? '+' : ''}{getMoneyPreview('left')}M)
          </span>
        )}
      </div>
      <div
        className="absolute -right-2 top-8 bg-emerald-500 text-white px-3 py-1 rounded-lg text-sm font-bold z-10 transition-opacity"
        style={{ opacity: dragX > 30 ? Math.min(1, dragX / 100) : 0 }}
      >
        {t('game.accept')} →
        {getMoneyPreview('right') !== null && (
          <span className="ml-1 text-xs">
            ({getMoneyPreview('right')! > 0 ? '+' : ''}{getMoneyPreview('right')}M)
          </span>
        )}
      </div>

      <CardContent card={card} direction={direction} t={t} />
    </div>
  );
}

function CardContent({ card, direction, t }: { card: EventCard; direction: 'left' | 'right' | null; t: (key: string) => string }) {
  const leftMoney = card.leftMoney || 0;
  const rightMoney = card.rightMoney || 0;

  return (
    <div className="bg-card border-2 border-border rounded-2xl shadow-xl overflow-hidden">
      {/* Character header */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/20 p-5 sm:p-7 text-center">
        <div className="text-6xl sm:text-7xl mb-3">{card.characterEmoji}</div>
        <h3 className="font-bold text-foreground text-base sm:text-lg">{card.character}</h3>
        <span className="text-xs sm:text-sm bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
          {card.category}
        </span>
      </div>

      {/* Description */}
      <div className="p-5 sm:p-6">
        <p className="text-base sm:text-lg text-foreground leading-relaxed italic">
          "{card.description}"
        </p>
      </div>

      {/* Choices */}
      <div className="grid grid-cols-2 border-t border-border">
        <div className={cn(
          "p-3 sm:p-4 text-center text-sm sm:text-base transition-colors border-r border-border",
          direction === 'left' ? 'bg-red-500/20 text-red-700 font-bold' : 'text-muted-foreground'
        )}>
          ← {card.leftChoice}
          {leftMoney !== 0 && (
            <div className={cn("text-xs font-bold mt-0.5", leftMoney > 0 ? 'text-emerald-600' : 'text-red-600')}>
              {leftMoney > 0 ? '+' : ''}{leftMoney}M 💰
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 sm:p-4 text-center text-sm sm:text-base transition-colors",
          direction === 'right' ? 'bg-emerald-500/20 text-emerald-700 font-bold' : 'text-muted-foreground'
        )}>
          {card.rightChoice} →
          {rightMoney !== 0 && (
            <div className={cn("text-xs font-bold mt-0.5", rightMoney > 0 ? 'text-emerald-600' : 'text-red-600')}>
              {rightMoney > 0 ? '+' : ''}{rightMoney}M 💰
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
