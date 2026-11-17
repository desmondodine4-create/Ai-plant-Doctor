import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Send, Sprout, X } from 'lucide-react';
import type { ChatMessage } from '../types';

interface CareAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  cropContext?: string;
  growerName: string;
}

const STARTER_PROMPTS = [
  'Why are my plant leaves turning yellow?',
  'How often should I water tomatoes?',
  'What causes leaf spots?',
  'How can I improve soil fertility?',
  'How do I prevent fungal infections?',
];

export const CareAssistantPanel: React.FC<CareAssistantPanelProps> = ({
  isOpen,
  onClose,
  cropContext,
  growerName,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        timestamp: new Date().toISOString(),
        text: cropContext
          ? `Hello ${growerName}. I'm ready to help with ${cropContext} care, watering schedules, soil nutrition, or pest prevention.`
          : `Hello ${growerName}. Ask any question about watering, yellowing leaves, soil health, or crop disease prevention.`,
      },
    ]);
    setError(null);
  }, [isOpen, cropContext, growerName]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, loading]);

  if (!isOpen) return null;

  const sendQuestion = async (rawText: string) => {
    const question = rawText.trim();
    if (!question || loading) return;

    if (!navigator.onLine) {
      setError('You appear to be offline. Reconnect to reach the AI Plant Care Assistant.');
      return;
    }

    const userMessage: ChatMessage = {
      id: `${Date.now()}-u`,
      role: 'user',
      text: question,
      timestamp: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          cropContext: cropContext ?? '',
          history: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to get a response right now.');
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-m`,
          role: 'model',
          text: data.answer || 'No answer generated.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error reaching assistant.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Plant Care Assistant"
    >
      <div className="flex h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-[#F6FAF6] shadow-xl sm:h-[640px] sm:rounded-3xl border border-[#DCE8DE]">
        <div className="flex items-center justify-between border-b border-[#DCE8DE] bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14532D] text-[#4ADE80]">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F2417]">Plant Care Assistant</h2>
              <p className="text-xs text-[#4B6353]">
                {cropContext ? `Focused on ${cropContext}` : 'Practical agronomy guidance powered by Gemini'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Plant Care Assistant"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-[#4B6353] hover:bg-[#F1F7F2] hover:text-[#0F2417] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-[#E7F0E9] bg-white px-4 py-2.5 overflow-x-auto">
          <div className="flex items-center gap-2">
            {STARTER_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                disabled={loading}
                onClick={() => sendQuestion(prompt)}
                className="min-h-[36px] rounded-xl border border-[#DCE8DE] bg-[#F6FAF6] px-3 py-1.5 text-xs font-medium text-[#14532D] hover:bg-[#DCFCE7] transition-colors whitespace-nowrap shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-[#14532D] text-white'
                      : 'border border-[#DCE8DE] bg-white text-[#0F2417]'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2.5 text-sm text-[#4B6353]">
              <Loader2 className="h-4 w-4 animate-spin text-[#16A34A]" />
              <span>Consulting Gemini agricultural assistant...</span>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-xs font-medium text-[#991B1B]">
              {error}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendQuestion(input);
          }}
          className="border-t border-[#DCE8DE] bg-white p-3 sm:p-4"
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about yellowing leaves, watering, pests, or soil..."
              className="min-h-[44px] flex-1 rounded-xl border border-[#DCE8DE] bg-[#F6FAF6] px-4 py-2.5 text-sm text-[#0F2417] placeholder:text-[#6B8574] focus:border-[#16A34A] focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send question"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-[#16A34A] px-4 text-white hover:bg-[#15803D] disabled:opacity-50 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
