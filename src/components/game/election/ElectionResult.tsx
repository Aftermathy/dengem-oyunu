import { EmojiImg } from '@/components/EmojiImg';
import { ElectionLabels, ConfettiOverlay, AnimatedVote } from './electionUtils';
import { playClickSound } from '@/hooks/useSound';
import defeatElectionImg from '@/assets/defeat-election.jpg';

interface ElectionResultProps {
  won: boolean;
  playerVote: number;
  labels: ElectionLabels;
  lang: string;
  onRestart: () => void;
  onMainMenu: () => void;
}

export function ElectionResultScreen({ won, playerVote, labels, lang, onRestart, onMainMenu }: ElectionResultProps) {
  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center px-6 animate-scale-in z-10 ${!won ? 'election-shake' : ''}`}>
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
            <button onClick={() => { playClickSound(); onRestart(); }}
              className="flex-1 py-3 font-black rounded-xl text-sm active:scale-95 transition-all border border-white/20 text-white cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
              <EmojiImg emoji="🔄" size={16} className="mr-1" />{lang === 'en' ? ' Play Again' : ' Yeniden Oyna'}
            </button>
            <button onClick={() => { playClickSound(); onMainMenu(); }}
              className="flex-1 py-3 font-black rounded-xl text-sm active:scale-95 transition-all border border-white/20 text-white/80 cursor-pointer"
              style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}>
              <EmojiImg emoji="🏠" size={16} className="mr-1" />{lang === 'en' ? ' Main Menu' : ' Ana Menü'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
