'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useCallback } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function TiptapEditor({ content, onChange, placeholder }: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || '내용을 입력하세요...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[400px] max-w-none p-4 text-foreground prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground',
      },
    },
  });

  const addImage = useCallback(() => {
    const url = window.prompt('이미지 URL을 입력하세요:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('링크 URL을 입력하세요:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background">
      {/* 툴바 */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-muted/50">
        {/* 텍스트 스타일 */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('bold')
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-foreground hover:bg-accent'
          }`}
        >
          굵게
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('italic')
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-foreground hover:bg-accent'
          }`}
        >
          기울임
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('strike')
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-foreground hover:bg-accent'
          }`}
        >
          취소선
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('code')
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-foreground hover:bg-accent'
          }`}
        >
          코드
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* 제목 */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-foreground hover:bg-accent'
          }`}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-foreground hover:bg-accent'
          }`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-foreground hover:bg-accent'
          }`}
        >
          H3
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* 리스트 */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-foreground hover:bg-accent'
          }`}
        >
          • 목록
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-foreground hover:bg-accent'
          }`}
        >
          1. 목록
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* 인용 & 코드 블록 */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('blockquote')
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-foreground hover:bg-accent'
          }`}
        >
          인용
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('codeBlock')
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-foreground hover:bg-accent'
          }`}
        >
          코드 블록
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* 링크 & 이미지 */}
        <button
          onClick={setLink}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('link')
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-foreground hover:bg-accent'
          }`}
        >
          🔗 링크
        </button>
        <button
          onClick={addImage}
          className="px-3 py-1 rounded text-sm font-medium bg-background text-foreground hover:bg-accent transition-colors"
        >
          🖼️ 이미지
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* 실행 취소 */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="px-3 py-1 rounded text-sm font-medium bg-background text-foreground hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ↶ 실행 취소
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="px-3 py-1 rounded text-sm font-medium bg-background text-foreground hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ↷ 다시 실행
        </button>
      </div>

      {/* 에디터 */}
      <EditorContent editor={editor} />
    </div>
  );
}

