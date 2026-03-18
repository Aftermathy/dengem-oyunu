import { EmojiImg } from '@/components/EmojiImg';
import { ElectionLabels, ConfettiOverlay } from './electionUtils';
import { playClickSound } from '@/hooks/useSound';
import { GameImages } from '@/config/assets';
const victoryBalconyImg = GameImages.victory_balcony;

interface VictoryBalconyProps {
  displayPlayerVote: number;
  displayOpponentVote: number;
  labels: ElectionLabels;
  onFinish: () => void;
}

export function VictoryBalcony({ displayPlayerVote, displayOpponentVote, labels, onFinish }: VictoryBalconyProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-end z-10 animate-fade-in">
      <ConfettiOverlay />
      <div className="absolute inset-0 z-0">
        <img src={victoryBalconyImg} alt="Victory balcony" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-game-overlay via-game-overlay/60 to-transparent" />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-3 p-6 pb-6 text-center max-w-sm mx-auto">
        <EmojiImg emoji="🏆" size={64} className="animate-bounce" />
        <h2 className="text-4xl font-black text-game-gold drop-shadow-lg"
          style={{ textShadow: '0 0 30px hsl(var(--game-gold) / 0.5)' }}>
          {labels.balconyTitle}
        </h2>
        <p className="text-primary-foreground/90 text-lg italic leading-relaxed drop-shadow-md">
          "{labels.balconySubtitle}"
        </p>
        <div className="flex gap-8 my-4">
          <div className="text-center">
            <div className="text-3xl font-black text-game-success-light">{displayPlayerVote}%</div>
            <div className="text-xs text-primary-foreground/60">{labels.you}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-game-danger-light">{displayOpponentVote}%</div>
            <div className="text-xs text-primary-foreground/60">{labels.opposition}</div>
          </div>
        </div>
        <button onClick={() => { playClickSound(); onFinish(); }}
          className="w-full py-4 font-black rounded-2xl text-xl active:scale-95 transition-all border-2 animate-pulse text-primary-foreground"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--game-success) / 0.8), hsl(var(--game-success-light)))',
            borderColor: 'hsl(var(--game-success-light))',
            boxShadow: '0 0 30px hsl(var(--game-success) / 0.4), 0 4px 25px hsl(var(--game-overlay) / 0.5)',
          }}>
          {labels.balconyContinue}
        </button>
      </div>
    </div>
  );
}
