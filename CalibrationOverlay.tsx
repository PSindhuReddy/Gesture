
import React from 'react';

interface CalibrationOverlayProps {
  step: number;
}

const CalibrationOverlay: React.FC<CalibrationOverlayProps> = ({ step }) => {
  const instructions = [
    "Position yourself clearly in front of the optical sensor.",
    "Raise your right hand and spread fingers wide.",
    "Clench your fist and hold for 2 seconds.",
    "Move your head slowly from left to right.",
    "Blink rapidly three times for eye-tracking sync.",
    "Hold a neutral facial expression for base mapping.",
    "Calibration sequence complete. System ready."
  ];

  const currentInstruction = instructions[step % instructions.length];
  const progress = ((step % instructions.length) / instructions.length) * 100;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
        <div className="w-full h-full bg-cyan-950/20 backdrop-blur-[2px]"></div>
        
        <div className="absolute glass p-8 rounded-3xl border-yellow-500/50 max-w-md w-full mx-4 shadow-[0_0_50px_rgba(234,179,8,0.2)]">
            <div className="text-center">
                <div className="inline-block p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 mb-6 font-orbitron font-bold text-xs tracking-widest">
                    CALIBRATION STEP {Math.min(step + 1, instructions.length)} / {instructions.length}
                </div>
                
                <h3 className="text-2xl font-black font-orbitron text-white mb-6 uppercase tracking-tight">
                    {currentInstruction}
                </h3>

                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-6">
                    <div 
                        className="h-full bg-yellow-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <p className="text-slate-400 text-xs italic">
                    Optical sensors are mapping your biometric signature. Please remain within the designated tracking zone.
                </p>
            </div>
        </div>

        {/* Floating Tracking Points (Simulated) */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 border border-yellow-500/50 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/3 w-3 h-3 border border-yellow-500/50 rounded-full animate-ping delay-300"></div>
        <div className="absolute top-1/2 right-1/4 w-5 h-5 border border-yellow-500/50 rounded-full animate-ping delay-700"></div>
    </div>
  );
};

export default CalibrationOverlay;
