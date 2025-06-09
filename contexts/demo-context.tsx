"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type DemoContextType = {
  isDemoMode: boolean
  startDemoMode: () => void
  endDemoMode: () => void
}

const DemoContext = createContext<DemoContextType | undefined>(undefined)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const router = useRouter()

  // Check if demo mode is active on mount
  useEffect(() => {
    try {
      const demoActive = localStorage.getItem("subterrain_demo_mode") === "true"
      setIsDemoMode(demoActive)
    } catch (error) {
      console.error("Failed to access localStorage:", error)
    }
  }, [])

  // Start demo mode
  const startDemoMode = () => {
    try {
      localStorage.setItem("subterrain_demo_mode", "true")
      setIsDemoMode(true)
      router.push("/app")
    } catch (error) {
      console.error("Failed to set demo mode:", error)
      // Fallback - still try to navigate even if localStorage fails
      router.push("/app")
    }
  }

  // End demo mode
  const endDemoMode = () => {
    try {
      localStorage.removeItem("subterrain_demo_mode")
      setIsDemoMode(false)
      router.push("/")
    } catch (error) {
      console.error("Failed to end demo mode:", error)
      // Fallback - still try to navigate even if localStorage fails
      router.push("/")
    }
  }

  return (
    <DemoContext.Provider
      value={{
        isDemoMode,
        startDemoMode,
        endDemoMode,
      }}
    >
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo() {
  const context = useContext(DemoContext)
  if (context === undefined) {
    throw new Error("useDemo must be used within a DemoProvider")
  }
  return context
}
