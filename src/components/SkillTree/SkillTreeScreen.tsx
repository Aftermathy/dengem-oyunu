import { useState, useCallback, useMemo } from 'react';
import { useMetaGame } from '@/contexts/MetaGameContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { SKILL_DEFS, type SkillDef } from '@/types/metaGame';
import { playClickSound } from '@/hooks/useSound';
import { hapticMedium } from '@/hooks/useHaptics';
import { GameIcon } from '@/components/GameIcon';
import { CATEGORY_CONFIG, isOhalLevelUnlockable, getOhalLockMessage } from './skillTreeConstants';
import { CategoryCluster } from './CategoryCluster';
import { SkillDetailPanel } from './SkillDetailPanel';

export function SkillTreeScreen({ onClose }: { onClose: () => void }) {
  const { lang } = useLanguage();
  const { authorityPoints, purchaseSkill, getSkillLevel, getSkillLockReason, resetAllSkills } = useMetaGame();
  const [selectedSkill, setSelectedSkill] = useState<SkillDef | null>(null);
  const [justPurchasedId, setJustPurchasedId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [bubbleWarning, setBubbleWarning] = useState<{ skillId: string; message: string } | null>(null);

  const handleBubbleClick = useCallback((skill: SkillDef) => {
    playClickSound();
    hapticMedium();
    
    const lockReason = getSkillLockReason(skill.id);
    if (lockReason) {
      const msg = lockReason === 'ohal_blocks_others'
        ? (lang === 'en' ? 'OHAL is active! Reset skills first.' : 'OHAL aktif! Önce yetenekleri sıfırlayın.')
        : (lang === 'en' ? 'Other skills are active! Reset first.' : 'Başka yetenekler aktif! Önce sıfırlayın.');
      setBubbleWarning({ skillId: skill.id, message: msg });
      setTimeout(() => setBubbleWarning(null), 2500);
      return;
    }
    
    if (skill.id === 'ohal') {
      const currentLevel = getSkillLevel('ohal');
      if (!isOhalLevelUnlockable(currentLevel)) {
        const msg = getOhalLockMessage(currentLevel, lang);
        setBubbleWarning({ skillId: skill.id, message: msg });
        setTimeout(() => setBubbleWarning(null), 2500);
        return;
      }
    }
    
    setSelectedSkill(skill);
  }, [getSkillLockReason, getSkillLevel, lang]);

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

  const handleReset = useCallback(() => {
    playClickSound();
    hapticMedium();
    resetAllSkills();
    setShowResetConfirm(false);
    setSelectedSkill(null);
  }, [resetAllSkills]);

  const hasAnySkills = useMemo(() => {
    return SKILL_DEFS.some(def => getSkillLevel(def.id) > 0);
  }, [getSkillLevel]);

  const totalSpent = useMemo(() => {
    let total = 0;
    for (const def of SKILL_DEFS) {
      const level = getSkillLevel(def.id);
      for (let i = 0; i < level; i++) {
        total += def.costs[i];
      }
    }
    return total;
  }, [getSkillLevel]);

  const categories = useMemo(() => {
    return ['defense', 'media', 'economy', 'strategy', 'ohal'].map(cat => ({
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => { if (hasAnySkills) { playClickSound(); setShowResetConfirm(true); } }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-transform ${hasAnySkills ? 'active:scale-90' : 'opacity-40'}`}
            style={{
              background: 'hsl(0 70% 50% / 0.15)',
              border: '1px solid hsl(0 70% 50% / 0.4)',
            }}
            disabled={!hasAnySkills}
          >
            <GameIcon name="rotate_ccw" size={12} style={{ color: 'hsl(0 70% 60%)' }} />
            <span className="text-[10px] font-bold" style={{ color: 'hsl(0 70% 60%)' }}>
              {lang === 'en' ? 'Reset' : 'Sıfırla'}
            </span>
          </button>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgb(168 85 247 / 0.2), rgb(139 92 246 / 0.15))',
              border: '1px solid rgb(168 85 247 / 0.5)',
              boxShadow: '0 0 20px rgb(168 85 247 / 0.2), inset 0 1px 0 rgb(216 180 254 / 0.2)',
            }}
          >
            <GameIcon name="star" size={15} className="text-purple-400" fill="rgb(192 132 252)" />
            <span className="font-black text-sm text-purple-400">{authorityPoints}</span>
            <span className="text-[10px] font-bold text-purple-400/70">AP</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-transform"
            style={{ background: 'hsl(0 0% 100% / 0.1)', border: '1px solid hsl(0 0% 100% / 0.15)' }}
          >
            <GameIcon name="close" size={16} style={{ color: 'hsl(0 0% 70%)' }} />
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
            bubbleWarning={bubbleWarning}
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
          lockReason={getSkillLockReason(selectedSkill.id)}
          onPurchase={handlePurchase}
          onClose={() => setSelectedSkill(null)}
        />
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <>
          <div className="fixed inset-0 z-[130]" style={{ background: 'hsl(0 0% 0% / 0.7)', backdropFilter: 'blur(4px)' }} onClick={() => setShowResetConfirm(false)} />
          <div className="fixed inset-0 z-[140] flex items-center justify-center px-8">
            <div className="rounded-2xl p-6 max-w-sm w-full"
              style={{
                background: 'linear-gradient(180deg, hsl(0 30% 18%), hsl(0 25% 12%))',
                border: '1px solid hsl(0 60% 40% / 0.4)',
                boxShadow: '0 20px 60px hsl(0 0% 0% / 0.5)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'hsl(0 70% 50% / 0.2)', border: '1px solid hsl(0 70% 50% / 0.4)' }}
                >
                  <GameIcon name="rotate_ccw" size={20} style={{ color: 'hsl(0 70% 60%)' }} />
                </div>
                <h3 className="text-base font-black" style={{ color: 'hsl(0 0% 90%)' }}>
                  {lang === 'en' ? 'Reset All Skills?' : 'Tüm Yetenekleri Sıfırla?'}
                </h3>
              </div>
              <p className="text-sm mb-2" style={{ color: 'hsl(0 0% 65%)' }}>
                {lang === 'en'
                  ? `All skills (including OHAL) will be reset${totalSpent > 0 ? ` and ${totalSpent} AP will be refunded` : ''}.`
                  : `Tüm yetenekler (OHAL dahil) sıfırlanacak${totalSpent > 0 ? ` ve ${totalSpent} AP iade edilecek` : ''}.`}
              </p>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold active:scale-95 transition-transform"
                  style={{ background: 'hsl(0 0% 100% / 0.08)', color: 'hsl(0 0% 60%)', border: '1px solid hsl(0 0% 100% / 0.1)' }}
                >
                  {lang === 'en' ? 'Cancel' : 'İptal'}
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold active:scale-95 transition-transform"
                  style={{
                    background: 'linear-gradient(135deg, hsl(0 70% 50%), hsl(0 60% 40%))',
                    color: 'white',
                    boxShadow: '0 4px 20px hsl(0 70% 50% / 0.3)',
                  }}
                >
                  {lang === 'en' ? 'Reset' : 'Sıfırla'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
