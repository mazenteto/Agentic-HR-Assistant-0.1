import React from 'react';

export type ScreenType = 'WELCOME' | 'DASHBOARD' | 'CHAT' | 'FORM' | 'SUCCESS';

export interface AgentResponse {
  intent: string;
  plan: string[];
  action: string;
  response: string;
  leaveDetails?: {
    startDate?: string;
    endDate?: string;
    leaveType?: string;
  };
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agentData?: AgentResponse; // Only present for assistant messages
  actionType?: 'REVIEW_FORM'; // Trigger for UI actions
  timestamp: Date;
}

export enum AgentStatus {
  IDLE = 'IDLE',
  CLASSIFYING = 'CLASSIFYING',
  PLANNING = 'PLANNING',
  ACTING = 'ACTING',
  NOTIFYING = 'NOTIFYING',
  COMPLETE = 'COMPLETE'
}

export interface AgentStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
  icon: React.ReactNode;
}

export interface LeaveRequestData {
  name: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}