import { Button } from '@/components/ui/button';

interface StartScreenProps {
  highScore: number;
  onStart: () => void;
}

export function StartScreen({ highScore, onStart }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 text-center animate-fade-in">
      {/* Throne SVG illustration */}
      <div className="relative">
        <div className="text-8xl sm:text-9xl">🪑</div>
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl sm:text-5xl">👑</div>
      </div>

      <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-foreground">
        I MUST STAY  
      </h1>
      <p className="text-muted-foreground text-sm sm:text-base max-w-xs leading-relaxed">
        Gücü dengede tut, tahtını koru.<br />
        <span className="text-xs opacity-70">Bir karar seni zirveye taşır, bir karar uçuruma sürükler.</span>
      </p>

      {highScore > 0 &&
      <div className="bg-muted/50 border border-border rounded-xl px-4 py-2">
          <span className="text-xs text-muted-foreground">En Yüksek Skor: </span>
          <span className="font-bold text-primary text-lg">{highScore} tur</span>
        </div>
      }

      <Button
        size="lg"
        onClick={onStart}
        className="text-lg px-10 py-6 font-bold mt-2 shadow-lg hover:shadow-xl transition-shadow">

        ⚔️ Oyuna Başla
      </Button>

      <div className="flex gap-3 text-2xl mt-4">
        <span title="Halk">🏛️</span>
        <span title="Yatırımcılar">💰</span>
        <span title="Mafya">🔫</span>
        <span title="Tarikat">📿</span>
        <span title="Ordu">⚔️</span>
      </div>
    </div>);

}