# Tokyo AI Community

도쿄 AI 커뮤니티 랜딩 페이지 - AI 기술과 혁신을 위한 실험실

## 🚀 기술 스택

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (애니메이션)
- **shadcn/ui** (UI 컴포넌트)
- **Intersection Observer** (스크롤 애니메이션)

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── api/           # API 라우트
│   │   ├── hero/      # 히어로 섹션 데이터
│   │   ├── labs/      # 실험실 데이터
│   │   ├── community/ # 커뮤니티 데이터
│   │   └── footer/    # 푸터 데이터
│   ├── layout.tsx     # 루트 레이아웃
│   └── page.tsx       # 메인 페이지
├── components/        # React 컴포넌트
│   ├── ui/           # shadcn/ui 컴포넌트
│   ├── Header.tsx    # 헤더 컴포넌트
│   ├── HeroVideo.tsx # 히어로 비디오 섹션
│   ├── SectionIntro.tsx # 소개 섹션
│   ├── LabSection.tsx # 실험실 섹션
│   ├── CommunitySection.tsx # 커뮤니티 섹션
│   └── Footer.tsx    # 푸터 컴포넌트
└── hooks/
    └── useInViewOnce.ts # 스크롤 애니메이션 훅
```

## 🎨 주요 기능

### 1. 헤더
- 상단 고정 (sticky)
- 스크롤 시 반투명 배경
- 로고 클릭 시 페이지 새로고침
- 로그인 버튼 (UI만)

### 2. 히어로 섹션
- 풀스크린 비디오 배경
- 자동재생, 무음, 반복
- 포스터 이미지 → 비디오 페이드 전환
- LCP 최적화

### 3. 소개 섹션
- 중앙 정렬 텍스트
- 스크롤 진입 시 페이드업 애니메이션

### 4. 실험실 섹션 (4개)
- Design Lab
- Video Lab  
- Coding Lab
- Robot Lab
- 풀블리드 이미지 배경
- 하단에서 슬라이드업 텍스트 애니메이션

### 5. 협업 커뮤니티 섹션
- 실험실과 동일한 패턴
- 커뮤니티 소개 콘텐츠

### 6. 푸터
- 3열 레이아웃
- 브랜드 정보
- 실험실 링크
- 소셜 미디어 링크

## 🎬 애니메이션

- **Framer Motion** variants 사용
- **Intersection Observer** 기반 스크롤 애니메이션
- 30% 보일 때 트리거
- 1회만 재생 (triggerOnce)
- easeOut 이징

## 📱 반응형 디자인

- 모바일 우선 설계
- Tailwind CSS 브레이크포인트 활용
- 이미지 최적화 (Next.js Image)
- 터치 친화적 인터페이스

## 🔧 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

## 🌐 API 엔드포인트

- `GET /api/hero` - 히어로 섹션 데이터
- `GET /api/labs` - 실험실 목록
- `GET /api/community` - 커뮤니티 정보
- `GET /api/footer` - 푸터 데이터

## 🎯 성능 최적화

- **SSR** + 동적 캐시
- 이미지 lazy loading
- 비디오 preload="none"
- CDN 캐시 헤더 설정
- LCP 최적화

## ♿ 접근성

- ARIA 레이블
- 키보드 네비게이션
- 스크린 리더 지원
- 색상 대비 준수
- 의미론적 HTML

## 🔮 백엔드 연동

현재는 더미 데이터를 사용하지만, 실제 운영 시에는:

1. **Supabase** (Postgres + Storage)
2. **Mux/Cloudflare Stream** (비디오 스트리밍)
3. **관리자 대시보드** (콘텐츠 관리)

## 📄 라이선스

MIT License

---

**Tokyo AI Community** - AI 기술과 혁신을 위한 실험실