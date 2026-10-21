import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Key, 
  Cpu, 
  Download, 
  Upload, 
  RotateCcw, 
  ShieldCheck, 
  HardDrive,
  Eye,
  EyeOff,
  CheckCircle,
  Sparkles,
  Bot
} from 'lucide-react';
import { AppSettings } from '../types';
import { exportBackupData, resetToFactoryDefaults, restoreBackupData } from '../lib/storage';
import { MascotAvatar } from './MascotAvatar';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings
}) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [showKeys, setShowKeys] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
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
    if (confirm('Are you sure you want to reset all QUBOT agents, chat history, and files to factory default?')) {
      resetToFactoryDefaults();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm select-none">
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-2xl border border-zinc-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200/70 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-3">
            <MascotAvatar size="sm" />
            <div>
              <h2 className="text-sm font-bold text-zinc-900 font-sans">
                QUBOT Settings & Multi-Model Vault
              </h2>
              <p className="text-xs text-zinc-500">
                Configure API keys to unlock real models: Gemini, Claude, OpenAI, Grok, DeepSeek
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

        {/* Content Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 text-xs text-zinc-700 flex-1">
          {/* Engine Status Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50/50 to-purple-50 border border-sky-100 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-zinc-900">Universal Multi-Model Engine Architecture</h4>
              <p className="text-zinc-600 text-[11px] mt-0.5 leading-relaxed">
                QUBOT executes models through direct API endpoints or local sandboxes. Transcripts and keys are stored privately at <code className="bg-white/80 px-1 py-0.2 rounded border border-zinc-200 text-zinc-800">~/.qubot/config</code> on your device.
              </p>
            </div>
          </div>

          {/* API Key Management */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-sky-600" />
                AI Model API Keys
              </h3>
              <button
                type="button"
                onClick={() => setShowKeys(!showKeys)}
                className="text-[11px] text-zinc-500 hover:text-zinc-800 flex items-center gap-1 cursor-pointer"
              >
                {showKeys ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showKeys ? 'Hide Keys' : 'Reveal Keys'}</span>
              </button>
            </div>

            <div className="space-y-3">
              {/* Google Gemini */}
              <div className="p-3 bg-zinc-50/90 rounded-2xl border border-zinc-200/70 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-800 font-semibold font-mono text-xs flex items-center gap-1.5">
                    <span>Google Gemini API Key</span>
                    <span className="text-[10px] font-normal text-sky-600 bg-sky-100/70 px-1.5 py-0.2 rounded-full">Default Engine</span>
                  </label>
                  {formData.geminiApiKey && (
                    <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Ready
                    </span>
                  )}
                </div>
                <input
                  type={showKeys ? 'text' : 'password'}
                  value={formData.geminiApiKey}
                  onChange={(e) => setFormData({ ...formData, geminiApiKey: e.target.value })}
                  placeholder="AIzaSy... (uses runtime key if empty)"
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-mono text-xs outline-none focus:border-sky-500"
                />
              </div>

              {/* Anthropic Claude */}
              <div className="p-3 bg-zinc-50/90 rounded-2xl border border-zinc-200/70 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-800 font-semibold font-mono text-xs">Anthropic Claude API Key</label>
                  {formData.anthropicApiKey && (
                    <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Ready
                    </span>
                  )}
                </div>
                <input
                  type={showKeys ? 'text' : 'password'}
                  value={formData.anthropicApiKey}
                  onChange={(e) => setFormData({ ...formData, anthropicApiKey: e.target.value })}
                  placeholder="sk-ant-... (for Claude 3.7 Sonnet)"
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-mono text-xs outline-none focus:border-sky-500"
                />
              </div>

              {/* OpenAI / GPT-4o */}
              <div className="p-3 bg-zinc-50/90 rounded-2xl border border-zinc-200/70 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-800 font-semibold font-mono text-xs">OpenAI API Key</label>
                  {formData.openaiApiKey && (
                    <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Ready
                    </span>
                  )}
                </div>
                <input
                  type={showKeys ? 'text' : 'password'}
                  value={formData.openaiApiKey}
                  onChange={(e) => setFormData({ ...formData, openaiApiKey: e.target.value })}
                  placeholder="sk-... (for GPT-4o & Codex)"
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-mono text-xs outline-none focus:border-sky-500"
                />
              </div>

              {/* xAI Grok */}
              <div className="p-3 bg-zinc-50/90 rounded-2xl border border-zinc-200/70 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-800 font-semibold font-mono text-xs">xAI Grok API Key</label>
                  {formData.grokApiKey && (
                    <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Ready
                    </span>
                  )}
                </div>
                <input
                  type={showKeys ? 'text' : 'password'}
                  value={formData.grokApiKey}
                  onChange={(e) => setFormData({ ...formData, grokApiKey: e.target.value })}
                  placeholder="xai-... (for Grok 3)"
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-mono text-xs outline-none focus:border-sky-500"
                />
              </div>

              {/* Composio API Key */}
              <div className="p-3 bg-zinc-50/90 rounded-2xl border border-zinc-200/70 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-800 font-semibold font-mono text-xs">Composio Integrations Key</label>
                  {formData.composioApiKey && (
                    <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Connected
                    </span>
                  )}
                </div>
                <input
                  type={showKeys ? 'text' : 'password'}
                  value={formData.composioApiKey}
                  onChange={(e) => setFormData({ ...formData, composioApiKey: e.target.value })}
                  placeholder="cmp_... (for extended app connections)"
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-mono text-xs outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Backup & Data Sovereignty */}
          <div className="space-y-3 pt-2 border-t border-zinc-200/70">
            <h3 className="font-bold text-zinc-900 flex items-center gap-2">
              <HardDrive className="w-3.5 h-3.5 text-zinc-600" />
              Backup & Migration
            </h3>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={handleExportBackup}
                className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-sky-600" />
                <span>Export ~/.qubot/backup.json</span>
              </button>

              <label className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-amber-600" />
                <span>Restore Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-2 rounded-xl hover:bg-red-50 text-zinc-600 hover:text-red-600 border border-zinc-200 transition-colors ml-auto cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                Reset Defaults
              </button>
            </div>
          </div>

          {/* Footer Save Button */}
          <div className="pt-4 border-t border-zinc-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl font-semibold text-white bg-black hover:bg-zinc-800 shadow-sm transition-all cursor-pointer"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
