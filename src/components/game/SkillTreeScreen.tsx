import { useState } from 'react';
import { useMetaGame } from '@/contexts/MetaGameContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { SKILL_DEFS, getSkillTitle, getSkillDesc, type SkillCategory, type SkillDef } from '@/types/metaGame';
import { EmojiImg } from '@/components/EmojiImg';
import { playClickSound } from '@/hooks/useSound';
import { hapticMedium } from '@/hooks/useHaptics';

interface SkillTreeScreenProps {
  onClose: () => void;
}

const CATEGORIES: { key: SkillCategory; emoji: string; labelTR: string; labelEN: string }[] = [
  { key: 'defense', emoji: '🛡️', labelTR: 'Zümre Kalkanları', labelEN: 'Faction Shields' },
  { key: 'media', emoji: '📺', labelTR: 'Medya Kontrolü', labelEN: 'Media Control' },
  { key: 'economy', emoji: '💰', labelTR: 'Ekonomi', labelEN: 'Economy' },
  { key: 'strategy', emoji: '🎯', labelTR: 'Strateji', labelEN: 'Strategy' },
];

export function SkillTreeScreen({ onClose }: SkillTreeScreenProps) {
  const { lang } = useLanguage();
  const { authorityPoints, purchaseSkill, getSkillLevel } = useMetaGame();
  const [purchasedId, setPurchasedId] = useState<string | null>(null);

  const handlePurchase = (skillId: string) => {
    playClickSound();
    hapticMedium();
    const ok = purchaseSkill(skillId);
    if (ok) {
      setPurchasedId(skillId);
      setTimeout(() => setPurchasedId(null), 700);
    }
  };

  const totalSpent = SKILL_DEFS.reduce((sum, s) => {
    const lvl = getSkillLevel(s.id);
    for (let i = 0; i < lvl; i++) sum += s.costs[i];
    return sum;
  }, 0);

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top,0px)+12px)] pb-3 border-b border-border/30">
        <div>
          <h2 className="text-lg font-black text-foreground flex items-center gap-1.5">
            <EmojiImg emoji="⚡" size={20} />
            {lang === 'en' ? 'Skill Tree' : 'Yetenek Ağacı'}
          </h2>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {lang === 'en' ? `${totalSpent} AP invested` : `${totalSpent} AP yatırıldı`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-game-gold/20 border border-game-gold/40 rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
            <EmojiImg emoji="⭐" size={16} />
            <span className="font-black text-game-gold text-sm">{authorityPoints}</span>
            <span className="text-[10px] text-game-gold/60 font-bold">AP</span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-foreground font-bold text-lg active:scale-90 transition-transform"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Skill categories */}
      <div className="flex-1 overflow-y-auto px-4 py-3 pb-[env(safe-area-inset-bottom,16px)]">
        {CATEGORIES.map(cat => {
          const skills = SKILL_DEFS.filter(s => s.category === cat.key);
          return (
            <div key={cat.key} className="mb-6">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <EmojiImg emoji={cat.emoji} size={14} />
                {lang === 'en' ? cat.labelEN : cat.labelTR}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {skills.map(skill => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    level={getSkillLevel(skill.id)}
                    ap={authorityPoints}
                    justPurchased={purchasedId === skill.id}
                    lang={lang}
                    onPurchase={() => handlePurchase(skill.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SkillCard({
  skill, level, ap, justPurchased, lang, onPurchase,
}: {
  skill: SkillDef;
  level: number;
  ap: number;
  justPurchased: boolean;
  lang: 'tr' | 'en';
  onPurchase: () => void;
}) {
  const maxed = level >= skill.maxLevel;
  const cost = maxed ? 0 : skill.costs[level];
  const canAfford = !maxed && ap >= cost;

  return (
    <div
      className={`rounded-xl border p-3 transition-all duration-500 ${
        justPurchased
          ? 'scale-[1.06] border-game-gold shadow-lg shadow-game-gold/40 bg-game-gold/10'
          : maxed
          ? 'bg-game-success/10 border-game-success/30'
          : level > 0
          ? 'bg-primary/5 border-primary/20'
          : 'bg-muted/30 border-border/20'
      }`}
    >
      {/* Icon + Title */}
      <div className="flex items-start gap-2 mb-1.5">
        <span className={`text-xl shrink-0 transition-transform duration-500 ${justPurchased ? 'scale-125' : ''}`}>
          <EmojiImg emoji={skill.emoji} size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-bold text-foreground leading-tight">
            {getSkillTitle(skill, lang)}
          </div>
          <div className="text-[9px] text-muted-foreground leading-tight mt-0.5">
            {getSkillDesc(skill, lang)}
          </div>
        </div>
      </div>

      {/* Level dots */}
      <div className="flex items-center gap-1 my-2">
        {Array.from({ length: skill.maxLevel }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              i < level
                ? justPurchased && i === level - 1
                  ? 'bg-game-gold animate-pulse'
                  : 'bg-primary'
                : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Action */}
      {maxed ? (
        <div className="text-[10px] font-bold text-game-success text-center py-1">
          {lang === 'en' ? '✓ MAXED' : '✓ MAKSİMUM'}
        </div>
      ) : (
        <button
          onClick={onPurchase}
          disabled={!canAfford}
          className={`w-full py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 active:scale-95 ${
            canAfford
              ? 'bg-game-gold/20 text-game-gold border border-game-gold/40 hover:bg-game-gold/30'
              : 'bg-muted/50 text-muted-foreground border border-border/20 cursor-not-allowed'
          }`}
        >
          <EmojiImg emoji="⭐" size={11} className="mr-0.5" />
          {cost} AP
        </button>
      )}
    </div>
  );
}
