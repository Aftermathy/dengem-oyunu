import type { SkillDef } from '@/types/metaGame';
import { CATEGORY_CONFIG } from './skillTreeConstants';
import { SkillBubble } from './SkillBubble';

interface CategoryClusterProps {
  categoryKey: string;
  config: typeof CATEGORY_CONFIG[string];
  skills: SkillDef[];
  lang: 'tr' | 'en';
  getSkillLevel: (id: string) => number;
  justPurchasedId: string | null;
  onBubbleClick: (s: SkillDef) => void;
  bubbleWarning: { skillId: string; message: string } | null;
}

export function CategoryCluster({
  config, skills, lang, getSkillLevel, justPurchasedId, onBubbleClick, categoryKey, bubbleWarning,
}: CategoryClusterProps) {
  const HubIcon = config.icon;
  const isOhal = categoryKey === 'ohal';

  return (
    <div className={`mb-8 relative ${isOhal ? 'mt-4 pt-4' : ''}`}
      style={isOhal ? { borderTop: '1px solid hsl(15 90% 50% / 0.2)' } : {}}
    >
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

      {isOhal && (
        <p className="text-center text-[10px] mb-3 px-4" style={{ color: 'hsl(15 60% 55%)' }}>
          {lang === 'en'
            ? '⚠️ Makes the game harder but multiplies your AP rewards!'
            : '⚠️ Oyunu zorlaştırır ama AP ödüllerini katlar!'}
        </p>
      )}

      <div className="relative">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          {skills.map((skill, i) => {
            const total = skills.length;
            const hubX = 50;
            const hubY = 0;
            const childX = total <= 1
              ? 50
              : total <= 2
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
              warningMessage={bubbleWarning?.skillId === skill.id ? bubbleWarning.message : null}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
