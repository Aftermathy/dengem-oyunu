import { useState, useEffect, useCallback, useMemo } from 'react';
import { ElectionConfig, ElectionResult, ElectionCard, ElectionSpecialPower } from '@/types/election';
import { Language } from '@/contexts/LanguageContext';
import { playClickSound, playElectionCardSound, playAiCardSound, playSpecialPowerSound, playRerollSound, playBudgetWarningSound } from '@/hooks/useSound';
import { hapticAiThinking, hapticByRarity, hapticMedium } from '@/hooks/useHaptics';
import { drawCards, selectAiCard, REROLL_COST, MAX_REROLLS, getElectionLabels } from './election/electionUtils';
import { ElectionIntro } from './election/ElectionIntro';
import { ElectionBattle } from './election/ElectionBattle';
import { ElectionResultScreen } from './election/ElectionResult';
import { VictoryBalcony } from './election/VictoryBalcony';

interface ElectionScreenProps {
  config: ElectionConfig;
  money: number;
  launderedMoney: number;
  halkPower: number;
  lang: Language;
  onComplete: (result: ElectionResult) => void;
  onRestart: () => void;
  onMainMenu: () => void;
  earnedAP?: number;
}

export const ElectionScreen = ({ config, money, launderedMoney, halkPower: _halkPower, lang, onComplete, onRestart, onMainMenu, earnedAP = 0 }: ElectionScreenProps) => {
  const [playerVote, setPlayerVote] = useState(() => config.startingPlayerVote);
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<'intro' | 'player' | 'ai' | 'result' | 'victory'>('intro');
  const [budget, setBudget] = useState(money);
  const [laundered, setLaundered] = useState(launderedMoney);
  const [cards, setCards] = useState<ElectionCard[]>([]);
  const [aiLegendaryShake, setAiLegendaryShake] = useState(false);
  const [usedPowers, setUsedPowers] = useState<string[]>([]);
  const [aiCardPlayed, setAiCardPlayed] = useState<ElectionCard | null>(null);
  const [usedCardIds, setUsedCardIds] = useState<number[]>([]);
  const [usedAiCardIds, setUsedAiCardIds] = useState<number[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [barGlowKey, setBarGlowKey] = useState(0);
  const [showAiFlash, setShowAiFlash] = useState(false);
  const [rerollsLeft, setRerollsLeft] = useState(MAX_REROLLS);
  const [budgetWarning, setBudgetWarning] = useState<number | string | null>(null);

  const displayPlayerVote = playerVote === 50 ? 49.9 : playerVote;
  const displayOpponentVote = +(100 - displayPlayerVote).toFixed(1);
  const won = displayPlayerVote > 50;

  const labels = useMemo(() => getElectionLabels(lang), [lang]);

  const showBudgetWarningFor = useCallback((id: number | string) => {
    setBudgetWarning(id);
    playBudgetWarningSound();
    setTimeout(() => setBudgetWarning(null), 1500);
  }, []);

  // Intro timer
  useEffect(() => {
    if (phase !== 'intro') return;
    const timer = setTimeout(() => {
      setCards(drawCards(config.playerCards, 3));
      setPhase('player');
    }, 2500);
    return () => clearTimeout(timer);
  }, [phase, config.playerCards]);

  const playCard = useCallback((card: ElectionCard) => {
    if (budget < card.cost) return;
    playElectionCardSound();
    hapticMedium();
    setSelectedCardId(card.id);
    setTimeout(() => {
      setBudget(b => b - card.cost);
      setPlayerVote(v => Math.max(0, Math.min(100, v + card.voterEffect)));
      setBarGlowKey(k => k + 1);
      setUsedCardIds(prev => [...prev, card.id]);
      setSelectedCardId(null);
      setPhase('ai');
    }, 400);
  }, [budget]);

  const skipTurn = useCallback(() => {
    playClickSound();
    setPlayerVote(v => Math.max(0, Math.min(100, v + 1)));
    setBarGlowKey(k => k + 1);
    setPhase('ai');
  }, []);

  const handleReroll = useCallback(() => {
    if (rerollsLeft <= 0 || budget < REROLL_COST) {
      if (budget < REROLL_COST) showBudgetWarningFor('reroll');
      return;
    }
    playRerollSound();
    setBudget(b => b - REROLL_COST);
    setRerollsLeft(r => r - 1);
    setCards(drawCards(config.playerCards, 3, usedCardIds));
  }, [rerollsLeft, budget, config.playerCards, usedCardIds, showBudgetWarningFor]);

  const useSpecialPower = useCallback((power: ElectionSpecialPower) => {
    if (usedPowers.includes(power.id)) return;
    if (laundered < power.launderedCost) {
      showBudgetWarningFor(power.id);
      return;
    }
    playSpecialPowerSound();
    hapticMedium();
    setLaundered(l => l - power.launderedCost);
    setPlayerVote(v => Math.max(0, Math.min(100, v + power.voterEffect)));
    setBarGlowKey(k => k + 1);
    setUsedPowers(prev => [...prev, power.id]);
  }, [laundered, usedPowers, showBudgetWarningFor]);

  // AI turn
  useEffect(() => {
    if (phase !== 'ai') return;
    setShowAiFlash(true);
    const flashTimer = setTimeout(() => setShowAiFlash(false), 800);
    hapticAiThinking();
    const timer = setTimeout(() => {
      const gap = playerVote - (100 - playerVote);
      const aiCard = selectAiCard(config.oppositionCards, gap, usedAiCardIds);
      setUsedAiCardIds(prev => [...prev, aiCard.id]);
      hapticByRarity(aiCard.rarity);
      playAiCardSound();
      if (aiCard.rarity === 'legendary') {
        setAiLegendaryShake(true);
        setTimeout(() => setAiLegendaryShake(false), 1500);
      }
      setPlayerVote(v => Math.max(0, Math.min(100, v - aiCard.voterEffect)));
      setBarGlowKey(k => k + 1);
      setAiCardPlayed(aiCard);
      setTimeout(() => {
        if (round >= 4) {
          setPhase('result');
        } else {
          setRound(r => r + 1);
          setCards(drawCards(config.playerCards, 3, usedCardIds));
          setAiCardPlayed(null);
          setPhase('player');
        }
      }, 1800);
    }, 1200);
    return () => { clearTimeout(timer); clearTimeout(flashTimer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, round]);

  // Victory transition
  useEffect(() => {
    if (phase !== 'result' || !won) return;
    const timer = setTimeout(() => setPhase('victory'), 3000);
    return () => clearTimeout(timer);
  }, [phase, won]);

  const handleFinish = () => {
    onComplete({
      won: displayPlayerVote > 50,
      playerVote: displayPlayerVote,
      opponentVote: displayOpponentVote,
      remainingBudget: budget,
      remainingLaundered: laundered,
    });
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col overflow-auto ${phase === 'result' && !won ? 'election-shake' : ''}`}
      style={{ background: 'linear-gradient(180deg, #1a0000 0%, #3d0000 25%, #6b0000 50%, #8b2500 75%, #cc4400 100%)', paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      onContextMenu={e => e.preventDefault()}
    >
      {/* Fire glow overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, #ff6600 0%, transparent 60%)', animation: 'pulse 2s ease-in-out infinite' }} />

      {/* AI flash */}
      {showAiFlash && (
        <div className="absolute inset-0 z-30 ai-red-flash"
          style={{ background: 'radial-gradient(ellipse at center, rgba(220,38,38,0.3) 0%, rgba(220,38,38,0.1) 50%, transparent 80%)' }} />
      )}

      {/* Loss overlay */}
      {phase === 'result' && !won && (
        <div className="absolute inset-0 z-20 red-crack-overlay pointer-events-none"
          style={{ background: 'linear-gradient(45deg, rgba(220,38,38,0.2) 0%, transparent 30%, rgba(220,38,38,0.3) 50%, transparent 70%, rgba(220,38,38,0.2) 100%)' }} />
      )}

      {phase === 'intro' && <ElectionIntro config={config} lang={lang} />}

      {(phase === 'player' || phase === 'ai') && (
        <ElectionBattle
          config={config} lang={lang} phase={phase}
          budget={budget} laundered={laundered}
          displayPlayerVote={displayPlayerVote} displayOpponentVote={displayOpponentVote}
          round={round} cards={cards} aiCardPlayed={aiCardPlayed}
          selectedCardId={selectedCardId} barGlowKey={barGlowKey}
          rerollsLeft={rerollsLeft} budgetWarning={budgetWarning}
          usedPowers={usedPowers} aiLegendaryShake={aiLegendaryShake}
          labels={labels}
          onPlayCard={playCard} onSkipTurn={skipTurn}
          onReroll={handleReroll} onUseSpecialPower={useSpecialPower}
          onShowBudgetWarning={showBudgetWarningFor} onMainMenu={onMainMenu}
        />
      )}

      {phase === 'result' && (
        <ElectionResultScreen
          won={won} playerVote={playerVote}
          labels={labels} lang={lang}
          onRestart={onRestart} onMainMenu={onMainMenu}
        />
      )}

      {phase === 'victory' && (
        <VictoryBalcony
          displayPlayerVote={displayPlayerVote}
          displayOpponentVote={displayOpponentVote}
          labels={labels} onFinish={handleFinish}
        />
      )}
    </div>
  );
};
