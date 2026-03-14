import { useState, useCallback } from 'react';
import { PowerState, PowerType, EventCard, BRIBE_REP_GAIN } from '@/types/game';
import { showInterstitialAd, isAdFree } from '@/hooks/useAds';
import { saveGame, loadGame, clearSave } from '@/lib/gameSave';
import { STORAGE_KEYS } from '@/constants/storage';
import { GAME_CONFIG } from '@/constants/gameConfig';
import { shuffleArray, applyCardEffects, calculateMaxIncome, getBribeCostForFaction, canBribeFaction, findLowFaction } from '@/lib/gameLogic';
import { trackEvent } from '@/lib/analytics';
import {
  checkTurnAchievements, checkMoneyAchievements, checkPowerAchievements,
  checkElectionAchievements, checkCardAchievement, trackDeath, trackBankruptcy,
  trackSpeedDeath, trackBribe as trackBribeAchievement, trackLaunder as trackLaunderAchievement,
  checkPropagandaAchievement,
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

const INITIAL_POWER: PowerState = {
  halk: GAME_CONFIG.INITIAL_POWER,
  yatirimcilar: GAME_CONFIG.INITIAL_POWER,
  mafya: GAME_CONFIG.INITIAL_POWER,
  tarikat: GAME_CONFIG.INITIAL_POWER,
  ordu: GAME_CONFIG.INITIAL_POWER,
};

export type GamePhase = 'start' | 'playing' | 'gameover' | 'election';

function getCards(lang: Language) {
  const base = lang === 'en' ? eventCardsEn : eventCards;
  const cards = [...base];
  const cat = lang === 'en' ? catConsultantCardEn : catConsultantCard;
  if (Math.random() < GAME_CONFIG.CAT_CARD_CHANCE) {
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

export interface BribeState {
  [key: string]: number;
  halk: number;
  yatirimcilar: number;
  mafya: number;
  tarikat: number;
  ordu: number;
}

export function useGame(lang: Language) {
  const { t } = useLanguage();
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
  const [bribeCounts, setBribeCounts] = useState<BribeState>(() => {
    const saved = loadGame();
    if (saved) return saved.bribeCounts as BribeState;
    return { halk: 0, yatirimcilar: 0, mafya: 0, tarikat: 0, ordu: 0 };
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
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem(STORAGE_KEYS.HIGH_SCORE) || '0', 10);
  });
  const [gameOverInfo, setGameOverInfo] = useState<{ title: string; description: string; emoji: string; image?: string } | null>(null);
  const [lastMoneyChange, setLastMoneyChange] = useState<number | null>(null);
  const [tutorialShown, setTutorialShown] = useState(false);
  const [tutorialFaction, setTutorialFaction] = useState<PowerType | null>(null);
  const [pendingAdvance, setPendingAdvance] = useState<{ newMoney: number; nextIndex: number } | null>(null);
  const [totalLaundered, setTotalLaundered] = useState(0);
  const [propagandaCount, setPropagandaCount] = useState(0);
  const [investmentCount, setInvestmentCount] = useState(0);
  const [allianceCount, setAllianceCount] = useState(0);
  const [lastShopResult, setLastShopResult] = useState<string | null>(null);
  const [completedElections, setCompletedElections] = useState<number[]>(() => {
    const saved = loadGame();
    if (saved && saved.completedElections) return saved.completedElections;
    return [];
  });
  const [currentElectionIndex, setCurrentElectionIndex] = useState<number | null>(null);
  const [currentCardFirstSeen, setCurrentCardFirstSeen] = useState(() => false);
  const [pendingAchievements, setPendingAchievements] = useState<string[]>([]);

  const currentCard = deck[cardIndex] || null;

  const startGame = useCallback(() => {
    // Show interstitial ad before starting (unless ad-free)
    if (!isAdFree()) {
      showInterstitialAd(1); // Show every game (change number to skip some)
    }

    trackEvent('game_start');
    clearSave();
    setPower(INITIAL_POWER);
    setMoney(GAME_CONFIG.INITIAL_MONEY);
    setBribeCounts({ halk: 0, yatirimcilar: 0, mafya: 0, tarikat: 0, ordu: 0 });
    const isDarkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE) === 'true';
    const shadowCard = lang === 'en' ? darkModeCardEn : darkModeCard;
    const shuffled = shuffleArray(getCards(lang));
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
    setTotalLaundered(0);
    setPropagandaCount(0);
    setInvestmentCount(0);
    setAllianceCount(0);
    setLastShopResult(null);
    setCompletedElections([]);
    setCurrentElectionIndex(null);
    setPhase('playing');
  }, [lang]);

  const continueGame = useCallback(() => {
    // State (power, money, turn, bribeCounts, cardIndex) already loaded from save via useState initializers.
    // We just need to rebuild the deck and go to playing phase — do NOT clear save.
    const shuffled = shuffleArray(getCards(lang));
    setDeck(shuffled);
    const firstCard = shuffled[0];
    setCardIndex(0);
    setCurrentCardFirstSeen(firstCard ? !isCardSeen(firstCard.id) : false);
    setGameOverInfo(null);
    setLastMoneyChange(null);
    setTutorialShown(true); // skip tutorial on continue
    setTutorialFaction(null);
    setPendingAdvance(null);
    setLastShopResult(null);
    // completedElections preserved from state (loaded from save)
    setCurrentElectionIndex(null);
    setPhase('playing');
  }, [lang]);

  const checkGameOver = useCallback((newPower: PowerState): { title: string; description: string; emoji: string; image: string } | null => {
    const scenarios = getScenarios(lang);
    for (const key of Object.keys(newPower) as PowerType[]) {
      const val = newPower[key];
      if (val <= 0) {
        const scenario = scenarios.find(s => s.power === key && s.direction === 'low');
        if (scenario) return scenario;
      }
    }
    return null;
  }, [lang]);

  const getBribeCost = useCallback((faction: PowerType): number => {
    return getBribeCostForFaction(bribeCounts, faction);
  }, [bribeCounts]);

  const canBribe = useCallback((faction: PowerType): boolean => {
    return canBribeFaction(money, power, bribeCounts, faction);
  }, [money, power, bribeCounts]);

  const bribe = useCallback((faction: PowerType) => {
    const room = 100 - power[faction];
    if (room <= 0) return;
    const gain = Math.min(room, BRIBE_REP_GAIN);
    const ratio = gain / BRIBE_REP_GAIN;
    const cost = Math.max(1, Math.round(getBribeCostForFaction(bribeCounts, faction) * ratio));
    if (money < cost) return;

    setMoney(m => m - cost);
    setPower(prev => ({
      ...prev,
      [faction]: prev[faction] + gain,
    }));
    setBribeCounts(prev => ({
      ...prev,
      [faction]: prev[faction] + 1,
    }));
    setLastMoneyChange(-cost);
  }, [money, power, bribeCounts]);

  const swipe = useCallback((direction: 'left' | 'right') => {
    if (!currentCard || phase !== 'playing') return;

    // Track card memory
    const firstSeen = !isCardSeen(currentCard.id);
    if (firstSeen) markCardSeen(currentCard.id);

    // Track dark mode card choice (drives post-election story chain)
    if (currentCard.id === 9999) {
      localStorage.setItem(STORAGE_KEYS.CHAIN_CHOICE, direction);
    }

    const effects = direction === 'left' ? currentCard.leftEffects : currentCard.rightEffects;
    const moneyEffect = direction === 'left' ? (currentCard.leftMoney || 0) : (currentCard.rightMoney || 0);

    const newPower = applyCardEffects(power, effects);

    // Income from maxed factions, capped at MAX_FACTION_INCOME
    const maxIncome = calculateMaxIncome(newPower);

    const newMoney = money + moneyEffect + maxIncome;
    setMoney(newMoney);
    const totalMoneyChange = moneyEffect + maxIncome;
    if (totalMoneyChange !== 0) setLastMoneyChange(totalMoneyChange);

    setPower(newPower);
    const newTurn = turn + 1;
    setTurn(newTurn);

    const over = checkGameOver(newPower);
    if (over) {
      trackEvent('game_over', { reason: over.title, turn: newTurn });
      setGameOverInfo(over);
      if (newTurn > highScore) {
        setHighScore(newTurn);
        localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, String(newTurn));
      }
      clearSave();
      setPhase('gameover');
      return;
    }

    // Check money game over
    if (newMoney <= 0) {
      const bankruptScenario = { title: t('gameover.bankruptcy.title'), description: t('gameover.bankruptcy.desc'), emoji: '💸', image: 'defeat-iflas' };
      setGameOverInfo(bankruptScenario);
      if (newTurn > highScore) {
        setHighScore(newTurn);
        localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, String(newTurn));
      }
      clearSave();
      setPhase('gameover');
      return;
    }

    // Inject milestone card at MILESTONE_TURN
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
      nextDeck = shuffleArray(getCards(lang));
      setDeck(nextDeck);
      nextIndex = 0;
    }

    // Update first-seen state for next card
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
        power: newPower,
        money: newMoney,
        turn: newTurn,
        cardIndex: nextIndex,
        bribeCounts,
        reputation: 0,
        completedElections,
        savedAt: Date.now(),
      });
      setPhase('election');
      return;
    }

    // Check tutorial trigger — show when any faction drops to threshold, or as fallback by TUTORIAL_FALLBACK_TURN
    if (!tutorialShown) {
      const lowFaction =
        findLowFaction(newPower, GAME_CONFIG.TUTORIAL_TRIGGER_THRESHOLD) ??
        (newTurn >= GAME_CONFIG.TUTORIAL_FALLBACK_TURN ? findLowFaction(newPower, 100) : null);
      if (lowFaction) {
        setTutorialFaction(lowFaction);
        setPendingAdvance({ newMoney, nextIndex });
        saveGame({
          power: newPower,
          money: newMoney,
          turn: newTurn,
          cardIndex: nextIndex,
          bribeCounts,
          reputation: 0,
          completedElections,
          savedAt: Date.now(),
        });
        return;
      }
    }

    saveGame({
      power: newPower,
      money: newMoney,
      turn: newTurn,
      cardIndex: nextIndex,
      bribeCounts,
      reputation: 0,
      completedElections,
      savedAt: Date.now(),
    });
    setCardIndex(nextIndex);
  }, [currentCard, phase, power, money, turn, cardIndex, deck, highScore, checkGameOver, lang, tutorialShown, completedElections, bribeCounts]);

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

  const goToMenu = useCallback(() => {
    if (phase === 'playing') {
      saveGame({
        power,
        money,
        turn,
        cardIndex,
        bribeCounts,
        reputation: 0,
        completedElections,
        savedAt: Date.now(),
      });
    }
    setPhase('start');
    setGameOverInfo(null);
  }, [phase, power, money, turn, cardIndex, bribeCounts]);

  const handleElectionComplete = useCallback((result: ElectionResult) => {
    if (!result.won) {
      const lostScenario = { title: t('gameover.election_lost.title'), description: t('gameover.election_lost.desc'), emoji: '🗳️', image: 'defeat-halk' };
      setGameOverInfo(lostScenario);
      if (turn > highScore) {
        setHighScore(turn);
        localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, String(turn));
      }
      clearSave();
      setPhase('gameover');
      return;
    }
    // Check if this was the final boss election
    const electionConfig = currentElectionIndex !== null ? getElectionConfig(lang, currentElectionIndex) : null;
    if (electionConfig?.isFinalBoss) {
      const victoryScenario = { title: t('gameover.victory.title'), description: t('gameover.victory.desc'), emoji: '🏆' };
      setGameOverInfo(victoryScenario);
      if (turn > highScore) {
        setHighScore(turn);
        localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, String(turn));
      }
      clearSave();
      setPhase('gameover');
      return;
    }
    setMoney(result.remainingBudget);
    setTotalLaundered(result.remainingLaundered);
    const newCompletedElections = currentElectionIndex !== null ? [...completedElections, currentElectionIndex] : completedElections;
    if (currentElectionIndex !== null) {
      setCompletedElections(newCompletedElections);
    }
    setCurrentElectionIndex(null);
    // Inject chain card after election
    const chainChoice = localStorage.getItem(STORAGE_KEYS.CHAIN_CHOICE) as 'left' | 'right' | null;
    if (chainChoice) {
      const electionNum = newCompletedElections.length - 1; // 0-based index of just-completed election
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
    setPhase('playing');
  }, [lang, turn, highScore, currentElectionIndex, pendingAdvance, completedElections]);

  const canLaunder = money >= GAME_CONFIG.LAUNDER_COST && phase === 'playing';

  const launder = useCallback((faction: PowerType) => {
    if (money < GAME_CONFIG.LAUNDER_COST) return;
    setMoney(m => m - GAME_CONFIG.LAUNDER_COST);
    setTotalLaundered(prev => prev + GAME_CONFIG.LAUNDER_AMOUNT);
    setLastMoneyChange(-GAME_CONFIG.LAUNDER_COST);

    const otherFactions: PowerType[] = ['yatirimcilar', 'mafya', 'tarikat', 'ordu'].filter(f => f !== faction) as PowerType[];

    const newPower = { ...power };
    newPower.halk = Math.max(0, newPower.halk + GAME_CONFIG.LAUNDER_HALK_PENALTY);
    newPower[faction] = Math.min(100, newPower[faction] + GAME_CONFIG.LAUNDER_SELECTED_BONUS);
    otherFactions.forEach(f => {
      newPower[f] = Math.max(0, newPower[f] + GAME_CONFIG.LAUNDER_OTHER_PENALTY);
    });
    
    setPower(newPower);

    // Check game over after launder
    const over = checkGameOver(newPower);
    if (over) {
      setGameOverInfo(over);
      const currentTurn = turn;
      if (currentTurn > highScore) {
        setHighScore(currentTurn);
        localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, String(currentTurn));
      }
      clearSave();
      setPhase('gameover');
    }
  }, [money, power, checkGameOver, turn, highScore]);

  // === Laundered money shop ===
  const getPropagandaCost = () => GAME_CONFIG.PROPAGANDA_COSTS[Math.min(propagandaCount, GAME_CONFIG.PROPAGANDA_COSTS.length - 1)];
  const getInvestmentCost = () => GAME_CONFIG.INVESTMENT_COST;
  const getAllianceCost = () => GAME_CONFIG.ALLIANCE_COSTS[Math.min(allianceCount, GAME_CONFIG.ALLIANCE_COSTS.length - 1)];

  const canPropaganda = totalLaundered >= getPropagandaCost() && phase === 'playing';
  const canInvest = totalLaundered >= getInvestmentCost() && phase === 'playing';
  const canAlliance = totalLaundered >= getAllianceCost() && phase === 'playing';

  const propaganda = useCallback(() => {
    const cost = getPropagandaCost();
    if (totalLaundered < cost) return;
    setTotalLaundered(prev => prev - cost);
    setPropagandaCount(prev => prev + 1);
    const newPower = { ...power };
    newPower.halk = Math.min(100, newPower.halk + GAME_CONFIG.PROPAGANDA_GAIN);
    setPower(newPower);
    setLastShopResult(null);
  }, [totalLaundered, power, propagandaCount]);

  const invest = useCallback(() => {
    const cost = getInvestmentCost();
    if (totalLaundered < cost) return;
    setTotalLaundered(prev => prev - cost);
    setInvestmentCount(prev => prev + 1);
    const win = Math.random() < 0.5;
    if (win) {
      setMoney(m => m + cost * 2);
      setLastMoneyChange(cost * 2);
      setLastShopResult('win');
    } else {
      setLastShopResult('lose');
    }
  }, [totalLaundered, investmentCount]);

  const alliance = useCallback((f1: PowerType, f2: PowerType) => {
    const cost = getAllianceCost();
    if (totalLaundered < cost) return;
    setTotalLaundered(prev => prev - cost);
    setAllianceCount(prev => prev + 1);
    const newPower = { ...power };
    newPower[f1] = Math.min(100, newPower[f1] + GAME_CONFIG.ALLIANCE_GAIN);
    newPower[f2] = Math.min(100, newPower[f2] + GAME_CONFIG.ALLIANCE_GAIN);
    setPower(newPower);
    setLastShopResult(null);
  }, [totalLaundered, power, allianceCount]);

  return {
    phase,
    power,
    money,
    currentCard,
    turn,
    highScore,
    gameOverInfo,
    lastMoneyChange,
    bribeCounts,
    tutorialFaction,
    totalLaundered,
    canLaunder,
    lastShopResult,
    currentCardFirstSeen,
    startGame,
    continueGame,
    swipe,
    bribe,
    canBribe,
    getBribeCost,
    completeTutorialBribe,
    skipTutorial,
    goToMenu,
    launder,
    propaganda, canPropaganda, getPropagandaCost,
    invest, canInvest, getInvestmentCost,
    alliance, canAlliance, getAllianceCost,
    currentElectionIndex, completedElections, handleElectionComplete,
  };
}
