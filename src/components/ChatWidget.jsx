import { useState, useRef, useEffect, memo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { 
  Bot, Sparkles, X, Send, RefreshCw, Minimize2, Loader2, AlertCircle, FileText, Briefcase, Award, Cpu, User
} from 'lucide-react';

const SUGGESTIONS = [
  { label: "📄 What is Amir's CV & background?", prompt: "Can you give me a summary of Amir's CV, work experience, and background?" },
  { label: "🧠 What are Amir's top AI skills?", prompt: "What are Amir's core skills in Deep Learning, Computer Vision, and AI Architecture?" },
  { label: "🚀 What AI projects has Amir built?", prompt: "What are the main AI and Machine Learning projects built by Amir?" },
  { label: "📜 Show verified credentials & certs", prompt: "What certifications and verified credentials does Amir hold?" }
];

const SafeMessageRenderer = ({ content }) => {
  if (!content) return null;

  const parseInline = (text) => {
    if (typeof text !== 'string') return text;
    const parts = [];
    let lastIdx = 0;
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        parts.push(text.substring(lastIdx, match.index));
      }
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 font-semibold transition-colors"
        >
          {match[1]}
        </a>
      );
      lastIdx = linkRegex.lastIndex;
    }

    if (lastIdx < text.length) {
      parts.push(text.substring(lastIdx));
    }

    return parts.length > 0 ? parts : text;
  };

  const lines = content.split('\n');
  return (
    <div className="space-y-1.5 text-xs leading-relaxed text-slate-200">
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-1" />;

        // Bullet points
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          const text = line.trim().substring(2);
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-cyan-400 font-bold">•</span>
              <span>{parseInline(text)}</span>
            </div>
          );
        }
        return <p key={idx}>{parseInline(line)}</p>;
      })}
    </div>
  );
};

const ChatWidget = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Smooth scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async (userPrompt) => {
    const promptToSend = userPrompt || input;
    if (!promptToSend.trim() || isLoading) return;

    const userMsg = { id: Date.now().toString(), role: 'user', content: promptToSend };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!userPrompt) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';
      let streamBuffer = '';
      const assistantMsgId = (Date.now() + 1).toString();

      // Add empty assistant placeholder message
      setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        streamBuffer += decoder.decode(value, { stream: true });
        const lines = streamBuffer.split('\n');
        streamBuffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('0:')) {
            try {
              const textChunk = JSON.parse(line.slice(2));
              assistantText += textChunk;
              setMessages(prev => 
                prev.map(msg => msg.id === assistantMsgId ? { ...msg, content: assistantText } : msg)
              );
            } catch (e) {
              const textChunk = line.slice(2).replace(/^"/, '').replace(/"$/, '');
              assistantText += textChunk;
              setMessages(prev => 
                prev.map(msg => msg.id === assistantMsgId ? { ...msg, content: assistantText } : msg)
              );
            }
          }
        }
      }

      // Process any remaining buffer text
      if (streamBuffer.startsWith('0:')) {
        try {
          const textChunk = JSON.parse(streamBuffer.slice(2));
          assistantText += textChunk;
          setMessages(prev => 
            prev.map(msg => msg.id === assistantMsgId ? { ...msg, content: assistantText } : msg)
          );
        } catch (e) {
          const textChunk = streamBuffer.slice(2).replace(/^"/, '').replace(/"$/, '');
          assistantText += textChunk;
          setMessages(prev => 
            prev.map(msg => msg.id === assistantMsgId ? { ...msg, content: assistantText } : msg)
          );
        }
      }

      // If no formatted stream text was captured, clean up empty assistant message
      if (!assistantText) {
        setMessages(prev => prev.filter(msg => msg.id !== assistantMsgId));
      }
    } catch (error) {
      console.error('Chat AI Request Error:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: "⚠️ Unable to reach AI model. Please ensure GROQ_API_KEY or GEMINI_API_KEY is configured in your .env file."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Box Window */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="pointer-events-auto mb-4 w-[92vw] sm:w-[420px] h-[560px] max-h-[82vh] rounded-3xl bg-[#080816]/95 border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.25)] flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-800/80 bg-slate-900/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-cyan-400 p-[1px] shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                    <div className="w-full h-full rounded-[15px] bg-[#080816] flex items-center justify-center">
                      <Bot className="w-5 h-5 text-cyan-400" />
                    </div>
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#080816] shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                    Aura AI Assistant
                  </h3>
                  <p className="text-[10px] font-mono text-purple-300/80 tracking-widest uppercase">
                    Amir's Portfolio Intelligence
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={() => setMessages([])}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors cursor-pointer"
                    title="Clear Conversation"
                  >
                    <RefreshCw size={14} />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors cursor-pointer"
                  title="Close Assistant"
                >
                  <Minimize2 size={16} />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-4">
                  <div className="w-14 h-14 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                    <Sparkles className="w-7 h-7 text-purple-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white uppercase font-mono">Ask Amir's AI Agent</h4>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-[280px]">
                      Interactive AI assistant trained on Amir's Machine Learning projects, CV, technical skills, and verified credentials.
                    </p>
                  </div>

                  <div className="w-full space-y-2 pt-2">
                    {SUGGESTIONS.map((item, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSend(item.prompt)}
                        className="w-full text-left text-xs p-3 rounded-2xl bg-slate-900/60 hover:bg-purple-500/10 border border-slate-800 hover:border-purple-500/30 text-slate-200 transition-all font-medium cursor-pointer flex items-center gap-2"
                      >
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((mItem) => (
                  <div
                    key={mItem.id}
                    className={`flex gap-3 ${mItem.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {mItem.role !== 'user' && (
                      <div className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                        <Bot className="w-4 h-4 text-cyan-400" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] p-3.5 ${
                        mItem.role === 'user'
                          ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-2xl rounded-br-sm shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                          : 'bg-slate-900/90 border border-slate-800/90 text-slate-200 rounded-2xl rounded-bl-sm shadow-md'
                      }`}
                    >
                      {mItem.role === 'user' ? (
                        <p className="text-xs font-medium leading-relaxed">{mItem.content}</p>
                      ) : (
                        <SafeMessageRenderer content={mItem.content} />
                      )}
                    </div>
                  </div>
                ))
              )}

              {/* Loading Dots */}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-slate-800/80 bg-slate-900/50 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Amir's projects, skills, CV..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl py-3 px-4 text-xs text-white placeholder:text-slate-500 focus:border-purple-400 focus:outline-none transition-all"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 transition-all cursor-pointer shadow-lg shadow-purple-500/20"
              >
                <Send size={15} />
              </button>
            </form>
          </m.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (FAB) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto relative group p-4 rounded-full bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_25px_rgba(147,51,234,0.35)] hover:shadow-[0_0_35px_rgba(147,51,234,0.5)] hover:scale-105 transition-all cursor-pointer"
        title="Toggle AI Assistant"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>
    </div>
  );
});

export default ChatWidget;

