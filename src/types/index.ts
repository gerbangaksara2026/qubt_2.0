export type ModelId = 
  | 'gemini-3.8-flash'
  | 'gemini-4-argon'
  | 'claude-3-7-sonnet'
  | 'gpt-4o'
  | 'grok-3'
  | 'deepseek-r1'
  | 'hermes-3'
  | 'opencode'
  | 'openrouter'
  | '9router'
  | 'custom-endpoint'
  | 'codex-cli'
  | 'llama-3.3-70b-local';

export type EnvironmentType = 
  | 'local-mac'
  | 'docker-sandbox'
  | 'cloud-vm'
  | 'headless-browser';

export type ApprovalPolicy = 'autonomous' | 'approval-required' | 'strict-read-only';

export type ToolCategory = 
  | 'system'
  | 'browser'
  | 'email'
  | 'calendar'
  | 'dev'
  | 'communication'
  | 'productivity';

export type MascotColorPreset = 
  | 'red'
  | 'orange'
  | 'amber'
  | 'green'
  | 'teal'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink'
  | 'platinum';

export interface ComposioApp {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  icon: string;
  isConnected: boolean;
  toolsCount: number;
  availableTools: string[];
}

export interface ToolPermission {
  toolId: string;
  enabled: boolean;
  requiresApproval: boolean;
}

export interface Agent {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  mascotColor: MascotColorPreset;
  mascotHueShift?: number; // 0-360 degrees
  role: string;
  tagline: string;
  systemPrompt: string;
  model: ModelId;
  environment: EnvironmentType;
  approvalPolicy: ApprovalPolicy;
  status: 'active' | 'executing' | 'idle' | 'scheduled';
  statusMessage?: string;
  category: 'core' | 'engineering' | 'operations' | 'research' | 'personal';
  enabledTools: string[];
  toolPermissions?: Record<string, 'require-approval' | 'auto-allow' | 'disabled'>;
  unreadCount?: number;
  lastActive: string;
  voiceName?: string;
  voiceId?: string;
  memoryItems: string[];
  tokensUsed: number;
}

export type ToolStatus = 'pending' | 'approved' | 'rejected' | 'executing' | 'completed' | 'failed';

export interface ToolCall {
  id: string;
  toolName: string;
  appName: string;
  category: ToolCategory;
  actionSummary: string;
  riskLevel: 'safe' | 'moderate' | 'high';
  arguments: Record<string, any>;
  diffOrPreview?: string;
  status: ToolStatus;
  executionOutput?: string;
  executionDurationMs?: number;
  timestamp: string;
}

export interface Message {
  id: string;
  agentId: string;
  sender: 'user' | 'agent' | 'system';
  authorAgentId?: string;
  authorName?: string;
  authorHandle?: string;
  isDelegation?: boolean;
  content: string;
  timestamp: string;
  reasoning?: string;
  toolCalls?: ToolCall[];
  attachment?: {
    type: 'pdf' | 'code' | 'image' | 'json';
    name: string;
    size: string;
    pages?: number;
    url?: string;
  };
  audioUrl?: string;
  audioDuration?: string;
  isStreaming?: boolean;
}

export interface VirtualFile {
  name: string;
  path: string;
  isDirectory: boolean;
  size?: string;
  updatedAt: string;
  content?: string;
  children?: VirtualFile[];
}

export interface ScheduledRoutine {
  id: string;
  title: string;
  agentId: string;
  scheduleCron: string;
  scheduleHuman: string;
  nextRun: string;
  isActive: boolean;
  prompt: string;
  lastRunResult?: string;
  lastRunTime?: string;
}

export interface TerminalEntry {
  id: string;
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
  timestamp: string;
}

export interface BrowserTabState {
  url: string;
  title: string;
  isLoading: boolean;
  cursorPos?: { x: number; y: number; label?: string };
  screenshotUrl?: string;
  pageContentSummary?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface AiAccountConnection {
  connected: boolean;
  email?: string;
  tier?: string;
  token?: string;
  connectedAt?: string;
  avatar?: string;
}

export interface CustomModelConfig {
  baseUrl: string;
  modelName: string;
  apiKey: string;
  isActive: boolean;
}

export interface AppSettings {
  geminiApiKey: string;
  anthropicApiKey: string;
  openaiApiKey: string;
  grokApiKey: string;
  deepseekApiKey: string;
  hermesApiKey?: string;
  openCodeApiKey?: string;
  openRouterApiKey?: string;
  nineRouterApiKey?: string;
  composioApiKey: string;
  elevenLabsApiKey: string;
  defaultModel: ModelId;
  vmRuntime: 'podman' | 'docker' | 'apple-vz' | 'cloud';
  theme: 'white-glass' | 'dark';
  soundEffects: boolean;
  autoSpeakResponses: boolean;
  // User Profile & Workspace
  userProfile: UserProfile;
  workspaceName: string;
  themeAccent: 'sky' | 'violet' | 'emerald' | 'amber' | 'rose' | 'zinc';
  glassFrosting: 'subtle' | 'standard' | 'frosted';
  // Authorized AI Subscriptions (OAuth Sign-In)
  aiAccounts: {
    openai: AiAccountConnection;
    anthropic: AiAccountConnection;
    google: AiAccountConnection;
    grok: AiAccountConnection;
    deepseek: AiAccountConnection;
    hermes: AiAccountConnection;
    opencode: AiAccountConnection;
    openrouter: AiAccountConnection;
    ninerouter: AiAccountConnection;
  };
  // Custom Model Configuration (Base URL, AI Model, API Key)
  customModel: CustomModelConfig;
  customEndpoint?: string;
  ollamaModel?: string;
  multiAgent: {
    enableDelegation: boolean;
    maxHops: number;
    autoSuggest: boolean;
  };
  vpsServerUrl?: string;
  vpsWebhookUrl?: string;
}

