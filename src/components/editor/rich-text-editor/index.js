"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

export default function RichTextEditor({ value, onChange }) {
  const [mounted, setMounted] = useState(false);
  const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-64 border rounded"></div>;

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      className="h-64"
      placeholder="Write your blog content here..."
    />
  );
}
