// src/components/ask-ai/index.js
"use client";
import React , { useRef, useState, useEffect } from "react";
import { useChat } from "ai/react";
import ReactMarkdown from 'react-markdown';
import { createPortal } from "react-dom";
// New Import
import { Scrollbar } from 'react-scrollbars-custom'; 

function MessagesArea({ messages, isLoading }) {
  const containerRef = useRef(null);

  // Auto-scroll logic is KEPT.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    // FINAL FIX: Using the Scrollbar Component
    // The Scrollbar component is placed inside the flex-1 area of the parent,
    // and handles the internal scrolling logic reliably.
    <Scrollbar
      // We pass the ref to the Scrollbar component
      ref={containerRef}
      style={{ width: '100%', height: '60vh' }} // Ensures it fills its parent flex container
      className="p-4 space-y-3"
      // Remove all conflicting scroll-related CSS from the child div
      // The content wrapper inside Scrollbar will handle the messages
    >
      {messages.length === 0 && (
        <div className="text-center text-gray-400 mt-8">
          <svg className="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <p className="text-sm">Ask anything about this blog!</p>
        </div>
      )}

      {messages.map((message) => (
        <>
        <div key={message.id} className={`flex gap-7 m-5 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
          <div
            className={`max-w-[70%] px-3 py-2 rounded-xl text-sm m-1.5 p-3.5 ${
              message.role === "user"
                ? "bg-blue-500 text-white rounded-br-sm"
                : "bg-gray-100 text-gray-700 rounded-bl-sm"
            }`}
          >
            <div><ReactMarkdown>{message.content}</ReactMarkdown></div>
          </div>
        </div>
        <p><br/></p>
        </>
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-gray-100 px-3 py-2 rounded-xl rounded-bl-sm">
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
          </div>
        </div>
      )}
    </Scrollbar>
  );
}


// --- Component containing the Modal structure (Header, Messages, Footer) ---
function ChatModal({ isOpen, onClose, chatHook }) {
    if (!isOpen) {
        return null;
    }
    
    const { messages, input, handleInputChange, handleSubmit, isLoading } = chatHook;

    return (
        // Modal Overlay (The backdrop)
        <div className="fixed inset-0 flex items-center justify-center z-[10000] p-4">
            <div
                /* CRITICAL PARENT CONTAINER:
                   - flex flex-col: Defines the vertical layout.
                   - h-[90vh]: Gives the container a fixed height.
                   - overflow-hidden: MUST be present to contain the scroll.
                */
                className="bg-white/70 rounded-2xl w-full max-w-lg shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02] h-[90vh] flex flex-col overflow-hidden" 
                style={{ backdropFilter: "blur(5px)", backgroundColor: "rgba(112,226,178, 0.7)" }}
            >
                {/* Header: Fixed height (shrink-0) */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100 shrink-0 bg-white">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <h2 className="text-lg font-semibold text-gray-800">Ask AI</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Chat Messages: Scrollable Area. Placed inside a flex-1 wrapper to take remaining space. */}
                <div className="flex-1 min-h-0">
                    <MessagesArea
                        messages={messages}
                        isLoading={isLoading}
                    />
                </div>

                {/* Input Form: Fixed height (shrink-0) */}
                <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 shrink-0 bg-white">
                    <div className="flex gap-2">
                        <input
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Type your question..."
                            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-all"
                        >
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


// --- Main Exported Component ---
export default function AskAI({ blogContent }) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    
    // 1. Client-side Mounting Check
    useEffect(() => {
        setMounted(true);
    }, []);

    // 2. Body Scroll Lock
    useEffect(() => {
        if (!mounted) return; 
        
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, mounted]);

    const chatHook = useChat({
        api: "/api/chat",
        body: { context: blogContent },
    });

    if (!mounted) return null;
    
    return (
        <>
            {/* Floating Button: RENDERED DIRECTLY IN THE APP ROOT */}
            <div className="fixed bottom-6 right-6 z-[9999]">
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                    aria-label="Ask AI about this blog"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                    </svg>
                </button>
            </div>

            {/* Modal Rendering: Uses createPortal */}
            {mounted && createPortal(
                <ChatModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    chatHook={chatHook}
                />,
                document.body
            )}
        </>
    );
}