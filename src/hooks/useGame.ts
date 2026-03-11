import { useState, useCallback } from 'react';
import { PowerState, PowerType, EventCard, BRIBE_COSTS, BRIBE_REP_GAIN } from '@/types/game';
import { showInterstitialAd, isAdFree } from '@/hooks/useAds';
import { eventCards, catConsultantCard, milestoneCard50 } from '@/data/cards';
import { eventCardsEn, catConsultantCardEn, milestoneCard50En } from '@/data/cards-en';
import { gameOverScenarios } from '@/data/gameOverScenarios';
import { gameOverScenariosEn } from '@/data/gameOverScenarios-en';
import { Language } from '@/contexts/LanguageContext';
import { ELECTION_TRIGGER_MAP, getElectionConfig } from '@/data/electionData';
import { ElectionResult } from '@/types/election';

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

export type GamePhase = 'start' | 'playing' | 'gameover' | 'election';

function getCards(lang: Language) {
  const base = lang === 'en' ? eventCardsEn : eventCards;
  // 5% chance to inject cat consultant card
  const cat = lang === 'en' ? catConsultantCardEn : catConsultantCard;
  if (Math.random() < 0.05) {
    const copy = [...base];
    const pos = Math.floor(Math.random() * Math.min(20, copy.length));
    copy.splice(pos, 0, cat);
    return copy;
  }
  return base;
}

