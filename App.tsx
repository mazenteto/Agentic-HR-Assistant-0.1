import React, { useState, useEffect, useRef } from 'react';
import { Send, Menu, Sparkles, X, ChevronLeft } from 'lucide-react';
import AgentVisualizer from './components/AgentVisualizer';
import ChatMessage from './components/ChatMessage';
import { WelcomeScreen, DashboardScreen, FormScreen, SuccessScreen } from './components/AppScreens';
import { Message, AgentStatus, ScreenType, LeaveRequestData } from './types';
import { sendMessageToGemini } from './services/geminiService';

export default function App() {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('WELCOME');
  
  // App Data State
  const [pendingRequests, setPendingRequests] = useState(0);
  
  // Initialize with simulated date (Dec 15, 2025)
  const SIMULATED_TODAY = new Date('2025-12-15');
  const SIMULATED_TOMORROW = new Date(SIMULATED_TODAY);
  SIMULATED_TOMORROW.setDate(SIMULATED_TODAY.getDate() + 1);

  const [formData, setFormData] = useState<LeaveRequestData>({
    name: 'Mohamed Mamdouh',
    leaveType: 'Annual Leave',
    startDate: SIMULATED_TODAY.toISOString().split('T')[0],
    endDate: SIMULATED_TOMORROW.toISOString().split('T')[0],
    reason: 'Personal time off'
  });

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello, I'm your AI HR Assistant. How can I help you today? I can assist with policies, leave requests, or general inquiries.",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [agentStatus, setAgentStatus] = useState<AgentStatus>(AgentStatus.IDLE);
  
  // Visualizer State
  const [currentIntent, setCurrentIntent] = useState<string>('');
  const [currentPlan, setCurrentPlan] = useState<string[]>([]);
  const [currentAction, setCurrentAction] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (currentScreen === 'CHAT') {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentScreen]);

  // --- Handlers ---

  const handleSendMessage = async () => {
    // Allow sending if status is IDLE or COMPLETE
    if (!inputText.trim() || (agentStatus !== AgentStatus.IDLE && agentStatus !== AgentStatus.COMPLETE)) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    
    await processAgentResponse(userMsg.content);
  };

  const processAgentResponse = async (userPrompt: string) => {
    try {
      setAgentStatus(AgentStatus.CLASSIFYING);
      setCurrentIntent('');
      setCurrentPlan([]);
      setCurrentAction('');
      
      // Simulate/Call AI
      const geminiData = await sendMessageToGemini(userPrompt);

      // 1. Intent
      setCurrentIntent(geminiData.intent);

      // Update form data smartly with validation
      if (geminiData.leaveDetails) {
        setFormData(prev => {
          let newStart = geminiData.leaveDetails?.startDate;
          let newEnd = geminiData.leaveDetails?.endDate;
          const newType = geminiData.leaveDetails?.leaveType;

          // Date Validation Logic
          // 1. Parse dates (assuming YYYY-MM-DD from Gemini)
          const startDateObj = newStart ? new Date(newStart) : null;
          const endDateObj = newEnd ? new Date(newEnd) : null;
          
          // 2. Validate Start Date >= Simulated Today
          if (startDateObj && startDateObj < SIMULATED_TODAY) {
            // If the requested start date is in the past, correct it to Today
            newStart = SIMULATED_TODAY.toISOString().split('T')[0];
          }

          // 3. Smart End Date Logic
          if (newStart && !newEnd) {
             // If start exists but no end, default to 1 day (End = Start)
             newEnd = newStart;
          } else if (newStart && newEnd && endDateObj && startDateObj) {
             // 4. Validate End Date >= Start Date
             // Note: Re-parsing newStart in case it was corrected above
             const correctedStartObj = new Date(newStart);
             if (endDateObj < correctedStartObj) {
                newEnd = newStart;
             }
          }
          
          return {
            ...prev,
            startDate: newStart || prev.startDate,
            endDate: newEnd || prev.endDate,
            leaveType: newType || prev.leaveType,
          };
        });
      }
      
      // 2. Planning
      await new Promise(r => setTimeout(r, 800));
      setAgentStatus(AgentStatus.PLANNING);
      setCurrentPlan(geminiData.plan);

      // 3. Action
      await new Promise(r => setTimeout(r, 1000));
      setAgentStatus(AgentStatus.ACTING);
      setCurrentAction(geminiData.action);

      // 4. Notification
      await new Promise(r => setTimeout(r, 800));
      setAgentStatus(AgentStatus.NOTIFYING);

      // 5. Complete & Check for Form Trigger
      await new Promise(r => setTimeout(r, 600));
      
      // Check if we should trigger a form action based on intent
      const isLeaveRequest = geminiData.intent.toLowerCase().includes('leave') || 
                             geminiData.intent.toLowerCase().includes('request');
      
      const botMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: geminiData.response,
        agentData: geminiData,
        // If it's a leave request, add the action button
        actionType: isLeaveRequest ? 'REVIEW_FORM' : undefined,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.error("Error in agent workflow:", error);
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I encountered a system error while processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      // ALWAYS unlock the UI
      setAgentStatus(AgentStatus.COMPLETE);
    }
  };

  const handleChatAction = (type: string) => {
    if (type === 'REVIEW_FORM') {
      setCurrentScreen('FORM');
    }
  };

  const handleFormChange = (field: keyof LeaveRequestData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = () => {
    setPendingRequests(prev => prev + 1);
    setCurrentScreen('SUCCESS');
  };

  // --- Render Views ---

  if (currentScreen === 'WELCOME') {
    return <WelcomeScreen onLogin={() => setCurrentScreen('DASHBOARD')} />;
  }

  if (currentScreen === 'DASHBOARD') {
    return <DashboardScreen onNavigate={setCurrentScreen} pendingCount={pendingRequests} />;
  }

  if (currentScreen === 'FORM') {
    return (
      <FormScreen 
        data={formData} 
        onChange={handleFormChange}
        onSubmit={handleFormSubmit} 
        onCancel={() => setCurrentScreen('CHAT')} 
      />
    );
  }

  if (currentScreen === 'SUCCESS') {
    return <SuccessScreen onBack={() => setCurrentScreen('DASHBOARD')} data={formData} />;
  }

  // --- Chat View (Existing Logic) ---
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* Sidebar - Agent Visualizer */}
      <div className={`${isSidebarOpen ? 'w-full md:w-96 absolute md:relative z-20' : 'hidden'} h-full bg-white md:bg-transparent md:block border-r border-gray-200 transition-all duration-300 flex-shrink-0`}>
        <div className="h-full p-4">
          <div className="md:hidden flex justify-end mb-2">
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-gray-500">
               <X className="w-6 h-6" />
            </button>
          </div>
          <AgentVisualizer 
            status={agentStatus} 
            currentIntent={currentIntent}
            currentPlan={currentPlan}
            currentAction={currentAction}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative w-full">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-3">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 -ml-2 text-gray-600">
              <Menu className="w-6 h-6" />
            </button>
            <button onClick={() => setCurrentScreen('DASHBOARD')} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 mr-2">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-800">HR Assistant</h1>
              <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Active
              </p>
            </div>
          </div>
        </header>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 scrollbar-hide">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} onAction={handleChatAction} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={agentStatus === AgentStatus.IDLE || agentStatus === AgentStatus.COMPLETE ? "Type your request (e.g., 'Request leave for Nov 3-5')..." : "Agents are working..."}
              disabled={agentStatus !== AgentStatus.IDLE && agentStatus !== AgentStatus.COMPLETE}
              className="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-xl pl-4 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              rows={1}
              style={{ minHeight: '60px' }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || (agentStatus !== AgentStatus.IDLE && agentStatus !== AgentStatus.COMPLETE)}
              className="absolute right-3 top-3 bottom-3 aspect-square bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}