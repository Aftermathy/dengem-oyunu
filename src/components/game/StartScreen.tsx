import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { playClickSound } from '@/hooks/useSound';

interface StartScreenProps {
  highScore: number;
  onStart: () => void;
}

export function StartScreen({ highScore, onStart }: StartScreenProps) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center gap-5 p-6 text-center animate-fade-in min-h-screen">
      {/* Language toggle — top */}
      <div className="flex gap-1 bg-muted rounded-full p-1">
        <button
          onClick={() => { playClickSound(); setLang('tr'); }}
          className={`px-3 py-1 rounded-full text-sm font-bold transition-colors ${
            lang === 'tr' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          TR
        </button>
        <button
          onClick={() => { playClickSound(); setLang('en'); }}
          className={`px-3 py-1 rounded-full text-sm font-bold transition-colors ${
            lang === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          EN
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Crown + Title */}
      <div className="relative">
        <div className="text-8xl sm:text-9xl">🪑</div>
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl sm:text-5xl">👑</div>
      </div>

      <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-foreground">
        I MUST STAY
      </h1>
      <p className="text-muted-foreground text-sm sm:text-base max-w-xs leading-relaxed">
        {t('start.subtitle')}
      </p>

      {highScore > 0 && (
        <div className="bg-muted/50 border border-border rounded-xl px-4 py-2">
          <span className="text-xs text-muted-foreground">{t('start.highscore')} </span>
          <span className="font-bold text-primary text-lg">{highScore} {t('start.turns')}</span>
        </div>
      )}

      <Button
        size="lg"
        onClick={() => { playClickSound(); onStart(); }}
        className="text-lg px-10 py-6 font-bold shadow-lg hover:shadow-xl transition-shadow"
      >
        {t('start.play')}
      </Button>

      <a
        href="https://apps.apple.com/app/i-must-stay"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 px-6 py-2 rounded-lg text-xs font-semibold tracking-wide text-primary/80 border border-primary/20 hover:border-primary/40 hover:text-primary transition-all duration-300 animate-pulse"
        style={{ textShadow: '0 0 8px hsl(15 80% 50% / 0.3)' }}
      >
        ✨ {lang === 'tr' ? 'Full Sürüm — Reklamsız' : 'Full Version — Ad-Free'} ✨
      </a>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Studio branding */}
      <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground pb-6">
        Aftermath Vibe Studios
      </div>
    </div>
  );
}
