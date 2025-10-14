'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import NewsletterEditor from '@/components/NewsletterEditor';
import Header from '@/components/Header';

export default function CreateNewsletterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const handleSave = async (data: { title: string; content: string; thumbnail?: string; published: boolean }) => {
    const response = await fetch('/api/admin/newsletters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create newsletter');
    }

    alert(data.published ? '뉴스레터가 발행되었습니다!' : '뉴스레터가 저장되었습니다!');
    router.push('/admin/newsletter');
  };

  const handleCancel = () => {
    router.push('/admin/newsletter');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-foreground mb-8">새 뉴스레터 작성</h1>
          <NewsletterEditor onSave={handleSave} onCancel={handleCancel} />
        </div>
      </main>
    </div>
  );
}

