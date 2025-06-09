"use client"

import { useState } from "react"
import Image from "next/image"
import { Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useDrag } from "react-dnd"
import { DRAG_TYPES } from "@/components/draggable-album"
import type { PlaylistTrack } from "@/contexts/playlist-context"

interface AlbumGridItemProps {
  id: number
  title: string
  artist: string
  image: string
  isPlaying: boolean
  isVerified?: boolean
  onPlayToggle: () => void
  audioUrl: string
  className?: string
}

export function AlbumGridItem({
  id,
  title,
  artist,
  image,
  isPlaying,
  isVerified,
  onPlayToggle,
  audioUrl,
  className,
}: AlbumGridItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Convert to PlaylistTrack format for drag and drop
  const track: PlaylistTrack = {
    id,
    title,
    artist,
    image,
    duration: "", // We don't have this info in the grid view
    audioUrl,
  }

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
      className={cn("flex flex-col cursor-grab active:cursor-grabbing", isDragging && "opacity-50", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square rounded-md overflow-hidden mb-2 group">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className={cn("object-cover transition-all duration-300", isHovered && "scale-105")}
        />
        {(isHovered || isPlaying) && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onPlayToggle()
              }}
              size="icon"
              className={cn(
                "h-12 w-12 rounded-full transition-all duration-300",
                isPlaying
                  ? "bg-white text-black hover:bg-white/90 hover:text-black"
                  : "bg-white text-black hover:bg-white/90",
              )}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
            </Button>
          </div>
        )}
      </div>
      <Link href={`/discover/${id}`}>
        <h3 className="font-medium text-sm truncate hover:text-purple-400 transition-colors">{title}</h3>
      </Link>
      <p className="text-xs text-zinc-400 truncate">{artist}</p>
    </div>
  )
}

interface AlbumGridProps {
  albums: {
    id: number
    title: string
    artist: string
    image: string
    audioUrl: string
    isVerified?: boolean
  }[]
  currentlyPlayingId: number | null
  onPlayToggle: (id: number) => void
  title?: string
  className?: string
}

export function AlbumGrid({ albums, currentlyPlayingId, onPlayToggle, title, className }: AlbumGridProps) {
  return (
    <div className={className}>
      {title && <h2 className="text-2xl font-heading font-bold mb-4">{title}</h2>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {albums.map((album) => (
          <AlbumGridItem
            key={album.id}
            id={album.id}
            title={album.title}
            artist={album.artist}
            image={album.image}
            isPlaying={currentlyPlayingId === album.id}
            isVerified={album.isVerified}
            onPlayToggle={() => onPlayToggle(album.id)}
            audioUrl={album.audioUrl}
          />
        ))}
      </div>
    </div>
  )
}
