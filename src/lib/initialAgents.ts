import { Agent, Message, ScheduledRoutine, VirtualFile } from '../types';

// Clean initial state: zero dummy bots, user creates their own bots!
export const INITIAL_AGENTS: Agent[] = [];

export const INITIAL_MESSAGES: Record<string, Message[]> = {};

export const INITIAL_SCHEDULED_ROUTINES: ScheduledRoutine[] = [];

export const INITIAL_FILES: VirtualFile[] = [
  {
    name: 'workspace',
    path: '/workspace',
    isDirectory: true,
    updatedAt: 'Just now',
    children: [
      {
        name: 'README.md',
        path: '/workspace/README.md',
        isDirectory: false,
        size: '1.2 KB',
        updatedAt: 'Just now',
        content: `# QUBOT Autonomous Workspace\n\nWelcome to your clean automation workspace. Create your first bot using the + button to begin executing tasks.`
      }
    ]
  }
];
