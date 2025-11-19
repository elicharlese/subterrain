"use client"

import { useState } from "react"
import Image from "next/image"
import { Play, Pause, MoreHorizontal, Heart, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { GenreBadge } from "@/components/genre-badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePlaylists } from "@/contexts/playlist-context"

const parseDurationToSeconds = (duration: string): number => {
  const [minutesStr, secondsStr] = duration.split(":")
  const minutes = Number(minutesStr)
  const seconds = Number(secondsStr)

  if (Number.isNaN(minutes) || Number.isNaN(seconds)) {
    return 0
  }

  return minutes * 60 + seconds
}

interface LibraryListProps {
  tracks?: {
    id: number
    title: string
    artist: string
    image: string
    duration: string
    created: string
    audioUrl: string
    plays: number
    genre: string
    isVerified: boolean
  }[]
  currentlyPlayingId?: number | null
  onPlayToggle?: (id: number) => void
  showAlbumOnly?: boolean
}

export function LibraryList({ tracks = [], currentlyPlayingId = null, onPlayToggle, showAlbumOnly = false }: LibraryListProps) {
  const [likedTracks, setLikedTracks] = useState<number[]>([])
  const { playlists, addTrackToPlaylist } = usePlaylists()

  const toggleLike = (id: number) => {
    if (likedTracks.includes(id)) {
      setLikedTracks(likedTracks.filter((trackId) => trackId !== id))
    } else {
      setLikedTracks([...likedTracks, id])
    }
  }

  const handleAddToPlaylist = (playlistId: string, track: any) => {
    addTrackToPlaylist(playlistId, {
      id: String(track.id),
      title: track.title,
      artist: track.artist,
      duration: parseDurationToSeconds(track.duration),
      audioUrl: track.audioUrl,
      provider: "apple",
      providerId: String(track.id),
      coverImage: track.image,
    })
  }

  return (
    <div className="w-full">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-xs text-zinc-400 border-b border-zinc-800">
            <th className="pb-2 font-normal w-8">#</th>
            <th className="pb-2 font-normal">TITLE</th>
            {!showAlbumOnly && <th className="pb-2 font-normal">ARTIST</th>}
            <th className="pb-2 font-normal">GENRE</th>
            <th className="pb-2 font-normal text-right">PLAYS</th>
            <th className="pb-2 font-normal text-right">TIME</th>
            <th className="pb-2 font-normal w-10"></th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track, index) => (
            <tr
              key={track.id}
              className={cn(
                "border-b border-zinc-800/50 hover:bg-zinc-800/30 group",
                currentlyPlayingId === track.id && "bg-zinc-800/50",
              )}
            >
              <td className="py-3 pl-2">
                <div className="flex items-center justify-center w-6 h-6">
                  <span className="text-zinc-400 group-hover:hidden">{index + 1}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hidden group-hover:flex items-center justify-center p-0"
                    onClick={() => onPlayToggle?.(track.id)}
                  >
                    {currentlyPlayingId === track.id ? (
                      <Pause className="h-3.5 w-3.5 text-white" />
                    ) : (
                      <Play className="h-3.5 w-3.5 text-white" />
                    )}
                  </Button>
                </div>
              </td>
              <td className="py-3">
                <div className="flex items-center">
                  <div className="relative h-10 w-10 rounded overflow-hidden mr-3">
                    <Image src={track.image || "/placeholder.svg"} alt={track.title} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{track.title}</div>
                    <div className="text-xs text-zinc-400">
                      {formatDistanceToNow(new Date(track.created), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </td>
              {!showAlbumOnly && (
                <td className="py-3">
                  <div className="flex items-center">
                    <span className="text-sm">{track.artist}</span>
                    {track.isVerified && (
                      <Badge variant="outline" className="ml-2 bg-purple-500/20 text-purple-300 border-purple-500/30">
                        Verified
                      </Badge>
                    )}
                  </div>
                </td>
              )}
              <td className="py-3">
                <GenreBadge genre={track.genre} />
              </td>
              <td className="py-3 text-right text-zinc-400 text-sm">{track.plays.toLocaleString()}</td>
              <td className="py-3 text-right text-zinc-400 text-sm">{track.duration}</td>
              <td className="py-3 text-right">
                <div className="flex items-center justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100"
                    onClick={() => toggleLike(track.id)}
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4",
                        likedTracks.includes(track.id) ? "fill-red-500 text-red-500" : "text-zinc-400",
                      )}
                    />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={() => onPlayToggle?.(track.id)}>
                        <Play className="h-4 w-4 mr-2" />
                        Play
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Heart className="h-4 w-4 mr-2" />
                        {likedTracks.includes(track.id) ? "Remove from Liked" : "Add to Liked"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="p-0">
                        <div className="w-full px-2 py-1.5">
                          <p className="text-sm font-medium mb-1">Add to Playlist</p>
                          <div className="max-h-40 overflow-y-auto">
                            {playlists.length === 0 ? (
                              <p className="text-xs text-zinc-500 py-1">No playlists available</p>
                            ) : (
                              playlists.map((playlist) => (
                                <button
                                  key={playlist.id}
                                  className="w-full text-left text-sm py-1 px-2 hover:bg-zinc-800 rounded-sm flex items-center"
                                  onClick={() => handleAddToPlaylist(playlist.id, track)}
                                >
                                  <Plus className="h-3.5 w-3.5 mr-2" />
                                  {playlist.name}
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
