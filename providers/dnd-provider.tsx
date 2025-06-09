"use client"

import type { ReactNode } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { TouchBackend } from "react-dnd-touch-backend"
import { isMobile } from "@/hooks/use-mobile"

export function DragAndDropProvider({ children }: { children: ReactNode }) {
  // Use TouchBackend for mobile devices and HTML5Backend for desktop
  const mobile = isMobile()
  const backend = mobile ? TouchBackend : HTML5Backend

  return <DndProvider backend={backend}>{children}</DndProvider>
}
