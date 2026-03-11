import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ElectionConfig, ElectionResult, ElectionCard, ElectionSpecialPower, CardRarity } from '@/types/election';
import { Language } from '@/contexts/LanguageContext';
import defeatElectionImg from '@/assets/defeat-election.jpg';
import victoryBalconyImg from '@/assets/victory-balcony.jpg';
import { playClickSound } from '@/hooks/useSound';
import { EmojiImg } from '@/components/EmojiImg';

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

/* ── Rarity system ── */

const RARITY_STYLES: Record<CardRarity, { border: string; bg: string; glow: string; label: string; labelColor: string }> = {
  common: {
    border: 'border-gray-500/60',
    bg: 'bg-gray-900/80',
    glow: '',
    label: '★',
    labelColor: 'text-gray-400',
  },
  uncommon: {
    border: 'border-emerald-500/70',
    bg: 'bg-emerald-950/80',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.3)]',
    label: '★★',
    labelColor: 'text-emerald-400',
  },
  epic: {
    border: 'border-purple-500/70',
    bg: 'bg-purple-950/80',
    glow: 'shadow-[0_0_18px_rgba(168,85,247,0.4)]',
    label: '★★★',
    labelColor: 'text-purple-400',
  },
  legendary: {
    border: 'border-red-500/80',
    bg: 'bg-red-950/80',
    glow: 'shadow-[0_0_25px_rgba(239,68,68,0.5)]',
    label: '★★★★',
    labelColor: 'text-red-400',
  },
};

