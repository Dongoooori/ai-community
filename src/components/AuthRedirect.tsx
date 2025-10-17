'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * 로그인된 사용자를 /home으로 리다이렉트하는 컴포넌트
 * SSG 페이지에서 클라이언트 사이드 인증 체크를 위해 사용
 */
export default function AuthRedirect() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      // TODO: 로그인 성공 후 홈 페이지로 리다이렉트
      router.push('/');
    }
  }, [status, router]);

  // UI를 렌더링하지 않음 (투명)
  return null;
}

