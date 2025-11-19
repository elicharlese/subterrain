"use client"

import { useState, useRef, useEffect } from "react"
import YouTube from "react-youtube"
import { Button } from "@/components/ui/button"
import { VolumeIcon, Volume2, VolumeX, Play, Pause, SkipBack, SkipForward, Repeat, Shuffle } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Track } from "@/types/music-providers"

interface YouTubePlayerProps {
  track: Track
  onNext?: () => void
  onPrevious?: () => void
}

export function YouTubePlayer({ track, onNext, onPrevious }: YouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(75)
  const [isMuted, setIsMuted] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  const playerRef = useRef<any>(null)

  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
    },
  }

  const onReady = (event: any) => {
    playerRef.current = event.target
    setDuration(event.target.getDuration())
  }

  const onStateChange = (event: any) => {
    const state = event.data
    if (state === 1) { // Playing
      setIsPlaying(true)
    } else if (state === 2) { // Paused
      setIsPlaying(false)
    } else if (state === 0) { // Ended
      if (isRepeat) {
        playerRef.current?.seekTo(0)
        playerRef.current?.playVideo()
      } else {
        setIsPlaying(false)
        onNext?.()
      }
    }
  }

  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo()
      } else {
        playerRef.current.playVideo()
      }
    }
  }

  const toggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute()
        setIsMuted(false)
      } else {
        playerRef.current.mute()
        setIsMuted(true)
      }
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume)
    }
  }

  // Update current time periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && isPlaying) {
        setCurrentTime(playerRef.current.getCurrentTime())
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [isPlaying])

  // Format time in MM:SS
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 w-full bg-zinc-900/90 backdrop-blur-md p-4 border-t border-zinc-800 shadow-lg">
      {/* Hidden YouTube Player */}
      <div className="hidden">
        <YouTube
          videoId={track.providerId}
          opts={opts}
          onReady={onReady}
          onStateChange={onStateChange}
        />
      </div>

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
            className={cn("h-8 w-8 text-zinc-400 hover:text-white", isShuffle && "text-red-500")}
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
            className={cn("h-8 w-8 text-zinc-400 hover:text-white", isRepeat && "text-red-500")}
            onClick={() => setIsRepeat(!isRepeat)}
          >
            <Repeat className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center w-full gap-2">
          <div className="text-xs text-zinc-400 w-10 text-right">{formatTime(currentTime)}</div>
          <div className="flex-1 bg-zinc-700 rounded-full h-1">
            <div
              className="bg-red-500 h-1 rounded-full"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          <div className="text-xs text-zinc-400 w-10">{formatTime(duration)}</div>
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
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
          className="w-24 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>
    </div>
  )
}