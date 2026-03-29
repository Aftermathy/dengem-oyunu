import { EmojiImg } from '@/components/EmojiImg';
import { ElectionLabels, ConfettiOverlay, AnimatedVote } from './electionUtils';
import { playClickSound } from '@/hooks/useSound';
import { GameImages } from '@/config/assets';
import { GameIcon } from '@/components/GameIcon';
const defeatElectionImg = GameImages.defeat_election;

interface ElectionResultProps {
  won: boolean;
  playerVote: number;
  labels: ElectionLabels;
  lang: string;
  earnedAP?: number;
  onRestart: () => void;
  onMainMenu: () => void;
}

export function ElectionResultScreen({ won, playerVote, labels, lang, earnedAP = 0, onRestart, onMainMenu }: ElectionResultProps) {
  if (won) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center px-6 animate-scale-in z-10">
        <ConfettiOverlay />
        <EmojiImg emoji="🎉" size={72} className="mb-6" />
        <h2 className="text-3xl font-black mb-3 text-center title-glow-pulse text-game-success-light">
          {labels.electionWon}
        </h2>
        <div className="flex gap-10 my-6">
          <AnimatedVote value={playerVote} color="hsl(var(--game-success-light))" label={labels.you} />
          <AnimatedVote value={100 - playerVote} color="hsl(var(--game-danger-light))" label={labels.opposition} />
        </div>
      </div>
    );
  }

  // Defeat — fullscreen background like GameOverScreen
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-end w-full overflow-hidden election-shake bg-black" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="absolute inset-0 z-0">
        <video
          src="/assets/defeat_election.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ WebkitPlaysinline: true } as React.CSSProperties}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/20" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-3 p-6 pb-4 text-center max-w-sm mx-auto w-full">
        <h2 className="text-2xl font-black text-red-400 drop-shadow-lg election-glitch">
          {labels.electionLost}
        </h2>
        <p className="text-white/80 text-sm italic leading-relaxed"
          style={{ textShadow: '0 0 10px hsl(var(--game-election) / 0.3)' }}>
          {lang === 'en'
            ? '"He who came with the ballot box, left with the ballot box."'
            : '"Sandıkla gelen, sandıkla gitti."'}
        </p>
        <div className="flex gap-10 my-2">
          <AnimatedVote value={playerVote} color="hsl(var(--game-success-light))" label={labels.you} />
          <AnimatedVote value={100 - playerVote} color="hsl(var(--game-danger-light))" label={labels.opposition} />
        </div>

        {earnedAP > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl animate-fade-in"
            style={{
              background: 'linear-gradient(135deg, hsl(45 80% 50% / 0.15), hsl(35 90% 40% / 0.1))',
              border: '1px solid hsl(45 80% 50% / 0.4)',
            }}
          >
            <GameIcon name="star" size={16} style={{ color: 'hsl(45 93% 58%)', fill: 'hsl(45 93% 58%)' }} />
            <span className="font-black text-sm" style={{ color: 'hsl(45 93% 58%)' }}>+{earnedAP} AP</span>
            <span className="text-[10px] ml-1.5" style={{ color: 'hsl(45 60% 50% / 0.7)' }}>
              {lang === 'en' ? 'Authority Points' : 'Otorite Puanı'}
            </span>
          </div>
        )}

        <div className="flex gap-3 mt-1 w-full relative z-50">
          <button onClick={() => { playClickSound(); onRestart(); }}
            className="flex-1 py-3 font-black rounded-xl text-sm active:scale-95 transition-all border border-white/20 text-white bg-white/10 backdrop-blur-sm">
            <EmojiImg emoji="🔄" size={16} className="mr-1" />{lang === 'en' ? ' Play Again' : ' Yeniden Oyna'}
          </button>
          <button onClick={() => { playClickSound(); onMainMenu(); }}
            className="flex-1 py-3 font-black rounded-xl text-sm active:scale-95 transition-all border border-white/20 text-white/80 bg-game-overlay/30 backdrop-blur-sm">
            <EmojiImg emoji="🏠" size={16} className="mr-1" />{lang === 'en' ? ' Main Menu' : ' Ana Menü'}
          </button>
        </div>
      </div>
    </div>
  );
}
