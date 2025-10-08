'use client';

import { motion } from 'framer-motion';
import { useInViewOnce } from '@/hooks/useInViewOnce';
import Image from 'next/image';

interface CommunityData {
  id: string;
  title: string;
  image_url: string;
  headline: string;
  description: string;
}

interface CommunitySectionProps {
  data: CommunityData;
}

export default function CommunitySection({ data }: CommunitySectionProps) {
  const { ref: titleRef, isInView: titleInView } = useInViewOnce({ threshold: 0.3 });
  const { ref: contentRef, isInView: contentInView } = useInViewOnce({ threshold: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
        staggerChildren: 0.3,
      },
    },
  };

  const titleVariants = {
    hidden: { y: 40, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  const contentTitleVariants = {
    hidden: { y: 40, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  const contentVariants = {
    hidden: { y: 40, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
        delay: 0.2,
      },
    },
  };

  return (
    <>
      {/* 제목 섹션 */}
      <section className="mb-40 px-4 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            ref={titleRef}
            variants={titleVariants}
            initial="hidden"
            animate={titleInView ? "show" : "hidden"}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8"
          >
            협업 커뮤니티
          </motion.h2>
        </div>
      </section>

      {/* 메인 콘텐츠 섹션 */}
      <section className="relative w-full min-h-[90vh] max-h-[900px] overflow-hidden">
        {/* 배경 이미지 */}
        <div className="absolute inset-0">
          <Image
            src={data.image_url}
            alt={data.title}
            fill
            className="object-cover"
            loading="lazy"
            sizes="100vw"
          />
        </div>

        {/* 오버레이 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/20 to-transparent" />

        {/* 콘텐츠 */}
        <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-12">
          <motion.div
            ref={contentRef}
            variants={containerVariants}
            initial="hidden"
            animate={contentInView ? "show" : "hidden"}
            className="flex-1 flex flex-col justify-center"
          >
            {/* 헤드라인 */}
            <motion.h3
              variants={contentTitleVariants}
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 max-w-3xl"
            >
              {data.headline}
            </motion.h3>
          </motion.div>

          {/* 설명 텍스트 */}
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate={contentInView ? "show" : "hidden"}
            className="max-w-3xl"
          >
            <p className="text-base md:text-lg lg:text-xl text-white/90 leading-relaxed">
              {data.description}
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
