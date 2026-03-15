"use client";

import React, { useState, useRef, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Send, 
  Sparkles, 
  RefreshCw, 
  Trash2, 
  Plus,
  Paperclip,
  User as UserIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { analyticsApi } from '@/lib/api';

export default function ClaudeStyleChat() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<any[]>([
    { role: 'ai', content: 'Hello! I am Myriox. How can I assist you with your data or enterprise tasks today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMsg = { role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await analyticsApi.chatWithData(query, 1, 'myriox');
      const aiMsg = { role: 'ai', content: response.response };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Neural link failed. The core is currently undergoing maintenance." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'ai', content: 'Neural memory cleared. How can I help you start fresh?' }]);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col relative bg-transparent">
        {/* Header Section */}
        <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-primary/20 rounded-lg flex items-center justify-center">
              <Sparkles className="text-primary" size={18} />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Myriox Core</h1>
          </div>
          <button 
            onClick={clearChat}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest"
          >
            <Trash2 size={14} /> Clear Chat
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-8 pb-32">
          {messages.map((msg, idx) => (
            <div key={idx} className={cn(
              "flex gap-6",
              msg.role === 'user' ? "justify-end" : "justify-start"
            )}>
              {msg.role === 'ai' && (
                <div className="size-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 mt-1">
                  <Sparkles size={20} className="text-white" />
                </div>
              )}
              <div className={cn(
                "max-w-[85%] rounded-[30px] p-6 text-[15.5px] leading-relaxed",
                msg.role === 'user' 
                  ? "bg-primary text-white font-medium rounded-tr-none" 
                  : "bg-white/5 border border-white/10 text-slate-200 rounded-tl-none"
              )}>
                {msg.role === 'ai' ? (
                  <div className="prose prose-invert max-w-none prose-p:leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
              {msg.role === 'user' && (
                <div className="size-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 mt-1">
                  <UserIcon size={20} className="text-slate-400" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 items-center animate-pulse">
              <div className="size-10 rounded-xl bg-primary/20 border border-primary/20 flex items-center justify-center">
                <RefreshCw size={18} className="text-primary animate-spin" />
              </div>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Synthesizing response...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area (Claude Style Floating) */}
        <div className="absolute bottom-6 left-0 right-0 px-4">
          <div className="relative max-w-3xl mx-auto">
            <div className="bg-[#1a1a2e] border border-white/10 rounded-[32px] p-2 shadow-2xl focus-within:ring-2 focus-within:ring-primary/50 transition-all">
              <div className="flex items-end gap-2 px-3 pb-2">
                <button className="p-3 text-slate-500 hover:text-white transition-colors">
                  <Paperclip size={22} />
                </button>
                <textarea 
                  rows={1}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask Myriox anything..."
                  className="flex-1 bg-transparent py-4 text-white outline-none resize-none max-h-48 text-[16px] placeholder:text-slate-500"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={!query.trim() || isLoading}
                  className="p-3 bg-primary text-white rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
            <p className="text-[10px] text-center text-slate-500 mt-4 font-medium uppercase tracking-[0.2em]">
              Myriox Alpha • Neural Processing Isolated
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
