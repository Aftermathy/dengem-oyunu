import { ElectionConfig, ElectionCard, ElectionSpecialPower } from '@/types/election';
import { EmojiImg } from '@/components/EmojiImg';
import { SettingsMenu } from '@/components/game/SettingsMenu';
import { RARITY_STYLES, REROLL_COST, ElectionLabels } from './electionUtils';
import { AiSlotMachine } from './AiSlotMachine';

interface ElectionBattleProps {
  config: ElectionConfig;
  lang: string;
  phase: 'player' | 'ai';
  budget: number;
  laundered: number;
  displayPlayerVote: number;
  displayOpponentVote: number;
  round: number;
  cards: ElectionCard[];
  aiCardPlayed: ElectionCard | null;
  selectedCardId: number | null;
  barGlowKey: number;
  rerollsLeft: number;
  budgetWarning: number | string | null;
  usedPowers: string[];
  aiLegendaryShake: boolean;
  labels: ElectionLabels;
  costFactor?: number;
  darkConnectionsReduction?: number;
  aiSlotCards: ElectionCard[] | null;
  aiWinnerIndex: number | null;
  onPlayCard: (card: ElectionCard) => void;
  onSkipTurn: () => void;
  onReroll: () => void;
  onUseSpecialPower: (power: ElectionSpecialPower) => void;
  onShowBudgetWarning: (id: number | string) => void;
  onMainMenu: () => void;
  onSlotSettled: (card: ElectionCard) => void;
}

