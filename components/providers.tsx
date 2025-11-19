"use client"

import { type ReactNode, useEffect, useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { PlaylistProvider } from "@/contexts/playlist-context"
import { WalletProvider } from "@/providers/wallet-provider"
import { DragAndDropProvider } from "@/providers/dnd-provider"
import { SearchShortcutProvider } from "@/providers/search-shortcut-provider"
import { UserProfileProvider } from "@/contexts/user-profile-context"
import { QueueProvider } from "@/contexts/queue-context"
import { MessagingProvider } from "@/contexts/messaging-context"
import { DemoProvider } from "@/contexts/demo-context"
import { UserPreferencesProvider } from "@/contexts/user-preferences-context"
import { AuthProvider } from "@/contexts/auth-context"
import { SharingProvider } from "@/contexts/sharing-context"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent rendering on server side to avoid context errors during prerendering
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <UserPreferencesProvider>
        <DemoProvider>
          <AuthProvider>
            <WalletProvider>
              <DragAndDropProvider>
                <PlaylistProvider>
                  <UserProfileProvider>
                    <MessagingProvider>
                      <QueueProvider>
                        <SharingProvider>
                          <SearchShortcutProvider>
                            {children}
                          </SearchShortcutProvider>
                        </SharingProvider>
                      </QueueProvider>
                    </MessagingProvider>
                  </UserProfileProvider>
                </PlaylistProvider>
              </DragAndDropProvider>
            </WalletProvider>
          </AuthProvider>
        </DemoProvider>
      </UserPreferencesProvider>
    </ThemeProvider>
  )
}