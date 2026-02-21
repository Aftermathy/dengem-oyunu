import { useState, useCallback, useEffect } from 'react';
import { PowerState, PowerType, EventCard } from '@/types/game';
import { eventCards } from '@/data/cards';
import { gameOverScenarios } from '@/data/gameOverScenarios';

const INITIAL_POWER: PowerState = {
  halk: 50,
  yatirimcilar: 50,
  mafya: 50,
  tarikat: 50,
  ordu: 50,
};

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export type GamePhase = 'start' | 'playing' | 'gameover';

export function useGame() {
  const [phase, setPhase] = useState<GamePhase>('start');
  const [power, setPower] = useState<PowerState>(INITIAL_POWER);
  const [deck, setDeck] = useState<EventCard[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [turn, setTurn] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('taht_highscore') || '0', 10);
  });
  const [gameOverInfo, setGameOverInfo] = useState<{ title: string; description: string; emoji: string } | null>(null);

  const currentCard = deck[cardIndex] || null;

  const startGame = useCallback(() => {
    setPower(INITIAL_POWER);
    setDeck(shuffleArray(eventCards));
    setCardIndex(0);
    setTurn(0);
    setGameOverInfo(null);
    setPhase('playing');
  }, []);

  const checkGameOver = useCallback((newPower: PowerState): { title: string; description: string; emoji: string } | null => {
    for (const key of Object.keys(newPower) as PowerType[]) {
      const val = newPower[key];
      if (val <= 0) {
        const scenario = gameOverScenarios.find(s => s.power === key && s.direction === 'low');
        if (scenario) return scenario;
      }
      if (val >= 100) {
        const scenario = gameOverScenarios.find(s => s.power === key && s.direction === 'high');
        if (scenario) return scenario;
      }
    }
    return null;
  }, []);

  const swipe = useCallback((direction: 'left' | 'right') => {
    if (!currentCard || phase !== 'playing') return;

    const effects = direction === 'left' ? currentCard.leftEffects : currentCard.rightEffects;
    const newPower = { ...power };
    effects.forEach(e => {
      newPower[e.power] = Math.max(0, Math.min(100, newPower[e.power] + e.amount));
    });

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

    // Next card, reshuffle if needed
    let nextIndex = cardIndex + 1;
    if (nextIndex >= deck.length) {
      setDeck(shuffleArray(eventCards));
      nextIndex = 0;
    }
    setCardIndex(nextIndex);
  }, [currentCard, phase, power, turn, cardIndex, deck, highScore, checkGameOver]);

  return {
    phase,
    power,
    currentCard,
    turn,
    highScore,
    gameOverInfo,
    startGame,
    swipe,
  };
}
