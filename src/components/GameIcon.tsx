import { GameIcons, type GameIconName } from '@/config/assets';

interface GameIconProps {
  name: GameIconName;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  /** Optional fill color (passed directly to the underlying SVG icon) */
  fill?: string;
}

/**
 * GameIcon — universal icon wrapper.
 *
 * Renders any icon from the central GameIcons catalogue.
 * To swap an icon game-wide, update GameIcons in src/config/assets.ts.
 *
 * @example
 *   <GameIcon name="lock" size={16} className="text-white/80" />
 *   <GameIcon name="star" size={14} fill="gold" style={{ color: 'gold' }} />
 */
export function GameIcon({ name, size = 16, className, style, fill }: GameIconProps) {
  const Icon = GameIcons[name];
  return <Icon size={size} className={className} style={style} fill={fill} />;
}
