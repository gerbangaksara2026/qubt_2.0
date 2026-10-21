import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Plug, 
  Settings, 
  Smartphone, 
  Library, 
  Calendar,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { Agent, AppSettings } from '../types';
import { AgentPebbleAvatar } from './AgentPebbleAvatar';
import { MascotAvatar } from './MascotAvatar';

interface WhiteGlassSidebarProps {
  agents: Agent[];
  activeAgentId: string;
  settings: AppSettings;
  onSelectAgent: (agentId: string) => void;
  onOpenNewAgentModal: () => void;
  onOpenRoutinesModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenOrgLibraryModal: () => void;
  onOpenPhonePairingModal: () => void;
  onDeleteAgent?: (agentId: string) => void;
  pendingApprovalsCount: number;
}

export const WhiteGlassSidebar: React.FC<WhiteGlassSidebarProps> = ({
  agents,
  activeAgentId,
  settings,
  onSelectAgent,
  onOpenNewAgentModal,
  onOpenRoutinesModal,
  onOpenSettingsModal,
  onOpenOrgLibraryModal,
  onOpenPhonePairingModal,
  onDeleteAgent,
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
            className="p-1 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
            title="Open Phone Companion Mode"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpenOrgLibraryModal}
            className="p-1 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
            title="Bot & Plugin Library"
          >
            <Library className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpenNewAgentModal}
            className="p-1 rounded-md bg-black hover:bg-zinc-800 text-white transition-colors cursor-pointer ml-1 shadow-2xs"
            title="Create New Bot"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Pending Action Banner */}
      {pendingApprovalsCount > 0 && (
        <div className="mx-3 mt-3 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
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
            placeholder="Search bots..."
            className="w-full bg-zinc-100/90 border border-zinc-200/60 rounded-xl pl-8.5 pr-3 py-1.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-300 transition-all"
          />
        </div>
      </div>

      {/* Contacts List or Empty State */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1">
        {filteredAgents.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center text-zinc-500">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100/80 border border-zinc-200 flex items-center justify-center mb-3 shadow-xs">
              <MascotAvatar size="sm" animate />
            </div>
            <h3 className="font-bold text-zinc-800 text-xs mb-1">
              {searchQuery ? 'No bots match search' : 'No bots in workspace'}
            </h3>
            <p className="text-[11px] text-zinc-500 mb-4 leading-relaxed max-w-[200px]">
              {searchQuery ? 'Try another keyword' : 'Create your custom AI bot to start automating tasks.'}
            </p>
            {!searchQuery && (
              <button
                onClick={onOpenNewAgentModal}
                className="px-3.5 py-1.5 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create First Bot</span>
              </button>
            )}
          </div>
        ) : (
          filteredAgents.map((agent) => {
            const isActive = agent.id === activeAgentId;
            const hasUnread = agent.unreadCount && agent.unreadCount > 0;

            return (
              <div
                key={agent.id}
                onClick={() => onSelectAgent(agent.id)}
                className={`group p-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-3 relative ${
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
                    <p className="text-[11px] text-zinc-500 truncate max-w-[150px]">
                      {agent.statusMessage || agent.tagline}
                    </p>
                    
                    <div className="flex items-center gap-1">
                      {hasUnread && (
                        <span className="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0"></span>
                      )}

                      {/* Delete button on hover */}
                      {onDeleteAgent && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete bot "${agent.name}"?`)) {
                              onDeleteAgent(agent.id);
                            }
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                          title="Delete Bot"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
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
          <div 
            onClick={onOpenSettingsModal}
            className="flex items-center gap-2 min-w-0 cursor-pointer hover:opacity-80 transition-opacity p-1 rounded-lg"
            title="Edit Profile & Settings"
          >
            {settings.userProfile?.avatarUrl ? (
              <img
                src={settings.userProfile.avatarUrl}
                alt={settings.userProfile.name}
                className="w-6 h-6 rounded-full object-cover border border-zinc-200"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-black text-white font-bold text-[10px] flex items-center justify-center shadow-2xs">
                {(settings.userProfile?.name || 'U').slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-zinc-800 truncate block">
                {settings.userProfile?.name || 'Workspace Owner'}
              </span>
              <span className="text-[10px] text-zinc-400 truncate block font-mono">
                {settings.userProfile?.role || 'Administrator'}
              </span>
            </div>
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
              title="Settings & Multi-Model Vault"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
