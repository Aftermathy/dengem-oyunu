import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ElectionConfig, ElectionResult, ElectionCard, ElectionSpecialPower } from '@/types/election';
import { Language } from '@/contexts/LanguageContext';
import defeatElectionImg from '@/assets/defeat-election.jpg';
import { playClickSound } from '@/hooks/useSound';

interface ElectionScreenProps {
  config: ElectionConfig;
  money: number;
  launderedMoney: number;
  halkPower: number;
  lang: Language;
  onComplete: (result: ElectionResult) => void;
  onRestart: () => void;
  onMainMenu: () => void;
}

function shuffleAndDraw(cards: ElectionCard[], count: number, exclude: number[] = []): ElectionCard[] {
  const pool = cards.filter(c => !exclude.includes(c.id));
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/* ── Animated counter hook ── */
function useAnimatedCount(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setValue(Math.round(t * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

/* ── Confetti component ── */
const CONFETTI_COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6b9d', '#c084fc', '#fb923c', '#34d399'];

function ConfettiOverlay() {
  const pieces = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: `${Math.random() * 1.5}s`,
      duration: `${2 + Math.random() * 2}s`,
      size: 6 + Math.random() * 6,
    })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {pieces.map(p => (
        <span key={p.id} className="confetti-piece"
          style={{
            left: p.left,
            width: p.size, height: p.size,
            background: p.color,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}

/* ── Ember particles ── */
function EmberParticles({ count = 12 }: { count?: number }) {
  const embers = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 4}s`,
      duration: `${3 + Math.random() * 4}s`,
      size: 3 + Math.random() * 4,
    })), [count]);

  return (
    <>
      {embers.map(e => (
        <span key={e.id} className="ember-particle"
          style={{ left: e.left, width: e.size, height: e.size, animationDelay: e.delay, animationDuration: e.duration }}
        />
      ))}
    </>
  );
}

/* ── Staggered title ── */
function StaggeredTitle({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split('').map((ch, i) => (
        <span key={i} className="letter-stagger inline-block" style={{ animationDelay: `${i * 0.05}s` }}>
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </span>
  );
}

/* ── Result vote display with animated counter ── */
function AnimatedVote({ value, color, label }: { value: number; color: string; label: string }) {
  const display = useAnimatedCount(value);
  return (
    <div className="text-center">
      <span className="text-4xl font-black" style={{ color }}>{display}%</span>
      <p className="text-sm mt-1" style={{ color }}>{label}</p>
    </div>
  );
}

export const ElectionScreen = ({ config, money, launderedMoney, halkPower, lang, onComplete, onRestart, onMainMenu }: ElectionScreenProps) => {
  const [playerVote, setPlayerVote] = useState(() => Math.min(60, 35 + Math.floor(halkPower * 0.25)));
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<'intro' | 'player' | 'ai' | 'result'>('intro');
  const [budget, setBudget] = useState(money);
  const [laundered, setLaundered] = useState(launderedMoney);
  const [cards, setCards] = useState<ElectionCard[]>([]);
  const [usedPowers, setUsedPowers] = useState<string[]>([]);
  const [aiCardPlayed, setAiCardPlayed] = useState<ElectionCard | null>(null);
  const [usedCardIds, setUsedCardIds] = useState<number[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [barGlowKey, setBarGlowKey] = useState(0);
  const [showAiFlash, setShowAiFlash] = useState(false);

  // Avoid exact 50/50 ties — nudge to 49.9/50.1
  const displayPlayerVote = playerVote === 50 ? 49.9 : playerVote;
  const displayOpponentVote = +(100 - displayPlayerVote).toFixed(1);
  const won = displayPlayerVote > 50;

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
    setPlayerVote(v => Math.max(0, Math.min(100, v + 1)));
    setBarGlowKey(k => k + 1);
    setPhase('ai');
  }, []);

  const useSpecialPower = useCallback((power: ElectionSpecialPower) => {
    if (laundered < power.launderedCost || usedPowers.includes(power.id)) return;
    setLaundered(l => l - power.launderedCost);
    setPlayerVote(v => Math.max(0, Math.min(100, v + power.voterEffect)));
    setBarGlowKey(k => k + 1);
    setUsedPowers(prev => [...prev, power.id]);
  }, [laundered, usedPowers]);

  // AI turn logic
  useEffect(() => {
    if (phase !== 'ai') return;
    setShowAiFlash(true);
    const flashTimer = setTimeout(() => setShowAiFlash(false), 800);

    const timer = setTimeout(() => {
      const currentPlayerVote = playerVote;
      const currentOpponentVote = 100 - currentPlayerVote;
      const gap = currentPlayerVote - currentOpponentVote;
      let bonus = config.aiDifficultyBonus;
      if (gap > config.catchUpThreshold) bonus += config.catchUpBonus;

      const aiCard = config.aiCards[Math.floor(Math.random() * config.aiCards.length)];
      const effect = aiCard.voterEffect + bonus;

      setPlayerVote(v => Math.max(0, Math.min(100, v - effect)));
      setBarGlowKey(k => k + 1);
      setAiCardPlayed(aiCard);

      setTimeout(() => {
        if (round >= 3) {
          setPhase('result');
        } else {
          setRound(r => r + 1);
          setCards(shuffleAndDraw(config.playerCards, 4, usedCardIds));
          setAiCardPlayed(null);
          setPhase('player');
        }
      }, 1800);
    }, 1200);
    return () => { clearTimeout(timer); clearTimeout(flashTimer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, round]);

  const handleFinish = () => {
    onComplete({
      won: displayPlayerVote > 50,
      playerVote: displayPlayerVote,
      opponentVote: displayOpponentVote,
      remainingBudget: budget,
      remainingLaundered: laundered,
    });
  };

  const canAffordAny = cards.some(c => budget >= c.cost);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col overflow-auto ${phase === 'result' && !won ? 'election-shake' : ''}`}
      style={{ background: 'linear-gradient(180deg, #1a0000 0%, #3d0000 25%, #6b0000 50%, #8b2500 75%, #cc4400 100%)' }}>

      {/* Fire glow overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, #ff6600 0%, transparent 60%)',
          animation: 'pulse 2s ease-in-out infinite',
        }}
      />

      {/* AI red flash overlay */}
      {showAiFlash && (
        <div className="absolute inset-0 z-30 ai-red-flash"
          style={{ background: 'radial-gradient(ellipse at center, rgba(220,38,38,0.3) 0%, rgba(220,38,38,0.1) 50%, transparent 80%)' }}
        />
      )}

      {/* Loss red crack overlay */}
      {phase === 'result' && !won && (
        <div className="absolute inset-0 z-20 red-crack-overlay"
          style={{
            background: 'linear-gradient(45deg, rgba(220,38,38,0.2) 0%, transparent 30%, rgba(220,38,38,0.3) 50%, transparent 70%, rgba(220,38,38,0.2) 100%)',
          }}
        />
      )}

      {/* INTRO */}
      {phase === 'intro' && (
        <div className="flex-1 flex flex-col items-center justify-center animate-scale-in relative z-10">
          <EmberParticles count={15} />
          <div className="flame-ring inline-flex items-center justify-center w-20 h-20 mb-4">
            <span className="text-7xl">🔥</span>
          </div>
          <h1 className="text-4xl font-black text-orange-400 text-center px-4"
            style={{ textShadow: '0 0 30px rgba(255,100,0,0.6)' }}>
            <StaggeredTitle text={config.title} />
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
              <span className="text-red-300 font-black text-xl mb-1">{displayOpponentVote}%</span>
              <div className={`w-14 rounded-t-lg overflow-visible border border-red-700/50 relative ${phase === 'ai' && aiCardPlayed ? 'opp-bar-glow' : ''}`}
                style={{ height: 130, background: 'rgba(100,0,0,0.3)' }}>
                <div className="w-full transition-all duration-700 ease-out rounded-t vote-bar-flame"
                  style={{
                    height: `${displayOpponentVote}%`,
                    marginTop: `${100 - displayOpponentVote}%`,
                    background: 'linear-gradient(180deg, #ef4444, #991b1b)',
                  }}
                />
              </div>
              <span className="text-red-300 text-xs mt-1 font-bold">{labels.opposition}</span>
            </div>

            <span className="text-3xl font-black text-orange-600/50 pb-10 select-none">VS</span>

            {/* Player bar */}
            <div className="flex flex-col items-center">
              <span className="text-green-300 font-black text-xl mb-1">{displayPlayerVote}%</span>
              <div key={barGlowKey} className="w-14 rounded-t-lg overflow-visible border border-green-700/50 vote-bar-glow relative"
                style={{ height: 130, background: 'rgba(0,60,0,0.3)' }}>
                <div className="w-full transition-all duration-700 ease-out rounded-t vote-bar-flame"
                  style={{
                    height: `${displayPlayerVote}%`,
                    marginTop: `${100 - displayPlayerVote}%`,
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
                  {cards.map((card, i) => (
                    <button
                      key={card.id}
                      disabled={budget < card.cost || selectedCardId !== null}
                      onClick={() => playCard(card)}
                      className={`relative bg-orange-950/80 border border-orange-600/40 rounded-lg p-2.5 text-left disabled:opacity-30 hover:bg-orange-900/80 active:scale-95 transition-all election-card-enter election-card-shimmer overflow-hidden ${
                        selectedCardId === card.id ? 'election-card-select' : ''
                      }`}
                      style={{ animationDelay: `${i * 0.1}s` }}
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
                  <div className="bg-red-950/80 border border-red-600/50 rounded-lg p-5 mx-auto max-w-xs ai-card-bounce">
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
        <div className={`flex-1 flex flex-col items-center justify-center px-6 animate-scale-in relative z-10 ${!won ? 'election-shake' : ''}`}>
          {won && <ConfettiOverlay />}

          {won ? (
            <>
              <span className="text-8xl mb-6">🎉</span>
              <h2 className="text-3xl font-black mb-3 text-center title-glow-pulse" style={{ color: '#4ade80' }}>
                {labels.electionWon}
              </h2>
              <div className="flex gap-10 my-6">
                <AnimatedVote value={playerVote} color="#4ade80" label={labels.you} />
                <AnimatedVote value={100 - playerVote} color="#f87171" label={labels.opposition} />
              </div>
              <button
                onClick={handleFinish}
                className="mt-4 px-10 py-3.5 font-black rounded-xl text-lg active:scale-95 transition-all border-2"
                style={{
                  background: 'linear-gradient(135deg, #15803d, #22c55e)',
                  borderColor: '#4ade80',
                  color: 'white',
                  boxShadow: '0 4px 25px rgba(0,0,0,0.5)',
                }}
              >
                {labels.continue}
              </button>
            </>
          ) : (
            <>
              <div className="w-full max-w-xs rounded-xl overflow-hidden border-2 border-red-800/60 shadow-2xl mb-4">
                <img src={defeatElectionImg} alt="Election defeat" className="w-full h-48 object-cover" />
              </div>

              <h2 className="text-2xl font-black mb-2 text-center election-glitch" style={{ color: '#f87171' }}>
                {labels.electionLost}
              </h2>

              <p className="text-orange-200/90 text-center text-sm px-4 mb-2 italic leading-relaxed max-w-xs"
                style={{ textShadow: '0 0 10px rgba(255,100,0,0.3)' }}>
                {lang === 'en'
                  ? '"He who came with the ballot box, left with the ballot box. Democracy is a beautiful thing... when it works against you."'
                  : '"Sandıkla gelen, sandıkla gitti. Demokrasi ne güzel şey... sana karşı işleyince."'}
              </p>
              <p className="text-red-400/70 text-xs mb-4">
                {lang === 'en' ? '— The People have spoken.' : '— Millet iradesini gösterdi.'}
              </p>

              <div className="flex gap-10 my-3">
                <AnimatedVote value={playerVote} color="#4ade80" label={labels.you} />
                <AnimatedVote value={100 - playerVote} color="#f87171" label={labels.opposition} />
              </div>

              <div className="flex gap-3 mt-4 w-full max-w-xs relative z-50">
                <button
                  onClick={() => { playClickSound(); onRestart(); }}
                  className="flex-1 py-3 font-black rounded-xl text-sm active:scale-95 transition-all border border-white/20 text-white cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
                >
                  {lang === 'en' ? '🔄 Play Again' : '🔄 Yeniden Oyna'}
                </button>
                <button
                  onClick={() => { playClickSound(); onMainMenu(); }}
                  className="flex-1 py-3 font-black rounded-xl text-sm active:scale-95 transition-all border border-white/20 text-white/80 cursor-pointer"
                  style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
                >
                  {lang === 'en' ? '🏠 Main Menu' : '🏠 Ana Menü'}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
