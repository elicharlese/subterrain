"use client"

import { useState, useRef, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { VolumeIcon, Volume2, VolumeX, Play, Pause, SkipBack, SkipForward, Repeat, Shuffle } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ApplePlayerProps {
  audioUrl: string
  title: string
  artist: string
  coverImage: string
}

export function ApplePlayer({ audioUrl, title, artist, coverImage }: ApplePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState([75])
  const [isMuted, setIsMuted] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const prevVolume = useRef(volume)

  useEffect(() => {
    const audio = audioRef.current

    const setAudioData = () => {
      if (audio) {
        setDuration(audio.duration)
      }
    }

    const setAudioTime = () => {
      if (audio) {
        setCurrentTime(audio.currentTime)
      }
    }

    const handleEnded = () => {
      if (isRepeat && audio) {
        audio.currentTime = 0
        audio.play()
      } else {
        setIsPlaying(false)
        setCurrentTime(0)
      }
    }

    // Add event listeners
    if (audio) {
      audio.addEventListener("loadeddata", setAudioData)
      audio.addEventListener("timeupdate", setAudioTime)
      audio.addEventListener("ended", handleEnded)
    }

    // Clean up event listeners
    return () => {
      if (audio) {
        audio.removeEventListener("loadeddata", setAudioData)
        audio.removeEventListener("timeupdate", setAudioTime)
        audio.removeEventListener("ended", handleEnded)
      }
    }
  }, [isRepeat])

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100
    }
  }, [volume])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        setVolume(prevVolume.current)
        audioRef.current.volume = prevVolume.current[0] / 100
      } else {
        prevVolume.current = volume
        setVolume([0])
        audioRef.current.volume = 0
      }
      setIsMuted(!isMuted)
    }
  }

  const handleTimeChange = (newValue: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newValue[0]
      setCurrentTime(newValue[0])
    }
  }

  // Format time in MM:SS
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 w-full bg-zinc-900/90 backdrop-blur-md p-4 border-t border-zinc-800 shadow-lg">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Now playing info */}
      <div className="flex items-center w-1/4 min-w-[200px]">
        <div className="relative h-14 w-14 rounded-md overflow-hidden mr-3 flex-shrink-0">
          <Image src={coverImage || "/placeholder.svg"} alt={title} fill className="object-cover" />
        </div>
        <div className="min-w-0">
          <div className="font-medium text-sm truncate">{title}</div>
          <div className="text-xs text-zinc-400 truncate">{artist}</div>
        </div>
      </div>

      {/* Player controls */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-1">
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8 text-zinc-400 hover:text-white", isShuffle && "text-purple-500")}
            onClick={() => setIsShuffle(!isShuffle)}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
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
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
            <SkipForward className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8 text-zinc-400 hover:text-white", isRepeat && "text-purple-500")}
            onClick={() => setIsRepeat(!isRepeat)}
          >
            <Repeat className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center w-full gap-2">
          <div className="text-xs text-zinc-400 w-10 text-right">{formatTime(currentTime)}</div>
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={(newValue) => handleTimeChange(newValue)}
            className="cursor-pointer flex-1"
          />
          <div className="text-xs text-zinc-400 w-10">{formatTime(duration)}</div>
        </div>
      </div>

      {/* Volume controls */}
      <div className="flex items-center gap-2 w-1/4 justify-end">
        <Button onClick={toggleMute} variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
          {isMuted || volume[0] === 0 ? (
            <VolumeX className="h-4 w-4" />
          ) : volume[0] < 50 ? (
            <VolumeIcon className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        <Slider value={volume} min={0} max={100} step={1} onValueChange={setVolume} className="w-24 cursor-pointer" />
      </div>
    </div>
  )
}