function getMilestoneCard(lang: Language) {
  return lang === 'en' ? milestoneCard50En : milestoneCard50;
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
  const [propagandaCount, setPropagandaCount] = useState(0);
  const [investmentCount, setInvestmentCount] = useState(0);
  const [allianceCount, setAllianceCount] = useState(0);
  const [lastShopResult, setLastShopResult] = useState<string | null>(null);
  const [completedElections, setCompletedElections] = useState<number[]>([]);
  const [currentElectionIndex, setCurrentElectionIndex] = useState<number | null>(null);

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
    setPropagandaCount(0);
    setInvestmentCount(0);
    setAllianceCount(0);
    setLastShopResult(null);
    setCompletedElections([]);
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
    const count = bribeCounts[faction];
    const idx = Math.min(count, BRIBE_COSTS.length - 1);
    return BRIBE_COSTS[idx];
  }, [bribeCounts]);

  const canBribe = useCallback((faction: PowerType): boolean => {
    const room = 100 - power[faction];
    if (room <= 0) return false;
    const ratio = Math.min(room, BRIBE_REP_GAIN) / BRIBE_REP_GAIN;
    const cost = Math.max(1, Math.round(getBribeCost(faction) * ratio));
    return money >= cost;
  }, [money, power, getBribeCost]);

  const bribe = useCallback((faction: PowerType) => {
    const room = 100 - power[faction];
    if (room <= 0) return;
    const gain = Math.min(room, BRIBE_REP_GAIN);
    const ratio = gain / BRIBE_REP_GAIN;
    const cost = Math.max(1, Math.round(getBribeCost(faction) * ratio));
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

    // Inject milestone card at turn 50
    if (newTurn === 50) {
      const milestone = getMilestoneCard(lang);
      setDeck(prev => {
        const copy = [...prev];
        copy.splice(cardIndex + 1, 0, milestone);
        return copy;
      });
    }

    let nextIndex = cardIndex + 1;
    if (nextIndex >= deck.length) {
      setDeck(shuffleArray(getCards(lang)));
      nextIndex = 0;
    }

    // Check election trigger
    const electionIndex = ELECTION_TRIGGER_MAP[newTurn];
    if (electionIndex !== undefined && !completedElections.includes(electionIndex)) {
      setCurrentElectionIndex(electionIndex);
      setPendingAdvance({ newMoney, nextIndex });
      setPhase('election');
      return;
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
  }, [currentCard, phase, power, money, turn, cardIndex, deck, highScore, checkGameOver, lang, tutorialShown, completedElections]);

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

  const handleElectionComplete = useCallback((result: ElectionResult) => {
    if (!result.won) {
      const lostScenario = lang === 'en'
        ? { title: 'Election Lost!', description: 'The ballot box has spoken. Your reign of corruption ends here. The people chose hope over fear. Pack your bags — the new government is already changing the locks.', emoji: '🗳️', image: 'defeat-halk' }
        : { title: 'Seçim Kaybedildi!', description: 'Sandık konuştu. Yolsuzluk saltanatın burada sona erdi. Halk korku yerine umudu seçti. Bavullarını topla — yeni hükümet kilitleri değiştirmeye başladı bile.', emoji: '🗳️', image: 'defeat-halk' };
      setGameOverInfo(lostScenario);
      if (turn > highScore) {
        setHighScore(turn);
        localStorage.setItem('taht_highscore', String(turn));
      }
      setPhase('gameover');
      return;
    }
    // Check if this was the final boss election
    const electionConfig = currentElectionIndex !== null ? getElectionConfig(lang, currentElectionIndex) : null;
    if (electionConfig?.isFinalBoss) {
      const victoryScenario = lang === 'en'
        ? { title: '👑 No One\'s Better Than You! 👑', description: 'You survived every election, crushed every opponent, and held on to power through it all. 20+ years of corruption, manipulation, and iron-fisted rule. You\'re the ultimate political survivor. The throne is yours... forever. Or is it? History will judge, but for now — you win.', emoji: '🏆' }
        : { title: '👑 Senden İyisi Yok! 👑', description: 'Her seçimi atlattın, her rakibi ezdin, 20 yılı aşkın iktidarı bırakmadın. Yolsuzluk, manipülasyon ve demir yumrukla tahtını korudun. En büyük politik hayatta kalma uzmanı sensin. Taht senindir... sonsuza dek. Yoksa öyle mi? Tarih yargılayacak, ama şimdilik — kazanan sensin.', emoji: '🏆' };
      setGameOverInfo(victoryScenario);
      if (turn > highScore) {
        setHighScore(turn);
        localStorage.setItem('taht_highscore', String(turn));
      }
      setPhase('gameover');
      return;
    }
    setMoney(result.remainingBudget);
    setTotalLaundered(result.remainingLaundered);
    if (currentElectionIndex !== null) {
      setCompletedElections(prev => [...prev, currentElectionIndex]);
    }
    setCurrentElectionIndex(null);
    if (pendingAdvance) {
      setCardIndex(pendingAdvance.nextIndex);
      setPendingAdvance(null);
    }
    setPhase('playing');
  }, [lang, turn, highScore, currentElectionIndex, pendingAdvance]);

  const LAUNDER_COST = 50;
  const LAUNDER_AMOUNT = 25;

  const canLaunder = money >= LAUNDER_COST && phase === 'playing';

  const launder = useCallback((faction: PowerType) => {
    if (money < LAUNDER_COST) return;
    setMoney(m => m - LAUNDER_COST);
    setTotalLaundered(prev => prev + LAUNDER_AMOUNT);
    setLastMoneyChange(-LAUNDER_COST);
    
    const otherFactions: PowerType[] = ['yatirimcilar', 'mafya', 'tarikat', 'ordu'].filter(f => f !== faction) as PowerType[];
    
    const newPower = { ...power };
    // Halk -10
    newPower.halk = Math.max(0, newPower.halk - 10);
    // Selected faction +5
    newPower[faction] = Math.min(100, newPower[faction] + 5);
    // Other 3 factions -5
    otherFactions.forEach(f => {
      newPower[f] = Math.max(0, newPower[f] - 5);
    });
    
    setPower(newPower);

    // Check game over after launder
    const over = checkGameOver(newPower);
    if (over) {
      setGameOverInfo(over);
      const currentTurn = turn;
      if (currentTurn > highScore) {
        setHighScore(currentTurn);
        localStorage.setItem('taht_highscore', String(currentTurn));
      }
      setPhase('gameover');
    }
  }, [money, power, checkGameOver, turn, highScore]);

  // === Laundered money shop ===
  const PROPAGANDA_COSTS = [10, 20, 30, 50];
  const INVESTMENT_COST = 15;
  const ALLIANCE_COSTS = [20, 30, 45, 50];

  const getPropagandaCost = () => PROPAGANDA_COSTS[Math.min(propagandaCount, PROPAGANDA_COSTS.length - 1)];
  const getInvestmentCost = () => INVESTMENT_COST;
  const getAllianceCost = () => ALLIANCE_COSTS[Math.min(allianceCount, ALLIANCE_COSTS.length - 1)];

  const canPropaganda = totalLaundered >= getPropagandaCost() && phase === 'playing';
  const canInvest = totalLaundered >= getInvestmentCost() && phase === 'playing';
  const canAlliance = totalLaundered >= getAllianceCost() && phase === 'playing';

  const propaganda = useCallback(() => {
    const cost = getPropagandaCost();
    if (totalLaundered < cost) return;
    setTotalLaundered(prev => prev - cost);
    setPropagandaCount(prev => prev + 1);
    const newPower = { ...power };
    newPower.halk = Math.min(100, newPower.halk + 10);
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
    newPower[f1] = Math.min(100, newPower[f1] + 8);
    newPower[f2] = Math.min(100, newPower[f2] + 8);
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
    startGame,
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
