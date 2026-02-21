import { useState, useCallback } from 'react';
import { useGame } from '@/hooks/useGame';
import { PowerBars } from '@/components/game/PowerBars';
import { SwipeCard } from '@/components/game/SwipeCard';
import { GameOverScreen } from '@/components/game/GameOverScreen';
import { StartScreen } from '@/components/game/StartScreen';
import { BribeTutorial } from '@/components/game/BribeTutorial';
import { SplashScreen } from '@/components/game/SplashScreen';
import { PowerEffect } from '@/types/game';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { lang, t } = useLanguage();
  const {
    phase, power, money, currentCard, turn, highScore,
    gameOverInfo, lastMoneyChange, startGame, swipe,
    bribe, canBribe, getBribeCost, tutorialFaction,
    completeTutorialBribe, skipTutorial,
  } = useGame(lang);
  const [activeEffects, setActiveEffects] = useState<PowerEffect[]>([]);

  const handleHoverEffects = useCallback((effects: PowerEffect[]) => {
    setActiveEffects(effects);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {phase === 'start' && (
        <div className="flex-1 flex items-center justify-center">
          <StartScreen highScore={highScore} onStart={startGame} />
        </div>
      )}

      {phase === 'playing' && currentCard && (
        <>
          <div className="pt-2 pb-0">
            <PowerBars
              power={power}
              activeEffects={activeEffects}
              money={money}
              lastMoneyChange={lastMoneyChange}
              onBribe={bribe}
              canBribe={canBribe}
              getBribeCost={getBribeCost}
            />
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-4 pb-2">
            <SwipeCard
              key={currentCard.id + '-' + turn}
              card={currentCard}
              onSwipe={swipe}
              onHoverEffects={handleHoverEffects}
            />
            <div className="text-center text-xs text-muted-foreground mt-2">
              {t('game.turn')}: <span className="font-bold text-foreground">{turn}</span>
            </div>
          </div>
        </>
      )}

      {tutorialFaction && (
        <BribeTutorial
          faction={tutorialFaction}
          onBribe={completeTutorialBribe}
          onSkip={skipTutorial}
        />
      )}

      {phase === 'gameover' && gameOverInfo && (
        <div className="flex-1 flex items-center justify-center">
          <GameOverScreen
            title={gameOverInfo.title}
            description={gameOverInfo.description}
            emoji={gameOverInfo.emoji}
            turn={turn}
            highScore={highScore}
            money={money}
            onRestart={startGame}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
