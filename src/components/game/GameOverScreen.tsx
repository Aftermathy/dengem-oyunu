import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface GameOverScreenProps {
  title: string;
  description: string;
  emoji: string;
  turn: number;
  highScore: number;
  onRestart: () => void;
}

export function GameOverScreen({ title, description, emoji, turn, highScore, onRestart }: GameOverScreenProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 text-center animate-fade-in max-w-sm mx-auto">
      <div className="text-7xl sm:text-8xl animate-bounce">{emoji}</div>
      <h2 className="text-2xl sm:text-3xl font-black text-destructive">{title}</h2>
      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{description}</p>

      <div className="flex gap-6 mt-2">
        <div className="text-center">
          <div className="text-3xl font-black text-foreground">{turn}</div>
          <div className="text-xs text-muted-foreground">{t('gameover.turn')}</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-black text-primary">{highScore}</div>
          <div className="text-xs text-muted-foreground">{t('gameover.best')}</div>
        </div>
      </div>

      <Button size="lg" onClick={onRestart} className="mt-4 text-lg px-8 py-6 font-bold">
        {t('gameover.restart')}
      </Button>
    </div>
  );
}
