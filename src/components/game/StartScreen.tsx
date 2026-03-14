import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { playClickSound, playWarStartSound } from '@/hooks/useSound';
import { EmojiImg } from '@/components/EmojiImg';
import throneIcon from '@/assets/throne-icon.png';
import { hapticLight, hapticMedium } from '@/hooks/useHaptics';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun } from 'lucide-react';
import { hasSavedGame } from '@/lib/gameSave';
import { STORAGE_KEYS } from '@/constants/storage';
import { AchievementList } from '@/components/game/AchievementList';
// import { LeaderboardScreen } from '@/components/game/LeaderboardScreen'; // DISABLED
import { getUnlockedIds } from '@/lib/achievements';

// Multilingual "I MUST STAY" variants — bold word marked with *word*
const TITLE_VARIANTS = [
  { text: 'I *MUST* STAY' },
  { text: '*ASLA* GİTMEM' },
  { text: 'ICH *MUSS* BLEIBEN' },
  { text: 'JE *DOIS* RESTER' },
  { text: '*DEBO* QUEDARME' },
  { text: 'Я *ДОЛЖЕН* ОСТАТЬСЯ' },
  { text: '*NUNCA* ME VOY' },
  { text: 'IO *DEVO* RESTARE' },
  { text: 'EU *DEVO* FICAR' },
  { text: 'JAG *MÅSTE* STANNA' },
];

// Shake directions cycle
const SHAKE_CLASSES = [
  'animate-shake-right',
  'animate-shake-left',
  'animate-shake-right',
  'animate-shake-left',
  'animate-shake-up',
];

interface StartScreenProps {
  highScore: number;
  onStart: () => void;
  onContinue?: () => void;
}

