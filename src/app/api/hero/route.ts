import { NextResponse } from 'next/server';

export async function GET() {
  // Vercel Blob Storage에 있는 비디오 URL을 직접 설정하세요
  // 예시: https://your-project.vercel-storage.com/your-video.mp4
  const heroData = {
    title: "Tokyo AI Community",
    poster_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920&h=1080&fit=crop&crop=center",
    video_type: "mp4" as const,
    video_url: process.env.HERO_VIDEO_URL || "",
  };

  return NextResponse.json(heroData, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
