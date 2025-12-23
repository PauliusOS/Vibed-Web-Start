"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { FRAMER_TEXT_COLORS } from "../constants/colors";
import { ChatMessage } from "./ChatMessage";
import { SearchingState } from "./SearchingState";
import { ResultsDisplay } from "./ResultsDisplay";
import { DEFAULT_CREATORS, type Creator } from "../shared/AnimatedStats";
import { Button } from "@/components/ui/button";

export interface SylcAIChatProps {
  className?: string;
  onComplete?: (results: ResultsData) => void;
}

export interface ResultsData {
  influencerCount: number;
  videoCount: number;
  totalReach: number;
  cpm: number;
  priceRange: { min: number; max: number };
  matchedCreators: Creator[];
}

type ChatPhase = 
  | { type: "greeting" }
  | { type: "conversation"; questionCount: number }
  | { type: "searching"; progress: number }
  | { type: "results"; data: ResultsData };

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GREETING_MESSAGE = "Hey! So I'm here to help you find some amazing creators for your campaign. Tell me a bit about what you're working on - what's your brand about?";

const MAX_QUESTIONS = 5;

export function SylcAIChat({ className, onComplete }: SylcAIChatProps) {
  const [phase, setPhase] = useState<ChatPhase>({ type: "greeting" });
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const chatAction = useAction(api.sylcAI.chat);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);
  
  // Focus input when ready for user input
  useEffect(() => {
    if (phase.type === "conversation" && !isTyping && inputRef.current) {
      inputRef.current.focus();
    }
  }, [phase, isTyping]);
  
  // Initial greeting
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages([{ role: "assistant", content: GREETING_MESSAGE }]);
        setPhase({ type: "conversation", questionCount: 1 });
      }, 1200);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;
    
    const userMessage = inputValue.trim();
    setInputValue("");
    
    // Add user message
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    
    // Check if we should move to searching phase
    const questionCount = phase.type === "conversation" ? phase.questionCount : 0;
    const shouldSearch = questionCount >= MAX_QUESTIONS || 
      userMessage.toLowerCase().includes("ready") ||
      userMessage.toLowerCase().includes("find") ||
      userMessage.toLowerCase().includes("search");
    
    if (shouldSearch) {
      // Move to searching phase
      setTimeout(() => {
        setPhase({ type: "searching", progress: 0 });
        
        // Simulate search progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 20 + 10;
          if (progress >= 100) {
            clearInterval(interval);
            const results = generateResults(newMessages);
            setPhase({ type: "results", data: results });
            onComplete?.(results);
          } else {
            setPhase({ type: "searching", progress });
          }
        }, 400);
      }, 300);
      return;
    }
    
    // Get AI response
    setIsTyping(true);
    
    try {
      const response = await chatAction({ messages: newMessages });
      
      setIsTyping(false);
      setMessages([...newMessages, { role: "assistant", content: response }]);
      setPhase({ type: "conversation", questionCount: questionCount + 1 });
    } catch (error) {
      console.error("Chat error:", error);
      setIsTyping(false);
      const fallback = "Hmm, tell me a bit more about who you're trying to reach?";
      setMessages([...newMessages, { role: "assistant", content: fallback }]);
      setPhase({ type: "conversation", questionCount: questionCount + 1 });
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div 
      className={cn("flex flex-col h-[600px] rounded-2xl overflow-hidden border", className)}
      style={{ 
        backgroundColor: "rgba(10, 10, 15, 0.95)",
        borderColor: "rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* Header */}
      <div 
        className="px-6 py-4 border-b flex items-center gap-3"
        style={{ 
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          borderColor: "rgba(255, 255, 255, 0.08)",
        }}
      >
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ 
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)",
            border: "1px solid rgba(139, 92, 246, 0.3)",
          }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "rgb(139, 92, 246)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold" style={{ color: FRAMER_TEXT_COLORS.primary }}>
            Sylc AI
          </h3>
          <p className="text-xs" style={{ color: FRAMER_TEXT_COLORS.muted }}>
            Campaign Advisor
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs" style={{ color: FRAMER_TEXT_COLORS.muted }}>Online</span>
        </div>
      </div>
      
      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      >
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <ChatMessage 
              key={index} 
              type={message.role === "assistant" ? "ai" : "user"} 
              content={message.content} 
            />
          ))}
          
          {isTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1 px-4 py-3 rounded-2xl w-fit"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: FRAMER_TEXT_COLORS.muted }}
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </motion.div>
          )}
          
          {phase.type === "searching" && (
            <SearchingState key="searching" progress={phase.progress} />
          )}
          
          {phase.type === "results" && (
            <ResultsDisplay key="results" data={phase.data} />
          )}
        </AnimatePresence>
      </div>
      
      {/* Input Area */}
      <AnimatePresence>
        {phase.type === "conversation" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-4 border-t"
            style={{ 
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              borderColor: "rgba(255, 255, 255, 0.08)",
            }}
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your response..."
                disabled={isTyping}
                className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-colors"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: FRAMER_TEXT_COLORS.primary,
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="px-4 py-3"
                style={{
                  background: "linear-gradient(135deg, rgba(139, 92, 246, 1) 0%, rgba(99, 102, 241, 1) 100%)",
                }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Generate results from conversation
function generateResults(messages: Message[]): ResultsData {
  const conversationText = messages.map(m => m.content.toLowerCase()).join(" ");
  
  // Infer from conversation
  const isUrgent = conversationText.includes("asap") || 
    conversationText.includes("soon") || 
    conversationText.includes("week") ||
    conversationText.includes("immediately");
  
  const isConversionFocused = conversationText.includes("conversion") || 
    conversationText.includes("sales") || 
    conversationText.includes("install") ||
    conversationText.includes("purchase");
  
  const isEnterprise = conversationText.includes("enterprise") || 
    conversationText.includes("global") ||
    conversationText.includes("large");
  
  // Base values
  let influencerCount = 12;
  let basePrice = 35000;
  
  if (isUrgent) {
    influencerCount = 18;
    basePrice = 55000;
  }
  
  if (isConversionFocused) {
    influencerCount = Math.round(influencerCount * 1.3);
    basePrice = Math.round(basePrice * 1.2);
  }
  
  if (isEnterprise) {
    influencerCount = Math.round(influencerCount * 1.5);
    basePrice = Math.round(basePrice * 1.5);
  }
  
  const videoCount = influencerCount * 2;
  const matchedCreators = DEFAULT_CREATORS.slice(0, Math.min(influencerCount, 12));
  const totalReach = matchedCreators.reduce((sum, c) => sum + c.reach, 0);
  const cpm = basePrice >= 50000 ? 3.50 : basePrice >= 35000 ? 3.80 : 4.20;
  
  return {
    influencerCount,
    videoCount,
    totalReach,
    cpm,
    priceRange: {
      min: Math.round(basePrice * 0.8),
      max: Math.round(basePrice * 1.3),
    },
    matchedCreators,
  };
}

export default SylcAIChat;
