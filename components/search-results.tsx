"use client"

import { useState, useEffect } from "react"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { LibraryList } from "@/components/library-list"
import { LibraryArtists } from "@/components/library-artists"
import { AlbumGrid } from "@/components/album-grid"
import { FeaturedCard } from "@/components/featured-card"

// Mock data for search results
import { searchData } from "@/lib/search-data"

interface SearchResultsProps {
  query: string
  category: "top" | "songs" | "artists" | "albums" | "playlists" | "nfts"
  showAll?: boolean
  className?: string
}

export function SearchResults({ query, category, showAll = false, className }: SearchResultsProps) {
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null)

  useEffect(() => {
    if (!query) return

    setIsLoading(true)

    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      // Filter mock data based on query and category
      let filteredResults: any[] = []

      if (category === "top") {
        // For top results, get a mix of all categories
        filteredResults = searchData.songs
          .concat(searchData.artists)
          .concat(searchData.albums)
          .filter((item) => {
            const searchableText = `${item.title || item.name} ${item.artist || ""}`.toLowerCase()
            return searchableText.includes(query.toLowerCase())
          })
          .slice(0, 3)
      } else {
        // For specific categories
        const dataKey = category as keyof typeof searchData
        filteredResults = searchData[dataKey].filter((item) => {
          const searchableText = `${item.title || item.name} ${item.artist || ""}`.toLowerCase()
          return searchableText.includes(query.toLowerCase())
        })

        // Limit results unless showAll is true
        if (!showAll) {
          filteredResults = filteredResults.slice(0, 4)
        }
      }

      setResults(filteredResults)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, category, showAll])

  const togglePlay = (id: number) => {
    if (currentlyPlaying === id) {
      setCurrentlyPlaying(null)
    } else {
      setCurrentlyPlaying(id)
    }
  }

  if (isLoading) {
    return (
      <div className={cn("py-4", className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-40 bg-zinc-800 rounded"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-square bg-zinc-800 rounded"></div>
                <div className="h-4 w-3/4 bg-zinc-800 rounded"></div>
                <div className="h-3 w-1/2 bg-zinc-800 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return null
  }

  const renderResults = () => {
    switch (category) {
      case "top":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 rounded-md hover:bg-zinc-800/50 transition-colors cursor-pointer"
              >
                <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title || item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{item.title || item.name}</h3>
                  <p className="text-sm text-zinc-400">{item.artist || "Artist"}</p>
                  <p className="text-xs text-zinc-500">{item.type || "Song"}</p>
                </div>
              </div>
            ))}
          </div>
        )

      case "songs":
        return (
          <LibraryList
            tracks={results.map((song) => ({
              id: song.id,
              title: song.title,
              artist: song.artist,
              image: song.image,
              duration: song.duration,
              created: new Date().toISOString(),
              audioUrl: song.audioUrl,
              plays: song.plays || 0,
              genre: song.genre || "",
              isVerified: song.isVerified || false,
            }))}
            currentlyPlayingId={currentlyPlaying}
            onPlayToggle={togglePlay}
          />
        )

      case "artists":
        return (
          <LibraryArtists
            artists={results.map((artist) => ({
              name: artist.name,
              image: artist.image,
              trackCount: artist.trackCount || 0,
              tracks: [],
            }))}
            onArtistClick={(artist) => console.log(`Navigate to artist: ${artist}`)}
          />
        )

      case "albums":
        return (
          <AlbumGrid
            albums={results.map((album) => ({
              id: album.id,
              title: album.title,
              artist: album.artist,
              image: album.image,
              audioUrl: album.audioUrl || "",
              isVerified: album.isVerified || false,
            }))}
            currentlyPlayingId={currentlyPlaying}
            onPlayToggle={togglePlay}
          />
        )

      case "playlists":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((playlist) => (
              <FeaturedCard
                key={playlist.id}
                title={playlist.title}
                description={playlist.description}
                image={playlist.image}
                href={`/playlist/${playlist.id}`}
                subtitle={`${playlist.trackCount || 0} songs`}
              />
            ))}
          </div>
        )

      case "nfts":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((nft) => (
              <div key={nft.id} className="group cursor-pointer">
                <div className="relative aspect-square rounded-md overflow-hidden mb-3">
                  <Image src={nft.image || "/placeholder.svg"} alt={nft.title} fill className="object-cover" />
                  <div className="absolute top-2 right-2 bg-purple-500/80 text-white text-xs px-2 py-1 rounded-full">
                    NFT
                  </div>
                </div>
                <h3 className="font-medium text-base mb-1 group-hover:text-purple-400 transition-colors">
                  {nft.title}
                </h3>
                <p className="text-xs text-zinc-400">{nft.artist}</p>
                <p className="text-xs text-zinc-500 mt-1">{nft.price}</p>
              </div>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={cn("mb-8", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold capitalize">{category === "top" ? "Top Results" : category}</h2>
        {!showAll && results.length > 3 && (
          <Link
            href={`/search?q=${encodeURIComponent(query)}&category=${category}`}
            className="flex items-center text-purple-400 hover:text-purple-300 transition-colors text-sm"
          >
            See All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        )}
      </div>

      {renderResults()}
    </div>
  )
}
