import { useState, useRef, useEffect, memo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, RotateCcw } from 'lucide-react';

const SUGGESTIONS = [
  {
    label: "What projects has Amir built?",
    prompt: "What projects has Amir built?"
  },
  {
    label: "Which projects show his computer vision work?",
    prompt: "Which projects show his computer vision work?"
  },
  {
    label: "What are his core skills?",
    prompt: "What are his core skills?"
  },
  {
    label: "What certificates does he have?",
    prompt: "What certificates does he have?"
  },
  {
    label: "How can I contact him?",
    prompt: "How can I contact him?"
  }
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
      const url = match[2];
      const isExternal = url.startsWith('http://') || url.startsWith('https://');
      parts.push(
        <a
          key={match.index}
          href={url}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="underline underline-offset-2 text-foreground hover:text-muted transition-colors font-medium"
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
    <div className="space-y-1.5 text-sm leading-relaxed">
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-1" />;

        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          const text = line.trim().substring(2);
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-foreground font-medium">•</span>
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
  const inputRef = useRef(null);
  const triggerRef = useRef(null);

  // Focus input when dialog opens; restore focus to trigger when closed
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Accessibility: Escape key closes the dialog
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

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
            } catch {
              const textChunk = line.slice(2).replace(/^"/, '').replace(/"$/, '');
              assistantText += textChunk;
              setMessages(prev =>
                prev.map(msg => msg.id === assistantMsgId ? { ...msg, content: assistantText } : msg)
              );
            }
          }
        }
      }

      if (streamBuffer.startsWith('0:')) {
        try {
          const textChunk = JSON.parse(streamBuffer.slice(2));
          assistantText += textChunk;
          setMessages(prev =>
            prev.map(msg => msg.id === assistantMsgId ? { ...msg, content: assistantText } : msg)
          );
        } catch {
          const textChunk = streamBuffer.slice(2).replace(/^"/, '').replace(/"$/, '');
          assistantText += textChunk;
          setMessages(prev =>
            prev.map(msg => msg.id === assistantMsgId ? { ...msg, content: assistantText } : msg)
          );
        }
      }

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
          content: "Unable to reach AI assistant right now. Please try again or reach out through the contact form."
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
    <div className="fixed bottom-4 end-4 sm:bottom-6 sm:end-6 z-40 flex flex-col items-end pointer-events-none">
      {/* Chat Dialog Window */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            role="dialog"
            aria-label="Ask Amir"
            aria-modal="true"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto mb-3 w-[calc(100vw-2rem)] sm:w-[400px] h-[520px] max-h-[calc(100svh-6rem)] rounded-lg bg-surface border border-border flex flex-col overflow-hidden text-foreground"
          >
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-border bg-surface flex items-center justify-between">
              <div>
                <h2 className="text-base font-medium text-foreground">
                  Ask Amir
                </h2>
                <p className="text-sm text-muted">
                  About his projects, skills, and certificates
                </p>
              </div>

              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setMessages([])}
                    className="p-1.5 text-muted hover:text-foreground rounded-md hover:bg-surface-muted transition-colors cursor-pointer"
                    aria-label="Clear conversation"
                  >
                    <RotateCcw size={15} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    triggerRef.current?.focus();
                  }}
                  className="p-1.5 text-muted hover:text-foreground rounded-md hover:bg-surface-muted transition-colors cursor-pointer"
                  aria-label="Close chat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col justify-center text-start space-y-4 px-1">
                  <p className="text-sm text-muted leading-relaxed">
                    Answers are based on his projects, CV, skills, and certificates.
                  </p>

                  <div className="space-y-2 pt-1">
                    {SUGGESTIONS.map((item, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSend(item.prompt)}
                        className="w-full text-start rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground hover:bg-surface-muted transition-colors cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((mItem) => (
                  <div
                    key={mItem.id}
                    className={`flex ${mItem.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-4 py-2.5 text-sm ${
                        mItem.role === 'user'
                          ? 'bg-foreground text-surface'
                          : 'bg-surface-muted text-foreground'
                      }`}
                    >
                      {mItem.role === 'user' ? (
                        <p className="leading-relaxed">{mItem.content}</p>
                      ) : (
                        <SafeMessageRenderer content={mItem.content} />
                      )}
                    </div>
                  </div>
                ))
              )}

              {/* Plain text loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-surface-muted text-muted rounded-lg px-4 py-2 text-sm">
                    Thinking…
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-border bg-surface flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
                aria-label="Message prompt"
                className="flex-1 rounded-lg border border-border bg-surface px-4 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-foreground transition-colors"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
                className="w-9 h-9 rounded-full bg-foreground text-surface flex items-center justify-center shrink-0 disabled:opacity-40 hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Send size={14} className="rtl:-scale-x-100" />
              </button>
            </form>
          </m.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Ask Amir'}
        aria-expanded={isOpen}
        className="pointer-events-auto w-12 h-12 rounded-full bg-foreground text-surface hover:opacity-90 transition-opacity flex items-center justify-center cursor-pointer"
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </button>
    </div>
  );
});

ChatWidget.displayName = 'ChatWidget';

export default ChatWidget;
