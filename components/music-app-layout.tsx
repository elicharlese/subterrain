"use client"

import type React from "react"

interface MusicAppLayoutProps {
  children: React.ReactNode
}

export function MusicAppLayout({ children }: MusicAppLayoutProps) {
  return (
    <div className="h-screen flex flex-col">
      {/* Add a sidebar or header here if needed */}
      <main className="flex-1 overflow-auto">{children}</main>
      {/* Add a player or footer here if needed */}
    </div>
  )
}
