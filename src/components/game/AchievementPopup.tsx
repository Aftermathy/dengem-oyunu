import { useState, useEffect } from 'react';
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

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 400);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  if (!achievement) return null;

  return (
    <div
      className={`fixed top-[env(safe-area-inset-top,0px)] left-0 right-0 z-[150] flex justify-center pointer-events-none transition-all duration-500 ${
        visible ? 'translate-y-2 opacity-100' : '-translate-y-16 opacity-0'
      }`}
    >
      <div className="bg-card/95 backdrop-blur-md border border-primary/30 rounded-2xl shadow-lg px-5 py-3 flex items-center gap-3 max-w-[90vw] pointer-events-auto">
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
        </div>
      </div>
    </div>
  );
}
