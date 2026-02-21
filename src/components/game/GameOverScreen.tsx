import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

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
  onRestart: () => void;
}

export function GameOverScreen({ title, description, emoji, image, turn, highScore, money, onRestart }: GameOverScreenProps) {
  const { t } = useLanguage();
  const bgImage = image ? defeatImages[image] : null;

  return (
    <div className="relative flex flex-col items-center justify-end min-h-screen w-full overflow-hidden">
      {/* Background defeat image */}
      {bgImage && (
        <div className="absolute inset-0 z-0">
          <img src={bgImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        </div>
      )}

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center gap-4 p-6 pb-10 text-center max-w-sm mx-auto animate-fade-in">
        <div className="text-6xl">{emoji}</div>
        <h2 className="text-3xl sm:text-4xl font-black text-red-400 drop-shadow-lg">{title}</h2>
        <p className="text-sm text-white/80 leading-relaxed drop-shadow-md">{description}</p>

        <div className="flex gap-6 mt-2">
          <div className="text-center">
            <div className="text-3xl font-black text-white">{turn}</div>
            <div className="text-xs text-white/60">{t('gameover.turn')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-amber-400">{highScore}</div>
            <div className="text-xs text-white/60">{t('gameover.best')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-white">{money}M</div>
            <div className="text-xs text-white/60">💰</div>
          </div>
        </div>

        <Button size="lg" onClick={onRestart} className="mt-4 text-lg px-8 py-6 font-bold bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20">
          {t('gameover.restart')}
        </Button>
      </div>
    </div>
  );
}
