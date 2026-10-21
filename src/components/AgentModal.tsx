import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Agent, ApprovalPolicy, EnvironmentType, MascotColorPreset, ModelId } from '../types';
import { MascotAvatar, MASCOT_COLOR_PRESETS } from './MascotAvatar';

interface AgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAgent: (newAgent: Agent) => void;
}

export const AgentModal: React.FC<AgentModalProps> = ({
  isOpen,
  onClose,
  onSaveAgent
}) => {
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [role, setRole] = useState('');
  const [tagline, setTagline] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [model, setModel] = useState<ModelId>('gemini-3.8-flash');
  const [environment, setEnvironment] = useState<EnvironmentType>('docker-sandbox');
  const [approvalPolicy, setApprovalPolicy] = useState<ApprovalPolicy>('approval-required');
  const [category, setCategory] = useState<'core' | 'engineering' | 'operations' | 'research' | 'personal'>('engineering');
  const [selectedTools, setSelectedTools] = useState<string[]>(['bash', 'filesystem', 'browser']);
  
  // Mascot Color customization state
  const [mascotColor, setMascotColor] = useState<MascotColorPreset>('blue');
  const [customHue, setCustomHue] = useState<number | undefined>(undefined);
  const [useCustomSlider, setUseCustomSlider] = useState(false);

  if (!isOpen) return null;

  const allTools = [
    { id: 'bash', name: 'Terminal & Bash' },
    { id: 'filesystem', name: 'File System' },
    { id: 'browser', name: 'Headless Browser' },
    { id: 'gmail', name: 'Google Mail' },
    { id: 'calendar', name: 'Google Calendar' },
    { id: 'github', name: 'GitHub' },
    { id: 'slack', name: 'Slack Team' },
    { id: 'notion', name: 'Notion Workspace' }
  ];

  const toggleTool = (toolId: string) => {
    setSelectedTools(prev => 
      prev.includes(toolId) ? prev.filter(t => t !== toolId) : [...prev, toolId]
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newAgent: Agent = {
      id: `agent-custom-${Date.now()}`,
      name: name.trim(),
      handle: handle.trim() ? (handle.startsWith('@') ? handle : `@${handle}`) : `@${name.toLowerCase().replace(/\s+/g, '_')}`,
      avatar: '🦉',
      mascotColor,
      mascotHueShift: useCustomSlider ? customHue : undefined,
      role: role.trim() || 'General Automation Assistant',
      tagline: tagline.trim() || 'Custom automated task runner',
      systemPrompt: systemPrompt.trim() || `You are ${name}, an autonomous agent assistant inside QUBOT.`,
      model,
      environment,
      approvalPolicy,
      status: 'active',
      statusMessage: 'Ready for operations',
      category,
      enabledTools: selectedTools,
      lastActive: 'Just now',
      unreadCount: 0,
      tokensUsed: 0,
      memoryItems: [
        `Created on ${new Date().toLocaleDateString()}`,
        `Environment: ${environment}`,
        `Model: ${model}`
      ]
    };

    onSaveAgent(newAgent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm select-none">
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-2xl border border-zinc-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200/70 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-3">
            <MascotAvatar colorPreset={mascotColor} customHue={useCustomSlider ? customHue : undefined} size="sm" />
            <div>
              <h2 className="text-sm font-bold text-zinc-900">Create New AI Agent Bot</h2>
              <p className="text-xs text-zinc-500">Deploy an independent agent with custom mascot color, memory, and tools</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleCreate} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs text-zinc-700">
          {/* Mascot Color Customization Section */}
          <div className="p-4 rounded-2xl bg-zinc-50/90 border border-zinc-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-zinc-800 font-bold text-xs">Mascot Avatar & Color Palette</label>
                <p className="text-[11px] text-zinc-500">Uses your official cyber owl with instant real-time dynamic tinting</p>
              </div>

              {/* Live Preview of the Cyber Owl */}
              <div className="p-2 bg-white rounded-2xl border border-zinc-200 shadow-xs flex items-center gap-2">
                <MascotAvatar 
                  colorPreset={mascotColor} 
                  customHue={useCustomSlider ? customHue : undefined} 
                  size="lg" 
                  glow
                />
                <div className="text-right pr-1">
                  <div className="font-bold text-xs text-zinc-900">{MASCOT_COLOR_PRESETS.find(p => p.id === mascotColor)?.name}</div>
                  <div className="text-[10px] text-zinc-400 font-mono">
                    {useCustomSlider ? `Hue: ${customHue}°` : 'Preset'}
                  </div>
                </div>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 pt-1">
              {MASCOT_COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setMascotColor(preset.id);
                    setUseCustomSlider(false);
                  }}
                  className={`flex flex-col items-center gap-1 p-1.5 rounded-xl border transition-all cursor-pointer ${
                    !useCustomSlider && mascotColor === preset.id
                      ? 'border-zinc-900 bg-white ring-2 ring-zinc-900/20 shadow-xs'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                  title={preset.name}
                >
                  <span 
                    className="w-5 h-5 rounded-full border border-black/10 shadow-2xs flex items-center justify-center text-white text-[10px]"
                    style={{ backgroundColor: preset.hex }}
                  >
                    {!useCustomSlider && mascotColor === preset.id && '✓'}
                  </span>
                  <span className="text-[9px] font-medium text-zinc-600 truncate max-w-[50px]">
                    {preset.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>

            {/* Optional Custom Hue Slider */}
            <div className="pt-2 border-t border-zinc-200/60 flex items-center gap-3">
              <label className="text-[11px] font-medium text-zinc-600 flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCustomSlider}
                  onChange={(e) => {
                    setUseCustomSlider(e.target.checked);
                    if (e.target.checked && customHue === undefined) setCustomHue(180);
                  }}
                  className="rounded text-black"
                />
                <span>Fine-tune custom 360° color wheel</span>
              </label>

              {useCustomSlider && (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={customHue ?? 180}
                    onChange={(e) => setCustomHue(Number(e.target.value))}
                    className="w-full accent-black cursor-pointer"
                  />
                  <span className="font-mono text-[10px] text-zinc-600 w-8 text-right">{customHue}°</span>
                </div>
              )}
            </div>
          </div>

          {/* Name & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-700 font-semibold mb-1">Agent Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Atlas, Sentinel, Code Lead"
                className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="block text-zinc-700 font-semibold mb-1">Role / Job Title</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Fullstack Engineer & Systems Auditor"
                className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-700 font-semibold mb-1">Short Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Scans repos, runs tests, and automates PR creation"
              className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-zinc-700 font-semibold mb-1">Assigned AI Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value as ModelId)}
                className="w-full bg-white border border-zinc-200 rounded-xl px-2.5 py-2 text-zinc-800 font-mono outline-none"
              >
                <option value="gemini-3.8-flash">Gemini 3.8 Flash</option>
                <option value="gemini-4-argon">Gemini 4 Argon</option>
                <option value="claude-3-7-sonnet">Claude 3.7 Sonnet</option>
                <option value="gpt-4o">GPT-4o (OpenAI)</option>
                <option value="grok-3">Grok 3 (xAI)</option>
                <option value="deepseek-r1">DeepSeek R1</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-700 font-semibold mb-1">VM Sandbox Environment</label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as EnvironmentType)}
                className="w-full bg-white border border-zinc-200 rounded-xl px-2.5 py-2 text-zinc-800 font-mono outline-none"
              >
                <option value="docker-sandbox">Podman / Docker Sandbox</option>
                <option value="local-mac">Local Machine (~/.qubot)</option>
                <option value="cloud-vm">Cloud Linux VM (Ubuntu)</option>
                <option value="headless-browser">Chromium Headless</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-700 font-semibold mb-1">Approval Policy</label>
              <select
                value={approvalPolicy}
                onChange={(e) => setApprovalPolicy(e.target.value as ApprovalPolicy)}
                className="w-full bg-white border border-zinc-200 rounded-xl px-2.5 py-2 text-zinc-800 font-mono outline-none"
              >
                <option value="approval-required">Human-in-the-Loop (Required)</option>
                <option value="autonomous">Autonomous Execution</option>
                <option value="strict-read-only">Strict Read-Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-zinc-700 font-semibold mb-1.5">Enabled Composio Tools</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {allTools.map(tool => {
                const isChecked = selectedTools.includes(tool.id);
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => toggleTool(tool.id)}
                    className={`px-3 py-2 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-zinc-900 border-zinc-900 text-white font-semibold shadow-2xs'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    <span className="truncate">{tool.name}</span>
                    {isChecked && <Check className="w-3.5 h-3.5 text-white flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-zinc-700 font-semibold mb-1">System Instructions & Persona</label>
            <textarea
              rows={3}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Provide custom guidelines, coding style, output formats, and safety boundaries for this bot..."
              className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-zinc-900 placeholder-zinc-400 font-mono text-xs outline-none focus:border-zinc-400"
            />
          </div>

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
              Deploy Bot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
