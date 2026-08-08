'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  HeadphonesIcon,
  ChevronDown
} from 'lucide-react';

type Message = {
  id: string;
  sender: 'user' | 'ai' | 'agent';
  text: string;
  timestamp: Date;
};

const SUGGESTIONS = [
  "How to cancel booking?",
  "Recommend tours in Paris",
  "Check voucher status"
];

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'human'>('ai');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hi there! I am your TravelNest AI Concierge. How can I help you plan your next adventure today?',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    // Mock API Call to /api/v1/ai/chat
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: activeTab === 'ai' ? 'ai' : 'agent',
        text: activeTab === 'ai' 
          ? "I'm an AI demo right now, but in the real app I'd call POST /api/v1/ai/chat and give you smart travel advice or help manage your bookings!" 
          : "Our human agents are currently offline. Please leave a message and we'll email you back.",
        timestamp: new Date()
      }]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-[#0f1523] border border-white/10 rounded-2xl w-[350px] sm:w-[400px] h-[600px] max-h-[80vh] shadow-2xl flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 p-4 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Sparkles className="w-5 h-5 text-amber-400" />
              TravelNest Support
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1 bg-white/5 rounded-full"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10">
            <button 
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'ai' ? 'bg-purple-500/10 text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <Bot className="w-4 h-4" /> AI Concierge
            </button>
            <button 
              onClick={() => setActiveTab('human')}
              className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'human' ? 'bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-500' : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <HeadphonesIcon className="w-4 h-4" /> Human Agent
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-purple-600 text-white rounded-tr-none' 
                    : 'bg-white/10 text-gray-100 rounded-tl-none border border-white/5'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-2xl rounded-tl-none p-4 flex gap-1 items-center w-fit border border-white/5">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {activeTab === 'ai' && messages.length < 3 && !isTyping && (
            <div className="p-3 bg-black/20 flex flex-wrap gap-2">
              {SUGGESTIONS.map((suggestion, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSend(suggestion)}
                  className="bg-white/5 hover:bg-purple-500/20 text-xs text-purple-300 border border-purple-500/30 rounded-full px-3 py-1.5 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-white/10 bg-[#0f1523]">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button 
                type="submit"
                disabled={!input.trim()}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white p-4 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all group"
        >
          <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0a0f1c] animate-pulse"></div>
          <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      )}
    </div>
  );
}
