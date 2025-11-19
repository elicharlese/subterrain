"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { MusicAppLayout } from "@/components/music-app-layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ApplePlayer } from "@/components/apple-player"
import { VinylRecord } from "@/components/vinyl-record"
import { CommentList } from "@/components/comments/comment-list"
import { ShareButton } from "@/components/sharing/share-button"
import { MessageButton } from "@/components/messaging/message-button"
import { Heart, Play, Pause, Clock, Music, Tag, BarChart3, BadgeCheck } from "lucide-react"
import Link from "next/link"

// Mock data for NFT details
const nftData = {
  id: 1,
  title: "Crypto Beats Vol. 1",
  artist: "DJ Blockchain",
  artistId: "user1",
  artistUsername: "djblockchain",
  artistAvatar: "/placeholder-j5so9.png",
  image: "/electronic-purple-album-cover.png",
  duration: "3:45",
  price: "0.5 SOL",
  isVerified: true,
  genre: "Electronic",
  likes: 1243,
  plays: 8765,
  releaseDate: "2023-12-15",
  audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  description:
    "Crypto Beats Vol. 1 is a groundbreaking electronic track that fuses cutting-edge sound design with blockchain-inspired rhythms. This NFT includes exclusive ownership rights and access to stems for remixing.",
  edition: "1 of 100",
  blockchain: "Solana",
  contract: "8xh3gFPJF5SWm2qhCbKHJrnNJk9BBmLiSuP2LJU7QjBc",
  tokenId: "42",
  royalties: "10%",
  history: [
    {
      event: "Minted",
      date: "2023-12-15",
      by: "DJ Blockchain",
      price: "-",
    },
    {
      event: "Listed",
      date: "2023-12-16",
      by: "DJ Blockchain",
      price: "0.5 SOL",
    },
  ],
}

export default function NFTDetailPage() {
  const params = useParams()
  const nftId = params.id as string
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleLike = () => {
    setIsLiked(!isLiked)
  }

  return (
    <MusicAppLayout>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* NFT Image and Vinyl */}
              <div className="relative aspect-square">
                <div className="relative w-full h-full">
                  <VinylRecord coverImage={nftData.image} isPlaying={isPlaying} onPlayPause={togglePlay} />
                </div>
              </div>

              {/* NFT Details */}
              <div className="flex flex-col">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs font-medium">
                      NFT
                    </Badge>
                    <Badge variant="outline" className="text-xs font-medium">
                      {nftData.genre}
                    </Badge>
                    <Badge variant="outline" className="text-xs font-medium">
                      {nftData.edition}
                    </Badge>
                  </div>
                  <h1 className="text-3xl font-bold mb-1">{nftData.title}</h1>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/profile/${nftData.artistUsername}`}
                      className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {nftData.artist}
                    </Link>
                    {nftData.isVerified && <BadgeCheck className="h-4 w-4 text-primary" />}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Price</span>
                    <span className="text-lg font-bold">{nftData.price}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Duration</span>
                    <span className="text-lg font-medium">{nftData.duration}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Plays</span>
                    <span className="text-lg font-medium">{nftData.plays.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Likes</span>
                    <span className="text-lg font-medium">{nftData.likes.toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">{nftData.description}</p>

                <div className="flex flex-wrap gap-3 mb-6">
                  <Button className="gap-2" onClick={togglePlay}>
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={toggleLike}>
                    <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                    {isLiked ? "Liked" : "Like"}
                  </Button>
                  <ShareButton
                    item={{
                      id: nftId,
                      type: "nft",
                      title: nftData.title,
                      artist: nftData.artist,
                      image: nftData.image,
                      url: `https://subterrain.io/discover/${nftId}`,
                    }}
                    variant="outline"
                  />
                  <MessageButton
                    userId={nftData.artistId}
                    userName={nftData.artist}
                    userUsername={nftData.artistUsername}
                    userAvatar={nftData.artistAvatar}
                    variant="outline"
                  />
                </div>

                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mb-2">
                  Buy Now for {nftData.price}
                </Button>
                <Button variant="outline" className="w-full">
                  Make Offer
                </Button>
              </div>
            </div>

            {/* Tabs for additional information */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">NFT Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Music className="h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground">Genre:</span>
                        <span>{nftData.genre}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground">Release Date:</span>
                        <span>{nftData.releaseDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag className="h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground">Edition:</span>
                        <span>{nftData.edition}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground">Royalties:</span>
                        <span>{nftData.royalties}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Blockchain Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground">Blockchain:</span>
                        <span>{nftData.blockchain}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground">Contract:</span>
                        <span className="truncate">{nftData.contract}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground">Token ID:</span>
                        <span>{nftData.tokenId}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="history" className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-4 text-left">Event</th>
                        <th className="py-2 px-4 text-left">Date</th>
                        <th className="py-2 px-4 text-left">By</th>
                        <th className="py-2 px-4 text-left">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nftData.history.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 px-4">{item.event}</td>
                          <td className="py-2 px-4">{item.date}</td>
                          <td className="py-2 px-4">{item.by}</td>
                          <td className="py-2 px-4">{item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              <TabsContent value="comments" className="mt-6">
                <CommentList itemId={nftId} itemType="nft" />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Apple Music style player */}
        {isPlaying && (
          <ApplePlayer
            audioUrl={nftData.audioUrl}
            title={nftData.title}
            artist={nftData.artist}
            coverImage={nftData.image}
          />
        )}
      </div>
    </MusicAppLayout>
  )
}
