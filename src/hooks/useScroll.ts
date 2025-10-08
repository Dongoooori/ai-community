import { useEffect, useState } from 'react'

const useScroll = () => {
  const [completion, setCompletion] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateScrollCompletion = () => {
      // 현재 스크롤된 픽셀 값
      const scrollProgress = window.scrollY;
      // 전체 문서 높이에서 현재 보이는 뷰포트 높이를 뺀 값(즉, 스크롤 가능한 전체 길이)
      const scrollHeight = document.body.scrollHeight - window.innerHeight;

      // 스크롤 가능한 높이가 0이 아닐 때만 실행합니다.
      if(scrollHeight) {
        // 현재 스크롤 위치를 전체 스크롤 길이로 나누고, 소수점 둘째 자리까지 반올림한 뒤 100을 곱해 %로 변환하여 상태를 업데이트
        setCompletion(
          Number((scrollProgress / scrollHeight).toFixed(2)) * 100
        )
      }
    }
    window.addEventListener('scroll', updateScrollCompletion);

    return () => window.removeEventListener('scroll', updateScrollCompletion);
  }, []);
  return { completion, isScrolled };
}

export default useScroll