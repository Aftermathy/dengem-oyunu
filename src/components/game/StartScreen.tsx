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
    <div className="flex flex-col items-center justify-center gap-6 p-6 text-center animate-fade-in">
      {/* Language toggle */}
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

      {/* Throne SVG illustration */}
      <div className="relative">
        <div className="text-8xl sm:text-9xl">🪑</div>
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl sm:text-5xl">👑</div>
      </div>

      <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-foreground">
        I MUST STAY
      </h1>
      <p className="text-muted-foreground text-sm sm:text-base max-w-xs leading-relaxed">
        {t('start.subtitle')}<br />
        <span className="text-xs opacity-70">{t('start.subtitle2')}</span>
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
        className="text-lg px-10 py-6 font-bold mt-2 shadow-lg hover:shadow-xl transition-shadow"
      >
        {t('start.play')}
      </Button>

      <div className="flex gap-3 text-2xl mt-4">
        <span title={t('power.halk')}>🏛️</span>
        <span title={t('power.yatirimcilar')}>💰</span>
        <span title={t('power.mafya')}>🗡️</span>
        <span title={t('power.tarikat')}>📿</span>
        <span title={t('power.ordu')}>⚔️</span>
      </div>

      {/* Studio branding */}
      <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground mt-2">
        Aftermath Vibe Studios
      </div>

      {/* Ad-free full version button - App Store */}
      <a
        href="https://apps.apple.com/app/i-must-stay"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 border border-white/10"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
        <div className="flex flex-col leading-tight">
          <span className="text-[9px] opacity-80">{lang === 'tr' ? 'Reklamsız Full Versiyon' : 'Ad-Free Full Version'}</span>
          <span className="text-sm font-bold -mt-0.5">App Store</span>
        </div>
      </a>
    </div>
  );
}
