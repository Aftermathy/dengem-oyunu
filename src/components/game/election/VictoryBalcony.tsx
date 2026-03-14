import { EmojiImg } from '@/components/EmojiImg';
import { ElectionLabels, ConfettiOverlay } from './electionUtils';
import { playClickSound } from '@/hooks/useSound';
import victoryBalconyImg from '@/assets/victory-balcony.jpg';

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
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-3 p-6 pb-6 text-center max-w-sm mx-auto">
        <EmojiImg emoji="🏆" size={64} className="animate-bounce" />
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
        <button onClick={() => { playClickSound(); onFinish(); }}
          className="w-full py-4 font-black rounded-2xl text-xl active:scale-95 transition-all border-2 animate-pulse"
          style={{
            background: 'linear-gradient(135deg, #15803d, #22c55e, #4ade80)',
            borderColor: '#86efac', color: 'white',
            boxShadow: '0 0 30px rgba(34,197,94,0.4), 0 4px 25px rgba(0,0,0,0.5)',
          }}>
          {labels.balconyContinue}
        </button>
      </div>
    </div>
  );
}
