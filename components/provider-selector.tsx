"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Music, Headphones, Youtube, Waves, Radio } from "lucide-react"
import { MusicProvider } from "@/types/music-providers"
import { cn } from "@/lib/utils"

interface ProviderSelectorProps {
  currentProvider: MusicProvider
  onProviderChange: (provider: MusicProvider) => void
}

const providers = [
  {
    id: 'apple' as MusicProvider,
    name: 'Apple Music',
    icon: Headphones,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    description: 'Stream from Apple Music library'
  },
  {
    id: 'spotify' as MusicProvider,
    name: 'Spotify',
    icon: Music,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: 'Stream from Spotify catalog'
  },
  {
    id: 'youtube' as MusicProvider,
    name: 'YouTube',
    icon: Youtube,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    description: 'Play from YouTube videos'
  },
  {
    id: 'tidal' as MusicProvider,
    name: 'Tidal',
    icon: Waves,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: 'High-fidelity streaming'
  },
  {
    id: 'soundcloud' as MusicProvider,
    name: 'SoundCloud',
    icon: Radio,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    description: 'Discover new music and artists'
  }
]

export function ProviderSelector({ currentProvider, onProviderChange }: ProviderSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const currentProviderData = providers.find(p => p.id === currentProvider)

  const handleProviderSelect = (provider: MusicProvider) => {
    onProviderChange(provider)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {currentProviderData && (
            <>
              <currentProviderData.icon className={cn("h-4 w-4", currentProviderData.color)} />
              <span className="hidden sm:inline">{currentProviderData.name}</span>
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Music Provider</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          {providers.map((provider) => {
            const Icon = provider.icon
            const isSelected = provider.id === currentProvider

            return (
              <Button
                key={provider.id}
                variant={isSelected ? "default" : "ghost"}
                className={cn(
                  "flex items-center justify-start gap-3 h-auto p-4",
                  isSelected && "bg-primary text-primary-foreground"
                )}
                onClick={() => handleProviderSelect(provider.id)}
              >
                <div className={cn(
                  "p-2 rounded-lg",
                  isSelected ? "bg-primary-foreground/20" : provider.bgColor
                )}>
                  <Icon className={cn(
                    "h-5 w-5",
                    isSelected ? "text-primary-foreground" : provider.color
                  )} />
                </div>
                <div className="text-left">
                  <div className="font-medium">{provider.name}</div>
                  <div className={cn(
                    "text-sm",
                    isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {provider.description}
                  </div>
                </div>
              </Button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}