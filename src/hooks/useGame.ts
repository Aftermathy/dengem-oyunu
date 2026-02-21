import { useState, useCallback } from 'react';
import { PowerState, PowerType, EventCard, BRIBE_COSTS, BRIBE_REP_GAIN } from '@/types/game';
import { showInterstitialAd, isAdFree } from '@/hooks/useAds';
import { eventCards } from '@/data/cards';
import { eventCardsEn } from '@/data/cards-en';
import { gameOverScenarios } from '@/data/gameOverScenarios';
import { gameOverScenariosEn } from '@/data/gameOverScenarios-en';
import { Language } from '@/contexts/LanguageContext';

const INITIAL_POWER: PowerState = {
  halk: 50,
  yatirimcilar: 50,
  mafya: 50,
  tarikat: 50,
  ordu: 50,
};

const INITIAL_MONEY = 128;

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export type GamePhase = 'start' | 'playing' | 'gameover';

function getCards(lang: Language) {
  return lang === 'en' ? eventCardsEn : eventCards;
}

function getScenarios(lang: Language) {
  return lang === 'en' ? gameOverScenariosEn : gameOverScenarios;
}

export interface BribeState {
  halk: number;
  yatirimcilar: number;
  mafya: number;
  tarikat: number;
  ordu: number;
}

