import { useState, useCallback } from 'react';
import { useGame } from '@/hooks/useGame';
import { PowerBars } from '@/components/game/PowerBars';
import { SwipeCard } from '@/components/game/SwipeCard';
import { GameOverScreen } from '@/components/game/GameOverScreen';
import { StartScreen } from '@/components/game/StartScreen';
import { PowerEffect } from '@/types/game';

const Index = () => {
  const { phase, power, currentCard, turn, highScore, gameOverInfo, startGame, swipe } = useGame();
  const [activeEffects, setActiveEffects] = useState<PowerEffect[]>([]);

  const handleHoverEffects = useCallback((effects: PowerEffect[]) => {
    setActiveEffects(effects);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {phase === 'start' && (
        <div className="flex-1 flex items-center justify-center">
          <StartScreen highScore={highScore} onStart={startGame} />
        </div>
      )}

      {phase === 'playing' && currentCard && (
        <>
          {/* Power bars */}
          <div className="pt-4 pb-2">
            <PowerBars power={power} activeEffects={activeEffects} />
            <div className="text-center text-xs text-muted-foreground mt-1">
              Tur: <span className="font-bold text-foreground">{turn}</span>
            </div>
          </div>

          {/* Card area */}
          <div className="flex-1 flex items-center justify-center px-4 pb-8">
            <SwipeCard
              key={currentCard.id + '-' + turn}
              card={currentCard}
              onSwipe={swipe}
              onHoverEffects={handleHoverEffects}
            />
          </div>
        </>
      )}

      {phase === 'gameover' && gameOverInfo && (
        <div className="flex-1 flex items-center justify-center">
          <GameOverScreen
            title={gameOverInfo.title}
            description={gameOverInfo.description}
            emoji={gameOverInfo.emoji}
            turn={turn}
            highScore={highScore}
            onRestart={startGame}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
