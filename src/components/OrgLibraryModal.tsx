import React, { useState } from 'react';
import { 
  X, 
  Library, 
  Download, 
  Search, 
  Star,
  Check
} from 'lucide-react';
import { Agent, ModelId } from '../types';
import { MascotAvatar } from './MascotAvatar';

interface OrgLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallAgent: (agent: Agent) => void;
  existingAgentIds: string[];
}

export interface BotPackage {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: string;
  tagline: string;
  category: 'engineering' | 'operations' | 'research' | 'core';
  model: ModelId;
  environment: any;
  approvalPolicy: any;
  enabledTools: string[];
  downloadsCount: string;
  rating: number;
  description: string;
  systemPrompt: string;
  memoryItems: string[];
}

const TEMPLATE_BOTS: BotPackage[] = [
  {
    id: 'pkg-codereviewer',
    name: 'Cipher-Audit',
    handle: '@cipher_audit',
    avatar: '🔍',
    role: 'Automated PR & Security Reviewer',
    tagline: 'Scans pull requests for security vulnerabilities, memory leaks, and style drift',
    category: 'engineering',
    model: 'gemini-4-argon',
    environment: 'docker-sandbox',
    approvalPolicy: 'approval-required',
    enabledTools: ['bash', 'filesystem', 'github'],
    downloadsCount: '4.2k',
    rating: 4.9,
    description: 'Pre-configured agent specializing in automated code review. Analyzes git diffs, runs static linting in sandbox containers, and drafts comprehensive pull request reviews.',
    systemPrompt: 'You are Cipher-Audit, a strict and constructive code auditor. You inspect diffs line by line for OWASP top 10 vulnerabilities, edge cases, and performance regressions.',
    memoryItems: ['Security profile: OWASP Top 10', 'Strict approval for git push']
  },
  {
    id: 'pkg-scraper',
    name: 'Scout-Data',
    handle: '@scout_data',
    avatar: '🕸️',
    role: 'Headless Web Scraper & ETL Engine',
    tagline: 'Navigates complex SPAs, bypasses pagination, and exports clean JSON tables',
    category: 'research',
    model: 'gemini-3.8-flash',
    environment: 'headless-browser',
    approvalPolicy: 'autonomous',
    enabledTools: ['browser', 'filesystem'],
    downloadsCount: '8.1k',
    rating: 5.0,
    description: 'Autonomous web extraction agent. Uses headless Playwright to navigate websites, click dynamic elements, extract tables, and format structured JSON/CSV data.',
    systemPrompt: 'You are Scout-Data, a precision data extraction bot. You navigate web pages, scrape target selectors, and save organized datasets to the local workspace.',
    memoryItems: ['Preferred format: JSON/CSV', 'Default viewport: 1920x1080']
  },
  {
    id: 'pkg-chiefstaff',
    name: 'Chronos-Sync',
    handle: '@chronos_sync',
    avatar: '⏳',
    role: 'Calendar & Meeting Orchestrator',
    tagline: 'Resolves schedule collisions, tracks agendas, and automates meeting prep',
    category: 'operations',
    model: 'gemini-3.8-flash',
    environment: 'cloud-vm',
    approvalPolicy: 'approval-required',
    enabledTools: ['calendar', 'gmail', 'slack', 'notion'],
    downloadsCount: '6.7k',
    rating: 4.8,
    description: 'Executive calendar manager. Scans incoming scheduling requests, cross-references Google Calendar for openings, proposes time slots, and generates Google Meet links.',
    systemPrompt: 'You are Chronos-Sync, an executive scheduling assistant. You optimize the user schedule for deep work while ensuring VIP meetings are confirmed smoothly.',
    memoryItems: ['Focus blocks: 2 hours daily', 'Default meeting duration: 30 minutes']
  },
  {
    id: 'pkg-devops',
    name: 'Kube-Pilot',
    handle: '@kube_pilot',
    avatar: '☸️',
    role: 'Kubernetes & Docker Container Guard',
    tagline: 'Monitors container metrics, automates rollbacks, and manages secrets',
    category: 'engineering',
    model: 'claude-3-7-sonnet',
    environment: 'docker-sandbox',
    approvalPolicy: 'approval-required',
    enabledTools: ['bash', 'filesystem'],
    downloadsCount: '3.9k',
    rating: 4.9,
    description: 'DevOps automation specialist. Inspects Docker/Podman containers, analyzes log files, runs container diagnostics, and assists with deployment pipelines.',
    systemPrompt: 'You are Kube-Pilot, a container and infrastructure agent. You execute bash diagnostics, check container status, and enforce strict isolation.',
    memoryItems: ['Kubernetes namespace: production', 'Requires human approval for container termination']
  }
];

