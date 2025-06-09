import type { ReactNode } from "react"
import MusicAppLayout from "@/components/music-app-layout"
import { DemoProvider } from "@/contexts/demo-context"
import { QueueProvider } from "@/contexts/queue-context"
import { AuthProvider } from "@/contexts/auth-context"
import { UserProfileProvider } from "@/contexts/user-profile-context"
import { MessagingProvider } from "@/contexts/messaging-context"
import { ProtectedRoute } from "@/components/protected-route"

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <DemoProvider>
      <AuthProvider>
        <UserProfileProvider>
          <MessagingProvider>
            <QueueProvider>
              <ProtectedRoute>
                <MusicAppLayout>{children}</MusicAppLayout>
              </ProtectedRoute>
            </QueueProvider>
          </MessagingProvider>
        </UserProfileProvider>
      </AuthProvider>
    </DemoProvider>
  )
}
