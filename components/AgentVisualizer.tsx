import React from 'react';
import { AgentStatus } from '../types';
import { BrainCircuit, Search, ListTodo, Hammer, MessageSquare } from 'lucide-react';

interface AgentVisualizerProps {
  status: AgentStatus;
  currentIntent?: string;
  currentPlan?: string[];
  currentAction?: string;
}

const AgentVisualizer: React.FC<AgentVisualizerProps> = ({ status, currentIntent, currentPlan, currentAction }) => {
  
  const getStepStatus = (stepStatus: AgentStatus, current: AgentStatus) => {
    const order = [AgentStatus.CLASSIFYING, AgentStatus.PLANNING, AgentStatus.ACTING, AgentStatus.NOTIFYING, AgentStatus.COMPLETE];
    const currentIndex = order.indexOf(current);
    const stepIndex = order.indexOf(stepStatus);

    if (current === AgentStatus.IDLE) return 'text-gray-400 border-gray-200 bg-white';
    if (current === AgentStatus.COMPLETE) return 'text-green-600 border-green-200 bg-green-50';
    
    if (stepIndex < currentIndex) return 'text-green-600 border-green-200 bg-green-50';
    if (stepIndex === currentIndex) return 'text-blue-600 border-blue-200 bg-blue-50 ring-2 ring-blue-100 animate-pulse';
    return 'text-gray-300 border-gray-100 bg-white';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6 text-gray-800">
        <BrainCircuit className={`w-6 h-6 ${status !== AgentStatus.IDLE && status !== AgentStatus.COMPLETE ? 'text-indigo-600 animate-spin-slow' : 'text-gray-400'}`} />
        <h2 className="font-semibold text-lg">Agent Workflow</h2>
      </div>

      <div className="space-y-6 relative">
        {/* Connecting Line */}
        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-100 -z-10"></div>

        {/* 1. Intent Classifier */}
        <div className={`flex gap-4 p-3 rounded-lg transition-all duration-300 border ${getStepStatus(AgentStatus.CLASSIFYING, status)}`}>
          <div className="mt-1">
            <div className="w-8 h-8 rounded-full bg-white border border-current flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wide">Intent Classifier</h3>
            <p className="text-xs mt-1 opacity-90">
              {status === AgentStatus.IDLE ? 'Waiting for input...' : 
               status === AgentStatus.CLASSIFYING ? 'Analyzing request...' : 
               currentIntent || 'Identified'}
            </p>
          </div>
        </div>

        {/* 2. Planning Agent */}
        <div className={`flex gap-4 p-3 rounded-lg transition-all duration-300 border ${getStepStatus(AgentStatus.PLANNING, status)}`}>
           <div className="mt-1">
            <div className="w-8 h-8 rounded-full bg-white border border-current flex items-center justify-center">
              <ListTodo className="w-4 h-4" />
            </div>
          </div>
          <div className="w-full">
            <h3 className="font-medium text-sm uppercase tracking-wide">Planning Agent</h3>
            <div className="text-xs mt-1 opacity-90">
              {status === AgentStatus.PLANNING ? 'Formulating strategy...' : 
               currentPlan && currentPlan.length > 0 ? (
                 <ul className="list-disc pl-4 space-y-0.5 mt-1">
                   {currentPlan.map((step, i) => <li key={i}>{step}</li>)}
                 </ul>
               ) : 'Pending plan...'}
            </div>
          </div>
        </div>

        {/* 3. Action Agent */}
        <div className={`flex gap-4 p-3 rounded-lg transition-all duration-300 border ${getStepStatus(AgentStatus.ACTING, status)}`}>
           <div className="mt-1">
            <div className="w-8 h-8 rounded-full bg-white border border-current flex items-center justify-center">
              <Hammer className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wide">Action Agent</h3>
            <p className="text-xs mt-1 opacity-90">
               {status === AgentStatus.ACTING ? 'Simulating execution...' : 
                currentAction || 'Pending action...'}
            </p>
          </div>
        </div>

        {/* 4. Notifier Agent */}
        <div className={`flex gap-4 p-3 rounded-lg transition-all duration-300 border ${getStepStatus(AgentStatus.NOTIFYING, status)}`}>
           <div className="mt-1">
            <div className="w-8 h-8 rounded-full bg-white border border-current flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wide">Notifier Agent</h3>
            <p className="text-xs mt-1 opacity-90">
               {status === AgentStatus.NOTIFYING ? 'Drafting response...' : 
                status === AgentStatus.COMPLETE ? 'Response sent' : 'Pending...'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AgentVisualizer;