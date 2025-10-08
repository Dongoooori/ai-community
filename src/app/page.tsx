import Header from '@/components/Header';
import HeroVideo from '@/components/HeroVideo';
import SectionIntro from '@/components/SectionIntro';
import LabSection from '@/components/LabSection';
import CommunitySection from '@/components/CommunitySection';
import Footer from '@/components/Footer';

// API 데이터 타입 정의
interface HeroData {
  title: string;
  poster_url: string;
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

interface FooterData {
  brand: {
    name: string;
    description: string;
  };
  laboratory: Array<{
    label: string;
    href: string;
  }>;
  social: Array<{
    label: string;
    href: string;
  }>;
}

// API 데이터 가져오기
async function getHeroData(): Promise<HeroData> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const res = await fetch(`${baseUrl}/api/hero`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch hero data');
  }
  return res.json();
}

async function getLabsData(): Promise<LabData[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const res = await fetch(`${baseUrl}/api/labs`, {
    cache: 'force-cache',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch labs data');
  }
  return res.json();
}

async function getCommunityData(): Promise<CommunityData> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const res = await fetch(`${baseUrl}/api/community`, {
    cache: 'force-cache',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch community data');
  }
  return res.json();
}

async function getFooterData(): Promise<FooterData> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const res = await fetch(`${baseUrl}/api/footer`, {
    cache: 'force-cache',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch footer data');
  }
  return res.json();
}

export default async function Home() {
  // 모든 데이터를 병렬로 가져오기
  const [heroData, labsData, communityData, footerData] = await Promise.all([
    getHeroData(),
    getLabsData(),
    getCommunityData(),
    getFooterData(),
  ]);

  // 실험실 데이터를 position 순으로 정렬
  const sortedLabsData = labsData.sort((a, b) => a.position - b.position);

  return (
    <div className="min-h-screen">
      <Header />
      
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
      
      {/* 푸터 */}
      <Footer data={footerData} />
    </div>
  );
}
