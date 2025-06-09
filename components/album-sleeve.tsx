"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GenreBadge } from "@/components/genre-badge"
import { Badge } from "@/components/ui/badge"
import { BadgeCheck } from "lucide-react"

interface AlbumSleeveProps {
  image: string
  title: string
  isPlaying: boolean
  isVerified: boolean
  genre: string
  onPlayToggle: () => void
  className?: string
}

export function AlbumSleeve({ image, title, isPlaying, isVerified, genre, onPlayToggle, className }: AlbumSleeveProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn("relative aspect-square overflow-visible group", isHovered ? "z-10" : "z-0", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Album sleeve/jacket */}
      <div
        className={cn(
          "absolute inset-0 bg-zinc-900/90 rounded-md shadow-md transition-all duration-500",
          isHovered ? "scale-[1.02] shadow-xl shadow-purple-900/20" : "",
        )}
      />

      {/* Album cover image */}
      <div
        className={cn(
          "absolute inset-0 rounded-md overflow-hidden transition-all duration-500 ease-out",
          isHovered ? "translate-y-[-8%] translate-x-[5%] rotate-[-5deg] shadow-lg" : "",
        )}
      >
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        {/* Vinyl record effect (visible on hover) */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black rounded-full opacity-0 transition-all duration-500 ease-out",
            isHovered ? "opacity-90 scale-[0.85] translate-x-[40%] translate-y-[-5%]" : "",
          )}
        >
          {/* Inner vinyl grooves */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[85%] h-[85%] rounded-full border border-zinc-700"></div>
            <div className="absolute w-[65%] h-[65%] rounded-full border border-zinc-700"></div>
            <div className="absolute w-[45%] h-[45%] rounded-full border border-zinc-700"></div>
            <div className="absolute w-[25%] h-[25%] rounded-full border border-zinc-700"></div>
            <div className="absolute w-[15%] h-[15%] rounded-full bg-zinc-800 flex items-center justify-center">
              <div className="w-[30%] h-[30%] rounded-full bg-zinc-600"></div>
            </div>
          </div>
        </div>

        {/* Play/pause button overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300",
            isHovered || isPlaying ? "opacity-100" : "opacity-0",
          )}
        >
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
                ? "bg-white text-purple-600 hover:bg-white/90 hover:text-purple-700"
                : "bg-purple-600 hover:bg-purple-700 text-white",
            )}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
          </Button>
        </div>

        {/* Genre badge */}
        <div className="absolute top-2 left-2">
          <GenreBadge genre={genre} />
        </div>

        {/* Verified badge */}
        {isVerified && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-purple-500/80 hover:bg-purple-500 font-body">
              <BadgeCheck className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          </div>
        )}
      </div>
    </div>
  )
}
