'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import poster from '../asset/hero.png';

interface HeroData {
  title: string;
  video_type: 'mp4' | 'hls';
  video_url: string;
}

interface HeroVideoProps {
  data: HeroData;
}

export default function HeroVideo({ data }: HeroVideoProps) {
  const [showVideo, setShowVideo] = useState(true);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer로 화면에 보일 때만 비디오 로드
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoadVideo(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoadVideo) return;
    
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      // 포스터 이미지에서 비디오로 페이드 전환
      setTimeout(() => {
        setShowVideo(true);
      }, 100);
    };

    const handleError = (e: Event) => {
      console.error('비디오 로드 실패:', e);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    // 비디오 URL이 변경되면 강제로 새로 로드
    video.src = data.video_url;
    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [data.video_url, shouldLoadVideo]);

  return (
    <section ref={sectionRef} className="relative w-full h-screen overflow-hidden">
      {/* 포스터 이미지 */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          showVideo ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Image
          src={poster}
          alt={data.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={85}
        />
      </div>

      {/* 비디오 - 화면에 보일 때만 로드 */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          showVideo ? 'opacity-100' : 'opacity-0'
        }`}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster={poster.src}
      >
        {shouldLoadVideo && <source src={data.video_url} type="video/mp4" />}
      </video>

      {/* 오버레이 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
    </section>
  );
}
