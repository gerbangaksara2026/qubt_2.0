'use client';

import React, { useState, useEffect } from 'react';
import { 
  Agent, 
  ApprovalPolicy, 
  BrowserTabState, 
  EnvironmentType, 
  Message, 
  ModelId, 
  ScheduledRoutine, 
  TerminalEntry, 
  ToolCall, 
  VirtualFile 
} from '../types';
import { 
  getStoredAgents, 
  getStoredFiles, 
  getStoredMessages, 
  getStoredRoutines, 
  getStoredSettings, 
  saveStoredAgents, 
  saveStoredFiles, 
  saveStoredMessages, 
  saveStoredRoutines, 
  saveStoredSettings 
} from '../lib/storage';
import { generateAgentResponse } from '../lib/gemini';
import { simulateToolExecution } from '../lib/composioTools';
import { WhiteGlassSidebar } from '../components/WhiteGlassSidebar';
import { WhiteGlassChatArea } from '../components/WhiteGlassChatArea';
import { WhiteGlassRightPanel } from '../components/WhiteGlassRightPanel';
import { WorkspacePanel } from '../components/WorkspacePanel';
import { AgentModal } from '../components/AgentModal';
import { RoutinesModal } from '../components/RoutinesModal';
import { SettingsModal } from '../components/SettingsModal';
import { OrgLibraryModal } from '../components/OrgLibraryModal';
import { PhonePairingModal } from '../components/PhonePairingModal';
import { PhoneCompanionSimulator } from '../components/PhoneCompanionSimulator';
import { BotProfileDrawer } from '../components/BotProfileDrawer';

