import { useState, useCallback, useMemo } from 'react';
import { useMetaGame } from '@/contexts/MetaGameContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { SKILL_DEFS, getSkillTitle, getSkillDesc, type SkillDef } from '@/types/metaGame';
import { EmojiImg } from '@/components/EmojiImg';
import { playClickSound } from '@/hooks/useSound';
import { hapticMedium } from '@/hooks/useHaptics';
import {
  Megaphone, Swords, Eye, TrendingUp, Skull,
  Vote, Glasses, Sparkles, Landmark, Clover,
  AlertTriangle, Shield, Tv, Coins, Target, X,
  Star, ChevronUp, Lock
} from 'lucide-react';

interface SkillTreeScreenProps {
  onClose: () => void;
}

// Icon mapping for each skill
const SKILL_ICONS: Record<string, React.FC<{ size?: number; className?: string }>> = {
  shield_halk: Megaphone,
  shield_ordu: Swords,
  shield_tarikat: Eye,
  shield_yatirimcilar: TrendingUp,
  shield_mafya: Skull,
  media_halk: Megaphone,
  media_ordu: Swords,
  media_tarikat: Eye,
  media_yatirimcilar: TrendingUp,
  media_mafya: Skull,
  election_master: Vote,
  dark_connections: Glasses,
  pro_launderer: Sparkles,
  offshore: Landmark,
  lucky_cards: Clover,
  crisis_management: AlertTriangle,
};

// Category hub icons and colors
const CATEGORY_CONFIG: Record<string, {
  icon: React.FC<{ size?: number; className?: string }>;
  labelTR: string;
  labelEN: string;
  hue: string; // HSL hue for the glow color
  color: string;
  glowColor: string;
}> = {
  defense: { icon: Shield, labelTR: 'Zümre Kalkanları', labelEN: 'Faction Shields', hue: '200', color: 'hsl(200 80% 55%)', glowColor: 'hsl(200 80% 55% / 0.4)' },
  media: { icon: Tv, labelTR: 'Medya Kontrolü', labelEN: 'Media Control', hue: '280', color: 'hsl(280 70% 60%)', glowColor: 'hsl(280 70% 60% / 0.4)' },
  economy: { icon: Coins, labelTR: 'Ekonomi', labelEN: 'Economy', hue: '45', color: 'hsl(45 90% 55%)', glowColor: 'hsl(45 90% 55% / 0.4)' },
  strategy: { icon: Target, labelTR: 'Strateji', labelEN: 'Strategy', hue: '0', color: 'hsl(0 75% 55%)', glowColor: 'hsl(0 75% 55% / 0.4)' },
};

// Skill effect descriptions per level
function getEffectText(skill: SkillDef, level: number, lang: 'tr' | 'en'): string {
  if (level === 0) return lang === 'en' ? 'Not unlocked' : 'Açılmadı';
  const id = skill.id;
  if (id.startsWith('shield_')) return lang === 'en' ? `Reduces damage by -${level}` : `Hasarı -${level} azaltır`;
  if (id.startsWith('media_')) return lang === 'en' ? `Boosts gains by +${level}` : `Kazancı +${level} artırır`;
  if (id === 'election_master') { const pcts = [3,5,8,10,15]; return lang === 'en' ? `Reduces election costs by ${pcts[level-1]}%` : `Seçim maliyetini %${pcts[level-1]} düşürür`; }
  if (id === 'dark_connections') { const pcts = [3,5,8,10,15]; return lang === 'en' ? `Reduces shop costs by ${pcts[level-1]}%` : `Dükkan maliyetini %${pcts[level-1]} düşürür`; }
  if (id === 'pro_launderer') { const vals = [25,30]; return lang === 'en' ? `Launders ${vals[level-1]}B per 30B` : `30B'ye ${vals[level-1]}B aklar`; }
  if (id === 'offshore') { const pcts = [1,2,3]; return lang === 'en' ? `${pcts[level-1]}% interest per turn` : `Tur başı %${pcts[level-1]} faiz`; }
  if (id === 'lucky_cards') { const pcts = [5,10,15]; return lang === 'en' ? `+${pcts[level-1]}% rare card chance` : `+%${pcts[level-1]} nadir kart şansı`; }
  if (id === 'crisis_management') return lang === 'en' ? 'Survive death once per game' : 'Oyun başına 1 kez ölümden kurtul';
  return '';
}

