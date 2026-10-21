import React from 'react';
import { Agent } from '../types';
import { MascotAvatar } from './MascotAvatar';

interface AgentPebbleAvatarProps {
  agent: Agent;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBadge?: boolean;
  forceState?: 'idle' | 'working' | 'static';
  animate?: boolean;
  hoverEffect?: boolean;
}

export const AgentPebbleAvatar: React.FC<AgentPebbleAvatarProps> = ({
  agent,
  size = 'md',
  className = '',
  showBadge = false,
  forceState,
  animate = true,
  hoverEffect = true
}) => {
  // If agent status is executing or requested forceState, trigger working sprite
  const avatarState: 'idle' | 'working' | 'static' = 
    forceState || (agent.status === 'executing' ? 'working' : 'idle');

  return (
    <MascotAvatar
      colorPreset={agent.mascotColor || 'red'}
      customHue={agent.mascotHueShift}
      size={size}
      className={className}
      showBadge={showBadge}
      state={avatarState}
      animate={animate}
      hoverEffect={hoverEffect}
      glow={agent.status === 'executing'}
    />
  );
};
