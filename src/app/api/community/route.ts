import { NextResponse } from 'next/server';

export async function GET() {
  // 실제로는 Supabase나 다른 백엔드에서 데이터를 가져옵니다
  const communityData = {
    id: "1",
    title: "협업 커뮤니티",
    image_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop&crop=center",
    headline: "영상으로 연결된 작업실",
    description: "온라인 커뮤니티를 통해 명확한 목표 설정, 정기적인 피드백, 협업 소프트웨어 활용, 유연한 작업 환경, 효과적인 커뮤니케이션 도구 활용이 가능함으로써 업무 생산성 향상을 목표로 하고 있습니다.",
  };

  return NextResponse.json(communityData, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
