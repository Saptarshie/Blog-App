"use client";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { useEffect } from 'react';
import "./tip-tap-style.css"
const TipTapEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Write your blog content here...',
      }),
      Underline,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update content from external value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return <div className="h-64 border rounded"></div>;
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const toggleStrike = () => editor.chain().focus().toggleStrike().run();
  const toggleCode = () => editor.chain().focus().toggleCode().run();
  const toggleCodeBlock = () => editor.chain().focus().toggleCodeBlock().run();
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();

  return (
    <>
    <div className="tiptap-editor">
      <div className="tiptap-toolbar">
        <button 
          onClick={toggleBold}
          className={`toolbar-btn ${editor.isActive('bold') ? 'is-active' : ''}`}>
          <strong>B</strong>
        </button>
        <button 
          onClick={toggleItalic}
          className={`toolbar-btn ${editor.isActive('italic') ? 'is-active' : ''}`}>
          <em>I</em>
        </button>
        <button 
          onClick={toggleUnderline}
          className={`toolbar-btn ${editor.isActive('underline') ? 'is-active' : ''}`}>
          <u>U</u>
        </button>
        <button 
          onClick={toggleStrike}
          className={`toolbar-btn ${editor.isActive('strike') ? 'is-active' : ''}`}>
          <s>S</s>
        </button>
        <button 
          onClick={toggleCode}
          className={`toolbar-btn ${editor.isActive('code') ? 'is-active' : ''}`}>
        </button>
        <button 
          onClick={toggleBlockquote}
          className={`toolbar-btn ${editor.isActive('blockquote') ? 'is-active' : ''}`}>
          "
        </button>
        <button 
          onClick={toggleCodeBlock}
          className={`toolbar-btn ${editor.isActive('codeBlock') ? 'is-active' : ''}`}>
          {'</>'}
        </button>
        <button 
          onClick={toggleBulletList}
          className={`toolbar-btn ${editor.isActive('bulletList') ? 'is-active' : ''}`}>
          • List
        </button>
        <button 
          onClick={toggleOrderedList}
          className={`toolbar-btn ${editor.isActive('orderedList') ? 'is-active' : ''}`}>
          1. List
        </button>
      </div>
      <EditorContent editor={editor} className="tiptap-content" />
    </div>
    </>
  );
};

export default TipTapEditor;