function drawCards(cards: ElectionCard[], count: number, exclude: number[] = []): ElectionCard[] {
  const pool = cards.filter(c => !exclude.includes(c.id));
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/* ── AI card selection based on vote gap ── */
function selectAiCard(cards: ElectionCard[], gap: number, usedIds: number[]): ElectionCard {
  const pool = cards.filter(c => !usedIds.includes(c.id));
  const available = pool.length > 0 ? pool : cards;
  const pick = (arr: ElectionCard[]) => arr[Math.floor(Math.random() * arr.length)];

  // gap = playerVote - opponentVote (positive = player leads)
  if (gap > 10) {
    // %60 legendary, %80 epic+
    const legendary = available.filter(c => c.rarity === 'legendary');
    if (Math.random() < 0.6 && legendary.length > 0) return pick(legendary);
    const epicPlus = available.filter(c => c.rarity === 'epic' || c.rarity === 'legendary');
    if (Math.random() < 0.8 && epicPlus.length > 0) return pick(epicPlus);
    return pick(available);
  }
  if (gap > 6) {
    // %40 epic or legendary
    const epicPlus = available.filter(c => c.rarity === 'epic' || c.rarity === 'legendary');
    if (Math.random() < 0.4 && epicPlus.length > 0) return pick(epicPlus);
    return pick(available);
  }
  if (gap > 3) {
    // %40 uncommon+, %30 epic
    const epic = available.filter(c => c.rarity === 'epic' || c.rarity === 'legendary');
    if (Math.random() < 0.3 && epic.length > 0) return pick(epic);
    const uncommonPlus = available.filter(c => c.rarity !== 'common');
    if (Math.random() < 0.4 && uncommonPlus.length > 0) return pick(uncommonPlus);
    return pick(available);
  }
  // <3: random
  return pick(available);
}

const REROLL_COST = 3;
const MAX_REROLLS = 2;

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

  // Avoid exact 50/50 ties — nudge to 49.9/50.1
  const displayPlayerVote = playerVote === 50 ? 49.9 : playerVote;
  const displayOpponentVote = +(100 - displayPlayerVote).toFixed(1);
  const won = displayPlayerVote > 50;

  const labels = useMemo(() => lang === 'en' ? {
    opposition: 'Opposition', you: 'You', pickMove: 'Pick your move:',
    oppMoving: 'Opposition is making a move...', budget: 'Budget', laundered: 'Laundered',
    specialPowers: '🔮 Special Powers (Laundered)', round: 'Round',
    electionWon: 'ELECTION WON!', electionLost: 'ELECTION LOST!',
    continue: '4 More Years!', skip: 'Skip (+1%)', vote: 'vote',
    reroll: '🎲 Reroll', rerollCost: `${REROLL_COST}B`,
    balconyTitle: 'CONGRATULATIONS!',
    balconySubtitle: 'The people have chosen you... again!',
    balconyContinue: '4 More Years! 🎉',
  } : {
    opposition: 'Muhalefet', you: 'Sen', pickMove: 'Hamle seç:',
    oppMoving: 'Muhalefet hamle yapıyor...', budget: 'Bütçe', laundered: 'Aklanmış',
    specialPowers: '🔮 Özel Güçler (Aklanmış Para)', round: 'Tur',
    electionWon: 'SEÇİM KAZANILDI!', electionLost: 'SEÇİM KAYBEDİLDİ!',
    continue: '4 Sene Daha!', skip: 'Pas (+1%)', vote: 'oy',
    reroll: '🎲 Yenile', rerollCost: `${REROLL_COST}B`,
    balconyTitle: 'TEBRİKLER!',
    balconySubtitle: 'Millet yine seni seçti... yine de!',
    balconyContinue: '4 Sene Daha Devam! 🎉',
  }, [lang]);

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

  const handleReroll = useCallback(() => {
    if (rerollsLeft <= 0 || budget < REROLL_COST) return;
    setBudget(b => b - REROLL_COST);
    setRerollsLeft(r => r - 1);
    setCards(drawCards(config.playerCards, 3, usedCardIds));
  }, [rerollsLeft, budget, config.playerCards, usedCardIds]);

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

      const aiCard = selectAiCard(config.playerCards, gap, usedAiCardIds);
      const effect = aiCard.voterEffect;

      // Track used AI cards so they don't repeat
      setUsedAiCardIds(prev => [...prev, aiCard.id]);

      // Legendary shake effect
      if (aiCard.rarity === 'legendary') {
        setAiLegendaryShake(true);
        setTimeout(() => setAiLegendaryShake(false), 1500);
      }

      setPlayerVote(v => Math.max(0, Math.min(100, v - effect)));
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

  // Auto-transition from result to victory balcony if won
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
    <div className={`fixed inset-0 z-50 flex flex-col overflow-auto ${phase === 'result' && !won ? 'election-shake' : ''}`}
      style={{ background: 'linear-gradient(180deg, #1a0000 0%, #3d0000 25%, #6b0000 50%, #8b2500 75%, #cc4400 100%)', paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>

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
        <div className="absolute inset-0 z-20 red-crack-overlay pointer-events-none"
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
            <span><EmojiImg emoji="🔥" size={56} /></span>
          </div>
          <h1 className="text-4xl font-black text-orange-400 text-center px-4"
            style={{ textShadow: '0 0 30px rgba(255,100,0,0.6)' }}>
            <StaggeredTitle text={config.title} />
          </h1>
          <p className="text-orange-200/80 text-lg mt-3 text-center px-6">{config.subtitle}</p>
          <span className="mt-6 animate-pulse"><EmojiImg emoji="🗳️" size={56} /></span>
          <p className="text-orange-300/60 text-sm mt-4 animate-pulse">
            {lang === 'en' ? 'Preparing ballot boxes...' : 'Sandıklar hazırlanıyor...'}
          </p>
        </div>
      )}

      {/* GAMEPLAY */}
      {(phase === 'player' || phase === 'ai') && (
        <div className="flex-1 flex flex-col overflow-y-auto relative z-10">
          {/* Title bar */}
          <div className="text-center pt-4 pb-1">
            <h1 className="text-xl font-black text-orange-400"
              style={{ textShadow: '0 0 15px rgba(255,100,0,0.4)' }}>
              <EmojiImg emoji="🔥" size={20} className="mr-1" /> {config.title} <EmojiImg emoji="🔥" size={20} className="ml-1" />
            </h1>
            <p className="text-orange-300/80 text-xs mt-0.5 font-bold">
              {labels.round} {round}/4
            </p>
          </div>

          {/* Vote bars */}
          <div className="flex justify-center items-end gap-8 px-8 py-3">
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
          <div className="flex justify-center gap-3 text-xs px-4 py-1">
            <span className="bg-yellow-900/60 px-2.5 py-1 rounded-full text-yellow-300 font-bold border border-yellow-700/30">
              <EmojiImg emoji="💰" size={14} className="mr-1" /> {labels.budget}: {budget}B
            </span>
            <span className="bg-purple-900/60 px-2.5 py-1 rounded-full text-purple-300 font-bold border border-purple-700/30">
              <EmojiImg emoji="🧹" size={14} className="mr-1" /> {labels.laundered}: {laundered}B
            </span>
          </div>

          {/* Card area */}
          <div className="flex flex-col px-3 py-2">
            {phase === 'player' && (
              <>
                <div className="flex justify-between items-center mb-2 px-1">
                  <p className="text-orange-200 text-base font-bold">{labels.pickMove}</p>
                  {/* Reroll button - BIGGER */}
                  <button
                    disabled={rerollsLeft <= 0 || budget < REROLL_COST}
                    onClick={handleReroll}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-black transition-all active:scale-95 disabled:opacity-30 border-2 border-yellow-500/60 bg-yellow-900/70 text-yellow-200 hover:bg-yellow-800/80 hover:border-yellow-400/80"
                    style={{ boxShadow: '0 0 12px rgba(234,179,8,0.2)' }}
                  >
                    {labels.reroll} ({rerollsLeft}) <span className="text-yellow-400 font-black">-{labels.rerollCost}</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {/* 3 drawn cards */}
                  {cards.map((card, i) => {
                    const style = RARITY_STYLES[card.rarity];
                    const isLegendary = card.rarity === 'legendary';
                    return (
                      <button
                        key={card.id}
                        disabled={budget < card.cost || selectedCardId !== null}
                        onClick={() => playCard(card)}
                        className={`relative border-2 rounded-xl p-3.5 text-left disabled:opacity-30 hover:brightness-110 active:scale-95 transition-all election-card-enter overflow-hidden ${style.border} ${style.bg} ${style.glow} ${
                          selectedCardId === card.id ? 'election-card-select' : ''
                        } ${isLegendary ? 'legendary-card-flame' : ''}`}
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        {/* Rarity stars */}
                        <div className="flex justify-between items-center mb-1.5">
                          <span className={`text-xs font-black ${style.labelColor}`}>{style.label}</span>
                          <span className="text-yellow-400 text-base font-black">{card.cost}B</span>
                        </div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <EmojiImg emoji={card.emoji} size={28} />
                          <p className="text-white text-sm font-bold leading-tight flex-1">{card.text}</p>
                        </div>
                        <p className="text-green-400 text-base font-black">+{card.voterEffect}%</p>
                      </button>
                    );
                  })}
                  {/* Skip turn card - always the 4th option */}
                  <button
                    onClick={skipTurn}
                    disabled={selectedCardId !== null}
                    className="relative border-2 border-gray-600/40 bg-gray-900/60 rounded-xl p-3.5 text-left hover:bg-gray-800/70 active:scale-95 transition-all election-card-enter disabled:opacity-30"
                    style={{ animationDelay: '0.3s' }}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-black text-gray-500"><EmojiImg emoji="⏭️" size={14} /></span>
                      <span className="text-gray-400 text-base font-black">{lang === 'en' ? 'FREE' : 'ÜCRETSİZ'}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <EmojiImg emoji="⏭️" size={28} />
                      <p className="text-gray-300 text-sm font-bold leading-tight flex-1">{labels.skip}</p>
                    </div>
                    <p className="text-green-400/70 text-base font-black">+1%</p>
                  </button>
                </div>
              </>
            )}

            {phase === 'ai' && (
              <div className={`text-center ${aiLegendaryShake ? 'ai-legendary-shake' : ''}`}>
                {aiCardPlayed ? (() => {
                  const aiStyle = RARITY_STYLES[aiCardPlayed.rarity];
                  const isLegendary = aiCardPlayed.rarity === 'legendary';
                  return (
                    <div className={`border-2 rounded-xl p-4 mx-auto max-w-xs ai-card-bounce ${aiStyle.border} ${aiStyle.bg} ${aiStyle.glow} ${isLegendary ? 'legendary-card-flame' : ''}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-xs font-black ${aiStyle.labelColor}`}>{aiStyle.label}</span>
                        <span className="text-red-300 text-xs font-bold uppercase tracking-wider">{labels.opposition}</span>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <EmojiImg emoji={aiCardPlayed.emoji} size={36} />
                        <p className="text-white text-sm font-bold leading-tight flex-1">{aiCardPlayed.text}</p>
                      </div>
                      <p className="text-red-400 text-base font-black">-{aiCardPlayed.voterEffect}%</p>
                    </div>
                  );
                })() : (
                  <div className="animate-pulse">
                    <EmojiImg emoji="🎭" size={48} />
                    <p className="text-red-300 text-lg font-bold mt-3">{labels.oppMoving}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Special powers */}
          {phase === 'player' && config.specialPowers.length > 0 && (
            <div className="px-3 pb-4">
              <p className="text-purple-300/80 text-[10px] mb-1.5 text-center font-bold uppercase tracking-widest">
                {labels.specialPowers}
              </p>
              <div className="grid grid-cols-2 gap-1.5 w-full">
                {config.specialPowers.map(power => {
                  const used = usedPowers.includes(power.id);
                  const cantAfford = laundered < power.launderedCost;
                  return (
                    <button
                      key={power.id}
                      disabled={cantAfford || used}
                      onClick={() => useSpecialPower(power)}
                      className={`rounded-lg px-2 py-2 flex items-center gap-1.5 transition-all active:scale-95 w-full ${
                        used
                          ? 'bg-gray-800 opacity-30'
                          : 'bg-purple-900 hover:bg-purple-800 disabled:opacity-30'
                      }`}
                    >
                      <EmojiImg emoji={power.emoji} size={16} className="shrink-0" />
                      <span className="text-purple-100 text-[10px] font-bold leading-tight flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis">{power.name}</span>
                      <span className="text-green-400 text-[10px] font-black shrink-0">+{power.voterEffect}%</span>
                      <span className="text-purple-400 text-[9px] font-bold shrink-0">{power.launderedCost}B</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* RESULT (brief before victory transition) */}
      {phase === 'result' && (
        <div className={`flex-1 flex flex-col items-center justify-center px-6 animate-scale-in relative z-10 ${!won ? 'election-shake' : ''}`}>
          {won && <ConfettiOverlay />}

          {won ? (
            <>
              <EmojiImg emoji="🎉" size={72} className="mb-6" />
              <h2 className="text-3xl font-black mb-3 text-center title-glow-pulse" style={{ color: '#4ade80' }}>
                {labels.electionWon}
              </h2>
              <div className="flex gap-10 my-6">
                <AnimatedVote value={playerVote} color="#4ade80" label={labels.you} />
                <AnimatedVote value={100 - playerVote} color="#f87171" label={labels.opposition} />
              </div>
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

      {/* VICTORY BALCONY SCREEN */}
      {phase === 'victory' && (
        <div className="flex-1 flex flex-col items-center justify-end relative z-10 animate-fade-in">
          <ConfettiOverlay />
          
          {/* Balcony background image */}
          <div className="absolute inset-0 z-0">
            <img src={victoryBalconyImg} alt="Victory balcony" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-4 p-6 pb-10 text-center max-w-sm mx-auto">
            <span className="text-7xl animate-bounce">🏆</span>
            
            <h2 className="text-4xl font-black text-yellow-400 drop-shadow-lg"
              style={{ textShadow: '0 0 30px rgba(234,179,8,0.5)' }}>
              {labels.balconyTitle}
            </h2>
            
            <p className="text-white/90 text-lg italic leading-relaxed drop-shadow-md">
              "{labels.balconySubtitle}"
            </p>

            <div className="flex gap-8 my-4">
              <div className="text-center">
                <div className="text-3xl font-black text-green-400">{displayPlayerVote}%</div>
                <div className="text-xs text-white/60">{labels.you}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-red-400">{displayOpponentVote}%</div>
                <div className="text-xs text-white/60">{labels.opposition}</div>
              </div>
            </div>

            <button
              onClick={() => { playClickSound(); handleFinish(); }}
              className="w-full py-4 font-black rounded-2xl text-xl active:scale-95 transition-all border-2 animate-pulse"
              style={{
                background: 'linear-gradient(135deg, #15803d, #22c55e, #4ade80)',
                borderColor: '#86efac',
                color: 'white',
                boxShadow: '0 0 30px rgba(34,197,94,0.4), 0 4px 25px rgba(0,0,0,0.5)',
              }}
            >
              {labels.balconyContinue}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
