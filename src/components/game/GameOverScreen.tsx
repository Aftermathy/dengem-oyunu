import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { playClickSound } from '@/hooks/useSound';
import { EmojiImg } from '@/components/EmojiImg';
import { useAuth } from '@/hooks/useAuth';
import { submitScore } from '@/lib/leaderboard';

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
  electionsWon: number;
  maxMoney: number;
  maxElectionPct: number;
  maxLaundered: number;
  deathReason: string;
  onRestart: () => void;
  onMainMenu: () => void;
}

export function GameOverScreen({ title, description, emoji, image, turn, highScore, money, electionsWon, maxMoney, maxElectionPct, maxLaundered, deathReason, onRestart, onMainMenu }: GameOverScreenProps) {
  const { lang, t } = useLanguage();
  const { user, signInWithGoogle } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const bgImage = image ? defeatImages[image] : null;

  const handleSubmitScore = async () => {
    setSubmitting(true);
    const ok = await submitScore({
      score: turn,
      elections_won: electionsWon,
      max_money: maxMoney,
      max_election_pct: maxElectionPct,
      max_laundered: maxLaundered,
      death_reason: deathReason,
    });
    if (ok) setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-end w-full overflow-hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="absolute inset-0 z-20 pointer-events-none gameover-blackfade" />

      {bgImage && (
        <div className="absolute inset-0 z-0">
          <img src={bgImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center gap-3 p-6 pb-4 text-center max-w-sm mx-auto">
        <div className="text-5xl"><EmojiImg emoji={emoji} size={56} /></div>
        <h2 className="text-2xl sm:text-3xl font-black text-red-400 drop-shadow-lg">{title}</h2>
        <p className="text-sm text-white/80 leading-relaxed drop-shadow-md">{description}</p>

        <div className="flex gap-6 mt-1">
          <div className="text-center">
            <div className="text-2xl font-black text-white">{turn}</div>
            <div className="text-xs text-white/60">{t('gameover.turn')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-amber-400">{highScore}</div>
            <div className="text-xs text-white/60">{t('gameover.best')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-white">{money}B</div>
            <div className="text-xs text-white/60"><EmojiImg emoji="💰" size={14} /></div>
          </div>
        </div>

        {/* Score submission */}
        <div className="w-full mt-1">
          {submitted ? (
            <div className="text-xs font-bold text-green-400 flex items-center justify-center gap-1">
              <EmojiImg emoji="✅" size={14} />
              {lang === 'tr' ? 'Skor kaydedildi!' : 'Score submitted!'}
            </div>
          ) : user ? (
            <Button
              size="sm"
              onClick={() => { playClickSound(); handleSubmitScore(); }}
              disabled={submitting}
              className="w-full text-xs font-bold bg-amber-500/80 hover:bg-amber-500 text-black border-0"
            >
              <EmojiImg emoji="🏆" size={14} className="mr-1" />
              {submitting
                ? (lang === 'tr' ? 'Gönderiliyor...' : 'Submitting...')
                : (lang === 'tr' ? 'Skoru Kaydet' : 'Submit Score')
              }
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => { playClickSound(); signInWithGoogle(); }}
              className="w-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              <EmojiImg emoji="🔑" size={14} className="mr-1" />
              {lang === 'tr' ? 'Giriş yap & Skoru Kaydet' : 'Sign in & Submit Score'}
            </Button>
          )}
        </div>

        <div className="flex gap-3 mt-2 w-full">
          <Button size="lg" onClick={() => { playClickSound(); onRestart(); }} className="flex-1 text-sm px-4 py-4 font-bold bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20">
            {t('gameover.restart')}
          </Button>
          <Button size="lg" onClick={() => { playClickSound(); onMainMenu(); }} variant="outline" className="flex-1 text-sm px-4 py-4 font-bold bg-black/30 backdrop-blur-sm border border-white/20 text-white/80 hover:bg-black/50">
            {t('gameover.menu')}
          </Button>
        </div>
      </div>
    </div>
  );
}
