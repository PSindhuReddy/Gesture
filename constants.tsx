
import React from 'react';
import { InteractionMode } from './types';

export const INITIAL_MODES = [
  InteractionMode.HandGesture,
  InteractionMode.FacialEmotion,
  InteractionMode.PosturePose,
  InteractionMode.VoiceGesture,
  InteractionMode.EyeBlink,
  InteractionMode.AttentionFocus,
  InteractionMode.Safety,
  InteractionMode.Gaming,
  InteractionMode.Presentation,
  InteractionMode.SmartEnv
];

export const MOCK_USER: any = {
  id: 'USER-882-QX',
  name: 'Nova Prime',
  preferredGestures: ['Double Tap', 'Swipe Horizon', 'Pinch Zoom'],
  sensitivityLevel: 8,
  accessibilityNeeds: ['High Contrast'],
  interactionHistory: []
};
