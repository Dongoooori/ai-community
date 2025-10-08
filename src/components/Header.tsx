'use client';

import { Button } from '@/components/ui/button';
import useScroll from '@/hooks/useScroll';

export default function Header() {

  const { completion, isScrolled } = useScroll();

  const handleLogoClick = () => {
    window.location.reload();
  };

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

          {/* 로그인 버튼 */}
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent border-border hover:bg-accent px-4 cursor-pointer"
          >
            Login
          </Button>
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
