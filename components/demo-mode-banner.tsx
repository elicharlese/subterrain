"use client"

import { useDemo } from "@/contexts/demo-context"

export function DemoModeBanner() {
  const { isDemoMode, endDemoMode } = useDemo()

  if (!isDemoMode) {
    return null
  }

  return (
    <div className="bg-purple-600 text-white px-4 py-2 text-center text-sm relative">
      <span>You are currently in demo mode. No data will be saved.</span>
      <button
        onClick={endDemoMode}
        className="ml-4 bg-white text-purple-600 px-2 py-0.5 rounded-md text-xs font-medium hover:bg-purple-100 transition-colors"
      >
        Exit Demo
      </button>
    </div>
  )
}
