
import React, { useRef, useState, useEffect } from 'react';
import { SystemState, InteractionLog } from '../types';
import { processInteraction } from '../services/geminiService';
import CameraStream from './CameraStream';
import StatusDisplay from './StatusDisplay';
import InteractionHistory from './InteractionHistory';
import CalibrationOverlay from './CalibrationOverlay';

interface MainDashboardProps {
  state: SystemState;
  onInteraction: (log: InteractionLog) => void;
  onToggleCalibration: () => void;
  onLogout: () => void;
}

const MainDashboard: React.FC<MainDashboardProps> = ({ state, onInteraction, onToggleCalibration, onLogout }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const handleFrameCapture = async (base64Frame: string) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      const log = await processInteraction(base64Frame, state);
      if (log) {
        onInteraction(log);
        if (state.isCalibrating) {
            setTutorialStep(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error("Interaction processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">
      {/* Top Header */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 relative z-20">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-cyan-500 glow-cyan animate-pulse"></div>
          <h1 className="font-orbitron font-black text-cyan-400 tracking-tighter text-xl">PULSEAI LIVE</h1>
          <div className="h-4 w-px bg-slate-700"></div>
          <div className="text-[10px] text-slate-500 font-mono flex gap-4">
            <span>SESSION_ID: {state.currentUser?.id}</span>
            <span>MODES_ACTIVE: {state.selectedModes.length}</span>
            <span className={state.isSafetyAlertActive ? 'text-red-500 font-bold' : 'text-green-500'}>
              {state.isSafetyAlertActive ? '⚠️ SAFETY ADVISORY' : '● SYSTEM NOMINAL'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleCalibration}
            className={`px-4 py-1.5 rounded-full text-xs font-bold font-orbitron border transition-all ${
              state.isCalibrating 
                ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
            }`}
          >
            {state.isCalibrating ? 'STOP CALIBRATION' : 'ENTER CALIBRATION'}
          </button>
          <button 
            onClick={onLogout}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-red-500/20 hover:text-red-500 transition-all border border-transparent hover:border-red-500/50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Left: Visualization & Control */}
        <div className="flex-[2] flex flex-col gap-4 overflow-hidden relative">
          <div className="flex-1 bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
            <CameraStream onFrameCapture={handleFrameCapture} isProcessing={isProcessing} state={state} />
            {state.isCalibrating && (
              <CalibrationOverlay step={tutorialStep} />
            )}
            {state.isSafetyAlertActive && (
              <div className="absolute top-4 left-4 right-4 bg-red-600/20 border border-red-500/50 p-4 rounded-xl backdrop-blur-md animate-pulse z-30">
                <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                        <h4 className="text-red-500 font-black font-orbitron text-sm">SAFETY INTERVENTION ACTIVE</h4>
                        <p className="text-white text-xs">{state.lastLog?.systemMessage || "Irregular posture or fatigue detected."}</p>
                    </div>
                </div>
              </div>
            )}
          </div>
          <StatusDisplay log={state.lastLog} isProcessing={isProcessing} />
        </div>

        {/* Right: History & Profiles */}
        <div className="flex-1 max-w-md hidden lg:flex flex-col gap-4 overflow-hidden">
          <div className="glass rounded-2xl p-6 border border-slate-800 overflow-hidden flex flex-col">
            <h3 className="text-sm font-black font-orbitron text-slate-500 mb-6 uppercase tracking-widest border-b border-slate-800 pb-3">User Profile</h3>
            <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">IDENTIFIER</span>
                    <span className="text-xs font-mono text-cyan-400">{state.currentUser?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">SENSITIVITY</span>
                    <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => (
                            <div key={i} className={`h-1 w-4 rounded-full ${i <= (state.currentUser?.sensitivityLevel || 5) / 2 ? 'bg-cyan-500' : 'bg-slate-700'}`}></div>
                        ))}
                    </div>
                </div>
                <div>
                    <span className="text-xs text-slate-500 block mb-2 uppercase">Preferred Vectors</span>
                    <div className="flex flex-wrap gap-2">
                        {state.currentUser?.preferredGestures.map(g => (
                            <span key={g} className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-300 border border-slate-700">{g}</span>
                        ))}
                    </div>
                </div>
            </div>

            <h3 className="text-sm font-black font-orbitron text-slate-500 mb-6 uppercase tracking-widest border-b border-slate-800 pb-3">Activity Stream</h3>
            <InteractionHistory logs={state.currentUser?.interactionHistory || []} currentLog={state.lastLog} />
          </div>
        </div>
      </main>

      <footer className="h-8 bg-slate-900 border-t border-slate-800 px-6 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <div>CORE_SYSTEM_HEALTH: 98.4%</div>
        <div className="flex gap-4">
            <span>UPLINK: 25ms</span>
            <span>AI_CONFIDENCE: {state.lastLog ? `${state.lastLog.confidence}%` : 'N/A'}</span>
            <span>CLOCK: {new Date().toLocaleTimeString()}</span>
        </div>
      </footer>
    </div>
  );
};

export default MainDashboard;
