'use client';

import { Button } from '@/components/ui/button';
import useScroll from '@/hooks/useScroll';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useRef, useEffect, useCallback } from 'react';

export default function Header() {
  const { completion, isScrolled } = useScroll();
  const router = useRouter();
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogoClick = useCallback(() => {
    if(session) {
      router.push('/home');
    } else {
      router.push('/');
    }
  }, [router, session]);

  const handleLogin = useCallback(() => {
    if(session) {
      router.push('/home');
    } else {
      router.push('/auth/signin');
    }
  }, [router, session]);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <button
            onClick={handleLogoClick}
            className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
            aria-label="Tokyo AI Community 홈으로 이동"
          >
            TAC
          </button>

          {/* 사이트 타이틀 */}
          <h1 className="text-xl font-semibold text-foreground hidden sm:block">
            Tokyo AI Community
          </h1>

          {/* 로그인 상태에 따라 다른 UI */}
          {session ? (
            <div className="relative" ref={dropdownRef}>
              {/* 사용자 아바타 */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                aria-label="사용자 메뉴"
              >
                <Image
                  src={session.user?.image || '/default-avatar.png'}
                  alt={session.user?.name || 'User'}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              </button>

              {/* 드롭다운 메뉴 */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg overflow-hidden">
                  {/* 사용자 정보 */}
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-foreground">
                      {session.user?.name || '사용자'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.user?.email}
                    </p>
                  </div>

                  {/* 메뉴 아이템 */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        router.push('/auth/signout');
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent border-border hover:bg-accent px-4 cursor-pointer"
              onClick={handleLogin}
            >
              Login
            </Button>
          )}
        </div>
      </div>
      <span 
        style={{
          transform: `translateX(${completion - 100}%)`
        }}
        className="absolute bg-white w-full h-1 bottom-0"
      />
    </header>
  );
}