export function ElectionBattle({
  config, lang, phase, budget, laundered,
  displayPlayerVote, displayOpponentVote, round,
  cards, aiCardPlayed, selectedCardId, barGlowKey,
  rerollsLeft, budgetWarning, usedPowers,
  aiLegendaryShake, labels, costFactor = 1, darkConnectionsReduction = 0,
  aiSlotCards, aiWinnerIndex,
  onPlayCard, onSkipTurn, onReroll, onUseSpecialPower,
  onShowBudgetWarning, onMainMenu, onSlotSettled,
}: ElectionBattleProps) {
  const effectiveCost = (base: number) => Math.max(1, Math.round(base * costFactor));
  const effectiveSpecialCost = (base: number) => Math.max(1, Math.round(base * costFactor * (1 - darkConnectionsReduction)));
  const effectiveRerollCost = effectiveCost(REROLL_COST);
  return (
    <div className="flex-1 flex flex-col overflow-y-auto relative z-10">
      {/* Title bar */}
      <div className="text-center pt-4 pb-1 relative">
        <div className="absolute right-2 top-3 z-40">
          <SettingsMenu onMainMenu={onMainMenu} />
        </div>
        <h1 className="text-xl font-black text-game-election"
          style={{ textShadow: '0 0 15px hsl(var(--game-election) / 0.4)' }}>
          <EmojiImg emoji="🔥" size={20} className="mr-1" /> {config.title} <EmojiImg emoji="🔥" size={20} className="ml-1" />
        </h1>
        <p className="text-game-election-light/80 text-xs mt-0.5 font-bold">
          {labels.round} {round}/4
        </p>
      </div>

      {/* Vote bars */}
      <div className="flex justify-center items-end gap-8 px-8 py-3">
        <div className="flex flex-col items-center">
          <span className="text-game-success-light font-black text-xl mb-1">{displayPlayerVote}%</span>
          <div key={barGlowKey} className="w-14 rounded-t-lg overflow-visible border border-game-success/50 vote-bar-glow relative"
            style={{ height: 130, background: 'hsl(var(--game-success) / 0.1)' }}>
            <div className="w-full transition-all duration-700 ease-out rounded-t vote-bar-flame"
              style={{ height: `${displayPlayerVote}%`, marginTop: `${100 - displayPlayerVote}%`, background: 'linear-gradient(180deg, hsl(var(--game-success)), hsl(var(--game-success) / 0.7))' }} />
          </div>
          <span className="text-game-success-light text-xs mt-1 font-bold">{labels.you}</span>
        </div>
        <span className="text-3xl font-black text-game-election/50 pb-10 select-none">VS</span>
        <div className="flex flex-col items-center">
          <span className="text-game-danger-light font-black text-xl mb-1">{displayOpponentVote}%</span>
          <div className={`w-14 rounded-t-lg overflow-visible border border-game-danger/50 relative ${phase === 'ai' && aiCardPlayed ? 'opp-bar-glow' : ''}`}
            style={{ height: 130, background: 'hsl(var(--game-danger) / 0.1)' }}>
            <div className="w-full transition-all duration-700 ease-out rounded-t vote-bar-flame"
              style={{ height: `${displayOpponentVote}%`, marginTop: `${100 - displayOpponentVote}%`, background: 'linear-gradient(180deg, hsl(var(--game-danger)), hsl(var(--game-danger) / 0.5))' }} />
          </div>
          <span className="text-game-danger-light text-xs mt-1 font-bold">{labels.opposition}</span>
        </div>
      </div>

      {/* Budget row */}
      <div className="flex justify-center gap-3 text-xs px-4 py-1">
        <span className="bg-game-gold-dark/20 px-2.5 py-1 rounded-full text-game-gold font-bold border border-game-gold-dark/30">
          <EmojiImg emoji="💰" size={14} className="mr-1" /> {labels.budget}: {budget}B
        </span>
        <span className="bg-game-special/20 px-2.5 py-1 rounded-full text-game-special-light font-bold border border-game-special/30">
          <EmojiImg emoji="🧹" size={14} className="mr-1" /> {labels.laundered}: {laundered}B
        </span>
      </div>

      {/* Card area */}
      <div className={`px-3 py-2 ${phase === 'ai' ? 'flex-1 flex flex-col justify-center' : 'flex flex-col'}`}>
        {phase === 'player' && (
          <>
            <div className="flex justify-between items-center mb-2 px-1">
              <p className="text-game-election-light text-base font-bold">{labels.pickMove}</p>
              <button
                disabled={rerollsLeft <= 0}
                onClick={onReroll}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-black transition-all active:scale-95 disabled:opacity-30 border-2 border-game-gold-dark/60 bg-game-gold-dark/20 text-game-gold hover:bg-game-gold-dark/30 hover:border-game-gold/80 ${
                  budget < effectiveRerollCost && rerollsLeft > 0 ? 'opacity-40' : ''
                }`}
                style={{ boxShadow: '0 0 12px hsl(var(--game-gold) / 0.2)' }}
              >
                {budgetWarning === 'reroll' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-600/90 rounded-xl z-10 animate-fade-in">
                    <span className="text-white text-[10px] font-black">{labels.insufficientBudget}</span>
                  </div>
                )}
                <EmojiImg emoji="🎲" size={16} /> {labels.reroll} ({rerollsLeft}) <span className="text-game-gold font-black">-{labels.rerollCost}</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {cards.map((card, i) => {
                const style = RARITY_STYLES[card.rarity];
                const isLegendary = card.rarity === 'legendary';
                const cardCost = effectiveCost(card.cost);
                const cantAfford = budget < cardCost;
                return (
                  <button key={card.id} disabled={selectedCardId !== null}
                    onClick={() => { if (cantAfford) { onShowBudgetWarning(card.id); return; } onPlayCard(card); }}
                    onTouchStart={() => { if (cantAfford) onShowBudgetWarning(card.id); }}
                    onMouseDown={() => { if (cantAfford) onShowBudgetWarning(card.id); }}
                    className={`relative border-2 rounded-xl p-3.5 text-left active:scale-95 transition-all election-card-enter overflow-hidden ${style.border} ${style.bg} ${style.glow} ${cantAfford ? 'brightness-50 saturate-0 cursor-not-allowed' : 'hover:brightness-110'} ${selectedCardId === card.id ? 'election-card-select' : ''} ${isLegendary ? 'legendary-card-flame' : ''}`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {budgetWarning === card.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-red-600/90 rounded-xl z-10 animate-fade-in">
                        <span className="text-white text-xs font-black text-center px-2">{labels.insufficientBudget}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center mb-1.5">
                      <span className={`text-xs font-black ${style.labelColor}`}>{style.label}</span>
                      <span className={`text-base font-black ${cantAfford ? 'text-game-danger' : 'text-game-gold'}`}>{cardCost}B</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <EmojiImg emoji={card.emoji} size={28} />
                      <p className="text-sm font-bold leading-tight flex-1 text-white">{card.text}</p>
                    </div>
                    <p className="text-game-success-light text-base font-black">+{card.voterEffect}%</p>
                  </button>
                );
              })}
              <button onClick={onSkipTurn} disabled={selectedCardId !== null}
                className="relative border-2 border-muted-foreground/40 bg-transparent rounded-xl p-3.5 text-left hover:bg-white/5 active:scale-95 transition-all election-card-enter disabled:opacity-30"
                style={{ animationDelay: '0.3s' }}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-black text-muted-foreground"><EmojiImg emoji="⏭️" size={14} /></span>
                  <span className="text-muted-foreground text-base font-black">{lang === 'en' ? 'FREE' : 'ÜCRETSİZ'}</span>
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <EmojiImg emoji="⏭️" size={28} />
                  <p className="text-white text-sm font-bold leading-tight flex-1">{labels.skip}</p>
                </div>
                <p className="text-game-success-light/70 text-base font-black">+1%</p>
              </button>
            </div>
          </>
        )}

        {phase === 'ai' && (
          <div className={`${aiLegendaryShake ? 'ai-legendary-shake' : ''}`}>
            <div className="text-center animate-pulse mb-3">
              <EmojiImg emoji="🎭" size={36} />
              <p className="text-game-danger-light text-base font-bold mt-1">{labels.oppMoving}</p>
            </div>
            {aiSlotCards && aiWinnerIndex !== null ? (
              <AiSlotMachine
                cards={aiSlotCards}
                winnerIndex={aiWinnerIndex}
                onSettled={onSlotSettled}
              />
            ) : null}
          </div>
        )}
      </div>

      {/* Special powers */}
      {phase === 'player' && config.specialPowers.length > 0 && (
        <div className="px-3 pb-4">
          <p className="text-game-special-light/80 text-xs mb-2 text-center font-bold uppercase tracking-widest flex items-center justify-center gap-1">
            <EmojiImg emoji="🔮" size={14} /> {labels.specialPowers}
          </p>
          <div className="grid grid-cols-2 gap-2 w-full">
            {config.specialPowers.map(power => {
              const used = usedPowers.includes(power.id);
              const displayCost = effectiveSpecialCost(power.launderedCost);
              const cantAfford = laundered < displayCost;
              return (
                <button key={power.id} disabled={used}
                  onClick={() => onUseSpecialPower(power)}
                  onTouchStart={() => { if (cantAfford && !used) onShowBudgetWarning(power.id); }}
                  onMouseDown={() => { if (cantAfford && !used) onShowBudgetWarning(power.id); }}
                  className={`relative rounded-xl px-3 py-3 flex items-center gap-2 transition-all active:scale-95 w-full overflow-hidden ${
                    used ? 'bg-muted opacity-30' : cantAfford ? 'bg-game-special/30 opacity-40' : 'bg-game-special/30 hover:bg-game-special/40'
                  }`}
                >
                  {budgetWarning === power.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-600/90 rounded-xl z-10 animate-fade-in">
                      <span className="text-white text-[10px] font-black text-center px-1">{labels.insufficientLaundered}</span>
                    </div>
                  )}
                  <EmojiImg emoji={power.emoji} size={20} className="shrink-0" />
                  <span className="text-white text-xs font-bold leading-tight flex-1 text-left">{power.name}</span>
                  <span className="text-game-success-light text-xs font-black shrink-0">+{power.voterEffect}%</span>
                  <span className={`text-[10px] font-bold shrink-0 ${cantAfford ? 'text-game-danger' : 'text-game-special-light'}`}>{displayCost}B</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