export function StartScreen({ highScore, onStart, onContinue }: StartScreenProps) {
  const { lang, setLang, t } = useLanguage();
  const [titleIndex, setTitleIndex] = useState(0);
  const [shakeClass, setShakeClass] = useState('');
  const [throneClicks, setThroneClicks] = useState(0);
  const [throneAnim, setThroneAnim] = useState('');
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [showDarkWarning, setShowDarkWarning] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  // const [showLeaderboard, setShowLeaderboard] = useState(false); // DISABLED

  const currentTitle = TITLE_VARIANTS[titleIndex];

  const handleTitleClick = useCallback(() => {
    playClickSound();
    hapticMedium();
    const nextIndex = (titleIndex + 1) % TITLE_VARIANTS.length;
    setTitleIndex(nextIndex);
    const shakeIdx = nextIndex % SHAKE_CLASSES.length;
    setShakeClass(SHAKE_CLASSES[shakeIdx]);
    setTimeout(() => setShakeClass(''), 400);
  }, [titleIndex]);

  const handleThroneClick = useCallback(() => {
    hapticLight();
    playClickSound();
    const next = throneClicks + 1;
    setThroneClicks(next);
    const cycle = (next - 1) % 3;
    if (cycle === 0) {
      setThroneAnim('animate-throne-wobble');
      setTimeout(() => setThroneAnim(''), 600);
    } else if (cycle === 1) {
      setThroneAnim('animate-throne-spin');
      setTimeout(() => setThroneAnim(''), 600);
    } else {
      setThroneAnim('animate-throne-shatter');
      setTimeout(() => setThroneAnim(''), 1200);
    }
  }, [throneClicks]);

  const toggleDarkMode = useCallback(() => {
    const next = !isDark;
    if (next) {
      // Show easter egg warning before enabling
      setShowDarkWarning(true);
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.DARK_MODE, 'false');
      setIsDark(false);
    }
  }, [isDark]);

  const confirmDarkMode = useCallback(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, 'true');
    setIsDark(true);
    setShowDarkWarning(false);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    if (saved === 'true') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  // Render title with bold word
  const renderTitle = () => {
    const parts = currentTitle.text.split(/\*([^*]+)\*/);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return (
          <span key={i} className="text-red-800 dark:text-red-500 underline decoration-2 underline-offset-4 font-black">
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col items-center p-4 text-center animate-fade-in h-[100dvh] overflow-hidden pt-safe-plus-1 pb-safe">
      {/* Top bar: Language toggle + Dark mode */}
      <div className="flex items-center justify-between w-full shrink-0 mb-1">
        <div className="flex gap-1 bg-muted rounded-full p-1">
          <button
            onClick={() => {playClickSound();setLang('tr');}}
            className={`px-3 py-1 rounded-full text-sm font-bold transition-colors ${
            lang === 'tr' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`
            }>
            TR
          </button>
          <button
            onClick={() => {playClickSound();setLang('en');}}
            className={`px-3 py-1 rounded-full text-sm font-bold transition-colors ${
            lang === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`
            }>
            EN
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-muted-foreground" />
          <Switch checked={isDark} onCheckedChange={toggleDarkMode} />
          <Moon className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {/* Throne */}
      <div className="flex-1 min-h-0 flex items-end justify-center">
        <img
          src={throneIcon}
          alt="Throne"
          className={`interactive-img w-72 h-72 sm:w-80 sm:h-80 object-contain drop-shadow-lg cursor-pointer select-none shrink-0 ${throneAnim}`}
          onClick={handleThroneClick}
        />
      </div>

      {/* Title */}
      <h1
        className={`text-4xl sm:text-5xl font-black tracking-tight text-foreground cursor-pointer select-none mt-2 ${shakeClass}`}
        onClick={handleTitleClick}
      >
        {renderTitle()}
      </h1>
      <p className="text-muted-foreground text-sm max-w-xs leading-relaxed shrink-0 mt-1">
        {t('start.subtitle')}
      </p>

      {/* Center section: buttons between subtitle and studio branding */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-3">
        {highScore > 0 &&
          <div className="bg-muted/50 border border-border rounded-xl px-4 py-1.5 shrink-0">
            <span className="text-xs text-muted-foreground">{t('start.highscore')} </span>
            <span className="font-bold text-primary text-base">{highScore} {t('start.turns')}</span>
          </div>
        }

        <div className="flex flex-col items-center gap-3 w-full max-w-[240px]">
          <Button
            size="lg"
            onClick={() => {playWarStartSound();onStart();}}
            className="w-full text-lg py-5 font-bold shadow-lg hover:shadow-xl transition-shadow justify-center">
            {t('start.play')}
          </Button>

          {hasSavedGame() && onContinue && (
            <Button
              size="lg"
              variant="outline"
              onClick={() => {playClickSound();hapticMedium();onContinue();}}
              className="w-full text-lg py-5 font-bold justify-center">
              {lang === 'tr' ? 'Devam Et' : 'Continue'}
            </Button>
          )}

          <div className="flex items-center gap-4">
            <button
              onClick={() => { playClickSound(); hapticLight(); setShowAchievements(true); }}
              className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <EmojiImg emoji="🏅" size={16} />
              {lang === 'tr' ? 'Başarımlar' : 'Achievements'}
              <span className="text-xs text-primary/70">({getUnlockedIds().length})</span>
            </button>

            {/* Leaderboard button — DISABLED for now
            <button
              onClick={() => { playClickSound(); hapticLight(); setShowLeaderboard(true); }}
              className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <EmojiImg emoji="🏆" size={16} />
              {lang === 'tr' ? 'Skor Tablosu' : 'Leaderboard'}
            </button>
            */}
          </div>
        </div>

        <a
          href="https://apps.apple.com/app/i-must-stay"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg text-xs font-semibold tracking-wide text-primary/80 border-primary/20 hover:border-primary/40 hover:text-primary transition-all duration-300 shimmer-btn py-2 px-5 border-2 shrink-0 text-shadow-glow">
          <EmojiImg emoji="✨" size={14} /> {lang === 'tr' ? 'Full Sürüm — Reklamsız' : 'Full Version — Ad-Free'} <EmojiImg emoji="✨" size={14} />
        </a>
      </div>

      {/* Studio branding */}
      <div className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground pb-1 shrink-0">
        Aftermath Vibe Studios
      </div>

      {/* Dark mode easter egg warning */}
      {showDarkWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 animate-fade-in p-6" onClick={() => setShowDarkWarning(false)}>
          <div className="bg-card border-2 border-destructive rounded-2xl p-6 max-w-sm text-center shadow-2xl" onClick={e => e.stopPropagation()}>
            <EmojiImg emoji="⚠️" size={48} className="mx-auto mb-3" />
            <h3 className="text-xl font-black text-destructive mb-2">
              {lang === 'tr' ? 'KARA MOD AKTİF!' : 'DARK MODE ACTIVATED!'}
            </h3>
            <p className="text-foreground text-sm leading-relaxed mb-4">
              {lang === 'tr'
                ? '🕶️ Dikkat! Kara moda geçmek, dış güçlerin ülke üzerindeki emellerini artırır. Karanlık tarafta çay içmek güzeldir ama gölgeler her yerdedir... Yine de cesaretin varsa, buyur!'
                : '🕶️ Warning! Activating Dark Mode strengthens foreign powers\' ambitions over the nation. Drinking tea on the dark side is lovely, but shadows are everywhere... If you dare, proceed!'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDarkWarning(false)}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-muted text-foreground active:scale-95 transition-all"
              >
                {lang === 'tr' ? '😰 Vazgeç' : '😰 Cancel'}
              </button>
              <button
                onClick={confirmDarkMode}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-destructive text-destructive-foreground active:scale-95 transition-all"
              >
                {lang === 'tr' ? '😈 Kara Tarafa Geç' : '😈 Join the Dark Side'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAchievements && (
        <AchievementList onClose={() => setShowAchievements(false)} />
      )}

      {showLeaderboard && (
        <LeaderboardScreen onClose={() => setShowLeaderboard(false)} />
      )}
    </div>
  );
}
