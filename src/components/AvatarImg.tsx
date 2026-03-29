import { useState } from 'react';
import { EmojiImg } from '@/components/EmojiImg';
import type { AvatarDef } from '@/lib/userProfile';

interface AvatarImgProps {
  avatar: AvatarDef;
  /** Size in px, or omit and use fill=true to fill parent container */
  size?: number;
  fill?: boolean;
  className?: string;
}

/**
 * Renders a PNG avatar image if `avatar.imageId` is set,
 * otherwise falls back to the emoji on the coloured circle.
 */
export function AvatarImg({ avatar, size, fill, className = '' }: AvatarImgProps) {
  const [imgError, setImgError] = useState(false);

  if (avatar.imageId && !imgError) {
    return (
      <img
        src={`/assets/avatars/${avatar.imageId}.png`}
        alt={avatar.nameEN}
        onError={() => setImgError(true)}
        className={className}
        style={fill
          ? { width: '100%', height: '100%', objectFit: 'cover', display: 'block' }
          : { width: size, height: size, objectFit: 'cover', display: 'block' }}
      />
    );
  }

  return <EmojiImg emoji={avatar.emoji} size={Math.round((size ?? 40) * 0.57)} />;
}
