import { useState, useCallback, useEffect, useRef } from 'react';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { PowerState, PowerType, EventCard, GamePhase } from '@/types/game';
import { isAdFree, handleAdTrigger, incrementGamesPlayed } from '@/hooks/useAds';
import { playGameOverSound } from '@/hooks/useSound';
import { saveGame, loadGame, clearSave } from '@/lib/gameSave';
import { STORAGE_KEYS } from '@/constants/storage';
import { GAME_CONFIG } from '@/constants/gameConfig';
import { shuffleArray, applyCardEffects, calculateMaxIncome, findLowFaction } from '@/lib/gameLogic';
import { trackEvent } from '@/lib/analytics';
import { markCardSeen, isCardSeen } from '@/lib/cardMemory';
import { eventCards, catConsultantCard, milestoneCard50, darkModeCard, dlcCardsTR } from '@/data/cards';
import { eventCardsEn, catConsultantCardEn, milestoneCard50En, darkModeCardEn, dlcCardsEN } from '@/data/cards-en';
import { gameOverScenarios } from '@/data/gameOverScenarios';
import { gameOverScenariosEn } from '@/data/gameOverScenarios-en';
import { Language, useLanguage } from '@/contexts/LanguageContext';
import { ELECTION_TRIGGER_MAP, getElectionConfig } from '@/data/electionData';
import { ElectionResult } from '@/types/election';
import { darkModeChain_TR } from '@/data/chainCards';
import { darkModeChain_EN } from '@/data/chainCards-en';
import { CHAIN_TRIGGERS_TR, type ChainDelay } from '@/data/chainCardsByTurn';
import { CHAIN_TRIGGERS_EN } from '@/data/chainCardsByTurn-en';
import { useBribe } from '@/hooks/useBribe';
import { useLaunderShop } from '@/hooks/useLaunderShop';
import { useMetaGame } from '@/contexts/MetaGameContext';
import { useAchievements } from '@/hooks/useAchievements';
import { calculateAP } from '@/types/metaGame';

const INITIAL_POWER: PowerState = {
  halk: GAME_CONFIG.INITIAL_POWER,
  yatirimcilar: GAME_CONFIG.INITIAL_POWER,
  mafya: GAME_CONFIG.INITIAL_POWER,
  tarikat: GAME_CONFIG.INITIAL_POWER,
  ordu: GAME_CONFIG.INITIAL_POWER,
};

function getCards(lang: Language, rareBonus: number = 0) {
  const base = lang === 'en' ? eventCardsEn : eventCards;
  const dlc = lang === 'en' ? dlcCardsEN : dlcCardsTR;
  const cards = isAdFree() ? [...base, ...dlc] : [...base];
  const cat = lang === 'en' ? catConsultantCardEn : catConsultantCard;
  if (Math.random() < GAME_CONFIG.CAT_CARD_CHANCE + rareBonus) {
    const pos = Math.floor(Math.random() * Math.min(GAME_CONFIG.CAT_MAX_POSITION, cards.length));
    cards.splice(pos, 0, cat);
  }
  return cards;
}

function getMilestoneCard(lang: Language) {
  return lang === 'en' ? milestoneCard50En : milestoneCard50;
}

function getScenarios(lang: Language) {
  return lang === 'en' ? gameOverScenariosEn : gameOverScenarios;
}

function resolveChainDelay(delay: ChainDelay): number {
  if (typeof delay === 'number') return delay;
  return Math.floor(Math.random() * (delay.max - delay.min + 1)) + delay.min;
}

/**
 * `'both'` exists because a single card can zero a faction and bankrupt the
 * player at once (card 25 does). Both jokers are then spent, but the second
 * setCrisisAlertType used to overwrite the first, so the player was told about
 * one of the two things they had just used up.
 */
export type CrisisAlertType = 'crisis' | 'emergency_fund' | 'both' | null;

// Last regular-swipe turn before the final election fires at turn 87.
// Chain cards scheduled beyond this turn will never be shown.
const LAST_SWIPE_TURN = Math.max(...Object.keys(ELECTION_TRIGGER_MAP).map(Number)) - 1;

