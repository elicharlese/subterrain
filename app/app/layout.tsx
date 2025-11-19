import type { ReactNode } from "react"
import { MusicAppLayout } from "@/components/music-app-layout"
import { ProtectedRoute } from "@/components/protected-route"

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <MusicAppLayout>{children}</MusicAppLayout>
    </ProtectedRoute>
  )
}
