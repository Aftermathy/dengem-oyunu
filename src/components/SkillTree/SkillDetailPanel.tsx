import { Lock, Shield } from 'lucide-react';
import { GameIcon } from '@/components/GameIcon';
import type { SkillLockReason } from '@/contexts/MetaGameContext';
import { getSkillTitle, type SkillDef, OHAL_NEGATIVE_EXTRA, OHAL_POSITIVE_REDUCTION, OHAL_LAUNDER_OUTPUT, OHAL_ELECTION_COST_MULT, OHAL_MONEY_VOLATILITY, OHAL_AP_MULTIPLIER } from '@/types/metaGame';
import { SKILL_ICONS, CATEGORY_CONFIG, getEffectText, getNextEffectText, isOhalLevelUnlockable, getOhalLockMessage } from './skillTreeConstants';

interface SkillDetailPanelProps {
  skill: SkillDef;
  level: number;
  ap: number;
  lang: 'tr' | 'en';
  justPurchased: boolean;
  lockReason: SkillLockReason;
  onPurchase: () => void;
  onClose: () => void;
}

export function SkillDetailPanel({
  skill, level, ap, lang, justPurchased, lockReason, onPurchase, onClose,
}: SkillDetailPanelProps) {
  const Icon = SKILL_ICONS[skill.id] || Shield;
  const maxed = level >= skill.maxLevel;
  const cost = maxed ? 0 : skill.costs[level];
  const canAfford = !maxed && ap >= cost;
  const catConfig = CATEGORY_CONFIG[skill.category];
  const isOhal = skill.id === 'ohal';
  const isFree = isOhal;
  const ohalLevelLocked = isOhal && !maxed && !isOhalLevelUnlockable(level);

  return (
    <>
      <div
        className="fixed inset-0 z-[110]"
        style={{ background: 'hsl(0 0% 0% / 0.6)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      <div
        className="fixed bottom-0 left-0 right-0 z-[120] rounded-t-3xl px-6 pt-6 pb-[calc(env(safe-area-inset-bottom,16px)+20px)] animate-fade-in"
        style={{
          background: isOhal
            ? 'linear-gradient(180deg, hsl(15 30% 16%), hsl(15 25% 10%))'
            : 'linear-gradient(180deg, hsl(220 25% 16%), hsl(220 30% 10%))',
          border: '1px solid hsl(0 0% 100% / 0.1)',
          borderBottom: 'none',
          boxShadow: `0 -10px 40px hsl(0 0% 0% / 0.5), 0 0 60px ${catConfig.glowColor}`,
        }}
      >
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'hsl(0 0% 100% / 0.2)' }} />

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

        <div className="rounded-xl p-3.5 mb-3" style={{ background: 'hsl(0 0% 100% / 0.05)', border: '1px solid hsl(0 0% 100% / 0.08)' }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'hsl(0 0% 50%)' }}>
            {lang === 'en' ? 'Current Effect' : 'Mevcut Etki'}
          </p>
          <p className="text-sm font-semibold" style={{ color: level > 0 ? 'hsl(0 0% 85%)' : 'hsl(0 0% 40%)' }}>
            {getEffectText(skill, level, lang)}
          </p>
        </div>

        {isOhal && !maxed && !ohalLevelLocked && (
          <div className="rounded-xl p-3.5 mb-3" style={{ background: 'hsl(15 90% 50% / 0.08)', border: '1px solid hsl(15 90% 50% / 0.2)' }}>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'hsl(15 90% 50%)' }}>
              {lang === 'en' ? 'Level Details' : 'Seviye Detayları'}
            </p>
            <div className="space-y-1 text-xs" style={{ color: 'hsl(0 0% 75%)' }}>
              <p>⬇️ {lang === 'en' ? 'Extra negative effects' : 'Ekstra negatif etki'}: <span className="font-bold" style={{ color: 'hsl(0 70% 60%)' }}>-{OHAL_NEGATIVE_EXTRA[level]}</span></p>
              <p>⬇️ {lang === 'en' ? 'Reduced positive effects' : 'Azaltılmış pozitif etki'}: <span className="font-bold" style={{ color: 'hsl(0 70% 60%)' }}>-{OHAL_POSITIVE_REDUCTION[level]}</span></p>
              <p>⬇️ {lang === 'en' ? 'Launder output' : 'Aklama verimi'}: <span className="font-bold" style={{ color: 'hsl(0 70% 60%)' }}>{OHAL_LAUNDER_OUTPUT[level]}B</span></p>
              <p>⬇️ {lang === 'en' ? 'Election cost multiplier' : 'Seçim maliyet çarpanı'}: <span className="font-bold" style={{ color: 'hsl(0 70% 60%)' }}>×{OHAL_ELECTION_COST_MULT[level]}</span></p>
              <p>📈 {lang === 'en' ? 'Money volatility' : 'Para volatilitesi'}: <span className="font-bold" style={{ color: 'hsl(45 80% 55%)' }}>×{OHAL_MONEY_VOLATILITY[level]}</span></p>
              <p>⭐ {lang === 'en' ? 'AP Multiplier' : 'AP Çarpanı'}: <span className="font-black" style={{ color: 'hsl(45 90% 55%)' }}>×{OHAL_AP_MULTIPLIER[level]}</span></p>
            </div>
          </div>
        )}

        {isOhal && ohalLevelLocked && (
          <div className="rounded-xl p-3.5 mb-3 flex items-center gap-2"
            style={{ background: 'hsl(45 80% 50% / 0.08)', border: '1px solid hsl(45 80% 50% / 0.3)' }}
          >
            <GameIcon name="lock" size={14} style={{ color: 'hsl(45 80% 55%)' }} />
            <p className="text-xs font-semibold" style={{ color: 'hsl(45 80% 55%)' }}>
              {getOhalLockMessage(level, lang)}
            </p>
          </div>
        )}

        {!maxed && !isOhal && (
          <div className="rounded-xl p-3.5 mb-5" style={{ background: `${catConfig.color.replace(')', ' / 0.08)')}`, border: `1px solid ${catConfig.color.replace(')', ' / 0.2)')}` }}>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: catConfig.color }}>
              {lang === 'en' ? 'After Upgrade' : 'Yükseltme Sonucu'}
            </p>
            <p className="text-sm font-semibold" style={{ color: 'hsl(0 0% 85%)' }}>
              {getNextEffectText(skill, level, lang)}
            </p>
          </div>
        )}

        {maxed ? (
          <div className="text-center py-3 rounded-xl font-bold text-sm mt-3"
            style={{ background: 'hsl(145 70% 42% / 0.15)', color: 'hsl(145 70% 55%)', border: '1px solid hsl(145 70% 42% / 0.3)' }}
          >
            {lang === 'en' ? '✓ MAXIMUM LEVEL' : '✓ MAKSİMUM SEVİYE'}
          </div>
        ) : lockReason ? (
          <div className="text-center py-3 rounded-xl font-bold text-sm mt-3"
            style={{ background: 'hsl(0 0% 100% / 0.05)', color: 'hsl(0 0% 35%)', border: '1px solid hsl(0 0% 100% / 0.08)' }}
          >
            <GameIcon name="lock" size={14} className="inline mr-1" style={{ color: 'hsl(0 0% 35%)' }} />
            {lang === 'en' ? 'Locked' : 'Kilitli'}
          </div>
        ) : ohalLevelLocked ? (
          <div className="text-center py-3 rounded-xl font-bold text-sm mt-3"
            style={{ background: 'hsl(45 80% 50% / 0.08)', color: 'hsl(45 80% 55%)', border: '1px solid hsl(45 80% 50% / 0.2)' }}
          >
            <Lock size={14} className="inline mr-1" style={{ color: 'hsl(45 80% 55%)' }} />
            {lang === 'en' ? 'Achievement Required' : 'Başarım Gerekli'}
          </div>
        ) : (
          <button
            onClick={onPurchase}
            disabled={!canAfford && !isFree}
            className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.97] mt-3 ${
              !canAfford && !isFree ? 'cursor-not-allowed' : ''
            }`}
            style={(canAfford || isFree) ? {
              background: isOhal
                ? 'linear-gradient(135deg, hsl(15 90% 50%), hsl(0 70% 40%))'
                : `linear-gradient(135deg, ${catConfig.color}, ${catConfig.color.replace(')', ' / 0.7)')})`,
              color: 'white',
              boxShadow: `0 4px 20px ${catConfig.glowColor}, 0 0 40px ${catConfig.glowColor}`,
            } : {
              background: 'hsl(0 0% 100% / 0.05)',
              color: 'hsl(0 0% 35%)',
              border: '1px solid hsl(0 0% 100% / 0.08)',
            }}
          >
            {isFree ? (
              <>
                <GameIcon name="flame" size={14} fill="white" />
                {lang === 'en' ? `Activate Level ${level + 1}` : `Seviye ${level + 1} Aktifleştir`}
              </>
            ) : (
              <>
                <GameIcon name="star" size={14} fill={canAfford ? 'white' : 'hsl(0 0% 35%)'} />
                {lang === 'en' ? `Upgrade for ${cost} AP` : `${cost} AP ile Yükselt`}
              </>
            )}
          </button>
        )}
      </div>
    </>
  );
}
