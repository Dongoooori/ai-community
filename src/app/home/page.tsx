'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Layout from '@/components/Layout';
import Loading from '@/components/Loading';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // 로딩 중일 때
  if (status === 'loading') {
    return (
      <Loading />
    );
  }

  // 로그인하지 않은 경우 (리다이렉트 전까지 표시)
  if (!session) {
    return null;
  }

  return (
    <Layout className="bg-background">
      
      {/* 메인 콘텐츠 */}
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">

          {/* 뉴스레터 섹션 */}
          <section className="mb-16">
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                AI 뉴스레터
              </h2>
              <p className="text-muted-foreground mb-6">
                최신 AI 기술 트렌드와 실생활 활용 사례를 만나보세요
              </p>
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity">
                뉴스레터 구독하기
              </button>
            </div>
          </section>

          {/* 커뮤니티 섹션 */}
          <section>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-border rounded-lg p-8 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                협업 커뮤니티
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                온라인 커뮤니티를 통해 명확한 목표 설정, 정기적인 피드백, 협업 소프트웨어 활용이 가능합니다
              </p>
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity">
                커뮤니티 참여하기
              </button>
            </div>
          </section>
        </div>
      </div>

    </Layout>
  );
}

