# Tokyo AI Community

도쿄 AI 커뮤니티 랜딩 페이지 - AI 기술과 혁신을 위한 실험실

## 🚀 기술 스택

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (애니메이션)
- **shadcn/ui** (UI 컴포넌트)
- **Intersection Observer** (스크롤 애니메이션)
- **Prisma** (ORM)
- **PostgreSQL** (데이터베이스)
- **NextAuth.js** (인증)
- **Vercel Blob** (이미지 스토리지)

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── api/                    # API 라우트
│   │   ├── auth/              # NextAuth 인증
│   │   ├── newsletters/       # 뉴스레터 공개 API
│   │   └── admin/             # 관리자 API
│   │       ├── newsletters/   # 뉴스레터 CRUD
│   │       └── upload-image/  # 이미지 업로드
│   ├── home/                  # 로그인 후 홈
│   │   └── newsletter/[id]/   # 뉴스레터 상세
│   ├── admin/                 # 관리자 페이지
│   │   └── newsletter/        # 뉴스레터 관리
│   ├── auth/                  # 인증 페이지
│   ├── layout.tsx             # 루트 레이아웃
│   └── page.tsx               # 랜딩 페이지
├── components/                # React 컴포넌트
│   ├── ui/                    # shadcn/ui 컴포넌트
│   ├── Layout/                # 레이아웃 컴포넌트
│   ├── NewsletterEditor.tsx   # 뉴스레터 에디터
│   └── ...                    # 기타 컴포넌트
├── lib/                       # 유틸리티
│   ├── prisma.ts              # Prisma 클라이언트
│   └── auth-utils.ts          # 인증 헬퍼
└── hooks/                     # 커스텀 훅
    └── useInViewOnce.ts       # 스크롤 애니메이션
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

### 7. 뉴스레터 시스템 ⭐ NEW
- **사용자 기능**
  - 뉴스레터 목록 (카드 그리드)
  - 상세 페이지 (마크다운 렌더링)
  - 조회수 자동 증가
  - 페이지네이션
- **관리자 기능**
  - 뉴스레터 작성/수정/삭제
  - 이미지 업로드 (Vercel Blob)
  - 발행/비공개 관리
  - 임시 저장 기능

### 8. 인증 시스템
- Google OAuth 로그인
- 테스트 로그인 (개발 환경)
- 권한 관리 (USER/ADMIN)
- 세션 기반 인증

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

### 1. 환경 변수 설정

`.env` 파일 생성:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
NEXTAUTH_URL="http://localhost:4000"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

### 2. 데이터베이스 설정

```bash
# Prisma 클라이언트 생성
npm run prisma:generate

# 마이그레이션 실행
npm run prisma:migrate

# Prisma Studio 실행 (DB 관리)
npm run prisma:studio
```

### 3. 개발 서버 실행

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

### 4. 관리자 계정 생성

Prisma Studio에서 User 테이블의 `role`을 `ADMIN`으로 변경

**자세한 설정 가이드는 [NEWSLETTER_SETUP.md](./NEWSLETTER_SETUP.md)를 참고하세요.**

## 🌐 API 엔드포인트

### 공개 API
- `GET /api/newsletters` - 발행된 뉴스레터 목록
- `GET /api/newsletters/[id]` - 개별 뉴스레터 조회

### 관리자 API (인증 필요)
- `GET /api/admin/newsletters` - 모든 뉴스레터 목록
- `POST /api/admin/newsletters` - 뉴스레터 생성
- `PUT /api/admin/newsletters/[id]` - 뉴스레터 수정
- `DELETE /api/admin/newsletters/[id]` - 뉴스레터 삭제
- `PATCH /api/admin/newsletters/[id]/publish` - 발행/비공개 토글
- `POST /api/admin/upload-image` - 이미지 업로드

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

## 🗄️ 데이터베이스 스키마

### User
- id, email, name, image
- **role** (USER/ADMIN)
- newsletters (관계)

### Newsletter
- id, title, content, thumbnail
- published, views
- authorId (User 관계)
- publishedAt, createdAt, updatedAt

### NextAuth Tables
- Account, Session, VerificationToken

## 📄 라이선스

MIT License

---

**Tokyo AI Community** - AI 기술과 혁신을 위한 실험실