import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Globe, 
  FolderTree, 
  Layers, 
  RefreshCw, 
  Maximize2, 
  ExternalLink, 
  Play, 
  FileCode, 
  Check, 
  ChevronRight, 
  ChevronDown,
  Download,
  Plus,
  ShieldCheck,
  MousePointer,
  Monitor,
  Cpu,
  Tv,
  Power
} from 'lucide-react';
import { BrowserTabState, ComposioApp, TerminalEntry, VirtualFile } from '../types';
import { COMPOSIO_APPS } from '../lib/composioTools';

interface WorkspacePanelProps {
  isOpen: boolean;
  onClose: () => void;
  files: VirtualFile[];
  terminalLogs: TerminalEntry[];
  browserState: BrowserTabState;
  onRunTerminalCommand: (cmd: string) => void;
  onFileSelect?: (file: VirtualFile) => void;
}

export const WorkspacePanel: React.FC<WorkspacePanelProps> = ({
  isOpen,
  onClose,
  files,
  terminalLogs,
  browserState,
  onRunTerminalCommand,
  onFileSelect
}) => {
  const [activeTab, setActiveTab] = useState<'desktop' | 'browser' | 'terminal' | 'files' | 'apps'>('desktop');
  const [terminalInput, setTerminalInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<VirtualFile | null>(null);
  const [apps, setApps] = useState<ComposioApp[]>(COMPOSIO_APPS);
  const [browserUrlInput, setBrowserUrlInput] = useState(browserState.url || 'https://github.com/trending');
  const [desktopResolution, setDesktopResolution] = useState('1280x800');
  const [desktopFps, setDesktopFps] = useState(60);

  if (!isOpen) return null;

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    onRunTerminalCommand(terminalInput);
    setTerminalInput('');
  };

  const toggleAppConnection = (appId: string) => {
    setApps(prev => prev.map(a => a.id === appId ? { ...a, isConnected: !a.isConnected } : a));
  };

  return (
    <div className="w-96 lg:w-[480px] xl:w-[560px] flex-shrink-0 bg-white/95 backdrop-blur-2xl border-l border-zinc-200/80 flex flex-col h-full select-none z-20 shadow-2xl">
      {/* Top Header */}
      <div className="px-4 py-3 border-b border-zinc-200/70 flex items-center justify-between bg-zinc-50/70">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-zinc-900 tracking-wide font-sans">
            QUBOT VM & DESKTOP
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700">
            Ubuntu X11 Sandbox
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
            18ms VNC
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200/60 transition-colors cursor-pointer"
            title="Close Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center border-b border-zinc-200/70 px-2 bg-zinc-50/50 text-xs overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('desktop')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'desktop'
              ? 'border-black text-zinc-900 bg-white shadow-2xs'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Linux Desktop (VNC)</span>
        </button>

        <button
          onClick={() => setActiveTab('browser')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'browser'
              ? 'border-black text-zinc-900 bg-white shadow-2xs'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Browser</span>
        </button>

        <button
          onClick={() => setActiveTab('terminal')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'terminal'
              ? 'border-black text-zinc-900 bg-white shadow-2xs'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Bash Shell</span>
        </button>

        <button
          onClick={() => setActiveTab('files')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'files'
              ? 'border-black text-zinc-900 bg-white shadow-2xs'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <FolderTree className="w-3.5 h-3.5" />
          <span>Files</span>
        </button>

        <button
          onClick={() => setActiveTab('apps')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'apps'
              ? 'border-black text-zinc-900 bg-white shadow-2xs'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Composio</span>
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-hidden flex flex-col bg-zinc-950">
        {/* 1. Linux GUI Desktop (VNC) Tab */}
        {activeTab === 'desktop' && (
          <div className="flex-1 flex flex-col h-full bg-zinc-900 overflow-hidden relative">
            {/* Desktop Control Bar */}
            <div className="px-3 py-1.5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                <span className="font-mono text-[11px] text-zinc-300">qubot-vm:display:0.0</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span>{desktopResolution}</span>
                <span>•</span>
                <span>{desktopFps} FPS</span>
              </div>
            </div>

            {/* Virtual Desktop Display Screen */}
            <div className="flex-1 p-3 bg-zinc-950/90 relative overflow-hidden flex flex-col justify-between">
              {/* Virtual OS Desktop Wallpaper & Windows */}
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-slate-900 via-indigo-950 to-zinc-950 border border-zinc-800 p-3 relative overflow-hidden shadow-2xl flex flex-col justify-between">
                
                {/* Floating Window 1: Chromium browser on desktop */}
                <div className="w-[88%] h-[56%] bg-zinc-900/95 border border-zinc-700/80 rounded-lg shadow-xl overflow-hidden flex flex-col z-10 transition-transform">
                  <div className="px-2.5 py-1 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                      <span className="text-zinc-400 font-mono ml-1">Chromium - GitHub Automation</span>
                    </div>
                    <span className="text-cyan-400 font-mono">200 OK</span>
                  </div>
                  <div className="p-3 text-[11px] space-y-1.5 text-zinc-300 font-mono">
                    <div className="text-cyan-400 font-semibold">[Agent Navigation Target]</div>
                    <div className="text-zinc-400">Navigating to repository branch 'feature/task-runner'...</div>
                    <div className="text-emerald-400">✓ Page rendered (410ms)</div>
                    <div className="p-1.5 bg-black/50 rounded border border-zinc-800 text-[10px] text-zinc-400">
                      DOM: 3 inputs found, button#submit-pr enabled
                    </div>
                  </div>
                </div>

                {/* Floating Window 2: Sandboxed Terminal Window on desktop */}
                <div className="w-[82%] h-[40%] bg-black/90 border border-emerald-500/40 rounded-lg shadow-2xl overflow-hidden self-end -mt-6 z-20 flex flex-col">
                  <div className="px-2 py-1 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-[9px] font-mono text-zinc-400">
                    <div className="flex items-center gap-1">
                      <Terminal className="w-3 h-3 text-emerald-400" />
                      <span>bash - qubot@sandbox</span>
                    </div>
                    <span>PID: 8842</span>
                  </div>
                  <div className="p-2.5 font-mono text-[10px] text-zinc-300 space-y-1 overflow-hidden">
                    <div className="text-emerald-400">qubot@vm:~$ npm run test -- --silent</div>
                    <div className="text-zinc-400">PASS tests/agent.test.ts</div>
                    <div className="text-cyan-300">PASS tests/workflows.test.ts (14/14 green)</div>
                  </div>
                </div>

                {/* Animated Simulated Mouse Cursor */}
                <div className="absolute top-[48%] left-[62%] z-30 pointer-events-none flex items-center gap-1.5 animate-pulse">
                  <MousePointer className="w-4 h-4 text-cyan-400 fill-cyan-400 drop-shadow-md" />
                  <span className="text-[9px] bg-cyan-500 text-zinc-950 font-black px-1.5 py-0.5 rounded shadow">
                    Bot Cursor
                  </span>
                </div>

                {/* Virtual OS Dock */}
                <div className="mt-2 h-7 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/60 rounded-lg px-2 flex items-center justify-between text-[10px] text-zinc-400">
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded bg-cyan-500 flex items-center justify-center text-[8px] font-bold text-black">Q</div>
                    <span className="font-semibold text-zinc-200">QUBOT Desktop v2.4</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[9px]">
                    <span className="text-emerald-400">● X11 Host</span>
                    <span>Memory: 284MB / 4GB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Desktop Actions */}
            <div className="p-2 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-[11px] text-zinc-400">Host control: Ubuntu Xorg (Safe sandbox)</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onRunTerminalCommand('killall -9 chromium && echo "Restarted browser"')}
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] cursor-pointer"
                >
                  Restart GUI
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. Live Browser Tab */}
        {activeTab === 'browser' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="p-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
              </div>

              <div className="flex-1 flex items-center bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-300 font-mono">
                <Globe className="w-3 h-3 text-cyan-400 mr-1.5 flex-shrink-0" />
                <input
                  type="text"
                  value={browserUrlInput}
                  onChange={(e) => setBrowserUrlInput(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-zinc-200 text-xs truncate"
                />
              </div>

              <button
                onClick={() => onRunTerminalCommand(`curl -sI ${browserUrlInput}`)}
                className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                title="Reload"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 relative bg-zinc-900 overflow-y-auto p-4 flex flex-col">
              {browserState.cursorPos && (
                <div 
                  className="absolute z-30 pointer-events-none transition-all duration-300 ease-out flex items-center gap-1"
                  style={{ left: `${Math.min(browserState.cursorPos.x, 320)}px`, top: `${Math.min(browserState.cursorPos.y, 240)}px` }}
                >
                  <MousePointer className="w-4 h-4 text-cyan-400 fill-cyan-400 drop-shadow-md" />
                  {browserState.cursorPos.label && (
                    <span className="text-[10px] bg-cyan-500 text-zinc-950 font-bold px-1.5 py-0.5 rounded shadow">
                      {browserState.cursorPos.label}
                    </span>
                  )}
                </div>
              )}

              <div className="bg-zinc-950 border border-zinc-800/80 rounded-lg p-4 shadow-inner space-y-4 text-xs text-zinc-300">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center font-bold text-white text-[10px]">
                      GH
                    </div>
                    <div>
                      <div className="font-semibold text-zinc-100">{browserState.title || 'GitHub Trending / AI Frameworks'}</div>
                      <div className="text-[10px] text-zinc-500">Rendered in Playwright Chromium Sandbox</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                    DOM Connected
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 bg-zinc-900/90 rounded border border-zinc-800">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-cyan-400 font-mono">qubot/core-runtime</span>
                      <span className="text-[10px] text-zinc-400">★ 4.8k stars</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] mt-1">
                      Local-first multi-agent automation orchestration assistant with human-in-the-loop approvals and Composio integrations.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded text-[11px] text-cyan-300">
                  <div className="font-semibold mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Agent Navigation Status:
                  </div>
                  <span>{browserState.pageContentSummary || 'Ready for autonomous scraping and form interaction.'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Live Terminal Tab */}
        {activeTab === 'terminal' && (
          <div className="flex-1 flex flex-col h-full bg-black font-mono text-xs">
            <div className="px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-zinc-400 text-[11px]">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                qubot@sandbox-vm:~/workspace
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => onRunTerminalCommand('clear')} className="hover:text-white text-[10px]">
                  Clear
                </button>
              </div>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-1.5 text-zinc-300 select-text">
              <div className="text-zinc-500 text-[11px] pb-2 border-b border-zinc-900">
                Linux 6.8.0-qubot-vm x86_64 GNU/Linux. Rootless Podman runtime initialized.
              </div>

              {terminalLogs.map((log) => (
                <div key={log.id} className="leading-relaxed">
                  {log.type === 'input' ? (
                    <div className="text-cyan-400 flex items-start gap-1.5">
                      <span className="text-emerald-400 select-none">qubot@vm:~$</span>
                      <span>{log.content}</span>
                    </div>
                  ) : log.type === 'error' ? (
                    <div className="text-red-400 pl-4">{log.content}</div>
                  ) : (
                    <div className="text-zinc-300 pl-4 whitespace-pre-wrap">{log.content}</div>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleTerminalSubmit} className="p-2.5 bg-zinc-950 border-t border-zinc-800 flex items-center gap-2">
              <span className="text-emerald-400 text-xs font-bold select-none">$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Execute command in sandbox VM..."
                className="flex-1 bg-transparent border-none outline-none text-zinc-100 text-xs font-mono placeholder-zinc-600"
              />
              <button type="submit" className="p-1 rounded text-cyan-400 hover:text-cyan-300 cursor-pointer">
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </form>
          </div>
        )}

        {/* 4. Filesystem Tab */}
        {activeTab === 'files' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="p-2 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <span className="font-mono text-[11px] text-zinc-300">~/.qubot/workspace</span>
              <span className="text-[10px] text-zinc-500">Local Disk Storage</span>
            </div>

            <div className="flex-1 flex overflow-hidden">
              <div className="w-1/2 border-r border-zinc-800/80 p-3 overflow-y-auto space-y-1 text-xs font-mono">
                {files.map((file) => (
                  <div key={file.path} className="space-y-1">
                    <div className="text-zinc-400 font-semibold flex items-center gap-1.5 py-1">
                      <FolderTree className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{file.name}</span>
                    </div>
                    {file.children && (
                      <div className="pl-3 border-l border-zinc-800 space-y-1">
                        {file.children.map((child) => (
                          <div
                            key={child.path}
                            onClick={() => setSelectedFile(child)}
                            className={`flex items-center gap-1.5 py-1 px-1.5 rounded cursor-pointer transition-colors ${
                              selectedFile?.path === child.path
                                ? 'bg-cyan-500/20 text-cyan-300'
                                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                            }`}
                          >
                            <FileCode className="w-3 h-3 text-cyan-400" />
                            <span className="truncate">{child.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="w-1/2 p-3 overflow-y-auto bg-zinc-950 font-mono text-xs text-zinc-300">
                {selectedFile ? (
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-2">
                      <span className="font-semibold text-zinc-200 truncate">{selectedFile.name}</span>
                    </div>
                    <pre className="whitespace-pre-wrap text-[11px] leading-relaxed text-zinc-300">
                      {selectedFile.content || '// Empty file content'}
                    </pre>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-center text-zinc-500 text-xs">
                    Select a file to preview code
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 5. Composio Apps Tab */}
        {activeTab === 'apps' && (
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div>
                <h4 className="text-xs font-bold text-zinc-100">Composio Tool Hub</h4>
                <p className="text-[11px] text-zinc-400">Authenticate once, use across all QUBOT agents</p>
              </div>
              <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded">
                OAuth 2.0
              </span>
            </div>

            <div className="space-y-2">
              {apps.map((app) => (
                <div
                  key={app.id}
                  className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-zinc-200">{app.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                        {app.toolsCount} actions
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                      {app.description}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleAppConnection(app.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      app.isConnected
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                    }`}
                  >
                    {app.isConnected ? 'Connected' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
