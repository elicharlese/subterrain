"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Library,
  ListMusic,
  MessageCircle,
  Music2,
  Radio,
  Search,
  Disc3,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { usePlaylists } from "@/contexts/playlist-context"
import { ApplePlayer } from "@/components/apple-player"
import { cn } from "@/lib/utils"

interface MusicAppLayoutProps {
  children: React.ReactNode
}

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export function MusicAppLayout({ children }: MusicAppLayoutProps) {
  const pathname = usePathname()
  const { playlists, currentTrack } = usePlaylists()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const hasFixedPlayer = !!currentTrack

  const mainNav: NavItem[] = [
    { label: "Search", href: "/search", icon: Search },
    { label: "Home", href: "/app", icon: Home },
    { label: "Discover", href: "/discover", icon: Radio },
    { label: "Library", href: "/library", icon: Library },
    { label: "My Music", href: "/my-music", icon: Music2 },
    { label: "Messages", href: "/messages", icon: MessageCircle },
    { label: "Profile", href: "/profile", icon: Music2 },
  ]

  const storeNav: NavItem[] = [{ label: "Mint NFT", href: "/mint", icon: Disc3 }]

  const playlistNav = playlists.slice(0, 12)

  const isActive = (href: string) => {
    if (href === "/app") {
      return pathname === "/app"
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <div className="h-screen flex bg-background text-foreground">
      {/* Glassmorphic sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col m-3 mr-0 rounded-3xl border border-white/10 bg-zinc-900/40 shadow-[0_0_35px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden transition-all duration-300",
          isCollapsed ? "w-20" : "w-64 lg:w-72",
        )}
      >
        <div className="px-3 pt-4 pb-3 flex items-center justify-between gap-2">
          <div className={cn("space-y-0.5", isCollapsed && "hidden")}>
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">SubTerrain</div>
            <div className="mt-1 text-lg font-semibold">Music</div>
          </div>
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800/70 text-zinc-300 hover:bg-zinc-700/80 hover:text-white transition-colors",
              isCollapsed ? "mx-auto" : "ml-auto",
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-hide px-2 pb-4 space-y-6 text-sm">
          <div className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 font-medium transition-colors",
                    isCollapsed ? "justify-center" : "justify-start",
                    active
                      ? "bg-zinc-100 text-zinc-900"
                      : "text-zinc-300 hover:bg-zinc-800/80 hover:text-white",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      active ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-100",
                    )}
                  />
                  <span className={cn("truncate", isCollapsed && "hidden")}>{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="space-y-2">
            <div className={cn("px-3 text-xs font-semibold uppercase tracking-wide text-zinc-500", isCollapsed && "hidden")}>
              Store
            </div>
            <div className="space-y-1">
              {storeNav.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 font-medium transition-colors",
                      isCollapsed ? "justify-center" : "justify-start",
                      active
                        ? "bg-zinc-100 text-zinc-900"
                        : "text-zinc-300 hover:bg-zinc-800/80 hover:text-white",
                    )}
                  >
                    <Icon className={cn("h-4 w-4", active ? "text-zinc-900" : "text-zinc-400")} />
                    <span className={cn("truncate", isCollapsed && "hidden")}>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {playlistNav.length > 0 && (
            <div className="space-y-2">
              <div
                className={cn(
                  "px-3 text-xs font-semibold uppercase tracking-wide text-zinc-500",
                  isCollapsed && "hidden",
                )}
              >
                Playlists
              </div>
              <div className="space-y-1">
                {playlistNav.map((playlist) => (
                  <Link
                    key={playlist.id}
                    href={`/playlist/${playlist.id}`}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800/80 hover:text-white",
                      isCollapsed ? "justify-center" : "justify-start",
                      pathname.startsWith(`/playlist/${playlist.id}`) && "bg-zinc-900 text-white",
                    )}
                  >
                    <ListMusic className="h-3.5 w-3.5 text-zinc-500" />
                    <span className={cn("truncate", isCollapsed && "hidden")}>{playlist.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>

        <div className="border-t border-zinc-800 px-3 py-3 text-xs text-zinc-500">
          <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
            <div className="flex items-center gap-2">
              <div className={cn("h-8 w-8 rounded-full bg-zinc-700", isCollapsed && "mx-auto")} />
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-zinc-100">Your Account</span>
                  <span className="text-[11px] text-zinc-400">Profile & settings</span>
                </div>
              )}
            </div>
            {!isCollapsed && <PlusCircle className="h-4 w-4 text-zinc-500" />}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <main
          className={cn(
            "flex-1 min-h-0 px-[15px] overflow-y-auto scrollbar-hide",
            hasFixedPlayer ? "pb-[120px]" : "pb-8",
          )}
        >
          {children}
        </main>
        {currentTrack && (
          <ApplePlayer
            audioUrl={currentTrack.audioUrl || ""}
            title={currentTrack.title}
            artist={currentTrack.artist}
            coverImage={currentTrack.coverImage || "/placeholder.svg"}
          />
        )}
        {/* Add a player or footer here if needed */}
      </div>
    </div>
  )
}
