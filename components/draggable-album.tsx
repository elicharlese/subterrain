"use client"

import { useDrag } from "react-dnd"
import { AlbumSleeve } from "@/components/album-sleeve"
import type { PlaylistTrack } from "@/contexts/playlist-context"
import { cn } from "@/lib/utils"

export const DRAG_TYPES = {
  ALBUM: "album",
}

interface DraggableAlbumProps {
  track: PlaylistTrack
  isPlaying: boolean
  isVerified: boolean
  genre: string
  onPlayToggle: () => void
  className?: string
}

export function DraggableAlbum({ track, isPlaying, isVerified, genre, onPlayToggle, className }: DraggableAlbumProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DRAG_TYPES.ALBUM,
    item: { track },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      className={cn(
        "cursor-grab active:cursor-grabbing transition-all",
        isDragging && "opacity-50 scale-95",
        className,
      )}
    >
      <AlbumSleeve
        image={track.image}
        title={track.title}
        isPlaying={isPlaying}
        isVerified={isVerified}
        genre={genre}
        onPlayToggle={onPlayToggle}
      />
    </div>
  )
}
