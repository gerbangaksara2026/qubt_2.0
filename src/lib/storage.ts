import { Agent, AppSettings, Message, ScheduledRoutine, VirtualFile } from '../types';
import { INITIAL_AGENTS, INITIAL_FILES, INITIAL_MESSAGES, INITIAL_SCHEDULED_ROUTINES } from './initialAgents';

const STORAGE_KEYS = {
  AGENTS: 'qubot_agents_v2',
  MESSAGES: 'qubot_messages_v2',
  ROUTINES: 'qubot_routines_v2',
  FILES: 'qubot_files_v2',
  SETTINGS: 'qubot_settings_v2',
  CURRENT_AGENT_ID: 'qubot_active_agent_id'
};

export const DEFAULT_SETTINGS: AppSettings = {
  geminiApiKey: '',
  anthropicApiKey: '',
  openaiApiKey: '',
  grokApiKey: '',
  deepseekApiKey: '',
  composioApiKey: '',
  elevenLabsApiKey: '',
  defaultModel: 'gemini-3.8-flash',
  vmRuntime: 'podman',
  theme: 'white-glass',
  soundEffects: true,
  autoSpeakResponses: false
};

export function getStoredAgents(): Agent[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.AGENTS);
    return data ? JSON.parse(data) : INITIAL_AGENTS;
  } catch {
    return INITIAL_AGENTS;
  }
}

export function saveStoredAgents(agents: Agent[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
  } catch (err) {
    console.error('Failed to save agents to localStorage', err);
  }
}

export function getStoredMessages(): Record<string, Message[]> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return data ? JSON.parse(data) : INITIAL_MESSAGES;
  } catch {
    return INITIAL_MESSAGES;
  }
}

export function saveStoredMessages(messages: Record<string, Message[]>) {
  try {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  } catch (err) {
    console.error('Failed to save messages to localStorage', err);
  }
}

export function getStoredRoutines(): ScheduledRoutine[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ROUTINES);
    return data ? JSON.parse(data) : INITIAL_SCHEDULED_ROUTINES;
  } catch {
    return INITIAL_SCHEDULED_ROUTINES;
  }
}

export function saveStoredRoutines(routines: ScheduledRoutine[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines));
  } catch (err) {
    console.error('Failed to save routines to localStorage', err);
  }
}

export function getStoredFiles(): VirtualFile[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FILES);
    return data ? JSON.parse(data) : INITIAL_FILES;
  } catch {
    return INITIAL_FILES;
  }
}

export function saveStoredFiles(files: VirtualFile[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));
  } catch (err) {
    console.error('Failed to save files to localStorage', err);
  }
}

export function getStoredSettings(): AppSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: AppSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings to localStorage', err);
  }
}

export function exportBackupData(): string {
  const data = {
    appName: 'QUBOT - Automation Assistant for Everything',
    version: '2.4.0',
    exportedAt: new Date().toISOString(),
    agents: getStoredAgents(),
    messages: getStoredMessages(),
    routines: getStoredRoutines(),
    files: getStoredFiles(),
    settings: { ...getStoredSettings(), geminiApiKey: '***redacted***' }
  };
  return JSON.stringify(data, null, 2);
}

export function restoreBackupData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.agents) saveStoredAgents(data.agents);
    if (data.messages) saveStoredMessages(data.messages);
    if (data.routines) saveStoredRoutines(data.routines);
    if (data.files) saveStoredFiles(data.files);
    return true;
  } catch {
    return false;
  }
}

export function resetToFactoryDefaults() {
  localStorage.removeItem(STORAGE_KEYS.AGENTS);
  localStorage.removeItem(STORAGE_KEYS.MESSAGES);
  localStorage.removeItem(STORAGE_KEYS.ROUTINES);
  localStorage.removeItem(STORAGE_KEYS.FILES);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_AGENT_ID);
}
