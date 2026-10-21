import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Play, 
  Plus, 
  CheckCircle, 
  Pause, 
  Trash2, 
  Zap, 
  Mail, 
  GitPullRequest, 
  MessageSquare
} from 'lucide-react';
import { Agent, ScheduledRoutine } from '../types';
import { MascotAvatar } from './MascotAvatar';

interface RoutinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  routines: ScheduledRoutine[];
  agents: Agent[];
  onToggleRoutine: (routineId: string) => void;
  onTriggerRoutineNow: (routineId: string) => void;
  onAddRoutine: (routine: ScheduledRoutine) => void;
  onDeleteRoutine: (routineId: string) => void;
  onTriggerEvent?: (eventName: string, payloadSummary: string, agentId: string) => void;
}

export const RoutinesModal: React.FC<RoutinesModalProps> = ({
  isOpen,
  onClose,
  routines,
  agents,
  onToggleRoutine,
  onTriggerRoutineNow,
  onAddRoutine,
  onDeleteRoutine,
  onTriggerEvent
}) => {
  const [activeTab, setActiveTab] = useState<'cron' | 'events'>('cron');
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [agentId, setAgentId] = useState(agents[0]?.id || 'agent-chief-of-staff');
  const [scheduleCron, setScheduleCron] = useState('0 9 * * *');
  const [scheduleHuman, setScheduleHuman] = useState('Every day at 09:00 AM');
  const [prompt, setPrompt] = useState('');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !prompt.trim()) return;

    const newRoutine: ScheduledRoutine = {
      id: `routine-${Date.now()}`,
      title: title.trim(),
      agentId,
      scheduleCron,
      scheduleHuman,
      nextRun: 'Tomorrow at 09:00 AM',
      isActive: true,
      prompt: prompt.trim()
    };

    onAddRoutine(newRoutine);
    setTitle('');
    setPrompt('');
    setIsCreating(false);
  };

  const eventTriggers = [
    {
      id: 'evt-email',
      name: 'Inbound Email Received (VIP)',
      agentId: 'agent-chief-of-staff',
      source: 'Google Mail',
      description: 'Triggered when Brightside Health or an investor emails your inbox',
      samplePayload: 'From: partner@brightside.com | Subject: Pilot approval next steps',
      icon: <Mail className="w-4 h-4 text-rose-500" />
    },
    {
      id: 'evt-pr',
      name: 'GitHub Pull Request Opened',
      agentId: 'agent-qubot-core',
      source: 'GitHub Webhook',
      description: 'Triggered whenever a pull request is created or updated',
      samplePayload: 'PR #42: feat(auth): add hardware security key WebAuthn support',
      icon: <GitPullRequest className="w-4 h-4 text-purple-600" />
    },
    {
      id: 'evt-slack',
      name: 'Slack Urgent Mention',
      agentId: 'agent-chief-of-staff',
      source: 'Slack Bot API',
      description: 'Triggered when @chief_of_staff is mentioned in #brightside-shared',
      samplePayload: 'Channel: #brightside-shared | Sarah: Can we confirm SSO specs by 3 PM?',
      icon: <MessageSquare className="w-4 h-4 text-emerald-600" />
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm select-none">
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-2xl border border-zinc-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200/70 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-3">
            <MascotAvatar size="sm" />
            <div>
              <h2 className="text-sm font-bold text-zinc-900 font-sans">QUBOT Automated Routines & Events</h2>
              <p className="text-xs text-zinc-500">Autonomous calendar triggers & real-time webhook listeners</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-zinc-200/70 px-6 bg-zinc-50/50 text-xs">
          <button
            onClick={() => setActiveTab('cron')}
            className={`py-2.5 px-4 font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'cron'
                ? 'border-black text-zinc-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Scheduled Routines ({routines.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`py-2.5 px-4 font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'events'
                ? 'border-black text-zinc-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Event & Webhook Triggers</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-zinc-700 flex-1">
          {activeTab === 'cron' ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-mono text-[11px]">
                  CRON RUNNER • {routines.length} ACTIVE
                </span>
                <button
                  onClick={() => setIsCreating(!isCreating)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-black hover:bg-zinc-800 text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isCreating ? 'Cancel' : 'New Routine'}</span>
                </button>
              </div>

              {isCreating && (
                <form onSubmit={handleCreate} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                  <h3 className="font-bold text-zinc-900">Configure New Schedule</h3>

                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1">Routine Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Daily Standup Prep & Notes Sync"
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-1.5 text-zinc-900 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-700 font-semibold mb-1">Assigned Agent</label>
                      <select
                        value={agentId}
                        onChange={(e) => setAgentId(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-xl px-2.5 py-1.5 text-zinc-800 font-mono outline-none"
                      >
                        {agents.map(a => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-zinc-700 font-semibold mb-1">Frequency</label>
                      <select
                        value={scheduleHuman}
                        onChange={(e) => {
                          setScheduleHuman(e.target.value);
                          if (e.target.value.includes('hour')) setScheduleCron('0 * * * *');
                          else if (e.target.value.includes('day')) setScheduleCron('0 9 * * *');
                          else setScheduleCron('0 10 * * 1');
                        }}
                        className="w-full bg-white border border-zinc-200 rounded-xl px-2.5 py-1.5 text-zinc-800 font-mono outline-none"
                      >
                        <option value="Every day at 8:00 AM">Daily at 8:00 AM</option>
                        <option value="Weekdays at 6:00 PM">Weekdays at 6:00 PM</option>
                        <option value="Fridays at 5:00 PM">Fridays at 5:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1">Agent Directive</label>
                    <textarea
                      required
                      rows={2}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="What should the bot do at trigger time?"
                      className="w-full bg-white border border-zinc-200 rounded-xl p-2.5 text-zinc-900 font-mono outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-semibold cursor-pointer"
                    >
                      Save Schedule
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2.5">
                {routines.map((routine) => (
                  <div
                    key={routine.id}
                    className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-200/80 hover:bg-white hover:border-zinc-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-900">{routine.title}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.2 rounded-full ${
                          routine.isActive ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-zinc-200 text-zinc-600'
                        }`}>
                          {routine.isActive ? 'Active' : 'Paused'}
                        </span>
                      </div>

                      <p className="text-[11px] text-zinc-600">
                        {routine.prompt}
                      </p>

                      <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-mono pt-0.5">
                        <span className="flex items-center gap-1 text-zinc-600">
                          <Clock className="w-3 h-3" />
                          {routine.scheduleHuman}
                        </span>
                        <span>•</span>
                        <span>Next: {routine.nextRun}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => onTriggerRoutineNow(routine.id)}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-200 font-semibold flex items-center gap-1 text-[11px] cursor-pointer shadow-2xs"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        Run
                      </button>

                      <button
                        onClick={() => onToggleRoutine(routine.id)}
                        className="p-1.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-600 border border-zinc-200 cursor-pointer shadow-2xs"
                      >
                        {routine.isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => onDeleteRoutine(routine.id)}
                        className="p-1.5 rounded-xl hover:bg-red-50 text-zinc-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 text-zinc-600 text-[11px]">
                Event triggers wake up your QUBOT agents automatically when external events happen in connected apps.
              </div>

              <div className="space-y-2.5">
                {eventTriggers.map(evt => (
                  <div
                    key={evt.id}
                    className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-start justify-between gap-4 shadow-2xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white border border-zinc-200 flex items-center justify-center flex-shrink-0 shadow-2xs">
                        {evt.icon}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-900">{evt.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-200/80 text-zinc-700">
                            {evt.source}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-600">{evt.description}</p>
                        <div className="p-2 bg-white rounded-xl border border-zinc-200 font-mono text-[10px] text-zinc-600">
                          {evt.samplePayload}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (onTriggerEvent) {
                          onTriggerEvent(evt.name, evt.samplePayload, evt.agentId);
                          onClose();
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap self-center shadow-2xs"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Simulate
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
