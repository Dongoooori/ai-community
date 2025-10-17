'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Layout from '@/components/Layout';
import Loading from '@/components/Loading';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import CategorySection from '@/components/CategorySection';
import { useCategories } from '@/hooks/useCategories';
import type { CategoryId, AddItemFormData, AppItem } from '@/types';

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
  const [currentIndex, setCurrentIndex] = useState(0);

  const { categories, addItem, updateItem, deleteItem, reorderItems, addCategory, updateCategory, deleteCategory } = useCategories();
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' }>>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // 토스트 알림 함수들
  const success = (message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type: 'success' }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  const error = (message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type: 'error' }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleAddItem = async (categoryId: CategoryId, item: AddItemFormData) => {
    try {
      await addItem(categoryId, item);
      success('추가되었습니다');
    } catch (err) {
      error(err instanceof Error ? err.message : '추가에 실패했습니다');
      throw err; // Re-throw to let modal handle it
    }
  };

  const handleUpdateItem = async (categoryId: CategoryId, itemId: string, updates: Partial<AppItem>) => {
    try {
      await updateItem(categoryId, itemId, updates);
      success('수정되었습니다');
    } catch (err) {
      error(err instanceof Error ? err.message : '수정에 실패했습니다');
    }
  };

  const handleDeleteItem = async (categoryId: CategoryId, itemId: string) => {
    try {
      await deleteItem(categoryId, itemId);
      success('삭제되었습니다');
    } catch (err) {
      error(err instanceof Error ? err.message : '삭제에 실패했습니다');
    }
  };

  const handleReorderItems = async (categoryId: CategoryId, fromIndex: number, toIndex: number) => {
    try {
      await reorderItems(categoryId, fromIndex, toIndex);
      success('순서가 변경되었습니다');
    } catch (err) {
      error(err instanceof Error ? err.message : '순서 변경에 실패했습니다');
    }
  };

  const handleAddCategory = async (title: string) => {
    try {
      await addCategory(title);
      success('카테고리가 추가되었습니다');
      setIsCategoryModalOpen(false);
    } catch (err) {
      error(err instanceof Error ? err.message : '카테고리 추가에 실패했습니다');
      throw err; // Re-throw to let modal handle it
    }
  };

  const handleUpdateCategory = async (categoryId: CategoryId, title: string) => {
    try {
      await updateCategory(categoryId, title);
      success('카테고리가 수정되었습니다');
    } catch (err) {
      error(err instanceof Error ? err.message : '카테고리 수정에 실패했습니다');
    }
  };

  const handleDeleteCategory = async (categoryId: CategoryId) => {
    try {
      await deleteCategory(categoryId);
      success('카테고리가 삭제되었습니다');
    } catch (err) {
      error(err instanceof Error ? err.message : '카테고리 삭제에 실패했습니다');
    }
  };


  const fetchNewsletters = useCallback(async () => {
    try {
      const response = await fetch(`/api/newsletters?page=${page}&limit=12`);
      if (!response.ok) {
        throw new Error('Failed to fetch newsletters');
      }
      const data = await response.json();
      console.log(data)
      setNewsletters(data.newsletters);
      setTotalPages(data.pagination.totalPages);
      setCurrentIndex(0); // 새 페이지 로드 시 인덱스 리셋
    } catch (error) {
      console.error('Error fetching newsletters:', error);
    } finally {
      setLoading(false);
    }
  }, [page]);

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
  }, [status, page, fetchNewsletters]);

  // 현재 뉴스레터 인덱스가 변경될 때 페이지 로드
  useEffect(() => {
    if (newsletters.length > 0 && currentIndex >= newsletters.length) {
      // 현재 페이지의 마지막 뉴스레터에 도달하면 다음 페이지 로드
      if (page < totalPages) {
        setPage(page + 1);
        setCurrentIndex(0);
      } else {
        // 마지막 페이지의 마지막 뉴스레터면 첫 번째로 돌아가기
        setCurrentIndex(0);
      }
    }
  }, [currentIndex, newsletters.length, page, totalPages]);

  // 네비게이션 함수들
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (page > 1) {
      // 현재 페이지의 첫 번째 뉴스레터면 이전 페이지로
      setPage(page - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < newsletters.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (page < totalPages) {
      // 현재 페이지의 마지막 뉴스레터면 다음 페이지로
      setPage(page + 1);
    }
    // 마지막 페이지의 마지막 뉴스레터면 아무것도 하지 않음
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
        <div className="absolute left-0 top-0 w-2/3 h-full flex flex-col justify-center px-12 z-10">
          {newsletters.length === 0 ? (
            <div className="text-center">
              <p className="text-white text-lg">
                아직 발행된 뉴스레터가 없습니다.
              </p>
            </div>
          ) : (
            <>
              {/* 현재 뉴스레터 */}
              {newsletters.length > 0 && newsletters[currentIndex] && (
                <div className="space-y-6 flex flex-col">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    {newsletters[currentIndex].title}
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                    {getPreview(newsletters[currentIndex].content)}
                  </p>
                  
                  {/* 메타 정보 */}
                  <div className="flex justify-between gap-4 text-white/80 space-y-4">
                    <div className='h-full flex items-center'>
                      <Button className="cursor-pointer" variant="emerald" onClick={() => router.push(`/home/newsletter/${newsletters[currentIndex].id}`)}>
                        뉴스레터 더보기
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>조회수 {newsletters[currentIndex].views}</span>
                      <span>
                        발행일 {new Date(newsletters[currentIndex].publishedAt).toLocaleDateString('ko-KR', {
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
            <span className="text-6xl"> {currentIndex + 1}</span>
            <span className="text-2xl"> / {newsletters.length}</span>
          </div>
        )}

        {/* 네비게이션 버튼 - 우하단 */}
        {newsletters.length > 0 && (
          <div className="absolute bottom-8 right-8 flex gap-4 z-20">
            <button
              onClick={goToPrevious}
              disabled={page === 1 && currentIndex === 0}
              className="w-12 h-12 bg-white/20 hover:bg-white/30 disabled:opacity-50 cursor-pointer disabled:cursor-default disabled:hover:bg-white/20 transition-all duration-300 rounded-full flex items-center justify-center text-white text-xl"
            >
              ‹
            </button>
            <button
              onClick={goToNext}
              disabled={page === totalPages && currentIndex === newsletters.length - 1}
              className="w-12 h-12 bg-white/20 hover:bg-white/30 disabled:opacity-50 cursor-pointer disabled:cursor-default disabled:hover:bg-white/20 transition-all duration-300 rounded-full flex items-center justify-center text-white text-xl"
            >
              ›
            </button>
          </div>
        )}
      </div>
      
      {/* 카테고리 섹션 */}
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">내 앱 컬렉션</h1>
            <Button
              onClick={() => setIsCategoryModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              + 새 카테고리 추가
            </Button>
          </div>
          
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">아직 카테고리가 없습니다.</p>
              <Button
                onClick={() => setIsCategoryModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                첫 번째 카테고리 만들기
              </Button>
            </div>
          ) : (
            categories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                onAddItem={handleAddItem}
                onUpdateItem={handleUpdateItem}
                onDeleteItem={handleDeleteItem}
                onReorderItems={handleReorderItems}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
              />
            ))
          )}
        </div>
      </div>

      {/* 카테고리 추가 모달 */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">새 카테고리 추가</h2>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const title = formData.get('title') as string;
              if (title?.trim()) {
                try {
                  await handleAddCategory(title.trim());
                } catch {
                  // 에러는 handleAddCategory에서 처리됨
                }
              }
            }}>
              <input
                type="text"
                name="title"
                placeholder="카테고리 이름을 입력하세요"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                required
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 토스트 알림 */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-2 rounded-md shadow-lg flex items-center justify-between min-w-64 ${
              toast.type === 'success' 
                ? 'bg-green-600 text-white' 
                : 'bg-red-600 text-white'
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-white/80 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}
