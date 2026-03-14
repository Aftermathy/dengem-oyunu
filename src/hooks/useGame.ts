import { useState, useCallback } from 'react';
import { PowerState, PowerType, EventCard, GamePhase } from '@/types/game';
import { showInterstitialAd, isAdFree } from '@/hooks/useAds';
import { saveGame, loadGame, clearSave } from '@/lib/gameSave';
import { STORAGE_KEYS } from '@/constants/storage';
import { GAME_CONFIG } from '@/constants/gameConfig';
import { shuffleArray, applyCardEffects, calculateMaxIncome, findLowFaction } from '@/lib/gameLogic';
import { trackEvent } from '@/lib/analytics';
import {
  checkTurnAchievements, checkMoneyAchievements, checkPowerAchievements,
  checkElectionAchievements, checkCardAchievement, trackDeath, trackBankruptcy,
  trackSpeedDeath, checkOhalAchievements,
} from '@/lib/achievements';
import { markCardSeen, isCardSeen } from '@/lib/cardMemory';
import { eventCards, catConsultantCard, milestoneCard50, darkModeCard } from '@/data/cards';
import { eventCardsEn, catConsultantCardEn, milestoneCard50En, darkModeCardEn } from '@/data/cards-en';
import { gameOverScenarios } from '@/data/gameOverScenarios';
import { gameOverScenariosEn } from '@/data/gameOverScenarios-en';
import { Language, useLanguage } from '@/contexts/LanguageContext';
import { ELECTION_TRIGGER_MAP, getElectionConfig } from '@/data/electionData';
import { ElectionResult } from '@/types/election';
import { chainCardsA_TR, chainCardsB_TR } from '@/data/chainCards';
import { chainCardsA_EN, chainCardsB_EN } from '@/data/chainCards-en';
import { useBribe } from '@/hooks/useBribe';
import { useLaunderShop } from '@/hooks/useLaunderShop';
import { useMetaGame } from '@/contexts/MetaGameContext';
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
  const cards = [...base];
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

export type CrisisAlertType = 'crisis' | 'emergency_fund' | null;

