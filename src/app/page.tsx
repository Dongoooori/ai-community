import Header from '@/components/Header';
import HeroVideo from '@/components/HeroVideo';
import SectionIntro from '@/components/SectionIntro';
import LabSection from '@/components/LabSection';
import CommunitySection from '@/components/CommunitySection';
import Footer from '@/components/Footer';
import NewsletterSection from '@/components/NewsletterSection';
import Layout from '@/components/Layout';

// API 데이터 타입 정의
interface HeroData {
  title: string;
  video_type: 'mp4' | 'hls';
  video_url: string;
}

interface LabData {
  id: string;
  slug: string;
  title: string;
  description: string;
  image_url: string;
  position: number;
}

interface CommunityData {
  id: string;
  title: string;
  image_url: string;
  headline: string;
  description: string;
}

interface NewsletterData {
  id: string;
  title: string;
  image_url: string;
  headline: string;
  description: string;
}

// API 데이터 직접 가져오기 (서버 컴포넌트에서)
async function getHeroData(): Promise<HeroData> {
  return {
    title: "Tokyo AI Community",
    video_type: "mp4" as const,
    // public 폴더의 비디오 사용 (Vercel CDN 자동 적용)
    video_url: "/hero-video.mp4",
  };
}

async function getLabsData(): Promise<LabData[]> {
  return [
    {
      id: "1",
      slug: "design",
      title: "Design Lab",
      description: "브랜드 아이덴티티, UI/UX, 생성형 도구까지 — AI가 디자인 워크플로를 혁신하는 방법을 배우고 직접 만들어봅니다.",
      image_url: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&h=675&q=75&fm=webp&fit=crop&crop=center",
      position: 1,
    },
    {
      id: "2",
      slug: "video",
      title: "Video Lab",
      description: "프리프로덕션부터 편집·자막·색보정 자동화까지 — AI가 영상 제작을 바꾸는 과정을 경험할 수 있습니다.",
      image_url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&h=675&q=75&fm=webp&fit=crop&crop=center",
      position: 2,
    },
    {
      id: "3",
      slug: "coding",
      title: "Coding Lab",
      description: "프로젝트 협업, 코드 리뷰, 자동화된 테스트까지 — 다양한 영역에서 AI가 개발 과정을 혁신하는 방법을 배우고 직접 경험할 수 있습니다.",
      image_url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=675&q=75&fm=webp&fit=crop&crop=center",
      position: 3,
    },
    {
      id: "4",
      slug: "robot",
      title: "Robot Lab",
      description: "센서 처리, 경로 계획, 자율 제어까지 — AI가 로봇을 똑똑하게 만드는 방법을 배우고 실제로 구동해봅니다.",
      image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=675&q=75&fm=webp&fit=crop&crop=center",
      position: 4,
    },
  ];
}
async function getCommunityData(): Promise<CommunityData> {
  return {
    id: "1",
    title: "협업 커뮤니티",
    image_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=675&q=75&fm=webp&fit=crop&crop=center",
    headline: "영상으로 연결된 작업실",
    description: "온라인 커뮤니티를 통해 명확한 목표 설정, 정기적인 피드백, 협업 소프트웨어 활용, 유연한 작업 환경, 효과적인 커뮤니케이션 도구 활용이 가능함으로써 업무 생산성 향상을 목표로 하고 있습니다.",
  };
}
async function getNewsletterData(): Promise<NewsletterData> {
  return {
    id: "1",
    title: "뉴스레터",
    image_url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=675&q=75&fm=webp&fit=crop&crop=center",
    headline: "AI 소식지",
    description: "로그인하시면 인공지능(AI)에 관한 다양한 뉴스레터를 자유롭게 읽어보실 수 있습니다. 최신 기술 트렌드부터 실생활 활용 사례까지 폭넓은 내용을 만나보세요.",
  };
}

export default async function Home() {
  // 모든 데이터를 병렬로 가져오기
  const [heroData, labsData, communityData, newsletterData] = await Promise.all([
    getHeroData(),
    getLabsData(),
    getCommunityData(),
    getNewsletterData(),
  ]);

  // 실험실 데이터를 position 순으로 정렬
  const sortedLabsData = labsData.sort((a, b) => a.position - b.position);

  return (
    <Layout className="min-h-screen">

      {/* 히어로 섹션 */}
      <HeroVideo data={heroData} />
      
      {/* 소개 섹션 */}
      <SectionIntro />
      
      {/* 실험실 섹션들 */}
      <div className="mt-40">
        {sortedLabsData.map((lab) => (
          <LabSection key={lab.id} data={lab} />
        ))}
      </div>
      
      {/* 협업 커뮤니티 섹션 */}
      <div className="mt-40">
        <CommunitySection data={communityData} />
      </div>
      
      {/* 뉴스레터 소개  섹션 */}
      <div className="mt-40">
        <NewsletterSection data={newsletterData} />
      </div>

    </Layout>
  );
}
