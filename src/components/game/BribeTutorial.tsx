import { useEffect } from 'react';
import { PowerType } from '@/types/game';
import { useLanguage } from '@/contexts/LanguageContext';
import { playWarningSound } from '@/hooks/useSound';
import { EmojiImg } from '@/components/EmojiImg';
import factionHalk from '@/assets/faction-halk.jpg';
import factionYatirimcilar from '@/assets/faction-yatirimcilar.jpg';
import factionMafya from '@/assets/faction-mafya.jpg';
import factionTarikat from '@/assets/faction-tarikat.jpg';
import factionOrdu from '@/assets/faction-ordu.jpg';

const factionImages: Record<PowerType, string> = {
  halk: factionHalk,
  yatirimcilar: factionYatirimcilar,
  mafya: factionMafya,
  tarikat: factionTarikat,
  ordu: factionOrdu,
};

interface BribeTutorialProps {
  faction: PowerType;
  onBribe: () => void;
  onSkip: () => void;
}

export function BribeTutorial({ faction, onBribe, onSkip }: BribeTutorialProps) {
  const { t } = useLanguage();

  useEffect(() => {
    playWarningSound();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-in fade-in duration-300">
      <div className="bg-card border border-border rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300 text-center">
        <div className="text-3xl mb-2">⚠️</div>
        <h2 className="text-xl font-bold text-destructive mb-3">{t('tutorial.title')}</h2>
        
        <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-2 border-destructive">
          <img src={factionImages[faction]} alt={t(`power.${faction}`)} className="w-full h-full object-cover faction-talking" />
        </div>
        
        <p className="text-sm font-semibold text-foreground mb-1">{t(`power.${faction}`)}</p>
        <p className="text-sm text-muted-foreground mb-4">{t(`tutorial.desc.${faction}`)}</p>
        
        <div className="flex flex-col gap-2">
          <button
            onClick={onBribe}
            className="w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors"
          >
            {t('tutorial.bribe')}
          </button>
          <button
            onClick={onSkip}
            className="w-full py-2 px-4 rounded-lg bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors"
          >
            {t('tutorial.skip')}
          </button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-3 italic">{t('tutorial.hint')}</p>
      </div>
    </div>
  );
}
