"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  FileMusic,
  Library,
  Upload,
  Home,
  Search,
  ListMusic,
  User,
  Settings,
  Heart,
  Plus,
  ChevronLeft,
  ChevronRight,
  Headphones,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { usePlaylists } from "@/contexts/playlist-context"
import { useUserProfile } from "@/contexts/user-profile-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// Add the SearchInput import at the top with the other imports
import { SearchInput } from "@/components/search-input"

export function Sidebar() {
  const pathname = usePathname()
  const { playlists } = usePlaylists()
  const { userProfile, isLoading } = useUserProfile()
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Load collapsed state from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar-collapsed")
      return saved ? JSON.parse(saved) : false
    }
    return false
  })

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed))
  }, [isCollapsed])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Add a search state after the other useState hooks
  const [searchQuery, setSearchQuery] = useState("")

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: <Home className="h-4 w-4" />,
      active: pathname === "/",
    },
    {
      href: "/search",
      label: "Search",
      icon: <Search className="h-4 w-4" />,
      active: pathname === "/search",
    },
    {
      href: "/discover",
      label: "Discover",
      icon: <Library className="h-4 w-4" />,
      active: pathname === "/discover",
    },
    {
      href: "/mint",
      label: "Mint NFT",
      icon: <Upload className="h-4 w-4" />,
      active: pathname === "/mint",
    },
    {
      href: "/my-music",
      label: "My Music",
      icon: <FileMusic className="h-4 w-4" />,
      active: pathname === "/my-music",
    },
    {
      href: "/library",
      label: "Library",
      icon: <Heart className="h-4 w-4" />,
      active: pathname === "/library",
    },
  ]

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          "flex h-full flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
          isCollapsed ? "w-16" : "w-60",
        )}
      >
        {/* Logo/app name */}
        <div className={cn("flex h-14 items-center px-4 transition-all duration-300 justify-center")}>
          {isCollapsed ? (
            <Headphones className="h-6 w-6 text-primary" />
          ) : (
            <div className="flex items-center gap-2">
              <Headphones className="h-6 w-6 text-primary" />
              <span className="font-heading font-semibold">Subterrain</span>
            </div>
          )}
        </div>

        {/* User profile section */}
        <div
          className={cn(
            "flex flex-col items-center p-4 pt-6 transition-all duration-300",
            isCollapsed ? "px-2" : "px-4",
          )}
        >
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/profile" className="group relative">
                  <Avatar className="h-10 w-10 border-2 border-primary/20 group-hover:border-primary/50 transition-all">
                    <AvatarImage src={userProfile?.avatarUrl || "/placeholder.svg"} alt={userProfile?.displayName} />
                    <AvatarFallback className="text-sm font-semibold">
                      {userProfile?.displayName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {userProfile?.isVerified && (
                    <Badge
                      variant="outline"
                      className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-0.5"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-2 w-2"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </Badge>
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{userProfile?.displayName}</p>
                <p className="text-xs text-muted-foreground">@{userProfile?.username}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <>
              <Link href="/profile" className="group relative">
                <Avatar className="h-16 w-16 border-2 border-primary/20 group-hover:border-primary/50 transition-all">
                  <AvatarImage src={userProfile?.avatarUrl || "/placeholder.svg"} alt={userProfile?.displayName} />
                  <AvatarFallback className="text-lg font-semibold">
                    {userProfile?.displayName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {userProfile?.isVerified && (
                  <Badge variant="outline" className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </Badge>
                )}
              </Link>
              <div className="mt-2 text-center">
                <Link href="/profile" className="hover:underline">
                  <h3 className="font-medium">{userProfile?.displayName}</h3>
                </Link>
                <p className="text-xs text-muted-foreground">@{userProfile?.username}</p>
              </div>
              <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
                <Link href="/profile/followers" className="hover:text-foreground">
                  <span className="font-semibold">{userProfile?.stats.followers}</span> Followers
                </Link>
                <Link href="/profile/following" className="hover:text-foreground">
                  <span className="font-semibold">{userProfile?.stats.following}</span> Following
                </Link>
              </div>
              <Link href="/profile/edit" className="mt-3 w-full">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Edit Profile
                </Button>
              </Link>
            </>
          )}
        </div>
        {/* Add the search input component after the profile section and before the Separator */}
        {/* Insert this code right after the profile section's closing </div> and before the <Separator className="my-2" /> */}

        {!isCollapsed && (
          <div className="mt-4 px-2">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery("")}
              placeholder="Search music..."
              className="w-full"
            />
          </div>
        )}

        <Separator className="my-2" />

        {/* Navigation */}
        <ScrollArea className="flex-1 px-2 [&_.scrollbar]:hidden">
          <div className="space-y-1 py-2 overflow-hidden">
            {routes.map((route) => (
              <Tooltip key={route.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={route.href}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      route.active ? "bg-accent text-accent-foreground" : "transparent",
                      isCollapsed ? "justify-center px-2" : "justify-start",
                    )}
                  >
                    <div className={cn(isCollapsed ? "mr-0" : "mr-2")}>{route.icon}</div>
                    {!isCollapsed && route.label}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">{route.label}</TooltipContent>}
              </Tooltip>
            ))}
          </div>

          <Separator className="my-2" />

          {/* Playlists */}
          <div className="py-2">
            <div className={cn("flex items-center py-2", isCollapsed ? "justify-center px-2" : "justify-between px-3")}>
              {!isCollapsed && <h2 className="text-sm font-semibold tracking-tight">Playlists</h2>}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className={cn("h-5 w-5", isCollapsed ? "" : "")}>
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Create playlist</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Create playlist</TooltipContent>
              </Tooltip>
            </div>

            <div className="space-y-1">
              {playlists.map((playlist) => (
                <Tooltip key={playlist.id}>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/playlist/${playlist.id}`}
                      className={cn(
                        "flex items-center rounded-md py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                        pathname === `/playlist/${playlist.id}` ? "bg-accent text-accent-foreground" : "transparent",
                        isCollapsed ? "justify-center px-2" : "px-3",
                      )}
                    >
                      <ListMusic className={cn("h-4 w-4", isCollapsed ? "" : "mr-2")} />
                      {!isCollapsed && playlist.name}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && <TooltipContent side="right">{playlist.name}</TooltipContent>}
                </Tooltip>
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* Footer links */}
        <div className="mt-auto p-4">
          <div
            className={cn("flex items-center", isCollapsed ? "justify-center space-y-2 flex-col" : "justify-between")}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/profile"
                  className={cn(
                    "flex items-center rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === "/profile" ? "bg-accent text-accent-foreground" : "transparent",
                    isCollapsed ? "justify-center p-2" : "px-3 py-2",
                  )}
                >
                  <User className={cn("h-4 w-4", isCollapsed ? "" : "mr-2")} />
                  {!isCollapsed && "Profile"}
                </Link>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">Profile</TooltipContent>}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/settings"
                  className={cn(
                    "flex items-center rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === "/settings" ? "bg-accent text-accent-foreground" : "transparent",
                    isCollapsed ? "justify-center p-2" : "px-3 py-2",
                  )}
                >
                  <Settings className={cn("h-4 w-4", isCollapsed ? "" : "mr-2")} />
                  {!isCollapsed && "Settings"}
                </Link>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">Settings</TooltipContent>}
            </Tooltip>
          </div>

          {/* Collapse/Expand button */}
          <div className="mt-4 flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full flex justify-center items-center"
                  onClick={toggleSidebar}
                >
                  {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  {!isCollapsed && <span className="ml-2">Collapse</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{isCollapsed ? "Expand sidebar" : "Collapse sidebar"}</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
