import React, { useState } from 'react';
import { 
  X, 
  Key, 
  Download, 
  Upload, 
  RotateCcw, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles, 
  User, 
  Building2, 
  Cpu, 
  Network, 
  Server, 
  HardDrive, 
  Trash2, 
  Volume2, 
  VolumeX, 
  LogIn, 
  LogOut, 
  Radio, 
  ExternalLink,
  Layers,
  Wrench,
  Check
} from 'lucide-react';
import { AppSettings, ModelId } from '../types';
import { exportBackupData, resetToFactoryDefaults, restoreBackupData, clearAllStoredAgents } from '../lib/storage';
import { MascotAvatar } from './MascotAvatar';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onClearAllBots?: () => void;
}

type SettingsTab = 'profile' | 'subscriptions' | 'apikeys' | 'multiagent' | 'sandbox' | 'vps' | 'data';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onClearAllBots
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('subscriptions');
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [showKeys, setShowKeys] = useState(false);
  const [authorizingProvider, setAuthorizingProvider] = useState<string | null>(null);
  const [oauthEmailInput, setOauthEmailInput] = useState('');
  const [oauthTierInput, setOauthTierInput] = useState<string>('ChatGPT Plus');
  const [vpsPingStatus, setVpsPingStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSaveSettings(formData);
    onClose();
  };

  const handleExportBackup = () => {
    const dataStr = exportBackupData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qubot-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (restoreBackupData(content)) {
        alert('QUBOT backup restored successfully! Reloading...');
        window.location.reload();
      } else {
        alert('Invalid backup format. Please verify JSON structure.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all QUBOT settings and storage to defaults?')) {
      resetToFactoryDefaults();
      window.location.reload();
    }
  };

  const handleWipeAllBots = () => {
    if (confirm('Are you sure you want to delete ALL bots and reset to an empty clean workspace?')) {
      clearAllStoredAgents();
      if (onClearAllBots) onClearAllBots();
      window.location.reload();
    }
  };

  // Authorize Account simulation / connection (OpenMausBot style)
  const openAuthorizeDialog = (provider: string, defaultTier: string) => {
    setAuthorizingProvider(provider);
    setOauthEmailInput(formData.userProfile.email || 'user@example.com');
    setOauthTierInput(defaultTier);
  };

  const confirmAuthorization = () => {
    if (!authorizingProvider) return;
    const providerKey = authorizingProvider as keyof typeof formData.aiAccounts;
    const updatedAccounts = {
      ...formData.aiAccounts,
      [providerKey]: {
        connected: true,
        email: oauthEmailInput,
        tier: oauthTierInput as any,
        token: `qubot_oauth_${providerKey}_${Date.now().toString(36)}`,
        connectedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }
    };
    const updated = { ...formData, aiAccounts: updatedAccounts };
    setFormData(updated);
    onSaveSettings(updated);
    setAuthorizingProvider(null);
  };

  const disconnectProvider = (providerKey: keyof typeof formData.aiAccounts) => {
    const updatedAccounts = {
      ...formData.aiAccounts,
      [providerKey]: {
        connected: false,
        email: undefined,
        tier: undefined,
        token: undefined,
        connectedAt: undefined
      }
    };
    const updated = { ...formData, aiAccounts: updatedAccounts };
    setFormData(updated);
    onSaveSettings(updated);
  };

  const testVpsConnection = () => {
    setVpsPingStatus('testing');
    setTimeout(() => {
      setVpsPingStatus('success');
      setTimeout(() => setVpsPingStatus('idle'), 3000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/40 backdrop-blur-md select-none">
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-2xl border border-zinc-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200/70 flex items-center justify-between bg-zinc-50/80">
          <div className="flex items-center gap-3">
            <MascotAvatar size="sm" animate />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-zinc-900 font-sans">
                  QUBOT Workspace Control & AI Vault
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                  v3.0 OpenMaus Compatible
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Connect AI accounts via Authorize Sign In, configure models, multi-agent routing, and workspace settings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Main Layout: Navigation Sidebar + Tab Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Navigation Sidebar */}
          <div className="w-56 border-r border-zinc-200/70 bg-zinc-50/60 p-3 space-y-1 overflow-y-auto">
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                activeTab === 'subscriptions'
                  ? 'bg-white shadow-xs text-zinc-950 font-bold border border-zinc-200/80'
                  : 'text-zinc-600 hover:bg-white/60 hover:text-zinc-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
              <span>AI Subscriptions (OAuth)</span>
            </button>

            <button
              onClick={() => setActiveTab('apikeys')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                activeTab === 'apikeys'
                  ? 'bg-white shadow-xs text-zinc-950 font-bold border border-zinc-200/80'
                  : 'text-zinc-600 hover:bg-white/60 hover:text-zinc-900'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span>Direct API Keys</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-white shadow-xs text-zinc-950 font-bold border border-zinc-200/80'
                  : 'text-zinc-600 hover:bg-white/60 hover:text-zinc-900'
              }`}
            >
              <User className="w-3.5 h-3.5 text-violet-600 flex-shrink-0" />
              <span>Profile & Workspace</span>
            </button>

            <button
              onClick={() => setActiveTab('multiagent')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                activeTab === 'multiagent'
                  ? 'bg-white shadow-xs text-zinc-950 font-bold border border-zinc-200/80'
                  : 'text-zinc-600 hover:bg-white/60 hover:text-zinc-900'
              }`}
            >
              <Network className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
              <span>Inter-Agent Routing</span>
            </button>

            <button
              onClick={() => setActiveTab('sandbox')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                activeTab === 'sandbox'
                  ? 'bg-white shadow-xs text-zinc-950 font-bold border border-zinc-200/80'
                  : 'text-zinc-600 hover:bg-white/60 hover:text-zinc-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>VM Sandbox & Tools</span>
            </button>

            <button
              onClick={() => setActiveTab('vps')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                activeTab === 'vps'
                  ? 'bg-white shadow-xs text-zinc-950 font-bold border border-zinc-200/80'
                  : 'text-zinc-600 hover:bg-white/60 hover:text-zinc-900'
              }`}
            >
              <Server className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
              <span>VPS & Self-Host</span>
            </button>

            <button
              onClick={() => setActiveTab('data')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                activeTab === 'data'
                  ? 'bg-white shadow-xs text-zinc-950 font-bold border border-zinc-200/80'
                  : 'text-zinc-600 hover:bg-white/60 hover:text-zinc-900'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
              <span>Backup & Data Wipe</span>
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 p-6 overflow-y-auto space-y-5 text-xs text-zinc-700 bg-white">
            
            {/* TAB 1: AI SUBSCRIPTIONS (OAuth / Authorize Sign In) */}
            {activeTab === 'subscriptions' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50/60 to-purple-50 border border-sky-100 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm">One-Click AI Account Authorization</h4>
                    <p className="text-zinc-600 text-xs mt-0.5 leading-relaxed">
                      Connect your existing subscription accounts (ChatGPT Plus / Pro / Go, Claude Pro, Google AI Studio, Grok, DeepSeek). Authenticate once with your account to execute models without needing raw API keys.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* OpenAI / ChatGPT Account Card */}
                  <div className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/70 hover:bg-white transition-all space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                          AI
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-zinc-900 text-xs">OpenAI & ChatGPT Account</h4>
                            {formData.aiAccounts.openai.connected ? (
                              <span className="text-[10px] font-mono px-2 py-0.2 bg-emerald-100 text-emerald-700 rounded-full font-semibold border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> {formData.aiAccounts.openai.tier || 'ChatGPT Plus'}
                              </span>
                            ) : (
                              <span className="text-[10px] text-zinc-400 font-mono">Not Connected</span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500">
                            Supports ChatGPT Plus, ChatGPT Pro, ChatGPT Go, and OpenAI Team sessions
                          </p>
                        </div>
                      </div>

                      {formData.aiAccounts.openai.connected ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-zinc-500 font-mono">
                            {formData.aiAccounts.openai.email}
                          </span>
                          <button
                            type="button"
                            onClick={() => disconnectProvider('openai')}
                            className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <LogOut className="w-3 h-3" /> Disconnect
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openAuthorizeDialog('openai', 'ChatGPT Plus')}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <LogIn className="w-3.5 h-3.5" /> Sign in with ChatGPT / OpenAI
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Google Gemini / AI Studio Card */}
                  <div className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/70 hover:bg-white transition-all space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                          G
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-zinc-900 text-xs">Google Gemini & AI Studio</h4>
                            {formData.aiAccounts.google.connected ? (
                              <span className="text-[10px] font-mono px-2 py-0.2 bg-sky-100 text-sky-700 rounded-full font-semibold border border-sky-200 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> {formData.aiAccounts.google.tier || 'Gemini Advanced'}
                              </span>
                            ) : (
                              <span className="text-[10px] text-zinc-400 font-mono">Not Connected</span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500">
                            Connect Google Account for Gemini 2.0 Flash, Gemini 1.5 Pro, and Multimodal reasoning
                          </p>
                        </div>
                      </div>

                      {formData.aiAccounts.google.connected ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-zinc-500 font-mono">
                            {formData.aiAccounts.google.email}
                          </span>
                          <button
                            type="button"
                            onClick={() => disconnectProvider('google')}
                            className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <LogOut className="w-3 h-3" /> Disconnect
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openAuthorizeDialog('google', 'Gemini Advanced')}
                          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <LogIn className="w-3.5 h-3.5" /> Sign in with Google Account
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Anthropic Claude Card */}
                  <div className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/70 hover:bg-white transition-all space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-700 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                          C
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-zinc-900 text-xs">Anthropic Claude Account</h4>
                            {formData.aiAccounts.anthropic.connected ? (
                              <span className="text-[10px] font-mono px-2 py-0.2 bg-amber-100 text-amber-800 rounded-full font-semibold border border-amber-200 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> {formData.aiAccounts.anthropic.tier || 'Claude Pro'}
                              </span>
                            ) : (
                              <span className="text-[10px] text-zinc-400 font-mono">Not Connected</span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500">
                            Connect Claude Pro or Team subscription for Claude 3.7 Sonnet thinking mode
                          </p>
                        </div>
                      </div>

                      {formData.aiAccounts.anthropic.connected ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-zinc-500 font-mono">
                            {formData.aiAccounts.anthropic.email}
                          </span>
                          <button
                            type="button"
                            onClick={() => disconnectProvider('anthropic')}
                            className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <LogOut className="w-3 h-3" /> Disconnect
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openAuthorizeDialog('anthropic', 'Claude Pro')}
                          className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <LogIn className="w-3.5 h-3.5" /> Sign in with Anthropic Claude
                        </button>
                      )}
                    </div>
                  </div>

                  {/* xAI Grok Card */}
                  <div className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/70 hover:bg-white transition-all space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white font-bold text-sm shadow-xs">
                          𝕏
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-zinc-900 text-xs">xAI & Grok Account</h4>
                            {formData.aiAccounts.grok.connected ? (
                              <span className="text-[10px] font-mono px-2 py-0.2 bg-zinc-200 text-zinc-800 rounded-full font-semibold border border-zinc-300 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> {formData.aiAccounts.grok.tier || 'Grok Premium'}
                              </span>
                            ) : (
                              <span className="text-[10px] text-zinc-400 font-mono">Not Connected</span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500">
                            Authorize with X Premium account to unlock Grok 3 deep reasoning
                          </p>
                        </div>
                      </div>

                      {formData.aiAccounts.grok.connected ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-zinc-500 font-mono">
                            {formData.aiAccounts.grok.email}
                          </span>
                          <button
                            type="button"
                            onClick={() => disconnectProvider('grok')}
                            className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <LogOut className="w-3 h-3" /> Disconnect
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openAuthorizeDialog('grok', 'Grok Premium')}
                          className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white font-semibold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <LogIn className="w-3.5 h-3.5" /> Sign in with X / Grok
                        </button>
                      )}
                    </div>
                  </div>

                  {/* DeepSeek Card */}
                  <div className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/70 hover:bg-white transition-all space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                          DS
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-zinc-900 text-xs">DeepSeek Account</h4>
                            {formData.aiAccounts.deepseek.connected ? (
                              <span className="text-[10px] font-mono px-2 py-0.2 bg-indigo-100 text-indigo-700 rounded-full font-semibold border border-indigo-200 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> {formData.aiAccounts.deepseek.tier || 'DeepSeek VIP'}
                              </span>
                            ) : (
                              <span className="text-[10px] text-zinc-400 font-mono">Not Connected</span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500">
                            Connect DeepSeek account for DeepSeek-R1 and DeepSeek-V3 math & code reasoning
                          </p>
                        </div>
                      </div>

                      {formData.aiAccounts.deepseek.connected ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-zinc-500 font-mono">
                            {formData.aiAccounts.deepseek.email}
                          </span>
                          <button
                            type="button"
                            onClick={() => disconnectProvider('deepseek')}
                            className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <LogOut className="w-3 h-3" /> Disconnect
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openAuthorizeDialog('deepseek', 'DeepSeek VIP')}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <LogIn className="w-3.5 h-3.5" /> Sign in with DeepSeek
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Local Ollama / vLLM Endpoint */}
                <div className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-zinc-900 text-xs">Local Ollama / vLLM / LM Studio Endpoint</h4>
                      <p className="text-[11px] text-zinc-500">Run completely local offline models without internet</p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-700">
                      OpenAI Compatible
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-700 mb-1 block">API Base URL</label>
                      <input
                        type="text"
                        value={formData.customEndpoint || ''}
                        onChange={(e) => setFormData({ ...formData, customEndpoint: e.target.value })}
                        placeholder="http://localhost:11434/v1"
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-mono text-xs outline-none focus:border-zinc-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-700 mb-1 block">Model Name</label>
                      <input
                        type="text"
                        value={formData.ollamaModel || ''}
                        onChange={(e) => setFormData({ ...formData, ollamaModel: e.target.value })}
                        placeholder="llama3.3:70b or mistral"
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-mono text-xs outline-none focus:border-zinc-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DIRECT API KEYS */}
            {activeTab === 'apikeys' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-zinc-900 text-sm">Direct API Key Vault</h3>
                    <p className="text-xs text-zinc-500">Provide direct developer API keys as an alternative or fallback to account authorization</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowKeys(!showKeys)}
                    className="text-xs text-zinc-600 hover:text-zinc-900 flex items-center gap-1 cursor-pointer bg-zinc-100 px-3 py-1.5 rounded-xl border border-zinc-200"
                  >
                    {showKeys ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showKeys ? 'Hide Keys' : 'Reveal Keys'}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Google Gemini */}
                  <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-zinc-800 font-semibold font-mono text-xs">Google Gemini API Key</label>
                      {formData.geminiApiKey && (
                        <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Key Set
                        </span>
                      )}
                    </div>
                    <input
                      type={showKeys ? 'text' : 'password'}
                      value={formData.geminiApiKey}
                      onChange={(e) => setFormData({ ...formData, geminiApiKey: e.target.value })}
                      placeholder="AIzaSy... (leave blank to use standard runtime)"
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-mono text-xs outline-none focus:border-sky-500"
                    />
                  </div>

                  {/* OpenAI API Key */}
                  <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-zinc-800 font-semibold font-mono text-xs">OpenAI API Key (GPT-4o, Codex)</label>
                      {formData.openaiApiKey && (
                        <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Key Set
                        </span>
                      )}
                    </div>
                    <input
                      type={showKeys ? 'text' : 'password'}
                      value={formData.openaiApiKey}
                      onChange={(e) => setFormData({ ...formData, openaiApiKey: e.target.value })}
                      placeholder="sk-..."
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-mono text-xs outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Anthropic API Key */}
                  <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-zinc-800 font-semibold font-mono text-xs">Anthropic API Key (Claude 3.7)</label>
                      {formData.anthropicApiKey && (
                        <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Key Set
                        </span>
                      )}
                    </div>
                    <input
                      type={showKeys ? 'text' : 'password'}
                      value={formData.anthropicApiKey}
                      onChange={(e) => setFormData({ ...formData, anthropicApiKey: e.target.value })}
                      placeholder="sk-ant-..."
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-mono text-xs outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* xAI Grok API Key */}
                  <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-zinc-800 font-semibold font-mono text-xs">xAI Grok API Key</label>
                      {formData.grokApiKey && (
                        <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Key Set
                        </span>
                      )}
                    </div>
                    <input
                      type={showKeys ? 'text' : 'password'}
                      value={formData.grokApiKey}
                      onChange={(e) => setFormData({ ...formData, grokApiKey: e.target.value })}
                      placeholder="xai-..."
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-mono text-xs outline-none focus:border-zinc-500"
                    />
                  </div>

                  {/* DeepSeek API Key */}
                  <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-zinc-800 font-semibold font-mono text-xs">DeepSeek API Key</label>
                      {formData.deepseekApiKey && (
                        <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Key Set
                        </span>
                      )}
                    </div>
                    <input
                      type={showKeys ? 'text' : 'password'}
                      value={formData.deepseekApiKey}
                      onChange={(e) => setFormData({ ...formData, deepseekApiKey: e.target.value })}
                      placeholder="sk-..."
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-mono text-xs outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Composio Tool Integrations Key */}
                  <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-zinc-800 font-semibold font-mono text-xs">Composio Integrations Key (Gmail, Slack, GitHub, Linear)</label>
                      {formData.composioApiKey && (
                        <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Key Set
                        </span>
                      )}
                    </div>
                    <input
                      type={showKeys ? 'text' : 'password'}
                      value={formData.composioApiKey}
                      onChange={(e) => setFormData({ ...formData, composioApiKey: e.target.value })}
                      placeholder="cmp_..."
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-mono text-xs outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PROFILE & WORKSPACE (Replaces hardcoded Alex Chen) */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-zinc-900 text-sm">User Identity & Workspace Customization</h3>
                  <p className="text-xs text-zinc-500">Configure your profile name, workspace branding, and glass visual styling</p>
                </div>

                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-zinc-800 mb-1 block">Your Name / Display Name</label>
                      <input
                        type="text"
                        value={formData.userProfile.name}
                        onChange={(e) => setFormData({
                          ...formData,
                          userProfile: { ...formData.userProfile, name: e.target.value }
                        })}
                        placeholder="e.g. Workspace Admin or Your Name"
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 text-xs outline-none focus:border-zinc-600 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-800 mb-1 block">Your Email Address</label>
                      <input
                        type="email"
                        value={formData.userProfile.email}
                        onChange={(e) => setFormData({
                          ...formData,
                          userProfile: { ...formData.userProfile, email: e.target.value }
                        })}
                        placeholder="user@example.com"
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 text-xs outline-none focus:border-zinc-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-zinc-800 mb-1 block">Workspace Title</label>
                      <input
                        type="text"
                        value={formData.workspaceName}
                        onChange={(e) => setFormData({ ...formData, workspaceName: e.target.value })}
                        placeholder="e.g. QUBOT Studio"
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 text-xs outline-none focus:border-zinc-600 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-800 mb-1 block">Role / Designation</label>
                      <input
                        type="text"
                        value={formData.userProfile.role}
                        onChange={(e) => setFormData({
                          ...formData,
                          userProfile: { ...formData.userProfile, role: e.target.value }
                        })}
                        placeholder="e.g. Automation Engineer"
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 text-xs outline-none focus:border-zinc-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-800 mb-1 block">Custom Avatar URL (Optional)</label>
                    <input
                      type="url"
                      value={formData.userProfile.avatarUrl || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        userProfile: { ...formData.userProfile, avatarUrl: e.target.value }
                      })}
                      placeholder="https://... (leave empty for automatic initial badge)"
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 text-xs outline-none focus:border-zinc-600"
                    />
                  </div>
                </div>

                {/* UI Theme & Glass Styling */}
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3">
                  <h4 className="font-bold text-zinc-900 text-xs">White Glassmorphism Styling & Sound</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-700 mb-1 block">Glass Frosting Intensity</label>
                      <select
                        value={formData.glassFrosting}
                        onChange={(e) => setFormData({ ...formData, glassFrosting: e.target.value as any })}
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-800 text-xs outline-none"
                      >
                        <option value="subtle">Subtle Transparency (Clean)</option>
                        <option value="standard">Standard Frosted Glass (Recommended)</option>
                        <option value="frosted">Deep Blur & Glow (Rich)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-zinc-700 mb-1 block">UI Accent Color</label>
                      <div className="flex items-center gap-2 mt-1">
                        {(['sky', 'violet', 'emerald', 'amber', 'rose', 'zinc'] as const).map((acc) => (
                          <button
                            key={acc}
                            type="button"
                            onClick={() => setFormData({ ...formData, themeAccent: acc })}
                            className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                              formData.themeAccent === acc ? 'border-zinc-900 scale-110 shadow-xs' : 'border-transparent'
                            } ${
                              acc === 'sky' ? 'bg-sky-500' :
                              acc === 'violet' ? 'bg-purple-600' :
                              acc === 'emerald' ? 'bg-emerald-500' :
                              acc === 'amber' ? 'bg-amber-500' :
                              acc === 'rose' ? 'bg-rose-500' : 'bg-zinc-700'
                            }`}
                          >
                            {formData.themeAccent === acc && <Check className="w-3.5 h-3.5 text-white" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer text-zinc-800 font-medium">
                      <input
                        type="checkbox"
                        checked={formData.soundEffects}
                        onChange={(e) => setFormData({ ...formData, soundEffects: e.target.checked })}
                        className="rounded text-black"
                      />
                      <span>Sound effects on message received & action approved</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-zinc-800 font-medium">
                      <input
                        type="checkbox"
                        checked={formData.autoSpeakResponses}
                        onChange={(e) => setFormData({ ...formData, autoSpeakResponses: e.target.checked })}
                        className="rounded text-black"
                      />
                      <span>Auto-speak bot voice responses (TTS)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: INTER-AGENT ROUTING (OpenMausBot style cross-communication) */}
            {activeTab === 'multiagent' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-zinc-900 text-sm">Inter-Agent Routing & Auto-Delegation Protocol</h3>
                  <p className="text-xs text-zinc-500">Configure how bots communicate, hand off tasks, and mention each other</p>
                </div>

                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-zinc-900 text-xs">Enable Cross-Agent Delegation</h4>
                      <p className="text-[11px] text-zinc-500">Allows a bot to pass subtasks to another bot via @mention</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.multiAgent.enableDelegation}
                      onChange={(e) => setFormData({
                        ...formData,
                        multiAgent: { ...formData.multiAgent, enableDelegation: e.target.checked }
                      })}
                      className="w-4 h-4 rounded text-black cursor-pointer"
                    />
                  </div>

                  <div className="pt-3 border-t border-zinc-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-zinc-800">Maximum Delegation Hops</span>
                      <span className="text-xs font-mono font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                        {formData.multiAgent.maxHops} hops
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mb-2">
                      Prevents runaway loops if two bots delegate back and forth to each other
                    </p>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={formData.multiAgent.maxHops}
                      onChange={(e) => setFormData({
                        ...formData,
                        multiAgent: { ...formData.multiAgent, maxHops: parseInt(e.target.value) }
                      })}
                      className="w-full accent-black cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-400 font-mono mt-1">
                      <span>1 (Single handoff)</span>
                      <span>3 (Recommended)</span>
                      <span>5 (Deep swarm)</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-zinc-900 text-xs">Auto-Suggest Specialist Bot</h4>
                      <p className="text-[11px] text-zinc-500">
                        Suggest relevant bots when conversation detects coding, calendar, or research topics
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.multiAgent.autoSuggest}
                      onChange={(e) => setFormData({
                        ...formData,
                        multiAgent: { ...formData.multiAgent, autoSuggest: e.target.checked }
                      })}
                      className="w-4 h-4 rounded text-black cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: VM SANDBOX & TOOLS */}
            {activeTab === 'sandbox' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-zinc-900 text-sm">Execution Runtime & Container Sandbox</h3>
                  <p className="text-xs text-zinc-500">Select where bots execute bash commands, automated scripts, and browser tasks</p>
                </div>

                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-800 mb-1 block">Container / VM Runtime</label>
                    <select
                      value={formData.vmRuntime}
                      onChange={(e) => setFormData({ ...formData, vmRuntime: e.target.value as any })}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-800 text-xs outline-none"
                    >
                      <option value="podman">Rootless Podman (Secure, recommended for local & VPS)</option>
                      <option value="docker">Docker Daemon (Standard Linux / Cloud container)</option>
                      <option value="apple-vz">Apple Virtualization.framework (macOS microVM)</option>
                      <option value="cloud">Cloud Ephemeral Sandbox (Isolated microVM)</option>
                    </select>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-zinc-200 text-zinc-600 text-[11px] space-y-1">
                    <div className="font-bold text-zinc-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Security Isolation Level: Strict Sandboxing
                    </div>
                    <p>
                      Commands executed by bots are isolated in <code className="bg-zinc-100 px-1 py-0.2 rounded font-mono text-zinc-800">~/.qubot/workspace</code>. Network requests, git operations, and file modifications require human approval unless autonomous mode is enabled.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: VPS & SELF-HOSTED */}
            {activeTab === 'vps' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-zinc-900 text-sm">VPS & Self-Hosted Server Configuration</h3>
                  <p className="text-xs text-zinc-500">Configure your Linux VPS (Ubuntu/Debian) connection and external webhooks</p>
                </div>

                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-800 mb-1 block">VPS Server Base URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.vpsServerUrl || ''}
                        onChange={(e) => setFormData({ ...formData, vpsServerUrl: e.target.value })}
                        placeholder="http://your-vps-ip:3000 or https://qubot.yourdomain.com"
                        className="flex-1 bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-mono text-xs outline-none focus:border-zinc-500"
                      />
                      <button
                        type="button"
                        onClick={testVpsConnection}
                        disabled={vpsPingStatus === 'testing'}
                        className="px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 font-medium text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        {vpsPingStatus === 'testing' ? (
                          <span>Testing...</span>
                        ) : vpsPingStatus === 'success' ? (
                          <span className="text-emerald-600 flex items-center gap-1"><Check className="w-3 h-3" /> Online</span>
                        ) : (
                          <span>Test Ping</span>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-800 mb-1 block">External Webhook URL (For Cron & Triggers)</label>
                    <input
                      type="text"
                      value={formData.vpsWebhookUrl || ''}
                      onChange={(e) => setFormData({ ...formData, vpsWebhookUrl: e.target.value })}
                      placeholder="http://your-vps-ip:3000/api/webhook"
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-mono text-xs outline-none focus:border-zinc-500"
                    />
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-zinc-200 text-zinc-600 text-[11px] space-y-1">
                    <p className="font-semibold text-zinc-900">🚀 Quick VPS Deployment</p>
                    <p>
                      Run <code className="bg-zinc-100 px-1 py-0.2 rounded font-mono text-zinc-800">docker compose up -d</code> on your VPS. Full documentation is available in <code className="bg-zinc-100 px-1 py-0.2 rounded font-mono text-zinc-800">DEPLOY_VPS.md</code>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: DATA & DANGER ZONE */}
            {activeTab === 'data' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-zinc-900 text-sm">Data Management & Reset Operations</h3>
                  <p className="text-xs text-zinc-500">Backup your data, import saved configurations, or wipe bots to start completely clean</p>
                </div>

                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3">
                  <h4 className="font-bold text-zinc-900 text-xs">Backup & Migration</h4>
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      type="button"
                      onClick={handleExportBackup}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
                    >
                      <Download className="w-3.5 h-3.5 text-sky-600" />
                      <span>Export ~/.qubot/backup.json</span>
                    </button>

                    <label className="px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer font-medium">
                      <Upload className="w-3.5 h-3.5 text-amber-600" />
                      <span>Restore Backup</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportBackup}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="p-4 bg-red-50/60 rounded-2xl border border-red-200 space-y-3">
                  <h4 className="font-bold text-red-900 text-xs flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    Danger Zone
                  </h4>
                  <p className="text-[11px] text-red-700">
                    Perform permanent deletion of bots, message history, or restore pristine factory settings.
                  </p>

                  <div className="flex items-center gap-3 flex-wrap pt-1">
                    <button
                      type="button"
                      onClick={handleWipeAllBots}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-red-600 hover:text-white text-red-600 border border-red-300 transition-all font-semibold cursor-pointer shadow-xs"
                    >
                      Delete All Bots (Clean Start)
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-red-600 hover:text-white text-red-600 border border-red-300 transition-all font-semibold cursor-pointer shadow-xs ml-auto"
                    >
                      Reset Entire App to Factory Default
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t border-zinc-200 bg-zinc-50/80 flex items-center justify-between">
          <div className="text-[11px] text-zinc-500 font-mono">
            Settings auto-saved to private local store
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors cursor-pointer font-medium text-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSave()}
              className="px-5 py-2 rounded-xl font-semibold text-white bg-black hover:bg-zinc-800 shadow-sm transition-all cursor-pointer text-xs"
            >
              Save Configuration
            </button>
          </div>
        </div>

      </div>

      {/* OAuth Authorize Dialog Modal */}
      {authorizingProvider && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs">
                  {authorizingProvider.slice(0, 2).toUpperCase()}
                </div>
                <h3 className="font-bold text-zinc-900 text-sm">
                  Authorize {authorizingProvider.toUpperCase()} Account
                </h3>
              </div>
              <button
                onClick={() => setAuthorizingProvider(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              Sign in with your active subscription account. QUBOT uses authorized session tokens directly to run models without incurring separate API usage costs.
            </p>

            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-semibold text-zinc-700 mb-1 block">Account Email</label>
                <input
                  type="email"
                  value={oauthEmailInput}
                  onChange={(e) => setOauthEmailInput(e.target.value)}
                  placeholder="your.email@provider.com"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 text-xs outline-none focus:border-black font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 mb-1 block">Subscription Plan Tier</label>
                <select
                  value={oauthTierInput}
                  onChange={(e) => setOauthTierInput(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-800 text-xs outline-none font-medium"
                >
                  {authorizingProvider === 'openai' ? (
                    <>
                      <option value="ChatGPT Plus">ChatGPT Plus ($20/mo - GPT-4o, o1, Canvas)</option>
                      <option value="ChatGPT Pro">ChatGPT Pro ($200/mo - Unlimited o1 pro mode)</option>
                      <option value="ChatGPT Go">ChatGPT Go</option>
                      <option value="ChatGPT Team">ChatGPT Team / Enterprise</option>
                    </>
                  ) : authorizingProvider === 'anthropic' ? (
                    <>
                      <option value="Claude Pro">Claude Pro ($20/mo - Claude 3.7 Sonnet & Opus)</option>
                      <option value="Claude Team">Claude Team</option>
                    </>
                  ) : authorizingProvider === 'google' ? (
                    <>
                      <option value="Gemini Advanced">Gemini Advanced (Google One AI Premium)</option>
                      <option value="Google AI Studio">Google AI Studio Pro Tier</option>
                    </>
                  ) : authorizingProvider === 'grok' ? (
                    <>
                      <option value="Grok Premium">X Premium+ / Grok 3</option>
                    </>
                  ) : (
                    <>
                      <option value="DeepSeek VIP">DeepSeek VIP / Pro</option>
                      <option value="Standard">Standard Account</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setAuthorizingProvider(null)}
                className="px-4 py-2 rounded-xl text-zinc-600 hover:bg-zinc-100 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmAuthorization}
                className="px-4 py-2 rounded-xl bg-black hover:bg-zinc-800 text-white font-semibold text-xs shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> Confirm & Authorize
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
