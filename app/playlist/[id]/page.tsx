"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { MusicAppLayout } from "@/components/music-app-layout"
import { ApplePlayer } from "@/components/apple-player"
import { SpotifyPlayer } from "@/components/spotify-player"
import { YouTubePlayer } from "@/components/youtube-player"
import { TidalPlayer } from "@/components/tidal-player"
import { SoundCloudPlayer } from "@/components/soundcloud-player"
import { ProviderSelector } from "@/components/provider-selector"
import { LibraryList } from "@/components/library-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { usePlaylists, type Playlist } from "@/contexts/playlist-context"
import { Play, Shuffle, Edit, Check, X, Clock, Upload } from "lucide-react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { MusicProvider, Track } from "@/types/music-providers"

export default function PlaylistPage() {
  const params = useParams()
  const playlistId = params.id as string
  const { playlists, updatePlaylistDescription, renamePlaylist, updatePlaylistCover, selectedProvider, setSelectedProvider } = usePlaylists()

  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [coverImage, setCoverImage] = useState<string | null>(null)

  useEffect(() => {
    const foundPlaylist = playlists.find((p) => p.id === playlistId)
    if (foundPlaylist) {
      setPlaylist(foundPlaylist)
      setEditName(foundPlaylist.name)
      setEditDescription(foundPlaylist.description || "")
      setCoverImage(foundPlaylist.coverImage || null)
    }
  }, [playlistId, playlists])

  const togglePlay = (id: string) => {
    if (currentlyPlaying === id) {
      setCurrentlyPlaying(null)
    } else {
      setCurrentlyPlaying(id)
    }
  }

  const handleSaveName = () => {
    if (editName.trim() && playlist) {
      renamePlaylist(playlist.id, editName)
      setIsEditingName(false)
    }
  }

  const handleSaveDescription = () => {
    if (playlist) {
      updatePlaylistDescription(playlist.id, editDescription)
      setIsEditingDescription(false)
    }
  }

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && playlist) {
      const url = URL.createObjectURL(file)
      updatePlaylistCover(playlist.id, url)
      setCoverImage(url)
    }
  }

  // Get currently playing track
  const currentTrack =
    currentlyPlaying && playlist ? playlist.tracks.find((item) => item.id === currentlyPlaying) : null

  const renderPlayer = () => {
    if (!currentTrack) return null

    switch (currentTrack.provider) {
      case 'spotify':
        return <SpotifyPlayer track={currentTrack} />
      case 'youtube':
        return <YouTubePlayer track={currentTrack} />
      case 'tidal':
        return <TidalPlayer track={currentTrack} />
      case 'soundcloud':
        return <SoundCloudPlayer track={currentTrack} />
      case 'apple':
      default:
        return (
          <ApplePlayer
            audioUrl={currentTrack.audioUrl || ""}
            title={currentTrack.title}
            artist={currentTrack.artist}
            coverImage={currentTrack.coverImage || ""}
          />
        )
    }
  }

  if (!playlist) {
    return (
      <MusicAppLayout>
        <div className="flex items-center justify-center h-full">
          <p>Playlist not found</p>
        </div>
      </MusicAppLayout>
    )
  }

  return (
    <MusicAppLayout>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Provider Selector */}
            <div className="mb-6">
              <ProviderSelector
                currentProvider={selectedProvider}
                onProviderChange={setSelectedProvider}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-8 mb-8">
              {/* Playlist cover */}
              <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0 group">
                <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
                  {coverImage ? (
                    <Image src={coverImage || "/placeholder.svg"} alt={playlist.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                      <div className="text-6xl text-zinc-600 font-bold">{playlist.name.charAt(0)}</div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label htmlFor="cover-upload" className="cursor-pointer">
                      <Button variant="outline" className="bg-zinc-800/80 border-zinc-700">
                        <Upload className="h-4 w-4 mr-2" />
                        Change Cover
                      </Button>
                      <input
                        id="cover-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverUpload}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Playlist info */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="text-xs uppercase font-semibold text-zinc-400 mb-1">
                    {playlist.isSmartPlaylist ? "Smart Playlist" : "Playlist"}
                  </div>

                  {isEditingName ? (
                    <div className="flex items-center gap-2 mb-2">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="text-3xl font-bold h-auto py-1 bg-zinc-800/50 border-zinc-700"
                        autoFocus
                      />
                      <Button size="icon" className="h-8 w-8" onClick={handleSaveName}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditingName(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                      {playlist.name}
                      {!playlist.isSmartPlaylist && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-50 hover:opacity-100"
                          onClick={() => setIsEditingName(true)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </h1>
                  )}

                  {isEditingDescription ? (
                    <div className="flex items-start gap-2 mb-4">
                      <Textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="bg-zinc-800/50 border-zinc-700"
                        rows={3}
                        autoFocus
                      />
                      <div className="flex flex-col gap-2">
                        <Button size="icon" className="h-8 w-8" onClick={handleSaveDescription}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setIsEditingDescription(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-zinc-400 mb-4 flex items-center gap-2">
                      {playlist.description || "No description"}
                      {!playlist.isSmartPlaylist && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-50 hover:opacity-100"
                          onClick={() => setIsEditingDescription(true)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                    </p>
                  )}

                  <div className="text-sm text-zinc-500">
                    {playlist.tracks.length} {playlist.tracks.length === 1 ? "song" : "songs"} • Updated{" "}
                    {formatDistanceToNow(new Date(playlist.updatedAt), { addSuffix: true })}
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-6">
                  <Button className="gap-2 bg-white text-black hover:bg-white/90 hover:text-black">
                    <Play className="h-4 w-4" />
                    Play
                  </Button>
                  <Button variant="outline" className="gap-2 bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700">
                    <Shuffle className="h-4 w-4" />
                    Shuffle
                  </Button>
                </div>
              </div>
            </div>

            {/* Playlist tracks */}
            {playlist.tracks.length > 0 ? (
              <LibraryList
                tracks={playlist.tracks.map((track) => ({
                  ...track,
                  plays: 0,
                  genre: "",
                  created: new Date().toISOString(),
                  isVerified: false,
                  image: track.coverImage || "",
                  audioUrl: track.audioUrl || "",
                }))}
                currentlyPlayingId={currentlyPlaying}
                onPlayToggle={togglePlay}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Clock className="h-16 w-16 text-zinc-700 mb-4" />
                <h3 className="text-xl font-semibold mb-2">This playlist is empty</h3>
                <p className="text-zinc-400 max-w-md">
                  {playlist.isSmartPlaylist
                    ? "This smart playlist will automatically fill with tracks that match its rules."
                    : "Add songs to this playlist by dragging them here or using the 'Add to Playlist' option."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic player based on provider */}
        {renderPlayer()}
      </div>
    </MusicAppLayout>
  )
}