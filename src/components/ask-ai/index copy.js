// src/components/ask-ai/index.js
"use client";
import React , { useRef, useState, useEffect } from "react";
import { useChat } from "ai/react";
import { createPortal } from "react-dom";
// import React, { useRef, useEffect } from "react";

function MessagesArea({ messages, isLoading }) {
  const containerRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // scroll to bottom smoothly
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div
      ref={containerRef}
      /* Important classes:
         - flex-1 & min-h-0 make the area flex-grow but allow proper scrolling inside flex container
         - max-h-[75vh] enforces the "start scrolling after 75vh" threshold
         - overflow-y-auto enables scrolling when content exceeds that height
      */
      className="flex-1 flex flex-col min-h-0 overflow-y-auto p-4 space-y-3 max-h-3/4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}
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
        <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
          <div
            className={`max-w-[70%] px-3 py-2 rounded-xl text-sm ${
              message.role === "user"
                ? "bg-blue-500 text-white rounded-br-sm"
                : "bg-gray-100 text-gray-700 rounded-bl-sm"
            }`}
          >
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          </div>
        </div>
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
    </div>
  );
}

export default function AskAI({ blogContent }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: {
      context: blogContent,
    },
  });

  // Don't render until mounted (fixes SSR issues)
  if (!mounted) return null;
  // return <h1>Ask-A-1</h1>
  return (
    <>
      {/* Floating Button - Added higher z-index and portal-like positioning */}
      <div className=" bottom-6 right-6 z-[9999] ">
      {/* <div className="bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-[9999] !important"> */}
        {/* <h1>Ask-AI</h1> */}
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
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

      {/* Modal Overlay */}
      

      {/* Chat Messages */}
      {isOpen && (
  <div className="fixed inset-0 flex items-center justify-center z-[10000] p-4">
    <div
      className="bg-white/70 rounded-2xl w-full max-w-lg shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02] h-[90vh] flex flex-col"
      style={{ backdropFilter: "blur(5px)", backgroundColor: "rgba(112,226,178, 0.7)" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <h2 className="text-lg font-semibold text-gray-800">Ask AI</h2>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Chat Messages */}
      {/* Use a ref to optionally auto-scroll to bottom when messages change */}
      <MessagesArea
        messages={messages}
        isLoading={isLoading}
      />

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100">
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
)}

    </>
  );
}