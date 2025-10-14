'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Image from 'next/image';

interface Newsletter {
  id: string;
  title: string;
  thumbnail?: string;
  published: boolean;
  views: number;
  createdAt: string;
  publishedAt?: string;
  author: {
    name: string;
    image?: string;
  };
}

export default function AdminNewsletterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchNewsletters();
    }
  }, [status, page, router]);

  const fetchNewsletters = async () => {
    try {
      const response = await fetch(`/api/admin/newsletters?page=${page}&limit=20`);
      if (!response.ok) {
        throw new Error('Failed to fetch newsletters');
      }
      const data = await response.json();
      setNewsletters(data.newsletters);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching newsletters:', error);
      alert('뉴스레터 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/newsletters/${id}/publish`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to toggle publish status');
      }

      // 목록 새로고침
      fetchNewsletters();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      alert('발행 상태 변경에 실패했습니다.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/newsletters/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete newsletter');
      }

      alert('뉴스레터가 삭제되었습니다.');
      fetchNewsletters();
    } catch (error) {
      console.error('Error deleting newsletter:', error);
      alert('삭제에 실패했습니다.');
    }
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

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">뉴스레터 관리</h1>
            <Button onClick={() => router.push('/admin/newsletter/create')}>
              새 뉴스레터 작성
            </Button>
          </div>

          {newsletters.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">작성된 뉴스레터가 없습니다.</p>
              <Button onClick={() => router.push('/admin/newsletter/create')}>
                첫 뉴스레터 작성하기
              </Button>
            </div>
          ) : (
            <>
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        제목
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        작성자
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        조회수
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        작성일
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {newsletters.map((newsletter) => (
                      <tr key={newsletter.id} className="hover:bg-muted/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {newsletter.thumbnail && (
                              <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src={newsletter.thumbnail}
                                  alt={newsletter.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="font-medium text-foreground">
                              {newsletter.title}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {newsletter.author.image && (
                              <Image
                                src={newsletter.author.image}
                                alt={newsletter.author.name}
                                width={24}
                                height={24}
                                className="rounded-full"
                              />
                            )}
                            <span className="text-sm text-foreground">
                              {newsletter.author.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              newsletter.published
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}
                          >
                            {newsletter.published ? '발행됨' : '임시저장'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">
                          {newsletter.views}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(newsletter.createdAt).toLocaleDateString('ko-KR')}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => router.push(`/admin/newsletter/edit/${newsletter.id}`)}
                            className="text-primary hover:text-primary/80"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleTogglePublish(newsletter.id)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            {newsletter.published ? '비공개' : '발행'}
                          </button>
                          <button
                            onClick={() => handleDelete(newsletter.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    이전
                  </Button>
                  <span className="px-4 py-2 text-foreground">
                    {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    다음
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

