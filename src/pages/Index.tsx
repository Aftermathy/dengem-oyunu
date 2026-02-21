import { useState, useCallback } from 'react';
import { useGame } from '@/hooks/useGame';
import { PowerBars } from '@/components/game/PowerBars';
import { SwipeCard } from '@/components/game/SwipeCard';
import { LaunderBar } from '@/components/game/LaunderBar';
import { LaunderShop } from '@/components/game/LaunderShop';
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
    completeTutorialBribe, skipTutorial, goToMenu,
    totalLaundered, canLaunder, launder, lastShopResult,
    propaganda, canPropaganda, getPropagandaCost,
    invest, canInvest, getInvestmentCost,
    alliance, canAlliance, getAllianceCost,
  } = useGame(lang);
  const [activeEffects, setActiveEffects] = useState<PowerEffect[]>([]);
  const [projectedMoney, setProjectedMoney] = useState<number | null>(null);

  const handleHoverEffects = useCallback((effects: PowerEffect[]) => {
    setActiveEffects(effects);
  }, []);

  const handleHoverMoney = useCallback((amount: number | null) => {
    setProjectedMoney(amount);
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
              projectedMoney={projectedMoney}
              onBribe={bribe}
              canBribe={canBribe}
              getBribeCost={getBribeCost}
            />
          </div>

          <div className="flex items-center justify-center py-2 animate-fade-in" key={`turn-${turn}`}>
            <span className="text-lg font-black tracking-wider text-foreground" style={{ fontFamily: "'Georgia', serif" }}>
              {2002 + Math.floor(turn / 4)}
            </span>
            <span className="text-base font-bold text-primary ml-1.5 tracking-widest" style={{ fontFamily: "'Georgia', serif" }}>
              Q{(turn % 4) + 1}
            </span>
            <span className="text-xs text-muted-foreground/40 ml-1.5 font-mono">({turn})</span>
          </div>

          <LaunderBar
            totalLaundered={totalLaundered}
            money={money}
            onLaunder={launder}
            canLaunder={canLaunder}
          />

          <LaunderShop
            totalLaundered={totalLaundered}
            lastShopResult={lastShopResult}
            onPropaganda={propaganda}
            canPropaganda={canPropaganda}
            propagandaCost={getPropagandaCost()}
            onInvest={invest}
            canInvest={canInvest}
            investCost={getInvestmentCost()}
            onAlliance={alliance}
            canAlliance={canAlliance}
            allianceCost={getAllianceCost()}
          />

          <div className="flex-1 flex items-center justify-center px-4 pb-2">
            <SwipeCard
              key={currentCard.id + '-' + turn}
              card={currentCard}
              onSwipe={swipe}
              onHoverEffects={handleHoverEffects}
              onHoverMoney={handleHoverMoney}
            />
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
        <GameOverScreen
          title={gameOverInfo.title}
          description={gameOverInfo.description}
          emoji={gameOverInfo.emoji}
          image={gameOverInfo.image}
          turn={turn}
          highScore={highScore}
          money={money}
          onRestart={startGame}
          onMainMenu={goToMenu}
        />
      )}
    </div>
  );
};

export default Index;
