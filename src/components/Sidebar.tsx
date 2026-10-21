import React, { useState } from 'react';
import { 
  Bot, 
  Plus, 
  Search, 
  Calendar, 
  Settings, 
  AlertCircle,
  Library,
  Smartphone,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Agent } from '../types';

interface SidebarProps {
  agents: Agent[];
  activeAgentId: string;
  onSelectAgent: (agentId: string) => void;
  onOpenNewAgentModal: () => void;
  onOpenRoutinesModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenOrgLibraryModal: () => void;
  onOpenPhonePairingModal: () => void;
  pendingApprovalsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  agents,
  activeAgentId,
  onSelectAgent,
  onOpenNewAgentModal,
  onOpenRoutinesModal,
  onOpenSettingsModal,
  onOpenOrgLibraryModal,
  onOpenPhonePairingModal,
  pendingApprovalsCount
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Bots' },
    { id: 'engineering', label: 'DevOps' },
    { id: 'operations', label: 'Ops & Comms' },
    { id: 'research', label: 'Web & Research' }
  ];

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <aside className="w-80 md:w-88 flex-shrink-0 bg-zinc-950 border-r border-zinc-800/80 flex flex-col h-screen select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-black text-sm tracking-tighter">
              Q
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white font-sans">
                  QUBOT
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold">
                  v2.4 LOCAL
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 truncate max-w-[190px]">
                automation assistant for everything
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenOrgLibraryModal}
              className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-cyan-400 border border-zinc-700/60 flex items-center justify-center transition-all cursor-pointer shadow-sm"
              title="QUBOT Org Library (Bot Packages)"
            >
              <Library className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenNewAgentModal}
              className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 flex items-center justify-center transition-all cursor-pointer shadow-sm"
              title="Create Custom Bot"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Pending Approval Alert if any */}
        {pendingApprovalsCount > 0 && (
          <div className="mt-2.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300 animate-pulse">
            <div className="flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>{pendingApprovalsCount} Action{pendingApprovalsCount > 1 ? 's' : ''} Awaiting Approval</span>
            </div>
            <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-200">
              Review
            </span>
          </div>
        )}

        {/* Search Bar */}
        <div className="mt-3 relative">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AI bots, skills, tools..."
            className="w-full bg-zinc-900/90 border border-zinc-800 rounded-lg pl-8.5 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/50"
          />
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-zinc-800 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Agents Contacts List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 divide-y divide-zinc-900/50">
        <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500 flex items-center justify-between">
          <span>Active Team ({filteredAgents.length})</span>
          <span className="text-[10px] text-zinc-600">Local-first VM</span>
        </div>

        {filteredAgents.map((agent) => {
          const isActive = agent.id === activeAgentId;

          return (
            <div
              key={agent.id}
              onClick={() => onSelectAgent(agent.id)}
              className={`group relative p-2.5 rounded-xl transition-all cursor-pointer flex items-start gap-3 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950/40 via-zinc-900/90 to-zinc-900 border border-cyan-500/30 shadow-md'
                  : 'hover:bg-zinc-900/60 border border-transparent hover:border-zinc-800/60'
              }`}
            >
              {/* Avatar + Status Indicator */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-zinc-800/90 border border-zinc-700/60 flex items-center justify-center text-lg shadow-sm">
                  {agent.avatar}
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-zinc-950 ${
                    agent.status === 'executing'
                      ? 'bg-cyan-400 animate-ping'
                      : agent.status === 'active'
                      ? 'bg-emerald-400'
                      : agent.status === 'scheduled'
                      ? 'bg-purple-400'
                      : 'bg-zinc-500'
                  }`}
                  title={`Status: ${agent.status}`}
                />
              </div>

              {/* Agent Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-semibold text-xs text-zinc-100 group-hover:text-white truncate">
                      {agent.name}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 truncate">
                      {agent.handle}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 whitespace-nowrap ml-1 font-mono">
                    {agent.lastActive}
                  </span>
                </div>

                <p className="text-[11px] text-zinc-400 truncate mt-0.5 font-medium">
                  {agent.role}
                </p>

                <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                  {agent.statusMessage || agent.tagline}
                </p>

                {/* Badges / Model & Env */}
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/50">
                    {agent.model.replace('gemini-', 'G-').replace('-flash', '').replace('-argon', ' Pro')}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400">
                    {agent.environment.replace('local-', '').replace('-sandbox', '')}
                  </span>
                  {agent.unreadCount && agent.unreadCount > 0 ? (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-500 text-zinc-950 font-bold ml-auto">
                      {agent.unreadCount}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}

        {filteredAgents.length === 0 && (
          <div className="p-6 text-center text-zinc-500 text-xs">
            No agents found matching your filter.
          </div>
        )}
      </div>

      {/* Footer Navigation Utilities */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/90 space-y-1">
        <button
          onClick={onOpenOrgLibraryModal}
          className="w-full px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Library className="w-4 h-4 text-indigo-400" />
            <span>Org Bot Library</span>
          </div>
          <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded">
            5 Presets
          </span>
        </button>

        <button
          onClick={onOpenPhonePairingModal}
          className="w-full px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Phone Web App (PWA)</span>
          </div>
          <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 px-1.5 py-0.5 rounded">
            Pair QR
          </span>
        </button>

        <button
          onClick={onOpenRoutinesModal}
          className="w-full px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Scheduled Routines</span>
          </div>
          <span className="text-[10px] font-mono bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">
            3 cron
          </span>
        </button>

        <button
          onClick={onOpenSettingsModal}
          className="w-full px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-zinc-400" />
            <span>Settings & API Keys</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">
            ~/.qubot
          </span>
        </button>
      </div>
    </aside>
  );
};