function getNextEffectText(skill: SkillDef, level: number, lang: 'tr' | 'en'): string {
  if (level >= skill.maxLevel) return lang === 'en' ? 'Maximum level reached' : 'Maksimum seviyeye ulaşıldı';
  const nextLevel = level + 1;
  const id = skill.id;
  if (id.startsWith('shield_')) return lang === 'en' ? `Will reduce damage by -${nextLevel}` : `Hasarı -${nextLevel} azaltacak`;
  if (id.startsWith('media_')) return lang === 'en' ? `Will boost gains by +${nextLevel}` : `Kazancı +${nextLevel} artıracak`;
  if (id === 'election_master') { const pcts = [3,5,8,10,15]; return lang === 'en' ? `Will reduce costs by ${pcts[nextLevel-1]}%` : `Maliyeti %${pcts[nextLevel-1]} düşürecek`; }
  if (id === 'dark_connections') { const pcts = [3,5,8,10,15]; return lang === 'en' ? `Will reduce costs by ${pcts[nextLevel-1]}%` : `Maliyeti %${pcts[nextLevel-1]} düşürecek`; }
  if (id === 'pro_launderer') { const vals = [25,30]; return lang === 'en' ? `Will launder ${vals[nextLevel-1]}B per 30B` : `30B'ye ${vals[nextLevel-1]}B aklayacak`; }
  if (id === 'offshore') { const pcts = [1,2,3]; return lang === 'en' ? `${pcts[nextLevel-1]}% interest per turn` : `Tur başı %${pcts[nextLevel-1]} faiz`; }
  if (id === 'lucky_cards') { const pcts = [5,10,15]; return lang === 'en' ? `+${pcts[nextLevel-1]}% rare card chance` : `+%${pcts[nextLevel-1]} nadir kart şansı`; }
  if (id === 'crisis_management') return lang === 'en' ? 'Survive death once per game' : 'Oyun başına 1 kez ölümden kurtul';
  return '';
}

