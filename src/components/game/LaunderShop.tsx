import { EmojiImg } from '@/components/EmojiImg';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface LaunderShopProps {
  totalLaundered: number;
  lastShopResult: string | null;
  canLaunder: boolean;
  onLaunder: () => void;
}

export function LaunderShop({
  totalLaundered,
  lastShopResult,
  canLaunder,
  onLaunder,
}: LaunderShopProps) {
  const { lang } = useLanguage();

  return (
    <div className="w-full max-w-md mx-auto px-3 py-1.5">
      <div className="flex items-center gap-3">
        <button
          onClick={onLaunder}
          disabled={!canLaunder}
          className={cn(
            "text-sm font-bold px-4 py-2 rounded-xl transition-all whitespace-nowrap shrink-0",
            canLaunder
              ? "bg-emerald-600/80 text-white hover:bg-emerald-500 cursor-pointer active:scale-95"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          <EmojiImg emoji="🧼" size={14} className="mr-1" />
          {lang === 'tr' ? 'Akla' : 'Launder'} (-50B)
        </button>

        <div className="flex-1 h-6 bg-muted/50 rounded-full overflow-hidden border border-border/50 relative">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(totalLaundered, 100)}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-foreground">
            <EmojiImg emoji="💸" size={12} className="mr-0.5" />
            {totalLaundered}B {lang === 'tr' ? 'aklandı' : 'laundered'}
          </span>
        </div>
      </div>

      {lastShopResult && (
        <p className="text-center text-xs text-emerald-400 mt-1 animate-bounce">{lastShopResult}</p>
      )}
    </div>
  );
}
