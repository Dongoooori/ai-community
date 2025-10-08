'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface HeroData {
  title: string;
  poster_url: string;
  video_type: 'mp4' | 'hls';
  video_url: string;
}

interface HeroVideoProps {
  data: HeroData;
}

export default function HeroVideo({ data }: HeroVideoProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsVideoLoaded(true);
      // 포스터 이미지에서 비디오로 페이드 전환
      setTimeout(() => {
        setShowVideo(true);
      }, 100);
    };

    const handleError = (e: Event) => {
      console.error('비디오 로드 실패:', e);
    };

    const handleLoadStart = () => {
      console.log('비디오 로딩 시작:', data.video_url);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);

    // 비디오 URL이 변경되면 강제로 새로 로드
    video.src = data.video_url;
    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
    };
  }, [data.video_url]);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* 포스터 이미지 */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          showVideo ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Image
          src={data.poster_url}
          alt={data.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* 비디오 */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          showVideo ? 'opacity-100' : 'opacity-0'
        }`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={data.poster_url}
      >
        <source src={data.video_url} type="video/mp4" />
        브라우저가 비디오를 지원하지 않습니다.
      </video>

      {/* 오버레이 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

      {/* 히어로 콘텐츠 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            {data.title}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl opacity-90 max-w-2xl mx-auto">
            AI 기술과 혁신을 위한 실험실
          </p>
        </div>
      </div>
    </section>
  );
}
