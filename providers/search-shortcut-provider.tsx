"use client"

import type { ReactNode } from "react"
import { useSearchShortcut } from "@/hooks/use-search-shortcut"

export function SearchShortcutProvider({ children }: { children: ReactNode }) {
  useSearchShortcut()
  return <>{children}</>
}
