"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Share2, Tag, Volume2, BadgeCheck } from "lucide-react"
import Link from "next/link"
import { DraggableAlbum } from "@/components/draggable-album"
import type { PlaylistTrack } from "@/contexts/playlist-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface MusicCardProps {
  music: {
    id: number
    title: string
    artist: string
    image: string
    duration: string
    price: string
    isVerified: boolean
    genre: string
    likes: number
    plays: number
    releaseDate: string
    audioUrl: string
  }
  isPlaying: boolean
  isLiked: boolean
  onPlayToggle: () => void
  onLikeToggle: () => void
}

export function MusicCard({ music, isPlaying, isLiked, onPlayToggle, onLikeToggle }: MusicCardProps) {
  // Convert music to PlaylistTrack format
  const track: PlaylistTrack = {
    id: music.id,
    title: music.title,
    artist: music.artist,
    image: music.image,
    duration: music.duration,
    audioUrl: music.audioUrl,
  }

  return (
    <Card className="overflow-visible hover:border-purple-500/50 transition-all duration-300 group p-0">
      <div className="p-4 pt-6 pb-0">
        <DraggableAlbum
          track={track}
          isPlaying={isPlaying}
          isVerified={music.isVerified}
          genre={music.genre}
          onPlayToggle={onPlayToggle}
        />
      </div>

      <CardContent className="p-4 pt-6 mt-2">
        <div className="flex justify-between items-start mb-2">
          <div>
            <Link href={`/discover/${music.id}`}>
              <h3 className="font-heading font-semibold text-lg truncate group-hover:text-purple-400 transition-colors album-title">
                {music.title}
              </h3>
            </Link>
            <div className="flex items-center gap-1">
              <span className="text-zinc-400 text-sm font-body artist-name">{music.artist}</span>
              {music.isVerified && <BadgeCheck className="h-3.5 w-3.5 text-purple-500" />}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-heading font-semibold">{music.price}</div>
            <div className="text-zinc-500 text-xs font-body">{music.duration}</div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-3 border-t border-zinc-800">
          <div className="flex items-center gap-1 text-xs text-zinc-400 font-body">
            <Volume2 className="h-3 w-3" />
            <span>{music.plays.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onLikeToggle()
              }}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
            </Button>

            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Share2 className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Tag className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-body">View Details</DropdownMenuItem>
                <DropdownMenuItem className="font-body">View on Explorer</DropdownMenuItem>
                <DropdownMenuItem className="font-body">Add to Playlist</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