export function useGame(lang: Language) {
  const [phase, setPhase] = useState<GamePhase>('start');
  const [power, setPower] = useState<PowerState>(INITIAL_POWER);
  const [money, setMoney] = useState(INITIAL_MONEY);
  const [bribeCounts, setBribeCounts] = useState<BribeState>({ halk: 0, yatirimcilar: 0, mafya: 0, tarikat: 0, ordu: 0 });
  const [deck, setDeck] = useState<EventCard[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [turn, setTurn] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('taht_highscore') || '0', 10);
  });
  const [gameOverInfo, setGameOverInfo] = useState<{ title: string; description: string; emoji: string; image?: string } | null>(null);
  const [lastMoneyChange, setLastMoneyChange] = useState<number | null>(null);
  const [tutorialShown, setTutorialShown] = useState(false);
  const [tutorialFaction, setTutorialFaction] = useState<PowerType | null>(null);
  const [pendingAdvance, setPendingAdvance] = useState<{ newMoney: number; nextIndex: number } | null>(null);
  const [totalLaundered, setTotalLaundered] = useState(0);

  const currentCard = deck[cardIndex] || null;

  const startGame = useCallback(() => {
    // Show interstitial ad before starting (unless ad-free)
    if (!isAdFree()) {
      showInterstitialAd(1); // Show every game (change number to skip some)
    }

    setPower(INITIAL_POWER);
    setMoney(INITIAL_MONEY);
    setBribeCounts({ halk: 0, yatirimcilar: 0, mafya: 0, tarikat: 0, ordu: 0 });
    setDeck(shuffleArray(getCards(lang)));
    setCardIndex(0);
    setTurn(0);
    setGameOverInfo(null);
    setLastMoneyChange(null);
    setTutorialShown(false);
    setTutorialFaction(null);
    setPendingAdvance(null);
    setTotalLaundered(0);
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
    const count = bribeCounts[faction];
    const idx = Math.min(count, BRIBE_COSTS.length - 1);
    return BRIBE_COSTS[idx];
  }, [bribeCounts]);

  const canBribe = useCallback((faction: PowerType): boolean => {
    return money >= getBribeCost(faction) && power[faction] < 90;
  }, [money, power, getBribeCost]);

  const bribe = useCallback((faction: PowerType) => {
    const cost = getBribeCost(faction);
    if (money < cost || power[faction] >= 90) return;

    setMoney(m => m - cost);
    setPower(prev => ({
      ...prev,
      [faction]: Math.min(100, prev[faction] + BRIBE_REP_GAIN),
    }));
    setBribeCounts(prev => ({
      ...prev,
      [faction]: prev[faction] + 1,
    }));
    setLastMoneyChange(-cost);
  }, [money, power, getBribeCost]);

  const swipe = useCallback((direction: 'left' | 'right') => {
    if (!currentCard || phase !== 'playing') return;

    const effects = direction === 'left' ? currentCard.leftEffects : currentCard.rightEffects;
    const moneyEffect = direction === 'left' ? (currentCard.leftMoney || 0) : (currentCard.rightMoney || 0);
    
    const newPower = { ...power };
    effects.forEach(e => {
      newPower[e.power] = Math.max(0, Math.min(100, newPower[e.power] + e.amount));
    });

    // Calculate income from maxed factions (100)
    let maxIncome = 0;
    for (const key of Object.keys(newPower) as PowerType[]) {
      if (newPower[key] >= 100) maxIncome += 2;
    }

    const newMoney = money + moneyEffect + maxIncome;
    setMoney(newMoney);
    const totalMoneyChange = moneyEffect + maxIncome;
    if (totalMoneyChange !== 0) setLastMoneyChange(totalMoneyChange);

    setPower(newPower);
    const newTurn = turn + 1;
    setTurn(newTurn);

    const over = checkGameOver(newPower);
    if (over) {
      setGameOverInfo(over);
      if (newTurn > highScore) {
        setHighScore(newTurn);
        localStorage.setItem('taht_highscore', String(newTurn));
      }
      setPhase('gameover');
      return;
    }

    // Check money game over
    if (newMoney <= 0) {
      const bankruptScenario = lang === 'en' 
        ? { title: 'Bankruptcy!', description: 'The coffers are empty. No money, no power. Even the janitor quit. Creditors stormed the palace, IMF took control. Your legacy? A cautionary tale of fiscal madness. The new technocrat government is auctioning off your golden toilet seats on eBay.', emoji: '💸', image: 'defeat-iflas' }
        : { title: 'İflas!', description: 'Kasa bomboş. Para yok, güç yok. Temizlikçi bile istifa etti. Alacaklılar saraya dayandı, IMF yönetimi devraldı. Miras olarak bıraktığın tek şey mali çılgınlığın hikayesi. Yeni teknokrat hükümet altın klozet kapaklarını internetten satışa çıkardı.', emoji: '💸', image: 'defeat-iflas' };
      setGameOverInfo(bankruptScenario);
      if (newTurn > highScore) {
        setHighScore(newTurn);
        localStorage.setItem('taht_highscore', String(newTurn));
      }
      setPhase('gameover');
      return;
    }

    let nextIndex = cardIndex + 1;
    if (nextIndex >= deck.length) {
      setDeck(shuffleArray(getCards(lang)));
      nextIndex = 0;
    }

    // Check tutorial trigger
    if (!tutorialShown) {
      for (const key of Object.keys(newPower) as PowerType[]) {
        if (newPower[key] <= 20) {
          setTutorialFaction(key);
          setPendingAdvance({ newMoney, nextIndex });
          return;
        }
      }
    }

    setCardIndex(nextIndex);
  }, [currentCard, phase, power, money, turn, cardIndex, deck, highScore, checkGameOver, lang, tutorialShown]);

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
    setPhase('start');
    setGameOverInfo(null);
  }, []);

  const LAUNDER_COST = 5;
  const LAUNDER_AMOUNT = 10;

  const canLaunder = money >= LAUNDER_COST && phase === 'playing';

  const launder = useCallback((faction: PowerType) => {
    if (money < LAUNDER_COST) return;
    setMoney(m => m - LAUNDER_COST);
    setTotalLaundered(prev => prev + LAUNDER_AMOUNT);
    setLastMoneyChange(-LAUNDER_COST);
    
    const otherFactions: PowerType[] = ['yatirimcilar', 'mafya', 'tarikat', 'ordu'].filter(f => f !== faction) as PowerType[];
    
    setPower(prev => {
      const next = { ...prev };
      // Halk -10
      next.halk = Math.max(0, next.halk - 10);
      // Selected faction +5
      next[faction] = Math.min(100, next[faction] + 5);
      // Other 3 factions -5
      otherFactions.forEach(f => {
        next[f] = Math.max(0, next[f] - 5);
      });
      return next;
    });
  }, [money]);

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
    startGame,
    swipe,
    bribe,
    canBribe,
    getBribeCost,
    completeTutorialBribe,
    skipTutorial,
    goToMenu,
    launder,
  };
}
