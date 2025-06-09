"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDemo } from "@/contexts/demo-context"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { isDemoMode } = useDemo()
  const router = useRouter()

  // Redirect to app if in demo mode
  useEffect(() => {
    if (isDemoMode) {
      router.push("/app")
    }
  }, [isDemoMode, router])

  // If in demo mode, don't render children (will redirect)
  if (isDemoMode) {
    return null
  }

  return <>{children}</>
}
