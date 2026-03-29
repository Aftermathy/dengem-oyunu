/**
 * assets.ts — Central asset catalogue.
 *
 * All icon components and image paths are defined here.
 * To swap any icon or image in the future, update only this file.
 */

// ─── Lucide icon imports ──────────────────────────────────────────────────
import {
  Megaphone, Swords, Eye, TrendingUp, Skull,
  Vote, Glasses, Sparkles, Landmark, Clover,
  AlertTriangle, Shield, Tv, Coins, Target,
  X, Star, ChevronUp, Lock, RotateCcw, Syringe, Flame,
  Settings, Volume2, VolumeX, Home, Moon, Sun,
  Pencil, Check,
  type LucideIcon,
} from 'lucide-react';

// ─── Image asset imports ──────────────────────────────────────────────────
import factionHalk          from '@/assets/faction-halk.png';
import factionYatirimcilar  from '@/assets/faction-yatirimcilar.png';
import factionMafya         from '@/assets/faction-mafya.png';
import factionTarikat       from '@/assets/faction-tarikat.png';
import factionOrdu          from '@/assets/faction-ordu.png';

import defeatHalk           from '@/assets/defeat-halk.png';
import defeatYatirimcilar   from '@/assets/defeat-yatirimcilar.png';
import defeatMafya          from '@/assets/defeat-mafya.png';
import defeatTarikat        from '@/assets/defeat-tarikat.png';
import defeatOrdu           from '@/assets/defeat-ordu.png';
import defeatIflas          from '@/assets/defeat-iflas.png';
import defeatElection       from '@/assets/defeat-election.png';

import victoryBalcony       from '@/assets/victory-balcony.png';
// ↓ Replace with your final art — drop victory-absolute.png into src/assets/
import victoryAbsolute      from '@/assets/victory-absolute.png';
import splashBg             from '@/assets/splash-bg.jpg';
import throneIcon           from '@/assets/throne-icon.png';
import arrowLeft            from '@/assets/arrow-left.svg';
import arrowRight           from '@/assets/arrow-right.svg';

// ─── GameIcons dictionary ─────────────────────────────────────────────────
// Maps semantic names to LucideIcon components.
// Replace any value here to swap the icon across the entire game.
export const GameIcons = {
  // Faction / skill icons
  megaphone:      Megaphone,
  swords:         Swords,
  eye:            Eye,
  trending_up:    TrendingUp,
  skull:          Skull,
  vote:           Vote,
  glasses:        Glasses,
  sparkles:       Sparkles,
  landmark:       Landmark,
  clover:         Clover,
  alert_triangle: AlertTriangle,
  shield:         Shield,
  tv:             Tv,
  coins:          Coins,
  target:         Target,
  flame:          Flame,
  syringe:        Syringe,
  // UI chrome
  close:          X,
  star:           Star,
  chevron_up:     ChevronUp,
  lock:           Lock,
  rotate_ccw:     RotateCcw,
  settings:       Settings,
  volume_on:      Volume2,
  volume_off:     VolumeX,
  home:           Home,
  moon:           Moon,
  sun:            Sun,
  pencil:         Pencil,
  check:          Check,
} as const satisfies Record<string, LucideIcon>;

export type GameIconName = keyof typeof GameIcons;

// ─── GameImages dictionary ────────────────────────────────────────────────
// Maps semantic names to resolved image URLs (handled by Vite bundler).
// Replace any value here to swap the image across the entire game.
export const GameImages = {
  // Faction portraits
  faction_halk:         factionHalk,
  faction_yatirimcilar: factionYatirimcilar,
  faction_mafya:        factionMafya,
  faction_tarikat:      factionTarikat,
  faction_ordu:         factionOrdu,
  // Defeat screens
  defeat_halk:          defeatHalk,
  defeat_yatirimcilar:  defeatYatirimcilar,
  defeat_mafya:         defeatMafya,
  defeat_tarikat:       defeatTarikat,
  defeat_ordu:          defeatOrdu,
  defeat_iflas:         defeatIflas,
  defeat_election:      defeatElection,
  // Misc
  victory_balcony:      victoryBalcony,
  victory_absolute:     victoryAbsolute,
  splash_bg:            splashBg,
  throne_icon:          throneIcon,
  arrow_left:           arrowLeft,
  arrow_right:          arrowRight,
} as const;

export type GameImageName = keyof typeof GameImages;
