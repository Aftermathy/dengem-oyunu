import { useState, useRef, useEffect } from 'react';
import { EventCard, PowerEffect } from '@/types/game';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

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

  if (exiting) {
    return (
      <div
        className="relative w-72 sm:w-80 transition-all duration-300 ease-out"
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
        "relative w-72 sm:w-80 cursor-grab select-none touch-none",
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
      </div>
      <div
        className="absolute -right-2 top-8 bg-emerald-500 text-white px-3 py-1 rounded-lg text-sm font-bold z-10 transition-opacity"
        style={{ opacity: dragX > 30 ? Math.min(1, dragX / 100) : 0 }}
      >
        {t('game.accept')} →
      </div>

      <CardContent card={card} direction={direction} t={t} />
    </div>
  );
}

function CardContent({ card, direction, t }: { card: EventCard; direction: 'left' | 'right' | null; t: (key: string) => string }) {
  return (
    <div className="bg-card border-2 border-border rounded-2xl shadow-xl overflow-hidden">
      {/* Character header */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/20 p-4 sm:p-6 text-center">
        <div className="text-5xl sm:text-6xl mb-2">{card.characterEmoji}</div>
        <h3 className="font-bold text-foreground text-sm sm:text-base">{card.character}</h3>
        <span className="text-[10px] sm:text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
          {card.category}
        </span>
      </div>

      {/* Description */}
      <div className="p-4 sm:p-5">
        <p className="text-sm sm:text-base text-foreground leading-relaxed italic">
          "{card.description}"
        </p>
      </div>

      {/* Choices */}
      <div className="grid grid-cols-2 border-t border-border">
        <div className={cn(
          "p-3 text-center text-xs sm:text-sm transition-colors border-r border-border",
          direction === 'left' ? 'bg-red-500/20 text-red-700 font-bold' : 'text-muted-foreground'
        )}>
          ← {card.leftChoice}
        </div>
        <div className={cn(
          "p-3 text-center text-xs sm:text-sm transition-colors",
          direction === 'right' ? 'bg-emerald-500/20 text-emerald-700 font-bold' : 'text-muted-foreground'
        )}>
          {card.rightChoice} →
        </div>
      </div>
    </div>
  );
}
