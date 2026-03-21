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
import { CrisisAlert } from '@/components/game/CrisisAlert';
import { PowerEffect } from '@/types/game';
import { ElectionScreen } from '@/components/game/ElectionScreen';
import { getElectionConfig, getNextElectionInfo } from '@/data/electionData';
import { useLanguage } from '@/contexts/LanguageContext';
import { CardKnowledgeAnnouncement } from '@/components/game/CardKnowledgeAnnouncement';
import { TutorialAskScreen } from '@/components/game/TutorialAskScreen';
import { TutorialOverlay } from '@/components/game/TutorialOverlay';
import { AchievementPopup } from '@/components/game/AchievementPopup';
import { OnboardingScreen } from '@/components/game/OnboardingScreen';
import { ProfileScreen } from '@/components/game/ProfileScreen';
import { LeaderboardScreen } from '@/components/game/LeaderboardScreen';
import { hasSeenAnyCard, hasShownKnowledgeAnnouncement, markKnowledgeAnnouncementShown, getSeenCards } from '@/lib/cardMemory';
import { useMetaGame } from '@/contexts/MetaGameContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { STORAGE_KEYS } from '@/constants/storage';
import { hasSavedGame, loadGame } from '@/lib/gameSave';
import { GameIcon } from '@/components/GameIcon';
import { submitScore } from '@/lib/leaderboard';

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { lang } = useLanguage();
  const {
    phase, power, money, currentCard, turn, highScore,
    gameOverInfo, lastMoneyChange, startGame, continueGame, swipe,
    bribe, canBribe, getBribeCost, tutorialFaction,
    completeTutorialBribe, skipTutorial, goToMenu,
    totalLaundered, canLaunder, launder,
    currentCardFirstSeen,
    currentElectionIndex, completedElections, handleElectionComplete,
    handleElectionLoss,
    pendingAchievements, clearPendingAchievement,
    maxMoney: _maxMoney, maxElectionPct: _maxElectionPct, peakLaundered: _peakLaundered,
    lastEarnedAP,
    crisisAlertType, clearCrisisAlert,
    ohalLevel,
  } = useGame(lang);
  const { modifiers } = useMetaGame();
  const { userProfile, updateProfile } = useUserProfile();
  const electionCostFactor = modifiers.ohalElectionCostMult ?? 1;
  const offshoreRate = modifiers.offshoreRate ?? 0;

  const [activeEffects, setActiveEffects] = useState<PowerEffect[]>([]);
  const [projectedMoney, setProjectedMoney] = useState<number | null>(null);
  const [showKnowledgeAnnouncement, setShowKnowledgeAnnouncement] = useState(false);
  const [showTutorialAsk, setShowTutorialAsk] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const electionConfig = currentElectionIndex !== null ? getElectionConfig(lang, currentElectionIndex) : null;
  const nextElectionInfo = getNextElectionInfo(turn, completedElections);
  const electionDefeatRef = useRef(false);

  const handleHoverEffects = useCallback((effects: PowerEffect[]) => {
    setActiveEffects(effects);
  }, []);

  const handleHoverMoney = useCallback((amount: number | null) => {
    setProjectedMoney(amount);
  }, []);

  // ── DRY: Single function for recording game end + leaderboard submit ──
  const recordGameEnd = useCallback(() => {
    updateProfile({
      totalTurns: userProfile.totalTurns + turn,
      gamesPlayed: userProfile.gamesPlayed + 1,
    });
    submitScore({
      nickname: userProfile.nickname || 'Player',
      score: userProfile.totalAP + lastEarnedAP,
      elections_won: completedElections.length,
    });
  }, [updateProfile, userProfile.totalTurns, userProfile.gamesPlayed, userProfile.totalAP, userProfile.nickname, turn, lastEarnedAP, completedElections]);

  // ── DRY: Wraps an action with recordGameEnd + onboarding gate ──
  const withGameEnd = useCallback((action: () => void) => {
    recordGameEnd();
    if (!userProfile.hasCompletedOnboarding) {
      setShowOnboarding(true);
      return;
    }
    action();
  }, [recordGameEnd, userProfile.hasCompletedOnboarding]);

  const handleGoToMenu = useCallback(() => {
    const wasGameOver = phase === 'gameover' || electionDefeatRef.current;
    electionDefeatRef.current = false;
    goToMenu();
    if (wasGameOver && hasSeenAnyCard() && !hasShownKnowledgeAnnouncement()) {
      setShowKnowledgeAnnouncement(true);
    }
  }, [phase, goToMenu]);

  const handleStartGame = useCallback(() => {
    if (hasSavedGame()) {
      const abandoned = loadGame();
      if (abandoned && abandoned.turn > 0) {
        updateProfile({
          totalTurns: userProfile.totalTurns + abandoned.turn,
          gamesPlayed: userProfile.gamesPlayed + 1,
        });
      }
    }
    startGame();
    const neverDeclined = localStorage.getItem(STORAGE_KEYS.TUTORIAL_DECLINED) !== 'true';
    const firstTimer = !hasSeenAnyCard();
    if (neverDeclined && firstTimer) {
      setShowTutorialAsk(true);
    }
  }, [startGame, userProfile, updateProfile]);

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
        <StartScreen
          highScore={highScore}
          onStart={handleStartGame}
          onContinue={continueGame}
          onShowProfile={() => setShowProfile(true)}
          onShowLeaderboard={() => setShowLeaderboard(true)}
          onEquipAvatar={(avatarId) => updateProfile({ avatarId })}
          userProfile={userProfile}
        />
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
            <div className="flex items-center gap-2">
              {nextElectionInfo && (
                <span className="text-[10px] font-bold text-red-400 animate-pulse mt-0.5">
                  <EmojiImg emoji="🗳️" size={11} className="mr-0.5" /> {nextElectionInfo.year} {lang === 'en' ? 'Election' : 'Seçimi'}: {nextElectionInfo.turnsLeft} {lang === 'en' ? 'turns' : 'tur'}
                </span>
              )}
              {ohalLevel > 0 && (
                <span className="text-[10px] font-black mt-0.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full"
                  style={{
                    background: 'hsl(0 80% 50% / 0.2)',
                    color: 'hsl(0 80% 60%)',
                    border: '1px solid hsl(0 80% 50% / 0.4)',
                  }}
                >
                  <GameIcon name="alert_triangle" size={9} />
                  OHAL {ohalLevel}
                </span>
              )}
            </div>
          </div>

          <div className="shrink-0">
            <LaunderBar
              totalLaundered={totalLaundered}
              money={money}
              onLaunder={launder}
              canLaunder={canLaunder}
              offshoreRate={offshoreRate}
              launderOutput={modifiers.launderOutput}
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
          costFactor={electionCostFactor}
          onComplete={(result) => withGameEnd(() => handleElectionComplete(result))}
          onLossDetected={handleElectionLoss}
          onRestart={() => withGameEnd(() => startGame())}
          onMainMenu={() => withGameEnd(() => {
            electionDefeatRef.current = true;
            handleGoToMenu();
          })}
          earnedAP={lastEarnedAP}
        />
      )}

      {phase === 'gameover' && gameOverInfo && !showOnboarding && (
        <GameOverScreen
          title={gameOverInfo.title}
          description={gameOverInfo.description}
          emoji={gameOverInfo.emoji}
          image={gameOverInfo.image}
          turn={turn}
          highScore={highScore}
          money={money}
          electionsWon={completedElections.length}
          earnedAP={lastEarnedAP}
          onRestart={() => withGameEnd(() => startGame())}
          onMainMenu={() => withGameEnd(() => handleGoToMenu())}
        />
      )}

      {showOnboarding && (
        <OnboardingScreen
          onComplete={(nickname, avatarId) => {
            updateProfile({ nickname, avatarId, hasCompletedOnboarding: true });
            setShowOnboarding(false);
            handleGoToMenu();
          }}
        />
      )}

      {showProfile && (
        <ProfileScreen
          profile={userProfile}
          onUpdateProfile={updateProfile}
          onClose={() => setShowProfile(false)}
        />
      )}

      {showLeaderboard && (
        <LeaderboardScreen
          userProfile={userProfile}
          onUpdateProfile={updateProfile}
          onClose={() => setShowLeaderboard(false)}
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

      {pendingAchievements.length > 0 && (
        <AchievementPopup
          key={pendingAchievements[0]}
          achievementId={pendingAchievements[0]}
          onDone={clearPendingAchievement}
        />
      )}

      {crisisAlertType && (
        <CrisisAlert
          key={crisisAlertType}
          type={crisisAlertType}
          onDone={clearCrisisAlert}
        />
      )}
    </div>
  );
};

export default Index;
