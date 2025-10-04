"use client"; // 👈 Crucial: This makes it a Client Component

import dynamic from 'next/dynamic';

// Now, the dynamic import with ssr: false is inside a Client Component, which is allowed.
const AskAI = dynamic(() => import('./index.js'), {
    ssr: false, 
    // Optional: Add a loading skeleton that matches the button's size
    loading: () => <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse" />
});

// This wrapper component just passes the props through.
export default function AskAIWrapper({ blogContent }) {
    return <AskAI blogContent={blogContent} />;
}