export function useGame(lang: Language) {
  const { t } = useLanguage();
  const {
    modifiers, earnAP, crisisAvailableThisGame, spendCrisisJoker,
    emergencyFundAvailableThisGame, spendEmergencyFund, resetGameSession,
  } = useMetaGame();
  const achievements = useAchievements();

  // ── Core state ──
  const [phase, setPhase] = useState<GamePhase>('start');
  const [power, setPower] = useState<PowerState>(() => {
    const saved = loadGame();
    if (saved) return saved.power as PowerState;
    return INITIAL_POWER;
  });
  const [money, setMoney] = useState<number>(() => {
    const saved = loadGame();
    if (saved) return saved.money;
    return GAME_CONFIG.INITIAL_MONEY;
  });
  const [deck, setDeck] = useState<EventCard[]>([]);
  const [cardIndex, setCardIndex] = useState<number>(() => {
    const saved = loadGame();
    if (saved) return saved.cardIndex;
    return 0;
  });
  const [turn, setTurn] = useState<number>(() => {
    const saved = loadGame();
    if (saved) return saved.turn;
    return 0;
  });
  const [highScore, setHighScore] = useState(() =>
    parseInt(localStorage.getItem(STORAGE_KEYS.HIGH_SCORE) || '0', 10)
  );
  const [gameOverInfo, setGameOverInfo] = useState<{ title: string; description: string; emoji: string; image?: string } | null>(null);
  const [lastMoneyChange, setLastMoneyChange] = useState<number | null>(null);

  // ── Tutorial state ──
  const [tutorialShown, setTutorialShown] = useState(false);
  const [tutorialFaction, setTutorialFaction] = useState<PowerType | null>(null);
  const [pendingAdvance, setPendingAdvance] = useState<{ newMoney: number; nextIndex: number } | null>(null);

  // ── Election state ──
  const [completedElections, setCompletedElections] = useState<number[]>(() => {
    const saved = loadGame();
    if (saved && saved.completedElections) return saved.completedElections;
    return [];
  });
  const [currentElectionIndex, setCurrentElectionIndex] = useState<number | null>(null);

  // ── Card tracking ──
  const [currentCardFirstSeen, setCurrentCardFirstSeen] = useState(false);
  const [usedCardIdsInGame, setUsedCardIdsInGame] = useState<Set<number>>(new Set());

  // ── Stats ──
  const [maxMoney, setMaxMoney] = useState<number>(GAME_CONFIG.INITIAL_MONEY);
  const [maxElectionPct, setMaxElectionPct] = useState<number>(0);

  // ── Meta-game AP ──
  const [lastEarnedAP, setLastEarnedAP] = useState<number>(0);

  // ── Crisis alert queue ──
  const [crisisAlertType, setCrisisAlertType] = useState<CrisisAlertType>(null);

  // ── Turn-delay chain cards ──
  const [pendingChainCards, setPendingChainCards] = useState<{ card: EventCard; insertAtTurn: number }[]>([]);

  const currentCard = deck[cardIndex] || null;

  // ── Game over check ──
  const checkGameOver = useCallback((newPower: PowerState): { title: string; description: string; emoji: string; image: string } | null => {
    const scenarios = getScenarios(lang);
    for (const key of Object.keys(newPower) as PowerType[]) {
      if (newPower[key] <= 0) {
        const scenario = scenarios.find(s => s.power === key && s.direction === 'low');
        if (scenario) return scenario;
      }
    }
    return null;
  }, [lang]);

  // ── Sub-hooks ──
  const {
    bribeCounts, bribe, canBribe, getBribeCost, resetBribeCounts,
  } = useBribe({ power, money, setPower, setMoney, setLastMoneyChange });

  const {
    totalLaundered, setTotalLaundered,
    peakLaundered,
    canLaunder, launder,
    resetShop,
  } = useLaunderShop({
    power, money, phase, turn, highScore,
    setPower, setMoney, setLastMoneyChange,
    checkGameOver, setGameOverInfo, setHighScore, setPhase,
  });

  // ── Helper: earn AP with OHAL multiplier ──
  const awardAP = useCallback((turns: number, laundered: number) => {
    const earned = calculateAP(turns, laundered, modifiers.ohalAPMultiplier);
    if (earned > 0) {
      earnAP(earned);
      setLastEarnedAP(earned);
    }
    return earned;
  }, [earnAP, modifiers.ohalAPMultiplier]);

  // ── Helper: update high score ──
  const updateHighScore = useCallback((newTurn: number) => {
    if (newTurn > highScore) {
      setHighScore(newTurn);
      localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, String(newTurn));
    }
  }, [highScore]);

  // ── Start new game ──
  const startGame = useCallback(() => {
    incrementGamesPlayed();
    trackEvent('game_start');
    clearSave();
    setPower(INITIAL_POWER);
    setMoney(GAME_CONFIG.INITIAL_MONEY);
    resetBribeCounts();
    const isDarkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE) === 'true';
    const shadowCard = lang === 'en' ? darkModeCardEn : darkModeCard;
    const shuffled = shuffleArray(getCards(lang, modifiers.rareCardBonus));
    const finalDeck = isDarkMode ? [shadowCard, ...shuffled] : shuffled;
    setDeck(finalDeck);
    setCardIndex(0);
    setCurrentCardFirstSeen(!isCardSeen(finalDeck[0].id));
    setTurn(0);
    setGameOverInfo(null);
    setLastMoneyChange(null);
    setTutorialShown(false);
    setTutorialFaction(null);
    setPendingAdvance(null);
    resetShop();
    setCompletedElections([]);
    setCurrentElectionIndex(null);
    setMaxMoney(GAME_CONFIG.INITIAL_MONEY);
    setMaxElectionPct(0);
    setUsedCardIdsInGame(new Set());
    setLastEarnedAP(0);
    setCrisisAlertType(null);
    setPendingChainCards([]);
    resetGameSession();
    setPhase('playing');
  }, [lang, resetBribeCounts, resetShop, modifiers.rareCardBonus, resetGameSession]);

  // ── Continue saved game ──
  const continueGame = useCallback(() => {
    const saved = loadGame();
    const shuffled = shuffleArray(getCards(lang, modifiers.rareCardBonus));
    setDeck(shuffled);
    const firstCard = shuffled[0];
    setCardIndex(0);
    setCurrentCardFirstSeen(firstCard ? !isCardSeen(firstCard.id) : false);
    setGameOverInfo(null);
    setLastMoneyChange(null);
    setTutorialShown(true);
    setTutorialFaction(null);
    setPendingAdvance(null);
    setCurrentElectionIndex(null);
    setLastEarnedAP(0);
    setCrisisAlertType(null);
    setPendingChainCards(saved?.pendingChainCards ?? []);
    // Restore the cash the player already spent on laundering: without it the
    // election shop reads 0 and every special power is unaffordable.
    setTotalLaundered(saved?.totalLaundered ?? 0);
    resetGameSession();
    setPhase('playing');
  }, [lang, modifiers.rareCardBonus, resetGameSession, setTotalLaundered]);

  // ── Swipe handler ──
  /*
    True only while a card is flying out. Cleared unconditionally as the first
    thing swipe() does, and swipe() is always called by the same timeout that
    set it, so the flag cannot get stuck holding the buttons shut.
  */
  const [resolvingSwipe, setResolvingSwipe] = useState(false);
  const beginSwipe = useCallback(() => setResolvingSwipe(true), []);

  const swipe = useCallback((direction: 'left' | 'right') => {
    setResolvingSwipe(false);
    if (!currentCard || phase !== 'playing') return;

    const firstSeen = !isCardSeen(currentCard.id);
    if (firstSeen) markCardSeen(currentCard.id);
    setUsedCardIdsInGame(prev => new Set([...prev, currentCard.id]));

    if (currentCard.id === 9999) {
      localStorage.setItem(STORAGE_KEYS.CHAIN_CHOICE, direction);
    }

    const rawEffects = direction === 'left' ? currentCard.leftEffects : currentCard.rightEffects;
    let moneyEffect = direction === 'left' ? (currentCard.leftMoney || 0) : (currentCard.rightMoney || 0);

    if (modifiers.ohalMoneyVolatility > 1 && moneyEffect !== 0) {
      moneyEffect = Math.round(moneyEffect * modifiers.ohalMoneyVolatility);
    }

    const modifiedEffects = rawEffects.map(e => {
      let amount = e.amount;
      const faction = e.power as PowerType;
      if (amount < 0) {
        amount -= modifiers.ohalNegativeExtra;
        const shield = modifiers.factionShields[faction] || 0;
        amount = Math.min(0, amount + shield);
      } else if (amount > 0) {
        amount = Math.max(0, amount - modifiers.ohalPositiveReduction);
        const bonus = modifiers.factionBonuses[faction] || 0;
        amount += bonus;
      }
      return { ...e, amount };
    });

    let newPower = applyCardEffects(power, modifiedEffects);
    const maxIncome = calculateMaxIncome(newPower);
    const offshoreIncome = modifiers.offshoreRate > 0
      ? Math.floor(totalLaundered * modifiers.offshoreRate)
      : 0;

    // Komisyoncu: skim % of positive card income into laundered funds
    let commission = 0;
    if (modifiers.commissionRate > 0 && moneyEffect > 0) {
      commission = Math.floor(moneyEffect * modifiers.commissionRate);
      moneyEffect -= commission;
      setTotalLaundered(prev => prev + commission);
    }

    let newMoney = money + moneyEffect + maxIncome + offshoreIncome;
    setMoney(newMoney);
    if (newMoney > maxMoney) setMaxMoney(newMoney);
    const totalMoneyChange = moneyEffect + maxIncome + offshoreIncome + commission;
    if (totalMoneyChange !== 0) setLastMoneyChange(totalMoneyChange);

    const newTurn = turn + 1;
    setTurn(newTurn);

    // Schedule turn-delay chain card if this card has a trigger.
    // Never schedule beyond LAST_SWIPE_TURN — no regular swipes happen after the final election.
    const chainMap = lang === 'en' ? CHAIN_TRIGGERS_EN : CHAIN_TRIGGERS_TR;
    const chainTrigger = chainMap[currentCard.id];
    if (chainTrigger) {
      const chainCard = direction === 'left' ? chainTrigger.left : chainTrigger.right;
      if (chainCard) {
        const delay = resolveChainDelay(chainTrigger.delay);
        const insertAtTurn = newTurn + delay;
        if (insertAtTurn <= LAST_SWIPE_TURN) {
          setPendingChainCards(prev => [...prev, { card: chainCard, insertAtTurn }]);
        }
      }
    }

    // Check faction death
    const over = checkGameOver(newPower);
    if (over) {
      if (crisisAvailableThisGame) {
        const fixedPower = { ...newPower };
        for (const key of Object.keys(fixedPower) as PowerType[]) {
          if (fixedPower[key] <= 0) fixedPower[key] = 20;
        }
        newPower = fixedPower;
        spendCrisisJoker();
        setPower(newPower);
        setCrisisAlertType('crisis');
      } else {
        setPower(newPower);
        trackEvent('game_over', { reason: over.title, turn: newTurn });
        const scenarios = getScenarios(lang);
        const deathFaction = scenarios.find(s => s.title === over.title)?.power;
        achievements.trackDeathAchievements(deathFaction, newTurn);
        setGameOverInfo(over);
        updateHighScore(newTurn);
        awardAP(newTurn, totalLaundered);
        clearSave();
        setPendingChainCards([]);
        playGameOverSound();
        void handleAdTrigger('gameOver');
        setPhase('gameover');
        return;
      }
    } else {
      setPower(newPower);
    }

    // Check bankruptcy
    if (newMoney <= 0) {
      if (emergencyFundAvailableThisGame) {
        newMoney = 25;
        setMoney(25);
        spendEmergencyFund();
        // Functional form: the crisis branch above may have set this in the same
        // synchronous handler, and the plain value would still read null here.
        setCrisisAlertType(prev => (prev === 'crisis' ? 'both' : 'emergency_fund'));
      } else {
        const bankruptScenario = { title: t('gameover.bankruptcy.title'), description: t('gameover.bankruptcy.desc'), emoji: '💸', image: 'defeat-iflas' };
        achievements.trackBankruptcyAchievement();
        achievements.trackDeathAchievements(undefined, newTurn);
        setGameOverInfo(bankruptScenario);
        updateHighScore(newTurn);
        awardAP(newTurn, totalLaundered);
        clearSave();
        setPendingChainCards([]);
        playGameOverSound();
        void handleAdTrigger('gameOver');
        setPhase('gameover');
        return;
      }
    }

    // Check achievements
    achievements.checkAfterSwipe(newTurn, newMoney, newPower, currentCard.id);

    // Inject milestone card
    if (newTurn === GAME_CONFIG.MILESTONE_TURN) {
      const milestone = getMilestoneCard(lang);
      setDeck(prev => {
        const copy = [...prev];
        copy.splice(cardIndex + 1, 0, milestone);
        return copy;
      });
    }

    let nextIndex = cardIndex + 1;
    let nextDeck = deck;
    if (nextIndex >= deck.length) {
      const allCards = getCards(lang, modifiers.rareCardBonus);
      const available = allCards.filter(c => !usedCardIdsInGame.has(c.id));
      if (available.length >= 5) {
        nextDeck = shuffleArray(available);
      } else {
        nextDeck = shuffleArray(allCards);
        setUsedCardIdsInGame(new Set());
      }
      setDeck(nextDeck);
      nextIndex = 0;
    }

    // Inject any due turn-delay chain cards
    const dueChains = pendingChainCards.filter(p => newTurn >= p.insertAtTurn);
    if (dueChains.length > 0) {
      setPendingChainCards(prev => prev.filter(p => newTurn < p.insertAtTurn));
      setDeck(prev => {
        const copy = [...prev];
        // Insert in reverse order so dueChains[0] (oldest scheduled) ends up at nextIndex.
        [...dueChains].reverse().forEach(({ card }) => copy.splice(nextIndex, 0, card));
        return copy;
      });
    }

    // currentCardFirstSeen: use the chain card's ID if one was injected at nextIndex,
    // otherwise use the regular next card. Chain cards are always unseen by definition.
    const nextCardId = dueChains.length > 0
      ? dueChains[0].card.id
      : nextDeck[nextIndex]?.id;
    setCurrentCardFirstSeen(nextCardId !== undefined ? !isCardSeen(nextCardId) : false);

    // Check election trigger
    const electionIndex = ELECTION_TRIGGER_MAP[newTurn];
    if (electionIndex !== undefined && !completedElections.includes(electionIndex)) {
      setCurrentElectionIndex(electionIndex);
      setPendingAdvance({ newMoney, nextIndex });
      saveGame({
        power: newPower, money: newMoney, turn: newTurn, cardIndex: nextIndex,
        bribeCounts, reputation: 0, completedElections, savedAt: Date.now(),
        pendingChainCards, totalLaundered, peakLaundered,
      });
      setPhase('election');
      return;
    }

    // Tutorial trigger
    if (!tutorialShown) {
      const lowFaction =
        findLowFaction(newPower, GAME_CONFIG.TUTORIAL_TRIGGER_THRESHOLD) ??
        (newTurn >= GAME_CONFIG.TUTORIAL_FALLBACK_TURN ? findLowFaction(newPower, 100) : null);
      if (lowFaction) {
        setTutorialFaction(lowFaction);
        setPendingAdvance({ newMoney, nextIndex });
        saveGame({
          power: newPower, money: newMoney, turn: newTurn, cardIndex: nextIndex,
          bribeCounts, reputation: 0, completedElections, savedAt: Date.now(),
          pendingChainCards, totalLaundered, peakLaundered,
        });
        return;
      }
    }

    saveGame({
      power: newPower, money: newMoney, turn: newTurn, cardIndex: nextIndex,
      bribeCounts, reputation: 0, completedElections, savedAt: Date.now(),
      pendingChainCards, totalLaundered, peakLaundered,
    });
    setCardIndex(nextIndex);
  }, [currentCard, phase, power, money, turn, cardIndex, deck, checkGameOver, lang, tutorialShown, completedElections, bribeCounts, usedCardIdsInGame, maxMoney, t, modifiers, totalLaundered, crisisAvailableThisGame, spendCrisisJoker, emergencyFundAvailableThisGame, spendEmergencyFund, awardAP, updateHighScore, achievements, pendingChainCards]);

  // ── Tutorial handlers ──
  const completeTutorialBribe = useCallback(() => {
    if (!tutorialFaction || !pendingAdvance) return;
    setMoney(m => m - 1);
    setPower(prev => ({
      ...prev,
      [tutorialFaction]: Math.min(100, prev[tutorialFaction] + 10),
    }));
    setLastMoneyChange(-1);
    setTutorialShown(true);
    setTutorialFaction(null);
    setCardIndex(pendingAdvance.nextIndex);
    setPendingAdvance(null);
  }, [tutorialFaction, pendingAdvance]);

  const skipTutorial = useCallback(() => {
    if (!pendingAdvance) return;
    setTutorialShown(true);
    setTutorialFaction(null);
    setCardIndex(pendingAdvance.nextIndex);
    setPendingAdvance(null);
  }, [pendingAdvance]);

  // ── Menu ──
  const goToMenu = useCallback(() => {
    if (phase === 'playing') {
      saveGame({
        power, money, turn, cardIndex, bribeCounts,
        reputation: 0, completedElections, savedAt: Date.now(),
        pendingChainCards, totalLaundered, peakLaundered,
      });
    }
    setPhase('start');
    setGameOverInfo(null);
  }, [phase, power, money, turn, cardIndex, bribeCounts, completedElections, pendingChainCards, totalLaundered, peakLaundered]);

  // ── Election loss handler ──
  const handleElectionLoss = useCallback(() => {
    awardAP(turn, totalLaundered);
    updateHighScore(turn);
    clearSave();
  }, [turn, totalLaundered, awardAP, updateHighScore]);

  // ── Election completion ──
  const handleElectionComplete = useCallback((result: ElectionResult) => {
    const electionConfig = currentElectionIndex !== null ? getElectionConfig(lang, currentElectionIndex) : null;
    if (electionConfig?.isFinalBoss) {
      updateHighScore(turn);
      awardAP(turn, totalLaundered);
      achievements.checkOhal(modifiers.ohalLevel); // unlocks ohal_1/2/3 chains
      clearSave();
      setPhase('absolute_victory');
      return;
    }
    setMoney(result.remainingBudget);
    setTotalLaundered(result.remainingLaundered);
    const newCompletedElections = currentElectionIndex !== null ? [...completedElections, currentElectionIndex] : completedElections;
    const isFinalBoss = electionConfig?.isFinalBoss ?? false;
    achievements.checkElection(newCompletedElections.length, isFinalBoss);
    if (currentElectionIndex !== null) {
      setCompletedElections(newCompletedElections);
    }
    setCurrentElectionIndex(null);
    const darkModeChainActive = localStorage.getItem(STORAGE_KEYS.CHAIN_CHOICE) !== null;
    if (darkModeChainActive) {
      const electionNum = newCompletedElections.length - 1;
      const chainPool = lang === 'en' ? darkModeChain_EN : darkModeChain_TR;
      const chainCard = chainPool[Math.min(electionNum, chainPool.length - 1)];
      if (chainCard) {
        const insertAt = pendingAdvance?.nextIndex ?? 0;
        setDeck(prev => {
          const copy = [...prev];
          copy.splice(insertAt, 0, chainCard);
          return copy;
        });
      }
    }
    if (pendingAdvance) {
      setCardIndex(pendingAdvance.nextIndex);
      setPendingAdvance(null);
    }
    if (result.playerVote > maxElectionPct) setMaxElectionPct(result.playerVote);
    // Save immediately after election win so completed election is persisted
    // before the player's first swipe (covers app crash edge case).
    saveGame({
      power, money: result.remainingBudget, turn, cardIndex: pendingAdvance?.nextIndex ?? 0,
      bribeCounts, reputation: 0, completedElections: newCompletedElections, savedAt: Date.now(),
      pendingChainCards, totalLaundered, peakLaundered,
    });
    void handleAdTrigger('electionWin');
    setPhase('playing');
  }, [lang, turn, currentElectionIndex, pendingAdvance, completedElections, setTotalLaundered, maxElectionPct, t, totalLaundered, awardAP, updateHighScore, modifiers.ohalLevel, achievements]);

  // ── Background save on app hide (phone call, notification, swipe-up) ──────
  // saveGame is called after every swipe, but this is a safety net for edge
  // cases: election screen, tutorial screen, or mid-gesture interruptions.
  // On native iOS: Capacitor App.addListener('appStateChange') is more reliable
  // than visibilitychange (WKWebView can delay or skip it during phone calls).
  // On web: falls back to visibilitychange.
  const bgSaveRef = useRef({ phase, power, money, turn, cardIndex, bribeCounts, completedElections, pendingChainCards, totalLaundered, peakLaundered });
  bgSaveRef.current = { phase, power, money, turn, cardIndex, bribeCounts, completedElections, pendingChainCards, totalLaundered, peakLaundered };

  useEffect(() => {
    const doSave = () => {
      const s = bgSaveRef.current;
      if (s.turn === 0) return; // don't save before game starts
      /*
        Only a run that is still being played may be written back.

        The guard used to be `turn === 0` alone. After a death, swipe() calls
        clearSave() and moves to 'gameover' — but turn is still 40 and one
        faction is still at 0, so a phone call or a swipe to the home screen on
        the game-over screen wrote the dead run straight back to disk. The next
        launch offered "Continue", dropped the player into an already-lost turn,
        and awarded the AP for that run a second time.
      */
      if (s.phase !== 'playing' && s.phase !== 'election') return;
      saveGame({
        power: s.power, money: s.money, turn: s.turn, cardIndex: s.cardIndex,
        bribeCounts: s.bribeCounts, reputation: 0, completedElections: s.completedElections,
        savedAt: Date.now(),
        pendingChainCards: s.pendingChainCards,
        totalLaundered: s.totalLaundered, peakLaundered: s.peakLaundered,
      });
    };

    if (Capacitor.isNativePlatform()) {
      let listenerHandle: { remove: () => void } | null = null;
      App.addListener('appStateChange', ({ isActive }) => {
        if (!isActive) doSave();
      }).then(handle => { listenerHandle = handle; });
      return () => { listenerHandle?.remove(); };
    } else {
      const handleVisibility = () => { if (document.visibilityState === 'hidden') doSave(); };
      document.addEventListener('visibilitychange', handleVisibility);
      return () => document.removeEventListener('visibilitychange', handleVisibility);
    }
  }, []);

  return {
    phase, power, money, currentCard, turn, highScore,
    gameOverInfo, lastMoneyChange, bribeCounts,
    tutorialFaction, currentCardFirstSeen,
    maxMoney, maxElectionPct, peakLaundered,
    lastEarnedAP,
    crisisAlertType, clearCrisisAlert: () => setCrisisAlertType(null),
    ohalLevel: modifiers.ohalLevel,
    startGame, continueGame, swipe,
    beginSwipe,
    bribe,
    canBribe: useCallback((f: PowerType) => !resolvingSwipe && canBribe(f), [resolvingSwipe, canBribe]),
    getBribeCost,
    completeTutorialBribe, skipTutorial, goToMenu,
    totalLaundered, canLaunder: canLaunder && !resolvingSwipe, launder,
    currentElectionIndex, completedElections, handleElectionComplete,
    handleElectionLoss,
    pendingAchievements: achievements.pendingAchievements,
    clearPendingAchievement: achievements.clearPendingAchievement,
  };
}
