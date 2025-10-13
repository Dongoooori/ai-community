"use client"
import Layout from "@/components/Layout"
import Loading from "@/components/Loading"
import { signIn, useSession, signOut } from "next-auth/react"
import { useCallback } from "react"

export default function SignIn() {
  const { data: session, status } = useSession()

  const handleGoogleSignIn = useCallback(() => {
    signIn("google", { callbackUrl: "/home" })
  }, [])

  const handleSignOut = useCallback(() => {
    signOut({ callbackUrl: "/" })
  }, [])

  if (status === "loading") {
    return (
      <Loading />
    )
  }

  if (session) {
    return (
      <Layout displayFooter={false} className="bg-black">
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full space-y-8 p-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                이미 로그인됨
              </h2>
              <p className="mt-2 text-center text-sm text-white">
                {session.user?.email}로 로그인되어 있습니다
              </p>
            </div>
            <div className="mt-8 space-y-6">
              <button
                onClick={handleSignOut}
                className="relative w-full flex justify-center py-3 px-4 text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-300 to-purple-600 cursor-pointer"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout displayFooter={false} className="bg-black">
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              로그인
            </h2>
            <p className="mt-2 text-center text-sm text-white">
              Tokyo AI Community에 로그인하세요
            </p>
          </div>
          
          <div className="mt-8 space-y-6">
            {/* Google 로그인 버튼 */}
            <button
              onClick={handleGoogleSignIn}
              className="relative w-full flex justify-center py-3 px-4 text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-300 to-purple-600 cursor-pointer"
            >
              Google로 로그인
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

