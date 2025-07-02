// src/components/editor/safe-editor/index.js
"use client";
import { useEffect, useRef } from 'react';
import 'react-quill/dist/quill.snow.css';

export default function SafeEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  
  useEffect(() => {
    let quill = null;
    
    const loadQuill = async () => {
      if (typeof window !== 'undefined') {
        // Only import Quill on the client side
        const Quill = (await import('quill')).default;
        
        if (!quillRef.current && editorRef.current) {
          // Remove any existing .ql-toolbar elements to prevent duplicates
          const container = editorRef.current.parentElement;
          const existingToolbars = container.querySelectorAll('.ql-toolbar');
          existingToolbars.forEach(toolbar => toolbar.remove());
          
          quill = new Quill(editorRef.current, {
            theme: 'snow',
            placeholder: 'Write your blog content here...',
            modules: {
              toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                ['link', 'image'],
                ['clean']
              ]
            }
          });
          
          quillRef.current = quill;
          
          quill.on('text-change', () => {
            onChange(quill.root.innerHTML);
          });
          
          // Set initial content
          if (value) {
            quill.clipboard.dangerouslyPasteHTML(value);
          }
        }
      }
    };
    
    loadQuill();
    
    return () => {
      // Clean up properly
      if (quillRef.current) {
        // Remove the Quill editor's container elements
        const container = editorRef.current?.parentElement;
        if (container) {
          const toolbars = container.querySelectorAll('.ql-toolbar');
          toolbars.forEach(toolbar => toolbar.remove());
        }
        
        quillRef.current = null;
      }
    };
  }, [onChange, value]); // Add value to dependency array
  
  return (
    <div className="quill-container relative">
      <div ref={editorRef} className="h-64 border rounded"></div>
    </div>
  );
}
