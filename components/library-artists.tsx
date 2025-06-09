"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface LibraryArtistsProps {
  artists: {
    name: string
    image: string
    trackCount: number
    tracks: any[]
  }[]
  onArtistClick: (artist: string) => void
}

export function LibraryArtists({ artists, onArtistClick }: LibraryArtistsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {artists.map((artist) => (
        <div
          key={artist.name}
          className="flex flex-col items-center cursor-pointer group"
          onClick={() => onArtistClick(artist.name)}
        >
          <div className="relative w-full aspect-square rounded-full overflow-hidden mb-4">
            <Image
              src={artist.image || "/placeholder.svg"}
              alt={artist.name}
              fill
              className={cn("object-cover transition-all duration-300 group-hover:scale-105")}
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
          </div>
          <h3 className="font-medium text-center group-hover:text-purple-400 transition-colors">{artist.name}</h3>
          <p className="text-xs text-zinc-400 text-center">{artist.trackCount} tracks</p>
        </div>
      ))}
    </div>
  )
}
