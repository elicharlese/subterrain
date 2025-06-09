import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Heart } from "lucide-react"

export function RecentReleases() {
  const releases = [
    {
      id: 1,
      title: "Digital Dreams",
      artist: "CryptoBeats",
      image: "/placeholder.svg?height=400&width=400&query=album+cover+electronic+purple+abstract",
      plays: "24.5K",
      likes: "4.3K",
    },
    {
      id: 2,
      title: "Blockchain Blues",
      artist: "Satoshi Sound",
      image: "/placeholder.svg?height=400&width=400&query=album+cover+jazz+dark+blue+moody",
      plays: "18.2K",
      likes: "3.1K",
    },
    {
      id: 3,
      title: "Metaverse Melodies",
      artist: "Virtual Vibes",
      image: "/placeholder.svg?height=400&width=400&query=album+cover+futuristic+vibrant+pink",
      plays: "32.7K",
      likes: "5.8K",
    },
    {
      id: 4,
      title: "NFT Nights",
      artist: "Token Tracks",
      image: "/placeholder.svg?height=400&width=400&query=album+cover+night+city+neon+purple",
      plays: "15.3K",
      likes: "2.7K",
    },
  ]

  return (
    <section className="py-24 bg-zinc-900">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Recent Releases</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {releases.map((release) => (
            <Card
              key={release.id}
              className="bg-zinc-800/50 border-zinc-700 overflow-hidden hover:shadow-lg hover:shadow-purple-500/10 transition-all group"
            >
              <div className="relative aspect-square">
                <Image
                  src={release.image || "/placeholder.svg"}
                  alt={release.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-purple-600 flex items-center justify-center cursor-pointer">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg truncate">{release.title}</h3>
                <p className="text-zinc-400 mb-3">{release.artist}</p>
                <div className="flex justify-between text-sm text-zinc-500">
                  <div className="flex items-center gap-1">
                    <Play className="h-4 w-4" />
                    <span>{release.plays}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{release.likes}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