export default function QubotDashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activeAgentId, setActiveAgentId] = useState<string>('agent-chief-of-staff');
  const [isBotProfileOpen, setIsBotProfileOpen] = useState(false);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [routines, setRoutines] = useState<ScheduledRoutine[]>([]);
  const [files, setFiles] = useState<VirtualFile[]>([]);
  const [settings, setSettings] = useState(getStoredSettings());

  // Workspace & VM State
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isPhoneSimulatorOpen, setIsPhoneSimulatorOpen] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<TerminalEntry[]>([
    {
      id: 't-init',
      type: 'system',
      content: '[QUBOT INIT] Multi-model agent runtime initialized.\nMounted rootfs: ~/.qubot/workspace\nDisplay Server: X11 on display :0.0 active',
      timestamp: '9:40:00'
    }
  ]);
  const [browserState, setBrowserState] = useState<BrowserTabState>({
    url: 'https://calendar.google.com',
    title: 'Google Calendar & CRM Sync',
    isLoading: false,
    cursorPos: { x: 260, y: 140, label: 'Viewing Chief of Staff agenda' },
    pageContentSummary: 'DOM Ready. 3 meetings loaded for today.'
  });

  // Modal States
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [isRoutinesModalOpen, setIsRoutinesModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isOrgLibraryOpen, setIsOrgLibraryOpen] = useState(false);
  const [isPhonePairingOpen, setIsPhonePairingOpen] = useState(false);

  // Initialize from storage
  useEffect(() => {
    const loadedAgents = getStoredAgents();
    const loadedMessages = getStoredMessages();
    const loadedRoutines = getStoredRoutines();
    const loadedFiles = getStoredFiles();
    const loadedSettings = getStoredSettings();

    setAgents(loadedAgents);
    setMessages(loadedMessages);
    setRoutines(loadedRoutines);
    setFiles(loadedFiles);
    setSettings(loadedSettings);

    if (loadedAgents.length > 0) {
      setActiveAgentId(loadedAgents[0].id);
    }
  }, []);

  // Save changes to storage
  useEffect(() => {
    if (agents.length > 0) saveStoredAgents(agents);
  }, [agents]);

  useEffect(() => {
    if (Object.keys(messages).length > 0) saveStoredMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (routines.length > 0) saveStoredRoutines(routines);
  }, [routines]);

  useEffect(() => {
    if (files.length > 0) saveStoredFiles(files);
  }, [files]);

  // Active agent reference
  const currentAgent = agents.find(a => a.id === activeAgentId) || agents[0];
  const currentMessages = currentAgent ? (messages[currentAgent.id] || []) : [];

  // Count total pending approval actions across all agents
  const pendingApprovalsCount = Object.values(messages).reduce((acc, msgList) => {
    return acc + msgList.reduce((mAcc, msg) => {
      return mAcc + (msg.toolCalls?.filter(t => t.status === 'pending').length || 0);
    }, 0);
  }, 0);

  // Send message handler
  const handleSendMessage = async (text: string) => {
    if (!currentAgent) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: `msg-${Date.now()}-u`,
      agentId: currentAgent.id,
      sender: 'user',
      content: text,
      timestamp: time
    };

    const updatedCurrentList = [...currentMessages, userMsg];
    setMessages(prev => ({ ...prev, [currentAgent.id]: updatedCurrentList }));

    setAgents(prev => prev.map(a => a.id === currentAgent.id ? { ...a, status: 'executing' } : a));

    try {
      const response = await generateAgentResponse(
        currentAgent,
        text,
        updatedCurrentList,
        settings
      );

      const agentMsg: Message = {
        id: `msg-${Date.now()}-a`,
        agentId: currentAgent.id,
        sender: 'agent',
        content: response.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reasoning: response.reasoning,
        toolCalls: response.toolCalls
      };

      setMessages(prev => ({
        ...prev,
        [currentAgent.id]: [...(prev[currentAgent.id] || []), agentMsg]
      }));

      setAgents(prev => prev.map(a => a.id === currentAgent.id ? {
        ...a,
        status: 'active',
        tokensUsed: a.tokensUsed + 320,
        lastActive: 'Just now'
      } : a));

      if (currentAgent.approvalPolicy === 'autonomous' && agentMsg.toolCalls) {
        agentMsg.toolCalls.forEach(call => {
          if (call.riskLevel === 'safe') {
            handleApproveToolCall(call.id);
          }
        });
      }

      // Cross-Agent Communication & Autonomous Delegation:
      // Scan for any @mentions of other bots in the user prompt or agent's response
      const combinedText = `${text} ${response.content}`;
      const mentionedAgents = agents.filter(other => 
        other.id !== currentAgent.id && 
        (combinedText.includes(other.handle) || combinedText.toLowerCase().includes(`@${other.name.toLowerCase()}`))
      );

      for (const targetAgent of mentionedAgents) {
        setAgents(prev => prev.map(a => a.id === targetAgent.id ? { ...a, status: 'executing' } : a));

        try {
          const delegationPrompt = `[Delegated from ${currentAgent.name} (${currentAgent.handle})]: ${response.content || text}`;
          const delegationResponse = await generateAgentResponse(
            targetAgent,
            delegationPrompt,
            [...updatedCurrentList, agentMsg],
            settings
          );

          const delegatedMsg: Message = {
            id: `msg-${Date.now()}-del-${targetAgent.id}`,
            agentId: currentAgent.id,
            authorAgentId: targetAgent.id,
            authorName: targetAgent.name,
            authorHandle: targetAgent.handle,
            isDelegation: true,
            sender: 'agent',
            content: delegationResponse.content,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            reasoning: delegationResponse.reasoning,
            toolCalls: delegationResponse.toolCalls
          };

          setMessages(prev => ({
            ...prev,
            [currentAgent.id]: [...(prev[currentAgent.id] || []), delegatedMsg],
            [targetAgent.id]: [...(prev[targetAgent.id] || []), delegatedMsg]
          }));

          setAgents(prev => prev.map(a => a.id === targetAgent.id ? {
            ...a,
            status: 'active',
            tokensUsed: a.tokensUsed + 280,
            lastActive: 'Just now'
          } : a));

          if (targetAgent.approvalPolicy === 'autonomous' && delegatedMsg.toolCalls) {
            delegatedMsg.toolCalls.forEach(call => {
              if (call.riskLevel === 'safe') {
                handleApproveToolCall(call.id);
              }
            });
          }
        } catch (delegationErr) {
          console.error(`Delegation error for ${targetAgent.name}:`, delegationErr);
          setAgents(prev => prev.map(a => a.id === targetAgent.id ? { ...a, status: 'active' } : a));
        }
      }
    } catch (err) {
      console.error('Error generating response:', err);
      setAgents(prev => prev.map(a => a.id === currentAgent.id ? { ...a, status: 'active' } : a));
    }
  };

  // Human-in-the-Loop: Approve tool call
  const handleApproveToolCall = async (toolCallId: string) => {
    if (!currentAgent) return;

    let targetToolCall: ToolCall | null = null;

    setMessages(prev => {
      const list = prev[currentAgent.id] || [];
      const updated = list.map(msg => {
        if (!msg.toolCalls) return msg;
        const callIndex = msg.toolCalls.findIndex(c => c.id === toolCallId);
        if (callIndex !== -1) {
          targetToolCall = msg.toolCalls[callIndex];
          const newCalls = [...msg.toolCalls];
          newCalls[callIndex] = { ...newCalls[callIndex], status: 'executing' };
          return { ...msg, toolCalls: newCalls };
        }
        return msg;
      });
      return { ...prev, [currentAgent.id]: updated };
    });

    if (!targetToolCall) return;

    const result = await simulateToolExecution(targetToolCall);

    setMessages(prev => {
      const list = prev[currentAgent.id] || [];
      const updated = list.map(msg => {
        if (!msg.toolCalls) return msg;
        const callIndex = msg.toolCalls.findIndex(c => c.id === toolCallId);
        if (callIndex !== -1) {
          const newCalls = [...msg.toolCalls];
          newCalls[callIndex] = {
            ...newCalls[callIndex],
            status: 'completed',
            executionOutput: result.output,
            executionDurationMs: result.durationMs
          };
          return { ...msg, toolCalls: newCalls };
        }
        return msg;
      });
      return { ...prev, [currentAgent.id]: updated };
    });

    if (result.terminalLogs) {
      const newEntries: TerminalEntry[] = result.terminalLogs.map((log, idx) => ({
        id: `term-${Date.now()}-${idx}`,
        type: 'output',
        content: log,
        timestamp: new Date().toLocaleTimeString()
      }));
      setTerminalLogs(prev => [...prev, ...newEntries]);
    }

    if (result.browserUpdate) {
      setBrowserState(prev => ({
        ...prev,
        url: result.browserUpdate?.url || prev.url,
        title: result.browserUpdate?.title || prev.title,
        cursorPos: result.browserUpdate?.cursorPos || prev.cursorPos,
        pageContentSummary: result.browserUpdate?.pageContentSummary || prev.pageContentSummary
      }));
    }

    if (result.fileUpdate) {
      const newFile: VirtualFile = {
        name: result.fileUpdate.path.split('/').pop() || 'new-file',
        path: result.fileUpdate.path,
        isDirectory: false,
        size: `${result.fileUpdate.content.length} B`,
        updatedAt: 'Just now',
        content: result.fileUpdate.content
      };

      setFiles(prev => {
        const root = prev[0];
        if (root && root.children) {
          return [{
            ...root,
            children: [...root.children, newFile]
          }];
        }
        return [...prev, newFile];
      });
    }
  };

  // Human-in-the-Loop: Reject tool call
  const handleRejectToolCall = (toolCallId: string) => {
    if (!currentAgent) return;

    setMessages(prev => {
      const list = prev[currentAgent.id] || [];
      const updated = list.map(msg => {
        if (!msg.toolCalls) return msg;
        const callIndex = msg.toolCalls.findIndex(c => c.id === toolCallId);
        if (callIndex !== -1) {
          const newCalls = [...msg.toolCalls];
          newCalls[callIndex] = { ...newCalls[callIndex], status: 'rejected' };
          return { ...msg, toolCalls: newCalls };
        }
        return msg;
      });
      return { ...prev, [currentAgent.id]: updated };
    });

    const ackMsg: Message = {
      id: `msg-${Date.now()}-ack`,
      agentId: currentAgent.id,
      sender: 'agent',
      content: `Understood. The action was aborted per your instructions. Let me know how you'd like to adjust the plan.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [currentAgent.id]: [...(prev[currentAgent.id] || []), ackMsg]
    }));
  };

  const handleModifyToolCall = (toolCallId: string, updatedArgs: Record<string, any>) => {
    if (!currentAgent) return;

    setMessages(prev => {
      const list = prev[currentAgent.id] || [];
      const updated = list.map(msg => {
        if (!msg.toolCalls) return msg;
        const callIndex = msg.toolCalls.findIndex(c => c.id === toolCallId);
        if (callIndex !== -1) {
          const newCalls = [...msg.toolCalls];
          newCalls[callIndex] = { ...newCalls[callIndex], arguments: updatedArgs };
          return { ...msg, toolCalls: newCalls };
        }
        return msg;
      });
      return { ...prev, [currentAgent.id]: updated };
    });
  };

  const handleRunTerminalCommand = (cmd: string) => {
    const inputEntry: TerminalEntry = {
      id: `term-${Date.now()}-in`,
      type: 'input',
      content: cmd,
      timestamp: new Date().toLocaleTimeString()
    };

    if (cmd === 'clear') {
      setTerminalLogs([]);
      return;
    }

    let outputContent = '';
    if (cmd.includes('npm test')) {
      outputContent = 'PASS tests/agent.test.ts (7 tests passed)\nPASS tests/workflows.test.ts (7 tests passed)\nAll 14 tests passing. Coverage: 94.2%';
    } else if (cmd.includes('git status')) {
      outputContent = 'On branch main\nYour branch is up to date with origin/main.\nChanges not staged for commit:\n  modified: src/config/runner.json\n\nno changes added to commit (use "git add")';
    } else if (cmd.includes('ls')) {
      outputContent = 'drwxr-xr-x 4 qubot staff 128B package.json\ndrwxr-xr-x 8 qubot staff 256B src\n-rw-r--r-- 1 qubot staff 1.8KB README.md\n-rw-r--r-- 1 qubot staff 540B tsconfig.json';
    } else if (cmd.includes('docker') || cmd.includes('podman')) {
      outputContent = 'CONTAINER ID   IMAGE                 STATUS         PORTS\n3fa2b109cc81   qubot/sandbox:latest  Up 22 minutes  8080/tcp';
    } else {
      outputContent = `qubot-vm: executed "${cmd}" successfully (exit code 0).`;
    }

    const outputEntry: TerminalEntry = {
      id: `term-${Date.now()}-out`,
      type: 'output',
      content: outputContent,
      timestamp: new Date().toLocaleTimeString()
    };

    setTerminalLogs(prev => [...prev, inputEntry, outputEntry]);
  };

  const handleUpdateAgentModel = (agentId: string, model: ModelId) => {
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, model } : a));
  };

  const handleClearHistory = () => {
    if (currentAgent) {
      setMessages(prev => ({ ...prev, [currentAgent.id]: [] }));
    }
  };

  const handleToggleRoutine = (routineId: string) => {
    setRoutines(prev => prev.map(r => r.id === routineId ? { ...r, isActive: !r.isActive } : r));
  };

  const handleTriggerRoutineNow = (routineId: string) => {
    const routine = routines.find(r => r.id === routineId);
    if (!routine) return;

    setActiveAgentId(routine.agentId);
    handleSendMessage(`[SCHEDULED TRIGGER: ${routine.title}] ${routine.prompt}`);
    setIsRoutinesModalOpen(false);
  };

  const handleAddRoutine = (newRoutine: ScheduledRoutine) => {
    setRoutines(prev => [...prev, newRoutine]);
  };

  const handleDeleteRoutine = (routineId: string) => {
    setRoutines(prev => prev.filter(r => r.id !== routineId));
  };

  const handleTriggerEvent = (eventName: string, payload: string, targetAgentId: string) => {
    setActiveAgentId(targetAgentId);
    handleSendMessage(`[WEBHOOK EVENT: ${eventName}]\n${payload}\nPlease analyze this incoming event and take the appropriate actions with human approval.`);
  };

  const handleSaveSettings = (newSettings: any) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  if (!currentAgent) {
    return <div className="h-screen bg-slate-50 flex items-center justify-center text-zinc-500">Loading QUBOT...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-sky-100 via-slate-50 to-indigo-100/60 p-2 sm:p-4 md:p-6 flex items-center justify-center font-sans antialiased">
      {/* Floating macOS Glassmorphic Window Container exactly matching reference screenshot */}
      <div className="w-full max-w-[1540px] h-[94vh] rounded-3xl bg-white/75 backdrop-blur-2xl border border-white/80 shadow-2xl overflow-hidden flex relative">
        {/* Left Column: White Glassmorphism Sidebar (Contacts) */}
        <WhiteGlassSidebar
          agents={agents}
          activeAgentId={activeAgentId}
          onSelectAgent={setActiveAgentId}
          onOpenNewAgentModal={() => setIsAgentModalOpen(true)}
          onOpenRoutinesModal={() => setIsRoutinesModalOpen(true)}
          onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
          onOpenOrgLibraryModal={() => setIsOrgLibraryOpen(true)}
          onOpenPhonePairingModal={() => setIsPhoneSimulatorOpen(true)}
          pendingApprovalsCount={pendingApprovalsCount}
        />

        {/* Center Column: White Glassmorphism Chat Stage */}
        <WhiteGlassChatArea
          agent={currentAgent}
          allAgents={agents}
          messages={currentMessages}
          onSendMessage={handleSendMessage}
          onApproveToolCall={handleApproveToolCall}
          onRejectToolCall={handleRejectToolCall}
          onModifyToolCall={handleModifyToolCall}
          onUpdateAgentModel={handleUpdateAgentModel}
          onOpenBotProfile={() => setIsBotProfileOpen(true)}
          onToggleWorkspace={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
          isWorkspaceOpen={isWorkspaceOpen}
          onClearHistory={handleClearHistory}
        />

        {/* Right Column: Screen Preview & Routines Panel */}
        <WhiteGlassRightPanel
          agent={currentAgent}
          routines={routines}
          onToggleRoutine={handleToggleRoutine}
          onTriggerRoutineNow={handleTriggerRoutineNow}
          onOpenFullWorkspace={() => setIsWorkspaceOpen(true)}
        />

        {/* Full Sandbox Terminal & VNC Desktop Workspace Panel (Collapsible Drawer) */}
        <WorkspacePanel
          isOpen={isWorkspaceOpen}
          onClose={() => setIsWorkspaceOpen(false)}
          files={files}
          terminalLogs={terminalLogs}
          browserState={browserState}
          onRunTerminalCommand={handleRunTerminalCommand}
        />
      </div>

      {/* iPhone Mobile Companion Simulator matching screenshot */}
      <PhoneCompanionSimulator
        isOpen={isPhoneSimulatorOpen}
        onClose={() => setIsPhoneSimulatorOpen(false)}
        agents={agents}
        activeAgent={currentAgent}
        messages={currentMessages}
        onSendMessage={handleSendMessage}
      />

      {/* Modals */}
      <AgentModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
        onSaveAgent={(newAgent) => {
          setAgents(prev => [newAgent, ...prev]);
          setActiveAgentId(newAgent.id);
        }}
      />

      <OrgLibraryModal
        isOpen={isOrgLibraryOpen}
        onClose={() => setIsOrgLibraryOpen(false)}
        existingAgentIds={agents.map(a => a.id)}
        onInstallAgent={(newAgent) => {
          setAgents(prev => [newAgent, ...prev]);
          setActiveAgentId(newAgent.id);
        }}
      />

      <PhonePairingModal
        isOpen={isPhonePairingOpen}
        onClose={() => setIsPhonePairingOpen(false)}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      <RoutinesModal
        isOpen={isRoutinesModalOpen}
        onClose={() => setIsRoutinesModalOpen(false)}
        routines={routines}
        agents={agents}
        onToggleRoutine={handleToggleRoutine}
        onTriggerRoutineNow={handleTriggerRoutineNow}
        onAddRoutine={handleAddRoutine}
        onDeleteRoutine={handleDeleteRoutine}
        onTriggerEvent={handleTriggerEvent}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

      {/* Bot Profile & Mascot Color Drawer */}
      <BotProfileDrawer
        isOpen={isBotProfileOpen}
        onClose={() => setIsBotProfileOpen(false)}
        agent={currentAgent}
        onUpdateAgent={(updatedAgent) => {
          setAgents(prev => prev.map(a => a.id === updatedAgent.id ? updatedAgent : a));
        }}
      />
    </div>
  );
}
