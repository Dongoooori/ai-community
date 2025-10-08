import { NextResponse } from 'next/server';

export async function GET() {
  // 실제로는 Supabase나 다른 백엔드에서 데이터를 가져옵니다
  const footerData = {
    brand: {
      name: "Tokyo AI Community",
      description: "AI 기술과 혁신을 위한 실험실",
    },
    laboratory: [
      { label: "Design Lab", href: "/labs/design" },
      { label: "Video Lab", href: "/labs/video" },
      { label: "Coding Lab", href: "/labs/coding" },
      { label: "Robot Lab", href: "/labs/robot" },
    ],
    social: [
      { label: "Instagram", href: "https://instagram.com/tokyoai" },
      { label: "Threads", href: "https://threads.net/tokyoai" },
    ],
  };

  return NextResponse.json(footerData, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
