import React from 'react';
import { Sparkles, ArrowRight, LayoutDashboard, FileText, Bell, Calendar, User, CheckCircle, LogOut, MessageSquare } from 'lucide-react';
import { LeaveRequestData } from '../types';

// --- Screen 1: Welcome ---
export const WelcomeScreen = ({ onLogin }: { onLogin: () => void }) => (
  <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-50 p-6 text-center">
    <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-8 animate-bounce-slow">
      <Sparkles className="w-10 h-10 text-indigo-600" />
    </div>
    <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">AI HR Assistant</h1>
    <p className="text-xl text-gray-600 mb-8 max-w-md">Your smart HR companion. Powered by Agentic AI to simplify your work life.</p>
    
    <button 
      onClick={onLogin}
      className="group bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-3"
    >
      Start Chatting with AI
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

// --- Screen 3: Dashboard ---
export const DashboardScreen = ({ 
  onNavigate, 
  pendingCount 
}: { 
  onNavigate: (screen: any) => void, 
  pendingCount: number 
}) => (
  <div className="h-full bg-gray-50 flex flex-col overflow-y-auto">
    {/* Nav */}
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
          <Sparkles className="w-5 h-5" />
        </div>
        <span className="font-bold text-gray-800">HR Assistant</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-gray-900">Mohamed Mamdouh</p>
          <p className="text-xs text-gray-500">Product Designer</p>
        </div>
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
          <User className="w-6 h-6" />
        </div>
      </div>
    </div>

    <div className="p-6 max-w-5xl mx-auto w-full space-y-8">
      
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Leave Balance</h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          {/* UPDATED: Balance set to 15 Days */}
          <p className="text-3xl font-bold text-gray-900">15 Days</p>
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Annual Leave
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
           <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Pending Requests</h3>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
          <p className="text-sm text-gray-400 mt-2">Active workflows</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
           <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Notifications</h3>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Bell className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
               <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></div>
               <p className="text-sm text-gray-600">Please review the updated remote work policy.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions / CTA */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-lg">
        <div className="mb-6 md:mb-0">
          <h2 className="text-2xl font-bold mb-2">Need to request time off?</h2>
          <p className="text-indigo-100">Just chat with the AI Assistant and let it handle the paperwork.</p>
        </div>
        <div className="flex gap-4">
          <button 
             onClick={() => onNavigate('CHAT')}
             className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold shadow hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            Ask HR Assistant
          </button>
        </div>
      </div>

    </div>
  </div>
);

// --- Screen 4: Form ---
export const FormScreen = ({ 
  data, 
  onChange,
  onSubmit, 
  onCancel 
}: { 
  data: LeaveRequestData, 
  onChange: (field: keyof LeaveRequestData, value: string) => void,
  onSubmit: () => void, 
  onCancel: () => void 
}) => (
  <div className="h-full bg-gray-50 p-6 flex items-center justify-center overflow-y-auto">
    <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      
      {/* AI Banner */}
      <div className="bg-indigo-50 px-6 py-3 border-b border-indigo-100 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-indigo-600" />
        <p className="text-sm text-indigo-800 font-medium">AI has pre-filled this form based on your chat.</p>
      </div>

      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirm Leave Request</h2>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
            <input 
              type="text" 
              value={data.name} 
              readOnly 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-800 font-medium" 
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-500 mb-1">Leave Type</label>
             <input 
               type="text" 
               value={data.leaveType} 
               onChange={(e) => onChange('leaveType', e.target.value)}
               className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none" 
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-medium text-gray-500 mb-1">From</label>
               <input 
                 type="text" 
                 value={data.startDate} 
                 onChange={(e) => onChange('startDate', e.target.value)}
                 className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none" 
               />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-500 mb-1">To</label>
               <input 
                 type="text" 
                 value={data.endDate} 
                 onChange={(e) => onChange('endDate', e.target.value)}
                 className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none" 
               />
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button onClick={onCancel} className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={onSubmit} className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors">
            Submit Request
          </button>
        </div>
      </div>
    </div>
  </div>
);

// --- Screen 5: Success ---
export const SuccessScreen = ({ onBack, data }: { onBack: () => void, data: LeaveRequestData }) => (
  <div className="h-full bg-white flex flex-col items-center justify-center p-6 text-center">
    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
      <CheckCircle className="w-12 h-12 text-green-600" />
    </div>
    
    <h2 className="text-3xl font-bold text-gray-900 mb-2">Request Approved!</h2>
    <p className="text-gray-500 max-w-md mb-8">
      Your leave request for <span className="font-semibold text-gray-800">{data.startDate} – {data.endDate}</span> has been automatically approved by the policy engine.
    </p>

    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-4 mb-8 max-w-sm w-full">
      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
        <MessageSquare className="w-5 h-5" />
      </div>
      <div className="text-left">
        <p className="text-xs text-gray-500 uppercase font-semibold">Notifier Agent</p>
        <p className="text-sm text-gray-800">I've sent a confirmation email to HR@linkdev.com.</p>
      </div>
    </div>

    <button 
      onClick={onBack}
      className="text-indigo-600 font-semibold hover:bg-indigo-50 px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
    >
      <LayoutDashboard className="w-4 h-4" />
      Back to Dashboard
    </button>
  </div>
);