import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Plus, 
  ChevronLeft, 
  Send, 
  Mic, 
  Wifi, 
  Battery, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Agent, Message } from '../types';
import { AgentPebbleAvatar } from './AgentPebbleAvatar';
import { MascotAvatar } from './MascotAvatar';

interface PhoneCompanionSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  agents: Agent[];
  activeAgent?: Agent;
  messages: Message[];
  onSendMessage: (text: string) => void;
}

export const PhoneCompanionSimulator: React.FC<PhoneCompanionSimulatorProps> = ({
  isOpen,
  onClose,
  agents,
  activeAgent,
  messages,
  onSendMessage
}) => {
  const [selectedMobileAgentId, setSelectedMobileAgentId] = useState<string | null>(null);
  const [mobileInput, setMobileInput] = useState('');

  if (!isOpen) return null;

  const currentMobileAgent = agents.find(a => a.id === selectedMobileAgentId);

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileInput.trim()) return;
    onSendMessage(mobileInput.trim());
    setMobileInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      <div className="relative">
        {/* Close Modal button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 p-1.5 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Realistic iPhone Hardware Frame matching UIGROKBOT_51a18c22.jpg */}
        <div className="w-[340px] h-[680px] bg-black rounded-[48px] p-3 shadow-2xl border-4 border-zinc-700/80 ring-1 ring-white/20 relative flex flex-col overflow-hidden">
          {/* Inner Screen */}
          <div className="w-full h-full bg-white rounded-[38px] overflow-hidden flex flex-col relative">
            {/* iOS Status Bar with Dynamic Island */}
            <div className="pt-2 px-6 pb-1 flex items-center justify-between text-xs font-semibold text-zinc-900 z-20 bg-white/90 backdrop-blur-sm">
              <span>9:41</span>
              {/* Dynamic Island Pill */}
              <div className="w-24 h-4 bg-black rounded-full mx-auto -mt-1 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-zinc-900 border border-zinc-700 ml-auto mr-2"></span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-800 text-[10px]">
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>

            {/* Screen Content: Contacts List OR Chat Thread */}
            {!selectedMobileAgentId ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header matching screenshot */}
                <div className="px-4 py-2 flex items-center justify-between border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <MascotAvatar size="xs" animate />
                    <span className="text-xs font-bold text-zinc-900">QUBOT</span>
                  </div>

                  <div className="flex items-center gap-2 text-zinc-600">
                    <Search className="w-4 h-4" />
                    <Plus className="w-4 h-4" />
                  </div>
                </div>

                {/* Top Horizontal Quick Bots Carousel matching screenshot */}
                <div className="p-3 border-b border-zinc-100 flex items-center gap-4 overflow-x-auto no-scrollbar">
                  {agents.slice(0, 4).map(agent => (
                    <div
                      key={agent.id}
                      onClick={() => setSelectedMobileAgentId(agent.id)}
                      className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0"
                    >
                      <AgentPebbleAvatar agent={agent} size="md" />
                      <span className="text-[10px] font-medium text-zinc-700 truncate max-w-[64px]">
                        {agent.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Mobile Contacts List matching screenshot */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {agents.map(agent => (
                    <div
                      key={agent.id}
                      onClick={() => setSelectedMobileAgentId(agent.id)}
                      className="p-2.5 rounded-2xl hover:bg-zinc-50 flex items-center gap-3 cursor-pointer transition-colors"
                    >
                      <AgentPebbleAvatar agent={agent} size="sm" />
                      <div className="flex-1 min-w-0 pr-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-zinc-900 truncate">
                            {agent.name}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            {agent.lastActive}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                          {agent.statusMessage || agent.tagline}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Mobile Chat View */
              <div className="flex-1 flex flex-col overflow-hidden bg-zinc-50/50">
                {/* Chat Top bar */}
                <div className="px-3 py-2 bg-white border-b border-zinc-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedMobileAgentId(null)}
                    className="flex items-center gap-1 text-xs font-semibold text-zinc-800 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {currentMobileAgent && <AgentPebbleAvatar agent={currentMobileAgent} size="sm" />}
                    <span className="text-xs font-bold text-zinc-900 truncate max-w-[120px]">
                      {currentMobileAgent?.name}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                    Paired
                  </span>
                </div>

                {/* Messages list */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`p-3 rounded-2xl max-w-[85%] ${
                        msg.sender === 'user'
                          ? 'bg-black text-white rounded-tr-xs'
                          : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-xs shadow-2xs'
                      }`}>
                        {msg.content}
                      </div>
                      <span className="text-[9px] text-zinc-400 mt-1 px-1">{msg.timestamp}</span>
                    </div>
                  ))}
                </div>

                {/* Mobile Input */}
                <form onSubmit={handleMobileSubmit} className="p-2 bg-white border-t border-zinc-100 flex items-center gap-2">
                  <input
                    type="text"
                    value={mobileInput}
                    onChange={(e) => setMobileInput(e.target.value)}
                    placeholder="Message bot..."
                    className="flex-1 bg-zinc-100 border border-zinc-200 rounded-full px-3 py-1.5 text-xs text-zinc-800 outline-none"
                  />
                  <button
                    type="submit"
                    className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              </div>
            )}

            {/* iOS Home Indicator Bar */}
            <div className="py-1.5 flex justify-center bg-white">
              <div className="w-32 h-1 bg-zinc-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
