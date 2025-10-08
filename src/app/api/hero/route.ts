import { NextResponse } from 'next/server';

export async function GET() {
  // Vercel Blob URL을 여기에 설정
  // 비디오 업로드 후 받은 URL로 교체하세요
  const heroData = {
    title: "Tokyo AI Community",
    poster_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920&h=1080&fit=crop&crop=center",
    video_type: "mp4" as const,
    video_url: process.env.HERO_VIDEO_URL || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  };

  return NextResponse.json(heroData, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