export function SkillTreeScreen({ onClose }: SkillTreeScreenProps) {
  const { lang } = useLanguage();
  const { authorityPoints, purchaseSkill, getSkillLevel } = useMetaGame();
  const [selectedSkill, setSelectedSkill] = useState<SkillDef | null>(null);
  const [justPurchasedId, setJustPurchasedId] = useState<string | null>(null);

  const handleBubbleClick = useCallback((skill: SkillDef) => {
    playClickSound();
    hapticMedium();
    setSelectedSkill(skill);
  }, []);

  const handlePurchase = useCallback(() => {
    if (!selectedSkill) return;
    playClickSound();
    hapticMedium();
    const ok = purchaseSkill(selectedSkill.id);
    if (ok) {
      setJustPurchasedId(selectedSkill.id);
      setTimeout(() => setJustPurchasedId(null), 800);
    }
  }, [selectedSkill, purchaseSkill]);

  const categories = useMemo(() => {
    return ['defense', 'media', 'economy', 'strategy'].map(cat => ({
      key: cat,
      config: CATEGORY_CONFIG[cat],
      skills: SKILL_DEFS.filter(s => s.category === cat),
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col" style={{ background: 'radial-gradient(ellipse at 50% 20%, hsl(220 25% 18%), hsl(220 30% 8%))' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-[calc(env(safe-area-inset-top,0px)+14px)] pb-3">
        <h2 className="text-base font-black tracking-wide" style={{ color: 'hsl(0 0% 85%)' }}>
          {lang === 'en' ? 'SKILL TREE' : 'YETENEK AĞACI'}
        </h2>
        <div className="flex items-center gap-3">
          {/* AP Badge */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full"
            style={{
              background: 'linear-gradient(135deg, hsl(45 80% 50% / 0.2), hsl(35 90% 40% / 0.15))',
              border: '1px solid hsl(45 80% 50% / 0.5)',
              boxShadow: '0 0 20px hsl(45 90% 50% / 0.2), inset 0 1px 0 hsl(45 80% 80% / 0.2)',
            }}
          >
            <Star size={15} className="text-game-gold" fill="hsl(45 93% 58%)" />
            <span className="font-black text-sm text-game-gold">{authorityPoints}</span>
            <span className="text-[10px] font-bold" style={{ color: 'hsl(45 60% 50% / 0.7)' }}>AP</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-transform"
            style={{ background: 'hsl(0 0% 100% / 0.1)', border: '1px solid hsl(0 0% 100% / 0.15)' }}
          >
            <X size={16} style={{ color: 'hsl(0 0% 70%)' }} />
          </button>
        </div>
      </div>

      {/* Tree Canvas */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-[calc(env(safe-area-inset-bottom,16px)+16px)]">
        {categories.map(({ key, config, skills }) => (
          <CategoryCluster
            key={key}
            categoryKey={key}
            config={config}
            skills={skills}
            lang={lang}
            getSkillLevel={getSkillLevel}
            justPurchasedId={justPurchasedId}
            onBubbleClick={handleBubbleClick}
          />
        ))}
      </div>

      {/* Detail Panel */}
      {selectedSkill && (
        <SkillDetailPanel
          skill={selectedSkill}
          level={getSkillLevel(selectedSkill.id)}
          ap={authorityPoints}
          lang={lang}
          justPurchased={justPurchasedId === selectedSkill.id}
          onPurchase={handlePurchase}
          onClose={() => setSelectedSkill(null)}
        />
      )}
    </div>
  );
}

// ── Category Cluster with hub + child bubbles + SVG lines ──
function CategoryCluster({
  categoryKey, config, skills, lang, getSkillLevel, justPurchasedId, onBubbleClick,
}: {
  categoryKey: string;
  config: typeof CATEGORY_CONFIG[string];
  skills: SkillDef[];
  lang: 'tr' | 'en';
  getSkillLevel: (id: string) => number;
  justPurchasedId: string | null;
  onBubbleClick: (s: SkillDef) => void;
}) {
  const HubIcon = config.icon;

  return (
    <div className="mb-8 relative">
      {/* Category label */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="h-px flex-1 max-w-[60px]" style={{ background: `linear-gradient(to right, transparent, ${config.color})` }} />
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full"
          style={{ background: `${config.glowColor}`, border: `1px solid ${config.color}` }}
        >
          <HubIcon size={13} style={{ color: config.color }} />
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: config.color }}>
            {lang === 'en' ? config.labelEN : config.labelTR}
          </span>
        </div>
        <div className="h-px flex-1 max-w-[60px]" style={{ background: `linear-gradient(to left, transparent, ${config.color})` }} />
      </div>

      {/* Bubbles in organic layout */}
      <div className="relative">
        {/* SVG connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          {skills.map((skill, i) => {
            const total = skills.length;
            const hubX = 50;
            const hubY = 0;
            // Distribute children in a curve
            const childX = total <= 2
              ? (i === 0 ? 35 : 65)
              : total <= 4
              ? 15 + (i * 70 / (total - 1))
              : 8 + (i * 84 / (total - 1));
            const childY = 50;
            return (
              <line
                key={skill.id}
                x1={`${hubX}%`} y1={`${hubY + 20}%`}
                x2={`${childX}%`} y2={`${childY}%`}
                stroke={config.color}
                strokeOpacity={getSkillLevel(skill.id) > 0 ? 0.5 : 0.15}
                strokeWidth="1.5"
                strokeDasharray={getSkillLevel(skill.id) > 0 ? 'none' : '4 4'}
              />
            );
          })}
        </svg>

        {/* Child bubbles */}
        <div className="flex justify-center gap-2 flex-wrap pt-2 relative" style={{ zIndex: 1 }}>
          {skills.map(skill => (
            <SkillBubble
              key={skill.id}
              skill={skill}
              level={getSkillLevel(skill.id)}
              categoryColor={config.color}
              categoryGlow={config.glowColor}
              justPurchased={justPurchasedId === skill.id}
              onClick={() => onBubbleClick(skill)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 3D Bubble with segmented ring ──
function SkillBubble({
  skill, level, categoryColor, categoryGlow, justPurchased, onClick,
}: {
  skill: SkillDef;
  level: number;
  categoryColor: string;
  categoryGlow: string;
  justPurchased: boolean;
  onClick: () => void;
}) {
  const Icon = SKILL_ICONS[skill.id] || Shield;
  const maxed = level >= skill.maxLevel;
  const isActive = level > 0;
  const bubbleSize = 62;
  const ringRadius = 27;
  const ringStroke = 3;
  const circumference = 2 * Math.PI * ringRadius;

  // Segmented ring: calculate filled segments
  const segments = Array.from({ length: skill.maxLevel }).map((_, i) => {
    const segmentLength = circumference / skill.maxLevel;
    const gap = 4;
    const dashLength = segmentLength - gap;
    const offset = -((circumference / skill.maxLevel) * i) + circumference * 0.25;
    const filled = i < level;
    return { dashLength, gap, offset, filled };
  });

  return (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center transition-all duration-500 active:scale-90 ${
        justPurchased ? 'scale-110' : ''
      }`}
      style={{
        width: bubbleSize,
        height: bubbleSize,
      }}
    >
      {/* Outer glow */}
      {isActive && (
        <div className="absolute inset-0 rounded-full animate-pulse"
          style={{
            background: `radial-gradient(circle, ${categoryGlow}, transparent 70%)`,
            transform: 'scale(1.4)',
          }}
        />
      )}

      {/* 3D Sphere */}
      <div
        className="absolute inset-1 rounded-full"
        style={{
          background: isActive
            ? `radial-gradient(circle at 35% 30%, hsl(0 0% 100% / 0.15), ${categoryColor.replace(')', ' / 0.25)')} 40%, hsl(220 30% 12%) 100%)`
            : 'radial-gradient(circle at 35% 30%, hsl(0 0% 100% / 0.08), hsl(220 20% 20%) 60%, hsl(220 30% 10%) 100%)',
          boxShadow: isActive
            ? `0 4px 20px ${categoryGlow}, inset 0 -4px 8px hsl(0 0% 0% / 0.4), inset 0 2px 4px hsl(0 0% 100% / 0.1)`
            : 'inset 0 -4px 8px hsl(0 0% 0% / 0.4), inset 0 2px 4px hsl(0 0% 100% / 0.05)',
          border: `1px solid ${isActive ? categoryColor.replace(')', ' / 0.4)') : 'hsl(0 0% 100% / 0.08)'}`,
        }}
      />

      {/* Segmented ring SVG */}
      <svg className="absolute inset-0" width={bubbleSize} height={bubbleSize} viewBox={`0 0 ${bubbleSize} ${bubbleSize}`}>
        {segments.map((seg, i) => (
          <circle
            key={i}
            cx={bubbleSize / 2}
            cy={bubbleSize / 2}
            r={ringRadius}
            fill="none"
            stroke={seg.filled ? categoryColor : 'hsl(0 0% 100% / 0.1)'}
            strokeWidth={ringStroke}
            strokeDasharray={`${seg.dashLength} ${circumference - seg.dashLength}`}
            strokeDashoffset={seg.offset}
            strokeLinecap="round"
            style={{
              filter: seg.filled ? `drop-shadow(0 0 3px ${categoryGlow})` : 'none',
              transition: 'stroke 0.5s, filter 0.5s',
            }}
          />
        ))}
      </svg>

      {/* Icon */}
      <Icon
        size={22}
        className="relative z-10 transition-all duration-300"
        style={{
          color: isActive ? categoryColor : 'hsl(0 0% 40%)',
          filter: isActive ? `drop-shadow(0 0 6px ${categoryGlow})` : 'none',
        }}
      />

      {/* Maxed indicator */}
      {maxed && (
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center z-20"
          style={{
            background: 'linear-gradient(135deg, hsl(145 70% 45%), hsl(160 70% 40%))',
            boxShadow: '0 0 8px hsl(145 70% 45% / 0.5)',
          }}
        >
          <ChevronUp size={10} style={{ color: 'white' }} />
        </div>
      )}

      {/* Locked overlay */}
      {!isActive && (
        <div className="absolute inset-1 rounded-full flex items-center justify-center z-10"
          style={{ background: 'hsl(0 0% 0% / 0.3)' }}
        >
          <Lock size={10} style={{ color: 'hsl(0 0% 35%)' }} className="absolute bottom-1 right-1" />
        </div>
      )}
    </button>
  );
}

// ── Detail Panel (Slide-up modal) ──
function SkillDetailPanel({
  skill, level, ap, lang, justPurchased, onPurchase, onClose,
}: {
  skill: SkillDef;
  level: number;
  ap: number;
  lang: 'tr' | 'en';
  justPurchased: boolean;
  onPurchase: () => void;
  onClose: () => void;
}) {
  const Icon = SKILL_ICONS[skill.id] || Shield;
  const maxed = level >= skill.maxLevel;
  const cost = maxed ? 0 : skill.costs[level];
  const canAfford = !maxed && ap >= cost;
  const catConfig = CATEGORY_CONFIG[skill.category];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[110]"
        style={{ background: 'hsl(0 0% 0% / 0.6)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[120] rounded-t-3xl px-6 pt-6 pb-[calc(env(safe-area-inset-bottom,16px)+20px)] animate-fade-in"
        style={{
          background: 'linear-gradient(180deg, hsl(220 25% 16%), hsl(220 30% 10%))',
          border: '1px solid hsl(0 0% 100% / 0.1)',
          borderBottom: 'none',
          boxShadow: `0 -10px 40px hsl(0 0% 0% / 0.5), 0 0 60px ${catConfig.glowColor}`,
        }}
      >
        {/* Drag indicator */}
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'hsl(0 0% 100% / 0.2)' }} />

        {/* Icon + Title */}
        <div className="flex items-center gap-4 mb-5">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-500 ${justPurchased ? 'scale-110' : ''}`}
            style={{
              background: `linear-gradient(135deg, ${catConfig.color.replace(')', ' / 0.3)')}, hsl(220 25% 15%))`,
              border: `1px solid ${catConfig.color.replace(')', ' / 0.4)')}`,
              boxShadow: `0 4px 20px ${catConfig.glowColor}`,
            }}
          >
            <Icon size={26} style={{ color: catConfig.color }} />
          </div>
          <div>
            <h3 className="text-base font-black" style={{ color: 'hsl(0 0% 90%)' }}>
              {getSkillTitle(skill, lang)}
            </h3>
            <p className="text-xs font-medium mt-0.5" style={{ color: catConfig.color }}>
              {lang === 'en' ? `Level ${level}/${skill.maxLevel}` : `Seviye ${level}/${skill.maxLevel}`}
            </p>
          </div>
        </div>

        {/* Current Effect */}
        <div className="rounded-xl p-3.5 mb-3" style={{ background: 'hsl(0 0% 100% / 0.05)', border: '1px solid hsl(0 0% 100% / 0.08)' }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'hsl(0 0% 50%)' }}>
            {lang === 'en' ? 'Current Effect' : 'Mevcut Etki'}
          </p>
          <p className="text-sm font-semibold" style={{ color: level > 0 ? 'hsl(0 0% 85%)' : 'hsl(0 0% 40%)' }}>
            {getEffectText(skill, level, lang)}
          </p>
        </div>

        {/* Next Level */}
        {!maxed && (
          <div className="rounded-xl p-3.5 mb-5" style={{ background: `${catConfig.color.replace(')', ' / 0.08)')}`, border: `1px solid ${catConfig.color.replace(')', ' / 0.2)')}` }}>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: catConfig.color }}>
              {lang === 'en' ? 'After Upgrade' : 'Yükseltme Sonucu'}
            </p>
            <p className="text-sm font-semibold" style={{ color: 'hsl(0 0% 85%)' }}>
              {getNextEffectText(skill, level, lang)}
            </p>
          </div>
        )}

        {/* Purchase Button */}
        {maxed ? (
          <div className="text-center py-3 rounded-xl font-bold text-sm"
            style={{ background: 'hsl(145 70% 42% / 0.15)', color: 'hsl(145 70% 55%)', border: '1px solid hsl(145 70% 42% / 0.3)' }}
          >
            {lang === 'en' ? '✓ MAXIMUM LEVEL' : '✓ MAKSİMUM SEVİYE'}
          </div>
        ) : (
          <button
            onClick={onPurchase}
            disabled={!canAfford}
            className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.97] ${
              !canAfford ? 'cursor-not-allowed' : ''
            }`}
            style={canAfford ? {
              background: `linear-gradient(135deg, ${catConfig.color}, ${catConfig.color.replace(')', ' / 0.7)')})`,
              color: 'white',
              boxShadow: `0 4px 20px ${catConfig.glowColor}, 0 0 40px ${catConfig.glowColor}`,
            } : {
              background: 'hsl(0 0% 100% / 0.05)',
              color: 'hsl(0 0% 35%)',
              border: '1px solid hsl(0 0% 100% / 0.08)',
            }}
          >
            <Star size={14} fill={canAfford ? 'white' : 'hsl(0 0% 35%)'} />
            {lang === 'en' ? `Upgrade for ${cost} AP` : `${cost} AP ile Yükselt`}
          </button>
        )}
      </div>
    </>
  );
}
