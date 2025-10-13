"use client"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect } from "react"

export default function SignOut() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleSignOut = useCallback(() => {
    signOut({ callbackUrl: "/" })
  }, [])

  const handleCancel = useCallback(() => {
    router.push('/home')
  }, [router])

  // 로그인되지 않은 경우 메인 페이지로 리디렉션
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/')
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            로그아웃
          </h2>
        </div>
        <div className="mt-8 space-y-4">
          <button
            onClick={handleSignOut}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            로그아웃
          </button>
          <button
            onClick={handleCancel}
            className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  )
}

