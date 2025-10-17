'use client';

import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import NewsletterEditor from '@/components/NewsletterEditor';
import Header from '@/components/Header';

export default function EditNewsletterPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const [newsletter, setNewsletter] = useState<{
    id: string;
    title: string;
    content: string;
    thumbnail?: string;
    published: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchNewsletter = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/newsletters/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch newsletter');
      }
      const data = await response.json();
      setNewsletter(data);
    } catch (error) {
      console.error('Error fetching newsletter:', error);
      alert('뉴스레터를 불러오는데 실패했습니다.');
      router.push('/admin/newsletter');
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchNewsletter();
    }
  }, [status, router, fetchNewsletter]);

  const handleSave = async (data: { title: string; content: string; thumbnail?: string; published: boolean }) => {
    const response = await fetch(`/api/admin/newsletters/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update newsletter');
    }

    alert(data.published ? '뉴스레터가 발행되었습니다!' : '뉴스레터가 저장되었습니다!');
    router.push('/admin/newsletter');
  };

  const handleCancel = () => {
    router.push('/admin/newsletter');
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!session || !newsletter) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-foreground mb-8">뉴스레터 수정</h1>
          <NewsletterEditor
            initialData={{
              title: newsletter.title,
              content: newsletter.content,
              thumbnail: newsletter.thumbnail,
            }}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </main>
    </div>
  );
}

