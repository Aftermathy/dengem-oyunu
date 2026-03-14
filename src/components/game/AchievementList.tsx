import { EmojiImg } from '@/components/EmojiImg';
import { ACHIEVEMENTS, getAchievementTitle, getAchievementDesc } from '@/types/achievements';
import { getUnlockedIds } from '@/lib/achievements';
import { useLanguage } from '@/contexts/LanguageContext';

interface AchievementListProps {
  onClose: () => void;
}

export function AchievementList({ onClose }: AchievementListProps) {
  const { lang } = useLanguage();
  const unlocked = getUnlockedIds();
  const unlockedCount = unlocked.length;
  const totalCount = ACHIEVEMENTS.length;

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top,0px)+12px)] pb-3 border-b border-border/30">
        <div>
          <h2 className="text-lg font-black text-foreground">
            <EmojiImg emoji="🏅" size={20} className="mr-1.5" />
            {lang === 'en' ? 'Achievements' : 'Başarımlar'}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {unlockedCount}/{totalCount} {lang === 'en' ? 'unlocked' : 'açıldı'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-foreground font-bold text-lg active:scale-90 transition-transform"
        >
          ✕
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-4 py-2">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Achievement list */}
      <div className="flex-1 overflow-y-auto px-4 pb-[env(safe-area-inset-bottom,16px)]">
        {/* Visible achievements */}
        <div className="mb-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            {lang === 'en' ? 'Standard' : 'Standart'}
          </h3>
          <div className="space-y-2">
            {ACHIEVEMENTS.filter(a => !a.hidden).map(a => {
              const isUnlocked = unlocked.includes(a.id);
              return (
                <AchievementRow key={a.id} achievement={a} isUnlocked={isUnlocked} lang={lang} />
              );
            })}
          </div>
        </div>

        {/* Hidden achievements */}
        <div>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            {lang === 'en' ? 'Secret' : 'Gizli'}
          </h3>
          <div className="space-y-2">
            {ACHIEVEMENTS.filter(a => a.hidden).map(a => {
              const isUnlocked = unlocked.includes(a.id);
              return (
                <AchievementRow key={a.id} achievement={a} isUnlocked={isUnlocked} lang={lang} isSecret />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function AchievementRow({
  achievement,
  isUnlocked,
  lang,
  isSecret = false,
}: {
  achievement: (typeof ACHIEVEMENTS)[number];
  isUnlocked: boolean;
  lang: 'tr' | 'en';
  isSecret?: boolean;
}) {
  const showDetails = isUnlocked || !isSecret;

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
        isUnlocked
          ? 'bg-primary/10 border-primary/30'
          : 'bg-muted/30 border-border/20 opacity-60'
      }`}
    >
      <div className="text-2xl shrink-0">
        {showDetails ? (
          <EmojiImg emoji={achievement.emoji} size={28} />
        ) : (
          <span className="text-xl text-muted-foreground">❓</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className={`text-sm font-bold ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
          {showDetails ? getAchievementTitle(achievement, lang) : (lang === 'en' ? 'Unknown Achievement' : 'Bilinmeyen Başarım')}
        </div>
        <div className="text-[11px] text-muted-foreground">
          {showDetails ? getAchievementDesc(achievement, lang) : '???'}
        </div>
      </div>
      {isUnlocked && (
        <div className="text-xs font-bold text-primary shrink-0">✓</div>
      )}
    </div>
  );
}