export function useGame(lang: Language) {
  const { t } = useLanguage();
  const {
    modifiers, earnAP, crisisAvailableThisGame, useCrisisJoker,
    emergencyFundAvailableThisGame, useEmergencyFund, resetGameSession,
  } = useMetaGame();

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

  // ── Card tracking (no-repeat) ──
  const [currentCardFirstSeen, setCurrentCardFirstSeen] = useState(false);
  const [usedCardIdsInGame, setUsedCardIdsInGame] = useState<Set<number>>(new Set());

  // ── Stats ──
  const [pendingAchievements, setPendingAchievements] = useState<string[]>([]);
  const [maxMoney, setMaxMoney] = useState<number>(GAME_CONFIG.INITIAL_MONEY);
  const [maxElectionPct, setMaxElectionPct] = useState<number>(0);

  // ── Meta-game AP ──
  const [lastEarnedAP, setLastEarnedAP] = useState<number>(0);

  // ── Crisis alert queue ──
  const [crisisAlertType, setCrisisAlertType] = useState<CrisisAlertType>(null);

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
    lastShopResult, setLastShopResult,
    propaganda, canPropaganda, getPropagandaCost,
    invest, canInvest, getInvestmentCost,
    alliance, canAlliance, getAllianceCost,
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
    // Check OHAL achievements on game end
    if (modifiers.ohalLevel > 0) {
      const ohalAch = checkOhalAchievements(modifiers.ohalLevel);
      if (ohalAch.length > 0) {
        setPendingAchievements(prev => [...prev, ...ohalAch]);
      }
    }
    return earned;
  }, [earnAP, modifiers.ohalAPMultiplier, modifiers.ohalLevel]);

  // ── Start new game ──
  const startGame = useCallback(() => {
    if (!isAdFree()) showInterstitialAd(1);
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
    resetGameSession(); // reset crisis joker + emergency fund for new game
    setPhase('playing');
  }, [lang, resetBribeCounts, resetShop, modifiers.rareCardBonus, resetGameSession]);

  // ── Continue saved game ──
  const continueGame = useCallback(() => {
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
    setLastShopResult(null);
    setCurrentElectionIndex(null);
    setLastEarnedAP(0);
    setCrisisAlertType(null);
    resetGameSession();
    setPhase('playing');
  }, [lang, setLastShopResult, modifiers.rareCardBonus, resetGameSession]);

  // ── Swipe handler ──
  const swipe = useCallback((direction: 'left' | 'right') => {
    if (!currentCard || phase !== 'playing') return;

    // Track card memory
    const firstSeen = !isCardSeen(currentCard.id);
    if (firstSeen) markCardSeen(currentCard.id);
    setUsedCardIdsInGame(prev => new Set([...prev, currentCard.id]));

    // Track dark mode card choice
    if (currentCard.id === 9999) {
      localStorage.setItem(STORAGE_KEYS.CHAIN_CHOICE, direction);
    }

    const rawEffects = direction === 'left' ? currentCard.leftEffects : currentCard.rightEffects;
    let moneyEffect = direction === 'left' ? (currentCard.leftMoney || 0) : (currentCard.rightMoney || 0);

    // OHAL money volatility: amplify both gains and losses
    if (modifiers.ohalMoneyVolatility > 1 && moneyEffect !== 0) {
      moneyEffect = Math.round(moneyEffect * modifiers.ohalMoneyVolatility);
    }

    // Apply skill modifiers: shields reduce damage, media boosts gains
    // OHAL: extra negative, reduced positive
    const modifiedEffects = rawEffects.map(e => {
      let amount = e.amount;
      const faction = e.power as PowerType;
      if (amount < 0) {
        // OHAL: increase negative effects
        amount -= modifiers.ohalNegativeExtra;
        // Shield: reduce damage
        const shield = modifiers.factionShields[faction] || 0;
        amount = Math.min(0, amount + shield);
      } else if (amount > 0) {
        // OHAL: reduce positive effects
        amount = Math.max(0, amount - modifiers.ohalPositiveReduction);
        // Media: boost gains
        const bonus = modifiers.factionBonuses[faction] || 0;
        amount += bonus;
      }
      return { ...e, amount };
    });

    let newPower = applyCardEffects(power, modifiedEffects);
    const maxIncome = calculateMaxIncome(newPower);

    // Offshore interest: earn % of laundered money per turn
    const offshoreIncome = modifiers.offshoreRate > 0
      ? Math.floor(totalLaundered * modifiers.offshoreRate)
      : 0;

    let newMoney = money + moneyEffect + maxIncome + offshoreIncome;
    setMoney(newMoney);
    if (newMoney > maxMoney) setMaxMoney(newMoney);
    const totalMoneyChange = moneyEffect + maxIncome + offshoreIncome;
    if (totalMoneyChange !== 0) setLastMoneyChange(totalMoneyChange);

    const newTurn = turn + 1;
    setTurn(newTurn);

    // Check faction death
    const over = checkGameOver(newPower);
    if (over) {
      // Crisis management: one-time save from death
      if (crisisAvailableThisGame) {
        const fixedPower = { ...newPower };
        for (const key of Object.keys(fixedPower) as PowerType[]) {
          if (fixedPower[key] <= 0) fixedPower[key] = 20;
        }
        newPower = fixedPower;
        useCrisisJoker();
        setPower(newPower);
        setCrisisAlertType('crisis');
        // Fall through - continue playing
      } else {
        setPower(newPower);
        trackEvent('game_over', { reason: over.title, turn: newTurn });
        const scenarios = getScenarios(lang);
        const deathFaction = scenarios.find(s => s.title === over.title)?.power;
        if (deathFaction) trackDeath(deathFaction);
        trackSpeedDeath(newTurn);
        setGameOverInfo(over);
        if (newTurn > highScore) {
          setHighScore(newTurn);
          localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, String(newTurn));
        }
        awardAP(newTurn, totalLaundered);
        clearSave();
        setPhase('gameover');
        return;
      }
    } else {
      setPower(newPower);
    }

    // Check bankruptcy
    if (newMoney <= 0) {
      // Emergency fund: one-time save from bankruptcy
      if (emergencyFundAvailableThisGame) {
        newMoney = 25;
        setMoney(25);
        useEmergencyFund();
        setCrisisAlertType('emergency_fund');
        // Continue playing
      } else {
        const bankruptScenario = { title: t('gameover.bankruptcy.title'), description: t('gameover.bankruptcy.desc'), emoji: '💸', image: 'defeat-iflas' };
        trackBankruptcy();
        trackSpeedDeath(newTurn);
        setGameOverInfo(bankruptScenario);
        if (newTurn > highScore) {
          setHighScore(newTurn);
          localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, String(newTurn));
        }
        awardAP(newTurn, totalLaundered);
        clearSave();
        setPhase('gameover');
        return;
      }
    }

    // Check achievements
    const achQueue: string[] = [];
    achQueue.push(...checkTurnAchievements(newTurn));
    achQueue.push(...checkMoneyAchievements(newMoney));
    achQueue.push(...checkPowerAchievements(newPower));
    achQueue.push(...checkCardAchievement(currentCard.id));
    if (achQueue.length > 0) {
      setPendingAchievements(prev => [...prev, ...achQueue]);
    }

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

    const nextCard = nextDeck[nextIndex];
    if (nextCard) {
      setCurrentCardFirstSeen(!isCardSeen(nextCard.id));
    }

    // Check election trigger
    const electionIndex = ELECTION_TRIGGER_MAP[newTurn];
    if (electionIndex !== undefined && !completedElections.includes(electionIndex)) {
      setCurrentElectionIndex(electionIndex);
      setPendingAdvance({ newMoney, nextIndex });
      saveGame({
        power: newPower, money: newMoney, turn: newTurn, cardIndex: nextIndex,
        bribeCounts, reputation: 0, completedElections, savedAt: Date.now(),
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
        });
        return;
      }
    }

    saveGame({
      power: newPower, money: newMoney, turn: newTurn, cardIndex: nextIndex,
      bribeCounts, reputation: 0, completedElections, savedAt: Date.now(),
    });
    setCardIndex(nextIndex);
  }, [currentCard, phase, power, money, turn, cardIndex, deck, highScore, checkGameOver, lang, tutorialShown, completedElections, bribeCounts, usedCardIdsInGame, maxMoney, t, modifiers, totalLaundered, crisisAvailableThisGame, useCrisisJoker, emergencyFundAvailableThisGame, useEmergencyFund, awardAP]);

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
      });
    }
    setPhase('start');
    setGameOverInfo(null);
  }, [phase, power, money, turn, cardIndex, bribeCounts, completedElections]);

  // ── Election loss handler (awards AP without changing phase) ──
  const handleElectionLoss = useCallback(() => {
    awardAP(turn, totalLaundered);
    if (turn > highScore) {
      setHighScore(turn);
      localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, String(turn));
    }
    clearSave();
  }, [turn, totalLaundered, highScore, awardAP]);

  // ── Election completion ──
  const handleElectionComplete = useCallback((result: ElectionResult) => {
    if (!result.won) {
      const lostScenario = { title: t('gameover.election_lost.title'), description: t('gameover.election_lost.desc'), emoji: '🗳️', image: 'defeat-halk' };
      setGameOverInfo(lostScenario);
      if (turn > highScore) {
        setHighScore(turn);
        localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, String(turn));
      }
      awardAP(turn, totalLaundered);
      clearSave();
      setPhase('gameover');
      return;
    }
    const electionConfig = currentElectionIndex !== null ? getElectionConfig(lang, currentElectionIndex) : null;
    if (electionConfig?.isFinalBoss) {
      const victoryScenario = { title: t('gameover.victory.title'), description: t('gameover.victory.desc'), emoji: '🏆' };
      setGameOverInfo(victoryScenario);
      if (turn > highScore) {
        setHighScore(turn);
        localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, String(turn));
      }
      awardAP(turn, totalLaundered);
      clearSave();
      setPhase('gameover');
      return;
    }
    setMoney(result.remainingBudget);
    setTotalLaundered(result.remainingLaundered);
    const newCompletedElections = currentElectionIndex !== null ? [...completedElections, currentElectionIndex] : completedElections;
    const isFinalBoss = electionConfig?.isFinalBoss ?? false;
    const electionAch = checkElectionAchievements(newCompletedElections.length, isFinalBoss);
    if (electionAch.length > 0) setPendingAchievements(prev => [...prev, ...electionAch]);
    if (currentElectionIndex !== null) {
      setCompletedElections(newCompletedElections);
    }
    setCurrentElectionIndex(null);
    // Inject chain card after election
    const chainChoice = localStorage.getItem(STORAGE_KEYS.CHAIN_CHOICE) as 'left' | 'right' | null;
    if (chainChoice) {
      const electionNum = newCompletedElections.length - 1;
      const chainPool = lang === 'en'
        ? (chainChoice === 'left' ? chainCardsA_EN : chainCardsB_EN)
        : (chainChoice === 'left' ? chainCardsA_TR : chainCardsB_TR);
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
    setPhase('playing');
  }, [lang, turn, highScore, currentElectionIndex, pendingAdvance, completedElections, setTotalLaundered, maxElectionPct, t, totalLaundered, awardAP]);

  return {
    phase, power, money, currentCard, turn, highScore,
    gameOverInfo, lastMoneyChange, bribeCounts,
    tutorialFaction, currentCardFirstSeen,
    maxMoney, maxElectionPct, peakLaundered,
    lastEarnedAP,
    crisisAlertType, clearCrisisAlert: () => setCrisisAlertType(null),
    ohalLevel: modifiers.ohalLevel,
    startGame, continueGame, swipe,
    bribe, canBribe, getBribeCost,
    completeTutorialBribe, skipTutorial, goToMenu,
    totalLaundered, canLaunder, launder,
    lastShopResult,
    propaganda, canPropaganda, getPropagandaCost,
    invest, canInvest, getInvestmentCost,
    alliance, canAlliance, getAllianceCost,
    currentElectionIndex, completedElections, handleElectionComplete,
    handleElectionLoss,
    pendingAchievements, clearPendingAchievement: () => setPendingAchievements(prev => prev.slice(1)),
  };
}
