
import React from 'react';
import { InteractionMode } from '../types';
import { INITIAL_MODES } from '../constants';

interface ModeSelectorProps {
  selectedModes: InteractionMode[];
  onToggle: (mode: InteractionMode) => void;
  onStart: () => void;
  isCalibrating: boolean;
  onFinishCalibration: () => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ selectedModes, onToggle, onStart, isCalibrating }) => {
  return (
    <div className="h-screen bg-slate-950 p-8 md:p-20 overflow-y-scroll">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-5xl font-black font-orbitron text-white mb-4 tracking-tighter">
              {isCalibrating ? "SYSTEM CALIBRATION" : "CONFIGURE INTERFACE"}
            </h2>
            <p className="text-cyan-400 font-bold tracking-widest uppercase text-sm">
              {isCalibrating ? "Prepare for initialization procedure" : "Select active sensory modules"}
            </p>
          </div>
          <div className="hidden md:block">
            <span className="text-slate-500 text-xs font-mono">STEP 02 // MODULE_INIT</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_MODES.map((mode) => {
            const isActive = selectedModes.includes(mode);
            return (
              <div 
              key={mode}
              className={`cursor-pointer transition-all duration-300 p-6 rounded-xl border-2 group ${
              isActive 
                ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
                >
                <div className="flex items-start justify-between mb-4">
                   <div className={`p-3 rounded-lg ${isActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400 group-hover:text-cyan-400'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className={`w-6 h-6 rounded-md border-2 transition-colors ${isActive ? 'bg-cyan-500 border-cyan-500' : 'border-slate-700'}`}>
                    {isActive && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-950" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <h3 className={`text-lg font-bold mb-2 ${isActive ? 'text-white' : 'text-slate-300'}`}>{mode}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Advanced multimodal sensor processing for real-time {mode.toLowerCase()} environment integration.
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex items-center gap-6">
          <button 
            onClick={onStart}
            disabled={selectedModes.length === 0}
            className={`px-12 py-5 rounded-full font-black font-orbitron tracking-widest text-lg transition-all ${
              selectedModes.length > 0 
                ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 hover:scale-105 shadow-xl shadow-cyan-900/30' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            INITIALIZE SESSION
          </button>
          <div className="text-slate-500 text-xs">
            {selectedModes.length} MODULES STAGED FOR ACTIVATION
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;
