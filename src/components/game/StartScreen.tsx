import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

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
          onClick={() => setLang('tr')}
          className={`px-3 py-1 rounded-full text-sm font-bold transition-colors ${
            lang === 'tr' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          🇹🇷 TR
        </button>
        <button
          onClick={() => setLang('en')}
          className={`px-3 py-1 rounded-full text-sm font-bold transition-colors ${
            lang === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          🇬🇧 EN
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
        onClick={onStart}
        className="text-lg px-10 py-6 font-bold mt-2 shadow-lg hover:shadow-xl transition-shadow"
      >
        {t('start.play')}
      </Button>

      <div className="flex gap-3 text-2xl mt-4">
        <span title={t('power.halk')}>🏛️</span>
        <span title={t('power.yatirimcilar')}>💰</span>
        <span title={t('power.mafya')}>🔫</span>
        <span title={t('power.tarikat')}>📿</span>
        <span title={t('power.ordu')}>⚔️</span>
      </div>

      {/* Ad-free full version button */}
      <button
        onClick={() => window.open('https://example.com/purchase', '_blank')}
        className="mt-2 flex items-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
      >
        <span>👑</span>
        <span>{lang === 'tr' ? 'Reklamsız Full Versiyon' : 'Ad-Free Full Version'}</span>
      </button>
    </div>
  );
}
