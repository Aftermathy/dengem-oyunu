import { Shield } from 'lucide-react';
import { GameIcon } from '@/components/GameIcon';
import { SKILL_ICONS } from './skillTreeConstants';
import type { SkillDef } from '@/types/metaGame';

interface SkillBubbleProps {
  skill: SkillDef;
  level: number;
  categoryColor: string;
  categoryGlow: string;
  justPurchased: boolean;
  onClick: () => void;
  warningMessage: string | null;
}

export function SkillBubble({
  skill, level, categoryColor, categoryGlow, justPurchased, onClick, warningMessage,
}: SkillBubbleProps) {
  const Icon = SKILL_ICONS[skill.id] || Shield;
  const maxed = level >= skill.maxLevel;
  const isActive = level > 0;
  const bubbleSize = 62;
  const ringRadius = 27;
  const ringStroke = 3;
  const circumference = 2 * Math.PI * ringRadius;

  const segments = Array.from({ length: skill.maxLevel }).map((_, i) => {
    const segmentLength = circumference / skill.maxLevel;
    const gap = 4;
    const dashLength = segmentLength - gap;
    const offset = -((circumference / skill.maxLevel) * i) + circumference * 0.25;
    const filled = i < level;
    return { dashLength, gap, offset, filled };
  });

  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={`relative flex items-center justify-center transition-all duration-500 active:scale-90 ${
          justPurchased ? 'scale-110' : ''
        }`}
        style={{ width: bubbleSize, height: bubbleSize }}
      >
        {isActive && (
          <div className="absolute inset-0 rounded-full animate-pulse"
            style={{
              background: `radial-gradient(circle, ${categoryGlow}, transparent 70%)`,
              transform: 'scale(1.4)',
            }}
          />
        )}

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

        <Icon
          size={22}
          className="relative z-10 transition-all duration-300"
          style={{
            color: isActive ? categoryColor : 'hsl(0 0% 40%)',
            filter: isActive ? `drop-shadow(0 0 6px ${categoryGlow})` : 'none',
          }}
        />

        {maxed && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center z-20"
            style={{
              background: 'linear-gradient(135deg, hsl(145 70% 45%), hsl(160 70% 40%))',
              boxShadow: '0 0 8px hsl(145 70% 45% / 0.5)',
            }}
          >
            <GameIcon name="chevron_up" size={10} style={{ color: 'white' }} />
          </div>
        )}

        {!isActive && (
          <div className="absolute inset-1 rounded-full flex items-center justify-center z-10"
            style={{ background: 'hsl(0 0% 0% / 0.3)' }}
          >
            <GameIcon name="lock" size={10} style={{ color: 'hsl(0 0% 35%)' }} className="absolute bottom-1 right-1" />
          </div>
        )}
      </button>

      {warningMessage && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 animate-fade-in whitespace-nowrap px-3 py-1.5 rounded-lg text-[10px] font-bold"
          style={{
            background: 'hsl(0 70% 45%)',
            color: 'white',
            boxShadow: '0 4px 16px hsl(0 0% 0% / 0.5)',
            animation: 'fade-in 0.2s ease-out',
          }}
        >
          {warningMessage}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: '5px solid hsl(0 70% 45%)',
            }}
          />
        </div>
      )}
    </div>
  );
}
