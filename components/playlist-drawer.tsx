"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { PlaylistPanel } from "@/components/playlist-panel"
import { ListMusic } from "lucide-react"
import type { PlaylistTrack } from "@/contexts/playlist-context"
import { cn } from "@/lib/utils"

interface PlaylistDrawerProps {
  onPlayTrack: (track: PlaylistTrack) => void
  currentlyPlayingId?: number | null
  className?: string
}

export function PlaylistDrawer({ onPlayTrack, currentlyPlayingId, className }: PlaylistDrawerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className={cn("gap-2", className)}>
          <ListMusic className="h-4 w-4" />
          Playlists
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[350px] sm:w-[450px] p-0">
        <PlaylistPanel
          onPlayTrack={(track) => {
            onPlayTrack(track)
            setOpen(false)
          }}
          currentlyPlayingId={currentlyPlayingId}
        />
      </SheetContent>
    </Sheet>
  )
}
