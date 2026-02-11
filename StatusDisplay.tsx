
import React from 'react';
import { InteractionLog } from '../types';

interface StatusDisplayProps {
  log: InteractionLog | null;
  isProcessing: boolean;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ log, isProcessing }) => {
  if (!log) {
    return (
      <div className="h-40 glass rounded-2xl border border-slate-800 flex items-center justify-center">
        <div className="text-center">
            <p className="text-slate-500 font-orbitron text-xs tracking-widest animate-pulse">AWAITING SENSORY INPUT...</p>
        </div>
      </div>
    );
  }

  const confidenceColor = log.confidence < 75 ? 'text-yellow-500' : 'text-cyan-400';

  return (
    <div className="h-auto glass rounded-2xl border border-slate-800 p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden">
      {isProcessing && (
          <div className="absolute top-0 left-0 h-1 bg-cyan-500 animate-[loading_2s_infinite]"></div>
      )}

      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="text-xs font-black font-orbitron text-slate-500 uppercase tracking-widest">Interpretation Engine</h3>
            <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-mono">CONFIDENCE:</span>
                <span className={`text-sm font-black font-mono ${confidenceColor}`}>{log.confidence}%</span>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-[10px] text-cyan-600 block mb-1 uppercase tracking-tighter">Detected Input</label>
                <div className="text-slate-200 font-bold text-sm bg-slate-800/50 p-2 rounded border border-slate-700">{log.detectedInput}</div>
            </div>
            <div>
                <label className="text-[10px] text-cyan-600 block mb-1 uppercase tracking-tighter">Interpreted Intent</label>
                <div className="text-slate-200 font-bold text-sm bg-slate-800/50 p-2 rounded border border-slate-700">{log.interpretedIntent}</div>
            </div>
        </div>
        
        <div>
            <label className="text-[10px] text-cyan-600 block mb-1 uppercase tracking-tighter">Action Executed</label>
            <div className="text-cyan-400 font-black text-base italic">__{log.actionExecuted}</div>
        </div>
      </div>

      <div className="w-px bg-slate-800 hidden md:block"></div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
            <label className="text-[10px] text-slate-500 block mb-2 uppercase tracking-widest">System Message</label>
            <p className="text-slate-300 text-sm leading-relaxed italic">
                "{log.systemMessage}"
            </p>
        </div>
        
        <div className="mt-4 flex gap-2">
            {log.activeModes.slice(0, 3).map(mode => (
                <span key={mode} className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500 border border-cyan-500/30 whitespace-nowrap">
                    {mode.split(' ')[0]} MOD
                </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default StatusDisplay;
