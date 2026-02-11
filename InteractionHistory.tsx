
import React from 'react';
import { InteractionLog } from '../types';

interface InteractionHistoryProps {
  logs: InteractionLog[];
  currentLog: InteractionLog | null;
}

const InteractionHistory: React.FC<InteractionHistoryProps> = ({ logs, currentLog }) => {
  const displayLogs = [...logs].reverse();
  
  return (
    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
      {currentLog && (
          <div className="p-3 bg-cyan-500/5 border-l-4 border-cyan-500 rounded-r-lg animate-fade-in">
              <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-cyan-400">NOW</span>
                  <span className="text-[9px] text-slate-500 font-mono">{currentLog.confidence}% MATCH</span>
              </div>
              <p className="text-xs text-slate-200 font-semibold">{currentLog.actionExecuted}</p>
          </div>
      )}
      
      {displayLogs.length === 0 && !currentLog && (
          <div className="h-full flex items-center justify-center text-slate-700 italic text-sm">
              No recent activity recorded
          </div>
      )}

      {displayLogs.map((log, idx) => (
        <div key={idx} className="p-3 bg-slate-900/40 border border-slate-800/50 rounded-lg opacity-60 hover:opacity-100 transition-opacity">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-slate-500 font-mono">
                {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
            </span>
            <span className="text-[9px] text-slate-600 uppercase">{log.activeModes[0]}</span>
          </div>
          <p className="text-xs text-slate-400">{log.actionExecuted}</p>
        </div>
      ))}
    </div>
  );
};

export default InteractionHistory;
