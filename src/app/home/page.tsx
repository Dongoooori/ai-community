'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
    name: string;
    image?: string;
  };
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // 뉴스레터 목록 가져오기
  useEffect(() => {
    if (status === 'authenticated') {
      fetchNewsletters();
    }
  }, [status, page]);
  console.log(totalPages)

  const fetchNewsletters = async () => {
    try {
      const response = await fetch(`/api/newsletters?page=${page}&limit=12`);
      if (!response.ok) {
        throw new Error('Failed to fetch newsletters');
      }
      const data = await response.json();
      console.log(data)
      setNewsletters(data.newsletters);
      setTotalPages(data.newsletters.length);
    } catch (error) {
      console.error('Error fetching newsletters:', error);
    } finally {
      setLoading(false);
    }
  };

  // 로딩 중일 때
  if (status === 'loading' || loading) {
    return <Loading />;
  }

  // 로그인하지 않은 경우 (리다이렉트 전까지 표시)
  if (!session) {
    return null;
  }

  // 뉴스레터 내용 미리보기 (처음 150자)
  const getPreview = (content: string) => {
    // HTML 태그 제거
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  };

  return (
    <Layout className="bg-background">
      {/* 전체 화면 배경 이미지 */}
      <div className="relative w-full h-screen">
        {/* 배경 이미지 - 전체 화면 */}
        <Image 
          src="/assets/newsletter.png" 
          alt="Newsletter Background" 
          fill
          className="object-cover"
          priority
        />
        
        {/* 어두운 오버레이 */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* 그라데이션 오버레이 - 왼쪽에서 오른쪽으로 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

        {/* 텍스트 콘텐츠 - 왼쪽 절반 */}
        <div className="absolute left-0 top-0 w-1/2 h-full flex flex-col justify-center px-12 z-10">
          {newsletters.length === 0 ? (
            <div className="text-center">
              <p className="text-white text-lg">
                아직 발행된 뉴스레터가 없습니다.
              </p>
            </div>
          ) : (
            <>
              {/* 현재 뉴스레터 (첫 번째) */}
              {newsletters.length > 0 && (
                <div className="space-y-6 flex flex-col">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    {newsletters[0].title}
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                    {getPreview(newsletters[0].content)}
                  </p>
                  
                  {/* 메타 정보 */}
                  <div className="flex justify-between gap-4 text-white/80 space-y-4">
                    <div className='h-full flex items-center'>
                      <Button className="cursor-pointer" variant="emerald" onClick={() => router.push(`/home/newsletter/${newsletters[0].id}`)}>
                        뉴스레터 더보기
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>조회수 {newsletters[0].views}</span>
                      <span>
                        발행일 {new Date(newsletters[0].publishedAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* 페이지네이션 - 우상단 */}
        {newsletters.length > 0 && (
          <div className="absolute top-30 right-20 text-white z-20 text-center">
            <span className="text-6xl"> {page}</span>
            <span className="text-2xl"> / {totalPages}</span>
          </div>
        )}

        {/* 네비게이션 버튼 - 우하단 */}
        {newsletters.length > 0 && totalPages > 1 && (
          <div className="absolute bottom-8 right-8 flex gap-4 z-20">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-12 h-12 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 rounded-full flex items-center justify-center text-white text-xl"
            >
              ‹
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-12 h-12 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 rounded-full flex items-center justify-center text-white text-xl"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
