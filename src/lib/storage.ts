import { Agent, AppSettings, Message, ScheduledRoutine, VirtualFile } from '../types';
import { INITIAL_AGENTS, INITIAL_FILES, INITIAL_MESSAGES, INITIAL_SCHEDULED_ROUTINES } from './initialAgents';

const STORAGE_KEYS = {
  AGENTS: 'qubot_agents_v3',
  MESSAGES: 'qubot_messages_v3',
  ROUTINES: 'qubot_routines_v3',
  FILES: 'qubot_files_v3',
  SETTINGS: 'qubot_settings_v3',
  CURRENT_AGENT_ID: 'qubot_active_agent_id_v3',
  MIGRATION_CLEANED: 'qubot_cleaned_dummy_v3'
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
  autoSpeakResponses: false,
  userProfile: {
    name: 'Workspace Owner',
    email: 'user@qubot.ai',
    role: 'Workspace Administrator',
    avatarUrl: ''
  },
  workspaceName: 'QUBOT Studio',
  themeAccent: 'sky',
  glassFrosting: 'standard',
  aiAccounts: {
    openai: { connected: false },
    anthropic: { connected: false },
    google: { connected: false },
    grok: { connected: false },
    deepseek: { connected: false },
    hermes: { connected: false },
    opencode: { connected: false },
    openrouter: { connected: false },
    ninerouter: { connected: false }
  },
  customModel: {
    baseUrl: 'https://api.openai.com/v1',
    modelName: 'gpt-4o',
    apiKey: '',
    isActive: false
  },
  hermesApiKey: '',
  openCodeApiKey: '',
  openRouterApiKey: '',
  nineRouterApiKey: '',
  customEndpoint: 'http://localhost:11434/v1',
  ollamaModel: 'llama3:latest',
  multiAgent: {
    enableDelegation: true,
    maxHops: 3,
    autoSuggest: true
  },
  vpsServerUrl: 'http://localhost:3000',
  vpsWebhookUrl: 'http://localhost:3000/api/webhook'
};

// Clean legacy dummy storage once
function ensureCleanSlate() {
  try {
    if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEYS.MIGRATION_CLEANED)) {
      // Remove any old v1/v2 dummy data
      localStorage.removeItem('qubot_agents_v2');
      localStorage.removeItem('qubot_messages_v2');
      localStorage.removeItem('qubot_routines_v2');
      localStorage.removeItem('qubot_active_agent_id');
      localStorage.setItem(STORAGE_KEYS.MIGRATION_CLEANED, 'true');
    }
  } catch {
    // Ignore in non-browser env
  }
}

export function getStoredAgents(): Agent[] {
  try {
    ensureCleanSlate();
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

export function deleteStoredAgent(agentId: string) {
  try {
    const agents = getStoredAgents().filter(a => a.id !== agentId);
    saveStoredAgents(agents);
    const messages = getStoredMessages();
    delete messages[agentId];
    saveStoredMessages(messages);
  } catch (err) {
    console.error('Failed to delete agent', err);
  }
}

export function clearAllStoredAgents() {
  try {
    localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify({}));
  } catch (err) {
    console.error('Failed to clear agents', err);
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
    if (!data) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(data);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      userProfile: {
        ...DEFAULT_SETTINGS.userProfile,
        ...(parsed.userProfile || {})
      },
      aiAccounts: {
        ...DEFAULT_SETTINGS.aiAccounts,
        ...(parsed.aiAccounts || {})
      },
      customModel: {
        ...DEFAULT_SETTINGS.customModel,
        ...(parsed.customModel || {})
      },
      multiAgent: {
        ...DEFAULT_SETTINGS.multiAgent,
        ...(parsed.multiAgent || {})
      }
    };
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
    version: '3.0.0',
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
    if (data.settings) saveStoredSettings(data.settings);
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