export const OrgLibraryModal: React.FC<OrgLibraryModalProps> = ({
  isOpen,
  onClose,
  onInstallAgent,
  existingAgentIds
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [installedIds, setInstalledIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const filtered = TEMPLATE_BOTS.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(search.toLowerCase()) ||
                          pkg.role.toLowerCase().includes(search.toLowerCase()) ||
                          pkg.tagline.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pkg.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInstall = (pkg: BotPackage) => {
    const newAgent: Agent = {
      id: `agent-installed-${pkg.id}-${Date.now()}`,
      name: pkg.name,
      handle: pkg.handle,
      avatar: pkg.avatar,
      mascotColor: 'teal',
      role: pkg.role,
      tagline: pkg.tagline,
      systemPrompt: pkg.systemPrompt,
      model: pkg.model,
      environment: pkg.environment,
      approvalPolicy: pkg.approvalPolicy,
      status: 'active',
      statusMessage: 'Installed from QUBOT Org Library',
      category: pkg.category,
      enabledTools: pkg.enabledTools,
      lastActive: 'Just now',
      tokensUsed: 0,
      memoryItems: pkg.memoryItems
    };

    onInstallAgent(newAgent);
    setInstalledIds(prev => [...prev, pkg.id]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm select-none">
      <div className="w-full max-w-3xl bg-white/95 backdrop-blur-2xl border border-zinc-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200/70 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-3">
            <MascotAvatar size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-zinc-900 font-sans">QUBOT Organization Library</h2>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-sky-100 text-sky-700 font-semibold">
                  Verified Packages
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Install pre-configured agent packs with specialized tools and sandboxes
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

        {/* Search */}
        <div className="p-4 border-b border-zinc-200/70 bg-white/80 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bot packages by name, role, or tool..."
              className="w-full bg-zinc-100/90 border border-zinc-200 rounded-xl pl-8.5 pr-3 py-1.5 text-xs text-zinc-800 outline-none focus:bg-white focus:border-zinc-300"
            />
          </div>
        </div>

        {/* Packages Grid */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 text-xs text-zinc-700">
          {filtered.map(pkg => {
            const isInstalled = installedIds.includes(pkg.id);

            return (
              <div
                key={pkg.id}
                className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-200/80 hover:bg-white hover:border-zinc-300 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 shadow-2xs"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-2xl flex-shrink-0 shadow-2xs">
                    {pkg.avatar}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-zinc-900">{pkg.name}</span>
                      <span className="text-xs font-mono text-zinc-400">{pkg.handle}</span>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-zinc-200/80 text-zinc-700 font-medium">
                        {pkg.role}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-800 font-medium">
                      {pkg.tagline}
                    </p>

                    <p className="text-[11px] text-zinc-500 leading-relaxed max-w-xl">
                      {pkg.description}
                    </p>

                    <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-400 pt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-amber-500 font-semibold">
                        <Star className="w-3 h-3 fill-current" />
                        {pkg.rating}
                      </span>
                      <span>•</span>
                      <span>{pkg.downloadsCount} installs</span>
                      <span>•</span>
                      <span>Model: {pkg.model}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleInstall(pkg)}
                    disabled={isInstalled}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isInstalled
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-black text-white hover:bg-zinc-800 shadow-2xs'
                    }`}
                  >
                    {isInstalled ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        Installed
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        Add to Team
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-6 py-3 border-t border-zinc-200 bg-zinc-50/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-zinc-600 hover:text-zinc-900 font-medium text-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
