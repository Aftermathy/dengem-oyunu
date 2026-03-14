import { useState } from 'react';
import { EmojiImg } from '@/components/EmojiImg';
import { ACHIEVEMENTS, Achievement, getAchievementTitle, getAchievementDesc } from '@/types/achievements';
import { getUnlockedIds } from '@/lib/achievements';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMetaGame } from '@/contexts/MetaGameContext';
import { playClickSound } from '@/hooks/useSound';
import { hapticMedium } from '@/hooks/useHaptics';

interface AchievementListProps {
  onClose: () => void;
}

export function AchievementList({ onClose }: AchievementListProps) {
  const { lang } = useLanguage();
  const { claimAchievement, isAchievementClaimed, authorityPoints } = useMetaGame();
  const unlocked = getUnlockedIds();
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const unlockedCount = unlocked.length;
  const totalCount = ACHIEVEMENTS.length;

  const claimableAP = ACHIEVEMENTS
    .filter(a => unlocked.includes(a.id) && !isAchievementClaimed(a.id))
    .reduce((sum, a) => sum + a.apReward, 0);

  const handleClaim = (a: Achievement) => {
    playClickSound();
    hapticMedium();
    setClaimingId(a.id);
    claimAchievement(a.id, a.apReward);
    setTimeout(() => setClaimingId(null), 700);
  };

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
        <div className="flex items-center gap-3">
          {claimableAP > 0 && (
            <div className="bg-game-gold/20 border border-game-gold/40 rounded-full px-2.5 py-1 flex items-center gap-1 animate-pulse">
              <EmojiImg emoji="⭐" size={14} />
              <span className="text-xs font-bold text-game-gold">+{claimableAP}</span>
            </div>
          )}
          <div className="bg-muted/50 rounded-full px-2.5 py-1 flex items-center gap-1">
            <EmojiImg emoji="⭐" size={12} />
            <span className="text-xs font-bold text-game-gold">{authorityPoints}</span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-foreground font-bold text-lg active:scale-90 transition-transform"
          >
            ✕
          </button>
        </div>
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
        {/* Standard */}
        <div className="mb-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            {lang === 'en' ? 'Standard' : 'Standart'}
          </h3>
          <div className="space-y-2">
            {ACHIEVEMENTS.filter(a => !a.hidden).map(a => (
              <AchievementRow
                key={a.id}
                achievement={a}
                isUnlocked={unlocked.includes(a.id)}
                isClaimed={isAchievementClaimed(a.id)}
                isClaiming={claimingId === a.id}
                lang={lang}
                onClaim={() => handleClaim(a)}
              />
            ))}
          </div>
        </div>

        {/* Secret */}
        <div>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            {lang === 'en' ? 'Secret' : 'Gizli'}
          </h3>
          <div className="space-y-2">
            {ACHIEVEMENTS.filter(a => a.hidden).map(a => (
              <AchievementRow
                key={a.id}
                achievement={a}
                isUnlocked={unlocked.includes(a.id)}
                isClaimed={isAchievementClaimed(a.id)}
                isClaiming={claimingId === a.id}
                lang={lang}
                isSecret
                onClaim={() => handleClaim(a)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AchievementRow({
  achievement,
  isUnlocked,
  isClaimed,
  isClaiming,
  lang,
  isSecret = false,
  onClaim,
}: {
  achievement: Achievement;
  isUnlocked: boolean;
  isClaimed: boolean;
  isClaiming: boolean;
  lang: 'tr' | 'en';
  isSecret?: boolean;
  onClaim: () => void;
}) {
  const showDetails = isUnlocked || !isSecret;
  const canClaim = isUnlocked && !isClaimed;

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-500 ${
        isClaiming
          ? 'scale-[1.03] border-game-gold shadow-lg shadow-game-gold/30 bg-game-gold/10'
          : isClaimed
          ? 'bg-game-success/10 border-game-success/30'
          : isUnlocked
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

      {canClaim ? (
        <button
          onClick={onClaim}
          className="shrink-0 bg-game-gold/20 border border-game-gold/40 text-game-gold text-[11px] font-bold px-2.5 py-1.5 rounded-lg active:scale-90 transition-all hover:bg-game-gold/30"
        >
          <EmojiImg emoji="⭐" size={11} className="mr-0.5" />
          +{achievement.apReward}
        </button>
      ) : isClaimed ? (
        <div className="text-xs font-bold text-game-success shrink-0 flex items-center gap-1">
          ✓ <span className="text-[10px] text-game-success/60">{achievement.apReward}</span>
        </div>
      ) : isUnlocked ? (
        <div className="text-xs font-bold text-primary shrink-0">✓</div>
      ) : null}
    </div>
  );
}
