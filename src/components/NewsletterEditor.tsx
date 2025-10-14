'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

// Tiptap을 동적으로 로드 (SSR 방지)
const TiptapEditor = dynamic(() => import('./TiptapEditor'), {
  ssr: false,
  loading: () => <div className="h-[400px] flex items-center justify-center border border-border rounded-lg">에디터 로딩 중...</div>,
});

interface NewsletterEditorProps {
  initialData?: {
    title: string;
    content: string;
  };
  onSave: (data: { title: string; content: string; published: boolean }) => Promise<void>;
  onCancel: () => void;
}

export default function NewsletterEditor({ initialData, onSave, onCancel }: NewsletterEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (published: boolean) => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    setSaving(true);
    try {
      await onSave({ title, content, published });
    } catch (error) {
      console.error('Error saving newsletter:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* 제목 입력 */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
          제목
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="뉴스레터 제목을 입력하세요"
          className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* 내용 입력 - Tiptap 에디터 */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          내용
        </label>
        <TiptapEditor
          content={content}
          onChange={setContent}
          placeholder="뉴스레터 내용을 입력하세요..."
        />
        <p className="mt-2 text-sm text-muted-foreground">
          리치 텍스트 에디터를 사용하여 내용을 작성할 수 있습니다.
        </p>
      </div>

      {/* 버튼 */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={saving}
        >
          취소
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSave(false)}
          disabled={saving}
        >
          {saving ? '저장 중...' : '임시 저장'}
        </Button>
        <Button
          type="button"
          onClick={() => handleSave(true)}
          disabled={saving}
        >
          {saving ? '발행 중...' : '발행하기'}
        </Button>
      </div>
    </div>
  );
}

