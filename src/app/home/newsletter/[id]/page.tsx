'use client';

import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Loading from '@/components/Loading';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface Newsletter {
  id: string;
  title: string;
  content: string;
  thumbnail?: string;
  views: number;
  publishedAt: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
}

export default function NewsletterDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchNewsletter();
    }
  }, [status, router]);

  const fetchNewsletter = async () => {
    try {
      const response = await fetch(`/api/newsletters/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch newsletter');
      }
      const data = await response.json();
      setNewsletter(data);
    } catch (error) {
      console.error('Error fetching newsletter:', error);
      alert('뉴스레터를 불러오는데 실패했습니다.');
      router.push('/home');
    } finally {
      setLoading(false);
    }
  };

  // HTML 콘텐츠를 안전하게 렌더링
  const renderContent = (content: string) => {
    return (
      <div
        className="prose prose-lg max-w-none dark:prose-invert
          prose-headings:text-foreground 
          prose-p:text-foreground 
          prose-strong:text-foreground 
          prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-muted prose-pre:text-foreground
          prose-blockquote:text-muted-foreground prose-blockquote:border-l-primary
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-lg prose-img:shadow-lg
          prose-ul:text-foreground prose-ol:text-foreground
          prose-li:text-foreground"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  if (status === 'loading' || loading) {
    return <Loading />;
  }

  if (!session || !newsletter) {
    return null;
  }

  return (
    <Layout className="bg-background">
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* 뒤로 가기 버튼 */}
          <Button
            variant="outline"
            onClick={() => router.push('/home')}
            className="mb-6"
          >
            ← 목록으로
          </Button>

          {/* 썸네일 */}
          {newsletter.thumbnail && (
            <div className="relative w-full h-96 rounded-lg overflow-hidden mb-8">
              <Image
                src={newsletter.thumbnail}
                alt={newsletter.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* 제목 */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {newsletter.title}
          </h1>

          {/* 메타 정보 */}
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-border">
            <div className="flex items-center gap-3">
              {newsletter.author.image && (
                <Image
                  src={newsletter.author.image}
                  alt={newsletter.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="font-medium text-foreground">{newsletter.author.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(newsletter.publishedAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              👁 {newsletter.views} 조회
            </div>
          </div>

          {/* 내용 */}
          <article>{renderContent(newsletter.content)}</article>

          {/* 하단 버튼 */}
          <div className="mt-12 pt-8 border-t border-border">
            <Button
              variant="outline"
              onClick={() => router.push('/home')}
              className="w-full md:w-auto"
            >
              목록으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
