// src/components/blog-read-aloud/index.js

"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const ReadAloudButton = dynamic(() => import('./blog-read-aloud'), { 
    ssr: false 
});

export default function BlogReadAloudWrapper({ content }) {
    return (
        <Suspense fallback={<div className="h-[41px] w-[120px] bg-gray-200 rounded-lg animate-pulse" />}>
            <ReadAloudButton content={content} />
        </Suspense>
    );
}
    