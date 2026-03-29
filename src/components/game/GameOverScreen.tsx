import { useLanguage } from '@/contexts/LanguageContext';
import { playClickSound } from '@/hooks/useSound';
import { EmojiImg } from '@/components/EmojiImg';

import { GameImages } from '@/config/assets';

const defeatImages: Record<string, string> = {
  'defeat-halk':         GameImages.defeat_halk,
  'defeat-yatirimcilar': GameImages.defeat_yatirimcilar,
  'defeat-mafya':        GameImages.defeat_mafya,
  'defeat-tarikat':      GameImages.defeat_tarikat,
  'defeat-ordu':         GameImages.defeat_ordu,
  'defeat-iflas':        GameImages.defeat_iflas,
  'defeat-election':     GameImages.defeat_election,
};

interface GameOverScreenProps {
  title: string;
  description: string;
  emoji: string;
  image?: string;
  turn: number;
  highScore: number;
  money: number;
  earnedAP: number;
  electionsWon?: number;
  maxMoney?: number;
  maxElectionPct?: number;
  maxLaundered?: number;
  deathReason?: string;
  onRestart: () => void;
  onMainMenu: () => void;
}

export function GameOverScreen({
  title, description, emoji, image, turn, highScore, money, earnedAP,
  onRestart, onMainMenu,
}: GameOverScreenProps) {
  const { t } = useLanguage();
  const bgImage = image ? defeatImages[image] : null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-end w-full overflow-hidden bg-black" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="absolute inset-0 z-20 pointer-events-none gameover-blackfade" />

      {(image === 'defeat-halk' || image === 'defeat-election') ? (
        <div className="absolute inset-0 z-0 bg-black">
          <video
            src={image === 'defeat-halk' ? '/assets/defeat_halk.mp4' : '/assets/defeat_election.mp4'}
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
      ) : bgImage ? (
        <div className="absolute inset-0 z-0">
          <img src={bgImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/20" />
        </div>
      ) : null}

      <div className="relative z-10 flex flex-col items-center gap-3 p-6 pb-4 text-center max-w-sm mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-red-400 drop-shadow-lg">{title}</h2>
        <p className="text-sm text-white/90 leading-relaxed drop-shadow-md">{description}</p>

        <div className="flex gap-5 mt-1">
          <div className="text-center">
            <div className="text-2xl font-black text-white">{turn}</div>
            <div className="text-xs text-white/60">{t('gameover.turn')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-game-gold">{highScore}</div>
            <div className="text-xs text-white/60">{t('gameover.best')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-white">{money}B</div>
            <div className="text-xs text-white/60"><EmojiImg emoji="💰" size={14} /></div>
          </div>
        </div>

        {/* Authority Points earned */}
        {earnedAP > 0 && (
          <div className="mt-1 bg-game-gold/20 border border-game-gold/40 rounded-xl px-4 py-2 flex items-center gap-2 animate-fade-in">
            <EmojiImg emoji="⭐" size={20} />
            <div>
              <div className="text-lg font-black text-game-gold">+{earnedAP} AP</div>
              <div className="text-[10px] text-yellow-300/80 font-bold">
                {t('gameover.turn') === 'tur' ? 'Otorite Puanı Kazanıldı' : 'Authority Points Earned'}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-2 w-full">
          <button onClick={() => { playClickSound(); onRestart(); }} className="flex-1 text-sm px-4 py-4 font-bold rounded-md bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-white active:scale-95 transition-all">
            {t('gameover.restart')}
          </button>
          <button onClick={() => { playClickSound(); onMainMenu(); }} className="flex-1 text-sm px-4 py-4 font-bold rounded-md bg-game-overlay/30 backdrop-blur-sm border border-primary-foreground/20 text-white/80 active:scale-95 transition-all">
            {t('gameover.menu')}
          </button>
        </div>
      </div>
    </div>
  );
}
