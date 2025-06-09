"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { usePlaylists } from "@/contexts/playlist-context"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import {
  Home,
  Search,
  Library,
  ListMusic,
  Upload,
  Plus,
  FileMusic,
  Wallet,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react"

interface AppleMusicLayoutProps {
  children: React.ReactNode
}

export function AppleMusicLayout({ children }: AppleMusicLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { playlists, createPlaylist } = usePlaylists()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()

  // Format wallet address for display
  const formattedAddress = publicKey ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}` : null

  // Check if mobile on mount and on resize
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768
      setIsMobile(isMobileView)
      setShowSidebar(!isMobileView)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const mainNavItems = [
    { href: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
    { href: "/discover", label: "Discover", icon: <Search className="h-5 w-5" /> },
    { href: "/mint", label: "Mint NFT", icon: <Upload className="h-5 w-5" /> },
    { href: "/my-music", label: "My Music", icon: <FileMusic className="h-5 w-5" /> },
    { href: "/library", label: "Library", icon: <Library className="h-5 w-5" /> },
  ]

  const handleCreatePlaylist = () => {
    createPlaylist(`New Playlist ${playlists.length + 1}`)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      {/* Sidebar */}
      {showSidebar && (
        <div
          className={cn(
            "flex flex-col border-r border-zinc-800 bg-zinc-950 transition-all duration-300",
            sidebarCollapsed ? "w-16" : "w-60",
            isMobile && "absolute z-40 h-full",
          )}
        >
          {/* Sidebar header */}
          <div className="flex h-14 items-center justify-between px-4 py-2">
            <div className="flex items-center">
              <FileMusic className="h-6 w-6 text-purple-500" />
              {!sidebarCollapsed && (
                <span className="ml-2 font-heading font-bold tracking-widest text-lg">SUBTERRAIN</span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="px-3 py-2">
              <div className="space-y-1">
                {mainNavItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start",
                        pathname === item.href
                          ? "bg-zinc-800 text-white"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-900",
                        sidebarCollapsed ? "px-3" : "px-3",
                      )}
                    >
                      {item.icon}
                      {!sidebarCollapsed && <span className="ml-3">{item.label}</span>}
                    </Button>
                  </Link>
                ))}
              </div>

              <Separator className="my-4 bg-zinc-800" />

              {/* Wallet section */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  {!sidebarCollapsed && <h2 className="text-xs font-semibold uppercase text-zinc-500">Wallet</h2>}
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8", connected && "text-purple-500")}
                    onClick={() => setVisible(true)}
                  >
                    <Wallet className="h-5 w-5" />
                    {connected && (
                      <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500 border border-background" />
                    )}
                  </Button>
                </div>
                {!sidebarCollapsed && connected && formattedAddress && (
                  <div className="text-xs text-zinc-400 px-3">{formattedAddress}</div>
                )}
              </div>

              <Separator className="my-4 bg-zinc-800" />

              {/* Library section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  {!sidebarCollapsed && <h2 className="text-xs font-semibold uppercase text-zinc-500">Playlists</h2>}
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCreatePlaylist}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-1">
                  {!sidebarCollapsed && (
                    <div className="space-y-1">
                      {playlists.map((playlist) => (
                        <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start h-8 text-zinc-400 hover:text-white hover:bg-zinc-900 px-3",
                              pathname === `/playlist/${playlist.id}` && "bg-zinc-800 text-white",
                            )}
                          >
                            <ListMusic className="h-4 w-4 mr-3 flex-shrink-0" />
                            <span className="truncate">{playlist.name}</span>
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-zinc-800 px-4">
          {/* Left side - Mobile menu toggle */}
          {isMobile ? (
            <Button variant="ghost" size="icon" onClick={() => setShowSidebar(!showSidebar)}>
              <ListMusic className="h-5 w-5" />
            </Button>
          ) : (
            <div className="w-8\"></div> {/* Spacer */}
          )}

          {/* Center - Logo (mobile only) */}
          {isMobile && (
            <div className="flex items-center">
              <FileMusic className="h-6 w-6 text-purple-500" />le-500" />
              <span className="ml-2 font-heading font-bold tracking-widest text-lg">SUBTERRAIN</span>
            </div>
          )}

          {/* Right side - Search button */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => router.push("/search")}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-auto bg-gradient-to-b from-zinc-900 to-black">{children}</div>
      </div>
    </div>
  )
}
