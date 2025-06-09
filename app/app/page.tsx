"use client"

import { useState } from "react"
import { MusicAppLayout } from "@/components/music-app-layout"
import { ApplePlayer } from "@/components/apple-player"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Play, Shuffle, ChevronRight, Pause } from "lucide-react"
import { HorizontalScroll } from "@/components/horizontal-scroll"
import { FeaturedCard } from "@/components/featured-card"
import { GenreBadge } from "@/components/genre-badge"
import Link from "next/link"
import Image from "next/image"
import { ProtectedRoute } from "@/components/protected-route"

// Mock data for recently played
const recentlyPlayed = [
  {
    id: 1,
    title: "Solana Sunrise",
    artist: "You",
    image: "/abstract-music-visualizer-purple.png",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 4,
    title: "Crypto Beats",
    artist: "BlockchainDJ",
    image: "/electronic-purple-album-cover.png",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    id: 7,
    title: "Metaverse Melodies",
    artist: "Virtual Vibes",
    image: "/futuristic-colorful-album-cover.png",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
]

// Mock data for made for you
const madeForYou = [
  {
    id: "favorites-mix",
    title: "Favorites Mix",
    description: "Based on your listening history",
    image: "/abstract-purple-music-collage.png",
    tracks: 25,
  },
  {
    id: "discover-mix",
    title: "Discover Mix",
    description: "New artists we think you'll like",
    image: "/colorful-abstract-music-collage.png",
    tracks: 25,
  },
  {
    id: "chill-mix",
    title: "Chill Mix",
    description: "Relaxing music for your downtime",
    image: "/blue-purple-ambient-collage.png",
    tracks: 25,
  },
]

// Mock data for new releases
const newReleases = [
  {
    id: 6,
    title: "Decentralized Dreams",
    artist: "Web3 Wizard",
    image: "/abstract-digital-dream-album-cover.png",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  },
  {
    id: 2,
    title: "Digital Dreams",
    artist: "You",
    image: "/abstract-music-visualizer-blue.png",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 5,
    title: "NFT Nights",
    artist: "TokenTunes",
    image: "/night-city-neon-album-cover.png",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
  {
    id: 8,
    title: "Digital Dreamer",
    artist: "Pixel Pioneers",
    image: "/dreamy-pixel-album-cover.png",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  },
  {
    id: 9,
    title: "Crypto Funk",
    artist: "Blockchain Beats",
    image: "/funk-album-cover-colorful.png",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
  },
]

// Mock data for genres
const genres = [
  {
    id: "electronic",
    name: "Electronic",
    image: "/electronic-music-visualization-purple.png",
  },
  {
    id: "ambient",
    name: "Ambient",
    image: "/ambient-blue-visualization.png",
  },
  { id: "lo-fi", name: "Lo-Fi", image: "/lofi-warm-visualization.png" },
  {
    id: "synthwave",
    name: "Synthwave",
    image: "/synthwave-visualization.png",
  },
  {
    id: "experimental",
    name: "Experimental",
    image: "/experimental-music-visualization-abstract.png",
  },
  {
    id: "chillwave",
    name: "Chillwave",
    image: "/chillwave-pastel-visualization.png",
  },
]

// Mock data for featured playlists
const featuredPlaylists = [
  {
    id: "blockchain-beats",
    title: "Blockchain Beats",
    description: "The hottest tracks in the NFT music space",
    image: "/blockchain-music-visualization-purple-blue.png",
    curator: "SubTerrain",
    tracks: 42,
  },
  {
    id: "crypto-classics",
    title: "Crypto Classics",
    description: "Essential tracks from the pioneers of blockchain music",
    image: "/crypto-music-visualization-gold-black.png",
    curator: "SubTerrain",
    tracks: 35,
  },
  {
    id: "nft-newcomers",
    title: "NFT Newcomers",
    description: "Fresh talent making waves in the decentralized music scene",
    image: "/colorful-nft-music-visualization.png",
    curator: "SubTerrain",
    tracks: 28,
  },
]

export default function AppHome() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null)

  // Toggle play/pause for a track
  const togglePlay = (id: number) => {
    if (currentlyPlaying === id) {
      setCurrentlyPlaying(null)
    } else {
      setCurrentlyPlaying(id)
    }
  }

  // Get currently playing track
  const currentTrack = currentlyPlaying
    ? [...recentlyPlayed, ...newReleases].find((item) => item.id === currentlyPlaying)
    : null

  return (
    <ProtectedRoute>
      <MusicAppLayout>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6">
                {/* Welcome section */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold mb-1">Welcome to SubTerrain</h1>
                  <p className="text-zinc-400">Your blockchain music platform</p>
                </div>

                {/* Hero featured section */}
                <section className="mb-10">
                  <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden">
                    <Image
                      src="/abstract-purple-music-visualization-widescreen.png"
                      alt="Featured content"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex flex-col justify-center p-8">
                      <div className="max-w-lg">
                        <h2 className="text-4xl font-bold mb-4">Discover NFT Music</h2>
                        <p className="text-lg text-zinc-300 mb-6">
                          Own your sound on the blockchain and connect with artists directly
                        </p>
                        <div className="flex gap-4">
                          <Button className="gap-2 bg-white text-black hover:bg-white/90 hover:text-black">
                            <Play className="h-4 w-4" />
                            Listen Now
                          </Button>
                          <Button variant="outline" className="gap-2 bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700">
                            <Shuffle className="h-4 w-4" />
                            Shuffle
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Recently Played */}
                <section className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Recently Played</h2>
                    <Link href="/library">
                      <Button variant="ghost" className="text-purple-400 hover:text-purple-300 gap-1">
                        See All
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <HorizontalScroll>
                    {recentlyPlayed.map((item) => (
                      <div key={item.id} className="w-44 flex-shrink-0">
                        <div
                          className="relative aspect-square rounded-md overflow-hidden mb-2 cursor-pointer group"
                          onClick={() => togglePlay(item.id)}
                        >
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                          {currentlyPlaying === item.id && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                                <Pause className="h-6 w-6 text-black" />
                              </div>
                            </div>
                          )}
                        </div>
                        <h3 className="font-medium text-sm truncate">{item.title}</h3>
                        <p className="text-xs text-zinc-400 truncate">{item.artist}</p>
                      </div>
                    ))}
                  </HorizontalScroll>
                </section>

                {/* Made For You */}
                <section className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Made For You</h2>
                    <Button variant="ghost" className="text-purple-400 hover:text-purple-300 gap-1">
                      See All
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <HorizontalScroll>
                    {madeForYou.map((item) => (
                      <FeaturedCard
                        key={item.id}
                        title={item.title}
                        description={item.description}
                        image={item.image}
                        href={`/playlist/${item.id}`}
                      />
                    ))}
                  </HorizontalScroll>
                </section>

                {/* New Releases */}
                <section className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">New Releases</h2>
                    <Link href="/discover">
                      <Button variant="ghost" className="text-purple-400 hover:text-purple-300 gap-1">
                        See All
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <HorizontalScroll>
                    {newReleases.map((item) => (
                      <div key={item.id} className="w-44 flex-shrink-0">
                        <div
                          className="relative aspect-square rounded-md overflow-hidden mb-2 cursor-pointer group"
                          onClick={() => togglePlay(item.id)}
                        >
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                          {currentlyPlaying === item.id && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                                <Pause className="h-6 w-6 text-black" />
                              </div>
                            </div>
                          )}
                        </div>
                        <h3 className="font-medium text-sm truncate">{item.title}</h3>
                        <p className="text-xs text-zinc-400 truncate">{item.artist}</p>
                      </div>
                    ))}
                  </HorizontalScroll>
                </section>

                {/* Browse by Genre */}
                <section className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Browse by Genre</h2>
                    <Link href="/discover">
                      <Button variant="ghost" className="text-purple-400 hover:text-purple-300 gap-1">
                        See All
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {genres.map((genre) => (
                      <Link key={genre.id} href={`/discover?genre=${genre.id}`}>
                        <div className="relative aspect-square rounded-md overflow-hidden group cursor-pointer">
                          <Image
                            src={genre.image || "/placeholder.svg"}
                            alt={genre.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-3">
                            <GenreBadge genre={genre.name} variant="secondary" className="text-white bg-transparent" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>

                {/* Featured Playlists */}
                <section className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Featured Playlists</h2>
                    <Button variant="ghost" className="text-purple-400 hover:text-purple-300 gap-1">
                      See All
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <HorizontalScroll>
                    {featuredPlaylists.map((playlist) => (
                      <FeaturedCard
                        key={playlist.id}
                        title={playlist.title}
                        description={playlist.description}
                        image={playlist.image}
                        href={`/playlist/${playlist.id}`}
                        subtitle={`${playlist.tracks} songs • By ${playlist.curator}`}
                      />
                    ))}
                  </HorizontalScroll>
                </section>

                {/* NFT Spotlight */}
                <section className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">NFT Spotlight</h2>
                    <Link href="/discover">
                      <Button variant="ghost" className="text-purple-400 hover:text-purple-300 gap-1">
                        See All
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden group cursor-pointer">
                      <Image src="/futuristic-purple-music-nft.png" alt="NFT Spotlight" fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                        <h3 className="text-xl font-bold mb-1">Exclusive NFT Drops</h3>
                        <p className="text-zinc-300 mb-3">Limited edition music NFTs from top artists</p>
                        <Button className="w-fit gap-2 bg-white text-black hover:bg-white/90 hover:text-black">
                          <Play className="h-4 w-4" />
                          Explore
                        </Button>
                      </div>
                    </div>
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden group cursor-pointer">
                      <Image src="/blockchain-music-royalties.png" alt="NFT Royalties" fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                        <h3 className="text-xl font-bold mb-1">Artist Royalties</h3>
                        <p className="text-zinc-300 mb-3">See how blockchain is revolutionizing music royalties</p>
                        <Button className="w-fit gap-2 bg-white text-black hover:bg-white/90 hover:text-black">
                          <Play className="h-4 w-4" />
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </ScrollArea>
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
    </ProtectedRoute>
  )
}
