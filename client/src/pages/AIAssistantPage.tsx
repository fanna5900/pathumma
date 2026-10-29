import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User as UserIcon,
  Copy,
  Check,
  Trash2,
  Plus,
  ShieldCheck,
  MessageSquare,
  AlertCircle,
  Clock,
  Layers,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  roleContext: string;
  updatedAt: string;
}

export const AIAssistantPage: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConvoId, setCurrentConvoId] = useState<string | null>(null);
  const [selectedRoleContext, setSelectedRoleContext] = useState<string>(user?.role || 'STUDENT');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'assistant',
      content: user
        ? `Hello ${user.username}! Welcome to EDUNEXA's Dedicated AI Academic Mentor. How can I assist your ${user.role.toLowerCase()} workflows today?`
        : `Welcome to EDUNEXA AI Assistant. Ask me anything about Indian higher education, admissions, course fees, or learning concepts!`,
    },
  ]);

  const rolePrompts: Record<string, string[]> = {
    STUDENT: [
      'Explain Dynamic Programming with state compression',
      'What are the eligibility requirements for B.Tech in NIT Calicut?',
      'Create a 7-day revision schedule for Operating Systems',
      'How are JoSAA seat allocations and rank cutoffs structured?',
    ],
    FACULTY: [
      'Draft a comprehensive 60-minute lesson plan for Graph Algorithms',
      'Generate 5 multiple choice and 2 short conceptual questions on Virtual Memory',
      'Suggest an evaluation rubric for B.Tech software engineering lab projects',
      'Draft an institutional announcement for end-semester internal assessments',
    ],
    UNIVERSITY: [
      'Draft an official announcement for 2026 undergraduate admissions counseling',
      'Structure a course fee disclosure document adhering to NIRF transparency norms',
      'Generate a comprehensive FAQ brochure for student hostel accommodations',
      'Draft a department overview for Artificial Intelligence & Data Science',
    ],
    ADMIN: [
      'Explain platform verification criteria for state and central universities',
      'Summarize best practices for academic audit log governance and privacy compliance',
      'Draft an advisory notification for semester platform upgrades',
      'Analyze data integrity guidelines for course fee listings',
    ],
  };

  const fetchConversations = async () => {
    if (!user) return;
    try {
      const res = await api.get('/ai/conversations');
      if (res.data.success) {
        setConversations(res.data.data);
      }
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversation = async (convoId: string) => {
    try {
      const res = await api.get(`/ai/conversations/${convoId}`);
      if (res.data.success && res.data.data) {
        setCurrentConvoId(convoId);
        setSelectedRoleContext(res.data.data.roleContext || 'STUDENT');
        setMessages(
          res.data.data.messages.map((m: any) => ({
            id: m.id,
            role: m.role.toLowerCase() as any,
            content: m.content,
          }))
        );
      }
    } catch (err) {
      console.error('Failed to load conversation:', err);
    }
  };

  const startNewConversation = () => {
    setCurrentConvoId(null);
    setMessages([
      {
        id: 'new-init',
        role: 'assistant',
        content: `New conversation started in ${selectedRoleContext} mode. What academic topic would you like to explore?`,
      },
    ]);
  };

  const deleteConversation = async (convoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete(`/ai/conversations/${convoId}`);
      setConversations((prev) => prev.filter((c) => c.id !== convoId));
      if (currentConvoId === convoId) {
        startNewConversation();
      }
    } catch (err) {
      // ignore
    }
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        message: textToSend.trim(),
        conversationId: currentConvoId,
        roleContext: selectedRoleContext,
      });

      if (res.data.success) {
        if (res.data.conversationId) {
          setCurrentConvoId(res.data.conversationId);
          fetchConversations();
        }
        const assistantMsg: Message = {
          id: 'asst-' + Date.now(),
          role: 'assistant',
          content: res.data.response,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err: any) {
      const errorMsg: Message = {
        id: 'err-' + Date.now(),
        role: 'assistant',
        content:
          err.response?.data?.message ||
          'Connection error. Please ensure backend is running or try again.',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#021814] text-slate-100 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto h-[82vh] grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Conversations & Role Select */}
        <div className="hidden lg:flex lg:col-span-4 rounded-3xl glass-panel bg-[#03241e]/90 border border-emerald-800/60 p-5 flex-col justify-between overflow-hidden">
          <div className="space-y-4 overflow-y-auto">
            {/* Header & New Chat button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-white font-bold text-base">
                <Bot className="w-5 h-5 text-emerald-400" />
                <span>AI Workspace</span>
              </div>
              <button
                onClick={startNewConversation}
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Start New Conversation"
              >
                <Plus className="w-4 h-4" />
                <span>New</span>
              </button>
            </div>

            {/* Role Context Selector */}
            <div className="space-y-1.5 pt-2 border-t border-emerald-950">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Assistant Role Persona:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {['STUDENT', 'FACULTY', 'UNIVERSITY', 'ADMIN'].map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setSelectedRoleContext(r);
                      startNewConversation();
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all ${
                      selectedRoleContext === r
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-forest-900/80 text-slate-300 hover:text-white border border-emerald-900/60'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Conversations */}
            <div className="space-y-2 pt-3 border-t border-emerald-950">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Conversation History:
              </p>
              {conversations.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No stored conversations yet.</p>
              ) : (
                <div className="space-y-1.5 max-h-[36vh] overflow-y-auto pr-1">
                  {conversations.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => loadConversation(c.id)}
                      className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between text-xs transition-colors group ${
                        currentConvoId === c.id
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-forest-950/60 text-slate-300 hover:bg-forest-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate pr-2">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="truncate">{c.title}</span>
                      </div>
                      <button
                        onClick={(e) => deleteConversation(c.id, e)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-400 p-1"
                        title="Delete conversation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Safety Notice Footer */}
          <div className="p-3 rounded-2xl bg-forest-950/80 border border-emerald-900/60 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-gold-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Governance & Security Notice</span>
            </div>
            <p>
              The AI Assistant provides academic advice and draft templates. All institutional record updates, fee modifications, and approvals require explicit human authorization.
            </p>
          </div>
        </div>

        {/* Right Main Chat Window */}
        <div className="lg:col-span-8 rounded-3xl glass-panel bg-[#03241e]/90 border border-emerald-800/60 flex flex-col justify-between overflow-hidden shadow-2xl">
          {/* Top Bar */}
          <div className="px-6 py-4 bg-gradient-to-r from-forest-900 to-[#02241d] border-b border-emerald-800/50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 p-0.5 shadow-glow-emerald">
                <div className="w-full h-full bg-[#021814] rounded-[10px] flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-5 h-5 text-gold-400" />
                </div>
              </div>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  EDUNEXA Role AI Mentor
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {selectedRoleContext} MODE
                  </span>
                </h2>
                <p className="text-xs text-emerald-400/80">
                  Powered by Role-Aware Academic Intelligence
                </p>
              </div>
            </div>

            <button
              onClick={startNewConversation}
              className="lg:hidden px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
            >
              New Chat
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-emerald-400" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm relative group ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-forest-900/90 text-slate-200 border border-emerald-800/50 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {msg.content}

                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-forest-950/80 text-slate-400 hover:text-white"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-800 flex items-center justify-center flex-shrink-0 mt-1 text-white font-bold text-xs">
                    {user?.username?.slice(0, 1).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-emerald-400 text-xs py-2 px-4">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]"></div>
                <span className="font-semibold text-slate-300">Synthesizing pedagogical response...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          {messages.length <= 2 && (
            <div className="px-6 py-3 border-t border-emerald-900/40 bg-forest-950/50">
              <p className="text-[11px] text-slate-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>Suggested prompts for {selectedRoleContext}:</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {(rolePrompts[selectedRoleContext] || rolePrompts.STUDENT).map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(p)}
                    className="text-left text-xs px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-200 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box Form */}
          <div className="p-4 bg-[#021814] border-t border-emerald-800/50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center space-x-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask ${selectedRoleContext} academic questions, request lesson plans, or explain concepts...`}
                disabled={loading}
                className="flex-1 bg-forest-900/90 border border-emerald-800/60 rounded-2xl px-5 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-emerald"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
