import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Check, 
  Download, 
  Key, 
  Cpu, 
  Shield, 
  Sparkles, 
  Database,
  Volume2
} from 'lucide-react';
import { Agent, ApprovalPolicy, EnvironmentType, MascotColorPreset, ModelId } from '../types';
import { MascotAvatar, MASCOT_COLOR_PRESETS } from './MascotAvatar';

interface BotProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent;
  onUpdateAgent: (updatedAgent: Agent) => void;
  onDeleteAgent?: (agentId: string) => void;
}

export const BotProfileDrawer: React.FC<BotProfileDrawerProps> = ({
  isOpen,
  onClose,
  agent,
  onUpdateAgent,
  onDeleteAgent
}) => {
  const [activeTab, setActiveTab] = useState<'avatar' | 'memory' | 'model' | 'tools'>('avatar');
  const [mascotColor, setMascotColor] = useState<MascotColorPreset>(agent.mascotColor || 'purple');
  const [mascotHueShift, setMascotHueShift] = useState<number | undefined>(agent.mascotHueShift);
  const [useCustomSlider, setUseCustomSlider] = useState(agent.mascotHueShift !== undefined);
  
  const [name, setName] = useState(agent.name);
  const [role, setRole] = useState(agent.role);
  const [tagline, setTagline] = useState(agent.tagline);
  const [model, setModel] = useState<ModelId>(agent.model);
  const [environment, setEnvironment] = useState<EnvironmentType>(agent.environment);
  const [approvalPolicy, setApprovalPolicy] = useState<ApprovalPolicy>(agent.approvalPolicy);
  const [systemPrompt, setSystemPrompt] = useState(agent.systemPrompt);
  const [memoryItems, setMemoryItems] = useState<string[]>(agent.memoryItems || []);
  const [newMemoryItem, setNewMemoryItem] = useState('');
  
  // Mascot sprite sheet animation preview controls
  const [previewState, setPreviewState] = useState<'idle' | 'working'>('idle');
  const [previewSpeed, setPreviewSpeed] = useState<'calm' | 'normal' | 'fast'>('normal');
  const [previewAnimate, setPreviewAnimate] = useState(true);

  if (!isOpen) return null;

  const handleSave = () => {
    const updated: Agent = {
      ...agent,
      name,
      role,
      tagline,
      model,
      environment,
      approvalPolicy,
      systemPrompt,
      mascotColor,
      mascotHueShift: useCustomSlider ? mascotHueShift : undefined,
      memoryItems
    };
    onUpdateAgent(updated);
    onClose();
  };

  const handleAddMemory = () => {
    if (!newMemoryItem.trim()) return;
    setMemoryItems(prev => [...prev, newMemoryItem.trim()]);
    setNewMemoryItem('');
  };

  const handleDeleteMemory = (index: number) => {
    setMemoryItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleExportBot = () => {
    const dataStr = JSON.stringify(agent, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${agent.handle.replace('@', '')}.qubot.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm select-none">
      <div className="w-full max-w-xl bg-white/95 backdrop-blur-2xl border border-zinc-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200/70 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-3">
            <MascotAvatar colorPreset={mascotColor} customHue={useCustomSlider ? mascotHueShift : undefined} size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-zinc-900 font-sans">{name} Configuration</h2>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-zinc-200 text-zinc-700">
                  {agent.handle}
                </span>
              </div>
              <p className="text-xs text-zinc-500">Edit mascot color, AI model, system prompt & persistent memory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-zinc-200/70 px-6 bg-zinc-50/40 text-xs">
          <button
            onClick={() => setActiveTab('avatar')}
            className={`py-2.5 px-3 font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'avatar' ? 'border-black text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Mascot Color
          </button>
          <button
            onClick={() => setActiveTab('memory')}
            className={`py-2.5 px-3 font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'memory' ? 'border-black text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Memory ({memoryItems.length})
          </button>
          <button
            onClick={() => setActiveTab('model')}
            className={`py-2.5 px-3 font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'model' ? 'border-black text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Model & VM
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs text-zinc-700">
          {/* TAB 1: Mascot Color Customization */}
          {activeTab === 'avatar' && (
            <div className="space-y-4">
              {/* Live Animated Mascot Preview Card */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-zinc-900 text-sm">8-Frame Sprite Sheet Mascot</h3>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Smooth multi-frame animation with real-time GPU color tinting
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-2xl border border-zinc-200 shadow-xs flex items-center justify-center">
                    <MascotAvatar 
                      colorPreset={mascotColor} 
                      customHue={useCustomSlider ? mascotHueShift : undefined} 
                      size="xl" 
                      glow={previewState === 'working'}
                      state={previewState}
                      speed={previewSpeed}
                      animate={previewAnimate}
                      hoverEffect={true}
                    />
                  </div>
                </div>

                {/* Animation Mode & Speed Controls */}
                <div className="pt-2 border-t border-zinc-200/70 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-medium text-zinc-600">Animation State:</span>
                    <button
                      type="button"
                      onClick={() => setPreviewState('idle')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        previewState === 'idle'
                          ? 'bg-black text-white shadow-xs'
                          : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      Idle (8-Frame Loop)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewState('working')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                        previewState === 'working'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      <span>🔥 Working / Task Flare</span>
                    </button>
                  </div>

                  {/* Speed Selector */}
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-zinc-400 mr-1">Speed:</span>
                    {(['calm', 'normal', 'fast'] as const).map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => setPreviewSpeed(spd)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono capitalize transition-all cursor-pointer ${
                          previewSpeed === spd
                            ? 'bg-zinc-800 text-white'
                            : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                        }`}
                      >
                        {spd}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPreviewAnimate(!previewAnimate)}
                      className={`ml-1 px-2 py-0.5 rounded-md text-[10px] font-mono transition-all cursor-pointer ${
                        previewAnimate 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-zinc-200 text-zinc-600'
                      }`}
                    >
                      {previewAnimate ? 'Animated' : 'Paused'}
                    </button>
                  </div>
                </div>
              </div>


              {/* Color Presets */}
              <div>
                <label className="block text-zinc-700 font-semibold mb-2">Preset Color Swatches</label>
                <div className="grid grid-cols-5 gap-2">
                  {MASCOT_COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setMascotColor(preset.id);
                        setUseCustomSlider(false);
                      }}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer ${
                        !useCustomSlider && mascotColor === preset.id
                          ? 'border-zinc-900 bg-white ring-2 ring-zinc-900/20 shadow-xs'
                          : 'border-zinc-200 bg-white hover:bg-zinc-50'
                      }`}
                    >
                      <span 
                        className="w-6 h-6 rounded-full border border-black/10 shadow-2xs flex items-center justify-center text-white text-xs"
                        style={{ backgroundColor: preset.hex }}
                      >
                        {!useCustomSlider && mascotColor === preset.id && '✓'}
                      </span>
                      <span className="text-[10px] font-semibold text-zinc-800">
                        {preset.name.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Slider */}
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-zinc-800">
                  <input
                    type="checkbox"
                    checked={useCustomSlider}
                    onChange={(e) => {
                      setUseCustomSlider(e.target.checked);
                      if (e.target.checked && mascotHueShift === undefined) setMascotHueShift(180);
                    }}
                    className="rounded text-black"
                  />
                  <span>Custom Hue Slider (0° - 360°)</span>
                </label>
                {useCustomSlider && (
                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={mascotHueShift ?? 180}
                      onChange={(e) => setMascotHueShift(Number(e.target.value))}
                      className="w-full accent-black cursor-pointer"
                    />
                    <span className="font-mono text-xs font-bold text-zinc-800 w-10 text-right">
                      {mascotHueShift}°
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Bot's Long-term Memory View & Editor */}
          {activeTab === 'memory' && (
            <div className="space-y-3">
              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 text-zinc-600 text-[11px] leading-relaxed">
                Persistent context facts remembered by {name} across all conversations and scheduled routines.
              </div>

              <div className="space-y-2">
                {memoryItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-zinc-200 flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <span className="text-zinc-800 font-mono text-xs leading-normal">{item}</span>
                    <button
                      onClick={() => handleDeleteMemory(idx)}
                      className="p-1 text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {memoryItems.length === 0 && (
                  <div className="p-4 text-center text-zinc-400 text-xs">
                    No memory items configured yet.
                  </div>
                )}
              </div>

              {/* Add Memory Input */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={newMemoryItem}
                  onChange={(e) => setNewMemoryItem(e.target.value)}
                  placeholder="e.g. Primary cloud region: us-central1"
                  className="flex-1 bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 outline-none text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddMemory}
                  className="px-3.5 py-2 rounded-xl bg-black hover:bg-zinc-800 text-white font-semibold cursor-pointer text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Model & Environment */}
          {activeTab === 'model' && (
            <div className="space-y-4">
              <div>
                <label className="block text-zinc-800 font-semibold mb-1">Assigned AI Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value as ModelId)}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-mono text-xs outline-none"
                >
                  <option value="gemini-3.8-flash">Gemini 3.8 Flash (Default)</option>
                  <option value="gemini-4-argon">Gemini 4 Argon (Reasoning)</option>
                  <option value="claude-3-7-sonnet">Claude 3.7 Sonnet</option>
                  <option value="gpt-4o">GPT-4o (OpenAI)</option>
                  <option value="grok-3">Grok 3 (xAI)</option>
                  <option value="deepseek-r1">DeepSeek R1</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-800 font-semibold mb-1">VM Sandbox Environment</label>
                <select
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value as EnvironmentType)}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-mono text-xs outline-none"
                >
                  <option value="cloud-vm">Cloud Linux VM (Ubuntu)</option>
                  <option value="docker-sandbox">Podman / Docker Sandbox</option>
                  <option value="local-mac">Local Machine (~/.qubot)</option>
                  <option value="headless-browser">Chromium Headless</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-800 font-semibold mb-1">Human-in-the-Loop Policy</label>
                <select
                  value={approvalPolicy}
                  onChange={(e) => setApprovalPolicy(e.target.value as ApprovalPolicy)}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 font-mono text-xs outline-none"
                >
                  <option value="approval-required">Approval Required for Risky Actions (Recommended)</option>
                  <option value="autonomous">Fully Autonomous Mode</option>
                  <option value="strict-read-only">Strict Read-Only Mode</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-800 font-semibold mb-1">System Instructions Prompt</label>
                <textarea
                  rows={3}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-zinc-900 font-mono text-xs outline-none"
                />
              </div>

              <div className="pt-2 border-t border-zinc-200 flex justify-between items-center">
                <span className="text-[11px] text-zinc-500">Export bot package as standalone file:</span>
                <button
                  type="button"
                  onClick={handleExportBot}
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer text-xs font-medium"
                >
                  <Download className="w-3.5 h-3.5 text-zinc-600" />
                  <span>Download .qubot.json</span>
                </button>
              </div>

              {/* Danger Zone: Delete Bot */}
              {onDeleteAgent && (
                <div className="p-3.5 rounded-2xl bg-red-50/70 border border-red-200 space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-red-900 text-xs flex items-center gap-1.5">
                        <Trash2 className="w-3.5 h-3.5 text-red-600" /> Delete Bot
                      </h4>
                      <p className="text-[11px] text-red-600 mt-0.5">
                        Permanently remove "{agent.name}" and delete all conversation history with this bot.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Are you sure you want to permanently delete bot "${agent.name}"?`)) {
                          onDeleteAgent(agent.id);
                          onClose();
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      Delete Bot
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-200 bg-zinc-50/70 flex items-center justify-between">
          {onDeleteAgent ? (
            <button
              type="button"
              onClick={() => {
                if (confirm(`Are you sure you want to permanently delete bot "${agent.name}"?`)) {
                  onDeleteAgent(agent.id);
                  onClose();
                }
              }}
              className="px-3 py-1.5 rounded-xl text-red-600 hover:bg-red-50 border border-red-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Bot</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-zinc-600 hover:text-zinc-900 font-medium cursor-pointer text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-black hover:bg-zinc-800 text-white font-semibold cursor-pointer shadow-sm text-xs"
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
