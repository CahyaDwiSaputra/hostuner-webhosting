import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
  RefreshCw,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isError?: boolean;
}

// ─── Unique session ID (per browser tab, resets on reload) ────────────────────
function generateSessionId(): string {
  return 'sess_' + Math.random().toString(36).slice(2) + '_' + Date.now().toString(36);
}
const SESSION_ID = generateSessionId();

// ─── Quick reply suggestions shown at the start ────────────────────────────────
const QUICK_REPLIES = [
  'Paket hosting apa saja yang tersedia?',
  'Rekomendasikan paket untuk toko online saya',
  'Berapa harga domain .com?',
  'Apa bedanya hosting dan VPS?',
  'Bagaimana cara order paket hosting?',
];

// ─── Format message text (markdown-lite: bold, bullets) ────────────────────────
function formatMessageText(text: string): React.ReactNode {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, i) => {
        // Bold: **text**
        const parts = line.split(/\*\*(.*?)\*\*/g);
        const formatted = parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j} className="font-semibold text-slate-900">{part}</strong> : part
        );

        // Bullet: lines starting with - or •
        const isBullet = /^[-•]\s/.test(line.trim());
        const isNumbered = /^\d+\.\s/.test(line.trim());

        if (isBullet) {
          return (
            <div key={i} className="flex gap-1.5 items-start">
              <span className="text-blue-500 mt-0.5 flex-shrink-0 text-xs">●</span>
              <span>{formatted.map((p, j) => <React.Fragment key={j}>{p}</React.Fragment>)}</span>
            </div>
          );
        }
        if (isNumbered) {
          return (
            <div key={i} className="flex gap-1.5 items-start">
              <span className="text-blue-500 mt-0.5 flex-shrink-0 font-bold text-xs">{line.match(/^\d+/)?.[0]}.</span>
              <span>{line.replace(/^\d+\.\s/, '')}</span>
            </div>
          );
        }
        if (line.startsWith('###')) {
          return <p key={i} className="font-bold text-slate-800 text-xs uppercase tracking-wide mt-2">{line.replace(/^###\s*/, '')}</p>;
        }
        if (line.startsWith('##')) {
          return <p key={i} className="font-bold text-slate-800 text-sm mt-2">{line.replace(/^##\s*/, '')}</p>;
        }
        if (line.trim() === '') {
          return <div key={i} className="h-1.5" />;
        }

        return (
          <p key={i}>{formatted.map((p, j) => <React.Fragment key={j}>{p}</React.Fragment>)}</p>
        );
      })}
    </>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  // Show greeting message on first open
  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setIsMinimized(false);
    setHasUnread(false);

    if (messages.length === 0) {
      const greeting: ChatMessage = {
        id: 'greeting-1',
        role: 'assistant',
        content:
          'Halo! 👋 Selamat datang di **Hostuner Webhosting**!\n\nSaya adalah Hostuner Assistant, siap membantu Anda menemukan paket hosting, VPS, atau domain yang paling sesuai.\n\nAda yang ingin Anda tanyakan? 😊',
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }
  }, [messages.length]);

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(prev => !prev);
  };

  const handleReset = () => {
    setMessages([]);
    setShowQuickReplies(true);
    setInput('');
    // Re-show greeting
    setTimeout(() => {
      const greeting: ChatMessage = {
        id: 'greeting-reset-' + Date.now(),
        role: 'assistant',
        content:
          'Percakapan telah direset. 🔄\n\nHalo lagi! Saya siap membantu Anda. Ada pertanyaan seputar layanan hosting, VPS, atau domain? 😊',
        timestamp: new Date(),
      };
      setMessages([greeting]);
      setShowQuickReplies(true);
    }, 50);
  };

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setShowQuickReplies(false);
    setInput('');

    const userMsg: ChatMessage = {
      id: 'u-' + Date.now(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, sessionId: SESSION_ID }),
      });

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: 'a-' + Date.now(),
        role: 'assistant',
        content: data.success
          ? data.reply
          : data.message || 'Terjadi kesalahan. Silakan coba lagi.',
        timestamp: new Date(),
        isError: !data.success,
      };

      setMessages(prev => [...prev, assistantMsg]);

      // Show unread badge if chat is closed/minimized
      if (!isOpen || isMinimized) {
        setHasUnread(true);
      }
    } catch {
      const errMsg: ChatMessage = {
        id: 'err-' + Date.now(),
        role: 'assistant',
        content: 'Maaf, terjadi masalah koneksi. Pastikan Anda terhubung ke internet dan coba lagi. 🔌',
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, isOpen, isMinimized]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleQuickReply = (text: string) => {
    sendMessage(text);
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* ── Floating Chat Window ─────────────────────────────────────────────── */}
      <div
        className={`
          fixed bottom-24 right-4 sm:right-6 z-[9999]
          transition-all duration-300 ease-out origin-bottom-right
          ${isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
          }
        `}
        style={{ width: 'min(380px, calc(100vw - 2rem))' }}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/70 flex flex-col overflow-hidden"
          style={{ height: isMinimized ? 'auto' : 'min(560px, calc(100dvh - 10rem))' }}>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 flex-shrink-0">
            {/* Bot avatar */}
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 ring-2 ring-white/30">
              <Bot className="w-5 h-5 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm leading-tight">Hostuner Assistant</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-blue-100 text-xs">Online · Siap Membantu</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Reset button */}
              <button
                onClick={handleReset}
                title="Reset percakapan"
                className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              {/* Minimize button */}
              <button
                onClick={handleMinimize}
                title={isMinimized ? 'Perluas' : 'Minimalkan'}
                className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition"
              >
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMinimized ? 'rotate-180' : ''}`} />
              </button>

              {/* Close button */}
              <button
                onClick={handleClose}
                title="Tutup"
                className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body — hidden when minimized */}
          {!isMinimized && (
            <>
              {/* Messages area */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50/60 min-h-0"
                style={{ scrollbarWidth: 'thin' }}>

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div className={`
                      w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5
                      ${msg.role === 'user'
                        ? 'bg-blue-600'
                        : msg.isError ? 'bg-red-100' : 'bg-white border border-slate-200 shadow-sm'
                      }
                    `}>
                      {msg.role === 'user'
                        ? <User className="w-3.5 h-3.5 text-white" />
                        : <Bot className={`w-3.5 h-3.5 ${msg.isError ? 'text-red-400' : 'text-blue-600'}`} />
                      }
                    </div>

                    {/* Bubble */}
                    <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      <div className={`
                        px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed space-y-0.5
                        ${msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-sm'
                          : msg.isError
                            ? 'bg-red-50 text-red-700 border border-red-200 rounded-tl-sm'
                            : 'bg-white text-slate-700 border border-slate-200/80 shadow-sm rounded-tl-sm'
                        }
                      `}>
                        {msg.role === 'user'
                          ? <p>{msg.content}</p>
                          : formatMessageText(msg.content)
                        }
                      </div>
                      <span className="text-xs text-slate-400 px-1">{formatTime(msg.timestamp)}</span>
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex gap-2.5 flex-row">
                    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center bg-white border border-slate-200 shadow-sm mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div className="bg-white border border-slate-200/80 shadow-sm px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />
                      <span className="text-slate-500 text-sm">Sedang mengetik...</span>
                    </div>
                  </div>
                )}

                {/* Quick reply buttons (shown only when no messages or after greeting) */}
                {showQuickReplies && messages.length === 1 && !isLoading && (
                  <div className="pt-1">
                    <p className="text-xs text-slate-400 mb-2 pl-9">Pertanyaan cepat:</p>
                    <div className="flex flex-wrap gap-1.5 pl-9">
                      {QUICK_REPLIES.map((qr) => (
                        <button
                          key={qr}
                          onClick={() => handleQuickReply(qr)}
                          className="text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition font-medium leading-tight text-left"
                        >
                          {qr}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="px-3 py-3 border-t border-slate-200 bg-white flex-shrink-0">
                <form onSubmit={handleSubmit} className="flex gap-2 items-end">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Tanyakan tentang paket hosting, VPS, atau domain..."
                    rows={1}
                    disabled={isLoading}
                    className="
                      flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50
                      px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400
                      focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400
                      focus:bg-white transition disabled:opacity-60 max-h-28
                    "
                    style={{ scrollbarWidth: 'thin' }}
                    onInput={e => {
                      const el = e.currentTarget;
                      el.style.height = 'auto';
                      el.style.height = Math.min(el.scrollHeight, 112) + 'px';
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="
                      w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95
                      flex items-center justify-center flex-shrink-0 shadow-sm
                      disabled:opacity-40 disabled:cursor-not-allowed transition-all
                    "
                  >
                    {isLoading
                      ? <Loader2 className="w-4 h-4 text-white animate-spin" />
                      : <Send className="w-4 h-4 text-white" />
                    }
                  </button>
                </form>
                <p className="text-center text-xs text-slate-400 mt-2">
                  Powered by <span className="font-semibold text-blue-500">Gemini AI</span> · Khusus layanan Hostuner
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Floating Trigger Button ──────────────────────────────────────────── */}
      <div className="fixed bottom-5 right-4 sm:right-6 z-[9999]">
        {/* Unread badge */}
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center animate-bounce shadow-sm z-10">
            1
          </span>
        )}

        <button
          id="chatbot-trigger-btn"
          onClick={isOpen ? handleClose : handleOpen}
          aria-label={isOpen ? 'Tutup chatbot' : 'Buka chatbot'}
          className={`
            group relative w-14 h-14 rounded-2xl flex items-center justify-center
            shadow-lg shadow-blue-500/30 transition-all duration-300
            ${isOpen
              ? 'bg-slate-700 hover:bg-slate-800 rotate-0'
              : 'bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40'
            }
          `}
        >
          {/* Pulse ring (shown when closed) */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-2xl bg-blue-500 animate-ping opacity-20" />
          )}

          {isOpen
            ? <X className="w-6 h-6 text-white transition-transform duration-200" />
            : (
              <div className="relative">
                <MessageCircle className="w-6 h-6 text-white" />
                <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1.5 -right-1.5" />
              </div>
            )
          }
        </button>

        {/* Tooltip label (shown on hover when closed) */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            Tanya Hostuner Assistant
            <div className="absolute -bottom-1 right-4 w-2 h-2 bg-slate-800 rotate-45" />
          </div>
        )}
      </div>
    </>
  );
};
