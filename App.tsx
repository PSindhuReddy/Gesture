
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { InteractionMode, SystemState, UserProfile, InteractionLog } from './types';
import { INITIAL_MODES, MOCK_USER } from './constants';
import AuthScreen from './components/AuthScreen';
import ModeSelector from './components/ModeSelector';
import MainDashboard from './components/MainDashboard';
import { processInteraction } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<SystemState>({
    isAuthenticated: false,
    isCalibrating: false,
    selectedModes: [],
    currentUser: null,
    lastLog: null,
    isProcessing: false,
    isSafetyAlertActive: false,
  });

  const handleLogin = (user: UserProfile) => {
    setState(prev => ({ ...prev, isAuthenticated: true, currentUser: user }));
  };

  const handleModeToggle = (mode: InteractionMode) => {
    setState(prev => {
      const newModes = prev.selectedModes.includes(mode)
        ? prev.selectedModes.filter(m => m !== mode)
        : [...prev.selectedModes, mode];
      return { ...prev, selectedModes: newModes };
    });
  };

  const startSession = () => {
    if (state.selectedModes.length === 0) {
      alert("Please select at least one interaction mode.");
      return;
    }
    setState(prev => ({ ...prev, isCalibrating: true }));
  };

  const finishCalibration = () => {
    setState(prev => ({ ...prev, isCalibrating: false }));
  };

  const logInteraction = (log: InteractionLog) => {
    setState(prev => ({
      ...prev,
      lastLog: log,
      isSafetyAlertActive: log.systemMessage.toLowerCase().includes('safety') || log.systemMessage.toLowerCase().includes('risky')
    }));
  };

  if (!state.isAuthenticated) {
    return <AuthScreen onLogin={() => handleLogin(MOCK_USER)} />;
  }

  if (state.selectedModes.length === 0 || (state.isCalibrating && state.lastLog === null)) {
    return (
      <ModeSelector 
        selectedModes={state.selectedModes} 
        onToggle={handleModeToggle} 
        onStart={startSession}
        isCalibrating={state.isCalibrating}
        onFinishCalibration={finishCalibration}
      />
    );
  }

  return (
    <MainDashboard 
      state={state} 
      onInteraction={logInteraction}
      onToggleCalibration={() => setState(prev => ({ ...prev, isCalibrating: !prev.isCalibrating }))}
      onLogout={() => window.location.reload()}
    />
  );
};

export default App;
