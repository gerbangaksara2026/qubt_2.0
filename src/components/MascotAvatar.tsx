import React, { useState } from 'react';
import { MascotColorPreset } from '../types';

export const SPRITE_ASSETS = {
  idle: '/assets/aistudio/qubot-idle_1a9edf54.png',
  working: '/assets/aistudio/qubot-working_f29ff478.png',
  staticFallback: '/assets/aistudio/qubot_transparent_050abbc1.png'
};

export const MASCOT_COLOR_PRESETS: {
  id: MascotColorPreset;
  name: string;
  hue: number;
  hex: string;
  badgeBg: string;
}[] = [
  { id: 'red', name: 'Crimson Core', hue: 0, hex: '#EF4444', badgeBg: 'bg-red-500' },
  { id: 'purple', name: 'Royal Violet', hue: 265, hex: '#8B5CF6', badgeBg: 'bg-purple-500' },
  { id: 'blue', name: 'Electric Sky', hue: 190, hex: '#0EA5E9', badgeBg: 'bg-sky-500' },
  { id: 'green', name: 'Emerald Ops', hue: 95, hex: '#10B981', badgeBg: 'bg-emerald-500' },
  { id: 'teal', name: 'Cyber Teal', hue: 145, hex: '#14B8A6', badgeBg: 'bg-teal-500' },
  { id: 'amber', name: 'Gold Scout', hue: 42, hex: '#F59E0B', badgeBg: 'bg-amber-500' },
  { id: 'orange', name: 'Neon Flame', hue: 22, hex: '#F97316', badgeBg: 'bg-orange-500' },
  { id: 'pink', name: 'Laser Pink', hue: 315, hex: '#EC4899', badgeBg: 'bg-pink-500' },
  { id: 'indigo', name: 'Deep Indigo', hue: 225, hex: '#6366F1', badgeBg: 'bg-indigo-500' },
  { id: 'platinum', name: 'Titanium Grey', hue: -1, hex: '#94A3B8', badgeBg: 'bg-slate-400' }
];

export function getMascotFilterStyle(preset?: MascotColorPreset, customHue?: number): React.CSSProperties {
  if (preset === 'platinum') {
    return { filter: 'grayscale(1) brightness(1.12) contrast(1.1)' };
  }

  const hueDeg = customHue !== undefined 
    ? customHue 
    : (MASCOT_COLOR_PRESETS.find(p => p.id === preset)?.hue || 0);

  if (hueDeg === 0) {
    return { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))' };
  }

  return {
    filter: `hue-rotate(${hueDeg}deg) saturate(1.12) drop-shadow(0 2px 4px rgba(0,0,0,0.08))`
  };
}

export interface MascotAvatarProps {
  colorPreset?: MascotColorPreset;
  customHue?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
  showBadge?: boolean;
  glow?: boolean;
  state?: 'idle' | 'working' | 'static';
  animate?: boolean;
  speed?: 'calm' | 'normal' | 'fast';
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const MascotAvatar: React.FC<MascotAvatarProps> = ({
  colorPreset = 'red',
  customHue,
  size = 'md',
  className = '',
  showBadge = false,
  glow = false,
  state = 'idle',
  animate = true,
  speed = 'normal',
  hoverEffect = true,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24',
    '3xl': 'w-32 h-32'
  };

  const style = getMascotFilterStyle(colorPreset, customHue);
  const presetInfo = MASCOT_COLOR_PRESETS.find(p => p.id === colorPreset);

  // If hovered and hoverEffect is enabled, temporarily trigger the energetic working sprite or accelerated idle
  const effectiveState: 'idle' | 'working' | 'static' = 
    state === 'static' ? 'static' : (isHovered && hoverEffect ? 'working' : state);

  // Dynamic animation loop duration
  let duration = 0.85;
  if (speed === 'calm') duration = 1.25;
  if (speed === 'fast') duration = 0.5;
  if (effectiveState === 'working') {
    duration = duration * 0.7; // energetic fire flare speed
  }

  const spriteSrc = effectiveState === 'working' 
    ? SPRITE_ASSETS.working 
    : SPRITE_ASSETS.idle;

  return (
    <div 
      className={`relative flex-shrink-0 select-none ${sizeClasses[size]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onMouseEnter={hoverEffect ? () => setIsHovered(true) : undefined}
      onMouseLeave={hoverEffect ? () => setIsHovered(false) : undefined}
      onClick={onClick}
    >
      {/* Ambient energetic glow when working or requested */}
      {(glow || (effectiveState === 'working' && animate)) && (
        <div 
          className="absolute inset-0 rounded-full blur-md opacity-45 scale-110 pointer-events-none transition-all duration-300"
          style={{ backgroundColor: presetInfo?.hex || '#EF4444' }}
        />
      )}

      {/* Frame Viewport */}
      <div className="w-full h-full relative overflow-hidden rounded-xl flex items-center justify-start">
        {state === 'static' || !animate || imgError ? (
          <img
            src={SPRITE_ASSETS.staticFallback}
            alt="QUBOT Cyber Owl Mascot"
            style={style}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain pointer-events-none transition-transform duration-200 hover:scale-105"
          />
        ) : (
          <img
            src={spriteSrc}
            alt={`QUBOT Cyber Owl Mascot (${effectiveState})`}
            style={{
              width: '800%',
              maxWidth: 'none',
              height: '100%',
              objectFit: 'contain',
              animation: `qubot-sprite-8 ${duration}s steps(8) infinite`,
              willChange: 'transform',
              ...style
            }}
            onError={() => setImgError(true)}
            className="pointer-events-none select-none transition-filter"
          />
        )}
      </div>

      {/* Status Badge */}
      {showBadge && (
        <span 
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white shadow-2xs z-10 transition-transform duration-200"
          style={{ backgroundColor: presetInfo?.hex || '#22C55E' }}
        />
      )}
    </div>
  );
};
