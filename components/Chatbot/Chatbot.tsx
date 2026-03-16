"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, User, Loader2, Sparkles, BotMessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I am your **Paper Deal Marketplace Assistant**. How can I help you with buying or selling paper products today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || isLoading) return;

      // Add user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput("");
      setIsLoading(true);

      // Create placeholder for assistant response
      const assistantId = `assistant-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "" },
      ]);

      try {
        // Build the messages array for the API (exclude the empty assistant placeholder and any empty messages)
        const apiMessages = updatedMessages
          .filter((m) => m.content && m.content.trim() !== "")
          .map((m) => ({
            role: m.role,
            content: m.content,
          }));

        console.log("Starting fetch with messages:", apiMessages);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chatbot/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
        });

        console.log("Response received. Status:", response.status);

        if (!response.ok) {
          console.error("Response not OK. Status text:", response.statusText);
          throw new Error(`Server error: ${response.status}`);
        }

        const reader = response.body?.getReader();
        console.log("Reader acquired:", !!reader);
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("Failed to initialize stream reader");
        }

        let buffer = "";
        const startTime = Date.now();

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log("Stream reader done.");
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          // Split by double newline (SSE standard separator)
          const events = buffer.split("\n\n");
          buffer = events.pop() || ""; // Keep the partial event in buffer

          for (const event of events) {
            const lines = event.split("\n");
            for (const line of lines) {
              const trimmedLine = line.trim();
              if (trimmedLine.startsWith("data: ")) {
                const data = trimmedLine.slice(6).trim();

                if (data === "[DONE]") {
                  console.log("Stream [DONE] reached after", Date.now() - startTime, "ms");
                  continue;
                }

                try {
                  const parsed = JSON.parse(data);
                  if (parsed.text) {
                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === assistantId
                          ? { ...msg, content: msg.content + parsed.text }
                          : msg
                      )
                    );
                  } else if (parsed.error) {
                    console.error("Stream reported error:", parsed.error);
                    throw new Error(parsed.error);
                  }
                } catch (e) {
                  console.warn("Skipping line (potential partial JSON or heartbeat):", data);
                }
              }
            }
          }
        }
      } catch (error: any) {
        console.error("Chatbot Error:", error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? {
                ...msg,
                content:
                  msg.content || `Sorry, I encountered an error: ${error.message || "Unknown error"}. Please check the server logs.`,
              }
              : msg
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, input]
  );

  return (
    <div className="fixed bottom-12 right-6 z-[60] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
            style={{ height: "500px", maxHeight: "calc(100vh - 120px)" }}
          >
            {/* Header */}
            <div className="bg-primary px-4 py-4 flex items-center justify-between text-primary-foreground shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                  <BotMessageSquare size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">
                    Paper Deal AI
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    <p className="text-[10px] uppercase font-medium text-primary-foreground/70 tracking-wider">
                      Online Assistant
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground/60 hover:text-white transition-all p-1.5 hover:bg-white/10 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-gray-50/30 custom-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3 max-w-[90%]",
                    msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div
                    className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center shadow-sm transition-transform hover:scale-105",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-white text-primary border border-gray-100"
                    )}
                  >
                    {msg.role === "user" ? (
                      <User size={16} />
                    ) : (
                      <Sparkles size={16} />
                    )}
                  </div>
                  <div
                    className={cn(
                      "px-4 py-3 rounded-2xl text-[13.5px] leading-relaxed shadow-sm transition-all",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-white text-gray-800 border border-gray-100 rounded-tl-none prose prose-sm max-w-none"
                    )}
                  >
                    {msg.role === "assistant" ? (
                      <ReactMarkdown
                        components={{
                          strong: ({ node, ...props }) => (
                            <span
                              className="font-bold text-primary"
                              {...props}
                            />
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading &&
                messages[messages.length - 1]?.role === "user" && (
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-white text-primary border border-gray-100 flex items-center justify-center">
                      <Sparkles size={16} className="animate-pulse" />
                    </div>
                    <div className="px-5 py-3 rounded-2xl bg-white border border-gray-100 rounded-tl-none flex items-center gap-3 shadow-sm">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-xs font-medium text-gray-400">
                        Thinking...
                      </span>
                    </div>
                  </div>
                )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about paper products or deals..."
                  className="flex-1 px-4 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-primary text-primary-foreground p-2.5 h-11 w-11 flex items-center justify-center rounded-xl hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20"
                >
                  <Send size={18} className="translate-x-[1px]" />
                </button>
              </form>
              <p className="text-[10px] text-center text-gray-400 mt-2 font-medium tracking-tight">
                Powered by Paper Deal AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 group relative",
          isOpen
            ? "bg-white text-primary border border-gray-100"
            : "bg-primary text-primary-foreground hover:shadow-primary/30"
        )}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <>
            <BotMessageSquare
              size={28}
              className="group-hover:scale-110 transition-transform duration-300"
            />
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full border-4 border-white flex items-center justify-center">
              <span className="h-1.5 w-1.5 bg-white rounded-full animate-ping"></span>
            </span>
          </>
        )}
      </motion.button>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
}
