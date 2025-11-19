"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload } from "lucide-react"
import { MusicAppLayout } from "@/components/music-app-layout"
import { ApplePlayer } from "@/components/apple-player"
import { AlbumGrid } from "@/components/album-grid"

// Mock data for owned music
const myMusic = [
  {
    id: 1,
    title: "Solana Sunrise",
    image: "/abstract-music-visualizer-purple.png",
    duration: "3:24",
    created: "2023-04-15",
    mintAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    artist: "You",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "Digital Dreams",
    image: "/abstract-music-visualizer-blue.png",
    duration: "4:12",
    created: "2023-05-22",
    mintAddress: "9xDFg8CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    artist: "You",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "Metaverse Melody",
    image: "/abstract-music-visualizer-pink.png",
    duration: "2:57",
    created: "2023-06-10",
    mintAddress: "5rLQtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    artist: "You",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
]

// Mock data for collected music
const collectedMusic = [
  {
    id: 4,
    title: "Crypto Beats",
    artist: "BlockchainDJ",
    image: "/abstract-music-visualizer-green.png",
    duration: "3:45",
    acquired: "2023-03-30",
    mintAddress: "3xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    id: 5,
    title: "NFT Nights",
    artist: "TokenTunes",
    image: "/placeholder-j5so9.png",
    duration: "5:20",
    acquired: "2023-04-18",
    mintAddress: "6yKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
]

export default function MyMusicPage() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null)

  const togglePlay = (id: number) => {
    if (currentlyPlaying === id) {
      setCurrentlyPlaying(null)
    } else {
      setCurrentlyPlaying(id)
    }
  }

  // Get currently playing track
  const currentTrack = currentlyPlaying
    ? [...myMusic, ...collectedMusic].find((item) => item.id === currentlyPlaying)
    : null

  return (
    <MusicAppLayout>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <h1 className="text-3xl font-heading font-bold mb-8">My Music Collection</h1>

            <Tabs defaultValue="owned" className="mb-8">
              <TabsList className="bg-zinc-800/50">
                <TabsTrigger value="owned" className="data-[state=active]:bg-zinc-700">
                  My Creations
                </TabsTrigger>
                <TabsTrigger value="collected" className="data-[state=active]:bg-zinc-700">
                  Collected
                </TabsTrigger>
              </TabsList>

              <TabsContent value="owned" className="mt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Your Music NFTs</h2>
                  <Button className="gap-2 bg-white text-black hover:bg-white/90 hover:text-black">
                    <Upload className="h-4 w-4" />
                    Mint New Track
                  </Button>
                </div>

                <AlbumGrid
                  albums={myMusic.map((item) => ({
                    id: item.id,
                    title: item.title,
                    artist: item.artist || "You",
                    image: item.image,
                    audioUrl: item.audioUrl,
                  }))}
                  currentlyPlayingId={currentlyPlaying}
                  onPlayToggle={togglePlay}
                />
              </TabsContent>

              <TabsContent value="collected" className="mt-6">
                <h2 className="text-xl font-semibold mb-6">Collected Music NFTs</h2>

                <AlbumGrid
                  albums={collectedMusic.map((item) => ({
                    id: item.id,
                    title: item.title,
                    artist: item.artist,
                    image: item.image,
                    audioUrl: item.audioUrl,
                  }))}
                  currentlyPlayingId={currentlyPlaying}
                  onPlayToggle={togglePlay}
                />
              </TabsContent>
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
