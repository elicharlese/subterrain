import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, Outfit } from "next/font/google"
import "./globals.css"
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
import { Suspense } from "react"

// Space Grotesk for headings - has a distinctive, slightly retro feel
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

// Outfit for body text - clean but with character
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

export const metadata: Metadata = {
  title: "SubTerrain - Music NFT Platform",
  description:
    "Musicians can enjoy the impact and support of the blockchain community by using NFTs to maintain their content in the metaverse.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${spaceGrotesk.variable} ${outfit.variable} font-sans min-h-screen bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <UserPreferencesProvider>
            <WalletProvider>
              <DragAndDropProvider>
                <DemoProvider>
                  <PlaylistProvider>
                    <UserProfileProvider>
                      <MessagingProvider>
                        <QueueProvider>
                          <SearchShortcutProvider>
                            <Suspense>{children}</Suspense>
                          </SearchShortcutProvider>
                        </QueueProvider>
                      </MessagingProvider>
                    </UserProfileProvider>
                  </PlaylistProvider>
                </DemoProvider>
              </DragAndDropProvider>
            </WalletProvider>
          </UserPreferencesProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
