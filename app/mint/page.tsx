"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Upload, FileMusic, Music } from "lucide-react"
import Image from "next/image"
import MusicAppLayout from "@/components/music-app-layout"

export default function MintPage() {
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [royaltyPercentage, setRoyaltyPercentage] = useState([5])

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real app, we'd upload this to storage
      const url = URL.createObjectURL(file)
      setCoverImage(url)
    }
  }

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAudioFile(file)
    }
  }

  return (
    <MusicAppLayout>
      <div className="p-8">
        <h1 className="text-3xl font-heading font-bold mb-8">Mint Your Music NFT</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Upload Files</CardTitle>
                <CardDescription>Choose your audio file and cover art</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="audio-file">Audio File</Label>
                  <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center cursor-pointer hover:bg-zinc-800/50 transition-colors">
                    <input
                      id="audio-file"
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={handleAudioUpload}
                    />
                    <label htmlFor="audio-file" className="cursor-pointer flex flex-col items-center gap-2">
                      <Music className="h-8 w-8 text-purple-500" />
                      <span className="text-sm text-zinc-400">
                        {audioFile ? audioFile.name : "Click to upload your audio file"}
                      </span>
                      <span className="text-xs text-zinc-500">Supports MP3, WAV, FLAC (Max 50MB)</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cover-image">Cover Image</Label>
                  <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center cursor-pointer hover:bg-zinc-800/50 transition-colors">
                    <input
                      id="cover-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverUpload}
                    />
                    <label htmlFor="cover-image" className="cursor-pointer">
                      {coverImage ? (
                        <div className="relative h-40 mx-auto">
                          <Image
                            src={coverImage || "/placeholder.svg"}
                            alt="Cover preview"
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <FileMusic className="h-8 w-8 text-purple-500" />
                          <span className="text-sm text-zinc-400">Click to upload cover image</span>
                          <span className="text-xs text-zinc-500">
                            Supports JPG, PNG, WebP (Square images recommended)
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>NFT Details</CardTitle>
                <CardDescription>Set information about your music NFT</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Enter track title" className="bg-zinc-800 border-zinc-700" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your track, story behind it, etc."
                    rows={4}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="royalty">Royalty Percentage</Label>
                    <span className="text-sm text-zinc-400">{royaltyPercentage}%</span>
                  </div>
                  <Slider
                    id="royalty"
                    min={0}
                    max={15}
                    step={0.5}
                    value={royaltyPercentage}
                    onValueChange={setRoyaltyPercentage}
                  />
                  <p className="text-xs text-zinc-500">
                    You'll receive this percentage of sales when your NFT is resold on marketplaces.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full gap-2 bg-white text-black hover:bg-white/90 hover:text-black">
                  <Upload className="h-4 w-4" />
                  Mint NFT
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MusicAppLayout>
  )
}
