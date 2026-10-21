import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Plug, 
  Settings, 
  Smartphone, 
  Library, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Agent } from '../types';
import { AgentPebbleAvatar } from './AgentPebbleAvatar';
import { MascotAvatar } from './MascotAvatar';

interface WhiteGlassSidebarProps {
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

export const WhiteGlassSidebar: React.FC<WhiteGlassSidebarProps> = ({
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

  const filteredAgents = agents.filter(agent => {
    return agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           agent.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
           agent.tagline.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <aside className="w-72 md:w-80 flex-shrink-0 bg-white/70 backdrop-blur-xl border-r border-zinc-200/70 flex flex-col h-full select-none">
      {/* Top Window Bar with macOS traffic lights & App Brand */}
      <div className="p-4 pb-3 flex items-center justify-between border-b border-zinc-200/50">
        <div className="flex items-center gap-2">
          {/* macOS window traffic lights */}
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-red-600/30 inline-block shadow-2xs"></span>
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-amber-600/30 inline-block shadow-2xs"></span>
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-green-600/30 inline-block shadow-2xs"></span>
          </div>

          {/* QUBOT Cyber Owl Mascot Brand */}
          <div className="flex items-center gap-1.5">
            <MascotAvatar size="xs" />
            <span className="font-bold text-xs tracking-tight text-zinc-900 font-sans">
              QUBOT
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onOpenPhonePairingModal}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
            title="Open Phone Companion PWA"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpenNewAgentModal}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer"
            title="Create New Bot"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Global Pending Approval Alert if any */}
      {pendingApprovalsCount > 0 && (
        <div className="mx-3 mt-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-800 shadow-2xs">
          <div className="flex items-center gap-1.5 font-medium">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>{pendingApprovalsCount} Action{pendingApprovalsCount > 1 ? 's' : ''} Need Approval</span>
          </div>
          <span className="text-[10px] bg-amber-200/80 px-1.5 py-0.5 rounded-full text-amber-900 font-semibold">
            Review
          </span>
        </div>
      )}

      {/* Search Bar - Exactly like reference UI */}
      <div className="px-3 pt-3 pb-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="w-full bg-zinc-100/90 border border-zinc-200/60 rounded-xl pl-8.5 pr-3 py-1.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-300 transition-all"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1">
        {filteredAgents.map((agent) => {
          const isActive = agent.id === activeAgentId;
          const hasUnread = agent.unreadCount && agent.unreadCount > 0;

          return (
            <div
              key={agent.id}
              onClick={() => onSelectAgent(agent.id)}
              className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-3 relative ${
                isActive
                  ? 'bg-white shadow-xs border border-zinc-200/80'
                  : 'hover:bg-white/60 border border-transparent'
              }`}
            >
              {/* Organic Pebble Avatar */}
              <AgentPebbleAvatar agent={agent} size="md" />

              {/* Details */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold truncate ${isActive ? 'text-zinc-950 font-bold' : 'text-zinc-800'}`}>
                    {agent.name}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-normal whitespace-nowrap ml-1">
                    {agent.lastActive}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-[11px] text-zinc-500 truncate max-w-[170px]">
                    {agent.statusMessage || agent.tagline}
                  </p>
                  {hasUnread && (
                    <span className="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0 ml-1"></span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Profile & Integrations Bar matching reference */}
      <div className="p-3 border-t border-zinc-200/60 bg-white/50 backdrop-blur-md flex flex-col gap-2">
        <button
          onClick={onOpenOrgLibraryModal}
          className="flex items-center gap-2 text-xs text-zinc-600 hover:text-zinc-900 transition-colors py-1 px-1 cursor-pointer"
        >
          <Plug className="w-3.5 h-3.5 text-zinc-500" />
          <span className="font-medium">Plugins & App Integrations</span>
        </button>

        <div className="flex items-center justify-between pt-1 border-t border-zinc-200/40">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
              alt="Alex Chen"
              className="w-6 h-6 rounded-full object-cover border border-zinc-200"
            />
            <span className="text-xs font-semibold text-zinc-800 truncate">
              Alex Chen
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onOpenRoutinesModal}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer"
              title="Scheduled Routines"
            >
              <Calendar className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenSettingsModal}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer"
              title="Settings & Multi-Model API Keys"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
