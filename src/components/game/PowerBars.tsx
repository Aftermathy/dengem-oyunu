import { PowerState, PowerType, POWER_INFO } from '@/types/game';
import { PowerEffect } from '@/types/game';
import { cn } from '@/lib/utils';

interface PowerBarsProps {
  power: PowerState;
  activeEffects?: PowerEffect[];
}

export function PowerBars({ power, activeEffects = [] }: PowerBarsProps) {
  const powers: PowerType[] = ['halk', 'yatirimcilar', 'mafya', 'tarikat', 'ordu'];

  const getBarColor = (value: number) => {
    if (value <= 15) return 'bg-red-500';
    if (value <= 30) return 'bg-orange-400';
    if (value >= 85) return 'bg-red-500';
    if (value >= 70) return 'bg-orange-400';
    return 'bg-emerald-500';
  };

  const isAffected = (p: PowerType) => activeEffects.some(e => e.power === p);
  const getEffectDirection = (p: PowerType) => {
    const effect = activeEffects.find(e => e.power === p);
    if (!effect) return null;
    return effect.amount > 0 ? 'up' : 'down';
  };

  return (
    <div className="flex justify-between gap-1.5 sm:gap-3 px-2 sm:px-4 py-3 w-full max-w-md mx-auto">
      {powers.map((p) => {
        const info = POWER_INFO[p];
        const val = power[p];
        const affected = isAffected(p);
        const dir = getEffectDirection(p);

        return (
          <div key={p} className="flex flex-col items-center gap-1 flex-1 min-w-0">
            <span className={cn(
              "text-lg sm:text-xl transition-transform duration-300",
              affected && "scale-125"
            )}>
              {info.emoji}
            </span>
            <div className="w-full h-20 sm:h-24 bg-muted/50 rounded-full relative overflow-hidden border border-border/50">
              <div
                className={cn(
                  "absolute bottom-0 w-full rounded-full transition-all duration-500 ease-out",
                  getBarColor(val)
                )}
                style={{ height: `${val}%` }}
              />
              {affected && (
                <div className={cn(
                  "absolute inset-0 rounded-full animate-pulse",
                  dir === 'up' ? 'bg-emerald-400/30' : 'bg-red-400/30'
                )} />
              )}
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-muted-foreground truncate w-full text-center">
              {info.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
