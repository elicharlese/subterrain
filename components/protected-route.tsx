"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useDemo } from "@/contexts/demo-context"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const { isDemoMode } = useDemo()
  const router = useRouter()

  useEffect(() => {
    // Don't redirect if in demo mode
    if (isDemoMode) {
      return
    }

    // Only redirect if not loading and not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/signin")
    }
  }, [isAuthenticated, isLoading, router, isDemoMode])

  // If in demo mode or authenticated, show the children
  if (isDemoMode || isAuthenticated) {
    return <>{children}</>
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
      </div>
    )
  }

  // Show nothing while redirecting
  return null
}
