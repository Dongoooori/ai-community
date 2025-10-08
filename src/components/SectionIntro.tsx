'use client';

import { motion } from 'framer-motion';
import { useInViewOnce } from '@/hooks/useInViewOnce';

export default function SectionIntro() {
  const { ref, isInView } = useInViewOnce({ threshold: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
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

  return (
    <section className="mt-40 px-4 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          <motion.div
            variants={itemVariants}
            className="space-y-6 text-lg md:text-xl text-white leading-relaxed"
          >
            <p>
              우리는 단순히 기술을 제공하는 것이 아닙니다.
            </p>
            <p>
              AI를 통해 사람들의 삶과 비즈니스를 변화시키는 경험을 제공합니다.
            </p>
            <p>
              머신러닝, 자연어 처리, 생성형 AI 등 다양한 분야에서 축적한 경험과 노하우를 통해, 누구나 쉽고 직관적으로 AI를 활용할 수 있는 환경을 만들어갑니다.
            </p>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="mt-40 text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8"
          >
            실험실
          </motion.h2>
        </motion.div>
      </div>
    </section>
  );
}
