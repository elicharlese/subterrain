"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Music2, ListMusic, Info, Mic2, Play, Pause } from "lucide-react"
import { ApplePlayer } from "@/components/apple-player"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { MusicAppLayout } from "@/components/music-app-layout"

// Reuse some mock tracks for now playing / queue
const mockQueue = [
  {
    id: 1,
    title: "Solana Sunrise",
    artist: "You",
    image: "/abstract-music-visualizer-purple.png",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "3:24",
  },
  {
    id: 2,
    title: "Digital Dreams",
    artist: "You",
    image: "/abstract-music-visualizer-blue.png",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "4:12",
  },
  {
    id: 3,
    title: "Metaverse Melody",
    artist: "You",
    image: "/abstract-music-visualizer-pink.png",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "2:57",
  },
  {
    id: 4,
    title: "Crypto Beats",
    artist: "BlockchainDJ",
    image: "/electronic-purple-album-cover.png",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    duration: "3:45",
  },
]

export default function NowPlayingPage() {
  const [activeId, setActiveId] = useState<number>(mockQueue[0]?.id ?? 1)

  const activeTrack = useMemo(
    () => mockQueue.find((track) => track.id === activeId) ?? mockQueue[0],
    [activeId],
  )

  return (
    <MusicAppLayout>
      <div className="flex flex-col h-full">
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] gap-6 p-6 pb-40">
        {/* Left: artwork + waveform */}
        <div className="flex flex-col gap-6">
          <div className="relative w-full aspect-square max-h-[480px] mx-auto rounded-3xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.7)]">
            <Image
              src={activeTrack.image}
              alt={activeTrack.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs uppercase tracking-[0.2em] text-zinc-300/80">
                  <Music2 className="h-4 w-4" />
                  Now Playing
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-1">{activeTrack.title}</h1>
                <p className="text-zinc-300 text-sm md:text-base">{activeTrack.artist}</p>
              </div>
            </div>
          </div>

          {/* Faux waveform / expanded progress area */}
          <div className="relative rounded-3xl border border-white/5 bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-zinc-900/90 px-6 py-4 flex flex-col gap-4 overflow-hidden">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_#a855f7_0,_transparent_55%),radial-gradient(circle_at_bottom,_#22d3ee_0,_transparent_55%)]" />
            <div className="relative flex items-center justify-between text-xs text-zinc-300 mb-1">
              <span>1:12</span>
              <span>Live waveform preview</span>
              <span>{activeTrack.duration}</span>
            </div>
            <div className="relative h-16 w-full rounded-2xl overflow-hidden bg-zinc-800/60">
              <div className="absolute inset-0 opacity-70 bg-[repeating-linear-gradient(90deg,_rgba(255,255,255,0.08)_0,_rgba(255,255,255,0.08)_1px,_transparent_1px,_transparent_3px)]" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/40 via-fuchsia-500/40 to-cyan-400/40 mix-blend-screen" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-white/50" />
            </div>
          </div>
        </div>

        {/* Right: queue + lyrics/info */}
        <div className="flex flex-col gap-6">
          {/* Queue */}
          <div className="rounded-3xl border border-white/10 bg-zinc-900/70 backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.9)] overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <ListMusic className="h-4 w-4" />
                Up Next
              </div>
              <span className="text-xs text-zinc-400">{mockQueue.length} songs</span>
            </div>
            <ScrollArea className="max-h-[260px]">
              <ul className="divide-y divide-zinc-800/80">
                {mockQueue.map((track) => {
                  const isActive = track.id === activeId
                  return (
                    <li
                      key={track.id}
                      className={cn(
                        "flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors",
                        isActive ? "bg-zinc-800/80" : "hover:bg-zinc-900/80",
                      )}
                      onClick={() => setActiveId(track.id)}
                    >
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700"
                      >
                        {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </button>
                      <div className="relative h-11 w-11 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={track.image} alt={track.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{track.title}</p>
                        <p className="text-xs text-zinc-400 truncate">{track.artist}</p>
                      </div>
                      <span className="text-xs text-zinc-400 ml-3">{track.duration}</span>
                    </li>
                  )
                })}
              </ul>
            </ScrollArea>
          </div>

          {/* Lyrics / Info */}
          <div className="rounded-3xl border border-white/10 bg-zinc-900/70 backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.9)] overflow-hidden flex-1 min-h-[220px]">
            <Tabs defaultValue="lyrics" className="h-full flex flex-col">
              <div className="border-b border-white/5 px-4 pt-3">
                <TabsList className="bg-transparent h-10">
                  <TabsTrigger value="lyrics" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
                    <Mic2 className="h-4 w-4 mr-2" />
                    Lyrics
                  </TabsTrigger>
                  <TabsTrigger value="info" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
                    <Info className="h-4 w-4 mr-2" />
                    Info
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1">
                <TabsContent value="lyrics" className="h-full m-0">
                  <ScrollArea className="h-[220px] xl:h-[240px] px-5 py-4">
                    <div className="space-y-3 text-sm leading-relaxed text-zinc-200">
                      <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-2">Live Lyrics (mock)</p>
                      <p>Floating on a Solana sunrise,</p>
                      <p>Waves of sound in a purple sky.</p>
                      <p>Every token is a memory,</p>
                      <p>Every beat a piece of you and I.</p>
                      <p className="pt-2 text-zinc-400">[...]</p>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="info" className="h-full m-0">
                  <ScrollArea className="h-[220px] xl:h-[240px] px-5 py-4">
                    <div className="space-y-3 text-sm text-zinc-200">
                      <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-2">Track Details</p>
                      <p>
                        <span className="text-zinc-400">Title:</span> {activeTrack.title}
                      </p>
                      <p>
                        <span className="text-zinc-400">Artist:</span> {activeTrack.artist}
                      </p>
                      <p>
                        <span className="text-zinc-400">Duration:</span> {activeTrack.duration}
                      </p>
                      <p className="text-zinc-400 pt-2">
                        This is a mock info panel. You can later wire it to on-chain metadata, royalties data, or
                        streaming stats from your providers.
                      </p>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Glassmorphic player at bottom, reusing activeTrack */}
      {activeTrack && (
        <ApplePlayer
          audioUrl={activeTrack.audioUrl}
          title={activeTrack.title}
          artist={activeTrack.artist}
          coverImage={activeTrack.image}
        />
      )}
      </div>
    </MusicAppLayout>
  )
}
