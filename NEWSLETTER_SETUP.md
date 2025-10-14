# 뉴스레터 시스템 설정 가이드

## 📋 개요

Tokyo AI Community 뉴스레터 시스템이 성공적으로 구축되었습니다!

### 주요 기능
- ✅ 뉴스레터 작성/수정/삭제 (Admin)
- ✅ 이미지 업로드 (Vercel Blob)
- ✅ 발행/비공개 토글
- ✅ 뉴스레터 목록 (카드 그리드)
- ✅ 상세 페이지 (조회수 자동 증가)
- ✅ 권한 관리 (USER/ADMIN)
- ✅ 페이지네이션

---

## 🚀 설정 단계

### 1. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 추가하세요:

\`\`\`bash
# Database (Neon, Supabase, PlanetScale 등)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:4000"
NEXTAUTH_SECRET="openssl rand -base64 32로 생성한 시크릿"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Vercel Blob
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
\`\`\`

### 2. 데이터베이스 마이그레이션

\`\`\`bash
# Prisma 클라이언트 생성
npx prisma generate

# 마이그레이션 실행
npx prisma migrate dev --name init

# (선택) Prisma Studio로 데이터 확인
npx prisma studio
\`\`\`

### 3. 관리자 계정 생성

첫 번째 사용자를 ADMIN으로 설정:

\`\`\`bash
# Prisma Studio 실행
npx prisma studio

# User 테이블에서 본인 계정 찾기
# role을 "USER"에서 "ADMIN"으로 변경
\`\`\`

또는 직접 SQL 실행:

\`\`\`sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
\`\`\`

### 4. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

---

## 📁 페이지 구조

\`\`\`
/home                          → 뉴스레터 목록 (카드 그리드)
/home/newsletter/[id]          → 뉴스레터 상세 페이지
/admin/newsletter              → 뉴스레터 관리 (목록)
/admin/newsletter/create       → 새 뉴스레터 작성
/admin/newsletter/edit/[id]    → 뉴스레터 수정
\`\`\`

---

## 🔑 API 엔드포인트

### 공개 API
- `GET /api/newsletters` - 발행된 뉴스레터 목록
- `GET /api/newsletters/[id]` - 개별 뉴스레터 조회

### 관리자 API (인증 필요)
- `GET /api/admin/newsletters` - 모든 뉴스레터 목록
- `POST /api/admin/newsletters` - 뉴스레터 생성
- `GET /api/admin/newsletters/[id]` - 개별 조회
- `PUT /api/admin/newsletters/[id]` - 수정
- `DELETE /api/admin/newsletters/[id]` - 삭제
- `PATCH /api/admin/newsletters/[id]/publish` - 발행/비공개 토글
- `POST /api/admin/upload-image` - 이미지 업로드

---

## 🎨 사용 방법

### 1. 뉴스레터 작성

1. `/admin/newsletter`로 이동
2. "새 뉴스레터 작성" 버튼 클릭
3. 제목, 썸네일, 내용 입력
4. "임시 저장" 또는 "발행하기" 선택

### 2. 마크다운 문법

\`\`\`markdown
# 제목 1
## 제목 2
### 제목 3

**굵게**
*기울임*
\`코드\`

일반 텍스트는 그대로 입력
\`\`\`

### 3. 이미지 업로드

- "이미지 업로드" 버튼 클릭
- 이미지 선택 (최대 5MB)
- Vercel Blob에 자동 업로드
- 썸네일로 설정됨

---

## 🔒 권한 관리

### USER (일반 사용자)
- 뉴스레터 목록 조회
- 뉴스레터 읽기

### ADMIN (관리자)
- 모든 USER 권한
- 뉴스레터 작성/수정/삭제
- 발행/비공개 관리
- 이미지 업로드

---

## 🐛 트러블슈팅

### 1. 데이터베이스 연결 오류

\`\`\`bash
# Prisma 클라이언트 재생성
npx prisma generate

# 연결 테스트
npx prisma db push
\`\`\`

### 2. 관리자 페이지 403 에러

- User 테이블에서 role이 "ADMIN"인지 확인
- 로그아웃 후 재로그인

### 3. 이미지 업로드 실패

- `BLOB_READ_WRITE_TOKEN` 환경 변수 확인
- Vercel 대시보드에서 Blob 활성화 확인

---

## 📦 배포 (Vercel)

### 1. 환경 변수 설정

Vercel 대시보드 → Settings → Environment Variables:

\`\`\`
DATABASE_URL
NEXTAUTH_URL (https://your-domain.vercel.app)
NEXTAUTH_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
BLOB_READ_WRITE_TOKEN
\`\`\`

### 2. 빌드 설정

\`\`\`json
{
  "buildCommand": "prisma generate && next build",
  "installCommand": "npm install"
}
\`\`\`

### 3. 배포 후

1. Google OAuth Redirect URI 추가:
   - `https://your-domain.vercel.app/api/auth/callback/google`

2. 첫 관리자 계정 생성:
   - Prisma Studio 또는 DB 직접 수정

---

## 🎉 완료!

이제 뉴스레터 시스템을 사용할 준비가 되었습니다!

### 다음 단계 (선택사항)

- [ ] 리치 텍스트 에디터 추가 (Tiptap, Lexical)
- [ ] 이메일 구독 기능
- [ ] 댓글 시스템
- [ ] 좋아요/북마크 기능
- [ ] 태그/카테고리
- [ ] 검색 기능
- [ ] RSS 피드

---

문의사항이 있으시면 언제든지 연락주세요! 🚀

