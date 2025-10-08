import { NextResponse } from 'next/server';

export async function GET() {
  // 실제로는 Supabase나 다른 백엔드에서 데이터를 가져옵니다
  const labsData = [
    {
      id: "1",
      slug: "design",
      title: "Design Lab",
      description: "브랜드 아이덴티티, UI/UX, 생성형 도구까지 — AI가 디자인 워크플로를 혁신하는 방법을 배우고 직접 만들어봅니다.",
      image_url: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1920&h=1080&fit=crop&crop=center",
      position: 1,
    },
    {
      id: "2",
      slug: "video",
      title: "Video Lab",
      description: "프리프로덕션부터 편집·자막·색보정 자동화까지 — AI가 영상 제작을 바꾸는 과정을 경험할 수 있습니다.",
      image_url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1920&h=1080&fit=crop&crop=center",
      position: 2,
    },
    {
      id: "3",
      slug: "coding",
      title: "Coding Lab",
      description: "프로젝트 협업, 코드 리뷰, 자동화된 테스트까지 — 다양한 영역에서 AI가 개발 과정을 혁신하는 방법을 배우고 직접 경험할 수 있습니다.",
      image_url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1920&h=1080&fit=crop&crop=center",
      position: 3,
    },
    {
      id: "4",
      slug: "robot",
      title: "Robot Lab",
      description: "센서 처리, 경로 계획, 자율 제어까지 — AI가 로봇을 똑똑하게 만드는 방법을 배우고 실제로 구동해봅니다.",
      image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920&h=1080&fit=crop&crop=center",
      position: 4,
    },
  ];

  return NextResponse.json(labsData, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
