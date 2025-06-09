"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useWallet } from "@solana/wallet-adapter-react"
import { ModeToggle } from "@/components/mode-toggle"
import { PreferencesButton } from "@/components/preferences-button"
import { cn } from "@/lib/utils"
import { FileMusic, Library, Upload, Wallet, User, LogOut, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/contexts/auth-context"
import { useDemo } from "@/contexts/demo-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SiteHeader() {
  const pathname = usePathname()
  const { setVisible } = useWalletModal()
  const { connected, publicKey } = useWallet()
  const { user, isAuthenticated, logout } = useAuth()
  const { isDemoMode, endDemoMode } = useDemo()

  // Format wallet address for display
  const formattedAddress = publicKey ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}` : null

  const routes = [
    {
      href: "/app/discover",
      label: "Discover",
      icon: <Library className="mr-2 h-4 w-4" />,
      active: pathname === "/app/discover",
    },
    {
      href: "/app/mint",
      label: "Mint NFT",
      icon: <Upload className="mr-2 h-4 w-4" />,
      active: pathname === "/app/mint",
    },
    {
      href: "/app/my-music",
      label: "My Music",
      icon: <FileMusic className="mr-2 h-4 w-4" />,
      active: pathname === "/app/my-music",
    },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/app" className="flex items-center space-x-2">
            <FileMusic className="h-6 w-6" />
            <span className="inline-block font-heading font-bold tracking-widest text-lg">SUBTERRAIN</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mr-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center text-sm font-heading tracking-wide transition-colors hover:text-primary",
                  route.active ? "text-primary" : "text-muted-foreground",
                )}
              >
                {route.icon}
                {route.label}
              </Link>
            ))}
          </nav>

          {isDemoMode ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/abstract-geometric-shapes.png" alt="Demo User" />
                    <AvatarFallback className="bg-purple-700">DM</AvatarFallback>
                  </Avatar>
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-purple-500 border-2 border-background flex items-center justify-center">
                    <AlertCircle className="h-2 w-2 text-white" />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Demo User</p>
                    <p className="text-xs leading-none text-muted-foreground">You're in demo mode</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/app/preferences">
                    <User className="mr-2 h-4 w-4" />
                    Preferences
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/auth/signup">
                    <User className="mr-2 h-4 w-4" />
                    Create Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={endDemoMode}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Exit Demo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                    <AvatarFallback className="bg-purple-700">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || user?.walletAddress?.slice(0, 6) + "..." + user?.walletAddress?.slice(-4)}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/app/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/app/preferences">
                    <User className="mr-2 h-4 w-4" />
                    Preferences
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              {/* Custom wallet button with just an icon */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <Button variant="outline" size="icon" onClick={() => setVisible(true)} className="h-9 w-9">
                        <Wallet className={cn("h-4 w-4", connected && "text-purple-500")} />
                        <span className="sr-only">{connected ? "Wallet connected" : "Connect wallet"}</span>
                      </Button>

                      {/* Connection status indicator */}
                      {connected && (
                        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{connected ? `Connected: ${formattedAddress}` : "Connect wallet"}</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </>
          )}

          <PreferencesButton />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
