"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { MusicProvider, Track } from "@/types/music-providers"

export type PlaylistTrack = Track

export type Playlist = {
  id: string
  name: string
  tracks: PlaylistTrack[]
  createdAt: Date
  updatedAt: Date
  description?: string
  coverImage?: string
  isSmartPlaylist?: boolean
  smartPlaylistRules?: {
    type: "genre" | "artist" | "recent" | "mostPlayed"
    value: string
  }[]
}

type PlaylistContextType = {
  playlists: Playlist[]
  activePlaylist: Playlist | null
  selectedProvider: MusicProvider
  currentTrack: Track | null
  createPlaylist: (name: string, description?: string) => void
  deletePlaylist: (id: string) => void
  renamePlaylist: (id: string, name: string) => void
  updatePlaylistDescription: (id: string, description: string) => void
  updatePlaylistCover: (id: string, coverImage: string) => void
  addTrackToPlaylist: (playlistId: string, track: PlaylistTrack) => void
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void
  setActivePlaylist: (id: string | null) => void
  setSelectedProvider: (provider: MusicProvider) => void
  setCurrentTrack: (track: Track | null) => void
  createSmartPlaylist: (
    name: string,
    rules: { type: "genre" | "artist" | "recent" | "mostPlayed"; value: string }[],
  ) => void
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined)

