"use client"

import { useState } from "react"
import MusicAppLayout from "@/components/music-app-layout"
import { ApplePlayer } from "@/components/apple-player"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Grid2X2, ListMusic, User2, Disc, Music, Clock, Plus } from "lucide-react"
import { AlbumGrid } from "@/components/album-grid"
import { LibraryList } from "@/components/library-list"
import { LibraryArtists } from "@/components/library-artists"
import { usePlaylists } from "@/contexts/playlist-context"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

// Mock data for library music
const libraryMusic = [
  {
    id: 1,
    title: "Solana Sunrise",
    artist: "You",
    image: "/abstract-music-visualizer-purple.png",
    duration: "3:24",
    created: "2023-04-15",
    mintAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    plays: 245,
    genre: "Electronic",
    isVerified: true,
  },
  {
    id: 2,
    title: "Digital Dreams",
    artist: "You",
    image: "/abstract-music-visualizer-blue.png",
    duration: "4:12",
    created: "2023-05-22",
    mintAddress: "9xDFg8CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    plays: 187,
    genre: "Ambient",
    isVerified: true,
  },
  {
    id: 3,
    title: "Metaverse Melody",
    artist: "You",
    image: "/abstract-music-visualizer-pink.png",
    duration: "2:57",
    created: "2023-06-10",
    mintAddress: "5rLQtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    plays: 132,
    genre: "Chillwave",
    isVerified: true,
  },
  {
    id: 4,
    title: "Crypto Beats",
    artist: "BlockchainDJ",
    image: "/electronic-purple-album-cover.png",
    duration: "3:45",
    created: "2023-03-30",
    mintAddress: "3xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    plays: 543,
    genre: "Electronic",
    isVerified: true,
  },
  {
    id: 5,
    title: "NFT Nights",
    artist: "TokenTunes",
    image: "/night-city-neon-album-cover.png",
    duration: "5:20",
    created: "2023-04-18",
    mintAddress: "6yKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    plays: 321,
    genre: "Lo-Fi",
    isVerified: false,
  },
  {
    id: 6,
    title: "Blockchain Blues",
    artist: "Crypto Cat",
    image: "/moody-blue-album-art.png",
    duration: "5:12",
    created: "2023-10-05",
    mintAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    plays: 432,
    genre: "Blues",
    isVerified: false,
  },
  {
    id: 7,
    title: "Metaverse Melodies",
    artist: "Virtual Vibes",
    image: "/futuristic-colorful-album-cover.png",
    duration: "4:20",
    created: "2023-11-22",
    mintAddress: "8xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    plays: 765,
    genre: "Ambient",
    isVerified: true,
  },
  {
    id: 8,
    title: "Decentralized Dreams",
    artist: "Web3 Wizard",
    image: "/abstract-digital-dream-album-cover.png",
    duration: "6:15",
    created: "2023-07-12",
    mintAddress: "9xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    plays: 289,
    genre: "Experimental",
    isVerified: false,
  },
  {
    id: 9,
    title: "Token Tunes",
    artist: "Crypto Composer",
    image: "/placeholder-t1xso.png",
    duration: "3:30",
    created: "2023-06-25",
    mintAddress: "1xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    plays: 421,
    genre: "Minimal",
    isVerified: true,
  },
  {
    id: 10,
    title: "Digital Dreamer",
    artist: "Pixel Pioneers",
    image: "/dreamy-pixel-album-cover.png",
    duration: "5:05",
    created: "2023-05-10",
    mintAddress: "2xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    plays: 632,
    genre: "Synthwave",
    isVerified: true,
  },
  {
    id: 11,
    title: "Crypto Funk",
    artist: "Blockchain Beats",
    image: "/funk-album-cover-colorful.png",
    duration: "4:15",
    created: "2023-04-18",
    mintAddress: "3xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    plays: 543,
    genre: "Funk",
    isVerified: true,
  },
  {
    id: 12,
    title: "NFT Jazz",
    artist: "Token Tunes",
    image: "/moody-jazz-album-cover.png",
    duration: "6:30",
    created: "2023-03-25",
    mintAddress: "4xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    plays: 321,
    genre: "Jazz",
    isVerified: false,
  },
]

// Group albums by artist
const artistsMap = libraryMusic.reduce(
  (acc, track) => {
    if (!acc[track.artist]) {
      acc[track.artist] = []
    }
    acc[track.artist].push(track)
    return acc
  },
  {} as Record<string, typeof libraryMusic>,
)

