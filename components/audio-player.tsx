"use client"

import { useState, useRef, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ListMusic,
  SkipForward,
  SkipBack,
  Minimize2,
  Maximize2,
  GripHorizontal,
} from "lucide-react"
import { QueueDrawer } from "./queue-drawer"
import { useQueue } from "@/contexts/queue-context"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useDraggable } from "@/hooks/use-draggable"

interface AudioPlayerProps {
  audioUrl: string
  title: string
  artist?: string
  image?: string
  topBarMode?: boolean
}

interface PlayerState {
  position: { x: number; y: number }
  isMiniMode: boolean
  isFloating: boolean
  volume: number[]
}

const PLAYER_STATE_KEY = "subterrain-player-state"

export function AudioPlayer({
  audioUrl,
  title,
  artist,
  image = "/abstract-music-album.png",
  topBarMode = false,
}: AudioPlayerProps) {
  // Initialize state with default values
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState([75])
  const [isMuted, setIsMuted] = useState(false)
  const [isQueueOpen, setIsQueueOpen] = useState(false)
  const [isMiniMode, setIsMiniMode] = useState(topBarMode)
  const [isFloating, setIsFloating] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)

  const { currentTrack, nextTrack, previousTrack, queue } = useQueue()

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const prevVolume = useRef(volume)

  // Load saved player state from localStorage on mount
  useEffect(() => {
    const loadPlayerState = () => {
      try {
        const savedState = localStorage.getItem(PLAYER_STATE_KEY)
        if (savedState) {
          const parsedState: PlayerState = JSON.parse(savedState)

          // Set position
          setPosition(parsedState.position)

          // Set player mode if not in top bar mode
          if (!topBarMode) {
            setIsMiniMode(parsedState.isMiniMode)
            setIsFloating(parsedState.isFloating)
          }

          // Set volume if available
          if (parsedState.volume) {
            setVolume(parsedState.volume)
          }
        }

        // Mark as initialized after loading state
        setIsInitialized(true)
      } catch (error) {
        console.error("Error loading player state:", error)
        setIsInitialized(true)
      }
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(loadPlayerState, 100)
    return () => clearTimeout(timer)
  }, [topBarMode])

  // Save player state to localStorage when it changes
  const savePlayerState = () => {
    if (!isInitialized) return

    try {
      const stateToSave: PlayerState = {
        position,
        isMiniMode,
        isFloating,
        volume,
      }

      localStorage.setItem(PLAYER_STATE_KEY, JSON.stringify(stateToSave))
    } catch (error) {
      console.error("Error saving player state:", error)
    }
  }

  // Initialize draggable functionality
  const { position, isDragging, setPosition } = useDraggable(playerRef, {
    initialPosition: { x: 20, y: 20 },
    bounds: {
      top: 20,
      left: 20,
    },
    onDragEnd: (newPosition) => {
      // Save position after dragging ends
      savePlayerState()
    },
  })

  // Save state when relevant properties change
  useEffect(() => {
    if (isInitialized && !topBarMode) {
      savePlayerState()
    }
  }, [position, isMiniMode, isFloating, volume, isInitialized, topBarMode])

  // Calculate window bounds
  useEffect(() => {
    const updateBounds = () => {
      if (playerRef.current && isFloating) {
        const rect = playerRef.current.getBoundingClientRect()
        const maxX = window.innerWidth - rect.width - 20
        const maxY = window.innerHeight - rect.height - 20

        // Ensure player stays within viewport
        if (position.x > maxX) {
          setPosition({ ...position, x: maxX })
        }
        if (position.y > maxY) {
          setPosition({ ...position, y: maxY })
        }
      }
    }

    window.addEventListener("resize", updateBounds)
    updateBounds()

    return () => {
      window.removeEventListener("resize", updateBounds)
    }
  }, [isFloating, position, setPosition])

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
      setIsPlaying(false)
      setCurrentTime(0)
      // Play next track in queue when current track ends
      nextTrack()
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
  }, [audioRef, nextTrack])

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

  // Calculate progress percentage for mini player
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  // Toggle between mini mode and floating mode
  const toggleFloatingMode = () => {
    if (!isMiniMode) {
      setIsMiniMode(true)
      setIsFloating(true)
    } else {
      setIsFloating(!isFloating)
      // If going from floating to dock, reset position
      if (isFloating) {
        setPosition({ x: 20, y: 20 })
      }
    }
  }

  // Handle going back to full mode
  const handleMaximize = () => {
    setIsMiniMode(false)
    setIsFloating(false)
  }

  // If in top bar mode, render a simplified player
  if (topBarMode) {
    return (
      <>
        <div className="flex items-center h-full">
          <audio ref={audioRef} src={audioUrl} preload="metadata" />

          {/* Album Art */}
          <div className="relative h-8 w-8 rounded overflow-hidden mr-2 flex-shrink-0">
            <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
          </div>

          {/* Controls */}
          <div className="flex items-center mr-2">
            <Button onClick={togglePlay} variant="ghost" size="icon" className="h-7 w-7 text-foreground">
              {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 ml-0.5" />}
            </Button>
          </div>

          {/* Track Info */}
          <div className="flex-grow min-w-0 mr-2">
            <div className="font-medium text-xs truncate">{title}</div>
            {artist && <div className="text-[10px] text-muted-foreground truncate">{artist}</div>}
          </div>

          {/* Additional Controls */}
          <div className="flex items-center">
            <Button
              onClick={() => setIsQueueOpen(true)}
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground relative"
            >
              <ListMusic className="h-3 w-3" />
              {queue.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[8px] rounded-full h-3 w-3 flex items-center justify-center">
                  {queue.length}
                </span>
              )}
            </Button>

            <div className="relative">
              <Button
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
              >
                {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
              </Button>

              {showVolumeSlider && (
                <div className="absolute bottom-full left-0 mb-2 p-2 bg-background border rounded-md shadow-md w-32">
                  <Slider
                    value={volume}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={setVolume}
                    className="cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 h-[2px] bg-primary" style={{ width: `${progressPercentage}%` }} />
        </div>

        <QueueDrawer open={isQueueOpen} onOpenChange={setIsQueueOpen} />
      </>
    )
  }

  return (
    <>
      <div
        ref={playerRef}
        style={
          isFloating && isMiniMode
            ? {
                position: "fixed",
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: "none",
                width: "auto",
                margin: 0,
              }
            : undefined
        }
        className={cn(
          "z-50 transition-all duration-300 ease-in-out",
          isMiniMode
            ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg"
            : "fixed bottom-0 right-0 ml-60 w-[calc(100%-15rem)] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md",
          isFloating && isMiniMode
            ? "rounded-lg w-auto"
            : isMiniMode
              ? "fixed bottom-0 right-0 ml-60 w-[calc(100%-15rem)] h-16 p-2"
              : "p-4",
        )}
      >
        <audio ref={audioRef} src={audioUrl} preload="metadata" />

        {isMiniMode ? (
          // Mini Player Mode
          <div className="flex items-center h-full">
            {isFloating && (
              <div
                className={cn(
                  "px-2 cursor-move flex items-center",
                  isDragging ? "text-primary" : "text-muted-foreground",
                )}
              >
                <GripHorizontal className="h-4 w-4" />
              </div>
            )}

            {/* Album Art */}
            <div className="relative h-10 w-10 rounded overflow-hidden mr-3 flex-shrink-0">
              <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
            </div>

            {/* Track Info */}
            <div className="flex-grow min-w-0 mr-4">
              <div className="font-medium text-sm truncate">{title}</div>
              {artist && <div className="text-xs text-muted-foreground truncate">{artist}</div>}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <Button onClick={togglePlay} variant="ghost" size="icon" className="h-8 w-8 text-foreground">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </Button>

              <Button
                onClick={nextTrack}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              <Button
                onClick={() => setIsQueueOpen(true)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground relative"
              >
                <ListMusic className="h-4 w-4" />
                {queue.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {queue.length}
                  </span>
                )}
              </Button>

              <Button
                onClick={toggleFloatingMode}
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8 hover:text-foreground", isFloating ? "text-primary" : "text-muted-foreground")}
                title={isFloating ? "Dock player" : "Float player"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h6v6"></path>
                  <path d="M9 21H3v-6"></path>
                  <path d="m21 3-9 9"></path>
                  <path d="m3 21 9-9"></path>
                </svg>
              </Button>

              <Button
                onClick={handleMaximize}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-primary" style={{ width: `${progressPercentage}%` }} />
          </div>
        ) : (
          // Full Player Mode
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2">
                {/* Album Art (Full Mode) */}
                <div className="relative h-12 w-12 rounded-md overflow-hidden mr-2 flex-shrink-0 hidden sm:block">
                  <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
                </div>

                <Button
                  onClick={previousTrack}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
                  title="Previous track"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>

                <Button
                  onClick={togglePlay}
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 border-0 shadow-sm transition-all hover:scale-105"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 text-primary-foreground" />
                  ) : (
                    <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
                  )}
                </Button>

                <Button
                  onClick={nextTrack}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
                  title="Next track"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-grow">
                <div className="font-medium truncate text-foreground">{title}</div>
                {artist && <div className="text-sm text-muted-foreground">{artist}</div>}
              </div>

              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground font-medium tabular-nums">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>

                <Button
                  onClick={() => setIsQueueOpen(true)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors relative"
                  title="View queue"
                >
                  <ListMusic className="h-4 w-4" />
                  {queue.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {queue.length}
                    </span>
                  )}
                </Button>

                <Button
                  onClick={toggleFloatingMode}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
                  title="Float mini player"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 3h6v6"></path>
                    <path d="M9 21H3v-6"></path>
                    <path d="m21 3-9 9"></path>
                    <path d="m3 21 9-9"></path>
                  </svg>
                </Button>

                <Button
                  onClick={() => setIsMiniMode(true)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
                  title="Minimize player"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <Slider
                  value={[currentTime]}
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  onValueChange={(newValue) => handleTimeChange(newValue)}
                  className="cursor-pointer"
                />
              </div>

              <Button
                onClick={toggleMute}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>

              <div className="w-24">
                <Slider
                  value={volume}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={setVolume}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <QueueDrawer open={isQueueOpen} onOpenChange={setIsQueueOpen} />
    </>
  )
}