export function PlaylistProvider({ children }: { children: ReactNode }) {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<MusicProvider>('apple')
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)

  // Load playlists from localStorage on initial render
  useEffect(() => {
    const savedPlaylists = localStorage.getItem("subterrain-playlists")
    if (savedPlaylists) {
      try {
        const parsedPlaylists = JSON.parse(savedPlaylists)
        // Convert string dates back to Date objects
        parsedPlaylists.forEach((playlist: any) => {
          playlist.createdAt = new Date(playlist.createdAt)
          playlist.updatedAt = new Date(playlist.updatedAt)
        })
        setPlaylists(parsedPlaylists)
      } catch (error) {
        console.error("Failed to parse saved playlists:", error)
      }
    } else {
      // Create default playlists if none exist
      const defaultPlaylists: Playlist[] = [
        {
          id: "default",
          name: "My First Playlist",
          tracks: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          description: "My collection of favorite tracks",
        },
        {
          id: "favorites-mix",
          name: "Favorites Mix",
          description: "Based on your listening history",
          coverImage: "/abstract-purple-music-collage.png",
          tracks: [
            {
              id: "1",
              title: "Solana Sunrise",
              artist: "You",
              duration: 252,
              provider: 'apple',
              providerId: "1",
              coverImage: "/abstract-music-visualizer-purple.png",
            },
            {
              id: "2",
              title: "Crypto Beats",
              artist: "BlockchainDJ",
              duration: 225,
              provider: 'apple',
              providerId: "2",
              coverImage: "/electronic-purple-album-cover.png",
            },
            {
              id: "3",
              title: "Metaverse Melodies",
              artist: "Virtual Vibes",
              duration: 260,
              provider: 'apple',
              providerId: "3",
              coverImage: "/futuristic-colorful-album-cover.png",
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "discover-mix",
          name: "Discover Mix",
          description: "New artists we think you'll like",
          coverImage: "/colorful-abstract-music-collage.png",
          tracks: [
            {
              id: "4",
              title: "Decentralized Dreams",
              artist: "Web3 Wizard",
              duration: 375,
              provider: 'apple',
              providerId: "4",
              coverImage: "/abstract-digital-dream-album-cover.png",
            },
            {
              id: "5",
              title: "NFT Nights",
              artist: "TokenTunes",
              duration: 215,
              provider: 'apple',
              providerId: "5",
              coverImage: "/night-city-neon-album-cover.png",
            },
            {
              id: "6",
              title: "Digital Dreamer",
              artist: "Pixel Pioneers",
              duration: 305,
              provider: 'apple',
              providerId: "6",
              coverImage: "/dreamy-pixel-album-cover.png",
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "chill-mix",
          name: "Chill Mix",
          description: "Relaxing music for your downtime",
          coverImage: "/blue-purple-ambient-collage.png",
          tracks: [
            {
              id: "7",
              title: "Solana Sunset",
              artist: "Blockchain Beats",
              duration: 330,
              provider: 'apple',
              providerId: "7",
              coverImage: "/placeholder-4wff0.png",
            },
            {
              id: "8",
              title: "Token Tunes",
              artist: "Crypto Composer",
              duration: 210,
              provider: 'apple',
              providerId: "8",
              coverImage: "/placeholder-t1xso.png",
            },
            {
              id: "9",
              title: "Solana Soul",
              artist: "Web3 Wizard",
              duration: 285,
              provider: 'apple',
              providerId: "9",
              coverImage: "/album-cover-soul-warm.png",
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "recently-added",
          name: "Recently Added",
          tracks: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          description: "Tracks added in the last 30 days",
          isSmartPlaylist: true,
          smartPlaylistRules: [{ type: "recent", value: "30" }],
        },
        {
          id: "most-played",
          name: "Most Played",
          tracks: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          description: "Your most frequently played tracks",
          isSmartPlaylist: true,
          smartPlaylistRules: [{ type: "mostPlayed", value: "25" }],
        },
      ]
      setPlaylists(defaultPlaylists)
    }
  }, [])

  // Save playlists to localStorage whenever they change
  useEffect(() => {
    if (playlists.length > 0) {
      localStorage.setItem("subterrain-playlists", JSON.stringify(playlists))
    }
  }, [playlists])

  const createPlaylist = (name: string, description?: string) => {
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name,
      description,
      tracks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setPlaylists([...playlists, newPlaylist])
  }

  const deletePlaylist = (id: string) => {
    // Don't allow deletion of smart playlists
    const playlist = playlists.find((p) => p.id === id)
    if (playlist?.isSmartPlaylist) return

    setPlaylists(playlists.filter((playlist) => playlist.id !== id))
    if (activePlaylist?.id === id) {
      setActivePlaylist(null)
    }
  }

  const renamePlaylist = (id: string, name: string) => {
    setPlaylists(
      playlists.map((playlist) =>
        playlist.id === id
          ? {
              ...playlist,
              name,
              updatedAt: new Date(),
            }
          : playlist,
      ),
    )
  }

  const updatePlaylistDescription = (id: string, description: string) => {
    setPlaylists(
      playlists.map((playlist) =>
        playlist.id === id
          ? {
              ...playlist,
              description,
              updatedAt: new Date(),
            }
          : playlist,
      ),
    )
  }

  const updatePlaylistCover = (id: string, coverImage: string) => {
    setPlaylists(
      playlists.map((playlist) =>
        playlist.id === id
          ? {
              ...playlist,
              coverImage,
              updatedAt: new Date(),
            }
          : playlist,
      ),
    )
  }

  const addTrackToPlaylist = (playlistId: string, track: PlaylistTrack) => {
    setPlaylists(
      playlists.map((playlist) => {
        if (playlist.id === playlistId) {
          // Check if track already exists in playlist
          const trackExists = playlist.tracks.some((t) => t.id === track.id)
          if (trackExists) {
            return playlist
          }

          return {
            ...playlist,
            tracks: [...playlist.tracks, track],
            updatedAt: new Date(),
          }
        }
        return playlist
      }),
    )
  }

  const removeTrackFromPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists(
      playlists.map((playlist) => {
        if (playlist.id === playlistId) {
          return {
            ...playlist,
            tracks: playlist.tracks.filter((track) => track.id !== trackId),
            updatedAt: new Date(),
          }
        }
        return playlist
      }),
    )
  }

  const setActivePlaylistById = (id: string | null) => {
    if (id === null) {
      setActivePlaylist(null)
      return
    }

    const playlist = playlists.find((p) => p.id === id) || null
    setActivePlaylist(playlist)
  }

  const createSmartPlaylist = (
    name: string,
    rules: { type: "genre" | "artist" | "recent" | "mostPlayed"; value: string }[],
  ) => {
    const newPlaylist: Playlist = {
      id: `smart-playlist-${Date.now()}`,
      name,
      tracks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      description: `Smart playlist: ${name}`,
      isSmartPlaylist: true,
      smartPlaylistRules: rules,
    }
    setPlaylists([...playlists, newPlaylist])
  }

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        activePlaylist,
        selectedProvider,
        currentTrack,
        createPlaylist,
        deletePlaylist,
        renamePlaylist,
        updatePlaylistDescription,
        updatePlaylistCover,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        setActivePlaylist: setActivePlaylistById,
        setSelectedProvider,
        setCurrentTrack,
        createSmartPlaylist,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  )
}

export function usePlaylists() {
  const context = useContext(PlaylistContext)
  if (context === undefined) {
    throw new Error("usePlaylists must be used within a PlaylistProvider")
  }
  return context
}