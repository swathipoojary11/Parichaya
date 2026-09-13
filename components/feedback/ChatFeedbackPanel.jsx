"use client";

import { useState, useEffect, useRef } from "react";
import { queryOllama } from "@/lib/ollama";
import Button from "@/components/ui/Button";

export default function ChatFeedbackPanel({ contextTitle = "AURA Feedback Assistant", contextData = null, isOpen = false, onClose = null }) {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am your AURA AI Career Coach. Ask me anything about your resume, mock interview performance, or skill challenge feedback!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (contextData) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "system",
          text: `Context loaded: ${contextTitle}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [contextData, contextTitle]);

  const handleSend = async (customPrompt = null) => {
    const query = customPrompt || input.trim();
    if (!query || isTyping) return;

    if (!customPrompt) setInput("");

    const userMsg = {
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const prompt = `You are AURA, an expert AI Placement & Career Coach running locally on device.
Context: ${contextTitle} ${contextData ? JSON.stringify(contextData) : ''}
Student Question: ${query}

Provide a concise, encouraging, and highly actionable 2-3 sentence response with clear next steps.`;

      const responseText = await queryOllama(prompt, "You are a helpful placement coach.");

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: responseText || "I evaluated your submission! Keep focusing on articulating quantified metrics and structured problem-solving.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "I am having trouble connecting to local Ollama AI right now, but remember to use the STAR method (Situation, Task, Action, Result) for behavioral questions!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white border border-slate-200 rounded-2xl shadow-soft overflow-hidden transition-all duration-300 ${isOpen ? 'ring-2 ring-orange-500/20' : ''}`}>
      {/* Panel Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-white shadow-md">
            💬
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100">{contextTitle}</h3>
            <p className="text-xs text-slate-400">Powered by Local Qwen2.5 3B</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg font-bold px-2">
            ✕
          </button>
        )}
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 min-h-[300px] max-h-[500px]">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
            {msg.sender === "system" ? (
              <div className="w-full text-center my-1">
                <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-200 text-slate-600 border border-slate-300">
                  {msg.text}
                </span>
              </div>
            ) : (
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-orange-500 text-white rounded-br-none shadow-sm"
                    : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span className={`text-[10px] block mt-1 ${msg.sender === "user" ? "text-orange-100 text-right" : "text-slate-400"}`}>
                  {msg.timestamp}
                </span>
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center space-x-2 bg-white border border-slate-200 px-4 py-2 rounded-2xl w-max">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse delay-75"></span>
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse delay-150"></span>
            <span className="text-xs text-slate-500 font-medium">AURA is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-2 bg-slate-100 border-t border-slate-200 flex flex-wrap gap-1.5 text-xs">
        <button
          onClick={() => handleSend("How can I improve my score?")}
          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-orange-400 hover:text-orange-600 transition-colors shadow-2xs font-medium"
        >
          💡 Improve Score
        </button>
        <button
          onClick={() => handleSend("Give me an example STAR response.")}
          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-orange-400 hover:text-orange-600 transition-colors shadow-2xs font-medium"
        >
          🎯 STAR Example
        </button>
        <button
          onClick={() => handleSend("What are top 3 areas to fix?")}
          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-orange-400 hover:text-orange-600 transition-colors shadow-2xs font-medium"
        >
          ⚡ Key Weaknesses
        </button>
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask AI Coach for advice..."
          className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-800 placeholder-slate-400"
        />
        <Button variant="primary" size="sm" onClick={() => handleSend()} disabled={isTyping || !input.trim()}>
          Send
        </Button>
      </div>
    </div>
  );
}
