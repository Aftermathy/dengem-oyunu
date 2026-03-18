import { useState, useEffect, useRef } from 'react';
import { EmojiImg } from '@/components/EmojiImg';
import { getAchievementById } from '@/lib/achievements';
import { getAchievementTitle, getAchievementDesc } from '@/types/achievements';
import { useLanguage } from '@/contexts/LanguageContext';

interface AchievementPopupProps {
  achievementId: string;
  onDone: () => void;
}

export function AchievementPopup({ achievementId, onDone }: AchievementPopupProps) {
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(false);
  const achievement = getAchievementById(achievementId);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDoneRef.current(), 300);
    }, 2000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mount-only — timer runs independently of renders

  if (!achievement) return null;

  return (
    <div
      className={`fixed top-[env(safe-area-inset-top,0px)] left-0 right-0 z-[150] flex justify-center pointer-events-none transition-all duration-300 ${
        visible ? 'translate-y-2 opacity-100 scale-100' : '-translate-y-8 opacity-0 scale-95'
      }`}
    >
      <div className="bg-card/95 backdrop-blur-md border-2 border-yellow-500/60 shadow-[0_0_16px_rgba(234,179,8,0.35)] rounded-2xl px-5 py-3 flex items-center gap-3 max-w-[90vw] pointer-events-auto">
        <div className="text-3xl shrink-0">
          <EmojiImg emoji={achievement.emoji} size={32} />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-bold text-primary uppercase tracking-wider">
            {lang === 'en' ? '🏅 Achievement Unlocked!' : '🏅 Başarım Açıldı!'}
          </div>
          <div className="text-sm font-black text-foreground truncate">
            {getAchievementTitle(achievement, lang)}
          </div>
          <div className="text-[11px] text-muted-foreground truncate">
            {getAchievementDesc(achievement, lang)}
          </div>
          <div className="text-[11px] font-black text-yellow-500 mt-0.5">
            +{achievement.apReward} AP
          </div>
        </div>
      </div>
    </div>
  );
}
