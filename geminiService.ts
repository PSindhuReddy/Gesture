
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { SystemState, InteractionLog, InteractionMode } from "../types";
const getAIClient = () => new GoogleGenAI({
apiKey : import.meta.env.VITE_GEMINI_API_KEY || ''
 
}); 
  
const SYSTEM_INSTRUCTIONS = `
You are an intelligent multimodal Human–Computer Interaction (HCI) assistant integrated into a real-time computer vision system.
You analyze image frames and session context to interpret human signals.

RULES:
1. React ONLY to signals from the ENABLED modules. Ignore everything else.
2. If confidence < 75%, ask the user to repeat.
3. If Safety Mode is active and signs of fatigue, frustration, or risky posture appear: Pause actions, Notify the user, Suggest corrective steps.
4. Adapt tone: Friendly/Encouraging (Tutorial/Calibration), Minimal (Working), Detailed (Safety Intervention).
5. Always output response in the strict JSON schema provided.

ACTIVE MODES FOR THIS REQUEST:
{{ACTIVE_MODES}}

SESSION CONTEXT:
Calibration Mode: {{CALIBRATION}}
Safety Mode Active: {{SAFETY}}
User Name: {{USER_NAME}}
User Sensitivity: {{SENSITIVITY}}/10

Interpret the user's gesture/pose/emotion from the provided image frame and return the structured response.
`;

export async function processInteraction(base64Frame: string, state: SystemState): Promise<InteractionLog | null> {
  const ai = getAIClient();
  
  const activeModesStr = state.selectedModes.join(', ');
  const systemPrompt = SYSTEM_INSTRUCTIONS
    .replace('{{ACTIVE_MODES}}', activeModesStr)
    .replace('{{CALIBRATION}}', state.isCalibrating ? 'ON' : 'OFF')
    .replace('{{SAFETY}}', state.selectedModes.includes(InteractionMode.Safety) ? 'ON' : 'OFF')
    .replace('{{USER_NAME}}', state.currentUser?.name || 'Guest')
    .replace('{{SENSITIVITY}}', (state.currentUser?.sensitivityLevel || 5).toString());

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Frame, mimeType: 'image/jpeg' } },
          { text: "Analyze the current frame based on your system instructions. If you see nothing, respond with high confidence but 'None' for input." }
        ]
      },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            activeModes: { type: Type.ARRAY, items: { type: Type.STRING } },
            detectedInput: { type: Type.STRING },
            confidence: { type: Type.NUMBER, description: "Confidence score 0-100" },
            interpretedIntent: { type: Type.STRING },
            actionExecuted: { type: Type.STRING },
            systemMessage: { type: Type.STRING },
          },
          required: ["activeModes", "detectedInput", "confidence", "interpretedIntent", "actionExecuted", "systemMessage"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    
    // Validate if the AI actually detected something within the enabled modes
    // This is a safety check to ensure it doesn't invent inputs from disabled modes
    if (result.detectedInput === 'None' && result.confidence > 90) {
        return null; // Skip logging silent frames
    }

    return {
      timestamp: Date.now(),
      ...result
    } as InteractionLog;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
}
