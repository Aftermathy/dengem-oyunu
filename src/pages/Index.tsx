import { useState, useCallback } from 'react';
import { EmojiImg } from '@/components/EmojiImg';
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
import { ElectionScreen } from '@/components/game/ElectionScreen';
import { getElectionConfig, getNextElectionInfo } from '@/data/electionData';
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
    currentElectionIndex, completedElections, handleElectionComplete,
  } = useGame(lang);
  const [activeEffects, setActiveEffects] = useState<PowerEffect[]>([]);
  const [projectedMoney, setProjectedMoney] = useState<number | null>(null);
  const electionConfig = currentElectionIndex !== null ? getElectionConfig(lang, currentElectionIndex) : null;
  const nextElectionInfo = getNextElectionInfo(turn, completedElections);

  const handleHoverEffects = useCallback((effects: PowerEffect[]) => {
    setActiveEffects(effects);
  }, []);

  const handleHoverMoney = useCallback((amount: number | null) => {
    setProjectedMoney(amount);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col bg-background overflow-hidden touch-none" style={{ overscrollBehavior: 'none', paddingTop: 'env(safe-area-inset-top)' }}>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {phase === 'start' && (
        <div className="flex-1 flex items-center justify-center">
          <StartScreen highScore={highScore} onStart={startGame} />
        </div>
      )}

      {phase === 'playing' && currentCard && (
        <>
          <div className="pt-1 pb-0 shrink-0">
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

          <div className="flex flex-col items-center justify-center py-0.5 animate-fade-in shrink-0" key={`turn-${turn}`}>
            <div className="flex items-center">
              <span className="text-base font-black tracking-wider text-foreground" style={{ fontFamily: "'Georgia', serif" }}>
                {2002 + Math.floor(turn / 4)}
              </span>
              <span className="text-sm font-bold text-primary ml-1.5 tracking-widest" style={{ fontFamily: "'Georgia', serif" }}>
                Q{(turn % 4) + 1}
              </span>
              <span className="text-[10px] text-muted-foreground/40 ml-1.5 font-mono">({turn})</span>
            </div>
            {nextElectionInfo && (
              <span className="text-[10px] font-bold text-red-400 animate-pulse mt-0.5">
                <EmojiImg emoji="🗳️" size={11} className="mr-0.5" /> {nextElectionInfo.year} {lang === 'en' ? 'Election' : 'Seçimi'}: {nextElectionInfo.turnsLeft} {lang === 'en' ? 'turns' : 'tur'}
              </span>
            )}
          </div>

          <div className="shrink-0">
            <LaunderBar
              totalLaundered={totalLaundered}
              money={money}
              onLaunder={launder}
              canLaunder={canLaunder}
            />
          </div>

          <div className="shrink-0">
            <LaunderShop
              totalLaundered={totalLaundered}
              lastShopResult={lastShopResult}
              onPropaganda={propaganda}
              canPropaganda={canPropaganda}
              propagandaCost={getPropagandaCost()}
              onAlliance={alliance}
              canAlliance={canAlliance}
              allianceCost={getAllianceCost()}
            />
          </div>

          <div className="flex-1 flex items-center justify-center px-4 min-h-0 pb-[env(safe-area-inset-bottom)]">
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

      {phase === 'election' && electionConfig && (
        <ElectionScreen
          config={electionConfig}
          money={money}
          launderedMoney={totalLaundered}
          halkPower={power.halk}
          lang={lang}
          onComplete={handleElectionComplete}
          onRestart={startGame}
          onMainMenu={goToMenu}
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
