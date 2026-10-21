import React from 'react';
import { 
  Clock, 
  Pause, 
  Play, 
  MousePointer, 
  Maximize2, 
  Terminal, 
  Calendar,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Agent, ScheduledRoutine } from '../types';

interface WhiteGlassRightPanelProps {
  agent: Agent;
  routines: ScheduledRoutine[];
  onToggleRoutine: (routineId: string) => void;
  onTriggerRoutineNow: (routineId: string) => void;
  onOpenFullWorkspace: () => void;
}

export const WhiteGlassRightPanel: React.FC<WhiteGlassRightPanelProps> = ({
  agent,
  routines,
  onToggleRoutine,
  onTriggerRoutineNow,
  onOpenFullWorkspace
}) => {
  return (
    <aside className="w-72 lg:w-80 flex-shrink-0 bg-white/70 backdrop-blur-xl border-l border-zinc-200/70 p-4 flex flex-col justify-between h-full select-none">
      <div className="space-y-5">
        {/* Top: Live Bot's Screen Viewport matching reference screenshot */}
        <div className="space-y-2">
          <div 
            onClick={onOpenFullWorkspace}
            className="group relative rounded-xl border border-zinc-200/90 bg-white p-2 shadow-xs hover:shadow-md transition-all cursor-pointer overflow-hidden"
          >
            {/* Screen Window Header */}
            <div className="flex items-center justify-between pb-1.5 border-b border-zinc-100 mb-1.5">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="text-[10px] font-mono text-zinc-400 ml-1">Calendar & CRM</span>
              </div>
              <Maximize2 className="w-3 h-3 text-zinc-400 group-hover:text-zinc-800 transition-colors" />
            </div>

            {/* High-fidelity Calendar/CRM screenshot visualization matching screenshot */}
            <div className="relative rounded-lg bg-zinc-50 border border-zinc-100 p-2 overflow-hidden h-36 flex flex-col justify-between">
              {/* Calendar Grid Representation */}
              <div className="grid grid-cols-5 gap-1 text-[8px] font-mono">
                <div className="h-6 rounded bg-sky-200/80 border border-sky-300/80 p-0.5 text-sky-800 truncate">Standup</div>
                <div className="h-6 rounded bg-emerald-200/80 border border-emerald-300/80 p-0.5 text-emerald-800 truncate">Sync</div>
                <div className="h-6 rounded bg-indigo-200/80 border border-indigo-300/80 p-0.5 text-indigo-800 truncate">Brightside</div>
                <div className="h-6 rounded bg-amber-200/80 border border-amber-300/80 p-0.5 text-amber-800 truncate">Review</div>
                <div className="h-6 rounded bg-purple-200/80 border border-purple-300/80 p-0.5 text-purple-800 truncate">Demo</div>
              </div>

              <div className="space-y-1">
                <div className="h-5 rounded bg-sky-500 text-white text-[9px] px-1.5 flex items-center justify-between font-medium">
                  <span>Product Review • 2:00 PM</span>
                  <span className="text-[8px] opacity-80">Zoom</span>
                </div>
                <div className="h-5 rounded bg-emerald-600 text-white text-[9px] px-1.5 flex items-center justify-between font-medium">
                  <span>Pilot Sign-off • 4:30 PM</span>
                  <span className="text-[8px] opacity-80">Slack</span>
                </div>
              </div>

              {/* Bot Mouse Cursor Pointer */}
              <div className="absolute top-[38%] right-[22%] pointer-events-none flex items-center gap-1 transition-all">
                <MousePointer className="w-3.5 h-3.5 text-black fill-black drop-shadow-sm" />
              </div>
            </div>
          </div>

          <div className="text-center text-[11px] font-medium text-zinc-500">
            {agent.name}'s screen
          </div>
        </div>

        {/* Middle: Routines List exactly matching reference screenshot */}
        <div className="space-y-3 pt-2 border-t border-zinc-200/60">
          <div className="text-xs font-semibold text-zinc-500 tracking-tight">
            Routines
          </div>

          <div className="space-y-2.5">
            {routines.map((routine) => (
              <div
                key={routine.id}
                className="flex items-start justify-between gap-2 p-1.5 rounded-lg hover:bg-white/80 transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 text-zinc-400">
                    {routine.isActive ? (
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    ) : (
                      <Pause className="w-3.5 h-3.5 text-zinc-300" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-zinc-800 leading-snug">
                      {routine.title}
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      {routine.isActive ? routine.scheduleHuman : 'Paused'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onTriggerRoutineNow(routine.id)}
                  className="p-1 rounded text-zinc-300 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
                  title="Run routine now"
                >
                  <Play className="w-3 h-3 fill-current" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: Expand Full Sandbox VM Terminal */}
      <div className="pt-3 border-t border-zinc-200/60">
        <button
          onClick={onOpenFullWorkspace}
          className="w-full py-2 px-3 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-all shadow-xs flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Open VM Workspace</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
        </button>
      </div>
    </aside>
  );
};
