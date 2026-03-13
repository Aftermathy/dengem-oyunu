import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  onYes: () => void;
  onNo: () => void;
}

export function TutorialAskScreen({ onYes, onNo }: Props) {
  const { lang } = useLanguage();
  return (
    <div className="fixed inset-0 z-[150] bg-black/80 flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-card border-2 border-border rounded-2xl p-6 max-w-xs w-full text-center shadow-2xl">
        <div className="text-4xl mb-3">👑</div>
        <h2 className="text-lg font-black text-foreground mb-2">
          {lang === 'tr' ? 'Nasıl Oynanır?' : 'How to Play?'}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
          {lang === 'tr'
            ? 'Hızlı bir eğitim ister misin? Sana iktidarını nasıl koruyacağını gösterelim.'
            : 'Want a quick tutorial? Let us show you how to hold on to power.'}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onNo}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-muted text-muted-foreground active:scale-95 transition-all"
          >
            {lang === 'tr' ? 'Hayır, Biliyorum' : 'No, I Know'}
          </button>
          <button
            onClick={onYes}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-primary text-primary-foreground active:scale-95 transition-all"
          >
            {lang === 'tr' ? 'Evet, Anlat' : 'Yes, Show Me'}
          </button>
        </div>
      </div>
    </div>
  );
}
