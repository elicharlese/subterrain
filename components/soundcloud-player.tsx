"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { VolumeIcon, Volume2, VolumeX, Play, Pause, SkipBack, SkipForward, Repeat, Shuffle } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Track } from "@/types/music-providers"

interface SoundCloudPlayerProps {
  track: Track
  onNext?: () => void
  onPrevious?: () => void
}

export function SoundCloudPlayer({ track, onNext, onPrevious }: SoundCloudPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(75)
  const [isMuted, setIsMuted] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)

  // SoundCloud embed URL
  const soundCloudEmbedUrl = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${track.providerId}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`

  const togglePlay = () => {
    // In a real implementation, this would control the SoundCloud player via API
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    // In a real implementation, this would control SoundCloud player volume
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 w-full bg-zinc-900/90 backdrop-blur-md p-4 border-t border-zinc-800 shadow-lg">
      {/* SoundCloud Embed Player (hidden but functional) */}
      <iframe
        src={soundCloudEmbedUrl}
        width="0"
        height="0"
        frameBorder="0"
        allow="autoplay"
        loading="lazy"
        className="hidden"
      />

      {/* Now playing info */}
      <div className="flex items-center w-1/4 min-w-[200px]">
        <div className="relative h-14 w-14 rounded-md overflow-hidden mr-3 flex-shrink-0">
          <Image src={track.coverImage || "/placeholder.svg"} alt={track.title} fill className="object-cover" />
        </div>
        <div className="min-w-0">
          <div className="font-medium text-sm truncate">{track.title}</div>
          <div className="text-xs text-zinc-400 truncate">{track.artist}</div>
        </div>
      </div>

      {/* Player controls */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-1">
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8 text-zinc-400 hover:text-white", isShuffle && "text-orange-500")}
            onClick={() => setIsShuffle(!isShuffle)}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400 hover:text-white"
            onClick={onPrevious}
          >
            <SkipBack className="h-5 w-5" />
          </Button>
          <Button
            onClick={togglePlay}
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full bg-white text-black hover:bg-zinc-200 hover:text-black"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400 hover:text-white"
            onClick={onNext}
          >
            <SkipForward className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8 text-zinc-400 hover:text-white", isRepeat && "text-orange-500")}
            onClick={() => setIsRepeat(!isRepeat)}
          >
            <Repeat className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-xs text-zinc-400">
          SoundCloud Player - Full integration requires SoundCloud API access
        </div>
      </div>

      {/* Volume controls */}
      <div className="flex items-center gap-2 w-1/4 justify-end">
        <Button onClick={toggleMute} variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
          {isMuted || volume === 0 ? (
            <VolumeX className="h-4 w-4" />
          ) : volume < 50 ? (
            <VolumeIcon className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-24 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>
    </div>
  )
}