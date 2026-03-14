import { ElectionConfig } from '@/types/election';
import { EmojiImg } from '@/components/EmojiImg';
import { EmberParticles, StaggeredTitle } from './electionUtils';

interface ElectionIntroProps {
  config: ElectionConfig;
  lang: string;
}

export function ElectionIntro({ config, lang }: ElectionIntroProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center animate-scale-in relative z-10">
      <EmberParticles count={15} />
      <div className="flame-ring inline-flex items-center justify-center w-20 h-20 mb-4">
        <span><EmojiImg emoji="🔥" size={56} /></span>
      </div>
      <h1 className="text-4xl font-black text-orange-400 text-center px-4"
        style={{ textShadow: '0 0 30px rgba(255,100,0,0.6)' }}>
        <StaggeredTitle text={config.title} />
      </h1>
      <p className="text-orange-200/80 text-lg mt-3 text-center px-6">{config.subtitle}</p>
      <span className="mt-6 animate-pulse"><EmojiImg emoji="🗳️" size={56} /></span>
      <p className="text-orange-300/60 text-sm mt-4 animate-pulse">
        {lang === 'en' ? 'Preparing ballot boxes...' : 'Sandıklar hazırlanıyor...'}
      </p>
    </div>
  );
}
