import { useState, useCallback, useRef } from 'react';
import { EmojiImg } from '@/components/EmojiImg';
import { useGame } from '@/hooks/useGame';
import { PowerBars } from '@/components/game/PowerBars';
import { SwipeCard } from '@/components/game/SwipeCard';
import { LaunderBar } from '@/components/game/LaunderBar';
import { GameOverScreen } from '@/components/game/GameOverScreen';
import { StartScreen } from '@/components/game/StartScreen';
import { BribeTutorial } from '@/components/game/BribeTutorial';
import { SettingsMenu } from '@/components/game/SettingsMenu';
import { SplashScreen } from '@/components/game/SplashScreen';
import { PowerEffect } from '@/types/game';
import { ElectionScreen } from '@/components/game/ElectionScreen';
import { getElectionConfig, getNextElectionInfo } from '@/data/electionData';
import { useLanguage } from '@/contexts/LanguageContext';
import { CardKnowledgeAnnouncement } from '@/components/game/CardKnowledgeAnnouncement';
import { TutorialAskScreen } from '@/components/game/TutorialAskScreen';
import { TutorialOverlay } from '@/components/game/TutorialOverlay';
import { hasSeenAnyCard, hasShownKnowledgeAnnouncement, markKnowledgeAnnouncementShown, getSeenCards } from '@/lib/cardMemory';
import { STORAGE_KEYS } from '@/constants/storage';

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { lang, t } = useLanguage();
  const {
    phase, power, money, currentCard, turn, highScore,
    gameOverInfo, lastMoneyChange, startGame, continueGame, swipe,
    bribe, canBribe, getBribeCost, tutorialFaction,
    completeTutorialBribe, skipTutorial, goToMenu,
    totalLaundered, canLaunder, launder,
    currentCardFirstSeen,
    currentElectionIndex, completedElections, handleElectionComplete,
  } = useGame(lang);
  const [activeEffects, setActiveEffects] = useState<PowerEffect[]>([]);
  const [projectedMoney, setProjectedMoney] = useState<number | null>(null);
  const [showKnowledgeAnnouncement, setShowKnowledgeAnnouncement] = useState(false);
  const [showTutorialAsk, setShowTutorialAsk] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const electionConfig = currentElectionIndex !== null ? getElectionConfig(lang, currentElectionIndex) : null;
  const nextElectionInfo = getNextElectionInfo(turn, completedElections);
  // Track election defeat so knowledge announcement fires even when onMainMenu is called directly
  // from ElectionScreen's defeat result (before phase ever becomes 'gameover')
  const electionDefeatRef = useRef(false);

  const handleHoverEffects = useCallback((effects: PowerEffect[]) => {
    setActiveEffects(effects);
  }, []);

  const handleHoverMoney = useCallback((amount: number | null) => {
    setProjectedMoney(amount);
  }, []);

  const handleGoToMenu = useCallback(() => {
    const wasGameOver = phase === 'gameover' || electionDefeatRef.current;
    electionDefeatRef.current = false;
    goToMenu();
    if (wasGameOver && hasSeenAnyCard() && !hasShownKnowledgeAnnouncement()) {
      setShowKnowledgeAnnouncement(true);
    }
  }, [phase, goToMenu]);

  const handleStartGame = useCallback(() => {
    startGame();
    const neverDeclined = localStorage.getItem(STORAGE_KEYS.TUTORIAL_DECLINED) !== 'true';
    const firstTimer = !hasSeenAnyCard();
    if (neverDeclined && firstTimer) {
      setShowTutorialAsk(true);
    }
  }, [startGame]);

  return (
    <div className="fixed inset-0 flex flex-col bg-background overflow-hidden touch-none overscroll-none pt-safe" onContextMenu={e => e.preventDefault()}>
      {/* Landscape block overlay */}
      <div className="landscape-block hidden fixed inset-0 z-[200] items-center justify-center bg-black text-white text-center p-8 flex-col gap-4" style={{ display: 'none' }}>
        <EmojiImg emoji="🔄" size={64} />
        <p className="text-xl font-black">{lang === 'en' ? 'Please rotate your device' : 'Lütfen cihazınızı dikey çevirin'}</p>
        <p className="text-sm text-white/60">{lang === 'en' ? 'This game is designed for portrait mode' : 'Bu oyun dikey mod için tasarlanmıştır'}</p>
      </div>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {phase === 'start' && (
        <StartScreen highScore={highScore} onStart={handleStartGame} onContinue={continueGame} />
      )}

      {phase === 'playing' && currentCard && (
        <>
          <div className="pt-1 pb-0 shrink-0 relative">
            <div className="absolute right-2 top-1 z-40">
              <SettingsMenu onMainMenu={handleGoToMenu} />
            </div>
            <PowerBars
              power={power}
              activeEffects={activeEffects}
              money={money}
              lastMoneyChange={lastMoneyChange}
              projectedMoney={projectedMoney}
              onBribe={bribe}
              canBribe={canBribe}
              getBribeCost={getBribeCost}
              isFirstSeenCard={currentCardFirstSeen}
            />
          </div>

          <div className="flex flex-col items-center justify-center py-0.5 animate-fade-in shrink-0" key={`turn-${turn}`}>
            <div className="flex items-center">
              <span className="text-base font-black tracking-wider text-foreground font-georgia">
                {2002 + Math.floor(turn / 4)}
              </span>
              <span className="text-sm font-bold text-primary ml-1.5 tracking-widest font-georgia">
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

          <div className="flex-1 flex items-center justify-center px-4 min-h-0 pb-[env(safe-area-inset-bottom)]">
            <SwipeCard
              key={currentCard.id + '-' + turn}
              card={currentCard}
              onSwipe={swipe}
              onHoverEffects={handleHoverEffects}
              onHoverMoney={handleHoverMoney}
              isFirstSeen={currentCardFirstSeen}
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
          onMainMenu={() => {
            // Mark as election defeat so knowledge announcement fires correctly.
            // ElectionScreen's defeat screen calls onMainMenu directly (bypassing onComplete),
            // so phase stays 'election' — we need this ref to know it was a loss.
            electionDefeatRef.current = true;
            handleGoToMenu();
          }}
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
          onMainMenu={handleGoToMenu}
        />
      )}

      {showKnowledgeAnnouncement && (
        <CardKnowledgeAnnouncement seenCount={getSeenCards().size} onDismiss={() => { markKnowledgeAnnouncementShown(); setShowKnowledgeAnnouncement(false); }} />
      )}

      {showTutorialAsk && (
        <TutorialAskScreen
          onYes={() => { setShowTutorialAsk(false); setShowTutorial(true); }}
          onNo={() => { localStorage.setItem(STORAGE_KEYS.TUTORIAL_DECLINED, 'true'); setShowTutorialAsk(false); }}
        />
      )}

      {showTutorial && (
        <TutorialOverlay onComplete={() => setShowTutorial(false)} />
      )}
    </div>
  );
};

export default Index;