const artists = Object.entries(artistsMap).map(([name, tracks]) => ({
  name,
  tracks,
  image: tracks[0].image,
  trackCount: tracks.length,
}))

export default function LibraryPage() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"recent" | "name" | "artist" | "plays">("recent")
  const { playlists, createPlaylist } = usePlaylists()

  // Filter music based on search
  const filteredMusic = libraryMusic.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.artist.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Sort music based on selected sort option
  const sortedMusic = [...filteredMusic].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.created).getTime() - new Date(a.created).getTime()
    } else if (sortBy === "name") {
      return a.title.localeCompare(b.title)
    } else if (sortBy === "artist") {
      return a.artist.localeCompare(b.artist)
    } else if (sortBy === "plays") {
      return b.plays - a.plays
    }
    return 0
  })

  // Toggle play/pause for a track
  const togglePlay = (id: number) => {
    if (currentlyPlaying === id) {
      setCurrentlyPlaying(null)
    } else {
      setCurrentlyPlaying(id)
    }
  }

  // Get currently playing track
  const currentTrack = currentlyPlaying ? libraryMusic.find((item) => item.id === currentlyPlaying) : null

  // Handle creating a new playlist
  const handleCreatePlaylist = () => {
    const playlistName = `New Playlist ${playlists.length + 1}`
    createPlaylist(playlistName)
  }

  return (
    <MusicAppLayout>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-heading font-bold">Library</h1>
              <div className="flex items-center gap-3">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input
                    placeholder="Search your library..."
                    className="pl-10 font-body bg-zinc-800/50 border-zinc-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center bg-zinc-800/50 rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-9 w-9 rounded-l-md", viewMode === "grid" && "bg-zinc-700 text-white")}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid2X2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-9 w-9 rounded-r-md", viewMode === "list" && "bg-zinc-700 text-white")}
                    onClick={() => setViewMode("list")}
                  >
                    <ListMusic className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700"
                  onClick={handleCreatePlaylist}
                >
                  <Plus className="h-4 w-4" />
                  New Playlist
                </Button>
              </div>
            </div>

            <Tabs defaultValue="recently-added" className="w-full">
              <TabsList className="bg-zinc-800/50 mb-6">
                <TabsTrigger value="recently-added" className="data-[state=active]:bg-zinc-700">
                  <Clock className="h-4 w-4 mr-2" />
                  Recently Added
                </TabsTrigger>
                <TabsTrigger value="artists" className="data-[state=active]:bg-zinc-700">
                  <User2 className="h-4 w-4 mr-2" />
                  Artists
                </TabsTrigger>
                <TabsTrigger value="albums" className="data-[state=active]:bg-zinc-700">
                  <Disc className="h-4 w-4 mr-2" />
                  Albums
                </TabsTrigger>
                <TabsTrigger value="songs" className="data-[state=active]:bg-zinc-700">
                  <Music className="h-4 w-4 mr-2" />
                  Songs
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[calc(100vh-240px)]">
                <TabsContent value="recently-added" className="mt-0">
                  {viewMode === "grid" ? (
                    <AlbumGrid
                      albums={sortedMusic.map((item) => ({
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
                  ) : (
                    <LibraryList tracks={sortedMusic} currentlyPlayingId={currentlyPlaying} onPlayToggle={togglePlay} />
                  )}
                </TabsContent>

                <TabsContent value="artists" className="mt-0">
                  <LibraryArtists artists={artists} onArtistClick={(artist) => console.log(artist)} />
                </TabsContent>

                <TabsContent value="albums" className="mt-0">
                  {viewMode === "grid" ? (
                    <AlbumGrid
                      albums={sortedMusic
                        .filter(
                          (item, index, self) =>
                            index === self.findIndex((t) => t.title === item.title && t.artist === item.artist),
                        )
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
                  ) : (
                    <LibraryList
                      tracks={sortedMusic.filter(
                        (item, index, self) =>
                          index === self.findIndex((t) => t.title === item.title && t.artist === item.artist),
                      )}
                      currentlyPlayingId={currentlyPlaying}
                      onPlayToggle={togglePlay}
                      showAlbumOnly
                    />
                  )}
                </TabsContent>

                <TabsContent value="songs" className="mt-0">
                  <LibraryList tracks={sortedMusic} currentlyPlayingId={currentlyPlaying} onPlayToggle={togglePlay} />
                </TabsContent>
              </ScrollArea>
            </Tabs>
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
