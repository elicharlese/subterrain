"use client"

import { useDrop } from "react-dnd"
import { DRAG_TYPES } from "@/components/draggable-album"
import { type PlaylistTrack, usePlaylists } from "@/contexts/playlist-context"
import { cn } from "@/lib/utils"
import { ListMusic, Plus } from "lucide-react"

interface PlaylistDropzoneProps {
  playlistId: string
  name: string
  trackCount: number
  isActive: boolean
  onClick: () => void
  className?: string
}

export function PlaylistDropzone({
  playlistId,
  name,
  trackCount,
  isActive,
  onClick,
  className,
}: PlaylistDropzoneProps) {
  const { addTrackToPlaylist } = usePlaylists()

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: DRAG_TYPES.ALBUM,
    drop: (item: { track: PlaylistTrack }) => {
      addTrackToPlaylist(playlistId, item.track)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }))

  return (
    <div
      ref={drop}
      onClick={onClick}
      className={cn(
        "p-3 rounded-md border transition-all cursor-pointer",
        isActive ? "bg-purple-900/20 border-purple-500" : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700",
        isOver && canDrop && "border-green-500 bg-green-900/20",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-md flex items-center justify-center",
            isActive ? "bg-purple-900/50" : "bg-zinc-800",
          )}
        >
          <ListMusic className={cn("h-5 w-5", isActive ? "text-purple-400" : "text-zinc-400")} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-medium text-sm truncate">{name}</h3>
          <p className="text-xs text-zinc-400">{trackCount} tracks</p>
        </div>
        {isOver && canDrop && (
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <Plus className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
    </div>
  )
}
