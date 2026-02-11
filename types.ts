
export enum InteractionMode {
  HandGesture = 'Hand Gesture Recognition',
  FacialEmotion = 'Facial Emotion Detection',
  PosturePose = 'Posture & Body Pose Tracking',
  VoiceGesture = 'Voice + Gesture Commands',
  EyeBlink = 'Eye Movement / Blink Control (Accessibility Mode)',
  AttentionFocus = 'Attention / Focus Detection',
  Safety = 'Safety Mode (detect unsafe posture, fatigue, distress)',
  Gaming = 'Gaming Mode',
  Presentation = 'Presentation Control Mode',
  SmartEnv = 'Smart Environment Mode'
}

export interface UserProfile {
  id: string;
  name: string;
  preferredGestures: string[];
  sensitivityLevel: number; // 1-10
  accessibilityNeeds: string[];
  interactionHistory: InteractionLog[];
}

export interface InteractionLog {
  timestamp: number;
  activeModes: string[];
  detectedInput: string;
  confidence: number;
  interpretedIntent: string;
  actionExecuted: string;
  systemMessage: string;
}

export interface SystemState {
  isAuthenticated: boolean;
  isCalibrating: boolean;
  selectedModes: InteractionMode[];
  currentUser: UserProfile | null;
  lastLog: InteractionLog | null;
  isProcessing: boolean;
  isSafetyAlertActive: boolean;
}
