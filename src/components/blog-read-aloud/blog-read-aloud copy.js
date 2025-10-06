// src/components/blog-read-aloud/blog-read-aloud.js
"use client";
import useReadAloud from "@/components/hooks/useReadAloud";
import { stripHtmlForReadAloud } from "./stripHtmlForReadAloud";

export default function BlogReadAloud({ content }) {
    content = stripHtmlForReadAloud(content);
    const { isSpeaking, speak, stop , voices} = useReadAloud();
    console.log(voices);
    return (
        <div className="flex items-center gap-4 mb-6">
        <button
            onClick={() => (isSpeaking ? stop() : speak(content))}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors"
        >
            {isSpeaking ? (
            <>
                <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
                </svg>
                Pause
            </>
            ) : (
            <>
                <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
                </svg>
                Read Aloud
            </>
            )}
        </button>
        {isSpeaking && (
            <span className="text-sm text-gray-500">Reading...</span>
        )}
        </div>
    );
    }
