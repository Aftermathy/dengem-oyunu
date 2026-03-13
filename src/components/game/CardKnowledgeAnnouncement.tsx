import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  onDismiss: () => void;
  seenCount: number;
}

export function CardKnowledgeAnnouncement({ onDismiss, seenCount }: Props) {
  const { lang } = useLanguage();
  return (
    <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-card border-2 border-primary rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
        <div className="text-5xl mb-3">🧠</div>
        <h2 className="text-xl font-black text-foreground mb-2">
          {lang === 'tr' ? 'Tecrübe Kazandın, Lider!' : "You've Earned Experience, Leader!"}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-2">
          {lang === 'tr'
            ? 'Bir diktatör düşer, iki kere bakar. Artık kartları tanıyorsun — bir dahaki sefere para getirisi ve zümre etkilerini görebileceksin. Hâlâ kaybedersen... bu sefer bahane yok.'
            : "A dictator falls, but learns. You now know the cards — next time you'll see money effects and faction impacts. If you still lose... no excuses this time."}
        </p>
        <p className="text-xs font-bold text-primary mb-4">
          {lang === 'tr'
            ? `${seenCount} kartın etkilerini biliyorsun.`
            : `You know the effects of ${seenCount} cards.`}
        </p>
        <button
          onClick={onDismiss}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm active:scale-95 transition-all"
        >
          {lang === 'tr' ? '👑 Anladım, Geri Dön' : '👑 Got It, Back to Throne'}
        </button>
      </div>
    </div>
  );
}
