import React from 'react';
import { Message } from '../types';
import { User, Bot, FileText, ArrowRight } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  onAction?: (type: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onAction }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'}`}>
          {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
        </div>

        {/* Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isUser 
              ? 'bg-indigo-600 text-white rounded-tr-sm' 
              : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
          }`}>
            {message.content}
          </div>
          
          {/* Action Button (e.g. Review Form) */}
          {!isUser && message.actionType === 'REVIEW_FORM' && (
            <button 
              onClick={() => onAction && onAction(message.actionType!)}
              className="mt-2 bg-white border border-indigo-200 text-indigo-700 px-4 py-2 rounded-xl text-sm font-medium shadow-sm hover:bg-indigo-50 transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Review & Submit Request
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <span className="text-xs text-gray-400 mt-1 px-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;