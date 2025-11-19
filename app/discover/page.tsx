"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Loader2, Pause, Play } from "lucide-react"
import { ApplePlayer } from "@/components/apple-player"
import { MusicAppLayout } from "@/components/music-app-layout"
import { AlbumGrid } from "@/components/album-grid"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { GenreIcon } from "@/components/genre-icon"
import type { PlaylistTrack } from "@/contexts/playlist-context"
import Image from "next/image"

// Define the types for our music data
type MusicType = {
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

// Mock data for music listings with enhanced information
const allMusicData: MusicType[] = [
  {
    id: 1,
    title: "Crypto Beats Vol. 1",
    artist: "DJ Blockchain",
    image: "/electronic-purple-album-cover.png",
    duration: "3:45",
    price: "0.5 SOL",
    isVerified: true,
    genre: "Electronic",
    likes: 1243,
    plays: 8765,
    releaseDate: "2023-12-15",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "Metaverse Melodies",
    artist: "Virtual Vibes",
    image: "/futuristic-colorful-album-cover.png",
    duration: "4:20",
    price: "0.8 SOL",
    isVerified: true,
    genre: "Ambient",
    likes: 876,
    plays: 5432,
    releaseDate: "2023-11-22",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "Blockchain Blues",
    artist: "Crypto Cat",
    image: "/moody-blue-album-art.png",
    duration: "5:12",
    price: "1.2 SOL",
    isVerified: false,
    genre: "Blues",
    likes: 543,
    plays: 3210,
    releaseDate: "2023-10-05",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    id: 4,
    title: "NFT Nights",
    artist: "Digital Dreams",
    image: "/night-city-neon-album-cover.png",
    duration: "3:55",
    price: "0.6 SOL",
    isVerified: true,
    genre: "Lo-Fi",
    likes: 987,
    plays: 6543,
    releaseDate: "2023-09-18",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    id: 5,
    title: "Solana Sunset",
    artist: "Blockchain Beats",
    image: "/placeholder-4wff0.png",
    duration: "4:30",
    price: "0.9 SOL",
    isVerified: true,
    genre: "Chillwave",
    likes: 1432,
    plays: 9876,
    releaseDate: "2023-08-30",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
  {
    id: 6,
    title: "Decentralized Dreams",
    artist: "Web3 Wizard",
    image: "/abstract-digital-dream-album-cover.png",
    duration: "6:15",
    price: "1.5 SOL",
    isVerified: false,
    genre: "Experimental",
    likes: 321,
    plays: 2345,
    releaseDate: "2023-07-12",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  },
  {
    id: 7,
    title: "Token Tunes",
    artist: "Crypto Composer",
    image: "/placeholder-t1xso.png",
    duration: "3:30",
    price: "0.4 SOL",
    isVerified: true,
    genre: "Minimal",
    likes: 765,
    plays: 4321,
    releaseDate: "2023-06-25",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  },
  {
    id: 8,
    title: "Digital Dreamer",
    artist: "Pixel Pioneers",
    image: "/dreamy-pixel-album-cover.png",
    duration: "5:05",
    price: "1.0 SOL",
    isVerified: true,
    genre: "Synthwave",
    likes: 1098,
    plays: 7654,
    releaseDate: "2023-05-10",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  },
  // Additional items for infinite scrolling demonstration
  {
    id: 9,
    title: "Crypto Funk",
    artist: "Blockchain Beats",
    image: "/funk-album-cover-colorful.png",
    duration: "4:15",
    price: "0.7 SOL",
    isVerified: true,
    genre: "Funk",
    likes: 876,
    plays: 5432,
    releaseDate: "2023-04-18",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
  },
  {
    id: 10,
    title: "NFT Jazz",
    artist: "Token Tunes",
    image: "/moody-jazz-album-cover.png",
    duration: "6:30",
    price: "1.1 SOL",
    isVerified: false,
    genre: "Jazz",
    likes: 543,
    plays: 3210,
    releaseDate: "2023-03-25",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
  },
  {
    id: 11,
    title: "Metaverse Rock",
    artist: "Virtual Vibes",
    image: "/placeholder-5cjxo.png",
    duration: "3:50",
    price: "0.6 SOL",
    isVerified: true,
    genre: "Rock",
    likes: 987,
    plays: 6543,
    releaseDate: "2023-02-15",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
  },
  {
    id: 12,
    title: "Digital Hip Hop",
    artist: "Crypto Cat",
    image: "/hip-hop-urban-album-cover.png",
    duration: "4:05",
    price: "0.9 SOL",
    isVerified: true,
    genre: "Hip Hop",
    likes: 1432,
    plays: 9876,
    releaseDate: "2023-01-10",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
  },
  {
    id: 13,
    title: "Blockchain Beats Vol. 2",
    artist: "DJ Blockchain",
    image: "/electronic-blue-album-cover.png",
    duration: "5:20",
    price: "0.8 SOL",
    isVerified: true,
    genre: "Electronic",
    likes: 876,
    plays: 5432,
    releaseDate: "2022-12-20",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
  },
  {
    id: 14,
    title: "Solana Soul",
    artist: "Web3 Wizard",
    image: "/album-cover-soul-warm.png",
    duration: "4:45",
    price: "0.7 SOL",
    isVerified: false,
    genre: "Soul",
    likes: 543,
    plays: 3210,
    releaseDate: "2022-11-15",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
  },
  {
    id: 15,
    title: "NFT Classical",
    artist: "Crypto Composer",
    image: "/classical-elegant-album-cover.png",
    duration: "7:30",
    price: "1.3 SOL",
    isVerified: true,
    genre: "Classical",
    likes: 987,
    plays: 6543,
    releaseDate: "2022-10-10",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
  },
  {
    id: 16,
    title: "Pixel Pop",
    artist: "Pixel Pioneers",
    image: "/album-cover-pop-bright.png",
    duration: "3:15",
    price: "0.5 SOL",
    isVerified: true,
    genre: "Pop",
    likes: 1432,
    plays: 9876,
    releaseDate: "2022-09-05",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
  },
]

// Available genres for filtering
const genres = [
  "All Genres",
  "Electronic",
  "Ambient",
  "Blues",
  "Lo-Fi",
  "Chillwave",
  "Experimental",
  "Minimal",
  "Synthwave",
  "Funk",
  "Jazz",
  "Rock",
  "Hip Hop",
  "Soul",
  "Classical",
  "Pop",
]

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("All Genres")
  const [priceRange, setPriceRange] = useState([0, 2])
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Filter music based on search, genre, and price
  const filteredMusic = allMusicData.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.artist.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesGenre = selectedGenre === "All Genres" || item.genre === selectedGenre

    const itemPrice = Number.parseFloat(item.price.split(" ")[0])
    const matchesPrice = itemPrice >= priceRange[0] && itemPrice <= priceRange[1]

    return matchesSearch && matchesGenre && matchesPrice
  })

  // Group albums by genre for the browse sections
  const albumsByGenre = genres
    .filter((genre) => genre !== "All Genres")
    .map((genre) => ({
      genre,
      albums: allMusicData.filter((item) => item.genre === genre).slice(0, 6),
    }))
    .filter((group) => group.albums.length > 0)

  // Toggle play/pause for a track
  const togglePlay = (id: number) => {
    if (currentlyPlaying === id) {
      setCurrentlyPlaying(null)
    } else {
      setCurrentlyPlaying(id)
    }
  }

  // Play a track from playlist
  const playTrackFromPlaylist = (track: PlaylistTrack) => {
    setCurrentlyPlaying(track.id)
  }

  // Get currently playing track
  const currentTrack = currentlyPlaying ? allMusicData.find((item) => item.id === currentlyPlaying) : null

  return (
    <MusicAppLayout>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Search and filters */}
            <div className="flex items-center gap-4 mb-8">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="Search by artist or title..."
                  className="pl-10 font-body bg-zinc-800/50 border-zinc-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-purple-500/10 text-purple-500" : ""}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {/* Filters section */}
            {showFilters && (
              <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-sm font-heading tracking-wide">Genre</label>
                  <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger className="font-body">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre} className="font-body flex items-center">
                          {genre !== "All Genres" && <GenreIcon genre={genre} size={14} />}
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-heading tracking-wide">Price Range (SOL)</label>
                  <div className="pt-4 px-2">
                    <Slider value={priceRange} min={0} max={2} step={0.1} onValueChange={setPriceRange} />
                    <div className="flex justify-between mt-2 text-xs text-zinc-400 font-body">
                      <span>{priceRange[0]} SOL</span>
                      <span>{priceRange[1]} SOL</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Featured section */}
            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold mb-6">Featured</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMusic.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer"
                    onClick={() => togglePlay(item.id)}
                  >
                    <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <p className="text-zinc-300">{item.artist}</p>
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        size="icon"
                        className="h-14 w-14 rounded-full bg-white text-black hover:bg-white/90 hover:text-black"
                      >
                        {currentlyPlaying === item.id ? (
                          <Pause className="h-7 w-7" />
                        ) : (
                          <Play className="h-7 w-7 ml-0.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recently Added */}
            <section className="mb-12">
              <AlbumGrid
                title="Recently Added"
                albums={filteredMusic
                  .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
                  .slice(0, 6)
                  .map((item) => ({
                    id: item.id,
                    title: item.title,
                    artist: item.artist,
                    image: item.image,
                    audioUrl: item.audioUrl,
                    isVerified: item.isVerified,
                  }))}
                currentlyPlayingId={currentlyPlaying}
                onPlayToggle={togglePlay}
              />
            </section>

            {/* Trending Now */}
            <section className="mb-12">
              <AlbumGrid
                title="Trending Now"
                albums={filteredMusic
                  .sort((a, b) => b.plays - a.plays)
                  .slice(0, 6)
                  .map((item) => ({
                    id: item.id,
                    title: item.title,
                    artist: item.artist,
                    image: item.image,
                    audioUrl: item.audioUrl,
                    isVerified: item.isVerified,
                  }))}
                currentlyPlayingId={currentlyPlaying}
                onPlayToggle={togglePlay}
              />
            </section>

            {/* Browse by Genre */}
            {albumsByGenre.map((group) => (
              <section key={group.genre} className="mb-12">
                <AlbumGrid
                  title={group.genre}
                  albums={group.albums.map((item) => ({
                    id: item.id,
                    title: item.title,
                    artist: item.artist,
                    image: item.image,
                    audioUrl: item.audioUrl,
                    isVerified: item.isVerified,
                  }))}
                  currentlyPlayingId={currentlyPlaying}
                  onPlayToggle={togglePlay}
                />
              </section>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-center items-center py-8">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-500 mb-2" />
                  <p className="text-sm text-zinc-400 font-body">Loading more tracks...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Apple Music style player */}
        {currentTrack && (
          <ApplePlayer
            audioUrl={currentTrack.audioUrl}
            title={currentTrack.title}
            artist={currentTrack.artist}
            coverImage={currentTrack.image}
          />
        )}
      </div>
    </MusicAppLayout>
  )
}
