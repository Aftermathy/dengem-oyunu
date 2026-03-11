import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { playClickSound, playWarStartSound } from '@/hooks/useSound';
import { EmojiImg } from '@/components/EmojiImg';
import throneIcon from '@/assets/throne-icon.png';
import { hapticLight, hapticMedium } from '@/hooks/useHaptics';

// Multilingual "I MUST STAY" variants — bold word marked with *word*
const TITLE_VARIANTS = [
  { text: 'I *MUST* STAY', lang: 'en' },
  { text: '*ASLA* GİTMEM', lang: 'tr' },
  { text: 'ICH *MUSS* BLEIBEN', lang: 'de' },
  { text: 'JE *DOIS* RESTER', lang: 'fr' },
  { text: '*DEBO* QUEDARME', lang: 'es' },
  { text: 'أنا *لازم* أبقى', lang: 'ar' },
  { text: 'אני *חייב* להישאר', lang: 'he' },
  { text: 'Я *ДОЛЖЕН* ОСТАТЬСЯ', lang: 'ru' },
  { text: '私は*絶対*残る', lang: 'ja' },
  { text: '나는 *반드시* 남는다', lang: 'ko' },
];

// Shake directions cycle: right, left, right, left, up (angry nod)
const SHAKE_CLASSES = [
  'animate-shake-right',
  'animate-shake-left',
  'animate-shake-right',
  'animate-shake-left',
  'animate-shake-up',
];

// Throne click animations
const THRONE_ANIMATIONS = [
  'animate-throne-wobble',
  'animate-throne-spin',
  'animate-throne-bounce',
  'animate-throne-wobble',
  'animate-throne-spin',
];

interface StartScreenProps {
  highScore: number;
  onStart: () => void;
}

export function StartScreen({ highScore, onStart }: StartScreenProps) {
  const { lang, setLang, t } = useLanguage();
  const [titleIndex, setTitleIndex] = useState(0);
  const [shakeClass, setShakeClass] = useState('');
  const [throneClicks, setThroneClicks] = useState(0);
  const [throneAnim, setThroneAnim] = useState('');

  const currentTitle = TITLE_VARIANTS[titleIndex];

  const handleTitleClick = useCallback(() => {
    playClickSound();
    hapticMedium();
    const nextIndex = (titleIndex + 1) % TITLE_VARIANTS.length;
    setTitleIndex(nextIndex);
    // Cycle shake direction
    const shakeIdx = nextIndex % SHAKE_CLASSES.length;
    setShakeClass(SHAKE_CLASSES[shakeIdx]);
    // Remove class after animation ends to allow re-trigger
    setTimeout(() => setShakeClass(''), 400);
  }, [titleIndex]);

  const handleThroneClick = useCallback(() => {
    hapticLight();
    playClickSound();
    const next = throneClicks + 1;
    setThroneClicks(next);
    const animIdx = (next - 1) % THRONE_ANIMATIONS.length;
    setThroneAnim(THRONE_ANIMATIONS[animIdx]);
    setTimeout(() => setThroneAnim(''), 600);
  }, [throneClicks]);

  // Render title with bold word
  const renderTitle = () => {
    const parts = currentTitle.text.split(/\*([^*]+)\*/);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        // Bold word
        return (
          <span key={i} className="text-red-800 underline decoration-2 underline-offset-4 font-black">
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 text-center animate-fade-in min-h-[100dvh]">
      {/* Language toggle — top */}
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

      {/* Spacer */}
      <div className="flex-1" />

      {/* Crown + Title */}
      <img
        src={throneIcon}
        alt="Throne"
        className={`w-56 h-56 sm:w-64 sm:h-64 object-contain drop-shadow-lg cursor-pointer select-none ${throneAnim}`}
        onClick={handleThroneClick}
      />

      <h1
        className={`text-5xl sm:text-6xl font-black tracking-tight text-foreground cursor-pointer select-none ${shakeClass}`}
        onClick={handleTitleClick}
      >
        {renderTitle()}
      </h1>
      <p className="text-muted-foreground text-sm sm:text-base max-w-xs leading-relaxed">
        {t('start.subtitle')}
      </p>

      {highScore > 0 &&
      <div className="bg-muted/50 border border-border rounded-xl px-4 py-2">
          <span className="text-xs text-muted-foreground">{t('start.highscore')} </span>
          <span className="font-bold text-primary text-lg">{highScore} {t('start.turns')}</span>
        </div>
      }

      <Button
        size="lg"
        onClick={() => {playWarStartSound();onStart();}}
        className="text-lg px-10 py-6 font-bold shadow-lg hover:shadow-xl transition-shadow">
        {t('start.play')}
      </Button>

      <a
        href="https://apps.apple.com/app/i-must-stay"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 rounded-lg text-xs font-semibold tracking-wide text-primary/80 border-primary/20 hover:border-primary/40 hover:text-primary transition-all duration-300 shimmer-btn py-[11px] px-[22px] border-2"
        style={{ textShadow: '0 0 8px hsl(15 80% 50% / 0.3)' }}>
        <EmojiImg emoji="✨" size={14} /> {lang === 'tr' ? 'Full Sürüm — Reklamsız' : 'Full Version — Ad-Free'} <EmojiImg emoji="✨" size={14} />
      </a>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Studio branding */}
      <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground pb-6">
        Aftermath Vibe Studios
      </div>
    </div>);
}
