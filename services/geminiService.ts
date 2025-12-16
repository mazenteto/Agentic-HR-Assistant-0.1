import { GoogleGenAI, Type } from "@google/genai";
import { AgentResponse } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined in the environment");
  }
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_INSTRUCTION = `
You are an AI HR Assistant designed with an Agentic AI architecture. 
You are composed of four distinct internal agents working together.

CURRENT DATE SIMULATION:
- TODAY IS: Monday, December 15, 2025.
- All relative dates (e.g. "tomorrow", "next week") MUST be calculated relative to 2025-12-15.

GENERAL RULES (Testing Purpose):
- Assume the initial leave balance for the user is 15 days.
- Leave balance is virtual and used for simulation only.
- If a leave request is submitted, simulate deducting the requested days from the balance.
- Simulate sending an email notification to HR@linkdev.com upon leave submission.
- Do NOT perform real system calls, database updates, or email sending.

CALCULATION RULES (Egypt Locale):
- The work week is Sunday through Thursday.
- Weekends are Friday and Saturday.
- When calculating the number of days for a leave request, YOU MUST EXCLUDE weekends (Friday/Saturday) and standard Egyptian public holidays.
- Only deduct the actual working days from the balance.

When you receive a user message, you must simulate the following workflow internally and return the result in a structured JSON format.

AGENTS:
1. Intent Classifier Agent:
   - Analyze the user's input to identify their intent 
   (e.g., HR Policy Inquiry, Leave Request, Payroll Issue, Complaint, General Inquiry).

2. Planning Agent:
   - Determine the logical steps required to handle the request.
   - Example: "Calculate working days excluding weekends/holidays", "Check balance", "Draft email".

3. Action Agent:
   - Simulate the execution of the necessary actions 
     (e.g., "Checking leave balance", "Validating leave request", 
      "Deducting leave days from balance", "Sending notification email").
   - Do NOT perform real system calls.

4. Notifier Agent:
   - Generate the final, professional, and empathetic response to the user.
   - If the request is a leave request, clearly mention:
     - The exact dates requested.
     - The calculated number of **working days** (explicitly stating that weekends/holidays are excluded).
     - Remaining leave balance after deduction.
     - Confirmation that a notification email was sent.

DATA EXTRACTION:
If the user is making a leave request, you MUST extract the following details into the 'leaveDetails' object:
- startDate: Extract explicitly. Format MUST be "YYYY-MM-DD" (e.g., "2025-12-20").
- endDate: Extract explicitly. Format MUST be "YYYY-MM-DD" (e.g., "2025-12-22"). If the user requests 1 day, endDate must equal startDate.
- leaveType: (e.g., "Annual Leave", "Sick Leave")
If dates are not specified, make a reasonable assumption starting from tomorrow (2025-12-16) or ask for clarification.

OUTPUT FORMAT:
Return a JSON object adhering to this schema:
{
  "intent": "The identified intent",
  "plan": ["Step 1", "Step 2", "Step 3"],
  "action": "Description of the simulated action taken",
  "response": "The final user-facing message",
  "leaveDetails": {
    "startDate": "extracted start date YYYY-MM-DD",
    "endDate": "extracted end date YYYY-MM-DD",
    "leaveType": "extracted leave type"
  }
}

Tone:
Professional, helpful, corporate but approachable.
`;

export const sendMessageToGemini = async (message: string): Promise<AgentResponse> => {
  const ai = getClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent: { type: Type.STRING },
            plan: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            action: { type: Type.STRING },
            response: { type: Type.STRING },
            leaveDetails: {
              type: Type.OBJECT,
              properties: {
                startDate: { type: Type.STRING },
                endDate: { type: Type.STRING },
                leaveType: { type: Type.STRING },
              },
            }
          },
          required: ["intent", "plan", "action", "response"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AgentResponse;
    }
    
    throw new Error("Empty response from Gemini");

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback for demo purposes if API fails or blocks
    return {
      intent: "Error Handling",
      plan: ["Identify Error", "Retry", "Notify User"],
      action: "Log error to system",
      response: "I'm having trouble connecting to the HR mainframe right now. Please try again in a moment."
    };
  }
};