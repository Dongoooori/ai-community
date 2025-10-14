import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // 로컬 환경(개발 모드)에서만 테스트 로그인 추가
    ...(process.env.NODE_ENV === "development"
      ? [
          CredentialsProvider({
            id: "test-login",
            name: "테스트 로그인",
            credentials: {
              email: { label: "이메일", type: "email", placeholder: "test@example.com" },
              name: { label: "이름", type: "text", placeholder: "테스트 유저" },
            },
            async authorize(credentials) {
              // 개발 환경에서만 작동하는 테스트 로그인
              if (credentials?.email && credentials?.name) {
                // Prisma에서 사용자 찾기 또는 생성
                let user = await prisma.user.findUnique({
                  where: { email: credentials.email },
                })

                if (!user) {
                  user = await prisma.user.create({
                    data: {
                      email: credentials.email,
                      name: credentials.name,
                      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(credentials.name)}&background=random`,
                      role: "USER",
                    },
                  })
                }

                return {
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  image: user.image,
                }
              }
              return null
            },
          }),
        ]
      : []),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30일
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // 로그인 후 리다이렉트 처리
      // callbackUrl이 명시되어 있으면 해당 URL로 이동
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // 같은 도메인이면 허용
      else if (new URL(url).origin === baseUrl) return url
      // 그 외에는 /home으로
      return `${baseUrl}/home`
    },
    async jwt({ token, user }) {
      // 로그인 직후 user 정보를 token에 저장
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
        
        // DB에서 role 가져오기
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email as string },
          select: { role: true },
        })
        token.role = dbUser?.role || "USER"
      }
      return token
    },
    async session({ session, token }) {
      // token의 정보를 session에 전달
      if (token && session.user) {
        (session.user as { id?: string; role?: string }).id = token.id as string
        (session.user as { id?: string; role?: string }).role = token.role as string
        session.user.email = token.email as string | null | undefined
        session.user.name = token.name as string | null | undefined
        session.user.image = token.picture as string | null | undefined
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

