'use client';

import { motion } from 'framer-motion';
import { useInViewOnce } from '@/hooks/useInViewOnce';
import Image from 'next/image';

interface LabData {
  id: string;
  slug: string;
  title: string;
  description: string;
  image_url: string;
  position: number;
}

interface LabSectionProps {
  data: LabData;
}

export default function LabSection({ data }: LabSectionProps) {
  const { ref, isInView } = useInViewOnce({ threshold: 0.3 });

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

  const descriptionVariants = {
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
    <section className="relative w-full min-h-[75vh] max-h-[900px] overflow-hidden">
      {/* 배경 이미지 */}
      <div className="absolute inset-0">
        <Image
          src={data.image_url}
          alt={data.title}
          fill
          className="object-cover opacity-50"
          loading="lazy"
          sizes="100vw"
        />
      </div>

      {/* 오버레이 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/20 to-transparent" />

      {/* 콘텐츠 */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-12">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="flex-1 flex flex-col justify-center"
        >
          {/* 타이틀 */}
          <motion.h2
            variants={titleVariants}
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 max-w-2xl"
          >
            {data.title}
          </motion.h2>
        </motion.div>

        {/* 설명 텍스트 */}
        <motion.div
          variants={descriptionVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="max-w-2xl"
        >
          <p className="text-base md:text-lg lg:text-xl text-white/90 leading-relaxed">
            {data.description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
