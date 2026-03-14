import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { playClickSound } from '@/hooks/useSound';
import { EmojiImg } from '@/components/EmojiImg';

import defeatHalk from '@/assets/defeat-halk.jpg';
import defeatYatirimcilar from '@/assets/defeat-yatirimcilar.jpg';
import defeatMafya from '@/assets/defeat-mafya.jpg';
import defeatTarikat from '@/assets/defeat-tarikat.jpg';
import defeatOrdu from '@/assets/defeat-ordu.jpg';
import defeatIflas from '@/assets/defeat-iflas.jpg';

const defeatImages: Record<string, string> = {
  'defeat-halk': defeatHalk,
  'defeat-yatirimcilar': defeatYatirimcilar,
  'defeat-mafya': defeatMafya,
  'defeat-tarikat': defeatTarikat,
  'defeat-ordu': defeatOrdu,
  'defeat-iflas': defeatIflas,
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
    <div className="fixed inset-0 flex flex-col items-center justify-end w-full overflow-hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="absolute inset-0 z-20 pointer-events-none gameover-blackfade" />

      {bgImage && (
        <div className="absolute inset-0 z-0">
          <img src={bgImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-game-overlay via-game-overlay/70 to-transparent" />
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center gap-3 p-6 pb-4 text-center max-w-sm mx-auto">
        <div className="text-5xl"><EmojiImg emoji={emoji} size={56} /></div>
        <h2 className="text-2xl sm:text-3xl font-black text-game-danger-light drop-shadow-lg">{title}</h2>
        <p className="text-sm text-primary-foreground/80 leading-relaxed drop-shadow-md">{description}</p>

        <div className="flex gap-5 mt-1">
          <div className="text-center">
            <div className="text-2xl font-black text-primary-foreground">{turn}</div>
            <div className="text-xs text-primary-foreground/60">{t('gameover.turn')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-game-gold">{highScore}</div>
            <div className="text-xs text-primary-foreground/60">{t('gameover.best')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-primary-foreground">{money}B</div>
            <div className="text-xs text-primary-foreground/60"><EmojiImg emoji="💰" size={14} /></div>
          </div>
        </div>

        {/* Authority Points earned */}
        {earnedAP > 0 && (
          <div className="mt-1 bg-game-gold/20 border border-game-gold/40 rounded-xl px-4 py-2 flex items-center gap-2 animate-fade-in">
            <EmojiImg emoji="⭐" size={20} />
            <div>
              <div className="text-lg font-black text-game-gold">+{earnedAP} AP</div>
              <div className="text-[10px] text-game-gold/60 font-bold">
                {t('gameover.turn') === 'tur' ? 'Otorite Puanı Kazanıldı' : 'Authority Points Earned'}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-2 w-full">
          <Button size="lg" onClick={() => { playClickSound(); onRestart(); }} className="flex-1 text-sm px-4 py-4 font-bold bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20">
            {t('gameover.restart')}
          </Button>
          <Button size="lg" onClick={() => { playClickSound(); onMainMenu(); }} variant="outline" className="flex-1 text-sm px-4 py-4 font-bold bg-game-overlay/30 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground/80 hover:bg-game-overlay/50">
            {t('gameover.menu')}
          </Button>
        </div>
      </div>
    </div>
  );
}
