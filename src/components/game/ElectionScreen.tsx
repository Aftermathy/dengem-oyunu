import { useState, useEffect, useCallback, useMemo } from 'react';
import { ElectionConfig, ElectionResult, ElectionCard, ElectionSpecialPower } from '@/types/election';
import { Language } from '@/contexts/LanguageContext';

interface ElectionScreenProps {
  config: ElectionConfig;
  money: number;
  launderedMoney: number;
  halkPower: number;
  lang: Language;
  onComplete: (result: ElectionResult) => void;
}

function shuffleAndDraw(cards: ElectionCard[], count: number, exclude: number[] = []): ElectionCard[] {
  const pool = cards.filter(c => !exclude.includes(c.id));
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export const ElectionScreen = ({ config, money, launderedMoney, halkPower, lang, onComplete }: ElectionScreenProps) => {
  const [playerVote, setPlayerVote] = useState(() => Math.min(60, 35 + Math.floor(halkPower * 0.25)));
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<'intro' | 'player' | 'ai' | 'result'>('intro');
  const [budget, setBudget] = useState(money);
  const [laundered, setLaundered] = useState(launderedMoney);
  const [cards, setCards] = useState<ElectionCard[]>([]);
  const [usedPowers, setUsedPowers] = useState<string[]>([]);
  const [aiCardPlayed, setAiCardPlayed] = useState<ElectionCard | null>(null);
  const [usedCardIds, setUsedCardIds] = useState<number[]>([]);

  const opponentVote = 100 - playerVote;

  const labels = useMemo(() => lang === 'en' ? {
    opposition: 'Opposition', you: 'You', pickMove: 'Pick your move:',
    oppMoving: 'Opposition is making a move...', budget: 'Budget', laundered: 'Laundered',
    specialPowers: '🔮 Special Powers (Laundered)', round: 'Round',
    electionWon: 'ELECTION WON!', electionLost: 'ELECTION LOST!',
    continue: 'Continue', skip: 'Skip Turn (+1%)', vote: 'vote',
  } : {
    opposition: 'Muhalefet', you: 'Sen', pickMove: 'Hamle seç:',
    oppMoving: 'Muhalefet hamle yapıyor...', budget: 'Bütçe', laundered: 'Aklanmış',
    specialPowers: '🔮 Özel Güçler (Aklanmış Para)', round: 'Tur',
    electionWon: 'SEÇİM KAZANILDI!', electionLost: 'SEÇİM KAYBEDİLDİ!',
    continue: 'Devam Et', skip: 'Pas Geç (+1%)', vote: 'oy',
  }, [lang]);

  // Intro timer
  useEffect(() => {
    if (phase !== 'intro') return;
    const timer = setTimeout(() => {
      setCards(shuffleAndDraw(config.playerCards, 4));
      setPhase('player');
    }, 2500);
    return () => clearTimeout(timer);
  }, [phase, config.playerCards]);

  const playCard = useCallback((card: ElectionCard) => {
    if (budget < card.cost) return;
    setBudget(b => b - card.cost);
    setPlayerVote(v => Math.max(0, Math.min(100, v + card.voterEffect)));
    setUsedCardIds(prev => [...prev, card.id]);
    setPhase('ai');
  }, [budget]);

  const skipTurn = useCallback(() => {
    setPlayerVote(v => Math.max(0, Math.min(100, v + 1)));
    setPhase('ai');
  }, []);

  const useSpecialPower = useCallback((power: ElectionSpecialPower) => {
    if (laundered < power.launderedCost || usedPowers.includes(power.id)) return;
    setLaundered(l => l - power.launderedCost);
    setPlayerVote(v => Math.max(0, Math.min(100, v + power.voterEffect)));
    setUsedPowers(prev => [...prev, power.id]);
  }, [laundered, usedPowers]);

  // AI turn logic
  useEffect(() => {
    if (phase !== 'ai') return;
    const timer = setTimeout(() => {
      const currentPlayerVote = playerVote;
      const currentOpponentVote = 100 - currentPlayerVote;
      const gap = currentPlayerVote - currentOpponentVote;
      let bonus = config.aiDifficultyBonus;
      if (gap > config.catchUpThreshold) bonus += config.catchUpBonus;

      const aiCard = config.aiCards[Math.floor(Math.random() * config.aiCards.length)];
      const effect = aiCard.voterEffect + bonus;

      setPlayerVote(v => Math.max(0, Math.min(100, v - effect)));
      setAiCardPlayed(aiCard);

      setTimeout(() => {
        if (round >= 3) {
          setPhase('result');
        } else {
          setRound(r => r + 1);
          setCards(prev => shuffleAndDraw(config.playerCards, 4, usedCardIds));
          setAiCardPlayed(null);
          setPhase('player');
        }
      }, 1800);
    }, 1200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, round]);

  const handleFinish = () => {
    onComplete({
      won: playerVote > 50,
      playerVote,
      opponentVote: 100 - playerVote,
      remainingBudget: budget,
      remainingLaundered: laundered,
    });
  };

  const canAffordAny = cards.some(c => budget >= c.cost);

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-auto"
      style={{ background: 'linear-gradient(180deg, #1a0000 0%, #3d0000 25%, #6b0000 50%, #8b2500 75%, #cc4400 100%)' }}>

      {/* Fire glow overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, #ff6600 0%, transparent 60%)',
          animation: 'pulse 2s ease-in-out infinite',
        }}
      />

      {/* INTRO */}
      {phase === 'intro' && (
        <div className="flex-1 flex flex-col items-center justify-center animate-scale-in relative z-10">
          <span className="text-7xl mb-4">🔥</span>
          <h1 className="text-4xl font-black text-orange-400 text-center px-4"
            style={{ textShadow: '0 0 30px rgba(255,100,0,0.6)' }}>
            {config.title}
          </h1>
          <p className="text-orange-200/80 text-lg mt-3 text-center px-6">{config.subtitle}</p>
          <span className="text-6xl mt-6 animate-pulse">🗳️</span>
          <p className="text-orange-300/60 text-sm mt-4 animate-pulse">
            {lang === 'en' ? 'Preparing ballot boxes...' : 'Sandıklar hazırlanıyor...'}
          </p>
        </div>
      )}

      {/* GAMEPLAY */}
      {(phase === 'player' || phase === 'ai') && (
        <>
          {/* Title bar */}
          <div className="text-center pt-4 pb-1 relative z-10">
            <h1 className="text-xl font-black text-orange-400"
              style={{ textShadow: '0 0 15px rgba(255,100,0,0.4)' }}>
              🔥 {config.title} 🔥
            </h1>
            <p className="text-orange-300/80 text-xs mt-0.5 font-bold">
              {labels.round} {round}/3
            </p>
          </div>

          {/* Vote bars */}
          <div className="flex justify-center items-end gap-8 px-8 py-3 relative z-10">
            {/* Opposition bar */}
            <div className="flex flex-col items-center">
              <span className="text-red-300 font-black text-xl mb-1">{opponentVote}%</span>
              <div className="w-14 rounded-t-lg overflow-hidden border border-red-700/50"
                style={{ height: 130, background: 'rgba(100,0,0,0.3)' }}>
                <div className="w-full transition-all duration-700 ease-out rounded-t"
                  style={{
                    height: `${opponentVote}%`,
                    marginTop: `${100 - opponentVote}%`,
                    background: 'linear-gradient(180deg, #ef4444, #991b1b)',
                  }}
                />
              </div>
              <span className="text-red-300 text-xs mt-1 font-bold">{labels.opposition}</span>
            </div>

            <span className="text-3xl font-black text-orange-600/50 pb-10 select-none">VS</span>

            {/* Player bar */}
            <div className="flex flex-col items-center">
              <span className="text-green-300 font-black text-xl mb-1">{playerVote}%</span>
              <div className="w-14 rounded-t-lg overflow-hidden border border-green-700/50"
                style={{ height: 130, background: 'rgba(0,60,0,0.3)' }}>
                <div className="w-full transition-all duration-700 ease-out rounded-t"
                  style={{
                    height: `${playerVote}%`,
                    marginTop: `${100 - playerVote}%`,
                    background: 'linear-gradient(180deg, #22c55e, #15803d)',
                  }}
                />
              </div>
              <span className="text-green-300 text-xs mt-1 font-bold">{labels.you}</span>
            </div>
          </div>

          {/* Budget row */}
          <div className="flex justify-center gap-3 text-xs px-4 py-1 relative z-10">
            <span className="bg-yellow-900/60 px-2.5 py-1 rounded-full text-yellow-300 font-bold border border-yellow-700/30">
              💰 {labels.budget}: {budget}B
            </span>
            <span className="bg-purple-900/60 px-2.5 py-1 rounded-full text-purple-300 font-bold border border-purple-700/30">
              🧹 {labels.laundered}: {laundered}B
            </span>
          </div>

          {/* Card area */}
          <div className="flex-1 flex flex-col justify-center px-3 py-2 relative z-10 min-h-0">
            {phase === 'player' && (
              <>
                <p className="text-orange-200 text-center text-sm mb-2 font-bold">{labels.pickMove}</p>
                <div className="grid grid-cols-2 gap-2">
                  {cards.map(card => (
                    <button
                      key={card.id}
                      disabled={budget < card.cost}
                      onClick={() => playCard(card)}
                      className="bg-orange-950/80 border border-orange-600/40 rounded-lg p-2.5 text-left disabled:opacity-30 hover:bg-orange-900/80 active:scale-95 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-lg">{card.emoji}</span>
                        <span className="text-yellow-400 text-xs font-black">{card.cost}B</span>
                      </div>
                      <p className="text-orange-100 text-[11px] mt-1 leading-tight">{card.text}</p>
                      <p className="text-green-400 text-xs mt-1 font-bold">+{card.voterEffect}%</p>
                    </button>
                  ))}
                </div>
                {!canAffordAny && (
                  <button
                    onClick={skipTurn}
                    className="mt-2 w-full py-2.5 bg-gray-800/80 border border-gray-600/40 rounded-lg text-gray-300 text-sm font-bold hover:bg-gray-700/80 active:scale-95 transition-all"
                  >
                    {labels.skip}
                  </button>
                )}
              </>
            )}

            {phase === 'ai' && (
              <div className="text-center">
                {aiCardPlayed ? (
                  <div className="bg-red-950/80 border border-red-600/50 rounded-lg p-5 mx-auto max-w-xs animate-scale-in">
                    <span className="text-4xl">{aiCardPlayed.emoji}</span>
                    <p className="text-red-100 text-sm mt-3 font-bold">{aiCardPlayed.text}</p>
                    <p className="text-red-400 text-xs mt-2 font-bold">
                      {labels.opposition} +{aiCardPlayed.voterEffect}%
                    </p>
                  </div>
                ) : (
                  <div className="animate-pulse">
                    <span className="text-5xl">🎭</span>
                    <p className="text-red-300 text-lg font-bold mt-3">{labels.oppMoving}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Special powers */}
          {phase === 'player' && config.specialPowers.length > 0 && (
            <div className="px-3 pb-3 relative z-10">
              <p className="text-purple-300 text-[10px] mb-1.5 text-center font-bold uppercase tracking-wider">
                {labels.specialPowers}
              </p>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {config.specialPowers.map(power => {
                  const used = usedPowers.includes(power.id);
                  const cantAfford = laundered < power.launderedCost;
                  return (
                    <button
                      key={power.id}
                      disabled={cantAfford || used}
                      onClick={() => useSpecialPower(power)}
                      className={`flex-shrink-0 border rounded-lg p-2 text-left transition-all active:scale-95 min-w-[115px] ${
                        used
                          ? 'bg-gray-900/80 border-gray-700/30 opacity-40'
                          : 'bg-purple-950/80 border-purple-600/40 hover:bg-purple-900/80 disabled:opacity-30'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{power.emoji}</span>
                        <span className="text-purple-300 text-[10px] font-bold">{power.launderedCost}B</span>
                      </div>
                      <p className="text-purple-100 text-[10px] mt-0.5 leading-tight font-bold">{power.name}</p>
                      <p className="text-green-400 text-[10px] font-bold">+{power.voterEffect}%</p>
                      {used && (
                        <p className="text-gray-400 text-[9px]">{lang === 'en' ? 'Used' : 'Kullanıldı'}</p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* RESULT */}
      {phase === 'result' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 animate-scale-in relative z-10">
          <span className="text-8xl mb-6">{playerVote > 50 ? '🎉' : '💀'}</span>
          <h2
            className="text-3xl font-black mb-3 text-center"
            style={{
              color: playerVote > 50 ? '#4ade80' : '#f87171',
              textShadow: `0 0 25px ${playerVote > 50 ? 'rgba(74,222,128,0.5)' : 'rgba(248,113,113,0.5)'}`,
            }}
          >
            {playerVote > 50 ? labels.electionWon : labels.electionLost}
          </h2>
          <div className="flex gap-10 my-6">
            <div className="text-center">
              <span className="text-green-400 text-4xl font-black">{playerVote}%</span>
              <p className="text-green-300 text-sm mt-1">{labels.you}</p>
            </div>
            <div className="text-center">
              <span className="text-red-400 text-4xl font-black">{100 - playerVote}%</span>
              <p className="text-red-300 text-sm mt-1">{labels.opposition}</p>
            </div>
          </div>
          <button
            onClick={handleFinish}
            className="mt-4 px-10 py-3.5 font-black rounded-xl text-lg active:scale-95 transition-all border-2"
            style={{
              background: playerVote > 50
                ? 'linear-gradient(135deg, #15803d, #22c55e)'
                : 'linear-gradient(135deg, #991b1b, #dc2626)',
              borderColor: playerVote > 50 ? '#4ade80' : '#f87171',
              color: 'white',
              boxShadow: '0 4px 25px rgba(0,0,0,0.5)',
            }}
          >
            {playerVote > 50 ? labels.continue : labels.electionLost}
          </button>
        </div>
      )}
    </div>
  );
};
